(() => {
  if (location.pathname !== '/stan-hansen' && location.pathname !== '/egnyte') return;
  if (!('speechSynthesis' in window)) return;

  const VOICE_PROFILE = Object.freeze({
    name: 'Eleanor Grey',
    speed: 0.88,
    accent: 'British English',
    spokenBrand: 'Ghost B.C. O.S.',
  });

  const clips = new Map([
    [
      'Stan, Egnyte already owns an unusually strong enterprise content and permission layer. The point of this tour is not to replace it. The question is what happens one layer downstream, when an agent has legitimate access and now wants to take action.',
      'https://resource2.heygen.ai/text_to_speech/254fc751702744ee9e2726b8a79ebad1/4d7fe569a30a42c0b213d788aa0dd411/id=99e6fd08-af19-4ea3-a511-900906eef13f.wav',
    ],
    [
      'GHOSBC adds consequence-aware routing after access is granted. It can distinguish a technically allowed action from a contextually appropriate one, preserve the legitimate goal, replan weak actions, selectively escalate to humans, and emit a bounded audit receipt.',
      'https://resource2.heygen.ai/text_to_speech/254fc751702744ee9e2726b8a79ebad1/4d7fe569a30a42c0b213d788aa0dd411/id=dbef0ba3-fc3e-4261-8bae-b98d2fe7a0df.wav',
    ],
    [
      'Keep Egnyte as the trusted content and identity boundary. ContextForge grounds proposed changes in system context. Castle Gate evaluates consequences before execution. Sentinel watches the runtime. GHOSBC stays protected behind those interfaces and returns only bounded decisions.',
      'https://resource2.heygen.ai/text_to_speech/254fc751702744ee9e2726b8a79ebad1/4d7fe569a30a42c0b213d788aa0dd411/id=97662568-c7fd-47ef-951f-a7c7c033fdfa.wav',
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

  const OUTRO_AUDIO = 'https://resource2.heygen.ai/text_to_speech/254fc751702744ee9e2726b8a79ebad1/4d7fe569a30a42c0b213d788aa0dd411/id=77a56f17-dfd3-4814-a2b2-232185ea1d54.wav';
  const A2A_ENDPOINT = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/misfit-machine-a2a/message:send';

  const synth = window.speechSynthesis;
  const nativeCancel = typeof synth.cancel === 'function' ? synth.cancel.bind(synth) : () => {};
  const player = new Audio();
  const finalePlayer = new Audio();
  player.preload = 'auto';
  finalePlayer.preload = 'auto';

  let activeUtterance = null;
  let primed = false;

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

    // Never fall back to phone/browser voices on this route.
    if (!src) {
      console.warn('[Misfit Voice] Neural clip missing; browser TTS suppressed.');
      try {
        if (typeof utterance?.onerror === 'function') utterance.onerror(new Event('error'));
      } catch (_) {}
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
      if (activeUtterance === utterance) finishUtterance('end');
    };
    player.onerror = () => {
      if (activeUtterance === utterance) finishUtterance('error');
    };

    const promise = player.play();
    if (promise?.catch) promise.catch(() => {
      if (activeUtterance === utterance) finishUtterance('error');
    });
  };

  function prime() {
    if (primed) return;
    primed = true;
    const first = clips.values().next().value;
    if (!first) return;
    player.src = first;
    player.volume = 0;
    const promise = player.play();
    if (promise?.then) promise.then(() => {
      stopAudio(player);
      player.volume = 1;
    }).catch(() => { player.volume = 1; });
  }

  document.addEventListener('pointerdown', prime, { once: true, capture: true });
  document.addEventListener('keydown', prime, { once: true, capture: true });

  const proofCases = {
    allow: {
      label: 'Bounded read',
      expectation: 'ALLOW',
      action: 'read_status',
      target: 'public_service_health',
      constraints: {
        allowed_actions: ['read_status'],
        allowed_targets: ['public_service_health'],
      },
    },
    review: {
      label: 'External message',
      expectation: 'REVIEW',
      action: 'send_message',
      target: 'external_slack',
      constraints: {
        allowed_targets: ['external_slack'],
      },
    },
    block: {
      label: 'Out-of-mandate delete',
      expectation: 'BLOCK',
      action: 'delete_record',
      target: 'production_customer',
      constraints: {
        allowed_actions: ['read_record'],
        allowed_targets: ['staging_customer'],
      },
    },
  };

  function proofMarkup() {
    return `
      <section id="live-governance-proof" style="scroll-margin-top:112px;margin-top:24px;border:1px solid rgba(110,231,183,.22);border-radius:28px;background:linear-gradient(145deg,rgba(6,78,59,.08),rgba(2,6,23,.88));padding:24px;color:white;">
        <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;">
          <div>
            <div style="font:600 10px/1 JetBrains Mono,monospace;letter-spacing:.16em;text-transform:uppercase;color:#6ee7b7;">Live proof · public-safe endpoint</div>
            <h2 style="margin:10px 0 0;font:700 clamp(25px,6vw,38px)/1.05 Inter Tight,Inter,sans-serif;letter-spacing:-.03em;">DON'T TAKE THE CLAIM ON FAITH. RUN THE GATE.</h2>
          </div>
          <div style="border:1px solid rgba(110,231,183,.18);border-radius:999px;padding:8px 11px;color:#a7f3d0;font:600 9px/1 JetBrains Mono,monospace;letter-spacing:.1em;text-transform:uppercase;">Real Misfit A2A · no external execution</div>
        </div>
        <p style="margin:14px 0 0;max-width:820px;color:#94a3b8;font-size:13px;line-height:1.75;">The preflight above explains the architecture. This panel actually calls Misfit Machine Agent's published <code style="color:#67e8f9;">governed_agent_action_check</code> skill. Choose a case and inspect the live ALLOW / REVIEW / BLOCK result, reasons and normalized action. The skill evaluates only; it does not execute the proposed action.</p>
        <div id="misfit-proof-buttons" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:17px;">
          ${Object.entries(proofCases).map(([key, item], index) => `<button type="button" data-proof-case="${key}" style="border:1px solid ${index === 0 ? 'rgba(103,232,249,.32)' : 'rgba(255,255,255,.12)'};border-radius:999px;background:${index === 0 ? 'rgba(34,211,238,.08)' : 'rgba(255,255,255,.025)'};padding:10px 13px;color:${index === 0 ? '#a5f3fc' : '#cbd5e1'};font:600 9px/1 JetBrains Mono,monospace;letter-spacing:.1em;text-transform:uppercase;">${item.label} → ${item.expectation}</button>`).join('')}
        </div>
        <div id="misfit-proof-state" style="margin-top:16px;border:1px solid rgba(255,255,255,.1);border-radius:18px;background:rgba(0,0,0,.34);padding:16px;">
          <div style="color:#64748b;font:600 9px/1 JetBrains Mono,monospace;letter-spacing:.12em;text-transform:uppercase;">Ready</div>
          <div style="margin-top:9px;color:#cbd5e1;font-size:13px;line-height:1.65;">Tap a case to send a real structured action envelope through the published governance boundary.</div>
        </div>
        <div style="margin-top:12px;color:#64748b;font:500 9px/1.5 JetBrains Mono,monospace;letter-spacing:.06em;text-transform:uppercase;">Public contract: A2A v1.0 · skill: governed_agent_action_check · private kernel exposed: false</div>
      </section>`;
  }

  function mountProof() {
    if (document.getElementById('live-governance-proof')) return true;
    const preflight = document.getElementById('preflight-lab');
    if (!preflight) return false;

    const holder = document.createElement('div');
    holder.innerHTML = proofMarkup();
    const proof = holder.firstElementChild;
    preflight.insertAdjacentElement('afterend', proof);

    const state = proof.querySelector('#misfit-proof-state');
    proof.querySelectorAll('[data-proof-case]').forEach((button) => {
      button.addEventListener('click', async () => {
        const key = button.dataset.proofCase;
        const item = proofCases[key];
        if (!item || !state) return;

        proof.querySelectorAll('[data-proof-case]').forEach((candidate) => { candidate.disabled = true; });
        state.innerHTML = `
          <div style="color:#67e8f9;font:600 9px/1 JetBrains Mono,monospace;letter-spacing:.12em;text-transform:uppercase;">Running live check…</div>
          <div style="margin-top:9px;color:#cbd5e1;font-size:13px;line-height:1.65;">${item.action} → ${item.target}</div>`;

        const messageId = globalThis.crypto?.randomUUID?.() || `misfit-${Date.now()}`;
        const body = {
          message: {
            messageId,
            role: 'ROLE_USER',
            parts: [{
              data: {
                skill: 'governed_agent_action_check',
                action: item.action,
                target: item.target,
                constraints: item.constraints,
              },
              mediaType: 'application/json',
            }],
          },
        };

        try {
          const response = await fetch(A2A_ENDPOINT, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              'a2a-version': '1.0',
            },
            body: JSON.stringify(body),
          });
          const payload = await response.json();
          if (!response.ok) throw new Error(payload?.detail || payload?.title || `HTTP ${response.status}`);

          const parts = Array.isArray(payload?.message?.parts) ? payload.message.parts : [];
          const data = parts.map((part) => part?.data).find((value) => value && typeof value === 'object') || {};
          const text = parts.map((part) => part?.text).find(Boolean) || '';
          const decision = String(data.decision || 'UNKNOWN').toUpperCase();
          const reasons = Array.isArray(data.reasons) ? data.reasons : [];
          const decisionColor = decision === 'ALLOW' ? '#6ee7b7' : decision === 'BLOCK' ? '#fda4af' : '#fcd34d';
          const matched = decision === item.expectation;

          state.innerHTML = `
            <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;">
              <div style="color:${decisionColor};font:700 11px/1 JetBrains Mono,monospace;letter-spacing:.14em;text-transform:uppercase;">${decision}</div>
              <div style="color:${matched ? '#6ee7b7' : '#fcd34d'};font:600 8px/1 JetBrains Mono,monospace;letter-spacing:.1em;text-transform:uppercase;">${matched ? 'Expected decision observed' : `Expected ${item.expectation}`}</div>
            </div>
            <div style="margin-top:10px;color:#d5d9e2;font-size:13px;line-height:1.7;">${text || 'Governance result returned.'}</div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:9px;margin-top:13px;">
              <div style="border:1px solid rgba(255,255,255,.08);border-radius:13px;padding:11px;"><div style="color:#64748b;font:600 8px/1 JetBrains Mono,monospace;text-transform:uppercase;letter-spacing:.1em;">Reasons</div><div style="margin-top:7px;color:#cbd5e1;font-size:11px;line-height:1.55;">${reasons.length ? reasons.join(' · ') : 'No public reason codes returned'}</div></div>
              <div style="border:1px solid rgba(255,255,255,.08);border-radius:13px;padding:11px;"><div style="color:#64748b;font:600 8px/1 JetBrains Mono,monospace;text-transform:uppercase;letter-spacing:.1em;">Normalized action</div><div style="margin-top:7px;color:#cbd5e1;font-size:11px;line-height:1.55;">${data?.normalized_action ? `${data.normalized_action.action || '—'} → ${data.normalized_action.target || '—'}` : '—'}</div></div>
              <div style="border:1px solid rgba(255,255,255,.08);border-radius:13px;padding:11px;"><div style="color:#64748b;font:600 8px/1 JetBrains Mono,monospace;text-transform:uppercase;letter-spacing:.1em;">Boundary</div><div style="margin-top:7px;color:#cbd5e1;font-size:11px;line-height:1.55;">Private runtime exposed: ${data.private_runtime_exposed === false ? 'false' : 'not asserted'}<br>External action executed: false</div></div>
            </div>
            <div style="margin-top:10px;color:#475569;font:500 8px/1.5 JetBrains Mono,monospace;letter-spacing:.06em;text-transform:uppercase;">Live A2A response · ${new Date().toISOString()}</div>`;
        } catch (error) {
          state.innerHTML = `
            <div style="color:#fda4af;font:700 10px/1 JetBrains Mono,monospace;letter-spacing:.12em;text-transform:uppercase;">Live check unavailable</div>
            <div style="margin-top:9px;color:#cbd5e1;font-size:13px;line-height:1.65;">${String(error?.message || error)}. No browser voice fallback and no external action was executed.</div>`;
        } finally {
          proof.querySelectorAll('[data-proof-case]').forEach((candidate) => { candidate.disabled = false; });
        }
      });
    });

    return true;
  }

  const buttonStyle = 'display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:14px;padding:12px 16px;font:700 10px/1 JetBrains Mono,monospace;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;';

  function closeCompletion() {
    stopAudio(finalePlayer);
    const overlay = document.getElementById('misfit-tour-complete');
    if (overlay) overlay.remove();
    document.body.style.overflow = '';
  }

  function showCompletion(guidePanel) {
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
      background: 'rgba(0,0,0,.74)',
      backdropFilter: 'blur(12px)',
    });

    overlay.innerHTML = `
      <div style="width:min(760px,100%);max-height:92vh;overflow:auto;border:1px solid rgba(103,232,249,.28);border-radius:28px;background:linear-gradient(145deg,rgba(2,6,23,.99),rgba(0,0,0,.99));box-shadow:0 24px 90px rgba(8,145,178,.22);padding:24px;color:white;font-family:Inter,sans-serif;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;">
          <div>
            <div style="font:700 10px/1 JetBrains Mono,monospace;letter-spacing:.16em;text-transform:uppercase;color:#6ee7b7;">✓ Guided tour complete · 7/7</div>
            <h2 style="margin:10px 0 0;font:700 clamp(28px,7vw,46px)/1.02 Inter Tight,Inter,sans-serif;letter-spacing:-.035em;">YOU'VE SEEN THE ARCHITECTURE.<br><span style="color:#67e8f9;">NOW TEST THE BOUNDARY.</span></h2>
          </div>
          <button id="misfit-tour-complete-close" aria-label="Close summary" style="flex:none;width:42px;height:42px;border-radius:999px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.03);color:#cbd5e1;font-size:20px;">×</button>
        </div>

        <p style="margin:18px 0 0;color:#a7b0c0;font-size:14px;line-height:1.8;">Tour complete. Egnyte remains the trusted content, identity and permission layer. ContextForge adds system context. Castle Gate evaluates consequential actions before execution. Sentinel watches runtime behavior. GHOSBC OS preserves the legitimate objective and returns bounded decisions while its private kernel stays sealed.</p>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;margin-top:18px;">
          <div style="border:1px solid rgba(103,232,249,.16);border-radius:16px;padding:15px;background:rgba(34,211,238,.035);"><div style="color:#67e8f9;font:700 9px/1 JetBrains Mono,monospace;letter-spacing:.1em;">01 · BOUND IT</div><div style="margin-top:9px;color:#d5d9e2;font-size:13px;line-height:1.55;">Pick one real, low-risk Egnyte agent or MCP workflow with a clear objective and authority boundary.</div></div>
          <div style="border:1px solid rgba(216,180,254,.16);border-radius:16px;padding:15px;background:rgba(168,85,247,.035);"><div style="color:#d8b4fe;font:700 9px/1 JetBrains Mono,monospace;letter-spacing:.1em;">02 · RUN IT TWICE</div><div style="margin-top:9px;color:#d5d9e2;font-size:13px;line-height:1.55;">Run the same objective through the existing path and the governed path. Change one variable: the Misfit control loop.</div></div>
          <div style="border:1px solid rgba(110,231,183,.16);border-radius:16px;padding:15px;background:rgba(16,185,129,.035);"><div style="color:#6ee7b7;font:700 9px/1 JetBrains Mono,monospace;letter-spacing:.1em;">03 · LET EVIDENCE WIN</div><div style="margin-top:9px;color:#d5d9e2;font-size:13px;line-height:1.55;">Compare dangerous-action blocks, false refusals, goal completion, escalation and audit completeness. Expand only if the delta is real.</div></div>
        </div>

        <div style="margin-top:18px;padding:16px;border:1px solid rgba(110,231,183,.18);border-radius:18px;background:rgba(16,185,129,.035);">
          <div style="font:700 9px/1 JetBrains Mono,monospace;letter-spacing:.13em;text-transform:uppercase;color:#6ee7b7;">Proof is on this page</div>
          <div style="margin-top:9px;color:#cbd5e1;font-size:13px;line-height:1.65;">The architecture preflight is illustrative. The new Live Proof panel calls the published Misfit A2A governance endpoint and returns a real ALLOW / REVIEW / BLOCK decision without executing the proposed external action.</div>
        </div>

        <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:20px;">
          <a href="#live-governance-proof" id="misfit-tour-live-proof" style="${buttonStyle}background:#6ee7b7;color:#020617;">Run live proof →</a>
          <a href="/agent-evaluation-lab" style="${buttonStyle}background:#67e8f9;color:#020617;">Open raw vs governed lab →</a>
          <a href="/signal" style="${buttonStyle}border:1px solid rgba(217,70,239,.28);color:#f0abfc;">Explore Misfit Trader</a>
          <a href="/portfolio" style="${buttonStyle}border:1px solid rgba(255,255,255,.12);color:#e2e8f0;">Explore all Misfit</a>
        </div>

        <div style="margin-top:20px;padding-top:16px;border-top:1px solid rgba(255,255,255,.08);display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;color:#64748b;font:500 9px/1.6 JetBrains Mono,monospace;letter-spacing:.08em;text-transform:uppercase;">
          <span>GHOSBC OS kernel remains private</span><span>Built entirely from a phone · Misfit Mediahouse</span>
        </div>
      </div>`;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const dismiss = () => closeCompletion();
    overlay.querySelector('#misfit-tour-complete-close')?.addEventListener('click', dismiss);
    overlay.addEventListener('click', (event) => { if (event.target === overlay) dismiss(); });
    overlay.querySelector('#misfit-tour-live-proof')?.addEventListener('click', (event) => {
      event.preventDefault();
      dismiss();
      setTimeout(() => document.getElementById('live-governance-proof')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    });

    finalePlayer.src = OUTRO_AUDIO;
    finalePlayer.volume = 1;
    const outro = finalePlayer.play();
    if (outro?.catch) outro.catch(() => {});
  }

  function findGuidePanel() {
    return [...document.querySelectorAll('div.fixed')].find((panel) => /Misfit voice guide\s*·\s*7\/7/i.test(panel.textContent || '')) || null;
  }

  function enhanceFinalStep() {
    const panel = findGuidePanel();
    if (!panel) return false;

    const guideLabel = [...panel.querySelectorAll('div')].find((node) => /Misfit voice guide\s*·\s*7\/7/i.test(node.textContent || '') && node.children.length <= 2);
    if (guideLabel && !guideLabel.querySelector('[data-misfit-final-marker]')) {
      const marker = document.createElement('span');
      marker.dataset.misfitFinalMarker = '1';
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
      guideLabel.appendChild(marker);
    }

    const nextButton = [...panel.querySelectorAll('button')].find((button) => /^\s*Next\b/i.test(button.textContent || '') || button.dataset.misfitFinish === '1');
    if (!nextButton) return false;

    nextButton.dataset.misfitFinish = '1';
    nextButton.disabled = false;
    nextButton.removeAttribute('disabled');
    nextButton.textContent = 'Finish tour ✓';
    nextButton.setAttribute('aria-label', 'Finish guided tour and view summary');

    if (!nextButton.dataset.misfitFinishBound) {
      nextButton.dataset.misfitFinishBound = '1';
      nextButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        showCompletion(panel);
      }, true);
    }

    return true;
  }

  const observer = new MutationObserver(() => {
    mountProof();
    enhanceFinalStep();
  });

  function startEnhancements() {
    if (!document.body) return;
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['disabled'] });
    mountProof();
    enhanceFinalStep();
    // React can re-apply disabled state on the final button; this keeps the completion CTA authoritative.
    window.setInterval(enhanceFinalStep, 500);
  }

  const badge = document.createElement('div');
  badge.id = 'misfit-voice-profile';
  badge.textContent = `VOICE · NEURAL · ${VOICE_PROFILE.name.toUpperCase()} · ${VOICE_PROFILE.speed.toFixed(2)}×`;
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

  function mountBadge() {
    if (!document.body || document.getElementById(badge.id)) return;
    document.body.appendChild(badge);
    setTimeout(() => {
      badge.style.opacity = '0';
      badge.style.transition = 'opacity .8s ease';
    }, 6500);
    setTimeout(() => badge.remove(), 7500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      startEnhancements();
      mountBadge();
    }, { once: true });
  } else {
    startEnhancements();
    mountBadge();
  }
})();