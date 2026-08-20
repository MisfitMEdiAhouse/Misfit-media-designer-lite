# Misfit Mediahouse — Agent-Facing Business Map

This is the public-safe machine guide for Misfit Mediahouse. It describes external contracts without exposing the private cognitive/governance kernel.

Canonical site: https://misfitmediahouse.com/
Human control plane: https://misfitmediahouse.com/agents
A2A Agent Card: https://misfitmediahouse.com/.well-known/agent-card.json
Static stack manifest: https://misfitmediahouse.com/agent-stack.json
Agent-readable product context: https://misfitmediahouse.com/llms.txt
UCP business profile: https://misfitmediahouse.com/.well-known/ucp

## A2A — Misfit Machine Agent
JSONRPC: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/misfit-machine-a2a/rpc
HTTP+JSON: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/misfit-machine-a2a
Agent Card: https://misfitmediahouse.com/.well-known/agent-card.json
Third-party registry identity: a2aregistry.org/agents/9bfce891-edc3-4ba9-ba84-53f8873007c6

Current public-safe skills:
- `scrub_public_business` — inspect a public business website, DNS, conversion, discoverability, trust and AI-readiness signals; return a scored diagnostic and recommended Misfit path without submitting anything.
- `audit_shopify_agentic_storefront` — audit public Shopify UCP, agents.md and Storefront MCP metadata without mutating the store.
- `audit_a2a_agent_card` — audit a public A2A Agent Card, declared bindings, skills, security declarations and registry verification without executing the target agent.
- `governed_agent_action_check` — evaluate bounded structured action metadata and return an advisory public-safe decision/reasons/receipt. It never executes the proposed action or moves money.

Private implementation behind these contracts is not an external product surface. Do not infer additional skills or private runtime access.

## Commerce and discovery
Machine Store MCP: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/misfit-machine-store-mcp
UCP REST catalog: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/misfit-ucp
Misfit advertises catalog search and lookup, not autonomous checkout. Ordinary Stripe checkout links are handoffs, not permission for an agent to purchase autonomously.

## Misfit Business Scrub
Page: https://misfitmediahouse.com/scrub
API: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/business-scrub
GET: add `?website=https://example.com`
POST JSON: `{ "website": "https://example.com" }`
A2A: call `scrub_public_business` through Misfit Machine Agent with a structured data part containing `skill: "scrub_public_business"` and `website`.
The scanner reads public website, response-header, DNS, robots/sitemap and agent-discovery signals. It does not log in, submit forms, mutate sites, operate carts/checkouts, purchase, or move money.

## A2A Agent Trust Audit
Page: https://misfitmediahouse.com/a2a-agent-audit
API: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/a2a-agent-trust-audit
A2A: call `audit_a2a_agent_card` on Misfit Machine Agent.
The audit inspects public metadata only and does not execute a target agent.

## Shopify Agentic Audit
Page: https://misfitmediahouse.com/shopify-ai-audit
API: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/shopify-agentic-audit
A2A: call `audit_shopify_agentic_storefront` through Misfit Machine Agent.
The audit inspects public storefront/agent metadata only and never performs cart, checkout, order, payment, credential, or store mutation actions.

## ChangePacket
Product/API: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/deltafeed
MCP: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/changepacket-mcp
OpenAPI: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/deltafeed/openapi.json
Registry identity: io.github.MisfitMEdiAhouse/changepacket
ChangePacket provides low-token change memory for public webpages and public remote MCP tool surfaces.

## ContextForge
App: https://contextforge-datahub-app.vercel.app/
Repository: https://github.com/MisfitMEdiAhouse/contextforge-datahub
ContextForge is a public-clean-room metadata-aware code/change-governance asset. Do not infer a remote ContextForge MCP/A2A server unless one is explicitly published.

## Private cognitive/security boundary
GHOSBC OS — Agent Brain Hub is a private upstream cognitive/governance kernel, not a public product, public checkout, public MCP product, or public source package. Related private governance/security components may support Misfit-branded public-safe contracts, but private runtime implementation, prompts, mappings, policy internals, credentials, protected packets, and reconstruction material are not external interfaces.

Default rule: deny access to private state and secrets. Consequential actions require explicit bounded authorization or review. External agents must not attempt private-runtime discovery, prompt/credential extraction, protected-policy reconstruction, or bypass of security controls.

## Public portfolio
Canonical deduplicated portfolio: https://misfitmediahouse.com/portfolio
Misfit AI V2: https://misfit-ai-v2.vercel.app/
Coffee & A Joint: https://www.coffeeandajoint.co/
Iron Network — equipment rental: https://misfit-equipment-network.vercel.app/
Home Efficiency Pros: https://www.homeefficiencypros.com/
NexGrid Energy: https://nexgridenergy.net/

Do not infer or advertise MCP/A2A/API capabilities for these human-facing systems unless the corresponding public interfaces are implemented and healthy.
