(()=>{
  if((location.pathname.replace(/\/+$/,'')||'/')!=='/signal')return;

  // Keep the tour on one audio player. The base tour already owns playback for
  // every step; this shim only redirects the stale Step 3 source to the approved
  // working Misfit voice asset. It never creates or starts a second Audio object.
  const LEGACY_CROWD_AUDIO='https://www.aidocmaker.com/g0/audio?name=80a5480626d54517ab923d96569636f6';
  const CANONICAL_CROWD_AUDIO='https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/8717c9f8-da95-4b95-b7ab-5b92b1015114.mp3';
  if(!window.__MISFIT_TRADER_SINGLE_VOICE__){
    const nativePlay=HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play=function(...args){
      try{
        const src=String(this.currentSrc||this.src||'');
        if(src===LEGACY_CROWD_AUDIO||src.includes('80a5480626d54517ab923d96569636f6')){
          if(this.src!==CANONICAL_CROWD_AUDIO)this.src=CANONICAL_CROWD_AUDIO;
        }
      }catch{}
      return nativePlay.apply(this,args);
    };
    window.__MISFIT_TRADER_SINGLE_VOICE__=true;
  }

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

  let tries=0;
  function boot(){
    const guide=document.getElementById('trader-guide');
    if(!guide){if(++tries<160)setTimeout(boot,100);return;}
    if(guide.dataset.dialin==='1')return;
    const title=guide.querySelector('.ti');
    if(!title){if(++tries<160)setTimeout(boot,100);return;}
    guide.dataset.dialin='1';

    const sync=()=>{
      const target=targetFor(title.textContent||'');
      if(target){
        setTimeout(()=>position(guide,target),80);
        setTimeout(()=>position(guide,target),420);
        setTimeout(()=>position(guide,target),820);
      }
    };

    new MutationObserver(sync).observe(title,{childList:true,subtree:true,characterData:true});
    document.addEventListener('click',e=>{
      if(e.target.closest('#trader-guide [data-a="next"],#trader-guide [data-a="start"]'))setTimeout(sync,40);
    },true);
    sync();
    window.__MISFIT_TRADER_TOUR_DIALIN__=Object.freeze({version:'dialin-20260831-4-single-voice',targetFor});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();