# GitHub Repository Metadata (paste these into repo Settings)

These are repository-level settings on GitHub's side, not files — nothing automated can set them for you. Copy-paste these when you create/configure the repo.

## Repository name

`vantix-control-value`

*(If you use a different name, update the CI badge URL in `README.md` — it currently points at `github.com/kalyansrinivas2k26/vantix-control-value/actions/workflows/validate.yml` and will show "not found" until the repo exists at that exact path.)*

## Description (short, appears under the repo name)

> Governed AI + deterministic control loop that verifies a customer promise was actually fulfilled — not just recorded as done. Synthetic Gate 2 prototype, externally audited, 195/195 checks passing.

## Topics (add via the gear icon next to "About")

```
ai-governance
n8n
salesforce
customer-success
six-sigma
process-automation
json-schema
workflow-automation
crm
responsible-ai
```

## Website field

Leave blank, or point at your LinkedIn (`linkedin.com/in/bkrsrinivas`) if you want the repo card to link somewhere.

## Social preview image

GitHub auto-generates one from the README if none is set. If you want a custom one later, a simple export of the "At a glance" table from `README.md` as an image works well — not required for launch.

## After creating the repo

1. **Settings → General → Features**: leave Issues and Discussions on if you want the repo to look actively maintained; Wikis can stay off.
2. **Settings → Actions → General**: confirm Actions are enabled (needed for the `validate.yml` CI badge to work).
3. Once the first push lands and Actions runs green, the badge in `README.md` will render correctly — it will show "failing" or "no status" until then, which is expected, not a bug.
