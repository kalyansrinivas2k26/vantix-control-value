from pathlib import Path
import json,sys
ROOT=Path(__file__).resolve().parents[1]
d=json.loads((ROOT/'workflows/VANTIX-Control-Value-v0.2-public.json').read_text())
errs=[]
if len(d.get('nodes',[]))!=20: errs.append(f"node count={len(d.get('nodes',[]))}")
names=[n['name'] for n in d['nodes']]
required=[
'04 Validate Canonical Intake','05 Enforce Duplicate Promise Protection',
'06 Calculate Deterministic Assessment','08 AI Diagnosis - Synthetic Structured Replay',
'09 AI Critique - Synthetic Structured Replay','10 Validate AI Outputs Deterministically',
'11 Evaluate Action Catalogue Policy','12 Validate Human Approval Boundaries',
'14 Verify Technical Access Separately','15 Verify Customer Use Separately',
'17 Retry Reroute Escalate or Close','18 Validate Complete Run Envelope'
]
for n in required:
    if n not in names: errs.append('missing:'+n)
conn=d.get('connections',{})
def targets(src):
    out=[]
    for groups in conn.get(src,{}).values():
        for group in groups:
            out += [e['node'] for e in group]
    return out
pairs=[
('08 AI Diagnosis - Synthetic Structured Replay','09 AI Critique - Synthetic Structured Replay'),
('09 AI Critique - Synthetic Structured Replay','10 Validate AI Outputs Deterministically'),
('10 Validate AI Outputs Deterministically','11 Evaluate Action Catalogue Policy'),
('11 Evaluate Action Catalogue Policy','12 Validate Human Approval Boundaries'),
('14 Verify Technical Access Separately','15 Verify Customer Use Separately'),
('17 Retry Reroute Escalate or Close','18 Validate Complete Run Envelope')
]
for a,b in pairs:
    if b not in targets(a): errs.append(f'missing edge:{a}->{b}')
for ai in ['08 AI Diagnosis - Synthetic Structured Replay','09 AI Critique - Synthetic Structured Replay']:
    bad=set(targets(ai)) & {
        '13 Execute Permitted Synthetic Actions',
        '17 Retry Reroute Escalate or Close',
        '20 Create Downloadable Executive Report'
    }
    if bad: errs.append(f'AI bypass:{ai}->{sorted(bad)}')
if errs:
    print('GRAPH VALIDATION FAILED')
    for e in errs: print('-',e)
    sys.exit(1)
print('GRAPH VALIDATION PASSED')
print('- 20-node active Control Value workflow')
print('- AI diagnosis/critique pass through deterministic validation before action policy')
print('- action policy precedes approval-boundary validation')
print('- technical and customer-use verification remain separate')
