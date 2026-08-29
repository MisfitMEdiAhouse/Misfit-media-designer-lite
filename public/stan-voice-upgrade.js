(() => {
  const path = location.pathname.replace(/\/+$/, '') || '/';
  if (path !== '/stan-hansen' && path !== '/egnyte') return;
  if (!('speechSynthesis' in window)) return;

  const clips = new Map([
    ['Stan, Egnyte already owns an unusually strong enterprise content and permission layer. The point of this tour is not to replace it. The question is what happens one layer downstream, when an agent has legitimate access and now wants to take action.', 'https://resource2.heygen.ai/text_to_speech/254fc751702744ee9e2726b8a79ebad1/4d7fe569a30a42c0b213d788aa0dd411/id=99e6fd08-af19-4ea3-a511-900906eef13f.wav'],
    ['GHOSBC adds consequence-aware routing after access is granted. It can distinguish a technically allowed action from a contextually appropriate one, preserve the legitimate goal, replan weak actions, selectively escalate to humans, and emit a bounded audit receipt.', 'https://resource2.heygen.ai/text_to_speech/254fc751702744ee9e2726b8a79ebad1/4d7fe569a30a42c0b213d788aa0dd411/id=dbef0ba3-fc3e-4261-8bae-b98d2fe7a0df.wav'],
    ['Keep Egnyte as the trusted content and identity boundary. ContextForge grounds proposed changes in system context. Castle Gate evaluates consequences before execution. Sentinel watches the runtime. GHOSBC stays protected behind those interfaces and returns only bounded decisions.', 'https://resource2.heygen.ai/text_to_speech/254fc751702744ee9e2726b8a79ebad1/4d7fe569a30a42c0b213d788aa0dd411/id=97662568-c7fd-47ef-951f-a7c7c033fdfa.wav'],
    ['Egnyte is already adopting an AI-native software development lifecycle. ContextForge is relevant because it gives a coding agent more than source text. It can ground a change in metadata, ownership, lineage and architecture before that change ever reaches Castle Gate.', 'https://resource2.heygen.ai/text_to_speech/254fc751702744ee9e2726b8a79ebad1/4d7fe569a30a42c0b213d788aa0dd411/id=dca8b502-13ff-498e-8d62-a132be05260d.wav'],
    ['This interactive preflight is illustrative. Switch between safe reads, external messages, CRM mutations and destructive actions. Egnyte governs access and tool permission. Castle Gate adds consequence and authority checks. Sentinel adds runtime awareness.', 'https://resource2.heygen.ai/text_to_speech/254fc751702744ee9e2726b8a79ebad1/4d7fe569a30a42c0b213d788aa0dd411/id=a00b0efc-ca1d-4ce6-abe0-cbdf5e3d6140.wav'],
    ['The hiring signals line up with the architecture. Egnyte is recruiting leadership for developer ecosystem and integrations, professional services AI focused on MCP and agentic architecture, and senior platform engineers working with AI-assisted development.', 'https://resource2.heygen.ai/text_to_speech/254fc751702744ee9e2726b8a79ebad1/4d7fe569a30a42c0b213d788aa0dd411/id=007396d1-3994-4001-a4a6-dc8f3b7d62fb.wav'],
    ['The private kernel is intentionally not exposed. Developers can inspect the contracts, input and output shapes, public decisions, audit evidence and benchmark behavior. They do not need the private policy maps, prompts, symbolic mappings or reconstruction material to integrate with the system.', 'https://resource2.heygen.ai/text_to_speech/254fc751702744ee9e2726b8a79ebad1/4d7fe569a30a42c0b213d788aa0dd411/id=78e05bea-0765-47bf-9fc9-6be2444f711d.wav'],
  ]);

  const FINAL_NARRATION = Array.from(clips.keys()).at(-1);
  const OUTRO_AUDIO = 'https://resource2.heygen.ai/text_to_speech/254fc751702744ee9e2726b8a79ebad1/4d7fe569a30a42c0b213d788aa0dd411/id=77a56f17-dfd3-4814-a2b2-232185ea1d54.wav';
  const A2A_ENDPOINT = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/misfit-machine-a2a/message:send';

  const synth = window.speechSynthesis;
  const nativeCancel = typeof synth.cancel === 'function' ? synth.cancel.bind(synth) : () => {};
  const player = new Audio();
  const finalePlayer = new Audio();
  player.preload = 'auto';
  finalePlayer.preload = 'auto';

  let activeUtterance = null;
  let finalSummaryShown = false;

  function stopAudio(audio) {
    try {
      audio.pause();
      audio.currentTime = 0;
    } catch (_) {}
  }

  function finishUtterance(kind = 'end') {
    const utterance = activeUtterance;
    activeUtterance = null;
    if (!utterance) return;
    try {
      if (kind === 'error' && typeof utterance.onerror === 'function') utterance.onerror(new Event('error'));
      if (kind === 'end' && typeof utterance.onend === 'function') utterance.onend();
    } catch (_) {}
  }

  function stopNeural() {
    stopAudio(player);
    finishUtterance('end');
  }

  synth.cancel = () => {
    stopNeural();
    try { nativeCancel(); } catch (_) {}
  };

  synth.speak = (utterance) => {
    const text = String(utterance?.text || '').trim();
    const src = clips.get(text);
    if (!src) {
      try { utterance?.onerror?.(new Event('error')); } catch (_) {}
      return;
    }

    stopNeural();
    activeUtterance = utterance;
    player.src = src;
    player.volume = Number.isFinite(utterance?.volume) ? utterance.volume : 1;
    player.playbackRate = 1;

    player.onplay = () => {
      if (activeUtterance === utterance) {
        try { utterance?.onstart?.(); } catch (_) {}
      }
    };

    player.onended = () => {
      const isFinal = text === FINAL_NARRATION;
      if (activeUtterance === utterance) finishUtterance('end');
      if (isFinal && !finalSummaryShown) {
        finalSummaryShown = true;
        window.setTimeout(showCompletion, 250);
      }
    };

    player.onerror = () => {
      if (activeUtterance === utterance) finishUtterance('error');
    };

    try {
      const play = player.play();
      if (play?.catch) play.catch(() => {
        if (activeUtterance === utterance) finishUtterance('error');
      });
    } catch (_) {
      finishUtterance('error');
    }
  };

  function closeCompletion() {
    stopAudio(finalePlayer);
    document.getElementById('misfit-tour-complete')?.remove();
    document.body.style.overflow = '';
  }

  function showCompletion() {
    if (document.getElementById('misfit-tour-complete')) return;
    stopNeural();

    const guidePanel = [...document.querySelectorAll('div.fixed')].find((panel) => /Misfit voice guide\s*·\s*7\/7/i.test(panel.textContent || ''));
    try { guidePanel?.querySelector('button[aria-label="Close tour"]')?.click(); } catch (_) {}

    const overlay = document.createElement('div');
    overlay.id = 'misfit-tour-complete';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    Object.assign(overlay.style, {
      position: 'fixed', inset: '0', zIndex: '120', display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      padding: '18px', background: 'rgba(0,0,0,.78)'
    });

    overlay.innerHTML = `
      <div style="width:min(760px,100%);max-height:92vh;overflow:auto;border:1px solid rgba(103,232,249,.28);border-radius:28px;background:#020617;padding:24px;color:white;font-family:Inter,sans-serif;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;">
          <div>
            <div style="font:700 10px/1 JetBrains Mono,monospace;letter-spacing:.16em;text-transform:uppercase;color:#6ee7b7;">✓ Guided tour complete · 7/7</div>
            <h2 style="margin:10px 0 0;font:700 clamp(28px,7vw,46px)/1.02 Inter Tight,Inter,sans-serif;letter-spacing:-.035em;">YOU'VE SEEN THE ARCHITECTURE.<br><span style="color:#67e8f9;">NOW TEST THE BOUNDARY.</span></h2>
          </div>
          <button id="misfit-tour-complete-close" aria-label="Close summary" style="flex:none;width:42px;height:42px;border-radius:999px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.03);color:#cbd5e1;font-size:20px;">×</button>
        </div>
        <p style="margin:18px 0 0;color:#a7b0c0;font-size:14px;line-height:1.8;">Egnyte remains the trusted content, identity and permission layer. ContextForge adds system context. Castle Gate evaluates consequential actions before execution. Sentinel watches runtime behavior. GHOSBC OS preserves the legitimate objective and returns bounded decisions while its private kernel stays sealed.</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;margin-top:18px;">
          <div style="border:1px solid rgba(103,232,249,.16);border-radius:16px;padding:15px;"><div style="color:#67e8f9;font:700 9px/1 JetBrains Mono,monospace;">01 · BOUND IT</div><div style="margin-top:9px;color:#d5d9e2;font-size:13px;line-height:1.55;">Pick one low-risk Egnyte agent or MCP workflow with a clear objective and authority boundary.</div></div>
          <div style="border:1px solid rgba(216,180,254,.16);border-radius:16px;padding:15px;"><div style="color:#d8b4fe;font:700 9px/1 JetBrains Mono,monospace;">02 · RUN IT TWICE</div><div style="margin-top:9px;color:#d5d9e2;font-size:13px;line-height:1.55;">Run the same objective through the existing path and the governed path.</div></div>
          <div style="border:1px solid rgba(110,231,183,.16);border-radius:16px;padding:15px;"><div style="color:#6ee7b7;font:700 9px/1 JetBrains Mono,monospace;">03 · LET EVIDENCE WIN</div><div style="margin-top:9px;color:#d5d9e2;font-size:13px;line-height:1.55;">Compare blocks, false refusals, goal completion, escalation and audit completeness.</div></div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:20px;">
          <a href="#live-governance-proof" id="misfit-tour-live-proof" style="display:inline-flex;border-radius:14px;padding:12px 16px;background:#6ee7b7;color:#020617;font:700 10px/1 JetBrains Mono,monospace;text-decoration:none;">Run live proof →</a>
          <a href="/agent-evaluation-lab" style="display:inline-flex;border-radius:14px;padding:12px 16px;background:#67e8f9;color:#020617;font:700 10px/1 JetBrains Mono,monospace;text-decoration:none;">Raw vs governed lab →</a>
          <a href="/portfolio" style="display:inline-flex;border-radius:14px;padding:12px 16px;border:1px solid rgba(255,255,255,.12);color:#e2e8f0;font:700 10px/1 JetBrains Mono,monospace;text-decoration:none;">Explore all Misfit</a>
        </div>
        <div style="margin-top:20px;padding-top:16px;border-top:1px solid rgba(255,255,255,.08);color:#64748b;font:500 9px/1.6 JetBrains Mono,monospace;text-transform:uppercase;">GHOSBC OS kernel remains private · Built entirely from a phone · Misfit Mediahouse</div>
      </div>`;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    overlay.querySelector('#misfit-tour-complete-close')?.addEventListener('click', closeCompletion, { once: true });
    overlay.addEventListener('click', (event) => { if (event.target === overlay) closeCompletion(); });
    overlay.querySelector('#misfit-tour-live-proof')?.addEventListener('click', (event) => {
      event.preventDefault();
      closeCompletion();
      document.getElementById('live-governance-proof')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, { once: true });

    finalePlayer.src = OUTRO_AUDIO;
    finalePlayer.volume = 1;
    finalePlayer.playbackRate = 1;
    try { finalePlayer.play()?.catch?.(() => {}); } catch (_) {}
  }

  const proofCases = {
    allow: { label: 'Bounded read', expectation: 'ALLOW', action: 'read_status', target: 'public_service_health', constraints: { allowed_actions: ['read_status'], allowed_targets: ['public_service_health'] } },
    review: { label: 'External message', expectation: 'REVIEW', action: 'send_message', target: 'external_slack', constraints: { allowed_targets: ['external_slack'] } },
    block: { label: 'Out-of-mandate delete', expectation: 'BLOCK', action: 'delete_record', target: 'production_customer', constraints: { allowed_actions: ['read_record'], allowed_targets: ['staging_customer'] } },
  };

  function mountProof() {
    if (document.getElementById('live-governance-proof')) return true;
    const preflight = document.getElementById('preflight-lab');
    if (!preflight) return false;

    const section = document.createElement('section');
    section.id = 'live-governance-proof';
    section.style.cssText = 'scroll-margin-top:112px;margin-top:24px;border:1px solid rgba(110,231,183,.22);border-radius:28px;background:#020617;padding:24px;color:white;';
    section.innerHTML = `
      <div style="font:600 10px/1 JetBrains Mono,monospace;letter-spacing:.16em;text-transform:uppercase;color:#6ee7b7;">Live proof · public-safe endpoint</div>
      <h2 style="margin:10px 0 0;font:700 clamp(25px,6vw,38px)/1.05 Inter Tight,Inter,sans-serif;">DON'T TAKE THE CLAIM ON FAITH. RUN THE GATE.</h2>
      <p style="margin:14px 0 0;color:#94a3b8;font-size:13px;line-height:1.75;">This calls Misfit Machine Agent's published governed_agent_action_check skill. It evaluates the action envelope and returns a public-safe decision. It does not execute the proposed external action.</p>
      <div id="misfit-proof-buttons" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:17px;"></div>
      <div id="misfit-proof-state" style="margin-top:16px;border:1px solid rgba(255,255,255,.1);border-radius:18px;background:rgba(0,0,0,.34);padding:16px;color:#cbd5e1;font-size:13px;line-height:1.65;">Tap a case to run the live governance boundary.</div>`;

    const buttons = section.querySelector('#misfit-proof-buttons');
    const state = section.querySelector('#misfit-proof-state');

    Object.entries(proofCases).forEach(([key, item]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.proofCase = key;
      button.textContent = `${item.label} → ${item.expectation}`;
      button.style.cssText = 'border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(255,255,255,.03);padding:10px 13px;color:#cbd5e1;font:600 9px/1 JetBrains Mono,monospace;letter-spacing:.1em;text-transform:uppercase;';
      button.addEventListener('click', async () => {
        const all = [...buttons.querySelectorAll('button')];
        all.forEach((candidate) => { candidate.disabled = true; });
        state.textContent = `Running ${item.action} → ${item.target}…`;
        const messageId = globalThis.crypto?.randomUUID?.() || `misfit-${Date.now()}`;
        const body = { message: { messageId, role: 'ROLE_USER', parts: [{ data: { skill: 'governed_agent_action_check', action: item.action, target: item.target, constraints: item.constraints }, mediaType: 'application/json' }] } };
        try {
          const response = await fetch(A2A_ENDPOINT, { method: 'POST', headers: { 'content-type': 'application/json', 'a2a-version': '1.0' }, body: JSON.stringify(body) });
          const payload = await response.json();
          if (!response.ok) throw new Error(payload?.detail || payload?.title || `HTTP ${response.status}`);
          const parts = Array.isArray(payload?.message?.parts) ? payload.message.parts : [];
          const data = parts.map((part) => part?.data).find((value) => value && typeof value === 'object') || {};
          const text = parts.map((part) => part?.text).find(Boolean) || 'Governance result returned.';
          const decision = String(data.decision || 'UNKNOWN').toUpperCase();
          const reasons = Array.isArray(data.reasons) ? data.reasons.join(' · ') : 'No public reason codes returned';
          state.textContent = `${decision} — ${text} Reasons: ${reasons}. External action executed: false.`;
        } catch (error) {
          state.textContent = `Live check unavailable: ${String(error?.message || error)}. No external action was executed.`;
        } finally {
          all.forEach((candidate) => { candidate.disabled = false; });
        }
      });
      buttons.appendChild(button);
    });

    preflight.insertAdjacentElement('afterend', section);
    return true;
  }

  let proofAttempts = 0;
  function mountProofBounded() {
    proofAttempts += 1;
    if (mountProof() || proofAttempts >= 20) return;
    window.setTimeout(mountProofBounded, 250);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountProofBounded, { once: true });
  else mountProofBounded();

  window.__MISFIT_STAN_VOICE_RUNTIME__ = Object.freeze({
    mode: 'bounded_event_driven',
    polling: false,
    mutationObserver: false,
    playbackRate: 1,
    finalSummary: 'audio_end',
  });
})();