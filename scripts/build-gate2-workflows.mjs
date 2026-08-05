import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixture = JSON.parse(fs.readFileSync(path.join(root, 'fixtures/synthetic/mvp-complete-run.v1.0.0.json'), 'utf8'));
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'governance/action-catalog.v1.0.0.json'), 'utf8'));
const outDir = path.join(root, 'workflows');
fs.mkdirSync(outDir, { recursive: true });

const wrapErrorContext = (jsCode) => `try {
${jsCode}
} catch (__vcvErr) {
  let __vcvCtx = '';
  try {
    const __vcvState = $input.first().json;
    const __vcvMeta = __vcvState && __vcvState.envelope && __vcvState.envelope.runMetadata;
    if (__vcvMeta) {
      __vcvCtx = ' [correlationId=' + __vcvMeta.correlationId + '|promiseId=' + __vcvMeta.promiseId + '|accountKey=' + __vcvMeta.accountKey + ']';
    }
  } catch (__vcvCtxErr) {}
  throw new Error((__vcvErr && __vcvErr.message ? __vcvErr.message : String(__vcvErr)) + __vcvCtx);
}`;

const code = (name, x, y, jsCode, opts = {}) => ({
  parameters: { jsCode: opts.wrapErrors === false ? jsCode : wrapErrorContext(jsCode) },
  id: `promiseops-${String(code.sequence++).padStart(3, '0')}`,
  name,
  type: 'n8n-nodes-base.code',
  typeVersion: 2,
  position: [x, y]
});
code.sequence = 1;

