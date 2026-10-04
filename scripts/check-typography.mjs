import assert from 'node:assert/strict';
import { phraseSegments, paragraphUnits } from '../typography.js';

for (const phrase of ['2 lớp 10', '1 phó chủ tịch', '1 huy chương Bạc', '60.000.000 đồng',
  '2 Phó hiệu trưởng', '1 tổ Văn phòng', '5 ủy viên', '2 tiết / tuần', 'học sinh giỏi',
  'hoạt động', 'Tiếng Anh', 'sở thích', 'công tác', 'giai đoạn', 'áp lực', 'khối 10',
  'đuối nước', 'kỷ cương', 'chất lượng', '28,00 điểm', '15,1 điểm']) {
  const source = `Nội dung: ${phrase}; tiếp tục.`;
  const segments = phraseSegments(source);
  assert.equal(segments.map(segment => segment.text).join(''), source);
  assert(segments.some(segment => segment.keep && segment.text === phrase), phrase);
  assert(paragraphUnits(source).includes(phrase), phrase);
}
assert.deepEqual(phraseSegments('xnhà trườngy'), [{ text: 'xnhà trườngy', keep: false }]);
console.log('Typography phrases and quantity units remain intact.');
