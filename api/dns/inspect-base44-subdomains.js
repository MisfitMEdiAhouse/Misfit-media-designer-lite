const BASE = 'https://api.godaddy.com/v3/domains/zones';
const ZONE = 'misfitmediahouse.com';
const NAMES = ['ai','chat','contextforge'];

async function read(name) {
  const token = process.env.GODADDY_PAT;
  if (!token) throw new Error('GODADDY_PAT missing');
  const url = new URL(`${BASE}/${ZONE}/dns-records`);
  url.searchParams.set('name', name);
  url.searchParams.set('pageSize', '100');
  url.searchParams.set('totalRequired', 'true');
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
  return { status: res.status, ok: res.ok, data };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  if (req.method !== 'GET') return res.status(405).json({ ok: false });
  try {
    const entries = await Promise.all(NAMES.map(async (name) => [name, await read(name)]));
    return res.status(entries.every(([,v]) => v.ok) ? 200 : 502).json({ ok: true, zone: ZONE, records: Object.fromEntries(entries) });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
}
