(()=>{
  if((location.pathname.replace(/\/+$/,'')||'/')!=='/signal')return;
  const FEED='https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/noop-probe';
  const css=document.createElement('style');css.textContent=`
    #misfit-public-performance{margin-top:16px;border:1px solid rgba(103,232,249,.2);border-radius:22px;background:linear-gradient(135deg,rgba(2,14,18,.94),rgba(9,4,15,.94));padding:16px;box-shadow:0 18px 50px rgba(0,0,0,.28)}
    #misfit-public-performance .pp-head{display:flex;gap:12px;align-items:flex-start;justify-content:space-between;flex-wrap:wrap}
    #misfit-public-performance .pp-ey{font:700 9px 'JetBrains Mono',monospace;letter-spacing:.14em;color:#67e8f9;text-transform:uppercase}
    #misfit-public-performance h2{margin:5px 0 0;font:800 21px/1.15 Inter,sans-serif;color:white}
    #misfit-public-performance .pp-badges{display:flex;gap:7px;flex-wrap:wrap}
    #misfit-public-performance .pp-badge{border-radius:999px;border:1px solid rgba(103,232,249,.22);background:rgba(103,232,249,.08);padding:7px 10px;font:700 8px 'JetBrains Mono',monospace;color:#9beeff;letter-spacing:.06em}
    #misfit-public-performance .pp-badge.paper{border-color:rgba(110,231,183,.25);background:rgba(110,231,183,.08);color:#6ee7b7}
    #misfit-public-performance .pp-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin-top:13px}
    #misfit-public-performance .pp-card{border:1px solid rgba(255,255,255,.08);border-radius:14px;background:rgba(0,0,0,.42);padding:11px}
    #misfit-public-performance .pp-start{font:700 8px 'JetBrains Mono',monospace;color:#64748b;text-transform:uppercase;letter-spacing:.06em}
    #misfit-public-performance .pp-return{margin-top:5px;font:800 20px Inter,sans-serif;color:#6ee7b7}
    #misfit-public-performance .pp-meta{margin-top:3px;font:600 9px/1.45 'JetBrains Mono',monospace;color:#94a3b8}
    #misfit-public-performance .pp-latest{margin-top:10px;border-top:1px solid rgba(255,255,255,.07);padding-top:10px;font:600 9px/1.5 'JetBrains Mono',monospace;color:#7dd3fc}
    #misfit-public-performance .pp-note{margin-top:8px;color:#64748b;font:500 10px/1.5 Inter,sans-serif}
    @media(max-width:720px){#misfit-public-performance .pp-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#misfit-public-performance h2{font-size:18px}}
  `;document.head.appendChild(css);
  const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(Number(n||0));
  const pct=n=>`${Number(n)>=0?'+':''}${Number(n||0).toFixed(2)}%`;
  let tries=0,box;
  function mount(){const main=document.querySelector('#root main'),hero=main?.querySelector(':scope>section:first-of-type');if(!main||!hero){if(++tries<120)setTimeout(mount,100);return}if(document.getElementById('misfit-public-performance'))return;box=document.createElement('section');box.id='misfit-public-performance';box.innerHTML='<div class="pp-ey">MISFIT AI · GHOSBC OS-GOVERNED AUTONOMOUS PERFORMANCE</div><h2>Public paper-trading proof is loading…</h2>';hero.insertAdjacentElement('afterend',box);refresh();setInterval(refresh,60000)}
  async function refresh(){if(!box)return;try{const r=await fetch(FEED,{cache:'no-store'}),j=await r.json();if(!r.ok)throw new Error(j?.error||'feed unavailable');const accounts=j?.paper_autopilot?.accounts||[],latest=j?.paper_autopilot?.recent_trades?.[0]||null;box.innerHTML=`<div class="pp-head"><div><div class="pp-ey">MISFIT AI · GHOSBC OS-GOVERNED AUTONOMOUS PERFORMANCE</div><h2>Always-on public agent scoreboard</h2></div><div class="pp-badges"><span class="pp-badge paper">LIVE PAPER AGENTS</span><span class="pp-badge">15-MIN CYCLES</span><span class="pp-badge">REAL MONEY OFF</span></div></div><div class="pp-grid">${accounts.length?accounts.map(a=>`<div class="pp-card"><div class="pp-start">START ${money(a.starting_cash)}</div><div class="pp-return">${pct(a.return_pct)}</div><div class="pp-meta">EQUITY ${money(a.equity)}<br>${Number(a.trade_count||0)} TRADES</div></div>`).join(''):'<div class="pp-card"><div class="pp-meta">Waiting for autonomous paper ledger…</div></div>'}</div>${latest?`<div class="pp-latest">LATEST AGENT ACTION · ${latest.account_key||''} · ${String(latest.side||'').toUpperCase()} ${latest.symbol||''} · ${money(latest.notional_usd)} @ ${money(latest.price_usd)}</div>`:''}<div class="pp-note">Public evidence only. These are autonomous virtual-money results, not brokerage fills. The scoreboard stays visible so performance can be judged from data instead of claims.</div>`}catch(e){box.innerHTML=`<div class="pp-ey">MISFIT AI · AUTONOMOUS PAPER PERFORMANCE</div><h2>Public scoreboard temporarily unavailable.</h2><div class="pp-note">Real-money execution remains off.</div>`}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();