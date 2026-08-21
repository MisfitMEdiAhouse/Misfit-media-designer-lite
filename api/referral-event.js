const text = (value, max) => String(value ?? '').slice(0, max);

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const body = req.body || {};
  if (body.companyWebsite) return res.status(200).json({ ok: true });

  const event = {
    eventType: 'referral_click',
    anonymousId: text(body.anonymousId, 120),
    partnerKey: text(body.partnerKey, 80),
    moduleKey: text(body.moduleKey, 80),
    offerKey: text(body.offerKey, 120),
    source: text(body.source, 120),
    medium: text(body.medium, 120),
    campaign: text(body.campaign, 160),
    landingPage: text(body.landingPage, 500),
    outboundUrl: text(body.outboundUrl, 1000),
    clickId: text(body.clickId, 160),
    affiliateActive: Boolean(body.affiliateActive),
    occurredAt: new Date().toISOString(),
  };

  if (!event.anonymousId || !event.partnerKey || !event.clickId) {
    return res.status(400).json({ ok: false, error: 'anonymousId, partnerKey and clickId are required' });
  }

  console.log(JSON.stringify({ type: 'misfit_referral_event', ...event }));
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ ok: true, clickId: event.clickId });
}
