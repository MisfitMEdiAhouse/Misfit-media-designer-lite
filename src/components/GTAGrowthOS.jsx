import { useEffect, useState } from 'react';
import { ScanSearch, TrendingUp } from 'lucide-react';

const SB='https://cibcxqrqiqvzpardbdrw.supabase.co';
const PK='sb_publishable_X-bcgz-3xMIgNZ4rYmAjZA_QNUb69hU';
const H={apikey:PK,'Content-Type':'application/json'};
const OFFER_KEY='misfit_gta_growth_launch_299';

async function request(url,body){
  const r=await fetch(url,{method:'POST',headers:H,body:JSON.stringify(body)});
  const text=await r.text();
  let data={};try{data=text?JSON.parse(text):{}}catch{data={error:text||`Request failed (${r.status})`}}
  if(!r.ok)throw new Error(data?.message||data?.error||`Request failed (${r.status})`);
  return data;
}
const catalog=(body)=>request(`${SB}/functions/v1/public-catalog`,body);

export default function GTAGrowthOS(){
  const [form,setForm]=useState({community_name:'',website:'',email:'',goal:'More players / members'});
  const [busy,setBusy]=useState('');
  const [audit,setAudit]=useState(null);
  const [notice,setNotice]=useState('');
  const [logged,setLogged]=useState(false);

  useEffect(()=>{
    const q=new URLSearchParams(window.location.search);
    if(q.get('checkout')==='success')setNotice('PAYMENT RECEIVED · Misfit Cloud is provisioning your GTA Growth OS onboarding now.');
    if(q.get('checkout')==='cancelled')setNotice('Checkout cancelled. Your audit stays here; no subscription was created.');
  },[]);

  const logAudit=async(result)=>{
    if(logged)return;
    try{
      await catalog({operation:'log_gta_audit',community_name:form.community_name.trim(),community_url:form.website.trim(),email:form.email.trim(),goal:form.goal,domain:result.domain,score:result.score,grade:result.grade,recommended_offer:result.recommended_offer?.key||null,checked_at:result.checked_at});
      setLogged(true);
    }catch{}
  };

  const runAudit=async(e)=>{
    e.preventDefault();setBusy('audit');setNotice('');setAudit(null);
    try{
      const result=await request(`${SB}/functions/v1/business-scrub`,{website:form.website});
      setAudit(result);await logAudit(result);
    }catch(error){setNotice(`AUDIT — ${error.message}`)}finally{setBusy('')}
  };

  const startCheckout=async()=>{
    setBusy('checkout');setNotice('');
    try{
      const result=await catalog({operation:'create_checkout',product_key:OFFER_KEY,community_name:form.community_name.trim(),community_url:form.website.trim(),email:form.email.trim().toLowerCase(),goal:form.goal});
      if(!result?.checkout_url)throw new Error('checkout_unavailable');
      window.location.assign(result.checkout_url);
    }catch(error){setNotice(`CHECKOUT — ${error.message}`);setBusy('')}
  };

  const leaks=Array.isArray(audit?.revenue_leaks)?audit.revenue_leaks.slice(0,3):[];
  return <section className="mt-5 overflow-hidden rounded-3xl border border-cyan-300/20 bg-[radial-gradient(circle_at_15%_0%,rgba(34,211,238,.12),transparent_32%),radial-gradient(circle_at_90%_20%,rgba(217,70,239,.10),transparent_30%),rgba(255,255,255,.02)] p-4 md:p-6">
    <div className="grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[.06] px-3 py-1.5 font-mono text-[9px] font-bold tracking-[.14em] text-cyan-200"><TrendingUp size={14}/> MISFIT GTA GROWTH OS · FOUNDING LAUNCH</div>
        <h2 className="mt-4 text-3xl font-black leading-tight md:text-4xl">Turn a server or creator community into a <span className="text-cyan-300">measurable growth system.</span></h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Run the public-site audit free. If the fit is real, Launch is $299/month for external growth operations around your community: discovery, creator/referral tracking, content workflow, conversion analysis and prioritized growth actions.</p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{['FREE AUDIT','CREATOR OPS','CONTENT PIPELINE','GROWTH ANALYTICS'].map(x=><div key={x} className="rounded-xl border border-white/10 bg-black/35 p-3 font-mono text-[9px] text-slate-400">{x}</div>)}</div>
        <div className="mt-4 rounded-2xl border border-fuchsia-300/15 bg-fuchsia-300/[.035] p-4"><div className="font-mono text-[10px] text-fuchsia-200">$299 / MONTH</div><div className="mt-1 text-xl font-bold">Launch · customer-authorized Stripe subscription</div><p className="mt-2 text-xs leading-5 text-slate-500">No in-game item sales, no game-server hosting, no crypto/token economy and no autonomous charges. A subscription exists only after the customer completes Stripe Checkout.</p></div>
      </div>
      <form onSubmit={runAudit} className="rounded-2xl border border-white/10 bg-black/45 p-4">
        <div className="flex items-center gap-2 font-mono text-[10px] text-cyan-300"><ScanSearch size={15}/> RUN THE FREE GROWTH AUDIT</div>
        <div className="mt-3 grid gap-2">
          <input required value={form.community_name} onChange={e=>setForm({...form,community_name:e.target.value})} placeholder="Server / community / creator name" className="min-h-12 min-w-0 rounded-xl border border-white/10 bg-black px-3 text-sm outline-none focus:border-cyan-300/50"/>
          <input required type="url" value={form.website} onChange={e=>setForm({...form,website:e.target.value})} placeholder="https://your-community-site.com" className="min-h-12 min-w-0 rounded-xl border border-white/10 bg-black px-3 text-sm outline-none focus:border-cyan-300/50"/>
          <input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Business email" className="min-h-12 min-w-0 rounded-xl border border-white/10 bg-black px-3 text-sm outline-none focus:border-cyan-300/50"/>
          <select value={form.goal} onChange={e=>setForm({...form,goal:e.target.value})} className="min-h-12 rounded-xl border border-white/10 bg-black px-3 text-sm"><option>More players / members</option><option>Better retention</option><option>Creator / streamer growth</option><option>Store / conversion growth</option><option>Content / clips pipeline</option></select>
        </div>
        <button disabled={Boolean(busy)} className="mt-3 flex min-h-12 w-full items-center justify-center rounded-xl bg-cyan-300 px-4 font-mono text-[10px] font-black text-black disabled:opacity-50">{busy==='audit'?'SCANNING PUBLIC SITE…':'SCAN MY GROWTH STACK — FREE'}</button>
      </form>
    </div>
    {notice&&<div className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/[.05] p-3 text-xs leading-5 text-amber-100">{notice}</div>}
    {audit&&<div className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-300/[.035] p-4 md:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><div className="font-mono text-[9px] text-emerald-300">PUBLIC GROWTH AUDIT · {audit.domain}</div><div className="mt-1 text-3xl font-black">{audit.score}/100 · GRADE {audit.grade}</div></div><div className="font-mono text-[9px] text-slate-500">PUBLIC-SURFACE EVIDENCE ONLY</div></div>
      <div className="mt-4 grid gap-2 md:grid-cols-3">{leaks.length?leaks.map((x,i)=><div key={`${x.title}-${i}`} className="rounded-xl border border-white/10 bg-black/40 p-3"><div className="font-mono text-[8px] uppercase text-amber-300">{x.impact}</div><div className="mt-1 text-sm font-bold">{x.title}</div><p className="mt-2 text-[11px] leading-5 text-slate-500">{x.fix}</p></div>):<div className="rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-slate-500 md:col-span-3">No major leak was returned by this public scan. Misfit can still test creator, retention and conversion operations.</div>}</div>
      <div className="mt-4 flex flex-col gap-3 rounded-xl border border-cyan-300/20 bg-cyan-300/[.04] p-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="font-mono text-[9px] text-cyan-300">FOUNDING LAUNCH</div><div className="mt-1 text-lg font-bold">Put Misfit on the growth loop for $299/month.</div><p className="mt-1 text-xs text-slate-500">Paid checkout automatically queues onboarding in Misfit Cloud.</p></div><button type="button" onClick={startCheckout} disabled={Boolean(busy)} className="min-h-12 shrink-0 rounded-xl bg-emerald-300 px-5 font-mono text-[10px] font-black text-black disabled:opacity-50">{busy==='checkout'?'OPENING STRIPE…':'START $299/MO →'}</button></div>
    </div>}
  </section>;
}
