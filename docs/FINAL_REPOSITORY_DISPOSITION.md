# Final Repository Disposition — Project 3

**Decision:** Project 3 is ready for a controlled GitHub merge. No further pre-upload LLM review is required.

## Canonical identity

**VANTIX Control Value — Customer Commitment Assurance**

Historical working name: PromiseOps. Project 4 owns the current VANTIX Attestor multi-module platform.

## Preserve in active Project 3

- `contracts/v1.0.0/`
- `fixtures/`
- `governance/`
- `package.json`
- `package-lock.json`
- `reports/Vantix-Control-Value-Executive-Report-SYNTHETIC.html`
- Control Value / PromiseOps Foundation and Gate 2 documentation
- `scripts/build-gate2-workflows.mjs`
- `scripts/generate-checksums.mjs`
- `scripts/validate-foundation.mjs`
- `scripts/validate-gate2.mjs`
- `scripts/verify-checksums.mjs`
- `validation/`
- `standards/`
- authentic Control Value owner-run execution evidence, including the 5 August 2026 n8n report/screenshots where present

These are genuine Project 3 assets and must not be deleted because some historical files use the PromiseOps name.

## Preserve as experimental / pre-integration evidence only

- `scripts/live-ai-diagnosis-preview.mjs`
- `docs/gate2/LIVE_AI_PREVIEW.md`, if present

These may show that a live-Gemini request path was prepared or previewed. They do not prove that a provider call executed. The canonical 20-node Gate 2 workflow remains a synthetic structured-replay workflow.

## Remove from active Project 3 after historical preservation

- `workflows/VANTIX-Attestor-Commitment-Assurance-Error-Handler-v0.3-public.json`
- `workflows/VANTIX-Attestor-Commitment-Assurance-v0.3-public.json`
- `workflows/VANTIX-Attestor-Customer-Momentum-v0.1-public.json`
- `workflows/VANTIX-Attestor-Service-Recovery-v0.2-public.json`
- Attestor-only Service Recovery reports/screenshots
- Attestor-only Customer Momentum reports/screenshots
- active root documentation whose purpose is the three-module Attestor platform rather than Control Value

Historical copies remain under `archive/attestor-transition/`.

## Final merge rule

This ZIP is an **overlay** for the existing Project 3 repository. Preserve the genuine Control Value infrastructure, overlay this package, remove only proven Attestor-active artifacts, regenerate checksums, run both the preserved npm validation and the new portfolio controls, then push. The exact live GitHub Actions run must pass before CI Green / freeze.
