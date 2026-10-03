create table if not exists public.misfit_trader_live_config (
  config_key text primary key default 'primary' check (config_key = 'primary'),
  broker_provider text not null default 'alpaca',
  mode text not null default 'disabled' check (mode in ('disabled','manual_live','ai_live')),
  execution_enabled boolean not null default false,
  broker_credentials_verified boolean not null default false,
  broker_account_bound boolean not null default false,
  broker_kyc_approved boolean not null default false,
  buying_power_synced boolean not null default false,
  server_side_order_authority boolean not null default false,
  max_position_usd numeric,
  daily_loss_limit_usd numeric,
  leverage_policy text not null default 'none' check (leverage_policy in ('none','margin_limited')),
  kill_switch_enabled boolean not null default true,
  kill_switch_engaged boolean not null default true,
  manual_approval_required boolean not null default true,
  ai_authority_enabled boolean not null default false,
  immutable_audit_required boolean not null default true,
  notes text,
  updated_at timestamptz not null default now()
);

insert into public.misfit_trader_live_config (
  config_key, broker_provider, mode, execution_enabled,
  broker_credentials_verified, broker_account_bound, broker_kyc_approved,
  buying_power_synced, server_side_order_authority,
  max_position_usd, daily_loss_limit_usd, leverage_policy,
  kill_switch_enabled, kill_switch_engaged,
  manual_approval_required, ai_authority_enabled, immutable_audit_required,
  notes
) values (
  'primary','alpaca','disabled',false,
  false,false,false,
  false,false,
  null,null,'none',
  true,true,
  true,false,true,
  'Fail-closed live trading preflight. No broker execution authority is enabled.'
)
on conflict (config_key) do nothing;

