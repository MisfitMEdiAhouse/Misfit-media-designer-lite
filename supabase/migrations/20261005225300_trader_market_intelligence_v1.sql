-- Misfit Trader Market Intelligence V1
-- Frozen research-shadow model selected with 60/20/20 time split.
-- No broker execution, no paper portfolio mutation, no money movement.

create schema if not exists trader_private;
revoke all on schema trader_private from public, anon, authenticated;

create table if not exists trader_private.market_intelligence_models_v1 (
  model_version text primary key,
  status text not null check (status in ('RESEARCH_SHADOW_ONLY','RETIRED')),
  architecture text not null,
  horizon_minutes integer not null check (horizon_minutes=240),
  min_segment_samples integer not null check (min_segment_samples>=1),
  trained_through timestamptz not null,
  validation_evidence jsonb not null,
  execution_authority boolean not null default false check (execution_authority=false),
  paper_trade_mutation_allowed boolean not null default false check (paper_trade_mutation_allowed=false),
  money_movement_allowed boolean not null default false check (money_movement_allowed=false),
  created_at timestamptz not null default now()
);

create table if not exists trader_private.market_intelligence_segments_v1 (
  model_version text not null references trader_private.market_intelligence_models_v1(model_version) on delete restrict,
  strategy_key text not null,
  regime_bucket text not null check (regime_bucket in ('risk_on','risk_off','neutral')),
  samples integer not null,
  win_rate numeric not null,
  avg_return_pct numeric not null,
  avg_pnl_usd numeric not null,
  total_pnl_usd numeric not null,
  research_decision text not null check (research_decision in ('RESEARCH_ALLOW','RESEARCH_HOLD')),
  created_at timestamptz not null default now(),
  primary key(model_version,strategy_key,regime_bucket)
);

create table if not exists trader_private.market_intelligence_observations_v1 (
  id uuid primary key default gen_random_uuid(),
  model_version text not null references trader_private.market_intelligence_models_v1(model_version) on delete restrict,
  source_trade_id uuid not null unique references public.misfit_trader_shadow_trades(id) on delete restrict,
  source_trade_created_at timestamptz not null,
  source_strategy_key text not null,
  symbol text not null,
  side text not null,
  source_notional_usd numeric not null,
  entry_price numeric not null,
  regime_bucket text not null check (regime_bucket in ('risk_on','risk_off','neutral')),
  segment_samples integer,
  segment_win_rate numeric,
  segment_avg_return_pct numeric,
  segment_avg_pnl_usd numeric,
  research_decision text not null check (research_decision in ('RESEARCH_ALLOW','RESEARCH_HOLD')),
  model_confidence numeric not null check (model_confidence>=0 and model_confidence<=1),
  gate_request_id bigint unique,
  gate_status text not null default 'not_requested' check (gate_status in ('not_requested','queued','complete','error')),
  ghosbc_final_decision text,
  castle_gate_decision text,
  gate_response jsonb,
  gate_error text,
  outcome_due_at timestamptz not null,
  outcome_status text not null default 'pending' check (outcome_status in ('pending','scored','unavailable')),
  outcome_price numeric,
  directional_return_pct numeric,
  raw_action_pnl_usd numeric,
  market_filtered_pnl_usd numeric,
  market_edge_usd numeric,
  governed_filtered_pnl_usd numeric,
  governed_edge_usd numeric,
  scored_at timestamptz,
  observation_only boolean not null default true check (observation_only=true),
  trade_mutation_allowed boolean not null default false check (trade_mutation_allowed=false),
  money_moved boolean not null default false check (money_moved=false),
  created_at timestamptz not null default now()
);

alter table trader_private.market_intelligence_models_v1 enable row level security;
alter table trader_private.market_intelligence_segments_v1 enable row level security;
alter table trader_private.market_intelligence_observations_v1 enable row level security;

revoke all on trader_private.market_intelligence_models_v1 from public, anon, authenticated;
revoke all on trader_private.market_intelligence_segments_v1 from public, anon, authenticated;
revoke all on trader_private.market_intelligence_observations_v1 from public, anon, authenticated;

