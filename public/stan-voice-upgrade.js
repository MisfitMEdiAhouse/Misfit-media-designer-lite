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

  const synth = window.speechSynthesis;
  const nativeCancel = typeof synth.cancel === 'function' ? synth.cancel.bind(synth) : () => {};
  const player = new Audio();
  player.preload = 'auto';
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
        // If mobile autoplay policy blocks the delayed auto-start, the guide's
        // explicit Play button will retry under a direct user gesture.
        if (activeUtterance === utterance) activeUtterance = null;
        if (typeof utterance.onerror === 'function') {
          try { utterance.onerror(new Event('error')); } catch (_) {}
        }
      });
    }
  };

  // Prime one reusable Audio element on the first direct user gesture so
  // Android/Chrome can play subsequent guided clips without invoking TTS.
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
