-- Misfit Trader Cognitive Shadow V1
-- Private observation-only comparison of raw paper trades against GHOSBC Cognitive Engine V1.
-- No trade mutation, no broker execution, no money movement.

create table if not exists ghosbc_private.trader_cognitive_shadow_observations (
  id uuid primary key default gen_random_uuid(),
  source_trade_id uuid not null unique references public.misfit_trader_shadow_trades(id) on delete restrict,
  source_trade_created_at timestamptz not null,
  source_strategy_key text not null,
  symbol text not null,
  raw_side text not null,
  raw_target_pct numeric,
  raw_signal_strength numeric,
  raw_rationale text,
  raw_notional_usd numeric,
  raw_entry_price numeric,
  evidence_confidence numeric not null check (evidence_confidence >= 0 and evidence_confidence <= 1),
  request_id bigint unique,
  status text not null default 'queued' check (status in ('queued','complete','error')),
  response_status integer,
  cognitive_final_decision text check (
    cognitive_final_decision is null
    or cognitive_final_decision in ('ALLOW','ESCALATE_HUMAN','REFUSE')
  ),
  cognitive_target_pct numeric,
  center_reset_count integer,
  castle_gate_decision text,
  ghx_packet text,
  response jsonb,
  error text,
  requested_at timestamptz not null default now(),
  processed_at timestamptz,
  observation_only boolean not null default true check (observation_only = true),
  trade_mutation_allowed boolean not null default false check (trade_mutation_allowed = false),
  money_moved boolean not null default false check (money_moved = false)
);

create table if not exists ghosbc_private.trader_cognitive_shadow_outcomes (
  id uuid primary key default gen_random_uuid(),
  observation_id uuid not null references ghosbc_private.trader_cognitive_shadow_observations(id) on delete restrict,
  source_trade_id uuid not null,
  source_strategy_key text not null,
  symbol text not null,
  horizon_minutes integer not null check (horizon_minutes in (60,240,1440,10080)),
  due_at timestamptz not null,
  scored_at timestamptz not null default now(),
  entry_price numeric not null,
  outcome_price numeric not null,
  raw_side text not null,
  raw_notional_usd numeric not null,
  raw_target_pct numeric,
  cognitive_final_decision text not null,
  cognitive_target_pct numeric,
  cognitive_size_factor numeric not null check (cognitive_size_factor >= 0 and cognitive_size_factor <= 1),
  raw_action_return_pct numeric not null,
  cognitive_action_return_pct numeric not null,
  raw_action_pnl_usd numeric not null,
  cognitive_action_pnl_usd numeric not null,
  cognitive_edge_usd numeric not null,
  max_favorable_excursion_pct numeric,
  max_adverse_excursion_pct numeric,
  evidence jsonb not null default '{}'::jsonb,
  unique(observation_id,horizon_minutes)
);

alter table ghosbc_private.trader_cognitive_shadow_observations enable row level security;
alter table ghosbc_private.trader_cognitive_shadow_outcomes enable row level security;
revoke all on ghosbc_private.trader_cognitive_shadow_observations from public, anon, authenticated;
revoke all on ghosbc_private.trader_cognitive_shadow_outcomes from public, anon, authenticated;

create index if not exists trader_cognitive_shadow_observations_status_idx
  on ghosbc_private.trader_cognitive_shadow_observations(status,requested_at);
create index if not exists trader_cognitive_shadow_outcomes_strategy_idx
  on ghosbc_private.trader_cognitive_shadow_outcomes(source_strategy_key,horizon_minutes,scored_at);

create or replace function ghosbc_private.enqueue_trader_cognitive_shadow_v1(
  p_limit integer default 8,
  p_lookback interval default interval '2 hours'
)
returns table(source_trade_id uuid, request_id bigint)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  t record;
  v_internal_key text;
  v_request_id bigint;
  v_confidence numeric;
  v_observation_id uuid;
  v_run_id text;
