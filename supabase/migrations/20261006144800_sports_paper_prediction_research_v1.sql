-- Misfit Sports Prediction Intelligence V1 — prospective paper evidence lane
-- Depends on 20261006011500_sports_prediction_intelligence_v1.sql.
-- Research only. No wagers, account actions, deposits, withdrawals, or money movement.

create table if not exists sports_private.paper_models_v1 (
  model_version text primary key,
  status text not null check (status in ('RESEARCH_SHADOW_ONLY','RETIRED')),
  methodology text not null,
  yes_threshold numeric not null check (yes_threshold>0.5 and yes_threshold<1),
  no_threshold numeric not null check (no_threshold>0 and no_threshold<0.5),
  minimum_volume numeric not null default 100 check (minimum_volume>=0),
  minimum_minutes_to_close integer not null default 20 check (minimum_minutes_to_close>=0),
  started_at timestamptz not null,
  execution_authority boolean not null default false check (execution_authority=false),
  wager_authority boolean not null default false check (wager_authority=false),
  money_movement_allowed boolean not null default false check (money_movement_allowed=false),
  created_at timestamptz not null default now()
);

create table if not exists sports_private.paper_predictions_v1 (
  id uuid primary key default gen_random_uuid(),
  model_version text not null references sports_private.paper_models_v1(model_version) on delete restrict,
  provider text not null check (provider in ('polymarket','kalshi')),
  market_id text not null,
  event_id text,
  league text,
  market_type text,
  title text not null,
  prediction_side text not null check (prediction_side in ('YES','NO')),
  reference_yes_probability numeric not null check (reference_yes_probability>0 and reference_yes_probability<1),
  virtual_entry_price numeric not null check (virtual_entry_price>0 and virtual_entry_price<1),
  virtual_units numeric not null default 1 check (virtual_units=1),
  reference_volume numeric not null default 0,
  reference_spread numeric,
  market_close_time timestamptz,
  prediction_created_at timestamptz not null default now(),
  gate_status text not null default 'not_requested' check (gate_status in ('not_requested','queued','complete','error')),
  gate_request_id bigint unique,
  gate_requested_at timestamptz,
  ghosbc_final_decision text,
  castle_gate_decision text,
  gate_response jsonb,
  gate_error text,
  settlement_status text not null default 'pending' check (settlement_status in ('pending','settled','unavailable')),
  settled_yes boolean,
  prediction_correct boolean,
  brier_score numeric,
  virtual_pnl_units numeric,
  scored_at timestamptz,
  research_only boolean not null default true check (research_only=true),
  wager_placed boolean not null default false check (wager_placed=false),
  execution_authority boolean not null default false check (execution_authority=false),
  money_moved boolean not null default false check (money_moved=false),
  created_at timestamptz not null default now(),
  unique(model_version,provider,market_id)
);

create table if not exists sports_private.paper_evidence_gate_v1 (
  model_version text primary key references sports_private.paper_models_v1(model_version) on delete restrict,
  status text not null check (status in ('COLLECTING','HOLD_INSUFFICIENT_EDGE','V2_RESEARCH_CANDIDATE')),
  minimum_settled integer not null default 100 check (minimum_settled>=100),
  minimum_distinct_leagues integer not null default 2 check (minimum_distinct_leagues>=1),
  settled_predictions integer not null default 0,
  distinct_leagues integer not null default 0,
  correct_predictions integer not null default 0,
  accuracy numeric,
  accuracy_ci95_lower numeric,
  mean_brier numeric,
  virtual_pnl_units numeric not null default 0,
  mean_virtual_pnl_units numeric,
  virtual_pnl_ci95_lower_units numeric,
  gate_errors integer not null default 0,
  unmet_requirements jsonb not null default '[]'::jsonb,
  live_promotion_allowed boolean not null default false check (live_promotion_allowed=false),
  wager_authority boolean not null default false check (wager_authority=false),
  money_movement_allowed boolean not null default false check (money_movement_allowed=false),
  evaluated_at timestamptz not null default now()
);

alter table sports_private.paper_models_v1 enable row level security;
alter table sports_private.paper_predictions_v1 enable row level security;
alter table sports_private.paper_evidence_gate_v1 enable row level security;

