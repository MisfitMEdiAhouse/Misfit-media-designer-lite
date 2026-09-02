import { useState } from 'react';
import { ArrowRight, Bot, Gamepad2, Radar, Server, Trophy, Users } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const SB='https://cibcxqrqiqvzpardbdrw.supabase.co';
const PK='sb_publishable_X-bcgz-3xMIgNZ4rYmAjZA_QNUb69hU';
const H={apikey:PK,'Content-Type':'application/json'};

const lanes=[
  {key:'gta',name:'GTA / FiveM',status:'LIVE',stage:'Growth OS + creator network',copy:'The first live Misfit Gaming OS lane: free growth audit, free founding pilot, server discovery, creator distribution and managed growth.',href:'/gta',cta:'OPEN GTA LIVE',live:true},
  {key:'minecraft',name:'Minecraft',status:'NEXT',stage:'Server growth + creator distribution',copy:'Adapt the existing community-growth rail to server discovery, retention, Discord conversion, creator partnerships and measurable acquisition.'},
  {key:'rust',name:'Rust',status:'NEXT',stage:'Server population + wipe-cycle growth',copy:'Use the same acquisition and attribution logic around public servers, community funnels, wipe/event promotion and returning-player growth.'},
  {key:'roblox',name:'Roblox',status:'EXPANSION',stage:'Experience growth + creator economy',copy:'Focus on audience acquisition, experience conversion, retention, creator distribution and monetization analytics without pretending to control platform payout rules.'},
  {key:'fortnite',name:'Fortnite / UEFN',status:'EXPANSION',stage:'Island growth + build competitions',copy:'Creator-island growth, engagement evidence and eligible game-building competitions become a second lane alongside community-server growth.'},
  {key:'ark-dayz',name:'ARK / DayZ',status:'WATCHLIST',stage:'Community-server reuse lane',copy:'Strong architecture fit, but intentionally behind the first five so Misfit does not spread the factory across too many ecosystems before proof.'},
];

async function catalog(body){
  const r=await fetch(`${SB}/functions/v1/public-catalog`,{method:'POST',headers:H,body:JSON.stringify(body)});
  const text=await r.text();let data={};try{data=text?JSON.parse(text):{}}catch{data={}}
  if(!r.ok)throw new Error(data?.error||`Request failed (${r.status})`);
  return data;
}

