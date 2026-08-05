import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputRelative = 'validation/SHA256SUMS.txt';

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === '.git' || entry.name === 'node_modules') return [];
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(absolute);
    const relative = path.relative(root, absolute).split(path.sep).join('/');
    return relative === outputRelative ? [] : [relative];
  });
}

const lines = walk(root)
  .sort((a, b) => a.localeCompare(b))
  .map((relative) => {
    const digest = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, relative))).digest('hex');
    return `${digest}  ./${relative}`;
  });

fs.mkdirSync(path.dirname(path.join(root, outputRelative)), { recursive: true });
fs.writeFileSync(path.join(root, outputRelative), `${lines.join('\n')}\n`);
console.log(JSON.stringify({ status: 'WRITTEN', entries: lines.length, file: outputRelative }));

