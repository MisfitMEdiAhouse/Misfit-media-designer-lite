export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  const activation = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/site-activation';
  const checkout = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/site-activation-checkout';
  try {
    const healthRes = await fetch(`${activation}/health`, { cache: 'no-store' });
    const health = await healthRes.json().catch(() => ({}));

    const statusRes = await fetch(`${activation}/status?site=golden-essence`, { cache: 'no-store' });
    const status = await statusRes.json().catch(() => ({}));

    const domainRes = await fetch(`${activation}/domain-search?q=${encodeURIComponent('goldenessencetherapy.com')}`, { cache: 'no-store' });
    const domain = await domainRes.json().catch(() => ({}));

    const inspectRes = await fetch(`${activation}/inspect-existing`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ value: 'misfitmediahouse.com' }),
    });
    const inspect = await inspectRes.json().catch(() => ({}));

    const checkoutRes = await fetch(checkout, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        site_key: 'golden-essence',
        situation: 'not_sure',
        intake: { business_name: 'Golden Essence Therapeutics — production verification' },
        domain_lookup: { smoke_test: true, verification: '2026-08-23' },
      }),
    });
    const checkoutBody = await checkoutRes.json().catch(() => ({}));

    const webhookRes = await fetch(`${activation}/webhook`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: 'evt_fake', type: 'checkout.session.completed', data: { object: {} } }),
    });
    const webhook = await webhookRes.json().catch(() => ({}));

    const domainResults = Array.isArray(domain.results) ? domain.results : [];
    const exact = domainResults.find((x) => x?.domain === 'goldenessencetherapy.com') || domainResults[0] || null;
    const checkoutUrl = String(checkoutBody.checkout_url || '');

    return res.status(200).json({
      ok: healthRes.ok && statusRes.ok && domainRes.ok && inspectRes.ok && checkoutRes.ok && webhookRes.status === 400,
      production: {
        health: { http: healthRes.status, ok: health.ok === true, version: health.version || null },
        status: { http: statusRes.status, site_key: status.site_key || null, state: status.status || null, price_cents: status.activation_price_cents || null },
        domain_search: { http: domainRes.status, source: domain.source || null, definitive: domain.definitive_search === true, exact_domain: exact?.domain || null, available: exact?.available ?? null },
        existing_site_detection: { http: inspectRes.status, domain: inspect.domain || null, reachable: inspect.website_reachable ?? null, registrar_provider: inspect.registrar_provider || null, website_platform: inspect.website_platform || null, connection_provider: inspect.connection_provider || null },
        tracked_checkout: { http: checkoutRes.status, intent_id: checkoutBody.intent_id || null, amount_cents: checkoutBody.amount_cents || null, payment_mode: checkoutBody.payment_mode || null, stripe_hosted: checkoutUrl.startsWith('https://buy.stripe.com/'), carries_client_reference: checkoutUrl.includes('client_reference_id=') },
        webhook_security: { http: webhookRes.status, rejects_unsigned_event: webhookRes.status === 400, error: webhook.error || null },
      },
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
}
