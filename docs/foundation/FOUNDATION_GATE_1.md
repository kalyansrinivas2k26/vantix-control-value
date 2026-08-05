# Vantix Control Value — Foundation Gate 1

## Document control

| Field | Value |
| --- | --- |
| Product | Vantix Control Value — Customer Outcome & CRM Integrity Command Center |
| Tagline | From customer promise to verified outcome—with Salesforce evidence, governed AI and human control. |
| Gate | Foundation Gate 1 |
| Foundation version | 1.0.0 |
| Date | 30 July 2026 |
| Data boundary | Synthetic data only for the first validated run |
| Gate status | **APPROVED BY OWNER — 30 JULY 2026** |
| Workflow status | **GATE 2 SYNTHETIC WORKFLOW GENERATED; N8N IMPORT VALIDATION PENDING** |

## Why this gate exists

Vantix Control Value combines Customer Success decisions, Salesforce evidence, AI interpretation, human approval and outcome verification. If the meanings of “promise,” “evidence,” “approval,” “execution” and “verified outcome” are not frozen first, an apparently polished workflow can still make unsupported decisions, duplicate actions or claim success without proof.

Foundation Gate 1 therefore defines the business and data contract before any n8n nodes are built.

---

## 1. Confirmed problem statement

Enterprise customer promises are often dispersed across CRM notes, opportunities, cases, tasks, conversations and delivery records. Teams may know that something was promised without having one governed chain that shows:

1. the precise commitment;
2. the expected customer outcome;
3. the evidence available at each decision;
4. whether the evidence is complete, current and non-conflicting;
5. whether the cause belongs to the customer, operations, data, Salesforce ownership/access/automation/configuration or delivery;
6. who must act;
7. what the system is permitted to do;
8. which action requires a human decision;
9. whether the approved action executed;
10. whether the customer outcome was independently verified; and
11. whether to retry, reroute, escalate or close.

**Vantix Control Value solves this traceability and control gap.** It is not a churn-prediction model, a customer-health-score dashboard, a generic alert bot or an autonomous Salesforce administrator.

### Formal MVP problem statement

> Build a governed n8n-based command loop that accepts a customer promise and evidence, validates and scores the evidence deterministically, uses AI only for bounded qualitative diagnosis, selects actions from a policy-controlled catalogue, obtains human approval before consequential writes or communications, executes only permitted actions, verifies technical and customer outcomes separately, and preserves a complete auditable run envelope.

---

## 2. Frozen MVP

### 2.1 In scope

| Capability | Frozen MVP boundary |
| --- | --- |
| Promise capture | One canonical Promise Record per run, using a stable promise ID and idempotency key |
| Demonstration | One synthetic account promised resolution of a critical Salesforce report-access issue within five business days before renewal |
| Evidence | Synthetic Salesforce-style account, renewal, ownership, access, execution and customer-confirmation evidence |
| Salesforce role | Diagnose report/access evidence and create a governed Admin recommendation |
| CSM role | Create a separate customer-verification/commitment-follow-up recommendation |
| Deterministic logic | Evidence completeness, evidence strength, delivery-failure likelihood, impact, priority, SLA and outcome status |
| AI role | Qualitative root-cause interpretation, uncertainty disclosure and recommendation of action codes from the approved catalogue |
| AI critique | A second bounded consistency/evidence review; it is not independent factual validation and cannot approve an action |
| Policy | Machine-readable action catalogue plus deterministic policy enforcement |
| Approval | Explicit human decision bound to the exact action and payload hash |
| Execution | Synthetic executor for the first run; optional sandbox-safe internal record creation later |
| Verification | Separate technical-access verification and customer-successful-use verification |
| Recovery | Bounded retry, reroute, escalation and dead-letter decisions |
| Audit | Append-only events linked by correlation ID, promise ID, account key and evidence references |
| Reporting | Executive HTML report generated only from the validated final run envelope |

