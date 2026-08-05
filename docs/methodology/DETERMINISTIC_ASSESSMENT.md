# Deterministic Assessment Methodology

## Why deterministic scoring is mandatory

Likelihood, impact, priority, confidence, SLA and outcome status must be reproducible from declared inputs. They cannot vary because a model phrased a prompt differently.

Vantix Control Value therefore uses a versioned ruleset. The AI sees the resulting assessment as context but cannot modify it.

**Ruleset:** `promiseops-assessment-ruleset-1.0.0`

## 1. Delivery-failure likelihood

This score estimates the **likelihood that the recorded promise will not be delivered and verified by its due time**, based on current observable conditions.

It is not churn prediction, renewal probability or a historical machine-learning model.

### Signals

| Signal code | Condition | Weight |
| --- | --- | ---: |
| `ACTIVE_BLOCKER` | The promised outcome is currently blocked | 2 |
| `ROOT_CAUSE_UNVERIFIED` | No verified cause evidence exists at the applicable stage | 2 |
| `DUE_WITHIN_5_BUSINESS_DAYS` | Due time is more than 2 and no more than 5 business days away | 2 |
| `DUE_WITHIN_2_BUSINESS_DAYS` | Due time is no more than 2 business days away | 3 |
| `OVERDUE_UNVERIFIED` | Due time has passed and required outcome evidence is incomplete | 4 |
| `NO_ACCOUNTABLE_OWNER` | Required CSM/Admin/delivery owner is missing or inactive | 2 |
| `NO_EXECUTED_REMEDIATION` | A confirmed blocker has no successful remediation result | 2 |
| `EXECUTION_FAILED` | Latest relevant execution failed or timed out | 3 |
| `REQUIRED_EVIDENCE_MISSING` | Applicable required evidence category is missing | 1 |
| `CONFLICTING_EVIDENCE` | Required evidence contains an unresolved conflict | 2 |
| `CUSTOMER_CONFIRMATION_PENDING` | Technical verification passed but customer-use confirmation is still absent | 1 |

Mutually exclusive timing signals are not double counted. `OVERDUE_UNVERIFIED` replaces both due-within signals.

### Raw score to 1–5 scale

| Raw total | Likelihood score | Label |
| ---: | ---: | --- |
| 0 | 1 | VERY_LOW |
| 1–2 | 2 | LOW |
| 3–5 | 3 | MEDIUM |
| 6–8 | 4 | HIGH |
| 9+ | 5 | VERY_HIGH |

## 2. Impact

Impact measures the business consequence if the promise is not delivered. It is independent of execution effort.

### Inputs

| Input | Value | Points |
| --- | --- | ---: |
| ARR tier | `TIER_3` | 1 |
| ARR tier | `TIER_2` | 2 |
| ARR tier | `TIER_1` | 3 |
| Renewal proximity | More than 90 days | 0 |
| Renewal proximity | 31–90 days | 1 |
| Renewal proximity | 0–30 days | 2 |
| Strategic status | Not strategic | 0 |
| Strategic status | Strategic | 1 |
| Contractual exposure | `NONE` or `LOW` | 0 |
| Contractual exposure | `MEDIUM` | 1 |
| Contractual exposure | `HIGH` | 2 |

### Raw score to 1–5 scale

| Raw total | Impact score | Label |
| ---: | ---: | --- |
| 1 | 1 | VERY_LOW |
| 2–3 | 2 | LOW |
| 4–5 | 3 | MEDIUM |
| 6–7 | 4 | HIGH |
| 8 | 5 | VERY_HIGH |

## 3. Priority

`priorityScore = likelihoodScore × impactScore`

| Priority score | Tier | Meaning |
| ---: | --- | --- |
| 1–4 | `P4_ROUTINE` | Normal monitoring or planned action |
| 5–9 | `P3_PLANNED` | Planned intervention |
| 10–15 | `P2_URGENT` | Urgent human-owned intervention |
| 16–25 | `P1_CRITICAL` | Immediate governed intervention |

Priority never becomes effort or story points.

## 4. Evidence completeness

Required evidence is stage-specific.

### Intake

1. Promise source.
2. Account identity.
3. Renewal date when renewal-sensitive.
4. CSM owner.
5. Admin/delivery owner when the problem may need technical work.
6. Customer problem observation.

### Pre-action

All intake evidence, plus:

7. Diagnostic evidence.
8. Target identity/configuration evidence.

### Post-execution

All pre-action evidence, plus:

9. Execution result.
10. Technical verification.
11. Customer-use confirmation.

`completenessPercent = present required categories ÷ applicable required categories × 100`

## 5. Evidence strength

Each present required category receives a deterministic strength value:

| Evidence condition | Strength |
| --- | ---: |
| Verified authoritative system-of-record or system observation | 100 |
| Verified authorized customer attestation or corroborating system evidence | 80 |
| Verified internal human attestation | 70 |
| Unverified but structurally valid evidence | 40 |
| Stale evidence | 20 |
| Conflicting or malformed evidence | 0 |

`strengthPercent = arithmetic mean of applicable present-category strengths`

## 6. Confidence

`confidenceScore = 0.60 × completenessPercent + 0.40 × strengthPercent`

The result is rounded to two decimals.

| Score | Label |
| ---: | --- |
| 85–100 | HIGH |
| 65–84.99 | MEDIUM |
| 0–64.99 | LOW |

Regardless of the numeric result:

- any unresolved conflict, malformed evidence or unknown required source forces `LOW`;
- `LOW` confidence forces Human Review;
- missing evidence that prevents a required calculation forces Human Review;
- AI cannot increase confidence.

## 7. Effort

Effort is independent of likelihood, impact, priority and confidence.

The only system-generated MVP value is:

`HUMAN_ESTIMATION_REQUIRED`

No story points, hours or effort band are inferred.

## 8. SLA

The synthetic scenario uses:

- timezone: `Asia/Kolkata`;
- start: 13 July 2026, 09:00;
- duration: 5 business days;
- calendar: Monday–Friday;
- synthetic holidays: none;
- start treatment: start-exclusive;
- deadline treatment: end-inclusive at 17:00.

The calculated due time is 20 July 2026, 17:00 Asia/Kolkata.

SLA status:

| Condition | Status |
| --- | --- |
| All required criteria pass at or before due time | `DELIVERED_WITHIN_SLA` |
| All required criteria pass after due time | `DELIVERED_LATE` |
| Due time passed and criteria are incomplete/failed | `BREACHED_OPEN` |
| Time/calendar/evidence cannot be established | `INCONCLUSIVE` |

The completion time is the later of the required technical-verification time and customer-use-confirmation time.

## 9. Synthetic scenario calculation

### Likelihood

- `ACTIVE_BLOCKER`: 2
- `DUE_WITHIN_5_BUSINESS_DAYS`: 2
- `NO_EXECUTED_REMEDIATION`: 2

Raw total = 6 → likelihood `4 / 5 — HIGH`.

### Impact

- ARR `TIER_1`: 3
- renewal within 30 days: 2
- strategic account: 1
- contractual exposure `HIGH`: 2

Raw total = 8 → impact `5 / 5 — VERY_HIGH`.

### Priority

`4 × 5 = 20` → `P1_CRITICAL`.

### Confidence

- completeness: 100
- average strength: 95

`0.60 × 100 + 0.40 × 95 = 98`

Confidence = `98 / 100 — HIGH`.
