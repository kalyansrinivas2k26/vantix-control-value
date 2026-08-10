const fs=require('fs'),crypto=require('crypto');
const wfPath=process.argv[2],outPath=process.argv[3];
const wf=JSON.parse(fs.readFileSync(wfPath,'utf8'));
const nodes=Object.fromEntries(wf.nodes.map(n=>[n.name,n]));

function inputApi(items){
  const arr=Array.isArray(items)?items:[];
  return {
    all:()=>arr,
    first:()=>arr[0] || {json:{}},
    last:()=>arr[arr.length-1] || {json:{}},
    item:arr[0] || {json:{}}
  };
}
function run(name,items){
  const code=nodes[name]?.parameters?.jsCode;
  if(!code)throw new Error('no_code:'+name);
  return new Function('$input',code)(inputApi(items));
}
const order=wf.nodes.map(n=>n.name).filter(n=>n!=='01 Manual Trigger - Synthetic Gate 2' && n!=='20 Create Downloadable Executive Report');
function through(end){
  let items=[];
  for(const name of order){items=run(name,items);if(name===end)break;}
  return items;
}
const tests=[];
function test(id,fn){try{tests.push({id,status:'PASS',details:fn()});}catch(e){tests.push({id,status:'FAIL',error:String(e.stack||e)});}}

test('CV-OFF-01_full_chain_to_executive_report',()=>{
  const out=through('19 Build Executive HTML Report');
  if(!Array.isArray(out)||!out[0]?.json)throw new Error('no_output');
  const txt=JSON.stringify(out[0].json);
  if(!/CLOSE|CLOSED/.test(txt))throw new Error('close_state_missing');
  return {containsCloseState:true,outputKeys:Object.keys(out[0].json)};
});

test('CV-OFF-02_deterministic_assessment_expected_markers',()=>{
  const j=through('06 Calculate Deterministic Assessment')[0].json;
  const txt=JSON.stringify(j);
  for(const marker of ['HIGH','VERY_HIGH','P1_CRITICAL','98']){
    if(!txt.includes(marker))throw new Error('missing:'+marker);
  }
  return {expectedMarkers:['HIGH','VERY_HIGH','P1_CRITICAL','98']};
});

test('CV-OFF-03_full_chain_preserves_synthetic_boundary',()=>{
  const j=through('18 Validate Complete Run Envelope')[0].json;
  const txt=JSON.stringify(j);
  if(/SALESFORCE_PRODUCTION|LIVE_GEMINI/i.test(txt))throw new Error('unexpected_live_marker');
  return {runEnvelopeProduced:true,syntheticBoundaryPreserved:true};
});

test('CV-OFF-04_workflow_has_no_live_ai_node',()=>{
  const nodeTypes=wf.nodes.map(n=>n.type).join(' ');
  if(/googleGemini|openAi|anthropic/i.test(nodeTypes))throw new Error('live_ai_node_detected');
  const names=wf.nodes.map(n=>n.name).join(' ');
  if(!names.includes('Synthetic Structured Replay'))throw new Error('synthetic_replay_label_missing');
  return {liveAiNode:false,syntheticReplayLabels:true};
});

test('CV-OFF-05_twenty_node_topology',()=>{
  if(wf.nodes.length!==20)throw new Error('node_count:'+wf.nodes.length);
  return {nodeCount:20};
});

const result={
 evidenceClass:'OFFLINE_EXACT_NODE_CODE_EXECUTION',
 n8nRuntimeExecution:false,
 workflowSha256:crypto.createHash('sha256').update(fs.readFileSync(wfPath)).digest('hex'),
 testCount:tests.length,
 passCount:tests.filter(t=>t.status==='PASS').length,
 failCount:tests.filter(t=>t.status==='FAIL').length,
 tests
};
if(outPath)fs.writeFileSync(outPath,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
if(result.failCount)process.exit(1);
