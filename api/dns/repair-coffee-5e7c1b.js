const DOMAIN = 'coffeeandajoint.co';
const TARGET = 'https://coffeeandajoint-corrected.vercel.app/';

function decodeJwtPayload(token) {
  try {
    const parts = String(token || '').split('.');
    if (parts.length < 2) return {};
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  } catch { return {}; }
}

function collectIds(value, out = new Set()) {
  if (!value || typeof value !== 'object') return out;
  for (const [k, v] of Object.entries(value)) {
    if (/^(customer.?id|shopper.?id|account.?id|subaccount.?id|domain.?id|sub)$/i.test(k) && (typeof v === 'string' || typeof v === 'number')) out.add(String(v));
    if (v && typeof v === 'object') collectIds(v, out);
  }
  return out;
}

async function gd(path, token, options = {}) {
  return fetch(`https://api.godaddy.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });
}

async function discoverCustomerId(token) {
  const candidates = new Set([
    process.env.GODADDY_CUSTOMER_ID,
    process.env.GODADDY_SHOPPER_ID,
    process.env.CUSTOMER_ID,
    process.env.SHOPPER_ID,
  ].filter(Boolean).map(String));
  collectIds(decodeJwtPayload(token), candidates);

  for (const path of [`/v1/domains/${DOMAIN}`, '/v1/domains?limit=1000']) {
    try {
      const r = await gd(path, token);
      const text = await r.text();
      if (r.ok && text) collectIds(JSON.parse(text), candidates);
    } catch {}
  }

  const tried = [];
  for (const id of candidates) {
    try {
      const r = await gd(`/v2/customers/${encodeURIComponent(id)}/domains/forwards/${DOMAIN}`, token);
      tried.push(r.status);
      if ([200, 404].includes(r.status)) return { id, tried };
    } catch { tried.push(0); }
  }
  return { id: null, tried };
}

async function deleteApexARecords(token) {
  const r = await gd(`/v3/domains/zones/${DOMAIN}/dns-records?type=A&name=%40&pageSize=100&totalRequired=true`, token);
  if (!r.ok) return { ok: false, status: r.status };
  const j = await r.json();
  const items = Array.isArray(j?.items) ? j.items : Array.isArray(j) ? j : [];
  const deleted = [];
  for (const rec of items) {
    if (!rec?.recordId) continue;
    const d = await gd(`/v3/domains/zones/${DOMAIN}/dns-records/${encodeURIComponent(rec.recordId)}`, token, { method: 'DELETE' });
    deleted.push({ status: d.status });
  }
  return { ok: deleted.every(x => x.status >= 200 && x.status < 300), deleted };
}

async function putForward(token, customerId) {
  return gd(`/v2/customers/${encodeURIComponent(customerId)}/domains/forwards/${DOMAIN}`, token, {
    method: 'PUT',
    body: JSON.stringify({ fqdn: DOMAIN, type: 'REDIRECT_TEMPORARY', url: TARGET }),
  });
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const token = process.env.GODADDY_PAT;
  if (!token) return res.status(503).json({ ok: false, error: 'godaddy_not_configured' });
  try {
    const found = await discoverCustomerId(token);
    if (!found.id) return res.status(409).json({ ok: false, error: 'customer_id_not_discoverable', candidate_statuses: found.tried });

    let f = await putForward(token, found.id);
    let firstStatus = f.status;
    let firstText = await f.text();
    let dnsCleanup = null;

    if (!f.ok && [409, 422].includes(firstStatus)) {
      dnsCleanup = await deleteApexARecords(token);
      f = await putForward(token, found.id);
    }
    const finalText = await f.text();
    return res.status(f.ok ? 200 : 502).json({
      ok: f.ok,
      domain: DOMAIN,
      target: TARGET,
      redirect_type: 'temporary',
      first_status: firstStatus,
      first_error: firstText ? firstText.slice(0, 400) : null,
      dns_cleanup: dnsCleanup,
      final_status: f.status,
      final_error: f.ok ? null : (finalText ? finalText.slice(0, 400) : null)
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
}
