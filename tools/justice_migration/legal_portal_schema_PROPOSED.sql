-- MISFIT JUSTICE OS: PROPOSED PRIVATE COUNSEL DATA MODEL (NOT APPLIED)
-- Reviewed source: existing private migration rails in legal_private.
-- DO NOT EXECUTE until database is writable, capacity-safe, backups exist,
-- source identity/parity and auth design are verified, and owner approves.
-- No actual attorney account is created or given access by this proposal.
-- Requires PostgreSQL with auth.users and service_role (Supabase).
-- All case data is server-only. The public React bundle is NOT a case API.

BEGIN;

CREATE SCHEMA IF NOT EXISTS legal_portal;
REVOKE ALL ON SCHEMA legal_portal FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA legal_portal TO service_role;

CREATE TABLE IF NOT EXISTS legal_portal.case_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  source_system text NOT NULL CHECK (source_system IN ('utah_mycourtcase','utah_xchange','base44','agency','manual_verified')),
  source_record_id text,
  court_name text,
  jurisdiction text,
  official_case_number text,
  case_category text CHECK (case_category IN ('criminal','family','protective_order','traffic','civil','juvenile','other')),
  verification_state text NOT NULL DEFAULT 'unverified' CHECK (verification_state IN ('unverified','source_confirmed','official_record_matched','disputed')),
  sensitivity text NOT NULL DEFAULT 'restricted' CHECK (sensitivity IN ('restricted','sealed','juvenile','attorney_work_product')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(owner_user_id, source_system, source_record_id)
);

CREATE TABLE IF NOT EXISTS legal_portal.case_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES legal_portal.case_files(id) ON DELETE CASCADE,
  member_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  role text NOT NULL CHECK (role IN ('owner','counsel','paralegal')),
  access_state text NOT NULL DEFAULT 'pending' CHECK (access_state IN ('pending','active','revoked')),
  approved_by_user_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT,
  verified_at timestamptz,
  activated_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT active_access_requires_verified_owner_approval CHECK (
    access_state <> 'active' OR
    (approved_by_user_id IS NOT NULL AND verified_at IS NOT NULL AND activated_at IS NOT NULL)
  ),
  CONSTRAINT revoked_access_has_timestamp CHECK (access_state <> 'revoked' OR revoked_at IS NOT NULL),
  UNIQUE(case_id, member_user_id)
);

CREATE TABLE IF NOT EXISTS legal_portal.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES legal_portal.case_files(id) ON DELETE RESTRICT,
  owner_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  evidence_type text NOT NULL CHECK (evidence_type IN ('court_filing','court_order','police_report','arrest_report','booking_record','audio','video','photo','correspondence','other')),
  document_state text NOT NULL DEFAULT 'source_lead' CHECK (document_state IN ('source_lead','acquired','verified','superseded','disputed')),
  source_system text NOT NULL,
  source_record_id text,
  source_url text,
  source_collected_at timestamptz,
  sha256_hex text CHECK (sha256_hex ~ '^[a-f0-9]{64}$'),
  private_bucket text,
  private_object_key text,
  original_filename text,
  sensitivity text NOT NULL DEFAULT 'restricted' CHECK (sensitivity IN ('restricted','sealed','juvenile','attorney_work_product')),
  review_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT stored_document_requires_hash CHECK (
    private_object_key IS NULL OR
    (private_bucket IS NOT NULL AND sha256_hex IS NOT NULL)
  ),
  CONSTRAINT verified_document_requires_source CHECK (
    document_state <> 'verified' OR
    (sha256_hex IS NOT NULL AND source_collected_at IS NOT NULL AND source_record_id IS NOT NULL)
  ),
  UNIQUE(private_bucket, private_object_key)
);

CREATE TABLE IF NOT EXISTS legal_portal.records_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  case_id uuid REFERENCES legal_portal.case_files(id) ON DELETE SET NULL,
  agency text NOT NULL,
  agency_reference text,
  request_category text NOT NULL CHECK (request_category IN ('court_records','police_report','arrest_report','booking_record','supplemental_report','other')),
  request_state text NOT NULL DEFAULT 'draft' CHECK (request_state IN ('draft','awaiting_owner_review','submitted','partially_fulfilled','fulfilled','denied','withdrawn')),
  submitted_at timestamptz,
  fulfilled_at timestamptz,
  source_url text,
  fee_approval_state text NOT NULL DEFAULT 'not_requested' CHECK (fee_approval_state IN ('not_requested','requested','approved','declined')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT submitted_request_must_have_timestamp CHECK (
    request_state NOT IN ('submitted','partially_fulfilled','fulfilled','denied') OR submitted_at IS NOT NULL
  )
);

CREATE TABLE IF NOT EXISTS legal_portal.access_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  case_id uuid REFERENCES legal_portal.case_files(id) ON DELETE SET NULL,
  document_id uuid REFERENCES legal_portal.documents(id) ON DELETE SET NULL,
  operation text NOT NULL CHECK (operation IN ('case_view','document_view','document_download','record_import','membership_request','membership_approve','membership_revoke','request_submit','access_denied')),
  decision text NOT NULL CHECK (decision IN ('allow','deny')),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  request_trace_id text
);

CREATE INDEX IF NOT EXISTS legal_portal_case_owner ON legal_portal.case_files(owner_user_id);
CREATE INDEX IF NOT EXISTS legal_portal_access_member ON legal_portal.case_access(member_user_id, access_state);
CREATE INDEX IF NOT EXISTS legal_portal_documents_case ON legal_portal.documents(case_id);
CREATE INDEX IF NOT EXISTS legal_portal_requests_owner ON legal_portal.records_requests(owner_user_id, request_state);
CREATE INDEX IF NOT EXISTS legal_portal_audit_case_time ON legal_portal.access_audit(case_id, occurred_at DESC);

-- Defense in depth: fail-closed RLS even if a SQL role is mistakenly granted privileges.
ALTER TABLE legal_portal.case_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_portal.case_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_portal.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_portal.records_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_portal.access_audit ENABLE ROW LEVEL SECURITY;

ALTER TABLE legal_portal.case_files FORCE ROW LEVEL SECURITY;
ALTER TABLE legal_portal.case_access FORCE ROW LEVEL SECURITY;
ALTER TABLE legal_portal.documents FORCE ROW LEVEL SECURITY;
ALTER TABLE legal_portal.records_requests FORCE ROW LEVEL SECURITY;
ALTER TABLE legal_portal.access_audit FORCE ROW LEVEL SECURITY;

REVOKE ALL ON ALL TABLES IN SCHEMA legal_portal FROM PUBLIC, anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA legal_portal FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON legal_portal.case_files,
 legal_portal.case_access, legal_portal.documents, legal_portal.records_requests TO service_role;
GRANT SELECT, INSERT ON legal_portal.access_audit TO service_role;

-- There are deliberately NO policies for anon or authenticated.
-- Do not expose legal_portal through Supabase PostgREST exposed schemas.
-- A future Edge/API service must independently verify:
--   valid authenticated JWT; owner/counsel identity; active per-case membership;
--   granted identity verification; document sensitivity and download policy;
--   audit event; owner consent for sharing/revocation; short-lived signed URL.
-- Never use user_metadata, UI email comparisons or direct object URLs for auth.
-- Storage must be a private bucket with bucket-level RLS before first import.
COMMIT;
