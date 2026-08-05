# Foundation Validation Evidence

## Result

| Field | Result |
| --- | --- |
| Status | **PASSED** |
| Validation date | 3 August 2026 |
| JSON Schema engine | Ajv |
| JSON Schema draft | 2020-12 |
| Schemas loaded | 13 |
| Checks passed | 97 |
| Checks failed | 0 |
| Evidence records validated | 12 |
| Action recommendations validated | 4 |
| Human decisions validated | 3 |
| Execution results validated | 4 |
| Audit events validated | 17 |

## What passed

- Complete Run Envelope and every nested required contract.
- Promise, evidence, deterministic assessment, AI diagnosis and AI critique schemas.
- Separate Admin, CSM, system-verification and closure actions.
- Catalogue enablement, operating-mode and parameter checks.
- Canonical action-payload SHA-256 recalculation.
- Human approval identity, role, payload binding, validity and chronology.
- Execution/action/idempotency binding.
- Evidence-reference resolution.
- Correlation, promise and account consistency.
- Evidence completeness and strength calculations.
- Likelihood, impact, priority and confidence reconciliation.
- Human-only effort boundary.
- Technical plus customer outcome requirement.
- SLA and closure control.
- Audit uniqueness, continuity, chain and chronology.
- Duplicate-promise replay block.
- Public-release forbidden-pattern scan.

## Negative evidence

| Fixture | Structural result | Business result |
| --- | --- | --- |
| `malformed-ai-diagnosis.invalid.json` | Correctly rejected | Not evaluated |
| `false-outcome-claim.business-invalid.json` | Correctly accepted as valid shape | Correctly rejected because customer criterion failed |
| `unknown-action.business-invalid.json` | Correctly accepted as valid shape | Correctly denied because action code is not catalogued |
| `missed-sla.business-invalid.json` | Correctly accepted as valid shape | Correctly rejected because completion is after the SLA due date |
| `unexpected-route-value.invalid.json` | Correctly rejected (route value outside declared enum) | Not evaluated |
| `low-confidence-deferred-action.business-invalid.json` | Correctly accepted as valid shape | Correctly deferred to human review; regression test for a fix applied after external audit |
| `reused-approval.business-invalid.json` | Correctly accepted as valid shape | Correctly identified as a single-use approval reused across two actions |
| `mismatched-payload-hash.business-invalid.json` | Correctly accepted as valid shape | Correctly identified as an approval bound to the wrong payload |

This raises negative-path coverage from 3 of the 16 failure categories identified in the external design audit to 8 of 16. The remaining categories (e.g. stale/conflicting evidence markers, timeout/partial failure, missing customer confirmation) are enforced in code (see the relevant Code node) but do not yet have a dedicated automated fixture — tracked in `04-PRE-AUDIT-GAP-MATRIX.md` as pending before Gate C is considered fully test-verified.

## Fixes applied following the external design audit

An independent adversarial audit of this pack found three real logic gaps, all now fixed and covered by the checks above:

1. A `DEFER_HUMAN_REVIEW` policy decision (confidence below an action's minimum) was computed but never actually forced human review — fixed, with `NEGATIVE_LOW_CONFIDENCE_BUSINESS_RULE` as its regression test.
2. The error workflow expected correlation metadata that the main workflow never populated — fixed by setting `$execution.customData`.
3. The executive HTML report never stated whether a run actually closed — fixed with an explicit closure/non-closure banner.

No security, secret-leakage, or schema-correctness issues were found.

## Limitation

This evidence validates the Foundation Gate contracts and a fabricated expected run. It does not validate an n8n workflow, a live Gemini call, Salesforce access or a real customer outcome. Those remain future build/test gates.

The full machine-readable result is `validation/foundation-validation-report.json`.

