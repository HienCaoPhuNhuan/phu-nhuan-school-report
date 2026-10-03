// Keep report terminology and quantities intact without changing source text.
const phrases = [
  'Phó hiệu trưởng', 'Hiệu trưởng', 'Phó chủ tịch', 'Chủ tịch', 'Phó bí thư', 'Bí thư',
  'Phó trưởng ban', 'Trưởng ban', 'cấp ủy viên', 'cấp ủy', 'ủy viên', 'Ban Chấp hành',
  'Ban Thường vụ', 'tổ Văn phòng', 'tổ chuyên môn', 'tổ trưởng', 'chi đoàn', 'đảng viên',
  'công đoàn viên', 'đoàn viên', 'thành viên', 'huy chương Vàng', 'huy chương Bạc',
  'huy chương Đồng', 'huy chương', 'giải Nhất', 'giải Nhì', 'giải Ba', 'giải Khuyến khích',
  'học sinh giỏi', 'học sinh', 'giáo viên', 'nhân viên', 'phụ huynh', 'cha mẹ',
  'nhà trường', 'năm học', 'học tập', 'rèn luyện', 'chuyên môn', 'đại học', 'cao đẳng',
  'tốt nghiệp', 'trúng tuyển', 'kỹ năng sống', 'kỹ năng', 'hướng nghiệp', 'ngoại khóa',
  'câu lạc bộ', 'nghiên cứu', 'khoa học', 'công nghệ', 'chuyển đổi số', 'năng lực số',
  'trí tuệ nhân tạo', 'giáo dục', 'đào tạo', 'thi đua', 'khen thưởng', 'thành tích',
  'học bổng', 'thiện nguyện', 'cộng đồng', 'gia đình', 'xã hội', 'thể thao', 'thể chất',
  'nghệ thuật', 'âm nhạc', 'mỹ thuật', 'ngoại ngữ', 'tin học', 'tích hợp', 'liên môn',
  'kiểm tra', 'đánh giá', 'thực hành', 'trải nghiệm', 'phát triển', 'cơ sở', 'vật chất',
  'học đường', 'chủ nhiệm', 'hạnh phúc', 'an toàn', 'Cờ vua', 'Cờ tướng', 'Cầu lông',
  'Bóng bàn', 'Điền kinh'
];
const literal = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+');
const terms = phrases.sort((a, b) => b.length - a.length).map(literal).join('|');
const quantity = '\\d[\\d.,]*(?:[–-]\\d[\\d.,]*)?';
const units = `(?:lớp\\s+(?:10|11|12)|khối\\s+(?:10|11|12)|tiết\\s*/\\s*tuần|${terms}|đồng|lớp|tiết|giải)`;
const protectedPattern = new RegExp(`(?<![\\p{L}\\p{N}])(?:${quantity}\\s+${units}|${terms})(?![\\p{L}\\p{N}])`, 'giu');

export function phraseSegments(text) {
  const segments = [];
  let start = 0;
  for (const match of text.matchAll(protectedPattern)) {
    if (match.index > start) segments.push({ text: text.slice(start, match.index), keep: false });
    segments.push({ text: match[0], keep: true });
    start = match.index + match[0].length;
  }
  if (start < text.length) segments.push({ text: text.slice(start), keep: false });
  return segments;
}

export function paragraphUnits(text) {
  return phraseSegments(text).flatMap(segment => segment.keep ? [segment.text] : segment.text.match(/\S+/g) || []);
}

export function protectPhrases(root) {
  const paragraphs = root.matches?.('p') ? [root] : [...root.querySelectorAll('p')];
  for (const paragraph of paragraphs) {
    if (paragraph.matches('.eyebrow') || paragraph.closest('figcaption')) continue;
    const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      if (!walker.currentNode.parentElement.closest('.keep-together, .money-amount, .counter, svg')) nodes.push(walker.currentNode);
    }
    for (const node of nodes) {
      const segments = phraseSegments(node.textContent);
      if (!segments.some(segment => segment.keep)) continue;
      node.replaceWith(...segments.map(segment => {
        if (!segment.keep) return document.createTextNode(segment.text);
        const span = document.createElement('span');
        span.className = 'keep-together';
        span.textContent = segment.text;
        return span;
      }));
    }
  }
}
