# Mutex Healthcare Staffing website: handover

| | |
|---|---|
| Live site | https://mutexhealthcare.vercel.app/ |
| Code | https://github.com/realme999/mutexhealthcare2 (branch `main`) |
| Hosting | Vercel (static files and clean addresses, set up in `vercel.json`) |
| Parent company | Mutex Corp, https://mutexcorp.com/ |
| Last reviewed | 20 November 2026 |

## What the site is

It is a marketing and recruiting site for Mutex Healthcare Staffing. It talks to two audiences:

- **Facilities** (hospitals, clinics, schools, agencies) that need staff: staffing services, the request-staff form, workforce solutions, and one `staffing-*.html` page per specialty.
- **Clinicians** looking for work: job search, the job application, the talent network, pay and benefits, licensure, referrals, and one `specialty-*.html` page per specialty.

The home page has a toggle between a "hiring" view and a "clinician" view. The browser remembers the choice.

The site is **plain HTML, CSS and JavaScript**. It has no framework and no npm packages, and Vercel does not run a build step. The pages are generated on your computer, committed to Git, and Vercel serves the folder as it is. (It moved from Netlify to Vercel on 20 November 2026; nothing Netlify-specific is left.)

## Folder layout

```
*.html               All pages (most are generated, 4 are written by hand; see below)
css/styles.css       The only stylesheet
js/data.js           Site settings (phone, email, address, switches) + sample job data
js/site.js           Shared header, footer, icons, form handling and sending, photo protection
js/home.js           Home page interactions (hiring/clinician toggle, shortlist, pay game)
js/jobs.js           Job search page, job cards, application form
js/employers.js      Staffing services page, request-staff stepper
js/usmap.js          Interactive US map
js/city-photos.js    Which city photo goes with which job location
js/logo.js, page.js  Logo drawing, small per-page behaviour
assets/brand/        Logos (SVG + the original PNG)
assets/cities/       City photos used on job cards (credited on photo-credits.html)
assets/og-image.png  Image shown when a link is shared on social media
build/               Page generator and local preview server (Node.js, no dependencies)
api/send-form.js     Vercel Function that emails form submissions through Microsoft 365
vercel.json          Vercel settings: clean addresses, photo sizes, security and cache headers (generated)
.vercelignore        Keeps HANDOVER.md, build/ and .claude/ out of the deployment, so they are not served publicly
robots.txt, llms.txt, sitemap.xml   Files for search and AI crawlers (generated)
.claude/launch.json  Preview server setup for Claude Code
```

## Which files to edit

**Do not edit generated pages directly.** Each one says at the top that it is generated, and the next build overwrites it.

| To change… | Edit | Then |
|---|---|---|
| Phone, email, address, hours | `MX.SITE` in `js/data.js` | run the build |
| Home page headline numbers | `MX.HOME_STATS` in `js/data.js` | none |
| Specialty list (names, blurbs, icons) | `MX.SPECIALTIES` in `js/data.js` | run the build |
| Specialty page copy (both versions) | `build/specialties.js` | run the build |
| Clinician pages (travel nursing, per diem, licensure, apply…) | `build/pages-seekers.js` | run the build |
| Facility pages (workforce solutions, credentialing, rural…) | `build/pages-facilities.js` | run the build |
| Company pages (careers, blog, FAQs, contact, privacy) | `build/pages-company.js` | run the build |
| Shared section templates and forms markup | `build/lib.js` | run the build |
| Search, social and structured-data markup, site address | `build/seo.js` | run the build |
| Photo credits | `build/photo-credits.json` | run the build |
| `index.html`, `jobs.html`, `employers.html`, `about.html` | the HTML file itself (hand-written) | run the build |
| Look and feel | `css/styles.css` | run the build (this updates the cache-busting `?v=`) |
| Interactions | `js/*.js` | run the build (same reason) |

For the four hand-written pages the build only refreshes the `<!-- seo:start … seo:end -->` block in `<head>` and the header and footer link lists. It leaves the page content alone.

## Everyday workflow

