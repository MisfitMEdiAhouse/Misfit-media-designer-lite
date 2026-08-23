(() => {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  if (!['/portfolio/golden-essence', '/golden-essence', '/golden-essence-mobile'].includes(pathname)) return;

  const STATUS_URL = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/site-activation/status?site=golden-essence';
  const CHECKOUT_URL = 'https://buy.stripe.com/9B6cN5caS66q4ym1wY8ww0y';
  const ACTIVATION_URL = '/golden-activate-v2.html';
  const processingReturn = new URLSearchParams(window.location.search).get('activation') === 'processing';
  let lastStatus = null;
  let countdownTick = null;
  let statusPoll = null;

  const formatRemaining = (seconds) => {
    const total = Math.max(0, Number(seconds || 0));
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  const activationButton = () => {
    const footer = document.querySelector('footer');
    if (!footer) return null;
    return footer.querySelector(`a[href="${ACTIVATION_URL}"]`) || footer.querySelector(`a[href="${CHECKOUT_URL}"]`) || footer.querySelector('a[href*="buy.stripe.com"]');
  };

  const ensureFinePrint = () => {
    const button = activationButton();
    if (!button) return null;
    let note = document.getElementById('golden-preview-fine-print');
    if (!note) {
      note = document.createElement('p');
      note.id = 'golden-preview-fine-print';
      note.style.maxWidth = '520px';
      note.style.margin = '14px auto 0';
      note.style.padding = '0 8px';
      note.style.fontSize = '11px';
      note.style.lineHeight = '1.55';
      note.style.color = 'rgba(229,217,197,.72)';
      note.style.letterSpacing = '.01em';
      button.insertAdjacentElement('afterend', note);
    }
    return { button, note };
  };

  const removeOverlay = () => {
    document.getElementById('golden-preview-expired')?.remove();
    document.getElementById('golden-activation-processing')?.remove();
    document.documentElement.style.removeProperty('overflow');
    document.body.style.removeProperty('overflow');
  };

  const createExpiredOverlay = () => {
    if (document.getElementById('golden-preview-expired')) return;
    removeOverlay();
    const overlay = document.createElement('div');
    overlay.id = 'golden-preview-expired';
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483000',
      display: 'grid',
      placeItems: 'center',
      padding: '24px',
      background: 'radial-gradient(circle at 50% 18%, #0d3737 0%, #011416 45%, #000b0d 100%)',
      color: '#f8efe0',
      fontFamily: 'Inter, system-ui, sans-serif',
      overflowY: 'auto',
    });

    const card = document.createElement('div');
    Object.assign(card.style, {
      width: 'min(560px, 100%)',
      padding: '34px 26px',
      border: '1px solid rgba(232,184,88,.52)',
      borderRadius: '30px',
      background: 'rgba(0,20,22,.76)',
      boxShadow: '0 28px 90px rgba(0,0,0,.55)',
      textAlign: 'center',
      backdropFilter: 'blur(10px)',
    });

    const mark = document.createElement('div');
    mark.textContent = '✦';
    Object.assign(mark.style, { color: '#e7b357', fontSize: '34px', marginBottom: '10px' });

    const eyebrow = document.createElement('div');
    eyebrow.textContent = 'GOLDEN ESSENCE THERAPEUTICS';
    Object.assign(eyebrow.style, {
      color: '#e7b357',
      fontSize: '12px',
      fontWeight: '700',
      letterSpacing: '.18em',
      marginBottom: '18px',
    });

    const title = document.createElement('h1');
    title.textContent = 'This live preview has ended.';
    Object.assign(title.style, {
      margin: '0',
      fontFamily: 'Georgia, serif',
      fontSize: 'clamp(34px, 9vw, 56px)',
      lineHeight: '1.02',
      fontWeight: '500',
      color: '#fff8eb',
    });

    const body = document.createElement('p');
    body.textContent = 'Activate the site for $297 to restore it permanently. No domain account or technical setup is required before payment.';
    Object.assign(body.style, {
      margin: '20px auto 0',
      maxWidth: '440px',
      color: 'rgba(248,239,224,.86)',
      fontSize: '16px',
      lineHeight: '1.65',
    });

    const buy = document.createElement('a');
    buy.href = ACTIVATION_URL;
    buy.textContent = 'Activate Site · $297';
    Object.assign(buy.style, {
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '54px',
      marginTop: '26px',
      padding: '0 28px',
      borderRadius: '999px',
      background: '#e2a53c',
      color: '#082f31',
      textDecoration: 'none',
      fontWeight: '800',
      letterSpacing: '.04em',
    });

    const fine = document.createElement('p');
    fine.textContent = 'The $297 is a one-time website activation. Ownership, domain choices, existing-site transfer, and access are handled clearly on the next page.';
    Object.assign(fine.style, {
      margin: '15px auto 0',
      maxWidth: '460px',
      color: 'rgba(219,205,182,.62)',
      fontSize: '11px',
      lineHeight: '1.55',
    });

    card.append(mark, eyebrow, title, body, buy, fine);
    overlay.append(card);
    document.body.append(overlay);
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  };

  const createProcessingOverlay = () => {
    if (!processingReturn || document.getElementById('golden-activation-processing')) return;
    const overlay = document.createElement('div');
    overlay.id = 'golden-activation-processing';
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2147482999',
      display: 'grid',
      placeItems: 'center',
      padding: '24px',
      background: 'rgba(0,12,14,.88)',
      color: '#fff6e7',
      fontFamily: 'Inter, system-ui, sans-serif',
      textAlign: 'center',
      backdropFilter: 'blur(10px)',
    });
    const box = document.createElement('div');
    box.style.maxWidth = '460px';
    const title = document.createElement('div');
    title.textContent = 'Payment received.';
    Object.assign(title.style, { fontFamily: 'Georgia, serif', fontSize: '42px', color: '#f1bd5d' });
    const copy = document.createElement('p');
    copy.textContent = 'Activating the site…';
    Object.assign(copy.style, { fontSize: '15px', lineHeight: '1.6', color: 'rgba(255,246,231,.82)' });
    box.append(title, copy);
    overlay.append(box);
    document.body.append(overlay);
  };

  const render = (state) => {
    lastStatus = state;
    const ui = ensureFinePrint();
    if (ui) {
      if (state.status === 'active') {
        const handoffDone = ['submitted', 'domain_review', 'delegate_access', 'dns_setup', 'handoff_ready', 'complete'].includes(state.launch_status);
        if (handoffDone) {
          ui.button.textContent = 'Paid · Launch Handoff Received';
          ui.button.removeAttribute('href');
          ui.button.setAttribute('aria-disabled', 'true');
          ui.button.style.pointerEvents = 'none';
          ui.button.style.opacity = '.82';
          ui.note.textContent = 'Payment received. Misfit has the domain/site handoff information and is handling the launch path.';
        } else {
          ui.button.textContent = 'Paid · Finish Launch Setup';
          ui.button.href = ACTIVATION_URL;
          ui.button.removeAttribute('aria-disabled');
          ui.button.style.pointerEvents = '';
          ui.button.style.opacity = '';
          ui.note.textContent = 'Payment received. Tap once to tell Misfit whether you need a domain, already own one, already have a site, or want us to guide you.';
        }
      } else if (state.status === 'preview') {
        ui.button.textContent = 'Activate this site · $297';
        ui.button.href = ACTIVATION_URL;
        ui.button.removeAttribute('aria-disabled');
        ui.button.style.pointerEvents = '';
        ui.button.style.opacity = '';
        ui.note.textContent = `48-hour live preview · ${formatRemaining(state.seconds_remaining)} remaining. $297 one-time activation buys the finished site and launch. No GoDaddy account or domain choice is required before payment.`;
      } else {
        ui.button.textContent = 'Preview Expired · Activate $297';
        ui.button.href = ACTIVATION_URL;
        ui.note.textContent = 'This 48-hour preview has ended. Activate once for $297. Misfit handles the domain/site handoff after payment.';
      }
    }

    if (state.status === 'expired') createExpiredOverlay();
    else if (state.status === 'active') removeOverlay();
    else if (processingReturn) createProcessingOverlay();
  };

  const refreshStatus = async () => {
    try {
      const response = await fetch(STATUS_URL, { cache: 'no-store', credentials: 'omit' });
      if (!response.ok) return;
      const state = await response.json();
      render(state);
    } catch (_) {
      // Fail open if the status service is temporarily unreachable.
    }
  };

  const boot = () => {
    refreshStatus();
    statusPoll = window.setInterval(refreshStatus, processingReturn ? 1800 : 30000);
    countdownTick = window.setInterval(() => {
      if (!lastStatus || lastStatus.status !== 'preview') return;
      lastStatus.seconds_remaining = Math.max(0, Number(lastStatus.seconds_remaining || 0) - 30);
      render(lastStatus);
      if (lastStatus.seconds_remaining <= 0) refreshStatus();
    }, 30000);

    const observer = new MutationObserver(() => {
      if (lastStatus && !document.getElementById('golden-preview-fine-print')) render(lastStatus);
    });
    observer.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });

    window.addEventListener('beforeunload', () => {
      if (statusPoll) clearInterval(statusPoll);
      if (countdownTick) clearInterval(countdownTick);
      observer.disconnect();
    }, { once: true });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
