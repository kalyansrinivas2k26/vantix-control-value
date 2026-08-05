# RAID Log — Vantix Control Value

*Risks, Assumptions, Issues, Dependencies. Risks and Assumptions below are pulled directly from `governance/registers.v1.0.0.json` (the machine-readable source of truth) rather than restated informally — if the two ever disagree, the JSON register wins. Issues are real findings from the completed external design audit, not hypothetical examples.*

## Risks

| ID | Risk | Likelihood | Impact | Response | Owner | Status |
| --- | --- | --- | --- | --- | --- | --- |
| RSK-001 | AI invents or overstates a Salesforce cause | Medium | High | Strict claims schema, evidence-reference resolution, independent critique, human-review fallback | AI Governance Reviewer | Open |
| RSK-002 | A technical state is mistaken for customer outcome proof | High | High | Separate system and customer verification criteria required before closure | Customer Success Manager | Mitigated by design |
| RSK-003 | An approval is replayed after action parameters change | Medium | Critical | Decision bound to action ID + SHA-256 payload hash; single-use and expiring | Security Reviewer | Mitigated by design |
| RSK-004 | An ambiguous timeout causes a duplicate consequential action | Medium | High | Idempotency ledger, target-state check, human review before re-execution | n8n Operator | Mitigated by design |
| RSK-005 | Portfolio language presents synthetic success as production validation | Medium | High | Synthetic flags, limitations, sanitized public-release checklist | Product Owner | Open |
| RSK-006 | Scope expands into live remediation or commercial SaaS before the control loop works | High | Medium | Frozen MVP non-goals; gate approval required before expansion | Product Owner | Mitigated by gate |

Two risks remain genuinely **Open** rather than closed: RSK-001 (AI overstatement) and RSK-005 (overclaiming synthetic success). Both are structural risks that can never be fully "designed away" — they require ongoing discipline every time new content is written or a new gate is demoed, which is why `docs/methodology/AI_VALUE_AND_GOVERNANCE.md` and the evidence-honesty language throughout this repo exist as living controls, not one-time fixes.

## Assumptions

| ID | Assumption |
| --- | --- |
| ASM-001 | The first demonstration uses only fabricated identities, records, and timestamps |
| ASM-002 | Asia/Kolkata, Monday–Friday, with no synthetic holidays, is the approved demonstration calendar |
| ASM-003 | The synthetic access evidence is sufficient to demonstrate the diagnosis and verification logic |
| ASM-004 | A human approval interaction can be represented by a deterministic fixture in automated testing |

Every assumption above is an explicit bet that synthetic data is sufficient to prove control logic before spending a live credential. Gates E–G exist specifically to retire these assumptions one at a time rather than all at once.

## Issues (closed, from the completed external design audit)

| ID | Issue | Severity | Found by | Resolution | Status |
| --- | --- | --- | --- | --- | --- |
| ISS-001 | `DEFER_HUMAN_REVIEW` policy decision computed but never enforced | Medium-High | Independent line-by-line audit, 2 Aug 2026 | Fixed in `scripts/build-gate2-workflows.mjs` node 11; regression test `NEGATIVE_LOW_CONFIDENCE_BUSINESS_RULE` added | Closed |
| ISS-002 | Error workflow expected correlation metadata the main workflow never set | Medium | Same audit | Fixed via `$execution.customData.set(...)`; regression checks added to `scripts/validate-gate2.mjs` | Closed |
| ISS-003 | Executive HTML report never stated open vs. closed status | Medium (evidence honesty) | Same audit | Fixed with an explicit closure/non-closure banner | Closed |
| ISS-004 | No LICENSE file present | Low (GitHub readiness) | Same audit | MIT `LICENSE` added | Closed |
| ISS-005 | Only 3 of 16 audit-requested failure categories had automated negative fixtures | Low-Medium (test coverage) | Same audit | Raised to 8 of 16 with new fixtures and checks | Partially closed — 8 categories remain fixture-free, tracked as TD-005 below |
| ISS-006 | `$execution.customData` set in the main workflow does not reach the bound Error Trigger's payload in real n8n (2.31.5 Cloud) — confirmed by live testing, not caught by local simulation | Medium | Owner-run live n8n test, 4 Aug 2026 (Gate B evidence capture) | Correlation context now embedded directly in the thrown error message (the field n8n reliably forwards) instead of relying on customData; error handler parses it back out. Regression tests added on both sides (thrower and parser) | Closed |

ISS-006 is the most valuable finding in this log, not despite being found late but because of how it was found: the local Node.js simulation (`scripts/validate-gate2.mjs`) could not have caught it, because the simulation's mock of `$execution.customData` necessarily assumes the API behaves as documented. Only running the real thing in real n8n exposed that the Error Trigger doesn't forward it. This is the exact distinction this project has drawn throughout between "verified by code inspection" and "observed" — ISS-006 is proof the distinction is real, not just a phrase in a document.

See `docs/methodology/AUDIT_QUALITY_DPMO.md` for the defect-rate measurement (3 defects / 186 opportunities = 16,129 DPMO) built from ISS-001 through ISS-003.

## Dependencies

| ID | Dependency | Needed for | Status |
| --- | --- | --- | --- |
| DEP-001 | Owner has n8n Cloud access at `bkrsrinivas.app.n8n.cloud` | Gate B (clean import and execution) | Available |
| DEP-002 | Owner supplies a personal Anthropic or Gemini API key (never committed to the repo) | Running `scripts/live-ai-diagnosis-preview.mjs` | Available, opt-in per run |
| DEP-003 | A Salesforce Developer Edition sandbox with OAuth Client Credentials configured | Gate E (read-only Salesforce evidence) | Not yet provisioned |
| DEP-004 | GitHub repository created under the owner's account | Gate H (public release) | To be created today |
| DEP-005 | A real interactive human-approval surface (n8n Form or Wait/Webhook) design decision | Gate G | Open — tracked as OQ-003 below |

## Open questions carried from the foundation register

| ID | Question | Decision point | Owner |
| --- | --- | --- | --- |
| OQ-001 | Which exact n8n version is the import/validation target? | Before workflow JSON generation | n8n Operator |
| OQ-002 | Will an optional second run read synthetic Salesforce sandbox records, or stay fixture-only? | After the synthetic end-to-end pass | Product Owner |
| OQ-003 | Which interactive approval surface will be used in the local demo — n8n Form, Wait/Webhook callback, or another local human step? | Approval node design (Gate G) | n8n Operator |
| OQ-004 | Will any optional sandbox write create only an internal task, or will all action execution remain simulated for the MVP? | After security review of the read-only run | Security Reviewer |

None of these four are blocking for Gate 2 — they're recorded here so a later gate doesn't have to rediscover them from scratch.
