import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {verifyManifest, foundation, root, LOCK} from '../scripts/manifest.mjs';
import {sync, verify, distributionSet} from '../vendor/brand/scripts/vendor.mjs';
const manifest=JSON.parse(fs.readFileSync(new URL('../asset-manifest.json',import.meta.url),'utf8'));
const pkg=JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url),'utf8'));

/** A scratch copy of the files the manifest checks. */
function copy(t){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'brand-tectra-manifest-'));
 t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
 for(const part of ['asset-manifest.json','package.json','LICENSE.md','README.md','CHANGELOG.md','specimen.html','specimen.css','validation.md','tokens','assets','vendor','scripts'])fs.cpSync(path.join(root,part),path.join(dir,part),{recursive:true});
 return dir;
}
const has=(result,pattern)=>assert.ok(result.problems.some(p=>pattern.test(p)),JSON.stringify(result.problems));

test('every manifest hash, entry point and inventoried file matches',()=>{
 assert.deepEqual(verifyManifest(root).problems,[]);
});
test('the manifest names this family and the locked brand release',()=>{
 const family=JSON.parse(fs.readFileSync(new URL('../tokens/family.json',import.meta.url),'utf8'));
 assert.equal(manifest.version,family.version);
 assert.equal(pkg.version,family.version);
 assert.equal(manifest.package,pkg.name);
 assert.deepEqual(manifest.brand,foundation(root).brand);
 assert.deepEqual(Object.keys(manifest.brand),['repository','tag','commit','directory','lock']);
 assert.equal('vendor' in manifest,false);
});
test('the distribution follows the contract and carries both layers',()=>{
 const set=distributionSet(manifest,pkg);
 assert.equal(set.repository,'cosmiklabs/brand-tectra');
 const listed=new Map(set.files.map(e=>[e.path,e.sha256]));
 const lock=JSON.parse(fs.readFileSync(new URL('../vendor/brand/brand.lock.json',import.meta.url),'utf8'));
 for(const [file,hash] of Object.entries(lock.files))assert.equal(listed.get(`vendor/brand/${file}`),hash,file);
 assert.ok(listed.has(LOCK));
 for(const p of ['LICENSE.md','README.md','tokens/tectra.css','tokens/tectra.json','tokens/tectra.tokens.json','tokens/tectra_tokens.rs','assets/tectra-latch-dark.svg','assets/tectra-lockup-light.svg'])assert.ok(listed.has(p),p);
 assert.deepEqual(manifest.entry_points.browser_stylesheets,['vendor/brand/kits/cosmik/tokens/cosmik.css','tokens/tectra.css','vendor/brand/kits/cosmik/components/controls.css']);
});
test('drift between the manifest, the lock and the files fails until a build refreshes it',t=>{
 const dir=copy(t);
 const file=path.join(dir,'asset-manifest.json');
 const edited=JSON.parse(fs.readFileSync(file,'utf8'));
 edited.distribution.files.pop();
 edited.brand.tag='v0.0.1';
 fs.writeFileSync(file,JSON.stringify(edited,null,2)+'\n');
 const stale=verifyManifest(dir);
 has(stale,/distribution differs/);
 has(stale,/brand differs/);
 assert.deepEqual(verifyManifest(dir,{update:true}).problems,[]);
 assert.deepEqual(verifyManifest(dir).problems,[]);
 // A vendored file that differs from the lock is never blessed.
 fs.appendFileSync(path.join(dir,'vendor/brand/kits/cosmik/tokens/cosmik.css'),'/* edited */');
 const before=fs.readFileSync(file);
 has(verifyManifest(dir,{update:true}),/vendored file differs from vendor\/brand\/brand\.lock\.json: vendor\/brand\/kits\/cosmik\/tokens\/cosmik\.css/);
 assert.deepEqual(fs.readFileSync(file),before);
});
test('a release of this repository syncs into a consumer and verifies both layers',t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'brand-tectra-release-'));
 t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
 const repo=path.join(dir,'brand-tectra');
 for(const p of [...manifest.distribution.files.map(e=>e.path),'asset-manifest.json','package.json']){
  fs.mkdirSync(path.dirname(path.join(repo,p)),{recursive:true});
  fs.copyFileSync(path.join(root,p),path.join(repo,p));
 }
 const config=path.join(dir,'empty.gitconfig');fs.writeFileSync(config,'');
 const git=(...args)=>execFileSync('git',args,{cwd:repo,stdio:'pipe',env:{...process.env,GIT_CONFIG_GLOBAL:config,GIT_CONFIG_SYSTEM:config}});
 git('init','-q');git('add','-A');
 git('-c','user.name=Test','-c','user.email=test@example.invalid','-c','commit.gpgsign=false','commit','-qm','release');
 git('tag',`v${pkg.version}`);
 const into=path.join(dir,'consumer/vendor/brand-tectra');
 const lock=sync({from:repo,into});
 assert.equal(lock.package,'@cosmiklabs/brand-tectra');
 assert.ok(fs.existsSync(path.join(into,'brand-tectra.lock.json')));
 const result=verify(into,{release:repo});
 assert.deepEqual(result.problems,[]);
 assert.deepEqual(result.layers.map(l=>[l.directory,l.lock.repository]),[['.','cosmiklabs/brand-tectra'],['vendor/brand','cosmiklabs/brand']]);
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
