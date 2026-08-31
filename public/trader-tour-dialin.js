(()=>{
  if((location.pathname.replace(/\/+$/,'')||'/')!=='/signal')return;

  const CROWD_AUDIO=[
    'https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/8717c9f8-da95-4b95-b7ab-5b92b1015114.mp3',
    'https://www.aidocmaker.com/g0/audio?name=80a5480626d54517ab923d96569636f6'
  ];
  const norm=v=>String(v||'').replace(/\s+/g,' ').trim().toUpperCase();
  const main=()=>document.querySelector('#root main');
  const exact=(selector,text,root=main()||document)=>[...root.querySelectorAll(selector)].find(el=>norm(el.textContent)===norm(text))||null;
  const contains=(selector,text,root=main()||document)=>[...root.querySelectorAll(selector)].find(el=>norm(el.textContent).includes(norm(text)))||null;

  function candleTarget(){
    const lab=document.getElementById('candle-lab');
    if(!lab)return null;
    const liveSvg=lab.querySelector('svg[aria-label="Live candlestick chart"],svg[aria-label*="candlestick chart" i],svg[aria-label*="OHLC" i]');
    if(liveSvg)return liveSvg.closest('.rounded-2xl,.mt-4')||liveSvg;
    const chartBox=lab.querySelector('.mt-4.overflow-hidden.rounded-2xl');
    if(chartBox)return chartBox;
    const candidates=[...lab.querySelectorAll('.rounded-2xl')].filter(el=>el.querySelector('svg')&&!el.querySelector('.misfit-candle-visual'));
    return candidates[0]||lab;
  }

  function targetFor(title){
    const t=norm(title),lab=document.getElementById('candle-lab'),m=main();
    if(!m)return null;
    if(t.includes('PICK A MARKET'))return document.getElementById('misfit-market-browser')||lab?.querySelector('select')?.parentElement||lab;
    if(t.includes('READ THE CANDLE'))return candleTarget();
    if(t.includes('READ THE CROWD'))return exact('div','FIELD EMOTION',m)?.closest('section')||exact('div','REGIME',m)?.closest('section');
    if(t.includes('CHOOSE THE ASSET'))return exact('h2','MARKET TAPE',m)?.closest('section');
    if(t.includes('SET YOUR PAPER AMOUNT'))return m.querySelector('input[type="number"],input[inputmode="decimal"]')?.closest('section');
    if(t.includes('PLACE THE PAPER BUY'))return [...m.querySelectorAll('button')].find(b=>/(^|\s)(PAPER\s+)?BUY(\s|$)/i.test(norm(b.textContent))&&!norm(b.textContent).includes('ACCESS'))?.closest('section');
    if(t.includes('VERIFY THE TRADE'))return exact('div','MANUAL EQUITY',m)?.closest('section')||exact('div','MANUAL EXPOSURE',m)?.closest('section');
    if(t.includes('OTHER SIGNALS')||t.includes('USE THE OTHER SIGNALS'))return contains('div','AUTONOMOUS PAPER LEADERBOARD',m)?.closest('section')||contains('div','PREDICTION',m)?.closest('section');
    return null;
  }

  function position(guide,target){
    if(!guide?.classList.contains('running')||!target)return;
    guide.scrollTop=0;
    requestAnimationFrame(()=>guide.scrollTop=0);
    document.querySelectorAll('.misfit-tour-target').forEach(el=>{if(el!==target)el.classList.remove('misfit-tour-target')});
    target.classList.add('misfit-tour-target');
    const place=()=>{
      if(!guide.classList.contains('running')||!target.isConnected)return;
      const g=guide.getBoundingClientRect(),r=target.getBoundingClientRect(),nav=document.querySelector('nav');
      const top=Math.max(72,nav?.getBoundingClientRect().bottom||0)+12;
      const bottom=Math.max(top+150,g.top-14);
      const room=Math.max(150,bottom-top);
      const targetPoint=r.height>room*.72?r.top:r.top+r.height/2;
      const desired=r.height>room*.72?top+18:top+room/2;
      const delta=targetPoint-desired;
      if(Math.abs(delta)>8)window.scrollBy({top:delta,behavior:'smooth'});
    };
    place();
    setTimeout(place,220);
    setTimeout(place,560);
  }

  let crowdAudio=null,originalVoiceClick=null,currentTitle='';
  const stopCrowd=()=>{if(crowdAudio){try{crowdAudio.pause();crowdAudio.currentTime=0}catch{}crowdAudio=null}};
  async function playCrowd(voice){
    stopCrowd();
    for(const src of CROWD_AUDIO){
      const a=new Audio(src);a.preload='auto';
      try{
        await a.play();
        crowdAudio=a;
        voice.textContent='PAUSE VOICE';
        a.onended=()=>{if(norm(currentTitle).includes('READ THE CROWD'))voice.textContent='REPLAY VOICE'};
        return true;
      }catch{try{a.pause()}catch{}}
    }
    voice.textContent='VOICE UNAVAILABLE';
    return false;
  }

  let tries=0;
  function boot(){
    const guide=document.getElementById('trader-guide');
    if(!guide){if(++tries<160)setTimeout(boot,100);return;}
    if(guide.dataset.dialin==='1')return;
    const title=guide.querySelector('.ti'),voice=guide.querySelector('[data-a="voice"]');
    if(!title||!voice){if(++tries<160)setTimeout(boot,100);return;}
    guide.dataset.dialin='1';
    originalVoiceClick=voice.onclick;

    const sync=()=>{
      currentTitle=title.textContent||'';
      const crowd=norm(currentTitle).includes('READ THE CROWD');
      if(!crowd){
        stopCrowd();
        voice.onclick=originalVoiceClick;
      }else{
        voice.onclick=async()=>{
          if(crowdAudio&&!crowdAudio.paused){crowdAudio.pause();voice.textContent='RESUME VOICE';return}
          if(crowdAudio&&crowdAudio.paused){try{await crowdAudio.play();voice.textContent='PAUSE VOICE';return}catch{}}
          await playCrowd(voice);
        };
        setTimeout(()=>playCrowd(voice),80);
      }
      const target=targetFor(currentTitle);
      if(target){
        setTimeout(()=>position(guide,target),120);
        setTimeout(()=>position(guide,target),520);
        setTimeout(()=>position(guide,target),900);
      }
    };

    new MutationObserver(sync).observe(title,{childList:true,subtree:true,characterData:true});
    document.addEventListener('click',e=>{
      if(e.target.closest('#trader-guide [data-a="next"],#trader-guide [data-a="start"]'))setTimeout(sync,60);
    },true);
    sync();
    window.__MISFIT_TRADER_TOUR_DIALIN__=Object.freeze({version:'dialin-20260831-1',targetFor});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();