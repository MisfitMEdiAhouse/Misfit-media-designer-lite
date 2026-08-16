const UPSTREAM = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/roads-commerce-capture';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const body = req.body || {};
  if (body.companyWebsite) return res.status(200).json({ ok: true });

  const payload = {
    anonymousId: String(body.anonymousId || '').slice(0, 120),
    eventType: String(body.eventType || '').slice(0, 80),
    source: String(body.source || '').slice(0, 120),
    medium: String(body.medium || '').slice(0, 120),
    campaign: String(body.campaign || '').slice(0, 160),
    creatorToken: String(body.creatorToken || '').slice(0, 160),
    referralToken: String(body.referralToken || '').slice(0, 160),
    qrToken: String(body.qrToken || '').slice(0, 160),
    referrer: String(body.referrer || '').slice(0, 1000),
    landingPage: String(body.landingPage || '').slice(0, 1000),
    partnerKey: String(body.partnerKey || '').slice(0, 80),
    moduleKey: String(body.moduleKey || '').slice(0, 80),
    offerKey: String(body.offerKey || '').slice(0, 120),
    productSku: String(body.productSku || '').slice(0, 160),
    outboundUrl: String(body.outboundUrl || '').slice(0, 1500),
    clickId: String(body.clickId || '').slice(0, 160),
    revenueCents: body.revenueCents == null ? null : Number(body.revenueCents),
    vehicle: body.vehicle && typeof body.vehicle === 'object' ? body.vehicle : {},
    metadata: body.metadata && typeof body.metadata === 'object' ? body.metadata : {},
    companyWebsite: '',
  };

  if (!payload.anonymousId || !payload.eventType) {
    return res.status(400).json({ ok: false, error: 'anonymousId and eventType are required' });
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
    return res.status(502).json({ ok: false, error: 'Attribution service unavailable' });
  }
}