revoke all on sports_private.paper_models_v1 from public,anon,authenticated;
revoke all on sports_private.paper_predictions_v1 from public,anon,authenticated;
revoke all on sports_private.paper_evidence_gate_v1 from public,anon,authenticated;

insert into sports_private.paper_models_v1(
  model_version,status,methodology,yes_threshold,no_threshold,
  minimum_volume,minimum_minutes_to_close,started_at
) values (
  'sports_market_paper_v1_20261006',
  'RESEARCH_SHADOW_ONLY',
  'Prospective paper-only favorite-side calibration baseline. Use current public market probability: YES when >=0.55, NO when <=0.45; require volume >=100 and at least 20 minutes to close. One virtual unit only. GHOSBC/Castle Gate reviews the act of recording the paper prediction. No wager execution or account actions.',
  0.55,0.45,100,20,'2026-10-06T14:42:00.821452+00:00'::timestamptz
)
on conflict(model_version) do nothing;

CREATE OR REPLACE FUNCTION sports_private.enqueue_paper_gate_v1(p_limit integer DEFAULT 20)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  p record;
  v_internal_key text;
  v_request_id bigint;
  v_n integer:=0;
begin
  select decrypted_secret into v_internal_key
  from vault.decrypted_secrets
  where name='GHOSBC_COGNITIVE_V1_INTERNAL_KEY'
  limit 1;

  if v_internal_key is null or length(v_internal_key)<32 then
    raise exception 'GHOSBC_COGNITIVE_V1_INTERNAL_KEY unavailable';
  end if;

  for p in
    select *
    from sports_private.paper_predictions_v1
    where gate_status='not_requested'
    order by prediction_created_at asc
    limit greatest(1,least(coalesce(p_limit,20),40))
  loop
    select net.http_post(
      url:='https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-process-signal',
      headers:=jsonb_build_object(
        'Content-Type','application/json',
        'x-ghosbc-internal-key',v_internal_key
      ),
      body:=jsonb_build_object(
        'mode','cognitive_v1',
        'run_id','sports_paper_'||replace(p.id::text,'-',''),
        'engine_id','misfit_sports_prediction_intelligence_v1',
        'objective','Safety-review recording a paper-only sports prediction. Do not place any wager, do not move money, do not modify any betting account, and do not execute any external transaction.',
        'situation',format(
          'Research-only %s market %s. Paper model labeled %s at reference YES probability %s with one virtual unit. This is calibration evidence only.',
          p.provider,p.market_id,p.prediction_side,round(p.reference_yes_probability,4)
        ),
        'channel','internal',
        'candidate_plans',jsonb_build_array(
          jsonb_build_object(
            'plan_id','sports_paper_prediction',
            'action',format(
              'Record a paper-only %s prediction for %s. No wager, no account action, no money movement.',
              p.prediction_side,p.title
            ),
            'rationale','Prospective calibration of public prediction-market probabilities. No claim of betting edge.',
            'expected_outcome','Store internal research evidence only.'
          )
        ),
        'context',jsonb_build_object(
          'product_lane','misfit_sports_prediction_intelligence_v1',
          'evidence_confidence',greatest(0::numeric,least(1::numeric,abs(p.reference_yes_probability-0.5)*2)),
          'authorization_granted',false,
          'human_review_available',true,
          'critical_domain',false,
          'observation_only',true,
          'wager_execution_allowed',false,
          'money_moved',false,
          'max_cycles',3
        )
      ),
      timeout_milliseconds:=10000
    ) into v_request_id;

    update sports_private.paper_predictions_v1
    set gate_status='queued',gate_request_id=v_request_id,gate_requested_at=now()
    where id=p.id;

    v_n:=v_n+1;
  end loop;

  return jsonb_build_object(
    'ok',true,'queued',v_n,'research_only',true,
    'wager_execution_allowed',false,'money_moved',false,'as_of',now()
  );
end
$function$


CREATE OR REPLACE FUNCTION sports_private.evaluate_paper_evidence_v1()
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  m record;
  v_settled integer:=0;
  v_leagues integer:=0;
  v_correct integer:=0;
  v_accuracy numeric;
  v_acc_ci numeric;
  v_brier numeric;
  v_pnl numeric:=0;
  v_mean numeric;
  v_std numeric;
  v_pnl_ci numeric;
  v_gate_errors integer:=0;
  v_unreviewed integer:=0;
  v_status text;
  v_unmet jsonb:='[]'::jsonb;
  v_evidence jsonb;
