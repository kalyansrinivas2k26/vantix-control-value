# VANTIX Executive Documentation Standard v1.0

**Purpose:** one reusable standard for `docs/executive-brief.md` across all seven VANTIX projects (Flow Integrity, Salesforce Agile Delivery, Commitment Assurance, Service Recovery, Customer Momentum, Synthesis, Pilot-to-BAU Case Study). Instantiate this template per project — do not copy conclusions, scores, or evidence between projects. Each project's brief must stand on its own evidence.

**Guiding principle:** clarity and structure are the actual mark of senior-grade work — not a borrowed name. Nothing in this document or any file built from it may claim external certification, endorsement, or review by McKinsey or any named consultancy. See the Wording Rules section at the end; it is non-negotiable across every instantiation.

---

## Structure — every executive brief follows this exact order

### 0. Business-Outcome Sentence (mandatory first line, before any heading)
One sentence. Plain language. States what breaks without this project, or what it prevents. This is the sentence a recruiter reads in the first three seconds — it must not require any prior context to understand. Use the project's already-agreed canonical outcome sentence verbatim; do not paraphrase it differently here.

### 1. Situation
One paragraph. The real operational problem, in the language of the role it affects (Salesforce admin, Scrum Master, CSM) — not in the language of the tooling. No jargon, no acronyms without one-time expansion. State who experiences this problem and how often, using only what can be substantiated (real experience, cited research, or an explicitly labeled illustrative scenario).

### 2. Complication
Why existing tools or approaches fall short. This must be grounded in the actual competitive research already done for this portfolio — name the real reviewed products or approaches, using the evidence-safe wording rules below (never "no competitor does this"). If no competitor research exists yet for this specific project, say so explicitly rather than asserting a gap that hasn't been checked.

### 3. Question
The single decision this project resolves, stated as one sentence, phrased as a genuine question a stakeholder would ask (e.g., "Was the promised outcome actually fulfilled, not just marked complete?"). One question only — if there are two, the scope is too broad for one brief.

### 4. Answer
The recommendation or design decision, stated plainly, before any supporting evidence. This is the SCQA discipline: answer first, then prove it. One paragraph.

### 5. Evidence
Every claim in this section must trace to something checkable: a test ID, a defect count with its fix, a run ID, a schema validation result, a specific file path. No claim appears here without a citation to where it can be verified in the repository. If a claim can't be traced to a specific artifact, it does not belong in this section — move it to Section 7 (Roadmap) as a stated intention instead.

### 6. What This Doesn't Prove Yet (mandatory — never omit)
Stated as plainly as Section 5. This is not a weakness section to minimize — it is the section that makes Sections 1–5 credible. Examples of the honesty this requires: "not tested at production scale," "live-provider integration pending," "sanitisation review pending." A brief with no limitations listed here should be treated as incomplete, not impressive.

### 7. Roadmap (optional, brief)
What would close the gaps in Section 6, in priority order. No new scope invented here — only what's already planned elsewhere in the project's documentation.

---

## Supporting artifact: One-Page MECE Issue Tree

Every project's `docs/architecture.md` or `docs/executive-brief.md` should include one issue-tree diagram (can be a simple nested-bullet structure or an actual diagram) decomposing the Question in Section 3 into its Mutually Exclusive, Collectively Exhaustive sub-questions. Example shape:

```
Question: Was the promised outcome actually fulfilled?
├── Was the commitment structurally complete?
│   ├── Owner assigned?
│   ├── Acceptance criteria stated?
│   └── Evidence type specified?
├── Was the submitted evidence valid?
│   ├── Does it match the acceptance criteria?
│   └── Is there contradictory evidence?
└── Was closure properly authorised?
    ├── Human approval captured?
    └── Was closure blocked if evidence was missing?
```

This is cheap to build and is the single most "structured executive thinking" artifact you can include — it visibly shows the problem was decomposed rigorously, not just narrated.

---

## Supporting artifact: Honest Self-Assessment Scorecard (single canonical rubric — do not run a second, different one)

Every project includes `docs/quality-scorecard.md` (or reuses `QUALITY_SCORECARD.md`), scored against this ONE 100-point rubric — this replaces and reconciles two earlier drafts that used different weightings; use only this version going forward:

| Dimension | Weight |
|---|---:|
| Business problem and value | 12 |
| Unique decision & portfolio separation | 8 |
| Architecture and control design | 12 |
| Genuine bounded agency | 10 |
| Security, privacy, and responsible AI (incl. OWASP LLM Top 10 review) | 12 |
| Six Sigma / measurement rigor | 10 |
| PMP governance alignment | 8 |
| Agile delivery evidence | 6 |
| Testing and failure resilience | 12 |
| Documentation, traceability, and GitHub reproducibility | 6 |
| Executive communication and demo clarity | 4 |
| **Total** | **100** |

Rules that apply to this scorecard everywhere it's used:
- A numeric score that is NOT rounded up, with one sentence per dimension explaining the score and what would raise it
- The score can NEVER override a mandatory gate — a project scoring 92/100 with an exposed credential or a broken fail-closed route remains blocked, full stop
- Never publish this as "Gold-standard, 96/100" — publish it as "Assessed against a documented internal 100-point portfolio rubric; scorecard and limitations published," with the actual scorecard linked

## OWASP LLM/GenAI Risk Alignment (mandatory security-review lens for every project)

Every project's `docs/security-threat-model.md` must explicitly address, using OWASP's LLM/GenAI risk categories as the review checklist: prompt injection, insecure output handling, sensitive-information disclosure, excessive agency, and applicable governance controls. State which risks apply, which controls mitigate them, and cite the specific test IDs that prove the mitigation (e.g. "prompt-injection attempt — see tests/governance-gate-adversarial/PI-01").

