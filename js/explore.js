/* Mutex Healthcare Staffing — two small things to play with, for clinicians:
   [data-explore]  "Where could your next 13 weeks take you?" Pick a vibe, spin, land on a city
                   with its photo and the open travel jobs in that state.
   [data-quiz]     "What's your assignment style?" Four questions, one matched way of working.
   Both read the job board (MX.JOBS) and city photos (MX.CITY_PHOTOS), so numbers stay in step. */
(function () {
  'use strict';
  const MX = window.MX, $ = MX.$, $$ = MX.$$;
  const JOBS = MX.JOBS || [];
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const stateName = (code) => (MX.STATES.find((s) => s.code === code) || {}).name || code;
  const cdn = MX.img;

  /* ---------- Destination explorer ---------- */
  const VIBES = [
    { id: 'coast', label: 'Beach and coast', icon: '🌊', line: 'Salt air on your days off.',
      cities: ['San Diego, CA', 'Miami, FL', 'Tampa, FL', 'Honolulu, HI', 'Charleston, SC', 'Virginia Beach, VA', 'Jacksonville, FL', 'Newport, RI', 'Portland, ME', 'Gulfport, MS'] },
    { id: 'mountains', label: 'Mountains and trails', icon: '⛰️', line: 'Trailheads twenty minutes from the hospital.',
      cities: ['Denver, CO', 'Colorado Springs, CO', 'Boise, ID', 'Bend, OR', 'Missoula, MT', 'Asheville, NC', 'Salt Lake City, UT', "Coeur d'Alene, ID", 'Anchorage, AK', 'Burlington, VT'] },
    { id: 'city', pcLeft: true, label: 'Big city energy', icon: '🏙️', line: 'Level I trauma by day, a new neighborhood every weekend.',
      cities: ['New York, NY', 'Chicago, IL', 'Los Angeles, CA', 'Boston, MA', 'Seattle, WA', 'Houston, TX', 'Philadelphia, PA', 'Atlanta, GA', 'Dallas, TX', 'Minneapolis, MN'] },
    { id: 'small', label: 'Small-town pace', icon: '🏡', line: 'Where the whole unit knows your name by week two.',
      cities: ['Rapid City, SD', 'Bangor, ME', 'Casper, WY', 'Montpelier, VT', 'Bismarck, ND', 'Duluth, MN', 'Pittsfield, MA', 'Roanoke, VA', 'Fairbanks, AK', 'Santa Fe, NM'] },
    { id: 'warm', label: 'Warm winters', icon: '☀️', line: 'Skip the snow shovel this year.',
      cities: ['Phoenix, AZ', 'Tucson, AZ', 'Austin, TX', 'San Antonio, TX', 'Orlando, FL', 'Las Vegas, NV', 'New Orleans, LA', 'El Paso, TX', 'Honolulu, HI', 'Miami, FL'] },
    { id: 'music', label: 'Music and food', icon: '🎷', line: 'Live music after a long shift.',
      cities: ['Nashville, TN', 'New Orleans, LA', 'Memphis, TN', 'Austin, TX', 'Kansas City, MO', 'Charleston, SC', 'Louisville, KY', 'Chicago, IL', 'Portland, OR', 'Asheville, NC'] },
  ].map((v) => ({ ...v, cities: v.cities.filter((c) => MX.CITY_PHOTOS[c]) }));

  function stateStats(code) {
    const travel = JOBS.filter((j) => j.state === code && j.type === 'Travel Contract');
    const top = travel.reduce((m, j) => Math.max(m, j.weekly || 0), 0);
    const rates = travel.map((j) => j.rate).sort((a, b) => a - b);
    return { count: travel.length, top, rate: rates.length ? rates[Math.floor(rates.length / 2)] : 0 };
  }

  function initExplorer(host) {
    let vibe = VIBES[0], last = '', spinning = false;
    host.innerHTML = `
      <div class="xp-vibes chips" role="group" aria-label="Pick a vibe">${VIBES.map((v, i) => `
        <button class="chip" type="button" data-vibe="${v.id}" aria-pressed="${i === 0}"><span aria-hidden="true">${v.icon}</span> ${esc(v.label)}</button>`).join('')}
      </div>
      <div class="xp-stage">
        <figure class="xp-card" aria-live="polite">
          <img class="xp-photo" alt="" decoding="async">
          <span class="xp-postcard" aria-hidden="true"><img class="xp-pc-photo" alt="" decoding="async"><em class="xp-pc-label"></em></span>
          <figcaption class="xp-info">
            <span class="xp-tag">Your next 13 weeks</span>
            <b class="xp-city"></b>
            <span class="xp-line"></span>
          </figcaption>
        </figure>
        <div class="xp-side">
          <div class="xp-stats">
            <div><small>Open travel jobs in <span class="xp-state"></span></small><b class="xp-count">–</b></div>
            <div><small>Top weekly pay there</small><b class="xp-top">–</b></div>
            <div><small>Typical hourly</small><b class="xp-rate">–</b></div>
          </div>
          <div class="xp-actions">
            <button class="btn btn-primary btn-lg" type="button" data-spin>Spin again <i data-icon="sparkles"></i></button>
            <a class="btn btn-ghost btn-lg xp-go" href="jobs">See these jobs <i data-icon="arrow" class="arrow"></i></a>
          </div>
          <p class="xp-note">Pay and counts come from the live job board and change as jobs open and fill.</p>
        </div>
      </div>`;
    if (MX.hydrateIcons) MX.hydrateIcons(host);
    /* The big picture is a travel nurse in that kind of place (assets/people/vibe-<id>.jpg); the city
       itself is the postcard in the corner. If a vibe photo is missing, the city photo fills the card. */
    const img = $('.xp-photo', host), pc = $('.xp-pc-photo', host);
    let nurseVibe = '';
    const setNurse = () => {
      if (nurseVibe === vibe.id) return;
      nurseVibe = vibe.id;
      host.classList.remove('no-nurse');
      /* Some nurse photos have the person on the right, so their postcard goes top left. */
      host.classList.toggle('pc-left', !!vibe.pcLeft);
      img.onerror = () => { host.classList.add('no-nurse'); img.onerror = null; img.removeAttribute('srcset'); img.src = cdn(MX.CITY_PHOTOS[current], 900); };
      const src = `assets/people/vibe-${vibe.id}.jpg`;
      img.sizes = '(max-width: 900px) 100vw, 760px';
      img.srcset = [800, 1200, 1600, 2400].map((w) => `${cdn(src, w)} ${w}w`).join(', ');
      img.src = cdn(src, 1600);
      img.alt = `A travel nurse in scrubs: ${vibe.label.toLowerCase()}`;
    };

    let current = '';
    const show = (place, final) => {
      current = place;
      pc.src = cdn(MX.CITY_PHOTOS[place], 400);
      if (host.classList.contains('no-nurse')) img.src = cdn(MX.CITY_PHOTOS[place], 900);
      $('.xp-pc-label', host).textContent = place;
      $('.xp-city', host).textContent = place;
      if (!final) return;
      const code = place.slice(-2);
      const s = stateStats(code);
      $('.xp-line', host).textContent = vibe.line;
      $('.xp-state', host).textContent = stateName(code);
      $('.xp-count', host).textContent = s.count ? s.count.toLocaleString('en-US') : 'New soon';
      $('.xp-top', host).textContent = s.top ? MX.money(s.top) : '–';
      $('.xp-rate', host).textContent = s.rate ? MX.money(s.rate) + '/hr' : '–';
      $('.xp-go', host).href = `jobs?state=${code}&type=${encodeURIComponent('Travel Contract')}`;
      host.classList.remove('is-spinning');
    };

    const spin = () => {
      if (spinning) return;
      setNurse();
      const pool = vibe.cities.filter((c) => c !== last);
      const target = pool[Math.floor(Math.random() * pool.length)];
      last = target;
      if (reduced) return show(target, true);
      spinning = true; host.classList.add('is-spinning');
      let n = 0;
      const step = () => {
        n += 1;
        if (n < 9) { show(vibe.cities[(n + vibe.cities.length) % vibe.cities.length], false); setTimeout(step, 70 + n * 18); }
        else { spinning = false; show(target, true); }
      };
      step();
    };

    host.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-vibe]');
      if (chip) {
        vibe = VIBES.find((v) => v.id === chip.dataset.vibe);
        $$('[data-vibe]', host).forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
        spin();
      }
      if (e.target.closest('[data-spin]')) spin();
    });
    // first city: no animation, so the section never sits empty
    last = vibe.cities[0]; setNurse(); show(last, true);
  }

  /* ---------- Assignment-style quiz ---------- */
  const STYLES = {
    'Travel Contract': { name: 'The Explorer', page: 'travel-nursing', pageLabel: 'Travel nursing',
      text: '13-week travel contracts: new cities, the strongest pay packages, and a recruiter who has your back from city to city.' },
    'Local Contract': { name: 'The Hometown Adventurer', page: 'per-diem', pageLabel: 'Per diem and local',
      text: 'Local contracts: contract pay and a fresh unit, without packing a single box.' },
    'Per Diem': { name: 'The Free Spirit', page: 'per-diem', pageLabel: 'Per diem and local',
      text: 'Per diem shifts: you pick the days, you keep your freedom, and the extra shifts pay well.' },
    'Permanent': { name: 'The Anchor', page: 'permanent-placement', pageLabel: 'Permanent placement',
      text: 'Permanent roles: one team, real benefits, and a long runway to grow into charge or leadership.' },
  };
  const QUESTIONS = [
    { q: 'Your ideal Monday morning is…', a: [
      ['Somewhere I have never been', { 'Travel Contract': 2 }],
      ['My unit, my people, my coffee mug', { Permanent: 2 }],
      ['Depends on the week', { 'Per Diem': 2 }],
      ['Close to home, but something new', { 'Local Contract': 2 }]] },
    { q: 'Packing a suitcase every 13 weeks sounds…', a: [
      ['Like the whole point', { 'Travel Contract': 2 }],
      ['Fine, if the pay is right', { 'Travel Contract': 1, 'Local Contract': 1 }],
      ['Exhausting', { Permanent: 1, 'Per Diem': 1, 'Local Contract': 1 }]] },
    { q: 'What matters most right now?', a: [
      ['Top pay', { 'Travel Contract': 2, 'Local Contract': 1 }],
      ['Control of my schedule', { 'Per Diem': 2 }],
      ['Stability and benefits', { Permanent: 2 }],
      ['Variety without moving', { 'Local Contract': 2, 'Per Diem': 1 }]] },
    { q: 'A new unit on day one feels…', a: [
      ['Exciting. Show me the supply room.', { 'Travel Contract': 1, 'Per Diem': 1 }],
      ['Fine. I adapt fast.', { 'Local Contract': 1, 'Travel Contract': 1 }],
      ['I would rather grow with one team', { Permanent: 2 }]] },
  ];

  function initQuiz(host) {
    let i = 0;
    const score = { 'Travel Contract': 0, 'Local Contract': 0, 'Per Diem': 0, Permanent: 0 };
    const render = () => {
      if (i >= QUESTIONS.length) return result();
      const Q = QUESTIONS[i];
      host.innerHTML = `
        <div class="qz-top"><span class="qz-step">Question ${i + 1} of ${QUESTIONS.length}</span><span class="qz-bar"><i style="width:${(i / QUESTIONS.length) * 100}%"></i></span></div>
        <h3 class="qz-q">${esc(Q.q)}</h3>
        <div class="qz-answers">${Q.a.map(([label], k) => `<button class="qz-a" type="button" data-a="${k}">${esc(label)}</button>`).join('')}</div>`;
      const first = $('.qz-a', host); if (first && i > 0) first.focus({ preventScroll: true });
    };
    const result = () => {
      const type = Object.keys(score).sort((a, b) => score[b] - score[a])[0];
      const S = STYLES[type];
      const jobs = JOBS.filter((j) => j.type === type);
      const top = jobs.reduce((m, j) => Math.max(m, j.weekly || 0), 0);
      host.innerHTML = `
        <div class="qz-top"><span class="qz-step">Your assignment style</span><span class="qz-bar"><i style="width:100%"></i></span></div>
        <div class="qz-result" role="status">
          <span class="qz-badge">${esc(type === 'Permanent' ? 'Permanent' : type)}</span>
          <h3>${esc(S.name)}</h3>
          <p>${esc(S.text)}</p>
          <div class="qz-nums"><div><b>${jobs.length.toLocaleString('en-US')}</b><small>open jobs like this</small></div>${type !== 'Permanent' && top ? `<div><b>${MX.money(top)}</b><small>top weekly pay</small></div>` : ''}</div>
          <div class="cta-row">
            <a class="btn btn-primary" href="jobs?type=${encodeURIComponent(type)}">See ${esc(S.name.replace('The ', ''))} jobs <i data-icon="arrow" class="arrow"></i></a>
            <a class="btn btn-ghost" href="${S.page}">${esc(S.pageLabel)}</a>
            <button class="linkish" type="button" data-restart>Take it again</button>
          </div>
        </div>`;
      if (MX.hydrateIcons) MX.hydrateIcons(host);
    };
    host.addEventListener('click', (e) => {
      const a = e.target.closest('[data-a]');
      if (a) {
        Object.entries(QUESTIONS[i].a[Number(a.dataset.a)][1]).forEach(([t, n]) => { score[t] += n; });
        i += 1; render();
      }
      if (e.target.closest('[data-restart]')) { i = 0; Object.keys(score).forEach((k) => { score[k] = 0; }); render(); }
    });
    render();
  }

  $$('[data-explore]').forEach(initExplorer);
  $$('[data-quiz]').forEach(initQuiz);
})();