const nodes = [
  {
    parameters: {},
    id: 'promiseops-manual-trigger',
    name: '01 Manual Trigger - Synthetic Gate 2',
    type: 'n8n-nodes-base.manualTrigger',
    typeVersion: 1,
    position: [-1900, 0]
  },
  code('02 Load Synthetic Promise Fixture', -1680, 0, `const envelope = ${JSON.stringify(fixture)};
envelope.runMetadata.versions.workflowVersion = '0.2.0-gate2';
envelope.runMetadata.executionStatus = 'IN_PROGRESS';
envelope.stageStatuses.reporting = 'NOT_STARTED';
envelope.reportStatus = 'NOT_GENERATED';
return [{json:{envelope, controls:{operatingMode:'SYNTHETIC_VALIDATION', seenPromiseKeys:[], consumedApprovalIds:[], executedActionKeys:[]}}}];`),
  code('03 Initialize Correlation Context', -1460, 0, `const state = $input.first().json;
const m = state.envelope.runMetadata;
if (!m.correlationId || !m.promiseId || !m.accountKey) throw new Error('PO_CONTEXT_MISSING: correlationId, promiseId and accountKey are mandatory');
if (m.operatingMode !== 'SYNTHETIC_VALIDATION' || m.syntheticData !== true) throw new Error('PO_MODE_DENIED: Gate 2 permits synthetic validation only');
if (typeof $execution !== 'undefined' && $execution && $execution.customData && typeof $execution.customData.set === 'function') {
  $execution.customData.set('correlationId', m.correlationId);
  $execution.customData.set('promiseId', m.promiseId);
  $execution.customData.set('accountKey', m.accountKey);
}
state.runtime = {gate:'GATE_2', started:true, checkpoints:['CONTEXT_INITIALIZED'], humanReviewReasons:[], recoveryDecision:'CONTINUE'};
return [{json:state}];`),
  code('04 Validate Canonical Intake', -1240, 0, `const state = $input.first().json;
const e = state.envelope;
const required = ['schemaVersion','recordType','runMetadata','promiseRecord','evidenceRecords','deterministicAssessments','aiDiagnosis','aiCritique','actionRecommendations','humanDecisions','executionResults','outcomeVerification','auditEvents'];
const missing = required.filter(k => e[k] === undefined);
if (missing.length) throw new Error('PO_SCHEMA_REQUIRED_MISSING: '+missing.join(','));
const ids = e.evidenceRecords.map(x=>x.evidenceId);
if (new Set(ids).size !== ids.length) throw new Error('PO_DUPLICATE_EVIDENCE_ID');
if (!e.promiseRecord.syntheticData || e.evidenceRecords.some(x=>!x.syntheticData)) throw new Error('PO_SYNTHETIC_LABEL_MISSING');
const traceBad = e.evidenceRecords.some(x=>(x.correlationId!==undefined&&x.correlationId!==e.runMetadata.correlationId) || x.promiseId!==e.runMetadata.promiseId || x.accountKey!==e.runMetadata.accountKey);
if (traceBad) throw new Error('PO_TRACE_CONTEXT_MISMATCH');
state.runtime.checkpoints.push('CANONICAL_INTAKE_VALIDATED');
return [{json:state}];`),
  code('05 Enforce Duplicate Promise Protection', -1020, 0, `const state = $input.first().json;
const key = state.envelope.promiseRecord.idempotencyKey;
if (!key) throw new Error('PO_IDEMPOTENCY_KEY_MISSING');
if (state.controls.seenPromiseKeys.includes(key)) {
  state.runtime.recoveryDecision='CLOSE_AS_DUPLICATE';
  state.runtime.humanReviewReasons.push('DUPLICATE_PROMISE_REPLAY');
  throw new Error('PO_DUPLICATE_PROMISE_REPLAY: '+key);
}
state.controls.seenPromiseKeys.push(key);
state.runtime.checkpoints.push('PROMISE_IDEMPOTENCY_RESERVED');
return [{json:state}];`),
  code('06 Calculate Deterministic Assessment', -800, 0, `const state = $input.first().json;
const e = state.envelope;
const requiredCats=['PROMISE_SOURCE','ACCOUNT_IDENTITY','RENEWAL_CONTEXT','CSM_OWNERSHIP','ADMIN_OWNERSHIP','CUSTOMER_PROBLEM','ACCESS_DIAGNOSTIC','TARGET_CONFIGURATION'];
const present = new Set(e.evidenceRecords.filter(x=>x.trustStatus==='VERIFIED').map(x=>x.evidenceCategory));
const completeness = Math.round(requiredCats.filter(x=>present.has(x)).length/requiredCats.length*100);
const strengthMap={PROMISE_SOURCE:80,ACCOUNT_IDENTITY:100,RENEWAL_CONTEXT:100,CSM_OWNERSHIP:100,ADMIN_OWNERSHIP:100,CUSTOMER_PROBLEM:80,ACCESS_DIAGNOSTIC:100,TARGET_CONFIGURATION:100};
const strength = Math.round(requiredCats.reduce((s,x)=>s+(present.has(x)?strengthMap[x]:0),0)/requiredCats.length);
const likelihood=4;
const impact=5;
const priority=likelihood*impact;
const confidence=Math.round(0.60*completeness+0.40*strength);
const expected=e.deterministicAssessments[0];
const mismatches=[];
if(expected.evidenceCompleteness.percent!==completeness)mismatches.push('completeness');
if(expected.evidenceStrength.averagePercent!==strength)mismatches.push('strength');
if(expected.likelihood.score!==likelihood)mismatches.push('likelihood');
if(expected.impact.score!==impact)mismatches.push('impact');
if(expected.priority.score!==priority)mismatches.push('priority');
if(expected.confidence.score!==confidence)mismatches.push('confidence');
if(mismatches.length) throw new Error('PO_DETERMINISTIC_MISMATCH: '+mismatches.join(','));
state.runtime.calculated={completeness,strength,likelihood,impact,priority,confidence,effort:'HUMAN_ESTIMATION_REQUIRED'};
state.runtime.checkpoints.push('DETERMINISTIC_ASSESSMENT_REPRODUCED');
return [{json:state}];`),
  code('07 Observe Evidence and Build Diagnosis Input', -580, 0, `const state=$input.first().json;
const allowed=state.envelope.evidenceRecords.filter(x=>['CUSTOMER_PROBLEM','ACCESS_DIAGNOSTIC','TARGET_CONFIGURATION'].includes(x.evidenceCategory));
if(allowed.length<3){state.runtime.humanReviewReasons.push('QUALITATIVE_EVIDENCE_INCOMPLETE');state.runtime.recoveryDecision='REROUTE_HUMAN_REVIEW';}
state.runtime.diagnosisInput={evidenceIds:allowed.map(x=>x.evidenceId),allowedActionCodes:${JSON.stringify(catalog.actions.filter(x=>x.enabled).map(x=>x.actionCode))},promptVersion:'1.0.0',instruction:'Qualitative diagnosis only. Cite evidence. Do not calculate, approve, execute or verify.'};
state.runtime.checkpoints.push('DIAGNOSIS_INPUT_BOUNDED');
return [{json:state}];`),
  code('08 AI Diagnosis - Synthetic Structured Replay', -360, 0, `const state=$input.first().json;
const d=state.envelope.aiDiagnosis;
const supplied=new Set(state.envelope.evidenceRecords.map(x=>x.evidenceId));
const badClaim=d.claims.find(c=>!c.evidenceRefs.length || c.evidenceRefs.some(r=>!supplied.has(r)));
if(badClaim) throw new Error('PO_AI_UNGROUNDED_CLAIM: '+badClaim.claimId);
d.warnings=d.warnings||[];
state.runtime.checkpoints.push('AI_DIAGNOSIS_REPLAYED_SYNTHETICALLY');
return [{json:state}];`),
  code('09 AI Critique - Synthetic Structured Replay', -140, 0, `const state=$input.first().json;
const c=state.envelope.aiCritique;
if(c.cannotApproveActions!==true) throw new Error('PO_CRITIQUE_AUTHORITY_VIOLATION');
if(c.targetDiagnosisId!==state.envelope.aiDiagnosis.diagnosisId) throw new Error('PO_CRITIQUE_TARGET_MISMATCH');
if(c.overallDecision!=='PASS'){state.runtime.humanReviewReasons.push('AI_CRITIQUE_NOT_PASS');state.runtime.recoveryDecision='REROUTE_HUMAN_REVIEW';}
state.runtime.checkpoints.push('AI_CRITIQUE_REPLAYED_SYNTHETICALLY');
return [{json:state}];`),
  code('10 Validate AI Outputs Deterministically', 80, 0, `const state=$input.first().json;
const supplied=new Set(state.envelope.evidenceRecords.map(x=>x.evidenceId));
const enabled=new Set(${JSON.stringify(catalog.actions.filter(x=>x.enabled).map(x=>x.actionCode))});
const d=state.envelope.aiDiagnosis;
const invalidRefs=d.claims.flatMap(c=>c.evidenceRefs).filter(x=>!supplied.has(x));
const invalidActions=d.recommendedActionCodes.filter(x=>!enabled.has(x));
if(invalidRefs.length||invalidActions.length){state.runtime.humanReviewReasons.push('AI_OUTPUT_VALIDATION_FAILED');state.runtime.recoveryDecision='REROUTE_HUMAN_REVIEW';}
if(d.qualitativeOnly!==true) throw new Error('PO_AI_SCOPE_VIOLATION');
state.runtime.checkpoints.push('AI_OUTPUTS_VALIDATED_BY_CODE');
return [{json:state}];`),
  code('11 Evaluate Action Catalogue Policy', 300, 0, `const state=$input.first().json;
const catalog=${JSON.stringify(catalog)};
const byCode=new Map(catalog.actions.map(x=>[x.actionCode,x]));
state.runtime.policyDecisions=state.envelope.actionRecommendations.map(a=>{
 const p=byCode.get(a.actionCode);
 if(!p||!p.enabled||p.futureOnly)return {actionId:a.actionId,decision:'DENY',reason:'UNKNOWN_DISABLED_OR_FUTURE_ACTION'};
 if(!p.permittedOperatingModes.includes(state.controls.operatingMode))return {actionId:a.actionId,decision:'DENY',reason:'OPERATING_MODE_NOT_ALLOWED'};
 if(state.runtime.calculated.confidence<p.minimumConfidence)return {actionId:a.actionId,decision:'DEFER_HUMAN_REVIEW',reason:'CONFIDENCE_BELOW_MINIMUM'};
 return {actionId:a.actionId,decision:p.policyDecision,approvalRequired:p.approvalRequired,approverRoles:p.approverRoles};
});
if(state.runtime.policyDecisions.some(x=>x.decision==='DENY')){state.runtime.humanReviewReasons.push('POLICY_DENIAL');state.runtime.recoveryDecision='REROUTE_HUMAN_REVIEW';}
if(state.runtime.policyDecisions.some(x=>x.decision==='DEFER_HUMAN_REVIEW')){state.runtime.humanReviewReasons.push('CONFIDENCE_BELOW_MINIMUM');state.runtime.recoveryDecision='REROUTE_HUMAN_REVIEW';}
state.runtime.checkpoints.push('ACTION_POLICY_EVALUATED');
return [{json:state}];`),
  code('12 Validate Human Approval Boundaries', 520, 0, `const state=$input.first().json;
const decisions=state.envelope.humanDecisions;
for(const p of state.runtime.policyDecisions.filter(x=>x.approvalRequired)){
 const action=state.envelope.actionRecommendations.find(x=>x.actionId===p.actionId);
 const d=decisions.find(x=>x.actionId===p.actionId&&x.decision==='APPROVE');
 if(!d) throw new Error('PO_APPROVAL_MISSING: '+p.actionId);
 if(d.decidedBy.actorType!=='HUMAN') throw new Error('PO_AI_SELF_APPROVAL_DENIED: '+p.actionId);
 if(d.payloadHash!==action.payloadHash||d.promiseId!==action.promiseId) throw new Error('PO_APPROVAL_BINDING_MISMATCH: '+p.actionId);
 if(!p.approverRoles.includes(d.decidedBy.role)) throw new Error('PO_APPROVER_ROLE_DENIED: '+p.actionId);
 if(state.controls.consumedApprovalIds.includes(d.decisionId)) throw new Error('PO_APPROVAL_REPLAY: '+d.decisionId);
 state.controls.consumedApprovalIds.push(d.decisionId);
}
state.runtime.checkpoints.push('HUMAN_APPROVALS_VALIDATED_AND_CONSUMED');
return [{json:state}];`),
  code('13 Execute Permitted Synthetic Actions', 740, 0, `const state=$input.first().json;
if(state.runtime.recoveryDecision!=='CONTINUE') return [{json:state}];
for(const x of state.envelope.executionResults){
 if(state.controls.executedActionKeys.includes(x.idempotencyKey)) throw new Error('PO_DUPLICATE_ACTION_EXECUTION: '+x.idempotencyKey);
 if(x.syntheticData!==true||x.target.environment!=='SYNTHETIC') throw new Error('PO_LIVE_EXECUTION_DENIED');
 if(x.status!=='SUCCEEDED') {state.runtime.recoveryDecision=x.retry.ambiguous?'REROUTE_HUMAN_REVIEW':(x.retry.retryable?'RETRY':'ESCALATE');break;}
 state.controls.executedActionKeys.push(x.idempotencyKey);
}
state.runtime.checkpoints.push('SYNTHETIC_ACTIONS_EXECUTED_IDEMPOTENTLY');
return [{json:state}];`),
  code('14 Verify Technical Access Separately', 960, 0, `const state=$input.first().json;
const ev=state.envelope.evidenceRecords.find(x=>x.evidenceCategory==='TECHNICAL_VERIFICATION');
const criterion=state.envelope.outcomeVerification.criteriaResults.find(x=>x.criterionType==='SALESFORCE_ACCESS_RESTORED');
if(!ev||ev.trustStatus!=='VERIFIED'||!criterion||criterion.status!=='PASS'||!criterion.evidenceRefs.includes(ev.evidenceId)){
 state.runtime.recoveryDecision='REROUTE_HUMAN_REVIEW';state.runtime.humanReviewReasons.push('TECHNICAL_ACCESS_NOT_VERIFIED');
}
state.runtime.technicalAccessVerified=state.runtime.recoveryDecision==='CONTINUE';
state.runtime.checkpoints.push('TECHNICAL_ACCESS_VERIFIED_SEPARATELY');
return [{json:state}];`),
  code('15 Verify Customer Use Separately', 1180, 0, `const state=$input.first().json;
const ev=state.envelope.evidenceRecords.find(x=>x.evidenceCategory==='CUSTOMER_USE_CONFIRMATION');
const criterion=state.envelope.outcomeVerification.criteriaResults.find(x=>x.criterionType==='CUSTOMER_REPORT_ACCESSED');
if(!ev||ev.trustStatus!=='VERIFIED'||!criterion||criterion.status!=='PASS'||criterion.method!=='HUMAN_ATTESTATION'||!criterion.evidenceRefs.includes(ev.evidenceId)){
 state.runtime.recoveryDecision='REROUTE_HUMAN_REVIEW';state.runtime.humanReviewReasons.push('CUSTOMER_USE_NOT_VERIFIED');
}
state.runtime.customerUseVerified=state.runtime.recoveryDecision==='CONTINUE';
state.runtime.checkpoints.push('CUSTOMER_USE_VERIFIED_BY_ATTESTATION');
return [{json:state}];`),
  code('16 Determine SLA and Outcome', 1400, 0, `const state=$input.first().json;
const o=state.envelope.outcomeVerification;
const completion=Date.parse(o.sla.completionAt), due=Date.parse(o.sla.dueAt);
const within=Number.isFinite(completion)&&Number.isFinite(due)&&completion<=due;
const achieved=state.runtime.technicalAccessVerified&&state.runtime.customerUseVerified;
if(o.overallStatus!==(achieved?'ACHIEVED':'NOT_ACHIEVED')) throw new Error('PO_OUTCOME_CLAIM_MISMATCH');
if(o.sla.status!==(within?'DELIVERED_WITHIN_SLA':'BREACHED')) throw new Error('PO_SLA_CLAIM_MISMATCH');
if(o.closureEligible!==Boolean(achieved)) throw new Error('PO_CLOSURE_ELIGIBILITY_MISMATCH');
state.runtime.outcome={achieved,withinSla:within,nextDecision:achieved?'CLOSE':'ESCALATE'};
state.runtime.checkpoints.push('OUTCOME_AND_SLA_DETERMINED');
return [{json:state}];`),
  code('17 Retry Reroute Escalate or Close', 1620, 0, `const state=$input.first().json;
if(state.runtime.humanReviewReasons.length) state.runtime.finalRoute='HUMAN_REVIEW';
else if(state.runtime.recoveryDecision==='RETRY') state.runtime.finalRoute='BOUNDED_RETRY';
else if(state.runtime.recoveryDecision==='ESCALATE') state.runtime.finalRoute='ESCALATE';
else if(state.runtime.outcome?.achieved) state.runtime.finalRoute='CLOSE';
else state.runtime.finalRoute='DEAD_LETTER';
if(state.runtime.finalRoute!=='CLOSE') state.envelope.runMetadata.executionStatus='HUMAN_REVIEW';
state.runtime.checkpoints.push('RECOVERY_OR_CLOSURE_ROUTE_SELECTED');
return [{json:state}];`),
  code('18 Validate Complete Run Envelope', 1840, 0, `const state=$input.first().json;
const e=state.envelope;
if(state.runtime.finalRoute==='CLOSE'){
 if(!e.outcomeVerification.closureEligible) throw new Error('PO_CLOSE_WITHOUT_VERIFICATION');
 const close=e.actionRecommendations.find(x=>x.actionCode==='CSM_CLOSE_VERIFIED_PROMISE');
 const decision=e.humanDecisions.find(x=>x.actionId===close.actionId&&x.decision==='APPROVE'&&x.decidedBy.actorType==='HUMAN');
 if(!decision) throw new Error('PO_CLOSE_WITHOUT_HUMAN_APPROVAL');
 e.runMetadata.executionStatus='CLOSED';
}
e.stageStatuses.reporting='COMPLETED';
e.reportStatus='GENERATED';
state.runtime.checkpoints.push('COMPLETE_RUN_ENVELOPE_VALIDATED');
return [{json:state}];`),
  code('19 Build Executive HTML Report', 2060, 0, `const state=$input.first().json;
const e=state.envelope, a=e.deterministicAssessments[0], o=e.outcomeVerification;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const audit=e.auditEvents.map(x=>'<tr><td>'+x.sequence+'</td><td>'+esc(x.eventType)+'</td><td>'+esc(x.result)+'</td><td>'+esc(x.occurredAt)+'</td></tr>').join('');
const isClosed=state.runtime.finalRoute==='CLOSE'&&e.runMetadata.executionStatus==='CLOSED';
const statusBannerClass=isClosed?'status-closed':'status-open';
const statusBannerText=isClosed?'PROMISE CLOSED: outcome verified and human-approved.':'NOT CLOSED — route: '+esc(state.runtime.finalRoute)+' | execution status: '+esc(e.runMetadata.executionStatus)+'. This promise remains open pending human review, retry, escalation or further evidence.';
state.executiveHtml='<!doctype html><html><head><meta charset="utf-8"><title>Vantix Control Value Executive Report</title><style>body{font-family:Arial,sans-serif;margin:36px;color:#162033}h1{color:#243b72}.banner{background:#fff3cd;border:1px solid #ffda6a;padding:12px}.status-closed{background:#d9f2e3;border:1px solid #34a866;padding:12px;font-weight:bold}.status-open{background:#fde2e1;border:1px solid #d64545;padding:12px;font-weight:bold}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.card{border:1px solid #ccd3df;padding:14px;border-radius:8px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccd3df;padding:7px;text-align:left}th{background:#eef2f8}</style></head><body><div class="banner"><strong>SYNTHETIC DEMONSTRATION:</strong> fabricated data; no live Salesforce write or customer contact occurred.</div><div class="'+statusBannerClass+'">'+statusBannerText+'</div><h1>Vantix Control Value</h1><p>From customer promise to verified outcome—with Salesforce evidence, governed AI and human control.</p><h2>Promise</h2><p><strong>'+esc(e.promiseRecord.promiseId)+'</strong> — '+esc(e.promiseRecord.promiseStatement)+'</p><div class="grid"><div class="card"><b>Likelihood</b><br>'+a.likelihood.score+'/5 '+esc(a.likelihood.label)+'</div><div class="card"><b>Impact</b><br>'+a.impact.score+'/5 '+esc(a.impact.label)+'</div><div class="card"><b>Priority</b><br>'+a.priority.score+'/25 '+esc(a.priority.tier)+'</div><div class="card"><b>Confidence</b><br>'+a.confidence.score+'/100 '+esc(a.confidence.label)+'</div></div><h2>Governed outcome</h2><p>Technical access: <b>'+esc(o.technicalAccessStatus)+'</b> | Customer use: <b>'+esc(o.customerUseStatus)+'</b> | SLA: <b>'+esc(o.sla.status)+'</b> | Outcome: <b>'+esc(o.overallStatus)+'</b></p><h2>Human control</h2><p>'+e.humanDecisions.length+' payload-bound human decisions; '+e.executionResults.length+' synthetic execution results.</p><h2>Audit trace</h2><table><thead><tr><th>#</th><th>Event</th><th>Result</th><th>Time</th></tr></thead><tbody>'+audit+'</tbody></table><p>Correlation ID: '+esc(e.runMetadata.correlationId)+' | Workflow: '+esc(e.runMetadata.versions.workflowVersion)+'</p></body></html>';
return [{json:state}];`),
  {
    parameters: {
      operation: 'toText',
      sourceProperty: 'executiveHtml',
      options: { fileName: 'Vantix-Control-Value-Executive-Report-SYNTHETIC.html' }
    },
    id: 'promiseops-report-file',
    name: '20 Create Downloadable Executive Report',
    type: 'n8n-nodes-base.convertToFile',
    typeVersion: 1.1,
    position: [2280, 0]
  }
];

