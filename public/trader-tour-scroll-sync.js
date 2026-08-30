(()=>{
  if((location.pathname.replace(/\/+$/,'')||'/')!=='/signal')return;
  const norm=v=>String(v||'').replace(/\s+/g,' ').trim().toUpperCase();
  function targetFor(title){
    const t=norm(title),lab=document.getElementById('candle-lab'),main=document.querySelector('#root main');
    if(t.includes('PICK A MARKET'))return document.getElementById('misfit-market-browser')||lab?.querySelector('select')?.parentElement||lab;
    if(t.includes('READ THE CANDLE'))return lab?.querySelector('svg[aria-label="Live candlestick chart"]')?.closest('.rounded-2xl')||lab?.querySelector('.mt-4.overflow-hidden.rounded-2xl')||[...lab?.querySelectorAll('.rounded-2xl')||[]].find(x=>/OHLC CANDLES/.test(norm(x.textContent)))||lab;
    if(t.includes('READ THE CROWD'))return [...main?.querySelectorAll('div')||[]].find(x=>norm(x.textContent)==='FIELD EMOTION')?.closest('section')||[...main?.querySelectorAll('div')||[]].find(x=>norm(x.textContent)==='REGIME')?.closest('section');
    if(t.includes('CHOOSE THE ASSET'))return [...main?.querySelectorAll('h2')||[]].find(x=>norm(x.textContent)==='MARKET TAPE')?.closest('section');
    if(t.includes('SET YOUR PAPER AMOUNT'))return main?.querySelector('input[type="number"]')?.closest('section');
    if(t.includes('PLACE THE PAPER BUY'))return [...main?.querySelectorAll('button')||[]].find(x=>/PAPER BUY/.test(norm(x.textContent)))?.closest('section');
    if(t.includes('VERIFY THE TRADE'))return [...main?.querySelectorAll('div')||[]].find(x=>norm(x.textContent)==='MANUAL EQUITY')?.closest('section');
    if(t.includes('OTHER SIGNALS')||t.includes('USE THE OTHER SIGNALS'))return [...main?.querySelectorAll('div')||[]].find(x=>norm(x.textContent).includes('AUTONOMOUS PAPER LEADERBOARD'))?.closest('section');
    return null;
  }
  function place(){
    const guide=document.getElementById('trader-guide');if(!guide?.classList.contains('running'))return;
    guide.scrollTop=0;requestAnimationFrame(()=>guide.scrollTop=0);
    const title=guide.querySelector('.ti')?.textContent,target=targetFor(title);if(!target)return;
    setTimeout(()=>{
      const g=guide.getBoundingClientRect(),r=target.getBoundingClientRect(),nav=document.querySelector('nav');
      const top=Math.max(72,nav?.getBoundingClientRect().bottom||0)+12;
      const bottom=Math.max(top+150,g.top-14);const room=bottom-top;
      const point=r.height>room*.72?r.top:r.top+r.height/2;const desired=r.height>room*.72?top+18:top+room/2;
      const delta=point-desired;if(Math.abs(delta)>10)window.scrollBy({top:delta,behavior:'smooth'});
    },180);
  }
  let tries=0;
  function boot(){const guide=document.getElementById('trader-guide');if(!guide){if(++tries<120)setTimeout(boot,100);return}const title=guide.querySelector('.ti');if(!title)return;new MutationObserver(()=>{place();setTimeout(place,350)}).observe(title,{childList:true,subtree:true,characterData:true});document.addEventListener('click',e=>{if(e.target.closest('#trader-guide [data-a="next"],#trader-guide [data-a="start"]')){setTimeout(place,70);setTimeout(place,420)}},true)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();