import { normalizeZone, parseUpstream, requireAdmin, safeRecordPayload, send } from './_shared.js';

const BASE = 'https://api.godaddy.com/v3/domains/zones';

function headers(write = false) {
  const token = process.env.GODADDY_PAT;
  if (!token) return null;
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    ...(write ? { 'Content-Type': 'application/json' } : {}),
  };
}

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  const h = headers(req.method !== 'GET');
  if (!h) return send(res, 503, { ok: false, provider: 'godaddy', error: 'GODADDY_PAT is not configured.' });

  let zone;
  try { zone = normalizeZone(req.query.zone || req.body?.zone); }
  catch (error) { return send(res, 400, { ok: false, error: error.message }); }

  try {
    if (req.method === 'GET') {
      const url = new URL(`${BASE}/${encodeURIComponent(zone)}/dns-records`);
      url.searchParams.set('pageSize', String(Math.min(Number(req.query.pageSize || 100), 100)));
      url.searchParams.set('totalRequired', 'true');
      if (req.query.type) url.searchParams.set('type', String(req.query.type).toUpperCase());
      if (req.query.name) url.searchParams.set('name', String(req.query.name));
      const upstream = await fetch(url, { headers: h });
      const data = await parseUpstream(upstream);
      return send(res, upstream.status, { ok: upstream.ok, provider: 'godaddy', zone, data });
    }

    if (req.method === 'POST') {
      const record = safeRecordPayload(req.body?.record || req.body);
      const upstream = await fetch(`${BASE}/${encodeURIComponent(zone)}/dns-records`, {
        method: 'POST', headers: h, body: JSON.stringify(record),
      });
      const data = await parseUpstream(upstream);
      return send(res, upstream.status, { ok: upstream.ok, provider: 'godaddy', zone, data });
    }

    if (req.method === 'DELETE') {
      const recordId = String(req.query.recordId || req.body?.recordId || '').trim();
      if (!recordId) return send(res, 400, { ok: false, error: 'recordId is required' });
      const upstream = await fetch(`${BASE}/${encodeURIComponent(zone)}/dns-records/${encodeURIComponent(recordId)}`, {
        method: 'DELETE', headers: h,
      });
      const data = await parseUpstream(upstream);
      return send(res, upstream.status, { ok: upstream.ok, provider: 'godaddy', zone, data });
    }

    return send(res, 405, { ok: false, error: 'Method not allowed' });
  } catch (error) {
    return send(res, 502, { ok: false, provider: 'godaddy', zone, error: error.message });
  }
}
