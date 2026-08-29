(() => {
  const path = location.pathname.replace(/\/+$/, '') || '/';
  if (path !== '/signal') return;

  const AUDIO_URL = 'https://www.aidocmaker.com/g0/audio?name=d682c35c675b4aa9b4fb46640a5ce731';
  const transcript = `Welcome to Misfit Trader. If you have absolutely no idea what you are looking at, splendid. That is exactly why I am here. Think of me as the calm voice in the room while the market behaves like a caffeinated raccoon with a credit card.

Start at the top. Misfit Trader does three things for you. It reads the market field, it teaches you what the candles mean, and it lets you practice with paper money before you give real capital any authority.

First, look at Field Emotion. This is not a prophecy. It is a compact read of the current crowd environment. Fear, greed, breadth, momentum, and volatility are blended into a state so you can see whether the market is behaving defensively, euphorically, or somewhere in between. Treat it as context, not a command.

Next, open the Candle Cheat Lab. Pick Bitcoin, Ethereum, Solana, or another available market. The chart is real OHLC data: open, high, low, and close. Each candle is simply a record of what price did during one time slice. Green generally means price closed above where it opened. Red means it closed below. The wicks show how far price traveled before it settled.

When Misfit labels a Doji, Hammer, Engulfing candle, Inside Bar, or another pattern, it will also tell you what traders usually look for next. The important word is usually. A pattern is evidence, not permission to do something stupid.

Now look at the Signal Interpretation panel. This is where Misfit translates the market state into plain English. Defensive means confirmation matters more and position size should usually be smaller. Mixed means the evidence is conflicted. Risk-on means the crowd is leaning into momentum. Euphoria risk means enthusiasm itself may have become a hazard.

The autonomous paper leaderboard is the laboratory. Four virtual bankrolls run the same strategy at different sizes. No real money moves. The point is to accumulate evidence: returns, drawdown, trade count, and whether the strategy survives different conditions.

The Manual Paper Lab is where you learn by touching the controls yourself. Choose an asset, enter a virtual dollar amount, and place a paper buy or paper sell. You are not buying crypto. You are recording a simulated decision so you can compare your thesis with what happens next.

Prediction-market and sports overlays are additional context. They are not betting instructions. They are there because markets often reveal what groups of people collectively believe will happen.

If you want founding access, the ten-dollar purchase unlocks the founding-member entitlement for the beta. It does not enable real-money trading. Real-money execution remains deliberately gated behind position limits, loss limits, kill switches, audit rules, and explicit authorization.

The simplest way to use Misfit Trader is this: read the crowd, inspect the candle, form a thesis, paper trade the thesis, and then check whether reality agreed with you. Repeat until the chart stops looking like sorcery.

And if at any point you are tempted to treat one bright green candle as divine revelation, kindly resist the urge. I would hate to have to explain that to the insurance company.`;

  const style = document.createElement('style');
  style.textContent = `
    body[data-misfit-trader] { background:#020304 !important; }
    body[data-misfit-trader] #root { position:relative; z-index:1; background:transparent !important; }
    body[data-misfit-trader] #root > div.min-h-screen { background:transparent !important; }
    #misfit-trader-brand-bg { position:fixed; inset:0; z-index:0; pointer-events:none; overflow:hidden; background:#020304; }
    #misfit-trader-brand-bg .photo { position:absolute; inset:0; background-image:url('/misfit-trader-rig-bg.webp'); background-size:cover; background-repeat:no-repeat; background-position:58% top; transform:scale(1.015); }
    #misfit-trader-brand-bg .shade { position:absolute; inset:0; background:linear-gradient(to bottom,rgba(0,0,0,.22) 0%,rgba(0,0,0,.52) 32%,rgba(0,0,0,.77) 70%,rgba(0,0,0,.91) 100%); }
    #misfit-trader-brand-bg .brand-wash { position:absolute; inset:0; background:radial-gradient(circle at 16% 8%,rgba(34,211,238,.12),transparent 31%),radial-gradient(circle at 91% 22%,rgba(217,70,239,.10),transparent 32%); }
    body[data-misfit-trader] main > section:first-of-type { background:linear-gradient(135deg,rgba(4,15,22,.73),rgba(5,4,12,.71)) !important; backdrop-filter:blur(5px); -webkit-backdrop-filter:blur(5px); box-shadow:0 26px 80px rgba(0,0,0,.38); }
    body[data-misfit-trader] main > section:not(:first-of-type) { backdrop-filter:blur(7px); -webkit-backdrop-filter:blur(7px); }
    #trader-butler-guide { margin-top:1.1rem; max-width:760px; border:1px solid rgba(125,211,252,.28); border-radius:1rem; background:linear-gradient(135deg,rgba(3,10,14,.82),rgba(14,6,19,.78)); box-shadow:0 18px 54px rgba(0,0,0,.32); padding:14px; }
    #trader-butler-guide .eyebrow { font:600 10px/1.3 'JetBrains Mono',monospace; letter-spacing:.15em; color:#67e8f9; text-transform:uppercase; }
    #trader-butler-guide .title { margin-top:6px; font:800 16px/1.25 Inter,sans-serif; color:#fff; }
    #trader-butler-guide .copy { margin-top:5px; max-width:620px; font:400 12px/1.55 Inter,sans-serif; color:#aeb8c8; }
    #trader-butler-guide .controls { display:flex; flex-wrap:wrap; gap:8px; margin-top:11px; }
    #trader-butler-guide button { min-height:46px; border-radius:12px; padding:0 14px; border:1px solid rgba(103,232,249,.32); background:#67e8f9; color:#020617; font:800 10px/1 'JetBrains Mono',monospace; letter-spacing:.04em; cursor:pointer; }
    #trader-butler-guide button.secondary { background:rgba(0,0,0,.45); color:#cbd5e1; border-color:rgba(255,255,255,.13); }
    #trader-butler-guide .status { margin-top:8px; font:500 9px/1.4 'JetBrains Mono',monospace; color:#64748b; text-transform:uppercase; letter-spacing:.08em; }
    @media (min-width:768px) { #misfit-trader-brand-bg .photo { background-position:center top; } #trader-butler-guide { padding:16px 18px; } }
    @media (max-width:420px) { #misfit-trader-brand-bg .photo { background-position:61% top; } #trader-butler-guide button { width:100%; } }
    @media (prefers-reduced-motion:reduce) { #misfit-trader-brand-bg .photo { transform:none; } }
  `;
  document.head.appendChild(style);
  document.body.dataset.misfitTrader = 'true';

  if (!document.getElementById('misfit-trader-brand-bg')) {
    const bg = document.createElement('div');
    bg.id = 'misfit-trader-brand-bg';
    bg.setAttribute('aria-hidden','true');
    bg.innerHTML = '<div class="photo"></div><div class="shade"></div><div class="brand-wash"></div>';
    document.body.prepend(bg);
  }

  const audio = new Audio(AUDIO_URL);
  audio.preload = 'metadata';
  let speaking = false;
  let usingFallback = false;
  let utterance = null;

  const stopSpeech = () => {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    speaking = false;
  };
  const fallbackSpeak = () => {
    if (!('speechSynthesis' in window)) return false;
    stopSpeech();
    utterance = new SpeechSynthesisUtterance(transcript);
    utterance.lang = 'en-GB';
    utterance.rate = .92;
    utterance.pitch = .88;
    const voices = speechSynthesis.getVoices();
    const british = voices.find(v => /en-GB/i.test(v.lang)) || voices.find(v => /British|UK/i.test(v.name)) || voices.find(v => /^en/i.test(v.lang));
    if (british) utterance.voice = british;
    utterance.onend = () => { speaking = false; update(); };
    utterance.onerror = () => { speaking = false; update('VOICE GUIDE UNAVAILABLE'); };
    usingFallback = true;
    speaking = true;
    speechSynthesis.speak(utterance);
    return true;
  };

  let card, play, restart, status;
  const update = (forced) => {
    if (!play || !status) return;
    const active = (!audio.paused && !audio.ended) || speaking;
    play.textContent = active ? '❚❚  PAUSE BUTLER MODE' : '▶  HOLD MY HAND · VOICE GUIDE';
    status.textContent = forced || (usingFallback ? 'BRITISH VOICE FALLBACK · USER-INITIATED · NO AUTOPLAY' : 'AI BUTLER GUIDE · USER-INITIATED · NO AUTOPLAY');
  };
  const toggle = async () => {
    if (speaking) { stopSpeech(); update(); return; }
    if (!audio.paused && !audio.ended) { audio.pause(); update(); return; }
    try {
      usingFallback = false;
      await audio.play();
      update();
    } catch {
      if (!fallbackSpeak()) update('VOICE GUIDE UNAVAILABLE');
      else update();
    }
  };
  const restartGuide = async () => {
    stopSpeech();
    usingFallback = false;
    audio.pause();
    audio.currentTime = 0;
    try { await audio.play(); update(); } catch { if (!fallbackSpeak()) update('VOICE GUIDE UNAVAILABLE'); }
  };
  audio.addEventListener('play', () => update());
  audio.addEventListener('pause', () => update());
  audio.addEventListener('ended', () => update('GUIDE COMPLETE · REPLAY ANY TIME'));
  audio.addEventListener('error', () => { if (!speaking) update('AI AUDIO BLOCKED · TAP PLAY FOR DEVICE VOICE FALLBACK'); });

  let attempts = 0;
  const mount = () => {
    const main = document.querySelector('#root main');
    const hero = main?.querySelector(':scope > section:first-of-type');
    if (!main || !hero) {
      if (++attempts < 60) setTimeout(mount,100);
      return;
    }
    if (document.getElementById('trader-butler-guide')) return;
    card = document.createElement('div');
    card.id = 'trader-butler-guide';
    card.innerHTML = `
      <div class="eyebrow">BUTLER MODE · AI HAND-HOLD GUIDE</div>
      <div class="title">NO FUCKING CLUE WHAT YOU'RE LOOKING AT?</div>
      <div class="copy">Want me to hold your hand? Tap once. A calm British-butler guide walks you through the crowd signal, candles, paper lab, prediction markets and why real money is still gated.</div>
      <div class="controls"><button type="button" data-play>▶  HOLD MY HAND · VOICE GUIDE</button><button type="button" class="secondary" data-restart>↻  START OVER</button></div>
      <div class="status">AI BUTLER GUIDE · USER-INITIATED · NO AUTOPLAY</div>`;
    const actionRow = hero.querySelector('.mt-6.flex');
    if (actionRow) hero.insertBefore(card,actionRow); else hero.appendChild(card);
    play = card.querySelector('[data-play]');
    restart = card.querySelector('[data-restart]');
    status = card.querySelector('.status');
    play.addEventListener('click',toggle);
    restart.addEventListener('click',restartGuide);
    update();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',mount,{once:true}); else mount();
})();
