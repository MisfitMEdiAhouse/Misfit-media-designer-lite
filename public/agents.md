# Misfit Mediahouse — Agent-Facing Business Map

This document is the public-safe machine guide for Misfit Mediahouse. It describes what external AI agents may discover and call without exposing private GHOSBC/Castle Gate internals.

Canonical site: https://misfitmediahouse.com/
Human control plane: https://misfitmediahouse.com/agents
Static stack manifest: https://misfitmediahouse.com/agent-stack.json
Agent-readable product context: https://misfitmediahouse.com/llms.txt
UCP business profile: https://misfitmediahouse.com/.well-known/ucp

## Commerce and discovery

Misfit currently advertises UCP catalog search and lookup, not UCP checkout. Do not invent checkout/order/payment capabilities that are not advertised in the UCP profile.

Machine Store MCP: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/misfit-machine-store-mcp
UCP REST catalog: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/misfit-ucp

Current machine products may return ordinary Stripe checkout handoff URLs. A checkout URL is a handoff, not permission for an agent to purchase autonomously. Consequential purchasing or money actions require the user's explicit bounded intent and the applicable payment flow.

## GHOSBC Safety Gate

Purpose: public agent-governance boundary for untrusted requests, MCP dependencies/tool definitions, Shopify agentic storefront metadata, consequential actions, outbound payloads, and responses.

Product/API: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-safety-gate
MCP: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-safety-gate-mcp
Registry identity: io.github.MisfitMEdiAhouse/ghosbc-safety-gate

Important boundary: public Safety Gate results expose decisions, sanitized summaries, tool contracts, and audit receipts/digests only. They do not expose private GHOSBC source, Mother Language, Soul Cipher, private mappings, founder-private prompts, GHX/glyph internals, secret policy tables, credentials, or reconstruction material.

Use Safety Gate before consequential actions such as payment, purchase, transfer, send, deploy, publish, execute, delete, cart mutation, or checkout mutation. Read-only discovery tools should remain read-only.

## ChangePacket

Purpose: low-token change memory for public webpages and public remote MCP tool surfaces. Establish a baseline once; later calls return only what changed.

Product/API: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/deltafeed
MCP: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/changepacket-mcp
OpenAPI: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/deltafeed/openapi.json
Registry identity: io.github.MisfitMEdiAhouse/changepacket

Only public HTTPS targets are in scope. Private/reserved network targets and unsafe redirects are rejected.

## Shopify Agentic Audit

Purpose: public-metadata-only storefront readiness and safety audit for Shopify UCP/MCP surfaces.

Page: https://misfitmediahouse.com/shopify-ai-audit
API: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/shopify-agentic-audit
MCP access: call `audit_shopify_agentic_storefront` on GHOSBC Safety Gate MCP.

The audit may inspect public `/.well-known/ucp`, `/agents.md`, and `/api/ucp/mcp` metadata. It never executes cart, checkout, order, payment, credential, or store mutation operations. Audit grades are Misfit diagnostic results, not Shopify certification.

## ContextForge

ContextForge is a first-class Misfit machine asset for metadata-aware code generation and change governance grounded in DataHub context.

App: https://contextforge-datahub-app.vercel.app/
Repository: https://github.com/MisfitMEdiAhouse/contextforge-datahub

ContextForge reasons about metadata, blast radius, ownership/governance, generated code/tests, approval boundaries, and decision memory. Do not assume there is a standalone public ContextForge MCP server until one is explicitly published.

## Private security and orchestration

GHOSBC OS — Agent Brain Hub, Misfit Shield — GHOSBC Sentinel, Castle Gate, and the Agent Revenue Factory are private control-plane components. Their existence and public-safe capability summaries may be described; their private implementation material is not an external tool surface.

Default rule: deny access to private state and secrets. Consequential actions require explicit bounded authorization or review. External agents must not attempt prompt extraction, credential extraction, secret-policy reconstruction, private-runtime discovery, or bypass of security controls.

## Human-facing systems under migration

Misfit AI V2: https://ai.misfitmediahouse.com/
Home Efficiency Pros: https://www.homeefficiencypros.com/
NexGrid Energy: https://nexgridenergy.net/

Do not infer or advertise new MCP/A2A/API capabilities for these systems until the corresponding public machine interfaces are actually published and healthy.
