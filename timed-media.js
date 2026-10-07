export function createTimedMedia(reducedMotion, videoCuts) {
  let stage, host;
  let frames = [];
  let sources = [];
  let active = -1;
  function stop() {
    stage?.querySelectorAll('video').forEach(video => video.pause());
    stage?.remove();
    host?.classList.remove('photos-playing');
    stage = host = null;
    frames = [];
    active = -1;
  }
  function setTopic(pages) {
    stop();
    sources = pages.flatMap(page => [...page.querySelectorAll('[data-curated] .reel-frame')]);
  }
  function update(page, elapsed, duration) {
    if (!sources.length || elapsed < 4) { if (stage) stop(); return; }
    if (!stage) {
      stage = document.createElement('div');
      stage.className = 'photo-stage narration-stage';
      const reel = document.createElement('figure');
      reel.className = 'photo-reel in-view';
      const viewport = document.createElement('div');
      viewport.className = 'reel-viewport';
      frames = sources.map(source => {
        const frame = source.cloneNode(true);
        frame.classList.remove('active');
        frame.setAttribute('aria-hidden', 'true');
        frame.querySelectorAll('img').forEach(image => { image.loading = 'eager'; });
        const video = frame.querySelector('video');
        if (video) {
          const cut = videoCuts[video.getAttribute('src')];
          if (cut) video.src = cut.src;
          video.muted = true;
          video.preload = 'auto';
          video.loop = false;
        }
        viewport.append(frame);
        return frame;
      });
      reel.append(viewport);
      stage.append(reel);
      document.body.append(stage);
      if (!reducedMotion) reel.animate([{ opacity: 0, transform: 'scale(.86)' },
        { opacity: 1, transform: 'none' }], { duration: 650, easing: 'cubic-bezier(.2,.7,.2,1)' });
    }
    if (host !== page) {
      host?.classList.remove('photos-playing');
      host = page;
      host.classList.add('photos-playing');
      const video = frames.some(frame => frame.querySelector('video'));
      stage.classList.toggle('video-stage', video);
      const heading = page.querySelector('.section-heading, .hero-content, .closing-content');
      stage.style.top = video ? '0px' : Math.max(16, heading.getBoundingClientRect().bottom + 16) + 'px';
      stage.style.backgroundColor = getComputedStyle(page).backgroundColor;
    }
    const slot = Math.max(.001, (duration - 4) / frames.length);
    const index = Math.min(frames.length - 1, Math.floor((elapsed - 4) / slot));
    if (index !== active) {
      frames.forEach((frame, i) => {
        frame.classList.toggle('active', i === index);
        frame.setAttribute('aria-hidden', String(i !== index));
        if (i !== index) frame.querySelector('video')?.pause();
      });
      active = index;
      const video = frames[index].querySelector('video');
      if (video) {
        video.currentTime = Math.max(0, elapsed - 4 - index * slot);
        video.play().catch(() => {});
      }
    }
    const video = frames[index].querySelector('video');
    if (video && Number.isFinite(video.duration)) {
      const time = Math.min(video.duration, Math.max(0, elapsed - 4 - index * slot));
      if (Math.abs(video.currentTime - time) > .45) video.currentTime = time;
    }
    page.dataset.photoPhase = 'viewing';
    page.dataset.mediaIndex = String(index);
  }
  return { setTopic, update, stop };
}
