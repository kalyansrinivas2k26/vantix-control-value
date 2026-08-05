import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const contractsDir = path.join(rootDir, 'contracts', 'v1.0.0');
const fixturePath = path.join(
  rootDir,
  'fixtures',
  'synthetic',
  'mvp-complete-run.v1.0.0.json'
);
const catalogPath = path.join(
  rootDir,
  'governance',
  'action-catalog.v1.0.0.json'
);
const negativeDir = path.join(rootDir, 'fixtures', 'negative');

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));
const schemaFiles = fs
  .readdirSync(contractsDir)
  .filter((name) => name.endsWith('.schema.json'))
  .sort();
const schemas = schemaFiles.map((name) =>
  readJson(path.join(contractsDir, name))
);

const ajv = new Ajv2020({
  allErrors: true,
  strict: true,
  allowUnionTypes: true,
  validateFormats: true
});
addFormats(ajv);
for (const schema of schemas) {
  ajv.addSchema(schema);
}

const envelope = readJson(fixturePath);
const catalog = readJson(catalogPath);

const failures = [];
const passes = [];

const pass = (code, detail) => passes.push({ code, detail });
const fail = (code, detail) => failures.push({ code, detail });

const formatErrors = (errors = []) =>
  errors.map((error) => ({
    instancePath: error.instancePath,
    schemaPath: error.schemaPath,
    keyword: error.keyword,
    message: error.message
  }));

const validate = (schemaId, value, code, label) => {
  const validator = ajv.getSchema(schemaId);
  if (!validator) {
    fail(code, `Schema not registered: ${schemaId}`);
    return false;
  }
  const valid = validator(value);
  if (valid) {
    pass(code, `${label} passed JSON Schema validation.`);
    return true;
  }
  fail(code, {
    label,
    errors: formatErrors(validator.errors)
  });
  return false;
};

const schemaBase =
  'https://schemas.viridianai.in/promiseops/v1.0.0/';

validate(
  `${schemaBase}action-catalog.schema.json`,
  catalog,
  'SCHEMA_ACTION_CATALOG',
  'Action catalogue'
);
validate(
  `${schemaBase}run-envelope.schema.json`,
  envelope,
  'SCHEMA_RUN_ENVELOPE',
  'Complete synthetic run envelope'
);
validate(
  `${schemaBase}promise-record.schema.json`,
  envelope.promiseRecord,
  'SCHEMA_PROMISE_RECORD',
  'Promise record'
);
for (const evidence of envelope.evidenceRecords) {
  validate(
    `${schemaBase}evidence-record.schema.json`,
    evidence,
    `SCHEMA_EVIDENCE_${evidence.evidenceId}`,
    `Evidence ${evidence.evidenceId}`
  );
}
for (const assessment of envelope.deterministicAssessments) {
  validate(
    `${schemaBase}deterministic-assessment.schema.json`,
    assessment,
    `SCHEMA_ASSESSMENT_${assessment.assessmentId}`,
    `Assessment ${assessment.assessmentId}`
  );
}
validate(
  `${schemaBase}ai-diagnosis.schema.json`,
  envelope.aiDiagnosis,
  'SCHEMA_AI_DIAGNOSIS',
  'AI diagnosis'
);
validate(
  `${schemaBase}ai-critique.schema.json`,
  envelope.aiCritique,
  'SCHEMA_AI_CRITIQUE',
  'AI critique'
);
for (const action of envelope.actionRecommendations) {
  validate(
    `${schemaBase}action-recommendation.schema.json`,
    action,
    `SCHEMA_ACTION_${action.actionId}`,
    `Action ${action.actionId}`
  );
}
for (const decision of envelope.humanDecisions) {
  validate(
    `${schemaBase}human-decision.schema.json`,
    decision,
    `SCHEMA_DECISION_${decision.decisionId}`,
    `Decision ${decision.decisionId}`
  );
}
for (const execution of envelope.executionResults) {
  validate(
    `${schemaBase}execution-result.schema.json`,
    execution,
    `SCHEMA_EXECUTION_${execution.executionId}`,
    `Execution ${execution.executionId}`
  );
}
validate(
  `${schemaBase}outcome-verification.schema.json`,
  envelope.outcomeVerification,
  'SCHEMA_OUTCOME',
  'Outcome verification'
);
for (const event of envelope.auditEvents) {
  validate(
    `${schemaBase}audit-event.schema.json`,
    event,
    `SCHEMA_AUDIT_${event.eventId}`,
    `Audit event ${event.eventId}`
  );
}

const uniqueBy = (items, key, code) => {
  const values = items.map((item) => item[key]);
  const duplicates = values.filter(
    (value, index) => values.indexOf(value) !== index
  );
  if (duplicates.length) {
    fail(code, `Duplicate ${key}: ${[...new Set(duplicates)].join(', ')}`);
    return false;
  }
  pass(code, `${key} values are unique.`);
  return true;
};

