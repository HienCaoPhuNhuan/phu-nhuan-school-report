export function createPhotoPresentation(reducedMotion) {
  let section;
  let timer;
  let stage;
  let reel;
  let home;
  let animation;
  let playbackEvents;
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
    playbackEvents?.abort();
    reel?.querySelectorAll('video').forEach(video => { video.pause(); video.currentTime = 0; });
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
    frames.forEach((frame, i) => {
      const video = frame.querySelector('video');
      if (video && i !== index) video.pause();
    });
    const upcoming = frames[index + 1]?.querySelector('video');
    if (upcoming && upcoming.preload !== 'auto') { upcoming.preload = 'auto'; upcoming.load(); }
  }
  async function expand() {
    const token = generation;
    reel = section?.querySelector('.slide-visual [data-reel], .section-media[data-reel]');
    if (!reel || document.hidden) return;
    home = reel.parentElement;
    const images = [...reel.querySelectorAll('img')];
    images.forEach(image => { image.loading = 'eager'; });
    const thumbnail = reel.getBoundingClientRect();
    const title = section.querySelector('.section-heading, .hero-content, .closing-content').getBoundingClientRect();
    stage = document.createElement('div');
    stage.className = 'photo-stage';
    const fullscreen = reel.dataset.fullscreen === 'true' || !section.classList.contains('section');
    stage.classList.toggle('video-stage', reel.dataset.fullscreen === 'true');
    stage.style.top = fullscreen ? '0px' : Math.max(16, title.bottom + 16) + 'px';
    stage.style.backgroundColor = getComputedStyle(section).backgroundColor;
    stage.append(reel);
    document.body.append(stage);
    section.classList.add('photos-playing');
    section.dataset.photoPhase = 'expanding';
    reel.classList.add('in-view');
    playbackEvents = new AbortController();
    showFrame(0);
    const expanded = reel.getBoundingClientRect();
    const small = `translate(${thumbnail.left - expanded.left}px, ${thumbnail.top - expanded.top}px) scale(${thumbnail.width / expanded.width}, ${thumbnail.height / expanded.height})`;
    animation = reel.animate([{ transform: small }, { transform: 'none' }], { duration, easing: 'cubic-bezier(.2,.7,.2,1)' });
    await animation.finished.catch(() => {});
    if (token !== generation) return;
    section.dataset.photoPhase = 'viewing';
    let index = 0;
    const frames = [...reel.querySelectorAll('.reel-frame')];
    function playCurrent() {
      if (token !== generation) return;
      const video = frames[index].querySelector('video');
      if (!video) { schedule(next, 5000); return; }
      video.muted = true;
      video.currentTime = 0;
      video.addEventListener('ended', next, { once: true, signal: playbackEvents.signal });
      video.addEventListener('error', next, { once: true, signal: playbackEvents.signal });
      video.play().catch(() => { if (token === generation) video.controls = true; });
    }
    function next() {
      if (token !== generation) return;
      index++;
      if (index < frames.length) { showFrame(index); playCurrent(); }
      else collapse();
    }
    playCurrent();
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
    if (reducedMotion || document.hidden || !section?.querySelector('.slide-visual [data-reel], .section-media[data-reel]')) return;
    const first = section.querySelector('[data-reel] .reel-frame');
    first?.querySelectorAll('img').forEach(image => { image.loading = 'eager'; });
    const video = first?.querySelector('video');
    if (video) { video.preload = 'auto'; video.load(); }
    section.dataset.photoPhase = 'reading';
    schedule(expand, 5000);
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
