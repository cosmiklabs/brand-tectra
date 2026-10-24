/** Verify asset-manifest.json against the files it lists, and refresh what a build may refresh.
 *
 *   node scripts/manifest.mjs              fail on any problem
 *   node scripts/manifest.mjs --update     refresh generated and editable hashes, and rewrite
 *                                          `brand` and `distribution` from their sources
 *
 * Every `{ path, sha256 }` object outside `distribution` is one of this family's deliverables, with
 * its role and status. `distribution` is what consumers sync with vendor.mjs: every one of those
 * deliverables plus every file under vendor/brand/, including its lock, so a consumer gets and
 * verifies both layers. It is derived, never hand-edited: the build writes it, and the check fails
 * when it differs from the manifest's own entries, the lock or the bytes. tokens/, assets/ and
 * vendor/brand/ are inventoried. A vendored file is never blessed here; vendor.mjs verify proves it.
 * Node.js only; deterministic and offline. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const VENDOR_DIR = 'vendor/brand';
export const LOCK = `${VENDOR_DIR}/brand.lock.json`;
const INVENTORIED = ['tokens', 'assets', VENDOR_DIR];
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const portable = p => typeof p === 'string' && p.length > 0 && !p.includes('\\') && !p.includes(':') && !p.includes('\0') && !p.startsWith('/') && p.split('/').every(part => part && part !== '.' && part !== '..');

/** The `brand` reference to the vendored foundation, and its files as distribution entries, from the lock. */
export function foundation(directory = root) {
  const bytes = fs.readFileSync(path.join(directory, LOCK));
  const lock = JSON.parse(bytes);
  return {
    brand: { repository: lock.repository, tag: lock.tag, commit: lock.commit, directory: VENDOR_DIR, lock: LOCK },
    files: [{ path: LOCK, sha256: sha256(bytes) }, ...Object.keys(lock.files).map(file => ({ path: `${VENDOR_DIR}/${file}`, sha256: lock.files[file] }))],
  };
}

/** The distribution a manifest implies: its own entries' recorded hashes plus the foundation's. */
export function distributionFor(own, foundationFiles) {
  const files = [...own.map(e => ({ path: e.path, sha256: e.sha256 })), ...foundationFiles].sort((a, b) => (a.path < b.path ? -1 : 1));
  return {
    description: 'Every file a consumer syncs from a release of this repository with vendor/brand/scripts/vendor.mjs sync, with its SHA-256: the Tectra tokens, marks, guide and licence, and the Cosmik foundation under vendor/brand/ unchanged with its lock. `vendor.mjs verify` checks both layers.',
    files,
  };
}