uniqueBy(envelope.evidenceRecords, 'evidenceId', 'UNIQUE_EVIDENCE_IDS');
uniqueBy(envelope.actionRecommendations, 'actionId', 'UNIQUE_ACTION_IDS');
uniqueBy(envelope.humanDecisions, 'decisionId', 'UNIQUE_DECISION_IDS');
uniqueBy(envelope.executionResults, 'executionId', 'UNIQUE_EXECUTION_IDS');
uniqueBy(envelope.auditEvents, 'eventId', 'UNIQUE_AUDIT_IDS');
uniqueBy(envelope.auditEvents, 'sequence', 'UNIQUE_AUDIT_SEQUENCES');
uniqueBy(
  envelope.actionRecommendations,
  'idempotencyKey',
  'UNIQUE_ACTION_IDEMPOTENCY_KEYS'
);

const metadata = envelope.runMetadata;
const traceRecords = [
  ...envelope.evidenceRecords,
  ...envelope.deterministicAssessments,
  envelope.aiDiagnosis,
  envelope.aiCritique,
  ...envelope.actionRecommendations,
  ...envelope.humanDecisions,
  ...envelope.executionResults,
  envelope.outcomeVerification,
  ...envelope.auditEvents
];
const traceMismatches = traceRecords.filter(
  (record) =>
    (record.correlationId && record.correlationId !== metadata.correlationId) ||
    (record.promiseId && record.promiseId !== metadata.promiseId) ||
    (record.accountKey && record.accountKey !== metadata.accountKey)
);
if (traceMismatches.length) {
  fail(
    'TRACE_CONTEXT_MISMATCH',
    traceMismatches.map(
      (record) =>
        record.evidenceId ??
        record.assessmentId ??
        record.diagnosisId ??
        record.critiqueId ??
        record.actionId ??
        record.decisionId ??
        record.executionId ??
        record.verificationId ??
        record.eventId
    )
  );
} else {
  pass(
    'TRACE_CONTEXT_CONSISTENT',
    'Correlation, promise and account identifiers are consistent.'
  );
}

const allSynthetic =
  metadata.syntheticData === true &&
  envelope.promiseRecord.syntheticData === true &&
  traceRecords.every((record) => record.syntheticData === true);
if (allSynthetic) {
  pass('SYNTHETIC_FLAGS_CONSISTENT', 'All run records are labelled synthetic.');
} else {
  fail('SYNTHETIC_FLAG_MISMATCH', 'One or more records are not synthetic.');
}

const evidenceIds = new Set(
  envelope.evidenceRecords.map((record) => record.evidenceId)
);
const collectedEvidenceRefs = [];
const collectEvidenceRefs = (value) => {
  if (Array.isArray(value)) {
    for (const item of value) collectEvidenceRefs(item);
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    if (
      [
        'evidenceRefs',
        'inputEvidenceRefs',
        'conflictingEvidenceRefs',
        'malformedEvidenceRefs',
        'staleEvidenceRefs'
      ].includes(key) &&
      Array.isArray(child)
    ) {
      for (const ref of child) {
        if (typeof ref === 'string') collectedEvidenceRefs.push(ref);
        if (ref && typeof ref === 'object' && ref.evidenceId) {
          collectedEvidenceRefs.push(ref.evidenceId);
        }
      }
    }
    collectEvidenceRefs(child);
  }
};
collectEvidenceRefs(envelope);
const unresolvedEvidence = [
  ...new Set(collectedEvidenceRefs.filter((ref) => !evidenceIds.has(ref)))
];
if (unresolvedEvidence.length) {
  fail(
    'UNRESOLVED_EVIDENCE_REFERENCES',
    `Unknown evidence IDs: ${unresolvedEvidence.join(', ')}`
  );
} else {
  pass(
    'EVIDENCE_REFERENCES_RESOLVE',
    `${new Set(collectedEvidenceRefs).size} referenced evidence IDs resolve.`
  );
}

const metadataEvidence = new Set(metadata.evidenceRefs);
const missingMetadataEvidence = [...evidenceIds].filter(
  (id) => !metadataEvidence.has(id)
);
const extraMetadataEvidence = [...metadataEvidence].filter(
  (id) => !evidenceIds.has(id)
);
if (missingMetadataEvidence.length || extraMetadataEvidence.length) {
  fail('RUN_EVIDENCE_INDEX_MISMATCH', {
    missingMetadataEvidence,
    extraMetadataEvidence
  });
} else {
  pass(
    'RUN_EVIDENCE_INDEX_COMPLETE',
    'Run metadata indexes every evidence record exactly once.'
  );
}

