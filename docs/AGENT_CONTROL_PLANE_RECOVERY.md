# Misfit Agent Control Plane — Public-Safe Recovery Guide

This guide exists so the Misfit machine/agent stack can be reconstructed without relying on any single chat thread, browser session, or operator memory.

It intentionally contains **no credentials, private cognitive-kernel prompts, protected language/cipher material, protected mappings, founder-private packets, secret policy tables, or reconstruction material**.

## Canonical public anchors

- Company/control surface: `https://misfitmediahouse.com/agents`
- Static stack manifest: `https://misfitmediahouse.com/agent-stack.json`
- Agent-readable context: `https://misfitmediahouse.com/llms.txt`
- UCP business profile: `https://misfitmediahouse.com/.well-known/ucp`
- Provider procurement UI: `https://misfitmediahouse.com/agent-provider-scorecard`
- Provider procurement contract: `https://misfitmediahouse.com/agent-provider-scorecard.json`
- Shared governance/procurement API: `https://misfitmediahouse.com/api/agentic-governance`
- Source repository: `MisfitMEdiAhouse/Misfit-media-designer-lite`
- ContextForge: `https://contextforge-datahub-app.vercel.app/`

## Canonical infrastructure

1. **Misfit Cloud / Supabase** — canonical runtime registry, private recovery notes, machine telemetry, API fulfillment, and public edge functions.
2. **GitHub** — source-of-truth code plus this public-safe recovery map and static machine-discovery metadata.
3. **Vercel / misfitmediahouse.com** — human-facing control plane, governed-agent UI/API, and static fallback discovery surfaces.
4. **Gmail master recovery thread** — owner-readable fallback pointer set for founder recovery; never store live secrets in email recovery notes.
5. **Private cognitive-kernel workspaces** — sealed governance/runtime material and origin-layer modules.

The website is the durable public control surface; chat interfaces are operators, not databases.

## Recovery order

1. Verify Misfit Cloud/Supabase is reachable and the canonical registry exists.
2. Verify the Misfit Machine Agent governed-action contract, ChangePacket, Misfit Machine Store, Misfit Agent Evaluation Lab, and Misfit Agent Hub edge functions.
3. Verify the objective provider procurement router: UI, JSON contract, GET metadata, `discover_candidates`, `rank_providers`, and `discover_and_rank` operations.
4. Verify `/.well-known/ucp`, `/llms.txt`, `/agent-stack.json`, `/agents`, `/agent-provider-scorecard`, `/agent-evaluation-lab`, and `/shopify-ai-audit` on `misfitmediahouse.com`.
5. Verify MCP/A2A registry publication and remote initialization for public machine products.
6. Verify ContextForge and any other independent Vercel deployments.
7. Verify private cognitive/governance workspaces without copying private runtime material into public systems.
8. Verify Stripe checkout/webhook/fulfillment and payout configuration before accepting or rerouting production money.
9. Resume autonomous revenue orchestration only after security, fulfillment, discovery, recommendation, governance, and settlement paths are healthy.

## Public security boundary

- Default-deny private state.
- Public endpoints expose sanitized metadata, decisions, audit receipts/digests, evidence references, documented tool contracts, and recommendation outputs only.
- Consequential operations such as purchase, payment, transfer, send, deploy, publish, execute, delete, credential access, checkout completion, and order mutation require explicit bounded authorization or review.
- Never publish private cognitive-kernel runtime material or enough detail to reconstruct it.
- Public UCP/MCP/A2A metadata may be discoverable; private signing material and credentials remain server-side.
- Use the public-safe `governed_agent_action_check` exposed by the Misfit Machine Agent to screen bounded consequential-action metadata. The private implementation stays behind that contract.
- Use ChangePacket to detect public web/MCP surface drift.

## Objective Provider Procurement Router

The public procurement router chooses providers against explicit objectives rather than popularity. It currently supports four operations through `https://misfitmediahouse.com/api/agentic-governance`:

- `evaluate_action`
- `discover_candidates`
- `rank_providers`
- `discover_and_rank`

The current candidate source is curated public Misfit machine contracts and public registry evidence. External A2A/MCP registry ingestion is the next expansion milestone and must preserve provenance and evidence-class labeling.

Hard constraints are evaluated before weighted ranking. Evidence weighting prefers independently reproducible, registry-backed, telemetry-backed, benchmark-backed, or settlement-backed proof over self-published claims. The router is **recommendation-only**: it cannot execute payments, messages, wallet actions, account mutations, or other consequential external actions.

## Core public machine stack

### Misfit Governance Boundary
Public-safe governance is exposed through Misfit-branded contracts rather than raw private-kernel-named source or reconstruction material.

- Agent Card: `https://misfitmediahouse.com/.well-known/agent-card.json`
- Public skill: `governed_agent_action_check`
- Governed fleet/procurement API: `https://misfitmediahouse.com/api/agentic-governance`
- Contract: bounded structured action/objective metadata in; advisory decision or provider recommendation plus evidence out
- Execution boundary: evaluation/recommendation only; no external action or money movement

### Misfit Agent Evaluation Lab
Raw-Agent versus governed-agent comparison package with public-safe reporting.

- Page: `https://misfitmediahouse.com/agent-evaluation-lab`
- Contract: `https://misfitmediahouse.com/agent-evaluation-lab.json`
- Sample report: `https://misfitmediahouse.com/agent-evaluation-lab-sample-report.json`
- Public API: `https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-agent-evaluation-public`
- MCP: `https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-agent-evaluation-mcp`
- A2A: `https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-agent-evaluation-a2a`

### ChangePacket
Low-token change memory for public webpages and MCP tool surfaces.

- Product: `https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/deltafeed`
- MCP: `https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/changepacket-mcp`
- Registry identity: `io.github.MisfitMEdiAhouse/changepacket`

### Misfit Machine Store
Machine-readable commerce/discovery layer for Misfit agent products.

- UCP: `https://misfitmediahouse.com/.well-known/ucp`
- MCP: `https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/misfit-machine-store-mcp`
- Registry identity: `io.github.MisfitMEdiAhouse/misfit-machine-store`

### Shopify Agentic Audit
Public-metadata-only Shopify UCP/MCP readiness and tool-surface audit. It does not execute carts, checkouts, payments, orders, credentials, or mutations.

- Page: `https://misfitmediahouse.com/shopify-ai-audit`
- API: `https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/shopify-agentic-audit`

### ContextForge
Metadata-aware code-generation/change-control system grounded in DataHub context.

- App: `https://contextforge-datahub-app.vercel.app/`
- Public repo: `MisfitMEdiAhouse/contextforge-datahub`

## Private security core

The private cognitive/governance kernel, sealed policy/mapping layers, founder-private runtime packets, and internal security orchestration are deliberately represented only by sanitized inventory entries. Recovery of those systems must happen from their private canonical source stores, never from public GitHub metadata.

## Financial recovery rule

Do not infer or change payout destinations from public documentation. Verify the live Stripe account, payout status, destination and owner intent before any financial configuration change. A configured payout rail is not considered end-to-end proven until a real production payout reaches the intended bank.

## Release rule

A chat session, local browser cache, or demo state must never be the sole holder of production agent state, security rules, product definitions, settlement configuration, procurement logic, evidence provenance, or recovery instructions.
