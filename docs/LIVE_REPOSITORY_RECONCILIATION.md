# Live Repository Infrastructure Reconciliation

**Review basis:** public `vantix-control-value` repository tree verified on 9 August 2026.

## Why this document exists

The live repository contains real Control Value infrastructure beyond the workflow/documentation layer covered by the first remediation package. The following root-level areas are visible in the public repository and must **not be deleted blindly** during Project 3 restoration:

- `contracts/v1.0.0/`
- `fixtures/`
- `governance/`
- `reports/`
- `scripts/`
- `validation/`
- `package.json`
- `package-lock.json`
- `standards/`

The public `package.json` was reported by the adversarial reviewer as naming the project `vantix-control-value-foundation-gate-1` and referencing scripts including:

- `build-gate2-workflows.mjs`
- `validate-foundation.mjs`
- `validate-gate2.mjs`
- `generate-checksums.mjs`
- `verify-checksums.mjs`
- `live-ai-diagnosis-preview.mjs`

The filename `live-ai-diagnosis-preview.mjs` does **not** by itself prove a live AI execution occurred. Its code and outputs must be inspected before any live-model claim is made.

## Preservation rule

Until each live-root artifact is directly inspected, classify it as:

**PRESERVE IN ACTIVE PROJECT 3**

Do not delete, rename, migrate or claim ownership for these files based only on filename or conversation history.

## Required classification after direct inspection

Every root-level artifact above must be assigned exactly one disposition:

1. **Preserve in Project 3 active root** — genuine Control Value infrastructure.
2. **Preserve and rename** — genuine Control Value infrastructure with stale PromiseOps/Attestor naming only.
3. **Move to Project 3 archive** — historical Control Value evidence no longer active.
4. **Move to Project 4 / Attestor** — genuinely Attestor-specific material.
5. **Retire with justification** — obsolete/redundant and safely superseded.
6. **Pending verification** — insufficient evidence to move/delete.

No file may be deleted solely because it contains the words PromiseOps or Attestor.

## Evidence-generation reconciliation

The live infrastructure may be the source of the later stored validation snapshot:

- Foundation: 103 passed / 0 failed
- Gate 2: 103 passed / 0 failed

That relationship is plausible but is **not established by filename alone**. It must be proven by inspecting the validation scripts/reports and their timestamps/provenance.

## `live-ai-diagnosis-preview.mjs` rule

Before changing any public claim about live AI:

- inspect the file;
- identify whether it makes an external provider call or merely prepares/previews a request;
- identify credential handling;
- identify whether it was ever executed;
- identify any saved output/evidence;
- verify whether the output came from a real provider or a fixture/replay.

Until then the correct claim remains:

> The canonical 20-node Gate 2 workflow contains synthetic structured AI replays; the separate root-level `live-ai-diagnosis-preview.mjs` requires direct reconciliation and is not evidence of live AI execution by filename alone.

## Merge gate

Project 3 cannot be finally frozen until the live-root infrastructure has been dispositioned file-by-file and the final merged repository passes GitHub Actions.

This is a reconciliation gate, not an architecture-redesign gate.


## Reconciliation closure

The retained Foundation Gate 1, Gate 2 build guide and repository SHA-256 inventory are sufficient to classify the previously unaccounted live-root infrastructure for upload purposes.

**Preserve in active Project 3:** contracts, fixtures, governance, package/npm validation infrastructure, validation, standards, Control Value reports and authentic owner-run evidence.

**Preserve as experimental/pre-integration only:** `scripts/live-ai-diagnosis-preview.mjs` and `docs/gate2/LIVE_AI_PREVIEW.md`. These do not become live-Gemini execution evidence without actual execution proof.

**Remove from active Project 3 after archive preservation:** Attestor Service Recovery / Customer Momentum workflows and evidence, and multi-module Attestor active-front-door material.

See [Final Repository Disposition](FINAL_REPOSITORY_DISPOSITION.md). This reconciliation is closed for upload purposes; final live CI remains a post-merge freeze gate.
