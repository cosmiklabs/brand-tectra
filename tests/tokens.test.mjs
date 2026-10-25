// Tectra cases formerly in cosmiklabs/brand tests/tokens.test.mjs, run against the vendored family.mjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const familyScript=path.join(root,'vendor/brand/scripts/family.mjs');
const outputs=['tectra.css','tectra.json','tectra.tokens.json','tectra_tokens.rs'];

function fixture(t,generated=false){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'brand-tectra-token-test-'));
 t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
 fs.mkdirSync(path.join(dir,'tokens'));
 fs.copyFileSync(path.join(root,'tokens/family.json'),path.join(dir,'tokens/family.json'));
 if(generated)for(const file of outputs)fs.copyFileSync(path.join(root,'tokens',file),path.join(dir,'tokens',file));
 return {
  dir,
  edit(mutate){const target=path.join(dir,'tokens/family.json');const value=JSON.parse(fs.readFileSync(target,'utf8'));mutate(value);fs.writeFileSync(target,JSON.stringify(value));},
  run(command){return spawnSync(process.execPath,[familyScript,command,dir],{encoding:'utf8'});},
  outputs(){return outputs.map(file=>{const p=path.join(dir,'tokens',file);return fs.existsSync(p)?fs.readFileSync(p,'utf8'):null;});},
 };
}

for(const [label,mutate,expected] of [
 ['stale family baseline metadata',s=>{s.extends='Cosmik baseline 0.4.0';},/extends must be/],
 ['missing family modes',s=>{delete s.semantic.light;},/exactly the baseline modes/],
 ['misspelled family sections',s=>{s.typography={};},/unsupported property typography/],
 ['family motion overrides',s=>{s.motion={duration:'1ms'};},/unsupported property motion/],
 ['family utility type overrides',s=>{s.type={body:{fontFamily:'Other'}};},/utility type/],
 ['family primitive collisions',s=>{s.primitives.paper='#FFFFFF';},/exists in the baseline/],
 ['asymmetric family extensions',s=>{s.extensions.dark.extra='white';},/same roles/],
]){
 test(`family build rejects ${label} without publishing partial output`,t=>{
  const f=fixture(t);
  f.edit(mutate);
  const result=f.run('build');
  assert.notEqual(result.status,0);
  assert.match(result.stderr,expected);
  assert.deepEqual(f.outputs(),outputs.map(()=>null));
  assert.notEqual(f.run('check').status,0);
 });
}

test('family check rejects an extends that does not name the vendored baseline',t=>{
 const f=fixture(t,true);
 f.edit(s=>{s.extends='Cosmik baseline 0.4.0';});
 const result=f.run('check');
 assert.notEqual(result.status,0);
 assert.match(result.stderr,/provides "Cosmik baseline 0\.8\.0"/);
});

test('a late family failure preserves all existing generated files',t=>{
 const f=fixture(t,true);
 const before=f.outputs();
 f.edit(s=>{s.semantic.dark.bg='not-a-color';});
 assert.notEqual(f.run('build').status,0);
 assert.deepEqual(f.outputs(),before);
});

test('family check rejects committed outputs that differ from regeneration',t=>{
 const f=fixture(t,true);
 assert.equal(f.run('check').status,0,'the committed outputs are current');
 fs.appendFileSync(path.join(f.dir,'tokens/tectra.css'),'/* edited */\n');
 const result=f.run('check');
 assert.notEqual(result.status,0);
 assert.match(result.stderr,/tokens\/tectra\.css differs from what this brand release generates/);
});

test('contrast check validates actual neutral status borders',t=>{
 const f=fixture(t,true);
 f.edit(s=>{s.semantic.dark['status-border']=s.semantic.dark['status-bg'];});
 const result=f.run('check');
 assert.notEqual(result.status,0);
 assert.match(result.stderr,/contrast: dark status-border \/ status-bg is 1:1/);
});

test('contrast check diagnoses translucent functional roles',t=>{
 const f=fixture(t,true);
 f.edit(s=>{s.primitives['tectra-test-translucent']='#00000080';s.semantic.dark.text='tectra-test-translucent';});
 const result=f.run('check');
 assert.notEqual(result.status,0);
 assert.match(result.stderr,/tectra dark text: contrast pairs require an opaque/);
});
