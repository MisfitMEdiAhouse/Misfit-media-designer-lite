(()=>{
  const path=location.pathname.replace(/\/+$/,'')||'/';
  if(path!=='/signal')return;

  // Reserve the guide id before the legacy experience script mounts its old tour.
  // The legacy script still provides the approved Trader background treatment.
  const sentinel=document.createElement('div');
  sentinel.id='trader-guide';
  sentinel.hidden=true;
  document.body.appendChild(sentinel);

  const AUDIO={
    market:'https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/180b0535-71bc-4850-99bb-ad6dceeac963.mp3',
    candle:'https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/6164ede5-79e0-47ee-a859-5de1ec29b805.mp3',
    crowd:'https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/a4bfd59b-a998-4e02-8bb3-fd00d6da9087.mp3',
    tape:'https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/07797f6a-05d4-4bf4-a513-2a760857c650.mp3',
    amount:'https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/fe4d72d1-2421-4dcf-b3a2-30e23bf21a0a.mp3',
    buy:'https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/3f6c8e11-6326-4778-b843-a561d853c9c1.mp3',
    verify:'https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/bcfac9f7-1847-4bda-8f42-30cca9c20a5d.mp3',
    finish:'https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/41b4d8c1-a413-4178-9c75-3a66052f7e11.mp3'
  };

  const norm=v=>String(v||'').replace(/\s+/g,' ').trim().toUpperCase();
  const all=(s,r=document)=>[...r.querySelectorAll(s)];
  const textMatch=(q,r=document)=>{
    q=norm(q);
    return all('h1,h2,h3,h4,p,div,span,label',r).find(el=>{
      const t=norm(el.textContent);
      return t===q||(t.includes(q)&&t.length<Math.max(180,q.length*5));
    })||null;
  };
  const panel=el=>el?.closest('section,div.rounded-3xl,div.rounded-2xl,div.rounded-xl,div[class*="rounded"]')||el||null;
  const findButton=(rx,exclude=[])=>all('button',document.querySelector('#root main')||document).find(b=>{
    const t=norm(b.textContent);
    return rx.test(t)&&!exclude.some(x=>t.includes(norm(x)));
  })||null;

  let tries=0;
  function mount(){
    const main=document.querySelector('#root main');
    const hero=main?.querySelector(':scope>section:first-of-type');
    if(!main||!hero){if(++tries<100)setTimeout(mount,100);return;}

    sentinel.remove();
    if(document.getElementById('trader-guide'))return;

    const style=document.createElement('style');
    style.textContent=`
      #trader-guide{margin-top:1.1rem;max-width:760px;border:1px solid rgba(125,211,252,.28);border-radius:1rem;background:linear-gradient(135deg,rgba(3,10,14,.96),rgba(14,6,19,.95));box-shadow:0 18px 54px rgba(0,0,0,.38);padding:14px}
      #trader-guide.running{position:fixed!important;z-index:10020!important;left:10px!important;right:10px!important;bottom:max(10px,env(safe-area-inset-bottom))!important;top:auto!important;margin:0!important;width:auto!important;max-width:none!important;max-height:min(42vh,360px)!important;overflow:auto!important;overscroll-behavior:contain!important;box-shadow:0 22px 70px rgba(0,0,0,.72)!important}
      #trader-guide .ey{font:600 10px/1.3 'JetBrains Mono',monospace;letter-spacing:.15em;color:#67e8f9;text-transform:uppercase}
      #trader-guide .ti{margin-top:6px;font:800 17px/1.25 Inter,sans-serif;color:#fff}
      #trader-guide .cp{margin-top:6px;font:400 13px/1.55 Inter,sans-serif;color:#b7c2d1}
      #trader-guide .bar{margin-top:11px;height:5px;overflow:hidden;border-radius:999px;background:rgba(255,255,255,.08)}
      #trader-guide .bar span{display:block;height:100%;width:0;background:linear-gradient(90deg,#67e8f9,#e879f9);transition:width .25s}
      #trader-guide .step{margin-top:10px;border:1px solid rgba(103,232,249,.18);border-radius:12px;background:rgba(0,0,0,.28);padding:9px 10px;font:600 10px/1.5 'JetBrains Mono',monospace;color:#d9f8ff}
      #trader-guide .ctrl{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:11px}
      #trader-guide.running .ctrl{position:sticky;z-index:3;bottom:0;padding-top:10px;padding-bottom:2px;background:linear-gradient(to bottom,rgba(8,8,16,0),rgba(8,8,16,.96) 26%,rgba(8,8,16,.99))}
      #trader-guide button{min-height:48px;border-radius:12px;padding:0 14px;border:1px solid rgba(103,232,249,.32);background:rgba(3,18,24,.78);color:#e6fbff;font:800 10px/1.2 'JetBrains Mono',monospace;cursor:pointer}
      #trader-guide button.alt{border-color:rgba(255,255,255,.12);background:rgba(0,0,0,.38);color:#b6beca}
      #trader-guide button[data-a=start],#trader-guide button[data-a=next]{grid-column:1/-1;min-height:56px;border-color:#67e8f9!important;background:#67e8f9!important;color:#031014!important;-webkit-text-fill-color:#031014!important;font-size:11px;font-weight:900;letter-spacing:.08em;box-shadow:0 0 0 1px rgba(103,232,249,.32),0 0 30px rgba(34,211,238,.18)}
      #trader-guide .st{margin-top:8px;font:500 9px/1.4 'JetBrains Mono',monospace;color:#7dd3fc;text-transform:uppercase;letter-spacing:.08em}
      .misfit-tour-target{position:relative!important;z-index:10001!important;outline:3px solid rgba(103,232,249,.95)!important;outline-offset:4px!important;box-shadow:0 0 0 8px rgba(103,232,249,.12),0 0 48px rgba(34,211,238,.35)!important}
      .misfit-tour-secondary{position:relative!important;z-index:10001!important;outline:2px solid rgba(103,232,249,.88)!important;outline-offset:3px!important;box-shadow:0 0 0 6px rgba(103,232,249,.09),0 0 26px rgba(34,211,238,.24)!important}
      @media(min-width:768px){#trader-guide.running{left:auto!important;right:20px!important;bottom:20px!important;width:min(430px,calc(100vw - 40px))!important;max-height:72vh!important}}
      @media(max-width:420px){#trader-guide .ctrl{grid-template-columns:1fr}#trader-guide button{grid-column:1!important;width:100%}}
    `;
    document.head.appendChild(style);

    const card=document.createElement('div');
    card.id='trader-guide';
    card.innerHTML=`
      <div class="ey">MISFIT AI · GUIDED TRADING TOUR</div>
      <div class="ti">NEW HERE? I'LL WALK YOU THROUGH IT.</div>
      <div class="cp">Tap Start Tour. I’ll point to the exact control, explain what it does, and stay with you until your first paper trade is on screen.</div>
      <div class="bar"><span></span></div>
      <div class="step" hidden></div>
      <div class="ctrl">
        <button data-a="start">START TOUR</button>
        <button class="alt" data-a="voice" hidden>REPLAY VOICE</button>
        <button data-a="next" hidden>NEXT</button>
        <button class="alt" data-a="exit" hidden>EXIT TOUR</button>
      </div>
      <div class="st">PAPER TRADING ONLY · REAL MONEY REMAINS LOCKED</div>`;
    const row=hero.querySelector('.mt-6.flex');
    row?hero.insertBefore(card,row):hero.appendChild(card);

    const title=card.querySelector('.ti');
    const copy=card.querySelector('.cp');
    const bar=card.querySelector('.bar span');
    const stepBox=card.querySelector('.step');
    const status=card.querySelector('.st');
    const start=card.querySelector('[data-a=start]');
    const voice=card.querySelector('[data-a=voice]');
    const next=card.querySelector('[data-a=next]');
    const exit=card.querySelector('[data-a=exit]');
    const audio=new Audio();
    audio.preload='metadata';

    let index=-1,target=null,running=false,cleanup=[],beforeTrades=0;
    const tradeCount=()=>{try{return(JSON.parse(localStorage.getItem('misfit-signal-paper-v3'))?.trades||[]).length}catch{return 0}};
    const clearHighlights=()=>{
      cleanup.splice(0).forEach(fn=>{try{fn()}catch{}});
      document.querySelectorAll('.misfit-tour-target,.misfit-tour-secondary').forEach(el=>el.classList.remove('misfit-tour-target','misfit-tour-secondary'));
      target=null;
    };
    const stopVoice=()=>{try{audio.pause();audio.currentTime=0}catch{};voice.textContent='REPLAY VOICE'};
    const playVoice=async url=>{try{audio.pause();audio.src=url;audio.currentTime=0;await audio.play();voice.textContent='PAUSE VOICE'}catch{voice.textContent='VOICE UNAVAILABLE'}};
    voice.onclick=async()=>{if(!running||index<0)return;if(!audio.paused){audio.pause();voice.textContent='RESUME VOICE';return}try{await audio.play();voice.textContent='PAUSE VOICE'}catch{voice.textContent='VOICE UNAVAILABLE'}};
    audio.onended=()=>{if(running)voice.textContent='REPLAY VOICE'};

    const targets={
      market:()=>document.querySelector('#candle-lab select')?.parentElement||document.getElementById('candle-lab'),
      candle:()=>document.getElementById('candle-lab'),
      crowd:()=>textMatch('FIELD EMOTION',main)?.closest('section')||textMatch('REGIME',main)?.closest('section')||panel(textMatch('FIELD EMOTION',main)),
      tape:()=>panel(textMatch('MARKET TAPE',main)),
      amount:()=>main.querySelector('input[type=number],input[inputmode=decimal],input'),
      buy:()=>findButton(/(^|\s)(PAPER\s+)?BUY(\s|$)/i,['ACCESS']),
      verify:()=>textMatch('MANUAL EQUITY',main)?.closest('section')||textMatch('MANUAL EXPOSURE',main)?.closest('section')||panel(textMatch('MANUAL EQUITY',main)),
      finish:()=>textMatch('AUTONOMOUS',main)?.closest('section')||textMatch('PREDICTION',main)?.closest('section')||textMatch('PAPER AUTOPILOT',main)?.closest('section')||main.lastElementChild
    };

    const steps=[
      {title:'STEP 1 · PICK A MARKET + TIMEFRAME',copy:'Choose BTC, ETH, SOL, or another available market. Try 24 hours, 7 days, 14 days, and 30 days. Refresh the chart and experiment as much as you want. Nothing you tap here will move the tour forward. Tap Next only when you are ready.',audio:AUDIO.market,target:'market',next:'NEXT → READ THE CANDLE',extras:'market'},
      {title:'STEP 2 · READ THE CANDLE',copy:'Study the chart and pattern cards. Switch timeframes, refresh, and compare what changes. A pattern is evidence, not a prediction. Stay here as long as you want, then tap Next when you are ready to read the crowd.',audio:AUDIO.candle,target:'candle',next:'NEXT → READ THE CROWD'},
      {title:'STEP 3 · READ THE CROWD',copy:'Check Field Emotion and Regime. They describe the environment your trade would enter; they are not a buy signal. Read both, then tap Next when you are ready.',audio:AUDIO.crowd,target:'crowd',next:'NEXT → CHOOSE AN ASSET'},
      {title:'STEP 4 · CHOOSE THE ASSET',copy:'In Market Tape, tap the live asset you want to practice with. You can change your mind and compare rows. The tour will stay here until you press Next.',audio:AUDIO.tape,target:'tape',next:'NEXT → SET PAPER AMOUNT'},
      {title:'STEP 5 · SET YOUR PAPER AMOUNT',copy:'This is virtual money only. One thousand dollars is a simple first practice size. Change it, experiment with the amount, and tap Next only when you are ready to place a paper trade.',audio:AUDIO.amount,target:'amount',next:'NEXT → PLACE PAPER BUY'},
      {title:'STEP 6 · PLACE THE PAPER BUY',copy:'Tap the highlighted Buy button when you are ready. Misfit uses the live price but only moves virtual cash. A successful paper order will be detected, but it will not move you forward automatically. Tap Next after you have seen the confirmation.',audio:AUDIO.buy,target:'buy',next:'NEXT → VERIFY THE TRADE',watchTrade:true},
      {title:'STEP 7 · VERIFY THE TRADE',copy:'Look at Manual Exposure, Manual Equity, your new position, and trade history. Your virtual cash should have changed and the position will move with the live market. Tap Next when you understand what changed.',audio:AUDIO.verify,target:'verify',next:'NEXT → OTHER SIGNALS'},
      {title:'STEP 8 · USE THE OTHER SIGNALS',copy:'Autonomous paper portfolios and prediction-market intelligence are comparison tools. Use them to challenge your thesis, not blindly copy a trade. Explore as long as you want, then finish the tour.',audio:AUDIO.finish,target:'finish',next:'FINISH TOUR'}
    ];

    function dock(){if(card.classList.contains('running')&&card.parentNode!==document.body)document.body.appendChild(card)}
    function scrollTarget(delay=100){setTimeout(()=>{if(!running||!target)return;dock();const r=target.getBoundingClientRect();const g=card.getBoundingClientRect();const nav=document.querySelector('nav');const top=Math.max(72,nav?.getBoundingClientRect().bottom||0)+12;const bottom=Math.max(top+120,g.top-14);const room=bottom-top;const targetPoint=r.height>room*.7?r.top:r.top+r.height/2;const desired=r.height>room*.7?top+24:top+room/2;const delta=targetPoint-desired;if(Math.abs(delta)>12)window.scrollBy({top:delta,behavior:'smooth'})},delay)};

    function applyExtras(step){
      if(step.extras==='market'){
        const lab=document.getElementById('candle-lab');
        const select=lab?.querySelector('select');
        if(select)select.classList.add('misfit-tour-secondary');
        all('button',lab||document).filter(b=>/^(24H|7D|14D|30D)$/.test(norm(b.textContent))).forEach(b=>b.classList.add('misfit-tour-secondary'));
        status.textContent='EXPLORE FREELY · ONLY NEXT ADVANCES THE TOUR';
      }
      if(step.watchTrade){
        const buy=targets.buy();
        if(!buy)return;
        beforeTrades=tradeCount();
        const onBuy=()=>{
          status.textContent='CHECKING PAPER ORDER CONFIRMATION…';
          let n=0;
          const poll=()=>{
            if(!running||index!==5)return;
            if(tradeCount()>beforeTrades)status.textContent='PAPER TRADE CONFIRMED · TAP NEXT WHEN YOU ARE READY';
            else if(++n<16)setTimeout(poll,220);
            else status.textContent='NO CONFIRMATION DETECTED · CHECK THE APP MESSAGE · NEXT STILL WORKS';
          };
          setTimeout(poll,180);
        };
        buy.addEventListener('click',onBuy);
        cleanup.push(()=>buy.removeEventListener('click',onBuy));
      }
    }

    function show(i){
      clearHighlights();stopVoice();
      index=Math.max(0,Math.min(i,steps.length-1));
      const step=steps[index];
      running=true;card.classList.add('running');dock();
      title.textContent=step.title;copy.textContent=step.copy;stepBox.hidden=false;stepBox.textContent=`STEP ${index+1} OF ${steps.length} · FOLLOW THE CYAN HIGHLIGHT`;
      bar.style.width=`${((index+1)/steps.length)*100}%`;
      start.hidden=true;voice.hidden=false;next.hidden=false;exit.hidden=false;next.textContent=step.next;next.disabled=false;
      status.textContent='EXPLORE THE HIGHLIGHTED AREA · ONLY NEXT ADVANCES';
      target=targets[step.target]?.()||null;
      if(target){target.classList.add('misfit-tour-target');applyExtras(step);scrollTarget(120)}else status.textContent='HIGHLIGHT STILL LOADING · NEXT IS ALWAYS AVAILABLE';
      playVoice(step.audio);
    }

    function finish(){
      clearHighlights();stopVoice();running=false;index=-1;card.classList.remove('running');
      title.textContent='YOU ARE PAPER TRADING.';
      copy.textContent='You picked a market, explored the candle chart, checked the crowd, chose an asset, set a virtual amount, placed a paper buy, and checked the position. Keep practicing. Real-money trading stays locked.';
      stepBox.hidden=false;stepBox.textContent='FIRST PAPER-TRADE WALKTHROUGH COMPLETE';bar.style.width='100%';
      start.hidden=false;start.textContent='RUN TOUR AGAIN';voice.hidden=true;next.hidden=true;exit.hidden=false;exit.textContent='CLOSE GUIDE';status.textContent='PAPER MODE ACTIVE · REAL MONEY LOCKED';
    }

    start.onclick=()=>show(0);
    next.onclick=()=>{if(!running)return;if(index>=steps.length-1)finish();else show(index+1)};
    exit.onclick=()=>{
      if(!running&&index===-1){card.style.display='none';return}
      clearHighlights();stopVoice();running=false;index=-1;card.classList.remove('running');
      title.textContent="NEW HERE? I'LL WALK YOU THROUGH IT.";copy.textContent="Tap Start Tour. I’ll point to the exact control, explain what it does, and stay with you until your first paper trade is on screen.";
      stepBox.hidden=true;bar.style.width='0';start.hidden=false;start.textContent='START TOUR';voice.hidden=true;next.hidden=true;exit.hidden=true;status.textContent='PAPER TRADING ONLY · REAL MONEY REMAINS LOCKED';
    };
    window.addEventListener('resize',()=>{if(running)scrollTarget(30)},{passive:true});
    window.addEventListener('orientationchange',()=>{if(running)scrollTarget(160)},{passive:true});
    window.__MISFIT_TRADER_GUIDE__=Object.freeze({version:'guided-onboarding-v4-manual-only',steps:steps.length,autoplay:false,autoAdvance:false,realMoney:false,start:()=>{if(!running)start.click()},stop:()=>exit.click()});
  }

  setTimeout(mount,0);
})();