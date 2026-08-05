# Six Sigma Applied to the Build Process Itself

*This is a second, separate Six Sigma measurement from `SIX_SIGMA_MEASUREMENT_PLAN.md`. That document measures the customer-promise lifecycle Vantix Control Value governs. This document measures something different: the quality of the engineering process that built Vantix Control Value, using the same DPMO discipline turned on the project's own delivery.*

## Why this exists

It's easy to state Six Sigma vocabulary. It's harder to apply it correctly to your own work, including reporting a defect against yourself. This document does the second thing, with the same rigor the project already insists on: real unit/opportunity/defect definitions, no Sigma-level claim from a single small sample, and no rounding a bad result into a good-sounding one.

## Measurement definitions

**Unit:** one independent external design audit of the Gate 2 synthetic vertical slice, conducted 2 August 2026 against the codebase as it stood at that time.

**Opportunity:** one automated control check declared in the validation suite at the time of that audit (`scripts/validate-foundation.mjs` + `scripts/validate-gate2.mjs`), each representing one independently verifiable claim about contract, policy, or workflow behavior.

**Defect:** one declared or implied control whose actual code behavior did not match its specified/intended behavior, found by independent line-by-line review rather than by the automated suite itself (i.e., a gap the existing tests did not catch).

## The measurement

| Measure | Value |
| --- | --- |
| Units | 1 (single external audit pass) |
| Applicable opportunities (checks in place at audit time) | 186 (92 foundation + 94 Gate 2) |
| Defects found | 3 |
| DPO (defects ÷ opportunities) | 0.01613 |
| DPMO (DPO × 1,000,000) | 16,129 |

The three defects, by defect definition:

| Defect | Specified behavior | Actual behavior found |
| --- | --- | --- |
| `CONFIDENCE_DEFERRAL_NOT_ENFORCED` | A below-minimum-confidence AI recommendation must force human review | The policy-evaluation node computed the correct decision (`DEFER_HUMAN_REVIEW`) but never acted on it — routing continued as if nothing had happened |
| `CORRELATION_METADATA_NOT_PROPAGATED` | A failed run's dead-letter packet must carry the real `correlationId`/`promiseId` so it can be traced back to the promise | The error handler expected this metadata from `$execution.customData`; the main workflow never set it, so every failure would have shown `"UNKNOWN"` |
| `CLOSURE_STATUS_NOT_VISIBLE` | The executive report must make it obvious whether a promise actually closed | The report rendered the same way regardless of whether the run closed, was escalated, or failed |

## What this does and does not license us to say

**Can say:** in a single independent audit of 186 declared control opportunities, 3 defects were found and are now fixed, each with a permanent regression test added specifically to prevent recurrence (see `NEGATIVE_LOW_CONFIDENCE_BUSINESS_RULE` and the customData/closure-banner checks in `scripts/validate-gate2.mjs`). Post-fix, the same category of check now stands at 195 opportunities with 0 known defects.

**Cannot say:** that this represents a "Sigma level" or ongoing process capability. One audit of one codebase snapshot is not a time-ordered, repeated-sample process — exactly the same restriction the customer-promise measurement plan already places on itself. A DPMO number from n=1 describes what was found once; it does not predict what will be found next time. The honest claim is narrower and more useful: *a real external check was performed, it found real problems, and the fix included building a permanent test so the same problem class cannot silently return.*

## The control that actually matters here

The reason this project treats "3 defects found by audit" as a feature rather than something to hide: the response to each defect was not just a patch, it was a new permanent opportunity added to the suite (five new negative fixtures, two new runtime checks). That is the Six Sigma "Control" phase in miniature — a finding doesn't just get fixed, the measurement system itself gets strengthened so the same gap is structurally harder to reintroduce.
