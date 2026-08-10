# Release Lineage

## Canonical portfolio identity

- **Project 3:** VANTIX Control Value — Customer Commitment Assurance.
- Historical working name: PromiseOps.
- **Project 4:** VANTIX Attestor.

## Temporary repository collision

Control Value was later used as the base for an Attestor platform transition. That transition placed Commitment Assurance, Service Recovery and Customer Momentum material into the `vantix-control-value` repository and changed its front door to VANTIX Attestor.

This created an identity collision: the repository name remained Control Value while the active root described Attestor.

## Resolution

This remediation restores Project 3's active identity to Control Value / Commitment Assurance.

The Attestor transition material is not erased. A preserved copy is stored under:

`../archive/attestor-transition/v0.1/`

Attestor-specific Service Recovery and Customer Momentum material must not remain active at Project 3 root after merge. Project 4 is the authoritative current Attestor project.

## Evidence-snapshot rule

Do not blend validation generations.

Earlier narrative:
- Foundation 92/92;
- Gate 2 94/94.

Later stored reports inspected 7 August:
- Foundation 103/103;
- Gate 2 103/103.

Public status wording must identify which snapshot it cites. This remediation uses 103/103 only when explicitly labelled as the later stored-report snapshot and does not call it a fresh rerun.


## Live-root infrastructure discovered during adversarial review

A later adversarial comparison against the live repository identified additional root-level Control Value infrastructure that remediation v1 did not carry or disposition:

- `contracts/v1.0.0/`
- `fixtures/`
- `governance/`
- `reports/`
- `scripts/`
- `validation/`
- `package.json`
- `package-lock.json`
- `standards/`

This infrastructure must not be silently deleted during restoration. Its existence does not invalidate the Control Value identity correction; it creates an additional **repository reconciliation requirement**.

The current disposition is **PRESERVE — PENDING DIRECT CONTENT RECONCILIATION**.

The reported `package.json` identity `vantix-control-value-foundation-gate-1` is consistent with Control Value lineage, but the contents of each directory/script must be inspected before final classification.

The script name `live-ai-diagnosis-preview.mjs` is specifically quarantined from claim inflation: the filename alone proves neither external-provider execution nor live-model evidence.

See [Live Repository Infrastructure Reconciliation](LIVE_REPOSITORY_RECONCILIATION.md).
