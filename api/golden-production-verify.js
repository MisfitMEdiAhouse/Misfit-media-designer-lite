export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  const activation = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/site-activation';
  const checkout = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/site-activation-checkout';
  const publicSite = 'https://misfitmediahouse.com/portfolio/golden-essence';
  try {
    const pageRes = await fetch(publicSite, { cache: 'no-store' });
    const pageHtml = await pageRes.text();
    const bridgeRes = await fetch('https://misfitmediahouse.com/golden-domain-suggestions.js', { cache: 'no-store' });
    const bridgeJs = await bridgeRes.text();

    const healthRes = await fetch(`${activation}/health`, { cache: 'no-store' });
    const health = await healthRes.json().catch(() => ({}));

    const statusRes = await fetch(`${activation}/status?site=golden-essence`, { cache: 'no-store' });
    const status = await statusRes.json().catch(() => ({}));

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
        situation: 'need_domain',
        selected_domain: 'goldenessenceutah.com',
        intake: {
          business_name: 'Golden Essence Therapeutics — production verification',
          selected_domain: 'goldenessenceutah.com',
          desired_domain: 'goldenessenceutah.com',
        },
        domain_lookup: {
          smoke_test: true,
          verification: '2026-08-23-domain-flow',
          source: 'godaddy_prechecked',
          available: true,
          price_cents: 1299,
        },
      }),
    });
    const checkoutBody = await checkoutRes.json().catch(() => ({}));

    const webhookRes = await fetch(`${activation}/webhook`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: 'evt_fake', type: 'checkout.session.completed', data: { object: {} } }),
    });
    const webhook = await webhookRes.json().catch(() => ({}));
    const checkoutUrl = String(checkoutBody.checkout_url || '');

    const pageWiring = pageHtml.includes('/golden-activation-wizard.js') && pageHtml.includes('/golden-domain-suggestions.js') && pageHtml.includes('/golden-preview-runtime.js');
    const domainBridge = bridgeJs.includes("'goldenessenceutah.com': { price_cents: 1299 }") && bridgeJs.includes("source: 'godaddy_prechecked'") && bridgeJs.includes('Needs final GoDaddy check');
    const allOk = pageRes.ok && bridgeRes.ok && pageWiring && domainBridge && healthRes.ok && health.ok === true && statusRes.ok && inspectRes.ok && checkoutRes.ok && checkoutUrl.startsWith('https://buy.stripe.com/') && checkoutUrl.includes('client_reference_id=') && Number(checkoutBody.amount_cents) === 29700 && webhookRes.status === 400;

    return res.status(200).json({
      ok: allOk,
      production: {
        public_site: { http: pageRes.status, activation_scripts_wired: pageWiring },
        domain_bridge: { http: bridgeRes.status, godaddy_prechecked_option_loaded: domainBridge },
        health: { http: healthRes.status, ok: health.ok === true, version: health.version || null },
        status: { http: statusRes.status, site_key: status.site_key || null, state: status.status || null, price_cents: status.activation_price_cents || null },
        existing_site_detection: { http: inspectRes.status, domain: inspect.domain || null, reachable: inspect.website_reachable ?? null, registrar_provider: inspect.registrar_provider || null, website_platform: inspect.website_platform || null, connection_provider: inspect.connection_provider || null },
        tracked_domain_checkout: { http: checkoutRes.status, intent_id: checkoutBody.intent_id || null, amount_cents: checkoutBody.amount_cents || null, payment_mode: checkoutBody.payment_mode || null, stripe_hosted: checkoutUrl.startsWith('https://buy.stripe.com/'), carries_client_reference: checkoutUrl.includes('client_reference_id=') },
        webhook_security: { http: webhookRes.status, rejects_unsigned_event: webhookRes.status === 400, error: webhook.error || null },
      },
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
}
