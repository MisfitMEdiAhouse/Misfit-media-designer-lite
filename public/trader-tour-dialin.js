(()=>{
  if((location.pathname.replace(/\/+$/,'')||'/')!=='/signal')return;

  // ONE VOICE ONLY.
  // The base tour owns the single Audio element, playback, pause/resume button,
  // and all step narration. This file never creates or starts audio.
  // It only maps the stale Step 3 URL to the fresh approved Misfit fancy voice
  // before the base player receives the source.
  const LEGACY_CROWD_TOKEN='80a5480626d54517ab923d96569636f6';
  const CANONICAL_CROWD_AUDIO='https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/348a28c0-5e15-4f0b-87f1-59d6ec81a941.mp3';

  if(!window.__MISFIT_TRADER_CROWD_SOURCE_MAP__){
    let owner=HTMLMediaElement.prototype;
    while(owner&&!Object.prototype.hasOwnProperty.call(owner,'src'))owner=Object.getPrototypeOf(owner);
    const desc=owner&&Object.getOwnPropertyDescriptor(owner,'src');
    if(desc?.get&&desc?.set&&desc.configurable){
      Object.defineProperty(owner,'src',{
        ...desc,
        set(value){
          const raw=String(value||'');
          const mapped=raw.includes(LEGACY_CROWD_TOKEN)?CANONICAL_CROWD_AUDIO:value;
          return desc.set.call(this,mapped);
        }
      });
      window.__MISFIT_TRADER_CROWD_SOURCE_MAP__=true;
    }
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
    if(!guide){if(++tries<180)setTimeout(boot,100);return;}
    if(guide.dataset.dialin==='1')return;
    const title=guide.querySelector('.ti');
    if(!title){if(++tries<180)setTimeout(boot,100);return;}
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
    window.__MISFIT_TRADER_TOUR_DIALIN__=Object.freeze({version:'dialin-20260831-6-step-three-label',targetFor});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();