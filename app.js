import { report as r } from './content.js';

const sections = [
  ['mo-dau', 'Mở đầu'], ['tong-quan', 'Tổng quan'], ['ket-qua', 'Kết quả học tập'],
  ['thanh-tich', 'Dấu ấn thành tích'], ['trai-nghiem', 'Đời sống học đường'],
  ['se-chia', 'Lan tỏa yêu thương'], ['dinh-huong', 'Định hướng mới'],
  ['chuong-trinh', 'Chương trình giáo dục'], ['chi-tieu', 'Chỉ tiêu phấn đấu'], ['dong-hanh', 'Cùng đồng hành']
];
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const format = (value, decimals = 0) => new Intl.NumberFormat('vi-VN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
const icon = name => `<i data-lucide="${escape(name)}" aria-hidden="true"></i>`;
const count = (item, className = '') => `<span class="counter ${className}" data-value="${item.value}" data-decimals="${item.decimals || 0}">${format(item.value, item.decimals)}</span><span class="suffix">${escape(item.suffix || '')}</span>`;
const heading = (number, eyebrow, title, text = '') => `<div class="section-heading reveal"><p class="eyebrow"><span>${number}</span> ${eyebrow}</p><h2>${title}</h2>${text ? `<p class="section-intro">${text}</p>` : ''}</div>`;
const featureRows = items => items.map(([symbol, title, text], i) => `<article class="feature-row reveal" style="--delay:${i * 80}ms"><span class="feature-icon">${icon(symbol)}</span><div><h3>${escape(title)}</h3><p>${escape(text)}</p></div></article>`).join('');
const next = (id, label) => `<a class="text-link" href="#${id}">${label} ${icon('arrow-down-right')}</a>`;

document.querySelector('#main').innerHTML = `
  <section id="mo-dau" class="hero" aria-labelledby="hero-title">
    <img class="hero-image" src="assets/campus.jpg" alt="Sân trường THPT Phú Nhuận với các dãy lớp học và cây xanh" fetchpriority="high" width="1200" height="800">
    <div class="hero-shade"></div>
    <div class="hero-content wrap">
      <p class="eyebrow hero-enter"><span class="status-dot"></span> HỘI NGHỊ CHA MẸ HỌC SINH · 2026–2027</p>
      <h1 id="hero-title" class="hero-enter">TRƯỜNG THPT<br><span>PHÚ NHUẬN</span></h1>
      <p class="hero-subtitle hero-enter">Nhìn lại một năm học.<br>Cùng mở ra hành trình mới.</p>
      <div class="hero-bottom hero-enter"><p>Tổng kết <strong>${r.pastYear}</strong><br>Phương hướng <strong>${r.nextYear}</strong></p><a href="#tong-quan" class="hero-link">Khám phá báo cáo <span>${icon('arrow-down')}</span></a></div>
    </div>
    <span class="hero-photo-credit">Ảnh tư liệu sân trường · Hoa Học Trò / Tiền Phong</span>
    <div class="year-stamp" aria-hidden="true">2026<span>2027</span></div>
  </section>

  <section id="tong-quan" class="section overview">
    <div class="wrap">
      ${heading('01', 'TỔNG QUAN NHÀ TRƯỜNG', 'Một cộng đồng.<br><em>Nhiều tiềm năng.</em>', 'Đội ngũ tận tâm, học sinh chủ động và sự đồng hành của gia đình tạo nên nền tảng cho một năm học nhiều dấu ấn.')}
      <div class="overview-stats">${r.overview.map((item, i) => `<article class="overview-stat reveal" style="--delay:${i * 100}ms"><span class="stat-icon">${icon(item.icon)}</span><strong>${count(item)}</strong><h3>${item.label}</h3><p>${item.detail}</p></article>`).join('')}</div>
      <div class="organization reveal">${r.organization.map(([label, text]) => `<div><span>${label}</span><p>${text}</p></div>`).join('')}</div>
      <div class="section-end"><span>Năm học ${r.pastYear}</span>${next('ket-qua', 'Kết quả giáo dục')}</div>
    </div>
  </section>

  <section id="ket-qua" class="section results">
    <div class="wrap">
      ${heading('02', 'KẾT QUẢ GIÁO DỤC', 'Sự tiến bộ được<br><em>ghi nhận bằng kết quả.</em>', 'Duy trì chất lượng học tập, rèn luyện và hướng đến những cơ hội tiếp theo cho mỗi học sinh.')}
      <div class="results-layout"><div class="result-bars">${r.results.map((item, i) => `<article class="result-row reveal"><div><h3>${item.label}</h3><strong>${count(item)}</strong></div><div class="bar-track" role="img" aria-label="${item.label}: ${format(item.value, item.decimals)}%"><span class="bar-fill ${item.color}" style="--fill:${item.value}%;--delay:${i * 150}ms"></span></div></article>`).join('')}<p class="result-note">Không có học sinh học lực Chưa đạt.</p></div>
      <div class="university reveal"><span class="eyebrow">BƯỚC TIẾP VÀO ĐẠI HỌC</span><div class="big-percentage">${count({ value: r.graduation.university, decimals: 2, suffix: '%' })}</div><h3>Trúng tuyển đại học</h3><p>${r.graduation.note}</p><div class="university-score"><span>Điểm TB 3 môn cao nhất<br><strong>${format(r.graduation.score, 2)}</strong></span><span>Năm 2025<br><strong>${format(r.graduation.previousScore, 2)}</strong></span></div></div></div>
      <details class="report-details reveal"><summary>Chi tiết kết quả thi tốt nghiệp THPT 2026 ${icon('plus')}</summary><div class="detail-content"><p>Điểm 3 môn cao nhất: ${format(r.graduation.highest, 2)}; thấp nhất: ${format(r.graduation.lowest, 1)}.</p><div class="perfect-scores">${r.graduation.perfect.map(([name, value]) => `<div><strong>${value}</strong><span>điểm 10 môn ${name}</span></div>`).join('')}</div></div></details>
    </div>
  </section>

  <section id="thanh-tich" class="section achievements">
    <div class="wrap">
      <div class="heading-with-mark">${heading('03', 'DẤU ẤN NĂM HỌC', 'Nỗ lực hôm nay.<br><em>Thành tích xứng đáng.</em>')}<span class="trophy-mark reveal">${icon('trophy')}</span></div>
      <div class="tabs" role="tablist" aria-label="Nhóm thành tích"><button role="tab" id="tab-academic" aria-controls="achievement-panel" aria-selected="true" data-tab="academic">${icon('graduation-cap')} Học thuật</button><button role="tab" id="tab-sport" aria-controls="achievement-panel" aria-selected="false" tabindex="-1" data-tab="sport">${icon('medal')} Thể thao</button><button role="tab" id="tab-teachers" aria-controls="achievement-panel" aria-selected="false" tabindex="-1" data-tab="teachers">${icon('users')} Đội ngũ</button></div>
      <div id="achievement-panel" class="achievement-grid" role="tabpanel" aria-labelledby="tab-academic" tabindex="0"></div>
      <details class="report-details"><summary>Ghi nhận tập thể & đoàn thể ${icon('plus')}</summary><div class="detail-content"><p>${r.honors}</p><p>Đoàn trường được khen thưởng trong công tác Đoàn, Tháng Thanh niên, chiến dịch Xuân tình nguyện, tình nguyện hè và học tập, làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh.</p></div></details>
    </div>
  </section>

  <section id="trai-nghiem" class="section experiences">
    <div class="wrap">
      ${heading('04', 'ĐỜI SỐNG HỌC ĐƯỜNG', 'Không chỉ học tốt.<br><em>Còn được là chính mình.</em>')}
      <div class="experience-layout"><figure class="experience-photo reveal"><img src="assets/reading.png" alt="Hoạt động Bookfest 4.0 tại THPT Phú Nhuận" width="1000" height="750" loading="lazy"><figcaption>Bookfest 4.0 · Ảnh tư liệu từ website nhà trường</figcaption></figure><div class="club-content"><div class="club-headline reveal"><strong>${count({ value: r.clubs.count })}</strong><div><h3>CLB · Đội · Nhóm</h3><p>Hơn ${format(r.clubs.students)} học sinh tham gia</p></div></div>${r.clubs.items.map(([symbol, title, text]) => `<article class="club-row reveal">${icon(symbol)}<div><h3>${title}</h3><p>${text}</p></div></article>`).join('')}</div></div>
      <div class="education-grid">${featureRows(r.education)}</div>
    </div>
  </section>

  <section id="se-chia" class="section community">
    <div class="wrap">
      ${heading('05', 'TRÁCH NHIỆM VỚI CỘNG ĐỒNG', 'Những bài học<br><em>từ sự sẻ chia.</em>', 'Tinh thần tương thân tương ái được nuôi dưỡng bằng những việc làm cụ thể, với sự chung tay của thầy cô, học sinh và cha mẹ học sinh.')}
      <div class="community-layout"><figure class="community-photo reveal"><img src="assets/spring.jpg" alt="Giáo viên, học sinh và phụ huynh cùng gói bánh chưng tại trường năm 2026" width="1200" height="800" loading="lazy"><figcaption>Cùng gói bánh chưng đón Xuân 2026 · Ảnh website nhà trường</figcaption></figure><div class="charity-stats">${r.charity.map((item, i) => `<article class="charity-stat reveal" style="--delay:${i * 80}ms"><strong>${count(item)}</strong><h3>${item.label}</h3><p>${item.detail}</p></article>`).join('')}</div></div>
      <details class="report-details"><summary>Các hoạt động cộng đồng khác ${icon('plus')}</summary><div class="detail-content"><ul>${r.charityMore.map(text => `<li>${text}</li>`).join('')}</ul></div></details>
    </div>
  </section>

  <section id="dinh-huong" class="section future">
    <div class="wrap">
      ${heading('06', 'PHƯƠNG HƯỚNG 2026–2027', 'Cùng mở ra<br><em>một hành trình mới.</em>')}
      <div class="future-motto reveal"><span>Đổi mới tư duy</span><span>Chuyển biến mạnh mẽ</span><span>Kết quả thực chất</span></div>
      <div class="future-stats">${r.nextOverview.map(item => `<div class="reveal"><strong>${count(item)}</strong><span>${item.label}</span></div>`).join('')}</div>
      <div class="directions">${r.directions.map(([number, title, text]) => `<article class="direction reveal"><span>${number}</span><h3>${title}</h3><p>${text}</p></article>`).join('')}</div>
      <div class="future-bottom reveal"><p>Học đi đôi với hành.<br>Nhà trường gắn kết với gia đình và xã hội.</p><span>${icon('move-up-right')}</span></div>
    </div>
  </section>

  <section id="chuong-trinh" class="section programs">
    <div class="wrap">
      ${heading('07', 'CHƯƠNG TRÌNH & GIẢI PHÁP', 'Năng lực cho hôm nay.<br><em>Hành trang cho ngày mai.</em>')}
      <div class="program-list">${r.programs.map((item, i) => `<article class="program-row reveal" style="--delay:${i * 70}ms"><span class="program-number">0${i + 1}</span><span class="program-icon">${icon(item.icon)}</span><h3>${item.title}</h3><p>${item.description}</p><strong>${item.amount}</strong></article>`).join('')}</div>
      <details class="report-details"><summary>Giải pháp dạy học & kiểm tra đánh giá ${icon('plus')}</summary><div class="detail-content solution-grid">${featureRows(r.solutions)}</div></details>
      <details class="report-details"><summary>Cơ sở vật chất & phát triển đội ngũ ${icon('plus')}</summary><div class="detail-content"><div class="infrastructure">${r.infrastructure.map(([value, label]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join('')}</div><p>${r.development}</p></div></details>
    </div>
  </section>

  <section id="chi-tieu" class="section targets">
    <div class="wrap">
      ${heading('08', 'CHỈ TIÊU PHẤN ĐẤU', 'Mục tiêu rõ ràng.<br><em>Cùng nhau tiến bước.</em>', 'Các chỉ tiêu năm học 2026–2027 là định hướng để nhà trường, thầy cô và gia đình cùng đồng hành.')}
      <div class="target-grid">${r.targets.map((item, i) => `<article class="target-item reveal" style="--delay:${i * 90}ms"><div class="target-ring" style="--target:${item.value}"><svg viewBox="0 0 120 120" aria-hidden="true"><circle class="ring-track" cx="60" cy="60" r="52"/><circle class="ring-fill" cx="60" cy="60" r="52" pathLength="100"/></svg><strong>${count(item)}</strong></div><h3>${item.label}</h3></article>`).join('')}</div>
      <div class="target-more">${r.targetMore.map(([title, text]) => `<article class="reveal"><span>${icon('check')}</span><div><h3>${title}</h3><p>${text}</p></div></article>`).join('')}</div>
    </div>
  </section>

  <section id="dong-hanh" class="section partnership">
    <div class="wrap">
      ${heading('09', 'NHÀ TRƯỜNG · GIA ĐÌNH · HỌC SINH', 'Mỗi bước trưởng thành,<br><em>luôn có người đồng hành.</em>')}
      <div class="partnership-grid">${r.partnership.map(([title, text], i) => `<article class="reveal"><span>0${i + 1}</span><h3>${title}</h3><p>${text}</p></article>`).join('')}</div>
      <div class="closing reveal"><div><p class="eyebrow">TRƯỜNG THPT PHÚ NHUẬN</p><h3>Xin cảm ơn sự tin tưởng<br>và đồng hành của quý phụ huynh.</h3></div><a class="closing-link" href="#mo-dau" title="Về đầu trang" aria-label="Về đầu trang">${icon('arrow-up-right')}</a></div>
      <p class="source-note">Nội dung theo báo cáo dự thảo tổng kết 2025–2026 và phương hướng 2026–2027. <a href="assets/SOURCES.md" target="_blank" rel="noreferrer">Nguồn ảnh tư liệu</a></p>
    </div>
  </section>`;

function renderIcons() { window.lucide?.createIcons({ attrs: { 'stroke-width': 1.6 } }); }
renderIcons();
window.addEventListener('load', renderIcons, { once: true });

let motionPreference;
try { motionPreference = localStorage.getItem('report-motion'); } catch { /* Local storage can be unavailable in restricted browser contexts. */ }
const systemMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let reducedMotion = motionPreference ? motionPreference === 'reduced' : systemMotion.matches;
let activeSection = 0;
const nodes = sections.map(([id]) => document.getElementById(id));
const motionButton = document.querySelector('#motion-toggle');
const numberAnimations = new Map();

function finishCounters(root = document) {
  root.querySelectorAll('.counter').forEach(node => {
    if (numberAnimations.has(node)) cancelAnimationFrame(numberAnimations.get(node));
    numberAnimations.delete(node);
    node.textContent = format(Number(node.dataset.value), Number(node.dataset.decimals));
    node.dataset.counted = 'true';
  });
}
function applyMotion() {
  document.documentElement.classList.toggle('reduced-motion', reducedMotion);
  motionButton.setAttribute('aria-pressed', String(reducedMotion));
  const label = reducedMotion ? 'Bật chuyển động' : 'Giảm chuyển động';
  motionButton.setAttribute('aria-label', label);
  motionButton.title = label;
  motionButton.innerHTML = icon(reducedMotion ? 'play' : 'pause');
  if (reducedMotion) {
    finishCounters();
    document.querySelectorAll('.reveal').forEach(node => node.classList.add('visible'));
  }
  renderIcons();
}
applyMotion();
motionButton.addEventListener('click', () => {
  reducedMotion = !reducedMotion;
  motionPreference = reducedMotion ? 'reduced' : 'full';
  try { localStorage.setItem('report-motion', motionPreference); } catch { /* The page remains usable without preference persistence. */ }
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
    const progress = Math.min((now - start) / 1400, 1);
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
}, { threshold: 0.12 });
function observeReveals(root = document) {
  root.querySelectorAll('.reveal').forEach(node => {
    if (reducedMotion) { node.classList.add('visible'); finishCounters(node); }
    else revealObserver.observe(node);
  });
}
observeReveals();

function renderAchievements(key) {
  const panel = document.querySelector('#achievement-panel');
  panel.setAttribute('aria-labelledby', `tab-${key}`);
  panel.innerHTML = r.achievements[key].map((item, i) => `<article class="achievement-card reveal" style="--delay:${i * 60}ms"><span>${icon(item.icon)}</span><strong>${count(item)}</strong><h3>${item.title}</h3><p>${item.text}</p></article>`).join('');
  document.querySelectorAll('[data-tab]').forEach(button => {
    const selected = button.dataset.tab === key;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  observeReveals(panel);
  renderIcons();
}
renderAchievements('academic');
document.querySelectorAll('[data-tab]').forEach(button => {
  button.addEventListener('click', () => renderAchievements(button.dataset.tab));
  button.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const tabs = [...document.querySelectorAll('[data-tab]')];
    const index = tabs.indexOf(button);
    const target = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    renderAchievements(tabs[target].dataset.tab);
    tabs[target].focus();
  });
});

document.querySelector('#section-rail').innerHTML = sections.map(([id, title], i) => `<a href="#${id}" aria-label="${String(i + 1).padStart(2, '0')}: ${title}" title="${title}" ${i === 0 ? 'aria-current="location"' : ''}><span>${title}</span></a>`).join('');
document.querySelector('#section-menu').innerHTML = sections.map(([id, title], i) => `<a href="#${id}"><span>${String(i + 1).padStart(2, '0')}</span>${title}</a>`).join('');
const menuButton = document.querySelector('#menu-toggle');
const menu = document.querySelector('#section-menu');
function closeMenu() { menu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); }
menuButton.addEventListener('click', () => { menu.hidden = !menu.hidden; menuButton.setAttribute('aria-expanded', String(!menu.hidden)); });
document.addEventListener('click', event => { if (!menu.hidden && !menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu(); });
function goTo(index) {
  const targetIndex = Math.max(0, Math.min(index, nodes.length - 1));
  const headerOffset = document.querySelector('.site-header').offsetHeight;
  const top = nodes[targetIndex].getBoundingClientRect().top + scrollY - headerOffset;
  window.scrollTo({ top, behavior: reducedMotion ? 'instant' : 'smooth' });
  history.replaceState(null, '', `#${sections[targetIndex][0]}`);
  closeMenu();
}
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
  const index = sections.findIndex(([id]) => `#${id}` === link.getAttribute('href'));
  if (index < 0) return;
  event.preventDefault();
  goTo(index);
}));
document.querySelector('#previous-section').addEventListener('click', () => goTo(activeSection - 1));
document.querySelector('#next-section').addEventListener('click', () => goTo(activeSection + 1));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') { closeMenu(); return; }
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target.closest('input, textarea, select, button, summary, [contenteditable="true"]')) return;
  const direction = ['ArrowDown', 'PageDown'].includes(event.key) ? 1 : ['ArrowUp', 'PageUp'].includes(event.key) ? -1 : 0;
  if (direction) { event.preventDefault(); goTo(activeSection + direction); }
  if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); goTo(event.key === 'Home' ? 0 : nodes.length - 1); }
});
let scrollScheduled = false;
function updateScroll() {
  const marker = scrollY + Math.min(innerHeight * 0.35, 240);
  let index = 0;
  nodes.forEach((node, i) => { if (node.offsetTop <= marker) index = i; });
  activeSection = index;
  const scrollRange = document.documentElement.scrollHeight - innerHeight;
  document.querySelector('.reading-progress span').style.transform = `scaleX(${scrollRange > 0 ? scrollY / scrollRange : 0})`;
  document.querySelectorAll('.section-rail a').forEach((link, i) => { if (i === index) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
  document.querySelector('#section-position').textContent = `${String(index + 1).padStart(2, '0')} / ${nodes.length}`;
  document.querySelector('#previous-section').disabled = index === 0;
  document.querySelector('#next-section').disabled = index === nodes.length - 1;
  document.querySelector('.site-header').classList.toggle('scrolled', scrollY > 40);
  if (!reducedMotion && scrollY < innerHeight) document.querySelector('.hero-image').style.transform = `translateY(${scrollY * 0.18}px) scale(1.03)`;
  scrollScheduled = false;
}
window.addEventListener('scroll', () => { if (!scrollScheduled) { scrollScheduled = true; requestAnimationFrame(updateScroll); } }, { passive: true });
window.addEventListener('resize', updateScroll);
updateScroll();
document.querySelectorAll('details').forEach(details => details.addEventListener('toggle', () => { if (details.open) observeReveals(details); }));
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
  button.setAttribute('aria-label', button.title);
  renderIcons();
});
