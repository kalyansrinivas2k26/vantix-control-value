# Vantix Control Value Action Policy

## Policy objective

AI may recommend only an action code from the versioned catalogue. The deterministic policy engine then returns exactly one decision:

- `ALLOW_AUTO`
- `REQUIRE_APPROVAL`
- `DENY`
- `DEFER_HUMAN_REVIEW`

The AI recommendation never determines execution authority.

## Consequence levels

| Level | Meaning | Example |
| --- | --- | --- |
| `NONE` | Read/compute only | Validate evidence |
| `LOW` | Reversible internal draft/state | Draft an internal recommendation |
| `MEDIUM` | Internal record or simulated state change | Create an internal remediation task |
| `HIGH` | Access/ownership/configuration change or customer communication | Assign access, send a customer message |
| `CRITICAL` | Broad security/configuration/production impact | Metadata deployment, bulk permission change |

## Approval rules

| Action type | MVP decision |
| --- | --- |
| Read-only Salesforce query | `ALLOW_AUTO` after scope and evidence checks |
| Deterministic calculation | `ALLOW_AUTO` |
| AI diagnosis/critique | `ALLOW_AUTO` with strict schema and fallback |
| Internal recommendation draft | `ALLOW_AUTO` |
| Synthetic remediation | `REQUIRE_APPROVAL` to demonstrate the same control boundary |
| Customer communication draft | `ALLOW_AUTO` |
| Customer communication send/simulation | `REQUIRE_APPROVAL` |
| Salesforce task/custom-record creation | `REQUIRE_APPROVAL` |
| Access, permission, sharing or ownership write | `DENY` in MVP |
| Salesforce metadata/configuration write | `DENY` in MVP |
| Promise closure | `REQUIRE_APPROVAL` after verified outcome |
| AgileOps handoff | `DENY` in MVP; future catalogue item disabled |

## Mandatory pre-execution checks

Immediately before execution, the system must re-check:

1. action code exists and is enabled;
2. execution mode is allowed in the current operating mode;
3. required evidence references resolve and remain trusted;
4. confidence meets the catalogue threshold;
5. action status is not already succeeded;
6. idempotency key is not already consumed;
7. any required human decision is valid, unexpired and unused;
8. action ID and payload hash match the decision;
9. actor role is authorized;
10. separation-of-duties requirement passes;
11. target is synthetic/sandbox-allowlisted;
12. no newer evidence invalidated the recommendation.

Any mismatch produces `DEFER_HUMAN_REVIEW` or `DENY`; it never gets auto-corrected by AI.

## AI-specific restrictions

AI must:

- cite supplied evidence IDs for every factual claim;
- distinguish fact, inference and uncertainty;
- choose only enabled catalogue codes;
- return `UNKNOWN` when evidence does not support a cause;
- preserve separate CSM and Admin ownership;
- disclose limitations.

AI must not:

- calculate official scores;
- invent a record, user, renewal date, permission or customer response;
- approve an action;
- modify action parameters after human approval;
- select a disabled/future action;
- assign effort or story points;
- claim execution or outcome success.

## Approval state model

| Status | Meaning |
| --- | --- |
| `PENDING` | Waiting for authorized human decision |
| `APPROVED` | Valid decision exists but is not yet consumed |
| `REJECTED` | Action may not execute |
| `CHANGES_REQUESTED` | Recommendation must be revised and re-approved |
| `EXPIRED` | Approval TTL elapsed |
| `CONSUMED` | Bound action executed or terminally attempted |
| `INVALIDATED` | Payload/evidence/policy changed after decision |

## Retry boundary

- Read/model calls may retry transient failures up to three attempts.
- Consequential execution must use idempotency and target-state verification.
- An ambiguous timeout on a consequential action forces Human Review before re-execution.
- Customer communication is never automatically resent after an ambiguous result.
- Exhausted or non-retryable actions are written to the dead-letter queue with a recovery owner.

## Closure boundary

The system may recommend closure only when:

- technical access criterion is `PASS`;
- customer successful-use criterion is `PASS`;
- evidence references resolve;
- outcome status is `ACHIEVED`;
- SLA status is deterministic;
- no blocking warning/error remains; and
- a named CSM or authorized owner approves closure.

