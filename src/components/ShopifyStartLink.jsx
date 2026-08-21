import { SHOPIFY_AFFILIATE_ACTIVE, SHOPIFY_REFERRAL_URL } from '../config/shopifyReferral.js';

function anonymousId() {
  const key = 'misfit_referral_anon_id';
  try {
    const current = localStorage.getItem(key);
    if (current) return current;
    const created = `misfit_${crypto.randomUUID()}`;
    localStorage.setItem(key, created);
    return created;
  } catch {
    return `misfit_${crypto.randomUUID()}`;
  }
}

export default function ShopifyStartLink({ className = '', label = 'Start a Shopify store →', moduleKey = 'shopify_scanner' }) {
  const track = () => {
    const params = new URLSearchParams(window.location.search);
    fetch('/api/referral-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        anonymousId: anonymousId(),
        source: params.get('utm_source') || 'direct',
        medium: params.get('utm_medium') || '',
        campaign: params.get('utm_campaign') || '',
        referrer: document.referrer || '',
        landingPage: `${window.location.pathname}${window.location.search}`,
        partnerKey: 'shopify',
        moduleKey,
        offerKey: SHOPIFY_AFFILIATE_ACTIVE ? 'affiliate_signup' : 'official_signup',
        outboundUrl: SHOPIFY_REFERRAL_URL,
        clickId: `clk_${crypto.randomUUID()}`,
        affiliateActive: SHOPIFY_AFFILIATE_ACTIVE,
      }),
      keepalive: true,
    }).catch(() => {});
  };

  return (
    <span className="inline-flex flex-col items-center gap-1 sm:items-start">
      <a href={SHOPIFY_REFERRAL_URL} target="_blank" rel="noreferrer sponsored" onClick={track} className={className}>{label}</a>
      {SHOPIFY_AFFILIATE_ACTIVE ? <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-slate-700">Affiliate link · Misfit may earn a commission</span> : null}
    </span>
  );
}
