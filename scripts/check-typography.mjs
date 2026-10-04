import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { phraseSegments, paragraphUnits } from '../typography.js';

for (const phrase of ['2 lớp 10', '1 phó chủ tịch', '1 huy chương Bạc', '60.000.000 đồng',
  '2 Phó hiệu trưởng', '1 tổ Văn phòng', '5 ủy viên', '2 tiết / tuần', 'học sinh giỏi',
  'hoạt động', 'Tiếng Anh', 'sở thích', 'công tác', 'giai đoạn', 'áp lực', 'khối 10',
  'đuối nước', 'kỷ cương', 'chất lượng', '28,00 điểm', '15,1 điểm',
  '2025–2026', '2022–2025', '50–80%', '97,53%', 'Hồ Chí Minh',
  'vượt khó', 'nhân văn', 'đáp nghĩa', 'Hội trại']) {
  const source = `Nội dung: ${phrase}; tiếp tục.`;
  const segments = phraseSegments(source);
  assert.equal(segments.map(segment => segment.text).join(''), source);
  assert(segments.some(segment => segment.keep && segment.text === phrase), phrase);
  assert(paragraphUnits(source).includes(phrase), phrase);
}
assert.deepEqual(phraseSegments('xnhà trườngy'), [{ text: 'xnhà trườngy', keep: false }]);
const css = await readFile(new URL('../presentation.css', import.meta.url), 'utf8');
assert.match(css, /text-align:\s*justify/);
assert.doesNotMatch(css, /\.slide-text\s+p\.relaxed-align/);
assert.doesNotMatch(css, /text-wrap:\s*balance\b/);
assert.match(css, /\.keep-together\s*\{[^}]*white-space:\s*nowrap/);
assert.match(css, /@keyframes\s+motto-highlight/);
console.log('Typography phrases and quantity units remain intact.');
