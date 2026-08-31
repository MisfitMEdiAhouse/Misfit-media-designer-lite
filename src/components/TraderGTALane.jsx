import { useEffect, useState } from 'react';
import { Clapperboard, Gamepad2, Server, Users, Wrench } from 'lucide-react';

const SB='https://cibcxqrqiqvzpardbdrw.supabase.co';
const PK='sb_publishable_X-bcgz-3xMIgNZ4rYmAjZA_QNUb69hU';
const H={apikey:PK,'Content-Type':'application/json'};

async function rest(path,opts={}){
  const r=await fetch(`${SB}/rest/v1/${path}`,{...opts,headers:{...H,...(opts.headers||{})}});
  const text=await r.text();
  const data=text?JSON.parse(text):null;
  if(!r.ok)throw new Error(data?.message||data?.hint||`Request failed (${r.status})`);
  return data;
}

export default function TraderGTALane(){
  const [tab,setTab]=useState('servers');
  const [servers,setServers]=useState([]),[creators,setCreators]=useState([]),[loading,setLoading]=useState(true);
  const [notice,setNotice]=useState('');
  const [request,setRequest]=useState({request_type:'server_service',name:'',email:'',message:''});
  const [busy,setBusy]=useState(false);

  const load=async()=>{setLoading(true);try{const [s,c]=await Promise.all([
    rest('gaming_servers?select=id,name,platform,category,region,connect_url,website_url,discord_url,description,updated_at&status=eq.approved&order=updated_at.desc'),
    rest('gaming_creators?select=id,display_name,channel_url,primary_platform,bio,updated_at&status=eq.approved&order=updated_at.desc')
  ]);setServers(s||[]);setCreators(c||[])}catch(e){setNotice(`GTA registry: ${e.message}`)}finally{setLoading(false)}};

  useEffect(()=>{load()},[]);

  const submit=async(e)=>{e.preventDefault();setBusy(true);setNotice('');try{
    await rest('gaming_portal_requests',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({request_type:request.request_type,name:request.name.trim(),email:request.email||null,details:{message:request.message,source:'misfit_trader',compliance_attested:true},status:'new'})});
    setNotice('Sent to Misfit Cloud from inside Trader.');
    setRequest({request_type:'server_service',name:'',email:'',message:''});
  }catch(e){setNotice(`GTA request: ${e.message}`)}finally{setBusy(false)}};

  return <section id="gta-gaming" className="mt-5 overflow-hidden rounded-3xl border border-fuchsia-400/20 bg-[radial-gradient(circle_at_10%_0%,rgba(217,70,239,.16),transparent_35%),radial-gradient(circle_at_90%_20%,rgba(34,211,238,.10),transparent_32%),rgba(255,255,255,.02)] p-5 md:p-7">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/25 bg-fuchsia-300/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[.18em] text-fuchsia-200"><Gamepad2 size={14}/> GTA / GAMING · INSIDE MISFIT TRADER</div><h2 className="mt-3 text-3xl font-black sm:text-4xl">TRADE MARKETS. READ EVENTS. <span className="text-fuchsia-300">ENTER THE GAME ECONOMY.</span></h2><p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">The GTA creator network is a native Trader lane now. Discover approved GTA V/FiveM communities and creators, then route server ops, creator work, clips/content and partnerships through the same Misfit Cloud control plane. GTA VI stays watchlist-only until the ecosystem actually supports it.</p></div><div className="grid grid-cols-2 gap-2 sm:flex"><div className="rounded-xl border border-emerald-300/20 bg-emerald-300/[.05] px-3 py-2 text-center"><div className="font-mono text-[8px] text-slate-600">CURRENT RAIL</div><b className="text-xs text-emerald-300">GTA V / FiveM</b></div><div className="rounded-xl border border-amber-300/20 bg-amber-300/[.05] px-3 py-2 text-center"><div className="font-mono text-[8px] text-slate-600">GTA VI</div><b className="text-xs text-amber-300">WATCHLIST</b></div></div></div>

    {notice&&<button onClick={()=>setNotice('')} className="mt-4 w-full rounded-xl border border-cyan-300/20 bg-cyan-300/[.05] p-3 text-left text-xs text-cyan-100">{notice}<span className="float-right">×</span></button>}

    <div className="mt-5 grid grid-cols-3 gap-2"><Tab active={tab==='servers'} onClick={()=>setTab('servers')} icon={Server}>SERVERS</Tab><Tab active={tab==='creators'} onClick={()=>setTab('creators')} icon={Users}>CREATORS</Tab><Tab active={tab==='build'} onClick={()=>setTab('build')} icon={Wrench}>BUILD</Tab></div>

    {tab==='servers'&&<div className="mt-4"><div className="flex items-center gap-2 font-mono text-[10px] text-cyan-300"><Server size={14}/> APPROVED COMMUNITY SERVERS · {servers.length}</div><div className="mt-3 grid gap-3 md:grid-cols-2">{loading?<Empty text="Loading approved servers…"/>:servers.length?servers.slice(0,8).map(s=><div key={s.id} className="min-w-0 rounded-2xl border border-white/10 bg-black/45 p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><b className="break-words">{s.name}</b><div className="mt-1 font-mono text-[9px] text-cyan-300">{[s.category,s.region,s.platform].filter(Boolean).join(' · ').toUpperCase()}</div></div><span className="shrink-0 rounded-full bg-emerald-300/10 px-2 py-1 font-mono text-[8px] text-emerald-300">APPROVED</span></div><p className="mt-3 text-xs leading-5 text-slate-500">{s.description||'Community server listing.'}</p><div className="mt-3 flex flex-wrap gap-2">{s.connect_url&&<a href={s.connect_url} target="_blank" rel="noreferrer" className="rounded-lg bg-cyan-300 px-3 py-2 font-mono text-[9px] font-bold text-black">CONNECT</a>}{s.website_url&&<a href={s.website_url} target="_blank" rel="noreferrer" className="rounded-lg border border-white/10 px-3 py-2 font-mono text-[9px]">WEBSITE</a>}{s.discord_url&&<a href={s.discord_url} target="_blank" rel="noreferrer" className="rounded-lg border border-white/10 px-3 py-2 font-mono text-[9px]">DISCORD</a>}</div></div>):<Empty text="Registry is live; no server has passed review yet."/>}</div></div>}

    {tab==='creators'&&<div className="mt-4"><div className="flex items-center gap-2 font-mono text-[10px] text-fuchsia-300"><Clapperboard size={14}/> APPROVED CREATORS · {creators.length}</div><div className="mt-3 grid gap-3 md:grid-cols-2">{loading?<Empty text="Loading creators…"/>:creators.length?creators.slice(0,8).map(c=><div key={c.id} className="rounded-2xl border border-white/10 bg-black/45 p-4"><div className="font-mono text-[9px] text-fuchsia-300">{c.primary_platform?.toUpperCase()||'CREATOR'}</div><b className="mt-1 block text-lg">{c.display_name}</b><p className="mt-2 text-xs leading-5 text-slate-500">{c.bio||'Misfit GTA creator profile.'}</p>{c.channel_url&&<a href={c.channel_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-10 items-center font-mono text-[9px] text-cyan-300">OPEN CHANNEL →</a>}</div>):<Empty text="No creator has passed review yet."/>}</div></div>}

    {tab==='build'&&<form onSubmit={submit} className="mt-4 rounded-2xl border border-emerald-300/15 bg-emerald-300/[.025] p-4"><div className="font-mono text-[10px] text-emerald-300">BUILD / OPERATE WITH MISFIT</div><div className="mt-3 grid gap-2 sm:grid-cols-2"><input required placeholder="Your name / community" value={request.name} onChange={e=>setRequest({...request,name:e.target.value})} className="min-h-12 min-w-0 rounded-xl border border-white/10 bg-black px-3 text-sm"/><input type="email" placeholder="Email" value={request.email} onChange={e=>setRequest({...request,email:e.target.value})} className="min-h-12 min-w-0 rounded-xl border border-white/10 bg-black px-3 text-sm"/><select value={request.request_type} onChange={e=>setRequest({...request,request_type:e.target.value})} className="min-h-12 rounded-xl border border-white/10 bg-black px-3 text-sm sm:col-span-2"><option value="server_service">Server / community services</option><option value="clip_workflow">Clips + content workflow</option><option value="creator_join">Creator onboarding</option><option value="server_submit">Server listing / discovery</option><option value="partnership">Creator / community partnership</option></select></div><textarea required placeholder="What do you want Misfit to build, list, operate or connect?" value={request.message} onChange={e=>setRequest({...request,message:e.target.value})} className="mt-2 min-h-28 w-full rounded-xl border border-white/10 bg-black p-3 text-sm"/><p className="mt-2 text-[11px] leading-5 text-slate-600">Compliant community and creator infrastructure only: no cheats, credential abuse, ban evasion, prohibited gambling, sale of Rockstar-created virtual items, or fake GTA VI/FiveM claims.</p><div className="mt-3 flex flex-wrap gap-2"><button disabled={busy} className="min-h-12 rounded-xl bg-emerald-300 px-4 font-mono text-[10px] font-bold text-black disabled:opacity-50">{busy?'SENDING…':'SEND TO MISFIT CLOUD'}</button><a href="/gta" className="inline-flex min-h-12 items-center rounded-xl border border-white/10 px-4 font-mono text-[10px] text-slate-400">OPEN FULL GTA VIEW</a></div></form>}
  </section>
}

function Tab({active,onClick,icon:Icon,children}){return <button onClick={onClick} className={`inline-flex min-h-12 items-center justify-center gap-1 rounded-xl border px-2 font-mono text-[9px] font-bold sm:text-[10px] ${active?'border-cyan-300 bg-cyan-300 text-black':'border-white/10 bg-black/40 text-slate-500'}`}><Icon size={13}/>{children}</button>}
function Empty({text}){return <div className="rounded-2xl border border-dashed border-white/10 bg-black/30 p-6 text-sm text-slate-600 md:col-span-2">{text}</div>}
