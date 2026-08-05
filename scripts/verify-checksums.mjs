import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ledgerRelative = 'validation/SHA256SUMS.txt';
const ledgerPath = path.join(root, ledgerRelative);

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === '.git' || entry.name === 'node_modules') return [];
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(absolute);
    const relative = path.relative(root, absolute).split(path.sep).join('/');
    return relative === ledgerRelative ? [] : [relative];
  });
}

const failures = [];
const expectedFiles = walk(root).sort((a, b) => a.localeCompare(b));
const seen = new Set();

for (const [index, line] of fs.readFileSync(ledgerPath, 'utf8').trim().split(/\r?\n/).entries()) {
  const match = line.match(/^([a-f0-9]{64})  \.\/(.+)$/);
  if (!match) {
    failures.push(`Line ${index + 1} is malformed.`);
    continue;
  }
  const [, expected, relative] = match;
  if (seen.has(relative)) failures.push(`Duplicate ledger entry: ${relative}`);
  seen.add(relative);
  const absolute = path.join(root, relative);
  if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
    failures.push(`Missing file: ${relative}`);
    continue;
  }
  const actual = crypto.createHash('sha256').update(fs.readFileSync(absolute)).digest('hex');
  if (actual !== expected) failures.push(`Hash mismatch: ${relative}`);
}

for (const relative of expectedFiles) {
  if (!seen.has(relative)) failures.push(`File omitted from ledger: ${relative}`);
}
for (const relative of seen) {
  if (!expectedFiles.includes(relative)) failures.push(`Unexpected ledger entry: ${relative}`);
}

console.log(JSON.stringify({
  status: failures.length ? 'FAILED' : 'PASSED',
  expectedFiles: expectedFiles.length,
  ledgerEntries: seen.size,
  failures,
}, null, 2));

if (failures.length) process.exitCode = 1;

