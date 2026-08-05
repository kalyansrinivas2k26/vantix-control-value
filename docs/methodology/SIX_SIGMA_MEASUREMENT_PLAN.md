# Six Sigma Measurement Plan

## Why Vantix Control Value will not copy the prior DPMO model

Vantix Control Value measures a customer-promise lifecycle, not Salesforce Flow metadata. The unit, applicable opportunities and defects must therefore be defined specifically for Vantix Control Value.

The first synthetic run proves calculation mechanics only. It does not establish organizational process capability.

## Measurement definitions

### Unit

One customer promise lifecycle assessed at a defined measurement cutoff.

### Opportunity

One declared Vantix Control Value control that is applicable to that promise at the cutoff.

### Defect

One failed applicable control. A control can contribute no more than one defect per promise at one cutoff.

### Denominator

`total opportunities = sum of applicable control opportunities across measured promise units`

Vantix Control Value will not assume every promise has the same number of opportunities. Non-applicable controls are excluded from both defect and opportunity counts.

### Formulas

`DPO = total defects ÷ total applicable opportunities`

`DPMO = DPO × 1,000,000`

## Frozen defect catalogue

| Defect code | Applicable when | Defect definition | Evidence needed |
| --- | --- | --- | --- |
| `PROMISE_NOT_ASSIGNED_WITHIN_SLA` | Every promise | No valid accountable owner within 4 business hours of capture | Promise and owner evidence |
| `INTERVENTION_NOT_CREATED_WITHIN_SLA` | Priority P1/P2 with complete intake evidence | No governed action recommendation within 4 business hours of completed intake | Assessment and action records |
| `MISSING_RENEWAL_DATE` | Promise is renewal-sensitive | Renewal date absent at intake-validation cutoff | Renewal evidence |
| `MISSING_EXECUTIVE_SPONSOR` | Account is strategic and sponsor is required by policy | Sponsor absent at pre-action approval cutoff | Account/sponsor evidence |
| `INCOMPLETE_CUSTOMER_HANDOFF` | Customer-facing ownership/delivery handoff is required | Required handoff checklist is incomplete at handoff cutoff | Handoff evidence |
| `INCORRECT_OWNERSHIP` | A role owner is required | Owner is inactive, wrong role/type, or violates routing policy | User/ownership evidence |
| `OVERDUE_ESCALATION` | Promise is breached or retry is exhausted | No escalation record within 1 business hour of the qualifying event | Outcome, failure and escalation evidence |
| `PROMISE_CLOSED_WITHOUT_VERIFICATION` | Promise status is closed | Required technical and customer verification were not both `PASS` before closure | Verification and audit records |

## Reporting boundary

The MVP may report:

- units measured;
- applicable opportunities;
- defects by definition;
- DPO and DPMO;
- a clear synthetic/small-sample limitation.

The MVP will not report:

- Cpk;
- a decorative Sigma level;
- control limits from insufficient time-ordered data;
- a capability claim from one synthetic promise;
- a comparison to an industry benchmark without a valid comparable dataset.

## Synthetic scenario example

For one promise, suppose six controls are applicable and all six pass:

- units = 1;
- applicable opportunities = 6;
- defects = 0;
- DPO = 0;
- DPMO = 0.

The correct interpretation is:

> No defects were observed in six applicable control opportunities for this single synthetic demonstration unit.

It is not:

> The process is Six Sigma capable.

