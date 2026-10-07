import { createTimedMedia } from './timed-media.js?v=20261007-1';

export function createNarration(manifest, reducedMotion, navigate) {
  const audio = new Audio();
  audio.preload = 'auto';
  audio.id = 'section-narration';
  audio.hidden = true;
  document.body.append(audio);
  const media = createTimedMedia(reducedMotion, manifest.videos);
  let nodes = [], pages = [], boundaries = [];
  let page, topic, openingTimer, blocked, requested, pendingSeek;
  let token = 0;
  let resumeAfterHidden = false;
  const duration = () => manifest.sections[topic]?.duration || 0;
  function removePrompt() { blocked?.remove(); blocked = null; }
  async function play() {
    const generation = token;
    try {
      await audio.play();
      if (generation !== token) return;
      removePrompt();
      document.documentElement.dataset.narration = 'playing';
    } catch (error) {
      if (generation !== token || error.name === 'AbortError') return;
      document.documentElement.dataset.narration = 'blocked';
      if (blocked) return;
      blocked = document.createElement('button');
      blocked.type = 'button';
      blocked.className = 'narration-start';
      blocked.textContent = error.name === 'NotAllowedError' ? '▶ Bật tiếng và tiếp tục' : '▶ Thử phát lời đọc lại';
      blocked.addEventListener('click', play);
      document.body.append(blocked);
    }
  }
  function buildBoundaries() {
    const weights = pages.map(node => Math.max(1, (node.querySelector('.slide-body') || node).textContent.trim().split(/\s+/).length));
    const total = weights.reduce((sum, value) => sum + value, 0);
    let offset = 0;
    boundaries = weights.map(weight => { const start = offset; offset += duration() * weight / total; return start; });
  }
  function tick() {
    if (topic && !audio.paused && audio.readyState >= 2 && pendingSeek === undefined && !document.hidden) {
      const elapsed = audio.currentTime;
      let index = 0;
      boundaries.forEach((start, i) => { if (elapsed >= start) index = i; });
      const expected = pages[index];
      if (expected && expected !== page && requested !== expected) {
        requested = expected;
        navigate(nodes.indexOf(expected), true);
      }
      if (page) {
        page.dataset.voiceTime = elapsed.toFixed(2);
        page.dataset.voiceDuration = String(duration());
        media.update(page, elapsed, duration());
      }
    }
    requestAnimationFrame(tick);
  }
  function nextTopic() {
    media.stop();
    const last = nodes.indexOf(pages.at(-1) || page);
    if (last < nodes.length - 1) navigate(last + 1);
    else document.documentElement.dataset.narration = 'finished';
  }
  audio.addEventListener('ended', nextTopic);
  audio.addEventListener('loadedmetadata', () => {
    if (pendingSeek !== undefined) { audio.currentTime = pendingSeek; pendingSeek = undefined; }
  });
  function setPage(next, allNodes) {
    if (page === next && nodes === allNodes) return;
    nodes = allNodes;
    const id = next.dataset.parentId || next.id;
    const changed = topic !== id;
    page = next;
    if (id === 'mo-dau') {
      token++;
      topic = id;
      audio.pause();
      media.stop();
      removePrompt();
      clearTimeout(openingTimer);
      openingTimer = setTimeout(() => navigate(nodes.indexOf(page) + 1), 5000);
      return;
    }
    clearTimeout(openingTimer);
    if (!manifest.sections[id]) return;
    const rebuild = changed || !pages.includes(next);
    if (rebuild) {
      const oldTime = changed ? 0 : audio.currentTime;
      topic = id;
      pages = nodes.filter(node => (node.dataset.parentId || node.id) === id);
      buildBoundaries();
      media.setTopic(pages);
      if (changed) {
        token++;
        audio.pause();
        audio.src = manifest.sections[id].src;
        audio.dataset.topic = id;
        const index = pages.indexOf(next);
        pendingSeek = boundaries[index] || 0;
        audio.load();
        play();
      } else audio.currentTime = oldTime;
    } else if (requested !== next) {
      const index = pages.indexOf(next);
      audio.currentTime = boundaries[index] || 0;
    }
    requested = null;
  }
  function interaction(event) {
    if (event.target.closest?.('.narration-start')) return;
    if (audio.paused && topic !== 'mo-dau' && document.documentElement.dataset.narration !== 'finished') play();
  }
  document.addEventListener('pointerdown', interaction);
  document.addEventListener('keydown', interaction);
  document.addEventListener('wheel', interaction, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      resumeAfterHidden = !audio.paused;
      audio.pause();
      clearTimeout(openingTimer);
      media.stop();
    } else if (topic === 'mo-dau') {
      openingTimer = setTimeout(() => navigate(nodes.indexOf(page) + 1), 5000);
    } else if (resumeAfterHidden) play();
  });
  requestAnimationFrame(tick);
  return { setPage, stopMedia: media.stop, prepareNavigation(target) {
    clearTimeout(openingTimer);
    if ((target.dataset.parentId || target.id) !== topic) audio.pause();
    media.stop();
  } };
}
