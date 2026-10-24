/** Rebuild every generated deliverable, then refresh this repository's manifest hashes.
 *
 *   node scripts/build.mjs           verify the vendored foundation, build tokens and marks, refresh hashes
 *   node scripts/build.mjs --check   the same, then fail unless the worktree is still clean
 *
 * Tokens come from the vendored brand release (vendor/brand/scripts/family.mjs), never a local copy
 * of the contract. Run from anywhere. Node.js only; deterministic and offline. */
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

export function assertCleanTree(directory) {
  const changes = execFileSync('git', ['status', '--porcelain=v1', '--untracked-files=all'], { cwd: directory, encoding: 'utf8' }).trim();
  if (changes) throw new Error(`The rebuild must leave a clean worktree, including staged and new files:\n${changes}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.some(arg => arg !== '--check')) throw new Error('Usage: build.mjs [--check]');
  const run = (script, ...rest) => execFileSync(process.execPath, [path.join(root, script), ...rest], { stdio: 'inherit', cwd: root });
  try {
    // Never build over, or bless hashes for, a foundation that differs from its lock.
    run('vendor/brand/scripts/vendor.mjs', 'verify', 'vendor/brand');
    run('vendor/brand/scripts/family.mjs', 'build', '.');
    run('scripts/build-assets.mjs');
    run('scripts/manifest.mjs', '--update');
    if (args.includes('--check')) assertCleanTree(root);
  } catch (error) {
    if (error.message && !error.status) console.error(error.message);
    process.exitCode = 1;
  }
}
