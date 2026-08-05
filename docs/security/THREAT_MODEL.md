# Vantix Control Value Foundation Threat Model

## Scope

This threat model covers the Foundation Gate design and first synthetic validation mode. It does not authorize production data or live Salesforce configuration changes.

## Assets

| Asset | Why it matters |
| --- | --- |
| Promise and account identifiers | Bind every decision to the correct customer commitment |
| Evidence records | Basis for diagnosis, action and outcome claims |
| Deterministic ruleset | Source of official scores, SLA and outcome state |
| Action catalogue | Defines the complete permitted action surface |
| Human decisions | Source of authority for consequential actions |
| Idempotency ledger | Prevents duplicate promise/action execution |
| Audit ledger | Establishes traceability and accountability |
| Salesforce/Gemini credentials | High-value secrets; never part of data contracts or public exports |
| Executive report | Public-facing representation of system claims |

## Threats and required controls

| ID | Threat | Consequence | Required controls | Verification |
| --- | --- | --- | --- | --- |
| THR-01 | Prompt injection in evidence text | Model ignores policy or invents action | Treat evidence as data, fixed system instructions, structured output, action allowlist | Injection fixture routes safely |
| THR-02 | Hallucinated evidence or record | Unsupported diagnosis/action | Evidence IDs required, reference resolution, claim critique, Human Review | Unknown evidence test rejected |
| THR-03 | Unknown/disabled action code | Unauthorized capability | Default-deny catalogue, enabled/mode checks repeated before execution | Unknown action negative test |
| THR-04 | AI self-approval | Loss of human authority | Human-decision schema requires human actor; role and separation checks | AI actor approval rejected |
| THR-05 | Approval replay after payload change | Different action executes under old approval | SHA-256 payload binding, single use, TTL, reapproval after change | Payload mismatch test |
| THR-06 | Duplicate execution after retry | Repeated write/message | Action idempotency key, target-state check, no blind consequential retry | Replay test |
| THR-07 | Ambiguous timeout | Duplicate or unknown result | Record `AMBIGUOUS`, verify ledger/target, Human Review before retry | Ambiguous-timeout negative path |
| THR-08 | Weak/conflicting evidence | Unsafe diagnosis/action | Deterministic completeness/strength, conflict override to LOW, Human Review | Missing/conflict fixtures |
| THR-09 | Technical state treated as outcome | False closure | Separate technical and customer criteria, deterministic closure rule | False-outcome negative test |
| THR-10 | Secret leakage in execution/report | Credential/customer exposure | Credential store only, field allowlist, sanitization scan, HTML escaping | Public-hygiene scan |
| THR-11 | Cross-account record mix-up | Wrong customer action | Correlation/promise/account consistency checks on every contract | Trace-context validation |
| THR-12 | Audit tampering or omission | Unverifiable claim | Append-only events, contiguous sequence, previous-event link, required event types | Audit chain validation |
| THR-13 | Over-privileged Salesforce user | Excess data/change capability | Dedicated integration user, API only, least-privilege permission set, read-only MVP scope | Sandbox permission review |
| THR-14 | Model/provider outage | Workflow hard-stop or bypass | Bounded retry then Human Review; no score/outcome fallback from AI prose | Model-timeout fixture |
| THR-15 | Synthetic result presented as real | Misleading portfolio/public claim | `syntheticData` on every record, report banner, limitations and release scan | Synthetic consistency check |

## Data minimization

The first run contains no real customer data. Optional sandbox mode will use:

- fabricated account and user identities;
- allowlisted record fields only;
- no credential, token, secret or raw authorization header in workflow data;
- no raw customer message body sent to the model unless explicitly approved later;
- sanitized errors without response headers or tokens.

## Least privilege

Optional sandbox evidence mode must use:

1. one connected/external client app for Vantix Control Value;
2. one dedicated API-only integration user;
3. Admin pre-approval and a single run-as user;
4. a purpose-built permission set;
5. read access only to the synthetic objects/fields required by the workflow;
6. no Modify All Data, Customize Application or metadata-deployment authority;
7. credential rotation that affects only Vantix Control Value.

## Approval security

An approval is invalid when any of these are true:

- approver is not human;
- role is not authorized for the action;
- payload hash differs;
- action/promise differs;
- approval expired;
- decision was already consumed;
- evidence or policy changed;
- separation-of-duties check failed;
- action already succeeded under the idempotency key.

## Public-release security gate

Before GitHub release:

- export only the sanitized workflow;
- remove credentials and credential IDs;
- replace org/environment URLs with placeholders or runtime configuration;
- remove execution data that contains customer or org identifiers;
- verify fixture flags;
- run the automated forbidden-pattern scan;
- visually inspect screenshots, GIFs, HTML and PDFs;
- document synthetic limitations prominently.