begin
  select decrypted_secret into v_internal_key
  from vault.decrypted_secrets
  where name='GHOSBC_COGNITIVE_V1_INTERNAL_KEY'
  limit 1;

  if v_internal_key is null or length(v_internal_key) < 32 then
    raise exception 'GHOSBC_COGNITIVE_V1_INTERNAL_KEY unavailable';
  end if;

  for t in
    select st.*
    from public.misfit_trader_shadow_trades st
    where st.created_at >= now() - p_lookback
      and not exists (
        select 1 from ghosbc_private.trader_cognitive_shadow_observations o
        where o.source_trade_id=st.id
      )
    order by st.created_at asc
    limit greatest(1,least(coalesce(p_limit,8),20))
  loop
    v_confidence := greatest(0::numeric,least(1::numeric,abs(coalesce(t.signal_strength,0))));
    v_run_id := 'trader_cognitive_' || replace(t.id::text,'-','');

    insert into ghosbc_private.trader_cognitive_shadow_observations(
      source_trade_id,source_trade_created_at,source_strategy_key,symbol,
      raw_side,raw_target_pct,raw_signal_strength,raw_rationale,
      raw_notional_usd,raw_entry_price,evidence_confidence,status
    ) values (
      t.id,t.created_at,t.strategy_key,t.symbol,
      t.side,t.target_pct,t.signal_strength,t.rationale,
      t.notional_usd,t.price_usd,v_confidence,'queued'
    )
    returning id into v_observation_id;

    select net.http_post(
      url := 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-process-signal',
      headers := jsonb_build_object(
        'Content-Type','application/json',
        'x-ghosbc-internal-key',v_internal_key
      ),
      body := jsonb_build_object(
        'mode','cognitive_v1',
        'run_id',v_run_id,
        'engine_id','misfit_trader_cognitive_shadow_v1',
        'objective','Evaluate this paper-only trade proposal as a counterfactual governance decision. Do not place, submit, modify, cancel, or execute any real-money or paper trade.',
        'situation',format(
          'Strategy %s generated a %s %s paper trade with target allocation %s and signal strength %s. This is observation-only evidence collection.',
          t.strategy_key,upper(t.side),upper(t.symbol),
          coalesce(t.target_pct::text,'unknown'),
          coalesce(t.signal_strength::text,'unknown')
        ),
        'channel','internal',
        'candidate_plans',jsonb_build_array(
          jsonb_build_object(
            'plan_id','paper_trade_candidate',
            'action',format(
              'Paper-only counterfactual candidate: %s %s with target allocation %s. Analyze only; do not place a live trade and do not mutate the paper portfolio.',
              upper(t.side),upper(t.symbol),coalesce(t.target_pct::text,'unknown')
            ),
            'rationale',coalesce(t.rationale,'No rationale supplied.'),
            'expected_outcome','Return a governance decision for observation only. No order submission or portfolio mutation.'
          )
        ),
        'context',jsonb_build_object(
          'product_lane','misfit_trader_cognitive_shadow_v1',
          'evidence_confidence',v_confidence,
          'authorization_granted',false,
          'human_review_available',true,
          'critical_domain',true,
          'max_cycles',3
        )
      ),
      timeout_milliseconds := 15000
    ) into v_request_id;

    update ghosbc_private.trader_cognitive_shadow_observations
    set request_id=v_request_id
    where id=v_observation_id;

    source_trade_id := t.id;
    request_id := v_request_id;
    return next;
  end loop;
end
$$;

revoke execute on function ghosbc_private.enqueue_trader_cognitive_shadow_v1(integer,interval)
from public, anon, authenticated;

create or replace function ghosbc_private.harvest_trader_cognitive_shadow_v1()
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  o record;
  r record;
  v_body jsonb;
  v_decision text;
  v_target numeric;
  v_processed integer := 0;
  v_errors integer := 0;
begin
  for o in
    select *
    from ghosbc_private.trader_cognitive_shadow_observations
    where status='queued'
      and request_id is not null
    order by requested_at asc
    limit 100
  loop
    select * into r
    from net._http_response
    where id=o.request_id
    order by created desc
    limit 1;

    if not found then continue; end if;

    if coalesce(r.status_code,0) < 200 or coalesce(r.status_code,0) >= 300 then
      update ghosbc_private.trader_cognitive_shadow_observations
      set status='error',
          response_status=r.status_code,
          error=coalesce(r.error_msg,'http_'||coalesce(r.status_code::text,'unknown')),
          processed_at=now()
      where id=o.id;
      v_errors := v_errors + 1;
      continue;
    end if;

    begin
      v_body := r.content::jsonb;
    exception when others then
      update ghosbc_private.trader_cognitive_shadow_observations
      set status='error',response_status=r.status_code,error='invalid_json_response',processed_at=now()
      where id=o.id;
      v_errors := v_errors + 1;
      continue;
    end;

    v_decision := v_body->>'final_decision';

    if v_decision not in ('ALLOW','ESCALATE_HUMAN','REFUSE') then
      update ghosbc_private.trader_cognitive_shadow_observations
      set status='error',
          response_status=r.status_code,
          response=v_body,
          error='missing_or_invalid_final_decision',
          processed_at=now()
      where id=o.id;
      v_errors := v_errors + 1;
      continue;
    end if;

    v_target := case when v_decision='ALLOW' then o.raw_target_pct else 0 end;

    update ghosbc_private.trader_cognitive_shadow_observations
    set status='complete',
        response_status=r.status_code,
        cognitive_final_decision=v_decision,
        cognitive_target_pct=v_target,
        center_reset_count=coalesce((v_body->>'center_reset_count')::integer,0),
        castle_gate_decision=v_body#>>'{castle_gate,decision}',
        ghx_packet=v_body->>'ghx',
        response=v_body,
        error=null,
        processed_at=now()
    where id=o.id;

    v_processed := v_processed + 1;
  end loop;

  return jsonb_build_object(
    'ok',v_errors=0,
    'processed',v_processed,
    'errors',v_errors,
    'as_of',now(),
    'observation_only',true,
    'trade_mutation_allowed',false,
    'money_moved',false
  );
