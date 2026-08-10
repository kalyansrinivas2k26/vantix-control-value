# PromiseOps Current Status and Audit Handoff

## Business problem

CRM teams can record activities while still failing to prove that a customer promise produced its intended outcome. PromiseOps is designed to make the chain from promise to evidence, permitted intervention, verification and human-approved closure traceable.

The system must answer six questions:

1. What exactly was promised?
2. What outcome was expected?
3. What intervention was permitted and planned?
4. What actually executed?
5. What technical and customer evidence verifies the outcome?
6. If the outcome is not verified, should the system retry, reroute, escalate or remain open?

## Governing principle

> Evidence establishes facts. Deterministic policy controls action. AI may explain. Named humans authorize consequential action and closure.

## Current gate

| Area | Current state |
| --- | --- |
| Foundation contracts and policies | Built and locally validated |
| Gate 2 n8n workflow | Credential-free synthetic export built |
| Gate 2 error workflow | Built; owner must import and bind it in n8n |
| Local workflow runtime simulation | 94/94 checks passed |
| Owner clean import and n8n execution | Pending |
| Live Gemini | Not enabled |
| Salesforce sandbox read-only path | Not enabled |
| Salesforce/customer-facing writes | Explicitly outside Gate 2 |
| Real human approval capture | Not implemented; fixture only |
| Durable idempotency and DLQ | Pending later-gate design |
| GitHub production-quality release | Not yet prepared |

## Synthetic scenario

The canonical fixture represents a fabricated strategic account whose customer cannot open a renewal-readiness report. The synthetic control loop diagnoses missing report-folder access, permits only catalogued simulated actions, verifies technical access separately from customer use, checks SLA performance and requires payload-bound human authorization before closure.

Expected deterministic result:

| Measure | Expected value |
| --- | --- |
| Final route | `CLOSE` |
| Execution status | `CLOSED` |
| Likelihood | `4/5 HIGH` |
| Impact | `5/5 VERY_HIGH` |
| Priority | `20/25 P1_CRITICAL` |
| Confidence | `98/100 HIGH` |
| Technical verification | `PASS` |
| Customer-use verification | `PASS` |
| SLA | `DELIVERED_WITHIN_SLA` |
| External Salesforce writes | `0` |
| Real customer messages | `0` |

## What may be reused from Flow Integrity

Only reusable control patterns may be carried forward:

- least-privilege OAuth Client Credentials architecture;
- separate error workflow and sanitized failure packet;
- deterministic facts before AI interpretation;
- structured-output validation and fail-closed routing;
- explicit human-review boundaries;
- correlation/version metadata;
- HTML escaping, sanitization and evidence-first reporting;
- reproducible validation and release hygiene.

## What must not be copied from Flow Integrity

PromiseOps must not reuse or cosmetically rename:

- the `FlowDefinitionView` query or Salesforce Flow metadata model;
- DPMO definitions created for Flow-governance scanning;
- Flow Integrity scan-history Data Table schemas;
- governance-finding, severity or remediation-story logic;
- Flow-specific policy checks;
- real org identifiers, credential references or environment values;
- any claim that a synthetic replay is a live model, Salesforce or customer event.

PromiseOps requires its own promise ledger, outcome criteria, evidence model, action policy, approval semantics, idempotency design, verification model and closure rules.

## Terminology that must remain unambiguous

- **Customer Success Manager** is a workflow/business actor in this customer-outcome scenario. Existing action codes beginning `CSM_` refer to that role.
- **Certified ScrumMaster** is the portfolio owner's professional credential and delivery discipline. It is not the same role and should always be written in full in public-facing material.
- **Human approval fixture** means fabricated test data proving contract logic. It does not mean n8n collected a real approval.
- **AI diagnosis fixture** means a pre-authored structured replay. It is not a Gemini execution.

## Requested audit decision

The reviewer should decide only whether the Gate 1/Gate 2 design is safe and coherent enough to proceed to an owner-run synthetic n8n import. A final GitHub or production-readiness verdict is premature until the later evidence gates are complete.

