/* Pages for clinicians: the job seeker hub, ways to work, specialties and resources. */
'use strict';
const SPEC = require('./specialties');

module.exports = (L, MX) => {
  const { hero, statCard, cards, steps, split, chipPanel, jobs, faq, cta, article, note, raw, form, btn } = L;
  const q = (s) => 'jobs.html?q=' + encodeURIComponent(s);
  const seekerCta = (title = 'Your next role is <em>one match away.</em>') => cta({
    title,
    text: 'Apply in two minutes, or join the talent network and let a recruiter bring the right roles to you.',
    ctas: [btn('Search jobs', 'jobs.html'), btn('Join the talent network', 'apply.html', 'outline-light')],
  });
  const pages = [];

  /* ---------- Hub ---------- */
  pages.push({
    file: 'job-seekers.html', nav: 'seekers',
    title: 'Find Healthcare Work',
    desc: 'Travel, local, per diem and permanent healthcare jobs with the pay on every posting. Explore the ways to work with Mutex Healthcare Staffing.',
    blocks: [
      hero({
        crumbs: [['Find Work']],
        eyebrow: 'For clinicians',
        title: 'However you want to work, <em>start here.</em>',
        lead: 'Travel the country, stay close to home or find a permanent team. Every role shows the pay first, and one recruiter stays with you the whole way.',
        ctas: [btn('Search all jobs', 'jobs.html'), btn('Join the talent network', 'apply.html', 'ghost')],
        side: statCard({}, 'healthcare'),
      }),
      cards({
        eyebrow: 'Ways to work', title: 'Six ways to build your career',
        items: [
          ['pin', 'Travel Nursing', 'Thirteen weeks somewhere new, with a pay package you can read and housing handled your way.', 'travel-nursing.html', 'Explore travel nursing'],
          ['activity', 'Allied & Therapy', 'Therapists, technologists and allied professionals on travel, local and permanent assignments.', 'allied-therapy.html', 'Explore allied and therapy'],
          ['calendar', 'Per Diem & Local', 'Pick up shifts when you want them, or take a contract without relocating.', 'per-diem.html', 'Explore per diem and local'],
          ['briefcase', 'Permanent Placement', 'Introductions to employers hiring directly, with interview and offer support at no cost to you.', 'permanent-placement.html', 'Explore permanent roles'],
          ['cap', 'Federal & Schools', 'School districts, corrections and public health settings with predictable calendars.', 'federal-schools.html', 'Explore federal and schools'],
          ['monitor', 'Healthcare IT', 'EHR analyst, informatics and training roles for people who know both the clinic and the system.', 'healthcare-it.html', 'Explore healthcare IT'],
        ],
      }),
      cards({
        band: true, eyebrow: 'Resources', title: 'Know before you go',
        intro: 'Plain-language guides to the parts of contract work nobody explains.',
        items: [
          ['dollar', 'Pay & Benefits', 'How a pay package is built, and what to ask before you sign.', 'pay-benefits.html', 'Read the guide'],
          ['shield', 'Licensure Guide', 'Compact licenses, single-state applications and realistic timelines.', 'licensure.html', 'Read the guide'],
          ['users', 'Refer a Friend', 'Know a great clinician? Send them our way and earn a bonus when they start.', 'referral.html', 'Refer someone'],
          ['message', 'FAQs', 'Straight answers on applying, credentialing, pay and assignments.', 'faqs.html', 'See the answers'],
        ],
      }),
      jobs({ title: 'The best-paying openings this week', intro: 'Every posting shows the rate before you apply.', filter: { types: ['Travel Contract'] } }),
      seekerCta(),
    ],
  });

  /* ---------- Ways to work ---------- */
  const contractSteps = steps({
    eyebrow: 'How it works', title: 'From first look to first shift',
    items: [
      ['Pick your assignment', 'Search by specialty, state and shift. The rate, the dates and the setting are on every posting.'],
      ['Submit and interview', 'Your recruiter presents your profile and preps you for a short call with the unit manager.'],
      ['Credential and plan', 'We collect licenses, certifications and health records once, and plan travel and housing with you.'],
      ['Start, then choose', 'Extend, take a new contract somewhere else, or go permanent. Your file comes with you.'],
    ],
  });

  pages.push({
    file: 'travel-nursing.html', nav: 'seekers',
    title: 'Travel Nursing Jobs',
    desc: 'Travel nursing contracts nationwide with the pay shown up front, licensing mapped out and one recruiter from first call to last shift.',
    blocks: [
      hero({
        crumbs: [['Find Work', 'job-seekers.html'], ['Travel Nursing']],
        eyebrow: 'Ways to work',
        title: 'Travel nursing, <em>with the numbers up front.</em>',
        lead: 'Thirteen weeks somewhere new, a pay package you understand, and one recruiter from first call to last shift.',
        ctas: [btn('See travel nursing jobs', 'jobs.html?specialty=nursing&type=Travel+Contract'), btn('Estimate my pay', 'index.html#estimator', 'ghost')],
        side: statCard({ specialties: ['nursing'], types: ['Travel Contract'] }, 'travel nursing'),
      }),
      cards({
        eyebrow: 'Why travel with Mutex', title: 'The parts that usually go wrong, handled',
        items: [
          ['dollar', 'A package you can read', 'Hourly rate and weekly estimate on the posting. Your recruiter walks through taxable pay and any stipends before you sign.'],
          ['home', 'Housing your way', 'Take a stipend and find your own place, or ask us for help with options near the facility.'],
          ['shield', 'Licensing mapped out', 'Compact license or single state, we plan the paperwork backwards from your start date.'],
          ['users', 'One recruiter, start to finish', 'The same person handles your submission, your credentialing and the question that comes up in week six.'],
        ],
      }),
      L.explore(),
      contractSteps,
      L.facts(),
      jobs({ title: 'Travel nursing jobs open now', filter: { specialties: ['nursing'], types: ['Travel Contract'] } }),
      L.quiz(),
      faq({
        items: [
          ['How long is a travel nursing contract?', 'Most run thirteen weeks. Some are eight and some are twenty-six, and extensions are common when you and the facility both want one.'],
          ['How do stipends work?', 'Housing and meal stipends follow tax rules that depend on your own situation, including whether you keep a tax home. We explain how each package is structured. For advice on your own taxes, speak with a tax professional.'],
          ['Can I travel with a partner, family or a pet?', 'Yes. Tell your recruiter early so that housing and location choices account for it.'],
          ['What if a contract is cancelled?', 'Cancellations are uncommon but they do happen. Your contract spells out the terms, and your recruiter starts on the next option straight away.'],
        ],
      }),
      seekerCta('Your next contract is <em>one match away.</em>'),
    ],
  });

  pages.push({
    file: 'allied-therapy.html', nav: 'seekers',
    title: 'Allied Health & Therapy Jobs',
    desc: 'Travel, local and permanent jobs for therapists, imaging technologists and allied health professionals in all 50 states.',
    blocks: [
      hero({
        crumbs: [['Find Work', 'job-seekers.html'], ['Allied & Therapy']],
        eyebrow: 'Ways to work',
        title: 'Allied and therapy careers, <em>on your terms.</em>',
        lead: 'Travel, local and permanent roles for therapists, technologists and allied professionals in all 50 states.',
        ctas: [btn('See allied and therapy jobs', 'jobs.html?specialty=allied,therapy,imaging'), btn('Join the talent network', 'apply.html', 'ghost')],
        side: statCard({ specialties: ['allied', 'therapy', 'imaging'] }, 'allied and therapy'),
      }),
      cards({
        eyebrow: 'Three practice areas', title: 'Find your discipline',
        items: [
          ['flask', 'Allied Health', 'Respiratory, laboratory, surgical and clinic roles.', 'specialty-allied-health.html', 'Allied health jobs'],
          ['activity', 'Therapy', 'PT, OT and SLP assignments in every setting.', 'specialty-therapy.html', 'Therapy jobs'],
          ['scan', 'Radiology & Imaging', 'CT, MRI, ultrasound, X-ray and cath lab.', 'specialty-radiology.html', 'Imaging jobs'],
        ],
      }),
      cards({
        band: true, eyebrow: 'Why Mutex', title: 'Built around how you actually work',
        items: [
          ['dollar', 'Pay on every posting', 'Hourly rate and weekly estimate up front, including call and overtime terms where they apply.'],
          ['search', 'Matched on what you know', 'Equipment, case mix, setting and productivity expectations, asked before you interview.'],
          ['fileCheck', 'Credentials tracked for you', 'Registries, state licenses and certifications monitored so nothing lapses mid-assignment.'],
        ],
      }),
      jobs({ title: 'Allied and therapy jobs open now', filter: { specialties: ['allied', 'therapy', 'imaging'] } }),
      faq({ items: [SPEC.allied.faq[1], SPEC.therapy.faq[0], SPEC.imaging.faq[1], SPEC.allied.faq[2]] }),
      seekerCta(),
    ],
  });

  pages.push({
    file: 'per-diem.html', nav: 'seekers',
    title: 'Per Diem & Local Contract Jobs',
    desc: 'Per diem shifts and local healthcare contracts close to home, with the rate on every posting.',
    blocks: [
      hero({
        crumbs: [['Find Work', 'job-seekers.html'], ['Per Diem & Local']],
        eyebrow: 'Ways to work',
        title: 'Per diem and local work, <em>close to home.</em>',
        lead: 'Pick up shifts when you want them, or take a local contract without relocating. The rate is on every posting.',
        ctas: [btn('See per diem and local jobs', 'jobs.html?type=Per+Diem,Local+Contract'), btn('Join the talent network', 'apply.html', 'ghost')],
        side: statCard({ types: ['Per Diem', 'Local Contract'] }, 'per diem and local'),
      }),
      cards({
        eyebrow: 'Two options', title: 'Which one fits your week?', cols: 2,
        items: [
          ['clock', 'Per diem', 'Shift by shift. You tell us when you are available, and facilities book the shifts they need. Ideal alongside school, family or another role.'],
          ['pin', 'Local contract', 'A set schedule for a set number of weeks at a facility within commuting distance. The stability of a contract without the move.'],
        ],
      }),
      cards({
        band: true, eyebrow: 'Why Mutex', title: 'Flexible without being flaky',
        items: [
          ['calendar', 'Work when it suits you', 'Set your availability and change it as life changes. You choose what you accept.'],
          ['dollar', 'Rates you can compare', 'Every shift and contract shows the hourly rate, so the choice is yours to make.'],
          ['layers', 'Keep your options open', 'Move between per diem, local contracts and travel. Your credential file comes with you.'],
        ],
      }),
      jobs({ title: 'Per diem and local jobs open now', filter: { types: ['Per Diem', 'Local Contract'] } }),
      faq({
        items: [
          ['Is there a minimum number of shifts?', 'It varies by facility. Some ask for a minimum each month to stay active. Your recruiter tells you before you sign up.'],
          ['How far ahead are shifts booked?', 'Anywhere from weeks ahead to the same day. You choose what you accept.'],
          ['Do local contracts pay the same as travel contracts?', 'The packages are structured differently, because local contracts do not include travel-related stipends. The posting shows the rate so you can compare directly.'],
        ],
      }),
      seekerCta(),
    ],
  });

  pages.push({
    file: 'permanent-placement.html', nav: 'seekers',
    title: 'Permanent Healthcare Jobs',
    desc: 'Permanent, direct-hire healthcare roles. Interview preparation and offer support from a Mutex recruiter, at no cost to you.',
    blocks: [
      hero({
        crumbs: [['Find Work', 'job-seekers.html'], ['Permanent Placement']],
        eyebrow: 'Ways to work',
        title: 'Permanent roles, <em>found with you.</em>',
        lead: 'Looking for a place to stay? We introduce you to employers hiring directly, prepare you for the interview and stand beside you through the offer. It never costs you anything.',
        ctas: [btn('See permanent jobs', 'jobs.html?type=Permanent'), btn('Talk to a recruiter', 'apply.html', 'ghost')],
        side: statCard({ types: ['Permanent'] }, 'permanent'),
      }),
      cards({
        eyebrow: 'Why go through us', title: 'A second person on your side of the table',
        items: [
          ['dollar', 'No cost to you', 'Employers pay our fee. You never pay to be represented or placed.'],
          ['message', 'Interview preparation', 'We tell you who you are meeting, what the unit is worried about and what to ask them.'],
          ['fileCheck', 'Offer support', 'We help you compare salary, schedule and benefits, and ask the awkward questions for you.'],
        ],
      }),
      steps({
        eyebrow: 'How it works', title: 'Four steps to a permanent role',
        items: [
          ['Tell us what right looks like', 'Location, schedule, team size, salary. The more specific you are, the better the shortlist.'],
          ['Meet the employers', 'We introduce you only to roles that fit, with the salary range stated up front.'],
          ['Interview, prepared', 'A briefing before each conversation and honest feedback after it.'],
          ['Decide and start', 'We handle the offer details and the credentialing, and check in after you begin.'],
        ],
      }),
      jobs({ eyebrow: 'Hiring directly', title: 'Permanent roles open now', filter: { types: ['Permanent'] } }),
      faq({
        items: [
          ['Does it cost anything to be placed?', 'No. The hiring employer pays our fee. There is never a charge to you.'],
          ['Who is my employer?', 'The facility. You are hired directly, with their salary, benefits and career path.'],
          ['Can I move from a contract to a permanent role?', 'Yes. Many clinicians try a facility on contract first. If you both want to make it permanent, we arrange it.'],
        ],
      }),
      seekerCta('The right team is <em>one introduction away.</em>'),
    ],
  });

  const wayFromSpec = (id, file, crumb, title, lead, label, whyTitle) => {
    const s = SPEC[id];
    pages.push({
      file, nav: 'seekers',
      title: crumb + ' Jobs',
      desc: lead,
      blocks: [
        hero({
          crumbs: [['Find Work', 'job-seekers.html'], [crumb]],
          eyebrow: 'Ways to work', title, lead,
          ctas: [btn(`See ${label} jobs`, 'jobs.html?specialty=' + id), btn('Join the talent network', 'apply.html', 'ghost')],
          side: statCard({ specialties: [id] }, label),
        }),
        cards({ eyebrow: 'Why Mutex', title: whyTitle, items: s.seekerWhy }),
        split({
          eyebrow: 'Where you could work', title: 'Roles and settings we staff',
          paras: ['Tell your recruiter which of these you want to see, and which you do not. The shortlist follows your lead.'],
          checklist: s.units,
          ctas: [btn(`More about ${s.short} roles`, `specialty-${s.slug}.html`, 'ghost', '')],
          side: chipPanel('Search by role', MX.ROLES.filter((r) => r.specialty === id).map((r) => r.title), q),
        }),
        jobs({ title: `${crumb} jobs open now`, filter: { specialties: [id] } }),
        faq({ items: s.faq }),
        seekerCta(),
      ],
    });
  };
  wayFromSpec('schools', 'federal-schools.html', 'Federal & Schools',
    'Work that serves <em>whole communities.</em>',
    'School districts, corrections and public health programs need clinicians who want predictable schedules and lasting impact.',
    'federal and school', 'Public service, with a recruiter in your corner');
  wayFromSpec('hit', 'healthcare-it.html', 'Healthcare IT',
    'Healthcare IT careers <em>at the point of care.</em>',
    'Implementations, upgrades and optimization projects for analysts, informatics specialists and trainers.',
    'healthcare IT', 'Technical work, matched by people who understand it');

  /* ---------- Specialties ---------- */
  pages.push({
    file: 'specialties.html', nav: 'seekers',
    title: 'Healthcare Specialties',
    desc: 'Eight healthcare specialties staffed by Mutex: nursing, allied health, therapy, imaging, pharmacy, behavioral health, federal and schools, and healthcare IT.',
    blocks: [
      hero({
        crumbs: [['Find Work', 'job-seekers.html'], ['Specialties']],
        eyebrow: 'Eight specialties',
        title: 'Find the work that fits <em>the way you practice.</em>',
        lead: 'One standard across every practice area: the role has to fit you, not the other way round.',
        ctas: [btn('Search all jobs', 'jobs.html')],
      }),
      cards({
        eyebrow: 'Choose your specialty', title: 'Where do you practice?',
        items: MX.SPECIALTIES.map((s) => [s.icon, s.name, s.blurb, `specialty-${SPEC[s.id].slug}.html`, `<span data-jobcount='${L.attr({ specialties: [s.id] })}'></span> open jobs`]),
      }),
      seekerCta(),
    ],
  });

  MX.SPECIALTIES.forEach((sp) => {
    const s = SPEC[sp.id];
    pages.push({
      file: `specialty-${s.slug}.html`, nav: 'seekers',
      title: `${sp.name} Jobs`,
      desc: s.seekerLead,
      blocks: [
        hero({
          crumbs: [['Specialties', 'specialties.html'], [sp.name]],
          eyebrow: sp.name, title: s.seekerTitle, lead: s.seekerLead,
          ctas: [btn(`See ${s.short} jobs`, 'jobs.html?specialty=' + sp.id), btn('Join the talent network', 'apply.html', 'ghost')],
          side: statCard({ specialties: [sp.id] }, s.short),
        }),
        cards({ eyebrow: 'Why clinicians choose Mutex', title: `What you get as a ${s.short} professional`, items: s.seekerWhy }),
        split({
          eyebrow: 'Roles and settings', title: `Where our ${s.short} clinicians work`,
          paras: ['Travel contracts, local contracts, per diem shifts and permanent positions. Tell us which you want to see and the shortlist follows your lead.'],
          checklist: s.units,
          side: chipPanel('Search by role', MX.ROLES.filter((r) => r.specialty === sp.id).map((r) => r.title), q),
        }),
        jobs({ title: `${sp.name} jobs open now`, filter: { specialties: [sp.id] } }),
        faq({ items: s.faq }),
        seekerCta(`Your next ${s.short} role is <em>one match away.</em>`),
      ],
    });
  });

  /* ---------- Resources ---------- */
  pages.push({
    file: 'locations.html', nav: 'seekers',
    title: 'Healthcare Jobs by State',
    desc: 'Browse healthcare jobs in all 50 states. Pick a state to see open travel, local, per diem and permanent roles with pay shown.',
    blocks: [
      hero({
        crumbs: [['Find Work', 'job-seekers.html'], ['Jobs by state']],
        eyebrow: 'Explore by state',
        title: 'Where do you want <em>to go next?</em>',
        lead: 'Open roles in all 50 states. Pick a state to see what is hiring there right now, with the pay on every posting.',
        ctas: [btn('Search all jobs', 'jobs.html')],
      }),
      raw(`
    <div data-state-map></div>`),
      raw(`
    <div class="section-head"><div data-reveal><p class="eyebrow">All 50 states</p><h2>Or pick from the list</h2></div></div>
    <div class="state-grid" data-states-all></div>`),
      cards({
        eyebrow: 'Before you pick', title: 'Three things worth checking',
        items: [
          ['shield', 'Your license', 'Compact states may be open to you already. Others need an application first.', 'licensure.html', 'Licensure guide'],
          ['dollar', 'What it pays there', 'Rates move with location and cost of living. Compare before you commit.', 'index.html#estimator', 'Pay estimator'],
          ['home', 'Housing', 'Stipend or help finding a place: decide which suits the city you have in mind.', 'pay-benefits.html', 'Pay and benefits'],
        ],
      }),
      seekerCta(),
    ],
  });

  pages.push({
    file: 'pay-benefits.html', nav: 'seekers',
    title: 'Pay & Benefits',
    desc: 'How healthcare contract pay packages are built, what to ask before you sign, and the support you can expect from Mutex Healthcare Staffing.',
    blocks: [
      hero({
        crumbs: [['Find Work', 'job-seekers.html'], ['Pay & Benefits']],
        eyebrow: 'Resources',
        title: 'Pay and benefits, <em>in plain language.</em>',
        lead: 'Every posting shows the rate before you apply. This page explains what sits behind that number, and what to ask before you sign.',
        ctas: [btn('Estimate my pay', 'index.html#estimator'), btn('Search jobs', 'jobs.html', 'ghost')],
      }),
      cards({
        eyebrow: 'How a pay package is built', title: 'Four parts to look at',
        items: [
          ['dollar', 'Hourly rate', 'The taxable base pay for each hour worked. It is the number on the posting.'],
          ['home', 'Stipends', 'Some travel contracts include housing and meal stipends. Whether they apply depends on the contract and on your own circumstances.'],
          ['clock', 'Overtime and call', 'Overtime, on-call and callback terms differ by facility. They are listed before you accept.'],
          ['calendar', 'Guaranteed hours', 'How many hours a week the contract guarantees, and what happens if a shift is cancelled.'],
        ],
      }),
      split({
        eyebrow: 'Before you sign', title: 'Questions worth asking every time',
        paras: ['A good recruiter answers these without being asked. Ours do, but here is the list anyway.'],
        checklist: [
          ['What is the hourly rate, and what is the weekly gross at my contracted hours?', 'The estimate on the posting assumes the listed hours.'],
          ['Are any stipends included, and what do I need to qualify for them?', 'Tax treatment depends on your situation. Ask a tax professional about yours.'],
          ['How many hours are guaranteed?', 'And what is the policy if the facility cancels a shift.'],
          ['What are the overtime, holiday and call rates?', 'Get them in writing in the contract.'],
          ['What happens if the contract ends early?', 'The terms should be spelled out for both sides.'],
        ],
        side: L.listCard('What we always do', [
          'Show the rate on the posting, before you apply',
          'Walk through the full package before you accept',
          'Put every term in the contract, in plain language',
          'Answer pay questions within one business day',
        ], btn('See open jobs', 'jobs.html', 'dark', '')),
      }),
      cards({
        eyebrow: 'Benefits and support', title: 'Beyond the paycheck',
        intro: 'What applies depends on the type of assignment. Your recruiter confirms the details for the contract you choose.',
        items: [
          ['heartPulse', 'Health coverage', 'Ask your recruiter which medical, dental and vision options are available for your assignment.'],
          ['shield', 'Licensure support', 'Guidance on the license and certifications each state and facility requires.'],
          ['users', 'Referral bonuses', 'Refer a clinician and earn a bonus when they start their first assignment.', 'referral.html', 'Refer a friend'],
          ['message', 'A person to call', 'One recruiter for the whole assignment, and an answer within one business day.'],
        ],
      }),
      note('The benefits above are written as general statements. Replace them with the actual Mutex benefits list (coverage, retirement plan, reimbursements) before launch.'),
      seekerCta(),
    ],
  });

  pages.push({
    file: 'licensure.html', nav: 'seekers',
    title: 'Licensure Guide',
    desc: 'A plain-language guide to healthcare licensure for contract work: compact licenses, single-state applications, timelines and the documents to keep ready.',
    blocks: [
      hero({
        crumbs: [['Find Work', 'job-seekers.html'], ['Licensure Guide']],
        eyebrow: 'Resources',
        title: 'The licensure guide, <em>without the maze.</em>',
        lead: 'What you need to work in another state, how long it tends to take, and the documents to keep ready.',
      }),
      article({
        html: `
        <h2>Start with where you are licensed now</h2>
        <p>Your license is issued by a state, and that state's rules decide where you can practice. Before you look at assignments, check two things: which state issued your license, and whether it is a single-state or a multistate license.</p>
        <h2>Compact licenses</h2>
        <p>Nurses whose primary residence is in a state that belongs to the Nurse Licensure Compact can hold one multistate license and practice in the other compact states without applying again. If you qualify, a large part of the country is open to you from day one.</p>
        <p>Several other professions, physical therapy among them, have their own interstate compacts. The rules differ by profession, so ask your recruiter what applies to yours.</p>
        <h2>Single-state licenses</h2>
        <p>If the state you want is outside your compact, or your profession has none, you apply to that state's board for a license by endorsement. Expect to provide:</p>
        <ul>
          <li>Verification of your current license and any others you have held</li>
          <li>Transcripts or proof of education</li>
          <li>Fingerprints and a background check</li>
          <li>The application fee, and sometimes a jurisprudence exam</li>
        </ul>
        <h2>How long it takes</h2>
        <p>Timelines vary widely. Some boards issue a temporary license in days; others take several weeks or longer, especially around graduation season. Apply as soon as you know which state you want, and do not book travel until the license is in hand or your recruiter has confirmed the timeline.</p>
        <h2>Certifications and other requirements</h2>
        <p>Facilities set their own requirements on top of the state's. BLS is close to universal. ACLS, PALS, NRP or a specialty certification depends on the unit. School and correctional settings often add an education credential or a security clearance.</p>
        <h2>Keep these ready</h2>
        <ul>
          <li>License numbers and expiry dates for every state you hold</li>
          <li>Current certification cards</li>
          <li>Immunization records and a recent TB test</li>
          <li>Two professional references who have supervised you recently</li>
          <li>An up-to-date résumé with exact dates and unit types</li>
        </ul>
        <p>Board rules change. Always confirm the current requirements with the state board itself; your recruiter will point you to the right page.</p>`,
        aside: L.listCard('How Mutex helps', [
          'We tell you what each state and facility requires',
          'We plan the timeline backwards from your start date',
          'We track every expiry date during your assignment',
          'One checklist, one person to send documents to',
        ], btn('Talk to a recruiter', 'apply.html', 'dark', '')),
      }),
      seekerCta(),
    ],
  });

  pages.push({
    file: 'referral.html', nav: 'seekers',
    title: 'Refer a Friend',
    desc: 'Refer a nurse, therapist or allied health professional to Mutex Healthcare Staffing and earn a bonus when they start their first assignment.',
    blocks: [
      hero({
        crumbs: [['Find Work', 'job-seekers.html'], ['Refer a Friend']],
        eyebrow: 'Referral program',
        title: 'Refer a clinician. <em>Earn when they start.</em>',
        lead: 'Good clinicians know good clinicians. Tell us who you would vouch for, and earn a referral bonus when they start their first assignment.',
        ctas: [btn('Refer someone', '#refer')],
      }),
      steps({
        eyebrow: 'How it works', title: 'Three steps, no catch',
        items: [
          ['Tell us who', 'Share their name, profession and how to reach them. Make sure they know you are passing it on.'],
          ['We take it from there', 'A recruiter gets in touch, learns what they want and shows them roles that fit.'],
          ['You earn the bonus', 'When they start their first assignment, your bonus is on its way. Refer as many people as you like.'],
        ],
      }),
      split({
        id: 'refer',
        eyebrow: 'Make a referral', title: 'Who should we call?',
        paras: ['You do not need to work with Mutex to refer someone. Anyone can.'],
        checklist: ['No limit on how many people you refer', 'Any specialty we staff', 'We tell you when they start'],
        side: form('referral'),
      }),
      note('Add the actual referral bonus amount, payout timing and terms here before launch.'),
      faq({
        more: false,
        items: [
          ['Who can I refer?', 'Any nurse, therapist, technologist or allied health professional in a specialty we staff.'],
          ['When is the bonus paid?', 'After the person you referred starts their first assignment. Your recruiter confirms the amount and the timing.'],
          ['Is there a limit?', 'No. Refer as many people as you like.'],
        ],
      }),
    ],
  });

  pages.push({
    file: 'apply.html', nav: 'seekers',
    title: 'Join the Talent Network',
    desc: 'Join the Mutex Healthcare Staffing talent network. One short form, one recruiter call, and roles that match what you want.',
    blocks: [
      hero({
        crumbs: [['Find Work', 'job-seekers.html'], ['Talent network']],
        eyebrow: 'Join the talent network',
        title: 'One short form. <em>One recruiter call.</em>',
        lead: 'Not ready to apply for a specific job? Tell us what you do and what you want, and a recruiter will bring the right roles to you.',
      }),
      split({
        eyebrow: 'What happens next', title: 'No pressure, no spam',
        paras: ['Joining the network is not an application. It simply puts a real person on the lookout for you.'],
        checklist: [
          ['A recruiter calls within one business day', 'A short conversation about what you are looking for.'],
          ['You see roles that fit', 'With the pay shown, before anything is submitted.'],
          ['You decide what happens next', 'We never submit your profile without your say-so.'],
        ],
        side: form('apply'),
      }),
    ],
  });

  return pages;
};
