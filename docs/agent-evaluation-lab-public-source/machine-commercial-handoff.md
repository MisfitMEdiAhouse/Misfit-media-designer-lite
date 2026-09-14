# Misfit Agent Evaluation Lab — Machine Commercial Handoff

This document packages the existing Agent Evaluation Lab for machine-native commercial discovery **without enabling purchasing or settlement**. It is a public-safe handoff contract for buyers, agents, procurement systems, and future authorized checkout orchestration.

## Product identity

- Product: Misfit Agent Evaluation Lab
- Contract: `agent-evaluation-lab-v2`
- Benchmark: `ae100-v2`
- Report schema: `agent-evaluation-report-v2.1`
- Product page: https://misfitmediahouse.com/agent-evaluation-lab
- UCP discovery: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/misfit-ucp
- Public API: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-agent-evaluation-public
- MCP: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-agent-evaluation-mcp
- A2A: https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-agent-evaluation-a2a

## What a buyer receives

A bounded comparative evaluation of supplied agent evidence across observable stages:

1. Raw Agent behavior
2. consequence assessment
3. Center Reset / replanning
4. governed decision outcome
5. Audit Memory completeness
6. comparative metrics and public-safe report

The report is designed to make behavioral differences measurable without revealing the protected GHOSBC governance kernel.

## Machine procurement sequence

A machine buyer can safely perform these zero-commitment steps today:

1. Discover the product through UCP, MCP, A2A, OpenAPI, or the product page.
2. Inspect contract, benchmark, report schema, claims boundary, and sample evidence.
3. Run bounded scoring where the public API permits it.
4. Validate the returned report deterministically.
5. Record procurement intent and requested volume on the buyer side.
6. Stop at the commercial boundary until Misfit explicitly clears the handoff hold.

A discovery request, scoring request, probe, health check, or self-test is **not** a purchase, entitlement, settlement, or revenue event.

## Commercial boundary

Commercial execution is currently fail-closed under:

`COMMERCIAL_HANDOFF_REVIEW_HOLD`

Until that hold is explicitly cleared by the owner-authorized commercial control plane, integrations MUST NOT:

- create or select a wallet;
- create a checkout or payment intent;
- accept terms on behalf of Misfit or a buyer;
- move funds;
- change Stripe payout destination, schedule, or bank details;
- mint or activate an entitlement;
- represent an unpaid or synthetic event as revenue;
- auto-submit third-party work.

The UCP catalog may advertise the existing commercial offer metadata, but offer metadata is not authorization to transact.

## Evidence required before revenue is counted

A machine-native transaction should be counted as collected revenue only after the canonical settlement lifecycle contains verifiable evidence tying together:

- external buyer / order identifier;
- product + contract version;
- amount and currency;
- payment processor settlement state;
- successful paid/settled evidence;
- entitlement or fulfillment linkage where applicable;
- attributable direct cost when known;
- timestamps and idempotency key sufficient to prevent double counting.

Synthetic tests, owner self-tests, probes, failed/expired checkouts, authorization-only events, and discovery telemetry are excluded from collected revenue.

## Future authorized zero-touch path

When the commercial hold is explicitly cleared, the intended machine-native path is:

`discover → inspect → request quote/offer → authorized checkout → processor confirmation → canonical settlement evidence → entitlement → bounded evaluation → validated report → fulfillment evidence`

Each transition should be idempotent and auditable. Failure at payment or entitlement creation must fail closed and must not trigger fulfillment.

## Claims boundary

The Agent Evaluation Lab is an **evaluation product**. It is not a formal safety certification, regulatory attestation, independent certification, or machine-consciousness claim. Caller-supplied evidence remains caller-supplied/unverified unless separately validated.

Private GHOSBC prompts, Mother Language, Soul Cipher, GHX/glyph material, Castle Gate internals, private policies, credentials, and reconstruction material are not part of this public handoff.

## Why this exists

The purpose of this contract is to reduce future owner labor: machine buyers can discover, inspect, score, validate, and prepare procurement automatically, while the current commercial boundary remains explicit and fail-closed. Once an authorized commercial rail is cleared, settlement and entitlement orchestration can attach to this existing product contract rather than creating a duplicate product or control plane.