end
$$;

revoke execute on function ghosbc_private.harvest_trader_cognitive_shadow_v1()
from public, anon, authenticated;

create or replace function ghosbc_private.refresh_trader_cognitive_shadow_outcomes_v1()
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  p record;
  h integer;
  target_at timestamptz;
  px numeric;
  px_snapshot_id bigint;
  px_observed_at timestamptz;
  entry_px numeric;
  direction numeric;
  end_ret numeric;
  size_factor numeric;
  raw_pnl numeric;
  cognitive_pnl numeric;
  mfe numeric;
  mae numeric;
  inserted_count integer := 0;
begin
  for p in
    select * from ghosbc_private.trader_cognitive_shadow_observations
    where status='complete'
  loop
    foreach h in array array[60,240,1440,10080]
    loop
      target_at := p.source_trade_created_at + make_interval(mins => h);
      if target_at > now() then continue; end if;
      if exists(
        select 1 from ghosbc_private.trader_cognitive_shadow_outcomes
        where observation_id=p.id and horizon_minutes=h
      ) then continue; end if;

      select (a->>'price_usd')::numeric,s.id,s.observed_at
      into px,px_snapshot_id,px_observed_at
      from public.worldforge_signal_snapshots s
      cross join lateral jsonb_array_elements(s.assets) a
      where upper(a->>'symbol')=upper(p.symbol)
        and s.observed_at >= target_at
        and s.observed_at <= target_at + interval '30 minutes'
        and nullif(a->>'price_usd','') is not null
      order by s.observed_at asc
      limit 1;

      if px is null or px <= 0 then continue; end if;

      entry_px := p.raw_entry_price;
      if entry_px is null or entry_px <= 0 then
        select (a->>'price_usd')::numeric into entry_px
        from public.worldforge_signal_snapshots s
        cross join lateral jsonb_array_elements(s.assets) a
        where upper(a->>'symbol')=upper(p.symbol)
          and s.observed_at >= p.source_trade_created_at - interval '20 minutes'
          and s.observed_at <= p.source_trade_created_at + interval '20 minutes'
          and nullif(a->>'price_usd','') is not null
        order by abs(extract(epoch from (s.observed_at-p.source_trade_created_at))) asc
        limit 1;
      end if;

      if entry_px is null or entry_px <= 0 then continue; end if;

      direction := case when lower(p.raw_side)='sell' then -1 else 1 end;
      end_ret := direction * ((px/entry_px)-1);
      size_factor := case when p.cognitive_final_decision='ALLOW' then 1 else 0 end;
      raw_pnl := coalesce(p.raw_notional_usd,0) * end_ret;
      cognitive_pnl := coalesce(p.raw_notional_usd,0) * size_factor * end_ret;

      select
        max(direction * (((a->>'price_usd')::numeric / entry_px) - 1)),
        min(direction * (((a->>'price_usd')::numeric / entry_px) - 1))
      into mfe,mae
      from public.worldforge_signal_snapshots s
      cross join lateral jsonb_array_elements(s.assets) a
      where upper(a->>'symbol')=upper(p.symbol)
        and s.observed_at >= p.source_trade_created_at
        and s.observed_at <= px_observed_at
        and nullif(a->>'price_usd','') is not null;

      insert into ghosbc_private.trader_cognitive_shadow_outcomes(
        observation_id,source_trade_id,source_strategy_key,symbol,
        horizon_minutes,due_at,scored_at,entry_price,outcome_price,
        raw_side,raw_notional_usd,raw_target_pct,cognitive_final_decision,
        cognitive_target_pct,cognitive_size_factor,
        raw_action_return_pct,cognitive_action_return_pct,
        raw_action_pnl_usd,cognitive_action_pnl_usd,cognitive_edge_usd,
        max_favorable_excursion_pct,max_adverse_excursion_pct,evidence
      ) values (
        p.id,p.source_trade_id,p.source_strategy_key,p.symbol,
        h,target_at,now(),entry_px,px,
        p.raw_side,coalesce(p.raw_notional_usd,0),p.raw_target_pct,p.cognitive_final_decision,
        p.cognitive_target_pct,size_factor,end_ret,size_factor*end_ret,
        raw_pnl,cognitive_pnl,cognitive_pnl-raw_pnl,mfe,mae,
        jsonb_build_object(
          'engine','GHOSBC_COGNITIVE_ENGINE_V1_CLOUD',
          'lane','misfit_trader_cognitive_shadow_v1',
          'observation_only',true,
          'price_snapshot_id',px_snapshot_id,
          'price_observed_at',px_observed_at,
          'source_trade_created_at',p.source_trade_created_at,
          'trade_mutation_allowed',false,
          'money_moved',false
        )
      )
      on conflict(observation_id,horizon_minutes) do nothing;

      if found then inserted_count := inserted_count + 1; end if;
    end loop;
  end loop;

  return jsonb_build_object('ok',true,'inserted',inserted_count,'as_of',now(),'observation_only',true,'money_moved',false);