begin
  select * into m
  from sports_private.paper_models_v1
  where status='RESEARCH_SHADOW_ONLY'
  order by created_at desc
  limit 1;

  if m.model_version is null then
    raise exception 'sports_paper_model_unavailable';
  end if;

  select
    count(*)::int,
    count(distinct coalesce(league,'unknown'))::int,
    count(*) filter(where prediction_correct)::int,
    avg((prediction_correct)::int)::numeric,
    avg(brier_score)::numeric,
    coalesce(sum(virtual_pnl_units),0),
    avg(virtual_pnl_units)::numeric,
    stddev_samp(virtual_pnl_units)::numeric,
    count(*) filter(where gate_status='error')::int,
    count(*) filter(where gate_status<>'complete')::int
  into
    v_settled,v_leagues,v_correct,v_accuracy,v_brier,v_pnl,v_mean,v_std,v_gate_errors,v_unreviewed
  from sports_private.paper_predictions_v1
  where model_version=m.model_version
    and settlement_status='settled';

  if v_settled>0 and v_accuracy is not null then
    v_acc_ci:=v_accuracy-1.96*sqrt(greatest(0,v_accuracy*(1-v_accuracy))/v_settled::numeric);
  end if;

  if v_settled>1 and v_mean is not null then
    v_pnl_ci:=v_mean-1.96*coalesce(v_std,0)/sqrt(v_settled::numeric);
  end if;

  if v_settled<100 then v_unmet:=v_unmet||jsonb_build_array('minimum_settled_100'); end if;
  if v_leagues<2 then v_unmet:=v_unmet||jsonb_build_array('minimum_distinct_leagues_2'); end if;
  if coalesce(v_pnl,0)<=0 then v_unmet:=v_unmet||jsonb_build_array('virtual_pnl_must_be_positive'); end if;
  if v_pnl_ci is null or v_pnl_ci<=0 then v_unmet:=v_unmet||jsonb_build_array('virtual_pnl_ci95_lower_must_be_positive'); end if;
  if v_acc_ci is null or v_acc_ci<=0.50 then v_unmet:=v_unmet||jsonb_build_array('accuracy_ci95_lower_must_exceed_0_50'); end if;
  if v_brier is null or v_brier>=0.25 then v_unmet:=v_unmet||jsonb_build_array('mean_brier_must_be_below_0_25'); end if;
  if v_gate_errors>0 then v_unmet:=v_unmet||jsonb_build_array('ghosbc_gate_errors_must_be_zero'); end if;
  if v_unreviewed>0 then v_unmet:=v_unmet||jsonb_build_array('all_settled_predictions_require_ghosbc_review'); end if;

  if v_settled<100 then
    v_status:='COLLECTING';
  elsif jsonb_array_length(v_unmet)=0 then
    v_status:='V2_RESEARCH_CANDIDATE';
  else
    v_status:='HOLD_INSUFFICIENT_EDGE';
  end if;

  insert into sports_private.paper_evidence_gate_v1(
    model_version,status,settled_predictions,distinct_leagues,correct_predictions,
    accuracy,accuracy_ci95_lower,mean_brier,virtual_pnl_units,mean_virtual_pnl_units,
    virtual_pnl_ci95_lower_units,gate_errors,unmet_requirements,evaluated_at
  ) values (
    m.model_version,v_status,v_settled,v_leagues,v_correct,
    v_accuracy,v_acc_ci,v_brier,v_pnl,v_mean,v_pnl_ci,v_gate_errors,v_unmet,now()
  )
  on conflict(model_version) do update set
    status=excluded.status,
    settled_predictions=excluded.settled_predictions,
    distinct_leagues=excluded.distinct_leagues,
    correct_predictions=excluded.correct_predictions,
    accuracy=excluded.accuracy,
    accuracy_ci95_lower=excluded.accuracy_ci95_lower,
    mean_brier=excluded.mean_brier,
    virtual_pnl_units=excluded.virtual_pnl_units,
    mean_virtual_pnl_units=excluded.mean_virtual_pnl_units,
    virtual_pnl_ci95_lower_units=excluded.virtual_pnl_ci95_lower_units,
    gate_errors=excluded.gate_errors,
    unmet_requirements=excluded.unmet_requirements,
    evaluated_at=excluded.evaluated_at;

  v_evidence:=jsonb_build_object(
    'status',v_status,'model_version',m.model_version,
    'settled_predictions',v_settled,'distinct_leagues',v_leagues,'correct_predictions',v_correct,
    'accuracy',round(v_accuracy,6),'accuracy_ci95_lower',round(v_acc_ci,6),
    'mean_brier',round(v_brier,6),'virtual_pnl_units',round(v_pnl,6),
    'mean_virtual_pnl_units',round(v_mean,6),'virtual_pnl_ci95_lower_units',round(v_pnl_ci,6),
    'gate_errors',v_gate_errors,'unreviewed_settled',v_unreviewed,
    'unmet_requirements',v_unmet,
    'promotion_boundary','Passing creates only a V2 research candidate. It never enables wagers, account actions, deposits, withdrawals, or money movement.',
    'wager_authority',false,'live_promotion_allowed',false,'money_moved',false,'evaluated_at',now()
  );

  return v_evidence;
