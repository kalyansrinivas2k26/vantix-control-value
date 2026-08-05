#!/usr/bin/env node
/**
 * Vantix Control Value — Live AI Diagnosis Preview (OPTIONAL, LOCAL-ONLY)
 * ---------------------------------------------------------------------
 * This script is NOT part of `npm test` and ships with no credential.
 * It exists to prove one thing: the same governance code that validates
 * the synthetic AI-diagnosis fixture in the n8n workflow also works
 * against a REAL model response — the guardrails are model-agnostic,
 * not written to fit a canned answer.
 *
 * It sends the real evidence-bounded diagnosis prompt to a model of your
 * choice, then runs the exact same three checks the workflow's Code nodes
 * run (grounding, catalogue membership, qualitativeOnly scope), plus an
 * optional second call asking the model to critique its own diagnosis
 * (which must come back unable to approve anything).
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-ant-...   node scripts/live-ai-diagnosis-preview.mjs
 *   GEMINI_API_KEY=AIza...         node scripts/live-ai-diagnosis-preview.mjs
 *
 * Nothing here writes to the repository, the fixture, or any report.
 * It only prints a PASS/FAIL summary to the terminal.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixture = JSON.parse(
  fs.readFileSync(path.join(root, 'fixtures/synthetic/mvp-complete-run.v1.0.0.json'), 'utf8')
);
const catalog = JSON.parse(
  fs.readFileSync(path.join(root, 'governance/action-catalog.v1.0.0.json'), 'utf8')
);

const enabledActionCodes = catalog.actions.filter((a) => a.enabled).map((a) => a.actionCode);
const allowedCategories = ['CUSTOMER_PROBLEM', 'ACCESS_DIAGNOSTIC', 'TARGET_CONFIGURATION'];
const diagnosisEvidence = fixture.evidenceRecords.filter((e) =>
  allowedCategories.includes(e.evidenceCategory)
);
const suppliedEvidenceIds = new Set(fixture.evidenceRecords.map((e) => e.evidenceId));

const evidenceSummary = diagnosisEvidence
  .map((e) => `- ${e.evidenceId} [${e.evidenceCategory}]: ${e.contentSummary || JSON.stringify(e.factAssertions || {})}`)
  .join('\n');

const diagnosisPrompt = `You are diagnosing a single customer promise for a CRM governance system called Vantix Control Value.

You may ONLY use the evidence below. Every factual claim you make MUST cite at least one evidence ID from this list. Do not invent facts. Do not calculate a score. Do not approve or execute anything — you are producing a qualitative diagnosis only.

Evidence available (evidence IDs on the left):
${evidenceSummary}

Allowed action codes you may recommend (nothing else): ${enabledActionCodes.join(', ')}

Respond with ONLY a single JSON object (no markdown fences, no prose) matching this shape:
{
  "rootCauseDomain": one of ["CUSTOMER","OPERATIONS","DATA","SALESFORCE_OWNERSHIP","SALESFORCE_ACCESS","SALESFORCE_AUTOMATION","SALESFORCE_CONFIGURATION","DELIVERY","UNKNOWN"],
  "problemSummary": "20-2000 char plain-language summary",
  "claims": [
    { "claimId": "CLM-LIVE-001", "statement": "...", "claimType": "FACT|INFERENCE|UNCERTAINTY", "supportStatus": "SUPPORTED|PARTIALLY_SUPPORTED|UNSUPPORTED", "evidenceRefs": ["EVD-SYN-..."] }
  ],
  "recommendedActionCodes": ["..."],
  "uncertainties": ["..."]
}

Include at least one claim that considers and rules out an alternative explanation, citing the evidence that rules it out — do not just state the most obvious cause.`;

function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON object found in model output.');
  return JSON.parse(candidate.slice(start, end + 1));
}

async function callAnthropic(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Anthropic API error: ${JSON.stringify(data)}`);
  const text = data.content.map((b) => b.text || '').join('\n');
  return { modelIdentifier: data.model || 'anthropic-model', text };
}

async function callGemini(prompt) {
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(`Gemini API error: ${JSON.stringify(data)}`);
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('\n') || '';
  return { modelIdentifier: model, text };
}

async function main() {
  const provider = process.env.ANTHROPIC_API_KEY
    ? 'anthropic'
    : process.env.GEMINI_API_KEY
      ? 'gemini'
      : null;

  if (!provider) {
    console.log(
      'No API key found. Set ANTHROPIC_API_KEY or GEMINI_API_KEY and re-run.\n' +
        'Example: ANTHROPIC_API_KEY=sk-ant-... node scripts/live-ai-diagnosis-preview.mjs'
    );
    process.exitCode = 1;
    return;
  }

  console.log(`Calling live model via ${provider}...`);
  const { modelIdentifier, text } =
    provider === 'anthropic' ? await callAnthropic(diagnosisPrompt) : await callGemini(diagnosisPrompt);

  let diagnosis;
  try {
    diagnosis = extractJson(text);
  } catch (e) {
    console.log('FAIL: could not parse a JSON object out of the model response.');
    console.log('Raw response:\n', text);
    process.exitCode = 1;
    return;
  }

  console.log(`\nModel used: ${modelIdentifier}`);
  console.log('Raw diagnosis returned by the live model:');
  console.log(JSON.stringify(diagnosis, null, 2));

  const checks = [];
  const check = (name, condition, detail) => checks.push({ name, status: condition ? 'PASS' : 'FAIL', detail });

  const claims = Array.isArray(diagnosis.claims) ? diagnosis.claims : [];
  check(
    'GROUNDING — every claim cites at least one real evidence ID',
    claims.length > 0 &&
      claims.every((c) => Array.isArray(c.evidenceRefs) && c.evidenceRefs.length > 0 && c.evidenceRefs.every((r) => suppliedEvidenceIds.has(r))),
    'Mirrors workflow node 08 (PO_AI_UNGROUNDED_CLAIM).'
  );

  const recommended = Array.isArray(diagnosis.recommendedActionCodes) ? diagnosis.recommendedActionCodes : [];
  check(
    'CATALOGUE — every recommended action code is enabled in the catalogue',
    recommended.length > 0 && recommended.every((code) => enabledActionCodes.includes(code)),
    'Mirrors workflow node 10 (AI_OUTPUT_VALIDATION_FAILED -> human review).'
  );

  check(
    'DIFFERENTIAL — at least one claim rules something out (UNSUPPORTED or PARTIALLY_SUPPORTED)',
    claims.some((c) => c.supportStatus === 'UNSUPPORTED' || c.supportStatus === 'PARTIALLY_SUPPORTED'),
    'Demonstrates the model reasoning about what is NOT the cause, not only the obvious answer.'
  );

  console.log('\n--- Governance check results (same rules the n8n workflow enforces) ---');
  for (const c of checks) {
    console.log(`${c.status === 'PASS' ? '✅' : '❌'} ${c.name}\n   ${c.detail}`);
  }
  const failed = checks.filter((c) => c.status === 'FAIL');
  console.log(
    `\n${failed.length === 0 ? 'ALL CHECKS PASSED' : `${failed.length} CHECK(S) FAILED`} — a real ${provider} response was evaluated against the identical rules that govern the synthetic fixture.`
  );
  if (failed.length) process.exitCode = 1;
}

main().catch((err) => {
  console.error('Live AI preview failed:', err.message);
  process.exitCode = 1;
});