end
$$;

revoke execute on function ghosbc_private.refresh_trader_cognitive_shadow_outcomes_v1()
from public, anon, authenticated;

create or replace function ghosbc_private.trader_cognitive_shadow_report_v1()
returns jsonb
language sql
security invoker
set search_path = ''
as $$
with observations as (
  select
    count(*) as total,
    count(*) filter (where status='complete') as complete,
    count(*) filter (where status='error') as errors,
    count(*) filter (where cognitive_final_decision='ALLOW') as allow_count,
    count(*) filter (where cognitive_final_decision='ESCALATE_HUMAN') as escalate_count,
    count(*) filter (where cognitive_final_decision='REFUSE') as refuse_count
  from ghosbc_private.trader_cognitive_shadow_observations
),
outcomes as (
  select
    count(*) as scored,
    coalesce(sum(raw_action_pnl_usd),0) as raw_pnl,
    coalesce(sum(cognitive_action_pnl_usd),0) as cognitive_pnl,
    coalesce(sum(cognitive_edge_usd),0) as edge
  from ghosbc_private.trader_cognitive_shadow_outcomes
),
by_horizon as (
  select coalesce(jsonb_agg(x order by x.horizon_minutes),'[]'::jsonb) as rows
  from (
    select horizon_minutes,count(*) as samples,
      round(sum(raw_action_pnl_usd),4) as raw_pnl_usd,
      round(sum(cognitive_action_pnl_usd),4) as cognitive_pnl_usd,
      round(sum(cognitive_edge_usd),4) as edge_usd
    from ghosbc_private.trader_cognitive_shadow_outcomes
    group by horizon_minutes
  ) x
),
by_strategy as (
  select coalesce(jsonb_agg(x order by x.edge_usd desc),'[]'::jsonb) as rows
  from (
    select source_strategy_key,count(*) as samples,
      round(sum(raw_action_pnl_usd),4) as raw_pnl_usd,
      round(sum(cognitive_action_pnl_usd),4) as cognitive_pnl_usd,
      round(sum(cognitive_edge_usd),4) as edge_usd
    from ghosbc_private.trader_cognitive_shadow_outcomes
    group by source_strategy_key
  ) x
)
select jsonb_build_object(
  'status','LIVE_OBSERVATION_ONLY',
  'schema_version','1.0.0',
  'claims_boundary','Paper-trading counterfactual evidence only. No real-money execution authority.',
  'observations',jsonb_build_object(
    'total',observations.total,'complete',observations.complete,'errors',observations.errors,
    'ALLOW',observations.allow_count,'ESCALATE_HUMAN',observations.escalate_count,'REFUSE',observations.refuse_count
  ),
  'scored_outcomes',outcomes.scored,
  'raw_action_pnl_usd',round(outcomes.raw_pnl,4),
  'cognitive_action_pnl_usd',round(outcomes.cognitive_pnl,4),
  'cognitive_edge_usd',round(outcomes.edge,4),
  'by_horizon',by_horizon.rows,
  'by_strategy',by_strategy.rows,
  'generated_at',now(),
  'money_moved',false,
  'trade_mutation_allowed',false
)
from observations,outcomes,by_horizon,by_strategy;
$$;

revoke execute on function ghosbc_private.trader_cognitive_shadow_report_v1()
from public, anon, authenticated;

create or replace function ghosbc_private.run_trader_cognitive_shadow_watch_v1()
returns jsonb
language plpgsql
security invoker
set search_path=''
as $$
declare
  v_org uuid;
  v_now timestamptz := now();
  v_latest_requested timestamptz;
  v_latest_processed timestamptz;
  v_queued_old integer := 0;
  v_errors_2h integer := 0;
  v_complete integer := 0;
  v_outcomes integer := 0;
  v_active_crons integer := 0;
  v_legacy_observer_active boolean := false;
  v_problem boolean := false;
