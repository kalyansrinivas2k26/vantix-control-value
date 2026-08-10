# Vantix Control Value — What This Is (Plain-Language Summary)

*Written for hiring managers, recruiters, and anyone reviewing this project without a technical background. For the full engineering detail, see `README.md`.*

## The problem, in one sentence

When a company promises a customer something ("we'll fix your access issue"), the CRM often records that someone *did something* — but rarely proves the customer actually got what was promised.

## What this project does

Vantix Control Value is a governed workflow that tracks a customer promise through six questions, and won't let it close until all six are honestly answered:

1. What exactly was promised?
2. What outcome was expected?
3. What action was allowed to fix it?
4. What actually happened?
5. Is there real evidence — both technical and from the customer — that it worked?
6. If not, does it retry, get escalated, or stay open?

The guiding rule: **evidence proves facts, fixed business rules control what's allowed to happen, AI is only allowed to explain and suggest, and a named human being has to approve and close anything consequential.** The AI is never allowed to approve its own recommendation, invent a fact, or close a promise on its own.

## Why this is a meaningful piece of work

Three skills come together in one project, each independently verifiable:

- **Salesforce/CRM domain knowledge** — the scenario, roles, and data model reflect how customer success actually works.
- **Six Sigma / process-control discipline** — the scoring (how urgent, how confident, how important) is calculated with fixed arithmetic, not guessed by an AI. It's independently reproducible by hand — an outside reviewer recomputed every number from scratch and got the same result.
- **Governance and safety engineering** — the system is built so that if anything goes wrong (bad data, an AI mistake, a missing approval), it stops and asks a human, instead of quietly doing the wrong thing.

## What's proven right now, honestly

This is a **synthetic prototype** — a complete, working demonstration built with fabricated (fake) test data, not yet connected to a real Salesforce account or a real AI model. That's a deliberate, disciplined choice: prove the safety rules work before plugging in anything real.

**What's been independently verified** (not just claimed — actually checked by a third-party review):
- Every safety rule was read line by line and tested, including deliberately trying to break it (feeding it fake approvals, mismatched data, low-confidence AI output) to confirm it correctly refuses.
- All the math (the urgency/confidence scoring) was independently recalculated by hand and matched exactly.
- No passwords, tokens, or real company data exist anywhere in the project.
- A third-party review found three real gaps in the logic — all three have since been fixed and re-tested, with new automated checks that specifically guard against those exact gaps coming back.

**What's still pending** (and clearly labeled as such, not hidden):
- Running it inside a real n8n automation platform for the first time, live.
- Connecting to a real (but still sandboxed, read-only) Salesforce account.
- Connecting a real AI model instead of the current pre-scripted demonstration replies.

## The honest one-line claim

*"I designed and independently-verified a governed, promise-to-outcome control system with proper safety rules and audit-proof math — built safely as a fully synthetic prototype, with the exact next steps to make it live clearly mapped out."*

That's accurate today, and it's already a substantial, demonstrable piece of applied engineering and process discipline — the kind of judgment call (build the safety net first, prove it under adversarial review, only then go live) that matters more in senior CSM/process/AI-implementation roles than a flashy but unverified demo would.

## The process behind the project, not just the code

This wasn't built ad hoc. It has a real project charter, a real risk/issue log (including the three real bugs an outside review found and how they got fixed), sprints with a real Definition of Done, and a defect-rate measurement of the build process itself — the same Six Sigma discipline applied to the software, not just the customer scenario it manages. See `docs/pmp/`, `docs/agile/`, and `docs/methodology/AUDIT_QUALITY_DPMO.md` if that level of detail is useful to you.

## Want the deeper "why AI, specifically" case?

`docs/methodology/AI_VALUE_AND_GOVERNANCE.md` is the technical-but-readable companion to this document. It walks through exactly what the AI does (a real differential diagnosis — considering and ruling out an alternative cause, not just stating the obvious one), the four hard rules it can never break, and includes an optional script that runs a real model through the identical governance checks live, so the guardrails can be watched working rather than taken on faith.
