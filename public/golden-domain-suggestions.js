(() => {
  const path = location.pathname.replace(/\/+$/, '') || '/';
  if (!['/portfolio/golden-essence', '/golden-essence', '/golden-essence-mobile'].includes(path)) return;

  const DOMAIN_SEARCH_URL = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/site-activation/domain-search';
  const checkedAt = '2026-08-23';
  const verified = {
    'goldenessencetherapy.com': { price_cents: 1299 },
    'goldenessenceutah.com': { price_cents: 1299 },
    'goldenessencetherapeuticsutah.com': { price_cents: 1299 },
    'goldenessence-massage.com': { price_cents: 1299 },
  };
  const suggestions = Object.keys(verified);

  // Until the reusable GoDaddy read-only API credential is approved, use the
  // exact GoDaddy results already checked for this client. This prevents the
  // RDAP fallback from incorrectly blocking a domain GoDaddy says is available.
  const nativeFetch = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    const url = typeof input === 'string' ? input : input?.url;
    if (typeof url === 'string' && url.startsWith(DOMAIN_SEARCH_URL)) {
      try {
        const parsed = new URL(url);
        const query = (parsed.searchParams.get('q') || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
        const item = verified[query];
        if (item) {
          return new Response(JSON.stringify({
            source: 'godaddy_prechecked',
            definitive_search: false,
            checked_at: checkedAt,
            results: [{
              domain: query,
              available: true,
              definitive: false,
              price_cents: item.price_cents,
              renewal_cents: null,
              currency: 'USD',
              included: true,
              requires_approval: false,
              source: 'godaddy_prechecked',
              note: `GoDaddy checked available ${checkedAt}; final availability is verified again before registration.`,
            }],
          }), { status: 200, headers: { 'content-type': 'application/json' } });
        }
      } catch (_) {}
    }
    return nativeFetch(input, init);
  };

  function apply() {
    const wizard = document.getElementById('golden-activation-wizard');
    const input = wizard?.querySelector('#gw-domain-query');
    const results = wizard?.querySelector('#gw-domain-results');
    if (!wizard || !input || !results) return;

    // The generic registry fallback is advisory only. Never tell a client a
    // domain is definitively taken when GoDaddy's definitive search is not live.
    results.querySelectorAll('.gw-badge.bad').forEach((badge) => {
      if (badge.textContent.trim().toLowerCase() === 'taken') {
        badge.textContent = 'Needs final GoDaddy check';
        badge.classList.remove('bad');
        badge.classList.add('warn');
      }
    });

    if (wizard.querySelector('#gw-golden-suggestions')) return;
    const box = document.createElement('div');
    box.id = 'gw-golden-suggestions';
    box.style.marginTop = '14px';
    box.innerHTML = `
      <div style="font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#efbd61;margin-bottom:8px">GoDaddy-checked .com options</div>
      <div style="display:flex;flex-wrap:wrap;gap:7px">
        ${suggestions.map((domain) => `<button type="button" data-gw-suggest="${domain}" style="border:1px solid rgba(226,165,60,.38);border-radius:999px;background:rgba(226,165,60,.05);color:#f5d495;padding:8px 10px;font-size:10px;cursor:pointer">${domain}</button>`).join('')}
      </div>
      <div style="margin-top:7px;color:#829797;font-size:10px;line-height:1.45">Checked with GoDaddy on Aug 23 at standard pricing. Tap one to select it; final availability is verified again before registration.</div>`;
    results.parentNode.insertBefore(box, results);

    box.querySelectorAll('[data-gw-suggest]').forEach((button) => {
      button.addEventListener('click', () => {
        input.value = button.dataset.gwSuggest;
        wizard.querySelector('#gw-domain-search')?.click();
      });
    });
  }

  apply();
  new MutationObserver(apply).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
