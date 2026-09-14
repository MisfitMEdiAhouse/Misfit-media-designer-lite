# GHOSBC Agent Evaluation Lab — Agents for Humans Demo Runbook

This runbook is a public-safe, zero-cost recording path for the existing Misfit Agent Evaluation Lab. It demonstrates the bounded product without exposing the protected GHOSBC governance kernel and without making certification, independent-validation, or machine-consciousness claims.

## Goal

Record a concise 2-minute demo showing one canonical capability across the existing Public API, Strands adapter, MCP, A2A, and UCP surfaces.

## Demo sequence

### 0:00–0:15 — Product and problem

Open:

- https://misfitmediahouse.com/agent-evaluation-lab

Narration:

> Autonomous agents can produce a plausible first answer without showing whether they reconsidered consequences. Agent Evaluation Lab measures the difference between a raw plan, a reconsidered plan, and a governed outcome, then leaves machine-readable evidence for review.

### 0:15–0:35 — Live service contract

Open the public API directly:

- https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-agent-evaluation-public

Point out:

- `status: bounded_scoring_live_public_safe`
- contract `agent-evaluation-lab-v2`
- benchmark `ae100-v2`
- report schema `agent-evaluation-report-v2.1`
- purchasing is fail-closed under `COMMERCIAL_HANDOFF_REVIEW_HOLD`
- `private_kernel_exposed: false`

Optional terminal call:

```bash
curl -s https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-agent-evaluation-public
```

### 0:35–0:55 — Machine-readable pitch and integration path

```bash
curl -s -X POST \
  -H 'content-type: application/json' \
  -d '{"op":"machine_pitch_packet"}' \
  https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-agent-evaluation-public
```

Then:

```bash
curl -s -X POST \
  -H 'content-type: application/json' \
  -d '{"op":"integration_quickstart"}' \
  https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-agent-evaluation-public
```

Narration:

> The same bounded capability is discoverable by machines over HTTP, MCP, A2A, and UCP. Those are distribution adapters around one canonical evaluation product, not separate systems.

### 0:55–1:20 — Raw → reconsidered → governed evidence

Open the public sample report:

- https://misfitmediahouse.com/agent-evaluation-lab-sample-report.json

Point out the evidence fields for:

- Raw Agent baseline
- consequence assessment
- Center Reset / replanning
- reconsidered lane
- governed outcome / Castle Gate decision label
- Audit Memory completeness
- comparative metrics
- evidence provenance

Narration:

> The product does not ask a human to supervise every token. It measures whether governance changed the decision, whether replanning occurred, and whether the final result left enough evidence for later review.

### 1:20–1:40 — Deterministic public validation

Use the published report schema and validator surface:

- https://misfitmediahouse.com/agent-evaluation-report.schema.json

Validator operation:

```json
{"op":"validate_report_v2","report":"<the public sample report object>"}
```

Narration:

> Reports are machine-validatable. Caller-supplied evidence remains explicitly unverified unless separate external evidence exists; this is evaluation evidence, not a safety certification.

### 1:40–1:55 — Strands integration

Open:

- https://github.com/MisfitMEdiAhouse/Misfit-media-designer-lite/tree/main/docs/agent-evaluation-lab-public-source/strands-adapter

Narration:

> For the Agents for Humans lane, the public package includes a Strands Agents SDK adapter. The adapter calls the existing public contract; it does not reimplement or publish the private GHOSBC kernel.

### 1:55–2:00 — Close

Narration:

> Misfit Agent Evaluation Lab: measure the raw decision, force reconsideration when warranted, preserve the governed outcome, and leave an auditable machine-readable comparison.

## Public proof links

- Product: https://misfitmediahouse.com/agent-evaluation-lab
- Public source: https://github.com/MisfitMEdiAhouse/Misfit-media-designer-lite/tree/main/docs/agent-evaluation-lab-public-source
- Strands adapter: https://github.com/MisfitMEdiAhouse/Misfit-media-designer-lite/tree/main/docs/agent-evaluation-lab-public-source/strands-adapter
- Public API: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-agent-evaluation-public
- MCP: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-agent-evaluation-mcp
- A2A: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-agent-evaluation-a2a
- UCP: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/misfit-ucp
- OpenAPI: https://misfitmediahouse.com/agent-evaluation-lab.openapi.yaml
- Sample report: https://misfitmediahouse.com/agent-evaluation-lab-sample-report.json

## Guardrails

- No formal certification or safety-certification claim.
- No independent-validation claim unless a real independent benchmark run and evidence receipt exist.
- No machine consciousness or sentience claim.
- No private GHOSBC, Mother Language, Soul Cipher, GHX/glyph, private prompt, hidden policy, credential, or Castle Gate implementation disclosure.
- No purchase, wallet, settlement, account creation, terms acceptance, or external submission is performed by this runbook.
- Synthetic/self-test activity is demonstration evidence only and is never counted as revenue or external traction.