/** Lists every problem; with `update`, first refreshes generated/editable hashes and the lock-derived sections. */
export function verifyManifest(directory = root, { update = false } = {}) {
  const file = path.join(directory, 'asset-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
  const problems = [];
  let derived;
  try { derived = foundation(directory); }
  catch (error) { return { files: 0, problems: [`${LOCK}: ${error.message}`] }; }
  if (update) manifest.brand = derived.brand;
  else if (JSON.stringify(manifest.brand) !== JSON.stringify(derived.brand)) problems.push(`brand differs from ${LOCK}; run npm run build`);
  if (update) delete manifest.vendor;
  else if ('vendor' in manifest) problems.push('vendor is replaced by brand and distribution; run npm run build');

  const entries = [];
  const walk = node => {
    if (Array.isArray(node)) node.forEach(walk);
    else if (node && typeof node === 'object') {
      if ('path' in node || 'sha256' in node) entries.push(node);
      Object.values(node).forEach(walk);
    }
  };
  const { distribution, ...described } = manifest;
  walk(described);
  const listed = new Set();
  const realRoot = fs.realpathSync(directory);
  for (const entry of entries) {
    const p = entry.path;
    if (!portable(p)) { problems.push(`invalid repository-relative path: ${String(p)}`); continue; }
    if (listed.has(p)) problems.push(`duplicate file entry: ${p}`);
    listed.add(p);
    if (p.startsWith(`${VENDOR_DIR}/`)) problems.push(`vendored file listed outside distribution: ${p}`);
    if (!entry.role || typeof entry.role.kind !== 'string') problems.push(`missing role: ${p}`);
    if (typeof entry.status !== 'string' || !entry.status) problems.push(`missing status: ${p}`);
    const full = path.join(directory, p);
    if (!fs.existsSync(full) || !fs.statSync(full).isFile()) { problems.push(`missing file: ${p}`); continue; }
    if (!fs.realpathSync(full).startsWith(realRoot + path.sep)) { problems.push(`file escapes repository: ${p}`); continue; }
    const bytes = fs.readFileSync(full);
    const actual = sha256(bytes);
    const refreshable = entry.generated_by || entry.editable === true;
    if (entry.generated_by !== undefined && !fs.existsSync(path.join(directory, entry.generated_by))) problems.push(`missing generator ${entry.generated_by}: ${p}`);
    if (update && refreshable) entry.sha256 = actual;
    else if (!/^[a-f0-9]{64}$/.test(entry.sha256 ?? '')) problems.push(`invalid or missing SHA-256: ${p}`);
    else if (actual !== entry.sha256) problems.push(`hash mismatch: ${p}`);
    if (p.endsWith('.svg')) {
      const actualViewBox = bytes.toString('utf8').match(/<svg\b[^>]*\bviewBox="([^"]+)"/)?.[1].trim().split(/[\s,]+/).map(Number);
      if (JSON.stringify(actualViewBox) !== JSON.stringify(entry.viewBox)) problems.push(`SVG viewBox differs from manifest: ${p}`);
    }
  }
  // The foundation's bytes must be the locked bytes; vendor.mjs verify reports the detail.
  for (const { path: p, sha256: hash } of derived.files) {
    listed.add(p);
    const full = path.join(directory, p);
    if (!fs.existsSync(full) || !fs.statSync(full).isFile()) problems.push(`missing vendored file: ${p}`);
    else if (sha256(fs.readFileSync(full)) !== hash) problems.push(`vendored file differs from ${LOCK}: ${p}`);
  }
  const expected = distributionFor(entries.filter(e => portable(e.path) && !e.path.startsWith(`${VENDOR_DIR}/`)), derived.files);
  if (update) manifest.distribution = expected;
  else if (JSON.stringify(distribution) !== JSON.stringify(expected)) problems.push('distribution differs from the manifest entries and the lock; run npm run build');

  const points = [];
  const leaves = node => { if (typeof node === 'string') points.push(node); else if (node && typeof node === 'object') Object.values(node).forEach(leaves); };
  leaves(manifest.entry_points);
  for (const p of points) if (!listed.has(p)) problems.push(`entry point not listed with a hash: ${p}`);
  for (const p of [manifest.license]) if (!listed.has(p)) problems.push(`licence not listed with a hash: ${p}`);

  // Distribution directories are an inventory, not a hand-picked subset.
  const inventory = relative => {
    const full = path.join(directory, relative);
    if (!fs.existsSync(full)) return;
    for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
      const p = `${relative}/${entry.name}`;
      if (entry.isDirectory()) inventory(p);
      else if (entry.name !== '.DS_Store' && !listed.has(p)) problems.push(`distribution file not listed with a hash: ${p}`);
    }
  };
  INVENTORIED.forEach(inventory);
  // Do not partially bless generated output when another input is damaged.
  if (update && !problems.length) fs.writeFileSync(file, JSON.stringify(manifest, null, 2) + '\n');
  return { files: entries.length, distributed: expected.files.length, entry_points: points.length, problems };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.some(arg => arg !== '--update')) throw new Error('Usage: manifest.mjs [--update]');
  const result = verifyManifest(root, { update: args.includes('--update') });
  for (const problem of result.problems) console.error(problem);
  if (result.problems.length) {
    console.error(`asset-manifest.json: ${result.problems.length} problem(s).`);
    process.exitCode = 1;
  } else console.log(`asset-manifest.json lists ${result.files} files, ${result.entry_points} entry points and a distribution of ${result.distributed} files; every hash matches.`);
}
