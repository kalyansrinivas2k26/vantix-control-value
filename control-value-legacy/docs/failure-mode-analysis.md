# Failure Mode and Effects Analysis

Scoring is preliminary and internal. It is not a validated process FMEA baseline.

| ID | Failure mode | Effect | Current control | Residual concern | Required test |
|---|---|---|---|---|---|
| FM-01 | Stale or future evidence accepted | Incorrect status or route | Freshness and timestamp checks | Negative execution not yet evidenced | `NEG-TIME-01`, `NEG-STALE-01` |
| FM-02 | AI invents or changes a fact | Unsupported decision | Evidence-reference and deterministic equality validation | Adversarial live-model test pending | `NEG-AI-01`, `NEG-AI-02` |
| FM-03 | Wrong or mismatched approval accepted | Unauthorized consequence | Role, decision ID and correlation binding | Expiry and replay tests pending | `NEG-APP-01` to `NEG-APP-03` |
| FM-04 | Contradictory evidence ignored | False recovery or confidence | Explicit contradiction search | Multi-source negative path pending | `NEG-CONTRA-01` |
| FM-05 | Duplicate request repeats action | Duplicate customer or system consequence | Idempotency design retained in Commitment Assurance | Durable cross-run proof pending | `NEG-IDEM-01` |
| FM-06 | Public export leaks instance metadata or secret | Security and privacy exposure | Metadata stripping and static scan | Secret-pattern test coverage incomplete | `SEC-SD-01` |
| FM-07 | Shared control changes domain behaviour | Cross-module regression | Independent policies and regression gate | Automated cross-module suite pending | `REG-XMOD-01` |
