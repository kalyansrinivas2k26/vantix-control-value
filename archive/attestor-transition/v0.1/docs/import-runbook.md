# Import Runbook

1. Preserve the original Control Value workflows unchanged.
2. Create new n8n workflows for the four JSON files under `workflows/`.
3. Import the Error Handler first, then Commitment Assurance, Service Recovery and Customer Momentum.
4. Keep every imported workflow inactive.
5. Do not attach production credentials.
6. Confirm node and edge counts against `validation/structural-validation.json`.
7. Do not execute without an approved test case and evidence-capture plan.

The current public exports have already been evidenced through their owner-run migration or pre-import copies. A clean-import rerun of the sanitized exports remains an open test.
