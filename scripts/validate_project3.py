from pathlib import Path
import json,re,hashlib,sys
ROOT=Path(__file__).resolve().parents[1]
errs=[]

required=[
'README.md','.gitignore','LICENSE','SECURITY.md','CONTRIBUTING.md','CHANGELOG.md',
'ROOT_CLEANUP_REQUIRED.md','UPLOAD_READY.md','GITHUB_ABOUT_ACTION.md','FINAL_HANDOFF.md',
'INDEPENDENT_REVIEW_PROMPT.md','.github/workflows/control-value-portfolio-validation.yml',
'SHA256SUMS.txt',
'workflows/VANTIX-Control-Value-v0.2-public.json',
'workflows/VANTIX-Control-Value-v0.2-Error-Handler-public.json',
'tests/offline_exact_node_tests.cjs',
'scripts/validate_project3.py','scripts/validate_graph.py','scripts/checksums.py',
'evidence/offline-exact-node-test-results.json',
'docs/PLAIN_LANGUAGE_SUMMARY.md','docs/EXECUTIVE_BRIEF.md','docs/EVIDENCE_INDEX.md',
'docs/EVIDENCE_PROVENANCE.md','docs/ARCHITECTURE_VERIFICATION.md',
'docs/SECURITY_EVIDENCE_BOUNDARY.md','docs/SIX_SIGMA_MEASUREMENT.md',
'docs/PMP_AI_GOVERNANCE_MAPPING.md','docs/AGILE_TRACEABILITY.md',
'docs/COMPETITIVE_POSITIONING.md','docs/QUALITY_SCORECARD.md',
'docs/RELEASE_LINEAGE.md','docs/GITHUB_PRESENTATION_CHECKLIST.md',
'docs/FREEZE_GAP_MATRIX.md','docs/LIVE_REPOSITORY_RECONCILIATION.md','docs/FINAL_REPOSITORY_DISPOSITION.md','archive/attestor-transition/README.md'
]
for rel in required:
    if not (ROOT/rel).exists(): errs.append('missing required:'+rel)

for p in ROOT.rglob('*.json'):
    try: json.loads(p.read_text(encoding='utf-8'))
    except Exception as e: errs.append(f'json parse:{p.relative_to(ROOT)}:{e}')

readme=(ROOT/'README.md').read_text(encoding='utf-8')
if not readme.startswith('# VANTIX Control Value'): errs.append('root identity not Control Value')
if 'Customer Commitment Assurance' not in readme[:500]: errs.append('missing Commitment Assurance identity')

# Active-scope identity isolation. Lineage prose may mention Attestor, but active artifacts may not become Attestor modules.
canonical_workflows={
    'VANTIX-Control-Value-v0.2-public.json',
    'VANTIX-Control-Value-v0.2-Error-Handler-public.json',
}
actual_workflows={q.name for q in (ROOT/'workflows').glob('*') if q.is_file()}
extra=sorted(actual_workflows-canonical_workflows)
missing=sorted(canonical_workflows-actual_workflows)
if extra: errs.append('noncanonical active workflow files:'+','.join(extra))
if missing: errs.append('canonical workflow files missing:'+','.join(missing))
for q in (ROOT/'workflows').glob('*'):
    if q.is_file():
        t=q.read_text(encoding='utf-8',errors='ignore')
        if 'Service Recovery' in t or 'Customer Momentum' in t or 'VANTIX Attestor' in t:
            errs.append('active Control Value workflow contaminated:'+q.relative_to(ROOT).as_posix())
# Detect Attestor module content in ordinary active docs; allow only explicit lineage/cleanup surfaces.
allowed_docs={'RELEASE_LINEAGE.md','GITHUB_PRESENTATION_CHECKLIST.md','FREEZE_GAP_MATRIX.md','LIVE_REPOSITORY_RECONCILIATION.md','FINAL_REPOSITORY_DISPOSITION.md'}
for q in (ROOT/'docs').glob('*.md'):
    if q.name in allowed_docs: continue
    t=q.read_text(encoding='utf-8',errors='ignore')
    if 'VANTIX Attestor' in t or 'Service Recovery' in t or 'Customer Momentum' in t:
        errs.append('active documentation module contamination:'+q.relative_to(ROOT).as_posix())
# Root heading itself must not be Attestor even though lineage prose may discuss it.
if re.search(r'^#\s+VANTIX\s+Attestor\s*$', readme, re.M|re.I):
    errs.append('root README has Attestor as active heading')
# Stale CI identities must be removed/replaced from the live working tree.
for q in (ROOT/'.github/workflows').glob('*'):
    if not q.is_file(): continue
    t=q.read_text(encoding='utf-8',errors='ignore')
    if q.name!='control-value-portfolio-validation.yml' or 'Validate PromiseOps synthetic gate' in t or 'VANTIX Attestor' in t:
        errs.append('stale/noncanonical CI workflow:'+q.relative_to(ROOT).as_posix())

