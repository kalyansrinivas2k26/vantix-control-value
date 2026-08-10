# Evidence Index

| ID | Claim supported | Artifact | Classification |
|---|---|---|---|
| EV-CA-RUN-01 | Commitment Assurance completed one owner-run synthetic path. | `evidence/screenshots/commitment-assurance-green.png` | Verified for the shown synthetic run only |
| EV-SR-RUN-01 | Service Recovery completed one owner-run synthetic path. | `evidence/screenshots/service-recovery-green.png` | Verified for the shown synthetic run only |
| EV-CM-RUN-01 | Customer Momentum completed one owner-run synthetic path. | `evidence/screenshots/customer-momentum-green.png` | Verified for the shown synthetic run only |
| EV-CA-REPORT-01 | Commitment Assurance generated a synthetic executive report. | `evidence/reports/commitment-assurance-synthetic.html` | Verified artifact |
| EV-SR-REPORT-01 | Service Recovery generated a synthetic executive report. | `evidence/reports/service-recovery-synthetic.html` | Verified artifact |
| EV-CM-REPORT-01 | Customer Momentum generated a synthetic executive report. | `evidence/reports/customer-momentum-synthetic.html` | Verified artifact |
| VAL-STRUCT-01 | Public workflows are valid JSON, inactive, connected and sanitized. | `validation/structural-validation.json` | Verified static result |
| VAL-WORD-01 | Repository text was scanned for banned wording. | `validation/wording-scan.json` | Verified static result |
| DEF-SR-01 | Service Recovery pre-import defects were corrected before execution. | `docs/defect-register.md` | Verified from controlled change record |
| INT-01 | Package files match the SHA-256 ledger. | `SHA256SUMS.txt` | Reproducible integrity check |

## Evidence boundaries

None of these artifacts proves live Salesforce operation, live AI-provider execution, production scale, real-customer communication or real-customer outcomes.
