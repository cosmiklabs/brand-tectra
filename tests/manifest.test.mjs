import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {verifyManifest, lockSections, root} from '../scripts/manifest.mjs';
const manifest=JSON.parse(fs.readFileSync(new URL('../asset-manifest.json',import.meta.url),'utf8'));

test('every manifest hash, entry point and inventoried file matches',()=>{
 assert.deepEqual(verifyManifest(root).problems,[]);
});
test('the manifest names this family and the locked brand release',()=>{
 const family=JSON.parse(fs.readFileSync(new URL('../tokens/family.json',import.meta.url),'utf8'));
 const pkg=JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url),'utf8'));
 assert.equal(manifest.version,family.version);
 assert.equal(pkg.version,family.version);
 assert.equal(manifest.package,pkg.name);
 const {brand,vendor}=lockSections(root);
 assert.deepEqual(manifest.brand,brand);
 assert.deepEqual(manifest.vendor,vendor);
});
test('consumers get the foundation layer through this manifest',()=>{
 const lock=JSON.parse(fs.readFileSync(new URL('../vendor/brand/brand.lock.json',import.meta.url),'utf8'));
 const listed=new Map(manifest.vendor.files.map(e=>[e.path,e.sha256]));
 for(const [file,hash] of Object.entries(lock.files))assert.equal(listed.get(`vendor/brand/${file}`),hash,file);
 assert.ok(listed.has('vendor/brand/brand.lock.json'));
 assert.deepEqual(manifest.entry_points.browser_stylesheets,['vendor/brand/kits/cosmik/tokens/cosmik.css','tokens/tectra.css','vendor/brand/kits/cosmik/components/controls.css']);
});
test('the Tectra identity records carry over with root-relative paths',()=>{
 assert.equal(manifest.tectra_identity.status,'approved angle-only Latch');
 assert.equal(manifest.tectra_identity.assets.length,11);
 for(const a of manifest.tectra_identity.assets){
  assert.match(a.path,/^assets\//);
  if(a.path.endsWith('.svg'))assert.equal(a.generated_by,'scripts/build-assets.mjs');
 }
 assert.equal(manifest.family_identity.status,'Approved angle-only Latch (owner, 2026-10-17)');
});