create table if not exists public.misfit_trader_live_order_intents (
  id uuid primary key default gen_random_uuid(),
  source_strategy_key text,
  source_trade_id uuid,
  symbol text not null,
  side text not null check (side in ('buy','sell')),
  notional_usd numeric,
  qty numeric,
  order_type text not null default 'market' check (order_type in ('market','limit')),
  limit_price numeric,
  time_in_force text not null default 'day',
  requested_by text not null,
  manual_approval_id uuid,
  preflight jsonb not null default '{}'::jsonb,
  status text not null default 'blocked_preflight' check (
    status in ('blocked_preflight','awaiting_manual_approval','ready_for_broker_adapter','cancelled','submitted','rejected','filled')
  ),
  block_reason text,
  broker_order_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.misfit_trader_live_audit_log (
  id bigint generated always as identity primary key,
  event_type text not null,
  actor text not null,
  order_intent_id uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.misfit_trader_live_audit_append_only()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  raise exception 'misfit_trader_live_audit_log is append-only';
end;
$$;

drop trigger if exists misfit_trader_live_audit_no_update on public.misfit_trader_live_audit_log;
create trigger misfit_trader_live_audit_no_update
before update or delete on public.misfit_trader_live_audit_log
for each row execute function public.misfit_trader_live_audit_append_only();

create or replace function public.misfit_trader_live_preflight()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  c public.misfit_trader_live_config%rowtype;
  gate_complete boolean := false;
  audit_ready boolean := false;
  checks jsonb;
  ready_manual boolean := false;
begin
  select * into c
  from public.misfit_trader_live_config
  where config_key='primary';

  if c.config_key is null then
    return jsonb_build_object(
      'ok', false,
      'ready_for_manual_live', false,
      'ready_for_ai_live', false,
      'reason', 'live_config_missing',
      'money_moved', false
    );
  end if;

  select exists(
    select 1
    from public.human_gates
    where gate_type='trader_live_broker_activation'
      and status::text='completed'
  ) into gate_complete;

  select to_regclass('public.misfit_trader_live_audit_log') is not null
    and exists(
      select 1 from pg_trigger
      where tgname='misfit_trader_live_audit_no_update'
        and not tgisinternal
    )
  into audit_ready;

  checks := jsonb_build_object(
    'customer_auth_account_binding', c.broker_account_bound,
    'broker_kyc_account_approval', c.broker_kyc_approved,
    'broker_credentials_verified', c.broker_credentials_verified,
    'funding_buying_power_sync', c.buying_power_synced,
    'server_side_order_authority', c.server_side_order_authority,
    'max_position_limit', coalesce(c.max_position_usd,0) > 0,
    'daily_loss_limit', coalesce(c.daily_loss_limit_usd,0) > 0,
    'leverage_policy', c.leverage_policy in ('none','margin_limited'),
    'kill_switch_present', c.kill_switch_enabled,
    'kill_switch_clear', not c.kill_switch_engaged,
    'immutable_audit', audit_ready,
    'human_gate_completed', gate_complete,
    'manual_approval_required', c.manual_approval_required,
    'execution_enabled', c.execution_enabled,
    'manual_live_mode', c.mode='manual_live'
  );

  ready_manual :=
    c.execution_enabled
    and c.mode='manual_live'
    and c.broker_credentials_verified
    and c.broker_account_bound
    and c.broker_kyc_approved
    and c.buying_power_synced
    and c.server_side_order_authority
    and coalesce(c.max_position_usd,0) > 0
    and coalesce(c.daily_loss_limit_usd,0) > 0
    and c.kill_switch_enabled
    and not c.kill_switch_engaged
    and c.manual_approval_required
    and audit_ready
    and gate_complete;

  return jsonb_build_object(
    'ok', true,
    'provider', c.broker_provider,
    'mode', c.mode,
    'ready_for_manual_live', ready_manual,
    'ready_for_ai_live', ready_manual and c.ai_authority_enabled and c.mode='ai_live',
    'checks', checks,
    'money_moved', false,
    'order_execution_attempted', false,
    'checked_at', now()
  );
end;
$$;

create or replace function public.misfit_trader_live_record_order_intent(
  p_symbol text,
  p_side text,
  p_requested_by text,
  p_notional_usd numeric default null,
  p_qty numeric default null,
  p_order_type text default 'market',
  p_limit_price numeric default null,
  p_time_in_force text default 'day',
  p_source_strategy_key text default null,
  p_source_trade_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  pf jsonb;
  intent_id uuid;
  st text;
  reason text;
begin
  pf := public.misfit_trader_live_preflight();

  if upper(coalesce(p_symbol,'')) !~ '^[A-Z0-9./-]{1,24}$' then
    raise exception 'invalid_symbol';
  end if;
  if lower(coalesce(p_side,'')) not in ('buy','sell') then
    raise exception 'invalid_side';
  end if;
  if coalesce(p_notional_usd,0) <= 0 and coalesce(p_qty,0) <= 0 then
    raise exception 'notional_or_qty_required';
  end if;

  if coalesce((pf->>'ready_for_manual_live')::boolean,false) then
    st := 'awaiting_manual_approval';
    reason := 'manual_approval_required_before_any_broker_submission';
  else
    st := 'blocked_preflight';
    reason := 'live_broker_preflight_not_ready';
  end if;

  insert into public.misfit_trader_live_order_intents(
    source_strategy_key, source_trade_id, symbol, side,
    notional_usd, qty, order_type, limit_price, time_in_force,
    requested_by, preflight, status, block_reason
  ) values (
    p_source_strategy_key, p_source_trade_id, upper(p_symbol), lower(p_side),
    p_notional_usd, p_qty, lower(p_order_type), p_limit_price, lower(p_time_in_force),
    p_requested_by, pf, st, reason
  )
  returning id into intent_id;

  insert into public.misfit_trader_live_audit_log(event_type,actor,order_intent_id,details)
  values (
    'ORDER_INTENT_RECORDED',
    p_requested_by,
    intent_id,
    jsonb_build_object(
      'status',st,
      'reason',reason,
      'preflight',pf,
      'money_moved',false,
      'broker_submission_attempted',false
    )
  );

  return jsonb_build_object(
    'ok', true,
    'order_intent_id', intent_id,
    'status', st,
    'reason', reason,
    'preflight', pf,
    'money_moved', false,
    'broker_submission_attempted', false
  );
end;
$$;

alter table public.misfit_trader_live_config enable row level security;
alter table public.misfit_trader_live_order_intents enable row level security;
alter table public.misfit_trader_live_audit_log enable row level security;

revoke all on public.misfit_trader_live_config from anon, authenticated;
revoke all on public.misfit_trader_live_order_intents from anon, authenticated;
revoke all on public.misfit_trader_live_audit_log from anon, authenticated;
revoke all on function public.misfit_trader_live_record_order_intent(text,text,text,numeric,numeric,text,numeric,text,text,uuid) from public, anon, authenticated;
revoke all on function public.misfit_trader_live_preflight() from public, anon;
grant execute on function public.misfit_trader_live_preflight() to authenticated;

insert into public.misfit_trader_live_audit_log(event_type,actor,details)
values (
  'LIVE_PREFLIGHT_LAYER_INSTALLED',
  'architect',
  jsonb_build_object(
    'provider','alpaca',
    'execution_enabled',false,
    'mode','disabled',
    'kill_switch_engaged',true,
    'manual_approval_required',true,
    'ai_authority_enabled',false,
    'money_moved',false
  )
);