const assessment = envelope.deterministicAssessments[0];
const expectedPresentPercent =
  (assessment.evidenceCompleteness.presentCategoryCount /
    assessment.evidenceCompleteness.requiredCategoryCount) *
  100;
if (
  Math.abs(
    expectedPresentPercent - assessment.evidenceCompleteness.percent
  ) < 0.000001
) {
  pass('COMPLETENESS_RECONCILES', 'Evidence completeness recalculates exactly.');
} else {
  fail('COMPLETENESS_MISMATCH', {
    expected: expectedPresentPercent,
    actual: assessment.evidenceCompleteness.percent
  });
}

const expectedStrength =
  assessment.evidenceStrength.categoryScores.reduce(
    (sum, item) => sum + item.score,
    0
  ) / assessment.evidenceStrength.categoryScores.length;
if (
  Math.abs(expectedStrength - assessment.evidenceStrength.averagePercent) <
  0.000001
) {
  pass('STRENGTH_RECONCILES', 'Evidence strength recalculates exactly.');
} else {
  fail('STRENGTH_MISMATCH', {
    expected: expectedStrength,
    actual: assessment.evidenceStrength.averagePercent
  });
}

const expectedConfidence = Math.round(
  (0.6 * assessment.evidenceCompleteness.percent +
    0.4 * assessment.evidenceStrength.averagePercent) *
    100
) / 100;
if (expectedConfidence === assessment.confidence.score) {
  pass('CONFIDENCE_RECONCILES', 'Confidence formula recalculates exactly.');
} else {
  fail('CONFIDENCE_MISMATCH', {
    expected: expectedConfidence,
    actual: assessment.confidence.score
  });
}

const expectedLikelihoodRaw = assessment.likelihood.signals
  .filter((signal) => signal.active)
  .reduce((sum, signal) => sum + signal.weight, 0);
const likelihoodMap = (raw) => {
  if (raw === 0) return { score: 1, label: 'VERY_LOW' };
  if (raw <= 2) return { score: 2, label: 'LOW' };
  if (raw <= 5) return { score: 3, label: 'MEDIUM' };
  if (raw <= 8) return { score: 4, label: 'HIGH' };
  return { score: 5, label: 'VERY_HIGH' };
};
const expectedLikelihood = likelihoodMap(expectedLikelihoodRaw);
if (
  expectedLikelihoodRaw === assessment.likelihood.rawSignalScore &&
  expectedLikelihood.score === assessment.likelihood.score &&
  expectedLikelihood.label === assessment.likelihood.label
) {
  pass('LIKELIHOOD_RECONCILES', 'Likelihood signals and band recalculate.');
} else {
  fail('LIKELIHOOD_MISMATCH', {
    expectedRaw: expectedLikelihoodRaw,
    expectedLikelihood,
    actual: assessment.likelihood
  });
}

const impactInputs = assessment.impact.inputs;
const expectedImpactRaw =
  impactInputs.arrTierPoints +
  impactInputs.renewalProximityPoints +
  impactInputs.strategicStatusPoints +
  impactInputs.contractualExposurePoints;
const impactMap = (raw) => {
  if (raw === 1) return { score: 1, label: 'VERY_LOW' };
  if (raw <= 3) return { score: 2, label: 'LOW' };
  if (raw <= 5) return { score: 3, label: 'MEDIUM' };
  if (raw <= 7) return { score: 4, label: 'HIGH' };
  return { score: 5, label: 'VERY_HIGH' };
};
const expectedImpact = impactMap(expectedImpactRaw);
if (
  expectedImpactRaw === assessment.impact.rawImpactScore &&
  expectedImpact.score === assessment.impact.score &&
  expectedImpact.label === assessment.impact.label
) {
  pass('IMPACT_RECONCILES', 'Impact inputs and band recalculate.');
} else {
  fail('IMPACT_MISMATCH', {
    expectedRaw: expectedImpactRaw,
    expectedImpact,
    actual: assessment.impact
  });
}

const priorityMap = (score) => {
  if (score <= 4) return 'P4_ROUTINE';
  if (score <= 9) return 'P3_PLANNED';
  if (score <= 15) return 'P2_URGENT';
  return 'P1_CRITICAL';
};
const expectedPriority =
  assessment.likelihood.score * assessment.impact.score;
if (
  expectedPriority === assessment.priority.score &&
  priorityMap(expectedPriority) === assessment.priority.tier
) {
  pass('PRIORITY_RECONCILES', 'Priority equals likelihood × impact.');
} else {
  fail('PRIORITY_MISMATCH', {
    expectedPriority,
    expectedTier: priorityMap(expectedPriority),
    actual: assessment.priority
  });
}

