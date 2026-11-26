/* Mutex Healthcare Staffing — job search, filters, detail drawer and application form */
(function () {
  'use strict';
  const MX = window.MX;
  const { $, $$, JOBS } = MX;
  const PAGE = 12;
  const fmt = (n) => n.toLocaleString('en-US');

  /* ---------- State (seeded from the URL) ---------- */
  const params = new URLSearchParams(location.search);
  const list = (key, allowed) => (params.get(key) || '').split(',').filter((v) => allowed.includes(v));
  const state = {
    q: params.get('q') || '',
    group: list('group', MX.GROUPS.map((g) => g.id))[0] || '',
    state: list('state', MX.STATES.map((s) => s.code))[0] || '',
    specialties: list('specialty', MX.SPECIALTIES.map((s) => s.id)),
    types: list('type', MX.JOB_TYPES),
    shifts: list('shift', MX.SHIFTS),
    minPay: 0,
    savedOnly: false,
    sort: 'new',
    shown: PAGE,
  };

  /* ---------- Saved jobs (browser only) ---------- */
  let mem = [];
  const saved = {
    all() { try { mem = JSON.parse(localStorage.getItem('mx-saved') || '[]'); } catch (e) { /* storage unavailable */ } return mem; },
    toggle(id) {
      const s = new Set(this.all());
      s.has(id) ? s.delete(id) : s.add(id);
      mem = [...s];
      try { localStorage.setItem('mx-saved', JSON.stringify(mem)); } catch (e) { /* storage unavailable */ }
      return s.has(id);
    },
  };

  /* ---------- Controls ---------- */
  const el = {
    q: $('#q'), group: $('#group'), state: $('#state'), sort: $('#sort'), minPay: $('#minPay'), savedOnly: $('#savedOnly'),
    fSpecialty: $('#fSpecialty'), fType: $('#fType'), fShift: $('#fShift'),
    count: $('#resultCount'), pills: $('#pills'), list: $('#jobList'), more: $('#moreWrap'),
    drawer: $('#drawer'), scrim: $('#scrim'), filters: $('#filters'),
  };
  el.group.innerHTML = '<option value="">All professions</option>' + MX.GROUPS.map((g) => `<option value="${g.id}">${g.name}</option>`).join('');
  el.state.innerHTML = MX.stateOptions('All states');
  el.fSpecialty.innerHTML = MX.SPECIALTIES.map((s) => `<button class="chip" type="button" aria-pressed="false" data-v="${s.id}">${s.name}</button>`).join('');
  const checks = (items, key) => items.map((v) => `<label class="check"><input type="checkbox" data-k="${key}" value="${v}"> ${v} <em></em></label>`).join('');
  el.fType.innerHTML = checks(MX.JOB_TYPES, 'types');
  el.fShift.innerHTML = checks(MX.SHIFTS, 'shifts');

  function results() {
    let r = MX.filterJobs(state);
    if (state.savedOnly) { const s = new Set(saved.all()); r = r.filter((j) => s.has(j.id)); }
    if (state.sort === 'pay') r = r.slice().sort((a, b) => b.weekly - a.weekly);
    if (state.sort === 'start') r = r.slice().sort((a, b) => a.start - b.start || b.weekly - a.weekly);
    return r;
  }

  const rowHTML = (j, isSaved) => `
    <article class="job-row">
      <div>
        <div class="job-loc">${MX.icon('pin')}${j.city}, ${MX.stateName(j.state)} · ${j.setting}</div>
        <h3><button type="button" data-open="${j.id}">${j.title}</button></h3>
        <div class="tags">${MX.tagsHTML(j)}</div>
      </div>
      <div class="side">
        <div class="job-pay">${MX.payHTML(j)}</div>
        <div style="display:flex;gap:10px;align-items:center">
          <span class="muted" style="font-size:.8rem;font-weight:600;white-space:nowrap">${MX.posted(j.postedDays)}</span>
          <button class="save" type="button" data-save="${j.id}" aria-pressed="${isSaved}" aria-label="Save ${j.title} in ${j.city}">${MX.icon('heart')}</button>
        </div>
      </div>
    </article>`;

  function pillsHTML() {
    const p = [];
    const add = (k, v, label) => p.push(`<button class="pill-x" type="button" data-k="${k}" data-v="${MX.esc(v)}">${MX.esc(label)}${MX.icon('x')}</button>`);
    if (state.q.trim()) add('q', '', `“${state.q.trim()}”`);
    if (state.group) add('group', '', MX.groupName(state.group));
    if (state.state) add('state', '', MX.stateName(state.state));
    state.specialties.forEach((s) => add('specialties', s, MX.specialtyName(s)));
    state.types.forEach((t) => add('types', t, t));
    state.shifts.forEach((s) => add('shifts', s, s));
    if (state.minPay) add('minPay', '', `${MX.money(state.minPay)}+ per week`);
    if (state.savedOnly) add('savedOnly', '', 'Saved only');
    return p.join('');
  }

  function syncURL() {
    const p = new URLSearchParams();
    if (state.q.trim()) p.set('q', state.q.trim());
    if (state.group) p.set('group', state.group);
    if (state.state) p.set('state', state.state);
    if (state.specialties.length) p.set('specialty', state.specialties.join(','));
    if (state.types.length) p.set('type', state.types.join(','));
    if (state.shifts.length) p.set('shift', state.shifts.join(','));
    if (openId) p.set('job', openId);
    const qs = p.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
  }

  function render() {
    /* controls reflect state */
    el.q.value = state.q; el.group.value = state.group; el.state.value = state.state; el.sort.value = state.sort;
    el.minPay.value = state.minPay; el.savedOnly.checked = state.savedOnly;
    el.minPay.style.setProperty('--fill', (state.minPay / 4000) * 100 + '%');
    $('#minPayOut').textContent = state.minPay ? MX.money(state.minPay) + '+' : 'Any';
    $$('.chip', el.fSpecialty).forEach((c) => c.setAttribute('aria-pressed', state.specialties.includes(c.dataset.v)));
    $$('input[data-k]', el.filters).forEach((c) => {
      c.checked = state[c.dataset.k].includes(c.value);
      const n = MX.filterJobs({ ...state, [c.dataset.k]: [c.value] }).length;
      c.parentElement.querySelector('em').textContent = fmt(n);
    });
    const savedIds = new Set(saved.all());
    $('#savedCount').textContent = savedIds.size ? savedIds.size : '';

    /* results */
    const r = results();
    const where = state.state ? ' in ' + MX.stateName(state.state) : '';
    el.count.textContent = `${fmt(r.length)} ${r.length === 1 ? 'job' : 'jobs'}${where}`;
    el.pills.innerHTML = pillsHTML();
    if (!r.length) {
      el.list.innerHTML = `<div class="empty"><h3>No jobs match those filters yet</h3><p>New assignments post every day. Try widening the location or clearing a filter.</p><button class="btn btn-dark" type="button" data-clear>Clear all filters</button></div>`;
      el.more.innerHTML = '';
    } else {
      const page = r.slice(0, state.shown);
      el.list.innerHTML = page.map((j) => rowHTML(j, savedIds.has(j.id))).join('');
      el.more.innerHTML = `<p>Showing ${fmt(page.length)} of ${fmt(r.length)}</p>` +
        (page.length < r.length ? '<button class="btn btn-ghost" type="button" id="showMore">Show more jobs</button>' : '');
    }
    syncURL();
  }

  function update(patch) { Object.assign(state, patch, { shown: PAGE }); render(); }
  function clearAll() { update({ q: '', group: '', state: '', specialties: [], types: [], shifts: [], minPay: 0, savedOnly: false }); }
  const toggleIn = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  /* ---------- Events ---------- */
  $('#searchBar').addEventListener('submit', (e) => {
    e.preventDefault();
    update({ q: el.q.value });
    el.count.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  el.q.addEventListener('input', () => update({ q: el.q.value }));
  el.group.addEventListener('change', () => update({ group: el.group.value }));
  el.state.addEventListener('change', () => update({ state: el.state.value }));
  el.sort.addEventListener('change', () => update({ sort: el.sort.value }));
  el.minPay.addEventListener('input', () => update({ minPay: Number(el.minPay.value) }));
  el.savedOnly.addEventListener('change', () => update({ savedOnly: el.savedOnly.checked }));
  el.fSpecialty.addEventListener('click', (e) => {
    const c = e.target.closest('.chip');
    if (c) update({ specialties: toggleIn(state.specialties, c.dataset.v) });
  });
  el.filters.addEventListener('change', (e) => {
    const c = e.target.closest('input[data-k]');
    if (c) update({ [c.dataset.k]: toggleIn(state[c.dataset.k], c.value) });
  });
  $('#clearAll').addEventListener('click', clearAll);
  $('#filtersToggle').addEventListener('click', () => el.filters.classList.toggle('show'));
  el.pills.addEventListener('click', (e) => {
    const b = e.target.closest('.pill-x');
    if (!b) return;
    const k = b.dataset.k;
    if (Array.isArray(state[k])) update({ [k]: state[k].filter((x) => x !== b.dataset.v) });
    else update({ [k]: k === 'minPay' ? 0 : k === 'savedOnly' ? false : '' });
  });
  document.addEventListener('click', (e) => {
    const saveBtn = e.target.closest('[data-save]');
    if (saveBtn) {
      const on = saved.toggle(saveBtn.dataset.save);
      $$(`[data-save="${saveBtn.dataset.save}"]`).forEach((b) => b.setAttribute('aria-pressed', on));
      const n = saved.all().length;
      $('#savedCount').textContent = n || '';
      if (state.savedOnly) render();
      return;
    }
    const openBtn = e.target.closest('[data-open]');
    if (openBtn) return openJob(openBtn.dataset.open, openBtn);
    if (e.target.closest('#showMore')) { state.shown += PAGE; render(); return; }
    if (e.target.closest('[data-clear]')) clearAll();
  });

  /* ---------- Detail drawer ---------- */
  let openId = '', opener = null;
  const bullets = (items) => `<ul class="bullets">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;

  function detailHTML(j) {
    const d = MX.jobDetail(j);
    const pay = j.type === 'Permanent'
      ? `<div><small>Salary</small><b>$${Math.round(j.salary / 1000)}k / yr</b></div><div><small>Schedule</small><b>${j.hours} hrs</b></div><div><small>Hire type</small><b>Direct</b></div>`
      : `<div><small>Hourly rate</small><b>${MX.rate(j.rate)}</b></div><div><small>Estimated weekly pay</small><b>${MX.money(j.weekly)}</b></div><div><small>${j.weeks ? 'Estimated contract total' : 'Shifts'}</small><b>${j.weeks ? MX.kWeek(j.weekly * j.weeks) : 'Flexible'}</b></div>`;
    return `
      <div class="drawer-head"><span>${j.id} · ${MX.posted(j.postedDays)}</span><button class="icon-btn" type="button" data-close aria-label="Close">${MX.icon('x')}</button></div>
      <div class="drawer-body">
        <div class="job-loc">${MX.icon('pin')}${j.city}, ${MX.stateName(j.state)}</div>
        <h2>${j.title}</h2>
        <div class="tags">${MX.tagsHTML(j)}</div>
        <div class="d-pay">${pay}</div>
        <p>${d.summary}</p>
        <h4>At a glance</h4>
        <div class="d-facts">
          <div><small>Start date</small><b>${MX.fmtDateLong(j.start)}</b></div>
          <div><small>Length</small><b>${j.weeks ? j.weeks + ' weeks' : j.type === 'Permanent' ? 'Permanent' : 'Ongoing'}</b></div>
          <div><small>Schedule</small><b>${j.shift}, ${j.hours} hrs/wk</b></div>
          <div><small>Setting</small><b>${j.setting}</b></div>
        </div>
        <h4>What you’ll do</h4>${bullets(d.duties)}
        <h4>What you’ll need</h4>${bullets(d.reqs)}
        <h4>What you get</h4>${bullets(d.perks)}
      </div>
      <div class="drawer-foot">
        <button class="save" type="button" data-save="${j.id}" aria-pressed="${saved.all().includes(j.id)}" aria-label="Save this job">${MX.icon('heart')}</button>
        <button class="btn btn-primary btn-lg" type="button" data-apply>Apply now ${MX.icon('arrow', 'arrow')}</button>
      </div>`;
  }

  function applyHTML(j) {
    const payLine = j.type === 'Permanent' ? `$${Math.round(j.salary / 1000)}k per year` : `${MX.rate(j.rate)}/hr, about ${MX.money(j.weekly)} a week`;
    return `
      <div class="drawer-head"><span>${j.id} · Application</span><button class="icon-btn" type="button" data-close aria-label="Close">${MX.icon('x')}</button></div>
      <div class="drawer-body">
        <button class="back-btn" type="button" data-back>${MX.icon('arrow')}Back to job</button>
        <p class="eyebrow">Apply in two minutes</p>
        <h2>${j.title}</h2>
        <p class="muted" style="margin-bottom:22px">${j.city}, ${MX.stateName(j.state)} · ${payLine}</p>
        <form data-demo-form data-form-name="job-application" data-title="You’re in the queue, {first}." data-msg="A Mutex recruiter will reach out within one business day about the ${j.title} role in ${j.city}. Keep an eye on your phone.">
          <input class="hp" type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true"><input type="hidden" name="job" value="${j.id}"><input type="hidden" name="job-title" value="${j.title}"><input type="hidden" name="job-location" value="${j.city}, ${j.state}">
          <div class="form-grid">
            <label class="field"><span>First name</span><input class="input" name="first" required autocomplete="given-name"></label>
            <label class="field"><span>Last name</span><input class="input" name="last" required autocomplete="family-name"></label>
            <label class="field"><span>Email</span><input class="input" type="email" name="email" required autocomplete="email"></label>
            <label class="field"><span>Mobile phone</span><input class="input" type="tel" name="phone" required autocomplete="tel"></label>
            <label class="field"><span>State where you are licensed</span><select class="select" name="license">${MX.stateOptions('Select a state')}<option value="compact">Compact / multistate</option></select></label>
            <label class="field"><span>Experience in this role</span><select class="select" name="years"><option>Less than 1 year</option><option>1–2 years</option><option selected>3–5 years</option><option>6–10 years</option><option>10+ years</option></select></label>
            <label class="field full"><span>Résumé <small>(optional, you can send it later)</small></span><input class="input" type="file" name="resume" accept=".pdf,.doc,.docx"></label>
            <label class="field full"><span>Anything we should know? <small>(optional)</small></span><textarea class="textarea" name="note" placeholder="Earliest start date, time off you need, housing preferences…"></textarea></label>
            <label class="check full"><input type="checkbox" required> I agree to be contacted by a Mutex recruiter about this and similar roles.</label>
          </div>
          <button class="btn btn-primary btn-lg btn-block" style="margin-top:20px" type="submit">Submit application ${MX.icon('arrow', 'arrow')}</button>
        </form>
      </div>`;
  }

  function openJob(id, from) {
    const j = JOBS.find((x) => x.id === id);
    if (!j) return;
    openId = id; opener = from || null;
    el.drawer.innerHTML = detailHTML(j);
    el.drawer.classList.add('show'); el.scrim.classList.add('show');
    el.drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    $('[data-close]', el.drawer).focus();
    syncURL();
  }
  function closeJob() {
    if (!openId) return;
    openId = '';
    el.drawer.classList.remove('show'); el.scrim.classList.remove('show');
    el.drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (opener && document.contains(opener)) opener.focus();
    syncURL();
  }
  el.drawer.addEventListener('click', (e) => {
    const j = JOBS.find((x) => x.id === openId);
    if (e.target.closest('[data-close]')) return closeJob();
    if (e.target.closest('[data-apply]')) {
      el.drawer.innerHTML = applyHTML(j);
      MX.initDemoForms(el.drawer);
      $('input[name="first"]', el.drawer).focus();
    } else if (e.target.closest('[data-back]')) {
      el.drawer.innerHTML = detailHTML(j);
    }
  });
  el.scrim.addEventListener('click', closeJob);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeJob(); });

  /* ---------- Boot ---------- */
  render();
  const deep = params.get('job');
  if (deep) openJob(deep);
})();
