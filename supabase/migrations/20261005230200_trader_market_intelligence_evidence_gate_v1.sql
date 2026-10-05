-- Misfit Trader Market Intelligence V1 prospective evidence gate
-- Promotion boundary: V2 research candidate only. Never enables broker execution.

create table if not exists trader_private.market_intelligence_evidence_gate_v1 (
  model_version text primary key references trader_private.market_intelligence_models_v1(model_version) on delete restrict,
  status text not null check (status in ('COLLECTING','HOLD_INSUFFICIENT_EDGE','V2_RESEARCH_CANDIDATE')),
  minimum_scored integer not null default 100 check (minimum_scored>=100),
  minimum_allowed_scored integer not null default 40 check (minimum_allowed_scored>=1),
  minimum_distinct_allow_segments integer not null default 2 check (minimum_distinct_allow_segments>=1),
  maximum_strategy_concentration numeric not null default 0.80 check (maximum_strategy_concentration>0 and maximum_strategy_concentration<=1),
  scored_observations integer not null default 0,
  allowed_scored integer not null default 0,
  distinct_allow_segments integer not null default 0,
  raw_pnl_usd numeric not null default 0,
  market_pnl_usd numeric not null default 0,
  governed_pnl_usd numeric not null default 0,
  market_edge_usd numeric not null default 0,
  governed_edge_usd numeric not null default 0,
  market_mean_pnl_usd numeric,
  market_mean_ci95_lower_usd numeric,
  market_edge_mean_usd numeric,
  market_edge_ci95_lower_usd numeric,
  governed_vs_market_usd numeric not null default 0,
  max_market_drawdown_usd numeric not null default 0,
  max_governed_drawdown_usd numeric not null default 0,
  allowed_strategy_concentration numeric not null default 0,
  gate_errors integer not null default 0,
  unmet_requirements jsonb not null default '[]'::jsonb,
  execution_authority boolean not null default false check (execution_authority=false),
  live_promotion_allowed boolean not null default false check (live_promotion_allowed=false),
  money_movement_allowed boolean not null default false check (money_movement_allowed=false),
  evaluated_at timestamptz not null default now()
);

create table if not exists trader_private.market_intelligence_evidence_gate_runs_v1 (
  id uuid primary key default gen_random_uuid(),
  model_version text not null references trader_private.market_intelligence_models_v1(model_version) on delete restrict,
  status text not null,
  evidence jsonb not null,
  execution_authority boolean not null default false check (execution_authority=false),
  live_promotion_allowed boolean not null default false check (live_promotion_allowed=false),
  money_movement_allowed boolean not null default false check (money_movement_allowed=false),
  created_at timestamptz not null default now()
);

alter table trader_private.market_intelligence_evidence_gate_v1 enable row level security;
alter table trader_private.market_intelligence_evidence_gate_runs_v1 enable row level security;
revoke all on trader_private.market_intelligence_evidence_gate_v1 from public, anon, authenticated;
revoke all on trader_private.market_intelligence_evidence_gate_runs_v1 from public, anon, authenticated;

CREATE OR REPLACE FUNCTION trader_private.evaluate_market_intelligence_evidence_v1()
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  m record;
  v_scored integer:=0;
  v_allowed integer:=0;
  v_segments integer:=0;
  v_raw numeric:=0;
  v_market numeric:=0;
  v_governed numeric:=0;
  v_market_edge numeric:=0;
  v_governed_edge numeric:=0;
  v_market_mean numeric;
  v_market_std numeric;
  v_edge_mean numeric;
  v_edge_std numeric;
  v_market_ci numeric;
  v_edge_ci numeric;
  v_market_dd numeric:=0;
  v_governed_dd numeric:=0;
  v_concentration numeric:=0;
  v_gate_errors integer:=0;
  v_status text;
  v_unmet jsonb:='[]'::jsonb;
  v_evidence jsonb;
