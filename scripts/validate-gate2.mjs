import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const writeReport = process.argv.includes('--write-report');
const mainPath = path.join(root, 'workflows', 'Vantix-Control-Value-v0.2-Synthetic-Governed-Outcome-Loop.json');
const errorPath = path.join(root, 'workflows', 'Vantix-Control-Value-v0.2-Error-Handler.json');
const main = JSON.parse(fs.readFileSync(mainPath, 'utf8'));
const error = JSON.parse(fs.readFileSync(errorPath, 'utf8'));
const checks = [];
const check = (condition, code, detail) => checks.push({ code, status: condition ? 'PASS' : 'FAIL', detail });

check(main.name.includes('Vantix Control Value'), 'WF_NAME', main.name);
check(main.active === false, 'WF_INACTIVE_ON_IMPORT', 'Workflow imports inactive.');
check(main.meta?.syntheticOnly === true, 'WF_SYNTHETIC_ONLY', 'Gate 2 cannot perform live changes.');
check(main.nodes.length === 20, 'WF_NODE_COUNT', `${main.nodes.length} nodes`);
check(error.nodes.some(n => n.type === 'n8n-nodes-base.errorTrigger'), 'ERROR_TRIGGER', 'Separate error workflow has an Error Trigger.');

// Regression test: simulate the REAL shape of data n8n's Error Trigger
// delivers (confirmed by live testing on 2026-08-04) - no customData at all,
// just execution.error.message, execution.id, and workflow.name - and
// confirm the Sanitize Failure Context node still recovers real
// correlationId/promiseId/accountKey from the embedded message tag.
{
  const sanitizeNode = error.nodes.find(n => n.name === '02 Sanitize Failure Context');
  const realisticN8nErrorTriggerPayload = {
    execution: {
      id: '109',
      error: {
        name: 'WORKFLOW_ERROR',
        message: 'PO_SCHEMA_REQUIRED_MISSING: BREAK_THIS_ON_PURPOSE [correlationId=PO-RUN-SYN-20260713-001|promiseId=PRM-SYN-001|accountKey=ACC-SYN-001]'
      }
      // Deliberately no customData field - this matches what real n8n sends.
    },
    workflow: { name: 'Vantix Control Value v0.2 - Synthetic Governed Outcome Loop' }
  };
  const sandbox = {
    $input: { first: () => ({ json: realisticN8nErrorTriggerPayload }) },
    Date, JSON, Map, Set, Math, Number, String, Boolean, Error
  };
  const result = await new vm.Script(`(async()=>{${sanitizeNode.parameters.jsCode}\n})()`).runInNewContext(sandbox);
  const packet = result[0].json;
  check(packet.correlationId === 'PO-RUN-SYN-20260713-001', 'SANITIZE_RECOVERS_CORRELATION_ID', `Got: ${packet.correlationId}`);
  check(packet.promiseId === 'PRM-SYN-001', 'SANITIZE_RECOVERS_PROMISE_ID', `Got: ${packet.promiseId}`);
  check(packet.accountKey === 'ACC-SYN-001', 'SANITIZE_RECOVERS_ACCOUNT_KEY', `Got: ${packet.accountKey}`);
  check(!packet.errorMessage.includes('[correlationId='), 'SANITIZE_STRIPS_CONTEXT_TAG_FROM_DISPLAY', `Got: ${packet.errorMessage}`);
}

const requiredNames = [
  '04 Validate Canonical Intake',
  '05 Enforce Duplicate Promise Protection',
  '06 Calculate Deterministic Assessment',
  '08 AI Diagnosis - Synthetic Structured Replay',
  '09 AI Critique - Synthetic Structured Replay',
  '10 Validate AI Outputs Deterministically',
  '11 Evaluate Action Catalogue Policy',
  '12 Validate Human Approval Boundaries',
  '13 Execute Permitted Synthetic Actions',
  '14 Verify Technical Access Separately',
  '15 Verify Customer Use Separately',
  '16 Determine SLA and Outcome',
  '17 Retry Reroute Escalate or Close',
  '18 Validate Complete Run Envelope',
  '19 Build Executive HTML Report'
];
for (const name of requiredNames) check(main.nodes.some(n => n.name === name), `NODE_${name.slice(0,2)}`, name);

