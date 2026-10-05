import { escape, sections } from './sections.js?v=20261005-1';

export function installSectionMedia(main, manifest) {
  sections.forEach(([id, label], index) => {
    const section = main.querySelector('#' + id);
    section.querySelectorAll('.photo-reel, .photo-wall').forEach(node => node.remove());
    const items = manifest[String(index).padStart(2, '0')] || [];
    if (!items.length) return;
    const reel = document.createElement('figure');
    reel.className = 'photo-reel section-media';
    reel.dataset.reel = '';
    reel.dataset.curated = 'true';
    if (items.some(item => item.type === 'video')) reel.dataset.fullscreen = 'true';
    reel.innerHTML = `<div class="reel-viewport">${items.map((item, i) =>
      `<div class="reel-frame ${i ? '' : 'active'}" aria-hidden="${Boolean(i)}">${item.type === 'video'
        ? `<video src="${escape(item.src)}" poster="${escape(item.poster)}" muted playsinline preload="none" aria-label="${escape(label + ' · Video ' + (i + 1))}"></video>`
        : `<img src="${escape(item.src)}" width="${item.width}" height="${item.height}" alt="${escape(label + ' · Ảnh ' + (i + 1))}" loading="lazy" decoding="async">`}</div>`).join('')}</div>`;
    (section.querySelector(':scope > .wrap') || section).append(reel);
    if (!section.classList.contains('section')) {
      const background = section.querySelector('.hero-image img, .closing-image img');
      if (background && items[0].type === 'image') background.src = items[0].src;
    }
  });
}
