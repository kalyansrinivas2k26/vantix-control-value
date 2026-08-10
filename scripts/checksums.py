from pathlib import Path
import hashlib,sys
ROOT=Path(__file__).resolve().parents[1]
LEDGER=ROOT/'SHA256SUMS.txt'
def files():
    for p in sorted(ROOT.rglob('*')):
        if not p.is_file() or '.git' in p.parts or '__pycache__' in p.parts or p==LEDGER:
            continue
        yield p
def digest(p):
    h=hashlib.sha256()
    with p.open('rb') as f:
        for c in iter(lambda:f.read(1024*1024),b''): h.update(c)
    return h.hexdigest()
if '--write' in sys.argv:
    LEDGER.write_text(''.join(f'{digest(p)}  {p.relative_to(ROOT).as_posix()}\n' for p in files()),encoding='utf-8')
    print('SHA256SUMS WRITTEN')
    sys.exit(0)
exp={}
for l in LEDGER.read_text(encoding='utf-8').splitlines():
    if l.strip():
        a,b=l.split('  ',1); exp[b]=a
act={p.relative_to(ROOT).as_posix():digest(p) for p in files()}
err=[]
for r,s in act.items():
    if r not in exp: err.append('omitted:'+r)
    elif exp[r]!=s: err.append('mismatch:'+r)
for r in exp:
    if r not in act: err.append('missing:'+r)
if err:
    print('SHA256SUMS FAILED')
    for e in err: print('-',e)
    sys.exit(1)
print('SHA256SUMS PASSED')