### 2.2 Two truthful operating modes

| Mode | Purpose | Salesforce access | Action execution |
| --- | --- | --- | --- |
| `SYNTHETIC_VALIDATION` | Mandatory first end-to-end proof | None required | Simulated, clearly labelled and still approval-controlled |
| `SANDBOX_READ_ONLY` | Optional second proof using synthetic records in a Salesforce sandbox | Least-privilege read access | Read-only checks; any later write remains disabled until separately approved and tested |

### 2.3 Explicitly out of scope

- Production customer data.
- Churn prediction or renewal-probability claims.
- Unapproved customer email, Slack, Teams or other outbound communication.
- Autonomous Salesforce permission, ownership, metadata, Flow, sharing or configuration changes.
- AI-calculated likelihood, impact, priority, confidence, SLA, DPO, DPMO, Sigma or story points.
- AI approval of its own recommendation.
- Story-point or effort estimation from risk or priority.
- A commercial SaaS UI, multi-tenant platform or billing.
- Automatic AgileOps work creation; this remains a future governed handoff.
- Cpk or decorative Sigma reporting.

### 2.4 Definition of MVP success

The MVP is successful only when all of the following are demonstrated:

1. A canonical promise and its evidence validate against versioned schemas.
2. Replaying the same promise does not create a second logical promise.
3. Deterministic calculations reproduce the documented values exactly.
4. AI diagnosis cites only supplied evidence and recommends only known action codes.
5. Malformed, missing, conflicting, weak or low-confidence evidence routes to Human Review.
6. Separate CSM and Salesforce Admin recommendations are created when supported.
7. No consequential action executes without a valid, unexpired human approval.
8. The approved synthetic action records an idempotent execution result.
9. Technical access and actual customer use are verified as two different criteria.
10. Promise closure is impossible until all required verification criteria pass.
11. Transient failure, non-retryable failure and ambiguous timeout follow different governed paths.
12. The executive report can be traced back to the evidence and audit events.

---

## 3. Stakeholders

| Stakeholder | Interest | Gate responsibility | MVP authority |
| --- | --- | --- | --- |
| Product Owner / Portfolio Owner | Portfolio quality, truthful claims, scope | Approves Foundation Gate 1 | Final MVP scope authority |
| Customer Success Manager | Promise ownership and customer outcome | Defines customer-facing action and confirms outcome | Approves/records CSM actions and closure |
| Salesforce Administrator | Access diagnosis and remediation | Confirms technical diagnosis/action feasibility | Approves Admin remediation action |
| Customer / Authorized Customer User | Receives the promised outcome | Supplies customer-use confirmation | Confirms actual report access/use |
| Delivery Team | Handles systemic remediation | Reviews future handoff | No automatic MVP work assignment |
| Security Reviewer | Least privilege, secret and data control | Reviews trust boundaries and public export | Can block unsafe release |
| AI Governance Reviewer | Model boundary and evidence grounding | Reviews prompts, schemas and fallbacks | Can force Human Review |
| n8n Operator | Workflow availability and recovery | Configures credentials, error workflow and retention | Operates but cannot override policy |
| Executive Sponsor | Outcome and renewal visibility | Consumes executive report | No technical override |

### Responsibility split

| Work | CSM | Salesforce Admin | System | Human approver |
| --- | --- | --- | --- | --- |
| Capture/clarify promise | Responsible | Consulted | Records | — |
| Validate CRM/access evidence | Consulted | Responsible | Performs deterministic checks | — |
| Diagnose likely cause | Consulted | Consulted | AI proposes bounded diagnosis | Reviews uncertainty when required |
| Select action | Consulted | Consulted | Policy selects from catalogue | Approves consequential action |
| Execute access remediation | Informed | Responsible | Simulates in first run | Admin approver authorizes |
| Contact customer | Responsible | Informed | Drafts/simulates only | CSM approver authorizes |
| Verify technical access | Informed | Responsible | Performs/readies system check | — |
| Verify customer use | Responsible | Informed | Records evidence | Customer/CSM attests |
| Close promise | Responsible | Consulted | Evaluates closure preconditions | Human authorizes closure |

