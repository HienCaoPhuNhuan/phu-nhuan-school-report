import { sections, chapters, escape, format, icon, renderReport } from './sections.js?v=20261003-2';

const response = await fetch(new URL('./assets/photos/manifest.json', import.meta.url));
if (!response.ok) throw new Error('Photo manifest could not be loaded');
document.querySelector('#main').innerHTML = renderReport(await response.json());
function renderIcons() { window.lucide?.createIcons({ attrs: { 'stroke-width': 1.7 } }); }
renderIcons();
window.addEventListener('load', renderIcons, { once: true });

let motionPreference;
try { motionPreference = localStorage.getItem('report-motion'); } catch { /* Preferences are optional. */ }
const systemMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let reducedMotion = motionPreference ? motionPreference === 'reduced' : systemMotion.matches;
let activeSection = 0;
const nodes = sections.map(([id]) => document.getElementById(id));
const motionButton = document.querySelector('#motion-toggle');
const numberAnimations = new Map();
const visibleReels = new Set();
let reelInterval;

function finishCounters() {
  document.querySelectorAll('.counter').forEach(node => {
    cancelAnimationFrame(numberAnimations.get(node));
    node.textContent = format(Number(node.dataset.value), Number(node.dataset.decimals));
    node.dataset.counted = 'true';
  });
  numberAnimations.clear();
}
function advanceReels() {
  if (reducedMotion || document.hidden) return;
  visibleReels.forEach(reel => {
    const frames = [...reel.querySelectorAll('.reel-frame')];
    if (frames.length < 2) return;
    const current = Math.max(0, frames.findIndex(frame => frame.classList.contains('active')));
    const next = (current + 1) % frames.length;
    const image = frames[next].querySelector('img');
    if (!image.complete || !image.naturalWidth) return;
    frames.forEach((frame, i) => {
      frame.classList.toggle('active', i === next);
      frame.setAttribute('aria-hidden', String(i !== next));
    });
    reel.querySelectorAll('.reel-indicators span').forEach((dot, i) => dot.classList.toggle('active', i === next));
  });
}
function applyMotion() {
  document.documentElement.classList.toggle('reduced-motion', reducedMotion);
  motionButton.setAttribute('aria-pressed', String(reducedMotion));
  motionButton.title = reducedMotion ? 'Bật chuyển động' : 'Giảm chuyển động';
  motionButton.setAttribute('aria-label', motionButton.title);
  motionButton.innerHTML = icon(reducedMotion ? 'play' : 'pause');
  if (reducedMotion) {
    finishCounters();
    document.querySelectorAll('.reveal').forEach(node => node.classList.add('visible'));
  }
  clearInterval(reelInterval);
  if (!reducedMotion) reelInterval = setInterval(advanceReels, 6500);
  renderIcons();
}
applyMotion();
motionButton.addEventListener('click', () => {
  reducedMotion = !reducedMotion;
  motionPreference = reducedMotion ? 'reduced' : 'full';
  try { localStorage.setItem('report-motion', motionPreference); } catch { /* The page works without storage. */ }
  applyMotion();
});
systemMotion.addEventListener('change', event => { if (!motionPreference) { reducedMotion = event.matches; applyMotion(); } });
function animateCounter(node) {
  if (node.dataset.counted) return;
  node.dataset.counted = 'true';
  const value = Number(node.dataset.value);
  const decimals = Number(node.dataset.decimals);
  if (reducedMotion) { node.textContent = format(value, decimals); return; }
  const start = performance.now();
  const tick = now => {
    const progress = Math.min((now - start) / 1500, 1);
    node.textContent = format(value * (1 - Math.pow(1 - progress, 3)), decimals);
    if (progress < 1) numberAnimations.set(node, requestAnimationFrame(tick));
    else numberAnimations.delete(node);
  };
  numberAnimations.set(node, requestAnimationFrame(tick));
}
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    entry.target.querySelectorAll('.counter').forEach(animateCounter);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(node => revealObserver.observe(node));
const reelObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      visibleReels.add(entry.target);
      entry.target.classList.add('in-view');
      entry.target.querySelectorAll('img').forEach(image => { image.loading = 'eager'; });
    } else { visibleReels.delete(entry.target); entry.target.classList.remove('in-view'); }
  });
}, { threshold: 0.15 });
document.querySelectorAll('[data-reel]').forEach(node => reelObserver.observe(node));