# Secret patterns over all public text/code, excluding historical archive.
secret_pats=[
    re.compile(r'AIza[0-9A-Za-z_-]{20,}'),
    re.compile(r'sk-[0-9A-Za-z]{20,}'),
    re.compile(r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----'),
    re.compile(r'''(?:api[_-]?key|access[_-]?token|client[_-]?secret)\s*[:=]\s*["'][A-Za-z0-9_-]{16,}''',re.I)
]
for p in ROOT.rglob('*'):
    if not p.is_file() or 'archive' in p.parts or p.name=='SHA256SUMS.txt':
        continue
    if p.suffix.lower() not in {'.md','.json','.py','.js','.yml','.yaml','.html','.txt','.sh','.env'}:
        continue
    txt=p.read_text(encoding='utf-8',errors='ignore')
    if any(pat.search(txt) for pat in secret_pats):
        errs.append('possible secret:'+p.relative_to(ROOT).as_posix())

# Markdown file links and anchors.
link_re=re.compile(r'(?<!!)\[[^\]]+\]\(([^)]+)\)')
def slug(h):
    s=h.strip().lower()
    s=re.sub(r'[^\w\s-]','',s)
    return re.sub(r'\s+','-',s)
anchors={}
for p in ROOT.rglob('*.md'):
    txt=p.read_text(encoding='utf-8',errors='ignore')
    anchors[p.resolve()]={slug(m.group(1)) for m in re.finditer(r'^#{1,6}\s+(.+?)\s*$',txt,re.M)}
for p in ROOT.rglob('*.md'):
    txt=p.read_text(encoding='utf-8',errors='ignore')
    for target in link_re.findall(txt):
        target=target.strip().split()[0].strip('<>')
        if target.startswith(('http://','https://','mailto:')): continue
        if target.startswith('#'):
            if target[1:].lower() not in anchors[p.resolve()]:
                errs.append(f'broken anchor:{p.relative_to(ROOT)}->{target}')
            continue
        pathpart,_,anchor=target.partition('#')
        q=(p.parent/pathpart).resolve()
        try: q.relative_to(ROOT.resolve())
        except ValueError:
            errs.append(f'link escapes repo:{p.relative_to(ROOT)}->{target}')
            continue
        if not q.exists():
            errs.append(f'broken link:{p.relative_to(ROOT)}->{target}')
            continue
        if anchor and q.suffix.lower()=='.md' and anchor.lower() not in anchors.get(q,set()):
            errs.append(f'broken cross anchor:{p.relative_to(ROOT)}->{target}')

# Workflow/evidence SHA binding.
wfp=ROOT/'workflows/VANTIX-Control-Value-v0.2-public.json'
evp=ROOT/'evidence/offline-exact-node-test-results.json'
if wfp.exists() and evp.exists():
    ev=json.loads(evp.read_text(encoding='utf-8'))
    sha=hashlib.sha256(wfp.read_bytes()).hexdigest()
    if ev.get('workflowSha256')!=sha: errs.append('offline evidence workflow hash mismatch')
    if ev.get('evidenceClass')!='OFFLINE_EXACT_NODE_CODE_EXECUTION' or ev.get('n8nRuntimeExecution') is not False:
        errs.append('offline evidence class overstated')
    if ev.get('failCount')!=0 or ev.get('passCount')!=ev.get('testCount'):
        errs.append('offline tests not all pass')

# Score arithmetic + printed total row.
sp=ROOT/'docs/QUALITY_SCORECARD.md'
txt=sp.read_text(encoding='utf-8')
rows=re.findall(r'^\| [^|*][^|]* \| (\d+) \| (\d+) \|',txt,re.M)
weights=sum(int(a) for a,b in rows)
scores=sum(int(b) for a,b in rows)
if weights!=100: errs.append(f'score weights={weights}')
m=re.search(r'\| \*\*Total\*\* \| \*\*(\d+)\*\* \| \*\*(\d+)\*\*',txt)
if not m:
    errs.append('score total row missing')
elif int(m.group(1))!=weights or int(m.group(2))!=scores:
    errs.append(f'score total mismatch:{m.groups()} vs {weights}/{scores}')

# Prohibited borrowed-endorsement/maturity phrasing.
for p in ROOT.rglob('*.md'):
    rel=p.relative_to(ROOT).as_posix()
    if rel.startswith('archive/') or rel.startswith('evidence/source-artifacts/') or rel.startswith('standards/'): continue
    txt=p.read_text(encoding='utf-8',errors='ignore').lower()
    for banned in ['mckinsey-standard','mckinsey-style','independent audit','no competitor does this']:
        if banned in txt: errs.append(f'banned wording:{rel}:{banned}')

if errs:
    print('PROJECT 3 VALIDATION FAILED')
    for e in errs: print('-',e)
    sys.exit(1)
print('PROJECT 3 VALIDATION PASSED')
print('- Control Value identity enforced')
print('- Attestor transition isolated to archive/lineage')
print('- JSON, secret scan, Markdown links/anchors, evidence hash and score arithmetic passed')
