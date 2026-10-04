import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { sections, renderReport } from '../sections.js';

// Independent baseline transcribed from the Word headings and paragraph order.
const groups = [
  ['Mở đầu', ['mo-dau']],
  ['Phần 1 / A', ['doi-ngu', 'tong-quan', 'to-chuc']],
  ['Phần 1 / B.1', ['ren-luyen']],
  ['Phần 1 / B.2', ['chuyen-mon', 'huong-nghiep']],
  ['Phần 1 / B.3', ['cau-lac-bo', 'ky-nang', 'ngoai-khoa']],
  ['Phần 1 / B.4', ['cong-dong', 'hoc-bong', 'se-chia', 'tri-an', 'nha-tinh-ban', 'nong-thon-moi', 'qua-xuan']],
  ['Kết quả học sinh', ['ket-qua', 'tot-nghiep']],
  ['Kết quả dạy và học', ['toan-may-tinh', 'thanh-tich', 'khoa-hoc', 'olympic-30-4', 'olympic-thanh-pho']],
  ['Thành tích', ['the-thao', 'clb-noi-bat', 'doan-thanh-nien', 'thi-dua']],
  ['Chủ đề năm học mới', ['dinh-huong']],
  ['Phần 2 / I.1', ['doi-moi', 'de-an', 'dinh-huong-phat-trien', 'co-so-vat-chat', 'moi-truong-giao-duc']],
  ['Phần 2 / I.2-4', ['muc-tieu-hoc-sinh', 'muc-tieu-doi-ngu', 'dong-hanh']],
  ['Phần 2 / II.1', ['chuyen-doi-so', 'danh-gia']],
  ['Phần 2 / II.2', ['trai-nghiem', 'chuong-trinh', 'phat-trien']],
  ['Phần 2 / II.3-4', ['phat-trien-doi-ngu', 'nguon-luc']],
  ['Chỉ tiêu phấn đấu', ['chi-tieu-tap-the', 'chi-tieu-thi-dua', 'chi-tieu']],
  ['Kết thúc', ['cam-on']]
];
const expected = groups.flatMap(([, ids]) => ids);
assert.deepEqual(sections.map(([id]) => id), expected);
const photos = JSON.parse(await readFile(new URL('../assets/photos/manifest.json', import.meta.url), 'utf8'));
const html = renderReport(photos);
assert.deepEqual([...html.matchAll(/<section id="([^"]+)"/g)].map(match => match[1]), expected);
const fragments = new Map([...html.matchAll(/<section id="([^"]+)"[\s\S]*?<\/section>/g)].map(match => [match[1], match[0]]));
for (const [id, phrases] of [
  ['dong-hanh', ['tham gia đánh giá chất lượng nhà trường và giáo viên', 'hệ thống quản lý thông tin', 'đóng góp ý kiến kịp thời']],
  ['doan-thanh-nien', ['giai đoạn 2022–2025', 'UBND phường Đức Nhuận', 'Làm theo lời Bác', 'Tháng Thanh niên', 'Xuân tình nguyện lần thứ 17', 'tình nguyện hè']],
  ['nguon-luc', ['xã hội hóa', 'nguồn lực đầu tư']],
  ['chi-tieu', ['Không có học sinh học lực Chưa đạt.', '50–80%']],
  ['nha-tinh-ban', ['Dư Thị Yến Nhi', '11A7', 'Cầu Kiệu']]
]) for (const phrase of phrases) assert(fragments.get(id).includes(phrase), `${id}: ${phrase}`);
const graduation = fragments.get('tot-nghiep');
assert(graduation.indexOf('Điểm TB 3 môn') < graduation.indexOf('28,00 điểm'));
assert(graduation.indexOf('28,00 điểm') < graduation.indexOf('điểm 10 môn'));
assert(graduation.indexOf('điểm 10 môn') < graduation.indexOf('Trúng tuyển đại học'));
assert.equal(new Set(expected).size, expected.length);
console.log(`Word outline order verified: ${expected.length} topics in ${groups.length} source groups.`);
