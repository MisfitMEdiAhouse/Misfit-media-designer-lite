(() => {
  const path = location.pathname.replace(/\/+$/, '') || '/';
  if (!['/portfolio/golden-essence', '/golden-essence', '/golden-essence-mobile'].includes(path)) return;

  const PROVIDER_KEY = 'misfit_golden_domain_provider_v1';
  const WIX_DOMAINS = 'https://manage.wix.com/account/domains';
  const CHECKOUT_PATHS = [
    'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/site-activation/create-checkout',
    'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/site-activation-checkout',
  ];

  function getProvider() {
    try { return sessionStorage.getItem(PROVIDER_KEY) || 'wix'; } catch (_) { return 'wix'; }
  }

  function setProvider(value) {
    try { sessionStorage.setItem(PROVIDER_KEY, value); } catch (_) {}
    apply();
  }

  // Golden Essence's owner already told Misfit she has Wix. Default this client
  // to Wix for domain ownership unless she explicitly chooses otherwise.
  if (!getProvider()) setProvider('wix');

  const nativeFetch = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    const url = typeof input === 'string' ? input : input?.url;
    if (CHECKOUT_PATHS.includes(url) && init?.method?.toUpperCase() === 'POST' && typeof init.body === 'string') {
      try {
        const body = JSON.parse(init.body);
        if (body?.situation === 'need_domain') {
          const provider = getProvider();
          body.intake = { ...(body.intake || {}), connection_provider: provider === 'wix' ? 'wix' : null };
          body.domain_lookup = { ...(body.domain_lookup || {}), preferred_provider: provider };
          init = { ...init, body: JSON.stringify(body) };
        }
      } catch (_) {}
    }
    return nativeFetch(input, init);
  };

  function providerCard() {
    const provider = getProvider();
    const wrap = document.createElement('div');
    wrap.id = 'gw-provider-choice';
    wrap.className = 'gw-notice';
    wrap.innerHTML = `
      <strong>Already have Wix? Perfect.</strong><br>
      Choose where you want the new domain managed. Your Golden Essence website stays exactly as built; Wix can own/manage the domain and point it to this site.
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px">
        <button type="button" data-domain-provider="wix" style="border:1px solid ${provider === 'wix' ? '#e2a53c' : 'rgba(255,255,255,.14)'};border-radius:14px;background:${provider === 'wix' ? 'rgba(226,165,60,.12)' : 'rgba(0,0,0,.15)'};color:#fff;padding:12px;text-align:left;cursor:pointer"><strong style="display:block;color:#fff4df">Use my Wix account</strong><span style="display:block;color:#9fb2b2;font-size:10px;margin-top:4px">Wix owns/manages the domain. Misfit connects it to this site.</span></button>
        <button type="button" data-domain-provider="misfit" style="border:1px solid ${provider !== 'wix' ? '#e2a53c' : 'rgba(255,255,255,.14)'};border-radius:14px;background:${provider !== 'wix' ? 'rgba(226,165,60,.12)' : 'rgba(0,0,0,.15)'};color:#fff;padding:12px;text-align:left;cursor:pointer"><strong style="display:block;color:#fff4df">Misfit handles registrar setup</strong><span style="display:block;color:#9fb2b2;font-size:10px;margin-top:4px">Use the normal owner-registration/delegate path instead.</span></button>
      </div>
      ${provider === 'wix' ? '<div style="margin-top:10px;color:#f0ce91;font-size:10px;line-height:1.5">Wix is the domain account — not the site editor. Moving this finished custom site into Wix Editor would be a separate migration.</div>' : ''}`;
    wrap.querySelectorAll('[data-domain-provider]').forEach((button) => button.addEventListener('click', () => setProvider(button.dataset.domainProvider)));
    return wrap;
  }

  function applyDomainStep(wizard) {
    const domainInput = wizard.querySelector('#gw-domain-query');
    if (!domainInput || wizard.querySelector('#gw-provider-choice')) return;
    const actions = wizard.querySelector('.gw-actions');
    if (!actions) return;
    actions.parentNode.insertBefore(providerCard(), actions);
  }

  function applyReview(wizard) {
    const review = wizard.querySelector('.gw-review');
    if (!review || wizard.querySelector('#gw-provider-review')) return;
    const situationText = [...review.querySelectorAll('div')].find((row) => row.textContent.includes('Your situation'))?.textContent || '';
    if (!situationText.includes('Need a new domain')) return;
    const provider = getProvider();
    const row = document.createElement('div');
    row.id = 'gw-provider-review';
    row.innerHTML = `<span>Domain account</span><strong>${provider === 'wix' ? 'Your Wix account' : 'Misfit-guided owner setup'}</strong>`;
    review.append(row);
  }

  function applyPaid(wizard) {
    const provider = getProvider();
    if (provider !== 'wix') return;
    const heading = wizard.querySelector('.gw-eyebrow');
    if (!heading || heading.textContent.trim() !== 'Activation paid') return;

    const actions = wizard.querySelector('.gw-actions');
    if (actions) {
      const link = actions.querySelector('a.gw-primary');
      if (link) {
        link.href = WIX_DOMAINS;
        link.textContent = 'Open Wix Domains →';
      } else if (!wizard.querySelector('#gw-open-wix-domains')) {
        const wix = document.createElement('a');
        wix.id = 'gw-open-wix-domains';
        wix.className = 'gw-primary';
        wix.href = WIX_DOMAINS;
        wix.target = '_blank';
        wix.rel = 'noopener noreferrer';
        wix.textContent = 'Open Wix Domains →';
        actions.prepend(wix);
      }
    }

    if (!wizard.querySelector('#gw-wix-external-host-note')) {
      const note = document.createElement('div');
      note.id = 'gw-wix-external-host-note';
      note.className = 'gw-notice';
      note.innerHTML = '<strong>Wix + Golden Essence:</strong> Your Wix account can own the domain while the finished Golden Essence website remains hosted externally. Misfit handles the DNS connection to the live site. You do not need to rebuild the site in Wix just to use a Wix-owned domain.';
      actions?.parentNode.insertBefore(note, actions);
    }
  }

  function apply() {
    const wizard = document.getElementById('golden-activation-wizard');
    if (!wizard || wizard.style.display === 'none') return;
    applyDomainStep(wizard);
    applyReview(wizard);
    applyPaid(wizard);
  }

  apply();
  new MutationObserver(apply).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
