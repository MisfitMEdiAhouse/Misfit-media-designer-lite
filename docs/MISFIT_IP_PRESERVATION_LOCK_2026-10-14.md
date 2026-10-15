# MISFIT MEDIAHOUSE — IP PRESERVATION LOCK

Status: OWNER DIRECTIVE / ACTIVE  
Owner: Misfit Mediahouse  
Architect: Jonathan David Edward Price / Jonny Utah  
Effective: 2026-10-14

## Non-destructive preservation rule

The current Misfit Cloud storage/quota incident is **not authorization to delete, prune, truncate, rewrite, compact-away, or silently discard historical data, evidence, telemetry, source snapshots, recovery records, audit memory, GHOSBC artifacts, Trader evidence, sports research evidence, or any other Misfit Mediahouse intellectual property**.

No destructive cleanup is authorized by this document.

Any future destructive operation requires a separate explicit owner authorization after the affected material has been independently preserved and verified.

## Canonical preservation anchors

- Canonical company/control surface: https://misfitmediahouse.com/
- Canonical source repository: `MisfitMEdiAhouse/Misfit-media-designer-lite`
- Canonical backend/control plane: Misfit Cloud / Supabase project `cibcxqrqiqvzpardbdrw`
- Canonical production host: Vercel
- Origin/recovery artifacts: Google Drive originals referenced by the GHOSBC provenance manifest
- Base44: historical/legacy source evidence only where retained for provenance; not the canonical control plane

## Verified GHOSBC preservation state at lock creation

Read-only verification against Misfit Cloud returned:

- GHOSBC source assets: **382**
- GHOSBC entity models: **10**
- GHOSBC entity records: **311**
- GHOSBC function inventory records: **9**
- GHOSBC recovery-manifest records: **9**
- GHOSBC recovery checkpoints: **231**
- GHOSBC parity checks: **389**
- GHOSBC restore drills: **2**
- GHOSBC canon-lock rows: **1**

The latest restore drill was recorded as **PASS** and describes a non-destructive logical recovery verification of the preserved baseline with:

- 311/311 entity records
- private-schema RLS
- GitHub recovery source
- Supabase replacement runtime
- replacement functions active with JWT enforcement
- no Base44 source mutation
- no Base44 runtime dependency

## Private-kernel access boundary

At lock creation:

- all inspected `ghosbc_private` tables had Row Level Security enabled;
- no `anon`, `authenticated`, or `PUBLIC` table grants were observed for `ghosbc_private`;
- no `anon`, `authenticated`, or `PUBLIC` routine grants were observed for `ghosbc_private`.

Protected GHOSBC reconstruction material, Mother Language, Soul Cipher, private mapping tables, secret policy logic, authentication secrets, and internal audit payloads remain private.

Public demonstrations may expose sanitized behavior and decisions only.

## Google Drive provenance

The existing GHOSBC provenance manifest records original Google Drive backup artifacts by Drive file ID and, where verification was completed, SHA-256 digest.

The manifest explicitly marks origin copies for preservation and records exact-duplicate groups without deleting the originals.

Those originals remain part of the recovery chain and must not be silently consolidated or removed.

## Current storage incident

Misfit Cloud is currently above the Supabase Free database-size quota and has entered read-only mode.

This incident does not change the preservation policy.

Permitted recovery directions are non-destructive only unless separately authorized, including:

1. increasing storage/plan capacity;
2. creating a verified byte-preserving external archive or additional recovery environment;
3. copying historical datasets to another controlled store and verifying hashes/counts before any later owner-authorized source cleanup;
4. pausing high-volume collectors to prevent additional growth once writes are restored, if doing so does not destroy existing evidence.

No purchase, plan upgrade, data movement, or destructive cleanup is authorized merely by this preservation lock.

## Public-claim boundary

Misfit may truthfully state that its governance and trading-reconsideration systems have been tested against external AI-model outputs, including controlled tests using OpenAI API models.

Do **not** state or imply that OpenAI certified, endorsed, approved, partnered with, or independently validated GHOSBC unless such a relationship is separately documented.

## Change control

Finding a storage problem is not authorization to delete data.

Finding duplicated-looking material is not authorization to deduplicate it.

Finding a newer implementation is not authorization to erase historical evidence.

Finding a public-safe representation is not authorization to expose protected source material.

Preserve first. Verify provenance. Require explicit owner authority for destructive changes.
