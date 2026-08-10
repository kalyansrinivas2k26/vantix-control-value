# Evidence Provenance

## Evidence classes

**Source artifact:** exact retained historical file.

**Stored validation report:** generated evidence retained from a prior project run; not automatically a fresh rerun.

**Owner-run n8n evidence:** report/screenshot generated from an owner-run synthetic workflow execution. It proves only visible synthetic workflow behavior.

**Offline exact-node-code execution:** JavaScript extracted directly from the supplied workflow and executed against controlled fixtures outside n8n.

**Design-only:** documented control or test not yet executed.

## Non-negotiable boundaries

- Synthetic fixtures never become customer evidence.
- AI replays never become live Gemini evidence.
- Human approval fixtures never become authenticated-human evidence.
- Owner-run synthetic n8n execution never becomes production-scale evidence.
- 103/103 stored reports never become a fresh independent rerun unless actually reproduced.
- Attestor module evidence never becomes Control Value evidence merely because it temporarily lived in the same repository.
