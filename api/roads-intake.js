const INTAKE_UPSTREAM = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/roads-intake';
const EVENT_UPSTREAM = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/roads-commerce-capture';

const text = (value, max) => String(value ?? '').slice(0, max);
const obj = (value) => value && typeof value === 'object' && !Array.isArray(value) ? value : {};

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

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
    let { response: upstream, data } = await postJson(INTAKE_UPSTREAM, payload);

    // A Roads intake must never fail simply because analytics/session creation raced it.
    // Bootstrap the attribution session through the canonical event service, then retry once.
    if (upstream.status === 409) {
      const bootstrapPayload = {
        anonymousId: payload.anonymousId,
        eventType: 'session_bootstrap',
        source: payload.source || 'direct',
        moduleKey: 'roads_intake_recovery',
        vehicle: payload.vehicle,
        metadata: { ...payload.metadata, recovered_by: 'roads-intake-proxy' },
        companyWebsite: '',
      };
      const { response: bootstrap, data: bootstrapData } = await postJson(EVENT_UPSTREAM, bootstrapPayload);
      if (!bootstrap.ok || !bootstrapData?.ok) {
        return res.status(bootstrap.status || 502).json({
          ok: false,
          error: bootstrapData?.error || 'Roads session bootstrap failed',
          stage: 'session_bootstrap',
        });
      }
      ({ response: upstream, data } = await postJson(INTAKE_UPSTREAM, payload));
    }

    return res.status(upstream.status).json(data);
  } catch {
    return res.status(502).json({ ok: false, error: 'Roads intake service unavailable' });
  }
}
