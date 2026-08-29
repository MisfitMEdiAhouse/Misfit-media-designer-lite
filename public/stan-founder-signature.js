(() => {
  const path = location.pathname.replace(/\/+$/, '') || '/';
  if (path !== '/stan-hansen' && path !== '/egnyte') return;

  function mountSignature() {
    if (document.getElementById('misfit-founder-provenance')) return;
    const main = document.querySelector('main');
    if (!main) return;

    const section = document.createElement('section');
    section.id = 'misfit-founder-provenance';
    section.setAttribute('aria-label', 'Builder provenance');
    section.style.cssText = 'margin-top:24px;border:1px solid rgba(255,255,255,.08);border-radius:20px;background:rgba(255,255,255,.018);padding:16px 18px;color:#64748b;font-family:JetBrains Mono,monospace;';
    section.innerHTML = `
      <div style="font-size:9px;line-height:1.7;letter-spacing:.14em;text-transform:uppercase;color:#67e8f9;">Founder · AI Systems &amp; Linguistics Architect</div>
      <div style="margin-top:5px;font-size:11px;line-height:1.7;color:#cbd5e1;">Jonathan David Edward Price</div>
      <div style="margin-top:3px;font-size:9px;line-height:1.7;letter-spacing:.08em;text-transform:uppercase;color:#64748b;">Build device · Google Pixel 9</div>
    `;
    main.appendChild(section);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.setTimeout(mountSignature, 0), { once: true });
  } else {
    window.setTimeout(mountSignature, 0);
  }
})();
