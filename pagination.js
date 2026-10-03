import { protectPhrases, paragraphUnits } from './typography.js?v=20261003-8';

const grouped = new Set(['metric-grid', 'note-list', 'feature-list', 'organization-grid',
  'perfect-scores', 'club-families', 'direction-list', 'program-grid', 'infrastructure',
  'target-grid', 'partnership-grid', 'photo-wall', 'motto', 'score-comparison']);

const illustratedTopics = new Set(['doi-ngu', 'ren-luyen', 'chuyen-mon', 'ky-nang',
  'huong-nghiep', 'ngoai-khoa', 'hoc-bong', 'cong-dong', 'chuyen-doi-so',
  'danh-gia', 'chuong-trinh', 'co-so-vat-chat']);

const enlargedTopics = new Set(['ren-luyen', 'chuyen-mon', 'clb-noi-bat', 'ky-nang',
  'huong-nghiep', 'ngoai-khoa', 'hoc-bong', 'cong-dong', 'de-an', 'chuyen-doi-so',
  'danh-gia', 'chuong-trinh', 'phat-trien', 'phat-trien-doi-ngu']);
const highlightedTopics = new Map([
  ['cau-lac-bo', 'Nhà trường cấp giấy chứng nhận'],
  ['chi-tieu', 'Không có học sinh học lực Chưa đạt.'],
  ['chi-tieu-thi-dua', 'Phấn đấu Lao động Tiên tiến,']
]);

function curatePhotos(originals) {
  const used = new Set();
  return originals.map(original => {
    const source = original.cloneNode(true);
    const highlight = highlightedTopics.get(source.id);
    if (highlight) source.querySelectorAll('p').forEach(p => {
      if (p.textContent.trim().startsWith(highlight)) p.classList.add('report-highlight');
    });
    protectPhrases(source);
    source.querySelectorAll('.photo-wall').forEach(wall => wall.remove());
    let selected = false;
    source.querySelectorAll('.photo-reel').forEach(reel => {
      const poster = Boolean(reel.closest('.club-family'));
      if (!poster && (!illustratedTopics.has(source.id) || selected)) { reel.remove(); return; }
      if (!poster) selected = true;
      reel.querySelectorAll('.reel-frame').forEach(frame => {
        const src = frame.querySelector('img').getAttribute('src');
        if (used.has(src)) frame.remove();
        else used.add(src);
      });
      const frames = [...reel.querySelectorAll('.reel-frame')];
      if (!frames.length) { reel.remove(); return; }
      frames.forEach((frame, i) => {
        frame.classList.toggle('active', i === 0);
        frame.setAttribute('aria-hidden', String(i !== 0));
      });
      reel.querySelectorAll('.reel-indicators span').forEach((dot, i) => {
        if (i >= frames.length) dot.remove();
        else dot.classList.toggle('active', i === 0);
      });
    });
    source.querySelectorAll('.hero-image img, .closing-image img').forEach(image => used.add(image.getAttribute('src')));
    return source;
  });
}

function groupClone(source, children) {
  const clone = source.cloneNode(false);
  clone.append(...children.map(child => child.cloneNode(true)));
  clone.style.setProperty('--columns', children.length);
  return clone;
}

function blocks(source, narrow) {
  if (source.classList.contains('story-layout') || source.classList.contains('story-text')) {
    return [...source.children].flatMap(child => blocks(child, narrow));
  }
  const group = [...source.classList].find(name => grouped.has(name));
  if (!group) return [source.cloneNode(true)];
  const maximum = narrow ? 1 : source.classList.contains('overview-grid') || group === 'perfect-scores' ? 4 :
    ['organization-grid', 'partnership-grid'].includes(group) || source.classList.contains('money-grid') ? 2 : 3;
  const children = [...source.children];
  const result = [];
  for (let i = 0; i < children.length; i += maximum) {
    result.push(groupClone(source, children.slice(i, i + maximum)));
  }
  return result;
}

function splitBlock(block) {
  if ([...block.classList].some(name => grouped.has(name)) && block.children.length > 1) {
    return [...block.children].map(child => groupClone(block, [child]));
  }
  const club = block.querySelector('.club-family');
  if (club && club.children.length > 1) {
    return [...club.children].map(child => {
      const item = club.cloneNode(false);
      item.append(child.cloneNode(true));
      return groupClone(block, [item]);
    });
  }
  // A single long paragraph can continue on the next page without losing words.
  const paragraph = block.matches('p') ? block : block.querySelector('p');
  if (!paragraph) return null;
  const textNode = paragraph.closest('.note-list') ? paragraph.querySelector(':scope > span') : paragraph;
  const words = paragraphUnits(textNode.textContent.trim());
  if (words.length < 2) return null;
  const middle = Math.ceil(words.length / 2);
  return [words.slice(0, middle), words.slice(middle)].map(part => {
    const clone = block.cloneNode(true);
    const p = clone.matches('p') ? clone : clone.querySelector('p');
    const target = p.closest('.note-list') ? p.querySelector(':scope > span') : p;
    const text = part.join(' ');
    const fragments = [];
    let start = 0;
    for (const match of text.matchAll(/\b\d[\d.]* đồng/g)) {
      fragments.push(document.createTextNode(text.slice(start, match.index)));
      const amount = document.createElement('span');
      amount.className = 'money-amount';
      amount.textContent = match[0];
      fragments.push(amount);
      start = match.index + match[0].length;
    }
    fragments.push(document.createTextNode(text.slice(start)));
    target.replaceChildren(...fragments);
    protectPhrases(p);
    return clone;
  });
}

