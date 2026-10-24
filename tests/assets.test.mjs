import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {renderAssets} from '../scripts/build-assets.mjs';
const dir=new URL('../assets/',import.meta.url),source=JSON.parse(fs.readFileSync(new URL('latch.source.json',dir)));
test('Latch preserves the exact owner-approved angle-only geometry',()=>{assert.deepEqual(source.paths,['M8 12H36L24 24H20V40L8 52Z','M56 12L44 24V40H40L28 52H56Z']);for(const name of Object.keys(source.variants))for(const kind of ['latch','lockup']){const svg=fs.readFileSync(new URL(`tectra-${kind}-${name}.svg`,dir),'utf8');for(const d of source.paths)assert.ok(svg.includes(`d="${d}"`));assert.ok(svg.includes(`fill="${source.variants[name]}"`));assert.doesNotMatch(svg,/<text|<script|<image/);assert.match(svg,/aria-label="Tectra/);}});
test('committed marks equal what the builder generates from the vendored Inter outlines',()=>{
 const {files,width}=renderAssets();
 assert.equal(width,195);
 assert.equal(files.length,2*Object.keys(source.variants).length);
 for(const [name,text]of files)assert.equal(fs.readFileSync(new URL(name,dir),'utf8'),text,`${name} differs from regeneration; run npm run build`);
 const svgs=fs.readdirSync(dir).filter(f=>f.endsWith('.svg')).sort();
 assert.deepEqual(svgs,files.map(([name])=>name).sort(),'assets/ holds exactly the generated variants');
});
