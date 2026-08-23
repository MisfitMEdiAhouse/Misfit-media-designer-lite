export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false });
  const checkout = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/site-activation-checkout';
  try {
    const response = await fetch(checkout, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        site_key: 'golden-essence',
        situation: 'need_domain',
        selected_domain: 'goldenessencetherapy.com',
        intake: {
          business_name: 'Golden Essence Therapeutics — Wix verification',
          selected_domain: 'goldenessencetherapy.com',
          desired_domain: 'goldenessencetherapy.com',
          connection_provider: 'wix'
        },
        domain_lookup: {
          domain: 'goldenessencetherapy.com',
          available: true,
          preferred_provider: 'wix',
          source: 'godaddy_prechecked',
          smoke_test: true
        }
      })
    });
    const data = await response.json().catch(() => ({}));
    return res.status(200).json({
      ok: response.ok && Boolean(data.intent_id) && String(data.checkout_url || '').startsWith('https://buy.stripe.com/'),
      http: response.status,
      intent_id: data.intent_id || null,
      amount_cents: data.amount_cents || null,
      stripe_hosted: String(data.checkout_url || '').startsWith('https://buy.stripe.com/'),
      carries_client_reference: String(data.checkout_url || '').includes('client_reference_id=')
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
}
