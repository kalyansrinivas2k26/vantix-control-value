# Test Catalogue

## Executed and evidenced

| Test ID | Scope | Expected result | Evidence | Status |
|---|---|---|---|---|
| CA-POS-01 | Commitment Assurance positive synthetic Gate 2 path | Promise closes only after evidence and bound human approval | `EV-CA-RUN-01`, `EV-CA-REPORT-01` | Passed for shown run |
| SR-POS-01 | Service Recovery restored/recovering/SLA-met path | Route is `MONITOR_RECOVERY` | `EV-SR-RUN-01`, `EV-SR-REPORT-01` | Passed for shown run |
| CM-POS-01 | Customer Momentum negative-change/adoption-friction/improving path | Route is `APPROVED_INTERVENTION` and outcome is `IMPROVING` | `EV-CM-RUN-01`, `EV-CM-REPORT-01` | Passed for shown run |
| STRUCT-01 | Public workflow structure | Valid JSON, inactive, connected, sanitized | `VAL-STRUCT-01` | Passed |

## Required next

| Test ID | Scenario | Expected control behaviour |
|---|---|---|
| NEG-CONTRACT-01 | Required field missing | Fail closed with sanitized error |
| NEG-TIME-01 | Invalid or future evidence timestamp | Reject or classify unusable evidence |
| NEG-STALE-01 | Evidence is stale | Request fresh evidence or human review |
| NEG-CONTRA-01 | Contradictory technical evidence | Route to contradiction review |
| NEG-APP-01 | Missing approval | Block consequential route |
| NEG-APP-02 | Wrong approver role | Block consequential route |
| NEG-APP-03 | Correlation mismatch | Block consequential route |
| NEG-AI-01 | AI status differs from deterministic result | Reject AI output |
| NEG-AI-02 | AI cites nonexistent evidence | Reject AI output |
| NEG-IDEM-01 | Duplicate execution request | Prevent duplicate consequence |
| NEG-RETRY-01 | Ambiguous execution failure | Preserve safe retry state |
| REG-XMOD-01 | Shared-control change | No silent cross-module behavioural regression |
| SEC-PI-01 | Prompt-injection content in evidence | Treat as data and preserve deterministic authority |

No unexecuted test is represented as passed.
