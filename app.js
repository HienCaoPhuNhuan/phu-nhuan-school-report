import { format, renderReport } from './sections.js?v=20261003-5';
import { paginateReport } from './pagination.js?v=20261003-5';

const response = await fetch(new URL('./assets/photos/manifest.json', import.meta.url));
if (!response.ok) throw new Error('Photo manifest could not be loaded');
document.querySelector('#main').innerHTML = renderReport(await response.json());
function renderIcons() { window.lucide?.createIcons({ attrs: { 'stroke-width': 1.7 } }); }
renderIcons();
window.addEventListener('load', renderIcons, { once: true });
await document.fonts.ready;
const main = document.querySelector('#main');
const originals = [...main.children].map(node => node.cloneNode(true));
let nodes = paginateReport(main, originals);
const systemMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let reducedMotion = systemMotion.matches;
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
  if (reducedMotion) finishCounters();
  clearInterval(reelInterval);
  if (!reducedMotion) reelInterval = setInterval(advanceReels, 6500);
}
applyMotion();
systemMotion.addEventListener('change', event => { reducedMotion = event.matches; applyMotion(); });
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

let presentedIndex = -1;
let transitionScheduled = false;
function updateSectionTransition() {
  transitionScheduled = false;
  const marker = innerHeight * 0.4;
  let nextIndex = 0;
  nodes.forEach((node, i) => { if (node.getBoundingClientRect().top <= marker) nextIndex = i; });
  if (nextIndex === presentedIndex) return;
  const direction = nextIndex < presentedIndex ? 'backward' : 'forward';
  if (presentedIndex >= 0) nodes[presentedIndex]?.classList.remove('section-arriving');
  const next = nodes[nextIndex];
  next.dataset.direction = direction;
  next.classList.add('section-arriving');
  presentedIndex = nextIndex;
}
window.addEventListener('scroll', () => {
  if (transitionScheduled) return;
  transitionScheduled = true;
  requestAnimationFrame(updateSectionTransition);
}, { passive: true });
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const current = nodes[sectionIndex()];
    const parent = current.dataset.parentId;
    const part = Number(current.dataset.part || 1);
    revealObserver.disconnect();
    reelObserver.disconnect();
    visibleReels.clear();
    numberAnimations.forEach(frame => cancelAnimationFrame(frame));
    numberAnimations.clear();
    nodes = paginateReport(main, originals);
    document.querySelectorAll('.reveal').forEach(node => revealObserver.observe(node));
    document.querySelectorAll('[data-reel]').forEach(node => reelObserver.observe(node));
    if (reducedMotion) finishCounters();
    const matches = nodes.filter(node => node.dataset.parentId === parent);
    const target = matches[Math.min(part, matches.length) - 1] || nodes[0];
    presentedIndex = -1;
    goTo(nodes.indexOf(target), true);
    updateSectionTransition();
  }, 180);
});
updateSectionTransition();

let navigationUntil = 0;
function sectionIndex() {
  let index = 0;
  nodes.forEach((node, i) => { if (node.getBoundingClientRect().top <= 2) index = i; });
  return index;
}
function goTo(index, instant = false) {
  const targetIndex = Math.max(0, Math.min(index, nodes.length - 1));
  const top = nodes[targetIndex].getBoundingClientRect().top + scrollY;
  window.scrollTo({ top, behavior: reducedMotion || instant ? 'instant' : 'smooth' });
  navigationUntil = performance.now() + (reducedMotion || instant ? 0 : 900);
  history.replaceState(null, '', '#' + nodes[targetIndex].id);
}
// Treat a wheel/trackpad burst as exactly one full-screen page turn.
let lastWheelAt = 0;
let wheelTurnTaken = false;
let wheelDistance = 0;
window.addEventListener('wheel', event => {
  if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY) return;
  const now = performance.now();
  if (now - lastWheelAt > 180) {
    wheelTurnTaken = false;
    wheelDistance = 0;
  }
  lastWheelAt = now;
  if (wheelTurnTaken || now < navigationUntil) { event.preventDefault(); return; }
  const index = sectionIndex();
  const direction = Math.sign(event.deltaY);
  event.preventDefault();
  wheelDistance += event.deltaY * (event.deltaMode === 1 ? 24 : event.deltaMode === 2 ? innerHeight : 1);
  if (Math.abs(wheelDistance) < 24) return;
  wheelTurnTaken = true;
  goTo(index + direction);
}, { passive: false });
document.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target.closest('input, textarea, select, button, [contenteditable="true"]')) return;
  const direction = ['ArrowDown', 'PageDown'].includes(event.key) ? 1 : ['ArrowUp', 'PageUp'].includes(event.key) ? -1 : 0;
  if (direction) { event.preventDefault(); goTo(sectionIndex() + direction); }
  if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); goTo(event.key === 'Home' ? 0 : nodes.length - 1); }
});
const initialIndex = nodes.findIndex(node => location.hash === '#' + node.id);
if (initialIndex >= 0) requestAnimationFrame(() => goTo(initialIndex, true));
window.addEventListener('hashchange', () => {
  const index = nodes.findIndex(node => location.hash === '#' + node.id);
  if (index >= 0) goTo(index);
});
