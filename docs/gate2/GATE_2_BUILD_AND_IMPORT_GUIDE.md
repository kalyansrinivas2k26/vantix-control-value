# Vantix Control Value — Gate 2 Build and Import Guide

## Why Gate 2 exists

Gate 1 froze the meanings, controls and policy. Gate 2 proves that those decisions can operate as one n8n control loop without credentials, production data, live Salesforce writes or customer contact.

This is a **synthetic vertical slice**, not the completed production MVP. The AI diagnosis and critique are clearly labelled structured replays so the control plane can be tested reproducibly before a live Gemini credential is introduced.

## What has been built

1. `Vantix-Control-Value-v0.2-Synthetic-Governed-Outcome-Loop.json`
2. `Vantix-Control-Value-v0.2-Error-Handler.json`
3. Automated workflow structure, JavaScript syntax, hygiene and runtime checks.
4. A generated synthetic executive HTML report.

The main workflow has 20 nodes. It runs:

> capture → context → validation → duplicate protection → deterministic assessment → evidence observation → diagnosis → critique → deterministic AI validation → policy → human approval validation → synthetic execution → technical verification → customer verification → SLA/outcome → retry/reroute/escalate/close → envelope validation → report

## Beginner import steps

### Step 1 — Import the error handler

1. Open n8n.
2. Select **Workflows**.
3. Select **Import from File**.
4. Choose `Vantix-Control-Value-v0.2-Error-Handler.json`.
5. Save it.
6. Leave it inactive until the main workflow is configured.

### Step 2 — Import the main workflow

1. Return to **Workflows**.
2. Select **Import from File**.
3. Choose `Vantix-Control-Value-v0.2-Synthetic-Governed-Outcome-Loop.json`.
4. Save it.
5. Do not add Salesforce or Gemini credentials in Gate 2.

### Step 3 — Connect the error workflow

1. Open the main workflow.
2. Open **Workflow settings**.
3. Select the imported Vantix Control Value error handler as **Error workflow**.
4. Save.

### Step 4 — Run the synthetic proof

1. Select **Execute workflow**.
2. Wait for all 20 main-path nodes to complete.
3. Open the last node.
4. Download `Vantix-Control-Value-Executive-Report-SYNTHETIC.html`.
5. Confirm the report banner states that the result is synthetic.

## Expected result

See the full table under "Completing this in one sitting" below — the same table is referenced from step B of today's checklist so you only have to check one place.

## Human approval meaning in this demonstration

The fixture contains named synthetic human decisions. The workflow verifies that every approval:

- belongs to a human actor;
- has an allowed role;
- matches the exact action, promise and payload hash;
- is consumed once; and
- exists before the simulated consequential action.

This proves the control boundary. It does not claim that n8n collected a real approval in Gate 2.

## Important limitations

- Diagnosis and critique are pre-authored structured synthetic replays, not live Gemini responses.
- Duplicate protection is demonstrated inside one run. Durable cross-run protection requires a new Vantix Control Value-specific persistence design in the next gate.
- The error workflow creates a sanitized dead-letter packet in its output. Durable DLQ storage is not enabled yet.
- No Salesforce query or write exists in this Gate 2 workflow.
- The `SANDBOX_READ_ONLY` path remains pending.

## Gate 2 approval criteria

Gate 2 can be approved when:

1. both JSON files import successfully;
2. the main workflow executes all 20 nodes;
3. the final report downloads and opens;
4. the expected result table matches;
5. the error workflow is configured;
6. no credential or real customer data is added.

## Completing this in one sitting — today's checklist

Do these in order. Each step produces a piece of evidence — keep a note of what you observed, even a screenshot, next to each line.

**A. Clean import (10 minutes)**

- [ ] Import `Vantix-Control-Value-v0.2-Error-Handler.json` first. Leave it inactive.
- [ ] Import `Vantix-Control-Value-v0.2-Synthetic-Governed-Outcome-Loop.json` into the same or a clean project.
- [ ] In the main workflow's **Workflow settings**, set **Error Workflow** to the imported error handler. Save.
- [ ] Confirm both workflows show **Inactive** — do not activate either one; Gate 2 only needs manual execution.

**B. First clean execution (5 minutes)**

- [ ] Click **Execute workflow** on the main workflow.
- [ ] Confirm all 20 nodes complete with no red (error) nodes.
- [ ] Open the last node's output and download the executive HTML report.
- [ ] Open the downloaded HTML in a browser. Confirm you see a **green "PROMISE CLOSED"** banner (this is the new closure banner added after the design audit — if you see a red "NOT CLOSED" banner instead, something regressed; stop and compare against the expected-result table below before continuing).
- [ ] Note the execution ID (visible in the n8n execution list) — this is your first piece of real evidence.

**C. Re-run for determinism (2 minutes)**

- [ ] Execute the same workflow a second time without changing anything.
- [ ] Confirm the result table (below) matches exactly — same numbers, same CLOSED status.
- [ ] This proves the result isn't accidental — it's the same synthetic input producing the same deterministic output every time.

**D. Prove the error path actually works (10 minutes)**

This is the most valuable thing you can do today, because it's the one claim that can't be verified by reading code — it has to be observed.

- [ ] Temporarily edit node **"04 Validate Canonical Intake"**: change any one required field check (e.g. add a stray character to `'schemaVersion'` in the `required` array) so the node throws on execution.
- [ ] Execute the workflow. Confirm execution stops at that node with a red error indicator.
- [ ] Open **Executions** → find the failed run → confirm the bound error workflow fired and produced a sanitized dead-letter packet (not a raw n8n error with any technical details you wouldn't want in a screenshot).
- [ ] Check the dead-letter packet's `correlationId` and `promiseId` fields are populated with real values (e.g. `PO-RUN-SYN-20260713-001` / `PRM-SYN-001`), not `"UNKNOWN"`. If they show `"UNKNOWN"`, the correlation-metadata fix didn't take — re-import the workflow JSON and try again.
- [ ] Undo your temporary edit to node 04 and re-run step B once more to confirm you're back to a clean CLOSED result.

**E. Capture and file the evidence**

- [ ] Save: the execution ID from step B, a screenshot of the full 20-node green execution, the downloaded HTML report, and a screenshot of the error-path dead-letter packet from step D.
- [ ] These four items are what turn "automated local validation passed" into "owner-run synthetic n8n import observed" — the exact distinction this project has been careful to maintain throughout.

## Expected result

| Measure | Expected |
| --- | --- |
| Final route | `CLOSE` |
| Execution status | `CLOSED` |
| Likelihood | `4/5 HIGH` |
| Impact | `5/5 VERY_HIGH` |
| Priority | `20/25 P1_CRITICAL` |
| Confidence | `98/100 HIGH` |
| Technical access | `PASS` |
| Customer use | `PASS` |
| SLA | `DELIVERED_WITHIN_SLA` |
| External Salesforce writes | `0` |
| Real customer messages | `0` |