export default function GamingHub(){
  const [form,setForm]=useState({name:'',email:'',game:'Minecraft',message:''});
  const [busy,setBusy]=useState(false);
  const [notice,setNotice]=useState('');

  const submit=async(e)=>{
    e.preventDefault();setBusy(true);setNotice('');
    try{
      await catalog({operation:'submit_gta_request',request_type:'partnership',name:form.name.trim(),email:form.email.trim()||null,message:`MISFIT GAMING OS EXPANSION · Game: ${form.game} · ${form.message.trim()}`,source:'gaming_os_expansion'});
      setNotice(`${form.game} request received. Misfit will use demand evidence to rank the next game lane.`);
      setForm({name:'',email:'',game:'Minecraft',message:''});
    }catch(error){setNotice(`Gaming request — ${error.message}`)}finally{setBusy(false)}
  };

  return <div className="min-h-screen bg-black text-white"><Navbar/><main className="mx-auto max-w-7xl px-4 pb-40 pt-24 sm:px-5 md:pb-24 md:pt-28">
    <section className="overflow-hidden rounded-[1.8rem] border border-cyan-400/20 bg-[radial-gradient(circle_at_12%_0%,rgba(34,211,238,.18),transparent_34%),radial-gradient(circle_at_88%_20%,rgba(217,70,239,.16),transparent_30%),linear-gradient(145deg,#061017,#05030a_62%,#000)] p-5 md:p-10">
      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[.18em] text-cyan-200"><Gamepad2 size={14}/> MISFIT GAMING OS · GTA LIVE FIRST</div>
      <h1 className="mt-5 max-w-5xl font-display text-[2.7rem] font-black leading-[.94] sm:text-6xl md:text-7xl">ONE <span className="text-cyan-300">GROWTH ENGINE</span>. MULTIPLE <span className="text-fuchsia-300">GAME ECONOMIES</span>.</h1>
      <p className="mt-5 max-w-4xl text-[15px] leading-7 text-slate-300">GTA/FiveM is the first live lane. Misfit Gaming OS expands the same acquisition, attribution, creator, retention and monetization architecture into other game communities only after the reusable rail earns evidence.</p>
      <div className="mt-6 flex flex-wrap gap-3"><a href="/gta" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-cyan-300 px-5 font-mono text-[10px] font-black text-black">OPEN GTA LIVE <ArrowRight size={14}/></a><a href="#game-lanes" className="inline-flex min-h-12 items-center rounded-xl border border-white/15 px-5 font-mono text-[10px] text-slate-300">SEE EXPANSION LANES ↓</a></div>
      <div className="mt-7 grid grid-cols-2 gap-2 lg:grid-cols-4"><Metric icon={Server} label="LIVE PRODUCT" value="GTA / FiveM"/><Metric icon={Radar} label="MODEL" value="FREE → PROVE → PAID"/><Metric icon={Users} label="DISTRIBUTION" value="CREATORS + COMMUNITY"/><Metric icon={Trophy} label="SECOND ENGINE" value="PRIZE COMPETITIONS"/></div>
    </section>

    <section className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4"><Pillar icon={Radar} title="ACQUISITION" copy="Find public demand, audit the funnel and attribute where members or players came from."/><Pillar icon={Users} title="CREATOR NETWORK" copy="Treat creators, streamers, clips and referrals as a distribution layer instead of random promotion."/><Pillar icon={Bot} title="MISFIT AI" copy="Rank opportunities, reconsider weak loops and keep automated work inside bounded, reviewable rails."/><Pillar icon={Trophy} title="COMPETITION BUILD" copy="Separately hunt game-development prize opportunities and route only eligible work into the build factory."/></section>

    <section id="game-lanes" className="mt-5 scroll-mt-24 rounded-3xl border border-white/10 bg-white/[.025] p-4 md:p-6"><div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"><div><div className="font-mono text-[10px] uppercase tracking-[.16em] text-fuchsia-300">GAME EXPANSION MAP</div><h2 className="mt-1 text-3xl font-black">Prove one lane. Reuse the machine.</h2></div><div className="rounded-full border border-emerald-300/20 bg-emerald-300/[.05] px-3 py-2 font-mono text-[9px] text-emerald-300">NO DUPLICATE BACKENDS</div></div><div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{lanes.map(lane=><GameLane key={lane.key} lane={lane}/>)}</div></section>

    <section className="mt-5 grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
      <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/[.035] p-5 md:p-6"><div className="font-mono text-[10px] uppercase tracking-[.16em] text-cyan-300">THE BUSINESS MODEL</div><h2 className="mt-2 text-2xl font-black">Free proves value. Paid captures more value.</h2><div className="mt-4 grid gap-2 sm:grid-cols-2"><Step n="01" title="FREE AUDIT" copy="Show the community what is leaking before asking for money."/><Step n="02" title="FREE PILOT" copy="Generate before/after evidence on a bounded founding cohort."/><Step n="03" title="SELF-SERVE" copy="Lower-cost tools for communities that want the OS without managed work."/><Step n="04" title="MANAGED" copy="Higher-value recurring tier once Misfit is actively operating the growth loop."/></div></div>
      <form id="next-game" onSubmit={submit} className="scroll-mt-24 rounded-3xl border border-fuchsia-300/20 bg-fuchsia-300/[.025] p-5 md:p-6"><div className="font-mono text-[10px] uppercase tracking-[.16em] text-fuchsia-300">WHAT SHOULD MISFIT ADD NEXT?</div><h2 className="mt-2 text-2xl font-black">Give demand a vote.</h2><p className="mt-2 text-xs leading-5 text-slate-500">This feeds the existing Misfit intake. It does not create an account, charge a card or promise a launch date.</p><div className="mt-4 grid gap-2"><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name / community" className="min-h-12 rounded-xl border border-white/10 bg-black px-3 text-sm outline-none focus:border-fuchsia-300/40"/><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email (optional)" className="min-h-12 rounded-xl border border-white/10 bg-black px-3 text-sm outline-none focus:border-fuchsia-300/40"/><select value={form.game} onChange={e=>setForm({...form,game:e.target.value})} className="min-h-12 rounded-xl border border-white/10 bg-black px-3 text-sm"><option>Minecraft</option><option>Rust</option><option>Roblox</option><option>Fortnite / UEFN</option><option>ARK</option><option>DayZ</option><option>Other</option></select><textarea required value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="What does your server, creator community or game need help growing?" className="min-h-28 rounded-xl border border-white/10 bg-black p-3 text-sm outline-none focus:border-fuchsia-300/40"/></div><button disabled={busy} className="mt-3 min-h-12 w-full rounded-xl bg-fuchsia-300 px-4 font-mono text-[10px] font-black text-black disabled:opacity-50">{busy?'SENDING…':'VOTE + SEND TO MISFIT'}</button>{notice&&<div className="mt-3 rounded-xl border border-cyan-300/15 bg-cyan-300/[.04] p-3 text-xs leading-5 text-cyan-100">{notice}</div>}</form>
    </section>

    <section className="mt-5 rounded-2xl border border-white/10 bg-black/60 p-4 text-xs leading-6 text-slate-600">Misfit Gaming OS is an independent Misfit Mediahouse product layer. Third-party game/platform names describe intended ecosystem compatibility only and do not imply affiliation, endorsement, official status or permission to bypass any platform rules.</section>
  </main>
  <div className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-black/90 p-2 shadow-2xl backdrop-blur-xl md:hidden"><a href="/gta" className="flex min-h-12 items-center justify-center rounded-xl bg-cyan-300 px-3 font-mono text-[9px] font-black text-black">GTA LIVE →</a><a href="#next-game" className="flex min-h-12 items-center justify-center rounded-xl border border-fuchsia-300/30 bg-fuchsia-300/10 px-3 font-mono text-[9px] font-black text-fuchsia-200">VOTE NEXT GAME ↓</a></div>
  <Footer/></div>
}

