-- Misfit Legal OS Base44 -> Misfit Cloud migration foundation
-- 2026-10-17
-- This migration intentionally creates only migration/recovery rails.
-- No legal-domain entity model is invented before the Base44 source is inventoried.

create schema if not exists legal_private;
revoke all on schema legal_private from public, anon, authenticated;

create table if not exists legal_private.migration_runs (
  id uuid primary key default gen_random_uuid(),
  source_platform text not null default 'Base44',
  source_app_id text,
  source_app_name text not null default 'Misfit Legal OS',
  source_account_hint text,
  destination_backend text not null default 'Misfit Cloud / Supabase',
  destination_site text not null default 'https://misfitmediahouse.com',
  status text not null check (status in (
    'awaiting_source_connection',
    'source_inventory',
    'absorbing',
    'parity_validation',
    'completed',
    'blocked'
  )),
  source_connection_state text not null,
  source_snapshot_cutoff timestamptz,
  counts jsonb not null default '{}'::jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists legal_private.source_assets (
  id uuid primary key default gen_random_uuid(),
  migration_run_id uuid not null references legal_private.migration_runs(id) on delete cascade,
  asset_key text not null,
  asset_type text not null,
  source_path text,
  source_sha256 text,
  source_modified_at timestamptz,
  source_metadata jsonb not null default '{}'::jsonb,
  content_snapshot jsonb,
  absorbed_at timestamptz,
  unique(migration_run_id,asset_key)
);

create table if not exists legal_private.entity_models (
  id uuid primary key default gen_random_uuid(),
  migration_run_id uuid not null references legal_private.migration_runs(id) on delete cascade,
  model_key text not null,
  source_schema jsonb,
  source_record_count integer,
  absorbed_record_count integer not null default 0,
  migration_status text not null default 'pending' check (migration_status in (
    'pending','inventory_only','absorbing','parity_pass','blocked','complete'
  )),
  notes text,
  unique(migration_run_id,model_key)
);

create table if not exists legal_private.entity_records (
  id uuid primary key default gen_random_uuid(),
  migration_run_id uuid not null references legal_private.migration_runs(id) on delete cascade,
  model_key text not null,
  source_record_id text not null,
  source_updated_at timestamptz,
  payload jsonb not null,
  payload_sha256 text,
  absorbed_at timestamptz not null default now(),
  unique(migration_run_id,model_key,source_record_id)
);

create table if not exists legal_private.function_inventory (
  id uuid primary key default gen_random_uuid(),
  migration_run_id uuid not null references legal_private.migration_runs(id) on delete cascade,
  function_key text not null,
  source_path text,
  source_sha256 text,
  behavior_contract jsonb not null default '{}'::jsonb,
  replacement_ref text,
  migration_status text not null default 'pending' check (migration_status in (
    'pending','source_only','reconstructed','replacement_active','parity_pass','blocked','complete'
  )),
  notes text,
  unique(migration_run_id,function_key)
);

create table if not exists legal_private.route_inventory (
  id uuid primary key default gen_random_uuid(),
  migration_run_id uuid not null references legal_private.migration_runs(id) on delete cascade,
  route_key text not null,
  source_route text,
  destination_route text,
  auth_requirement text,
  migration_status text not null default 'pending' check (migration_status in (
    'pending','source_only','implemented','verified','blocked','complete'
  )),
  notes text,
  unique(migration_run_id,route_key)
);

create table if not exists legal_private.parity_checks (
  id uuid primary key default gen_random_uuid(),
  migration_run_id uuid not null references legal_private.migration_runs(id) on delete cascade,
  component_type text not null,
  component_key text not null,
  check_type text not null,
  status text not null check (status in ('pending','pass','blocked','fail','accepted_divergence')),
  evidence jsonb not null default '{}'::jsonb,
  checked_at timestamptz not null default now()
);

create table if not exists legal_private.recovery_manifest (
  manifest_key text primary key,
  migration_run_id uuid references legal_private.migration_runs(id) on delete set null,
  status text not null check (status in ('in_progress','blocked','complete','superseded')),
  manifest jsonb not null default '{}'::jsonb,
  restore_drill_passed boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists legal_private.recovery_checkpoints (
  checkpoint_key text primary key,
  migration_run_id uuid references legal_private.migration_runs(id) on delete set null,
  status text not null check (status in ('pending','pass','blocked','superseded')),
  evidence jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table legal_private.migration_runs enable row level security;
alter table legal_private.source_assets enable row level security;
alter table legal_private.entity_models enable row level security;
alter table legal_private.entity_records enable row level security;
alter table legal_private.function_inventory enable row level security;
alter table legal_private.route_inventory enable row level security;
alter table legal_private.parity_checks enable row level security;
alter table legal_private.recovery_manifest enable row level security;
alter table legal_private.recovery_checkpoints enable row level security;

revoke all on all tables in schema legal_private from public, anon, authenticated;

insert into legal_private.migration_runs(
  source_platform,
  source_app_name,
  source_account_hint,
  destination_backend,
  destination_site,
  status,
  source_connection_state,
  counts,
  notes
)
select
  'Base44',
  'Misfit Legal OS',
  'Expected workspace: misfitmediahouse@gmail.com; exact Base44 app id not yet recovered',
  'Misfit Cloud / Supabase',
  'https://misfitmediahouse.com',
  'awaiting_source_connection',
  'Base44 connector unavailable in the migration session; no reliable Legal OS app id/source URL has been recovered yet',
  jsonb_build_object(
    'source_assets',0,
    'entity_models',0,
    'entity_records',0,
    'functions',0,
    'routes',0
  ),
  'Foundation only. Do not create domain entities until a read-only Base44 inventory has been captured and hashed.'
where not exists (
  select 1 from legal_private.migration_runs
  where source_app_name='Misfit Legal OS'
    and status in ('awaiting_source_connection','source_inventory','absorbing','parity_validation')
);

insert into legal_private.recovery_manifest(
  manifest_key,migration_run_id,status,manifest,restore_drill_passed,updated_at
)
select
  'misfit_legal_os_base44_migration',
  id,
  'in_progress',
  jsonb_build_object(
    'source_platform','Base44',
    'source_app_name','Misfit Legal OS',
    'source_app_id',null,
    'destination_backend','Misfit Cloud / Supabase',
    'destination_site','https://misfitmediahouse.com',
    'source_connection','unavailable',
    'domain_entities_invented',false,
    'base44_mutated',false,
    'public_route_launched',false,
    'next_required_step','read_only_source_inventory'
  ),
  false,
  now()
from legal_private.migration_runs
where source_app_name='Misfit Legal OS'
order by created_at desc
limit 1
on conflict(manifest_key) do update
set migration_run_id=excluded.migration_run_id,
    status='in_progress',
    manifest=excluded.manifest,
    restore_drill_passed=false,
    updated_at=now();

insert into legal_private.recovery_checkpoints(
  checkpoint_key,migration_run_id,status,evidence,updated_at
)
select
  'legal_os_destination_foundation_2026_10_17',
  id,
  'pass',
  jsonb_build_object(
    'private_schema','legal_private',
    'rls_enabled',true,
    'anon_access',false,
    'authenticated_access',false,
    'source_inventory_complete',false,
    'base44_source_mutated',false,
    'public_site_modified',false
  ),
  now()
from legal_private.migration_runs
where source_app_name='Misfit Legal OS'
order by created_at desc
limit 1
on conflict(checkpoint_key) do update
set migration_run_id=excluded.migration_run_id,
    status=excluded.status,
    evidence=excluded.evidence,
    updated_at=excluded.updated_at;
