-- Trader control-RPC hardening + factory dispatcher secret rotation
-- Production-verified on 2026-10-04.

revoke execute on function public.misfit_trader_live_audit_append_only()
from public, anon, authenticated;

revoke execute on function public.process_misfit_trader_position_responses()
from public, anon, authenticated;

revoke execute on function public.queue_misfit_trader_position_requests()
from public, anon, authenticated;

revoke execute on function public.run_misfit_trader_score_cycle()
from public, anon, authenticated;

revoke execute on function public.run_misfit_trader_shadow_cycle()
from public, anon, authenticated;

create table if not exists public.misfit_internal_dispatch_auth_keys (
  key_name text primary key,
  key_sha256 text not null check (length(key_sha256)=64),
  scope text not null check (scope in ('factory_dispatch')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  rotated_at timestamptz
);

alter table public.misfit_internal_dispatch_auth_keys enable row level security;
revoke all on public.misfit_internal_dispatch_auth_keys from public, anon, authenticated;
grant select on public.misfit_internal_dispatch_auth_keys to service_role;

do $$
declare
  v_secret text;
begin
  if not exists (
    select 1 from vault.secrets where name='MISFIT_FACTORY_DISPATCH_KEY_V2'
  ) then
    v_secret := encode(gen_random_bytes(32),'hex');
    perform vault.create_secret(
      v_secret,
      'MISFIT_FACTORY_DISPATCH_KEY_V2',
      'Scoped internal key for Misfit factory dispatcher to noop Edge Function.'
    );
  end if;
end
$$;

insert into public.misfit_internal_dispatch_auth_keys(
  key_name,key_sha256,scope,active,created_at
)
select
  'MISFIT_FACTORY_DISPATCH_KEY_V2',
  encode(digest(decrypted_secret,'sha256'),'hex'),
  'factory_dispatch',
  true,
  now()
from vault.decrypted_secrets
where name='MISFIT_FACTORY_DISPATCH_KEY_V2'
on conflict (key_name) do update
set key_sha256=excluded.key_sha256,
    scope=excluded.scope,
    active=true,
    rotated_at=case
      when public.misfit_internal_dispatch_auth_keys.key_sha256<>excluded.key_sha256 then now()
      else public.misfit_internal_dispatch_auth_keys.rotated_at
    end;

create or replace function public.dispatch_supported_factory_jobs()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  r record;
  n integer := 0;
  v_dispatch_key text;
begin
  select decrypted_secret into v_dispatch_key
  from vault.decrypted_secrets
  where name='MISFIT_FACTORY_DISPATCH_KEY_V2'
  limit 1;

  if v_dispatch_key is null or length(v_dispatch_key) < 32 then
    raise exception 'factory_dispatch_key_unavailable';
  end if;

  for r in
    select id
    from public.agent_factory_jobs
    where status='queued'
      and job_type in (
        'owner_revenue_execution',
        'revenue_hunter_activation',
        'operation_crypto_misfit',
        'crypto_early_stage_surveillance',
        'crypto_narrative_heat_radar',
        'crypto_revenue_hunt',
        'misfit_agents_governance_brain_integration',
        'gta_growth_onboarding_v1',
        'gta_growth_acquisition_v1'
      )
    order by priority desc, created_at asc
    limit 12
  loop
    perform net.http_post(
      url := 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/noop',
      headers := jsonb_build_object(
        'content-type','application/json',
        'x-misfit-dispatch-key',v_dispatch_key
      ),
      body := jsonb_build_object('job_id',r.id)
    );
    n := n + 1;
  end loop;

  return n;
end
$$;

revoke execute on function public.dispatch_supported_factory_jobs()
from public, anon, authenticated;


-- 2026-10-05: the public UI calls only misfit_trader_shadow_public()
-- and misfit_trader_reconsideration_latest_report(). shadow_metrics() is an
-- internal helper and does not need direct client execution.
revoke execute on function public.misfit_trader_shadow_metrics()
from public, anon, authenticated;
