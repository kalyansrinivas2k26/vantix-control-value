# Changelog

## Unreleased — v3 stale-file consistency fix

Independent review of v2 found the live-root-infrastructure reconciliation work (`docs/LIVE_REPOSITORY_RECONCILIATION.md`, the PRESERVE-PENDING classification, updated `ROOT_CLEANUP_REQUIRED.md`/`RELEASE_LINEAGE.md`/`EVIDENCE_INDEX.md`/`FREEZE_GAP_MATRIX.md`) was genuinely solid and independently verified — including the negative test (removing the reconciliation doc correctly fails CI with 4 broken-link errors alongside the missing-file error).

One real gap: v2 shipped both the original-named required files (`FINAL_HANDOFF.md`, `INDEPENDENT_REVIEW_PROMPT.md`) *and* new `_v2`-suffixed versions side by side. The old-named files still contained the old score (93/100) and the old, narrower review prompt, directly contradicting the new `_v2` files' 92/100 and expanded scope. Since CI's required-file check hardcodes the original filenames (not the `_v2` names), the old files couldn't simply be deleted without breaking CI — the fix is that the canonical, required filenames now carry the current content, and the redundant `_v2` duplicates are removed. One current file per name, no contradiction, no CI break.

## Unreleased — Project 3 identity/evidence hardening

- Restored active repository identity to **VANTIX Control Value — Customer Commitment Assurance**.
- Preserved the temporary Attestor transition package under `archive/attestor-transition/v0.1/`.
- Removed Attestor multi-module positioning from active Project 3 scope.
- Replaced stale PromiseOps CI identity with Control Value Portfolio Preview validation.
- Separated validation generations rather than blending 92/94 with later stored 103/103 reports.
- Added evidence provenance, release lineage, recruiter front door, security, Six Sigma, PMP, Agile and competitive-positioning boundaries.
- Added exact-node offline tests, graph validation, link+anchor checks, expanded secret scan, score arithmetic/Total validation, workflow-hash binding and checksums.
- Did not fabricate live Salesforce, Gemini, customer, authenticated approval or production evidence.


## Final upload closure v4

- Reconciled the previously unaccounted live-root infrastructure using retained Foundation Gate 1, Gate 2 and SHA-256 inventory evidence.
- Classified contracts, fixtures, governance, package/npm validation, validation reports, standards and Control Value evidence as active Project 3 assets to preserve.
- Classified `live-ai-diagnosis-preview.mjs` as experimental/pre-integration evidence only; no live-Gemini execution claim added.
- Converted cleanup guidance from open investigation to final preserve/remove merge instructions.
- Added `docs/FINAL_REPOSITORY_DISPOSITION.md`.
- Replaced the pre-merge review prompt with a post-merge verification prompt.
- Project 3 is ready for controlled GitHub merge.
