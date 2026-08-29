const STAN_TITLE = 'Egnyte × Misfit — Governed Agent Technical Tour';
const STAN_DESCRIPTION = 'A live guided technical tour of consequence-aware agent governance: ContextForge, Castle Gate, Sentinel, public-safe proof, and the protected GHOSBC OS boundary.';
const STAN_URL = 'https://misfitmediahouse.com/stan-hansen';

function replaceTag(html, pattern, replacement) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html.replace('</head>', `  ${replacement}\n  </head>`);
}

export default async function handler(req, res) {
  try {
    const host = String(req.headers['x-forwarded-host'] || req.headers.host || 'misfitmediahouse.com').split(',')[0].trim();
    const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
    const shellUrl = `${proto}://${host}/`;
    const shellResponse = await fetch(shellUrl, { headers: { 'user-agent': 'Misfit-Stan-Meta-Shell/1.0' } });
    if (!shellResponse.ok) throw new Error(`shell HTTP ${shellResponse.status}`);

    let html = await shellResponse.text();
    html = replaceTag(html, /<title>[^<]*<\/title>/i, `<title>${STAN_TITLE}</title>`);
    html = replaceTag(html, /<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${STAN_DESCRIPTION}" />`);
    html = replaceTag(html, /<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${STAN_TITLE}" />`);
    html = replaceTag(html, /<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${STAN_DESCRIPTION}" />`);
    html = replaceTag(html, /<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${STAN_URL}" />`);
    html = replaceTag(html, /<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${STAN_URL}" />`);
    html = replaceTag(html, /<meta\s+name=["']twitter:card["'][^>]*>/i, '<meta name="twitter:card" content="summary" />');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300, must-revalidate');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
    res.status(200).send(html);
  } catch (error) {
    res.status(502).send(`Stan tour shell unavailable: ${String(error?.message || error)}`);
  }
}
