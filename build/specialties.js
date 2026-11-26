/* Copy for the eight specialties. Used twice: once for clinicians (specialty-*.html)
   and once for facilities (staffing-*.html). Ids match MX.SPECIALTIES in js/data.js. */
'use strict';

module.exports = {
  nursing: {
    facIntro: [
      'Nursing is where most staffing requests start, and where a gap is felt first. We place registered nurses, LPNs and nursing assistants on travel, local, per diem and permanent terms.',
      'Med-surg, telemetry, ICU, emergency, labor and delivery, operating room, home health and long-term care: unit experience is matched to your unit, and licenses, BLS, ACLS and specialty certifications are verified during onboarding.',
      'Every nurse arrives with a complete credential file, and one account lead stays with you from the request to the last shift.',
    ],
    slug: 'nursing', short: 'nursing',
    seekerTitle: 'Nursing jobs matched to <em>your unit and your life.</em>',
    seekerLead: 'Med-surg to ICU, ER to L&D. Travel, local, per diem and permanent roles with the pay on every posting and a recruiter who knows your specialty.',
    facTitle: 'Nurse staffing, <em>unit by unit.</em>',
    facLead: 'Registered nurses, LPNs and nursing assistants for every unit, credentialed and ready for your review, usually within days.',
    units: ['ICU and critical care', 'Emergency', 'Med-surg', 'Telemetry', 'Labor and delivery', 'Operating room', 'Home health', 'Long-term care'],
    seekerWhy: [
      ['dollar', 'See the rate first', 'Hourly pay and a weekly estimate sit on every nursing posting, so you can compare units and cities before you pick up the phone.'],
      ['users', 'A recruiter who speaks nursing', 'Ratios, float policy, charting system, scheduling. We ask the unit the questions you would, and give you the answers straight.'],
      ['shield', 'Licensing without the maze', 'Compact or single state, we map out what you need for the state you want and track every expiry date for you.'],
    ],
    facWhy: [
      ['zap', 'Coverage in days', 'Tell us the unit, the census and the dates. You get a vetted shortlist to review, usually within days.'],
      ['fileCheck', 'Files ready for survey', 'Licenses verified at the source, certifications current and health records complete before a nurse steps on the floor.'],
      ['layers', 'Every engagement type', 'Travel contracts for seasonal peaks, per diem for call-outs and permanent hires for the roles you want to keep.'],
    ],
    faq: [
      ['How much experience do I need for a travel nursing contract?', 'Most facilities ask for one to two years of recent experience in the specialty you are applying for, and some high-acuity units ask for more. Your recruiter tells you up front which roles fit your background.'],
      ['Can I work in a state where I am not licensed yet?', 'Often, yes. If you hold a compact license, many states are open to you right away. For the rest, we walk you through the application and the timeline before you commit to a start date.'],
      ['Which certifications should I have ready?', 'BLS is required almost everywhere. ACLS, PALS, NRP or a specialty certification depends on the unit. Keep digital copies handy and we handle the rest of the file.'],
    ],
  },
  allied: {
    facIntro: [
      'Allied health teams are small and do critical work, so one vacancy can slow a whole department. We place respiratory therapists, laboratory scientists, surgical and sterile processing technicians, phlebotomists and medical assistants.',
      'National credentials such as RRT and ASCP, and state licenses where they apply, are verified at the source during onboarding.',
      'Every clinician arrives with a complete credential file, and one account lead covers every unit and site on your request.',
    ],
    slug: 'allied-health', short: 'allied health',
    seekerTitle: 'Allied health jobs where <em>your skill is the point.</em>',
    seekerLead: 'Respiratory, laboratory, surgical and clinic roles with facilities that know how much rides on your work.',
    facTitle: 'Allied health staffing that <em>keeps throughput moving.</em>',
    facLead: 'Respiratory therapists, laboratory scientists, surgical and sterile processing technicians, placed where a single vacancy slows everything down.',
    units: ['Respiratory therapy', 'Surgical technology', 'Sterile processing', 'Clinical laboratory', 'Phlebotomy', 'Medical assisting'],
    seekerWhy: [
      ['dollar', 'Pay shown on every role', 'Respiratory, lab, surgical or clinic: the hourly rate and weekly estimate are on the posting, not hidden behind a call.'],
      ['search', 'Roles that use your skills', 'We match on the equipment, case mix and service lines you know, so day one feels familiar.'],
      ['calendar', 'Your choice of schedule', 'Thirteen-week contracts, local assignments close to home, or a permanent seat when you find the right team.'],
    ],
    facWhy: [
      ['activity', 'The specialists behind every recovery', 'Respiratory therapists, laboratory scientists, surgical and sterile processing technicians who keep the day on schedule.'],
      ['fileCheck', 'Registry and license verified', 'National certifications and state licenses confirmed at the source and monitored for the whole assignment.'],
      ['zap', 'Cover for hard-to-fill shifts', 'Nights, weekends and call rotations filled by clinicians who have done them before.'],
    ],
    faq: [
      ['Which allied health roles do you place?', 'Respiratory therapists, surgical technologists, sterile processing technicians, medical laboratory scientists, phlebotomists and certified medical assistants, with more added as facilities ask for them.'],
      ['Do I need a national certification?', 'For most roles, yes: for example the RRT credential for respiratory therapy or ASCP certification for laboratory science. Some states also require a state license. Your recruiter confirms exactly what each role needs.'],
      ['Are there local contracts, or only travel?', 'Both. Many allied roles are available as local contracts or per diem as well as travel assignments, and some facilities hire permanently.'],
    ],
  },
  therapy: {
    facIntro: [
      'Therapy vacancies limit how many patients you can take. We place physical, occupational and speech therapists and their assistants, for a single leave of absence or a whole department.',
      'Outpatient, inpatient rehab, skilled nursing, home health and schools: state licenses are verified, and supervision requirements are matched for assistants before the first visit.',
      'If the same gap keeps coming back, our contract therapy program can run the department for you.',
    ],
    slug: 'therapy', short: 'therapy',
    seekerTitle: 'Therapy jobs with <em>room to treat well.</em>',
    seekerLead: 'PT, OT and SLP assignments in outpatient clinics, rehab units, home health, skilled nursing and schools.',
    facTitle: 'Therapy staffing for <em>one seat or a whole department.</em>',
    facLead: 'Physical, occupational and speech therapists and assistants, for a single leave of absence or a fully managed rehab program.',
    units: ['Physical therapy', 'Occupational therapy', 'Speech-language pathology', 'PTA and COTA', 'Outpatient and inpatient rehab', 'Home health and skilled nursing'],
    seekerWhy: [
      ['heart', 'Caseloads you can do well', 'We ask about productivity expectations, documentation time and mentorship before you have to.'],
      ['building', 'Every setting', 'Outpatient clinics, inpatient rehab, skilled nursing, home health and schools, across all 50 states.'],
      ['cap', 'New graduates welcome', 'Selected assignments offer mentorship for new graduates and clinical fellows. Ask your recruiter which ones.'],
    ],
    facWhy: [
      ['activity', 'PT, OT and SLP on one request', 'Therapists and assistants for a single leave of absence or an entire department.'],
      ['layers', 'Or let us run the department', 'Our contract therapy program takes on staffing, scheduling and documentation for your rehab team.'],
      ['fileCheck', 'Compliant from the first visit', 'State licenses and certifications verified, with supervision requirements matched for assistants.'],
    ],
    faq: [
      ['Do you place new graduate therapists?', 'Yes, on assignments where the facility offers supervision or mentorship. Tell your recruiter you are a new graduate or clinical fellow and we will show you the roles that fit.'],
      ['Which settings can I work in?', 'Outpatient clinics, inpatient rehab units, skilled nursing facilities, home health agencies and schools. You choose the settings you want to see.'],
      ['How long are therapy contracts?', 'Most travel and local contracts run about thirteen weeks, and school-based roles usually follow the academic calendar. Extensions are common when both sides are happy.'],
    ],
  },
  imaging: {
    facIntro: [
      'Imaging technologists are hard to replace at short notice, and an empty scanner means rescheduled studies. We place technologists and sonographers across every modality.',
      'CT, MRI, X-ray, ultrasound and cath lab: registry status (ARRT, ARDMS or RCIS) and any state permit are verified during onboarding, and call expectations are agreed before the start date.',
      'Every technologist arrives with a complete credential file, and one account lead handles extensions and replacements.',
    ],
    slug: 'radiology', short: 'imaging',
    seekerTitle: 'Imaging jobs matched <em>by modality.</em>',
    seekerLead: 'CT, MRI, ultrasound, X-ray and cath lab roles with the call schedule and pay terms spelled out.',
    facTitle: 'Imaging staffing that <em>keeps the schedule full.</em>',
    facLead: 'Registered technologists and sonographers for vacancies, leave and new equipment, across every modality.',
    units: ['CT', 'MRI', 'X-ray', 'Ultrasound', 'Cath lab', 'Interventional radiology'],
    seekerWhy: [
      ['scan', 'Matched by modality', 'CT, MRI, ultrasound, X-ray or cath lab: we match on the scanners, protocols and call schedule you know.'],
      ['dollar', 'Call pay made clear', 'On-call, callback and overtime terms are spelled out before you accept, alongside the hourly rate.'],
      ['shield', 'Registry and license help', 'We track registry renewals and guide you through state licensing where it applies.'],
    ],
    facWhy: [
      ['scan', 'No gaps in the schedule', 'Cover for leave, vacancies and new equipment go-lives, so studies are not rescheduled.'],
      ['award', 'Registered technologists', 'Registry status and state licenses verified at the source for every modality.'],
      ['clock', 'Nights, weekends and call', 'Technologists used to carrying call and working lean off-shifts.'],
    ],
    faq: [
      ['Which imaging modalities do you staff?', 'CT, MRI, X-ray, ultrasound and cath lab, plus interventional roles as facilities ask for them.'],
      ['Do I need a state license as well as my registry?', 'It depends on the state. Some require a separate state license for certain modalities and some do not. We tell you what the state needs and how long it usually takes.'],
      ['Is on-call required?', 'Many hospital imaging roles include call. The call schedule and pay terms are listed for you before you decide.'],
    ],
  },
  pharmacy: {
    facIntro: [
      'A pharmacy vacancy shows up quickly in turnaround times. We place hospital and clinical pharmacists and pharmacy technicians, on contract or permanently.',
      'Inpatient, clinical, sterile compounding and long-term care: pharmacist licenses and technician registrations are confirmed with the state board before day one.',
      'One account lead covers leave, vacancies, system conversions and seasonal volume for you.',
    ],
    slug: 'pharmacy', short: 'pharmacy',
    seekerTitle: 'Pharmacy jobs, <em>contract or permanent.</em>',
    seekerLead: 'Hospital and health-system roles for pharmacists and technicians, built around the goals you set.',
    facTitle: 'Pharmacy staffing <em>without the gap.</em>',
    facLead: 'Licensed pharmacists and registered technicians for inpatient, clinical and long-term care pharmacy.',
    units: ['Hospital pharmacists', 'Clinical pharmacists', 'Pharmacy technicians', 'IV and sterile compounding', 'Long-term care pharmacy', 'Health-system pharmacy'],
    seekerWhy: [
      ['pill', 'Hospital and health-system roles', 'Inpatient, clinical and long-term care pharmacy positions for pharmacists and technicians.'],
      ['briefcase', 'Contract or permanent', 'Short-term cover, a longer contract or a direct hire. Tell us the goal and we search to it.'],
      ['dollar', 'Rate shown up front', 'Hourly pay, or salary for permanent roles, is on every posting before you apply.'],
    ],
    facWhy: [
      ['pill', 'Cover without compromise', 'Pharmacists and technicians for leave, vacancies, system conversions and seasonal volume.'],
      ['shield', 'Licensure verified', 'Pharmacist licenses and technician registrations confirmed with the state board before day one.'],
      ['flask', 'Sterile compounding experience', 'Technicians and pharmacists experienced in IV rooms and current compounding standards.'],
    ],
    faq: [
      ['Do you place both pharmacists and technicians?', 'Yes. We place hospital and clinical pharmacists and pharmacy technicians, including those with sterile compounding experience.'],
      ['Are the roles retail or hospital?', 'Our focus is hospital, health-system and long-term care pharmacy. If you are looking for something else, tell us and we will let you know when it comes up.'],
      ['Can I move my license to another state?', 'Pharmacist license transfer is handled state by state. We explain the steps for the state you want and build the timeline into your start date.'],
    ],
  },
  behavioral: {
    facIntro: [
      'Behavioral health depends on continuity, and turnover is felt by patients first. We place psychiatric nurses, licensed social workers and behavioral health technicians who choose this work.',
      'Inpatient units, community programs and residential treatment: licenses, crisis-intervention training and background requirements are complete before the start date.',
      'Longer contracts and early extension planning keep the same faces on your unit.',
    ],
    slug: 'behavioral-health', short: 'behavioral health',
    seekerTitle: 'Behavioral health jobs with <em>the support to do them.</em>',
    seekerLead: 'Psychiatric nursing, social work and behavioral health technician roles, in settings described honestly before you apply.',
    facTitle: 'Behavioral health staffing <em>built on continuity.</em>',
    facLead: 'Psychiatric nurses, licensed social workers and behavioral health technicians for inpatient, community and residential programs.',
    units: ['Psychiatric nursing', 'Clinical social work', 'Behavioral health technicians', 'Inpatient units', 'Community programs', 'Residential treatment'],
    seekerWhy: [
      ['smile', 'Settings that suit you', 'Inpatient units, community mental health centers and residential programs, with the patient population described honestly.'],
      ['shield', 'Safety asked up front', 'Staffing ratios, security support and de-escalation training are part of our intake with every facility.'],
      ['heart', 'Support that lasts the assignment', 'Your recruiter checks in through the whole contract, not only at the start.'],
    ],
    facWhy: [
      ['smile', 'Clinicians who choose this work', 'Psychiatric nurses, licensed social workers and behavioral health technicians with recent experience in your setting.'],
      ['shield', 'Training verified', 'Licenses, crisis-intervention training and background requirements complete before the start date.'],
      ['users', 'Steady teams', 'Longer contracts and extensions that give your patients continuity.'],
    ],
    faq: [
      ['Which behavioral health roles do you fill?', 'Psychiatric registered nurses, licensed clinical social workers and behavioral health technicians, across inpatient, community and residential settings.'],
      ['Do I need crisis-intervention training?', 'Most facilities require a current crisis-intervention or de-escalation certification. If yours has lapsed, we tell you what the facility accepts and how to renew.'],
      ['Are permanent roles available?', 'Yes. Alongside contracts, many behavioral health employers hire permanently through us.'],
    ],
  },
  schools: {
    facIntro: [
      'Schools and public agencies work to calendars and clearance rules that ordinary staffing ignores. We place school nurses, speech-language pathologists, school psychologists and correctional health clinicians.',
      'Background checks, fingerprinting and state education credentials are verified before placement, and contracts follow the school year or your fiscal calendar.',
      'One account lead handles renewals, leave cover and summer programs.',
    ],
    slug: 'federal-schools', short: 'federal and school',
    seekerTitle: 'Federal and school jobs with <em>a calendar you can plan around.</em>',
    seekerLead: 'School districts, corrections and public health programs: mission-driven settings with predictable schedules.',
    facTitle: 'Staffing for schools and <em>the public sector.</em>',
    facLead: 'School nurses, speech-language pathologists, psychologists and correctional health clinicians, cleared and credentialed for your setting.',
    units: ['School nursing', 'School-based speech-language pathology', 'School psychology', 'Correctional health', 'Public health programs', 'Government facilities'],
    seekerWhy: [
      ['calendar', 'Calendars you can plan around', 'School-year contracts with predictable hours, breaks and holidays.'],
      ['building', 'Mission-driven settings', 'School districts, corrections and public health programs, where the work reaches whole communities.'],
      ['fileCheck', 'Clearances handled with you', 'Background checks, fingerprinting and any credential the setting needs, mapped out step by step.'],
    ],
    facWhy: [
      ['cap', 'School-year coverage', 'Nurses, speech-language pathologists and school psychologists for full-year contracts or leave cover.'],
      ['shield', 'Clearances complete', 'Background checks, fingerprinting and state education credentials verified before placement.'],
      ['building', 'Ready for public settings', 'Clinicians used to the documentation, security and scheduling realities of public sector work.'],
    ],
    faq: [
      ['How long are school contracts?', 'Most follow the academic year, with some shorter contracts to cover leave. Summer programs come up too.'],
      ['Do school roles need a special credential?', 'Often, yes. Many states require an education credential or certificate in addition to your clinical license. We tell you what the state and the district require.'],
      ['What is different about correctional health?', 'The setting has extra security clearance and orientation steps. Your recruiter explains them, and the timeline, before you apply.'],
    ],
  },
  hit: {
    facIntro: [
      'Clinical systems only work when the people behind them understand care. We place EHR analysts, clinical informatics specialists and trainers for implementations, upgrades and optimization.',
      'Module certifications and hands-on build experience are checked for each role, and we match on your EHR and the stage your project is at.',
      'These roles are screened by recruiters who know technical work as well as clinical work.',
    ],
    slug: 'healthcare-it', short: 'healthcare IT',
    seekerTitle: 'Healthcare IT jobs for people who <em>know the clinic and the system.</em>',
    seekerLead: 'EHR analyst, informatics and training roles on implementations, upgrades and optimization projects.',
    facTitle: 'Healthcare IT staffing for <em>go-live and every day after.</em>',
    facLead: 'EHR analysts, clinical informatics specialists and trainers who keep clinical systems working for the people who use them.',
    units: ['EHR analysts', 'Clinical informatics', 'EHR trainers', 'Go-live support', 'Revenue cycle systems', 'Reporting and data'],
    seekerWhy: [
      ['monitor', 'Projects worth your time', 'Implementations, optimizations and upgrades at health systems that value clinical insight.'],
      ['briefcase', 'Contract or permanent', 'Go-live sprints, longer contracts and permanent roles, remote and on site.'],
      ['sparkles', 'Recruiters who speak tech', 'The people matching you understand technical work as well as clinical work.'],
    ],
    facWhy: [
      ['monitor', 'The team behind the go-live', 'Analysts, informatics specialists and trainers for implementations, upgrades and optimization.'],
      ['users', 'Clinical and technical together', 'People who can sit with a nurse manager and a build team in the same afternoon.'],
      ['sparkles', 'Screened by technical recruiters', 'Our recruiters know technical work, and it shows in how we screen these roles.'],
    ],
    faq: [
      ['Do I need a clinical background?', 'Not always. Analyst and trainer roles vary. A clinical background helps for informatics and at-the-elbow support, and we tell you which roles expect it.'],
      ['Are the roles remote?', 'Some are fully remote, some are on site for go-live periods and some are hybrid. Each posting says which.'],
      ['Do I need a vendor certification?', 'Many analyst roles ask for a current certification in the relevant EHR module, or equivalent hands-on experience. The posting lists what the client needs.'],
    ],
  },
};