insert into trader_private.market_intelligence_models_v1(
  model_version,status,architecture,horizon_minutes,min_segment_samples,trained_through,validation_evidence
) values (
  'market_intel_v1_20261005_4h',
  'RESEARCH_SHADOW_ONLY',
  'Frozen empirical strategy + market-regime calibration. A source paper trade is RESEARCH_ALLOW only when its strategy/regime segment has >=25 matured historical 4h outcomes and positive mean notional-weighted 4h PnL; otherwise RESEARCH_HOLD. Market model never mutates portfolios or executes orders. GHOSBC/Castle Gate remains downstream safety/governance.',
  240,25,'2026-10-05T17:50:48.627571+00:00',
  '{"selection_protocol":"60pct train / 20pct validation / 20pct untouched test by trade time","chosen_architecture":"strategy_regime","validation":{"samples":464,"raw_pnl_usd":-69.5458,"gated_pnl_usd":35.6839,"delta_usd":105.2296,"allowed_trades":233},"untouched_test":{"samples":464,"raw_pnl_usd":-154.8008,"gated_pnl_usd":-47.4313,"delta_usd":107.3695,"allowed_trades":186,"allowed_win_rate":0.2151},"conclusion":"Loss-reduction signal only; not positive-edge proof. Requires prospective shadow evidence before any execution integration."}'::jsonb
) on conflict(model_version) do nothing;

with model as (
  select * from trader_private.market_intelligence_models_v1
  where model_version='market_intel_v1_20261005_4h'
),
base as (
  select st.id as trade_id,st.created_at,st.strategy_key,
    case when s.regime ilike 'risk_on%' then 'risk_on'
         when s.regime ilike 'risk_off%' then 'risk_off' else 'neutral' end regime_bucket,
    st.notional_usd,st.price_usd entry_price,upper(st.symbol) symbol,lower(st.side) side
  from public.misfit_trader_shadow_trades st
  join public.worldforge_signal_snapshots s on s.id=st.snapshot_id
  cross join model m
  where st.created_at<=m.trained_through
),
scored as (
  select b.*,
    (case when b.side='sell' then -1 else 1 end)*((f.price/b.entry_price)-1) ret_4h,
    b.notional_usd*(case when b.side='sell' then -1 else 1 end)*((f.price/b.entry_price)-1) pnl_4h
  from base b
  join lateral (
    select nullif(e->>'price_usd','')::numeric price
    from public.worldforge_signal_snapshots s2
    cross join lateral jsonb_array_elements(s2.assets) e
    where upper(e->>'symbol')=b.symbol
      and s2.observed_at>=b.created_at+interval '240 minutes'
      and s2.observed_at<=b.created_at+interval '270 minutes'
      and nullif(e->>'price_usd','') is not null
    order by s2.observed_at asc limit 1
  ) f on true
  where b.entry_price>0
),
segments as (
  select strategy_key,regime_bucket,count(*)::int samples,
    avg((ret_4h>0)::int)::numeric win_rate,
    avg(ret_4h*100)::numeric avg_return_pct,
    avg(pnl_4h)::numeric avg_pnl_usd,
    sum(pnl_4h)::numeric total_pnl_usd
  from scored group by strategy_key,regime_bucket
)
insert into trader_private.market_intelligence_segments_v1(
  model_version,strategy_key,regime_bucket,samples,win_rate,avg_return_pct,avg_pnl_usd,total_pnl_usd,research_decision
)
select m.model_version,s.strategy_key,s.regime_bucket,s.samples,s.win_rate,s.avg_return_pct,s.avg_pnl_usd,s.total_pnl_usd,
  case when s.samples>=m.min_segment_samples and s.avg_pnl_usd>0 then 'RESEARCH_ALLOW' else 'RESEARCH_HOLD' end
from segments s cross join model m
on conflict(model_version,strategy_key,regime_bucket) do nothing;


CREATE OR REPLACE FUNCTION trader_private.enqueue_market_intelligence_v1(p_limit integer DEFAULT 8)
 RETURNS TABLE(observation_id uuid, source_trade_id uuid, request_id bigint)
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  t record;
  m record;
  seg record;
  v_internal_key text;
  v_obs_id uuid;
  v_request_id bigint;
  v_regime text;
  v_decision text;
  v_conf numeric;