begin
  select * into m
  from trader_private.market_intelligence_models_v1
  where status='RESEARCH_SHADOW_ONLY'
  order by created_at desc
  limit 1;

  if m.model_version is null then
    raise exception 'market_intelligence_model_unavailable';
  end if;

  with scored as (
    select *
    from trader_private.market_intelligence_observations_v1
    where model_version=m.model_version
      and outcome_status='scored'
  )
  select
    count(*)::int,
    count(*) filter (where research_decision='RESEARCH_ALLOW')::int,
    count(distinct (source_strategy_key,regime_bucket)) filter (where research_decision='RESEARCH_ALLOW')::int,
    coalesce(sum(raw_action_pnl_usd),0),
    coalesce(sum(market_filtered_pnl_usd),0),
    coalesce(sum(governed_filtered_pnl_usd),0),
    coalesce(sum(market_filtered_pnl_usd-raw_action_pnl_usd),0),
    coalesce(sum(governed_filtered_pnl_usd-raw_action_pnl_usd),0),
    avg(market_filtered_pnl_usd),
    stddev_samp(market_filtered_pnl_usd),
    avg(market_filtered_pnl_usd-raw_action_pnl_usd),
    stddev_samp(market_filtered_pnl_usd-raw_action_pnl_usd)
  into
    v_scored,v_allowed,v_segments,v_raw,v_market,v_governed,
    v_market_edge,v_governed_edge,v_market_mean,v_market_std,v_edge_mean,v_edge_std
  from scored;

  if v_scored>1 then
    v_market_ci:=v_market_mean - 1.96*coalesce(v_market_std,0)/sqrt(v_scored::numeric);
    v_edge_ci:=v_edge_mean - 1.96*coalesce(v_edge_std,0)/sqrt(v_scored::numeric);
  else
    v_market_ci:=null;
    v_edge_ci:=null;
  end if;

  with ordered as (
    select
      source_trade_created_at,id,
      coalesce(market_filtered_pnl_usd,0) as market_pnl,
      coalesce(governed_filtered_pnl_usd,0) as governed_pnl
    from trader_private.market_intelligence_observations_v1
    where model_version=m.model_version and outcome_status='scored'
  ),
  curves as (
    select *,
      sum(market_pnl) over(order by source_trade_created_at,id) as market_curve,
      sum(governed_pnl) over(order by source_trade_created_at,id) as governed_curve
    from ordered
  ),
  peaks as (
    select *,
      max(market_curve) over(order by source_trade_created_at,id rows between unbounded preceding and current row) as market_peak,
      max(governed_curve) over(order by source_trade_created_at,id rows between unbounded preceding and current row) as governed_peak
    from curves
  )
  select
    coalesce(max(market_peak-market_curve),0),
    coalesce(max(governed_peak-governed_curve),0)
  into v_market_dd,v_governed_dd
  from peaks;

  with allowed_counts as (
    select source_strategy_key,count(*)::numeric as n
    from trader_private.market_intelligence_observations_v1
    where model_version=m.model_version
      and outcome_status='scored'
      and research_decision='RESEARCH_ALLOW'
    group by source_strategy_key
  )
  select case when coalesce(sum(n),0)>0 then max(n)/sum(n) else 0 end
  into v_concentration
  from allowed_counts;

  select count(*)::int into v_gate_errors
  from trader_private.market_intelligence_observations_v1
  where model_version=m.model_version and gate_status='error';

  if v_scored<100 then
    v_unmet:=v_unmet||jsonb_build_array('minimum_scored_100');
  end if;
  if v_allowed<40 then
    v_unmet:=v_unmet||jsonb_build_array('minimum_allowed_scored_40');
  end if;
  if v_segments<2 then
    v_unmet:=v_unmet||jsonb_build_array('minimum_distinct_allow_segments_2');
  end if;
  if v_market<=0 then
    v_unmet:=v_unmet||jsonb_build_array('prospective_market_pnl_must_be_positive');
  end if;
  if v_market_edge<=0 then
    v_unmet:=v_unmet||jsonb_build_array('prospective_market_edge_must_be_positive');
  end if;
  if v_market_ci is null or v_market_ci<=0 then
    v_unmet:=v_unmet||jsonb_build_array('market_mean_pnl_ci95_lower_must_be_positive');
  end if;
  if v_edge_ci is null or v_edge_ci<=0 then
    v_unmet:=v_unmet||jsonb_build_array('market_edge_ci95_lower_must_be_positive');
  end if;
  if v_governed<v_market then
    v_unmet:=v_unmet||jsonb_build_array('ghosbc_governance_must_not_reduce_filtered_pnl');
  end if;
  if v_concentration>0.80 then
    v_unmet:=v_unmet||jsonb_build_array('allowed_strategy_concentration_must_be_lte_0_80');
  end if;
  if v_gate_errors>0 then
    v_unmet:=v_unmet||jsonb_build_array('ghosbc_gate_errors_must_be_zero');
  end if;

  if v_scored<100 or v_allowed<40 then
    v_status:='COLLECTING';
  elsif jsonb_array_length(v_unmet)=0 then
    v_status:='V2_RESEARCH_CANDIDATE';
  else
    v_status:='HOLD_INSUFFICIENT_EDGE';
  end if;

  v_evidence:=jsonb_build_object(
    'model_version',m.model_version,
    'status',v_status,
    'scored_observations',v_scored,
    'allowed_scored',v_allowed,
    'distinct_allow_segments',v_segments,
    'raw_pnl_usd',round(v_raw,4),
    'market_pnl_usd',round(v_market,4),
    'governed_pnl_usd',round(v_governed,4),
    'market_edge_usd',round(v_market_edge,4),
    'governed_edge_usd',round(v_governed_edge,4),
    'market_mean_pnl_usd',round(v_market_mean,6),
    'market_mean_ci95_lower_usd',round(v_market_ci,6),
    'market_edge_mean_usd',round(v_edge_mean,6),
    'market_edge_ci95_lower_usd',round(v_edge_ci,6),
    'governed_vs_market_usd',round(v_governed-v_market,4),
    'max_market_drawdown_usd',round(v_market_dd,4),
    'max_governed_drawdown_usd',round(v_governed_dd,4),
    'allowed_strategy_concentration',round(v_concentration,4),
    'gate_errors',v_gate_errors,
    'unmet_requirements',v_unmet,
    'promotion_boundary','Passing creates only a V2 research candidate. It does not enable broker execution, live capital, or autonomous trading.',
    'execution_authority',false,
    'live_promotion_allowed',false,
    'money_movement_allowed',false,
    'evaluated_at',now()
  );

  insert into trader_private.market_intelligence_evidence_gate_v1(
    model_version,status,scored_observations,allowed_scored,distinct_allow_segments,
    raw_pnl_usd,market_pnl_usd,governed_pnl_usd,market_edge_usd,governed_edge_usd,
    market_mean_pnl_usd,market_mean_ci95_lower_usd,market_edge_mean_usd,market_edge_ci95_lower_usd,
    governed_vs_market_usd,max_market_drawdown_usd,max_governed_drawdown_usd,
    allowed_strategy_concentration,gate_errors,unmet_requirements,evaluated_at
  ) values (
    m.model_version,v_status,v_scored,v_allowed,v_segments,
    v_raw,v_market,v_governed,v_market_edge,v_governed_edge,
    v_market_mean,v_market_ci,v_edge_mean,v_edge_ci,
    v_governed-v_market,v_market_dd,v_governed_dd,
    v_concentration,v_gate_errors,v_unmet,now()
  )
  on conflict(model_version) do update set
    status=excluded.status,
    scored_observations=excluded.scored_observations,
    allowed_scored=excluded.allowed_scored,
    distinct_allow_segments=excluded.distinct_allow_segments,
    raw_pnl_usd=excluded.raw_pnl_usd,
    market_pnl_usd=excluded.market_pnl_usd,
    governed_pnl_usd=excluded.governed_pnl_usd,
    market_edge_usd=excluded.market_edge_usd,
    governed_edge_usd=excluded.governed_edge_usd,
    market_mean_pnl_usd=excluded.market_mean_pnl_usd,
    market_mean_ci95_lower_usd=excluded.market_mean_ci95_lower_usd,
    market_edge_mean_usd=excluded.market_edge_mean_usd,
    market_edge_ci95_lower_usd=excluded.market_edge_ci95_lower_usd,
    governed_vs_market_usd=excluded.governed_vs_market_usd,
    max_market_drawdown_usd=excluded.max_market_drawdown_usd,
    max_governed_drawdown_usd=excluded.max_governed_drawdown_usd,
    allowed_strategy_concentration=excluded.allowed_strategy_concentration,
    gate_errors=excluded.gate_errors,
    unmet_requirements=excluded.unmet_requirements,
    evaluated_at=excluded.evaluated_at;

  insert into trader_private.market_intelligence_evidence_gate_runs_v1(
    model_version,status,evidence
  ) values (m.model_version,v_status,v_evidence);

  return v_evidence;
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
  v_evidence record;
  v_latest_trade timestamptz;
  v_latest_observation timestamptz;
  v_eligible_unobserved integer:=0;
  v_gate_queued_old integer:=0;
  v_gate_errors_2h integer:=0;
  v_overdue_outcomes integer:=0;
  v_active_crons integer:=0;
  v_evidence_stale boolean:=false;
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

  if v_model.model_version is not null then
    select * into v_evidence
    from trader_private.market_intelligence_evidence_gate_v1
    where model_version=v_model.model_version
    limit 1;
  end if;

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
      'misfit-trader-market-intel-outcomes-v1',
      'misfit-trader-market-intel-evidence-v1'
    );

  v_evidence_stale :=
    v_model.model_version is not null
    and (
      v_evidence.model_version is null
      or v_evidence.evaluated_at is null
      or v_now-v_evidence.evaluated_at>interval '90 minutes'
    );

  v_problem :=
    v_model.model_version is null
    or v_active_crons<>4
    or v_gate_queued_old>0
    or v_gate_errors_2h>0
    or v_overdue_outcomes>0
    or v_evidence_stale
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
    case when v_active_crons<3 or v_gate_errors_2h>=3 then 'high' else 'medium' end,
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
      'evidence_gate_status',v_evidence.status,
      'evidence_gate_scored',v_evidence.scored_observations,
      'evidence_gate_allowed_scored',v_evidence.allowed_scored,
      'evidence_gate_evaluated_at',v_evidence.evaluated_at,
      'evidence_gate_stale',v_evidence_stale,
      'execution_authority',false,
      'live_promotion_allowed',false,
      'trade_mutation_allowed',false,
      'money_moved',false
    ),
    'Keep Market Intelligence V1 research-shadow-only. Restore all four market-intelligence crons, clear stale gate requests/errors, score overdue outcomes, and restore evidence-gate freshness. Do not enable broker execution.',
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
    'evidence_gate_status',v_evidence.status,
    'evidence_gate_scored',v_evidence.scored_observations,
    'evidence_gate_allowed_scored',v_evidence.allowed_scored,
    'evidence_gate_evaluated_at',v_evidence.evaluated_at,
    'evidence_gate_stale',v_evidence_stale,
    'execution_authority',false,
    'live_promotion_allowed',false,
    'trade_mutation_allowed',false,
    'money_moved',false,
    'checked_at',v_now
  );
end
$function$


revoke execute on function trader_private.evaluate_market_intelligence_evidence_v1()
from public, anon, authenticated;
revoke execute on function trader_private.run_market_intelligence_watch_v1()
from public, anon, authenticated;

do $$
declare r record;
begin
  for r in select jobid from cron.job where jobname='misfit-trader-market-intel-evidence-v1'
  loop perform cron.unschedule(r.jobid); end loop;
end
$$;

select cron.schedule(
  'misfit-trader-market-intel-evidence-v1',
  '14,44 * * * *',
  'select trader_private.evaluate_market_intelligence_evidence_v1();'
);
