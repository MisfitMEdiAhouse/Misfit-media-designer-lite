import { useEffect, useMemo, useState } from 'react';
import { Activity, BrainCircuit, LockKeyhole, Radar, RefreshCw, ShieldCheck, TrendingUp, WalletCards, Gauge, History, Layers3 } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const FEED='https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/noop-probe';
const STORAGE='misfit-signal-paper-v2';
const LEGACY='misfit-worldforge-paper-v1';
const starting={cash:100000,positions:{},trades:[],startingEquity:100000};
const money=(n)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:Number(n)<10?4:2}).format(Number(n||0));
const compact=(n)=>new Intl.NumberFormat('en-US',{notation:'compact',maximumFractionDigits:1}).format(Number(n||0));
const pct=(n)=>`${Number(n||0)>=0?'+':''}${Number(n||0).toFixed(2)}%`;
const tone=(n)=>Number(n)>=0?'text-emerald-300':'text-red-300';

export default function WorldForge(){
  const [feed,setFeed]=useState(null);
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');
  const [loading,setLoading]=useState(true);
  const [paper,setPaper]=useState(()=>{try{const next=localStorage.getItem(STORAGE);if(next)return JSON.parse(next);const old=localStorage.getItem(LEGACY);return old?{...starting,...JSON.parse(old)}:starting}catch{return starting}});
  const [ticket,setTicket]=useState({symbol:'BTC',usd:1000});

  const load=async()=>{setLoading(true);setError('');try{const r=await fetch(FEED,{cache:'no-store'});const j=await r.json();if(!r.ok)throw new Error(j?.error||'feed unavailable');setFeed(j)}catch(e){setError(e.message||'feed unavailable')}finally{setLoading(false)}};
  useEffect(()=>{load();const timer=setInterval(load,60000);return()=>clearInterval(timer)},[]);
  useEffect(()=>{localStorage.setItem(STORAGE,JSON.stringify(paper))},[paper]);

  const assets=feed?.assets||[];
  const emotion=feed?.emotion;
  const prices=useMemo(()=>Object.fromEntries(assets.map(a=>[a.symbol,Number(a.price_usd||0)])),[assets]);
  const positionsValue=useMemo(()=>Object.entries(paper.positions||{}).reduce((s,[sym,p])=>s+(Number(p.qty||0)*Number(prices[sym]||p.last||0)),0),[paper,prices]);
  const equity=paper.cash+positionsValue;
  const totalReturn=equity-Number(paper.startingEquity||100000);
  const exposure=equity>0?positionsValue/equity*100:0;
  const stance=useMemo(()=>{const s=Number(emotion?.score??50);if(s<=28)return{label:'CAPITULATION WATCH',detail:'Extreme fear regime. Research mean-reversion hypotheses; do not infer a bottom.'};if(s<42)return{label:'DEFENSIVE',detail:'Fear/guarded regime. Favor smaller paper sizing and confirmation.'};if(s<58)return{label:'MIXED / WAIT',detail:'No strong emotional edge. Let additional evidence resolve the conflict.'};if(s<72)return{label:'RISK-ON WATCH',detail:'Improving crowd regime. Test continuation without treating optimism as certainty.'};return{label:'EUPHORIA RISK',detail:'Greed/euphoria regime. Test momentum and reversal risk side-by-side.'}},[emotion]);

  const trade=(side)=>{
    const sym=ticket.symbol,price=Number(prices[sym]||0),requested=Math.max(1,Number(ticket.usd||0));
    if(!price){setNotice('No live price available for that asset.');return}
    setPaper(prev=>{
      const pos=prev.positions[sym]||{qty:0,cost:0,last:price};
      let cash=Number(prev.cash||0),nextQty=Number(pos.qty||0),nextCost=Number(pos.cost||0),filledUsd=requested;
      if(side==='buy'){
        if(requested>cash){setNotice('Paper order rejected: not enough virtual cash.');return prev}
        nextQty+=requested/price;nextCost+=requested;cash-=requested;
      } else {
        const sellQty=Math.min(requested/price,nextQty);
        if(sellQty<=0){setNotice('Paper order rejected: no position to sell.');return prev}
        filledUsd=sellQty*price;cash+=filledUsd;
        const avg=nextQty?nextCost/nextQty:0;nextQty-=sellQty;nextCost=Math.max(0,nextCost-sellQty*avg);
      }
      const positions={...prev.positions,[sym]:{qty:nextQty,cost:nextCost,last:price}};
      if(nextQty<1e-12)delete positions[sym];
      const trades=[{id:Date.now(),side,symbol:sym,usd:filledUsd,price,emotion:emotion?.label||null,score:emotion?.score??null,regime:emotion?.regime||null,at:new Date().toISOString()},...(prev.trades||[])].slice(0,60);
      setNotice(`PAPER ${side.toUpperCase()} filled: ${sym} ${money(filledUsd)} @ ${money(price)}`);
      return{...prev,cash,positions,trades,startingEquity:Number(prev.startingEquity||100000)};
    });
  };

  const reset=()=>{setPaper(starting);setNotice('Paper account reset to $100,000 virtual cash.')};

  return <div className="min-h-screen bg-black text-white"><Navbar/><main className="mx-auto max-w-7xl px-4 pb-24 pt-24 sm:px-5 md:pt-28">
    <section className="overflow-hidden rounded-[1.6rem] border border-cyan-400/20 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,.15),transparent_36%),linear-gradient(135deg,#071018,#000)] p-5 sm:p-6 md:p-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[.18em] text-cyan-300"><Radar size={13}/> MISFIT SIGNAL · EMOTIONAL TRADING INTELLIGENCE</div>
        <div className="flex flex-wrap gap-2"><span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 font-mono text-[10px] text-emerald-300">PAPER ENGINE LIVE</span><span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1.5 font-mono text-[10px] text-amber-300">REAL EXECUTION GATED</span></div>
      </div>
      <h1 className="mt-6 max-w-5xl font-display text-[2.55rem] font-bold leading-[.98] tracking-tight sm:text-5xl md:text-7xl">TRADE THE <span className="text-cyan-300">HUMAN FIELD</span>, NOT JUST THE CANDLE.</h1>
      <p className="mt-5 max-w-4xl text-[15px] leading-7 text-slate-300 sm:text-base">Misfit Signal turns observable crowd fear/greed, breadth, momentum and volatility into an explainable market-emotion regime. It is built to become an intelligence and governance overlay for existing brokers, exchanges and trading apps—not another exchange that needs custody on day one.</p>
      <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap"><button onClick={load} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 font-mono text-xs font-bold text-black"><RefreshCw size={14} className={loading?'animate-spin':''}/>REFRESH SIGNAL</button><a href="/command" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 px-4 py-3 font-mono text-xs text-slate-300">FOUNDER COMMAND</a></div>
    </section>

    {error&&<div className="mt-4 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">{error}</div>}
    {notice&&<button onClick={()=>setNotice('')} className="mt-4 w-full rounded-2xl border border-cyan-400/20 bg-cyan-400/[.06] p-4 text-left text-sm text-cyan-100">{notice}<span className="float-right text-slate-500">×</span></button>}

    <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Metric icon={BrainCircuit} label="FIELD EMOTION" value={loading?'…':emotion?.label?.toUpperCase()||'—'} sub={emotion?`${emotion.score}/100 composite`:'waiting for feed'}/>
      <Metric icon={Activity} label="REGIME" value={emotion?.regime?.replaceAll('_',' ').toUpperCase()||'—'} sub={emotion?`Fear/Greed ${emotion.fear_greed}`:'—'}/>
      <Metric icon={Gauge} label="PAPER EXPOSURE" value={`${exposure.toFixed(1)}%`} sub={`${money(positionsValue)} deployed`}/>
      <Metric icon={WalletCards} label="PAPER EQUITY" value={money(equity)} sub={`${totalReturn>=0?'+':''}${money(totalReturn)} P/L`} valueClass={tone(totalReturn)}/>
    </section>

    <section className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
      <div className="rounded-3xl border border-white/10 bg-white/[.025] p-4 sm:p-5 md:p-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><div className="font-mono text-[10px] uppercase tracking-[.16em] text-cyan-300">LIVE MARKET FIELD</div><h2 className="mt-1 font-display text-2xl font-semibold">Market tape</h2></div><span className="font-mono text-[10px] text-slate-500">{feed?.observed_at?new Date(feed.observed_at).toLocaleString():'loading'}</span></div>
        <div className="mt-4 space-y-2 md:hidden">{assets.map(a=><AssetCard key={a.symbol} asset={a}/>)}</div>
        <div className="mt-5 hidden overflow-x-auto md:block"><table className="w-full min-w-[680px] text-left text-sm"><thead className="text-[10px] uppercase tracking-widest text-slate-500"><tr><th className="pb-3">Asset</th><th>Price</th><th>24h</th><th>Volume</th><th>Market cap</th></tr></thead><tbody>{assets.map(a=><tr key={a.symbol} className="border-t border-white/7"><td className="py-4 font-semibold">{a.name} <span className="font-mono text-xs text-cyan-300">{a.symbol}</span></td><td>{money(a.price_usd)}</td><td className={tone(a.change_24h_pct)}>{pct(a.change_24h_pct)}</td><td>{money(a.volume_24h_usd)}</td><td>{money(a.market_cap_usd)}</td></tr>)}</tbody></table></div>
      </div>

      <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/[.035] p-5 md:p-7"><div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.16em] text-cyan-300"><Layers3 size={14}/>SIGNAL INTERPRETATION</div><div className="mt-4 rounded-2xl border border-white/10 bg-black/40 p-4"><div className="text-2xl font-bold">{stance.label}</div><p className="mt-2 text-sm leading-6 text-slate-400">{stance.detail}</p></div><div className="mt-4 grid grid-cols-2 gap-3 text-sm"><SignalStat label="Breadth" value={emotion?`${Math.round(emotion.market_breadth*100)}%`:'—'}/><SignalStat label="Avg 24h" value={emotion?pct(emotion.avg_24h_change_pct):'—'} cls={tone(emotion?.avg_24h_change_pct)}/><SignalStat label="Fear / Greed" value={emotion?.fear_greed??'—'}/><SignalStat label="Volatility" value={emotion?Number(emotion.avg_abs_24h_change_pct).toFixed(2):'—'}/></div><p className="mt-4 text-xs leading-5 text-slate-600">Research signal only. A regime is evidence, not a trade instruction.</p></div>
    </section>

    <section className="mt-5 grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
      <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[.035] p-5 md:p-7"><div className="font-mono text-[10px] uppercase tracking-[.16em] text-emerald-300">PAPER EXECUTION</div><h2 className="mt-2 font-display text-2xl font-semibold">Order ticket</h2><div className="mt-5 grid grid-cols-2 gap-3"><div><label className="block font-mono text-[10px] text-slate-500">ASSET</label><select value={ticket.symbol} onChange={e=>setTicket({...ticket,symbol:e.target.value})} className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black px-3">{assets.map(a=><option key={a.symbol}>{a.symbol}</option>)}</select></div><div><label className="block font-mono text-[10px] text-slate-500">NOTIONAL USD</label><input type="number" min="1" step="1" inputMode="decimal" value={ticket.usd} onChange={e=>setTicket({...ticket,usd:e.target.value})} className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black px-3"/></div></div><div className="mt-3 rounded-xl border border-white/8 bg-black/40 p-3 text-xs text-slate-500"><div className="flex justify-between"><span>Live price</span><b className="text-slate-300">{money(prices[ticket.symbol])}</b></div><div className="mt-2 flex justify-between"><span>Virtual cash</span><b className="text-slate-300">{money(paper.cash)}</b></div></div><div className="mt-4 grid grid-cols-2 gap-3"><button onClick={()=>trade('buy')} className="min-h-14 rounded-xl bg-emerald-300 p-3 font-bold text-black">PAPER BUY</button><button onClick={()=>trade('sell')} className="min-h-14 rounded-xl border border-red-400/30 bg-red-400/10 p-3 font-bold text-red-200">PAPER SELL</button></div><button onClick={reset} className="mt-3 w-full rounded-xl border border-white/10 p-3 font-mono text-[10px] text-slate-500">RESET $100K PAPER ACCOUNT</button></div>

      <div className="rounded-3xl border border-white/10 bg-white/[.025] p-5 md:p-7"><div className="flex items-center gap-2"><WalletCards size={17} className="text-cyan-300"/><h2 className="font-display text-xl font-semibold">Paper portfolio</h2></div><div className="mt-4 grid grid-cols-3 gap-2 text-xs"><SignalStat label="Cash" value={money(paper.cash)}/><SignalStat label="Positions" value={money(positionsValue)}/><SignalStat label="Total P/L" value={`${totalReturn>=0?'+':''}${money(totalReturn)}`} cls={tone(totalReturn)}/></div><div className="mt-4 space-y-2">{Object.entries(paper.positions||{}).length===0?<p className="rounded-xl border border-white/8 bg-black/30 p-4 text-sm text-slate-600">No paper positions yet.</p>:Object.entries(paper.positions).map(([sym,p])=>{const px=prices[sym]||p.last;const value=p.qty*px;const pnl=value-p.cost;const avg=p.qty?p.cost/p.qty:0;return <div key={sym} className="rounded-2xl border border-white/8 bg-black/40 p-4"><div className="flex items-center justify-between"><b className="text-lg">{sym}</b><b className={tone(pnl)}>{pnl>=0?'+':''}{money(pnl)}</b></div><div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-500"><span>Qty<br/><b className="text-slate-300">{p.qty.toFixed(6)}</b></span><span>Avg<br/><b className="text-slate-300">{money(avg)}</b></span><span>Value<br/><b className="text-slate-300">{money(value)}</b></span></div></div>})}</div></div>
    </section>

    <section className="mt-5 grid gap-4 lg:grid-cols-2">
      <div className="rounded-3xl border border-white/10 bg-white/[.025] p-5 md:p-7"><div className="flex items-center gap-2"><History size={17} className="text-cyan-300"/><h2 className="font-display text-xl font-semibold">Paper trade journal</h2></div><div className="mt-4 space-y-2">{(paper.trades||[]).length===0?<p className="text-sm text-slate-600">No trades recorded yet.</p>:(paper.trades||[]).slice(0,8).map(t=><div key={t.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-black/30 p-3 text-xs"><div><b className={t.side==='buy'?'text-emerald-300':'text-red-300'}>{t.side.toUpperCase()} {t.symbol}</b><div className="mt-1 text-slate-600">{new Date(t.at).toLocaleString()} · {t.emotion||'no regime'}</div></div><div className="text-right"><b>{money(t.usd)}</b><div className="mt-1 text-slate-600">@ {money(t.price)}</div></div></div>)}</div></div>

      <div className="rounded-3xl border border-amber-400/20 bg-amber-400/[.035] p-5 md:p-7"><div className="flex items-center gap-2 text-amber-300"><LockKeyhole size={18}/><h2 className="font-display text-xl font-semibold">Real-money adapter</h2></div><p className="mt-4 text-sm leading-6 text-slate-400">Execution architecture is intentionally separated from signal generation. Misfit Signal v2 cannot place a real order. Activation requires an explicit owner decision, a supported brokerage/exchange execution connector, maximum position size, daily-loss circuit breaker, leverage policy, kill switch and complete audit logging.</p><div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs leading-6 text-slate-500">REAL_MONEY_ENABLED=false<br/>LEVERAGE_ENABLED=false<br/>OWNER_APPROVAL_REQUIRED=true<br/>KILL_SWITCH=true<br/>SIGNAL_EXECUTION_SEPARATION=true</div></div>
    </section>

    <section className="mt-5 rounded-3xl border border-cyan-400/15 bg-cyan-400/[.025] p-5 md:p-7"><div className="flex items-center gap-2 text-cyan-300"><ShieldCheck size={18}/><h2 className="font-display text-xl font-semibold">Overlay first. Exchange later.</h2></div><p className="mt-4 max-w-5xl text-sm leading-7 text-slate-500">The quickest adoption path is an emotional-intelligence and governed-action overlay for tools traders already use. The public layer exposes explainable signals; protected GHOSBC/Soul Cipher internals remain sealed. Next integrations should add independent market feeds, news/social narrative, on-chain flows, paper strategy evaluation, alert/webhook delivery and a bounded broker adapter only after the paper system has measurable evidence.</p></section>
  </main><Footer/></div>
}

function Metric({icon:Icon,label,value,sub,valueClass=''}){return <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[.025] p-4 sm:p-5"><div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.13em] text-slate-500"><Icon size={13}/><span className="truncate">{label}</span></div><div className={`mt-3 break-words text-lg font-bold sm:text-xl ${valueClass}`}>{value}</div><div className="mt-1 truncate text-[11px] text-slate-600">{sub}</div></div>}
function SignalStat({label,value,cls=''}){return <div className="min-w-0 rounded-xl border border-white/8 bg-black/30 p-3"><div className="font-mono text-[9px] uppercase tracking-wider text-slate-600">{label}</div><div className={`mt-1 truncate text-sm font-semibold ${cls}`}>{value}</div></div>}
function AssetCard({asset:a}){return <div className="rounded-2xl border border-white/8 bg-black/35 p-4"><div className="flex items-start justify-between gap-3"><div><div className="font-semibold">{a.name}</div><div className="mt-1 font-mono text-xs text-cyan-300">{a.symbol}</div></div><div className="text-right"><div className="font-semibold">{money(a.price_usd)}</div><div className={`mt-1 text-sm ${tone(a.change_24h_pct)}`}>{pct(a.change_24h_pct)}</div></div></div><div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500"><span>24h volume<br/><b className="text-slate-300">${compact(a.volume_24h_usd)}</b></span><span>Market cap<br/><b className="text-slate-300">${compact(a.market_cap_usd)}</b></span></div></div>}