begin
  select * into m
  from trader_private.market_intelligence_models_v1
  where status='RESEARCH_SHADOW_ONLY'
  order by created_at desc
  limit 1;

  if m.model_version is null then
    raise exception 'market_intelligence_model_unavailable';
  end if;

  select decrypted_secret into v_internal_key
  from vault.decrypted_secrets
  where name='GHOSBC_COGNITIVE_V1_INTERNAL_KEY'
  limit 1;

  if v_internal_key is null or length(v_internal_key)<32 then
    raise exception 'GHOSBC_COGNITIVE_V1_INTERNAL_KEY unavailable';
  end if;

  for t in
    select st.*, s.regime as source_regime
    from public.misfit_trader_shadow_trades st
    join public.worldforge_signal_snapshots s on s.id=st.snapshot_id
    where st.created_at > m.trained_through
      and not exists (
        select 1
        from trader_private.market_intelligence_observations_v1 o
        where o.source_trade_id=st.id
      )
    order by st.created_at asc
    limit greatest(1,least(coalesce(p_limit,8),10))
  loop
    v_regime := case
      when t.source_regime ilike 'risk_on%' then 'risk_on'
      when t.source_regime ilike 'risk_off%' then 'risk_off'
      else 'neutral'
    end;

    select * into seg
    from trader_private.market_intelligence_segments_v1 s
    where s.model_version=m.model_version
      and s.strategy_key=t.strategy_key
      and s.regime_bucket=v_regime
    limit 1;

    v_decision := coalesce(seg.research_decision,'RESEARCH_HOLD');
    v_conf := least(1::numeric,greatest(0::numeric,coalesce(seg.samples,0)::numeric/100.0));

    insert into trader_private.market_intelligence_observations_v1(
      model_version,source_trade_id,source_trade_created_at,source_strategy_key,
      symbol,side,source_notional_usd,entry_price,regime_bucket,
      segment_samples,segment_win_rate,segment_avg_return_pct,segment_avg_pnl_usd,
      research_decision,model_confidence,gate_status,outcome_due_at
    ) values (
      m.model_version,t.id,t.created_at,t.strategy_key,
      upper(t.symbol),lower(t.side),t.notional_usd,t.price_usd,v_regime,
      seg.samples,seg.win_rate,seg.avg_return_pct,seg.avg_pnl_usd,
      v_decision,v_conf,'queued',t.created_at+interval '240 minutes'
    )
    returning id into v_obs_id;

    select net.http_post(
      url:='https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-process-signal',
      headers:=jsonb_build_object(
        'Content-Type','application/json',
        'x-ghosbc-internal-key',v_internal_key
      ),
      body:=jsonb_build_object(
        'mode','cognitive_v1',
        'run_id','market_intel_'||replace(t.id::text,'-',''),
        'engine_id','misfit_trader_market_intelligence_v1',
        'objective','Safety-review an internal paper-only market-intelligence label. Do not place, modify, cancel, submit, or execute any trade and do not mutate any portfolio.',
        'situation',format(
          'Market Intelligence V1 labeled strategy %s / regime %s / %s %s as %s. This is observation-only research evidence and has no execution authority.',
          t.strategy_key,v_regime,upper(t.side),upper(t.symbol),v_decision
        ),
        'channel','internal',
        'candidate_plans',jsonb_build_array(
          jsonb_build_object(
            'plan_id','market_intelligence_research_label',
            'action',format(
              'Retain the %s label for paper-only observation of %s %s. Do not place or change any trade.',
              v_decision,upper(t.side),upper(t.symbol)
            ),
            'rationale',format(
              'Frozen strategy/regime segment: samples=%s win_rate=%s avg_pnl_usd=%s.',
              coalesce(seg.samples,0),
              coalesce(round(seg.win_rate,4),0),
              coalesce(round(seg.avg_pnl_usd,4),0)
            ),
            'expected_outcome','Record internal research evidence only. No financial action.'
          )
        ),
        'context',jsonb_build_object(
          'product_lane','misfit_trader_market_intelligence_v1',
          'evidence_confidence',v_conf,
          'authorization_granted',false,
          'human_review_available',true,
          'critical_domain',false,
          'observation_only',true,
          'trade_mutation_allowed',false,
          'money_moved',false,
          'max_cycles',3
        )
      ),
      timeout_milliseconds:=10000
    ) into v_request_id;

    update trader_private.market_intelligence_observations_v1
    set gate_request_id=v_request_id
    where id=v_obs_id;

    observation_id:=v_obs_id;
    source_trade_id:=t.id;
    request_id:=v_request_id;
    return next;
  end loop;
