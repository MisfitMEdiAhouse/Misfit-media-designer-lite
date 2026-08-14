# Misfit Agent Control Plane — Public-Safe Recovery Guide

This guide exists so the Misfit machine/agent stack can be reconstructed without relying on any single chat thread, browser session, or operator memory.

It intentionally contains **no credentials, private GHOSBC prompts, Mother Language/Soul Cipher material, cipher mappings, GHX/glyph internals, founder-private packets, secret policy tables, or reconstruction material**.

## Canonical public anchors

- Company/control surface: `https://misfitmediahouse.com/agents`
- Static stack manifest: `https://misfitmediahouse.com/agent-stack.json`
- Agent-readable context: `https://misfitmediahouse.com/llms.txt`
- UCP business profile: `https://misfitmediahouse.com/.well-known/ucp`
- Source repository: `MisfitMEdiAhouse/Misfit-media-designer-lite`
- ContextForge: `https://contextforge-datahub-app.vercel.app/`

## Canonical infrastructure

1. **Misfit Cloud / Supabase** — canonical runtime registry, private recovery notes, machine telemetry, API fulfillment, and public edge functions.
2. **GitHub** — source-of-truth code plus this public-safe recovery map and static machine-discovery metadata.
3. **Vercel / misfitmediahouse.com** — human-facing control plane and static fallback discovery surfaces.
4. **Private GHOSBC workspaces** — Agent Brain, Castle Gate, Sentinel/Shield and other sealed governance/runtime material.

The website is the durable public control surface; chat interfaces are operators, not databases.

## Recovery order

1. Verify Misfit Cloud/Supabase is reachable and the canonical registry exists.
2. Verify GHOSBC Safety Gate, ChangePacket, Misfit Machine Store, and Misfit Agent Hub edge functions.
3. Verify `/.well-known/ucp`, `/llms.txt`, `/agent-stack.json`, `/agents`, and `/shopify-ai-audit` on `misfitmediahouse.com`.
4. Verify MCP Registry publication workflows and remote MCP initialization for public machine products.
5. Verify ContextForge and any other independent Vercel deployments.
6. Verify private GHOSBC/Castle Gate/Sentinel workspaces without copying private runtime material into public systems.
7. Verify Stripe checkout/webhook/fulfillment and payout configuration before accepting or rerouting production money.
8. Resume autonomous revenue orchestration only after security, fulfillment, discovery, and settlement paths are healthy.

## Public security boundary

- Default-deny private state.
- Public endpoints expose sanitized metadata, decisions, audit receipts/digests, and documented tool contracts only.
- Consequential operations such as purchase, payment, transfer, send, deploy, publish, execute, delete, credential access, checkout completion, and order mutation require explicit bounded authorization or review.
- Never publish private GHOSBC runtime material or enough detail to reconstruct it.
- Public UCP/MCP metadata may be discoverable; private signing material and credentials remain server-side.
- Use GHOSBC Safety Gate to screen untrusted instructions, changed MCP tool definitions, dependencies, and consequential actions.
- Use ChangePacket to detect public web/MCP surface drift.

## Core public machine stack

### GHOSBC Safety Gate
Hosted public governance boundary. The private GHOSBC mechanism remains sealed.

- Product: `https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-safety-gate`
- MCP: `https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-safety-gate-mcp`
- Registry identity: `io.github.MisfitMEdiAhouse/ghosbc-safety-gate`

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

GHOSBC OS Agent Brain, Castle Gate, Sentinel/Shield, private ciphers/mappings, founder-private policy/runtime packets, and internal security orchestration are deliberately represented only by sanitized inventory entries. Recovery of those systems must happen from their private canonical source stores, never from public GitHub metadata.

## Financial recovery rule

Do not infer or change payout destinations from public documentation. Verify the live Stripe account, payout status, destination and owner intent before any financial configuration change. A configured payout rail is not considered end-to-end proven until a real production payout reaches the intended bank.

## Release rule

A chat session, local browser cache, or demo state must never be the sole holder of production agent state, security rules, product definitions, settlement configuration, or recovery instructions.
