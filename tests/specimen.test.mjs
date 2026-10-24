import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const url=p=>new URL('../'+p,import.meta.url);
const html=fs.readFileSync(url('specimen.html'),'utf8'), css=fs.readFileSync(url('specimen.css'),'utf8');
test('review board loads the vendored baseline, the family tokens and existing local files only',()=>{
 const refs=[...html.matchAll(/\b(?:href|src)="([^"#][^"]*)"/g)].map(m=>m[1]);
 const stylesheets=[...html.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)].map(m=>m[1]);
 assert.deepEqual(stylesheets,['vendor/brand/kits/cosmik/tokens/cosmik.css','tokens/tectra.css','specimen.css']);
 for(const ref of refs){assert.doesNotMatch(ref,/^(?:[a-z]+:|\/|\.\.)/i,`${ref} must be a local relative path`);assert.ok(fs.existsSync(url(ref)),`${ref} is missing`);}
});
test('review board fonts come from the vendored foundation and exist',()=>{
 const fonts=[...css.matchAll(/url\('([^']+)'\)/g)].map(m=>m[1]);
 assert.equal(fonts.length,4);
 for(const font of fonts){assert.match(font,/^vendor\/brand\/fonts\/web\//);assert.ok(fs.existsSync(url(font)),`${font} is missing`);}
});
test('Markdown links resolve to files in this repository or to the pinned brand release',()=>{
 const lock=JSON.parse(fs.readFileSync(url('vendor/brand/brand.lock.json'),'utf8'));
 for(const doc of ['README.md','validation.md','LICENSE.md','CHANGELOG.md','AGENTS.md']){
  const text=fs.readFileSync(url(doc),'utf8');
  for(const [,target] of text.matchAll(/\]\(([^)\s]+)\)/g)){
   if(/^https:\/\/github\.com\/cosmiklabs\/brand\/(?:blob|tree)\//.test(target)){assert.ok(target.includes(`/${lock.tag}/`),`${doc}: ${target} must name the vendored release ${lock.tag}`);continue;}
   if(/^https?:/.test(target))continue;
   const file=target.split('#')[0];
   assert.doesNotMatch(file,/^\.\./,`${doc}: ${target} leaves the repository`);
   if(file)assert.ok(fs.existsSync(url(file)),`${doc}: ${target} is missing`);
  }
 }
});
