import { protectPhrases } from './typography.js?v=20261006-1';

export function positionMediaStage(stage, section, video, reducedMotion) {
  stage.style.top = '0px';
  stage.style.backgroundColor = getComputedStyle(section).backgroundColor;
  stage.style.color = getComputedStyle(section).color;
  stage.classList.toggle('video-stage', video);
  stage.classList.toggle('has-media-heading', !video);
  stage.querySelector('.media-heading')?.remove();
  if (video) return;
  const original = section.querySelector('.section-heading h2, .hero-content h1, .closing-content h2');
  if (!original) return;
  const heading = document.createElement('div');
  heading.className = 'media-heading';
  heading.style.fontFamily = getComputedStyle(original).fontFamily;
  const title = document.createElement('h2');
  title.style.color = getComputedStyle(original).color;
  const temporary = document.createElement('h3');
  temporary.append(...[...original.childNodes].map(node => node.cloneNode(true)));
  temporary.querySelectorAll('br').forEach(br => br.replaceWith(document.createTextNode(' ')));
  temporary.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
  protectPhrases(temporary);
  title.append(...temporary.childNodes);
  const accents = [...original.querySelectorAll('em')];
  title.querySelectorAll('em').forEach((em, i) => { em.style.color = getComputedStyle(accents[i]).color; });
  heading.append(title);
  stage.prepend(heading);
  // Fit long titles and protected phrases without taking space from the photo.
  let size = parseFloat(getComputedStyle(title).fontSize);
  while ((title.scrollWidth > title.clientWidth + 1 || title.offsetHeight > size * 2.4) && size > 18) {
    size -= 2;
    title.style.fontSize = size + 'px';
  }
  if (!reducedMotion) {
    const from = original.getBoundingClientRect();
    const to = title.getBoundingClientRect();
    const scale = parseFloat(getComputedStyle(original).fontSize) / size;
    title.animate([{ transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${scale})`, opacity: .4 },
      { transform: 'none', opacity: 1 }], { duration: 650, easing: 'cubic-bezier(.2,.7,.2,1)' });
  }
}
