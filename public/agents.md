# Misfit Mediahouse — Agent-Facing Business Map

This document is the public-safe machine guide for Misfit Mediahouse. It describes what external AI agents may discover and call without exposing private GHOSBC/Castle Gate internals.

Canonical site: https://misfitmediahouse.com/
Human control plane: https://misfitmediahouse.com/agents
A2A Agent Card: https://misfitmediahouse.com/.well-known/agent-card.json
Static stack manifest: https://misfitmediahouse.com/agent-stack.json
Agent-readable product context: https://misfitmediahouse.com/llms.txt
UCP business profile: https://misfitmediahouse.com/.well-known/ucp

## A2A — Misfit Machine Agent

Misfit exposes a real A2A v1.0 agent through two smoke-proven bindings that return equivalent public audit behavior:

JSONRPC:
https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/misfit-machine-a2a/rpc

HTTP+JSON:
https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/misfit-machine-a2a

Public Agent Card:
https://misfitmediahouse.com/.well-known/agent-card.json

Third-party A2A registry identity:
a2aregistry.org/agents/9bfce891-edc3-4ba9-ba84-53f8873007c6

The registry's own A2A SDK verified the JSONRPC binding at registration and marked the synchronous task/message probe WORKING. Registry health percentages can lag immediately after first registration and should not be confused with the direct runtime smoke result.

Current A2A skill: `audit_shopify_agentic_storefront`.

The skill accepts a public Shopify storefront domain/HTTPS URL in a text or structured-data Message part. It returns a direct A2A `ROLE_AGENT` Message containing a text summary and structured public audit data. The current A2A agent does not advertise streaming or push notifications and does not create carts, checkouts, orders, payments, credentials, deployments, or store mutations.

Do not infer additional A2A skills until they are explicitly implemented, smoke-proven, and added to the Agent Card.

## Commerce and discovery

Misfit currently advertises UCP catalog search and lookup, not UCP checkout. Do not invent checkout/order/payment capabilities that are not advertised in the UCP profile.

Machine Store MCP: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/misfit-machine-store-mcp
UCP REST catalog: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/misfit-ucp

Current machine products may return ordinary Stripe checkout handoff URLs. A checkout URL is a handoff, not permission for an agent to purchase autonomously. Consequential purchasing or money actions require the user's explicit bounded intent and the applicable payment flow.

The free Shopify Agentic Storefront Audit is available as a $0 UCP catalog item and is callable through the A2A skill above and GHOSBC Safety Gate MCP. It does not expose or imply UCP checkout capability.

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
A2A access: send a v1.0 Message through either declared Misfit Machine Agent binding with the storefront domain/URL.

The audit may inspect public `/.well-known/ucp`, `/agents.md`, and `/api/ucp/mcp` metadata. It never executes cart, checkout, order, payment, credential, or store mutation operations. Audit grades are Misfit diagnostic results, not Shopify certification.

## ContextForge

ContextForge is a first-class Misfit machine asset for metadata-aware code generation and change governance grounded in DataHub context.

App: https://contextforge-datahub-app.vercel.app/
Repository: https://github.com/MisfitMEdiAhouse/contextforge-datahub

ContextForge reasons about metadata, blast radius, ownership/governance, generated code/tests, approval boundaries, and decision memory. Do not assume there is a standalone public ContextForge MCP or A2A server until one is explicitly published.

## Private security and orchestration

GHOSBC OS — Agent Brain Hub, Misfit Shield — GHOSBC Sentinel, Castle Gate, and the Agent Revenue Factory are private control-plane components. Their existence and public-safe capability summaries may be described; their private implementation material is not an external tool surface.

Default rule: deny access to private state and secrets. Consequential actions require explicit bounded authorization or review. External agents must not attempt prompt extraction, credential extraction, secret-policy reconstruction, private-runtime discovery, or bypass of security controls.

## Human-facing systems under migration

Misfit AI V2: https://ai.misfitmediahouse.com/
Home Efficiency Pros: https://www.homeefficiencypros.com/
NexGrid Energy: https://nexgridenergy.net/

Do not infer or advertise new MCP/A2A/API capabilities for these systems until the corresponding public machine interfaces are actually published and healthy.