end
$function$


CREATE OR REPLACE FUNCTION sports_private.generate_paper_predictions_v1(p_limit integer DEFAULT 50)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  m record;
  x record;
  v_side text;
  v_entry numeric;
  v_created integer:=0;
begin
  select * into m
  from sports_private.paper_models_v1
  where status='RESEARCH_SHADOW_ONLY'
  order by created_at desc
  limit 1;

  if m.model_version is null then
    raise exception 'sports_paper_model_unavailable';
  end if;

  for x in
    select l.*
    from sports_private.market_latest_v1 l
    where l.observed_at>=m.started_at
      and l.result_yes is null
      and l.yes_price is not null
      and l.yes_price>0 and l.yes_price<1
      and coalesce(l.volume,0)>=m.minimum_volume
      and (
        l.close_time is null
        or l.close_time>now()+make_interval(mins=>m.minimum_minutes_to_close)
      )
      and (
        l.yes_price>=m.yes_threshold
        or l.yes_price<=m.no_threshold
      )
      and not exists (
        select 1
        from sports_private.paper_predictions_v1 p
        where p.model_version=m.model_version
          and p.provider=l.provider
          and p.market_id=l.market_id
      )
    order by coalesce(l.volume,0) desc,l.observed_at desc
    limit greatest(1,least(coalesce(p_limit,50),100))
  loop
    v_side:=case when x.yes_price>=m.yes_threshold then 'YES' else 'NO' end;
    v_entry:=case when v_side='YES' then x.yes_price else 1-x.yes_price end;

    if v_entry<=0 or v_entry>=1 then
      continue;
    end if;

    insert into sports_private.paper_predictions_v1(
      model_version,provider,market_id,event_id,league,market_type,title,
      prediction_side,reference_yes_probability,virtual_entry_price,virtual_units,
      reference_volume,reference_spread,market_close_time
    ) values (
      m.model_version,x.provider,x.market_id,x.event_id,x.league,x.market_type,x.title,
      v_side,x.yes_price,v_entry,1,
      coalesce(x.volume,0),x.spread,x.close_time
    )
    on conflict(model_version,provider,market_id) do nothing;

    if found then v_created:=v_created+1; end if;
  end loop;

  return jsonb_build_object(
    'ok',true,'model_version',m.model_version,'created',v_created,
    'research_only',true,'wager_execution_allowed',false,'money_moved',false,'as_of',now()
  );
end
$function$


CREATE OR REPLACE FUNCTION sports_private.harvest_paper_gate_v1()
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  p record;
  r record;
  body jsonb;
  v_processed integer:=0;
  v_errors integer:=0;
