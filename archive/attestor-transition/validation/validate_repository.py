import json, pathlib, re, hashlib, sys
root=pathlib.Path(__file__).resolve().parents[1]
errors=[]; workflows=[]
for p in sorted((root/'workflows').glob('*.json')):
    try: d=json.loads(p.read_text())
    except Exception as e: errors.append(f'{p.name}: invalid JSON {e}'); continue
    nodes=d.get('nodes',[]); names=[n.get('name') for n in nodes]; con=d.get('connections',{})
    targets=[]; broken=[]
    for src,outs in con.items():
        if src not in names: broken.append(src)
        for ports in outs.values():
            for port in ports:
                for edge in port:
                    targets.append(edge.get('node'))
                    if edge.get('node') not in names: broken.append(edge.get('node'))
    meta_leaks=[k for k in ('id','versionId','meta') if k in d]
    item={'file':p.name,'jsonValid':True,'activeFalse':d.get('active') is False,'nodeCount':len(nodes),'connectionEdgeCount':len(targets),'duplicateNodeNames':len(names)!=len(set(names)),'brokenTargets':broken,'publicMetadataAbsent':not meta_leaks}
    workflows.append(item)
    if not all([item['activeFalse'],not item['duplicateNodeNames'],not broken,item['publicMetadataAbsent']]): errors.append(f'{p.name}: structural control failed')
(root/'validation'/'structural-validation.json').write_text(json.dumps({'status':'PASS' if not errors else 'FAIL','workflows':workflows,'errors':errors},indent=2)+'\n')

required=['README.md','docs/executive-brief.md','docs/architecture.md','docs/quality-scorecard.md','docs/security-threat-model.md','docs/pmp-governance.md','docs/final-signoff-gates.md','docs/evidence-index.md']
missing=[x for x in required if not (root/x).exists()]
brief=(root/'docs/executive-brief.md').read_text()
checks={'requiredFilesPresent':not missing,'businessOutcomeBeforeHeading':not brief.startswith('#'),'limitationsPresent':"# 6. What This Doesn't Prove Yet" in brief,'issueTreePresent':'MECE issue tree' in (root/'docs/architecture.md').read_text(),'scorecardTotal100':'**Total** | **100**' in (root/'docs/quality-scorecard.md').read_text(),'owaspRiskLensesPresent':all(x in (root/'docs/security-threat-model.md').read_text() for x in ['Prompt injection','Insecure output handling','Sensitive-information disclosure','Excessive agency']),'pmiMappingPresent':'PMI AI area named in the standard' in (root/'docs/pmp-governance.md').read_text(),'signoffGatesPresent':all(x in (root/'docs/final-signoff-gates.md').read_text() for x in ['Engineering','Security','Measurement','Business value','External feedback','Recruiter readability'])}
(root/'validation'/'documentation-standard-check.json').write_text(json.dumps({'status':'PASS' if all(checks.values()) else 'FAIL','checks':checks,'missing':missing},indent=2)+'\n')

banned=[r'McKinsey-standard',r'McKinsey-style',r'McKinsey-level',r'no competitor does this',r'genuinely unique',r'production-ready',r'independent audit',r'independent external audit']
hits=[]
for p in list(root.rglob('*.md'))+list(root.rglob('*.html')):
    if 'standards/' in p.as_posix(): continue
    txt=p.read_text(errors='ignore')
    for pattern in banned:
        for m in re.finditer(pattern,txt,re.I): hits.append({'file':str(p.relative_to(root)),'term':pattern,'offset':m.start()})
(root/'validation'/'wording-scan.json').write_text(json.dumps({'status':'PASS' if not hits else 'FAIL','hits':hits},indent=2)+'\n')
if errors or missing or not all(checks.values()) or hits: sys.exit(1)