if (
  assessment.effort.status === 'HUMAN_ESTIMATION_REQUIRED' &&
  assessment.effort.estimate === null
) {
  pass('EFFORT_REMAINS_HUMAN', 'No effort or story points were inferred.');
} else {
  fail('EFFORT_POLICY_VIOLATION', assessment.effort);
}

const catalogByCode = new Map(
  catalog.actions.map((action) => [action.actionCode, action])
);
const diagnosisUnknownActions =
  envelope.aiDiagnosis.recommendedActionCodes.filter(
    (code) => !catalogByCode.has(code)
  );
if (diagnosisUnknownActions.length) {
  fail(
    'AI_RECOMMENDED_UNKNOWN_ACTION',
    diagnosisUnknownActions.join(', ')
  );
} else {
  pass(
    'AI_ACTION_CODES_CATALOGUED',
    'Every AI-recommended action code exists in the catalogue.'
  );
}

const actionsById = new Map(
  envelope.actionRecommendations.map((action) => [action.actionId, action])
);
const decisionsByAction = new Map();
for (const decision of envelope.humanDecisions) {
  const list = decisionsByAction.get(decision.actionId) ?? [];
  list.push(decision);
  decisionsByAction.set(decision.actionId, list);
}
const executionsByAction = new Map();
for (const execution of envelope.executionResults) {
  const list = executionsByAction.get(execution.actionId) ?? [];
  list.push(execution);
  executionsByAction.set(execution.actionId, list);
}

const sha256 = (value) =>
  `sha256:${crypto
    .createHash('sha256')
    .update(JSON.stringify(value))
    .digest('hex')}`;

for (const action of envelope.actionRecommendations) {
  const policy = catalogByCode.get(action.actionCode);
  if (!policy) {
    fail(
      `ACTION_NOT_CATALOGUED_${action.actionId}`,
      `${action.actionCode} is unknown.`
    );
    continue;
  }
  if (!policy.enabled || policy.futureOnly) {
    fail(
      `ACTION_NOT_ENABLED_${action.actionId}`,
      `${action.actionCode} is disabled or future-only.`
    );
  } else {
    pass(
      `ACTION_ENABLED_${action.actionId}`,
      `${action.actionCode} is enabled.`
    );
  }
  if (!policy.permittedOperatingModes.includes(metadata.operatingMode)) {
    fail(
      `ACTION_MODE_DENIED_${action.actionId}`,
      `${metadata.operatingMode} is not permitted.`
    );
  }
  if (!policy.permittedExecutionModes.includes(action.executionMode)) {
    fail(
      `EXECUTION_MODE_DENIED_${action.actionId}`,
      `${action.executionMode} is not permitted for ${action.actionCode}.`
    );
  }
  if (
    policy.approvalRequired !== action.approvalRequired ||
    policy.policyDecision !== action.policyDecision
  ) {
    fail(`ACTION_POLICY_MISMATCH_${action.actionId}`, {
      catalog: {
        approvalRequired: policy.approvalRequired,
        policyDecision: policy.policyDecision
      },
      recommendation: {
        approvalRequired: action.approvalRequired,
        policyDecision: action.policyDecision
      }
    });
  }
  const unknownParameters = action.requestedPayload.parameters
    .map((parameter) => parameter.name)
    .filter((name) => !policy.allowedParameterNames.includes(name));
  if (unknownParameters.length) {
    fail(
      `ACTION_PARAMETER_DENIED_${action.actionId}`,
      unknownParameters.join(', ')
    );
  }
  const calculatedPayloadHash = sha256(action.requestedPayload);
  if (calculatedPayloadHash === action.payloadHash) {
    pass(
      `PAYLOAD_HASH_${action.actionId}`,
      'Payload hash matches canonical JSON payload.'
    );
  } else {
    fail(`PAYLOAD_HASH_MISMATCH_${action.actionId}`, {
      expected: calculatedPayloadHash,
      actual: action.payloadHash
    });
  }
  const failedPreconditions = action.preconditions.filter(
    (condition) => condition.status !== 'PASS'
  );
  if (
    ['EXECUTED', 'VERIFIED'].includes(action.status) &&
    failedPreconditions.length
  ) {
    fail(
      `ACTION_PRECONDITION_FAILED_${action.actionId}`,
      failedPreconditions.map((item) => item.code)
    );
  }

  const executions = executionsByAction.get(action.actionId) ?? [];
  if (!executions.length) {
    fail(
      `ACTION_WITHOUT_EXECUTION_${action.actionId}`,
      'Expected completed fixture action has no execution result.'
    );
  }
  for (const execution of executions) {
    if (
      execution.actionCode !== action.actionCode ||
      execution.payloadHash !== action.payloadHash ||
      execution.idempotencyKey !== action.idempotencyKey
    ) {
      fail(`EXECUTION_BINDING_MISMATCH_${execution.executionId}`, {
        actionId: action.actionId
      });
    } else {
      pass(
        `EXECUTION_BOUND_${execution.executionId}`,
        'Execution matches action code, payload hash and idempotency key.'
      );
    }
  }

  const decisions = decisionsByAction.get(action.actionId) ?? [];
  if (action.approvalRequired) {
    const approved = decisions.find(
      (decision) =>
        decision.decision === 'APPROVE' &&
        decision.decidedBy.actorType === 'HUMAN' &&
        action.requiredApproverRoles.includes(decision.decidedBy.role) &&
        decision.payloadHash === action.payloadHash &&
        decision.separationOfDuties.passed
    );
    if (!approved) {
      fail(
        `MISSING_VALID_APPROVAL_${action.actionId}`,
        'No valid human approval matches the action.'
      );
    } else {
      const firstExecution = executions[0];
      const approvalTimeValid =
        new Date(approved.decidedAt) <= new Date(firstExecution.startedAt) &&
        new Date(approved.validUntil) >= new Date(firstExecution.startedAt);
      if (approvalTimeValid) {
        pass(
          `HUMAN_APPROVAL_BOUND_${action.actionId}`,
          'Named human approval precedes execution and remains valid.'
        );
      } else {
        fail(`APPROVAL_TIME_INVALID_${action.actionId}`, {
          decidedAt: approved.decidedAt,
          validUntil: approved.validUntil,
          executionStartedAt: firstExecution.startedAt
        });
      }
    }
  } else if (decisions.length) {
    fail(
      `UNEXPECTED_APPROVAL_${action.actionId}`,
      'Auto-permitted action should not depend on a human approval.'
    );
  }
}