document.querySelector('#section-rail').innerHTML = chapters.map(([id, title]) => `<a href="#${id}" title="${escape(title)}" aria-label="${escape(title)}"><span>${escape(title)}</span></a>`).join('');
document.querySelector('#section-menu').innerHTML = sections.map(([id, title], i) => `<a href="#${id}"><span>${String(i + 1).padStart(2, '0')}</span>${escape(title)}</a>`).join('');
const menuButton = document.querySelector('#menu-toggle');
const menu = document.querySelector('#section-menu');
function closeMenu() { menu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); }
menuButton.addEventListener('click', () => { menu.hidden = !menu.hidden; menuButton.setAttribute('aria-expanded', String(!menu.hidden)); });
document.addEventListener('click', event => { if (!menu.hidden && !menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu(); });
function goTo(index, instant = false) {
  const targetIndex = Math.max(0, Math.min(index, nodes.length - 1));
  const top = nodes[targetIndex].getBoundingClientRect().top + scrollY - document.querySelector('.site-header').offsetHeight;
  window.scrollTo({ top, behavior: reducedMotion || instant ? 'instant' : 'smooth' });
  history.replaceState(null, '', `#${sections[targetIndex][0]}`);
  closeMenu();
}
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
  const index = sections.findIndex(([id]) => `#${id}` === link.getAttribute('href'));
  if (index < 0) return;
  event.preventDefault(); goTo(index);
}));
document.querySelector('#previous-section').addEventListener('click', () => goTo(activeSection - 1));
document.querySelector('#next-section').addEventListener('click', () => goTo(activeSection + 1));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') { closeMenu(); return; }
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target.closest('input, textarea, select, button, [contenteditable="true"]')) return;
  const direction = ['ArrowDown', 'PageDown'].includes(event.key) ? 1 : ['ArrowUp', 'PageUp'].includes(event.key) ? -1 : 0;
  if (direction) { event.preventDefault(); goTo(activeSection + direction); }
  if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); goTo(event.key === 'Home' ? 0 : nodes.length - 1); }
});
let scrollScheduled = false;
function updateScroll() {
  const marker = scrollY + Math.min(innerHeight * 0.35, 260);
  let index = 0;
  nodes.forEach((node, i) => { if (node.offsetTop <= marker) index = i; });
  activeSection = index;
  const range = document.documentElement.scrollHeight - innerHeight;
  document.querySelector('.reading-progress span').style.transform = `scaleX(${range > 0 ? Math.min(scrollY / range, 1) : 0})`;
  let chapterIndex = 0;
  chapters.forEach(([, , start], i) => { if (start <= index) chapterIndex = i; });
  document.querySelectorAll('.section-rail a').forEach((link, i) => { if (i === chapterIndex) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
  document.querySelector('#section-position').textContent = `${String(index + 1).padStart(2, '0')} / ${nodes.length}`;
  document.querySelector('#current-section-title').textContent = sections[index][1];
  document.querySelector('#previous-section').disabled = index === 0;
  document.querySelector('#next-section').disabled = index === nodes.length - 1;
  document.querySelector('.site-header').classList.toggle('scrolled', scrollY > 40);
  if (!reducedMotion && scrollY < innerHeight) document.querySelector('.hero-image').style.transform = `translateY(${scrollY * 0.12}px) scale(1.04)`;
  scrollScheduled = false;
}
window.addEventListener('scroll', () => { if (!scrollScheduled) { scrollScheduled = true; requestAnimationFrame(updateScroll); } }, { passive: true });
window.addEventListener('resize', updateScroll);
updateScroll();
document.querySelector('#fullscreen').addEventListener('click', async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
    else throw new Error('Fullscreen unavailable');
  } catch {
    const notice = document.querySelector('#notice');
    notice.textContent = 'Trình duyệt này chưa hỗ trợ chế độ toàn màn hình.';
    notice.hidden = false;
    setTimeout(() => { notice.hidden = true; }, 4000);
  }
});
document.addEventListener('fullscreenchange', () => {
  const button = document.querySelector('#fullscreen');
  const active = Boolean(document.fullscreenElement);
  button.innerHTML = icon(active ? 'minimize' : 'maximize');
  button.title = active ? 'Thoát toàn màn hình' : 'Toàn màn hình';
  button.setAttribute('aria-label', button.title); renderIcons();
});
// Resolve deep links after asynchronous photo metadata has produced the sections.
const initialIndex = sections.findIndex(([id]) => location.hash === `#${id}`);
if (initialIndex >= 0) requestAnimationFrame(() => goTo(initialIndex, true));
