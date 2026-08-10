# PMP Governance and PMI AI Alignment

This is an internal control mapping against the areas named in the governing documentation standard; it is not a PMI certification or external conformity assessment.

| PMI AI area named in the standard | Attestor control or artifact | Evidence | Status |
|---|---|---|---|
| Value and benefits | Canonical business-outcome sentence and module decisions | `README.md`, `docs/executive-brief.md` | Documented |
| Governance | Six release gates, decision register and evidence index | `docs/final-signoff-gates.md`, `docs/decision-register.md` | Documented; several gates open |
| Stakeholder accountability | Role-bound human decisions in module workflows | Workflow JSONs and synthetic reports | Demonstrated on positive synthetic fixtures |
| Risk | Threat model, FMEA and risk register | `docs/security-threat-model.md`, `docs/failure-mode-analysis.md`, `docs/risk-register.md` | Documented |
| Human oversight | Approval binding before consequential routes | Workflow JSONs | Demonstrated on positive synthetic fixtures |
| Adaptive and predictive delivery fit | Agile backlog and incremental module releases | `docs/agile-delivery.md`, `docs/release-notes.md` | Documented |
| Decision authority | Deterministic policy precedes AI narrative; allowed approver roles are explicit | Workflow JSONs, `docs/architecture.md` | Partly demonstrated |
| Transparency | Correlation IDs, evidence references, reports and evidence index | `docs/evidence-index.md`, reports | Demonstrated for synthetic paths |
| Responsible AI | Bounded AI, output validation and security test plan | `docs/security-threat-model.md` | Partly demonstrated; adversarial tests pending |

## Decision rights

| Decision | Authority |
|---|---|
| Deterministic classification | Module policy engine |
| Qualitative narrative or hypothesis wording | Bounded AI step |
| Consequential action or closure | Named human role with bound decision |
| Release-tier advancement | Evidence-based sign-off gates |

## Change control

Changes to policy thresholds, CTQ denominators, approval roles or evidence contracts require a documented decision entry, regression impact assessment and updated evidence.
