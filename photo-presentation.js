export function createPhotoPresentation(reducedMotion) {
  let section;
  let timer;
  let stage;
  let reel;
  let home;
  let animation;
  let generation = 0;
  const duration = 1000;

  function schedule(callback, delay) {
    clearTimeout(timer);
    timer = setTimeout(callback, delay);
  }
  function reset() {
    generation++;
    clearTimeout(timer);
    animation?.cancel();
    animation = null;
    if (reel && home) home.append(reel);
    stage?.remove();
    stage = null;
    section?.classList.remove('photos-playing');
    if (section) section.dataset.photoPhase = 'reading';
    reel = null;
    home = null;
  }
  function showFrame(index) {
    const frames = [...reel.querySelectorAll('.reel-frame')];
    frames.forEach((frame, i) => {
      frame.classList.toggle('active', i === index);
      frame.setAttribute('aria-hidden', String(i !== index));
    });
    reel.querySelectorAll('.reel-indicators span').forEach((dot, i) => dot.classList.toggle('active', i === index));
  }
  async function expand() {
    const token = generation;
    reel = section?.querySelector('.slide-visual [data-reel]');
    if (!reel || document.hidden) return;
    home = reel.parentElement;
    const images = [...reel.querySelectorAll('img')];
    images.forEach(image => { image.loading = 'eager'; });
    await Promise.all(images.map(image => image.decode().catch(() => {})));
    if (token !== generation) return;
    if (!images.some(image => image.naturalWidth)) { reset(); return; }
    const thumbnail = reel.getBoundingClientRect();
    const title = section.querySelector('.section-heading').getBoundingClientRect();
    stage = document.createElement('div');
    stage.className = 'photo-stage';
    const mobile = document.documentElement.classList.contains('mobile-presentation');
    stage.style.top = mobile ? '0px' : Math.max(16, title.bottom + 16) + 'px';
    stage.style.backgroundColor = getComputedStyle(section).backgroundColor;
    if (mobile) {
      const heading = section.querySelector('.section-heading').cloneNode(true);
      heading.className = 'section-heading gallery-heading';
      heading.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
      stage.append(heading);
    }
    stage.append(reel);
    document.body.append(stage);
    section.classList.add('photos-playing');
    section.dataset.photoPhase = 'expanding';
    reel.classList.add('in-view');
    showFrame(0);
    const expanded = reel.getBoundingClientRect();
    const small = `translate(${thumbnail.left - expanded.left}px, ${thumbnail.top - expanded.top}px) scale(${thumbnail.width / expanded.width}, ${thumbnail.height / expanded.height})`;
    animation = reel.animate([{ transform: small }, { transform: 'none' }], { duration, easing: 'cubic-bezier(.2,.7,.2,1)' });
    await animation.finished.catch(() => {});
    if (token !== generation) return;
    section.dataset.photoPhase = 'viewing';
    let index = 0;
    const frames = [...reel.querySelectorAll('.reel-frame')];
    function next() {
      if (token !== generation) return;
      index++;
      if (index < frames.length) { showFrame(index); schedule(next, 5000); }
      else collapse();
    }
    schedule(next, 5000);
  }
  async function collapse() {
    const token = generation;
    section.dataset.photoPhase = 'collapsing';
    const expanded = reel.getBoundingClientRect();
    const thumbnail = home.getBoundingClientRect();
    animation = reel.animate([{ transform: 'none' }, {
      transform: `translate(${thumbnail.left - expanded.left}px, ${thumbnail.top - expanded.top}px) scale(${thumbnail.width / expanded.width}, ${thumbnail.height / expanded.height})`
    }], { duration, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' });
    await animation.finished.catch(() => {});
    if (token !== generation) return;
    reset();
    startReading();
  }
  function startReading() {
    if (reducedMotion || document.hidden || !section?.querySelector('.slide-visual [data-reel]')) return;
    const words = section.querySelector('.slide-text').textContent.trim().split(/\s+/).length;
    section.dataset.photoPhase = 'reading';
    schedule(expand, Math.max(10000, Math.min(20000, words / 3 * 1000)));
  }
  function setSection(next) {
    if (next === section) return;
    reset();
    section = next;
    startReading();
  }
  document.addEventListener('visibilitychange', () => {
    reset();
    if (!document.hidden) startReading();
  });
  return { setSection, stop: () => { reset(); section = null; } };
}