---

## 4. CTQs and measurable success criteria

CTQ means **Critical to Quality**: a property that must be measurably correct for the system to be trusted.

| ID | CTQ | Measure | MVP target |
| --- | --- | --- | --- |
| CTQ-01 | End-to-end traceability | Required records containing the same correlation ID, promise ID and account key | 100% |
| CTQ-02 | Contract integrity | Positive fixtures accepted; intentionally invalid fixtures rejected | 100% expected results |
| CTQ-03 | Evidence integrity | Missing/conflicting/malformed required evidence prevents execution | 100% safe routing |
| CTQ-04 | Deterministic reproducibility | Recalculated likelihood, impact, priority, confidence and SLA equal documented values | 100% exact match |
| CTQ-05 | AI grounding | Diagnosis claims with at least one supplied evidence reference | 100% of factual claims |
| CTQ-06 | Action containment | Recommended action codes present in the approved catalogue | 100% |
| CTQ-07 | Human authority | Consequential writes/communications with a valid prior human approval | 100%; zero bypasses |
| CTQ-08 | Idempotency | Duplicate logical promises/actions created from an identical idempotency key | 0 |
| CTQ-09 | Outcome proof | Closed promises without both system-access and customer-use verification | 0 |
| CTQ-10 | Recovery control | Exhausted/non-retryable/ambiguous failures carrying correlation and action identifiers into the dead-letter path | 100% |
| CTQ-11 | Audit completeness | Mandatory lifecycle transitions represented by ordered audit events | 100% |
| CTQ-12 | Public-release hygiene | Credentials, tokens, org URLs, record data or private IDs in public package | 0 |
| CTQ-13 | Synthetic truthfulness | First-run records and report visibly labelled synthetic | 100% |
| CTQ-14 | Role clarity | Supported CSM and Admin work represented as separate recommendations | 100% |

---

## 5. Architecture decision

Vantix Control Value uses a **deterministic control plane with bounded AI inside it**.

1. Deterministic components establish identity, schema validity, evidence quality, scores, policy, approval state, idempotency, SLA and final outcome.
2. AI receives only the evidence summaries needed for qualitative diagnosis.
3. AI returns structured claims and catalogue action codes; it cannot perform or approve an action.
4. A separate critique checks evidence citation and internal consistency.
5. Deterministic validation and policy decide whether to continue, request review or deny execution.
6. Execution and verification are separate stages.
7. Closure requires both technical and customer evidence.

The detailed architecture and state model are in `docs/architecture/ARCHITECTURE.md`.

### Logical persistence

The MVP will use four new Vantix Control Value-specific logical stores. These do not reuse the prior project’s scan-history structure:

| Store | Key | Purpose |
| --- | --- | --- |
| Promise Run Store | `correlationId` | Current validated run envelope and lifecycle status |
| Idempotency & Action Ledger | `idempotencyKey` | Duplicate-promise and duplicate-action prevention |
| Audit Event Ledger | `correlationId + sequence` | Append-only trace of decisions and state changes |
| Dead-Letter Queue | `deadLetterId` | Sanitized terminal/ambiguous failures and recovery ownership |

Physical n8n Data Table columns will be designed only with the workflow, after gate approval.

---

## 6. Canonical contracts

All schemas use JSON Schema Draft 2020-12, semantic versions and `additionalProperties: false` at governed object boundaries.

