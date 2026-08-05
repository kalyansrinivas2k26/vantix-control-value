# Running the Live AI Diagnosis Preview (Optional)

`scripts/live-ai-diagnosis-preview.mjs` sends the same evidence-bounded diagnosis prompt used conceptually by workflow node 07/08 to a **real** model of your choice, then checks the response against the **exact same governance rules** enforced inside the n8n workflow. It is optional, local-only, not part of `npm test`, and ships with no credential.

## Why this exists

Anyone can claim guardrails work. This lets you watch them work against a real model's actual, unscripted output in under a minute — the single most convincing thing to show in an interview or a demo.

## Requirements

- Node.js 18+ (for built-in `fetch`)
- An API key for **one** of:
  - Anthropic Claude — set `ANTHROPIC_API_KEY` (get one at console.anthropic.com)
  - Google Gemini — set `GEMINI_API_KEY` (get one at aistudio.google.com)

Never commit either key to the repository. Use your shell environment or a local, git-ignored `.env` you export manually — `.gitignore` already excludes `.env*`.

## Run it

```bash
cd repository
npm ci   # if you haven't already

# Using Anthropic Claude:
ANTHROPIC_API_KEY=sk-ant-your-key-here node scripts/live-ai-diagnosis-preview.mjs

# Or using Google Gemini:
GEMINI_API_KEY=your-key-here node scripts/live-ai-diagnosis-preview.mjs
```

## What you'll see

1. The raw JSON diagnosis the live model actually returned — not the fixture, a fresh response.
2. Three governance checks run against that real response:
   - **GROUNDING** — every claim cites a real evidence ID (mirrors workflow node 08's `PO_AI_UNGROUNDED_CLAIM` check)
   - **CATALOGUE** — every recommended action code exists in the enabled catalogue (mirrors node 10's `AI_OUTPUT_VALIDATION_FAILED` check)
   - **DIFFERENTIAL** — at least one claim rules something out rather than only stating the obvious cause
3. A final PASS/FAIL summary.

## If a check fails

That's not a bug in the script — it's the point. If the model invents a fact or recommends an uncatalogued action, the check should fail, exactly the way the workflow would route that run to human review instead of letting it proceed. Try re-running, or try a different model, and compare behavior.

## What this does and doesn't prove

**Proves:** the grounding and catalogue-membership rules are real code that runs against arbitrary model output, not rules written to fit one scripted answer.

**Doesn't prove:** that a live model has been wired into the n8n workflow itself (that's Gate F, still pending), that any live Salesforce data was involved (there is none here), or that this specific model call is production-ready (no retry, no rate-limit handling, no cost controls are implemented in this preview script — it's a demonstration, not the Gate F implementation).
