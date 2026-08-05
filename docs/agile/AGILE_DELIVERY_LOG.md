# Agile Delivery Log — Vantix Control Value

*Certified ScrumMaster note: `CSM_` action codes in this project mean Customer Success Manager, not Certified ScrumMaster — see `docs/GLOSSARY.md`. This document is where the Certified ScrumMaster discipline actually shows up: real sprints, a real Definition of Done, and a real retrospective of work already completed in this repository.*

## Sprints (Gates reframed as iterations)

Each Gate A–H from `03-BUILD-AND-AUDIT-PLAN.md` is also a sprint with its own goal and Definition of Done. Unlike a generic template, every "Done" below is backed by an artifact you can open.

| Sprint | Sprint goal | Definition of Done | Status |
| --- | --- | --- | --- |
| Gate A | Contracts, policy, and topology survive adversarial external review | A written GREEN/AMBER/RED decision exists with a findings table, scored, and every finding either fixed or explicitly deferred with a reason | **Done** |
| Gate B | The synthetic workflow proves itself inside real n8n, not just in local simulation | Execution ID, full green 20-node screenshot, and downloaded report captured | In progress — today |
| Gate C | Fail-closed behavior is observed, not just read in code | Negative fixtures executed inside n8n and their safe-state outcome confirmed | Not started |
| Gate D–G | Persistence, Salesforce, live AI, real approval | Each has its own gate-specific Definition of Done in `03-BUILD-AND-AUDIT-PLAN.md` | Not started |
| Gate H | The project is legible to someone who didn't build it | Executive summary, AI governance doc, PMP/Agile/Six Sigma artifacts, and a clean GitHub push all exist | In progress |

## Definition of Ready (before any gate starts)

- The prior gate's Definition of Done is fully met — no gate starts on partial credit from the one before it.
- Any blocking open question from `docs/pmp/RAID_LOG.md` for that gate is resolved or explicitly accepted as a risk.
- The synthetic/fixture boundary for that gate is written down before work starts, not decided afterward.

## Definition of Done (every gate, no exceptions)

- Automated checks pass at 100%, with the exact pass count stated, not rounded or implied.
- Every claim of "this works" is labeled as either **observed** (someone watched it happen) or **verified by code inspection** (someone read it and reasoned about it) — never left ambiguous.
- Any new capability that could fail has a corresponding negative fixture or check, not just a positive demonstration.
- Documentation is updated in the same sprint the code changes, not deferred.

## Product backlog — user stories derived from the actual action catalogue

These aren't invented examples. Each row is a real, catalogued action in `governance/action-catalog.v1.0.0.json`, restated as a user story so the backlog reads the way a Scrum team's backlog actually would.

| As a... | I want to... | So that... | Status |
| --- | --- | --- | --- |
| System | validate the promise and evidence at intake | a malformed or incomplete run is rejected before any diagnosis is attempted | Done |
| Salesforce Administrator | diagnose report-access causes read-only | I can understand the blocker without touching production access | Done |
| Salesforce Administrator | simulate a report-access remediation, approval-gated | the approve → execute → verify loop can be demonstrated without a live Salesforce write | Done |
| Customer Success Manager | draft a customer verification request | the ask to the customer is reviewed before anything is sent | Done |
| Customer Success Manager | simulate an approved verification request going out | the delivery step is provable without contacting a real customer | Done |
| System | verify Salesforce access independently of the execution result | "we ran the fix" is never accepted as proof the fix worked | Done |
| Customer Success Manager | record a human attestation of customer use | the system never infers customer success on its own | Done |
| Customer Success Manager | close a verified promise, approval-gated | closure requires both verification and a named human sign-off | Done |
| System | reroute to human review when anything is uncertain | ambiguity has a safe, named destination instead of a silent guess | Done |
| Customer Success Manager | escalate a breached promise, approval-gated | breaches are visible and owned, not quietly dropped | Done |
| Delivery Lead | create a governed handoff to a downstream delivery system | remediation work has a clear next owner outside PromiseOps' own scope | Backlog (future-gated, disabled in MVP) |
| Salesforce Administrator | assign live report access directly | *(deliberately not yet a story we're allowed to build — `DENY` policy, disabled, future-only)* | Explicitly out of scope for MVP |

The last two rows matter as much as the first ten: a backlog that never says "not yet, and here's why" isn't a real backlog, it's a wish list.

## Sprint retrospective — the audit-fix cycle (this actually happened)

This is not a hypothetical retro template. It's the real retrospective of the Gate A external audit performed on 2 August 2026 and the fix cycle that followed in this same repository.

**What went well**
- The audit found real problems (ISS-001 through ISS-005 in `docs/pmp/RAID_LOG.md`) instead of confirming what was already believed — the adversarial framing worked.
- Every fix was paired with a new permanent regression test in the same session, not left as a follow-up ticket that might never get picked up.
- The numeric evidence (97/97, 98/98) was independently recomputed by hand rather than trusted from the tool's own output.

**What didn't go well**
- `DEFER_HUMAN_REVIEW` (ISS-001) existed in the schema and the catalogue for a while before anyone noticed it wasn't wired into the routing logic — a policy decision type was defined without a corresponding "what happens when this decision fires" check being written at the same time.
- The error handler (ISS-002) was built assuming `$execution.customData` would be populated, without a test that actually asserted it was — an integration assumption between two workflows that wasn't verified end-to-end until an external reviewer looked for it specifically.

**What we changed because of it**
- New policy decision types now get a same-sprint rule for what routes them to human review, not just a value in an enum.
- Cross-workflow assumptions (main workflow → error workflow) now get an explicit regression check in the same commit that introduces them, not an assumed contract.
- Negative-fixture coverage was treated as a real Sprint 2 backlog item (8 of 16 categories) rather than closed out with "the important ones are covered."

**Action items carried into the next sprint**
- Build the remaining 8 of 16 negative-fixture categories before Gate C is considered complete (tracked as ISS-005 / TD-005).
- Run the Gate B evidence-capture checklist inside real n8n today, and treat any mismatch from the local simulation as a stop-and-compare signal, per the retro lesson above — don't assume local simulation results transfer perfectly to live n8n behavior without checking.