| Contract | Purpose | Owner of truth |
| --- | --- | --- |
| Promise Record | Exact commitment, expected outcome, owner, SLA and impact inputs | Human/CRM source |
| Evidence Record | A traceable observation or attestation, with strength and trust state | Source system or named human |
| Deterministic Assessment | Likelihood, impact, priority, confidence, completeness and calculation trace | Code/ruleset |
| AI Diagnosis | Evidence-cited qualitative cause and approved catalogue suggestions | AI, advisory only |
| AI Critique | Evidence/consistency review of the diagnosis | AI, advisory only |
| Action Recommendation | A bounded, policy-evaluated action proposal | Policy engine |
| Human Decision | A human approval/rejection bound to one immutable action payload | Named human |
| Execution Result | Attempt, idempotency, target, change summary and error/retry state | Executor |
| Outcome Verification | Technical and customer criteria plus deterministic SLA/next decision | Verification rules |
| Audit Event | Append-only actor/action/result trace | Orchestrator |
| Complete Run Envelope | Entire final run with versions, warnings, errors and status | Orchestrator |

The machine-readable schemas are in `contracts/v1.0.0/`.

---

## 7. Action policy and approval boundary

### Automatically permitted

- Validate schemas and identifiers.
- Read synthetic fixture data.
- Perform approved read-only Salesforce queries in sandbox mode.
- Calculate deterministic assessment and SLA.
- Call AI for bounded diagnosis and critique.
- Draft internal recommendations.
- Append internal audit events.
- Perform read-only verification.

### Human approval required

- Any Salesforce create, update, upsert or delete outside the internal audit/run store.
- Any access, permission, sharing, ownership, automation or configuration change.
- Any customer-facing communication.
- Any executive escalation or delivery handoff.
- Closing the promise in a system of record.
- Re-executing an action after an ambiguous timeout.

### Always denied in the MVP

- AI approval.
- Action codes not present and enabled in the catalogue.
- Execution when required evidence is missing, conflicting, malformed, stale or below the confidence threshold.
- Live metadata/configuration changes.
- Unapproved outbound messages.
- Outcome or SLA claims without verification evidence.
- Story-point assignment or effort inference.

### Approval binding

A decision is valid only when:

- `actorType = HUMAN`;
- the actor has an allowed approver role;
- decision is `APPROVE`;
- `actionId`, `payloadHash` and `promiseId` match exactly;
- the decision is not expired or previously consumed;
- required separation of duties passes; and
- the action has not already succeeded under the same idempotency key.

The full catalogue and policy are in `governance/action-catalog.v1.0.0.json` and `docs/governance/ACTION_POLICY.md`.

---

## 8. Frozen synthetic demonstration scenario

### Scenario

**Meridian Industrial Systems** is a fabricated strategic account. Its authorized customer user cannot open the **Renewal Readiness Executive Report** because the required Salesforce report-folder access is absent, although base user/object/report permissions are present. Renewal is on **31 July 2026**.

On **13 July 2026 at 09:00 Asia/Kolkata**, the CSM records this promise:

> Restore the authorized customer user’s access to the Renewal Readiness Executive Report and obtain confirmation that the customer successfully opened it within five business days.

Using a start-exclusive, end-inclusive business calendar with weekends excluded and no synthetic holidays, the promise is due on **20 July 2026 at 17:00 Asia/Kolkata**.

### Expected governed path

1. Promise and stable identifiers validate.
2. Duplicate-promise check passes.
3. Account, renewal, CSM/Admin ownership and access evidence validate.
4. Deterministic pre-action assessment produces:
   - delivery-failure likelihood: `4 / 5 — HIGH`;
   - impact: `5 / 5 — VERY_HIGH`;
   - priority: `20 / 25 — P1_CRITICAL`;
   - confidence: `98 / 100 — HIGH`;
   - effort: `HUMAN_ESTIMATION_REQUIRED`.