for (const workflow of [main, error]) {
  for (const node of workflow.nodes.filter(n => n.type === 'n8n-nodes-base.code')) {
    try {
      new vm.Script(`(async()=>{${node.parameters.jsCode}\n})`);
      check(true, `JS_${node.id}`, `${node.name} syntax valid`);
    } catch (e) {
      check(false, `JS_${node.id}`, `${node.name}: ${e.message}`);
    }
  }
}

const text = `${fs.readFileSync(mainPath, 'utf8')}\n${fs.readFileSync(errorPath, 'utf8')}`;
const bannedValues = [
  { code: 'SECRET_FIELD_1', value: `"${['client','secret'].join('_')}":` },
  { code: 'SECRET_FIELD_2', value: `"${['access','token'].join('_')}":` },
  { code: 'SECRET_FIELD_3', value: `"${['refresh','token'].join('_')}":` },
  { code: 'INSTANCE_URL', value: 'instance_url' },
  { code: 'LIVE_ACCESS_ACTION_EXPORT', value: 'ADMIN_ASSIGN_LIVE_REPORT_ACCESS","name"' },
  { code: 'COPIED_DPMO_NODE', value: 'Calculate DPMO' },
  { code: 'COPIED_STORY_NODE', value: 'Generate Story' }
];
for (const banned of bannedValues) {
  check(!text.includes(banned.value), `HYGIENE_${banned.code}`, `No prohibited exported value: ${banned.code}`);
}
check(!main.nodes.some(n => n.type === 'n8n-nodes-base.salesforce'), 'NO_SALESFORCE_WRITE_NODE', 'No Salesforce write node in synthetic Gate 2.');
check(!main.nodes.some(n => n.credentials), 'NO_EMBEDDED_CREDENTIALS', 'No credential references in public workflow.');

const allNames = new Set(main.nodes.map(n => n.name));
for (const [source, outputs] of Object.entries(main.connections)) {
  check(allNames.has(source), `CONNECTION_SOURCE_${source}`, source);
  for (const lane of outputs.main ?? []) for (const target of lane) check(allNames.has(target.node), `CONNECTION_TARGET_${target.node}`, target.node);
}

let item = { json: {} };
const fakeCustomData = {};
for (const node of main.nodes.filter(n => n.type === 'n8n-nodes-base.code')) {
  const sandbox = {
    $input: { first: () => item },
    $execution: { customData: { set: (k, v) => { fakeCustomData[k] = v; } } },
    Date,
    JSON,
    Map,
    Set,
    Math,
    Number,
    String,
    Boolean,
    Error
  };
  const result = await new vm.Script(`(async()=>{${node.parameters.jsCode}\n})()`).runInNewContext(sandbox);
  if (!Array.isArray(result) || !result[0]?.json) throw new Error(`Node did not return an n8n item: ${node.name}`);
  item = result[0];
}
const state = item.json;
check(fakeCustomData.correlationId === state.envelope.runMetadata.correlationId, 'CUSTOM_DATA_CORRELATION_ID', 'Execution customData carries correlationId for the error workflow.');
check(fakeCustomData.promiseId === state.envelope.runMetadata.promiseId, 'CUSTOM_DATA_PROMISE_ID', 'Execution customData carries promiseId for the error workflow.');
check(fakeCustomData.accountKey === state.envelope.runMetadata.accountKey, 'CUSTOM_DATA_ACCOUNT_KEY', 'Execution customData carries accountKey for the error workflow.');
check(state.executiveHtml.includes('PROMISE CLOSED'), 'RUNTIME_REPORT_CLOSURE_BANNER', 'Executive HTML visibly states closure status.');
check(state.runtime.finalRoute === 'CLOSE', 'RUNTIME_FINAL_ROUTE', state.runtime.finalRoute);
check(state.envelope.runMetadata.executionStatus === 'CLOSED', 'RUNTIME_EXECUTION_STATUS', state.envelope.runMetadata.executionStatus);
check(state.runtime.calculated.priority === 20, 'RUNTIME_PRIORITY', `${state.runtime.calculated.priority}/25`);
check(state.runtime.calculated.confidence === 98, 'RUNTIME_CONFIDENCE', `${state.runtime.calculated.confidence}/100`);
check(state.runtime.technicalAccessVerified === true, 'RUNTIME_TECHNICAL_VERIFICATION', 'Technical access independently checked.');
check(state.runtime.customerUseVerified === true, 'RUNTIME_CUSTOMER_VERIFICATION', 'Customer use independently checked.');
check(state.executiveHtml.includes('SYNTHETIC DEMONSTRATION'), 'RUNTIME_REPORT_LABEL', 'Executive HTML is visibly synthetic.');

