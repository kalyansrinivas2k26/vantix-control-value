# Defect Register

| ID | Found in | Defect | Correction | Verification | Status |
|---|---|---|---|---|---|
| DEF-SR-01 | Service Recovery pre-import v0.1 | Latest evidence could depend on input array order. | Sort eligible evidence chronologically before selecting the latest observation. | Successful v0.2 owner-run synthetic execution; `EV-SR-RUN-01`. | Closed for demonstrated path |
| DEF-SR-02 | Service Recovery pre-import v0.1 | Invalid or future evidence timestamps were not fully rejected or classified. | Added timestamp parsing and future-observation checks. | Static code review plus `EV-SR-RUN-01`. | Closed for demonstrated path |
| DEF-SR-03 | Service Recovery pre-import v0.1 | SLA timestamps lacked complete validation. | Added validity checks before deterministic SLA classification. | Static code review plus `EV-SR-RUN-01`. | Closed for demonstrated path |
| DEF-SR-04 | Service Recovery pre-import v0.1 | AI status, confidence and evidence references were insufficiently bound to deterministic output. | Added status equality, confidence range and evidence-reference checks. | Static code review plus `EV-SR-RUN-01`. | Closed for demonstrated path |
| DEF-SR-05 | Service Recovery pre-import v0.1 | Human approval validation did not fully enforce role, timestamp and correlation binding. | Added decision ID, allowed role, timestamp and correlation checks. | Static code review plus `EV-SR-RUN-01`. | Closed for demonstrated path |
| DEF-SR-06 | Service Recovery pre-import v0.1 | Contradiction and recurrence CTQ defect flags were calculated incorrectly. | Corrected defect conditions and independent denominator logic. | Static code review plus `EV-SR-RUN-01`. | Closed for demonstrated path |

Closure applies only to the demonstrated positive synthetic path. Negative-path execution evidence remains required.
