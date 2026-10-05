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
  'Bóng bàn', 'Điền kinh', 'hoạt động', 'sở thích', 'công tác', 'Tiếng Anh',
  'giai đoạn', 'áp lực', 'khối 10', 'khối 11', 'khối 12', 'đuối nước',
  'kỷ cương', 'chất lượng', 'quốc tế', 'chứng chỉ', 'nước ngoài', 'kiến thức',
  'Thành phố', 'toàn quốc', 'Quốc gia', 'Vật lí', 'Lịch sử', 'Lao động',
  'Tiên tiến', 'Xuất sắc', 'khối chuyên', 'Phú Nhuận', 'kinh nghiệm',
  'đội ngũ', 'tổ chức', 'quy mô', 'nhân sự', 'đạo đức', 'tác phong', 'trang phục',
  'chuyên cần', 'kỷ luật', 'văn hóa', 'ứng xử', 'tư vấn', 'tuyển sinh', 'tâm lý',
  'truyền thống', 'đoàn thể', 'thiên tai', 'quyên góp', 'tri ân', 'chính sách',
  'tình bạn', 'nông thôn', 'phương châm', 'lý luận', 'thực tiễn', 'trách nhiệm',
  'công dân', 'tinh thần', 'bản lĩnh', 'chính trị', 'phẩm chất', 'tận tâm',
  'yêu nghề', 'mến trẻ', 'gương mẫu', 'sư phạm', 'năng lượng', 'tích cực',
  'đồng cảm', 'khởi nghiệp', 'nguồn lực', 'tài chính', 'tự học', 'môi trường',
  'Hồ Chí Minh', 'vượt khó', 'nhân văn', 'đáp nghĩa', 'Hội trại',
  'phong trào', 'thanh niên', 'thanh thiếu nhi', 'Giấy khen', 'Bằng khen',
  'Thành Đoàn', 'Đức Nhuận', 'học tốt', 'đóng góp', 'ý kiến', 'chặt chẽ',
  'điều hành', 'đồng hành', 'mẫu mực', 'toàn diện', 'hợp lý', 'kịp thời',
  'sâu sát', 'hiệu quả', 'hiện đại', 'tự chọn', 'hội nhập', 'chương trình',
  'phòng chống', 'bạo lực', 'thuốc lá', 'giao thông', 'cá nhân', 'quản lý',
  'đổi mới', 'tư duy', 'chuyển biến', 'mạnh mẽ', 'kết quả', 'thực chất',
  'Kỹ thuật', 'cầm tay', 'Chú Ve con', 'máy tính'
];
const literal = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+');
const terms = phrases.sort((a, b) => b.length - a.length).map(literal).join('|');
const quantity = '\\d[\\d.,]*(?:[–-]\\d[\\d.,]*)?';
const units = `(?:lớp\\s+(?:10|11|12)|khối\\s+(?:10|11|12)|tiết\\s*/\\s*tuần|${terms}|đồng|lớp|tiết|giải|điểm|bài)`;
const protectedPattern = new RegExp(`(?<![\\p{L}\\p{N}])(?:${quantity}\\s+${units}|${quantity}%|\\d{4}[–-]\\d{4}|${terms})(?![\\p{L}\\p{N}])`, 'giu');

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
  const paragraphs = root.matches?.('p,h3') ? [root] : [...root.querySelectorAll('p,h3')];
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

function measureLines(p) {
  const words = [];
  const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    if (walker.currentNode.parentElement.closest('svg')) continue;
    for (const match of walker.currentNode.textContent.matchAll(/\S+/g)) {
      const range = document.createRange();
      range.setStart(walker.currentNode, match.index);
      range.setEnd(walker.currentNode, match.index + match[0].length);
      const rect = range.getBoundingClientRect();
      if (rect.width) words.push({ rect, meaningful: /[\p{L}\p{N}]/u.test(match[0]) });
    }
  }
  const font = parseFloat(getComputedStyle(p).fontSize);
  const lines = [];
  words.forEach(({ rect, meaningful }) => {
    let line = lines.find(item => Math.abs(item.top - rect.top) < 3);
    if (!line) { line = { top: rect.top, words: [], meaningful: 0 }; lines.push(line); }
    line.words.push(rect);
    if (meaningful) line.meaningful++;
  });
  const gaps = lines.slice(0, -1).flatMap(line => line.words.slice(1).map((word, i) =>
    (word.left - line.words[i].right) / font));
  const largestGap = Math.max(0, ...gaps);
  return { lines, largestGap };
}

