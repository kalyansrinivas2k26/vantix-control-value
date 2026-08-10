# Project 3 GitHub Upload / Cleanup Instructions

## Package status

**GITHUB MERGE READY — built from the current live repository snapshot supplied on 10 August 2026.**

This package already contains the genuine Control Value foundation infrastructure from the live repository plus the final hardened Control Value Portfolio Preview front door.

## Preserve

The package preserves active Control Value assets including:

- `contracts/v1.0.0/`
- `fixtures/`
- `governance/`
- `package.json` / `package-lock.json`
- Foundation / Gate 2 build and validation scripts
- Foundation / Gate 2 stored validation reports
- `standards/`
- Control Value reports and evidence
- canonical 20-node public workflow and error handler

## Remove from the live active tree before/while applying this package

The following old active paths are historical and are already preserved inside this package under `archive/`:

- `.github/workflows/validate.yml`
- `workflows/VANTIX-Attestor-Commitment-Assurance-Error-Handler-v0.3-public.json`
- `workflows/VANTIX-Attestor-Commitment-Assurance-v0.3-public.json`
- `workflows/VANTIX-Attestor-Customer-Momentum-v0.1-public.json`
- `workflows/VANTIX-Attestor-Service-Recovery-v0.2-public.json`
- `workflows/Vantix-Control-Value-v0.2-Error-Handler.json`
- `workflows/Vantix-Control-Value-v0.2-Synthetic-Governed-Outcome-Loop.json`
- Attestor-era lowercase front-door docs moved to `archive/attestor-transition/docs/`
- stale duplicate Control Value docs moved to `archive/control-value-legacy/docs/`
- Attestor-era synthetic module reports/screenshots moved to `archive/attestor-transition/evidence/`
- Attestor-era static repository validator outputs moved to `archive/attestor-transition/validation/`
- old `validation/SHA256SUMS.txt`, retained as `archive/control-value-legacy/validation-SHA256SUMS.txt`

## Hidden GitHub Actions file

The canonical current workflow is:

`.github/workflows/control-value-portfolio-validation.yml`

On macOS, `.github` is hidden in Finder. If the browser upload omits it, create that path manually in GitHub before the final CI check.

## Final gate

1. Apply this exact tree without deleting genuine active Control Value infrastructure.
2. Ensure the stale paths listed above are not left active.
3. Confirm GitHub Actions runs `Validate Control Value Portfolio Preview`.
4. Require the exact final commit to be Green.
5. Create the final release only after Green.