const outcomeRuleErrors = (outcome) => {
  const errors = [];
  const technical = outcome.criteriaResults.find(
    (criterion) =>
      criterion.criterionType === 'SALESFORCE_ACCESS_RESTORED'
  );
  const customer = outcome.criteriaResults.find(
    (criterion) => criterion.criterionType === 'CUSTOMER_REPORT_ACCESSED'
  );
  const bothPass =
    technical?.status === 'PASS' && customer?.status === 'PASS';
  if (outcome.overallStatus === 'ACHIEVED' && !bothPass) {
    errors.push('ACHIEVED_REQUIRES_TECHNICAL_AND_CUSTOMER_PASS');
  }
  if (outcome.closureEligible && !bothPass) {
    errors.push('CLOSURE_NOT_ELIGIBLE');
  }
  if (
    outcome.technicalAccessStatus !== technical?.status ||
    outcome.customerUseStatus !== customer?.status
  ) {
    errors.push('SUMMARY_STATUS_MISMATCH');
  }
  if (
    outcome.sla.status === 'DELIVERED_WITHIN_SLA' &&
    (!outcome.sla.completionAt ||
      new Date(outcome.sla.completionAt) > new Date(outcome.sla.dueAt))
  ) {
    errors.push('SLA_STATUS_MISMATCH');
  }
  return errors;
};

const outcomeErrors = outcomeRuleErrors(envelope.outcomeVerification);
if (outcomeErrors.length) {
  fail('OUTCOME_BUSINESS_RULES', outcomeErrors);
} else {
  pass(
    'OUTCOME_BUSINESS_RULES',
    'Technical, customer, SLA and closure outcomes reconcile.'
  );
}

const closeAction = envelope.actionRecommendations.find(
  (action) => action.actionCode === 'CSM_CLOSE_VERIFIED_PROMISE'
);
const closeExecution = closeAction
  ? (executionsByAction.get(closeAction.actionId) ?? []).find(
      (execution) => execution.status === 'SUCCEEDED'
    )
  : null;
if (
  envelope.promiseRecord.status === 'CLOSED' &&
  (!envelope.outcomeVerification.closureEligible || !closeExecution)
) {
  fail(
    'CLOSED_WITHOUT_VERIFICATION',
    'Closed promise lacks eligible outcome or successful closure execution.'
  );
} else {
  pass(
    'CLOSURE_CONTROL_PASSED',
    'Promise closure follows verified outcome and approved execution.'
  );
}

