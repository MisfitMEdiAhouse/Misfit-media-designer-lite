(()=>{
const PATH=location.pathname.replace(/\/+$/,'')||'/';if(PATH!=='/signal')return;

const AUDIO={
  intro:'https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/287eef77-c500-4ccd-be7f-4cccc1ad7514.mp3',
  market:'https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/180b0535-71bc-4850-99bb-ad6dceeac963.mp3',
  candle:'https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/6164ede5-79e0-47ee-a859-5de1ec29b805.mp3',
  crowd:'https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/a4bfd59b-a998-4e02-8bb3-fd00d6da9087.mp3',
  tape:'https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/07797f6a-05d4-4bf4-a513-2a760857c650.mp3',
  amount:'https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/fe4d72d1-2421-4dcf-b3a2-30e23bf21a0a.mp3',
  buy:'https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/3f6c8e11-6326-4778-b843-a561d853c9c1.mp3',
  verify:'https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/bcfac9f7-1847-4bda-8f42-30cca9c20a5d.mp3',
  finish:'https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/41b4d8c1-a413-4178-9c75-3a66052f7e11.mp3'
};

const css=document.createElement('style');
css.textContent=`
body[data-misfit-trader]{background:#020304!important}
body[data-misfit-trader] #root{position:relative;z-index:1;background:transparent!important}
body[data-misfit-trader] #root>div.min-h-screen{background:transparent!important}
#misfit-trader-brand-bg{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;background:#020304}
#misfit-trader-brand-bg .photo{position:absolute;inset:0;background:url('/misfit-trader-rig-bg.webp') 58% top/cover no-repeat;transform:scale(1.015)}
#misfit-trader-brand-bg .shade{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.22),rgba(0,0,0,.52) 32%,rgba(0,0,0,.77) 70%,rgba(0,0,0,.91))}
#misfit-trader-brand-bg .brand-wash{position:absolute;inset:0;background:radial-gradient(circle at 16% 8%,rgba(34,211,238,.12),transparent 31%),radial-gradient(circle at 91% 22%,rgba(217,70,239,.10),transparent 32%)}
body[data-misfit-trader] main>section:first-of-type{background:linear-gradient(135deg,rgba(4,15,22,.73),rgba(5,4,12,.71))!important;backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);box-shadow:0 26px 80px rgba(0,0,0,.38)}
body[data-misfit-trader] main>section:not(:first-of-type){backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px)}

#trader-guide{margin-top:1.1rem;max-width:760px;border:1px solid rgba(125,211,252,.28);border-radius:1rem;background:linear-gradient(135deg,rgba(3,10,14,.96),rgba(14,6,19,.95));box-shadow:0 18px 54px rgba(0,0,0,.38);padding:14px}
#trader-guide.running{position:fixed;z-index:10002;left:12px;right:12px;bottom:12px;margin:0;max-height:46vh;overflow:auto;overscroll-behavior:contain}
#trader-guide .ey{font:600 10px/1.3 'JetBrains Mono',monospace;letter-spacing:.15em;color:#67e8f9;text-transform:uppercase}
#trader-guide .ti{margin-top:6px;font:800 17px/1.25 Inter,sans-serif;color:#fff}
#trader-guide .cp{margin-top:6px;font:400 13px/1.55 Inter,sans-serif;color:#b7c2d1}
#trader-guide .bar{margin-top:11px;height:5px;overflow:hidden;border-radius:999px;background:rgba(255,255,255,.08)}
#trader-guide .bar span{display:block;height:100%;width:0;background:linear-gradient(90deg,#67e8f9,#e879f9);transition:width .25s}
#trader-guide .step{margin-top:10px;border:1px solid rgba(103,232,249,.18);border-radius:12px;background:rgba(0,0,0,.28);padding:9px 10px;font:600 10px/1.5 'JetBrains Mono',monospace;color:#d9f8ff}
#trader-guide .ctrl{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:11px}
#trader-guide button{min-height:48px;border-radius:12px;padding:0 14px;border:1px solid rgba(103,232,249,.32);background:rgba(3,18,24,.78);color:#e6fbff;font:800 10px/1.2 'JetBrains Mono',monospace;cursor:pointer}
#trader-guide button.alt{border-color:rgba(255,255,255,.12);background:rgba(0,0,0,.38);color:#b6beca}
#trader-guide button[data-a=next]{grid-column:1/-1;min-height:54px;border-color:rgba(103,232,249,.9);background:linear-gradient(135deg,rgba(8,63,75,.96),rgba(20,34,70,.96));color:#fff;box-shadow:0 0 0 1px rgba(103,232,249,.14),0 0 30px rgba(34,211,238,.15);font-size:11px}
#trader-guide button[data-a=next]:active{transform:translateY(1px)}
#trader-guide .st{margin-top:8px;font:500 9px/1.4 'JetBrains Mono',monospace;color:#7dd3fc;text-transform:uppercase;letter-spacing:.08em}
.misfit-tour-target{position:relative!important;z-index:10001!important;outline:3px solid rgba(103,232,249,.95)!important;outline-offset:4px!important;box-shadow:0 0 0 8px rgba(103,232,249,.12),0 0 48px rgba(34,211,238,.35)!important;scroll-margin-top:105px;scroll-margin-bottom:300px}
.misfit-tour-pulse{animation:mtp 1.2s ease-in-out infinite alternate}
@keyframes mtp{to{filter:brightness(1.18)}}
@media(min-width:768px){#misfit-trader-brand-bg .photo{background-position:center top}#trader-guide.running{left:auto;right:20px;bottom:20px;width:min(420px,calc(100vw - 40px));max-height:74vh}}
@media(max-width:420px){#misfit-trader-brand-bg .photo{background-position:61% top}#trader-guide .ctrl{grid-template-columns:1fr}#trader-guide button,#trader-guide button[data-a=next]{grid-column:1;min-height:50px;width:100%}}
@media(prefers-reduced-motion:reduce){#misfit-trader-brand-bg .photo{transform:none}.misfit-tour-pulse{animation:none}}
`;
document.head.appendChild(css);
document.body.dataset.misfitTrader='true';

if(!document.getElementById('misfit-trader-brand-bg')){
  const bg=document.createElement('div');
  bg.id='misfit-trader-brand-bg';
  bg.setAttribute('aria-hidden','true');
  bg.innerHTML='<div class="photo"></div><div class="shade"></div><div class="brand-wash"></div>';
  document.body.prepend(bg);
}

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

let boot=0;
function mount(){
  const main=document.querySelector('#root main');
  const hero=main?.querySelector(':scope>section:first-of-type');
  if(!main||!hero){if(++boot<80)setTimeout(mount,100);return;}
  if(document.getElementById('trader-guide'))return;

  const card=document.createElement('div');
  card.id='trader-guide';
  card.innerHTML=`
    <div class="ey">MISFIT AI · GUIDED TRADING TOUR</div>
    <div class="ti">NEW HERE? I'LL WALK YOU THROUGH IT.</div>
    <div class="cp">Tap Start Tour. I'll point to the exact control, tell you what to do, and stay with you until your first paper trade is on screen.</div>
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

  let index=-1,target=null,cleanup=[],running=false,beforeTrades=0,stepToken=0;

  const tradeCount=()=>{
    try{return(JSON.parse(localStorage.getItem('misfit-signal-paper-v3'))?.trades||[]).length;}
    catch{return 0;}
  };

  const clearStep=()=>{
    cleanup.splice(0).forEach(fn=>{try{fn();}catch{}});
    if(target)target.classList.remove('misfit-tour-target','misfit-tour-pulse');
    target=null;
  };

  const stopVoice=()=>{
    try{audio.pause();audio.currentTime=0;}catch{}
    voice.textContent='REPLAY VOICE';
  };

  const playVoice=async url=>{
    try{
      audio.pause();
      audio.src=url;
      audio.currentTime=0;
      await audio.play();
      voice.textContent='PAUSE VOICE';
    }catch{
      voice.textContent='VOICE UNAVAILABLE';
    }
  };

  voice.onclick=async()=>{
    if(!running||index<0)return;
    if(!audio.paused){
      audio.pause();
      voice.textContent='RESUME VOICE';
      return;
    }
    try{
      await audio.play();
      voice.textContent='PAUSE VOICE';
    }catch{
      voice.textContent='VOICE UNAVAILABLE';
    }
  };
  audio.onended=()=>{if(running)voice.textContent='REPLAY VOICE';};

  const targetResolvers={
    hero:()=>hero,
    candleControls:()=>document.querySelector('#candle-lab select')?.parentElement||document.getElementById('candle-lab'),
    candle:()=>document.getElementById('candle-lab'),
    crowd:()=>textMatch('FIELD EMOTION',main)?.closest('section')||textMatch('REGIME',main)?.closest('section')||panel(textMatch('FIELD EMOTION',main)),
    tape:()=>panel(textMatch('MARKET TAPE',main)),
    amount:()=>main.querySelector('input[type=number],input[inputmode=decimal],input'),
    buy:()=>findButton(/(^|\s)(PAPER\s+)?BUY(\s|$)/i,['ACCESS']),
    verify:()=>textMatch('MANUAL EQUITY',main)?.closest('section')||textMatch('MANUAL EXPOSURE',main)?.closest('section')||panel(textMatch('MANUAL EQUITY',main)),
    finish:()=>textMatch('AUTONOMOUS',main)?.closest('section')||textMatch('PREDICTION',main)?.closest('section')||textMatch('PAPER AUTOPILOT',main)?.closest('section')||main.lastElementChild
  };

  const steps=[
    {title:'WELCOME TO MISFIT TRADER',copy:'We are going to make one complete paper-trading pass together. Nothing here can move real money. Tap Next and I will take you to the first control.',audio:AUDIO.intro,target:'hero',next:'NEXT → PICK A MARKET'},
    {title:'STEP 1 · PICK A MARKET + TIMEFRAME',copy:'Tap the highlighted market selector and choose BTC, ETH, or SOL. Then tap a timeframe. Seven days is a good beginner view. If the detector misses your tap, use Next — you can never get stuck.',audio:AUDIO.market,target:'candleControls',next:'NEXT → READ THE CANDLE',mode:'market-time'},
    {title:'STEP 2 · READ THE CANDLE',copy:'Look at the chart and pattern cards. Misfit explains what the latest candle structure usually means. A pattern is evidence, not a prediction. When it makes sense, tap Next.',audio:AUDIO.candle,target:'candle',next:'NEXT → READ THE CROWD'},
    {title:'STEP 3 · READ THE CROWD',copy:'Check Field Emotion and Regime. They describe the environment your trade would enter; they are not a buy signal. Read both, then continue.',audio:AUDIO.crowd,target:'crowd',next:'NEXT → CHOOSE AN ASSET'},
    {title:'STEP 4 · CHOOSE THE ASSET',copy:'In Market Tape, tap the live row for the asset you want to practice with. That selection feeds the paper order. I may advance automatically; Next is always available.',audio:AUDIO.tape,target:'tape',next:'NEXT → SET PAPER AMOUNT',mode:'market-click'},
    {title:'STEP 5 · SET YOUR PAPER AMOUNT',copy:'This is virtual money only. One thousand dollars is a fine first practice size. Change it if you want, or leave the default, then continue.',audio:AUDIO.amount,target:'amount',next:'NEXT → PLACE PAPER BUY'},
    {title:'STEP 6 · PLACE THE PAPER BUY',copy:'Tap the highlighted Buy button. Misfit will use the live price but only move virtual cash. If the confirmation detector fires, I will advance automatically. Next is still available.',audio:AUDIO.buy,target:'buy',next:'NEXT → VERIFY THE TRADE',mode:'buy-click'},
    {title:'STEP 7 · VERIFY THE TRADE',copy:'Look at Manual Exposure, Manual Equity, your new position, and trade history. Your virtual cash should have changed and the position will move with the live market.',audio:AUDIO.verify,target:'verify',next:'NEXT → OTHER SIGNALS'},
    {title:'STEP 8 · USE THE OTHER SIGNALS',copy:'Autonomous paper portfolios and prediction-market intelligence are comparison tools. Use them to challenge your thesis, not blindly copy a trade. Tap Finish Tour when you are done looking.',audio:AUDIO.finish,target:'finish',next:'FINISH TOUR'}
  ];

  function bindAutoAdvance(step,resolved,token){
    if(step.mode==='market-time'){
      const section=document.getElementById('candle-lab');
      const select=section?.querySelector('select');
      const times=all('button',section||document).filter(b=>/^(24H|7D|14D|30D)$/.test(norm(b.textContent)));
      let marketTouched=false,timeTouched=false;
      const check=()=>{
        if(marketTouched&&timeTouched&&running&&token===stepToken){
          status.textContent='MARKET + TIMEFRAME SET · MOVING ON';
          setTimeout(()=>{if(running&&token===stepToken)show(index+1);},350);
        }
      };
      const onMarket=()=>{marketTouched=true;check();};
      const onTime=()=>{timeTouched=true;check();};
      select?.addEventListener('change',onMarket);
      select?.addEventListener('pointerdown',onMarket);
      times.forEach(b=>b.addEventListener('click',onTime));
      cleanup.push(()=>{
        select?.removeEventListener('change',onMarket);
        select?.removeEventListener('pointerdown',onMarket);
        times.forEach(b=>b.removeEventListener('click',onTime));
      });
      return;
    }

    if(step.mode==='market-click'){
      const buttons=all('button',resolved).filter(b=>!/REFRESH|COMMAND|ACCESS/.test(norm(b.textContent)));
      const pick=()=>{
        status.textContent='ASSET SELECTED · MOVING TO PAPER AMOUNT';
        setTimeout(()=>{if(running&&token===stepToken)show(index+1);},350);
      };
      buttons.forEach(b=>b.addEventListener('click',pick,{once:true}));
      cleanup.push(()=>buttons.forEach(b=>b.removeEventListener('click',pick)));
      return;
    }

    if(step.mode==='buy-click'){
      const buyButton=resolved?.tagName==='BUTTON'?resolved:findButton(/(^|\s)(PAPER\s+)?BUY(\s|$)/i,['ACCESS']);
      if(!buyButton)return;
      beforeTrades=tradeCount();
      const onBuy=()=>{
        status.textContent='CHECKING PAPER ORDER CONFIRMATION…';
        let tries=0;
        const poll=()=>{
          if(!running||token!==stepToken)return;
          if(tradeCount()>beforeTrades){
            status.textContent='PAPER TRADE CONFIRMED · NICE WORK';
            setTimeout(()=>{if(running&&token===stepToken)show(index+1);},400);
          }else if(++tries<16){
            setTimeout(poll,220);
          }else{
            status.textContent='NO CONFIRMATION DETECTED · CHECK THE APP MESSAGE OR TAP NEXT';
          }
        };
        setTimeout(poll,180);
      };
      buyButton.addEventListener('click',onBuy,{once:true});
      cleanup.push(()=>buyButton.removeEventListener('click',onBuy));
    }
  }

  function locate(step,token,attempt=0){
    if(!running||token!==stepToken)return;
    const resolved=targetResolvers[step.target]?.();
    if(resolved){
      target=resolved;
      target.classList.add('misfit-tour-target','misfit-tour-pulse');
      try{target.scrollIntoView({behavior:'smooth',block:'center'});}
      catch{target.scrollIntoView();}
      bindAutoAdvance(step,resolved,token);
      return;
    }
    if(attempt<36){
      setTimeout(()=>locate(step,token,attempt+1),250);
      return;
    }
    status.textContent='HIGHLIGHT STILL LOADING · USE NEXT TO KEEP GOING';
  }

  function show(nextIndex){
    clearStep();
    stopVoice();
    index=Math.max(0,Math.min(nextIndex,steps.length-1));
    stepToken+=1;
    const token=stepToken;
    const step=steps[index];

    card.classList.add('running');
    title.textContent=step.title;
    copy.textContent=step.copy;
    stepBox.hidden=false;
    stepBox.textContent=index===0?'START HERE · FOLLOW THE CYAN HIGHLIGHT':`STEP ${index} OF ${steps.length-1} · FOLLOW THE CYAN HIGHLIGHT`;
    bar.style.width=`${((index+1)/steps.length)*100}%`;

    start.hidden=true;
    voice.hidden=false;
    next.hidden=false;
    exit.hidden=false;
    next.disabled=false;
    next.textContent=step.next;

    status.textContent=step.mode?'DO THE HIGHLIGHTED ACTION · NEXT IS ALWAYS AVAILABLE':'LISTEN · LOOK · THEN TAP NEXT';

    playVoice(step.audio);
    locate(step,token);
  }

  function finish(){
    clearStep();
    stopVoice();
    running=false;
    index=-1;
    stepToken+=1;
    card.classList.remove('running');

    title.textContent='YOU ARE PAPER TRADING.';
    copy.textContent='You picked a market, read the candle, checked the crowd, chose an asset, set a virtual amount, placed a paper buy, and checked the position. Keep practicing. Real-money trading stays locked.';
    stepBox.hidden=false;
    stepBox.textContent='FIRST PAPER-TRADE WALKTHROUGH COMPLETE';
    bar.style.width='100%';

    start.hidden=false;
    start.textContent='RUN TOUR AGAIN';
    voice.hidden=true;
    next.hidden=true;
    exit.hidden=false;
    exit.textContent='CLOSE GUIDE';
    status.textContent='PAPER MODE ACTIVE · REAL MONEY LOCKED';
  }

  start.onclick=()=>{
    running=true;
    start.textContent='START TOUR';
    exit.textContent='EXIT TOUR';
    show(0);
  };

  next.onclick=()=>{
    if(!running)return;
    if(index>=steps.length-1)finish();
    else show(index+1);
  };

  exit.onclick=()=>{
    if(!running&&index===-1){
      card.style.display='none';
      return;
    }
    clearStep();
    stopVoice();
    running=false;
    index=-1;
    stepToken+=1;
    card.classList.remove('running');

    title.textContent="NEW HERE? I'LL WALK YOU THROUGH IT.";
    copy.textContent="Tap Start Tour. I'll point to the exact control, tell you what to do, and stay with you until your first paper trade is on screen.";
    stepBox.hidden=true;
    bar.style.width='0';

    start.hidden=false;
    voice.hidden=true;
    next.hidden=true;
    exit.hidden=true;
    status.textContent='PAPER TRADING ONLY · REAL MONEY REMAINS LOCKED';
  };

  window.__MISFIT_TRADER_GUIDE__=Object.freeze({
    version:'guided-onboarding-v3-never-trap',
    steps:steps.length,
    autoplay:false,
    realMoney:false,
    start:()=>{if(!running)start.click();},
    stop:()=>{clearStep();stopVoice();}
  });
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});
else mount();
})();