begin
  for p in
    select *
    from sports_private.paper_predictions_v1
    where gate_status='queued' and gate_request_id is not null
    order by gate_requested_at asc
    limit 100
  loop
    select * into r
    from net._http_response
    where id=p.gate_request_id
    order by created desc
    limit 1;

    if not found then continue; end if;

    if coalesce(r.status_code,0)<200 or coalesce(r.status_code,0)>=300 or r.error_msg is not null then
      update sports_private.paper_predictions_v1
      set gate_status='error',
          gate_error=coalesce(r.error_msg,'http_'||coalesce(r.status_code::text,'unknown'))
      where id=p.id;
      v_errors:=v_errors+1;
      continue;
    end if;

    begin
      body:=r.content::jsonb;
    exception when others then
      update sports_private.paper_predictions_v1
      set gate_status='error',gate_error='invalid_json_response'
      where id=p.id;
      v_errors:=v_errors+1;
      continue;
    end;

    update sports_private.paper_predictions_v1
    set gate_status='complete',
        ghosbc_final_decision=body->>'final_decision',
        castle_gate_decision=body#>>'{castle_gate,decision}',
        gate_response=body,
        gate_error=null
    where id=p.id;

    v_processed:=v_processed+1;
  end loop;

  return jsonb_build_object(
    'ok',v_errors=0,'processed',v_processed,'errors',v_errors,
    'research_only',true,'wager_execution_allowed',false,'money_moved',false,'as_of',now()
  );
end
$function$


CREATE OR REPLACE FUNCTION sports_private.paper_prediction_report_v1()
 RETURNS jsonb
 LANGUAGE sql
 SET search_path TO ''
AS $function$
with m as (
  select * from sports_private.paper_models_v1
  where status='RESEARCH_SHADOW_ONLY'
  order by created_at desc limit 1
),
p as (
  select * from sports_private.paper_predictions_v1
  where model_version=(select model_version from m)
),
e as (
  select * from sports_private.paper_evidence_gate_v1
  where model_version=(select model_version from m)
)
select jsonb_build_object(
  'status','RESEARCH_SHADOW_ONLY',
  'model',to_jsonb(m),
  'summary',jsonb_build_object(
    'predictions',(select count(*) from p),
    'yes_predictions',(select count(*) from p where prediction_side='YES'),
    'no_predictions',(select count(*) from p where prediction_side='NO'),
    'gate_complete',(select count(*) from p where gate_status='complete'),
    'gate_errors',(select count(*) from p where gate_status='error'),
    'settled',(select count(*) from p where settlement_status='settled'),
    'pending',(select count(*) from p where settlement_status='pending'),
    'unavailable',(select count(*) from p where settlement_status='unavailable'),
    'virtual_pnl_units',round(coalesce((select sum(virtual_pnl_units) from p where settlement_status='settled'),0),6),
    'mean_brier',round((select avg(brier_score) from p where settlement_status='settled'),6)
  ),
  'evidence_gate',(select to_jsonb(e) from e),
  'recent_predictions',(
    select coalesce(jsonb_agg(jsonb_build_object(
      'provider',provider,'market_id',market_id,'league',league,'market_type',market_type,
      'title',title,'prediction_side',prediction_side,
      'reference_yes_probability',reference_yes_probability,
      'reference_volume',reference_volume,'market_close_time',market_close_time,
      'gate_status',gate_status,'ghosbc_final_decision',ghosbc_final_decision,
      'castle_gate_decision',castle_gate_decision,'settlement_status',settlement_status,
      'prediction_correct',prediction_correct,'virtual_pnl_units',virtual_pnl_units,
      'prediction_created_at',prediction_created_at
    ) order by prediction_created_at desc),'[]'::jsonb)
    from (select * from p order by prediction_created_at desc limit 20) x
  ),
  'research_only',true,'wager_execution_allowed',false,'account_actions_allowed',false,
  'money_moved',false,'generated_at',now()
)
from m;
$function$


CREATE OR REPLACE FUNCTION sports_private.run_paper_cycle_v1()
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  v_harvest jsonb;
  v_score jsonb;
  v_evidence jsonb;
  v_generate jsonb;
  v_enqueue jsonb;
begin
  v_harvest:=sports_private.harvest_paper_gate_v1();
  v_score:=sports_private.score_paper_predictions_v1();
  v_evidence:=sports_private.evaluate_paper_evidence_v1();
  v_generate:=sports_private.generate_paper_predictions_v1(20);
  v_enqueue:=sports_private.enqueue_paper_gate_v1(20);

  return jsonb_build_object(
    'ok',true,
    'harvest_gate',v_harvest,
    'score',v_score,
    'evidence',v_evidence,
    'generate',v_generate,
    'enqueue_gate',v_enqueue,
    'research_only',true,
    'wager_execution_allowed',false,
    'account_actions_allowed',false,
    'money_moved',false,
    'as_of',now()
  );