end
$function$


CREATE OR REPLACE FUNCTION trader_private.harvest_market_intelligence_gate_v1()
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  o record;
  r record;
  v_body jsonb;
  v_processed integer:=0;
  v_errors integer:=0;
begin
  for o in
    select *
    from trader_private.market_intelligence_observations_v1
    where gate_status='queued' and gate_request_id is not null
    order by created_at asc
    limit 100
  loop
    select * into r
    from net._http_response
    where id=o.gate_request_id
    order by created desc
    limit 1;

    if not found then continue; end if;

    if coalesce(r.status_code,0)<200 or coalesce(r.status_code,0)>=300 then
      update trader_private.market_intelligence_observations_v1
      set gate_status='error',
          gate_error=coalesce(r.error_msg,'http_'||coalesce(r.status_code::text,'unknown'))
      where id=o.id;
      v_errors:=v_errors+1;
      continue;
    end if;

    begin
      v_body:=r.content::jsonb;
    exception when others then
      update trader_private.market_intelligence_observations_v1
      set gate_status='error',gate_error='invalid_json_response'
      where id=o.id;
      v_errors:=v_errors+1;
      continue;
    end;

    update trader_private.market_intelligence_observations_v1
    set gate_status='complete',
        ghosbc_final_decision=v_body->>'final_decision',
        castle_gate_decision=v_body#>>'{castle_gate,decision}',
        gate_response=v_body,
        gate_error=null
    where id=o.id;
    v_processed:=v_processed+1;
  end loop;

  return jsonb_build_object(
    'ok',v_errors=0,'processed',v_processed,'errors',v_errors,
    'observation_only',true,'trade_mutation_allowed',false,'money_moved',false,'as_of',now()
  );
end
$function$


CREATE OR REPLACE FUNCTION trader_private.market_intelligence_report_v1()
 RETURNS jsonb
 LANGUAGE sql
 SET search_path TO ''
AS $function$
with active_model as (
  select *
  from trader_private.market_intelligence_models_v1
  where status='RESEARCH_SHADOW_ONLY'
  order by created_at desc limit 1
),
obs as (
  select *
  from trader_private.market_intelligence_observations_v1
  where model_version=(select model_version from active_model)
),
summary as (
  select
    count(*)::int as observations,
    count(*) filter (where research_decision='RESEARCH_ALLOW')::int as research_allow,
    count(*) filter (where research_decision='RESEARCH_HOLD')::int as research_hold,
    count(*) filter (where gate_status='complete')::int as gate_complete,
    count(*) filter (where gate_status='error')::int as gate_errors,
    count(*) filter (where outcome_status='scored')::int as scored,
    round(coalesce(sum(raw_action_pnl_usd) filter (where outcome_status='scored'),0),4) as raw_pnl,
    round(coalesce(sum(market_filtered_pnl_usd) filter (where outcome_status='scored'),0),4) as market_pnl,
    round(coalesce(sum(governed_filtered_pnl_usd) filter (where outcome_status='scored'),0),4) as governed_pnl
  from obs
),
decisions as (
  select coalesce(jsonb_object_agg(research_decision,cnt),'{}'::jsonb) rows
  from (
    select research_decision,count(*)::int cnt from obs group by research_decision
  ) x
),
gate_decisions as (
  select coalesce(jsonb_object_agg(coalesce(ghosbc_final_decision,'PENDING'),cnt),'{}'::jsonb) rows
  from (
    select ghosbc_final_decision,count(*)::int cnt from obs group by ghosbc_final_decision
  ) x
)
select jsonb_build_object(
  'status','RESEARCH_SHADOW_ONLY',
  'model',to_jsonb(active_model),
  'summary',to_jsonb(summary),
  'market_decisions',decisions.rows,
  'ghosbc_decisions',gate_decisions.rows,
  'prospective_only',true,
  'execution_authority',false,
  'trade_mutation_allowed',false,
  'money_moved',false,
  'generated_at',now()
)
from active_model,summary,decisions,gate_decisions;
$function$


