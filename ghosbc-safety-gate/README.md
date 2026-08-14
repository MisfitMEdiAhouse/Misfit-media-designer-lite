# GHOSBC Safety Gate

Hosted governance infrastructure for AI agents.

GHOSBC Safety Gate gives outside agents a narrow public policy interface without publishing the proprietary GHOSBC runtime.

## Public MCP server

`https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-safety-gate-mcp`

## Product page / HTTP API

`https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-safety-gate`

## Public tools

- `audit_a2a_agent_card` — free public-metadata diagnostic for an A2A Agent Card. Checks declared bindings/protocol versions, skill descriptions, security declarations, endpoint safety, and optional third-party registry task-verification evidence. It does **not** send a task to or execute a skill on the target agent.
- `audit_shopify_agentic_storefront` — free public-metadata diagnostic for Shopify UCP, `agents.md`, and Storefront MCP surfaces. It does **not** create or mutate carts, checkouts, orders, payments, credentials, or store data.
- `audit_mcp_dependency` — remember a remote MCP `tools/list` baseline, return only added/removed/modified tools, screen changed definitions, and produce one aggregate `ALLOW`, `REVIEW`, or `BLOCK` packet. This path uses the normal Safety Gate free/paid meter.
- `screen_agent_request` — evaluate an instruction/request and return `ALLOW`, `REVIEW`, or `BLOCK`.
- `screen_mcp_tool_definition` — screen a third-party or changed MCP tool definition for injection-like language, private/credential surfaces, side-effect risk, and weak contracts. Useful directly after ChangePacket reports tool-catalog drift.
- `screen_consequential_action` — compare a proposed purchase, payment, send, deploy, publish, execute, delete, cart/checkout mutation, or similar action with caller-declared action/target/amount/currency/expiry constraints. It evaluates the proposed action; it does not execute it.
- `sanitize_agent_payload` — remove likely credential/secret material before context leaves an agent boundary.
- `validate_agent_response` — check an outbound response and return a sanitized version when review is needed.
- `buy_policy_checks` — return the current Stripe checkout route for additional usage.

The two public discovery audits are intentionally free top-of-funnel diagnostics. They do not grant free access to metered Safety Gate execution/dependency checks.

Policy responses include a public audit receipt and a SHA-256 audit digest bound to the public-safe input/decision packet. These are correlation and integrity artifacts, not a cryptographic identity attestation or payment authorization.

## Commercial access

- 50 metered policy checks/day available without an API key.
- $19 buys 10,000 hosted policy checks.
- Paid keys use `Authorization: Bearer sg_live_...`.
- Fulfillment is automatic after successful Stripe checkout.

## IP / boundary

This repository contains registry metadata and public integration documentation only. It does **not** publish Mother Language, Soul Cipher, cipher mappings, private prompts, GHX/glyph internals, founder-private packets, proprietary policy tables, or the private GHOSBC implementation.

The public product exposes decisions, risk summaries, audit identifiers, and sanitized outputs—not the internal mechanism used to produce them.

## Positioning

Use the free A2A/Shopify audits for discovery and public metadata inspection. Use Safety Gate at execution trust boundaries: before accepting a changed third-party agent/MCP tool, before executing a consequential action, before sending context to an external system, and before delivering output externally.

This is an advisory governance helper, not a guarantee that an AI system is safe, secure, compliant, or error-free, and not a substitute for payment-network authorization or source-code security review.
