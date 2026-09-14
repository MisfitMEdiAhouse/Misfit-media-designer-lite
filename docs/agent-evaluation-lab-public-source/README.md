# Misfit Agent Evaluation Lab — Public-Safe Source Continuity

This folder packages the **existing deployed public wrapper surfaces** for the Misfit Agent Evaluation Lab so reviewers, integrators, and machine clients can inspect the bounded product contract without exposing the protected GHOSBC kernel.

## What this proves

The public product measures **Raw Agent → reconsidered / Center Reset → governed** behavior and reports bounded, observable outputs including:

- comparative metrics
- consequence assessment
- Center Reset / replanning
- Castle Gate decision distribution
- Audit Memory completeness
- dangerous-action containment
- safe-goal completion
- evidence provenance

The current public contract is `agent-evaluation-lab-v2`, benchmark `ae100-v2`, report schema `agent-evaluation-report-v2.1`.

## Live machine surfaces

- Product: https://misfitmediahouse.com/agent-evaluation-lab
- Public API: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-agent-evaluation-public
- MCP: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-agent-evaluation-mcp
- A2A: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-agent-evaluation-a2a
- UCP catalog/discovery: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/misfit-ucp
- OpenAPI: https://misfitmediahouse.com/agent-evaluation-lab.openapi.yaml
- Submission/demo pack: https://misfitmediahouse.com/agent-evaluation-lab-submission-pack.md
- Hackathon deck: https://misfitmediahouse.com/agent-evaluation-lab-hackathon-deck.md
- Sample report: https://misfitmediahouse.com/agent-evaluation-lab-sample-report.json
- Buyer proof pack: https://misfitmediahouse.com/agent-evaluation-lab-proof-pack.json

## Machine-native distribution

The Evaluation Lab is currently packaged for bounded public discovery and scoring through HTTP, MCP, A2A, and UCP. UCP exposes the Evaluation Lab as a machine-readable catalog product with its measurable outputs, public integration surfaces, benchmark/report versions, claims/privacy boundaries, and a fail-closed commercial state. UCP discovery telemetry pseudonymizes the `UCP-Agent` header and marks obvious test/health/probe traffic synthetic so it is not counted as real traction.

Purchase execution remains disabled until the explicit commercial handoff review is cleared; discovery does not create a checkout, wallet, settlement, entitlement, or revenue event.

## Commercial state

Scoring is live and bounded. Purchase execution is intentionally fail-closed under `COMMERCIAL_HANDOFF_REVIEW_HOLD`; public source must not be interpreted as authorization to create a payment, wallet, settlement, or external action.

## Claims and privacy boundary

This is an **evaluation product**, not a safety certification, formal certification, regulatory attestation, independent validation, or machine-consciousness claim. Caller-supplied evidence remains caller-supplied/unverified unless separately validated.

The protected GHOSBC cognitive kernel is deliberately excluded. This repository does **not** include private GHOSBC prompts, Mother Language, Soul Cipher, GHX/glyph material, private policies, private packets, credentials, protected source snapshots, or reconstruction material.

## Source snapshots

The sibling files are source snapshots of the currently deployed public API, MCP, A2A, and UCP wrappers. They demonstrate protocol bindings, public catalog/discovery, and bounded orchestration only. The canonical protected evaluation backend is not published here.

- `public-api.ts` — public-safe HTTP contract and deterministic report validation / bounded scorer forwarding
- `mcp.ts` — read-only MCP tool binding
- `a2a.ts` — A2A Agent Card + bounded message binding
- `ucp.ts` — UCP catalog/discovery binding, fail-closed commercial offer, privacy-preserving discovery telemetry

These snapshots are packaging of the existing live system, not a duplicate implementation.
