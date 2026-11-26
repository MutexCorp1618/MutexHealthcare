/* Mutex Healthcare Staffing — facilities page: sample shortlist and pillars (the request form is on the Contact page) */
(function () {
  'use strict';
  const MX = window.MX;
  const { $, $$, SITE } = MX;

  $$('[data-phone-link]').forEach((a) => { a.href = SITE.phoneHref; });
  $$('[data-email-link]').forEach((a) => { a.href = 'mailto:' + SITE.email; });

  /* ---------- Sample shortlist ---------- */
  const CANDS = [
    ['AK', 'Amara K., RN', 'ICU · 7 yrs · CCRN · compact license', 96],
    ['DL', 'Daniel L., RN', 'CVICU · 5 yrs · ACLS · available in 2 weeks', 92],
    ['SM', 'Sofia M., RN', 'MICU · 4 yrs · prior travel assignments: 6', 88],
  ];
  const candList = $('#candList');
  candList.innerHTML = CANDS.map(([i, n, s, f]) => `
    <div class="cand">
      <span class="avatar">${i}</span>
      <div><b>${n}</b><small>${s}</small><div class="bar"><i data-w="${f}"></i></div></div>
      <span class="fit">${f}%</span>
    </div>`).join('');
  const fillBars = () => $$('.bar i', candList).forEach((b, i) => setTimeout(() => { b.style.width = b.dataset.w + '%'; }, 250 + i * 180));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((en) => { if (en[0].isIntersecting) { fillBars(); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(candList);
  } else fillBars();

  /* ---------- Pillars ---------- */
  const SUB = {
    nursing: 'RN, LPN, CNA across every unit', allied: 'Respiratory, lab, surgical, MA', therapy: 'PT, OT, SLP and assistants',
    imaging: 'CT, MRI, ultrasound, cath lab', pharmacy: 'Pharmacists and technicians', behavioral: 'Psych RN, LCSW, BHT',
    schools: 'Districts, corrections, public health', hit: 'EHR analysts, informatics, trainers',
  };
  $('#pillarGrid').innerHTML = MX.SPECIALTIES.map((s, i) => `
    <a class="pillar" href="staffing-${s.slug}" data-reveal style="--d:${(i % 4) * 60}ms"><span class="ico">${MX.icon(s.icon)}</span><span>${s.name}<small>${SUB[s.id]}</small></span></a>`).join('');
})();