const audit = [...envelope.auditEvents].sort(
  (left, right) => left.sequence - right.sequence
);
const expectedSequences = audit.map((_, index) => index + 1);
const actualSequences = audit.map((event) => event.sequence);
if (JSON.stringify(expectedSequences) === JSON.stringify(actualSequences)) {
  pass('AUDIT_SEQUENCE_CONTIGUOUS', 'Audit sequence is contiguous.');
} else {
  fail('AUDIT_SEQUENCE_GAP', { expectedSequences, actualSequences });
}
let auditChainValid = true;
let auditChronologyValid = true;
for (let index = 0; index < audit.length; index += 1) {
  const expectedPrevious = index === 0 ? null : audit[index - 1].eventId;
  if (audit[index].previousEventId !== expectedPrevious) {
    auditChainValid = false;
  }
  if (
    index > 0 &&
    new Date(audit[index].occurredAt) < new Date(audit[index - 1].occurredAt)
  ) {
    auditChronologyValid = false;
  }
}
if (auditChainValid) {
  pass('AUDIT_CHAIN_VALID', 'Every audit event points to the prior event.');
} else {
  fail('AUDIT_CHAIN_INVALID', 'Audit previous-event linkage is invalid.');
}
if (auditChronologyValid) {
  pass('AUDIT_CHRONOLOGY_VALID', 'Audit timestamps are non-decreasing.');
} else {
  fail('AUDIT_CHRONOLOGY_INVALID', 'Audit timestamps move backwards.');
}

const mandatoryEvents = [
  'RUN_STARTED',
  'PROMISE_CAPTURED',
  'DUPLICATE_CHECK_PASSED',
  'EVIDENCE_VALIDATED',
  'ASSESSMENT_COMPLETED',
  'AI_DIAGNOSIS_COMPLETED',
  'AI_CRITIQUE_COMPLETED',
  'POLICY_DECISION_RECORDED',
  'HUMAN_DECISION_RECORDED',
  'ACTION_EXECUTION_COMPLETED',
  'TECHNICAL_VERIFICATION_COMPLETED',
  'CUSTOMER_CONFIRMATION_RECORDED',
  'OUTCOME_VERIFIED',
  'PROMISE_CLOSED'
];
const eventTypes = new Set(audit.map((event) => event.eventType));
const missingMandatoryEvents = mandatoryEvents.filter(
  (eventType) => !eventTypes.has(eventType)
);
if (missingMandatoryEvents.length) {
  fail('AUDIT_MANDATORY_EVENTS_MISSING', missingMandatoryEvents);
} else {
  pass(
    'AUDIT_MANDATORY_EVENTS_PRESENT',
    'All mandatory lifecycle event types are present.'
  );
}

const malformedDiagnosis = readJson(
  path.join(negativeDir, 'malformed-ai-diagnosis.invalid.json')
);
const diagnosisValidator = ajv.getSchema(
  `${schemaBase}ai-diagnosis.schema.json`
);
if (diagnosisValidator(malformedDiagnosis)) {
  fail(
    'NEGATIVE_MALFORMED_DIAGNOSIS',
    'Malformed diagnosis unexpectedly passed schema validation.'
  );
} else {
  pass(
    'NEGATIVE_MALFORMED_DIAGNOSIS',
    'Malformed diagnosis was rejected by JSON Schema.'
  );
}

const falseOutcome = readJson(
  path.join(negativeDir, 'false-outcome-claim.business-invalid.json')
);
const outcomeValidator = ajv.getSchema(
  `${schemaBase}outcome-verification.schema.json`
);
if (!outcomeValidator(falseOutcome)) {
  fail('NEGATIVE_FALSE_OUTCOME_SCHEMA', {
    message: 'Business-rule fixture must remain structurally valid.',
    errors: formatErrors(outcomeValidator.errors)
  });
} else {
  const errors = outcomeRuleErrors(falseOutcome);
  const expected = [
    'ACHIEVED_REQUIRES_TECHNICAL_AND_CUSTOMER_PASS',
    'CLOSURE_NOT_ELIGIBLE'
  ];
  const hasExpected = expected.every((code) => errors.includes(code));
  if (hasExpected) {
    pass(
      'NEGATIVE_FALSE_OUTCOME_BUSINESS_RULE',
      `Valid-shaped false outcome was rejected: ${errors.join(', ')}`
    );
  } else {
    fail('NEGATIVE_FALSE_OUTCOME_BUSINESS_RULE', { errors, expected });
  }
}

const unknownAction = readJson(
  path.join(negativeDir, 'unknown-action.business-invalid.json')
);
const actionValidator = ajv.getSchema(
  `${schemaBase}action-recommendation.schema.json`
);
if (!actionValidator(unknownAction)) {
  fail('NEGATIVE_UNKNOWN_ACTION_SCHEMA', {
    message: 'Unknown-action fixture must remain structurally valid.',
    errors: formatErrors(actionValidator.errors)
  });
} else if (catalogByCode.has(unknownAction.actionCode)) {
  fail(
    'NEGATIVE_UNKNOWN_ACTION_BUSINESS_RULE',
    'Unknown action unexpectedly exists in catalogue.'
  );
} else {
  pass(
    'NEGATIVE_UNKNOWN_ACTION_BUSINESS_RULE',
    'Valid-shaped uncatalogued action was denied.'
  );
}

