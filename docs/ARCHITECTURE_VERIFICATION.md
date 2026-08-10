# Architecture Verification

Active workflow: `../workflows/VANTIX-Control-Value-v0.2-public.json`

Observed structure:
- 20 nodes;
- 19 connection-source entries;
- governed main path from synthetic trigger to report creation.

The Gate 2 workflow separates:

deterministic intake → duplicate protection → deterministic assessment → evidence observation → synthetic bounded diagnosis → synthetic critique → deterministic AI validation → deterministic action policy → human-approval contract → permitted synthetic action → technical verification → customer-use verification → SLA/outcome → retry/reroute/escalate/close → run-envelope validation → report.

A separate error-handler workflow is retained.

The workflow's Gate 2 AI and human-decision records are fixtures. Architecture documentation must not describe them as live model calls or authenticated production approval.
