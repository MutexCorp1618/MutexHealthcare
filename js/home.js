/* Mutex Healthcare Staffing — home page.
   The page has two versions (hiring and clinician). The toggle in the hero sets body[data-aud];
   CSS shows the matching [data-for] blocks, and this file runs the interactive pieces of each. */
(function () {
  'use strict';
  const MX = window.MX;
  const { $, $$, JOBS } = MX;
  const fmt = (n) => n.toLocaleString('en-US');
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const median = (list) => (list.length ? list.slice().sort((a, b) => a - b)[Math.floor(list.length / 2)] : 0);

  /* The stats band: counted from the job board and rounded down to a tidy number with a plus
     (1,264 becomes 1,200+), unless a company figure is set in MX.HOME_STATS in js/data.js. */
  const tidy = (n) => (n >= 1000 ? Math.floor(n / 100) * 100 : n >= 100 ? Math.floor(n / 10) * 10 : n >= 20 ? Math.floor(n / 5) * 5 : n);
  const counted = [JOBS.length, new Set(JOBS.map((j) => j.state)).size, new Set(JOBS.map((j) => j.city + j.state)).size, new Set(JOBS.map((j) => j.title)).size];
  $$('.stat[data-stat]').forEach((el) => {
    const i = Number(el.dataset.stat), own = (MX.HOME_STATS || [])[i], num = el.querySelector('b');
    const value = own ? own.value : tidy(counted[i]);
    num.dataset.count = value;
    num.dataset.suffix = (own ? own.plus : value < counted[i]) ? '+' : '';
    if (own) {
      if (own.facility) el.querySelector('[data-for="facility"]').textContent = own.facility;
      if (own.clinician) el.querySelector('[data-for="clinician"]').textContent = own.clinician;
    }
  });

  /* ---------- Audience: hiring or clinician ---------- */
  const audience = () => document.body.dataset.aud;
  function setAudience(aud, remember) {
    document.body.dataset.aud = aud;
    $$('.seg button').forEach((b) => b.setAttribute('aria-selected', b.dataset.aud === aud));
    if (remember) { try { localStorage.setItem('mx-aud', aud); } catch (e) { /* storage unavailable */ } }
    paintHow(aud);
    document.dispatchEvent(new CustomEvent('mx:aud', { detail: aud }));
  }
  $$('.seg button').forEach((btn) => btn.addEventListener('click', () => setAudience(btn.dataset.aud, true)));

  /* ---------- Clinician hero: two questions ---------- */
  const ROLE_CHIPS = [
    { label: 'Registered Nurse', q: { group: 'rn' } },
    { label: 'LPN / LVN', q: { group: 'lpn' } },
    { label: 'PT / PTA', q: { group: 'pt' } },
    { label: 'OT / COTA', q: { group: 'ot' } },
    { label: 'SLP', q: { group: 'slp' } },
    { label: 'Pharmacy', q: { specialty: 'pharmacy' } },
    { label: 'Imaging / Cath Lab', q: { specialty: 'imaging' } },
    { label: 'Behavioral Health', q: { specialty: 'behavioral' } },
    { label: 'Healthcare IT', q: { specialty: 'hit' } },
    { label: 'Something else', q: {} },
  ];
  let roleQ = null;
  const roleChips = $('#roleChips');
  const stateSel = $('#heroState');
  stateSel.innerHTML = MX.stateOptions();
  roleChips.innerHTML = ROLE_CHIPS.map((c, i) => `<button class="chip" type="button" aria-pressed="false" data-i="${i}">${c.label}</button>`).join('');
  function updateMatcher() {
    const q = roleQ || {};
    const n = MX.filterJobs({ group: q.group, specialties: q.specialty ? [q.specialty] : [], state: stateSel.value }).length;
    $('#heroCount').textContent = fmt(n);
    const p = new URLSearchParams();
    if (q.group) p.set('group', q.group);
    if (q.specialty) p.set('specialty', q.specialty);
    if (stateSel.value) p.set('state', stateSel.value);
    $('#heroGo').href = 'jobs' + (p.toString() ? '?' + p : '');
  }
  roleChips.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    const on = btn.getAttribute('aria-pressed') === 'true';
    $$('.chip', roleChips).forEach((b) => b.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', !on);
    roleQ = on ? null : ROLE_CHIPS[btn.dataset.i].q;
    updateMatcher();
  });
  stateSel.addEventListener('change', updateMatcher);
  updateMatcher();

  /* ---------- Hiring hero: two questions ---------- */
  const needChips = $('#needChips');
  let need = '';
  needChips.innerHTML = MX.SPECIALTIES.map((s) => `<button class="chip" type="button" aria-pressed="false" data-id="${s.id}">${s.name}</button>`).join('');
  function updateRequest() {
    const p = new URLSearchParams();
    if (need) p.set('need', need);
    p.set('when', $('#heroWhen').value);
    $('#heroRequest').href = 'contact?' + p + '#request';
  }
  needChips.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    const on = btn.getAttribute('aria-pressed') === 'true';
    $$('.chip', needChips).forEach((b) => b.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', !on);
    need = on ? '' : btn.dataset.id;
    updateRequest();
  });
  $('#heroWhen').addEventListener('change', updateRequest);
  updateRequest();

  /* ---------- Hiring creative: a week of ICU shifts being covered (illustration) ---------- */
  (function coverBoard() {
    const grid = $('#cbGrid');
    if (!grid) return;
    const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], SHIFTS = ['Days', 'Evenings', 'Nights'];
    const ON_STAFF = ['JM', 'TR', 'KP', 'AL', 'CS', 'RD', 'WN', 'EB', 'MO', 'FH', 'GS', 'IV', 'PB', 'ZA'];
    const POOL = [
      ['AK', 'Amara K., RN', 96], ['DL', 'Daniel L., RN', 92], ['SM', 'Sofia M., RN', 88], ['JT', 'Jordan T., RN', 95],
      ['NP', 'Nia P., RN', 91], ['RC', 'Rafael C., RN', 86], ['HL', 'Hana L., RN', 90], ['BO', 'Ben O., RN', 85],
    ];
    const OPEN = 7, TOTAL = DAYS.length * SHIFTS.length;
    let open = [], timer = 0, used = 0;

    function stats() {
      const covered = TOTAL - open.length;
      $('#cbOpen').textContent = open.length;
      $('#cbPct').textContent = Math.round((covered / TOTAL) * 100) + '%';
      $('#cbBar').style.width = (covered / TOTAL) * 100 + '%';
    }
    function build() {
      clearInterval(timer);
      used = 0;
      const all = Array.from({ length: TOTAL }, (_, i) => i);
      // open shifts lean toward nights and the weekend, where gaps usually are
      const weight = (i) => (Math.floor(i / 7) === 2 ? 3 : 1) + (i % 7 >= 5 ? 2 : 0);
      open = [];
      while (open.length < OPEN) {
        const bag = all.filter((i) => !open.includes(i)).flatMap((i) => Array(weight(i)).fill(i));
        open.push(bag[Math.floor(Math.random() * bag.length)]);
      }
      grid.innerHTML = '<span></span>' + DAYS.map((d) => `<span class="cb-day">${d}</span>`).join('') +
        SHIFTS.map((s, r) => `<span class="cb-shift">${s}</span>` + DAYS.map((d, c) => {
          const i = r * 7 + c;
          return open.includes(i)
            ? `<button class="cb-cell open" type="button" data-i="${i}" aria-label="Open shift, ${d} ${s.toLowerCase()}. Fill it">Open</button>`
            : `<span class="cb-cell">${ON_STAFF[(i * 5 + r) % ON_STAFF.length]}</span>`;
        }).join('')).join('');
      $('#cbLog').textContent = 'Seven shifts open this week. Tap an open shift to fill it, or watch.';
      stats();
      if (!reduceMotion) timer = setInterval(() => { if (audience() === 'facility' && !document.hidden) fill(open[Math.floor(Math.random() * open.length)]); }, 1700);
    }
    function fill(i) {
      const cell = $(`[data-i="${i}"]`, grid);
      if (!cell) return;
      const [initials, name, fit] = POOL[used++ % POOL.length];
      const done = document.createElement('span');
      done.className = 'cb-cell new';
      done.textContent = initials;
      cell.replaceWith(done);
      open = open.filter((x) => x !== i);
      stats();
      $('#cbLog').textContent = open.length
        ? `Matched ${name} to ${DAYS[i % 7]} ${SHIFTS[Math.floor(i / 7)].toLowerCase()}, ${fit}% fit.`
        : 'Every shift covered. That is the week we work toward.';
      if (!open.length) clearInterval(timer);
    }
    grid.addEventListener('click', (e) => { const b = e.target.closest('.cb-cell.open'); if (b) fill(Number(b.dataset.i)); });
    $('#cbReset').addEventListener('click', build);
    document.addEventListener('mx:aud', (e) => { if (e.detail === 'facility') build(); });
    build();
  })();

  /* ---------- Hiring: sample shortlist ---------- */
  (function shortlist() {
    const roles = $('#slRoles');
    if (!roles) return;
    const DATA = [
      { label: 'ICU nurse', need: 'nursing', ask: 'Registered Nurse, ICU · 13 weeks · Nights', people: [['AK', 'Amara K., RN', 'ICU · 7 yrs · CCRN · compact license', 96], ['DL', 'Daniel L., RN', 'CVICU · 5 yrs · ACLS · free in 2 weeks', 92], ['SM', 'Sofia M., RN', 'MICU · 4 yrs · 6 travel assignments', 88]] },
      { label: 'ER nurse', need: 'nursing', ask: 'Registered Nurse, Emergency · 13 weeks · Days', people: [['JT', 'Jordan T., RN', 'Level I trauma · 8 yrs · CEN · TNCC', 95], ['NP', 'Nia P., RN', 'ER · 5 yrs · ACLS · PALS', 91], ['RC', 'Rafael C., RN', 'ER and urgent care · 3 yrs · free now', 86]] },
      { label: 'Physical therapist', need: 'therapy', ask: 'Physical Therapist · 13 weeks · Outpatient', people: [['MT', 'Marcus T., DPT', 'Outpatient ortho · 6 yrs · licensed in state', 94], ['HL', 'Hana L., PT', 'Inpatient rehab · 9 yrs · neuro', 90], ['BO', 'Ben O., DPT', 'Home health · 4 yrs · free in 3 weeks', 85]] },
      { label: 'CT technologist', need: 'imaging', ask: 'CT Technologist · 8 weeks · Evenings', people: [['ER', 'Elena R., RT(R)(CT)', 'Level II trauma · 8 yrs · takes call', 96], ['KS', 'Kofi S., RT(R)(CT)', 'Outpatient and ER · 5 yrs · weekends', 89], ['LW', 'Lucy W., RT(R)(CT)', 'Stroke center · 4 yrs · free now', 87]] },
      { label: 'Respiratory therapist', need: 'allied', ask: 'Respiratory Therapist · 13 weeks · Nights', people: [['DM', 'Dana M., RRT', 'Adult ICU · 7 yrs · ACLS · vents', 95], ['TV', 'Tomas V., RRT', 'NICU and PICU · 6 yrs · NRP · PALS', 90], ['AS', 'Aisha S., RRT', 'Med-surg and ER · 3 yrs · nights', 84]] },
      { label: 'Pharmacist', need: 'pharmacy', ask: 'Pharmacist, Hospital · 26 weeks · Days', people: [['GH', 'Grace H., PharmD', 'Inpatient · 10 yrs · sterile compounding', 94], ['OB', 'Omar B., PharmD', 'Clinical · 6 yrs · anticoagulation', 91], ['YC', 'Yuki C., PharmD', 'Long-term care · 4 yrs · free in 2 weeks', 86]] },
    ];
    roles.innerHTML = DATA.map((d, i) => `<button class="chip" type="button" aria-pressed="${i === 0}" data-i="${i}">${d.label}</button>`).join('');
    function show(i) {
      const d = DATA[i];
      $$('.chip', roles).forEach((b, k) => b.setAttribute('aria-pressed', k === i));
      $('#slTitle').textContent = d.ask;
      $('#slList').innerHTML = d.people.map(([ini, name, line, fit]) => `
        <div class="cand"><span class="avatar">${ini}</span><div><b>${name}</b><small>${line}</small><div class="bar"><i data-w="${fit}"></i></div></div><span class="fit">${fit}%</span></div>`).join('');
      $('#slGo').href = `contact?need=${d.need}#request`;
      $$('.bar i', $('#slList')).forEach((b, k) => setTimeout(() => { b.style.width = b.dataset.w + '%'; }, 120 + k * 160));
    }
    roles.addEventListener('click', (e) => { const b = e.target.closest('.chip'); if (b) show(Number(b.dataset.i)); });
    show(0);
  })();

  /* ---------- Hiring: where demand is highest on the board ---------- */
  (function demand() {
    const byTitle = {};
    JOBS.forEach((j) => { (byTitle[j.title] = byTitle[j.title] || []).push(j); });
    const top = Object.entries(byTitle).sort((a, b) => b[1].length - a[1].length).slice(0, 6);
    const max = top[0][1].length;
    /* A photo for each role: the first match wins, then the specialty's staffing page photo.
       Files live in assets/people/. */
    const ROLE_PHOTOS = [
      [/ICU|Critical/i, 'role-icu'], [/Emergency/i, 'role-er'], [/Respiratory/i, 'role-rt'],
      [/Med-Surg|Telemetry/i, 'role-medsurg'], [/Long-Term|LPN|LVN|Nursing Assistant|Home Health/i, 'rural-critical-access'],
      [/Operating|Surgical/i, 'home-hiring'],
      [/Physical Therap/i, 'role-pt'], [/Occupational/i, 'contract-therapy'], [/Speech/i, 'specialty-federal-schools'],
      [/Radiolog|MRI|CT |Sonograph|Imaging/i, 'staffing-radiology'], [/Pharmac/i, 'specialty-pharmacy'],
    ];
    const used = new Set();
    const rolePhoto = (title, specialty) => {
      const slug = (MX.SPECIALTIES.find((sp) => sp.id === specialty) || {}).slug || 'nursing';
      const options = [...ROLE_PHOTOS.filter(([re]) => re.test(title)).map(([, f]) => f), `staffing-${slug}`, `specialty-${slug}`, 'home-clinician'];
      const file = options.find((f) => !used.has(f)) || options[0];
      used.add(file);
      const src = `assets/people/${file}.jpg`;
      const url = (w) => MX.img(src, w);
      return `<div class="demand-photo"><img src="${url(640)}" srcset="${url(400)} 400w, ${url(640)} 640w, ${url(960)} 960w" sizes="(max-width: 700px) 100vw, 380px" alt="" loading="lazy" decoding="async"></div>`;
    };
    $('#demandGrid').innerHTML = top.map(([title, list], i) => {
      const states = {};
      list.forEach((j) => { states[j.state] = (states[j.state] || 0) + 1; });
      const hot = Object.keys(states).sort((a, b) => states[b] - states[a]).slice(0, 3).join(', ');
      const rate = median(list.filter((j) => j.type !== 'Permanent').map((j) => j.rate));
      return `
        <article class="job-card demand-card" data-reveal style="--d:${(i % 3) * 60}ms">
          ${rolePhoto(title, list[0].specialty)}
          <div class="demand-top"><b>${fmt(list.length)}</b><span>open roles</span></div>
          <h3><a href="contact?need=${list[0].specialty}#request">${title}</a></h3>
          <div class="bar"><i style="width:${Math.round((list.length / max) * 100)}%"></i></div>
          <dl>
            <div><dt>Typical offer</dt><dd>${MX.rate(rate)}/hr</dd></div>
            <div><dt>Most demand in</dt><dd>${hot}</dd></div>
          </dl>
          <div class="job-foot"><span>Staff this role</span><span class="go">${MX.icon('arrow')}</span></div>
        </article>`;
    }).join('');
  })();

  /* ---------- Marquee ---------- */
  const SETTINGS = ['Acute care hospitals', 'Skilled nursing facilities', 'Home health agencies', 'Outpatient clinics', 'Surgery centers', 'School districts', 'Behavioral health centers', 'Government and corrections', 'Critical access hospitals', 'Rehab units'];
  $('#marquee').innerHTML = [...SETTINGS, ...SETTINGS].map((s) => `<span>${s}</span>`).join('');

  /* ---------- Clinician: trending jobs (highest weekly pay, one per role and state) ---------- */
  const seenTitle = new Set(), seenState = new Set(), trending = [];
  JOBS.filter((j) => j.type === 'Travel Contract' && j.postedDays <= 6)
    .sort((a, b) => b.weekly - a.weekly)
    .some((j) => {
      if (seenTitle.has(j.title) || seenState.has(j.state)) return false;
      seenTitle.add(j.title); seenState.add(j.state); trending.push(j);
      return trending.length === 6;
    });
  $('#trendingGrid').innerHTML = trending.map(MX.jobCard).join('');

  /* ---------- Specialties: one grid per version ---------- */
  /* Each card shows the photo from that specialty's page (assets/people/<page>.jpg) */
  const specPhoto = (page) => {
    const src = `assets/people/${page}.jpg`;
    const url = (w) => MX.img(src, w);
    return `<img class="spec-photo" src="${url(560)}" srcset="${url(360)} 360w, ${url(560)} 560w, ${url(900)} 900w" sizes="(max-width: 700px) 100vw, 300px" alt="" loading="lazy" decoding="async">`;
  };
  const specCard = (s, i, href, link) => `
      <div class="spec-card has-photo" data-reveal style="--d:${(i % 4) * 70}ms">
        ${specPhoto(href)}
        <span class="num">0${i + 1}</span>
        <span class="ico">${MX.icon(s.icon)}</span>
        <h3>${s.name}</h3>
        <p>${s.blurb}</p>
        <a class="link-arrow" href="${href}">${link} ${MX.icon('arrow')}</a>
      </div>`;
  const FACILITY_BLURB = {
    nursing: 'Registered nurses, LPNs and nursing assistants for every unit, credentialed and ready for your review.',
    allied: 'Respiratory therapists, laboratory scientists, surgical and sterile processing technicians.',
    therapy: 'Physical, occupational and speech therapists and assistants, for one leave or a whole department.',
    imaging: 'Registered technologists and sonographers for vacancies, leave and new equipment.',
    pharmacy: 'Licensed pharmacists and registered technicians for inpatient, clinical and long-term care pharmacy.',
    behavioral: 'Psychiatric nurses, licensed social workers and behavioral health technicians.',
    schools: 'School nurses, speech-language pathologists, psychologists and correctional health clinicians.',
    hit: 'EHR analysts, clinical informatics specialists and trainers for go-live and every day after.',
  };
  $('#specGrid').innerHTML = MX.SPECIALTIES.map((s, i) =>
    specCard(s, i, `specialty-${s.slug}`, `${fmt(JOBS.filter((j) => j.specialty === s.id).length)} open jobs`)).join('');
  $('#pillarGrid').innerHTML = MX.SPECIALTIES.map((s, i) =>
    specCard({ ...s, blurb: FACILITY_BLURB[s.id] }, i, `staffing-${s.slug}`, `${s.name} staffing`)).join('');

  /* ---------- How it works ---------- */
  const HOW = {
    clinician: [
      ['Tell us what you want', 'Two questions to start: what you do and where you want to be. Add shift, setting and pay goals whenever you like.'],
      ['See real pay, up front', 'Every posting shows the rate before you apply. Compare assignments side by side without a single phone call.'],
      ['Meet your one recruiter', 'They handle credentialing, licensing questions and interview prep, and stay with you for the whole assignment.'],
      ['Start, and stay supported', 'First-day details arrive before you do. Extensions, new contracts and the next move are ready when you are.'],
    ],
    facility: [
      ['Share the need', 'Roles, headcount, dates and must-haves. The request form takes about a minute, or call us and we will take it down.'],
      ['Review matched candidates', 'Mutex Match ranks the pool and a recruiter vets the shortlist. You see credentialed profiles, usually within days.'],
      ['Interview and confirm', 'Talk to the clinicians you like. We lock in the offer, the start date and every compliance item.'],
      ['Stay covered', 'One account lead for extensions, replacements and reporting, with expiry dates tracked for the whole assignment.'],
    ],
  };
  function paintHow(aud) {
    $('#howSteps').innerHTML = HOW[aud].map(([t, p], i) => `<div class="step" data-reveal style="--d:${i * 70}ms"><h3>${t}</h3><p>${p}</p></div>`).join('');
    MX.observe($('#howSteps'));
  }

  /* ---------- Clinician: pay estimator ---------- */
  const estRole = $('#estRole'), estHours = $('#estHours'), estWeeks = $('#estWeeks');
  estRole.innerHTML = MX.SPECIALTIES.map((s) =>
    `<optgroup label="${s.name}">${MX.ROLES.filter((r) => r.specialty === s.id).map((r) => `<option>${r.title}</option>`).join('')}</optgroup>`).join('');
  const fill = (el) => el.style.setProperty('--fill', ((el.value - el.min) / (el.max - el.min)) * 100 + '%');
  function estimate() {
    const title = estRole.value;
    const rates = JOBS.filter((j) => j.title === title && j.type !== 'Permanent').map((j) => j.rate).sort((a, b) => a - b);
    const role = MX.ROLES.find((r) => r.title === title);
    const lo = rates.length ? rates[Math.floor(rates.length * 0.1)] : role.min;
    const hi = rates.length ? rates[Math.floor(rates.length * 0.9)] : role.max;
    const h = Number(estHours.value), w = Number(estWeeks.value);
    const round = (n) => Math.round(n / 10) * 10;
    $('#estHoursOut').textContent = h;
    $('#estWeeksOut').textContent = w + ' weeks';
    $('#estWeekly').innerHTML = `${MX.money(round(lo * h))} – ${MX.money(round(hi * h))} <small>/wk</small>`;
    $('#estHourly').textContent = `${MX.rate(lo)} – ${MX.rate(hi)}`;
    $('#estTotal').textContent = `${MX.kWeek(lo * h * w)} – ${MX.kWeek(hi * h * w)}`;
    $('#estGo').href = 'jobs?q=' + encodeURIComponent(title);
    fill(estHours); fill(estWeeks);
  }
  [estRole, estHours, estWeeks].forEach((el) => el.addEventListener('input', estimate));
  estimate();

  /* Apply the starting version (set in the page, or remembered from a previous visit) */
  /* The small script at the top of the page normally does this before anything is drawn. It is repeated
     here so the visitor's choice still survives a refresh if a browser or host refuses that script. */
  let startAs = audience();
  try {
    const wanted = new URLSearchParams(location.search).get('for') || localStorage.getItem('mx-aud');
    if (wanted === 'clinician' || wanted === 'facility') startAs = wanted;
  } catch (e) { /* storage unavailable */ }
  setAudience(startAs === 'clinician' ? 'clinician' : 'facility', false);

  /* ---------- Hero: the match lock (three dials, one best match) ---------- */
  (function matchLock() {
    const host = $('#matchLock');
    if (!host) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const REGIONS = {
      West: 'WA OR CA NV ID MT WY UT CO AK HI', Southwest: 'AZ NM TX OK', Midwest: 'ND SD NE KS MN IA MO WI IL IN MI OH',
      Southeast: 'AR LA MS AL GA FL SC NC TN KY VA WV', Northeast: 'ME NH VT MA RI CT NY NJ PA DE MD',
    };
    const any = (label) => ({ label, test: () => true });
    const spec = (label, id) => ({ label, test: (j) => j.specialty === id, q: ['specialty', id] });
    const group = (label, id) => ({ label, test: (j) => j.group === id, q: ['group', id] });
    const DIALS = [
      { cap: 'Who', name: 'role', items: [any('Any role'), group('Registered Nurse', 'rn'), group('LPN / LVN', 'lpn'), spec('Therapy', 'therapy'), group('Respiratory', 'rt'), spec('Imaging', 'imaging'), spec('Pharmacy', 'pharmacy'), spec('Behavioral', 'behavioral'), spec('Allied health', 'allied'), spec('Healthcare IT', 'hit')] },
      { cap: 'Where', name: 'region', items: [any('Anywhere'), ...Object.keys(REGIONS).map((r) => ({ label: r, test: (j) => REGIONS[r].includes(j.state) }))] },
      { cap: 'When', name: 'shift', items: [any('Any shift'), ...MX.SHIFTS.map((s) => ({ label: s, test: (j) => j.shift === s, q: ['shift', s] }))] },
    ];
    const ROW = 44;
    const reelsEl = $('#reels'), result = $('#lockResult'), countEl = $('#lockCount'), countLabel = $('#lockCountLabel'), openBtn = $('#lockOpen');

    function place(r, dur) {
      r.strip.style.transition = dur ? `transform ${dur}ms cubic-bezier(.2,.8,.2,1)` : 'none';
      r.strip.style.transform = `translateY(${ROW - r.pos * ROW}px)`;
      if (!dur) void r.strip.offsetHeight;
      r.cells.forEach((c, i) => c.classList.toggle('on', i === r.pos));
    }
    /* The list is rendered three times so the dial can wrap; snap back to the middle copy before each step */
    function move(r, dir, dur = 260) {
      if (r.pos >= 2 * r.n) { r.pos -= r.n; place(r, 0); } else if (r.pos < r.n) { r.pos += r.n; place(r, 0); }
      r.pos += dir; place(r, dur);
    }
    const value = (r) => r.items[r.pos % r.n];
    const reels = DIALS.map((d) => {
      const el = document.createElement('div');
      el.className = 'reel';
      el.innerHTML = `
        <span class="reel-cap">${d.cap}</span>
        <button class="reel-btn" type="button" data-dir="-1" aria-label="Previous ${d.name}">${MX.icon('chevron')}</button>
        <div class="reel-window" title="Click to turn"><div class="reel-strip">${[0, 1, 2].map(() => d.items.map((it) => `<span>${it.label}</span>`).join('')).join('')}</div></div>
        <button class="reel-btn" type="button" data-dir="1" aria-label="Next ${d.name}">${MX.icon('chevron')}</button>`;
      reelsEl.append(el);
      const r = { el, items: d.items, n: d.items.length, pos: d.items.length, strip: $('.reel-strip', el) };
      r.cells = $$('span', r.strip);
      place(r, 0);
      return r;
    });

    const matches = () => JOBS.filter((j) => reels.every((r) => value(r).test(j)));
    const lockedCard = `
      <div class="mlock-card locked" aria-hidden="true">
        <div class="s-kicker">Your best match</div>
        <h4>Registered Nurse, ICU</h4>
        <div class="s-meta">Somewhere, USA · 13 weeks · Nights</div>
        <div class="s-pay"><b>$0,000</b><span>per week</span></div>
      </div>
      <span class="mlock-veil">${MX.icon('lock')}Locked</span>`;

    function lock() {
      host.classList.remove('open');
      result.innerHTML = lockedCard;
      openBtn.innerHTML = `Unlock my match ${MX.icon('lock')}`;
    }
    function refresh() {
      const n = matches().length;
      countEl.textContent = fmt(n);
      countLabel.textContent = n === 1 ? 'match behind this lock' : n ? 'matches behind this lock' : 'matches. Turn a dial.';
      lock();
    }
    function unlock() {
      const m = matches();
      if (!m.length) {
        host.classList.add('shake');
        return setTimeout(() => host.classList.remove('shake'), 450);
      }
      const j = m.filter((x) => x.type !== 'Permanent').sort((a, b) => b.weekly - a.weekly)[0] || m.sort((a, b) => b.salary - a.salary)[0];
      const p = new URLSearchParams();
      reels.forEach((r) => { const q = value(r).q; if (q) p.set(q[0], q[1]); });
      p.set('state', j.state);
      const perm = j.type === 'Permanent';
      host.classList.add('open');
      result.innerHTML = `
        <div class="mlock-card">
          <div class="s-kicker">Your best match of ${fmt(m.length)}</div>
          <h4>${j.title}</h4>
          <div class="s-meta">${j.city}, ${MX.stateName(j.state)} · ${j.weeks ? j.weeks + ' weeks' : j.type} · ${j.shift}</div>
          <div class="s-pay"><b id="lockPay">$0</b><span>${perm ? 'a year' : 'per week'}</span></div>
          <div class="mlock-links">
            <a class="btn btn-dark btn-sm" href="jobs?job=${j.id}">View this job ${MX.icon('arrow', 'arrow')}</a>
            <a class="text-link" href="jobs?${p}">More like it in ${MX.stateName(j.state)}</a>
          </div>
        </div>`;
      openBtn.innerHTML = `Try another combination ${MX.icon('sparkles')}`;
      const target = perm ? j.salary : j.weekly, pay = $('#lockPay'), t0 = performance.now();
      const tick = (t) => {
        const k = reduce ? 1 : Math.min(1, (t - t0) / 900);
        pay.textContent = MX.money(target * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }

    /* Spin every dial like a slot machine and land on a combination that is known to have a match */
    let spinning = false;
    function lucky(reveal = true) {
      if (spinning) return;
      spinning = true; lock();
      const pool = JOBS.filter((j) => j.type === 'Travel Contract').sort((a, b) => b.weekly - a.weekly).slice(0, 160);
      const j = pool[Math.floor(Math.random() * pool.length)];
      const targets = reels.map((r) => Math.max(0, r.items.findIndex((it, i) => i > 0 && it.test(j))));
      const finish = () => { spinning = false; refresh(); if (reveal) setTimeout(unlock, 380); };
      if (reduce) {
        reels.forEach((r, i) => { r.pos = r.n + targets[i]; place(r, 0); });
        return finish();
      }
      let done = 0;
      reels.forEach((r, i) => {
        let steps = ((targets[i] - (r.pos % r.n)) % r.n + r.n) % r.n + r.n * (i + 1);
        const step = () => {
          move(r, 1, steps < 4 ? 220 : 90);
          if (--steps > 0) setTimeout(step, steps < 4 ? 190 : 70);
          else if (++done === reels.length) setTimeout(finish, 240);
        };
        setTimeout(step, i * 140);
      });
    }

    reelsEl.addEventListener('click', (e) => {
      if (spinning) return;
      const reel = e.target.closest('.reel');
      if (!reel) return;
      const r = reels.find((x) => x.el === reel), btn = e.target.closest('.reel-btn');
      if (btn) move(r, Number(btn.dataset.dir));
      else if (e.target.closest('.reel-window')) move(r, 1);
      else return;
      refresh();
    });
    openBtn.addEventListener('click', () => { if (!spinning) host.classList.contains('open') ? lucky() : unlock(); });
    $('#lockLucky').addEventListener('click', () => lucky());
    refresh();
    /* an opening spin, left locked so the visitor does the reveal */
    if (document.body.dataset.aud === 'clinician') setTimeout(() => lucky(false), 700);
    document.addEventListener('mx:aud', (e) => { if (e.detail === 'clinician') lucky(false); });
  })();

  /* ---------- Skill stack: add skills, watch more of the board unlock ---------- */
  (function skillStack() {
    const pick = $('#skillPick'), out = $('#skillOut');
    if (!pick) return;
    const SKILLS = [
      ['Licenses and registries', [['rn', 'RN license'], ['lpn', 'LPN / LVN license'], ['cna', 'CNA certification'], ['therapy', 'PT, OT or SLP license'], ['rrt', 'Respiratory (RRT)'], ['imaging', 'Imaging registry'], ['pharm', 'Pharmacy license'], ['surg', 'Surgical tech certification'], ['lab', 'Lab certification'], ['ma', 'Medical assistant certification']]],
      ['Life support', [['bls', 'BLS'], ['acls', 'ACLS'], ['nrp', 'NRP']]],
      ['Experience', [['icu', 'ICU'], ['er', 'Emergency'], ['medsurg', 'Med-surg or telemetry'], ['ld', 'Labor and delivery'], ['or', 'Operating room'], ['home', 'Home health'], ['bh', 'Behavioral health'], ['school', 'School setting'], ['ehr', 'Epic or other EHR build']]],
    ];
    const LABEL = {};
    SKILLS.forEach(([, items]) => items.forEach(([id, label]) => { LABEL[id] = label; }));
    /* What each kind of role asks for. A job counts as unlocked once every item is in the stack. */
    const therapy = 'therapy bls', scan = 'imaging bls';
    const NEEDS = {
      'Registered Nurse – ICU': 'rn bls acls icu', 'Registered Nurse – Med-Surg': 'rn bls medsurg', 'Registered Nurse – Emergency': 'rn bls acls er',
      'Registered Nurse – Labor & Delivery': 'rn bls nrp ld', 'Registered Nurse – Operating Room': 'rn bls or', 'Registered Nurse – Telemetry': 'rn bls acls medsurg',
      'Registered Nurse – Home Health': 'rn bls home', 'LPN / LVN – Long-Term Care': 'lpn bls', 'Certified Nursing Assistant': 'cna bls',
      'Respiratory Therapist': 'rrt bls acls', 'Surgical Technologist': 'surg bls or', 'Sterile Processing Technician': 'surg',
      'Medical Laboratory Scientist': 'lab', Phlebotomist: 'lab bls', 'Certified Medical Assistant': 'ma bls',
      'Physical Therapist': therapy, 'Physical Therapist Assistant': therapy, 'Occupational Therapist': therapy, 'Certified Occupational Therapy Assistant': therapy, 'Speech-Language Pathologist': therapy,
      'CT Technologist': scan, 'MRI Technologist': scan, 'X-Ray Technologist': scan, 'Ultrasound Sonographer': scan, 'Cath Lab Technologist': 'imaging bls acls',
      'Pharmacist – Hospital': 'pharm', 'Pharmacy Technician': 'pharm',
      'Psychiatric Registered Nurse': 'rn bls bh', 'Licensed Clinical Social Worker': 'bh bls', 'Behavioral Health Technician': 'bh bls',
      'School Nurse (RN)': 'rn bls school', 'School Speech-Language Pathologist': 'therapy school', 'School Psychologist': 'bh school', 'Correctional Nurse (RN)': 'rn bls',
      'Epic Analyst': 'ehr', 'Clinical Informatics Specialist': 'ehr', 'EHR Trainer': 'ehr',
    };
    const needs = JOBS.map((j) => (NEEDS[j.title] || '').split(' '));
    const have = new Set(['bls']);
    const unlocked = (set) => JOBS.filter((j, i) => needs[i].every((t) => set.has(t)));
    const CIRC = 2 * Math.PI * 54;

    pick.innerHTML = SKILLS.map(([title, items]) => `
      <div><h4 class="panel-title">${title}</h4>
        <div class="chips">${items.map(([id, label]) => `<button class="skill" type="button" data-id="${id}" aria-pressed="${have.has(id)}">${label}<em></em></button>`).join('')}</div>
      </div>`).join('');
    out.innerHTML = `
      <div class="ring">
        <svg viewBox="0 0 120 120" aria-hidden="true"><circle class="track" cx="60" cy="60" r="54"/><circle class="bar" cx="60" cy="60" r="54" stroke-dasharray="${CIRC}" stroke-dashoffset="${CIRC}"/></svg>
        <div class="ring-center"><b id="skPct">0%</b><span>of the board</span></div>
      </div>
      <div class="skills-num" aria-live="polite"><b id="skCount">0</b><span>jobs unlocked</span></div>
      <dl>
        <div><dt>Top weekly pay</dt><dd id="skTop">–</dd></div>
        <div><dt>States hiring</dt><dd id="skStates">–</dd></div>
      </dl>
      <p class="skills-tip" id="skTip"></p>
      <a class="btn btn-primary btn-block" href="apply">Save my skills and get matched ${MX.icon('arrow', 'arrow')}</a>
      <a class="skills-browse" id="skBrowse" href="jobs">Browse the jobs I unlocked</a>`;

    let shown = 0;
    function paint() {
      const mine = unlocked(have), n = mine.length;
      // how many more jobs each unpicked skill would open on its own
      let best = null;
      $$('.skill', pick).forEach((b) => {
        const id = b.dataset.id, on = have.has(id);
        b.setAttribute('aria-pressed', on);
        const gain = on ? 0 : unlocked(new Set([...have, id])).length - n;
        b.querySelector('em').textContent = gain > 0 ? '+' + fmt(gain) : '';
        if (gain > 0 && (!best || gain > best.gain)) best = { id, gain };
      });
      const pct = Math.round((n / JOBS.length) * 100);
      $('.bar', out).style.strokeDashoffset = CIRC * (1 - n / JOBS.length);
      $('#skPct').textContent = pct + '%';
      const contract = mine.filter((j) => j.type !== 'Permanent');
      $('#skTop').textContent = contract.length ? MX.money(Math.max(...contract.map((j) => j.weekly))) : '–';
      $('#skStates').textContent = n ? new Set(mine.map((j) => j.state)).size : '–';
      $('#skTip').innerHTML = best
        ? `Add <button class="linkish" type="button" data-add="${best.id}">${LABEL[best.id]}</button> to unlock ${fmt(best.gain)} more.`
        : n ? 'That is everything your current skills unlock. Add a license to go further.' : 'Start with a license or registry to open your first jobs.';
      const areas = [...new Set(mine.map((j) => j.specialty))];
      $('#skBrowse').href = 'jobs' + (areas.length ? '?specialty=' + areas.join(',') : '');
      out.classList.toggle('has', n > 0);
      // count the big number up or down to its new value
      const from = shown, t0 = performance.now(), el = $('#skCount');
      shown = n;
      const tick = (t) => {
        const k = Math.min(1, (t - t0) / 500);
        el.textContent = fmt(Math.round(from + (n - from) * (1 - Math.pow(1 - k, 3))));
        if (k < 1 && shown === n) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
    const toggle = (id) => { have.has(id) ? have.delete(id) : have.add(id); paint(); };
    pick.addEventListener('click', (e) => { const b = e.target.closest('.skill'); if (b) toggle(b.dataset.id); });
    out.addEventListener('click', (e) => { const b = e.target.closest('[data-add]'); if (b) toggle(b.dataset.add); });
    paint();
  })();

  /* ---------- Guess the pay: three postings, pick the weekly pay ---------- */
  (function guessGame() {
    const card = $('#guessCard'), dots = $('#guessDots');
    if (!card) return;
    const ROUNDS = 3;
    let round = 0, score = 0, picks = [];

    function deal() {
      // three contract postings from different professions, drawn from the better-paying half of the board
      const pool = JOBS.filter((j) => j.type === 'Travel Contract' && j.hours >= 36).sort((a, b) => b.weekly - a.weekly);
      const top = pool.slice(0, Math.ceil(pool.length / 2));
      const seen = new Set(); picks = [];
      while (picks.length < ROUNDS && top.length) {
        const j = top.splice(Math.floor(Math.random() * top.length), 1)[0];
        if (seen.has(j.group)) continue;
        seen.add(j.group); picks.push(j);
      }
    }
    const round50 = (n) => Math.round(n / 50) * 50;
    function options(actual) {
      const step = () => 0.2 + Math.random() * 0.16;
      const shape = Math.floor(Math.random() * 3); // where the right answer sits: low, middle or high
      const raw = shape === 0 ? [actual, actual * (1 + step()), actual * (1 + step() * 2.1)]
        : shape === 1 ? [actual * (1 - step()), actual, actual * (1 + step())]
          : [actual * (1 - step() * 1.7), actual * (1 - step() * 0.8), actual];
      const opts = raw.map((v) => (v === actual ? actual : round50(v)));
      return new Set(opts).size === 3 ? opts : [round50(actual * 0.72), actual, round50(actual * 1.3)];
    }
    const paintDots = () => {
      dots.innerHTML = Array.from({ length: ROUNDS }, (_, i) => `<i class="${i < round ? 'done' : i === round ? 'on' : ''}"></i>`).join('') + `<span>Job ${Math.min(round + 1, ROUNDS)} of ${ROUNDS}</span>`;
    };

    function ask() {
      const j = picks[round];
      paintDots();
      card.innerHTML = `
        <div class="g-job">
          <div class="job-loc">${MX.icon('pin')}${j.city}, ${MX.stateName(j.state)}</div>
          <h3>${j.title}</h3>
          <div class="tags"><span class="tag t-type">${j.type}</span><span class="tag">${j.weeks} wks</span><span class="tag">${j.hours} hrs/wk</span><span class="tag">${j.shift}</span></div>
        </div>
        <p class="g-ask">What does it pay a week?</p>
        <div class="g-opts">${options(j.weekly).map((v) => `<button class="g-opt" type="button" data-v="${v}">${MX.money(v)}</button>`).join('')}</div>
        <div class="g-result" aria-live="polite"></div>`;
    }

    function answer(btn) {
      const j = picks[round];
      const guess = Number(btn.dataset.v), right = guess === j.weekly;
      if (right) score++;
      $$('.g-opt', card).forEach((b) => {
        b.disabled = true;
        if (Number(b.dataset.v) === j.weekly) b.classList.add('right');
        else if (b === btn) b.classList.add('wrong');
      });
      const last = round === ROUNDS - 1;
      $('.g-result', card).innerHTML = `
        <p><b>${MX.money(j.weekly)} a week.</b> That is ${MX.rate(j.rate)} an hour for ${j.hours} hours. ${right ? 'Spot on.' : `You were ${MX.money(Math.abs(guess - j.weekly))} ${guess > j.weekly ? 'over' : 'under'}.`}</p>
        <div class="g-next">
          <button class="btn btn-primary" type="button" data-next>${last ? 'See my score' : 'Next job'} ${MX.icon('arrow', 'arrow')}</button>
          <a class="text-link" href="jobs?job=${j.id}">View this job</a>
        </div>`;
    }

    function finish() {
      round = ROUNDS; paintDots();
      const line = score === ROUNDS ? 'You know your worth. Now see what is open.'
        : score === 0 ? 'Pay is hard to guess. That is why we print it on every posting.'
          : 'Not bad. The real numbers are on every posting, no guessing needed.';
      card.innerHTML = `
        <div class="g-score">
          <b>${score}<small> of ${ROUNDS}</small></b>
          <h3>${line}</h3>
          <div class="g-next">
            <a class="btn btn-primary" href="#estimator">See what my role pays ${MX.icon('arrow', 'arrow')}</a>
            <a class="btn btn-ghost" href="jobs">Browse all jobs</a>
          </div>
          <button class="linkish" type="button" data-again>Play again with new jobs</button>
        </div>`;
    }

    card.addEventListener('click', (e) => {
      const opt = e.target.closest('.g-opt');
      if (opt && !opt.disabled) return answer(opt);
      if (e.target.closest('[data-next]')) { round++; return round < ROUNDS ? ask() : finish(); }
      if (e.target.closest('[data-again]')) start();
    });
    function start() { round = 0; score = 0; deal(); ask(); }
    start();
  })();
})();
