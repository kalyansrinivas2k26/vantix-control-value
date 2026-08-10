# Six Sigma and Measurement Framework

## Measurement rule

Each module owns its Critical-to-Quality definitions, defect logic, opportunity denominator and input dataset. Results must not be aggregated across modules without a separately approved measurement design.

| Module | Unit | Current opportunity denominator | Defect examples | Current input dataset |
|---|---|---:|---|---|
| Commitment Assurance | One commitment decision | Defined by the inherited Control Value measurement contract; not recalculated in this Portfolio Preview | Missing required evidence, unsupported closure, SLA misclassification, invalid approval binding | One positive synthetic Gate 2 fixture |
| Service Recovery | One service-recovery decision | 5 opportunities per unit in the current synthetic workflow | Unverified technical status, inconclusive relationship status, unknown SLA, unhandled contradiction, recurrence condition | One positive synthetic fixture `CASE-SYN-001` |
| Customer Momentum | One momentum decision | 6 opportunities per unit in the current synthetic workflow | Change-detection error, unsupported hypothesis, contradiction-handling failure, invalid approval, invalid outcome, relapse-classification error | One positive synthetic fixture `ACC-CM-SYN-001` |

## Capability boundary

No Cpk, process capability, control limits or statistically meaningful Sigma level is reported. One positive synthetic observation per module is insufficient for those claims.

## DMAIC status

| Phase | Current artifact | Status |
|---|---|---|
| Define | Business-outcome sentence and module questions | Complete for Portfolio Preview |
| Measure | CTQ definitions and independent denominators | Defined; dataset insufficient |
| Analyze | Defect register and FMEA | Initial analysis complete |
| Improve | Service Recovery defects corrected before import | Demonstrated for listed defects |
| Control | Regression catalogue, hashes and release gates | Designed; repeated-run evidence pending |
