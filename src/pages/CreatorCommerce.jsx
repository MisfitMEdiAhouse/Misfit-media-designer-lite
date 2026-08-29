import { useMemo, useState } from 'react';
import { ArrowUpRight, Check, Copy, Link2, QrCode, ShoppingBag, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import MaturityBadge from '../components/MaturityBadge.jsx';

const proof = [
  ['LIVE', 'Referral attribution runtime', 'The public Misfit runtime captures ?ref= referral codes, keeps a bounded attribution window, tracks landing and checkout-click events, and decorates Stripe checkout handoffs with a client reference ID.'],
  ['LIVE', 'Customer referral lane', 'Activated client sites can use ?client_ref= attribution and track lead actions such as phone, email or booking through the existing client-referral path.'],
  ['LIVE', 'Coffee & A Joint', 'A real DTC commerce property that gives the creator/affiliate architecture somewhere concrete to sell rather than existing only as a diagram.'],
  ['LIVE', 'QuoteLink', 'A focused hosted quote/QR product that can turn creator, rep or referral traffic into a bounded conversion destination.'],
  ['BUILDING', 'Creator OS orchestration', 'The broader creator CRM, campaign workflow, creator-search and multi-brand orchestration layer is not being presented as finished production software yet.'],
];

export default function CreatorCommerce(){
  const [code,setCode]=useState('creator-demo');
  const [path,setPath]=useState('/products');
  const [copied,setCopied]=useState(false);
  const cleanCode=useMemo(()=>String(code||'').trim().toLowerCase().replace(/[^a-z0-9-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,78),[code]);
  const cleanPath=path.startsWith('/')?path:`/${path}`;
  const url=`https://misfitmediahouse.com${cleanPath}?ref=${encodeURIComponent(cleanCode||'creator-demo')}`;
  const copy=async()=>{try{await navigator.clipboard.writeText(url);setCopied(true);setTimeout(()=>setCopied(false),1600);}catch(_){setCopied(false)}};

  return <div className="min-h-screen bg-black text-white"><Navbar/><main className="pt-24">
    <section className="relative overflow-hidden border-b border-white/10"><div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(217,70,239,.16),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(34,211,238,.12),transparent_30%)]"/><div className="relative mx-auto max-w-7xl px-5 py-16 sm:py-24">
      <div className="flex flex-wrap items-center gap-3"><div className="font-mono text-xs uppercase tracking-[0.3em] text-fuchsia-300">Misfit Creator OS · commerce + attribution</div><MaturityBadge status="BETA"/></div>
      <h1 className="mt-5 max-w-6xl font-display text-5xl font-bold uppercase leading-[.88] sm:text-7xl lg:text-8xl">Turn creator attention into trackable traffic, then into a real destination.</h1>
      <p className="mt-7 max-w-4xl text-lg leading-8 text-slate-300">The broader Creator OS is still building, but this page now exposes the part that already works: referral attribution, customer referral tracking, checkout handoffs, QR-friendly destinations and live commerce properties. No pretending the unfinished CRM layer is already production.</p>
      <div className="mt-8 flex flex-wrap gap-3"><a href="https://www.coffeeandajoint.co/" target="_blank" rel="noreferrer" className="rounded-full bg-fuchsia-300 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[.13em] text-black">Open Coffee & A Joint</a><Link to="/quotelink" className="rounded-full border border-white/15 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[.13em] text-slate-200">Open QuoteLink</Link></div>
    </div></section>

    <section className="mx-auto max-w-7xl px-5 py-14 sm:py-20"><div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
      <div className="rounded-3xl border border-fuchsia-300/20 bg-fuchsia-300/[.025] p-5 md:p-7"><div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.15em] text-fuchsia-300"><Link2 size={14}/> Referral link lab</div><h2 className="mt-3 font-display text-3xl font-bold">Build a tracked Misfit referral URL.</h2><p className="mt-3 text-sm leading-7 text-slate-500">This uses the same <span className="font-mono text-slate-300">?ref=</span> surface watched by the live Misfit referral runtime. The browser runtime stores the referral window and tracks bounded landing/checkout events through the existing referral API path.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2"><label><span className="mb-2 block font-mono text-[9px] uppercase tracking-[.12em] text-slate-600">Referral code</span><input value={code} onChange={e=>setCode(e.target.value)} className="min-h-12 w-full rounded-xl border border-white/10 bg-black px-3 text-sm outline-none focus:border-fuchsia-300/40"/></label><label><span className="mb-2 block font-mono text-[9px] uppercase tracking-[.12em] text-slate-600">Destination path</span><select value={path} onChange={e=>setPath(e.target.value)} className="min-h-12 w-full rounded-xl border border-white/10 bg-black px-3 text-sm"><option value="/products">Products</option><option value="/quotelink">QuoteLink</option><option value="/portfolio">Portfolio</option><option value="/creator-commerce">Creator Commerce</option><option value="/signal">Misfit Trader</option></select></label></div>
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/50 p-4"><div className="break-all font-mono text-[11px] leading-6 text-cyan-200">{url}</div><button onClick={copy} className="mt-3 inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 font-mono text-[9px] uppercase tracking-[.1em] text-slate-300">{copied?<Check size={13}/>:<Copy size={13}/>} {copied?'Copied':'Copy tracked link'}</button></div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">{proof.map(([status,title,copyText],index)=>{const icons=[Users,QrCode,ShoppingBag,Link2,Sparkles];const Icon=icons[index]||Sparkles;return <article key={title} className={`flex min-h-[220px] flex-col rounded-3xl border border-white/10 bg-white/[.022] p-5 ${index===4?'sm:col-span-2':''}`}><div className="flex items-start justify-between gap-3"><Icon size={18} className="text-cyan-300"/><MaturityBadge status={status}/></div><h3 className="mt-4 font-display text-2xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-500">{copyText}</p></article>})}</div>
    </div></section>

    <section className="border-y border-white/10 bg-white/[.018]"><div className="mx-auto max-w-7xl px-5 py-14 sm:py-20"><div className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan-300">Current architecture</div><h2 className="mt-4 max-w-5xl font-display text-4xl font-bold uppercase leading-[.9] sm:text-6xl">Own the audience. Track the handoff. Keep fulfillment behind the curtain.</h2><p className="mt-5 max-w-4xl text-base leading-8 text-slate-400">Creator traffic should stay attached to the brand and attribution record while fulfillment, suppliers and payment plumbing remain backend concerns. The live referral runtime proves the tracking rail; the broader Creator OS is the next orchestration layer, not a claim we need to fake today.</p><div className="mt-7 flex flex-wrap gap-3"><a href="https://www.coffeeandajoint.co/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.12em] text-fuchsia-300">Live commerce <ArrowUpRight size={13}/></a><Link to="/frontier" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.12em] text-cyan-300">See maturity map <ArrowUpRight size={13}/></Link></div></div></section>
  </main><Footer/></div>;
}
