(() => {
  if (location.pathname !== '/stan-hansen' && location.pathname !== '/egnyte') return;
  if (!('speechSynthesis' in window)) return;

  const clips = new Map([
    [
      'Stan, Egnyte already owns an unusually strong enterprise content and permission layer. The point of this tour is not to replace it. The question is what happens one layer downstream, when an agent has legitimate access and now wants to take action.',
      'https://resource2.heygen.ai/text_to_speech/254fc751702744ee9e2726b8a79ebad1/4d7fe569a30a42c0b213d788aa0dd411/id=99e6fd08-af19-4ea3-a511-900906eef13f.wav',
    ],
    [
      'GHOSBC adds consequence-aware routing after access is granted. It can distinguish a technically allowed action from a contextually appropriate one, preserve the legitimate goal, replan weak actions, selectively escalate to humans, and emit a bounded audit receipt.',
      'https://resource2.heygen.ai/text_to_speech/254fc751702744ee9e2726b8a79ebad1/4d7fe569a30a42c0b213d788aa0dd411/id=933ccffb-83d8-41ef-8cd0-264a6479a610.wav',
    ],
    [
      'Keep Egnyte as the trusted content and identity boundary. ContextForge grounds proposed changes in system context. Castle Gate evaluates consequences before execution. Sentinel watches the runtime. GHOSBC stays protected behind those interfaces and returns only bounded decisions.',
      'https://resource2.heygen.ai/text_to_speech/254fc751702744ee9e2726b8a79ebad1/4d7fe569a30a42c0b213d788aa0dd411/id=22dcbd9d-e4a8-4ade-a764-53d382807468.wav',
    ],
    [
      'Egnyte is already adopting an AI-native software development lifecycle. ContextForge is relevant because it gives a coding agent more than source text. It can ground a change in metadata, ownership, lineage and architecture before that change ever reaches Castle Gate.',
      'https://resource2.heygen.ai/text_to_speech/254fc751702744ee9e2726b8a79ebad1/4d7fe569a30a42c0b213d788aa0dd411/id=dca8b502-13ff-498e-8d62-a132be05260d.wav',
    ],
    [
      'This interactive preflight is illustrative. Switch between safe reads, external messages, CRM mutations and destructive actions. Egnyte governs access and tool permission. Castle Gate adds consequence and authority checks. Sentinel adds runtime awareness.',
      'https://resource2.heygen.ai/text_to_speech/254fc751702744ee9e2726b8a79ebad1/4d7fe569a30a42c0b213d788aa0dd411/id=a00b0efc-ca1d-4ce6-abe0-cbdf5e3d6140.wav',
    ],
    [
      'The hiring signals line up with the architecture. Egnyte is recruiting leadership for developer ecosystem and integrations, professional services AI focused on MCP and agentic architecture, and senior platform engineers working with AI-assisted development.',
      'https://resource2.heygen.ai/text_to_speech/254fc751702744ee9e2726b8a79ebad1/4d7fe569a30a42c0b213d788aa0dd411/id=007396d1-3994-4001-a4a6-dc8f3b7d62fb.wav',
    ],
    [
      'The private kernel is intentionally not exposed. Developers can inspect the contracts, input and output shapes, public decisions, audit evidence and benchmark behavior. They do not need the private policy maps, prompts, symbolic mappings or reconstruction material to integrate with the system.',
      'https://resource2.heygen.ai/text_to_speech/254fc751702744ee9e2726b8a79ebad1/4d7fe569a30a42c0b213d788aa0dd411/id=78e05bea-0765-47bf-9fc9-6be2444f711d.wav',
    ],
  ]);

  const OUTRO_AUDIO = 'https://resource2.heygen.ai/text_to_speech/254fc751702744ee9e2726b8a79ebad1/4d7fe569a30a42c0b213d788aa0dd411/id=c2f2d374-d692-4303-b82f-ce6446b5c107.wav';

  const synth = window.speechSynthesis;
  const nativeCancel = typeof synth.cancel === 'function' ? synth.cancel.bind(synth) : () => {};
  const player = new Audio();
  const finalePlayer = new Audio();
  player.preload = 'auto';
  finalePlayer.preload = 'auto';
  let activeUtterance = null;
  let primed = false;

  const stopNeural = () => {
    try {
      player.pause();
      player.currentTime = 0;
    } catch (_) {}
    if (activeUtterance && typeof activeUtterance.onend === 'function') {
      const ended = activeUtterance;
      activeUtterance = null;
      try { ended.onend(); } catch (_) {}
    } else {
      activeUtterance = null;
    }
  };

  const stopFinale = () => {
    try {
      finalePlayer.pause();
      finalePlayer.currentTime = 0;
    } catch (_) {}
  };

  synth.cancel = () => {
    stopNeural();
    try { nativeCancel(); } catch (_) {}
  };

  synth.speak = (utterance) => {
    const text = String(utterance?.text || '').trim();
    const src = clips.get(text);

    // Deliberately never fall back to device/browser TTS on this tour.
    if (!src) {
      console.warn('[Misfit Voice] Neural clip missing; browser TTS suppressed.');
      if (typeof utterance?.onerror === 'function') {
        try { utterance.onerror(new Event('error')); } catch (_) {}
      }
      return;
    }

    stopNeural();
    activeUtterance = utterance;
    player.src = src;
    player.volume = Number.isFinite(utterance?.volume) ? utterance.volume : 1;

    player.onplay = () => {
      if (activeUtterance === utterance && typeof utterance.onstart === 'function') {
        try { utterance.onstart(); } catch (_) {}
      }
    };
    player.onended = () => {
      if (activeUtterance === utterance) {
        activeUtterance = null;
        if (typeof utterance.onend === 'function') {
          try { utterance.onend(); } catch (_) {}
        }
      }
    };
    player.onerror = () => {
      if (activeUtterance === utterance) activeUtterance = null;
      if (typeof utterance.onerror === 'function') {
        try { utterance.onerror(new Event('error')); } catch (_) {}
      }
    };

    const promise = player.play();
    if (promise?.catch) {
      promise.catch(() => {
        if (activeUtterance === utterance) activeUtterance = null;
        if (typeof utterance.onerror === 'function') {
          try { utterance.onerror(new Event('error')); } catch (_) {}
        }
      });
    }
  };

  const prime = () => {
    if (primed) return;
    primed = true;
    const first = clips.values().next().value;
    if (!first) return;
    player.src = first;
    player.volume = 0;
    const promise = player.play();
    if (promise?.then) {
      promise.then(() => {
        player.pause();
        player.currentTime = 0;
        player.volume = 1;
      }).catch(() => { player.volume = 1; });
    }
  };
  document.addEventListener('pointerdown', prime, { once: true, capture: true });
  document.addEventListener('keydown', prime, { once: true, capture: true });

  const closeCompletion = () => {
    stopFinale();
    document.getElementById('misfit-tour-complete')?.remove();
  };

  const buttonStyle = 'display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:14px;padding:12px 16px;font:700 10px/1 JetBrains Mono,monospace;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;';

  const showCompletion = (guidePanel) => {
    if (document.getElementById('misfit-tour-complete')) return;

    stopNeural();
    const closeGuide = guidePanel?.querySelector('button[aria-label="Close tour"]');
    try { closeGuide?.click(); } catch (_) {}

    const overlay = document.createElement('div');
    overlay.id = 'misfit-tour-complete';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Misfit guided tour complete');
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '120',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      padding: '18px',
      background: 'rgba(0,0,0,.72)',
      backdropFilter: 'blur(12px)',
    });

    overlay.innerHTML = `
      <div style="width:min(720px,100%);max-height:90vh;overflow:auto;border:1px solid rgba(103,232,249,.26);border-radius:28px;background:linear-gradient(145deg,rgba(2,6,23,.98),rgba(0,0,0,.98));box-shadow:0 24px 90px rgba(8,145,178,.22);padding:24px;color:white;font-family:Inter,sans-serif;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;">
          <div>
            <div style="font:600 10px/1 JetBrains Mono,monospace;letter-spacing:.16em;text-transform:uppercase;color:#67e8f9;">✓ Guided tour complete</div>
            <h2 style="margin:10px 0 0;font:700 clamp(28px,7vw,46px)/1.02 Inter Tight,Inter,sans-serif;letter-spacing:-.035em;">EGNYTE KEEPS THE TRUST.<br><span style="color:#67e8f9;">MISFIT GOVERNS WHAT HAPPENS NEXT.</span></h2>
          </div>
          <button id="misfit-tour-complete-close" aria-label="Close summary" style="flex:none;width:42px;height:42px;border-radius:999px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.03);color:#cbd5e1;font-size:20px;">×</button>
        </div>

        <p style="margin:18px 0 0;color:#a7b0c0;font-size:14px;line-height:1.8;">You finished the guided tour. The core idea is complementary: Egnyte remains the content, identity and permission authority. ContextForge adds system context, Castle Gate evaluates consequential actions before execution, Sentinel watches runtime behavior, and GHOSBC preserves the legitimate objective while keeping the private kernel sealed.</p>

        <div style="margin-top:20px;padding:16px;border:1px solid rgba(167,139,250,.18);border-radius:18px;background:rgba(139,92,246,.05);">
          <div style="font:600 10px/1 JetBrains Mono,monospace;letter-spacing:.14em;text-transform:uppercase;color:#d8b4fe;">What Egnyte could gain</div>
          <div style="margin-top:10px;color:#d5d9e2;font-size:13px;line-height:1.75;">More autonomous agent workflows without treating every write the same; consequence-aware approvals; safer replanning instead of dead-end refusals; runtime drift detection; and measurable raw-vs-governed evidence developers can inspect without receiving GHOSBC source or protected policy internals.</div>
        </div>

        <div style="margin-top:22px;font:600 10px/1 JetBrains Mono,monospace;letter-spacing:.15em;text-transform:uppercase;color:#67e8f9;">A clean next move</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin-top:12px;">
          <div style="border:1px solid rgba(255,255,255,.09);border-radius:16px;padding:15px;background:rgba(255,255,255,.025);"><div style="color:#67e8f9;font:600 10px/1 JetBrains Mono,monospace;">01 · BOUND IT</div><div style="margin-top:9px;color:#d5d9e2;font-size:13px;line-height:1.55;">Choose one real, low-risk Egnyte agent or MCP workflow with a clear objective and authority boundary.</div></div>
          <div style="border:1px solid rgba(255,255,255,.09);border-radius:16px;padding:15px;background:rgba(255,255,255,.025);"><div style="color:#d8b4fe;font:600 10px/1 JetBrains Mono,monospace;">02 · RUN IT TWICE</div><div style="margin-top:9px;color:#d5d9e2;font-size:13px;line-height:1.55;">Run the same objective through the existing path and the governed path. Change one variable: the Misfit control loop.</div></div>
          <div style="border:1px solid rgba(255,255,255,.09);border-radius:16px;padding:15px;background:rgba(255,255,255,.025);"><div style="color:#6ee7b7;font:600 10px/1 JetBrains Mono,monospace;">03 · LET EVIDENCE WIN</div><div style="margin-top:9px;color:#d5d9e2;font-size:13px;line-height:1.55;">Compare blocks, false refusals, goal completion, escalation and audit completeness. Expand only if the delta is real.</div></div>
        </div>

        <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:22px;">
          <a href="/agent-evaluation-lab" style="${buttonStyle}background:#67e8f9;color:#020617;">Open raw vs governed lab →</a>
          <a href="#preflight-lab" id="misfit-tour-revisit-preflight" style="${buttonStyle}border:1px solid rgba(255,255,255,.12);color:#e2e8f0;">Revisit preflight</a>
          <a href="/signal" style="${buttonStyle}border:1px solid rgba(217,70,239,.28);color:#f0abfc;">Explore Misfit Trader</a>
          <a href="/portfolio" style="${buttonStyle}border:1px solid rgba(255,255,255,.12);color:#e2e8f0;">Explore all Misfit</a>
        </div>

        <div style="margin-top:20px;padding-top:16px;border-top:1px solid rgba(255,255,255,.08);display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;color:#64748b;font:500 9px/1.6 JetBrains Mono,monospace;letter-spacing:.08em;text-transform:uppercase;">
          <span>GHOSBC kernel remains private</span><span>Built entirely from a phone · Misfit Mediahouse</span>
        </div>
      </div>`;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const dismiss = () => {
      document.body.style.overflow = '';
      closeCompletion();
    };
    overlay.querySelector('#misfit-tour-complete-close')?.addEventListener('click', dismiss);
    overlay.addEventListener('click', (event) => { if (event.target === overlay) dismiss(); });
    overlay.querySelector('#misfit-tour-revisit-preflight')?.addEventListener('click', () => {
      dismiss();
      setTimeout(() => document.getElementById('preflight-lab')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
    });

    finalePlayer.src = OUTRO_AUDIO;
    finalePlayer.volume = 1;
    const outro = finalePlayer.play();
    if (outro?.catch) outro.catch(() => {});
  };

  const enhanceFinalStep = () => {
    const label = [...document.querySelectorAll('div')].find((node) => /Misfit voice guide\s*·\s*7\/7/i.test(node.textContent || ''));
    if (!label) return;
    const panel = label.closest('.fixed');
    if (!panel) return;

    if (!panel.querySelector('[data-misfit-final-step="1"]')) {
      const marker = document.createElement('span');
      marker.dataset.misfitFinalStep = '1';
      marker.textContent = 'FINAL STEP';
      Object.assign(marker.style, {
        display: 'inline-flex',
        marginLeft: '8px',
        padding: '3px 6px',
        borderRadius: '999px',
        border: '1px solid rgba(110,231,183,.25)',
        color: '#6ee7b7',
        fontSize: '8px',
        letterSpacing: '.12em',
      });
      label.appendChild(marker);
    }

    const nextButton = [...panel.querySelectorAll('button')].find((button) => /^\s*Next/i.test(button.textContent || ''));
    if (!nextButton || nextButton.dataset.misfitFinish === '1') return;
    nextButton.dataset.misfitFinish = '1';
    nextButton.disabled = false;
    nextButton.textContent = 'Finish tour ✓';
    nextButton.setAttribute('aria-label', 'Finish guided tour and view summary');
    nextButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      showCompletion(panel);
    }, true);
  };

  const observer = new MutationObserver(enhanceFinalStep);
  const startObserver = () => {
    if (!document.body) return;
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['disabled'] });
    enhanceFinalStep();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startObserver, { once: true });
  else startObserver();

  const badge = document.createElement('div');
  badge.id = 'misfit-voice-profile';
  badge.textContent = 'VOICE · NEURAL · ELEANOR GREY';
  Object.assign(badge.style, {
    position: 'fixed',
    right: '18px',
    bottom: '18px',
    zIndex: '70',
    padding: '7px 10px',
    borderRadius: '999px',
    border: '1px solid rgba(103,232,249,.22)',
    background: 'rgba(2,6,23,.88)',
    color: 'rgba(165,243,252,.78)',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '9px',
    letterSpacing: '.11em',
    pointerEvents: 'none',
    backdropFilter: 'blur(12px)',
  });

  const mountBadge = () => {
    if (!document.body || document.getElementById(badge.id)) return;
    document.body.appendChild(badge);
    setTimeout(() => {
      badge.style.opacity = '0';
      badge.style.transition = 'opacity .8s ease';
    }, 6000);
    setTimeout(() => badge.remove(), 7000);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountBadge, { once: true });
  else mountBadge();
})();
