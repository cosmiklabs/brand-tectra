/** Checks the repository: the vendored foundation against its lock, the family against that
 * foundation's contract, then every test in tests/. Exits non-zero on a failure.
 * Run from anywhere: node scripts/check.mjs. Node.js only. */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const run = (...args) => execFileSync(process.execPath, args, { stdio: 'inherit', cwd: root });
try {
  run('vendor/brand/scripts/vendor.mjs', 'verify', 'vendor/brand');
  run('vendor/brand/scripts/family.mjs', 'check', '.');
  // Discovered, so a new test can never be skipped by forgetting to list it.
  const tests = path.join(root, 'tests');
  run('--test', ...fs.readdirSync(tests).filter(f => f.endsWith('.test.mjs')).sort().map(f => path.join(tests, f)));
} catch {
  process.exitCode = 1;
}