You need [Node.js](https://nodejs.org/). Any recent version works; it was last run with v24. Nothing needs installing.

1. Edit the source files listed above.
2. Build:
   ```bash
   node build/build.js
   ```
   This writes every generated page plus `vercel.json`, `robots.txt`, `llms.txt` and `sitemap.xml`.
3. Preview locally:
   ```bash
   node build/serve.js
   ```
   Then open http://localhost:4173. Like Vercel, the preview server serves clean addresses (`/about`), passes `/_vercel/image` through to the original image (no resizing locally) and sends the security headers from `vercel.json`.
4. Commit and push to `main`:
   ```bash
   git add -A && git commit -m "Describe the change" && git push origin main
   ```
5. Vercel deploys the repository folder as it is. The Vercel project is linked to this GitHub repo, so a push to `main` goes live within a minute or two; see **Deployments** in the Vercel dashboard for history. In the project settings, the framework preset should be **Other** with no build command and the output directory left as the project root.

**Always run the build before committing**, even after a CSS, JS or inline-script change. The build:
- updates the `?v=<fingerprint>` on CSS and JS links. `vercel.json` tells browsers to keep those files for a year, so a stale fingerprint means visitors keep the old file.
- recalculates the fingerprints of inline scripts in `vercel.json`. The content security policy only allows inline scripts it knows by fingerprint, so if one changes without a rebuild, browsers refuse to run it.

**Line endings:** `.gitattributes` keeps every text file on LF line endings, even on Windows. Without it, Git on Windows checks out `css/` and `js/` with CRLF, and every build then gives the pages new `?v=` fingerprints even when nothing changed.

## Forms

There are six forms:

| Form name | Where | Fields |
|---|---|---|
| `job-application` | Apply button on a job card (`jobs.html`) | job, name, email, phone, licence, years, note, résumé file |
| `talent-network` | `apply.html` and the talent network sign-up | name, email, phone, profession, licence, open to, résumé file |
| `referral` | `referral.html` | referrer details + referred clinician |
| `contact` | `contact.html` | name, email, topic, message |
| `careers` | `careers.html` (jobs at Mutex itself) | name, email, area, link, message |
| `staff-request` | Request-staff form on the Contact page (`contact.html#request`, script `js/request.js`) | roles, headcount, facility, state, timing, cover, contact details, note |

**Forms are emailed through the company's Microsoft 365 mailbox by our own Vercel Function**, `api/send-form.js`. There is no third-party form service and no npm package. The browser sends each submission as JSON (form name, page, fields, and a résumé as base64) to `/api/send-form`. The function checks it, drops spam (the hidden `_gotcha` field), and sends one email per submission with Microsoft Graph, "as" the company mailbox. The email's subject names the form and the person, Reply goes to the person who filled in the form, and a résumé (PDF or Word, up to 3 MB) is attached. Only this site's own pages can use the function: requests without the site's own `Origin` header are refused, each visitor address may send at most 5 submissions per 10 minutes (answered with 429 after that), and an attachment must really be a PDF or Word file (its first bytes are checked, not only its name). The per-visitor limit lives in the function's memory, so it is best effort; for a hard limit add a rate-limit rule in Vercel (step 8 below).

Until the settings below are added in Vercel, the function answers "not configured" and visitors see the phone number and email instead of a false "sent". So the site is safe to deploy before the setup is finished.

### One-time setup (Microsoft 365 admin + Vercel)

1. **Microsoft Entra admin center** (entra.microsoft.com) → App registrations → New registration. Name: `Mutex website forms`, single tenant, no redirect URI.
2. In the new app: **API permissions** → Add a permission → Microsoft Graph → **Application permissions** → `Mail.Send` → Add. Then **Grant admin consent**.
3. **Certificates & secrets** → New client secret (24 months). Copy the secret **Value** straight into Vercel (step 5). It is shown only once.
4. Recommended: limit the app to the one mailbox, so it cannot send as anyone else. In Exchange Online PowerShell: `New-ApplicationAccessPolicy -AppId <client id> -PolicyScopeGroupId info@mutexcorp.com -AccessRight RestrictAccess -Description "Website forms"`.
5. **Vercel** → the project → Settings → Environment Variables (Production), add:
   - `M365_TENANT_ID`: Directory (tenant) ID, from the app's Overview page
   - `M365_CLIENT_ID`: Application (client) ID, from the same page
   - `M365_CLIENT_SECRET`: the secret value from step 3
   - `MAIL_FROM`: the mailbox to send from, e.g. `info@mutexcorp.com`
   - `MAIL_TO`: who receives submissions, comma-separated (optional; defaults to `MAIL_FROM`)
6. Vercel → Deployments → the latest one → **Redeploy**, so the function sees the new settings.
7. Send a test from each of the six forms on the live site. If an email does not arrive, Vercel → the project → Logs shows the function's error (for example a missing permission).
8. Recommended: Vercel → the project → Firewall → add a custom rule with a rate limit for requests whose path is `/api/send-form` (for example 10 requests per minute per IP, action Deny). This holds across all function instances, unlike the limit inside the function.

The client secret expires (24 months in step 3). Put a reminder in the calendar: create a new secret, update `M365_CLIENT_SECRET` in Vercel, redeploy.

Local preview: `node build/serve.js` runs the function too. Without the settings in your environment it answers "not configured", which is expected.

## Switches in `js/data.js`

- `demoMode: false`: when `true`, forms do not send, and the site shows "demo" labels and notes. Leave it `false` on the live site.
- `imageCdn: 'local'`: the site serves its own sharp copies of each people photo at 480, 960 and 1600 px (`assets/people/480|960|1600/`) and the original (2400 px; 3840 px for the home team photo) on large and high-resolution screens. **After adding or replacing a photo, run `python build/photo-sizes.py`** (needs Python with Pillow), then the build; the build warns if copies are missing. Vercel's own image optimizer (`'vercel'`) was tried and dropped because it visibly softens photos. The build rewrites every photo address, the hand-written pages included.
- `formEndpoint: '/api/send-form'`: where forms are sent (see Forms). `formFiles: true` attaches résumés.
- `MX.HOME_STATS`: the four numbers in the dark band on the home page. `null` means "count it from the job board". Only put real company figures here. The fourth one is currently "2,500+ clinicians in our talent network".

## Search engines and sharing

- `SITE_URL` in `build/seo.js` is `https://mutexhealthcare.vercel.app`. **If a custom domain is added, change it there and rebuild.** It drives canonical links, `sitemap.xml`, the sitemap line in `robots.txt` and the structured data.
- `UPDATED` in `build/seo.js` is the "last reviewed" date shown to search engines for the blog articles. Update it when the articles change.
- Every page gets a title, description, Open Graph tags and JSON-LD structured data (organization, breadcrumbs, FAQs, articles).
- `robots.txt` allows all crawlers, including AI crawlers, and blocks `/build/`. `llms.txt` is a plain-text summary of the site for AI answer engines.
- `jobs.html` is marked `noindex` because its listings are samples (see the next section).

## Important: the job listings are sample data

The jobs on `jobs.html`, on the US map and in the home page counts are **generated in the browser** by a fixed-seed generator in `js/data.js` (`MX.JOBS`). They are realistic but not real openings. Start dates are worked out from today's date.

Before relying on the job board:
1. Replace the generator in `js/data.js` with a real job feed, from an ATS or a JSON file you keep up to date, in the same shape as `MX.JOBS`.
2. Remove `noindex: true` from `jobs.html` in the `HAND` list in `build/build.js`, then rebuild.
3. Check the home page stats. With `null` they count from the job data.

The "sample shortlist" of clinicians on the home page and on `employers.html` (`js/home.js`, `js/employers.js`) is illustrative too.

## Security headers

`vercel.json` (generated) sends a strict content security policy. It allows only the site's own scripts, Google Fonts and same-origin images, and no frames from other sites. If you add a third-party script, font or embed, such as analytics, a chat widget or a map embed, allow it in the `csp` list in `build/build.js`, or browsers will block it.

Photos are protected against casual copying: the right-click menu, dragging and the long-press save menu are turned off on images, and `Cross-Origin-Resource-Policy: same-origin` stops other websites from embedding them. Screenshots cannot be prevented.

## Assets and credits

- Logos: `assets/brand/`. `mutex-logo-original.png` is the original taken from mutexcorp.com, and the SVGs are traced versions. The logo tile is the teal-green of nurses' scrubs (`#4fcdd0` to `#1d97a3`, `MX.LOGO_GREEN` in `js/logo.js`) with a white cross; the wordmark is Mutex blue; the browser-tab icon is `assets/favicon.svg`.
- City photos: `assets/cities/`, from Wikimedia Commons under free licences, cropped and resized. Each one is listed with author and licence on `photo-credits.html`. **If you add a photo, add its credit to `build/photo-credits.json`.** Cities without a photo get a drawn scene instead.
- Photos of people: `assets/people/`, one per page, named after the page (`travel-nursing.jpg` goes with `travel-nursing.html`). The build puts the photo behind that page's hero automatically: drop in a JPG with the page's name and rebuild. The home page (`index.html`), `employers.html` and `about.html` are hand-written, so their photos are written directly in the HTML. Some photos come from Unsplash (free licence) and many were generated with AI (Z-Image-Turbo, Apache-2.0), including the home page team and the destination explorer's travel nurses (`vibe-*.jpg`). `build/people-photos.json` records the source of each one and feeds the credits page, which also says the AI-generated people are not real. Keep originals 2,400 px on the long side, sharp and with no blurred background, then run `python build/photo-sizes.py`.
- Fonts: Source Serif 4 (headings) and Plus Jakarta Sans (text), loaded from Google Fonts.

## Open items for whoever takes this over

- [ ] Connect a real job feed and allow `jobs.html` in search (see above).
- [ ] Finish the Microsoft 365 + Vercel form setup (see Forms) and test each of the six forms on the live site.
- [ ] The old Netlify site (mutexhealthcare2.netlify.app) still serves an old copy of the site. Delete it in the Netlify dashboard so search engines and visitors only find the Vercel site.
- [ ] Custom domain: when one is added, update `SITE_URL` and rebuild.
- [ ] Have someone at Mutex review the copy, especially pay and benefits, licensure guidance and the privacy page, before wider promotion.
- [ ] The comment at the top of `js/data.js` still calls the file "demo content". That is accurate for the jobs only; the contact details are real.

## History

The project started on 16 November 2026. Notable steps, oldest first:
built the site → interactive US map and guess-the-pay game → separate hiring and clinician home pages → search, social and AI-crawler markup → city photos on job cards with a credits page → clean addresses and Netlify tuning → security headers → forms sent to Netlify, demo wording removed → visual refresh ("less templated").

See `git log` for the full list.