export function paginateReport(main, originals) {
  document.documentElement.style.setProperty('--page-height', window.innerHeight + 'px');
  const narrow = innerWidth < 700;
  main.replaceChildren();
  for (const original of curatePhotos(originals)) {
    if (!original.classList.contains('section')) {
      const clone = original.cloneNode(true);
      clone.dataset.parentId = original.id;
      main.append(clone);
      continue;
    }
    const originalWrap = original.querySelector('.wrap');
    const heading = originalWrap.querySelector('.section-heading');
    const queue = [...originalWrap.children].filter(node => node !== heading)
      .flatMap(node => blocks(node, narrow));
    const photoIndex = queue.findIndex(node => node.classList.contains('photo-reel'));
    const candidate = photoIndex >= 0 ? queue.splice(photoIndex, 1)[0] : null;
    const wordCount = queue.map(node => node.textContent).join(' ').trim().split(/\s+/).length;
    const photo = wordCount < 100 || original.id === 'doi-ngu' ? candidate : null;
    const pages = [];
    function createPage() {
      const page = original.cloneNode(false);
      if (enlargedTopics.has(original.id)) page.classList.add('projection-focus');
      page.id = pages.length ? original.id + '--' + (pages.length + 1) : original.id;
      page.dataset.parentId = original.id;
      const wrap = originalWrap.cloneNode(false);
      const title = heading.cloneNode(true);
      const h2 = title.querySelector('h2');
      if (innerWidth >= 1000) h2.querySelectorAll('br').forEach(br => br.replaceWith(document.createTextNode(' ')));
      h2.id = page.id + '-title';
      page.setAttribute('aria-labelledby', h2.id);
      const part = document.createElement('span');
      part.className = 'page-part';
      title.querySelector('.eyebrow').append(part);
      const body = document.createElement('div');
      body.className = 'slide-body';
      const text = document.createElement('div');
      text.className = 'slide-text';
      body.append(text);
      if (photo && !pages.length && !narrow && innerHeight >= 550) {
        page.classList.add('with-photo');
        const visual = document.createElement('div');
        visual.className = 'slide-visual';
        visual.append(photo);
        body.append(visual);
      }
      wrap.append(title, body);
      page.append(wrap);
      main.append(page);
      pages.push(page);
      return text;
    }
    let body = createPage();
    while (queue.length) {
      const block = queue.shift();
      body.append(block);
      const contentBottom = block.getBoundingClientRect().bottom;
      const available = body.parentElement.getBoundingClientRect();
      const fits = contentBottom <= available.bottom - 4 &&
        block.scrollWidth <= body.clientWidth + 1 &&
        [...block.querySelectorAll('strong,h3,p')].every(node => node.scrollWidth <= node.clientWidth + 1);
      if (fits) continue;
      block.remove();
      if (body.children.length) {
        body = createPage();
        queue.unshift(block);
        continue;
      }
      const pieces = splitBlock(block);
      if (!pieces) throw new Error('Content cannot fit on one page: ' + original.id);
      queue.unshift(...pieces);
    }
    pages.forEach((page, i) => {
      const text = page.querySelector('.slide-text');
      const heading = page.querySelector('.section-heading');
      const visual = page.querySelector('.slide-visual');
      // Enlarge short pages using their measured content, not stretched gaps.
      if (page.classList.contains('projection-focus') && innerWidth >= 1000 && innerHeight >= 600) {
        const base = innerHeight >= 900 ? 44 : 40;
        for (let size = base + 2; size <= 60; size += 2) {
          page.style.setProperty('--projection-font', size + 'px');
          const used = heading.offsetHeight + Math.max(text.offsetHeight, visual?.offsetHeight || 0) + 36;
          const overflow = [...text.querySelectorAll('p,h3,strong')].some(n => n.scrollWidth > n.clientWidth + 1);
          if (used > innerHeight * 0.86 || overflow) {
            page.style.setProperty('--projection-font', (size - 2) + 'px');
            break;
          }
        }
      }
      const height = heading.offsetHeight + Math.max(text.offsetHeight, visual?.offsetHeight || 0) + 24;
      if (height < innerHeight * 0.75) {
        page.classList.add('compact-page');
      }
      page.querySelector('.page-part').textContent = pages.length > 1 ? (i + 1) + ' / ' + pages.length : '';
      page.dataset.part = String(i + 1);
      page.dataset.parts = String(pages.length);
    });
  }
  return [...main.children];
}
