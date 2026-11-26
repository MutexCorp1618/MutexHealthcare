/* Building blocks for the generated content pages. Each block returns { hero?, band?, render(pt) }
   where pt is a padding class chosen by the layout so stacked sections do not double their gaps. */
'use strict';

const icon = (name, cls = '') => `<i data-icon="${name}"${cls ? ` class="${cls}"` : ''}></i>`;
const arrow = icon('arrow', 'arrow');
const btn = (label, href, kind = 'primary', size = 'lg') =>
  `<a class="btn btn-${kind}${size ? ` btn-${size}` : ''}" href="${href}">${label}${/primary|dark/.test(kind) ? ' ' + arrow : ''}</a>`;
const attr = (obj) => JSON.stringify(obj).replace(/'/g, '&#39;');

const head = ({ eyebrow, title, intro, light, aside = '' }) => `
    <div class="section-head">
      <div data-reveal>
        ${eyebrow ? `<p class="eyebrow${light ? ' light' : ''}">${eyebrow}</p>` : ''}
        <h2>${title}</h2>
        ${intro ? `<p>${intro}</p>` : ''}
      </div>
      ${aside}
    </div>`;

const sec = (inner, { band = false, id = '', cls = '' } = {}) => ({
  band,
  render: (pt) => `
<section class="${band ? 'band ' : ''}section${pt ? ' ' + pt : ''}${cls ? ' ' + cls : ''}"${id ? ` id="${id}"` : ''}>
  <div class="container">${inner}
  </div>
</section>`,
});

/* ---------- Photos ----------
   Photos of people live in assets/people/. On Netlify they go through its image service, which
   resizes them; the service is chosen by MX.SITE.imageCdn in js/data.js (see MX.img there). */
const cdn = (src, w) => (global.MX ? global.MX.img(src, w) : src).replace(/&/g, '&amp;');
function photo(src, { cls = 'hero-photo', pos = 'center 30%', alt = '', eager = true, widths = [640, 1024, 1600], sizes = '100vw' } = {}) {
  const set = global.MX && global.MX.SITE.imageCdn ? ` srcset="${widths.map((w) => `${cdn(src, w)} ${w}w`).join(', ')}" sizes="${sizes}"` : '';
  return `<img class="${cls}" src="${cdn(src, widths[widths.length - 1])}"${set} alt="${alt}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async" style="object-position:${pos}">`;
}

/* ---------- Hero ----------
   build.js sets .photo on the hero when assets/people/<page name>.jpg exists. The photo is shown
   sharp, in a rounded frame: on the right when the hero has no side card, otherwise under the buttons. */
function hero({ crumbs = [], eyebrow, title, lead, ctas = [], side = '' }) {
  const trail = crumbs.length
    ? `<nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a>${crumbs.map(([l, h]) => `<span>/</span>${h ? `<a href="${h}">${l}</a>` : `<b>${l}</b>`}`).join('')}</nav>`
    : '';
  const block = {
    hero: true,
    crumbs,
    photo: null,
    render: () => {
      const ph = block.photo;
      const figure = (cls) => `<figure class="hero-figure ${cls}">${photo(ph.src, { cls: '', pos: ph.pos, widths: [640, 960, 1400, 2048], sizes: '(max-width: 900px) 100vw, 600px' })}</figure>`;
      // with a photo, the photo takes the right column and any side card moves under the buttons
      const right = ph ? figure(side ? 'hero-figure-side hero-figure-tall' : 'hero-figure-side') : side;
      return `
<section class="page-hero${ph ? ' has-photo' : ''}">
  <div class="container${right ? ' split' : ''}">
    <div>
      ${trail}
      <p class="eyebrow">${eyebrow}</p>
      <h1>${title}</h1>
      <p class="lead">${lead}</p>
      ${ctas.length ? `<div class="cta-row">${ctas.join('')}</div>` : ''}${ph && side ? `\n      <div class="hero-side-in">${side}</div>` : ''}
    </div>
    ${right}
  </div>
</section>`;
    },
  };
  return block;
}

/* Live numbers from the job board for a filter (filled in by js/page.js) */
const statCard = (filter, label) => `
    <aside class="stat-card" data-reveal data-jobstat='${attr(filter)}'>
      <h4>Live on the board</h4>
      <div class="stat-big"><b data-s="count">0</b><span>open ${label} jobs</span></div>
      <div class="stat-grid">
        <div><small>Top weekly pay</small><b data-s="top">–</b></div>
        <div><small>Typical hourly</small><b data-s="rate">–</b></div>
        <div><small>States hiring</small><b data-s="states">–</b></div>
        <div><small>New this week</small><b data-s="fresh">–</b></div>
      </div>
      <a class="btn btn-primary btn-block" data-s="link" href="jobs.html">See these jobs ${arrow}</a>
    </aside>`;

const listCard = (title, items, cta = '') => `
    <aside class="panel" data-reveal>
      <h4 class="panel-title">${title}</h4>
      <ul class="checklist">${items.map((i) => `<li>${icon('check')}<span>${i}</span></li>`).join('')}</ul>
      ${cta ? `<div class="cta-row" style="margin-top:18px">${cta}</div>` : ''}
    </aside>`;

/* ---------- Sections ---------- */
/* items: [icon, title, text, href?, linkLabel?] */
function cards({ eyebrow, title, intro, items, cols, band = false, id = '', aside = '' }) {
  const n = cols || (items.length % 3 === 0 && items.length !== 6 ? 3 : items.length === 2 ? 2 : items.length === 6 ? 3 : 4);
  const grid = items.map(([ic, t, text, href, link, extra], i) => `
      <div class="card" data-reveal style="--d:${(i % n) * 70}ms">
        <span class="ico">${icon(ic)}</span>
        <h3>${t}</h3>
        <p>${text}</p>
        ${extra || ''}
        ${href ? `<a class="link-arrow" href="${href}">${link || 'Learn more'} ${icon('arrow')}</a>` : ''}
      </div>`).join('');
  return sec(`${head({ eyebrow, title, intro, light: band, aside })}
    <div class="card-grid${n === 3 ? ' cols-3' : n === 2 ? ' cols-2' : ''}">${grid}
    </div>`, { band, id });
}

function steps({ eyebrow, title, intro, items, id = '' }) {
  return sec(`${head({ eyebrow, title, intro })}
    <div class="steps">${items.map(([t, p], i) => `
      <div class="step" data-reveal style="--d:${i * 70}ms"><h3>${t}</h3><p>${p}</p></div>`).join('')}
    </div>`, { id });
}

/* Text on one side, any panel on the other */
function split({ eyebrow, title, paras = [], checklist = [], ctas = [], side = '', id = '', top = true }) {
  return sec(`
    <div class="split${top ? ' top' : ''}">
      <div data-reveal>
        ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
        <h2>${title}</h2>
        <div class="prose" style="margin-top:18px">${paras.map((p) => `<p>${p}</p>`).join('')}</div>
        ${checklist.length ? `<ul class="checklist" style="margin-top:14px">${checklist.map((c) => `<li>${icon('check')}<span>${Array.isArray(c) ? `${c[0]}<small>${c[1]}</small>` : c}</span></li>`).join('')}</ul>` : ''}
        ${ctas.length ? `<div class="cta-row">${ctas.join('')}</div>` : ''}
      </div>
      ${side}
    </div>`, { id });
}

/* Chips that link into the job search */
const chipPanel = (title, labels, toHref) => `
      <aside class="panel" data-reveal>
        <h4 class="panel-title">${title}</h4>
        <div class="chips">${labels.map((l) => `<a class="chip" href="${toHref(l)}">${l}</a>`).join('')}</div>
      </aside>`;

function jobs({ eyebrow = 'Open now', title, intro, filter = {}, limit = 6, sort = 'pay' }) {
  return sec(`${head({
    eyebrow, title, intro,
    aside: `<a class="btn btn-dark" data-jobs-link href="jobs.html" data-reveal><span>View all <span data-jobs-n></span> jobs</span> ${arrow}</a>`,
  })}
    <div class="job-grid" data-jobs='${attr({ filter, limit, sort })}'></div>`);
}

function faq({ eyebrow = 'Questions, answered', title = 'Frequently asked questions', intro = '', items, id = '', more = true }) {
  const block = sec(`
    <div class="split top">
      <div data-reveal>
        <p class="eyebrow">${eyebrow}</p>
        <h2>${title}</h2>
        ${intro ? `<p class="lead" style="margin-top:16px">${intro}</p>` : ''}
        ${more ? `<div class="cta-row">${btn('All FAQs', 'faqs.html', 'ghost', '')}${btn('Contact us', 'contact.html', 'ghost', '')}</div>` : ''}
      </div>
      <div class="faq" data-reveal>${items.map(([q, a], i) => `
        <details${i === 0 ? ' open' : ''}><summary>${q}</summary><p>${a}</p></details>`).join('')}
      </div>
    </div>`, { id });
  block.faqs = items;
  return block;
}

function cta({ eyebrow = '', title, text, ctas }) {
  return {
    band: true,
    render: () => `
<section class="band section cta-final">
  <div class="container" data-reveal>
    ${eyebrow ? `<p class="eyebrow light">${eyebrow}</p>` : ''}
    <h2>${title}</h2>
    <p>${text}</p>
    <div class="cta-row">${ctas.join('')}</div>
  </div>
</section>`,
  };
}

/* Long-form text (guides, articles, policies) */
function article({ html, aside = '' }) {
  return sec(`
    <div class="article-wrap${aside ? ' with-aside' : ''}">
      <article class="article" data-reveal>${html}</article>
      ${aside}
    </div>`);
}

/* Shown only while SITE.demoMode is on: marks content that needs the company's real details */
const draft = (text) => `<div class="draft-note demo-only">${icon('message')}<span><b>Draft.</b> ${text}</span></div>`;

const raw = (html, opts) => sec(html, opts);
/* A draft note between sections; it does not affect section spacing */
const note = (text) => ({ inline: true, render: () => `
<div class="container note-row demo-only">${draft(text).replace(' demo-only', '')}</div>` });

/* ---------- Photo strip ----------
   tiles: [['people/travel-nursing', 'Caption'], ['cities/denver-co', 'Denver, CO'], ...] (files in assets/) */
const gallery = (tiles) => sec(`
    <div class="gallery gallery-${tiles.length}">${tiles.map(([file, caption], i) => `
      <figure data-reveal style="--d:${i * 70}ms">${photo(`assets/${file}.jpg`, { cls: '', pos: 'center 30%', eager: false, widths: [400, 700, 1000], sizes: '(max-width: 700px) 100vw, 450px' })}<figcaption>${caption}</figcaption></figure>`).join('')}
    </div>`, { cls: 'gallery-sec' });

/* ---------- Things to play with (filled in by js/explore.js) ---------- */
const exploreHTML = `
    <div class="section-head">
      <div data-reveal>
        <p class="eyebrow">Travel nursing</p>
        <h2>Where could your next <em>13 weeks</em> take you?</h2>
        <p>Pick a vibe and spin. Each stop shows the open travel jobs in that state, with the pay.</p>
      </div>
    </div>
    <div class="explore" data-explore data-reveal></div>`;
const quizHTML = `
    <div class="split quiz-split">
      <div data-reveal>
        <p class="eyebrow">60-second quiz</p>
        <h2>What’s your <em>assignment style?</em></h2>
        <p class="lead">Explorer, Anchor, Free Spirit or Hometown Adventurer? Four quick questions, then the jobs that fit you.</p>
      </div>
      <div class="quiz" data-quiz data-reveal></div>
    </div>`;
/* Facts from the U.S. Bureau of Labor Statistics, Occupational Outlook Handbook (page modified 29 Oct 2026).
   Check them against the source when that page is updated. */
const factsHTML = `
    <div class="facts-head" data-reveal>
      <p class="eyebrow light">Why nurses are in demand</p>
      <h2>America needs registered nurses. <em>A lot of them.</em></h2>
    </div>
    <div class="facts">
      <div data-reveal><b data-count="180800">180,800</b><span>registered nurse openings projected every year, 2025–35</span></div>
      <div data-reveal style="--d:70ms"><b data-count="6" data-suffix="%">6%</b><span>projected job growth, faster than average</span></div>
      <div data-reveal style="--d:140ms"><b data-count="97550" data-prefix="$">$97,550</b><span>median pay for registered nurses, May 2025</span></div>
      <div data-reveal style="--d:210ms"><b>3.5M</b><span>registered nurse jobs in the U.S. in 2025</span></div>
    </div>
    <p class="facts-source">Source: U.S. Bureau of Labor Statistics, <a href="https://www.bls.gov/ooh/healthcare/registered-nurses.htm" rel="noopener" target="_blank">Occupational Outlook Handbook: Registered Nurses</a>.</p>`;
const explore = () => sec(exploreHTML, { id: 'explore' });
const quiz = () => sec(quizHTML, { id: 'style-quiz' });
const facts = () => sec(factsHTML, { band: true, id: 'facts', cls: 'facts-band' });

/* ---------- Forms (demo forms: they validate and show a success screen, nothing is sent) ---------- */
const field = (label, input, full = false, note = '') =>
  `<label class="field${full ? ' full' : ''}"><span>${label}${note ? ` <small>${note}</small>` : ''}</span>${input}</label>`;
const input = (name, type = 'text', extra = '') => `<input class="input" name="${name}" type="${type}" ${extra}>`;
const FORMS = {
  apply: {
    name: 'talent-network',
    title: 'You’re in the network, {first}.',
    msg: 'A recruiter will call within one business day to learn what you are looking for. No commitment, no pressure.',
    button: 'Join the talent network',
    fields: [
      field('First name', input('first', 'text', 'required autocomplete="given-name"')),
      field('Last name', input('last', 'text', 'required autocomplete="family-name"')),
      field('Email', input('email', 'email', 'required autocomplete="email"')),
      field('Mobile phone', input('phone', 'tel', 'required autocomplete="tel"')),
      field('What do you do?', '<select class="select" name="profession" data-groups="Select your profession" required></select>'),
      field('Where are you licensed?', '<select class="select" name="license" data-states="Select a state"></select>'),
      field('What are you open to?', `<div class="chips">${['Travel', 'Local contract', 'Per diem', 'Permanent'].map((w) => `<label class="chip-check"><input type="checkbox" name="open" value="${w}"><span>${w}</span></label>`).join('')}</div>`, true),
      field('Résumé', input('resume', 'file', 'accept=".pdf,.doc,.docx"'), true, '(optional, you can send it later)'),
      '<label class="check full"><input type="checkbox" required> I agree to be contacted by a Mutex recruiter about roles that fit my profile.</label>',
    ],
  },
  referral: {
    name: 'referral',
    title: 'Thank you, {first}.',
    msg: 'We will reach out to the person you referred and keep you posted. Your recruiter will confirm the bonus terms.',
    button: 'Send referral',
    fields: [
      field('Your first name', input('first', 'text', 'required autocomplete="given-name"')),
      field('Your last name', input('last', 'text', 'required autocomplete="family-name"')),
      field('Your email', input('email', 'email', 'required autocomplete="email"')),
      field('Your phone', input('phone', 'tel', 'autocomplete="tel"'), false, '(optional)'),
      field('Who are you referring?', input('refName', 'text', 'required')),
      field('Their profession', '<select class="select" name="refProfession" data-groups="Select a profession"></select>'),
      field('Their email or phone', input('refContact', 'text', 'required'), true),
      '<label class="check full"><input type="checkbox" required> The person I am referring knows I am sharing their details.</label>',
    ],
  },
  contact: {
    name: 'contact',
    title: 'Thanks, {first}. We have it.',
    msg: 'The right person on our team will reply within one business day.',
    button: 'Send message',
    fields: [
      field('First name', input('first', 'text', 'required autocomplete="given-name"')),
      field('Last name', input('last', 'text', 'required autocomplete="family-name"')),
      field('Email', input('email', 'email', 'required autocomplete="email"')),
      field('I’m reaching out about', '<select class="select" name="topic"><option>A job or application</option><option>Staffing for my facility</option><option>A workforce program</option><option>Something else</option></select>'),
      field('Message', '<textarea class="textarea" name="message" required placeholder="How can we help?"></textarea>', true),
    ],
  },
  careers: {
    name: 'careers',
    title: 'Thanks, {first}.',
    msg: 'Our team will review your note and get back to you if there is a fit, now or later.',
    button: 'Introduce yourself',
    fields: [
      field('First name', input('first', 'text', 'required autocomplete="given-name"')),
      field('Last name', input('last', 'text', 'required autocomplete="family-name"')),
      field('Email', input('email', 'email', 'required autocomplete="email"')),
      field('Area of interest', '<select class="select" name="area"><option>Recruiting</option><option>Credentialing and compliance</option><option>Account management</option><option>Clinical liaison</option><option>Operations</option><option>Something else</option></select>'),
      field('LinkedIn or résumé link', input('link', 'url', 'placeholder="https://"'), true, '(optional)'),
      field('Tell us about yourself', '<textarea class="textarea" name="message" required placeholder="What you do well, and what you want to do next."></textarea>', true),
    ],
  },
};
function form(kind) {
  const f = FORMS[kind];
  return `
      <div class="panel" data-reveal>
        <form data-demo-form data-form-name="${f.name}" data-title="${f.title}" data-msg="${f.msg}">
          <input class="hp" type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true">
          <div class="form-grid">${f.fields.join('')}</div>
          <button class="btn btn-primary btn-lg btn-block" style="margin-top:20px" type="submit">${f.button} ${arrow}</button>
        </form>
      </div>`;
}

/* The request-staff form (three steps). Driven by js/request.js; it lives on the Contact page. */
const requestForm = () => `
    <div class="request" id="requestCard" data-reveal>
      <div class="progress" id="reqProgress"><i class="on"></i><i></i><i></i></div>

      <div data-step="1">
        <div class="step-kicker">Step 1 of 3</div>
        <h3>Which roles do you need covered?</h3>
        <div class="chips" id="reqNeeds"></div>
        <div class="field"><span>How many clinicians?</span>
          <div class="counter"><button type="button" data-dec aria-label="Fewer">−</button><output id="reqCount">1</output><button type="button" data-inc aria-label="More">+</button></div>
        </div>
      </div>

      <div data-step="2" hidden>
        <div class="step-kicker">Step 2 of 3</div>
        <h3>Where and when?</h3>
        <div class="form-grid">
          <label class="field"><span>Facility type</span>
            <select class="select" id="reqFacility">
              <option>Acute care hospital</option><option>Skilled nursing facility</option><option>Home health agency</option>
              <option>Outpatient clinic</option><option>Surgery center</option><option>School district</option>
              <option>Behavioral health center</option><option>Government agency</option><option>Other</option>
            </select>
          </label>
          <label class="field"><span>State</span><select class="select" id="reqState"></select></label>
          <label class="field"><span>How soon?</span>
            <select class="select" id="reqWhen">
              <option value="asap">As soon as possible</option>
              <option value="weeks">In the next 2–4 weeks</option>
              <option value="planning">Planning ahead</option>
            </select>
          </label>
          <label class="field"><span>Type of cover</span>
            <select class="select" id="reqType">
              <option>Travel contract</option><option>Local contract</option><option>Per diem</option><option>Permanent hire</option><option>Not sure yet</option>
            </select>
          </label>
        </div>
      </div>

      <div data-step="3" hidden>
        <div class="step-kicker">Step 3 of 3</div>
        <h3>Who should we reply to?</h3>
        <div class="form-grid">
          <label class="field"><span>Your name</span><input class="input" id="reqName" autocomplete="name"></label>
          <label class="field"><span>Organization</span><input class="input" id="reqOrg" autocomplete="organization"></label>
          <label class="field"><span>Work email</span><input class="input" id="reqEmail" type="email" autocomplete="email"></label>
          <label class="field"><span>Phone <small>(optional)</small></span><input class="input" id="reqPhone" type="tel" autocomplete="tel"></label>
          <label class="field full"><span>Anything else? <small>(optional)</small></span><textarea class="textarea" id="reqNote" placeholder="Unit, shift pattern, EHR, must-have certifications…"></textarea></label>
        </div>
      </div>

      <p class="error-msg" id="reqError" role="alert"></p>
      <div class="request-nav">
        <button class="btn btn-ghost" type="button" id="reqBack" hidden>Back</button>
        <span></span>
        <button class="btn btn-primary btn-lg" type="button" id="reqNext">Continue <i data-icon="arrow" class="arrow"></i></button>
      </div>
    </div>`;

const contactList = () => `
        <div class="contact-list">
          <a href="#" data-phone-link><span class="ico">${icon('phone')}</span><span><span data-site-phone></span><small data-site-hours></small></span></a>
          <a href="#" data-email-link><span class="ico">${icon('mail')}</span><span><span data-site-email></span><small>We read everything that lands here</small></span></a>
          <a href="#" data-map-link target="_blank" rel="noopener"><span class="ico">${icon('pin')}</span><span><span data-site-address></span><small>Head office</small></span></a>
        </div>`;

module.exports = { requestForm, gallery, explore, quiz, facts, exploreHTML, quizHTML, factsHTML, photo, cdn, icon, arrow, btn, attr, head, sec, hero, statCard, listCard, cards, steps, split, chipPanel, jobs, faq, cta, article, draft, note, raw, form, contactList };
