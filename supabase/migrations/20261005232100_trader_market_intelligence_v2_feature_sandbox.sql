-- Misfit Trader Market Intelligence V2 prospective feature sandbox
-- Historical candidates are explicitly rejected; future feature capture is prospective-only.
-- No broker execution, no paper portfolio mutation, no money movement.

create table if not exists trader_private.market_intelligence_v2_candidates (
  candidate_key text primary key,
  status text not null check (status in ('REJECTED_OUT_OF_SAMPLE','REJECTED_NO_INCREMENTAL_EDGE','COLLECTING_FEATURES','RESEARCH_CANDIDATE')),
  method text not null,
  evidence jsonb not null default '{}'::jsonb,
  research_started_at timestamptz,
  execution_authority boolean not null default false check (execution_authority=false),
  live_promotion_allowed boolean not null default false check (live_promotion_allowed=false),
  paper_trade_mutation_allowed boolean not null default false check (paper_trade_mutation_allowed=false),
  money_movement_allowed boolean not null default false check (money_movement_allowed=false),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists trader_private.market_intelligence_v2_feature_observations (
  source_trade_id uuid primary key references public.misfit_trader_shadow_trades(id) on delete restrict,
  captured_at timestamptz not null default now(),
  source_trade_created_at timestamptz not null,
  source_strategy_key text not null,
  symbol text not null,
  side text not null,
  source_notional_usd numeric not null,
  entry_price numeric not null,
  target_pct numeric,
  signal_strength numeric,
  regime_bucket text not null check (regime_bucket in ('risk_on','risk_off','neutral')),
  market_breadth numeric,
  momentum_score numeric,
  volatility_score numeric,
  fear_greed_value numeric,
  emotion_score numeric,
  asset_type text,
  asset_change_24h_pct numeric,
  side_aligned_asset_change numeric,
  prior_strategy_return_pct numeric,
  consensus_present boolean not null default false,
  consensus_observed_at timestamptz,
  consensus_age_seconds numeric,
  consensus_raw_net numeric,
  consensus_alignment numeric,
  consensus_confidence numeric,
  consensus_active_traders numeric,
  outcome_due_at timestamptz not null,
  outcome_status text not null default 'pending' check (outcome_status in ('pending','scored','unavailable')),
  outcome_price numeric,
  directional_return_pct numeric,
  raw_action_pnl_usd numeric,
  scored_at timestamptz,
  prospective_only boolean not null default true check (prospective_only=true),
  execution_authority boolean not null default false check (execution_authority=false),
  trade_mutation_allowed boolean not null default false check (trade_mutation_allowed=false),
  money_moved boolean not null default false check (money_moved=false)
);

alter table trader_private.market_intelligence_v2_candidates enable row level security;
alter table trader_private.market_intelligence_v2_feature_observations enable row level security;
revoke all on trader_private.market_intelligence_v2_candidates from public, anon, authenticated;
revoke all on trader_private.market_intelligence_v2_feature_observations from public, anon, authenticated;

insert into trader_private.market_intelligence_v2_candidates(candidate_key,status,method,evidence)
values
(
  'v2a_rich_shrunk_scorecard',
  'REJECTED_OUT_OF_SAMPLE',
  '13-feature train-only quartile bins with shrunk additive empirical effects; threshold chosen on validation; final 20 percent untouched.',
  '{"usable_historical_trades":2308,"validation":{"samples":461,"raw_pnl_usd":-69.5458,"filtered_pnl_usd":182.3917,"delta_usd":251.9375,"allowed_trades":369},"untouched_final_test":{"samples":462,"raw_pnl_usd":-154.9253,"filtered_pnl_usd":-135.2045,"delta_usd":19.7208,"allowed_trades":371,"allowed_win_rate":0.2615},"rejection_reason":"Validation did not generalize. Final-test filtered PnL remained negative and improvement collapsed materially versus validation.","execution_authority":false}'::jsonb
),
(
  'v2b_position_consensus_overlay',
  'REJECTED_NO_INCREMENTAL_EDGE',
  'Strict pre-trade position-consensus alignment/confidence/active-trader gate.',
  '{"historical_coverage":237,"train":142,"validation":47,"final_test":48,"validation_raw_pnl_usd":-5.0064,"validation_filtered_pnl_usd":-5.0064,"final_test_raw_pnl_usd":1.3409,"final_test_filtered_pnl_usd":1.3409,"final_test_delta_usd":0,"rejection_reason":"Best validation rule was effectively allow-all and produced zero incremental edge. Historical consensus coverage is also too sparse for primary-model use.","execution_authority":false}'::jsonb
)
on conflict(candidate_key) do update
set status=excluded.status,method=excluded.method,evidence=excluded.evidence,updated_at=now();

insert into trader_private.market_intelligence_v2_candidates(
  candidate_key,status,method,evidence,research_started_at
) values (
  'v2c_prospective_feature_sandbox',
  'COLLECTING_FEATURES',
  'Prospective-only rich pre-trade feature capture for future paper trades. No historical retuning of V1 and no execution authority.',
  '{"feature_set":["strategy","regime","side","signal_strength","target_pct","market_breadth","momentum_score","volatility_score","fear_greed_value","emotion_score","asset_type","asset_change_24h_pct","side_aligned_asset_change","prior_strategy_return_pct","consensus_raw_net","consensus_alignment","consensus_confidence","consensus_active_traders"],"outcome_horizon_minutes":240,"prospective_only":true,"minimum_future_scored_before_model_search":200,"execution_authority":false,"live_promotion_allowed":false}'::jsonb,
  '2026-10-05T23:19:07.435956+00:00'::timestamptz
)
on conflict(candidate_key) do nothing;

create or replace function trader_private.refresh_market_intelligence_v2_feature_sandbox_v1(
  p_limit integer default 100
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_start timestamptz;
  v_inserted integer:=0;
  v_scored integer:=0;
  v_unavailable integer:=0;
  o record;
  px numeric;
  directional numeric;
begin
  select research_started_at into v_start
  from trader_private.market_intelligence_v2_candidates
  where candidate_key='v2c_prospective_feature_sandbox'
    and status='COLLECTING_FEATURES'
  limit 1;

  if v_start is null then
    raise exception 'v2_prospective_feature_sandbox_unavailable';
  end if;

  with source_rows as (
    select
      st.id source_trade_id,
      st.created_at source_trade_created_at,
      st.strategy_key source_strategy_key,
      upper(st.symbol) symbol,
      lower(st.side) side,
      st.notional_usd source_notional_usd,
      st.price_usd entry_price,
      st.target_pct,
      st.signal_strength,
      case
        when s.regime ilike 'risk_on%' then 'risk_on'
        when s.regime ilike 'risk_off%' then 'risk_off'
        else 'neutral'
      end regime_bucket,
      s.market_breadth,
      s.momentum_score,
      s.volatility_score,
      s.fear_greed_value::numeric fear_greed_value,
      s.emotion_score,
      nullif(a->>'asset_type','') asset_type,
      nullif(a->>'change_24h_pct','')::numeric asset_change_24h_pct,
      (case when lower(st.side)='sell' then -1 else 1 end)
        * nullif(a->>'change_24h_pct','')::numeric side_aligned_asset_change,
      perf.return_pct prior_strategy_return_pct,
      pcs.observed_at consensus_observed_at,
      case when pcs.observed_at is not null then true else false end consensus_present,
      case when pcs.observed_at is not null
        then extract(epoch from (st.created_at-pcs.observed_at))::numeric
        else null end consensus_age_seconds,
      nullif(c->>'raw_net_consensus','')::numeric consensus_raw_net,
      (case when lower(st.side)='sell' then -1 else 1 end)
        * nullif(c->>'raw_net_consensus','')::numeric consensus_alignment,
      nullif(c->>'confidence','')::numeric consensus_confidence,
      nullif(c->>'active_traders','')::numeric consensus_active_traders
    from public.misfit_trader_shadow_trades st
    join public.worldforge_signal_snapshots s on s.id=st.snapshot_id
    left join lateral (
      select e a
      from jsonb_array_elements(s.assets) e
      where upper(e->>'symbol')=upper(st.symbol)
      limit 1
    ) ax on true
    left join lateral (
      select p.return_pct
      from public.misfit_trader_shadow_performance p
      where p.strategy_key=st.strategy_key
        and p.observed_at<st.created_at-interval '1 second'
      order by p.observed_at desc
      limit 1
    ) perf on true
    left join lateral (
      select ps.observed_at,elem c
      from public.misfit_trader_position_consensus_snapshots ps
      cross join lateral jsonb_array_elements(ps.consensus) elem
      where ps.observed_at<st.created_at-interval '1 second'
        and ps.observed_at>=st.created_at-interval '45 minutes'
        and upper(elem->>'symbol')=upper(st.symbol)
      order by ps.observed_at desc
      limit 1
    ) pcs on true
    where st.created_at>=v_start
      and not exists (
        select 1 from trader_private.market_intelligence_v2_feature_observations x
        where x.source_trade_id=st.id
      )
    order by st.created_at asc
    limit greatest(1,least(coalesce(p_limit,100),250))
  )
  insert into trader_private.market_intelligence_v2_feature_observations(
    source_trade_id,source_trade_created_at,source_strategy_key,symbol,side,
    source_notional_usd,entry_price,target_pct,signal_strength,regime_bucket,
    market_breadth,momentum_score,volatility_score,fear_greed_value,emotion_score,
    asset_type,asset_change_24h_pct,side_aligned_asset_change,prior_strategy_return_pct,
    consensus_present,consensus_observed_at,consensus_age_seconds,consensus_raw_net,
    consensus_alignment,consensus_confidence,consensus_active_traders,outcome_due_at
  )
  select
    source_trade_id,source_trade_created_at,source_strategy_key,symbol,side,
    source_notional_usd,entry_price,target_pct,signal_strength,regime_bucket,
    market_breadth,momentum_score,volatility_score,fear_greed_value,emotion_score,
    asset_type,asset_change_24h_pct,side_aligned_asset_change,prior_strategy_return_pct,
    consensus_present,consensus_observed_at,consensus_age_seconds,consensus_raw_net,
    consensus_alignment,consensus_confidence,consensus_active_traders,
    source_trade_created_at+interval '240 minutes'
  from source_rows
  on conflict(source_trade_id) do nothing;

  get diagnostics v_inserted=row_count;

  for o in
    select *
    from trader_private.market_intelligence_v2_feature_observations
    where outcome_status='pending'
      and outcome_due_at<=now()
    order by outcome_due_at asc
    limit greatest(1,least(coalesce(p_limit,100),250))
  loop
    px:=null;

    select nullif(e->>'price_usd','')::numeric
    into px
    from public.worldforge_signal_snapshots s2
    cross join lateral jsonb_array_elements(s2.assets) e
    where upper(e->>'symbol')=upper(o.symbol)
      and s2.observed_at>=o.outcome_due_at
      and s2.observed_at<=o.outcome_due_at+interval '30 minutes'
      and nullif(e->>'price_usd','') is not null
    order by s2.observed_at asc
    limit 1;

    if px is null or px<=0 then
      if o.outcome_due_at<now()-interval '2 hours' then
        update trader_private.market_intelligence_v2_feature_observations
        set outcome_status='unavailable',scored_at=now()
        where source_trade_id=o.source_trade_id;
        v_unavailable:=v_unavailable+1;
      end if;
      continue;
    end if;

    directional:=(case when o.side='sell' then -1 else 1 end)*((px/o.entry_price)-1);

    update trader_private.market_intelligence_v2_feature_observations
    set outcome_status='scored',
        outcome_price=px,
        directional_return_pct=directional*100,
        raw_action_pnl_usd=o.source_notional_usd*directional,
        scored_at=now()
    where source_trade_id=o.source_trade_id;

    v_scored:=v_scored+1;
  end loop;

  return jsonb_build_object(
    'ok',true,
    'candidate_key','v2c_prospective_feature_sandbox',
    'research_started_at',v_start,
    'inserted',v_inserted,
    'scored',v_scored,
    'unavailable',v_unavailable,
    'prospective_only',true,
    'execution_authority',false,
    'trade_mutation_allowed',false,
    'money_moved',false,
    'as_of',now()
  );
end
$$;

create or replace function trader_private.market_intelligence_v2_feature_report_v1()
returns jsonb
language sql
security invoker
set search_path = ''
as $$
with c as (
  select *
  from trader_private.market_intelligence_v2_candidates
  where candidate_key='v2c_prospective_feature_sandbox'
),
o as (
  select *
  from trader_private.market_intelligence_v2_feature_observations
  where source_trade_created_at>=(select research_started_at from c)
),
summary as (
  select
    count(*)::int observations,
    count(*) filter(where outcome_status='scored')::int scored,
    count(*) filter(where outcome_status='pending')::int pending,
    count(*) filter(where outcome_status='unavailable')::int unavailable,
    count(*) filter(where consensus_present)::int consensus_present,
    round(case when count(*)>0
      then count(*) filter(where consensus_present)::numeric/count(*)::numeric
      else 0 end,4) consensus_coverage,
    round(coalesce(sum(raw_action_pnl_usd) filter(where outcome_status='scored'),0),4) raw_pnl_usd,
    count(distinct source_strategy_key)::int strategies,
    count(distinct symbol)::int symbols,
    min(source_trade_created_at) first_trade,
    max(source_trade_created_at) latest_trade
  from o
)
select jsonb_build_object(
  'status',(select status from c),
  'candidate_key','v2c_prospective_feature_sandbox',
  'summary',to_jsonb(summary),
  'minimum_future_scored_before_model_search',200,
  'historical_candidates',(
    select jsonb_agg(jsonb_build_object(
      'candidate_key',candidate_key,'status',status,'rejection_reason',evidence->>'rejection_reason'
    ) order by candidate_key)
    from trader_private.market_intelligence_v2_candidates
    where candidate_key<>'v2c_prospective_feature_sandbox'
  ),
  'prospective_only',true,
  'execution_authority',false,
  'live_promotion_allowed',false,
  'trade_mutation_allowed',false,
  'money_moved',false,
  'generated_at',now()
)
from summary;
$$;

create or replace function trader_private.run_market_intelligence_v2_watch_v1()
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_org uuid;
  v_now timestamptz:=now();
  v_start timestamptz;
  v_latest_source_trade timestamptz;
  v_latest_capture timestamptz;
  v_eligible_unobserved integer:=0;
  v_overdue_outcomes integer:=0;
  v_scored integer:=0;
  v_consensus_covered integer:=0;
  v_active_cron integer:=0;
  v_ready_for_model_search boolean:=false;
  v_problem boolean:=false;
begin
  select id into v_org from public.organizations where slug='misfit-mediahouse' limit 1;

  select research_started_at into v_start
  from trader_private.market_intelligence_v2_candidates
  where candidate_key='v2c_prospective_feature_sandbox'
    and status='COLLECTING_FEATURES'
  limit 1;

  select max(created_at) into v_latest_source_trade
  from public.misfit_trader_shadow_trades
  where created_at>=v_start;

  select max(captured_at),
         count(*) filter(where outcome_status='scored')::int,
         count(*) filter(where consensus_present)::int
  into v_latest_capture,v_scored,v_consensus_covered
  from trader_private.market_intelligence_v2_feature_observations
  where source_trade_created_at>=v_start;

  select count(*)::int into v_eligible_unobserved
  from public.misfit_trader_shadow_trades st
  where st.created_at>=v_start
    and not exists (
      select 1 from trader_private.market_intelligence_v2_feature_observations o
      where o.source_trade_id=st.id
    );

  select count(*)::int into v_overdue_outcomes
  from trader_private.market_intelligence_v2_feature_observations
  where outcome_status='pending'
    and outcome_due_at<v_now-interval '2 hours';

  select count(*)::int into v_active_cron
  from cron.job
  where active and jobname='misfit-trader-market-intel-v2-features-v1';

  v_ready_for_model_search:=v_scored>=200;

  v_problem :=
    v_start is null
    or v_active_cron<>1
    or v_overdue_outcomes>0
    or (v_eligible_unobserved>0 and (
      v_latest_capture is null or v_now-v_latest_capture>interval '45 minutes'
    ));

  perform ghosbc_private.sentinel_set_watch_v1(
    v_org,
    'trader_market_intelligence_v2_feature_sandbox',
    v_problem,
    'medium',
    'trader_market_intelligence_research',
    'Market Intelligence V2 prospective feature sandbox requires attention',
    jsonb_build_object(
      'research_started_at',v_start,
      'latest_source_trade',v_latest_source_trade,
      'latest_capture',v_latest_capture,
      'eligible_unobserved',v_eligible_unobserved,
      'overdue_outcomes',v_overdue_outcomes,
      'scored_outcomes',v_scored,
      'consensus_covered_observations',v_consensus_covered,
      'active_feature_cron',v_active_cron,
      'minimum_scored_before_model_search',200,
      'ready_for_model_search',v_ready_for_model_search,
      'rejected_candidate_keys',jsonb_build_array(
        'v2a_rich_shrunk_scorecard','v2b_position_consensus_overlay'
      ),
      'prospective_only',true,
      'execution_authority',false,
      'live_promotion_allowed',false,
      'trade_mutation_allowed',false,
      'money_moved',false
    ),
    'Keep V2 prospective-only. Restore the feature collector or score overdue outcomes. Do not retune V1 or promote rejected historical candidates.',
    false
  );

  return jsonb_build_object(
    'ok',not v_problem,
    'research_started_at',v_start,
    'eligible_unobserved',v_eligible_unobserved,
    'overdue_outcomes',v_overdue_outcomes,
    'scored_outcomes',v_scored,
    'consensus_covered_observations',v_consensus_covered,
    'active_feature_cron',v_active_cron,
    'minimum_scored_before_model_search',200,
    'ready_for_model_search',v_ready_for_model_search,
    'prospective_only',true,
    'execution_authority',false,
    'live_promotion_allowed',false,
    'trade_mutation_allowed',false,
    'money_moved',false,
    'checked_at',v_now
  );
end
$$;

revoke execute on function trader_private.refresh_market_intelligence_v2_feature_sandbox_v1(integer) from public,anon,authenticated;
revoke execute on function trader_private.market_intelligence_v2_feature_report_v1() from public,anon,authenticated;
revoke execute on function trader_private.run_market_intelligence_v2_watch_v1() from public,anon,authenticated;

do $$
declare r record;
begin
  for r in select jobid from cron.job where jobname in (
    'misfit-trader-market-intel-v2-features-v1','misfit-sentinel-core-watch-v1'
  )
  loop perform cron.unschedule(r.jobid); end loop;
end
$$;

select cron.schedule(
  'misfit-trader-market-intel-v2-features-v1',
  '1,16,31,46 * * * *',
  'select trader_private.refresh_market_intelligence_v2_feature_sandbox_v1(100);'
);

select cron.schedule(
  'misfit-sentinel-core-watch-v1',
  '*/10 * * * *',
  'select ghosbc_private.run_misfit_sentinel_core_watch_v1(); select ghosbc_private.run_trader_cognitive_shadow_watch_v1(); select trader_private.run_market_intelligence_watch_v1(); select trader_private.run_market_intelligence_v2_watch_v1();'
);
