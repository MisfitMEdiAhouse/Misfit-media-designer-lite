const UPSTREAM = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/roads-intake';

const text = (value, max) => String(value ?? '').slice(0, max);
const obj = (value) => value && typeof value === 'object' && !Array.isArray(value) ? value : {};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const body = req.body || {};
  if (body.companyWebsite) return res.status(200).json({ ok: true });

  const payload = {
    anonymousId: text(body.anonymousId, 120),
    action: text(body.action, 80),
    vehicle: obj(body.vehicle),
    metadata: obj(body.metadata),
    tier: text(body.tier, 50),
    vendorPreferences: obj(body.vendorPreferences),
    sourceAssetRef: text(body.sourceAssetRef, 1000),
    partnerKey: text(body.partnerKey, 80),
    productSku: text(body.productSku, 160),
    wheelSpec: obj(body.wheelSpec),
    tireSpec: obj(body.tireSpec),
    guideType: text(body.guideType, 80),
    title: text(body.title, 200),
    useCase: text(body.useCase, 300),
    assumptions: obj(body.assumptions),
    contact: obj(body.contact),
    tags: Array.isArray(body.tags) ? body.tags.slice(0, 30) : [],
    source: text(body.source, 120),
    companyWebsite: '',
  };

  if (!payload.anonymousId || !payload.action) {
    return res.status(400).json({ ok: false, error: 'anonymousId and action are required' });
  }

  try {
    const upstream = await fetch(UPSTREAM, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await upstream.json().catch(() => ({}));
    return res.status(upstream.status).json(data);
  } catch {
    return res.status(502).json({ ok: false, error: 'Roads intake service unavailable' });
  }
}
