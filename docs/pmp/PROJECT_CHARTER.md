# Project Charter — Vantix Control Value

| Field | Detail |
| --- | --- |
| Project name | Vantix Control Value (formerly referred to internally as PromiseOps) |
| Project sponsor / owner | Bodapati Kalyan Ram Srinivas (portfolio owner) |
| Project manager / delivery lead | Bodapati Kalyan Ram Srinivas |
| Charter date | 3 August 2026 |
| Current phase | Gate 2 (synthetic governed vertical slice) — automated validation passed, owner-run n8n import pending |

## Business case

CRM teams routinely record that an activity happened without proving the customer actually received the promised outcome. This creates a gap between "we logged something" and "we verified the customer is actually unblocked" — a gap that shows up as churn risk, renewal risk, and disputed SLA performance that nobody can point to hard evidence for either way.

## Objective

Build and prove, in stages, a governed control loop that takes a customer promise from capture through to a verified, human-approved close — where deterministic rules control what may happen, evidence establishes what actually happened, and AI is bounded to diagnosis and self-critique only.

## Success criteria

1. All math (priority, confidence, SLA, evidence scoring) is calculated in deterministic code, never inferred by a model, and independently reproducible by a third party.
2. No AI output — diagnosis or critique — can approve, execute, or close anything on its own.
3. Every consequential action requires a named human decision bound to the exact action, payload hash, and idempotency key.
4. The system fails closed: malformed input, low-confidence AI output, missing approval, or execution failure routes to human review rather than silently proceeding or silently closing.
5. Each build gate is independently, adversarially auditable before the next gate begins.

## Scope

**In scope for the current phase (Gate 2):** a fully synthetic, credential-free n8n vertical slice — no live Salesforce query/write, no live model call, no real customer contact, no real human approval capture. All of the above are represented as clearly labelled fixtures.

**Out of scope until later gates:** live Gemini/Claude diagnosis (Gate F), Salesforce sandbox read access (Gate E), real human approval capture (Gate G), durable cross-run idempotency and dead-letter storage (Gate D), and any customer-facing communication or write action of any kind.

## Milestones (Gates A–H)

| Gate | Deliverable | Status |
| --- | --- | --- |
| A | External design audit of contracts, policy, and topology | Complete — GREEN decision, 3 defects found and fixed |
| B | Owner clean import and synthetic execution in n8n | **Complete** — clean import, two identical deterministic runs, a deliberate failure correctly caught and routed to the sanitized error handler, and a real defect (ISS-006, see RAID log) found by live testing, fixed, and confirmed working live |
| C | Owner-run negative and fail-closed evidence | Partially ready — 8 of 16 failure categories have automated fixtures |
| D | Durable persistence and recovery design | Not started |
| E | Salesforce sandbox read-only evidence | Not started |
| F | Live AI behind the deterministic boundary | Preview available (`docs/gate2/LIVE_AI_PREVIEW.md`), not yet wired into the workflow |
| G | Real human approval capture | Not started |
| H | Final portfolio/GitHub release | In progress — this charter is part of it |

## High-level risks

See `docs/pmp/RAID_LOG.md` for the full register. The three risks most likely to affect the current phase:

- An AI model invents or overstates a root cause (mitigated by grounding checks, independent critique, and human-review fallback).
- A logic gap in the deterministic guardrails goes unnoticed until a live gate (mitigated by the external audit already performed, and by adding a permanent regression test for every defect found).
- The n8n import doesn't reproduce the local simulation's result on the first try (mitigated by the today's-checklist section of the import guide, which treats a mismatch as a stop-and-compare signal rather than something to push past).

## Stakeholders

| Stakeholder | Interest |
| --- | --- |
| Portfolio owner | Demonstrates combined CSM, Salesforce Admin, Scrum Master, Six Sigma, and AI-implementation capability |
| Hiring managers / recruiters reviewing the GitHub repo | Need to assess real engineering judgment, not just a polished demo |
| Future collaborators on Gates D–H | Need an accurate, non-inflated picture of what is proven versus pending |

## Authorization

This charter authorizes continued work through Gate 2 completion (owner-run n8n import and evidence capture) and preparation for GitHub publication. Gates D onward each require a fresh go/no-go decision recorded as a new entry in `governance/registers.v1.0.0.json`.
