# Vantix Control Value — Gate 2 Test Evidence

## Result

**PASS — 98 passed, 0 failed**

Validated on 3 August 2026 with synthetic data only, after an independent external design audit and three corrective fixes (see "Fixes applied" below).

## What the automated test executed

The validator loaded the generated n8n workflow JSON, checked every Code node for JavaScript syntax, then executed the 18 Code nodes in main-path order with an n8n-compatible input harness that also mocks `$execution.customData`.

The runtime reached:

| Result | Observed value |
| --- | --- |
| Final route | `CLOSE` |
| Run execution status | `CLOSED` |
| Evidence completeness | `100%` |
| Evidence strength | `95%` |
| Likelihood | `4/5` |
| Impact | `5/5` |
| Priority | `20/25` |
| Confidence | `98/100` |
| Technical verification | `true` |
| Customer-use verification | `true` |
| Outcome | `ACHIEVED` |
| SLA | Within SLA |

## Fixes applied following the external design audit

1. **Confidence-below-minimum deferral now actually triggers human review.** Previously the policy-evaluation node computed a `DEFER_HUMAN_REVIEW` decision for low-confidence actions but never acted on it. Fixed in `scripts/build-gate2-workflows.mjs` node 11, with a dedicated regression fixture (`fixtures/negative/low-confidence-deferred-action.business-invalid.json`).
2. **Correlation metadata now reaches the error workflow.** The main workflow now calls `$execution.customData.set(...)` for `correlationId`, `promiseId` and `accountKey` so a real failure can be traced back to the right promise. The local simulation now mocks and asserts this.
3. **The executive report can no longer look "closed" when it isn't.** The HTML report now carries a visible green "PROMISE CLOSED" or red "NOT CLOSED — route: X" banner tied to the actual `finalRoute`/`executionStatus`.

## Control evidence

The automated checks confirmed:

- 20-node main workflow and separate Error Trigger workflow;
- inactive-on-import posture;
- synthetic-only operating boundary;
- no Salesforce node;
- no embedded credential reference;
- mandatory correlation, promise and account context, now propagated to `$execution.customData`;
- duplicate-promise key reservation;
- deterministic score reconciliation;
- evidence-cited diagnosis replay;
- critique cannot approve actions;
- deterministic validation after AI;
- default-deny action catalogue enforcement, including confidence-below-minimum deferral;
- approval role and payload binding;
- one-time approval consumption;
- action idempotency;
- separate technical and customer-use verification;
- closure blocked without both verification and human approval;
- sanitized dead-letter packet;
- visibly synthetic executive report with an explicit closure/non-closure banner.

## Files that constitute the evidence

- `validation/gate2-validation-report.json` — machine-readable 98-check report.
- `reports/Vantix-Control-Value-Executive-Report-SYNTHETIC.html` — generated report.
- `scripts/validate-gate2.mjs` — repeatable validator.
- `scripts/build-gate2-workflows.mjs` — deterministic workflow builder.

## Commands

From the repository directory:

```bash
npm install
npm test
```

`npm test` runs both the 97-check Foundation suite and the 103-check Gate 2 suite (raised from 98 after a real defect found by live n8n testing was fixed and given permanent regression coverage).

## Gate B — real n8n execution evidence (observed, not simulated)

On 4-5 August 2026 the portfolio owner imported both workflows into n8n Cloud (v2.31.5) and observed, live:

- A clean import with the error workflow correctly bound in workflow settings.
- Two separate manual executions producing byte-for-byte identical results (deterministic scoring confirmed live, not just in local simulation).
- A deliberately broken node correctly halting execution and routing to the bound error workflow.
- **A real defect the local simulation could not have caught**: n8n's Error Trigger does not forward `$execution.customData` to the bound error workflow, even though the Code node API to set it succeeds silently. This was found only by watching a live failure, not by reading code. It is now fixed by embedding the correlation context directly in the thrown error message (the field n8n reliably forwards) instead, and the fix was itself confirmed live: a subsequent failure's dead-letter packet correctly showed real `correlationId`/`promiseId`/`accountKey` values instead of `"UNKNOWN"`.
- A related n8n platform quirk was also discovered and worked around live: an **Active** workflow does not pick up saved Code node changes for its automatic/scheduled executions until it is deactivated and reactivated (confirmed as a known n8n behavior, GitHub issue #24418). Manual executions always run the latest saved code; scheduled ones can silently run stale code until reactivation. This is now documented so it isn't rediscovered from scratch on a future gate.
- A final clean re-run confirming the system returned to a normal green CLOSED result after all deliberate breaking and fixing.

This is the strongest evidence in the entire pack, precisely because it wasn't planned — it's the exact case for owner-run n8n testing that "verified by code inspection" alone can never substitute for.

## Truthful limitations

This evidence now includes real, observed execution inside the owner's actual n8n instance for the synthetic happy path and one failure path. It does not yet prove:

- a live Gemini diagnosis or critique;
- durable cross-run idempotency or dead-letter persistence;
- Salesforce sandbox connectivity;
- any Salesforce write;
- any real customer communication or outcome;
- the remaining negative-fixture categories (8 of 16) executed live rather than validated locally.

Those claims remain prohibited until their later gates pass.

