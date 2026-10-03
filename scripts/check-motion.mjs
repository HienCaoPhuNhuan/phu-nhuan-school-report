import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const app = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');

// Guard the presentation default against the OS setting that hid its effects.
assert.doesNotMatch(app, /matchMedia\([^)]*prefers-reduced-motion/, 'OS preferences must not disable presentation motion');
assert.doesNotMatch(css, /@media[^{}]*prefers-reduced-motion/, 'CSS must not suppress effects based on OS preferences');
assert.match(app, /get\(['"]motion['"]\)\s*===\s*['"]reduced['"]/, 'Reduced motion must remain an explicit viewer choice');
assert.match(css, /\.section-arriving\s*>\s*\.wrap\s*\{[^}]*animation:\s*section-forward/, 'Forward transition must exist');
assert.match(css, /\[data-direction="backward"\][^}]*animation-name:\s*section-backward/, 'Backward transition must exist');
console.log('Presentation motion policy passed: effects enabled by default, explicit opt-out retained.');