end
$function$


CREATE OR REPLACE FUNCTION sports_private.run_sports_prediction_watch_v1()
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  v_org uuid;
  v_now timestamptz:=now();
  v_pm timestamptz;
  v_ks timestamptz;
  v_stale integer:=0;
  v_queue_old integer:=0;
  v_errors integer:=0;
  v_stale_settlements integer:=0;
  v_crons integer:=0;
  v_paper_gate_old integer:=0;
  v_paper_gate_errors integer:=0;
  v_paper_predictions integer:=0;
  v_evidence record;
  v_evidence_stale boolean:=false;
  v_problem boolean:=false;
begin
  select id into v_org
  from public.organizations
  where slug='misfit-mediahouse'
  limit 1;

  select last_success_at into v_pm
  from sports_private.provider_health_v1
  where provider='polymarket';

  select last_success_at into v_ks
  from sports_private.provider_health_v1
  where provider='kalshi';

  v_stale:=(case when v_pm is null or v_now-v_pm>interval '45 minutes' then 1 else 0 end)
          +(case when v_ks is null or v_now-v_ks>interval '45 minutes' then 1 else 0 end);

  select count(*)::int into v_queue_old
  from sports_private.http_requests_v1
  where status='queued'
    and requested_at<v_now-interval '15 minutes';

  select count(*)::int into v_errors
  from sports_private.http_requests_v1
  where status='error'
    and requested_at>v_now-interval '2 hours';

  select count(*)::int into v_stale_settlements
  from sports_private.calibration_observations_v1 o
  join sports_private.market_latest_v1 l
    on l.provider=o.provider and l.market_id=o.market_id
  where o.settlement_status='pending'
    and o.close_time is not null
    and o.close_time<v_now-interval '6 hours'
    and l.observed_at<v_now-interval '45 minutes';

  select count(*)::int into v_crons
  from cron.job
  where active
    and jobname in (
      'misfit-sports-prediction-scan-v1',
      'misfit-sports-prediction-refresh-v1',
      'misfit-sports-prediction-harvest-v1',
      'misfit-sports-paper-cycle-v1'
    );

  select count(*)::int into v_paper_gate_old
  from sports_private.paper_predictions_v1
  where gate_status='queued'
    and gate_requested_at<v_now-interval '15 minutes';

  select count(*)::int into v_paper_gate_errors
  from sports_private.paper_predictions_v1
  where gate_status='error'
    and prediction_created_at>v_now-interval '2 hours';

  select count(*)::int into v_paper_predictions
  from sports_private.paper_predictions_v1;

  select * into v_evidence
  from sports_private.paper_evidence_gate_v1
  where model_version='sports_market_paper_v1_20261006'
  limit 1;

  v_evidence_stale :=
    v_evidence.model_version is null
    or v_evidence.evaluated_at is null
    or v_now-v_evidence.evaluated_at>interval '60 minutes';

  v_problem:=
    v_stale>0
    or v_queue_old>0
    or v_errors>=3
    or v_stale_settlements>25
    or v_crons<>4
    or v_paper_gate_old>0
    or v_paper_gate_errors>=3
    or v_evidence_stale;

  perform ghosbc_private.sentinel_set_watch_v1(
    v_org,
    'sports_prediction_intelligence_v1',
    v_problem,
    case when v_stale=2 or v_crons<3 or v_paper_gate_errors>=3 then 'high' else 'medium' end,
    'sports_prediction_research',
    'Misfit Sports Prediction Intelligence V1 requires attention',
    jsonb_build_object(
      'polymarket_last_success',v_pm,
      'kalshi_last_success',v_ks,
      'stale_providers',v_stale,
      'queued_older_than_15m',v_queue_old,
      'request_errors_last_2h',v_errors,
      'stale_unresolved_settlements',v_stale_settlements,
      'active_crons',v_crons,
      'paper_predictions',v_paper_predictions,
      'paper_gate_queued_older_than_15m',v_paper_gate_old,
      'paper_gate_errors_last_2h',v_paper_gate_errors,
      'paper_evidence_status',v_evidence.status,
      'paper_evidence_settled',v_evidence.settled_predictions,
      'paper_evidence_evaluated_at',v_evidence.evaluated_at,
      'paper_evidence_stale',v_evidence_stale,
      'research_only',true,
      'wager_execution_allowed',false,
      'account_actions_allowed',false,
      'money_moved',false
    ),
    'Restore public read-only provider ingestion, paper-review cadence, settlement scoring, or evidence freshness. Do not add wager execution or account-action rails.',
    false
  );

  return jsonb_build_object(
    'ok',not v_problem,
    'polymarket_last_success',v_pm,
    'kalshi_last_success',v_ks,
    'stale_providers',v_stale,
    'queued_older_than_15m',v_queue_old,
    'request_errors_last_2h',v_errors,
    'stale_unresolved_settlements',v_stale_settlements,
    'active_crons',v_crons,
    'paper_predictions',v_paper_predictions,
    'paper_gate_queued_older_than_15m',v_paper_gate_old,
    'paper_gate_errors_last_2h',v_paper_gate_errors,
    'paper_evidence_status',v_evidence.status,
    'paper_evidence_settled',v_evidence.settled_predictions,
    'paper_evidence_evaluated_at',v_evidence.evaluated_at,
    'paper_evidence_stale',v_evidence_stale,
    'research_only',true,
    'wager_execution_allowed',false,
    'money_moved',false,
    'checked_at',v_now
  );
