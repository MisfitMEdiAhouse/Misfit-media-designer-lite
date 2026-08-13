const UPSTREAM = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/lead-capture';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const body = req.body || {};
  if (body.companyWebsite) return res.status(200).json({ ok: true });

  const payload = {
    name: String(body.name || '').slice(0, 120),
    businessName: String(body.businessName || '').slice(0, 160),
    websiteUrl: String(body.websiteUrl || '').slice(0, 500),
    contact: String(body.contact || '').slice(0, 250),
    requestedService: String(body.requestedService || '').slice(0, 180),
    message: String(body.message || '').slice(0, 4000),
    source: 'misfitmediahouse_vercel',
    landingPage: String(body.landingPage || '/').slice(0, 500),
    companyWebsite: '',
  };

  if (!payload.contact) return res.status(400).json({ ok: false, error: 'Contact is required' });

  const upstream = await fetch(UPSTREAM, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await upstream.json().catch(() => ({}));
  return res.status(upstream.status).json(data);
}
