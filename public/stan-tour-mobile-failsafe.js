(() => {
  const path = location.pathname.replace(/\/+$/, '') || '/';
  if (path !== '/stan-hansen' && path !== '/egnyte') return;

  const STEP_SEVEN_AUDIO = 'https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/c4859a61-f430-4bc3-b180-12639a7d88e1.mp3';
  const STEP_SEVEN_TITLE = 'How Misfit protects the IP';
  const STEP_SEVEN_BODY = 'The private kernel is intentionally not exposed. Developers can inspect the contracts, input and output shapes, public decisions, audit evidence and benchmark behavior. They do not need the private policy maps, prompts, symbolic mappings or reconstruction material to integrate with the system.';

  function findGuidePanel(stepPattern) {
    return [...document.querySelectorAll('div.fixed')].find((panel) => stepPattern.test(panel.textContent || '')) || null;
  }

  function replaceText(root, pattern, replacement) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (pattern.test(node.nodeValue || '')) {
        node.nodeValue = (node.nodeValue || '').replace(pattern, replacement);
        return true;
      }
    }
    return false;
  }

  function forceStepSeven(panel) {
    if (!panel || !/Misfit voice guide\s*·\s*6\/7/i.test(panel.textContent || '')) return;

    try { window.__MISFIT_STAN_AUDIO__?.stopAll?.(); } catch (_) {}

    replaceText(panel, /Misfit voice guide\s*·\s*6\/7/i, 'Misfit voice guide · 7/7');

    const title = [...panel.querySelectorAll('h1,h2,h3,h4,div')].find((node) => (node.textContent || '').trim() === 'Why this matches Egnyte now');
    if (title) title.textContent = STEP_SEVEN_TITLE;

    const body = [...panel.querySelectorAll('p')].find((node) => /The hiring signals line up with the architecture/i.test(node.textContent || ''));
    if (body) body.textContent = STEP_SEVEN_BODY;

    document.getElementById('ip-boundary')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
      const audio = new Audio(STEP_SEVEN_AUDIO);
      audio.volume = 1;
      audio.playbackRate = 1;
      window.__MISFIT_STAN_FAILSAFE_AUDIO__ = audio;
      const play = audio.play();
      if (play?.catch) play.catch(() => {});
    } catch (_) {}

    window.dispatchEvent(new CustomEvent('misfit:stan-tour-failsafe', { detail: { from: 6, to: 7 } }));
  }

  function arm() {
    document.addEventListener('click', (event) => {
      const button = event.target?.closest?.('button');
      if (!button || !/^\s*Next\b/i.test(button.textContent || '')) return;

      const panel = findGuidePanel(/Misfit voice guide\s*·\s*6\/7/i);
      if (!panel || !panel.contains(button)) return;

      window.setTimeout(() => {
        const stillSix = findGuidePanel(/Misfit voice guide\s*·\s*6\/7/i);
        if (stillSix) forceStepSeven(stillSix);
      }, 220);
    }, true);

    document.addEventListener('touchend', (event) => {
      const button = event.target?.closest?.('button');
      if (!button || !/^\s*Next\b/i.test(button.textContent || '')) return;
      const panel = findGuidePanel(/Misfit voice guide\s*·\s*6\/7/i);
      if (!panel || !panel.contains(button)) return;

      window.setTimeout(() => {
        const stillSix = findGuidePanel(/Misfit voice guide\s*·\s*6\/7/i);
        if (stillSix) forceStepSeven(stillSix);
      }, 260);
    }, { passive: true, capture: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arm, { once: true });
  } else {
    arm();
  }
})();
