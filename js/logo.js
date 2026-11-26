/* Mutex Healthcare Staffing — logo.
   The MUTEX wordmark is redrawn as vector from the Mutex Corp logo. The healthcare version adds a
   first-aid tile in the light green of nurses' scrubs (white cross, navy heartbeat through it)
   and the name underneath, in Mutex blue. Standalone copies live in assets/brand/.
   MX.logoSVG(id, light, standalone)
     id         unique prefix for the gradient id (needed when a page shows the logo more than once)
     light      true = all white, for dark backgrounds
     standalone true = adds xmlns + font-family so the markup works as a .svg file */
(function () {
  'use strict';
  const root = typeof window !== 'undefined' ? window : globalThis;
  const MX = (root.MX = root.MX || {});

  const WORD =
    '<path d="M0 0H19V18H17.5Z"/><path d="M19 37V49H50V56H0V55L18 37Z"/>' +
    '<path d="M25 .5H27L50.5 24 62.5 12H75V56H56V31.5L50 37.5 44 31.5V43H25Z"/>' +
    '<path d="M81 12H100V33.5Q100 37 104 37H112V12H131V43H90Q81 43 81 34Z"/>' +
    '<path d="M32 0H225L274 49V36L294 56H262L213 7H39Z"/><path d="M137 6H156V43H137Z"/>' +
    '<path d="M172 12H212V19H181V25H193V31H181V37H212V43H162V22Q162 12 172 12Z"/>' +
    '<path d="M249 12H261.5L230.5 43H218Z"/><path d="M237 0H292L274 18V7H244Z"/><path d="M81 49H249L256 56H81Z"/>';
  /* The tile, and the white cross drawn on top of it */
  const TILE = 'M12 0H56V44L44 56H0V12Z';
  const CROSS = 'M21.5 9h13v12.5H47v13H34.5V47h-13V34.5H9v-13h12.5Z';
  const PULSE = 'M10.5 28h9.5l3-6.5 5 13 4-9.5 2 3h11.5';

  MX.LOGO_BLUE = ['#0f5fcb', '#164a9f', '#183574'];
  MX.LOGO_GREEN = ['#4fcdd0', '#33b5bd', '#1d97a3'];   /* scrubs teal-green, light to deeper */
  MX.logoSVG = function (id = 'mx', light = false, standalone = false) {
    const [c1, c2, c3] = MX.LOGO_BLUE;
    const [g1, g2, g3] = MX.LOGO_GREEN;
    const paint = light ? '#fff' : `url(#${id}b)`;
    const font = standalone ? ` font-family="'Plus Jakarta Sans','Segoe UI',Arial,sans-serif"` : '';
    const head = standalone
      ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 363 79" role="img" aria-label="Mutex Healthcare Staffing">'
      : '<svg class="logo-full" viewBox="0 0 363 79" aria-hidden="true">';
    const grad = (gid, a, b, c) => `<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="56" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${a}"/><stop offset=".5" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient>`;
    const defs = `<defs>${light ? '' : grad(`${id}b`, c1, c2, c3)}${grad(`${id}g`, g1, g2, g3)}</defs>`;
    return head + defs +
      `<path d="${TILE}" fill="url(#${id}g)"/>` +
      `<path d="${CROSS}" fill="#fff"/>` +
      `<path d="${PULSE}" fill="none" stroke="${c3}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<g fill="${paint}" transform="translate(68 0)">${WORD}</g>` +
      `<text x="69" y="76" textLength="293" lengthAdjust="spacing" font-size="13.5" font-weight="800" fill="${light ? '#fff' : c3}"${font}>HEALTHCARE STAFFING</text>` +
      '</svg>';
  };
})();
