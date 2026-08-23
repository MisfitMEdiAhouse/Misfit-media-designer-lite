export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false });
  const base = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/site-activation';
  try {
    const healthRes = await fetch(`${base}/health`, { cache: 'no-store' });
    const health = await healthRes.json().catch(() => ({}));
    const checkoutRes = await fetch(`${base}/create-checkout`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        site_key: 'golden-essence',
        situation: 'not_sure',
        intake: { business_name: 'Golden Essence Therapeutics', submitted_from: 'smoke_test' },
        domain_lookup: { smoke_test: true }
      })
    });
    const checkout = await checkoutRes.json().catch(() => ({}));
    return res.status(200).json({
      ok: healthRes.ok && checkoutRes.ok && Boolean(checkout.checkout_url),
      health_status: healthRes.status,
      service_version: health.version || null,
      checkout_status: checkoutRes.status,
      intent_id: checkout.intent_id || null,
      checkout_session_id: checkout.checkout_session_id || null,
      has_checkout_url: Boolean(checkout.checkout_url),
      checkout_error: checkout.error || null
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
}