## PMI AI Standard Alignment Checklist (mandatory mapping, not just a citation)

Every project's PMP governance document must map its own controls against PMI's June 2026 AI standard's areas: value and benefits, governance, stakeholder accountability, risk, human oversight, adaptive/predictive delivery fit, decision authority, transparency, and responsible AI. This is a mapping table, not a paragraph — state which of your project's specific artifacts (RAID log, decision-rights matrix, human gate) satisfies which PMI area.

## Portfolio Execution Tiers (treatment depth, not a sequencing override)

This determines HOW THOROUGHLY a project is treated once its turn comes in the build sequence — it never changes WHEN a project is built. The existing sequencing decisions (Projects 1–7 in order, Project 8 banked until 4–7 are complete) remain fully in force regardless of tier.

**Tier A — full treatment, applies to:** Flow Integrity, Salesforce Agile Delivery, Commitment Assurance, and Delivery Covenant (Project 8 — full Tier A treatment happens when it is eventually built, not before; being Tier A is not permission to start early). Full treatment = working workflow, robust test suite with the edge-case matrix, complete architecture doc, security/threat model with OWASP mapping, Six Sigma/PMP/Agile artifacts, executive report, reproducible release, demo, and — where realistically obtainable — external practitioner review.

**Tier B — supporting modules:** Service Recovery, Customer Momentum, and early Synthesis. Requires: clear architecture, validated schemas, a focused test suite, one compelling demo scenario, honest Portfolio Preview status. Promote to Tier A depth only after real evidence accumulates, not on a schedule.

**Tier C — case-study evidence, not software:** Pilot-to-BAU. Demonstrates real implementation leadership, stakeholder management, adoption, training, operational transition, lessons learned, substantiated outcomes — never dressed up as a workflow.

## External Practitioner Review (aspirational, add when realistically available — do not fabricate this)

For Tier A projects, seeking review from a real domain reviewer (Salesforce architect, delivery manager, CSM leader, or PMO professional), a process reviewer (Six Sigma Black Belt or Process Excellence leader), and a technical/governance reviewer (n8n practitioner, security professional) materially strengthens credibility. If and when such a review happens, record: role and relevant experience, date reviewed, artifacts inspected, strengths, concerns, required corrections, final disposition, and permission to quote — in `docs/practitioner-review.md`. Never call this "certification." Use "practitioner review," "independent expert feedback," or "external design review." If no such review has happened yet, the document should say so plainly rather than implying one occurred — an empty or absent `practitioner-review.md` is honest; a vague reference to "expert feedback" that didn't happen is not.

## The Recruiter-Simple Front Door (mandatory, regardless of tier)

Every project's README, above the fold, must give a reader all seven of these within the first screen — the full documentation is the credibility foundation underneath, not the homepage: (1) one-line business outcome sentence, (2) one architecture diagram, (3) three validated results, (4) one real failure found and fixed, (5) one honestly stated limitation, (6) a 60–90 second demo link, (7) a link to the full evidence index for anyone who wants to go deeper.

## Final Sign-Off Gates (all six required before any release tier is awarded)

Engineering gate → Security gate (including OWASP mapping) → Measurement gate (Six Sigma rigor) → Business-value gate (outcome sentence + evidence) → External-feedback gate (practitioner review, where obtained) → Recruiter-readability gate (the seven-point front door above). A project does not advance a tier by looking complete — it advances by passing each gate with cited evidence.

---

## Wording Rules (apply to every instantiation, no exceptions)

- Never use "McKinsey-standard," "McKinsey-style," "McKinsey-level," or any wording implying review, endorsement, or certification by McKinsey or any named consultancy. Use instead: "executive-grade," "decision-oriented," "evidence-based executive-readiness assessment," or "hypothesis-led and evidence-traceable."
- Never use "independent audit" or "independent external audit" unless a genuinely unrelated third party or human reviewer was involved. Use "three adversarial review rounds" or "adversarial validation pass."
- Never use "no competitor does this" or "genuinely unique." Use "our review did not identify a single publicly documented product combining these capabilities," "not consistently found in the publicly documented tools reviewed," or "an uncommon control design within the reviewed comparison set."
- Never use "production-ready" unless the project has been tested at production scale with real (not synthetic) data volumes. Use the project's actual maturity tier (Portfolio Preview / Release Candidate / Verified Release) instead.
- Any Six Sigma figure (DPMO, Sigma level, Cpk) must appear alongside its unit, defect definition, opportunity denominator, and input dataset in the same document — never as a bare number.
- Every claim of "unique," "differentiated," or "uncommon" must specify which competitor or product was actually reviewed, when, and what was and wasn't found — per the evidence classification already established (Verified / Partially Verified / Not Verified / Not Applicable).

---

## Instantiation checklist (per project)

- [ ] Business-outcome sentence matches the canonical wording exactly (no paraphrase)
- [ ] Situation grounded in the real role/problem, no invented statistics
- [ ] Complication cites actual reviewed competitors with evidence-safe wording
- [ ] Question is singular
- [ ] Answer precedes evidence, not the reverse
- [ ] Every evidence claim traces to a file path, test ID, or run ID
- [ ] Limitations section present and honest, not minimized
- [ ] MECE issue tree included
- [ ] Scorecard present, using the single canonical 100-point rubric, not inflated
- [ ] OWASP LLM/GenAI risks addressed in the security-threat-model, with test IDs cited
- [ ] PMI AI standard mapping table present in the PMP governance doc
- [ ] Correct tier assigned (A/B/C) and that tier's required depth actually delivered
- [ ] Recruiter-simple front door (all 7 elements) present above the fold in the README
- [ ] All six final sign-off gates checked before any release-tier label is applied
- [ ] No banned wording anywhere in the document