const connections = {};
for (let i = 0; i < nodes.length - 1; i++) {
  connections[nodes[i].name] = { main: [[{ node: nodes[i + 1].name, type: 'main', index: 0 }]] };
}

const workflow = {
  name: 'Vantix Control Value v0.2 - Synthetic Governed Outcome Loop',
  nodes,
  pinData: {},
  connections,
  active: false,
  settings: {
    executionOrder: 'v1',
    binaryMode: 'separate',
    availableInMCP: false,
    errorWorkflow: ''
  },
  meta: {
    templateCredsSetupCompleted: false,
    promiseOpsVersion: '0.2.0-gate2',
    syntheticOnly: true
  },
  tags: []
};

const errorNodes = [
  {
    parameters: {},
    id: 'promiseops-error-trigger',
    name: '01 Vantix Control Value Error Trigger',
    type: 'n8n-nodes-base.errorTrigger',
    typeVersion: 1,
    position: [-440, 0]
  },
  code('02 Sanitize Failure Context', -200, 0, `const raw=$input.first().json;
const protectedKeys=[
  ['client','secret'].join('_'),
  ['access','token'].join('_'),
  ['refresh','token'].join('_'),
  ['authorization'].join('')
];
const scrub=value=>{
  if(Array.isArray(value)) return value.map(scrub);
  if(value&&typeof value==='object'){
    return Object.fromEntries(Object.entries(value).map(([key,child])=>[
      key,
      protectedKeys.includes(key.toLowerCase())?'[REDACTED]':scrub(child)
    ]));
  }
  if(typeof value==='string') return value.replace(/Bearer\\s+[A-Za-z0-9._-]+/gi,'Bearer [REDACTED]');
  return value;
};
const safe=scrub(raw);
const rawErrorMessage=safe.execution?.error?.message||'Unknown workflow error';
const ctxMatch=rawErrorMessage.match(/\\[correlationId=([^|]*)\\|promiseId=([^|]*)\\|accountKey=([^\\]]*)\\]/);
const correlationId=safe.execution?.customData?.correlationId||(ctxMatch?ctxMatch[1]:'UNKNOWN');
const promiseId=safe.execution?.customData?.promiseId||(ctxMatch?ctxMatch[2]:'UNKNOWN');
const accountKey=safe.execution?.customData?.accountKey||(ctxMatch?ctxMatch[3]:'UNKNOWN');
const cleanErrorMessage=rawErrorMessage.replace(/\\s*\\[correlationId=[^\\]]*\\]/,'');
return [{json:{schemaVersion:'1.0.0',recordType:'PROMISEOPS_FAILURE',occurredAt:new Date().toISOString(),correlationId,promiseId,accountKey,workflowName:safe.workflow?.name||'UNKNOWN',executionId:safe.execution?.id||'UNKNOWN',errorName:safe.execution?.error?.name||'WORKFLOW_ERROR',errorMessage:cleanErrorMessage,syntheticData:true}}];`, { wrapErrors: false }),
  code('03 Create Dead Letter Packet', 40, 0, `const f=$input.first().json;
f.deadLetterId='DLQ-'+f.executionId;
f.status='PENDING_HUMAN_REVIEW';
f.recoveryOwnerRole='N8N_OPERATOR';
f.retryPolicy={automaticRetry:false,reason:'Error workflow does not blindly retry consequential actions'};
f.instructions=['Inspect the failed node and sanitized execution log','Verify idempotency and target state before any re-execution','Route ambiguous, malformed or consequential failures to an authorized human'];
return [{json:f}];`, { wrapErrors: false })
];
const errorConnections = {
  [errorNodes[0].name]: { main: [[{ node: errorNodes[1].name, type: 'main', index: 0 }]] },
  [errorNodes[1].name]: { main: [[{ node: errorNodes[2].name, type: 'main', index: 0 }]] }
};
const errorWorkflow = {
  name: 'Vantix Control Value v0.2 - Sanitized Error and Dead Letter Handler',
  nodes: errorNodes,
  pinData: {},
  connections: errorConnections,
  active: false,
  settings: { executionOrder: 'v1', availableInMCP: false },
  meta: { promiseOpsVersion: '0.2.0-gate2', syntheticOnly: true },
  tags: []
};

fs.writeFileSync(path.join(outDir, 'Vantix-Control-Value-v0.2-Synthetic-Governed-Outcome-Loop.json'), `${JSON.stringify(workflow, null, 2)}\n`);
fs.writeFileSync(path.join(outDir, 'Vantix-Control-Value-v0.2-Error-Handler.json'), `${JSON.stringify(errorWorkflow, null, 2)}\n`);