begin
  select id into v_org from public.organizations where slug='misfit-mediahouse' limit 1;

  select max(requested_at),max(processed_at),
    count(*) filter (where status='queued' and requested_at < v_now-interval '15 minutes')::int,
    count(*) filter (where status='error' and requested_at > v_now-interval '2 hours')::int,
    count(*) filter (where status='complete')::int
  into v_latest_requested,v_latest_processed,v_queued_old,v_errors_2h,v_complete
  from ghosbc_private.trader_cognitive_shadow_observations;

  select count(*)::int into v_outcomes from ghosbc_private.trader_cognitive_shadow_outcomes;

  select count(*)::int into v_active_crons
  from cron.job
  where active and jobname in (
    'misfit-trader-cognitive-shadow-enqueue',
    'misfit-trader-cognitive-shadow-harvest',
    'misfit-trader-cognitive-shadow-outcomes'
  );

  select exists(
    select 1 from cron.job where active and jobname='misfit-trader-reconsideration-observer'
  ) into v_legacy_observer_active;

  v_problem := v_active_crons <> 3
    or v_legacy_observer_active
    or v_queued_old > 0
    or v_errors_2h > 0
    or (v_latest_requested is not null and v_now-v_latest_requested > interval '45 minutes');

  perform ghosbc_private.sentinel_set_watch_v1(
    v_org,'trader_cognitive_shadow_runtime_v1',v_problem,
    case when v_errors_2h >= 3 or v_active_crons < 2 then 'high' else 'medium' end,
    'trader_cognitive_shadow',
    'Misfit Trader Cognitive V1 shadow observer requires attention',
    jsonb_build_object(
      'latest_requested',v_latest_requested,'latest_processed',v_latest_processed,
      'queued_older_than_15m',v_queued_old,'errors_last_2h',v_errors_2h,
      'complete_observations',v_complete,'scored_outcomes',v_outcomes,
      'active_cognitive_crons',v_active_crons,'legacy_observer_active',v_legacy_observer_active,
      'observation_only',true,'trade_mutation_allowed',false,'money_moved',false
    ),
    'Keep the lane observation-only. Restore all three Cognitive shadow cron jobs, clear queued/error observations, and keep the retired legacy observer disabled.',
    false
  );

  return jsonb_build_object(
    'ok',not v_problem,'checked_at',v_now,'latest_requested',v_latest_requested,
    'latest_processed',v_latest_processed,'queued_older_than_15m',v_queued_old,
    'errors_last_2h',v_errors_2h,'complete_observations',v_complete,'scored_outcomes',v_outcomes,
    'active_cognitive_crons',v_active_crons,'legacy_observer_active',v_legacy_observer_active,
    'observation_only',true,'trade_mutation_allowed',false,'money_moved',false
  );
end
$$;

revoke execute on function ghosbc_private.run_trader_cognitive_shadow_watch_v1()
from public, anon, authenticated;

do $$
declare r record;
begin
  for r in select jobid from cron.job where jobname='misfit-trader-reconsideration-observer'
  loop perform cron.unschedule(r.jobid); end loop;

  for r in
    select jobid from cron.job where jobname in (
      'misfit-trader-cognitive-shadow-enqueue',
      'misfit-trader-cognitive-shadow-harvest',
      'misfit-trader-cognitive-shadow-outcomes',
      'misfit-sentinel-core-watch-v1'
    )
  loop perform cron.unschedule(r.jobid); end loop;
end
$$;

select cron.schedule(
  'misfit-trader-cognitive-shadow-enqueue',
  '9,24,39,54 * * * *',
  $$select ghosbc_private.enqueue_trader_cognitive_shadow_v1(8, interval '2 hours');$$
);

select cron.schedule(
  'misfit-trader-cognitive-shadow-harvest',
  '*/5 * * * *',
  $$select ghosbc_private.harvest_trader_cognitive_shadow_v1();$$
);

select cron.schedule(
  'misfit-trader-cognitive-shadow-outcomes',
  '13,28,43,58 * * * *',
  $$select ghosbc_private.refresh_trader_cognitive_shadow_outcomes_v1();$$
);

select cron.schedule(
  'misfit-sentinel-core-watch-v1',
  '*/10 * * * *',
  'select ghosbc_private.run_misfit_sentinel_core_watch_v1(); select ghosbc_private.run_trader_cognitive_shadow_watch_v1();'
);

insert into public.misfit_agent_recovery_notes(note_key,security_class,note,updated_at)
values(
  'misfit-trader-legacy-reconsideration-observer','private',
  jsonb_build_object(
    'status','retired',
    'retired_at',now(),
    'reason','Legacy observer endpoint no longer implements observe_trade; recent proposals were stuck at OBSERVE.',
    'replacement','ghosbc_private.trader_cognitive_shadow_observations',
    'historical_evidence_preserved',true,
    'historical_tables_deleted',false,
    'money_moved',false
  ),
  now()
)
on conflict(note_key) do update set note=excluded.note,updated_at=excluded.updated_at;


-- 2026-10-05 Cognitive shadow hardening / matched legacy comparison
-- Observation-only utilities. No broker execution, trade mutation, or money movement.

CREATE OR REPLACE FUNCTION ghosbc_private.enqueue_trader_cognitive_legacy_overlap_v1(p_limit integer DEFAULT 20)
 RETURNS TABLE(source_trade_id uuid, request_id bigint)
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  t record;
  v_internal_key text;
  v_request_id bigint;
  v_confidence numeric;
  v_observation_id uuid;
  v_run_id text;
