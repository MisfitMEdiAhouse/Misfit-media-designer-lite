(() => {
  const path = location.pathname.replace(/\/+$/, '') || '/';
  if (!['/portfolio/golden-essence', '/golden-essence', '/golden-essence-mobile'].includes(path)) return;

  const suggestions = [
    'goldenessencetherapy.com',
    'goldenessenceutah.com',
    'goldenessencetherapeuticsutah.com',
    'goldenessence-massage.com',
  ];

  function apply() {
    const wizard = document.getElementById('golden-activation-wizard');
    const input = wizard?.querySelector('#gw-domain-query');
    const results = wizard?.querySelector('#gw-domain-results');
    if (!wizard || !input || !results || wizard.querySelector('#gw-golden-suggestions')) return;

    const box = document.createElement('div');
    box.id = 'gw-golden-suggestions';
    box.style.marginTop = '14px';
    box.innerHTML = `
      <div style="font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#efbd61;margin-bottom:8px">Suggested .com alternatives</div>
      <div style="display:flex;flex-wrap:wrap;gap:7px">
        ${suggestions.map((domain) => `<button type="button" data-gw-suggest="${domain}" style="border:1px solid rgba(226,165,60,.38);border-radius:999px;background:rgba(226,165,60,.05);color:#f5d495;padding:8px 10px;font-size:10px;cursor:pointer">${domain}</button>`).join('')}
      </div>
      <div style="margin-top:7px;color:#829797;font-size:10px;line-height:1.45">These were checked as standard available options today. Tap one and the wizard re-checks availability before you choose it.</div>`;
    results.parentNode.insertBefore(box, results);

    box.querySelectorAll('[data-gw-suggest]').forEach((button) => {
      button.addEventListener('click', () => {
        input.value = button.dataset.gwSuggest;
        wizard.querySelector('#gw-domain-search')?.click();
      });
    });
  }

  apply();
  new MutationObserver(apply).observe(document.documentElement, { childList: true, subtree: true });
})();
