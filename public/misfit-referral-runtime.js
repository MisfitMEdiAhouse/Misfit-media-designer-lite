(() => {
  const REF_API = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/client-referral';
  const ACT_API = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/site-activation';
  const REF_STORAGE = 'misfit_client_referral_v1';
  const CUSTOMER_REF_STORAGE = 'misfit_customer_referral_v1';
  const SESSION_KEY = 'misfit_referral_session_v1';
  const REF_DAYS = 30;
  const CUSTOMER_REF_DAYS = 90;

  const cleanCode = (value) => {
    const code = String(value || '').trim().toLowerCase();
    return /^[a-z0-9][a-z0-9-]{1,78}$/.test(code) ? code : '';
  };

  function sessionId() {
    try {
      let value = sessionStorage.getItem(SESSION_KEY);
      if (!value) {
        value = crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        sessionStorage.setItem(SESSION_KEY, value);
      }
      return value;
    } catch (_) { return `${Date.now()}-${Math.random().toString(16).slice(2)}`; }
  }

  function detectClientSiteKey() {
    const explicit = document.querySelector('meta[name="misfit-client-site-key"]')?.content || document.documentElement.dataset.misfitClientSiteKey || window.MISFIT_CLIENT_SITE_KEY;
    if (cleanCode(explicit)) return cleanCode(explicit);
    if (document.querySelector('nav[aria-label="Golden Essence navigation"]')) return 'golden-essence';
    return '';
  }

  function saveAgencyReferral(code) {
    try { localStorage.setItem(REF_STORAGE, JSON.stringify({ code, expires_at: Date.now() + REF_DAYS * 86400000 })); } catch (_) {}
  }
  function loadAgencyReferral() {
    try {
      const item = JSON.parse(localStorage.getItem(REF_STORAGE) || '{}');
      if (!item?.code || !item?.expires_at || Number(item.expires_at) < Date.now()) { localStorage.removeItem(REF_STORAGE); return ''; }
      return cleanCode(item.code);
    } catch (_) { return ''; }
  }
  function saveCustomerReferral(siteKey, code) {
    try { localStorage.setItem(CUSTOMER_REF_STORAGE, JSON.stringify({ site_key: siteKey, code, expires_at: Date.now() + CUSTOMER_REF_DAYS * 86400000 })); } catch (_) {}
  }
  function loadCustomerReferral(siteKey) {
    try {
      const item = JSON.parse(localStorage.getItem(CUSTOMER_REF_STORAGE) || '{}');
      if (!item?.code || item?.site_key !== siteKey || !item?.expires_at || Number(item.expires_at) < Date.now()) { if (item?.site_key === siteKey) localStorage.removeItem(CUSTOMER_REF_STORAGE); return ''; }
      return cleanCode(item.code);
    } catch (_) { return ''; }
  }

  function trackAgency(eventType, code, extra = {}) {
    if (!code) return;
    fetch(`${REF_API}/track`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, keepalive: true,
      body: JSON.stringify({ referral_code: code, event_type: eventType, session_id: sessionId(), landing_path: `${location.pathname}${location.search}`.slice(0, 400), source: 'misfitmediahouse_web', ...extra }),
    }).catch(() => {});
  }
  function trackCustomer(siteKey, eventType, code, action = '') {
    if (!siteKey || !code) return;
    fetch(`${REF_API}/customer-track`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, keepalive: true,
      body: JSON.stringify({ site_key: siteKey, referrer_code: code, event_type: eventType, action, session_id: sessionId(), landing_path: `${location.pathname}${location.search}`.slice(0, 400), source: 'client_site' }),
    }).catch(() => {});
  }

  const params = new URLSearchParams(location.search);
  const inboundAgency = cleanCode(params.get('ref'));
  if (inboundAgency) { saveAgencyReferral(inboundAgency); trackAgency('landing', inboundAgency); }
  const activeAgencyReferral = () => inboundAgency || loadAgencyReferral();

  function decorateStripeLinks() {
    const code = activeAgencyReferral();
    if (!code) return;
    document.querySelectorAll('a[href^="https://buy.stripe.com/"]').forEach((anchor) => {
      try {
        const url = new URL(anchor.href);
        if (!url.searchParams.get('client_reference_id')) {
          url.searchParams.set('client_reference_id', `ref_${code}`);
          url.searchParams.set('utm_source', 'client_referral');
          anchor.href = url.toString();
        }
      } catch (_) {}
    });
  }

  const siteKey = detectClientSiteKey();
  const inboundCustomer = cleanCode(params.get('client_ref'));
  if (siteKey && inboundCustomer) {
    saveCustomerReferral(siteKey, inboundCustomer);
    trackCustomer(siteKey, 'landing', inboundCustomer, 'visit');
  }
  const activeCustomerReferral = () => siteKey ? (inboundCustomer || loadCustomerReferral(siteKey)) : '';

  document.addEventListener('click', (event) => {
    const stripeAnchor = event.target.closest?.('a[href^="https://buy.stripe.com/"]');
    const agencyCode = activeAgencyReferral();
    if (stripeAnchor && agencyCode) trackAgency('checkout_click', agencyCode, { offer: (stripeAnchor.textContent || '').trim().slice(0, 120) });

    const customerCode = activeCustomerReferral();
    if (!siteKey || !customerCode) return;
    const actionable = event.target.closest?.('a[href^="tel:"],a[href^="mailto:"],a[href*="book" i],a[href*="appointment" i],[data-referral-lead-action]');
    if (!actionable) return;
    const href = actionable.getAttribute?.('href') || '';
    const action = actionable.dataset?.referralLeadAction || (href.startsWith('tel:') ? 'phone' : href.startsWith('mailto:') ? 'email' : 'booking');
    trackCustomer(siteKey, 'lead_action', customerCode, action);
  }, true);

  async function addClientReferralTool() {
    const currentSiteKey = detectClientSiteKey();
    if (!currentSiteKey || document.getElementById('misfit-client-referral-link')) return;
    try {
      const statusRes = await fetch(`${ACT_API}/status?site=${encodeURIComponent(currentSiteKey)}`, { cache: 'no-store' });
      const status = await statusRes.json();
      if (!statusRes.ok || !status.activated) return;

      const nav = document.querySelector('nav[aria-label="Golden Essence navigation"]');
      if (nav) {
        const row = nav.firstElementChild || nav;
        const link = document.createElement('a');
        link.id = 'misfit-client-referral-link';
        link.href = `/client-referral.html?site=${encodeURIComponent(currentSiteKey)}`;
        link.textContent = 'Referral Center';
        link.style.cssText = 'display:flex;align-items:center;justify-content:center;border-radius:8px;padding:8px 4px;color:#e7b65d;text-decoration:none;font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;white-space:nowrap;';
        row.appendChild(link);
        if (getComputedStyle(row).display === 'grid') row.style.gridTemplateColumns = `repeat(${row.children.length},minmax(0,1fr))`;
        return;
      }

      const link = document.createElement('a');
      link.id = 'misfit-client-referral-link';
      link.href = `/client-referral.html?site=${encodeURIComponent(currentSiteKey)}`;
      link.textContent = 'Referral Center';
      link.style.cssText = 'position:fixed;right:14px;bottom:14px;z-index:1200;border:1px solid rgba(226,165,60,.45);border-radius:999px;background:#052629;color:#efc56d;padding:10px 13px;text-decoration:none;font:700 10px/1 Inter,system-ui;text-transform:uppercase;letter-spacing:.08em;box-shadow:0 10px 30px rgba(0,0,0,.35)';
      document.body.appendChild(link);
    } catch (_) {}
  }

  decorateStripeLinks();
  addClientReferralTool();
  new MutationObserver(() => { decorateStripeLinks(); addClientReferralTool(); }).observe(document.documentElement, { childList: true, subtree: true });
})();
