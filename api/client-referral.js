const UPSTREAM = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/client-referral';
const ALLOWED = new Set([
  'health','profile','qr','track','customer-profile','customer-code','customer-qr','customer-track','customer-stats'
]);

export default async function handler(req, res) {
  const path = String(req.query?.path || '').trim();
  if (!ALLOWED.has(path)) return res.status(404).json({ error: 'not_found' });
  if (!['GET','POST'].includes(req.method)) return res.status(405).json({ error: 'method_not_allowed' });

  const url = new URL(`${UPSTREAM}/${path}`);
  for (const [key, value] of Object.entries(req.query || {})) {
    if (key === 'path' || value == null) continue;
    const values = Array.isArray(value) ? value : [value];
    for (const item of values) url.searchParams.append(key, String(item));
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const init = {
      method: req.method,
      headers: { 'accept': req.headers.accept || '*/*' },
      signal: controller.signal,
    };
    if (req.method === 'POST') {
      init.headers['content-type'] = 'application/json';
      init.body = JSON.stringify(req.body || {});
    }
    const upstream = await fetch(url, init);
    const type = upstream.headers.get('content-type') || 'application/octet-stream';
    const body = Buffer.from(await upstream.arrayBuffer());
    res.status(upstream.status);
    res.setHeader('Content-Type', type);
    res.setHeader('Cache-Control', path.includes('qr') ? 'public, max-age=300' : 'no-store');
    res.setHeader('X-Misfit-Referral-Proxy', '1');
    return res.send(body);
  } catch (error) {
    const message = error?.name === 'AbortError' ? 'upstream_timeout' : 'upstream_unavailable';
    return res.status(502).json({ error: message });
  } finally {
    clearTimeout(timer);
  }
}
