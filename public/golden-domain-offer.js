(() => {
  const path = location.pathname.replace(/\/+$/, '') || '/';
  if (!['/portfolio/golden-essence', '/golden-essence', '/golden-essence-mobile'].includes(path)) return;

  const offer = 'First year of one standard domain up to $25 is included. Premium domains cost extra. Annual renewal after year one is the site owner’s responsibility.';

  const apply = () => {
    const note = document.getElementById('golden-preview-fine-print');
    if (note && !note.dataset.domainOfferUpdated) {
      const countdown = note.textContent.match(/^48-hour live preview[^.]*\./)?.[0];
      note.textContent = countdown
        ? `${countdown} $297 one-time activation includes the finished site, launch, custom-domain setup, and ${offer}`
        : `$297 one-time activation includes the finished site, launch, custom-domain setup, and ${offer}`;
      note.dataset.domainOfferUpdated = '1';
    }

    const expired = document.getElementById('golden-preview-expired');
    if (expired) {
      const paragraphs = [...expired.querySelectorAll('p')];
      const fine = paragraphs.at(-1);
      if (fine) fine.textContent = `At checkout, enter up to three domain choices. ${offer}`;
    }

    const processing = document.getElementById('golden-activation-processing');
    if (processing) {
      const p = processing.querySelector('p');
      if (p) p.textContent = 'Payment received. Activating the site and saving your three preferred domain choices…';
    }
  };

  apply();
  const observer = new MutationObserver(apply);
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
