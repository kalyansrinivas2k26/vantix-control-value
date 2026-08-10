# Security & Responsible-AI Evidence Boundary

| Risk | Control | Evidence boundary |
|---|---|---|
| Prompt/instruction injection | evidence is structured and AI output is deterministically validated | control present; broader provider/runtime attack execution remains a gap |
| Insecure AI output | AI diagnosis/critique cannot directly own deterministic facts or closure | workflow structure + exact-node tests |
| Sensitive disclosure | public workflows are credential-free synthetic artifacts | repository scan does not prove production data-governance maturity |
| Excessive agency | action catalogue + approval + closure gates constrain consequential behavior | Gate 2 uses fixtures; no live autonomous customer action |
| Approval replay/mismatch | approval contract binds consequential decisions to exact context | fixture/offline evidence; not authenticated production identity |
| False closure | technical and customer-use verification are separate prerequisites | synthetic/offline evidence |
| Failure handling | separate error workflow and fail-closed routes | production recovery durability remains unproven |

This is an OWASP-aligned review lens, not certification or penetration-test evidence.
