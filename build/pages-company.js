/* Company pages: careers, blog and articles, FAQs, contact and privacy. */
'use strict';

module.exports = (L) => {
  const { hero, cards, split, faq, cta, article, note, raw, form, btn, icon, listCard, contactList } = L;
  const pages = [];

  /* ---------- Careers ---------- */
  pages.push({
    file: 'careers.html', nav: 'about',
    title: 'Careers at Mutex Healthcare Staffing',
    desc: 'Join the team behind the match. Mutex Healthcare Staffing is glad to meet recruiters, credentialing specialists and account managers who care about getting it right.',
    blocks: [
      hero({
        crumbs: [['Company', 'about.html'], ['Careers']],
        eyebrow: 'Work with us',
        title: 'Join the team <em>behind the match.</em>',
        lead: 'Every placement is a promise kept between two people. We are always glad to meet recruiters, credentialing specialists and account managers who care about keeping it.',
        ctas: [btn('Introduce yourself', '#join'), btn('About Mutex', 'about.html', 'ghost')],
      }),
      cards({
        eyebrow: 'How we work', title: 'What it is like here',
        items: [
          ['heart', 'People first', 'Behind every requisition is a patient, and behind every résumé is a life. We make decisions as if both were in the room.'],
          ['search', 'Say it straight', 'Pay on the posting, terms in plain language, and bad news delivered as fast as good news.'],
          ['award', 'Learn the specialty', 'The best recruiters know the units they staff. We give you the time and the training to get there.'],
        ],
      }),
      split({
        id: 'join',
        eyebrow: 'Introduce yourself', title: 'Tell us what you do well',
        paras: ['We hire for teams such as recruiting, credentialing and compliance, account management and operations. If you think you would fit, we would like to hear from you even when nothing is advertised.'],
        checklist: ['Recruiting, by specialty', 'Credentialing and compliance', 'Account management', 'Clinical liaison and operations'],
        side: form('careers'),
      }),
      note('List current internal openings, locations and benefits here once confirmed. Clinician jobs live on the job board, not this page.'),
      cta({
        eyebrow: 'Looking for a clinical role?',
        title: 'Clinician jobs are on <em>the job board.</em>',
        text: 'Nursing, allied health, therapy, imaging, pharmacy and more, with the pay on every posting.',
        ctas: [btn('Search jobs', 'jobs.html'), btn('Join the talent network', 'apply.html', 'outline-light')],
      }),
    ],
  });

  /* ---------- Blog ---------- */
  const posts = [
    {
      file: 'blog-compact-nursing-license.html', tag: 'Licensing', read: '5 min read',
      title: 'How the compact nursing license works for travel nurses',
      excerpt: 'One license, many states. Who qualifies, what it covers and what to do when the state you want is not part of it.',
      html: `
        <p class="article-lead">For a travel nurse, the license decides the map. A multistate license opens a large part of the country at once; a single-state license means planning each move a little further ahead. Here is how to tell which you have, and how to use it.</p>
        <h2>What a compact license is</h2>
        <p>The Nurse Licensure Compact is an agreement between member states. A nurse whose primary state of residence is a member can hold one multistate license and practice in every other member state, in person or by telehealth, without applying for another license.</p>
        <h2>Who qualifies</h2>
        <p>Eligibility follows where you legally live, not where you work. If your home state is a compact member and you meet its requirements, you can apply for a multistate license there. If your home state is not a member, you hold a single-state license and apply to each new state separately.</p>
        <h2>When the state you want is not in the compact</h2>
        <p>You apply to that state's board for a license by endorsement. Expect verification of your existing license, fingerprints, a background check and a fee. Some boards issue a temporary permit while the full license is processed.</p>
        <h2>Three habits that save weeks</h2>
        <ul>
          <li>Apply as soon as you know which state you want. Boards are slowest around graduation season.</li>
          <li>Keep every license number, expiry date and certification card in one folder.</li>
          <li>If you move home, tell your board. Changing your primary state of residence changes which license you hold.</li>
        </ul>
        <p>Membership and rules change, so always confirm the current position with the board of nursing in your home state and the state you plan to work in.</p>`,
    },
    {
      file: 'blog-reading-a-pay-package.html', tag: 'Pay', read: '6 min read',
      title: 'How to read a travel pay package',
      excerpt: 'Hourly rate, stipends, guaranteed hours and overtime: the four lines to check before you compare two offers.',
      html: `
        <p class="article-lead">Two offers with the same weekly total can be very different contracts. Before you compare, break each one into the same four lines.</p>
        <h2>1. The hourly rate</h2>
        <p>This is the taxable pay for each hour you work. It drives your overtime rate, and it is the figure that matters if you ever need to show income. A package with a very low hourly rate and large stipends deserves a second look.</p>
        <h2>2. Stipends</h2>
        <p>Some travel contracts include housing and meal stipends. Whether you can receive them without tax depends on your own circumstances, including whether you keep a tax home. Your recruiter can explain how the package is built, but only a tax professional can advise on your situation.</p>
        <h2>3. Guaranteed hours</h2>
        <p>Ask how many hours a week the contract guarantees and what happens if the facility cancels a shift. A higher rate with no guarantee can pay less than a lower rate with one.</p>
        <h2>4. Overtime, holidays and call</h2>
        <p>Overtime rules, holiday rates, on-call pay and callback minimums vary by facility. If you expect to work extra shifts, these lines can matter more than the headline number.</p>
        <h2>A quick way to compare</h2>
        <ul>
          <li>Work out the weekly gross at the guaranteed hours, not the advertised ones.</li>
          <li>Subtract what housing will really cost you in that city.</li>
          <li>Check the contract length, and whether an extension keeps the same terms.</li>
        </ul>
        <p>If a number is missing from an offer, ask for it in writing. A good agency will not mind.</p>`,
    },
    {
      file: 'blog-first-travel-assignment.html', tag: 'Getting started', read: '5 min read',
      title: 'Your first travel assignment: a checklist',
      excerpt: 'What to settle before you accept, what to pack in your document folder and what to ask on day one.',
      html: `
        <p class="article-lead">The first contract is the one with the most unknowns. Most of them disappear if you settle a few things in the right order.</p>
        <h2>Before you accept</h2>
        <ul>
          <li>Confirm the unit, shift, start date and contract length in writing.</li>
          <li>Ask about patient ratios, float expectations and the charting system.</li>
          <li>Check the guaranteed hours and the cancellation terms.</li>
          <li>Make sure your license for that state is active, or that the timeline is realistic.</li>
        </ul>
        <h2>Your document folder</h2>
        <ul>
          <li>Licenses and certification cards</li>
          <li>Immunization records and a recent TB test</li>
          <li>Two references from recent supervisors</li>
          <li>Government ID and any documents your agency asks for at onboarding</li>
        </ul>
        <h2>Housing</h2>
        <p>Decide early whether you want a stipend or help finding a place. If you are arranging it yourself, book something flexible for the first weeks until you know the commute and the neighbourhood.</p>
        <h2>The first week</h2>
        <ul>
          <li>Learn where supplies, crash carts and policies live before you need them.</li>
          <li>Find out who your resource person is on each shift.</li>
          <li>Tell your recruiter how orientation went, good or bad. They can only fix what they know about.</li>
        </ul>
        <h2>Around week eight</h2>
        <p>Start the conversation about what comes next: an extension, a new city or a break. The earlier you say what you want, the more choice you have.</p>`,
    },
  ];

  pages.push({
    file: 'blog.html', nav: 'about',
    title: 'Blog: Pay Guides, Licensing and Career Advice',
    desc: 'Plain-language guides from Mutex Healthcare Staffing on licensing, pay packages and getting started with contract work.',
    blocks: [
      hero({
        crumbs: [['Company', 'about.html'], ['Blog']],
        eyebrow: 'What we’re thinking',
        title: 'Pay guides, licensing <em>and straight answers.</em>',
        lead: 'Short, practical reads for clinicians thinking about their next move.',
      }),
      raw(`
    <div class="card-grid cols-3">${posts.map((p, i) => `
      <article class="card post-card" data-reveal style="--d:${i * 70}ms">
        ${L.photo(`assets/people/${p.file.replace('.html', '.jpg')}`, { cls: 'post-photo', pos: 'center 30%', eager: false, widths: [480, 800], sizes: '(max-width: 900px) 100vw, 400px' })}
        <span class="tag t-new">${p.tag}</span>
        <h3><a href="${p.file}">${p.title}</a></h3>
        <p>${p.excerpt}</p>
        <span class="post-meta">${p.read}</span>
      </article>`).join('')}
    </div>`),
      cards({
        band: true, eyebrow: 'More resources', title: 'Reference guides',
        items: [
          ['dollar', 'Pay & Benefits', 'How a pay package is built, and what to ask before you sign.', 'pay-benefits.html', 'Read the guide'],
          ['shield', 'Licensure Guide', 'Compact licenses, single-state applications and timelines.', 'licensure.html', 'Read the guide'],
          ['message', 'FAQs', 'Answers on applying, credentialing, pay and assignments.', 'faqs.html', 'See the answers'],
        ],
      }),
    ],
  });

  posts.forEach((p) => {
    pages.push({
      file: p.file, nav: 'about',
      title: p.title,
      desc: p.excerpt,
      blocks: [
        hero({
          crumbs: [['Blog', 'blog.html'], [p.tag]],
          eyebrow: `${p.tag} &nbsp;|&nbsp; ${p.read}`,
          title: p.title,
          lead: p.excerpt,
        }),
        article({
          html: p.html,
          aside: listCard('Keep reading', posts.filter((o) => o !== p).map((o) => `<a class="text-link" href="${o.file}">${o.title}</a>`),
            btn('Search jobs', 'jobs.html', 'dark', '')),
        }),
        cta({
          title: 'Ready to put it <em>into practice?</em>',
          text: 'Browse open roles with the pay on every posting, or let a recruiter bring the right ones to you.',
          ctas: [btn('Search jobs', 'jobs.html'), btn('Join the talent network', 'apply.html', 'outline-light')],
        }),
      ],
    });
  });

  /* ---------- FAQs ---------- */
  pages.push({
    file: 'faqs.html', nav: 'about',
    title: 'Frequently Asked Questions',
    desc: 'Answers about Mutex Healthcare Staffing: jobs, pay, credentialing, applying and requesting staff.',
    blocks: [
      hero({
        crumbs: [['FAQs']],
        eyebrow: 'Questions, answered',
        title: 'Frequently asked <em>questions.</em>',
        lead: 'Straight answers for clinicians and for facilities. If yours is not here, ask us and you will hear back within one business day.',
        ctas: [btn('Contact us', 'contact.html'), btn('Search jobs', 'jobs.html', 'ghost')],
      }),
      faq({
        id: 'clinicians', more: false, eyebrow: 'For clinicians', title: 'Jobs, pay and assignments',
        intro: 'Applying, credentialing and what to expect on contract.',
        items: [
          ['What kinds of jobs do you fill?', 'Travel contracts, local contracts, per diem shifts and permanent positions, across nursing, allied health, therapy, imaging, pharmacy, behavioral health, schools and healthcare IT.'],
          ['Do you show pay on every job?', 'Yes. Every posting shows the hourly rate and an estimated weekly gross, or the salary for permanent roles. Your recruiter walks through the full package before you accept anything.'],
          ['How do I apply?', 'Find a job you like, choose Apply and fill in a two-minute form. A recruiter reaches out within one business day. If you are not ready to pick a job, join the talent network instead.'],
          ['How much experience do I need?', 'Most contract roles ask for one to two years of recent experience in the specialty. Permanent roles and some school positions are open to newer clinicians.'],
          ['How does credentialing work?', 'We verify licenses and certifications at the source, collect health and background requirements once, and track every expiry date for the length of your assignment.'],
          ['Will my profile be sent anywhere without my permission?', 'No. We never submit you to a facility without your say-so.'],
          ['Does it cost anything to work with you?', 'No. There is never a fee to a clinician.'],
        ],
      }),
      faq({
        id: 'facilities', more: false, eyebrow: 'For facilities', title: 'Requesting and managing staff',
        intro: 'How requests, shortlists and compliance work.',
        items: [
          ['How does a facility request staff?', 'Use the request form to tell us the roles, headcount and timing, or call us. A staffing specialist replies within one business day.'],
          ['How quickly will we see candidates?', 'It depends on the role and location, but you can usually expect credentialed candidates to review within days.'],
          ['Which types of cover do you offer?', 'Travel contracts, local contracts, per diem cover and permanent placement, under one agreement.'],
          ['What do you verify before a clinician starts?', 'Licenses and certifications at the source, health records, background checks and references, to your standards and those of your accrediting body.'],
          ['Do you offer programs beyond single placements?', 'Yes: contract therapy, credentialing and compliance, a rural and critical access program, managed staffing programs and surge response.'],
        ],
      }),
      faq({
        id: 'about', more: false, eyebrow: 'About Mutex', title: 'Who we are',
        intro: 'The short version.',
        items: [
          ['Who is Mutex Healthcare Staffing?', 'We are a healthcare staffing agency that places clinicians with facilities across all 50 states. Our name says how we work: one opening, one right clinician, one recruiter accountable for the match.'],
          ['How do I reach a person?', 'Call or email us using the details on the contact page. You will hear back within one business day.'],
        ],
      }),
      cta({
        title: 'Still have <em>a question?</em>',
        text: 'Ask us directly. You will hear back from a real person within one business day.',
        ctas: [btn('Contact us', 'contact.html'), btn('Search jobs', 'jobs.html', 'outline-light')],
      }),
    ],
  });

  /* ---------- Contact ---------- */
  pages.push({
    file: 'contact.html', nav: 'about',
    title: 'Contact Us and Request Staff',
    desc: 'Request staff or contact Mutex Healthcare Staffing in Frisco, Texas. Staffing requests and questions about a job or a contract are answered within one business day.',
    blocks: [
      hero({
        crumbs: [['Contact']],
        eyebrow: 'Contact and request staff',
        title: 'Talk to <em>a person.</em>',
        lead: 'Need clinicians? Send a staffing request in three short steps. Questions about a job or a contract? Send a note below. Either way, the right person replies within one business day.',
        ctas: [btn('Request staff', '#request'), btn('Ask a question', '#message', 'ghost')],
      }),
      raw(`
    <div class="split top">
      <div data-reveal>
        <p class="eyebrow">Request staff</p>
        <h2>Tell us what you need.</h2>
        <p class="lead" style="margin-top:16px">Three short steps: the roles, where and when, and who we should reply to. A staffing specialist replies within one business day, usually with available clinicians to review.</p>
        ${contactList()}
      </div>
      ${L.requestForm()}
    </div>`, { id: 'request' }),
      raw(`
    <div class="split top">
      <div data-reveal>
        <p class="eyebrow">Something else?</p>
        <h2>Send us a note.</h2>
        <p class="lead" style="margin-top:16px">Questions about a job, a contract, credentialing or anything else. We read everything that comes in.</p>
        <div class="cta-row" style="margin-top:22px">
          ${btn('Search jobs', 'jobs.html', 'ghost', '')}
          ${btn('Join the talent network', 'apply.html', 'ghost', '')}
        </div>
      </div>
      ${form('contact')}
    </div>`, { id: 'message' }),
      cards({
        band: true, eyebrow: 'Faster routes', title: 'Looking for something specific?',
        items: [
          ['search', 'Find a job', 'Search open roles with the pay on every posting.', 'jobs.html', 'Search jobs'],
          ['building', 'Request staff', 'Tell us the roles, headcount and dates.', '#request', 'Start a request'],
          ['users', 'Refer a clinician', 'Send someone our way and earn a bonus when they start.', 'referral.html', 'Refer a friend'],
          ['message', 'Read the FAQs', 'The most common questions, answered.', 'faqs.html', 'See the answers'],
        ],
      }),
    ],
  });

  /* ---------- Privacy ---------- */
  pages.push({
    file: 'privacy.html', nav: 'about',
    title: 'Privacy Policy',
    desc: 'How Mutex Healthcare Staffing collects, uses and protects personal information.',
    blocks: [
      hero({
        crumbs: [['Privacy policy']],
        eyebrow: 'Privacy',
        title: 'Privacy <em>policy.</em>',
        lead: 'What we collect, why we collect it and the choices you have.',
      }),
      note('This is a starting draft, not legal advice. Have it reviewed by counsel and completed with your actual practices and effective date before launch.'),
      article({
        html: `
        <h2>Who we are</h2>
        <p>Mutex Healthcare Staffing places healthcare professionals with healthcare organizations. This policy explains how we handle personal information collected through this website and in the course of our staffing services.</p>
        <h2>Information we collect</h2>
        <ul>
          <li><b>Details you give us:</b> your name, contact details, profession, license information, work history and any documents you choose to upload, such as a résumé.</li>
          <li><b>Details from facilities:</b> the name and work contact details of the person making a staffing request, and the details of that request.</li>
          <li><b>Details collected automatically:</b> basic technical information such as browser type and the pages visited.</li>
        </ul>
        <h2>How we use it</h2>
        <ul>
          <li>To match clinicians with roles and to present candidates to facilities, with the clinician's permission</li>
          <li>To verify credentials and meet the compliance requirements of the facilities we work with</li>
          <li>To respond to questions and requests</li>
          <li>To improve the website and our services</li>
        </ul>
        <h2>When we share it</h2>
        <p>We share a clinician's profile with a facility only when the clinician has agreed to be considered for a role there. We also share information with service providers who help us run our business, and when the law requires it. Forms on this site are delivered to our team by email through Microsoft 365, and the site is hosted by Vercel. We do not sell personal information.</p>
        <h2>Your choices</h2>
        <p>You can ask us to update or delete the information we hold about you, or to stop contacting you, at any time. Use the details on the <a class="text-link" href="contact.html">contact page</a>.</p>
        <h2>Keeping it safe</h2>
        <p>We limit access to personal information to the people who need it to do their work, and we keep it only for as long as we need it for the purposes above or as the law requires.</p>
        <h2>Changes to this policy</h2>
        <p>If we change this policy we will post the updated version on this page.</p>`,
      }),
    ],
  });

  return pages;
};