function GameLane({lane}){return <article className={`rounded-2xl border p-4 ${lane.live?'border-cyan-300/30 bg-cyan-300/[.045]':'border-white/10 bg-black/35'}`}><div className="flex items-start justify-between gap-3"><div><div className="font-mono text-[9px] text-slate-600">{lane.stage.toUpperCase()}</div><h3 className="mt-1 text-xl font-black">{lane.name}</h3></div><span className={`rounded-full px-2.5 py-1 font-mono text-[8px] ${lane.live?'bg-emerald-300/10 text-emerald-300':'bg-fuchsia-300/10 text-fuchsia-200'}`}>{lane.status}</span></div><p className="mt-3 text-xs leading-5 text-slate-500">{lane.copy}</p>{lane.href&&<a href={lane.href} className="mt-4 inline-flex min-h-10 items-center gap-2 font-mono text-[9px] font-bold text-cyan-300">{lane.cta} <ArrowRight size={13}/></a>}</article>}
function Pillar({icon:Icon,title,copy}){return <div className="rounded-2xl border border-white/10 bg-white/[.025] p-4"><Icon size={18} className="text-cyan-300"/><div className="mt-3 font-mono text-[10px] font-bold">{title}</div><p className="mt-2 text-xs leading-5 text-slate-500">{copy}</p></div>}
function Metric({icon:Icon,label,value}){return <div className="rounded-2xl border border-white/10 bg-black/35 p-3"><div className="flex items-center gap-2 font-mono text-[8px] text-slate-600"><Icon size={13}/>{label}</div><div className="mt-2 text-sm font-black sm:text-base">{value}</div></div>}
function Step({n,title,copy}){return <div className="rounded-xl border border-white/10 bg-black/35 p-4"><div className="font-mono text-[9px] text-cyan-300">{n} · {title}</div><p className="mt-2 text-xs leading-5 text-slate-500">{copy}</p></div>}
