/** Verify asset-manifest.json against the files it lists, and refresh what a build may refresh.
 *
 *   node scripts/manifest.mjs              fail on any problem
 *   node scripts/manifest.mjs --update     refresh generated and editable hashes, and rewrite
 *                                          `brand` and `vendor` from vendor/brand/brand.lock.json
 *
 * Every `{ path, sha256 }` object anywhere in the manifest is a deliverable. Consumers sync from that
 * set, so it must be complete: tokens/, assets/ and vendor/brand/ are inventoried, and the vendored
 * entries must equal the lock. A vendored file is never blessed here; vendor.mjs verify proves it.
 * Node.js only; deterministic and offline. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const VENDOR_DIR = 'vendor/brand';
const LOCK = `${VENDOR_DIR}/brand.lock.json`;
const INVENTORIED = ['tokens', 'assets', VENDOR_DIR];
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const portable = p => typeof p === 'string' && p.length > 0 && !p.includes('\\') && !p.includes(':') && !p.includes('\0') && !p.startsWith('/') && p.split('/').every(part => part && part !== '.' && part !== '..');
const FONT_WEIGHTS = { Regular: 400, Medium: 500, SemiBold: 600 };

/** The role a vendored file plays for a consumer, from its path in the brand release. */
export function vendorRole(file) {
  const font = file.match(/^fonts\/(web|desktop)\/(Inter|IBMPlexMono)-(\w+)\.(woff2|ttf)$/);
  if (font) return { kind: `${font[1]}-font`, family: font[2] === 'IBMPlexMono' ? 'IBM Plex Mono' : 'Inter', weight: FONT_WEIGHTS[font[3]], format: font[4], license_file: `${VENDOR_DIR}/fonts/licenses/${font[2] === 'IBMPlexMono' ? 'IBM-Plex' : 'Inter'}-OFL.txt` };
  if (file.startsWith('fonts/licenses/')) return { kind: 'font-license' };
  const token = file.match(/^kits\/cosmik\/tokens\/(source\.json|cosmik\.(css|json|tokens\.json)|cosmik_tokens\.rs)$/);
  if (token) return { kind: 'tokens', kit: 'cosmik', format: { 'source.json': 'source', 'cosmik.css': 'css', 'cosmik.json': 'json', 'cosmik.tokens.json': 'dtcg', 'cosmik_tokens.rs': 'rust' }[token[1]] };
  if (file === 'kits/cosmik/components/controls.css') return { kind: 'controls' };
  if (file.startsWith('scripts/')) return { kind: 'tooling' };
  if (file.startsWith('guide/')) return { kind: 'guide' };
  if (file === 'LICENSE.md') return { kind: 'license' };
  if (file === 'package.json') return { kind: 'release-metadata' };
  return { kind: 'foundation' };
}

/** `brand` and `vendor` sections derived entirely from the lock, so they cannot drift from it. */
export function lockSections(directory = root) {
  const lockBytes = fs.readFileSync(path.join(directory, LOCK));
  const lock = JSON.parse(lockBytes);
  const brand = {
    repository: lock.repository,
    tag: lock.tag,
    commit: lock.commit,
    lock: LOCK,
    release: `https://github.com/${lock.repository}/tree/${lock.tag}`,
  };
  const files = [{ path: LOCK, role: { kind: 'vendor-lock' }, status: `records ${lock.repository} ${lock.tag}`, sha256: sha256(lockBytes) }];
  for (const file of Object.keys(lock.files).sort()) {
    files.push({ path: `${VENDOR_DIR}/${file}`, role: { ...vendorRole(file), layer: 'foundation' }, status: `vendored from ${lock.repository} ${lock.tag}; do not edit`, sha256: lock.files[file] });
  }
  return { brand, vendor: { directory: VENDOR_DIR, description: `The Cosmik foundation layer, copied unchanged from ${lock.repository} ${lock.tag} with vendor.mjs sync. Consumers that take Tectra from this repository get the baseline tokens, controls, fonts and their notices here.`, files } };
}

/** Lists every problem; with `update`, first refreshes generated/editable hashes and the lock-derived sections. */
export function verifyManifest(directory = root, { update = false } = {}) {
  const file = path.join(directory, 'asset-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
  const problems = [];
  let derived;
  try { derived = lockSections(directory); }
  catch (error) { return { files: 0, problems: [`${LOCK}: ${error.message}`] }; }
  if (update) Object.assign(manifest, derived);
  else for (const key of ['brand', 'vendor']) {
    if (JSON.stringify(manifest[key]) !== JSON.stringify(derived[key])) problems.push(`${key} differs from ${LOCK}; run npm run build`);
  }

  const entries = [];
  const walk = node => {
    if (Array.isArray(node)) node.forEach(walk);
    else if (node && typeof node === 'object') {
      if ('path' in node || 'sha256' in node) entries.push(node);
      Object.values(node).forEach(walk);
    }
  };
  walk(manifest);
  const listed = new Set();
  const realRoot = fs.realpathSync(directory);
  for (const entry of entries) {
    const p = entry.path;
    if (!portable(p)) { problems.push(`invalid repository-relative path: ${String(p)}`); continue; }
    if (listed.has(p)) problems.push(`duplicate file entry: ${p}`);
    listed.add(p);
    if (!entry.role || typeof entry.role.kind !== 'string') problems.push(`missing role: ${p}`);
    if (typeof entry.status !== 'string' || !entry.status) problems.push(`missing status: ${p}`);
    const full = path.join(directory, p);
    if (!fs.existsSync(full) || !fs.statSync(full).isFile()) { problems.push(`missing file: ${p}`); continue; }
    if (!fs.realpathSync(full).startsWith(realRoot + path.sep)) { problems.push(`file escapes repository: ${p}`); continue; }
    const bytes = fs.readFileSync(full);
    const actual = sha256(bytes);
    const refreshable = !p.startsWith(`${VENDOR_DIR}/`) && (entry.generated_by || entry.editable === true);
    if (entry.generated_by !== undefined && !fs.existsSync(path.join(directory, entry.generated_by))) problems.push(`missing generator ${entry.generated_by}: ${p}`);
    if (update && refreshable) entry.sha256 = actual;
    else if (!/^[a-f0-9]{64}$/.test(entry.sha256 ?? '')) problems.push(`invalid or missing SHA-256: ${p}`);
    else if (actual !== entry.sha256) problems.push(`hash mismatch: ${p}`);
    if (p.endsWith('.svg')) {
      const actualViewBox = bytes.toString('utf8').match(/<svg\b[^>]*\bviewBox="([^"]+)"/)?.[1].trim().split(/[\s,]+/).map(Number);
      if (JSON.stringify(actualViewBox) !== JSON.stringify(entry.viewBox)) problems.push(`SVG viewBox differs from manifest: ${p}`);
    }
  }
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
  return { files: entries.length, entry_points: points.length, problems };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.some(arg => arg !== '--update')) throw new Error('Usage: manifest.mjs [--update]');
  const result = verifyManifest(root, { update: args.includes('--update') });
  for (const problem of result.problems) console.error(problem);
  if (result.problems.length) {
    console.error(`asset-manifest.json: ${result.problems.length} problem(s).`);
    process.exitCode = 1;
  } else console.log(`asset-manifest.json lists ${result.files} files and ${result.entry_points} entry points; every hash matches.`);
}
