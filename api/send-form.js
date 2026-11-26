/* Vercel Function: POST /api/send-form
   Receives a form from the site and emails it to the team through Microsoft 365 (Microsoft Graph,
   "send mail as" the company mailbox). No third-party form service, no npm packages.

   Settings live in Vercel (Project > Settings > Environment Variables), never in this file:
     M365_TENANT_ID      Directory (tenant) ID of the Microsoft 365 organisation
     M365_CLIENT_ID      Application (client) ID of the app registration "Mutex website forms"
     M365_CLIENT_SECRET  Client secret of that app registration (keep it secret)
     MAIL_FROM           Mailbox the emails are sent from, e.g. info@mutexcorp.com
     MAIL_TO             Where submissions go (comma-separated; defaults to MAIL_FROM)
   Until they are set, the function answers 503 and the site shows the phone number and email instead.

   The browser sends JSON: { form, page, fields: { name: value }, files: [{ name, type, data (base64) }] }. */
'use strict';

const FORMS = {
  'job-application': 'New job application',
  'talent-network': 'New talent network sign-up',
  referral: 'New referral',
  contact: 'New contact message',
  careers: 'New careers enquiry',
  'staff-request': 'New staff request',
};
const MAX_FIELDS = 40, MAX_VALUE = 5000, MAX_FILE = 3 * 1024 * 1024;
const FILE_TYPES = { pdf: 'application/pdf', doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
const EMAIL_RE = /^[^\s@<>",;]+@[^\s@<>",;]+\.[^\s@<>",;]+$/;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const label = (k) => k.replace(/[-_]+/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
const send = (res, status, body) => { res.statusCode = status; res.setHeader('Content-Type', 'application/json'); res.setHeader('Cache-Control', 'no-store'); res.end(JSON.stringify(body)); };

/* Only this site's own pages may post here (stops other websites using it to send mail) */
function sameSite(req) {
  const origin = req.headers.origin;
  if (!origin) return true; // same-origin form posts from some browsers carry no Origin
  try {
    const o = new URL(origin).host;
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    return o === host || /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(o);
  } catch (e) { return false; }
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body; // Vercel has already parsed it
  if (typeof req.body === 'string') return JSON.parse(req.body);
  const chunks = []; let size = 0;
  for await (const c of req) { size += c.length; if (size > 4.5 * 1024 * 1024) throw new Error('too-large'); chunks.push(c); }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

async function token(env) {
  const r = await fetch(`https://login.microsoftonline.com/${encodeURIComponent(env.M365_TENANT_ID)}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: env.M365_CLIENT_ID, client_secret: env.M365_CLIENT_SECRET, scope: 'https://graph.microsoft.com/.default', grant_type: 'client_credentials' }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.access_token) throw new Error(`token ${r.status} ${j.error || ''} ${j.error_description ? j.error_description.split('\r')[0] : ''}`.trim());
  return j.access_token;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return send(res, 405, { ok: false, error: 'method' }); }
  if (!sameSite(req)) return send(res, 403, { ok: false, error: 'origin' });

  const env = process.env;
  if (!env.M365_TENANT_ID || !env.M365_CLIENT_ID || !env.M365_CLIENT_SECRET || !env.MAIL_FROM) return send(res, 503, { ok: false, error: 'not-configured' });

  let body;
  try { body = await readJson(req); } catch (e) { return send(res, 400, { ok: false, error: 'bad-request' }); }
  const form = String(body && body.form || '');
  if (!FORMS[form]) return send(res, 400, { ok: false, error: 'unknown-form' });
  const raw = body.fields && typeof body.fields === 'object' ? body.fields : {};

  // Spam trap: people never see the _gotcha field, bots fill it in. Pretend it worked, send nothing.
  if (raw._gotcha) return send(res, 200, { ok: true });

  const fields = Object.entries(raw)
    .filter(([k, v]) => /^[\w-]{1,40}$/.test(k) && !k.startsWith('_') && k !== 'form-name' && (typeof v === 'string' || typeof v === 'number'))
    .slice(0, MAX_FIELDS)
    .map(([k, v]) => [k, String(v).trim().slice(0, MAX_VALUE)])
    .filter(([, v]) => v);
  if (!fields.length) return send(res, 400, { ok: false, error: 'empty' });

  const attachments = [];
  for (const f of (Array.isArray(body.files) ? body.files : []).slice(0, 2)) {
    const ext = String(f && f.name || '').split('.').pop().toLowerCase();
    if (!FILE_TYPES[ext] || typeof f.data !== 'string') return send(res, 400, { ok: false, error: 'file-type' });
    const bytes = Buffer.from(f.data, 'base64');
    if (!bytes.length || bytes.length > MAX_FILE) return send(res, 400, { ok: false, error: 'file-size' });
    const name = String(f.name).replace(/[^\w .()-]+/g, '_').slice(0, 120);
    attachments.push({ '@odata.type': '#microsoft.graph.fileAttachment', name, contentType: FILE_TYPES[ext], contentBytes: bytes.toString('base64') });
  }

  const get = (k) => (fields.find(([n]) => n === k) || [])[1] || '';
  const who = [get('first'), get('last')].join(' ').trim() || get('name');
  const reply = get('email');
  const page = typeof body.page === 'string' ? body.page.slice(0, 200) : '';
  const rows = fields.map(([k, v]) => `<tr><th align="left" valign="top" style="padding:6px 16px 6px 0;color:#555;font-weight:600;white-space:nowrap">${esc(label(k))}</th><td style="padding:6px 0">${esc(v).replace(/\n/g, '<br>')}</td></tr>`).join('');
  const html = `<div style="font-family:Segoe UI,Arial,sans-serif;font-size:14px;color:#111">
<p style="font-size:16px;margin:0 0 12px"><b>${esc(FORMS[form])}</b> from the Mutex Healthcare Staffing website.</p>
<table cellspacing="0" cellpadding="0">${rows}</table>
${attachments.length ? `<p style="color:#555">Attached: ${attachments.map((a) => esc(a.name)).join(', ')}</p>` : ''}
<p style="color:#888;font-size:12px;margin-top:20px">Sent from ${esc(page || 'the website')} · ${new Date().toUTCString()}${EMAIL_RE.test(reply) ? ' · Reply to this email to answer the sender.' : ''}</p></div>`;

  const to = (env.MAIL_TO || env.MAIL_FROM).split(',').map((s) => s.trim()).filter((s) => EMAIL_RE.test(s));
  const message = {
    subject: `${FORMS[form]}${who ? ': ' + who.slice(0, 80) : ''} (Mutex website)`,
    body: { contentType: 'HTML', content: html },
    toRecipients: to.map((address) => ({ emailAddress: { address } })),
    ...(EMAIL_RE.test(reply) ? { replyTo: [{ emailAddress: { address: reply, ...(who ? { name: who.slice(0, 80) } : {}) } }] } : {}),
    ...(attachments.length ? { attachments } : {}),
  };

  try {
    const r = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(env.MAIL_FROM)}/sendMail`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${await token(env)}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, saveToSentItems: false }),
    });
    if (r.status !== 202) {
      const detail = await r.text().catch(() => '');
      console.error('sendMail failed', r.status, detail.slice(0, 500));
      return send(res, 502, { ok: false, error: 'send-failed' });
    }
    return send(res, 200, { ok: true });
  } catch (e) {
    console.error('sendMail error', e.message);
    return send(res, 502, { ok: false, error: 'send-failed' });
  }
};
