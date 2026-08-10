# Evidence Index

| Evidence | Class | Supports |
|---|---|---|
| `../workflows/VANTIX-Control-Value-v0.2-public.json` | active sanitized workflow | 20-node governed outcome control chain |
| `../workflows/VANTIX-Control-Value-v0.2-Error-Handler-public.json` | active sanitized workflow | separate failure handling |
| `../evidence/source-artifacts/VANTIX-PromiseOps-v0.2-Synthetic-Governed-Outcome-Loop.json` | exact source artifact | historical Gate 2 workflow provenance |
| `../evidence/reports/VANTIX-Control-Value-v0.2-SYNTHETIC.html` | synthetic report | expected synthetic report presentation |
| `../evidence/source-artifacts/VANTIX-PromiseOps-v0.2-Audit-Handoff.md` | historical handoff | earlier Gate 2 state and limitations |
| `../evidence/source-artifacts/VANTIX-Attestor-Control-Value-Intake-Assessment.md` | later assessment | stored-report discrepancy and migration boundary |
| `../evidence/offline-exact-node-test-results.json` | offline exact-node-code execution | deterministic behavior outside n8n |
| `../archive/attestor-transition/v0.1/` | historical archive | preserves temporary Attestor transition without making it active Project 3 scope |

## Historical owner-run evidence

Retained repository checksum inventories identify the authentic path:

`evidence/live-execution-reports/Vantix-Control-Value-Executive-Report-LIVE-n8n-2026-08-05.html`

This remediation does not recreate that file. Preserve the authentic live-repository copy if present.


## Live repository infrastructure requiring reconciliation

The current public repository also contains root-level `contracts/`, `fixtures/`, `governance/`, `reports/`, `scripts/`, `validation/`, `standards/`, `package.json`, and `package-lock.json`.

These are real repository artifacts but are not reproduced in this remediation package as if newly audited. Their current evidence class is:

**PRESERVE IN ACTIVE PROJECT 3**

See [Live Repository Infrastructure Reconciliation](LIVE_REPOSITORY_RECONCILIATION.md).


See [Final Repository Disposition](FINAL_REPOSITORY_DISPOSITION.md) for the closed merge classification.
