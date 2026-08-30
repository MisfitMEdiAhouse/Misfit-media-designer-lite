(()=>{
  const path=location.pathname.replace(/\/+$/,'')||'/';
  if(path!=='/signal')return;

  const style=document.createElement('style');
  style.textContent=`
    #trader-guide:not(.running) button[data-a=start],
    body>#trader-guide.running button[data-a=next]{
      min-height:56px!important;
      border-color:#67e8f9!important;
      background:#67e8f9!important;
      color:#020304!important;
      -webkit-text-fill-color:#020304!important;
      opacity:1!important;
      font-weight:900!important;
      font-size:11px!important;
      letter-spacing:.08em!important;
      text-shadow:none!important;
      box-shadow:0 0 0 1px rgba(103,232,249,.38),0 0 30px rgba(103,232,249,.22)!important;
    }
    #trader-guide:not(.running) button[data-a=start]:active,
    body>#trader-guide.running button[data-a=next]:active{transform:translateY(1px)}
    body>#trader-guide.running{
      position:fixed!important;
      z-index:10020!important;
      left:10px!important;
      right:10px!important;
      bottom:max(10px,env(safe-area-inset-bottom))!important;
      top:auto!important;
      margin:0!important;
      width:auto!important;
      max-width:none!important;
      max-height:min(42vh,360px)!important;
      overflow:auto!important;
      overscroll-behavior:contain!important;
      box-shadow:0 22px 70px rgba(0,0,0,.72)!important;
    }
    body>#trader-guide.running .ctrl{
      position:sticky;
      z-index:3;
      bottom:0;
      padding-top:10px;
      padding-bottom:2px;
      background:linear-gradient(to bottom,rgba(8,8,16,0),rgba(8,8,16,.96) 26%,rgba(8,8,16,.99));
    }
    .misfit-tour-secondary{
      position:relative!important;
      z-index:10001!important;
      outline:2px solid rgba(103,232,249,.88)!important;
      outline-offset:3px!important;
      box-shadow:0 0 0 6px rgba(103,232,249,.09),0 0 26px rgba(34,211,238,.24)!important;
    }
    @media(min-width:768px){
      body>#trader-guide.running{
        left:auto!important;
        right:20px!important;
        bottom:20px!important;
        width:min(430px,calc(100vw - 40px))!important;
        max-height:72vh!important;
      }
    }
  `;
  document.head.appendChild(style);

  let tries=0;
  function boot(){
    const card=document.getElementById('trader-guide');
    if(!card){if(++tries<100)setTimeout(boot,100);return;}

    const start=card.querySelector('[data-a="start"]');
    const next=card.querySelector('[data-a="next"]');
    const exit=card.querySelector('[data-a="exit"]');
    const title=card.querySelector('.ti');
    if(!start||!next||!title)return;

    const originalParent=card.parentNode;
    const marker=document.createComment('trader-guide-home');
    originalParent.insertBefore(marker,card);

    const clearSecondary=()=>document.querySelectorAll('.misfit-tour-secondary').forEach(el=>el.classList.remove('misfit-tour-secondary'));

    function addStepHighlights(){
      clearSecondary();
      const t=(title.textContent||'').toUpperCase();
      if(t.includes('PICK A MARKET + TIMEFRAME')){
        const lab=document.getElementById('candle-lab');
        const select=lab?.querySelector('select');
        if(select)select.classList.add('misfit-tour-secondary');
        [...(lab?.querySelectorAll('button')||[])].filter(b=>/^(24H|7D|14D|30D)$/.test((b.textContent||'').trim().toUpperCase())).forEach(b=>b.classList.add('misfit-tour-secondary'));
      }
    }

    function restoreHome(){
      clearSecondary();
      if(marker.parentNode&&card.parentNode!==marker.parentNode)marker.parentNode.insertBefore(card,marker.nextSibling);
    }

    function dock(){
      if(!card.classList.contains('running')){restoreHome();return;}
      if(card.parentNode!==document.body)document.body.appendChild(card);
      addStepHighlights();
    }

    function scrollTarget(delay=120){
      setTimeout(()=>{
        if(!card.classList.contains('running'))return;
        dock();
        const target=[...document.querySelectorAll('.misfit-tour-target')].find(el=>!card.contains(el));
        if(!target)return;
        const r=target.getBoundingClientRect();
        const g=card.getBoundingClientRect();
        const nav=document.querySelector('nav');
        const navBottom=Math.max(72,nav?.getBoundingClientRect().bottom||0)+12;
        const visibleBottom=Math.max(navBottom+120,g.top-14);
        const visibleHeight=visibleBottom-navBottom;
        let desiredCenter=navBottom+visibleHeight/2;
        let targetPoint=r.top+r.height/2;
        if(r.height>visibleHeight*.7){
          desiredCenter=navBottom+24;
          targetPoint=r.top;
        }
        const delta=targetPoint-desiredCenter;
        if(Math.abs(delta)>12)window.scrollBy({top:delta,behavior:'smooth'});
      },delay);
    }

    const originalStartHandler=start.onclick;
    start.onclick=null;
    start.addEventListener('click',event=>{
      event.preventDefault();
      event.stopImmediatePropagation();
      if(typeof originalStartHandler==='function')originalStartHandler.call(start,event);
      if(card.classList.contains('running')&&/WELCOME TO MISFIT TRADER/i.test(title.textContent||'')){
        next.click();
      }
      dock();
      scrollTarget(120);
    },true);

    card.addEventListener('click',e=>{
      const action=e.target.closest('button[data-a]')?.dataset.a;
      if(!action)return;
      setTimeout(()=>{
        if(card.classList.contains('running')){
          dock();
          scrollTarget(130);
        }else{
          restoreHome();
        }
      },0);
    });

    const observer=new MutationObserver(()=>{
      if(!card.classList.contains('running'))return;
      dock();
      scrollTarget(140);
    });
    observer.observe(title,{childList:true,characterData:true,subtree:true});

    window.addEventListener('resize',()=>{if(card.classList.contains('running'))scrollTarget(50);},{passive:true});
    window.addEventListener('orientationchange',()=>{if(card.classList.contains('running'))scrollTarget(180);},{passive:true});

    window.__MISFIT_TRADER_BOTTOM_SHEET_FIX__=Object.freeze({version:'2026-08-30-v3-candle-cyan',dock,scrollTarget});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();