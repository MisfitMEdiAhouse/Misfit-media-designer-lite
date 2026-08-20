create table if not exists public.business_scrub_audits (
  id uuid primary key default gen_random_uuid(),
  domain text not null,
  domain_hash text not null,
  final_url text,
  status_code integer,
  business_type text not null default 'unknown',
  platform text not null default 'Unknown',
  score smallint not null check (score between 0 and 100),
  grade text not null check (grade in ('A', 'B', 'C', 'D', 'F')),
  category_scores jsonb not null default '{}'::jsonb,
  signals jsonb not null default '{}'::jsonb,
  revenue_leaks jsonb not null default '[]'::jsonb,
  recommended_offer text,
  created_at timestamptz not null default now()
);

alter table public.business_scrub_audits enable row level security;

revoke all on table public.business_scrub_audits from anon, authenticated;
grant select, insert on table public.business_scrub_audits to service_role;

create index if not exists business_scrub_audits_domain_created_idx
  on public.business_scrub_audits (domain_hash, created_at desc);

create index if not exists business_scrub_audits_created_idx
  on public.business_scrub_audits (created_at desc);

comment on table public.business_scrub_audits is
  'Service-role-only public-signal diagnostics. No credentials, raw HTML, contact data, or private analytics are stored.';
