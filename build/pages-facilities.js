/* Pages for healthcare organizations: staffing by specialty, workforce solutions and Mutex Match. */
'use strict';
const SPEC = require('./specialties');

module.exports = (L, MX) => {
  const { hero, listCard, cards, steps, split, faq, cta, note, btn, raw, icon, attr } = L;
  const request = (id) => 'contact.html' + (id ? `?need=${id}` : '') + '#request';
  const facCta = (title = 'Tell us what you need. <em>Hear back in a day.</em>', id = '') => cta({
    eyebrow: 'Request staff',
    title,
    text: 'Share the roles, the headcount and the dates. A staffing specialist replies within one business day.',
    ctas: [btn('Request staff', request(id)), btn('Talk to us', 'contact.html', 'outline-light')],
  });
  const howWeWork = steps({
    eyebrow: 'How we work', title: 'From request to first shift',
    items: [
      ['Share the need', 'Roles, headcount, dates and must-haves. A minute on the form, or a call if you prefer.'],
      ['Review the shortlist', 'Mutex Match ranks the pool. A recruiter vets it and sends credentialed profiles.'],
      ['Interview and confirm', 'Speak with the clinicians you like. We lock in the offer, the start date and every compliance item.'],
      ['Stay covered', 'One lead for extensions, replacements and reporting, for as long as the assignment runs.'],
    ],
  });
  const engagements = (band = true) => cards({
    band, eyebrow: 'Types of cover', title: 'One agreement, whichever mix you need',
    items: [
      ['pin', 'Travel contracts', 'Experienced clinicians for eight to twenty-six weeks, for seasonal peaks and long vacancies.'],
      ['home', 'Local contracts', 'Clinicians who live within commuting distance, on a set schedule for a set term.'],
      ['clock', 'Per diem', 'Shift-by-shift cover for call-outs, census swings and weekends.'],
      ['briefcase', 'Permanent hires', 'Search and selection for the roles you want to keep, with one fee on a successful hire.'],
    ],
  });
  /* Intro under the hero of each staffing page: what the specialty involves on the left,
     what a facility can expect (with the live pay range from the board) on the right. */
  function intro(sp, s) {
    const expect = [
      'Credentialed candidates to review, usually within days of a request',
      'Licenses and certifications verified at the source',
      'One account lead for the whole assignment',
      'A reply to every request within one business day',
    ];
    return raw(`
    <div class="split top staff-intro">
      <div class="prose" data-reveal>${s.facIntro.map((p) => `<p>${p}</p>`).join('')}</div>
      <aside class="panel expect" data-reveal>
        <h3>What you can expect</h3>
        <ul class="checklist">${expect.map((e) => `<li>${icon('check')}<span>${e}</span></li>`).join('')}</ul>
        <p class="expect-pay">Current ${s.short} roles on our board pay <b data-payrange='${attr({ specialties: [sp.id] })}'></b>.</p>
        <a class="btn btn-primary btn-lg btn-block" href="${request(sp.id)}">Request staff</a>
        <a class="btn btn-ghost btn-lg btn-block" href="specialty-${s.slug}.html">Specialty details for clinicians</a>
      </aside>
    </div>`);
  }
  const pages = [];

  /* ---------- Staffing by specialty ---------- */
  MX.SPECIALTIES.forEach((sp) => {
    const s = SPEC[sp.id];
    const roles = MX.ROLES.filter((r) => r.specialty === sp.id).map((r) => r.title);
    pages.push({
      file: `staffing-${s.slug}.html`, nav: 'employers',
      title: `${sp.name} Staffing`,
      desc: s.facLead,
      blocks: [
        hero({
          crumbs: [['Staffing Services', 'employers.html'], [sp.name]],
          eyebrow: `${sp.name} staffing`, title: s.facTitle, lead: s.facLead,
          ctas: [btn('Request staff', request(sp.id)), btn('How we work', 'employers.html#process', 'ghost')],
        }),
        intro(sp, s),
        cards({ eyebrow: 'Why facilities choose Mutex', title: `${sp.name} staffing you do not have to chase`, items: s.facWhy }),
        engagements(true),
        howWeWork,
        split({
          eyebrow: 'Areas we cover', title: `${sp.name}, across the continuum`,
          paras: ['Tell us the unit or service line and what a good first week looks like. We screen for it before you see a profile.'],
          checklist: s.units,
          side: listCard('Roles we place', roles, btn(`Request ${s.short} staff`, request(sp.id), 'dark', '')),
        }),
        facCta(`${sp.name} cover, <em>without the scramble.</em>`, sp.id),
      ],
    });
  });

  /* ---------- Workforce solutions ---------- */
  pages.push({
    file: 'workforce-solutions.html', nav: 'workforce',
    title: 'Workforce Solutions',
    desc: 'Programs for recurring workforce problems: contract therapy, credentialing and compliance, rural and critical access staffing, managed programs and surge response.',
    blocks: [
      hero({
        crumbs: [['Workforce Solutions']],
        eyebrow: 'Workforce solutions',
        title: 'For the problems <em>one hire cannot fix.</em>',
        lead: 'When vacancies keep recurring, agency spend keeps climbing or compliance keeps you up at night, a program does more than another placement.',
        ctas: [btn('Start a conversation', 'contact.html'), btn('Request staff', request(), 'ghost')],
        side: listCard('A program makes sense when', [
          'The same roles are open again every quarter',
          'Several agencies work to several standards',
          'Credential files live in more than one place',
          'A department depends on one or two people',
        ]),
      }),
      cards({
        eyebrow: 'Programs', title: 'Pick the lightest one that solves it',
        items: [
          ['activity', 'Contract Therapy', 'We run the rehab department, from staffing and scheduling to documentation.', 'contract-therapy.html', 'About contract therapy'],
          ['shield', 'Credentialing & Compliance', 'Verification, monitoring and survey readiness for your own staff as well as ours.', 'credentialing-compliance.html', 'About credentialing'],
          ['mountain', 'Rural & Critical Access', 'Longer contracts with housing arranged up front, for facilities far from backup.', 'rural-critical-access.html', 'About the rural program'],
          ['layers', 'Managed staffing programs', 'One contract, one invoice and one set of standards across every agency and unit.'],
          ['zap', 'Surge and rapid response', 'Pre-credentialed clinicians on call for census spikes, go-lives and unplanned leave.'],
          ['users', 'Internal float pools', 'Help building and managing your own flexible bench, so agency spend becomes the exception.'],
        ],
      }),
      steps({
        eyebrow: 'How a program starts', title: 'Scoped before it is sold',
        items: [
          ['Listen', 'A working session with the people who feel the problem: managers, schedulers, finance.'],
          ['Measure', 'We look at vacancies, spend, time to fill and compliance gaps with you.'],
          ['Propose', 'A written scope with responsibilities, reporting and a named program lead.'],
          ['Run and report', 'Regular reviews against the measures we agreed, with changes made in the open.'],
        ],
      }),
      facCta('Not sure which program fits? <em>Start with the problem.</em>'),
    ],
  });

  pages.push({
    file: 'contract-therapy.html', nav: 'workforce',
    title: 'Contract Therapy',
    desc: 'Contract therapy from Mutex Healthcare Staffing: we staff, schedule and manage your rehab department so therapy becomes a service line you can count on.',
    blocks: [
      hero({
        crumbs: [['Workforce Solutions', 'workforce-solutions.html'], ['Contract Therapy']],
        eyebrow: 'Contract therapy',
        title: 'Run the rehab department, <em>not just fill it.</em>',
        lead: 'We take on staffing, scheduling, supervision and documentation for your therapy team, so rehab becomes a service line you can count on.',
        ctas: [btn('Talk to us about your department', 'contact.html'), btn('Therapy staffing', 'staffing-therapy.html', 'ghost')],
        side: listCard('A good fit if', [
          'Therapy vacancies are limiting admissions',
          'You rely on a rotating cast of short contracts',
          'Documentation and productivity vary by therapist',
          'You want one accountable partner for rehab',
        ]),
      }),
      cards({
        eyebrow: 'What we take on', title: 'The whole department, with one lead',
        items: [
          ['users', 'Staffing', 'Physical, occupational and speech therapists and assistants, recruited and retained for your setting.'],
          ['calendar', 'Scheduling', 'Coverage planned around your census, with cover for leave built in.'],
          ['fileCheck', 'Documentation', 'Consistent, timely documentation that supports care and stands up to review.'],
          ['award', 'Clinical leadership', 'A program lead who owns quality, mentoring and communication with your team.'],
        ],
      }),
      steps({
        eyebrow: 'How it starts', title: 'A careful handover',
        items: [
          ['Assess', 'We review caseload, staffing, documentation and outcomes with your leaders.'],
          ['Plan', 'A written transition plan with roles, timelines and the measures we will report on.'],
          ['Transition', 'Existing therapists are kept informed and, wherever possible, kept on.'],
          ['Operate', 'Regular reviews with your team, and changes made together.'],
        ],
      }),
      faq({
        more: false,
        items: [
          ['Which settings is contract therapy for?', 'Skilled nursing, inpatient rehab, hospitals, home health and outpatient clinics. The model is adapted to each setting.'],
          ['What happens to our current therapists?', 'We aim to keep the team you have. The transition plan sets out how, and nobody is surprised.'],
          ['Can you cover only part of the department?', 'Yes. Some facilities start with one discipline or one site and expand from there.'],
        ],
      }),
      facCta('Make therapy a service line <em>you can count on.</em>', 'therapy'),
    ],
  });

  pages.push({
    file: 'credentialing-compliance.html', nav: 'workforce',
    title: 'Credentialing & Compliance',
    desc: 'Credential verification, expiry-date tracking and audit support for your own staff as well as ours, from Mutex Healthcare Staffing.',
    blocks: [
      hero({
        crumbs: [['Workforce Solutions', 'workforce-solutions.html'], ['Credentialing & Compliance']],
        eyebrow: 'Credentialing and compliance',
        title: 'Files that are ready <em>when the surveyor walks in.</em>',
        lead: 'Verification, monitoring and audit support for your own staff as well as ours, so a lapsed certificate never becomes a finding.',
        ctas: [btn('Talk to us', 'contact.html'), btn('All workforce solutions', 'workforce-solutions.html', 'ghost')],
        side: listCard('What we track', [
          'Licenses, verified at the source',
          'Certifications such as BLS, ACLS and specialty credentials',
          'Immunizations, TB testing and health records',
          'Background checks and sanction screening',
          'Competencies and required education',
        ]),
      }),
      cards({
        eyebrow: 'What is included', title: 'Four jobs, one owner',
        items: [
          ['search', 'Primary-source verification', 'Licenses and certifications confirmed with the issuing body, not taken from a copy.'],
          ['clock', 'Expiry-date tracking', 'Every expiry date tracked, with reminders sent well before a credential lapses.'],
          ['fileCheck', 'Audit and survey support', 'Complete, consistent files, and help pulling them when a reviewer asks.'],
          ['users', 'Onboarding files', 'New hires and contractors made ready to start, with one checklist and one contact.'],
        ],
      }),
      steps({
        eyebrow: 'How it works', title: 'From scattered to survey-ready',
        items: [
          ['Review', 'We look at how files are kept today and where the gaps are.'],
          ['Standardize', 'One checklist per role, agreed with your compliance lead.'],
          ['Verify', 'Every file brought up to the standard, with the source of each verification recorded.'],
          ['Monitor', 'Ongoing tracking and reporting, so nothing expires unnoticed.'],
        ],
      }),
      note('State any accreditations Mutex holds for credentialing (for example a staffing certification) here once confirmed.'),
      faq({
        more: false,
        items: [
          ['Can you credential our employed staff, not only contractors?', 'Yes. The program covers your own employees as well as clinicians placed through us.'],
          ['Do you work to our standards or yours?', 'Yours. We start from your policies and the requirements of your accrediting body, and document to them.'],
          ['How do we see the status of a file?', 'You receive regular reports, and your compliance lead can ask for any file at any time.'],
        ],
      }),
      facCta('Make compliance <em>the quiet part of the job.</em>'),
    ],
  });

  pages.push({
    file: 'rural-critical-access.html', nav: 'workforce',
    title: 'Rural & Critical Access Program',
    desc: 'Staffing for rural and critical access hospitals: longer contracts, housing arranged up front and clinicians who choose rural practice.',
    blocks: [
      hero({
        crumbs: [['Workforce Solutions', 'workforce-solutions.html'], ['Rural & Critical Access']],
        eyebrow: 'Rural and critical access',
        title: 'Longer contracts, <em>housing built in.</em>',
        lead: 'Built for facilities where the nearest backup is hours away and every vacancy is felt on the first day.',
        ctas: [btn('Request staff', request()), btn('Talk to us', 'contact.html', 'ghost')],
        side: listCard('Designed for', [
          'Critical access and rural community hospitals',
          'Clinics and long-term care in small communities',
          'Units where one clinician covers several roles',
          'Places where housing is hard to find',
        ]),
      }),
      cards({
        eyebrow: 'How the program differs', title: 'Staffing that fits small-town reality',
        items: [
          ['calendar', 'Longer contracts', 'Assignments planned for longer terms, so your team is not onboarding someone new every quarter.'],
          ['home', 'Housing arranged', 'We sort out housing before the start date, because a contract cannot start without somewhere to live.'],
          ['heart', 'Clinicians who choose rural', 'People who want broad practice and a community, screened for exactly that.'],
          ['layers', 'Generalists welcome', 'Clinicians comfortable covering more than one area when the census calls for it.'],
        ],
      }),
      steps({
        eyebrow: 'How we work', title: 'Planned further ahead',
        items: [
          ['Map the year', 'We look at known leave, seasonal peaks and hard-to-fill roles with you.'],
          ['Recruit early', 'Searches start well before the gap opens.'],
          ['Settle them in', 'Housing, orientation and introductions arranged before day one.'],
          ['Extend or replace', 'Extensions planned early, with the next clinician lined up if needed.'],
        ],
      }),
      faq({
        more: false,
        items: [
          ['How long are the contracts?', 'Longer than a standard thirteen weeks where that suits you and the clinician. We agree the term for each role.'],
          ['Who arranges housing?', 'We do, with your local knowledge. It is settled before the start date.'],
          ['Can one clinician cover more than one unit?', 'Often, yes. Tell us the mix and we recruit for people with that breadth.'],
        ],
      }),
      facCta('Far from backup <em>does not mean on your own.</em>'),
    ],
  });

  /* ---------- Mutex Match ---------- */
  pages.push({
    file: 'mutex-match.html', nav: 'match',
    title: 'Mutex Match',
    desc: 'Mutex Match is our matching technology: software ranks openings against available clinicians, and a recruiter makes every final call.',
    blocks: [
      hero({
        crumbs: [['Mutex Match']],
        eyebrow: 'Our technology',
        title: 'Software narrows the field. <em>People make the call.</em>',
        lead: 'Mutex Match ranks every opening against every available clinician on the things that predict a good placement. A recruiter reviews every match before anyone is contacted.',
        ctas: [btn('Request staff', request()), btn('Find my match', 'jobs.html', 'ghost')],
        side: listCard('What it never does', [
          'Submit a clinician without their say-so',
          'Reject anyone without a person looking',
          'Use anything unrelated to the work itself',
          'Replace the conversation with your recruiter',
        ]),
      }),
      cards({
        eyebrow: 'What it weighs', title: 'The four things that predict a good fit',
        items: [
          ['shield', 'License and location', 'Where a clinician can practice today, and where they could with a little notice.'],
          ['activity', 'Unit experience', 'Recent, relevant experience in the unit, modality or setting the role needs.'],
          ['calendar', 'Availability', 'Start dates, contract length and shift patterns that line up.'],
          ['heart', 'Preferences', 'The setting, schedule and pay goals each clinician has told us matter to them.'],
        ],
      }),
      steps({
        eyebrow: 'How a match happens', title: 'Four steps, one accountable recruiter',
        items: [
          ['A need comes in', 'A facility request or a clinician search, with the details that matter.'],
          ['The pool is ranked', 'Mutex Match scores the fit on license, experience, availability and preferences.'],
          ['A recruiter reviews', 'A person checks the shortlist, talks to the clinician and confirms interest.'],
          ['You decide', 'Facilities choose who to interview. Clinicians choose what to accept.'],
        ],
      }),
      cards({
        eyebrow: 'Why it matters', title: 'Faster, without cutting corners',
        items: [
          ['zap', 'Less waiting', 'Recruiters start from a ranked shortlist instead of a blank search.'],
          ['users', 'Better conversations', 'Time saved on sorting is spent on the part that needs a human.'],
          ['search', 'Nothing overlooked', 'Every available clinician is considered for every role, every time.'],
        ],
      }),
      note('This page describes Mutex Match as drafted for the site. Confirm the product name and what the technology actually does before launch.'),
      facCta('See who Mutex Match <em>would shortlist for you.</em>'),
    ],
  });

  return pages;
};
