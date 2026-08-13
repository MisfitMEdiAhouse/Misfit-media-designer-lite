const JSON_HEADERS = { 'Content-Type': 'application/json' };

export function send(res, status, body) {
  res.status(status);
  for (const [key, value] of Object.entries(JSON_HEADERS)) res.setHeader(key, value);
  return res.end(JSON.stringify(body));
}

export function requireAdmin(req, res) {
  const configured = process.env.MISFIT_ADMIN_API_KEY;
  if (!configured) {
    send(res, 503, { ok: false, error: 'DNS control is not configured yet.' });
    return false;
  }
  const auth = String(req.headers.authorization || '');
  if (auth !== `Bearer ${configured}`) {
    send(res, 401, { ok: false, error: 'Unauthorized' });
    return false;
  }
  return true;
}

export function normalizeZone(value) {
  const zone = String(value || '').trim().toLowerCase();
  if (!/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(zone)) {
    throw new Error('Invalid DNS zone');
  }
  return zone;
}

export function safeRecordPayload(body = {}) {
  const record = {
    name: String(body.name || '').trim(),
    type: String(body.type || '').trim().toUpperCase(),
    ttl: Number(body.ttl || 600),
  };
  const value = body.data ?? body.content;
  if (value !== undefined) record.data = String(value).trim();
  if (body.priority !== undefined) record.priority = Number(body.priority);
  if (body.weight !== undefined) record.weight = Number(body.weight);
  if (body.port !== undefined) record.port = Number(body.port);
  if (body.service !== undefined) record.service = String(body.service);
  if (body.protocol !== undefined) record.protocol = String(body.protocol);
  if (body.flag !== undefined) record.flag = Number(body.flag);
  if (body.tag !== undefined) record.tag = String(body.tag);
  return record;
}

export async function parseUpstream(res) {
  const text = await res.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch { return { raw: text }; }
}