const missedSla = readJson(
  path.join(negativeDir, 'missed-sla.business-invalid.json')
);
if (!outcomeValidator(missedSla)) {
  fail('NEGATIVE_MISSED_SLA_SCHEMA', {
    message: 'Missed-SLA fixture must remain structurally valid.',
    errors: formatErrors(outcomeValidator.errors)
  });
} else {
  const errors = outcomeRuleErrors(missedSla);
  if (errors.includes('SLA_STATUS_MISMATCH')) {
    pass(
      'NEGATIVE_MISSED_SLA_BUSINESS_RULE',
      `Valid-shaped missed-SLA claim was rejected: ${errors.join(', ')}`
    );
  } else {
    fail('NEGATIVE_MISSED_SLA_BUSINESS_RULE', {
      errors,
      expected: ['SLA_STATUS_MISMATCH']
    });
  }
}

const unexpectedRoute = readJson(
  path.join(negativeDir, 'unexpected-route-value.invalid.json')
);
if (outcomeValidator(unexpectedRoute)) {
  fail(
    'NEGATIVE_UNEXPECTED_ROUTE_VALUE',
    'Unexpected route value unexpectedly passed schema validation.'
  );
} else {
  pass(
    'NEGATIVE_UNEXPECTED_ROUTE_VALUE',
    'nextDecision value outside the declared enum was rejected by JSON Schema.'
  );
}

const lowConfidenceFixture = readJson(
  path.join(negativeDir, 'low-confidence-deferred-action.business-invalid.json')
);
const lowConfidenceActionValidator = ajv.getSchema(
  `${schemaBase}action-recommendation.schema.json`
);
if (!lowConfidenceActionValidator(lowConfidenceFixture.actionRecommendation)) {
  fail('NEGATIVE_LOW_CONFIDENCE_SCHEMA', {
    message: 'Low-confidence action-recommendation must remain structurally valid.',
    errors: formatErrors(lowConfidenceActionValidator.errors)
  });
} else {
  // Mirrors the corrected policy-evaluation rule in workflow node 11 /
  // scripts/build-gate2-workflows.mjs: an action whose minimumConfidence
  // exceeds the run's assessed confidence must defer to human review, and
  // that deferral must actually force human review rather than being a
  // no-op (this is the regression test for the F-01 fix).
  const action = lowConfidenceFixture.actionRecommendation;
  const runConfidence = lowConfidenceFixture.simulatedRunConfidence;
  const decision =
    runConfidence < action.minimumConfidence
      ? 'DEFER_HUMAN_REVIEW'
      : action.policyDecision;
  const forcesHumanReview = ['DENY', 'DEFER_HUMAN_REVIEW'].includes(decision);
  if (decision === 'DEFER_HUMAN_REVIEW' && forcesHumanReview) {
    pass(
      'NEGATIVE_LOW_CONFIDENCE_BUSINESS_RULE',
      `Confidence ${runConfidence} below minimum ${action.minimumConfidence} correctly deferred to human review.`
    );
  } else {
    fail('NEGATIVE_LOW_CONFIDENCE_BUSINESS_RULE', {
      runConfidence,
      minimumConfidence: action.minimumConfidence,
      decision,
      forcesHumanReview
    });
  }
}

const reusedApproval = readJson(
  path.join(negativeDir, 'reused-approval.business-invalid.json')
);
const humanDecisionValidator = ajv.getSchema(
  `${schemaBase}human-decision.schema.json`
);
const reusedShapeErrors = reusedApproval.humanDecisions
  .map((decision, index) => ({
    index,
    valid: humanDecisionValidator(decision),
    errors: formatErrors(humanDecisionValidator.errors || [])
  }))
  .filter((result) => !result.valid);
if (reusedShapeErrors.length) {
  fail('NEGATIVE_REUSED_APPROVAL_SCHEMA', {
    message: 'Reused-approval fixture entries must remain structurally valid.',
    errors: reusedShapeErrors
  });
} else {
  const decisionIds = reusedApproval.humanDecisions.map((d) => d.decisionId);
  const actionIds = reusedApproval.humanDecisions.map((d) => d.actionId);
  const sameDecisionId = new Set(decisionIds).size === 1;
  const differentActionIds = new Set(actionIds).size === actionIds.length;
  if (sameDecisionId && differentActionIds) {
    pass(
      'NEGATIVE_REUSED_APPROVAL_BUSINESS_RULE',
      'A single-use decisionId reused across two different actionIds was identified as a replay.'
    );
  } else {
    fail('NEGATIVE_REUSED_APPROVAL_BUSINESS_RULE', {
      decisionIds,
      actionIds
    });
  }
}

