import assert from 'node:assert/strict';
import { isMobileLayout } from '../pagination.js';

for (const [width, coarse, expected] of [[390, true, true], [844, true, true], [844, false, false], [1920, false, false], [1280, true, false]]) {
  globalThis.innerWidth = width;
  globalThis.matchMedia = () => ({ matches: coarse });
  assert.equal(isMobileLayout(), expected, `Mobile detection: ${width}, touch=${coarse}`);
}
delete globalThis.innerWidth;
delete globalThis.matchMedia;
console.log('Mobile detection passed for portrait, landscape, and desktop.');
