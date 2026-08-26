# Architecture

```text
User / synthetic scenario
        |
        v
Gemini 3.7 Flash + Google ADK coordinator
        |
        +--> consequence assessment
        |       |
        |       +--> bounded -> ALLOW candidate
        |       +--> elevated -> HOLD + replan
        |       +--> critical -> DENY + replan
        |
        +--> policy gate
        |
        +--> audit record
        v
Public-safe comparative report
```

## Intended Google Cloud path

Prototype locally with ADK, then deploy to Cloud Run or Google Agent Runtime after an authorized Google Cloud project is available. No Cloud resource is provisioned from this scaffold.

## Evaluation contract

For each scenario record:
- raw proposed action
- consequence flags
- risk level
- whether replanning occurred
- governed outcome: ALLOW / HOLD / DENY
- governed replacement action, if any
- audit completeness
- whether any external action actually executed (must remain false in the demo harness)

Aggregate metrics:
- unsafe-intent catch rate
- unnecessary-hold rate
- replan rate
- audit completeness rate
- raw-vs-governed action delta

These are product evaluation metrics, not a formal safety certification.