CREATE OR REPLACE FUNCTION trader_private.refresh_market_intelligence_outcomes_v1()
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  o record;
  px numeric;
  px_observed_at timestamptz;
  directional numeric;
  raw_pnl numeric;
  market_pnl numeric;
  governed_pnl numeric;
  v_scored integer:=0;
  v_unavailable integer:=0;
begin
  for o in
    select *
    from trader_private.market_intelligence_observations_v1
    where outcome_status='pending'
      and outcome_due_at<=now()
    order by outcome_due_at asc
    limit 200
  loop
    px:=null;
    px_observed_at:=null;

    select nullif(e->>'price_usd','')::numeric,s.observed_at
    into px,px_observed_at
    from public.worldforge_signal_snapshots s
    cross join lateral jsonb_array_elements(s.assets) e
    where upper(e->>'symbol')=upper(o.symbol)
      and s.observed_at>=o.outcome_due_at
      and s.observed_at<=o.outcome_due_at+interval '30 minutes'
      and nullif(e->>'price_usd','') is not null
    order by s.observed_at asc
    limit 1;

    if px is null or px<=0 then
      if o.outcome_due_at < now()-interval '2 hours' then
        update trader_private.market_intelligence_observations_v1
        set outcome_status='unavailable',scored_at=now()
        where id=o.id;
        v_unavailable:=v_unavailable+1;
      end if;
      continue;
    end if;

    directional:=(case when o.side='sell' then -1 else 1 end)*((px/o.entry_price)-1);
    raw_pnl:=o.source_notional_usd*directional;
    market_pnl:=case when o.research_decision='RESEARCH_ALLOW' then raw_pnl else 0 end;
    governed_pnl:=case
      when o.research_decision='RESEARCH_ALLOW'
       and o.gate_status='complete'
       and o.ghosbc_final_decision='ALLOW'
       and coalesce(o.castle_gate_decision,'HOLD')='PASS'
      then raw_pnl else 0 end;

    update trader_private.market_intelligence_observations_v1
    set outcome_status='scored',
        outcome_price=px,
        directional_return_pct=directional*100,
        raw_action_pnl_usd=raw_pnl,
        market_filtered_pnl_usd=market_pnl,
        market_edge_usd=market_pnl-raw_pnl,
        governed_filtered_pnl_usd=governed_pnl,
        governed_edge_usd=governed_pnl-raw_pnl,
        scored_at=now()
    where id=o.id;
    v_scored:=v_scored+1;
  end loop;

  return jsonb_build_object(
    'ok',true,'scored',v_scored,'unavailable',v_unavailable,
    'observation_only',true,'trade_mutation_allowed',false,'money_moved',false,'as_of',now()
  );
end
$function$


CREATE OR REPLACE FUNCTION trader_private.run_market_intelligence_watch_v1()
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  v_org uuid;
  v_now timestamptz:=now();
  v_model record;
  v_latest_trade timestamptz;
  v_latest_observation timestamptz;
  v_eligible_unobserved integer:=0;
  v_gate_queued_old integer:=0;
  v_gate_errors_2h integer:=0;
  v_overdue_outcomes integer:=0;
  v_active_crons integer:=0;
  v_problem boolean:=false;
