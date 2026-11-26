/* Local preview server. Behaves like Vercel (vercel.json) for the things plain file servers do not do:
   - clean addresses:  /about  serves  about.html
   - /_vercel/image?url=/assets/...  serves the original image (no resizing locally)
   - the headers from vercel.json, including the content security policy
   - /api/<name> runs the Vercel Function in api/<name>.js
   Run:  node build/serve.js   then open http://localhost:4173 */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = Number(process.argv[2]) || 4173;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.ico': 'image/x-icon',
};

/* The headers Vercel sends with every page (the "/(.*)" rule in vercel.json) */
function securityHeaders() {
  const file = path.join(ROOT, 'vercel.json');
  if (!fs.existsSync(file)) return {};
  const rule = (JSON.parse(fs.readFileSync(file, 'utf8')).headers || []).find((h) => h.source === '/(.*)');
  return Object.fromEntries(((rule && rule.headers) || []).map((h) => [h.key, h.value]));
}

http.createServer((req, res) => {
  /* /api/<name> runs api/<name>.js like a Vercel Function (settings come from this process's environment) */
  const api = /^\/api\/([\w-]+)$/.exec(req.url.split('?')[0]);
  if (api) {
    const fn = path.join(ROOT, 'api', api[1] + '.js');
    if (!fs.existsSync(fn)) { res.writeHead(404); return res.end('Not found'); }
    return Promise.resolve(require(fn)(req, res)).catch((e) => { console.error(e); res.writeHead(500); res.end('Function error'); });
  }
  if (req.method === 'POST') { req.resume(); res.writeHead(405); return res.end('Method not allowed'); } // as on Vercel
  const url = new URL(req.url, 'http://localhost');
  let p = decodeURIComponent(url.pathname);
  if (p === '/_vercel/image') p = url.searchParams.get('url') || '/';
  if (p.endsWith('/')) p += 'index.html';
  let file = path.normalize(path.join(ROOT, p));
  let status = 200;
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden'); }
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    if (fs.existsSync(file + '.html')) file += '.html';
    else { file = path.join(ROOT, '404.html'); status = 404; }
  }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(status, { ...securityHeaders(), 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(req.method === 'HEAD' ? undefined : data);
  });
}).listen(PORT, '127.0.0.1', () => console.log(`Mutex site preview: http://localhost:${PORT}`));