5. AI diagnoses `SALESFORCE_ACCESS` and cites the folder-sharing evidence.
6. AI critique passes the bounded evidence/consistency check.
7. Policy creates separate Admin and CSM recommendations.
8. Authorized humans approve the exact proposed payloads.
9. The synthetic Admin remediation and CSM verification request execute once.
10. A system check records Salesforce access restored.
11. The customer-use attestation records successful report access.
12. Deterministic outcome verification returns `ACHIEVED` and `DELIVERED_WITHIN_SLA`.
13. Human-approved closure executes.
14. The executive report presents the promise, evidence, decisions, actions, outcome and audit trail with synthetic labels.

The complete expected run is in `fixtures/synthetic/mvp-complete-run.v1.0.0.json`.

---

## 9. Registers

The canonical machine-readable registers are in `governance/registers.v1.0.0.json`.

### Key decisions

- Vantix Control Value is a separate workflow, not a renamed or converted Governance Sentinel workflow.
- The sanitized public Sentinel export is used only to identify reusable architectural controls.
- Vantix Control Value does not reuse Salesforce Flow queries, DPMO logic, scan-history storage or the governance-finding model.
- First validated run is synthetic.
- Deterministic rules own scores and outcomes; AI is qualitative and advisory.
- Technical restoration and customer success are two separate required proofs.
- A simulated executor is acceptable for the first MVP only when visibly labelled.

### Highest risks

- Treating a permission/configuration observation as proof that the user actually succeeded.
- Letting an AI narrative introduce an unsupported fact or unknown action.
- Approval replay against a changed payload.
- Duplicate execution after an ambiguous timeout.
- Portfolio language overstating synthetic results as production capability.
- Building a live Salesforce write path before the synthetic control loop is proven.

### Open questions deliberately deferred until after gate approval

- Exact n8n version and import target.
- Whether sandbox mode will use fixtures only or read synthetic Salesforce records.
- The precise physical n8n Data Table column mapping.
- The human-approval interaction surface used for the local demo.
- Whether the optional sandbox write will create an internal task or remain fully simulated.

These questions do not change the canonical contracts or human-control policy, so they do not block this foundation gate.

---

## 10. Gate exit checklist

| Exit criterion | Status |
| --- | --- |
| Problem statement confirmed | Complete |
| MVP and non-goals frozen | Complete |
| Stakeholders and authority defined | Complete |
| CTQs and measurable targets defined | Complete |
| Logical architecture and state model defined | Complete |
| Versioned canonical contracts created | Complete |
| Action policy and approval boundary defined | Complete |
| Synthetic demonstration scenario frozen | Complete |
| Decisions, assumptions, risks, open questions, enhancements and technical debt recorded | Complete |
| Schemas and cross-contract controls validated with an actual validator | Complete — 92 passed, 0 failed |
| Product owner approval | **Pending** |
| Vantix Control Value workflow JSON | **Intentionally not started** |

## Approval decision requested

Approve Foundation Gate 1 only if the frozen scope, contracts, scoring, action policy, synthetic scenario and deferred questions are acceptable.

On approval, the next dependency-ordered build step is:

1. create the Vantix Control Value-specific n8n run skeleton;
2. implement contract validation and synthetic ingestion;
3. add deterministic assessment;
4. add bounded diagnosis and critique;
5. add policy and approval state;
6. add simulated execution and two-part verification;
7. add recovery, audit and reporting.

---

## Primary design references

- [Salesforce: OAuth Client Credentials and dedicated integration-user pattern](https://developer.salesforce.com/blogs/2024/02/invoke-rest-apis-with-the-salesforce-integration-user-and-oauth-client-credentials)
- [Salesforce: upsert using an External ID](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_upsert.htm)
- [n8n: handle workflow errors gracefully](https://docs.n8n.io/build/flow-logic/handle-errors-gracefully)
- [n8n: Retry On Fail and node error behavior](https://docs.n8n.io/build/understand-workflows/workflow-components/work-with-nodes)
- [Google Gemini: structured outputs with JSON Schema](https://ai.google.dev/gemini-api/docs/generate-content/structured-output)
