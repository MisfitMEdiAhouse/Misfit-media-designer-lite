const text = (value, max) => String(value ?? '').slice(0, max);

async function persistReferral(event) {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://cibcxqrqiqvzpardbdrw.supabase.co';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return { persisted: false, reason: 'service_key_unavailable' };

  const response = await fetch(`${url}/rest/v1/partner_referral_clicks`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=ignore-duplicates,return=minimal',
    },
    body: JSON.stringify({
      click_id: event.clickId,
      anonymous_id: event.anonymousId,
      partner_key: event.partnerKey,
      module_key: event.moduleKey || null,
      offer_key: event.offerKey || null,
      source: event.source || null,
      medium: event.medium || null,
      campaign: event.campaign || null,
      landing_page: event.landingPage || null,
      outbound_url: event.outboundUrl || null,
      affiliate_active: event.affiliateActive,
      occurred_at: event.occurredAt,
    }),
  });

  if (!response.ok) throw new Error(`referral_persist_${response.status}`);
  return { persisted: true };
}

export default async function handler(req, res) {
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

  let persistence = { persisted: false };
  try {
    persistence = await persistReferral(event);
  } catch (error) {
    console.error(JSON.stringify({ type: 'misfit_referral_persist_error', clickId: event.clickId, message: String(error?.message || error) }));
  }

  console.log(JSON.stringify({ type: 'misfit_referral_event', ...event, persisted: persistence.persisted }));
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ ok: true, clickId: event.clickId, persisted: persistence.persisted });
}
