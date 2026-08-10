# Requirements Traceability Matrix

| Requirement | Implementation | Evidence | Status |
|---|---|---|---|
| Preserve existing Commitment Assurance behaviour | Migrated 20-node workflow and protected original baseline | `CA-POS-01` | Partially demonstrated; full regression pending |
| Separate technical and relationship recovery | Service Recovery nodes 8 and 9 | `SR-POS-01` | Demonstrated for positive fixture |
| Generate competing momentum hypotheses | Customer Momentum nodes 7–10 | `CM-POS-01` | Demonstrated for positive fixture |
| Keep AI bounded | Deterministic output-validation nodes | `SEC-OH-01`, `SEC-OH-02` planned | Control present; negative proof pending |
| Require human authority for consequential decisions | Approval-binding nodes and route logic | Positive run artifacts; negative tests planned | Partially demonstrated |
| Preserve independent CTQs | Module-specific CTQ nodes and documentation | `docs/six-sigma-measurement.md` | Documented |
| Provide evidence-traceable outputs | Reports, screenshots and evidence index | `docs/evidence-index.md` | Demonstrated for synthetic paths |
| Sanitize public workflow exports | Removed workflow/instance/version metadata | `VAL-STRUCT-01` | Passed |
| Follow executive documentation standard | SCQA brief, issue tree, scorecard, gates and wording scan | `validation/documentation-standard-check.json` | Passed for package structure |
