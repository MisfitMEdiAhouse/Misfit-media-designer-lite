(() => {
  if (location.pathname !== '/stan-hansen' && location.pathname !== '/egnyte') return;
  if (!('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance !== 'function') return;

  const synth = window.speechSynthesis;
  const nativeSpeak = synth.speak.bind(synth);

  const preferredNames = [
    'Google UK English Female',
    'Microsoft Sonia',
    'Sonia',
    'Microsoft Libby',
    'Libby',
    'Serena',
    'Martha',
    'Kate',
    'Stephanie',
    'Hazel',
    'Susan',
  ];

  function rankVoice(voice) {
    const name = String(voice?.name || '');
    const lang = String(voice?.lang || '');
    let score = 0;
    if (/^en-GB/i.test(lang)) score += 100;
    else if (/^en/i.test(lang)) score += 20;
    preferredNames.forEach((candidate, index) => {
      if (name.toLowerCase().includes(candidate.toLowerCase())) score += 80 - index;
    });
    if (/female|woman|sonia|libby|serena|martha|kate|stephanie|hazel|susan/i.test(name)) score += 35;
    if (/daniel|george|ryan|male/i.test(name)) score -= 50;
    if (voice?.localService) score += 4;
    return score;
  }

  function chooseVoice() {
    const voices = synth.getVoices?.() || [];
    return [...voices].sort((a, b) => rankVoice(b) - rankVoice(a))[0] || null;
  }

  synth.speak = (utterance) => {
    try {
      const voice = chooseVoice();
      if (voice) utterance.voice = voice;
      utterance.lang = voice?.lang?.startsWith('en') ? voice.lang : 'en-GB';
      utterance.rate = 0.82;
      utterance.pitch = 1.04;
      utterance.volume = 1;
    } catch (_) {}
    return nativeSpeak(utterance);
  };

  // Android/Chrome can populate voices after page load. Touch the list again when it changes.
  synth.addEventListener?.('voiceschanged', () => chooseVoice());

  const badge = document.createElement('div');
  badge.id = 'misfit-voice-profile';
  badge.textContent = 'VOICE · BRITISH FEMALE · RELAXED';
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
