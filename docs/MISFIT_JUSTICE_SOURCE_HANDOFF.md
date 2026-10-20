# Misfit Justice OS — private source handoff & parity preflight

**Status:** BLOCKED on actual Base44 source. This is not a migrated legal application.
**Canonical destination:** Misfit Cloud / Supabase `cibcxqrqiqvzpardbdrw` + `https://misfitmediahouse.com/legal-os`.
**Legacy identity:** `Misfit Justice OS – GHOSBC Legal Compass`, shown under `pricemedia82@gmail.com`.
**Source app ID:** UNVERIFIED. Do not use the unrelated GHOSBC OS Agent Brain Hub app ID.
**Owner directive:** no source deletion, historical data pruning, disclosure of case records, unauthorised spend, or landing page replacement.

## Gate 1 — capture the real source without modifying it

1. Sign into Base44 with the owner account and open **Misfit Justice OS – GHOSBC Legal Compass** in the **editor**. Preserve the complete editor URL (`https://app.base44.com/apps/<APP_ID>/editor/...`) and timestamp; verify app name and owner.
2. Export the complete source project ZIP using Base44's export control if available, or connect an isolated source-only GitHub repository. A code export does **not** include database rows; if export is plan-gated, do not purchase a plan without explicit approval.
3. In the Base44 Data dashboard, enumerate **every table**, including users, and export each to CSV. Export user-uploaded documents, storage assets, automation definitions, and relevant integrations separately. Retain source permissions, relationships, and timestamps.
4. Store the originals privately. Do **not** commit ZIPs, CSVs, identity records, case documents, secrets, bearer tokens, service-role keys, or generated inventories to this repository.
5. When source and export are accessible in an authenticated workspace, inventory and hash them **before** translating code, schemas, or records.

## Gate 2 — local private inventory

Python 3.9+ standard library only. This operates on a private trusted local machine and never contacts Base44/Supabase. Do not run untrusted exported application code.

```bash
python3 tools/justice_migration/source_preflight.py \
  --zip /private/base44-justice-export.zip \
  --csv-dir /private/justice-data-csv \
  --app-id <VERIFIED_APP_ID> \
  --out /private/justice-source-inventory.json
```

The JSON inventory includes file paths, sizes, SHA-256 digests, categories, source ZIP checksum, CSV table counts and **record counts**. It intentionally contains no case/CSV row values. The tool cannot establish app identity or behavioral parity on its own. **Treat its output as private**, because paths and table names can disclose information. It refuses to overwrite originals and rejects unsafe ZIP entries.

Additional required inventories: uploaded case files and hashes, app/firm/user permissions, schema constraints, unique IDs, record counts including deleted/archived items where authorized, and server-side functions/automations.

## Gate 3 — migrate without loss

1. Verify original app identity and export completeness, including code, data, users, attachments and integration contracts. Record explicit extraction cutoff.
2. Ensure a **writable**, adequately sized protected Misfit Cloud destination. The current project is ~1,573 MB with database default read-only **on**. Never bypass storage limits, purchase capacity, or delete other Misfit IP without specific owner approval.
3. Add **source-derived** private domain tables and RLS with owner/firm/case isolation, keeping migration rail schema `legal_private` private. No invented cases, clients, attorney accounts, or court records.
4. Ingest original rows and files idempotently with source IDs, hashes and referential integrity. Preserve audit/legal retention and timestamps; restrict access to case materials.
5. Replace actual Base44 SDK/auth/functions/integrations after examining source behavior. No service-role keys in browser; privileged functions require explicit owner and case authorization.
6. Implement both Self-Defense and Firm Mode in the existing private `/legal-os` route. Do not change the public root landing page.
7. Verify route/function parity, count/hash parity, storage object parity, permissions/RLS, owner login, multi-tenant isolation, mobile UX, failure handling and a **restorable** private backup.
8. Only after signed-off parity and recovery checks change the migration ledger to `completed`. Do not remove or mutate the original Base44 source; archive it after explicit cutover.

## Current source-backed baseline

- Base44 identity: name/owner from preserved app listing; exact URL/ID **missing**.
- Original code assets captured: **0**
- Original entity schemas captured: **0**
- Original data records captured: **0**
- Original functions captured: **0**
- Reconstructed module labels awaiting source confirmation: **6**
- Production `/legal-os` route: reachable private migration interface; **not** full Legal OS functionality
- Restore drill: **not passed**
- GitHub tracking: [Migration task #34](https://github.com/MisfitMEdiAhouse/Misfit-media-designer-lite/issues/34)

**Do not report that the Base44 exit is complete until these gates pass.**
