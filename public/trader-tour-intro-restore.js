(()=>{
  if((location.pathname.replace(/\/+$/,'')||'/')!=='/signal')return;

  const INTRO_AUDIO='https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/5fc79ec2-8133-4611-9872-6fd17919743c.mp3';
  let tries=0;

  function boot(){
    const card=document.getElementById('trader-guide');
    if(!card){if(++tries<140)setTimeout(boot,100);return;}
    if(card.dataset.introRestore==='1')return;

    const title=card.querySelector('.ti');
    const copy=card.querySelector('.cp');
    const bar=card.querySelector('.bar span');
    const stepBox=card.querySelector('.step');
    const status=card.querySelector('.st');
    const start=card.querySelector('[data-a="start"]');
    const voice=card.querySelector('[data-a="voice"]');
    const next=card.querySelector('[data-a="next"]');
    const exit=card.querySelector('[data-a="exit"]');
    if(!title||!copy||!bar||!stepBox||!status||!start||!voice||!next||!exit)return;

    card.dataset.introRestore='1';
    const homeParent=card.parentNode;
    const homeNext=card.nextSibling;
    const originalStart=start.onclick;
    const originalVoice=voice.onclick;
    const originalNext=next.onclick;
    const originalExit=exit.onclick;
    const introAudio=new Audio(INTRO_AUDIO);
    introAudio.preload='metadata';
    let introActive=false;

    const stopIntro=()=>{try{introAudio.pause();introAudio.currentTime=0}catch{}};
    const restoreHandlers=()=>{
      start.onclick=originalStart;
      voice.onclick=originalVoice;
      next.onclick=originalNext;
      exit.onclick=originalExit;
    };
    const restoreHome=()=>{
      stopIntro();
      introActive=false;
      restoreHandlers();
      card.classList.remove('running');
      if(homeParent&&card.parentNode!==homeParent){
        if(homeNext&&homeNext.parentNode===homeParent)homeParent.insertBefore(card,homeNext);
        else homeParent.appendChild(card);
      }
      card.scrollTop=0;
      title.textContent="NEW HERE? I'LL WALK YOU THROUGH IT.";
      copy.textContent="Tap Start Tour. I’ll point to the exact control, explain what it does, and stay with you until your first paper trade is on screen.";
      bar.style.width='0';
      stepBox.hidden=true;
      start.hidden=false;start.textContent='START TOUR';
      voice.hidden=true;
      next.hidden=true;
      exit.hidden=true;
      status.textContent='PAPER TRADING ONLY · REAL MONEY REMAINS LOCKED';
    };

    function launchIntro(){
      introActive=true;
      card.classList.add('running');
      if(card.parentNode!==document.body)document.body.appendChild(card);
      card.scrollTop=0;
      requestAnimationFrame(()=>card.scrollTop=0);
      title.textContent='WELCOME TO MISFIT TRADER';
      copy.textContent="I’m going to walk you through one complete paper-trading pass, step by step. Nothing here can move real money. When you’re ready, tap Next and I’ll take you to your first control.";
      bar.style.width='4%';
      stepBox.hidden=false;
      stepBox.textContent='INTRO · FIRST PAPER-TRADE WALKTHROUGH';
      start.hidden=true;
      voice.hidden=false;voice.textContent='PAUSE VOICE';
      next.hidden=false;next.disabled=false;next.textContent='NEXT → PICK A MARKET';
      exit.hidden=false;exit.textContent='EXIT TOUR';
      status.textContent='LISTEN · THEN TAP NEXT';

      start.onclick=launchIntro;
      voice.onclick=async()=>{
        if(!introActive)return;
        if(!introAudio.paused){introAudio.pause();voice.textContent='RESUME VOICE';return;}
        try{await introAudio.play();voice.textContent='PAUSE VOICE'}catch{voice.textContent='VOICE UNAVAILABLE'}
      };
      next.onclick=()=>{
        if(!introActive)return;
        stopIntro();
        introActive=false;
        restoreHandlers();
        card.scrollTop=0;
        requestAnimationFrame(()=>card.scrollTop=0);
        if(typeof originalStart==='function')originalStart.call(start);
      };
      exit.onclick=()=>restoreHome();
      introAudio.onended=()=>{if(introActive)voice.textContent='REPLAY VOICE'};
      try{introAudio.currentTime=0;introAudio.play().then(()=>voice.textContent='PAUSE VOICE').catch(()=>voice.textContent='REPLAY VOICE')}catch{voice.textContent='REPLAY VOICE'}
    }

    start.onclick=launchIntro;
    window.__MISFIT_TRADER_INTRO__=Object.freeze({version:'welcome-intro-v1',start:launchIntro});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();