begin
  select decrypted_secret into v_internal_key
  from vault.decrypted_secrets
  where name='GHOSBC_COGNITIVE_V1_INTERNAL_KEY'
  limit 1;

  if v_internal_key is null or length(v_internal_key) < 32 then
    raise exception 'GHOSBC_COGNITIVE_V1_INTERNAL_KEY unavailable';
  end if;

  for t in
    with legacy_trades as (
      select distinct lro.source_trade_id as legacy_trade_id
      from public.misfit_trader_reconsideration_outcomes lro
    )
    select st.*
    from public.misfit_trader_shadow_trades st
    join legacy_trades l on l.legacy_trade_id=st.id
    where not exists (
      select 1
      from ghosbc_private.trader_cognitive_shadow_observations o
      where o.source_trade_id=st.id
    )
    order by st.created_at asc
    limit greatest(1,least(coalesce(p_limit,20),25))
  loop
    v_confidence := greatest(0::numeric,least(1::numeric,abs(coalesce(t.signal_strength,0))));
    v_run_id := 'trader_cognitive_overlap_' || replace(t.id::text,'-','');

    insert into ghosbc_private.trader_cognitive_shadow_observations(
      source_trade_id,source_trade_created_at,source_strategy_key,symbol,
      raw_side,raw_target_pct,raw_signal_strength,raw_rationale,
      raw_notional_usd,raw_entry_price,evidence_confidence,status
    ) values (
      t.id,t.created_at,t.strategy_key,t.symbol,
      t.side,t.target_pct,t.signal_strength,t.rationale,
      t.notional_usd,t.price_usd,v_confidence,'queued'
    )
    returning id into v_observation_id;

    select net.http_post(
      url := 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-process-signal',
      headers := jsonb_build_object(
        'Content-Type','application/json',
        'x-ghosbc-internal-key',v_internal_key
      ),
      body := jsonb_build_object(
        'mode','cognitive_v1',
        'run_id',v_run_id,
        'engine_id','misfit_trader_cognitive_shadow_v1',
        'objective','Evaluate this historical paper-trade proposal as a counterfactual governance decision for direct comparison against the legacy reconsideration layer. Do not place, submit, modify, cancel, or execute any real-money or paper trade.',
        'situation',format(
          'Historical strategy %s generated a %s %s paper trade with target allocation %s and signal strength %s. This replay is observation-only and exists solely to compare governance decisions on the same source trade.',
          t.strategy_key,
          upper(t.side),
          upper(t.symbol),
          coalesce(t.target_pct::text,'unknown'),
          coalesce(t.signal_strength::text,'unknown')
        ),
        'channel','internal',
        'candidate_plans',jsonb_build_array(
          jsonb_build_object(
            'plan_id','paper_trade_candidate',
            'action',format(
              'Paper-only historical counterfactual candidate: %s %s with target allocation %s. Analyze only; do not place a live trade and do not mutate any paper portfolio.',
              upper(t.side),
              upper(t.symbol),
              coalesce(t.target_pct::text,'unknown')
            ),
            'rationale',coalesce(t.rationale,'No rationale supplied.'),
            'expected_outcome','Return a governance decision for observation only. No order submission or portfolio mutation.'
          )
        ),
        'context',jsonb_build_object(
          'product_lane','misfit_trader_cognitive_shadow_v1',
          'comparison_lane','legacy_reconsideration_overlap_v1',
          'evidence_confidence',v_confidence,
          'authorization_granted',false,
          'human_review_available',true,
          'critical_domain',true,
          'max_cycles',3
        )
      ),
      timeout_milliseconds := 15000
    ) into v_request_id;

    update ghosbc_private.trader_cognitive_shadow_observations
    set request_id=v_request_id
    where id=v_observation_id;

    source_trade_id := t.id;
    request_id := v_request_id;
    return next;
  end loop;
end
$function$


CREATE OR REPLACE FUNCTION ghosbc_private.retry_trader_cognitive_shadow_errors_v1(p_limit integer DEFAULT 8)
 RETURNS TABLE(observation_id uuid, request_id bigint)
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  o record;
  v_internal_key text;
  v_request_id bigint;
  v_run_id text;
begin
  select decrypted_secret into v_internal_key
  from vault.decrypted_secrets
  where name='GHOSBC_COGNITIVE_V1_INTERNAL_KEY'
  limit 1;

  if v_internal_key is null or length(v_internal_key) < 32 then
    raise exception 'GHOSBC_COGNITIVE_V1_INTERNAL_KEY unavailable';
  end if;

  for o in
    select *
    from ghosbc_private.trader_cognitive_shadow_observations
    where status='error'
    order by requested_at asc
    limit greatest(1,least(coalesce(p_limit,8),10))
  loop
    v_run_id := 'trader_cognitive_retry_' || replace(o.source_trade_id::text,'-','');

    select net.http_post(
      url := 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-process-signal',
      headers := jsonb_build_object(
        'Content-Type','application/json',
        'x-ghosbc-internal-key',v_internal_key
      ),
      body := jsonb_build_object(
        'mode','cognitive_v1',
        'run_id',v_run_id,
        'engine_id','misfit_trader_cognitive_shadow_v1',
        'objective','Evaluate this paper-only trade proposal as a counterfactual governance decision. Do not place, submit, modify, cancel, or execute any real-money or paper trade.',
        'situation',format(
          'Strategy %s generated a %s %s paper trade with target allocation %s and signal strength %s. This is observation-only evidence collection.',
          o.source_strategy_key,
          upper(o.raw_side),
          upper(o.symbol),
          coalesce(o.raw_target_pct::text,'unknown'),
          coalesce(o.raw_signal_strength::text,'unknown')
        ),
        'channel','internal',
        'candidate_plans',jsonb_build_array(
          jsonb_build_object(
            'plan_id','paper_trade_candidate',
            'action',format(
              'Paper-only counterfactual candidate: %s %s with target allocation %s. Analyze only; do not place a live trade and do not mutate the paper portfolio.',
              upper(o.raw_side),
              upper(o.symbol),
              coalesce(o.raw_target_pct::text,'unknown')
            ),
            'rationale',coalesce(o.raw_rationale,'No rationale supplied.'),
            'expected_outcome','Return a governance decision for observation only. No order submission or portfolio mutation.'
          )
        ),
        'context',jsonb_build_object(
          'product_lane','misfit_trader_cognitive_shadow_v1',
          'comparison_lane','legacy_reconsideration_overlap_v1_retry',
          'evidence_confidence',o.evidence_confidence,
          'authorization_granted',false,
          'human_review_available',true,
          'critical_domain',true,
          'max_cycles',3
        )
      ),
      timeout_milliseconds := 15000
    ) into v_request_id;

    update ghosbc_private.trader_cognitive_shadow_observations
    set request_id=v_request_id,
        status='queued',
        response_status=null,
        response=null,
        error=null,
        requested_at=now(),
        processed_at=null
    where id=o.id;

    observation_id := o.id;
    request_id := v_request_id;
    return next;
  end loop;
