# Misfit Justice OS — Counsel Intake / Wayne Caldwell review portal

**Status:** owner-only preview, not a live attorney data room, not a finished Base44 migration.
**Branch:** `feat/legal-attorney-intake-20261028`
**Source migration:** [issue #34](https://github.com/MisfitMEdiAhouse/Misfit-media-designer-lite/issues/34).

## Implemented in this branch

- An owner-only "Counsel Review Workspace" within the existing authenticated `/legal-os` shell.
- Intake lanes for verified court dockets, government police/arrest reports, original evidence and counsel permissions.
- Source links to the **Utah First District (Cache County)** MyCourtCase / Xchange services and the Smithfield City Police Department GRAMA request instructions.
- Explicit 0 imported records and 0 attorney accounts activated, with no editable or pretend functionality.
- No sensitive documents, names of case participants, criminal allegations, or court PDFs in the public repository.

The parent page only renders this component after its existing owner-session check. **This check is not by itself a sufficient gate for private data**. Do not mount case data in the public browser bundle or expose `legal_private` to the anon Data API.

## Records intake: trusted sources, separate lanes

### Utah courts

1. Owner signs into [Utah MyCourtCase](https://www.utcourts.gov/en/self-help/services/mycase.html) and links eligible cases. The court may require identity verification.
2. Collect an official court-supplied docket or case-history export for each court/case. For public record lookup, use [Xchange](https://www.utcourts.gov/en/court-records-publications/records/xchange.html), subject to its payment/account gate.
3. For every case capture court jurisdiction, verified case ID, exact source URL, filing date, document identifiers and file hashes. A mention in old correspondence is only a lead, not a verified court record.
4. Keep nonpublic juvenile, sealed, protected and otherwise restricted records out of public or shared files. Record classification and authorized recipients.
5. Do not promise all cases are covered until district, justice and any juvenile case sources have been reconciled with the owner.

**Jurisdiction check:** Cache County, Logan is First Judicial District, not Second.

### Smithfield Police and arrest records

1. Use [Smithfield PD's records instructions](https://smithfieldutah.gov/248/Request-for-Records), including its mandatory GRAMA PD request form.
2. Request reports by subject, dates, incident numbers and known locations, with proof of entitlement and identity when required. Specify police incident / arrest / booking reports and relevant supplemental reports, media or bodycam records if applicable and legally available.
3. Record request ID, agency, submission date, status, fees, release restrictions, documents provided, and withheld/redacted document descriptions. Mark all as **pending** until received.
4. Note that booking, arrest, prosecution and conviction are distinct; do not infer one from another. Arrest data and police reports are not necessarily public.
5. The Smithfield PD records request itself **has not been submitted** by this frontend.

### Private import integrity

- No import until a writable, capacity-safe Misfit Cloud destination and authenticated source access have been verified.
- Files must be stored in a **private** object bucket with restricted signed URL lifetime, role/case membership gates, and audit trail. Never commit records, media or filenames containing private facts to source control.
- Staged metadata must track `source_system`, `source_id`, `sha256`, `source_collected_at`, `classification`, `case_id`, `review_status`, `owner_id`, `access_grants`, `retention`, and verified provenance.
- Preserve originals unmodified; keep derived/transcripts separate and clearly labeled.
- Build firm mode only after owner-signed attorney invitation and per-case server-verified access policy. An email address alone is **not authorization**.
- No autonomous legal advice, court filings, document submissions or distribution.

## Gates before production attorney access

- [ ] Confirm exact Base44 Legal Compass app ID and authenticated export; verify all source-backed pages/functions/records.
- [ ] Resolve `default_transaction_read_only=on` and storage capacity **without deleting or modifying preserved IP**.
- [ ] Deploy private schema with RLS, server-side case membership and object access checks; test cross-user and revoked-access behavior.
- [ ] Authenticate attorney identity and obtain owner approval for case-specific grants; **do not invite yet**.
- [ ] Securely acquire case history/documents from MyCourtCase/Xchange and Smithfield PD GRAMA, then validate record ownership and hashes.
- [ ] Test production and mobile UX, access logging, signed downloads, backups, and restoration.
- [ ] Verify migration parity and owner-approved cutover before claiming completion.

## Source references (public instructions only)

- https://www.utcourts.gov/en/about/miscellaneous/directory/map-of-judicial-districts.html
- https://www.utcourts.gov/en/self-help/services/mycase.html
- https://www.utcourts.gov/en/court-records-publications/records/xchange.html
- https://smithfieldutah.gov/248/Request-for-Records

**No live court record ingestion, no police request, no attorney account invitation, no production cutover have been performed by this branch.**