function clearTail(p) {
  p.querySelectorAll('.paragraph-tail').forEach(tail => tail.replaceWith(...tail.childNodes));
  p.querySelectorAll('.keep-together').forEach(span => { if (!span.textContent.trim()) span.remove(); });
  p.normalize();
}

function keepLastWords(p) {
  const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
  const words = [];
  let end;
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement.closest('svg')) continue;
    end = node;
    for (const match of node.textContent.matchAll(/\S+/g)) {
      if (/[\p{L}\p{N}]/u.test(match[0])) words.push({ node, offset: match.index });
    }
  }
  if (words.length < 2) return;
  const start = words.at(-2);
  const phrase = start.node.parentElement.closest('.keep-together, .money-amount');
  const range = document.createRange();
  if (phrase) range.setStartBefore(phrase);
  else range.setStart(start.node, start.offset);
  range.setEnd(end, end.textContent.length);
  const tail = document.createElement('span');
  tail.className = 'keep-together paragraph-tail';
  tail.append(range.extractContents());
  range.insertNode(tail);
  p.querySelectorAll('.keep-together').forEach(span => { if (!span.textContent.trim()) span.remove(); });
}

export function refineParagraphs(root) {
  const paragraphs = root.matches?.('p') ? [root] : [...root.querySelectorAll('p')];
  for (const p of paragraphs) {
    if (p.matches('.eyebrow')) continue;
    p.classList.remove('relaxed-align', 'balanced-ending');
    p.style.removeProperty('font-size');
    clearTail(p);
    if (!p.dataset.separatorLines && p.closest('.metric, .featured-metric, .organization-grid')) {
      const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
      const separators = [];
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.textContent.includes(' · ')) separators.push(node);
      }
      for (const node of separators) {
        const parts = node.textContent.split(' · ');
        node.replaceWith(...parts.flatMap((part, i) => i < parts.length - 1
          ? [document.createTextNode(part + ' · '), document.createElement('br')]
          : [document.createTextNode(part)]));
      }
      if (p.closest('.organization-grid')) {
        const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
        const clauses = [];
        while (walker.nextNode()) if (walker.currentNode.textContent.includes('; ')) clauses.push(walker.currentNode);
        for (const node of clauses) {
          const parts = node.textContent.split('; ');
          node.replaceWith(...parts.flatMap((part, i) => i < parts.length - 1
            ? [document.createTextNode(part + '; '), document.createElement('br')]
            : [document.createTextNode(part)]));
        }
      }
      p.dataset.separatorLines = 'true';
    }
    const base = parseFloat(getComputedStyle(p).fontSize);
    let best = { size: base, gap: Infinity };
    // Small, content-measured adjustments keep justification readable and large.
    const factors = [1, 1.02, 1.04, 1.06, 1.08, 1.1, 1.12, 1.14, 0.98, 0.96, 0.94, 0.92, 0.9, 0.88, 0.86];
    for (const factor of factors) {
      clearTail(p);
      const size = Math.max(18, Math.min(60, base * factor));
      p.style.fontSize = size + 'px';
      let measured = measureLines(p);
      if (measured.lines.length > 1 && measured.lines.at(-1).meaningful === 1) {
        keepLastWords(p);
        measured = measureLines(p);
      }
      if (measured.largestGap < best.gap) best = { size, gap: measured.largestGap };
      if (measured.largestGap <= 0.6) break;
    }
    clearTail(p);
    p.style.fontSize = best.size + 'px';
    const { lines } = measureLines(p);
    if (lines.length > 1 && lines.at(-1).meaningful === 1) keepLastWords(p);
  }
}
