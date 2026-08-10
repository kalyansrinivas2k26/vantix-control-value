# VANTIX Attestor — Control Value Intake Assessment

**Assessment date:** 7 August 2026  
**Source pack:** `Vantix-Control-Value-v0.2-Independent-Design-Audit-Pack.zip`

## 1. Integrity verification

- Outer SHA-256 sidecar: **MATCHED**
- Expected and actual digest: `158079331f362c5a6e5755f6254a2171434942a91e3256a7344e0e72c9c6bdb7`
- ZIP extraction: **SUCCESSFUL**
- `files-4.zip` contains the same audit-pack ZIP and checksum sidecar rather than a separate repository version.

## 2. Evidence received

The pack contains:

- current-status and audit-handoff documentation;
- build and audit plan;
- pre-audit gap matrix;
- repository README, changelog and executive summary;
- governance catalogues and registers;
- validation scripts and stored reports;
- test evidence and test manifest;
- two credential-free n8n workflow exports;
- a synthetic executive HTML report;
- an executive presentation.

## 3. Verified current baseline

The evidence supports the following baseline:

- Foundation contracts and deterministic policies are implemented and locally validated.
- A credential-free synthetic governed outcome loop exists.
- A separate error workflow exists but still requires owner import/binding evidence in n8n.
- The positive synthetic scenario is designed to route to `CLOSE` with status `CLOSED`.
- Live Salesforce, live Gemini, real human approval capture and customer-facing writes are not demonstrated.
- Durable cross-run idempotency, durable dead-letter storage and production recovery controls remain future-gate work.
- The pack explicitly states that it is not a production release.

## 4. Validation-result discrepancy requiring controlled treatment

Earlier handoff documentation records:

- Foundation: 92 passed / 0 failed
- Gate 2: 94 passed / 0 failed

The stored JSON validation reports currently record:

- Foundation: 103 passed / 0 failed
- Gate 2: 103 passed / 0 failed

These figures must not be blended. The August 7 stored reports appear to be a later regenerated evidence state, while some narrative documents retain the August 2 figures. Before publishing any Attestor migration claim, the repository documentation must be aligned to one identified evidence snapshot and generation timestamp.

## 5. Independent rerun status

An independent `npm ci` rerun was attempted in the assessment environment but could not complete because the configured package registry returned HTTP 404 for `require-from-string@2.0.2`. This is an environment/package-registry retrieval failure, not evidence that the project tests fail. Therefore:

- stored validation reports were inspected;
- their results were not independently reproduced in this assessment environment;
- no new verification claim is made.

## 6. Attestor migration classification — preliminary

| Existing Control Value component | Preliminary classification | Reason |
|---|---|---|
| Promise/outcome domain contracts | Move into Commitment Assurance | Domain-specific capability already exists |
| Correlation and version metadata | Refactor candidate for Shared Kernel | Reusable across modules, subject to behavioural-equivalence testing |
| Evidence provenance and indexing | Refactor candidate for Shared Kernel | Cross-module capability |
| Deterministic policy boundary | Refactor candidate for Shared Kernel | Common governance pattern; module calibrations must remain separate |
| Structured AI validation | Refactor candidate for Shared Kernel | Common bounded-AI control |
| Human-approval boundary | Refactor candidate for Shared Kernel | Reusable control with module-specific roles and decisions |
| Error workflow and sanitized failure packet | Refactor candidate for Shared Kernel | Reusable operational control |
| Promise-specific assessment and closure rules | Preserve within Commitment Assurance | Must not be generalized into Service Recovery or Customer Momentum |
| Synthetic fixtures | Preserve as Commitment Assurance regression fixtures | Needed for behavioural-equivalence proof |
| Synthetic executive report | Preserve and later modularize | Existing evidence is synthetic and must remain visibly labelled |
| Flow-specific or unrelated copied logic | Not identified in supplied pack | Requires full code-level migration review before final classification |

## 7. Entry decision

**Decision: PROCEED TO CONTROLLED PHASE 1 REPOSITORY ASSESSMENT.**

Do not begin Service Recovery or Customer Momentum implementation yet. First complete:

1. authoritative evidence snapshot selection;
2. full component inventory;
3. migration classification for every file, schema, workflow node and policy;
4. shared-kernel boundary decision;
5. Commitment Assurance behavioural baseline;
6. regression-test mapping;
7. evidence-gap register.

## 8. Immediate next deliverables

- `docs/control-value-to-attestor-migration.md`
- Current component inventory
- Shared-kernel candidate map
- Commitment Assurance regression baseline
- Evidence-gap register
- Architecture Decision Record for repository continuity
- Phase 1 approval gate

## 9. Time estimate from this baseline

- Detailed repository and workflow assessment: 3–5 focused hours
- File-by-file migration classification: 3–5 hours
- Shared-kernel boundary and ADRs: 3–4 hours
- Commitment Assurance regression baseline: 2–4 hours

**Phase 1 total:** approximately 11–18 focused hours.

Implementation of Service Recovery and Customer Momentum should be estimated only after Phase 1 resolves the shared-kernel boundary and missing operational evidence.
