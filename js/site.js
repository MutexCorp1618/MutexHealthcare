/* Mutex Healthcare Staffing — shared layout + behaviour (header, footer, job cards, forms, match assistant) */
(function () {
  'use strict';
  const MX = window.MX;
  const { SITE, JOBS } = MX;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  MX.$ = $; MX.$$ = $$;
  MX.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Icons ---------- */
  const ICONS = {
    heartPulse: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    flask: '<path d="M10 2v7.5a2 2 0 0 1-.2.9L4.7 20.6a1 1 0 0 0 .9 1.4h12.8a1 1 0 0 0 .9-1.4L14.2 10.4a2 2 0 0 1-.2-.9V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/>',
    pill: '<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>',
    smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/>',
    cap: '<path d="M22 10v6"/><path d="M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>',
    arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-10 6L2 7"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    /* "sparkles" is drawn as a target: the four-point sparkle reads as an AI symbol */
    sparkles: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
    building: '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>',
    message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    filter: '<path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/>',
    home: '<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
    mountain: '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>',
    zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    dollar: '<path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    briefcase: '<rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    fileCheck: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
  };
  MX.icon = (name, cls = '') =>
    `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
  MX.hydrateIcons = (root = document) =>
    $$('i[data-icon]', root).forEach((el) => { el.outerHTML = MX.icon(el.dataset.icon, el.className); });

  /* Logo markup lives in js/logo.js. */
  const logo = (id = 'mxh', light = false) => `<a class="logo" href="./" aria-label="${SITE.name} home">${MX.logoSVG(id, light)}</a>`;

  /* ---------- Header + footer ---------- */
  const page = document.body.dataset.page;
  const total = JOBS.length.toLocaleString('en-US');
  const pillars = MX.SPECIALTIES.map((sp) => [sp.name, `staffing-${sp.slug}`]);

  /* Main menu. Each item: [label, href, optional description] */
  const MENU = [
    { label: 'Find Work', href: 'job-seekers', keys: ['seekers', 'jobs'], cols: [
      { title: 'Find your next job', items: [
        ['Search all jobs', 'jobs', `${total} open roles with pay shown`],
        ['Jobs by state', 'locations', 'Explore where you want to go'],
        ['Specialties', 'specialties', 'Eight practice areas'],
        ['Join the talent network', 'apply', 'One short form, one recruiter call'],
      ] },
      { title: 'Ways to work', items: [
        ['Travel Nursing', 'travel-nursing'], ['Allied & Therapy', 'allied-therapy'], ['Per Diem & Local', 'per-diem'],
        ['Permanent Placement', 'permanent-placement'], ['Federal & Schools', 'federal-schools'], ['Healthcare IT', 'healthcare-it'],
      ] },
      { title: 'Resources', items: [
        ['Pay & Benefits', 'pay-benefits'], ['Licensure Guide', 'licensure'], ['Refer a Friend', 'referral'], ['FAQs', 'faqs'],
      ] },
    ] },
    /* Travel nursing is the heart of the business, so it gets its own highlighted link */
    { label: 'Travel Nursing', href: 'travel-nursing', keys: [], hot: true },
    { label: 'Staffing Services', href: 'employers', keys: ['employers', 'match'], cols: [
      { title: 'For facilities', items: [
        ['Staffing services overview', 'employers', 'Credentialed clinicians, usually within days'],
        ['Request staff', 'contact#request', 'Hear back within one business day'],
        ['How we work', 'employers#process', 'From request to first shift'],
        ['Mutex Match', 'mutex-match', 'How we rank and vet candidates'],
      ] },
      { title: 'The pillars of staffing', items: pillars.slice(0, 4) },
      { title: '&nbsp;', items: pillars.slice(4) },
    ] },
    { label: 'Workforce Solutions', href: 'workforce-solutions', keys: ['workforce'], cols: [
      { title: 'Programs', items: [
        ['Workforce solutions overview', 'workforce-solutions', 'Programs for recurring problems'],
        ['Contract Therapy', 'contract-therapy', 'Run the rehab department, not just fill it'],
        ['Credentialing & Compliance', 'credentialing-compliance', 'Verification, monitoring and survey readiness'],
        ['Rural & Critical Access', 'rural-critical-access', 'Longer contracts, housing built in'],
      ] },
    ] },
    { label: 'Company', href: 'about', keys: ['about'], right: true, cols: [
      { title: 'Company', items: [
        ['About us', 'about'], ['Our mission', 'about#mission'], ['Why “Mutex”', 'about#name'], ['Our values', 'about#values'],
        ...(SITE.demoMode ? [['Our journey', 'about#journey'], ['Leadership', 'about#leadership']] : []), ['Certifications & compliance', 'about#certifications'], ['Careers', 'careers'],
      ] },
      { title: 'Insights', items: [
        ['Blog', 'blog'], ['FAQs', 'faqs'], ['Locations', 'locations'], ['Refer a Friend', 'referral'], ['Contact', 'contact'],
      ] },
    ] },
  ];
  const menuLink = ([label, href, note]) => `<a href="${href}">${label}${note ? `<small>${note}</small>` : ''}</a>`;

  function renderHeader() {
    const host = $('#site-header');
    if (!host) return;
    const nav = MENU.map((m) => {
      const active = m.keys.includes(page) || (m.hot && location.pathname.replace(/\.html$/, '').endsWith('/' + m.href));
      const link = `<a class="nav-link${m.hot ? ' nav-hot' : ''}${active ? ' active' : ''}" href="${m.href}"${active ? ' aria-current="page"' : ''}>${m.label}${m.cols ? MX.icon('chevron') : ''}</a>`;
      if (!m.cols) return `<div class="nav-item">${link}</div>`;
      return `<div class="nav-item has-menu${m.right ? ' right' : ''}">${link}
        <div class="menu"><div class="menu-inner">${m.cols.map((c) => `<div><h5>${c.title}</h5>${c.items.map(menuLink).join('')}</div>`).join('')}</div></div>
      </div>`;
    }).join('');
    const mobile = MENU.map((m) => (m.cols
      ? `<details class="m-group"><summary>${m.label}</summary><a href="${m.href}">${m.label} overview</a>${m.cols.map((c) => c.items.map(([l, h]) => `<a href="${h}">${l}</a>`).join('')).join('')}</details>`
      : `<a class="m-link${m.hot ? ' m-hot' : ''}" href="${m.href}">${m.label}</a>`)).join('');
    host.outerHTML = `
      <div class="topbar"><div class="container">
        <div class="topbar-items"><span>Nationwide healthcare staffing</span><span>Pay shown on every posting</span><span>${total} open jobs</span></div>
        <div class="topbar-right"><a class="topbar-phone" href="${SITE.phoneHref}">${MX.icon('phone')}${SITE.phone}</a><a href="referral">Refer a clinician, earn a bonus →</a></div>
      </div></div>
      <header class="site-header" id="top">
        <div class="container header-inner">
          ${logo()}
          <nav class="nav" aria-label="Primary">${nav}</nav>
          <div class="header-cta">
            <a class="btn btn-ghost btn-sm" href="contact#request">Request staff</a>
            <a class="btn btn-primary btn-sm" href="jobs">Find jobs</a>
            <button class="burger" aria-label="Menu" aria-expanded="false"><span></span></button>
          </div>
        </div>
        <div class="mobile-panel"><div class="container">
          ${mobile}
          <div class="m-actions">
            <a class="btn btn-ghost" href="contact#request">Request staff</a>
            <a class="btn btn-primary" href="jobs">Find jobs</a>
          </div>
          <a class="m-phone" href="${SITE.phoneHref}">${MX.icon('phone')}${SITE.phone}</a>
        </div></div>
      </header>`;
    const header = $('.site-header');
    const burger = $('.burger', header);
    burger.addEventListener('click', () => {
      const open = header.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });
    $$('.mobile-panel a', header).forEach((a) => a.addEventListener('click', () => header.classList.remove('open')));
    /* Dropdowns open on hover and keyboard focus (CSS); Escape closes them */
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && header.contains(document.activeElement)) document.activeElement.blur(); });
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function renderFooter() {
    const host = $('#site-footer');
    if (!host) return;
    const list = (items) => `<ul>${items.map(([l, h]) => `<li><a href="${h}">${l}</a></li>`).join('')}</ul>`;
    host.outerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              ${logo('mxf', true)}
              <p class="footer-about">One opening, one right clinician, one accountable recruiter. Healthcare staffing for clinicians and facilities in all 50 states.</p>
              <div class="footer-contact">
                <a href="${SITE.mapHref}" target="_blank" rel="noopener">${MX.icon('pin')}<span>${SITE.address.join('<br>')}</span></a>
                <a href="${SITE.phoneHref}">${MX.icon('phone')}${SITE.phone}</a>
                <a href="mailto:${SITE.email}">${MX.icon('mail')}${SITE.email}</a>
              </div>
            </div>
            <div>
              <h4>Find work</h4>
              ${list([['Search all jobs', 'jobs'], ['Jobs by state', 'locations'], ['Specialties', 'specialties'], ['Travel nursing', 'travel-nursing'], ['Allied & therapy', 'allied-therapy'], ['Per diem & local', 'per-diem'], ['Permanent placement', 'permanent-placement'], ['Pay & benefits', 'pay-benefits'], ['Licensure guide', 'licensure'], ['Join the talent network', 'apply']])}
            </div>
            <div>
              <h4>Facilities</h4>
              ${list([['Staffing services', 'employers'], ...pillars.slice(0, 4).map(([l, h]) => [l + ' staffing', h]), ['Workforce solutions', 'workforce-solutions'], ['Contract therapy', 'contract-therapy'], ['Credentialing & compliance', 'credentialing-compliance'], ['Mutex Match', 'mutex-match'], ['Request staff', 'contact#request']])}
            </div>
            <div>
              <h4>Company</h4>
              ${list([['About us', 'about'], ['Careers', 'careers'], ['Blog', 'blog'], ['FAQs', 'faqs'], ['Refer a friend', 'referral'], ['Contact', 'contact'], ['Privacy policy', 'privacy'], ['Photo credits', 'photo-credits']])}
            </div>
          </div>
          <div class="footer-bottom">
            <span>© ${new Date().getFullYear()} ${SITE.name}. All rights reserved.</span>
            ${SITE.demoMode ? '<span class="demo-pill">Demo preview · sample listings and figures</span>' : ''}
          </div>
        </div>
      </footer>`;
  }

  /* ---------- Job helpers ---------- */
  MX.payHTML = (j) =>
    j.type === 'Permanent'
      ? `<b>$${Math.round(j.salary / 1000)}k<small>/yr</small></b><span>Direct hire</span>`
      : `<b>${MX.rate(j.rate)}<small>/hr</small></b><span>≈ ${MX.kWeek(j.weekly)}/wk</span>`;

  MX.tagsHTML = (j) => {
    const t = [`<span class="tag t-type">${j.type}</span>`];
    if (j.postedDays === 0) t.push('<span class="tag t-new">New today</span>');
    if (j.weeks) t.push(`<span class="tag">${j.weeks} wks</span>`);
    t.push(`<span class="tag">${j.hours} hrs/wk</span>`, `<span class="tag">${j.shift}</span>`, `<span class="tag">Starts ${MX.fmtDate(j.start)}</span>`);
    return t.join('');
  };

  /* Picture for the top of a job card. Until real city photos are supplied it draws a scene:
     the sky follows the shift (day, evening, night), with the state outline and a skyline seeded
     from the city name so each place looks different. To use a real photo instead, add its path to
     MX.CITY_PHOTOS in js/data.js, keyed like 'Austin, TX'. */
  const artBox = {};
  function stateBox(code) {
    if (artBox[code]) return artBox[code];
    const nums = (MX.US_PATHS[code].match(/-?\d+(\.\d+)?/g) || []).map(Number);
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (let i = 0; i < nums.length; i += 2) { x0 = Math.min(x0, nums[i]); x1 = Math.max(x1, nums[i]); y0 = Math.min(y0, nums[i + 1]); y1 = Math.max(y1, nums[i + 1]); }
    return (artBox[code] = { x: x0, y: y0, w: x1 - x0, h: y1 - y0 });
  }
  const SKY = {
    Days: ['#3f8fe8', '#cfe6ff'], Evenings: ['#27459a', '#f2a65a'], Nights: ['#061538', '#1b3f86'], Rotating: ['#2f6fd6', '#a9c8f7'],
  };
  MX.jobArt = function (j) {
    const photo = (MX.CITY_PHOTOS || {})[`${j.city}, ${j.state}`];
    if (photo) {
      // On Netlify the image service resizes and converts the photo; elsewhere the original file is used.
      const cdn = (w) => MX.img(photo, w);
      return `<img src="${cdn(800)}"${SITE.imageCdn ? ` srcset="${cdn(400)} 400w, ${cdn(800)} 800w" sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 400px"` : ''} width="800" height="340" alt="" loading="lazy" decoding="async">`;
    }
    let seed = 0;
    for (const ch of j.city + j.state) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
    const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const [top, bottom] = SKY[j.shift] || SKY.Days, id = 'ja' + j.id.replace(/\W/g, '');
    const night = j.shift === 'Nights', dusk = j.shift === 'Evenings';
    // back row of buildings, then a darker front row
    const row = (base, minH, maxH, fill) => {
      let x = -6, out = '';
      while (x < 400) {
        const w = 14 + Math.floor(rnd() * 26), h = minH + Math.floor(rnd() * (maxH - minH));
        out += `<rect x="${x}" y="${base - h}" width="${w}" height="${h + 4}" fill="${fill}"/>`;
        if (night || dusk) for (let k = 0; k < 3; k++) if (rnd() > 0.45) out += `<rect x="${x + 3 + Math.floor(rnd() * Math.max(1, w - 9))}" y="${base - h + 5 + Math.floor(rnd() * Math.max(1, h - 12))}" width="3" height="4" fill="#ffd98a" opacity=".85"/>`;
        x += w + Math.floor(rnd() * 5);
      }
      return out;
    };
    let shape = '';
    if (MX.US_PATHS && MX.US_PATHS[j.state]) {
      const b = stateBox(j.state), k = Math.min(150 / b.w, 104 / b.h);
      shape = `<g transform="translate(${(384 - b.w * k).toFixed(1)} ${(14 + (104 - b.h * k) / 2).toFixed(1)}) scale(${k.toFixed(3)}) translate(${-b.x} ${-b.y})"><path d="${MX.US_PATHS[j.state]}" fill="#fff" fill-opacity=".2" stroke="#fff" stroke-opacity=".75" stroke-width="${(1.4 / k).toFixed(2)}" stroke-linejoin="round"/></g>`;
    }
    const stars = night ? Array.from({ length: 16 }, () => `<circle cx="${(rnd() * 400).toFixed(0)}" cy="${(rnd() * 80).toFixed(0)}" r="${(0.6 + rnd()).toFixed(1)}" fill="#fff" opacity="${(0.4 + rnd() * 0.6).toFixed(2)}"/>`).join('') : '';
    const light = night ? '<circle cx="62" cy="40" r="15" fill="#f4f1de"/><circle cx="69" cy="35" r="13" fill="#0b1f4d"/>'
      : dusk ? '<circle cx="78" cy="118" r="30" fill="#ffd98a" opacity=".9"/>'
        : '<circle cx="64" cy="44" r="17" fill="#ffe7a8"/><circle cx="64" cy="44" r="27" fill="#ffe7a8" opacity=".25"/>';
    return `
      <svg viewBox="0 0 400 170" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>
          <linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1"><stop offset=".45" stop-color="#051230" stop-opacity="0"/><stop offset="1" stop-color="#051230" stop-opacity=".72"/></linearGradient>
        </defs>
        <rect width="400" height="170" fill="url(#${id}s)"/>
        ${stars}${light}${shape}
        ${row(150, 26, 70, night ? '#0e2a63' : dusk ? '#3a3f86' : '#6b9fe6')}
        ${row(170, 18, 46, night ? '#071a3f' : dusk ? '#1f2a66' : '#2f67c4')}
        <rect width="400" height="170" fill="url(#${id}f)"/>
      </svg>`;
  };

  MX.jobCard = (j, i = 0) => `
    <article class="job-card jc" data-reveal style="--d:${i * 60}ms">
      <div class="jc-photo">${MX.jobArt(j)}<span class="jc-loc">${j.city}, ${MX.stateName(j.state)}</span></div>
      <div class="jc-body">
        <div class="jc-top">
          <h3><a href="jobs?job=${j.id}">${j.title}</a></h3>
          <div class="jc-pay">
            <small>${j.type === 'Permanent' ? 'Salary:' : 'Pay rate:'}</small>
            <b>${j.type === 'Permanent' ? '$' + Math.round(j.salary / 1000) + 'k/yr' : MX.rate(j.rate) + '/hr'}</b>
            <span>${j.type === 'Permanent' ? 'Direct hire' : '≈ ' + MX.kWeek(j.weekly) + '/wk'}</span>
          </div>
        </div>
        <p class="jc-meta"><span>Starts ${MX.fmtDate(j.start)}</span><span>${j.hours} hrs/wk</span>${j.weeks ? `<span>${j.weeks} weeks</span>` : ''}</p>
        <div class="tags"><span class="tag t-type">${j.type}</span><span class="tag">${j.shift}</span><span class="tag">${MX.specialtyName(j.specialty)}</span>${j.postedDays === 0 ? '<span class="tag t-new">New today</span>' : ''}</div>
        <div class="jc-id">${j.id}</div>
      </div>
    </article>`;

  /* f: { q, group, specialties[], state, types[], shifts[], minPay } */
  MX.filterJobs = function (f = {}) {
    const q = (f.q || '').trim().toLowerCase();
    return JOBS.filter((j) => {
      if (f.group && j.group !== f.group) return false;
      if (f.state && j.state !== f.state) return false;
      if (f.specialties && f.specialties.length && !f.specialties.includes(j.specialty)) return false;
      if (f.types && f.types.length && !f.types.includes(j.type)) return false;
      if (f.shifts && f.shifts.length && !f.shifts.includes(j.shift)) return false;
      if (f.minPay && j.weekly < f.minPay) return false;
      if (q) {
        const hay = `${j.title} ${j.city} ${MX.stateName(j.state)} ${j.state} ${MX.specialtyName(j.specialty)} ${j.type} ${j.setting} ${j.id}`.toLowerCase();
        if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
      }
      return true;
    });
  };

  MX.stateOptions = (first = 'Anywhere in the US') =>
    `<option value="">${first}</option>` + MX.STATES.map((s) => `<option value="${s.code}">${s.name}</option>`).join('');

  /* ---------- Reveal + counters ---------- */
  let io;
  MX.observe = function (root = document) {
    const els = $$('[data-reveal]:not(.in)', root);
    if (!('IntersectionObserver' in window)) return els.forEach((e) => e.classList.add('in'));
    io = io || new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach((e) => io.observe(e));
  };

  function initCounters() {
    const els = $$('[data-count]');
    if (!els.length) return;
    const run = (el) => {
      const target = Number(el.dataset.count), t0 = performance.now(), dur = 1400;
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        el.textContent = (el.dataset.prefix || '') + Math.round(target * e).toLocaleString('en-US') + (el.dataset.suffix || '');
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (!('IntersectionObserver' in window)) return els.forEach(run);
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { run(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.4 });
    els.forEach((e) => { e.textContent = (e.dataset.prefix || '') + '0' + (e.dataset.suffix || ''); cio.observe(e); });
  }

  /* ---------- Demo forms ---------- */
  MX.successHTML = (title, msg, extra = '') => `
    <div class="success" role="status">
      <div class="tick">${MX.icon('check')}</div>
      <h3>${title}</h3>
      <p>${msg}</p>
      ${extra}
      ${SITE.demoMode ? '<div><span class="demo-note">Demo mode: this form is not connected yet, so nothing was sent.</span></div>' : ''}
    </div>`;

  /* Sends a form to MX.SITE.formEndpoint (js/data.js): our Vercel Function api/send-form.js, which emails
     it through Microsoft 365. Sent as JSON: the form's name, the page, the fields, and a résumé as base64
     (PDF or Word up to 3 MB; otherwise the email names the file so a recruiter can ask for it).
     Resolves true only when the email was sent; false when it was not (not set up yet, offline, an
     error), so the visitor sees the phone number and email instead. In demo mode nothing is sent. */
  MX.sendForm = async function (name, data) {
    if (SITE.demoMode) return true;
    if (!SITE.formEndpoint) return false;
    const fields = {}, files = [];
    for (const [k, v] of data.entries()) {
      if (!(v instanceof File)) { fields[k] = (fields[k] ? fields[k] + ', ' : '') + v; continue; }
      if (!v.size) continue;
      const ok = SITE.formFiles && v.size <= 3 * 1024 * 1024 && /\.(pdf|docx?)$/i.test(v.name);
      if (!ok) { fields[k + '-note'] = `${v.name} chosen on the site but not sent (PDF or Word up to 3 MB only). Please ask for it by email.`; continue; }
      const bytes = new Uint8Array(await v.arrayBuffer());
      let bin = '';
      for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
      files.push({ name: v.name, type: v.type, data: btoa(bin) });
      fields[k] = v.name;
    }
    try {
      const res = await fetch(SITE.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ form: name, page: location.pathname, fields, files }),
      });
      return res.ok;
    } catch (e) { return false; }
  };
  MX.sendFailed = `We could not send this just now. Please call ${SITE.phone} or email ${SITE.email} and we will take it from there.`;

  /* The first thing wrong with a form, as a sentence a person can act on */
  function firstProblem(form) {
    for (const field of form.querySelectorAll('input, select, textarea')) {
      if (field.checkValidity()) continue;
      const span = field.closest('.field') && field.closest('.field').querySelector('span');
      const label = span ? span.firstChild.textContent.trim() : '';
      const lower = label.charAt(0).toLowerCase() + label.slice(1);
      let message;
      if (field.type === 'checkbox') message = 'Tick the box above to continue.';
      else if (field.validity.typeMismatch && field.type === 'email') message = 'Enter an email address like name@example.com.';
      else if (field.validity.typeMismatch && field.type === 'url') message = 'Enter a full link starting with https://';
      else if (!label) message = 'Fill in the highlighted field to continue.';
      else if (field.tagName === 'SELECT' || /\?$/.test(label)) message = `Choose or fill in an answer for “${label}”.`;
      else if (/^(your|their) /i.test(label)) message = `Enter ${lower}.`;
      else if (/^(tell|anything|i’m|message)/i.test(label)) message = `Fill in “${label}” so we know how to help.`;
      else message = `Enter your ${lower}.`;
      return { field, message };
    }
    return null;
  }

  function initDemoForms(root = document) {
    $$('form[data-demo-form]', root).forEach((form) => {
      form.noValidate = true; // we show our own messages
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const problem = firstProblem(form);
        let note = $('.form-error', form);
        if (problem) {
          if (!note) {
            note = document.createElement('p');
            note.className = 'error-msg form-error';
            note.setAttribute('role', 'alert');
            (form.querySelector('button[type="submit"]') || form.lastElementChild).before(note);
          }
          note.textContent = problem.message;
          return problem.field.focus();
        }
        if (note) note.remove();
        const data = new FormData(form);
        const first = (data.get('first') || '').toString().trim();
        const button = form.querySelector('button[type="submit"]'), label = button.innerHTML;
        button.disabled = true; button.textContent = 'Sending…';
        const sent = await MX.sendForm(form.dataset.formName || 'contact', data);
        if (!sent) {
          button.disabled = false; button.innerHTML = label;
          note = document.createElement('p');
          note.className = 'error-msg form-error';
          note.setAttribute('role', 'alert');
          note.textContent = MX.sendFailed;
          return button.before(note);
        }
        const title = (form.dataset.title || 'Thanks, we have it.').replace('{first}', MX.esc(first));
        form.outerHTML = MX.successHTML(title, form.dataset.msg || 'We will be in touch within one business day.');
      });
    });
  }
  MX.initDemoForms = initDemoForms;

  /* ---------- Match assistant ---------- */
  function initAssistant() {
    const fab = document.createElement('button');
    fab.className = 'assist-fab';
    fab.innerHTML = `<span class="dot">${MX.icon('sparkles')}</span><span class="lbl">Find my match</span>`;
    fab.setAttribute('aria-label', 'Open the match assistant');
    const panel = document.createElement('section');
    panel.className = 'assist';
    panel.setAttribute('aria-label', 'Match assistant');
    panel.innerHTML = `
      <div class="assist-head">
        <span class="dot">${MX.icon('sparkles')}</span>
        <div><b>Match assistant</b><small>Three taps to a shortlist</small></div>
        <button aria-label="Close assistant">${MX.icon('x')}</button>
      </div>
      <div class="assist-log" aria-live="polite"></div>`;
    document.body.append(fab, panel);
    const log = $('.assist-log', panel);
    const scroll = () => { log.scrollTop = log.scrollHeight; };
    let run = 0;

    const say = (html, delay = 550) => new Promise((res) => {
      const mine = run;
      const m = document.createElement('div');
      m.className = 'msg bot typing';
      m.innerHTML = '<i></i><i></i><i></i>';
      log.append(m); scroll();
      setTimeout(() => {
        if (mine !== run) return;
        m.className = 'msg bot'; m.innerHTML = html; scroll(); res();
      }, delay);
    });
    const me = (text) => { const m = document.createElement('div'); m.className = 'msg me'; m.textContent = text; log.append(m); scroll(); };
    const options = (opts) => new Promise((res) => {
      const wrap = document.createElement('div');
      wrap.className = 'assist-opts';
      opts.forEach((o) => {
        const b = document.createElement('button');
        b.className = 'chip'; b.textContent = o.label;
        b.addEventListener('click', () => { wrap.remove(); me(o.label); res(o.value); });
        wrap.append(b);
      });
      log.append(wrap); scroll();
    });

    async function clinician() {
      await say('Great. What do you do?');
      const role = await options([
        { label: 'Registered Nurse', value: { group: 'rn' } }, { label: 'LPN / LVN', value: { group: 'lpn' } },
        { label: 'PT / PTA', value: { group: 'pt' } }, { label: 'OT / COTA', value: { group: 'ot' } },
        { label: 'SLP', value: { group: 'slp' } }, { label: 'Respiratory', value: { group: 'rt' } },
        { label: 'Imaging / Cath Lab', value: { group: 'imaging' } }, { label: 'Pharmacy', value: { group: 'pharmacy' } },
        { label: 'Something else', value: {} },
      ]);
      await say('Where would you like to work?');
      const pool = MX.filterJobs(role);
      const counts = {};
      pool.forEach((j) => { counts[j.state] = (counts[j.state] || 0) + 1; });
      const topStates = Object.keys(counts).sort((a, b) => counts[b] - counts[a]).slice(0, 5);
      const state = await options([{ label: 'Anywhere', value: '' }, ...topStates.map((s) => ({ label: MX.stateName(s), value: s }))]);
      await say('Any shift preference?');
      const shift = await options([{ label: 'Days', value: 'Days' }, { label: 'Nights', value: 'Nights' }, { label: 'No preference', value: '' }]);
      const f = { ...role, state, shifts: shift ? [shift] : [] };
      const found = MX.filterJobs(f).sort((a, b) => b.weekly - a.weekly);
      if (!found.length) {
        await say('Nothing open with exactly that combination right now. Try widening the location or shift.');
      } else {
        await say(`I found <b>${found.length.toLocaleString('en-US')}</b> ${found.length === 1 ? 'opening' : 'openings'}. Here ${found.length === 1 ? 'it is' : 'are the best-paying'}:`);
        found.slice(0, 3).forEach((j) => {
          const a = document.createElement('a');
          a.className = 'mini-job'; a.href = 'jobs?job=' + j.id;
          a.innerHTML = `<em>${j.type === 'Permanent' ? '$' + Math.round(j.salary / 1000) + 'k/yr' : MX.kWeek(j.weekly) + '/wk'}</em><b>${j.title}</b><span>${j.city}, ${j.state} · ${j.type} · ${j.shift}</span>`;
          log.append(a);
        });
        scroll();
      }
      const p = new URLSearchParams();
      if (f.group) p.set('group', f.group);
      if (state) p.set('state', state);
      if (shift) p.set('shift', shift);
      const next = await options([
        ...(found.length ? [{ label: `See all ${found.length.toLocaleString('en-US')}`, value: 'all' }] : []),
        { label: 'Start over', value: 'restart' },
      ]);
      if (next === 'all') location.href = 'jobs' + (p.toString() ? '?' + p : '');
      else start();
    }

    async function facility() {
      await say('Happy to help. Which roles do you need covered?');
      const need = await options(MX.SPECIALTIES.map((s) => ({ label: s.name, value: s })));
      await say('How soon do you need them on the floor?');
      const when = await options([
        { label: 'As soon as possible', value: 'asap' }, { label: 'In 2–4 weeks', value: 'weeks' }, { label: 'Planning ahead', value: 'planning' },
      ]);
      await say(`Got it: <b>${need.name}</b>. The request form takes about a minute, and a staffing specialist replies within one business day.`);
      const next = await options([{ label: 'Open the request form', value: 'go' }, { label: 'Start over', value: 'restart' }]);
      if (next === 'go') location.href = `contact?need=${need.id}&when=${when}#request`;
      else start();
    }

    async function start() {
      run++;
      log.innerHTML = '';
      await say('Hi, I’m the Mutex match assistant. Three quick taps and I’ll line up a shortlist. Which describes you?', 400);
      const who = await options([{ label: 'I’m a clinician', value: 'c' }, { label: 'I’m hiring', value: 'f' }]);
      if (who === 'c') clinician(); else facility();
    }

    let started = false;
    const open = () => { panel.classList.add('show'); fab.hidden = true; if (!started) { started = true; start(); } };
    const close = () => { panel.classList.remove('show'); fab.hidden = false; };
    fab.addEventListener('click', open);
    $('.assist-head button', panel).addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && panel.classList.contains('show')) close(); });
    MX.openAssistant = open;
    $$('[data-open-assistant]').forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); open(); }));
  }

  /* ---------- US jobs map: real state outlines (js/usmap.js), shaded by open jobs ---------- */
  function initStateMaps() {
    const hosts = $$('[data-state-map]');
    if (!hosts.length || !MX.US_PATHS) return;
    const stat = {};
    JOBS.forEach((j) => {
      const s = (stat[j.state] = stat[j.state] || { count: 0, top: null, cities: new Set() });
      s.count++; s.cities.add(j.city);
      if (j.type !== 'Permanent' && (!s.top || j.weekly > s.top.weekly)) s.top = j;
    });
    const sorted = Object.values(stat).map((s) => s.count).sort((a, b) => a - b);
    const level = (n) => 1 + Math.min(4, Math.floor((sorted.filter((c) => c < n).length / sorted.length) * 5));
    const busiest = Object.keys(stat).sort((a, b) => stat[b].count - stat[a].count)[0];

    hosts.forEach((host) => {
      host.classList.add('usmap');
      const count = (code) => (stat[code] || { count: 0 }).count;
      const label = (s) => `${s.name}, ${count(s.code)} open jobs`;
      // the small north-eastern states get a chip in the Atlantic, joined to the state by a thin line
      const chips = MX.US_CALLOUT.map((code, k) => ({ code, x: 968, y: 150 + k * 31 }));
      host.innerHTML = `
        <div>
          <svg class="usmap-svg" viewBox="0 0 1024 610" role="group" aria-label="Map of open jobs by state">
            <g class="usmap-states">${MX.STATES.map((s) =>
              `<a class="st l${level(count(s.code))}" href="jobs?state=${s.code}" data-st="${s.code}" aria-label="${label(s)}"><path d="${MX.US_PATHS[s.code]}"/></a>`).join('')}</g>
            <g class="usmap-lines" aria-hidden="true">${chips.map((c) => `<path d="M${c.x} ${c.y + 12}L${MX.US_LABELS[c.code][0]} ${MX.US_LABELS[c.code][1]}"/>`).join('')}</g>
            <g class="usmap-chips">${chips.map((c) => {
              const s = MX.STATES.find((x) => x.code === c.code);
              return `<a class="st chip-st l${level(count(c.code))}" href="jobs?state=${c.code}" data-st="${c.code}" aria-label="${label(s)}"><rect x="${c.x}" y="${c.y}" width="46" height="24" rx="7"/><text x="${c.x + 23}" y="${c.y + 16.5}">${c.code}</text></a>`;
            }).join('')}</g>
            <g class="usmap-labels" aria-hidden="true">${MX.STATES.filter((s) => !MX.US_CALLOUT.includes(s.code)).map((s) =>
              `<text class="l${level(count(s.code))}" x="${MX.US_LABELS[s.code][0]}" y="${MX.US_LABELS[s.code][1] + 4}">${s.code}</text>`).join('')}</g>
          </svg>
          <div class="usmap-legend"><span>Fewer jobs</span><i class="l1"></i><i class="l2"></i><i class="l3"></i><i class="l4"></i><i class="l5"></i><span>More jobs</span></div>
          <select class="select usmap-select" aria-label="Choose a state">${MX.STATES.map((s) => `<option value="${s.code}">${s.name}</option>`).join('')}</select>
        </div>
        <aside class="usmap-info" aria-live="polite"></aside>`;
      const info = $('.usmap-info', host);
      const show = (code) => {
        const s = stat[code], t = s.top;
        $$('.st', host).forEach((a) => a.classList.toggle('on', a.dataset.st === code));
        $('.usmap-select', host).value = code;
        info.innerHTML = `
          <small>Hover or tap a state</small>
          <h3>${MX.stateName(code)}</h3>
          <div class="usmap-big"><b>${s.count.toLocaleString('en-US')}</b><span>open jobs</span></div>
          <dl>
            <div><dt>Top weekly pay</dt><dd>${t ? MX.money(t.weekly) : 'See listings'}</dd></div>
            <div><dt>Best-paying role</dt><dd>${t ? t.title : 'Permanent roles'}</dd></div>
            <div><dt>Hiring in</dt><dd>${[...s.cities].slice(0, 3).join(', ')}</dd></div>
          </dl>
          <a class="btn btn-primary btn-block" href="jobs?state=${code}">See jobs in ${MX.stateName(code)} ${MX.icon('arrow', 'arrow')}</a>`;
      };
      host.addEventListener('mouseover', (e) => { const a = e.target.closest('.st'); if (a) show(a.dataset.st); });
      host.addEventListener('focusin', (e) => { const a = e.target.closest('.st'); if (a) show(a.dataset.st); });
      $('.usmap-select', host).addEventListener('change', (e) => show(e.target.value));
      /* On touch screens the first tap shows the state's details; the second tap (or the button) opens its jobs */
      let armed = '';
      host.addEventListener('pointerdown', (e) => { const a = e.target.closest('.st'); armed = a && a.classList.contains('on') ? a.dataset.st : ''; });
      host.addEventListener('click', (e) => {
        const a = e.target.closest('.st');
        if (a && armed !== a.dataset.st && window.matchMedia('(hover: none)').matches) { e.preventDefault(); show(a.dataset.st); }
      });
      show(busiest);
    });
  }

  /* ---------- Boot ---------- */
  /* A refresh starts the page again from the top (the intro) instead of where the visitor had scrolled to.
     The back and forward buttons still return to the previous spot. */
  if ((performance.getEntriesByType('navigation')[0] || {}).type === 'reload') {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    toTop();
    window.addEventListener('load', () => {
      toTop();
      setTimeout(() => { if ('scrollRestoration' in history) history.scrollRestoration = 'auto'; }, 0);
    });
  }
  renderHeader();
  renderFooter();
  MX.hydrateIcons();
  $$('[data-jobs-total]').forEach((el) => { el.textContent = total; });
  $$('[data-site-phone]').forEach((el) => { el.textContent = SITE.phone; if (el.tagName === 'A') el.href = SITE.phoneHref; });
  $$('[data-site-email]').forEach((el) => { el.textContent = SITE.email; if (el.tagName === 'A') el.href = 'mailto:' + SITE.email; });
  $$('[data-site-hours]').forEach((el) => { el.textContent = SITE.hours; });
  $$('[data-site-address]').forEach((el) => { el.innerHTML = SITE.address.join('<br>'); });
  $$('a[data-map-link]').forEach((el) => { el.href = SITE.mapHref; });
  $$('a[data-phone-link]').forEach((el) => { el.href = SITE.phoneHref; });
  $$('a[data-email-link]').forEach((el) => { el.href = 'mailto:' + SITE.email; });
  if (!SITE.demoMode) $$('.demo-only').forEach((el) => el.remove());
  initDemoForms();
  initStateMaps();
  initAssistant();
  /* ---------- Photo protection ----------
     Turns off the usual ways to save a photo: the right-click menu, dragging it out of the page and
     (with the CSS in styles.css) the long-press menu on phones. A determined visitor can still take a
     screenshot; no website can prevent that. */
  const isPhoto = (el) => el && el.tagName === 'IMG';
  document.addEventListener('contextmenu', (e) => { if (isPhoto(e.target)) e.preventDefault(); });
  document.addEventListener('dragstart', (e) => { if (isPhoto(e.target)) e.preventDefault(); });

  /* ---------- Even spacing between sections ----------
     A plain section that comes straight after another plain section drops its top padding, so the gap
     between them is one section's padding, not two. "Straight after" means the previous section a
     visitor can see: the home page hides different sections for hiring and clinician visitors, so this
     runs again whenever that choice changes. */
  function tightenSections() {
    const main = $('main');
    if (!main) return;
    let prev = null;
    [...main.children].forEach((el) => {
      if (getComputedStyle(el).display === 'none') return;
      const plain = el.classList.contains('section') && !el.classList.contains('band');
      if (plain) el.classList.toggle('flow-0', !!prev && prev.classList.contains('section') && !prev.classList.contains('band'));
      prev = el;
    });
  }
  new MutationObserver(tightenSections).observe(document.body, { attributes: true, attributeFilter: ['data-aud'] });

  document.addEventListener('DOMContentLoaded', () => { initCounters(); MX.observe(); tightenSections(); });
})();