end
$function$


CREATE OR REPLACE FUNCTION ghosbc_private.run_trader_cognitive_shadow_watch_v1()
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  v_org uuid;
  v_now timestamptz := now();
  v_latest_requested timestamptz;
  v_latest_processed timestamptz;
  v_latest_source_trade timestamptz;
  v_eligible_unobserved_recent integer := 0;
  v_queued_old integer := 0;
  v_errors_2h integer := 0;
  v_complete integer := 0;
  v_outcomes integer := 0;
  v_active_crons integer := 0;
  v_legacy_observer_active boolean := false;
  v_problem boolean := false;
begin
  select id into v_org
  from public.organizations
  where slug='misfit-mediahouse'
  limit 1;

  select
    max(requested_at),
    max(processed_at),
    count(*) filter (where status='queued' and requested_at < v_now-interval '15 minutes')::int,
    count(*) filter (where status='error' and requested_at > v_now-interval '2 hours')::int,
    count(*) filter (where status='complete')::int
  into v_latest_requested,v_latest_processed,v_queued_old,v_errors_2h,v_complete
  from ghosbc_private.trader_cognitive_shadow_observations;

  select
    max(st.created_at),
    count(*) filter (
      where st.created_at >= v_now-interval '2 hours'
        and not exists (
          select 1
          from ghosbc_private.trader_cognitive_shadow_observations o
          where o.source_trade_id=st.id
        )
    )::int
  into v_latest_source_trade,v_eligible_unobserved_recent
  from public.misfit_trader_shadow_trades st;

  select count(*)::int into v_outcomes
  from ghosbc_private.trader_cognitive_shadow_outcomes;

  select count(*)::int into v_active_crons
  from cron.job
  where active
    and jobname in (
      'misfit-trader-cognitive-shadow-enqueue',
      'misfit-trader-cognitive-shadow-harvest',
      'misfit-trader-cognitive-shadow-outcomes'
    );

  select exists(
    select 1 from cron.job
    where active and jobname='misfit-trader-reconsideration-observer'
  ) into v_legacy_observer_active;

  v_problem :=
    v_active_crons <> 3
    or v_legacy_observer_active
    or v_queued_old > 0
    or v_errors_2h > 0
    or (
      v_eligible_unobserved_recent > 0
      and (
        v_latest_requested is null
        or v_now-v_latest_requested > interval '45 minutes'
      )
    );

  perform ghosbc_private.sentinel_set_watch_v1(
    v_org,
    'trader_cognitive_shadow_runtime_v1',
    v_problem,
    case when v_errors_2h >= 3 or v_active_crons < 2 then 'high' else 'medium' end,
    'trader_cognitive_shadow',
    'Misfit Trader Cognitive V1 shadow observer requires attention',
    jsonb_build_object(
      'latest_source_trade',v_latest_source_trade,
      'eligible_unobserved_recent',v_eligible_unobserved_recent,
      'latest_requested',v_latest_requested,
      'latest_processed',v_latest_processed,
      'queued_older_than_15m',v_queued_old,
      'errors_last_2h',v_errors_2h,
      'complete_observations',v_complete,
      'scored_outcomes',v_outcomes,
      'active_cognitive_crons',v_active_crons,
      'legacy_observer_active',v_legacy_observer_active,
      'observation_only',true,
      'trade_mutation_allowed',false,
      'money_moved',false
    ),
    'Keep the lane observation-only. Restore all three Cognitive shadow cron jobs, clear queued/error observations, and keep the retired legacy observer disabled.',
    false
  );

  return jsonb_build_object(
    'ok',not v_problem,
    'checked_at',v_now,
    'latest_source_trade',v_latest_source_trade,
    'eligible_unobserved_recent',v_eligible_unobserved_recent,
    'latest_requested',v_latest_requested,
    'latest_processed',v_latest_processed,
    'queued_older_than_15m',v_queued_old,
    'errors_last_2h',v_errors_2h,
    'complete_observations',v_complete,
    'scored_outcomes',v_outcomes,
    'active_cognitive_crons',v_active_crons,
    'legacy_observer_active',v_legacy_observer_active,
    'observation_only',true,
    'trade_mutation_allowed',false,
    'money_moved',false
  );
