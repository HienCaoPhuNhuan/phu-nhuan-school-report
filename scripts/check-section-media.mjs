import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { report } from '../content.js';
const manifest = JSON.parse(await readFile(new URL('../assets/media/manifest.json', import.meta.url), 'utf8'));
assert.equal(Object.keys(manifest).length, 48);
for (const items of Object.values(manifest)) {
  assert.equal(new Set(items.map(item => item.src)).size, items.length);
  for (const item of items) {
    assert(item.src.startsWith('assets/media/') && !item.src.includes('..'));
    assert(item.width > 0 && item.height > 0);
    const file = await stat(new URL('../' + item.src, import.meta.url));
    assert(file.size > 0 && file.size < 100000000);
    if (item.type === 'video') assert((await stat(new URL('../' + item.poster, import.meta.url))).size > 0);
  }
}
assert.equal(manifest['32'].length, 3);
assert(manifest['32'].every(item => item.type === 'video'));
assert.deepEqual(report.achievements.academic.map(item => item.title), [
  'Thi HS giỏi cấp Thành phố (khối 12)',
  'Kỳ thi Olympic TP khối 10,11',
  'Kỳ thi Olympic 30/4 lần thứ XXX (khối chuyên)',
  'Cuộc thi Khoa học Kỹ thuật dành cho Học sinh THPT cấp Thành phố',
  'Giải nhanh toán nhanh trên máy tính cầm tay cấp TP'
]);
assert.deepEqual(report.achievements.academic.map(item => item.text), [
  '24 giải Nhì, 19 giải Ba',
  '1 giải Nhất, 19 giải Nhì, 33 giải Ba',
  '1 huy chương Vàng, 2 huy chương Bạc, 4 huy chương Đồng',
  '3 giải Nhì, 2 giải Ba',
  '1 giải Nhì, 6 giải Ba'
]);
console.log('Section media files, three videos, exact Word competition names and award-only descriptions verified.');
