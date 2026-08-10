# Business Case — Vantix Control Value

*Structured as Situation–Complication–Question–Answer, the way a McKinsey one-pager would open. Every number below is an explicitly labeled illustrative assumption, not measured data — this project has no live deployment yet, and presenting a fabricated number as if it were real would violate the same evidence-honesty standard enforced everywhere else in this repository. The purpose of this model is to show the *shape* of the value case and make every input inspectable and challengeable, not to claim a validated return.*

## Situation

CRM systems record that a customer-facing activity happened. They rarely prove the customer actually received what was promised. A "closed" case and a "verified, working outcome" are treated as the same thing in most workflows, when they are not.

## Complication

When a promise silently fails — the fix didn't work, the customer never confirmed it, the SLA was actually missed — nobody finds out until the customer churns, escalates, or disputes the outcome in a renewal conversation. By then the cost is a lost or discounted deal, not a fixable ticket.

## Question

What would it be worth to catch that gap before the customer does — and can it be done without adding meaningful process overhead or introducing new risk from an ungoverned AI layer?

## Answer

A governed control loop that requires separate technical and customer verification before closure, with deterministic policy (not AI judgment) controlling what can happen, closes the exact gap described above — and the illustrative model below shows why even a modest reduction in silently-failed promises is worth more than the operational cost of running the control loop.

## MECE issue tree

The problem breaks into exactly three mutually exclusive, collectively exhaustive failure modes — every "promise gone wrong" scenario falls into exactly one of these:

```
Why does a customer promise fail to deliver verified value?
├── 1. It was never actually fixed
│   → caught by: separate TECHNICAL verification (criterion: SALESFORCE_ACCESS_RESTORED)
├── 2. It was fixed, but the customer never confirmed they could use it
│   → caught by: separate CUSTOMER-USE verification (criterion: CUSTOMER_REPORT_ACCESSED, human attestation only)
└── 3. It was fixed and confirmed, but too late to count
    → caught by: deterministic SLA evaluation (completionAt vs. dueAt, calculated, not claimed)
```

No failure mode is left uncovered, and no single check is asked to do double duty (this is why the schema requires all three criteria to pass independently before `closureEligible` can be `true` — see `contracts/v1.0.0/outcome-verification.schema.json`).

## Illustrative ROI model — assumptions in full

| Input | Illustrative value | Basis / rationale |
| --- | --- | --- |
| Promises handled per CSM per month | 40 | Round-number placeholder for a mid-size B2B SaaS CSM book of business — not sourced from any specific company |
| % of promises that would silently fail without verification (never fixed, never confirmed, or late — but recorded as "done") | 8% | Illustrative estimate; industry-specific figures vary and are not asserted here |
| Cost of one silently-failed promise reaching the customer unnoticed (support escalation time + relationship damage, rough) | $650 | Illustrative — approximates a few hours of escalation handling plus a fraction of at-risk renewal value, spread across many accounts; not a specific customer's data |
| % of the above that a governed verification step would actually catch before the customer does (this project's central claim) | 70% | Illustrative — reflects that technical + customer + SLA checks catch most, not all, silent failures (evidence quality and human follow-through remain limiting factors) |
| Operational cost of running the verification step per promise (CSM/admin time for the extra approval and confirmation steps) | $12 | Illustrative — a few minutes of human approval time per consequential action, at loaded cost |

## The resulting illustrative shape (not a forecast)

```
Promises per month (per 10-CSM team):           400
Silently-failed without verification (8%):       32
Cost if uncaught, per promise:                  $650
Uncaught cost exposure per month:            $20,800

Caught by governed verification (70% of 32):     22.4
Value protected per month:                   $14,560
Operational cost of verification (400 × $12):  $4,800

Illustrative net monthly value:               $9,760
```

**What this table is for:** showing that even under conservative, clearly-labeled assumptions, the shape of the value case is favorable — the operational cost of the extra verification step is small relative to even a partial catch rate on silent failures. **What this table is not for:** citing as a real number in a pitch. Every input is a placeholder pending real data from Gates E–G (live Salesforce evidence, real customer confirmation, real SLA outcomes).

## What would turn this from illustrative to real

1. Replace the 8% silent-failure-rate assumption with a measured rate from even one real team's historical case data.
2. Replace the $650 cost-per-failure assumption with an actual support-escalation cost model or churn-attribution study.
3. Run the system against real (even low-volume) promises for one measurement period and compute the real catch rate, not an assumed 70%.

Until then, this document's job is to prove the *reasoning* is sound and the *inputs* are inspectable — which is the McKinsey standard for a business case at this stage of a project, not a substitute for the validated version that Gates E–G would eventually produce.
