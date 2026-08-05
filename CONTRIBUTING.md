# Contributing

This started as a solo portfolio build, but the repository is structured so it doesn't have to stay that way.

## Before changing anything

1. Read `docs/pmp/PROJECT_CHARTER.md` and `04-PRE-AUDIT-GAP-MATRIX.md` (pack root) to understand what's proven versus pending — don't build on top of a claim that's actually still open.
2. Read `01-CURRENT-STATUS-AND-AUDIT-HANDOFF.md` for the current gate and the exact rules that must not be violated (synthetic-data boundaries, AI scope limits, evidence-honesty language).

## Making a change

1. `npm ci` then `npm test` — confirm you start from a clean 97/97 + 98/98 baseline.
2. If you touch `scripts/build-gate2-workflows.mjs`, regenerate the workflow JSON with `npm run build:gate2` — never hand-edit the generated files in `workflows/`.
3. Any new capability that could fail needs a corresponding negative fixture in `fixtures/negative/`, not just a positive test. See `docs/agile/AGILE_DELIVERY_LOG.md` for the Definition of Done this project holds itself to.
4. Run `npm run evidence:refresh` and `npm run checksums:refresh` before committing, so the validation reports and checksum ledger stay in sync with the code.
5. `npm test` again — must return to 0 failures before opening a PR.

## What will get a PR rejected

- Any claim that synthetic behavior is live behavior (see `docs/EXECUTIVE_SUMMARY.md` and `RSK-005` in `docs/pmp/RAID_LOG.md` — this is a standing, never-fully-closed risk for a reason).
- Any AI-facing change that lets a model approve, execute, or close something on its own — see the four hard walls in `docs/methodology/AI_VALUE_AND_GOVERNANCE.md`.
- Real credentials, tokens, or customer data of any kind, anywhere in the repository.

## Reporting an issue

Open a GitHub issue with the automated check output (`npm test`) attached. If it's a governance or evidence-honesty concern rather than a code bug, tag it against the relevant RAID log entry in `docs/pmp/RAID_LOG.md` if one already exists.
