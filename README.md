# Vantix Control Value

[![Validate](https://github.com/kalyansrinivas2k26/vantix-control-value/actions/workflows/validate.yml/badge.svg)](https://github.com/kalyansrinivas2k26/vantix-control-value/actions/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](package.json)
[![Gate 2](https://img.shields.io/badge/Gate%202-97%2F97%20%2B%2098%2F98%20checks-brightgreen)](validation/)

## At a glance

| | |
| --- | --- |
| **What it is** | A governed AI + deterministic control loop that verifies a customer promise was actually fulfilled, not just recorded as done |
| **Current phase** | Gate 2 — synthetic, credential-free vertical slice; automated validation passed |
| **Automated checks** | 97/97 foundation + 98/98 Gate 2 = 195/195, 0 failures |
| **External audit** | Complete — GREEN decision, 3 real defects found and fixed, each with a permanent regression test |
| **AI's role** | Diagnosis + self-critique only — cannot approve, execute, calculate scores, or close anything |
| **License** | MIT |
| **New here?** | Read `docs/EXECUTIVE_SUMMARY.md` first (plain language, 2 minutes) |

## Customer Outcome & CRM Integrity Command Center

**Tagline:** From customer promise to verified outcome—with Salesforce evidence, governed AI and human control.

Foundation Gate 1 is approved. Gate 2 now supplies a separate, credential-free Vantix Control Value synthetic workflow and companion error handler. The package preserves the frozen architecture, canonical contracts, deterministic scoring rules, action catalogue, human-approval boundaries, synthetic scenario and governance registers.

## What Vantix Control Value will demonstrate

Vantix Control Value will implement a governed lifecycle:

`Observe evidence → diagnose cause → select a permitted action → obtain approval when required → execute → verify outcome → retry, reroute, escalate or close`

The first validated run will be fully synthetic. A later sandbox mode may read synthetic Salesforce records through the existing least-privilege OAuth Client Credentials pattern. Live customer data, silent Salesforce access/configuration changes, autonomous customer communication, and unsupported outcome claims are outside the MVP.

**Start here if you're evaluating the AI design specifically:** `docs/methodology/AI_VALUE_AND_GOVERNANCE.md` explains exactly what the AI is asked to do, the four hard walls it can never cross, and how to run `docs/gate2/LIVE_AI_PREVIEW.md` to watch a real model's output pass through the same governance code as the synthetic fixture.

**Start here if you're evaluating the process discipline specifically:** this project is run as a real PMP-governed, Agile-delivered, Six-Sigma-measured build, not just described as one.
- `docs/pmp/PROJECT_CHARTER.md`, `docs/pmp/RAID_LOG.md`, `docs/pmp/WBS_AND_RACI.md` — charter, risk/assumption/issue/dependency register, and work breakdown with a role-based RACI.
- `docs/pmp/MCKINSEY_STYLE_BUSINESS_CASE.md` — SCQA-structured business case with a fully transparent, assumption-labeled illustrative ROI model.
- `docs/pmp/MCKINSEY_REVIEW_SCORECARD.md` — an honest self-scored evaluation (~8.3/10, not 10/10, with a stated reason why and what would close the gap).
- `docs/agile/AGILE_DELIVERY_LOG.md` — Gates A–H run as real sprints with a Definition of Ready/Done, a backlog of user stories pulled directly from the action catalogue, and a genuine sprint retrospective of the audit-fix cycle below.
- `docs/methodology/SIX_SIGMA_MEASUREMENT_PLAN.md` and `docs/methodology/AUDIT_QUALITY_DPMO.md` — DPMO applied both to the customer-promise process this system governs, and to the build process that built it (3 defects / 186 opportunities = 16,129 DPMO, found by external audit and fixed with permanent regression tests), with the same discipline throughout: no Sigma-level claim from a single small sample.

## Foundation package

- `docs/EXECUTIVE_SUMMARY.md` — plain-language explanation for non-technical reviewers (CEOs, recruiters, hiring managers)
- `docs/methodology/AI_VALUE_AND_GOVERNANCE.md` — why AI is used, exactly what it's allowed and forbidden to do, and what makes this governance approach distinctive
- `docs/gate2/LIVE_AI_PREVIEW.md` — how to run a real model through the same governance checks as the synthetic fixture
- `docs/pmp/PROJECT_CHARTER.md` — formal project charter: business case, scope, success criteria, milestones
- `docs/pmp/RAID_LOG.md` — risks, assumptions, issues (from the real external audit), dependencies
- `docs/pmp/WBS_AND_RACI.md` — work breakdown structure and role-based accountability matrix
- `docs/pmp/MCKINSEY_STYLE_BUSINESS_CASE.md` — SCQA business case with a transparent illustrative ROI model
- `docs/pmp/MCKINSEY_REVIEW_SCORECARD.md` — honest self-scored evaluation against McKinsey-style review lenses
- `docs/agile/AGILE_DELIVERY_LOG.md` — sprints, Definition of Ready/Done, backlog, and a real retrospective
- `docs/methodology/AUDIT_QUALITY_DPMO.md` — Six Sigma DPMO applied to the build process itself
- `CONTRIBUTING.md` — how to safely extend this project without breaking its evidence-honesty guarantees
- `docs/GITHUB_REPO_METADATA.md` — ready-to-paste repo description, topics, and settings
- `docs/foundation/FOUNDATION_GATE_1.md` — gate decision pack
- `docs/architecture/ARCHITECTURE.md` — logical architecture, state machine and trust boundaries
- `docs/methodology/DETERMINISTIC_ASSESSMENT.md` — likelihood, impact, priority and confidence rules
- `docs/methodology/SIX_SIGMA_MEASUREMENT_PLAN.md` — valid defect and denominator definitions
- `docs/governance/ACTION_POLICY.md` — permitted, approval-required, denied and future actions
- `docs/security/THREAT_MODEL.md` — assets, trust boundaries, threats and required controls
- `docs/GLOSSARY.md` — distinguishes Customer Success Manager workflow actors from the portfolio owner's Certified ScrumMaster credential
- `docs/foundation/REFERENCE_PATTERN_REVIEW.md` — controls reused versus Vantix Control Value redesign
- `contracts/v1.0.0/` — versioned JSON Schemas
- `governance/action-catalog.v1.0.0.json` — machine-readable action policy
- `governance/registers.v1.0.0.json` — decisions, assumptions, risks, open questions, future enhancements and technical debt
- `fixtures/synthetic/` — canonical positive demonstration fixture
- `fixtures/negative/` — schema-negative and business-rule-negative fixtures
- `scripts/validate-foundation.mjs` — actual JSON Schema and cross-contract validation
- `scripts/generate-checksums.mjs` and `scripts/verify-checksums.mjs` — complete, non-self-referential release-ledger generation and verification
- `.github/workflows/validate.yml` — locked dependency install, validation and checksum verification on push and pull request

## Validation

After installing dependencies:

```bash
npm ci
npm test
```

`npm test` is read-only with respect to the stored evidence reports. Maintainers may deliberately refresh those reports with `npm run evidence:refresh`, review the resulting diff, and then regenerate checksums as the final packaging step.

```bash
npm run evidence:refresh
npm run checksums:refresh
npm run verify:checksums
```

The checksum ledger excludes itself to avoid an impossible self-referential digest. CI runs the contract/workflow tests and then verifies ledger completeness and every recorded hash.

The validator checks:

- all JSON documents parse;
- every required contract validates against JSON Schema Draft 2020-12;
- all evidence references resolve;
- AI-proposed actions exist in the approved catalogue;
- consequential actions have a matching human approval;
- approvals are bound to an action payload hash;
- deterministic priority and confidence calculations reconcile;
- an outcome cannot be marked achieved unless both technical-access and customer-use criteria pass;
- audit sequence numbers are unique and ordered;
- the intentionally malformed fixtures fail for the expected reasons.

## Current status

- Foundation Gate 1: **APPROVED**
- Gate 2 synthetic governed vertical slice: **AUTOMATED VALIDATION PASSED** (103/103 checks, 0 failures) — and **owner-run in real n8n on 4-5 Aug 2026**: clean import, deterministic repeat runs, and a deliberate failure correctly caught and routed to the sanitized error handler
- Independent external design audit: **COMPLETE** — 3 logic gaps found and fixed; a 4th real gap (ISS-006: n8n does not forward `$execution.customData` to bound error workflows) was found by live testing itself, fixed, and confirmed working in production n8n the same day
- n8n import/run by portfolio owner: **PENDING** — see `docs/gate2/GATE_2_BUILD_AND_IMPORT_GUIDE.md`
- Live Gemini and Salesforce sandbox: **NOT ENABLED**

## Gate 2 workflows

- `workflows/Vantix-Control-Value-v0.2-Synthetic-Governed-Outcome-Loop.json`
- `workflows/Vantix-Control-Value-v0.2-Error-Handler.json`

Start with `docs/gate2/GATE_2_BUILD_AND_IMPORT_GUIDE.md`.

## License

MIT — see `LICENSE`.
