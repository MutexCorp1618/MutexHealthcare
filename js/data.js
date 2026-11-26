/* Mutex Healthcare Staffing — site settings + sample data.
   Everything in this file is DEMO CONTENT. Update MX.SITE with real contact
   details, and replace the generated MX.JOBS with a real job feed before launch. */
(function () {
  'use strict';
  const MX = (window.MX = window.MX || {});

  /* ---------- Site settings (edit these) ---------- */
  MX.SITE = {
    name: 'Mutex Healthcare Staffing',
    short: 'Mutex',
    phone: '+1 (469) 441-3937',
    phoneHref: 'tel:+14694413937',
    email: 'info@mutexcorp.com',
    address: ['9355 John W. Elliott Dr #25', 'Frisco, TX 75033'],
    mapHref: 'https://www.google.com/maps/search/?api=1&query=9355+John+W.+Elliott+Dr+%2325%2C+Frisco%2C+TX+75033',
    hours: 'Mon–Fri · 8am–6pm CT',
    /* How photos are sized for each screen: 'local' (our own sharp copies in assets/people/480|960|1600/,
       made by build/photo-sizes.py; the clearest option), 'vercel' (Vercel Image Optimization, which
       softens detail), 'netlify' (Netlify Image CDN) or false (always the original file). */
    imageCdn: 'local',
    /* Where forms are sent: our own Vercel Function (api/send-form.js), which emails each submission
       through the company's Microsoft 365 mailbox. Until its settings are added in Vercel it answers
       "not configured" and visitors see the phone number and email instead of a false "sent".
       null = forms send nothing. */
    formEndpoint: '/api/send-form',
    /* Attach résumés (PDF or Word, up to 3 MB) to the email. Larger files are not sent; the email
       names the file instead, so a recruiter can ask for it. */
    formFiles: true,
    demoMode: false, // true = forms show a "demo, nothing was sent" note and the footer shows a demo label
  };

  /* Address of a photo at a given width, through the image service chosen above.
     src is relative to the site root, for example 'assets/people/about.jpg'. With 'vercel', widths must be
     listed in IMAGE_SIZES in build/build.js (Vercel only resizes to the sizes in vercel.json). */
  MX.PHOTO_SIZES = [480, 960, 1600];
  MX.img = (src, w) => {
    const cdn = MX.SITE.imageCdn;
    if (cdn === 'local') {
      // people photos have copies at PHOTO_SIZES; anything wider uses the original (2400 px or more)
      if (!/^assets\/people\/[^/]+\.jpg$/.test(src)) return src;
      const size = MX.PHOTO_SIZES.find((s) => s >= w);
      const v = MX.PHOTO_V && MX.PHOTO_V[src.slice(14, -4)];  // fingerprint from js/photo-versions.js
      return (size ? src.replace('assets/people/', `assets/people/${size}/`) : src) + (v ? `?v=${v}` : '');
    }
    if (cdn === 'vercel') return `/_vercel/image?url=${encodeURIComponent('/' + src)}&w=${w}&q=85`;
    if (cdn === 'netlify' || cdn === true) return `/.netlify/images?url=/${src}&w=${w}&fm=avif&q=60`;
    return src;
  };

  /* Photos for job cards, keyed by 'City, ST'. The list lives in js/city-photos.js (loaded after this
     file); any city missing from it gets a drawn scene instead. */
  MX.CITY_PHOTOS = {};

  /* Headline numbers in the dark band on the home page, left to right.
     null = count it from the job board (rounded down, with a +): jobs, states, cities, roles.
     To show a company figure instead, replace a null with your own number and labels, for example:
       { value: 5000, plus: true, facility: 'facilities served', clinician: 'facilities we work with' }
     Only put figures here that are true for the company. */
  MX.HOME_STATS = [null, null, null,
    { value: 2500, plus: true, facility: 'clinicians in our talent network', clinician: 'clinicians in our talent network' }];

  /* ---------- Specialties ---------- */
  MX.SPECIALTIES = [
    { id: 'nursing', slug: 'nursing', name: 'Nursing', icon: 'heartPulse', blurb: 'Med-surg to ICU, ER to L&D. Roles matched to your license, your unit experience and the schedule you actually want.' },
    { id: 'allied', slug: 'allied-health', name: 'Allied Health', icon: 'flask', blurb: 'Respiratory, lab, surgical tech and more. The specialists every care team leans on, placed where that skill is valued.' },
    { id: 'therapy', slug: 'therapy', name: 'Therapy', icon: 'activity', blurb: 'PT, OT and SLP assignments across outpatient clinics, rehab units, home health and long-term care.' },
    { id: 'imaging', slug: 'radiology', name: 'Radiology & Imaging', icon: 'scan', blurb: 'CT, MRI, ultrasound, X-ray and cath lab techs for departments that cannot afford a gap in the schedule.' },
    { id: 'pharmacy', slug: 'pharmacy', name: 'Pharmacy', icon: 'pill', blurb: 'Hospital pharmacists and technicians, contract or permanent, in roles built around your goals.' },
    { id: 'behavioral', slug: 'behavioral-health', name: 'Behavioral Health', icon: 'smile', blurb: 'Psych nurses, social workers and behavioral techs for inpatient units, clinics and community programs.' },
    { id: 'schools', slug: 'federal-schools', name: 'Federal & Schools', icon: 'cap', blurb: 'School districts, corrections and public health. Mission-driven settings with calendars you can plan a life around.' },
    { id: 'hit', slug: 'healthcare-it', name: 'Healthcare IT', icon: 'monitor', blurb: 'EHR analysts, informatics specialists and trainers who keep clinical systems running on go-live day and after.' },
  ];

  /* ---------- Professions ---------- */
  MX.GROUPS = [
    { id: 'rn', name: 'Registered Nurse' },
    { id: 'lpn', name: 'LPN / LVN' },
    { id: 'cna', name: 'Nursing Assistant' },
    { id: 'pt', name: 'PT / PTA' },
    { id: 'ot', name: 'OT / COTA' },
    { id: 'slp', name: 'Speech-Language Pathology' },
    { id: 'rt', name: 'Respiratory Therapy' },
    { id: 'lab', name: 'Laboratory' },
    { id: 'surg', name: 'Surgical Services' },
    { id: 'ma', name: 'Medical Assistant' },
    { id: 'imaging', name: 'Imaging / Cath Lab' },
    { id: 'pharmacy', name: 'Pharmacy' },
    { id: 'social', name: 'Social Work & Psychology' },
    { id: 'hit', name: 'Healthcare IT' },
  ];

  /* title, specialty, profession, min $/hr, max $/hr, weight */
  const ROLES = [
    ['Registered Nurse – ICU', 'nursing', 'rn', 62, 92, 10],
    ['Registered Nurse – Med-Surg', 'nursing', 'rn', 52, 78, 12],
    ['Registered Nurse – Emergency', 'nursing', 'rn', 60, 88, 9],
    ['Registered Nurse – Labor & Delivery', 'nursing', 'rn', 60, 90, 6],
    ['Registered Nurse – Operating Room', 'nursing', 'rn', 62, 92, 6],
    ['Registered Nurse – Telemetry', 'nursing', 'rn', 54, 80, 8],
    ['Registered Nurse – Home Health', 'nursing', 'rn', 50, 80, 5],
    ['LPN / LVN – Long-Term Care', 'nursing', 'lpn', 32, 46, 7],
    ['Certified Nursing Assistant', 'nursing', 'cna', 20, 28, 5],
    ['Respiratory Therapist', 'allied', 'rt', 44, 66, 6],
    ['Surgical Technologist', 'allied', 'surg', 40, 62, 5],
    ['Sterile Processing Technician', 'allied', 'surg', 28, 42, 3],
    ['Medical Laboratory Scientist', 'allied', 'lab', 42, 62, 4],
    ['Phlebotomist', 'allied', 'lab', 22, 30, 3],
    ['Certified Medical Assistant', 'allied', 'ma', 22, 30, 4],
    ['Physical Therapist', 'therapy', 'pt', 52, 70, 7],
    ['Physical Therapist Assistant', 'therapy', 'pt', 34, 46, 4],
    ['Occupational Therapist', 'therapy', 'ot', 50, 68, 6],
    ['Certified Occupational Therapy Assistant', 'therapy', 'ot', 32, 44, 3],
    ['Speech-Language Pathologist', 'therapy', 'slp', 52, 70, 6],
    ['CT Technologist', 'imaging', 'imaging', 56, 82, 5],
    ['MRI Technologist', 'imaging', 'imaging', 58, 84, 4],
    ['X-Ray Technologist', 'imaging', 'imaging', 44, 64, 4],
    ['Ultrasound Sonographer', 'imaging', 'imaging', 56, 80, 4],
    ['Cath Lab Technologist', 'imaging', 'imaging', 62, 90, 3],
    ['Pharmacist – Hospital', 'pharmacy', 'pharmacy', 66, 84, 3],
    ['Pharmacy Technician', 'pharmacy', 'pharmacy', 24, 34, 3],
    ['Psychiatric Registered Nurse', 'behavioral', 'rn', 56, 82, 4],
    ['Licensed Clinical Social Worker', 'behavioral', 'social', 40, 58, 3],
    ['Behavioral Health Technician', 'behavioral', 'social', 22, 32, 3],
    ['School Nurse (RN)', 'schools', 'rn', 40, 56, 3],
    ['School Speech-Language Pathologist', 'schools', 'slp', 48, 66, 3],
    ['School Psychologist', 'schools', 'social', 50, 70, 2],
    ['Correctional Nurse (RN)', 'schools', 'rn', 54, 78, 2],
    ['Epic Analyst', 'hit', 'hit', 58, 88, 2],
    ['Clinical Informatics Specialist', 'hit', 'hit', 54, 80, 2],
    ['EHR Trainer', 'hit', 'hit', 44, 64, 2],
  ].map(([title, specialty, group, min, max, weight]) => ({ title, specialty, group, min, max, weight }));
  MX.ROLES = ROLES;

  /* code, name, cities, weight */
  const STATES = [
    ['AL', 'Alabama', ['Birmingham', 'Huntsville'], 2], ['AK', 'Alaska', ['Anchorage', 'Fairbanks'], 2],
    ['AZ', 'Arizona', ['Phoenix', 'Tucson', 'Flagstaff'], 4], ['AR', 'Arkansas', ['Little Rock', 'Fayetteville'], 2],
    ['CA', 'California', ['Los Angeles', 'San Diego', 'Sacramento', 'San Jose', 'Fresno'], 11],
    ['CO', 'Colorado', ['Denver', 'Colorado Springs', 'Fort Collins'], 4], ['CT', 'Connecticut', ['Hartford', 'New Haven'], 2],
    ['DE', 'Delaware', ['Wilmington', 'Dover'], 1], ['FL', 'Florida', ['Miami', 'Orlando', 'Tampa', 'Jacksonville'], 7],
    ['GA', 'Georgia', ['Atlanta', 'Savannah', 'Augusta'], 5], ['HI', 'Hawaii', ['Honolulu', 'Hilo'], 2],
    ['ID', 'Idaho', ['Boise', "Coeur d'Alene"], 2], ['IL', 'Illinois', ['Chicago', 'Springfield', 'Peoria'], 5],
    ['IN', 'Indiana', ['Indianapolis', 'Fort Wayne'], 3], ['IA', 'Iowa', ['Des Moines', 'Cedar Rapids'], 2],
    ['KS', 'Kansas', ['Wichita', 'Topeka'], 2], ['KY', 'Kentucky', ['Louisville', 'Lexington'], 3],
    ['LA', 'Louisiana', ['New Orleans', 'Baton Rouge', 'Shreveport'], 3], ['ME', 'Maine', ['Portland', 'Bangor'], 3],
    ['MD', 'Maryland', ['Baltimore', 'Annapolis'], 3], ['MA', 'Massachusetts', ['Boston', 'Worcester', 'Pittsfield'], 5],
    ['MI', 'Michigan', ['Detroit', 'Grand Rapids', 'Ann Arbor'], 4], ['MN', 'Minnesota', ['Minneapolis', 'Rochester', 'Duluth'], 4],
    ['MS', 'Mississippi', ['Jackson', 'Gulfport'], 2], ['MO', 'Missouri', ['St. Louis', 'Kansas City', 'Springfield'], 3],
    ['MT', 'Montana', ['Billings', 'Missoula'], 2], ['NE', 'Nebraska', ['Omaha', 'Lincoln'], 2],
    ['NV', 'Nevada', ['Las Vegas', 'Reno'], 3], ['NH', 'New Hampshire', ['Manchester', 'Concord'], 3],
    ['NJ', 'New Jersey', ['Newark', 'Trenton'], 4], ['NM', 'New Mexico', ['Albuquerque', 'Santa Fe'], 2],
    ['NY', 'New York', ['New York', 'Buffalo', 'Albany', 'Rochester'], 8], ['NC', 'North Carolina', ['Charlotte', 'Raleigh', 'Asheville'], 5],
    ['ND', 'North Dakota', ['Fargo', 'Bismarck'], 1], ['OH', 'Ohio', ['Columbus', 'Cleveland', 'Cincinnati'], 5],
    ['OK', 'Oklahoma', ['Oklahoma City', 'Tulsa'], 2], ['OR', 'Oregon', ['Portland', 'Eugene', 'Bend'], 4],
    ['PA', 'Pennsylvania', ['Philadelphia', 'Pittsburgh', 'Harrisburg'], 6], ['RI', 'Rhode Island', ['Providence', 'Newport'], 1],
    ['SC', 'South Carolina', ['Charleston', 'Columbia'], 3], ['SD', 'South Dakota', ['Sioux Falls', 'Rapid City'], 1],
    ['TN', 'Tennessee', ['Nashville', 'Memphis', 'Knoxville'], 4], ['TX', 'Texas', ['Houston', 'Dallas', 'Austin', 'San Antonio', 'El Paso'], 9],
    ['UT', 'Utah', ['Salt Lake City', 'Provo'], 2], ['VT', 'Vermont', ['Burlington', 'Montpelier'], 1],
    ['VA', 'Virginia', ['Richmond', 'Virginia Beach', 'Roanoke'], 5], ['WA', 'Washington', ['Seattle', 'Spokane', 'Tacoma'], 5],
    ['WV', 'West Virginia', ['Charleston', 'Morgantown'], 2], ['WI', 'Wisconsin', ['Milwaukee', 'Madison', 'Green Bay'], 3],
    ['WY', 'Wyoming', ['Cheyenne', 'Casper'], 1],
  ].map(([code, name, cities, weight]) => ({ code, name, cities, weight }));
  MX.STATES = STATES;
  MX.stateName = (code) => (STATES.find((s) => s.code === code) || {}).name || code;

  MX.JOB_TYPES = ['Travel Contract', 'Local Contract', 'Per Diem', 'Permanent'];
  MX.SHIFTS = ['Days', 'Nights', 'Evenings', 'Rotating'];

  const SETTINGS = {
    nursing: ['Acute care hospital', 'Community hospital', 'Level II trauma center', 'Skilled nursing facility', 'Critical access hospital', 'Home health agency'],
    allied: ['Acute care hospital', 'Community hospital', 'Outpatient surgery center', 'Reference laboratory', 'Multi-specialty clinic'],
    therapy: ['Outpatient clinic', 'Inpatient rehab unit', 'Skilled nursing facility', 'Home health agency', 'Acute care hospital'],
    imaging: ['Acute care hospital', 'Outpatient imaging center', 'Heart & vascular institute', 'Community hospital'],
    pharmacy: ['Acute care hospital', 'Health-system pharmacy', 'Long-term care pharmacy'],
    behavioral: ['Inpatient behavioral health unit', 'Community mental health center', 'Residential treatment program'],
    schools: ['Public school district', 'County corrections facility', 'State public health agency'],
    hit: ['Regional health system', 'Academic medical center', 'Multi-hospital network'],
  };

  /* ---------- Deterministic sample job generator ---------- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rnd = mulberry32(73021);
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  function weighted(items, w) {
    const total = items.reduce((s, i) => s + w(i), 0);
    let r = rnd() * total;
    for (const i of items) { r -= w(i); if (r <= 0) return i; }
    return items[items.length - 1];
  }

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + ((8 - today.getDay()) % 7 || 7));
  const HIGH_COST = { CA: 1.1, NY: 1.08, MA: 1.07, WA: 1.06, HI: 1.08, AK: 1.08, NJ: 1.04, OR: 1.04, CT: 1.04 };
  const TYPE_W = [['Travel Contract', 58], ['Local Contract', 12], ['Per Diem', 12], ['Permanent', 18]];
  const SHIFT_W = [['Days', 46], ['Nights', 28], ['Evenings', 12], ['Rotating', 14]];
  const TOTAL = 1264;

  const jobs = [];
  for (let i = 0; i < TOTAL; i++) {
    const role = weighted(ROLES, (r) => r.weight);
    const st = weighted(STATES, (s) => s.weight);
    const dayOnly = role.specialty === 'schools' || role.specialty === 'hit';
    let type = weighted(TYPE_W, (t) => t[1])[0];
    if (role.specialty === 'schools' && type === 'Travel Contract') type = 'Local Contract';
    if (role.specialty === 'hit' && type === 'Per Diem') type = 'Local Contract';
    const shift = dayOnly ? 'Days' : weighted(SHIFT_W, (s) => s[1])[0];
    const hours = type === 'Per Diem' ? pick([12, 24, 24, 36]) : dayOnly ? 40 : pick([36, 36, 40, 40, 40, 48]);
    let rate = role.min + rnd() * (role.max - role.min);
    rate *= HIGH_COST[st.code] || 1;
    if (shift === 'Nights') rate *= 1.06;
    if (type === 'Permanent') rate *= 0.8;
    if (type === 'Per Diem') rate *= 1.05;
    rate = Math.round(rate * 2) / 2;
    const weeks = type === 'Travel Contract' ? pick([8, 13, 13, 13, 26]) : type === 'Local Contract' ? pick([13, 26, 26]) : null;
    const start = new Date(nextMonday); start.setDate(start.getDate() + 7 * Math.floor(rnd() * 7));
    const postedDays = Math.floor(Math.pow(rnd(), 1.6) * 15);
    jobs.push({
      id: 'MHS-' + (48213 - i),
      title: role.title, specialty: role.specialty, group: role.group,
      city: pick(st.cities), state: st.code,
      type, shift, hours, rate, weeks, start, postedDays,
      setting: pick(SETTINGS[role.specialty]),
      weekly: Math.round((rate * hours) / 10) * 10,
      salary: type === 'Permanent' ? Math.round((rate * 2080) / 1000) * 1000 : null,
    });
  }
  jobs.sort((a, b) => a.postedDays - b.postedDays || (a.id < b.id ? 1 : -1));
  MX.JOBS = jobs;

  /* ---------- Formatting helpers ---------- */
  MX.money = (n) => '$' + Math.round(n).toLocaleString('en-US');
  MX.rate = (n) => '$' + (Number.isInteger(n) ? n : n.toFixed(2));
  MX.kWeek = (n) => '$' + (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  MX.fmtDate = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  MX.fmtDateLong = (d) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  MX.posted = (n) => (n === 0 ? 'Posted today' : n === 1 ? 'Posted yesterday' : 'Posted ' + n + ' days ago');
  MX.specialtyName = (id) => (MX.SPECIALTIES.find((s) => s.id === id) || {}).name || id;
  MX.groupName = (id) => (MX.GROUPS.find((g) => g.id === id) || {}).name || id;
  MX.nextMonday = nextMonday;

  /* ---------- Job detail copy (generated from the profession) ---------- */
  const DETAIL = {
    rn: {
      duties: ['Deliver direct patient care for your unit’s typical census and acuity', 'Assess, plan and document care in the facility’s EHR', 'Work alongside physicians, charge nurses and ancillary teams through every handoff'],
      reqs: ['Active RN license for this state, or a compact (eNLC) license where accepted', 'BLS required; ACLS or specialty certification as the unit calls for', 'Two or more years of recent experience in this specialty'],
    },
    lpn: {
      duties: ['Provide bedside care and medication administration under RN direction', 'Monitor residents and escalate changes in condition early', 'Keep charting accurate and current each shift'],
      reqs: ['Active LPN / LVN license for this state', 'BLS certification', 'One or more years of long-term care or sub-acute experience'],
    },
    cna: {
      duties: ['Support patients with daily living, mobility and comfort', 'Take and record vitals, intake and output', 'Keep rooms safe, stocked and ready'],
      reqs: ['Active CNA certification for this state', 'BLS certification', 'Six months or more of recent experience'],
    },
    pt: {
      duties: ['Evaluate patients and build individualized plans of care', 'Deliver hands-on treatment and track functional progress', 'Coordinate discharge planning with the wider care team'],
      reqs: ['Active state license for your discipline', 'BLS certification', 'One or more years in a comparable setting'],
    },
    ot: {
      duties: ['Assess function and design treatment around daily living goals', 'Recommend adaptive equipment and train patients and families', 'Document progress toward measurable outcomes'],
      reqs: ['Active state license (NBCOT certification where required)', 'BLS certification', 'One or more years in a comparable setting'],
    },
    slp: {
      duties: ['Evaluate and treat speech, language, cognitive and swallowing disorders', 'Collaborate with families, teachers or care teams on shared goals', 'Maintain timely, compliant documentation'],
      reqs: ['Active state SLP license; ASHA CCC-SLP preferred', 'BLS certification where the setting requires it', 'Clinical fellows considered for select roles'],
    },
    rt: {
      duties: ['Manage ventilators, airway care and oxygen therapy', 'Respond to rapid responses and codes as part of the team', 'Perform and interpret ABGs and bedside diagnostics'],
      reqs: ['RRT credential and active state license', 'BLS and ACLS; NRP or PALS for specialty units', 'Two or more years of acute care experience'],
    },
    lab: {
      duties: ['Perform and verify testing across core lab benches', 'Maintain instruments, QC and regulatory documentation', 'Communicate critical values promptly'],
      reqs: ['ASCP or equivalent certification where the role requires it', 'State license where applicable', 'One or more years of recent bench or draw experience'],
    },
    surg: {
      duties: ['Prepare rooms, instruments and sterile fields', 'Anticipate the surgeon’s needs through each case', 'Follow count, labeling and infection-prevention standards without exception'],
      reqs: ['National certification for your discipline', 'BLS certification', 'Two or more years across multiple service lines'],
    },
    ma: {
      duties: ['Room patients, take vitals and update histories', 'Assist providers with exams and minor procedures', 'Handle scheduling, refills and patient follow-up'],
      reqs: ['CMA or RMA certification', 'BLS certification', 'One or more years in an outpatient clinic'],
    },
    imaging: {
      duties: ['Perform diagnostic studies to protocol with consistent image quality', 'Screen and position patients safely', 'Coordinate with radiologists and referring teams on urgent reads'],
      reqs: ['ARRT (or ARDMS / RCIS) registry for your modality', 'State license where applicable; BLS certification', 'Two or more years of recent experience in this modality'],
    },
    pharmacy: {
      duties: ['Verify and prepare medication orders accurately and on time', 'Support clinical teams with dosing and interaction questions', 'Maintain inventory, compounding and regulatory standards'],
      reqs: ['Active state license or registration for your role', 'Hospital or health-system experience', 'IV / sterile compounding experience preferred'],
    },
    social: {
      duties: ['Assess needs and build care or support plans', 'Lead individual or group interventions', 'Coordinate services with families, schools or community partners'],
      reqs: ['Active state license or certification for your discipline', 'BLS and crisis-intervention training where required', 'One or more years in a comparable setting'],
    },
    hit: {
      duties: ['Build, test and support clinical application workflows', 'Partner with clinical leaders to translate needs into system changes', 'Provide go-live and at-the-elbow support'],
      reqs: ['Current certification in the relevant EHR module, or equivalent experience', 'Three or more years in healthcare IT', 'Clinical background is a plus'],
    },
  };
  MX.jobDetail = function (job) {
    const d = DETAIL[job.group];
    const an = (w) => (/^([aeiou]|LPN|MRI|X-Ray)/i.test(w) ? 'an' : 'a');
    const setting = job.setting.toLowerCase();
    const role = job.title.replace(/ – (.+)$/, ' ($1)');
    const kind = {
      'Travel Contract': `${job.weeks}-week travel contract`,
      'Local Contract': `${job.weeks}-week local contract`,
      'Per Diem': 'per diem role',
      Permanent: 'permanent, direct-hire role',
    }[job.type];
    const A = an(setting) === 'an' ? 'An' : 'A';
    return {
      summary: `${A} ${setting} in ${job.city}, ${MX.stateName(job.state)} is hiring ${an(role)} ${role} for ${an(kind)} ${kind} on ${{ Days: 'day', Nights: 'night', Evenings: 'evening', Rotating: 'rotating' }[job.shift]} shifts. Your Mutex recruiter handles credentialing and stays with you from first call to last shift.`,
      duties: d.duties,
      reqs: d.reqs,
      perks: job.type === 'Permanent'
        ? ['Direct hire with the facility’s full benefits package', 'Interview prep and offer support from your recruiter', 'No cost to you, ever']
        : ['Weekly pay with the rate shown up front', 'Credentialing and licensing guidance handled with you', 'One recruiter and a clinical contact for the whole assignment'],
    };
  };
})();
