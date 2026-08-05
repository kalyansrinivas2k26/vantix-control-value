# Why AI Is Used Here — and Exactly How It's Kept Honest

*This is the document to read if you only read one. It explains the single most important design decision in Vantix Control Value: where AI adds real value, and the four hard walls that stop it from ever being trusted blindly.*

## The failure mode this project refuses to build

Most "AI agent" demos fall into one of two traps:

1. **AI does everything.** It reads the data, decides what's wrong, decides what to do about it, and does it. It looks impressive in a five-minute demo and is unsafe the first time the model hallucinates, misreads evidence, or gets a confident wrong answer — because nothing downstream is positioned to catch it.
2. **AI does nothing real.** To avoid trap 1, the "AI" is reduced to a chatbot bolted onto the side that summarizes a ticket. Safe, but it throws away the one thing AI is genuinely good at: reading messy, qualitative evidence and proposing a coherent explanation faster and more consistently than a human scanning eight different data categories by hand.

Vantix Control Value is built to avoid both traps at once. AI does real reasoning work. It is simply never the thing standing between a decision and a consequence.

## What the AI is actually asked to do

Two AI calls happen in every run, and only two:

| Step | What it does | Why a human or a rule-based system alone is worse at this |
| --- | --- | --- |
| **AI Diagnosis** | Reads the evidence records for one promise and proposes: what's actually wrong, which domain it belongs to, and which catalogued actions might fix it — with every factual claim tied to a specific evidence record. | A human CSM triaging dozens of promises a week does this same read-the-evidence-and-hypothesize step manually, inconsistently, and slower. A pure rule engine can't do open-ended qualitative reasoning over free-text evidence at all — it can only check fields it was explicitly told to check. |
| **AI Critique** | Re-reads the diagnosis against the same evidence, independently, and marks each claim `SUPPORTED`, `AMBIGUOUS`, or `UNSUPPORTED`. It is explicitly and permanently forbidden from approving anything (`cannotApproveActions: true` is enforced, not just stated). | This is the AI checking the AI's own homework, the same way a second reviewer would — catching an ungrounded claim, an overreach, or a recommendation the evidence doesn't actually support, before a human ever sees it. |

Look at the actual fixture (`fixtures/synthetic/mvp-complete-run.v1.0.0.json`) and you'll see the diagnosis doesn't just state the obvious cause — it also runs a small differential diagnosis: claim `CLM-SYN-005` explicitly considers and *rules out* an ownership-misassignment cause, citing the ownership evidence records that show ownership was correctly assigned all along. The critique (`claimReviews`) independently confirms that rule-out is correct. That's the AI doing the part that's actually hard to do well — telling you what it *isn't*, not just what it is — and having that reasoning checked, not taken on faith.

## The four walls the AI can never cross

These aren't policy language. Every one of them is enforced by a JavaScript check that throws an error and halts the workflow if violated — see `scripts/build-gate2-workflows.mjs`, nodes 08–12.

1. **It cannot invent a fact.** Every claim must cite at least one evidence record that was actually supplied for this run (`PO_AI_UNGROUNDED_CLAIM` throws otherwise). `fixtures/negative/malformed-ai-diagnosis.invalid.json` is a schema-level test of exactly this failure mode.
2. **It cannot approve its own recommendation.** The critique record has a `cannotApproveActions` field that must be `true` — checked, not trusted (`PO_CRITIQUE_AUTHORITY_VIOLATION`).
3. **It cannot touch the numbers.** Likelihood, impact, priority, and confidence are calculated by plain arithmetic in a Code node, independently reproducible by hand (an external reviewer did exactly that and got the same numbers — see `validation/foundation-validation-report.json`). The AI never sees these calculations, let alone influences them.
4. **A recommendation it makes still has to clear deterministic policy and, for anything consequential, a named human approval bound to the exact payload hash.** Even a diagnosis that scores as "supported" can't execute anything on its own — see `docs/governance/ACTION_POLICY.md`.

And critically — this isn't just a design intention. `fixtures/negative/low-confidence-deferred-action.business-invalid.json` exists specifically because an external adversarial audit of this project found a real bug: a low-confidence AI-adjacent policy path wasn't actually being enforced correctly. It was found, fixed, and now has a permanent automated regression test. That failure-and-fix cycle, kept visible rather than erased, is itself part of what "governed AI" is supposed to look like in practice.

## What this demonstrates, concretely

| Without AI | With AI, ungoverned | With AI, as built here |
| --- | --- | --- |
| A human manually cross-references 8 evidence categories per promise. Slow, inconsistent between reviewers, doesn't scale. | An AI reads the evidence and can recommend, approve, and execute in one motion. Fast, but the first hallucinated fact or overreached recommendation becomes a real action with no independent check. | An AI reads the evidence and proposes a diagnosis with a differential (what it is, what it isn't). A second AI pass independently fact-checks every claim against the same evidence. Deterministic code then re-validates both outputs against hard rules before anything reaches a human for the one decision only a human is allowed to make. |

## Why this is the harder, more valuable thing to have built

Anyone can wire an LLM to an action. Wiring an LLM to a diagnosis, then building the deterministic scaffolding that assumes the LLM might be wrong on any given run and catches it anyway — evidenced by an actual audit that found and fixed a real gap in that scaffolding — is the part that maps directly onto what a CSM/AI-implementation role actually needs: judgment about *where* to trust a model, not just the ability to call one.

## What's next: proving this holds against a real model, not just the scripted replay

Gate 2 uses a pre-authored "synthetic structured replay" instead of a live model call, by design — the goal was to prove the guardrails before spending a live credential on them. `scripts/live-ai-diagnosis-preview.mjs` is an optional, local-only script (not part of `npm test`, ships no key, requires you to supply your own) that sends the *exact same* diagnosis-input contract to a real model of your choice and runs the *exact same* validation logic against whatever comes back. Running it and watching real model output either pass or get correctly rejected by the same code that governs the synthetic fixture is the single most convincing five-minute demonstration available before Gate F (live AI) is formally started. See `docs/gate2/LIVE_AI_PREVIEW.md` for how to run it.
