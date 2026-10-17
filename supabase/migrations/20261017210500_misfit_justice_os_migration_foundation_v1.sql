-- Misfit Justice OS / Legal OS Base44 migration foundation
-- Canonical target: Misfit Cloud + misfitmediahouse.com
-- Legacy source remains read-only provenance. This migration does not claim source parity.
-- The connected SQL session on 2026-10-17 defaulted to read-only; production foundation
-- was applied with an explicit transaction READ WRITE override. Normal migration runners
-- should already execute with write authority.

create schema if not exists legal_private;
revoke all on schema legal_private from public, anon, authenticated;

create table if not exists legal_private.migration_runs (
  id uuid primary key default gen_random_uuid(),
  migration_key text unique not null,
  source_system text not null default 'Base44',
  source_app_name text not null,
  source_app_id text,
  source_owner_hint text,
  target_backend text not null default 'Misfit Cloud / Supabase',
  target_site text not null default 'misfitmediahouse.com',
  status text not null check (status in (
    'started_source_connection_required',
    'source_inventory_in_progress',
    'source_inventory_complete',
    'data_absorption_in_progress',
    'parity_validation',
    'completed'
  )),
  legal_boundary jsonb not null default '{}'::jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists legal_private.source_evidence (
  id uuid primary key default gen_random_uuid(),
  migration_key text not null references legal_private.migration_runs(migration_key) on delete cascade,
  source_type text not null,
  source_ref text not null,
  source_title text,
  evidence_text text not null,
  confidence text not null check (confidence in ('verified','reconstructed','unverified')),
  created_at timestamptz not null default now(),
  unique(migration_key,source_type,source_ref)
);

create table if not exists legal_private.source_assets (
  id uuid primary key default gen_random_uuid(),
  migration_key text not null references legal_private.migration_runs(migration_key) on delete cascade,
  source_path text not null,
  asset_type text not null,
  content_sha256 text,
  source_modified_at timestamptz,
  source_payload jsonb,
  absorption_status text not null default 'cataloged'
    check (absorption_status in ('cataloged','captured','mapped','verified','blocked')),
  notes text,
  created_at timestamptz not null default now(),
  unique(migration_key,source_path)
);

create table if not exists legal_private.entity_inventory (
  id uuid primary key default gen_random_uuid(),
  migration_key text not null references legal_private.migration_runs(migration_key) on delete cascade,
  entity_name text not null,
  schema_json jsonb,
  source_record_count integer,
  captured_record_count integer not null default 0,
  migration_status text not null default 'pending_source_inventory',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(migration_key,entity_name)
);

create table if not exists legal_private.entity_records (
  id uuid primary key default gen_random_uuid(),
  migration_key text not null references legal_private.migration_runs(migration_key) on delete cascade,
  entity_name text not null,
  source_record_id text not null,
  source_payload jsonb not null,
  source_created_at timestamptz,
  source_updated_at timestamptz,
  mapped_target text,
  parity_status text not null default 'unverified'
    check (parity_status in ('unverified','pass','blocked','intentional_divergence')),
  created_at timestamptz not null default now(),
  unique(migration_key,entity_name,source_record_id)
);

create table if not exists legal_private.function_inventory (
  id uuid primary key default gen_random_uuid(),
  migration_key text not null references legal_private.migration_runs(migration_key) on delete cascade,
  function_name text not null,
  source_path text,
  source_sha256 text,
  replacement_target text,
  migration_status text not null default 'pending_source_inventory',
  parity_status text not null default 'unverified',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(migration_key,function_name)
);

create table if not exists legal_private.route_inventory (
  id uuid primary key default gen_random_uuid(),
  migration_key text not null references legal_private.migration_runs(migration_key) on delete cascade,
  route_key text not null,
  legacy_label text not null,
  intended_target_path text,
  mode text,
  source_status text not null
    check (source_status in ('verified_source','reconstructed_prior_context','unverified')),
  migration_status text not null default 'pending_source_confirmation',
  public_allowed boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  unique(migration_key,route_key)
);

create table if not exists legal_private.parity_checks (
  id uuid primary key default gen_random_uuid(),
  migration_key text not null references legal_private.migration_runs(migration_key) on delete cascade,
  component_key text not null,
  check_type text not null,
  status text not null check (status in ('pending','pass','blocked','accepted_divergence')),
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists legal_private.recovery_manifest (
  migration_key text primary key references legal_private.migration_runs(migration_key) on delete cascade,
  status text not null default 'source_connection_required',
  manifest jsonb not null default '{}'::jsonb,
  restore_drill_passed boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table legal_private.migration_runs enable row level security;
alter table legal_private.source_evidence enable row level security;
alter table legal_private.source_assets enable row level security;
alter table legal_private.entity_inventory enable row level security;
alter table legal_private.entity_records enable row level security;
alter table legal_private.function_inventory enable row level security;
alter table legal_private.route_inventory enable row level security;
alter table legal_private.parity_checks enable row level security;
alter table legal_private.recovery_manifest enable row level security;

revoke all on all tables in schema legal_private from public, anon, authenticated;
revoke all on all sequences in schema legal_private from public, anon, authenticated;

insert into legal_private.migration_runs (
  migration_key, source_app_name, source_owner_hint, status, legal_boundary, notes
) values (
  'misfit_justice_os_base44_exit_v1',
  'Misfit Justice OS – GHOSBC Legal Compass',
  'legacy Base44 workspace associated with pricemedia82@gmail.com',
  'started_source_connection_required',
  jsonb_build_object(
    'product_type','mock legal cockpit / organizational workflow system',
    'modes',jsonb_build_array('Self-Defense Mode','Firm Mode'),
    'legal_advice_claim',false,
    'filing_authority_claim',false,
    'court_submission_authority',false,
    'automatic_legal_action',false,
    'source_preservation_required',true,
    'base44_mutation_allowed',false
  ),
  'Migration started from preserved evidence. Exact Base44 app ID/source tree is not currently connected, so source ingestion/parity cannot yet be claimed complete.'
)
on conflict(migration_key) do update set
  status=excluded.status,
  legal_boundary=excluded.legal_boundary,
  notes=excluded.notes,
  updated_at=now();

insert into legal_private.source_evidence (
  migration_key, source_type, source_ref, source_title, evidence_text, confidence
) values
(
  'misfit_justice_os_base44_exit_v1',
  'chatgpt_library_file',
  'file_000000008fdc71fba251a5f576776f8a',
  'Pasted text(290).txt',
  'Verified preserved listing names the app Misfit Justice OS – GHOSBC Legal Compass and describes it as a mock legal cockpit for organizing individual case information in Self-Defense Mode and conceptual workflow intelligence for law firms in Firm Mode; it explicitly says the tool focuses on structure and organization, not legal advice or filings.',
  'verified'
),
(
  'misfit_justice_os_base44_exit_v1',
  'chatgpt_library_image',
  'file_000000003f7071f8aa288118d0c0e738',
  'Base44 app listing screenshot',
  'Preserved Base44 screenshot shows Misfit Justice OS – GHOSBC Legal among the legacy Misfit applications.',
  'verified'
),
(
  'misfit_justice_os_base44_exit_v1',
  'prior_conversation_context',
  'misfit-justice-dark-matter-justice-2025-12-24',
  'Prior Misfit Justice / Dark Matter Justice architecture',
  'Prior project context describes Misfit Justice and Dark Matter Justice as mirror apps sharing GHOSBC schemas/core engines; Misfit serves self-represented users and Dark Matter serves firms.',
  'reconstructed'
)
on conflict(migration_key,source_type,source_ref) do nothing;

insert into legal_private.route_inventory (
  migration_key, route_key, legacy_label, intended_target_path, mode,
  source_status, migration_status, public_allowed, notes
) values
('misfit_justice_os_base44_exit_v1','case_vault','My Case Vault',null,'self_defense','reconstructed_prior_context','pending_source_confirmation',false,'Known from prior project context; exact Base44 route/file name still requires source verification.'),
('misfit_justice_os_base44_exit_v1','timeline_strategy','Timeline & Strategy',null,'self_defense','reconstructed_prior_context','pending_source_confirmation',false,'Known from prior project context; exact Base44 route/file name still requires source verification.'),
('misfit_justice_os_base44_exit_v1','playbooks','Playbooks',null,'shared','reconstructed_prior_context','pending_source_confirmation',false,'Known from prior project context; exact Base44 route/file name still requires source verification.'),
('misfit_justice_os_base44_exit_v1','co_counsel','Co-Counsel',null,'shared','reconstructed_prior_context','pending_source_confirmation',false,'Known from prior project context; exact Base44 route/file name still requires source verification.'),
('misfit_justice_os_base44_exit_v1','allies_funding','Allies & Funding',null,'shared','reconstructed_prior_context','pending_source_confirmation',false,'Known from prior project context; exact Base44 route/file name still requires source verification.'),
('misfit_justice_os_base44_exit_v1','wellness','Wellness',null,'shared','reconstructed_prior_context','pending_source_confirmation',false,'Known from prior project context; exact Base44 route/file name still requires source verification.')
on conflict(migration_key,route_key) do nothing;

insert into legal_private.parity_checks (
  migration_key, component_key, check_type, status, evidence
)
select
  'misfit_justice_os_base44_exit_v1',
  'source_connection',
  'base44_source_access',
  'blocked',
  jsonb_build_object(
    'reason','Base44 connector/source app is not available in the current tool session.',
    'exact_app_id_known',false,
    'source_code_inventory_complete',false,
    'entity_inventory_complete',false,
    'function_inventory_complete',false
  )
where not exists (
  select 1 from legal_private.parity_checks
  where migration_key='misfit_justice_os_base44_exit_v1'
    and component_key='source_connection'
    and check_type='base44_source_access'
);

insert into legal_private.recovery_manifest (
  migration_key, status, manifest, restore_drill_passed
) values (
  'misfit_justice_os_base44_exit_v1',
  'source_connection_required',
  jsonb_build_object(
    'canonical_target_backend','Misfit Cloud / Supabase',
    'canonical_target_repo','MisfitMEdiAhouse/Misfit-media-designer-lite',
    'canonical_target_site','https://misfitmediahouse.com',
    'legacy_source','Base44',
    'legacy_app_name','Misfit Justice OS – GHOSBC Legal Compass',
    'legacy_app_id',null,
    'verified_evidence_count',2,
    'reconstructed_route_count',6,
    'source_assets_captured',0,
    'entity_models_captured',0,
    'entity_records_captured',0,
    'functions_captured',0,
    'base44_mutated',false,
    'legal_advice_claim',false,
    'filing_authority_claim',false
  ),
  false
)
on conflict(migration_key) do update set
  status=excluded.status,
  manifest=excluded.manifest,
  restore_drill_passed=false,
  updated_at=now();