end
$function$


CREATE OR REPLACE FUNCTION sports_private.score_paper_predictions_v1()
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  p record;
  l record;
  v_actual numeric;
  v_correct boolean;
  v_pnl numeric;
  v_scored integer:=0;
  v_unavailable integer:=0;
begin
  for p in
    select *
    from sports_private.paper_predictions_v1
    where settlement_status='pending'
    order by prediction_created_at asc
    limit 200
  loop
    select * into l
    from sports_private.market_latest_v1
    where provider=p.provider and market_id=p.market_id
    limit 1;

    if found and l.result_yes is not null then
      v_actual:=case when l.result_yes then 1 else 0 end;
      v_correct:=(p.prediction_side='YES' and l.result_yes)
              or (p.prediction_side='NO' and not l.result_yes);
      v_pnl:=case when v_correct then 1-p.virtual_entry_price else -p.virtual_entry_price end;

      update sports_private.paper_predictions_v1
      set settlement_status='settled',
          settled_yes=l.result_yes,
          prediction_correct=v_correct,
          brier_score=power(p.reference_yes_probability-v_actual,2),
          virtual_pnl_units=v_pnl,
          scored_at=now()
      where id=p.id;

      v_scored:=v_scored+1;
    elsif p.market_close_time is not null
      and p.market_close_time<now()-interval '7 days'
      and (not found or l.result_yes is null)
    then
      update sports_private.paper_predictions_v1
      set settlement_status='unavailable',scored_at=now()
      where id=p.id;
      v_unavailable:=v_unavailable+1;
    end if;
  end loop;

  return jsonb_build_object(
    'ok',true,'scored',v_scored,'unavailable',v_unavailable,
    'research_only',true,'wager_execution_allowed',false,'money_moved',false,'as_of',now()
  );
end
$function$


revoke execute on function sports_private.generate_paper_predictions_v1(integer) from public,anon,authenticated;
revoke execute on function sports_private.enqueue_paper_gate_v1(integer) from public,anon,authenticated;
revoke execute on function sports_private.harvest_paper_gate_v1() from public,anon,authenticated;
revoke execute on function sports_private.score_paper_predictions_v1() from public,anon,authenticated;
revoke execute on function sports_private.evaluate_paper_evidence_v1() from public,anon,authenticated;
revoke execute on function sports_private.paper_prediction_report_v1() from public,anon,authenticated;
revoke execute on function sports_private.run_paper_cycle_v1() from public,anon,authenticated;
revoke execute on function sports_private.run_sports_prediction_watch_v1() from public,anon,authenticated;

do $$
declare r record;
begin
  for r in select jobid from cron.job where jobname='misfit-sports-paper-cycle-v1'
  loop perform cron.unschedule(r.jobid); end loop;
end
$$;

select cron.schedule(
  'misfit-sports-paper-cycle-v1',
  '9,24,39,54 * * * *',
  'select sports_private.run_paper_cycle_v1();'
);
