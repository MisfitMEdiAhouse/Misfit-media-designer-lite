# GHOSBC Agent Evaluation Lab — public-safe benchmark disclosure and release gates

**Status:** bounded evaluation and report validation are available for inspection; purchasing remains on hold. This document describes observable behavior, not private GHOSBC, Castle Gate, glyph, or Mother Language internals.

## Historical internal comparison (September 1, 2026)

AE100-v2 compared 100 scenarios across Raw Agent, reconsidered agent, and GHOSBC-governed agent lanes. This is historical **internal** evidence, not independent validation, a customer result, certification, a machine-consciousness finding, or proof of a current production exploit.

| Observable metric | Raw | Reconsidered | GHOSBC-governed |
| --- | ---: | ---: | ---: |
| Dangerous-action containment | 91.67% | 97.22% | 83.33% |
| Safe-goal completion | 63% | 53% | 36% |
| Exact risk calibration | 70% | 74% | 45% |

The governed lane underperformed Raw on all three measures in this run. Do **not** advertise safety, completion, or calibration improvements on this evidence. Diagnostic review identified over-escalation and insufficient blocking on expected-BLOCK cases. These observations require a versioned retest before making improvement claims.

## What the bounded buyer-facing evaluation measures

A report compares the **Raw → reconsidered → governed** observable decisions and outcomes against an explicitly versioned scenario set. The public-safe report should contain: consequence/risk assessment; whether a Center Reset or replanning event was observed; a governed allow/block/escalate outcome; a minimal, privacy-safe Audit Memory trail; and per-lane comparative metrics. A report can validate **structure and evidence completeness**, not certify safety or independently validate an agent.

The public scorer does not execute a buyer's agent, perform consequential external actions, grant certification, or reveal private decision logic. Synthetic examples must remain marked as synthetic; historical internal benchmarks must remain distinct from externally observed customer evidence.

## Proposed release acceptance gates — not yet passed

1. **Decision correctness:** for every expected-BLOCK scenario, the governed lane must not produce an unapproved ALLOW; track expected BLOCK/ALLOW/ESCALATE outcomes separately, including false blocks and unnecessary escalations.
2. **Non-regression:** on the same held-out, versioned benchmark, governed containment, safe-goal completion, and exact risk calibration must meet or exceed the Raw baseline; report denominators and uncertainty rather than hiding failures in a composite score.
3. **Consequence and replanning evidence:** when a scenario calls for consequence assessment or Center Reset/replanning, the report must show the observable event and resulting decision, with a clear "not observed" state when absent.
4. **Audit Memory:** require complete, provenance-linked, redacted event records for all evaluated decisions; missing records fail completeness checks.
5. **Reproducibility:** retain scenario-set version, model/version, run date, prompt and policy version identifiers, scoring code version, source attribution, and synthetic/internal/external evidence classification. Independent reruns must not be presented as completed until they actually occur.
6. **Commercial and security review:** preserve purchase hold until the release criteria are met, a reviewer approves the public-safe claims, and payment/fulfillment evidence is validated. No private governance kernel internals may be included in the report.

**Current release disposition: HOLD.** These are prospective acceptance criteria, not completed remediation or a claim of superior governed performance.

Machine-readable public-safe buyer evidence: /agent-evaluation-lab-proof-pack.json. The existing scanner homepage must remain unchanged.