// Regression test for a real finding from live n8n testing (2026-08-04): n8n's
// Error Trigger does NOT forward $execution.customData to the bound error
// workflow, even though the Code node API to set it succeeds. The fix is to
// embed correlationId/promiseId/accountKey directly in the thrown error
// message, since that field is reliably forwarded. This test deliberately
// runs a broken node WITHOUT any $execution global available at all -
// matching what real n8n's Error Trigger actually receives - and confirms
// the thrown message still carries the context tag the error handler parses.
{
  const node04 = main.nodes.find(n => n.name === '04 Validate Canonical Intake');
  const brokenCode = node04.parameters.jsCode.replace(
    "const required = ['schemaVersion',",
    "const required = ['__FORCE_LIVE_N8N_REGRESSION_TEST__','schemaVersion',"
  );
  const sandboxNoExecution = {
    $input: { first: () => ({ json: state }) },
    Date, JSON, Map, Set, Math, Number, String, Boolean, Error
  };
  let thrownMessage = null;
  try {
    await new vm.Script(`(async()=>{${brokenCode}\n})()`).runInNewContext(sandboxNoExecution);
  } catch (e) {
    thrownMessage = e.message;
  }
  const m = state.envelope.runMetadata;
  const expectedTag = `[correlationId=${m.correlationId}|promiseId=${m.promiseId}|accountKey=${m.accountKey}]`;
  check(
    Boolean(thrownMessage) && thrownMessage.includes(expectedTag),
    'ERROR_MESSAGE_CARRIES_CORRELATION_CONTEXT',
    `Thrown message without $execution available: ${thrownMessage}`
  );
}

const failures = checks.filter(x => x.status === 'FAIL');
const report = {
  generatedAt: new Date().toISOString(),
  gate: 'GATE_2',
  workflowVersion: '0.2.0-gate2',
  summary: { total: checks.length, passed: checks.length - failures.length, failed: failures.length },
  runtime: {
    finalRoute: state.runtime.finalRoute,
    executionStatus: state.envelope.runMetadata.executionStatus,
    checkpoints: state.runtime.checkpoints,
    policyDecisions: state.runtime.policyDecisions,
    calculated: state.runtime.calculated,
    outcome: state.runtime.outcome
  },
  checks
};
if (writeReport) {
  fs.mkdirSync(path.join(root, 'validation'), { recursive: true });
  fs.writeFileSync(path.join(root, 'validation', 'gate2-validation-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  fs.mkdirSync(path.join(root, 'reports'), { recursive: true });
  fs.writeFileSync(path.join(root, 'reports', 'Vantix-Control-Value-Executive-Report-SYNTHETIC.html'), state.executiveHtml);
}
console.log(JSON.stringify(report.summary));
if (failures.length) process.exitCode = 1;