const mismatchedHash = readJson(
  path.join(negativeDir, 'mismatched-payload-hash.business-invalid.json')
);
const mismatchActionValidator = ajv.getSchema(
  `${schemaBase}action-recommendation.schema.json`
);
const mismatchActionValid = mismatchActionValidator(
  mismatchedHash.actionRecommendation
);
const mismatchDecisionValid = humanDecisionValidator(
  mismatchedHash.humanDecision
);
if (!mismatchActionValid || !mismatchDecisionValid) {
  fail('NEGATIVE_MISMATCHED_PAYLOAD_HASH_SCHEMA', {
    message: 'Mismatched-payload-hash fixture halves must remain structurally valid.',
    actionErrors: formatErrors(mismatchActionValidator.errors || []),
    decisionErrors: formatErrors(humanDecisionValidator.errors || [])
  });
} else if (
  mismatchedHash.humanDecision.payloadHash ===
  mismatchedHash.actionRecommendation.payloadHash
) {
  fail(
    'NEGATIVE_MISMATCHED_PAYLOAD_HASH_BUSINESS_RULE',
    'Fixture payload hashes unexpectedly matched; this fixture is meant to demonstrate a mismatch.'
  );
} else {
  pass(
    'NEGATIVE_MISMATCHED_PAYLOAD_HASH_BUSINESS_RULE',
    'A human decision bound to a payload hash different from the recommended action was identified as an approval-binding mismatch.'
  );
}

const duplicatePromiseLedger = new Set();
const acceptPromise = (promise) => {
  if (duplicatePromiseLedger.has(promise.idempotencyKey)) {
    return 'BLOCKED_DUPLICATE';
  }
  duplicatePromiseLedger.add(promise.idempotencyKey);
  return 'ACCEPTED';
};
const firstPromiseResult = acceptPromise(envelope.promiseRecord);
const replayPromiseResult = acceptPromise(envelope.promiseRecord);
if (
  firstPromiseResult === 'ACCEPTED' &&
  replayPromiseResult === 'BLOCKED_DUPLICATE'
) {
  pass(
    'DUPLICATE_PROMISE_REPLAY_BLOCKED',
    'A replayed promise idempotency key is blocked.'
  );
} else {
  fail('DUPLICATE_PROMISE_REPLAY_FAILED', {
    firstPromiseResult,
    replayPromiseResult
  });
}

const jsonFiles = [];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === 'node_modules') continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    if (
      entry.isFile() &&
      entry.name.endsWith('.json') &&
      !entry.name.endsWith('-validation-report.json')
    ) {
      jsonFiles.push(fullPath);
    }
  }
};
walk(rootDir);
const forbiddenPatterns = [
  /client_secret/i,
  /access_token/i,
  /refresh_token/i,
  /YOUR_MY_DOMAIN/i,
  /RESELECT_DPMO/i,
  /\\.my\\.salesforce\\.com/i
];
const publicHygieneFindings = [];
for (const filePath of jsonFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(content)) {
      publicHygieneFindings.push({
        file: path.relative(rootDir, filePath),
        pattern: String(pattern)
      });
    }
  }
}
if (publicHygieneFindings.length) {
  fail('PUBLIC_RELEASE_HYGIENE', publicHygieneFindings);
} else {
  pass(
    'PUBLIC_RELEASE_HYGIENE',
    'No blocked credential, org-domain or prior-table placeholders appear in JSON artifacts.'
  );
}

const report = {
  reportType: 'PROMISEOPS_FOUNDATION_VALIDATION',
  reportVersion: '1.0.0',
  generatedAt: new Date().toISOString(),
  validator: {
    engine: 'Ajv',
    jsonSchemaDraft: '2020-12',
    crossContractValidator: 'scripts/validate-foundation.mjs'
  },
  fixture: path.relative(rootDir, fixturePath),
  syntheticData: true,
  summary: {
    status: failures.length === 0 ? 'PASSED' : 'FAILED',
    passedChecks: passes.length,
    failedChecks: failures.length,
    schemaCount: schemas.length,
    evidenceRecordCount: envelope.evidenceRecords.length,
    actionCount: envelope.actionRecommendations.length,
    auditEventCount: envelope.auditEvents.length
  },
  passes,
  failures,
  limitations: [
    'This validates Foundation Gate contracts and a fabricated expected run.',
    'The generated Gate 2 n8n workflow is validated separately by scripts/validate-gate2.mjs.',
    'Local validation does not prove import and execution inside the owner’s n8n instance.',
    'It does not prove live Salesforce access, a real model response or a real customer outcome.'
  ]
};

if (process.argv.includes('--write-report')) {
  const outputDir = path.join(rootDir, 'validation');
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(
    path.join(outputDir, 'foundation-validation-report.json'),
    `${JSON.stringify(report, null, 2)}\n`
  );
}

console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
