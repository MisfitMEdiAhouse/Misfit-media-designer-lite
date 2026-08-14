# GHOSBC Safety Gate

Hosted governance infrastructure for AI agents.

GHOSBC Safety Gate gives outside agents a narrow public interface for request screening, payload sanitization, risky-capability routing, and response validation without publishing the proprietary GHOSBC runtime.

## Public MCP server

`https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-safety-gate-mcp`

## Product page / HTTP API

`https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-safety-gate`

## Public tools

- `screen_agent_request` — returns `ALLOW`, `REVIEW`, or `BLOCK` plus a public-safe audit receipt.
- `sanitize_agent_payload` — removes likely credential/secret material before context leaves an agent boundary.
- `validate_agent_response` — checks an outbound response and returns a sanitized version when review is needed.
- `buy_policy_checks` — returns the current Stripe checkout route for additional usage.

## Commercial access

- 50 checks/day available without an API key.
- $19 buys 10,000 hosted checks.
- Paid keys use `Authorization: Bearer sg_live_...`.
- Fulfillment is automatic after successful Stripe checkout.

## IP / boundary

This repository contains registry metadata and public integration documentation only. It does **not** publish Mother Language, Soul Cipher, cipher mappings, private prompts, GHX/glyph internals, founder-private packets, proprietary policy tables, or the private GHOSBC implementation.

The public product exposes decisions and sanitized outputs, not the internal mechanism used to produce them.

## Positioning

Use Safety Gate as a policy boundary before an AI agent sends context to external models/tools or performs capabilities that should require review.

This is a governance helper, not a guarantee that an AI system is safe, secure, compliant, or error-free.
