import { escape, sections } from './sections.js?v=20261006-1';

export function installSectionMedia(main, manifest) {
  const ready = [];
  sections.forEach(([id, label], index) => {
    const section = main.querySelector('#' + id);
    section.querySelectorAll('.photo-reel, .photo-wall').forEach(node => node.remove());
    const items = manifest[String(index).padStart(2, '0')] || [];
    if (!items.length) return;
    if (id === 'mo-dau' || id === 'cam-on') {
      section.querySelector('.hero-image img, .closing-image img').src = items[0].src;
      return;
    }
    const reel = document.createElement('figure');
    reel.className = 'photo-reel section-media';
    reel.dataset.reel = '';
    reel.dataset.curated = 'true';
    if (items.some(item => item.type === 'video')) reel.dataset.fullscreen = 'true';
    reel.innerHTML = `<div class="reel-viewport">${items.map((item, i) =>
      `<div class="reel-frame ${i ? '' : 'active'}" aria-hidden="${Boolean(i)}">${item.type === 'video'
        ? `<video src="${escape(item.src)}" poster="${escape(item.poster)}" muted playsinline preload="none" aria-label="${escape(label + ' · Video ' + (i + 1))}"></video>`
        : `<img src="${escape(item.src)}" width="${item.width}" height="${item.height}" alt="${escape(label + ' · Ảnh ' + (i + 1))}" loading="lazy" decoding="async">`}</div>`).join('')}</div>`;
    if (id === 'cau-lac-bo') {
      const families = [...section.querySelectorAll('.club-family')];
      const groups = [[], [], []];
      items.forEach((item, i) => {
        const group = /CLB (Nghiên cứu|Tin học|Vật lý|Hóa học|Tiếng Anh)/i.test(item.source) ? 0
          : /CÔNG TÁC XÃ HỘI|CLB Tâm lý|Báo chí/i.test(item.source) ? 2 : 1;
        groups[group].push(reel.querySelectorAll('.reel-frame')[i]);
      });
      families.forEach((family, i) => {
        const gallery = reel.cloneNode(false);
        gallery.className = 'photo-reel poster-reel';
        const viewport = document.createElement('div');
        viewport.className = 'reel-viewport';
        groups[i].forEach((frame, j) => {
          frame.classList.toggle('active', j === 0);
          frame.setAttribute('aria-hidden', String(j !== 0));
          viewport.append(frame);
        });
        gallery.append(viewport);
        gallery.querySelector('img').loading = 'eager';
        family.querySelector('h3').after(gallery);
        ready.push(gallery.querySelector('img').decode().catch(() => {}));
      });
      return;
    }
    (section.querySelector(':scope > .wrap') || section).append(reel);
    if (!section.classList.contains('section')) {
      const background = section.querySelector('.hero-image img, .closing-image img');
      if (background && items[0].type === 'image') background.src = items[0].src;
    }
  });
  return Promise.all(ready);
}
