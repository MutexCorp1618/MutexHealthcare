/* Mutex Healthcare Staffing — the request-staff form on the Contact page (#request).
   Reads ?need=<specialty id>&when=<asap|weeks|planning> to preselect roles and timing. */
(function () {
  'use strict';
  const MX = window.MX;
  const { $, $$ } = MX;
  if (!$('#requestCard')) return;

  /* ---------- Request stepper ---------- */
  const params = new URLSearchParams(location.search);
  const req = { needs: [], count: 1 };
  const preset = params.get('need');
  if (MX.SPECIALTIES.some((s) => s.id === preset)) req.needs.push(preset);

  const needs = $('#reqNeeds');
  needs.innerHTML = MX.SPECIALTIES.map((s) => `<button class="chip" type="button" aria-pressed="${req.needs.includes(s.id)}" data-id="${s.id}">${s.name}</button>`).join('');
  needs.addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (!b) return;
    const id = b.dataset.id;
    req.needs = req.needs.includes(id) ? req.needs.filter((x) => x !== id) : [...req.needs, id];
    b.setAttribute('aria-pressed', req.needs.includes(id));
    err('');
  });
  $('#reqState').innerHTML = MX.stateOptions('Select a state');
  const when = params.get('when');
  if (['asap', 'weeks', 'planning'].includes(when)) $('#reqWhen').value = when;

  const countOut = $('#reqCount');
  $('[data-inc]').addEventListener('click', () => { req.count = Math.min(50, req.count + 1); countOut.textContent = req.count; });
  $('[data-dec]').addEventListener('click', () => { req.count = Math.max(1, req.count - 1); countOut.textContent = req.count; });

  const card = $('#requestCard');
  const err = (m) => { $('#reqError').textContent = m; };
  let step = 1;
  function show(n) {
    step = n;
    $$('[data-step]', card).forEach((s) => { s.hidden = Number(s.dataset.step) !== n; });
    $$('#reqProgress i').forEach((b, i) => b.classList.toggle('on', i < n));
    $('#reqBack').hidden = n === 1;
    $('#reqNext').innerHTML = (n === 3 ? 'Send request ' : 'Continue ') + MX.icon('arrow', 'arrow');
    err('');
  }
  function validate() {
    if (step === 1 && !req.needs.length) return 'Pick at least one role so we route this to the right team.';
    if (step === 2 && !$('#reqState').value) return 'Choose the state the facility is in.';
    if (step === 3) {
      if (!$('#reqName').value.trim() || !$('#reqOrg').value.trim()) return 'Add your name and organization.';
      if (!/^\S+@\S+\.\S+$/.test($('#reqEmail').value.trim())) return 'Enter a work email so we can reply.';
    }
    return '';
  }
  $('#reqBack').addEventListener('click', () => show(step - 1));
  $('#reqNext').addEventListener('click', async () => {
    const m = validate();
    if (m) return err(m);
    if (step < 3) return show(step + 1);
    const whenSel = $('#reqWhen');
    const data = new FormData();
    data.set('roles', req.needs.map(MX.specialtyName).join(', '));
    data.set('headcount', req.count);
    data.set('facility', $('#reqFacility').value);
    data.set('state', MX.stateName($('#reqState').value));
    data.set('timing', whenSel.options[whenSel.selectedIndex].text);
    data.set('cover', $('#reqType').value);
    data.set('name', $('#reqName').value.trim());
    data.set('organization', $('#reqOrg').value.trim());
    data.set('email', $('#reqEmail').value.trim());
    data.set('phone', $('#reqPhone').value.trim());
    data.set('note', $('#reqNote').value.trim());
    const next = $('#reqNext'), nextLabel = next.innerHTML;
    next.disabled = true; next.textContent = 'Sending…';
    const sent = await MX.sendForm('staff-request', data);
    if (!sent) { next.disabled = false; next.innerHTML = nextLabel; return err(MX.sendFailed); }
    const first = MX.esc($('#reqName').value.trim().split(/\s+/)[0]);
    const summary = `
      <div class="summary">
        <div><span>Roles</span><b>${req.needs.map(MX.specialtyName).join(', ')}</b></div>
        <div><span>Headcount</span><b>${req.count}</b></div>
        <div><span>Facility</span><b>${MX.esc($('#reqFacility').value)}, ${MX.stateName($('#reqState').value)}</b></div>
        <div><span>Timing</span><b>${whenSel.options[whenSel.selectedIndex].text}</b></div>
        <div><span>Type of cover</span><b>${MX.esc($('#reqType').value)}</b></div>
        <div><span>Reply to</span><b>${MX.esc($('#reqEmail').value.trim())}</b></div>
      </div>`;
    card.innerHTML = MX.successHTML(`Request received, ${first}.`, 'A staffing specialist will reply within one business day with next steps and a first look at available clinicians.', summary);
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  show(1);
})();
