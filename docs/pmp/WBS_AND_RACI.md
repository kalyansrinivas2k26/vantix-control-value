# Work Breakdown Structure and RACI — Vantix Control Value

## Work breakdown structure

Each gate is a phase; each phase has concrete, checkable deliverables rather than open-ended activity. This mirrors `03-BUILD-AND-AUDIT-PLAN.md` at the pack root, restated here as a formal WBS with status.

```
Vantix Control Value
├── 1.0 Foundation (Gate 1)
│   ├── 1.1 Canonical contracts (13 JSON Schemas)                          [Done]
│   ├── 1.2 Action catalogue and policy                                    [Done]
│   ├── 1.3 Deterministic assessment methodology                          [Done]
│   └── 1.4 Local cross-contract validation (97/97 checks)                [Done]
├── 2.0 Synthetic governed vertical slice (Gate 2)
│   ├── 2.1 Main workflow — 20-node n8n export                            [Done]
│   ├── 2.2 Error/dead-letter handler workflow                           [Done]
│   ├── 2.3 Local runtime simulation (98/98 checks)                       [Done]
│   ├── 2.4 External design audit                                        [Done — GREEN, 3 defects found and fixed]
│   ├── 2.5 Owner clean import and execution in n8n                      [Pending — today]
│   └── 2.6 Evidence capture (screenshots, execution ID, dead-letter proof)[Pending — today]
├── 3.0 Negative and fail-closed evidence (Gate C)
│   ├── 3.1 Automated negative fixtures (8 of 16 categories)              [Partial]
│   └── 3.2 Owner-run negative fixtures inside n8n                       [Not started]
├── 4.0 Persistence and recovery design (Gate D)                          [Not started]
├── 5.0 Salesforce sandbox read-only path (Gate E)                        [Not started]
├── 6.0 Live AI behind the deterministic boundary (Gate F)
│   └── 6.1 Local live-model preview script                               [Done — optional, opt-in]
│   └── 6.2 Live AI wired into the n8n workflow itself                    [Not started]
├── 7.0 Real human approval capture (Gate G)                              [Not started]
└── 8.0 Final portfolio/GitHub release (Gate H)
    ├── 8.1 MIT LICENSE                                                   [Done]
    ├── 8.2 CI validation on push/PR                                      [Done]
    ├── 8.3 Executive summary for non-technical reviewers                 [Done]
    ├── 8.4 AI value/governance documentation                             [Done]
    ├── 8.5 PMP/Six Sigma/Agile artifacts (this set of documents)         [Done]
    └── 8.6 GitHub repository creation and push                           [Pending — today]
```

## RACI matrix

R = Responsible (does the work), A = Accountable (owns the outcome), C = Consulted, I = Informed.

Given this is currently a single-owner project, most rows show the same person as R and A — the value of the RACI here is naming which **role** is accountable for which category of decision, so the structure is ready to hand off or scale without re-deriving who-does-what from scratch.

| Deliverable / decision | Responsible | Accountable | Consulted | Informed |
| --- | --- | --- | --- | --- |
| Contract and schema correctness | Portfolio Owner | Portfolio Owner | External Auditor | — |
| Deterministic scoring formulas (likelihood/impact/priority/confidence) | Portfolio Owner | Portfolio Owner | Six Sigma discipline (self-applied) | — |
| Action catalogue policy decisions (allow/deny/require-approval) | Portfolio Owner | Security Reviewer (role) | AI Governance Reviewer (role) | n8n Operator (role) |
| AI diagnosis/critique scope and grounding rules | Portfolio Owner | AI Governance Reviewer (role) | External Auditor | Product Owner (role) |
| External design audit findings and remediation | External Auditor | Portfolio Owner | — | Product Owner (role) |
| n8n import, execution, and evidence capture | Portfolio Owner (as n8n Operator) | Portfolio Owner | — | — |
| Public-release evidence honesty (no overclaiming) | Portfolio Owner | Product Owner (role) | External Auditor | Recruiters/hiring managers (readers) |
| GitHub publication and licensing | Portfolio Owner | Portfolio Owner | — | Public repository readers |

## Why this matters for a single-owner portfolio project

A RACI with one name in every cell would be decoration. Naming the **role** (Security Reviewer, AI Governance Reviewer, Product Owner) separately from the person doing the work today is what makes this project's governance model legible to someone evaluating whether it could scale to a real team — the accountability structure already exists in the design; it doesn't need to be invented later.