end
$function$


CREATE OR REPLACE FUNCTION ghosbc_private.trader_cognitive_vs_legacy_report_v1()
 RETURNS jsonb
 LANGUAGE sql
 SET search_path TO ''
AS $function$
with joined as (
  select
    c.source_trade_id,
    c.source_strategy_key,
    c.symbol,
    c.horizon_minutes,
    c.raw_action_pnl_usd as raw_pnl,
    c.cognitive_action_pnl_usd as cognitive_pnl,
    c.cognitive_edge_usd as cognitive_edge,
    l.governed_action_pnl_usd as legacy_pnl,
    l.reconsideration_edge_usd as legacy_edge,
    o.cognitive_final_decision
  from ghosbc_private.trader_cognitive_shadow_outcomes c
  join public.misfit_trader_reconsideration_outcomes l
    on l.source_trade_id=c.source_trade_id
   and l.horizon_minutes=c.horizon_minutes
  join ghosbc_private.trader_cognitive_shadow_observations o
    on o.id=c.observation_id
),
overall as (
  select
    count(*)::int as samples,
    count(distinct source_trade_id)::int as trades,
    round(sum(raw_pnl),4) as raw_pnl,
    round(sum(legacy_pnl),4) as legacy_pnl,
    round(sum(cognitive_pnl),4) as cognitive_pnl,
    round(sum(legacy_edge),4) as legacy_edge,
    round(sum(cognitive_edge),4) as cognitive_edge,
    round(sum(cognitive_pnl-legacy_pnl),4) as cognitive_vs_legacy_delta
  from joined
),
by_strategy as (
  select coalesce(jsonb_agg(to_jsonb(x) order by x.source_strategy_key),'[]'::jsonb) rows
  from (
    select
      source_strategy_key,
      count(*)::int as samples,
      round(sum(raw_pnl),4) as raw_pnl,
      round(sum(legacy_pnl),4) as legacy_pnl,
      round(sum(cognitive_pnl),4) as cognitive_pnl,
      round(sum(legacy_edge),4) as legacy_edge,
      round(sum(cognitive_edge),4) as cognitive_edge,
      round(sum(cognitive_pnl-legacy_pnl),4) as cognitive_vs_legacy_delta
    from joined
    group by source_strategy_key
  ) x
),
by_horizon as (
  select coalesce(jsonb_agg(to_jsonb(x) order by x.horizon_minutes),'[]'::jsonb) rows
  from (
    select
      horizon_minutes,
      count(*)::int as samples,
      round(sum(raw_pnl),4) as raw_pnl,
      round(sum(legacy_pnl),4) as legacy_pnl,
      round(sum(cognitive_pnl),4) as cognitive_pnl,
      round(sum(legacy_edge),4) as legacy_edge,
      round(sum(cognitive_edge),4) as cognitive_edge,
      round(sum(cognitive_pnl-legacy_pnl),4) as cognitive_vs_legacy_delta
    from joined
    group by horizon_minutes
  ) x
),
decisions as (
  select coalesce(jsonb_object_agg(cognitive_final_decision,cnt),'{}'::jsonb) rows
  from (
    select cognitive_final_decision,count(*)::int cnt
    from (
      select distinct source_trade_id,cognitive_final_decision from joined
    ) d
    group by cognitive_final_decision
  ) x
)
select jsonb_build_object(
  'status','LIVE_OBSERVATION_ONLY',
  'schema_version','1.0.0',
  'claims_boundary','Matched historical paper-trade comparison only. This measures governance outcomes on identical source trades/horizons; it is not evidence of live-trading profitability.',
  'overall',to_jsonb(overall),
  'by_strategy',by_strategy.rows,
  'by_horizon',by_horizon.rows,
  'cognitive_trade_decisions',decisions.rows,
  'money_moved',false,
  'trade_mutation_allowed',false,
  'generated_at',now()
)
from overall,by_strategy,by_horizon,decisions;
$function$


revoke execute on function ghosbc_private.run_trader_cognitive_shadow_watch_v1() from public, anon, authenticated;
revoke execute on function ghosbc_private.enqueue_trader_cognitive_legacy_overlap_v1(integer) from public, anon, authenticated;
revoke execute on function ghosbc_private.retry_trader_cognitive_shadow_errors_v1(integer) from public, anon, authenticated;
revoke execute on function ghosbc_private.trader_cognitive_vs_legacy_report_v1() from public, anon, authenticated;
