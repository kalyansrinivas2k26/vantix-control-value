# Risk Register

| Risk ID | Risk | Probability | Impact | Response | Owner role | Status |
|---|---|---|---|---|---|---|
| R-01 | Positive-path evidence is mistaken for broad validation. | Medium | High | Keep Portfolio Preview label and publish limitations. | Product owner | Open |
| R-02 | Live credentials are attached before security gates pass. | Low | Very high | Keep workflows inactive; prohibit credentials in this release. | Workflow owner | Controlled |
| R-03 | Module CTQs are combined into an invalid portfolio metric. | Medium | High | Maintain independent denominators and prohibit aggregate DPMO. | Process owner | Controlled |
| R-04 | AI output is treated as decision authority. | Medium | High | Deterministic validation and human approval binding. | Governance owner | Partly controlled |
| R-05 | Public artifacts expose environment metadata. | Low | High | Sanitize exports and run structural checks. | Release owner | Controlled for current package |
| R-06 | Missing negative tests hide fail-open behaviour. | High | High | Execute mandatory negative and adversarial catalogue before tier advancement. | Test owner | Open |
