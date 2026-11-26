/* Mutex Healthcare Staffing — behaviour for the generated content pages:
   live job grids, job-board stats, state lists and form selects, all read from data attributes. */
(function () {
  'use strict';
  const MX = window.MX;
  const { $, $$ } = MX;
  const fmt = (n) => n.toLocaleString('en-US');

  const jobsURL = (f = {}) => {
    const p = new URLSearchParams();
    if (f.q) p.set('q', f.q);
    if (f.group) p.set('group', f.group);
    if (f.state) p.set('state', f.state);
    if (f.specialties && f.specialties.length) p.set('specialty', f.specialties.join(','));
    if (f.types && f.types.length) p.set('type', f.types.join(','));
    if (f.shifts && f.shifts.length) p.set('shift', f.shifts.join(','));
    const s = p.toString();
    return 'jobs' + (s ? '?' + s : '');
  };
  const read = (el, key) => { try { return JSON.parse(el.dataset[key] || '{}'); } catch (e) { return {}; } };

  /* Job grids: the best-paying matches, one per role and state so the grid stays varied */
  $$('[data-jobs]').forEach((el) => {
    const cfg = read(el, 'jobs');
    const all = MX.filterJobs(cfg.filter || {});
    const ranked = all.slice().sort((a, b) => b.weekly - a.weekly);
    const seenTitle = new Set(), seenState = new Set(), picked = [];
    for (const j of ranked) {
      if (seenTitle.has(j.title + j.state) || seenState.has(j.state)) continue;
      seenTitle.add(j.title + j.state); seenState.add(j.state); picked.push(j);
      if (picked.length === (cfg.limit || 6)) break;
    }
    el.innerHTML = picked.length
      ? picked.map(MX.jobCard).join('')
      : '<div class="empty" style="grid-column:1/-1"><h3>No openings right now</h3><p>New roles post every day. Join the talent network and we will tell you first.</p><a class="btn btn-dark" href="apply">Join the talent network</a></div>';
    const scope = el.closest('section') || document;
    $$('[data-jobs-n]', scope).forEach((n) => { n.textContent = fmt(all.length); });
    $$('[data-jobs-link]', scope).forEach((a) => { a.href = jobsURL(cfg.filter); });
  });

  /* Stat cards: live numbers for a filter */
  $$('[data-jobstat]').forEach((card) => {
    const f = read(card, 'jobstat');
    const all = MX.filterJobs(f);
    const set = (k, v) => { const n = $(`[data-s="${k}"]`, card); if (n) n.textContent = v; };
    const contract = all.filter((j) => j.type !== 'Permanent');
    const rates = contract.map((j) => j.rate).sort((a, b) => a - b);
    const mid = rates.length ? rates[Math.floor(rates.length / 2)] : 0;
    const salaries = all.filter((j) => j.salary).map((j) => j.salary).sort((a, b) => a - b);
    set('count', fmt(all.length));
    if (contract.length) {
      set('top', MX.money(Math.max(...contract.map((j) => j.weekly))));
      set('rate', MX.rate(mid) + '/hr');
    } else if (salaries.length) {
      const [topLabel, rateLabel] = $$('.stat-grid small', card);
      topLabel.textContent = 'Top salary'; rateLabel.textContent = 'Typical salary';
      set('top', '$' + Math.round(salaries[salaries.length - 1] / 1000) + 'k');
      set('rate', '$' + Math.round(salaries[Math.floor(salaries.length / 2)] / 1000) + 'k');
    }
    set('states', new Set(all.map((j) => j.state)).size);
    set('fresh', fmt(all.filter((j) => j.postedDays <= 7).length));
    const link = $('[data-s="link"]', card);
    if (link) link.href = jobsURL(f);
  });

  /* Pay range for a filter, e.g. "$44–$97/hr" */
  $$('[data-payrange]').forEach((el) => {
    const rates = MX.filterJobs(read(el, 'payrange')).filter((j) => j.type !== 'Permanent').map((j) => j.rate);
    el.textContent = rates.length ? `$${Math.floor(Math.min(...rates))}–$${Math.ceil(Math.max(...rates))}/hr` : 'rates on request';
  });

  /* Inline counts, e.g. "485 open jobs" on a card */
  $$('[data-jobcount]').forEach((el) => { el.textContent = fmt(MX.filterJobs(read(el, 'jobcount')).length); });

  /* Every state, alphabetically, with its open job count */
  $$('[data-states-all]').forEach((el) => {
    const counts = {};
    MX.JOBS.forEach((j) => { counts[j.state] = (counts[j.state] || 0) + 1; });
    el.innerHTML = MX.STATES.map((s, i) => `
      <a class="state-tile" href="jobs?state=${s.code}" data-reveal style="--d:${(i % 4) * 40}ms">
        <span class="abbr">${s.code}</span>
        <span><b>${s.name}</b><span>${fmt(counts[s.code] || 0)} open jobs</span></span>
      </a>`).join('');
  });

  /* Form selects */
  $$('select[data-states]').forEach((s) => { s.innerHTML = MX.stateOptions(s.dataset.states) + '<option value="compact">Compact / multistate</option>'; });
  $$('select[data-groups]').forEach((s) => {
    s.innerHTML = `<option value="">${s.dataset.groups}</option>` + MX.GROUPS.map((g) => `<option>${g.name}</option>`).join('') + '<option>Something else</option>';
  });
})();
