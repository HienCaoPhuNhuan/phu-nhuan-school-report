import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { sections } from '../sections.js';
const manifest = JSON.parse(await readFile(new URL('../assets/voice/manifest.json', import.meta.url), 'utf8'));
assert.equal(Object.keys(manifest.sections).length, 47);
assert(!manifest.sections['mo-dau']);
for (const [id] of sections.slice(1)) {
  const item = manifest.sections[id];
  assert(item, `Missing voice for ${id}`);
  assert(item.duration > 4);
  assert(item.src.startsWith('assets/voice/') && !item.src.includes('..'));
  assert((await stat(new URL('../' + item.src, import.meta.url))).size > 0);
}
assert.equal(Object.keys(manifest.videos).length, 3);
const media = JSON.parse(await readFile(new URL('../assets/media/manifest.json', import.meta.url), 'utf8'));
assert(manifest.sections['doi-ngu'].presentationDuration >= 4 + media['01'].length * 4);
assert(media['01'].at(-1).source.endsWith('/14-DSC06133.jpg'));
const slot = (manifest.sections['co-so-vat-chat'].duration - 4) / 3;
for (const cut of Object.values(manifest.videos)) {
  assert(Math.abs(cut.duration - slot) < .01);
  assert(cut.speed >= 1);
  assert((await stat(new URL('../' + cut.src, import.meta.url))).size > 0);
}
console.log('47 section voices and three voice-timed silent video cuts verified.');
