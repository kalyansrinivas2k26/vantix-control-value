# Sanitized Reference Pattern Review

## Reference boundary

Only the sanitized public `Salesforce-Governance-Sentinel-v1.3-public.json` was used to inspect reusable architectural controls.

Environment-specific exports are excluded. No source query, credential identifier, org reference, Data Table identifier or environment-specific value is copied into Vantix Control Value.

## Controls retained as patterns

| Pattern observed in sanitized reference | Vantix Control Value use |
| --- | --- |
| Immutable run context | Expanded into correlation ID, promise ID, account key, version set, timestamps and operating mode |
| Least-privilege integration pattern | Reserved for optional sandbox read-only evidence mode |
| Deterministic logic kept outside AI | Applied to evidence quality, likelihood, impact, priority, confidence, SLA, policy and outcome |
| Structured AI response | Applied to evidence-cited diagnosis and catalogue action codes |
| Second AI critique | Retained only as an advisory consistency/evidence check |
| Schema validation after model output | Expanded into versioned stage contracts plus cross-contract validation |
| Safe fallback to human review | Required for missing, conflicting, weak, stale, malformed or unsupported inputs |
| Retry on transient external calls | Redesigned with failure classes, idempotency and ambiguous-timeout controls |
| Human-controlled consequential work | Expanded into payload-bound, single-use human decisions |
| Escaped executive HTML | Retained as a future reporting control against validated envelope data |
| Sanitized public export | Required for all Vantix Control Value public artifacts |

## Elements intentionally not reused

| Sanitized reference element | Vantix Control Value replacement |
| --- | --- |
| Salesforce Flow metadata query | Vantix Control Value-specific promise/evidence collection designed after gate approval |
| Flow governance defect model | Promise lifecycle and evidence contracts |
| Flow DPMO calculation | Vantix Control Value-specific unit, applicable opportunities and defect catalogue |
| Scan-history Data Table | New run, idempotency/action, audit and dead-letter logical stores |
| Governance Issue register | Promise, evidence, diagnosis, action, decision, execution and outcome records |
| Critical/Minor finding route | Policy decisions: allow, require approval, deny or defer to human review |
| Story generation | Separate CSM/Admin actions; effort remains human-estimated |
| Metadata-remediation acceptance criteria | Explicit technical and customer outcome criteria |
| Single-stage finding closure | Execute → verify system → verify customer → deterministic SLA → human-approved close |

## Design conclusion

Vantix Control Value is architecturally related to the prior project only through proven control patterns. Its business semantics, contracts, persistence, deterministic rules, policy state and verification loop are newly designed for customer promises.