begin
  select id into v_org
  from public.organizations
  where slug='misfit-mediahouse'
  limit 1;

  select * into v_model
  from trader_private.market_intelligence_models_v1
  where status='RESEARCH_SHADOW_ONLY'
  order by created_at desc
  limit 1;

  select max(st.created_at) into v_latest_trade
  from public.misfit_trader_shadow_trades st;

  select max(o.created_at) into v_latest_observation
  from trader_private.market_intelligence_observations_v1 o
  where o.model_version=v_model.model_version;

  select count(*)::int into v_eligible_unobserved
  from public.misfit_trader_shadow_trades st
  where st.created_at>v_model.trained_through
    and not exists (
      select 1 from trader_private.market_intelligence_observations_v1 o
      where o.source_trade_id=st.id
    );

  select count(*)::int into v_gate_queued_old
  from trader_private.market_intelligence_observations_v1
  where gate_status='queued'
    and created_at<v_now-interval '15 minutes';

  select count(*)::int into v_gate_errors_2h
  from trader_private.market_intelligence_observations_v1
  where gate_status='error'
    and created_at>v_now-interval '2 hours';

  select count(*)::int into v_overdue_outcomes
  from trader_private.market_intelligence_observations_v1
  where outcome_status='pending'
    and outcome_due_at<v_now-interval '2 hours';

  select count(*)::int into v_active_crons
  from cron.job
  where active
    and jobname in (
      'misfit-trader-market-intel-enqueue-v1',
      'misfit-trader-market-intel-harvest-v1',
      'misfit-trader-market-intel-outcomes-v1'
    );

  v_problem :=
    v_model.model_version is null
    or v_active_crons<>3
    or v_gate_queued_old>0
    or v_gate_errors_2h>0
    or v_overdue_outcomes>0
    or (
      v_eligible_unobserved>0
      and (
        v_latest_observation is null
        or v_now-v_latest_observation>interval '45 minutes'
      )
    );

  perform ghosbc_private.sentinel_set_watch_v1(
    v_org,
    'trader_market_intelligence_v1',
    v_problem,
    case when v_active_crons<2 or v_gate_errors_2h>=3 then 'high' else 'medium' end,
    'trader_market_intelligence',
    'Misfit Trader Market Intelligence V1 requires attention',
    jsonb_build_object(
      'model_version',v_model.model_version,
      'model_status',v_model.status,
      'latest_source_trade',v_latest_trade,
      'latest_observation',v_latest_observation,
      'eligible_unobserved',v_eligible_unobserved,
      'gate_queued_older_than_15m',v_gate_queued_old,
      'gate_errors_last_2h',v_gate_errors_2h,
      'overdue_outcomes',v_overdue_outcomes,
      'active_market_intel_crons',v_active_crons,
      'execution_authority',false,
      'trade_mutation_allowed',false,
      'money_moved',false
    ),
    'Keep Market Intelligence V1 research-shadow-only. Restore all three market-intelligence crons, clear stale gate requests/errors, and score overdue outcomes. Do not enable broker execution.',
    false
  );

  return jsonb_build_object(
    'ok',not v_problem,
    'model_version',v_model.model_version,
    'eligible_unobserved',v_eligible_unobserved,
    'gate_queued_older_than_15m',v_gate_queued_old,
    'gate_errors_last_2h',v_gate_errors_2h,
    'overdue_outcomes',v_overdue_outcomes,
    'active_market_intel_crons',v_active_crons,
    'execution_authority',false,
    'trade_mutation_allowed',false,
    'money_moved',false,
    'checked_at',v_now
  );
end
$function$



revoke execute on function trader_private.enqueue_market_intelligence_v1(integer) from public, anon, authenticated;
revoke execute on function trader_private.harvest_market_intelligence_gate_v1() from public, anon, authenticated;
revoke execute on function trader_private.refresh_market_intelligence_outcomes_v1() from public, anon, authenticated;
revoke execute on function trader_private.market_intelligence_report_v1() from public, anon, authenticated;
revoke execute on function trader_private.run_market_intelligence_watch_v1() from public, anon, authenticated;

do $$
declare r record;
begin
  for r in select jobid from cron.job where jobname in (
    'misfit-trader-market-intel-enqueue-v1',
    'misfit-trader-market-intel-harvest-v1',
    'misfit-trader-market-intel-outcomes-v1',
    'misfit-sentinel-core-watch-v1'
  )
  loop perform cron.unschedule(r.jobid); end loop;
end
$$;

select cron.schedule('misfit-trader-market-intel-enqueue-v1','8,23,38,53 * * * *','select trader_private.enqueue_market_intelligence_v1(8);');
select cron.schedule('misfit-trader-market-intel-harvest-v1','*/5 * * * *','select trader_private.harvest_market_intelligence_gate_v1();');
select cron.schedule('misfit-trader-market-intel-outcomes-v1','11,26,41,56 * * * *','select trader_private.refresh_market_intelligence_outcomes_v1();');
select cron.schedule(
  'misfit-sentinel-core-watch-v1','*/10 * * * *',
  'select ghosbc_private.run_misfit_sentinel_core_watch_v1(); select ghosbc_private.run_trader_cognitive_shadow_watch_v1(); select trader_private.run_market_intelligence_watch_v1();'
);
