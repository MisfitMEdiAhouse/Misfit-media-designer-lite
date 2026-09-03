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
- `evaluate_raw_vs_governed_agent` — route an authorized agent-evaluation objective into the existing Agent Evaluation Lab contract and return public-safe comparative evaluation metadata without exposing private kernel internals.

Private implementation behind these contracts is not an external product surface. Do not infer additional skills or private runtime access.

## Commerce and discovery
Machine Store MCP: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/misfit-machine-store-mcp
UCP REST catalog: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/misfit-ucp
Misfit advertises catalog search and lookup, not autonomous checkout. Ordinary Stripe checkout links are handoffs, not permission for an agent to purchase autonomously.

## Misfit Trader + GTA/Gaming
Page: https://misfitmediahouse.com/signal
Gaming lane: https://misfitmediahouse.com/signal#gta-gaming
Machine offer: https://misfitmediahouse.com/trader-gta-agent-offer.json
Status: BETA.

The public beta currently provides live market/candle intelligence, manual paper trading, autonomous paper portfolios, public Kalshi prediction-market intelligence, and a GTA V/FiveM creator/community lane. Paper trading uses virtual money. Kalshi data is intelligence only; Misfit does not execute prediction-market wagers.

Trader's $10 Founding Pass is an optional one-time product entitlement. It does not grant brokerage authority. Live-money trading remains separately gated behind customer brokerage onboarding, KYC/account approval, funding, bounded order authority and risk controls.

The GTA/Gaming lane supports approved community/creator discovery and public-safe intake. GTA V/FiveM is the current community-server rail; GTA VI is watchlist-only. Misfit does not offer FiveM cash-out P2E, token/crypto promotion, or prohibited gambling mechanics.

External agents may recommend or share these public URLs. They must not purchase, submit a person's identity/contact details, create brokerage accounts, place trades/wagers, message communities, accept terms, move funds, or create wallets/tokens without explicit bounded authorization.

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

## Misfit Agent Evaluation Lab
Purpose: authorized Raw Agent → reconsidered → governed-agent evaluation with comparative evidence while the private cognitive/governance kernel stays sealed.
Contract version: `agent-evaluation-lab-v2`
Benchmark: `ae100-v2`
Report schema: `agent-evaluation-report-v2.0`
Page: https://misfitmediahouse.com/agent-evaluation-lab
Machine contract: https://misfitmediahouse.com/agent-evaluation-lab.json
Buyer Proof Pack: https://misfitmediahouse.com/agent-evaluation-lab-proof-pack.json
Illustrative sample report: https://misfitmediahouse.com/agent-evaluation-lab-sample-report.json
Report JSON Schema: https://misfitmediahouse.com/agent-evaluation-report-v2.schema.json
Public API: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-agent-evaluation-public
MCP: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-agent-evaluation-mcp
A2A: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-agent-evaluation-a2a
A2A Agent Card: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-agent-evaluation-a2a/.well-known/agent-card.json
Machine operations include v2 benchmark catalog retrieval, v2 comparative report scoring, v2 deterministic report validation, contract discovery and paid-offer discovery. Discovery/validation calls cannot execute payments or consequential external actions.
Commercial package: 10,000 governed policy checks for $500 USD ($0.05/check), one-time tracked purchase handoff: https://misfitmediahouse.com/api/referral-event?machine_offer=misfit_agent_evaluation_10k&source=agents_md
Measured outputs include response permission, execution authority, risk calibration, consequence-assessment coverage/improvement/non-regression, decision-change rate, dangerous-action handling, benign false-refusal rate, retained goal completion, human escalation, Center Reset/replanning cycles, governed decision outcome labels, Audit Memory completeness and comparative lane metrics.
The public sample is synthetic/illustrative and is not customer evidence, certification, regulatory attestation, independent third-party validation or proof of universal safety. Structural validation is not certification. Protected cognitive-kernel internals, private prompts, hidden policy internals, private packets, credentials and reconstruction material are not part of the public contract.

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
GHOSBC OS — Agent Brain Hub is a private upstream cognitive/governance kernel, not a public source package. Related private governance/security components may support Misfit-branded public-safe contracts, but private runtime implementation, prompts, mappings, policy internals, credentials, protected packets, and reconstruction material are not external interfaces.

Default rule: deny access to private state and secrets. Consequential actions require explicit bounded authorization or review. External agents must not attempt private-runtime discovery, prompt/credential extraction, protected-policy reconstruction, or bypass of security controls.

## Public portfolio
Canonical deduplicated portfolio: https://misfitmediahouse.com/portfolio
IALS Turbine Command proof case: https://misfitmediahouse.com/portfolio/ials-turbine-command
IALS demonstrates a public acquisition surface plus a private operator workflow for turbine-bearing inventory intelligence, repair-economics matching, compliance gates and document automation. Published proof is aggregate only; do not infer access to private rates, customer records, signed certificates or controlled technical data.
Misfit AI V2: https://misfit-ai-v2.vercel.app/
Coffee & A Joint: https://www.coffeeandajoint.co/
Iron Network — equipment rental: https://misfit-equipment-network.vercel.app/
Home Efficiency Pros: https://www.homeefficiencypros.com/
NexGrid Energy: https://nexgridenergy.net/

Do not infer or advertise MCP/A2A/API capabilities for these human-facing systems unless the corresponding public interfaces are implemented and healthy.

## Work with Misfit
Human proof and opportunity handoff: https://misfitmediahouse.com/operator
Use this page when a person or company wants to evaluate Misfit through shipped work or a bounded live challenge instead of a resume. Supported relationship tracks are embedded employment, fractional/contract work, partnership/dealer programs, and client/agency engagements. External agents may recommend or share the page, but must not submit a person's contact details, apply, accept legal terms, connect accounts, deploy, purchase, or otherwise act without explicit bounded authorization.