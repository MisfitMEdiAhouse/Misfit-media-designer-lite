import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  BookOpen, Bot, Building2, Coins, ExternalLink, GraduationCap,
  KeyRound, Landmark, LogOut, Network, RefreshCw, Rocket, ShieldCheck, Sparkles,
  TrendingUp, Vault, WalletCards
} from 'lucide-react';

const SUPABASE_URL = 'https://cibcxqrqiqvzpardbdrw.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_X-bcgz-3xMIgNZ4rYmAjZA_QNUb69hU';
const HEIR_API = `${SUPABASE_URL}/functions/v1/misfit-heir-portal`;

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

const tabs = [
  ['empire', 'Empire Map', Network],
  ['training', 'Training', GraduationCap],
  ['ventures', 'My Ventures', Rocket],
  ['wealth', 'Wealth Lab', TrendingUp],
  ['recovery', 'Recovery', Vault],
];

const money = (cents = 0) => new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', maximumFractionDigits: 0
}).format(Number(cents || 0) / 100);

function Pill({ children, tone = 'cyan' }) {
  const tones = {
    cyan: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200',
    green: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
    amber: 'border-amber-400/30 bg-amber-400/10 text-amber-200',
    rose: 'border-rose-400/30 bg-rose-400/10 text-rose-200',
    purple: 'border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-200',
  };
  return <span className={`rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] ${tones[tone]}`}>{children}</span>;
}

async function api(session, body) {
  const r = await fetch(HEIR_API, {
    method: body ? 'POST' : 'GET',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j?.error || `Request failed (${r.status})`);
  return j;
}

function Login({ onSession }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setBusy(true); setStatus('');
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) return setStatus(error.message);
    onSession(data.session);
  };

  const magic = async () => {
    if (!email.trim()) return setStatus('Enter your approved email first.');
    setBusy(true); setStatus('');
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/heir` }
    });
    setBusy(false);
    setStatus(error ? error.message : 'Magic-link request sent. Use the approved account only.');
  };

  return (
    <main className="min-h-screen bg-black px-5 py-16 text-white">
      <div className="mx-auto grid min-h-[80vh] max-w-5xl place-items-center">
        <section className="w-full overflow-hidden rounded-[2rem] border border-fuchsia-400/20 bg-[radial-gradient(circle_at_top_right,rgba(217,70,239,.14),transparent_34%),linear-gradient(145deg,#0b1020,#000)] p-6 shadow-2xl md:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="purple">Private · noindex</Pill>
            <Pill tone="green">Misfit Cloud protected</Pill>
          </div>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_.8fr]">
            <div>
              <div className="flex items-center gap-3 text-fuchsia-300"><KeyRound size={24}/><span className="font-mono text-xs uppercase tracking-[.2em]">Heir authentication</span></div>
              <h1 className="mt-5 font-display text-4xl font-bold tracking-tight md:text-6xl">KINGSTON <span className="text-fuchsia-300">HEIR OS</span></h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">Private succession, operator training, AI-to-AI venture building, recovery drills and family-capital education. Nothing here makes crown-jewel reconstruction material, secrets, private keys or seed phrases visible.</p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  ['Learn the Empire', BookOpen],
                  ['Build machine businesses', Bot],
                  ['Practice recovery', ShieldCheck],
                  ['Model family capital', Coins],
                ].map(([label, Icon]) => <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.035] p-4 text-sm text-slate-300"><Icon size={17} className="text-cyan-300"/>{label}</div>)}
              </div>
            </div>
            <form onSubmit={login} className="rounded-3xl border border-white/10 bg-black/40 p-5 md:p-6">
              <label className="font-mono text-[10px] uppercase tracking-[.15em] text-slate-500">Approved email</label>
              <input value={email} onChange={(e)=>setEmail(e.target.value)} autoComplete="email" type="email" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-400/50" placeholder="email@example.com" />
              <label className="mt-5 block font-mono text-[10px] uppercase tracking-[.15em] text-slate-500">Password</label>
              <input value={password} onChange={(e)=>setPassword(e.target.value)} autoComplete="current-password" type="password" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-400/50" placeholder="••••••••••••" />
              <button disabled={busy} className="mt-6 w-full rounded-xl bg-fuchsia-500 px-4 py-3 font-semibold text-white hover:bg-fuchsia-400 disabled:opacity-50">{busy ? 'Authenticating…' : 'Enter Heir OS'}</button>
              <button type="button" onClick={magic} disabled={busy} className="mt-3 w-full rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 hover:border-cyan-400/30 hover:text-cyan-200">Send magic link instead</button>
              {status && <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-xs leading-5 text-amber-200">{status}</div>}
              <p className="mt-5 text-[11px] leading-5 text-slate-600">Access is limited to the Misfit owner and an activated heir account. New accounts are not created from this screen.</p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function HeirOS() {
  const [session, setSession] = useState(null);
  const [state, setState] = useState(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('empire');
  const [venture, setVenture] = useState({ venture_key: '', name: '', thesis: '', goal: '' });

  useEffect(() => {
    document.title = 'Kingston Heir OS — Private';
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'robots'; document.head.appendChild(meta); }
    meta.content = 'noindex,nofollow,noarchive,nosnippet';
    supabase.auth.getSession().then(({ data }) => { setSession(data.session || null); setBusy(false); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => listener.subscription.unsubscribe();
  }, []);

  const load = async (s = session) => {
    if (!s) return;
    setBusy(true); setError('');
    try { setState(await api(s)); }
    catch (e) { setError(e.message); setState(null); }
    finally { setBusy(false); }
  };

  useEffect(() => { if (session) load(session); else setState(null); }, [session]);

  const progressMap = useMemo(() => Object.fromEntries((state?.progress || []).map((p) => [p.module_id, p])), [state]);

  const mutate = async (body) => {
    setBusy(true); setError('');
    try { await api(session, body); await load(session); }
    catch (e) { setError(e.message); setBusy(false); }
  };

  const createVenture = async (e) => {
    e.preventDefault();
    await mutate({ action: 'create_venture', venture_key: venture.venture_key, name: venture.name, thesis: venture.thesis });
    setVenture((v)=>({ ...v, venture_key:'', name:'', thesis:'' }));
  };

  if (busy && !session) return <main className="min-h-screen bg-black text-white grid place-items-center"><RefreshCw className="animate-spin text-cyan-300"/></main>;
  if (!session) return <Login onSession={setSession} />;

  if (!state) return (
    <main className="min-h-screen bg-black px-5 py-24 text-white">
      <div className="mx-auto max-w-xl rounded-3xl border border-rose-400/20 bg-rose-400/5 p-7">
        <ShieldCheck className="text-rose-300"/>
        <h1 className="mt-4 text-2xl font-bold">Heir access not active</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">{error || 'This signed-in account is not yet bound to the Heir OS profile.'}</p>
        <div className="mt-5 flex gap-3"><button onClick={()=>load()} className="rounded-xl border border-white/10 px-4 py-2 text-sm">Retry</button><button onClick={()=>supabase.auth.signOut()} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black">Sign out</button></div>
      </div>
    </main>
  );

  const profile = state.profile || {};
  const blueprint = state.wealth_blueprints?.[0];
  const heirAsset = (state.assets || []).find((asset) => asset.asset_key === 'kingston-heir-os');
  const privateLinks = state.private_links || {
    start_here_url: heirAsset?.metadata?.start_here_doc || '',
    vault_url: heirAsset?.metadata?.private_drive_folder || '',
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/85 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div><div className="font-display text-lg font-bold">MISFIT <span className="text-fuchsia-300">HEIR OS</span></div><div className="font-mono text-[8px] uppercase tracking-[.16em] text-slate-600">{profile.display_name} · {state.role}</div></div>
          <div className="flex items-center gap-2"><button onClick={()=>load()} className="rounded-xl border border-white/10 p-2 text-slate-400 hover:text-cyan-300"><RefreshCw size={15}/></button><button onClick={()=>supabase.auth.signOut()} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 font-mono text-[9px] uppercase tracking-[.12em] text-slate-400"><LogOut size={13}/> Exit</button></div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 md:px-6">
        <section className="overflow-hidden rounded-[2rem] border border-fuchsia-400/20 bg-[radial-gradient(circle_at_top_right,rgba(217,70,239,.12),transparent_32%),linear-gradient(140deg,rgba(15,23,42,.88),#000)] p-6 md:p-9">
          <div className="flex flex-wrap gap-2"><Pill tone="purple">Heir-owner</Pill><Pill tone="green">Private control plane</Pill><Pill tone="amber">Money actions gated</Pill></div>
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl"><h1 className="font-display text-4xl font-bold tracking-tight md:text-6xl">LEARN IT. <span className="text-cyan-300">BUILD YOURS.</span> INHERIT THE REST.</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">The point is not to memorize passwords. The point is to understand the system well enough to operate, rebuild and expand it.</p></div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><div className="text-2xl font-bold">{state.assets?.length || 0}</div><div className="font-mono text-[8px] uppercase tracking-[.14em] text-slate-600">mapped assets</div></div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><div className="text-2xl font-bold">{state.curriculum?.length || 0}</div><div className="font-mono text-[8px] uppercase tracking-[.14em] text-slate-600">training modules</div></div>
            </div>
          </div>
        </section>

        <nav className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {tabs.map(([key,label,Icon]) => <button key={key} onClick={()=>setTab(key)} className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 font-mono text-[9px] uppercase tracking-[.12em] ${tab===key?'border-cyan-400/40 bg-cyan-400/10 text-cyan-200':'border-white/10 text-slate-500'}`}><Icon size={13}/>{label}</button>)}
        </nav>

        {error && <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/5 p-4 text-sm text-rose-200">{error}</div>}

        {tab === 'empire' && (
          <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(state.assets || []).map((a) => <article key={a.asset_key} className="rounded-3xl border border-white/10 bg-white/[.03] p-5">
              <div className="flex items-start justify-between gap-3"><div><div className="font-display text-lg font-semibold">{a.name}</div><div className="mt-1 font-mono text-[8px] uppercase tracking-[.14em] text-slate-600">{a.category} · {a.status}</div></div><Building2 size={18} className="text-cyan-300"/></div>
              <p className="mt-4 text-sm leading-6 text-slate-400">{a.description || 'Mapped Misfit asset.'}</p>
              {(a.owner_entry_url || a.canonical_url) && <a href={a.owner_entry_url || a.canonical_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.12em] text-cyan-300"><ExternalLink size={12}/> Open canonical home</a>}
            </article>)}
          </section>
        )}

        {tab === 'training' && (
          <section className="mt-5 space-y-3">
            {(state.curriculum || []).map((m) => {
              const p = progressMap[m.id] || { status:'not_started' };
              return <article key={m.id} className="rounded-3xl border border-white/10 bg-white/[.03] p-5 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div className="max-w-3xl"><div className="flex flex-wrap gap-2"><Pill>{m.track}</Pill><Pill tone={p.status==='passed'?'green':p.status==='needs_review'?'amber':'purple'}>{p.status.replaceAll('_',' ')}</Pill></div><h2 className="mt-4 font-display text-xl font-semibold">{String(m.sequence).padStart(2,'0')} · {m.title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{m.objective}</p>{m.lesson?.rule && <p className="mt-3 border-l border-cyan-400/30 pl-3 text-xs italic leading-5 text-cyan-100/70">{m.lesson.rule}</p>}</div><div className="flex gap-2"><button disabled={busy} onClick={()=>mutate({action:'update_progress',module_key:m.module_key,status:'in_progress'})} className="rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-300">Study</button><button disabled={busy} onClick={()=>mutate({action:'update_progress',module_key:m.module_key,status:'passed',score:100,evidence:{self_attested:true}})} className="rounded-xl bg-emerald-400 px-3 py-2 text-xs font-semibold text-black">Mark passed</button></div></div>
              </article>;
            })}
          </section>
        )}

        {tab === 'ventures' && (
          <section className="mt-5 grid gap-5 lg:grid-cols-[.85fr_1.15fr]">
            <form onSubmit={createVenture} className="rounded-3xl border border-cyan-400/20 bg-cyan-400/[.04] p-5">
              <div className="flex items-center gap-3"><Sparkles className="text-cyan-300"/><div><h2 className="font-display text-xl font-semibold">Start your own toll booth</h2><p className="mt-1 text-xs text-slate-500">Sandbox only · zero owner-funded spend</p></div></div>
              <input required value={venture.venture_key} onChange={(e)=>setVenture({...venture,venture_key:e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,'')})} className="mt-5 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none" placeholder="venture-key" />
              <input required value={venture.name} onChange={(e)=>setVenture({...venture,name:e.target.value})} className="mt-3 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none" placeholder="Venture name" />
              <textarea required value={venture.thesis} onChange={(e)=>setVenture({...venture,thesis:e.target.value})} className="mt-3 min-h-28 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none" placeholder="What machine problem will this solve, and why would another agent pay?" />
              <button disabled={busy} className="mt-4 w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-black">Create sandbox venture</button>
            </form>
            <div className="space-y-3">
              {(state.ventures || []).length === 0 && <div className="rounded-3xl border border-white/10 p-7 text-sm text-slate-500">No Kingston ventures yet. The first one should be small enough to prove with an external use before it grows.</div>}
              {(state.ventures || []).map((v) => <article key={v.venture_key} className="rounded-3xl border border-white/10 bg-white/[.03] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-display text-lg font-semibold">{v.name}</h3><div className="mt-1 font-mono text-[8px] uppercase tracking-[.14em] text-slate-600">{v.venture_key} · {v.status}</div></div><div className="text-right text-xs text-slate-500">Revenue truth<br/><span className="text-white">{money(v.revenue_cents)}</span></div></div>
                <p className="mt-3 text-sm leading-6 text-slate-400">{v.thesis}</p>
                <textarea value={venture.goal} onChange={(e)=>setVenture({...venture,goal:e.target.value})} className="mt-4 min-h-20 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none" placeholder="Next research/build goal for this venture" />
                <div className="mt-3 flex gap-2"><button onClick={()=>mutate({action:'queue_research',venture_key:v.venture_key,goal:venture.goal})} className="rounded-xl border border-cyan-400/30 px-3 py-2 text-xs text-cyan-200">Queue research</button><button onClick={()=>mutate({action:'queue_build',venture_key:v.venture_key,goal:venture.goal})} className="rounded-xl border border-fuchsia-400/30 px-3 py-2 text-xs text-fuchsia-200">Queue build</button></div>
              </article>)}
            </div>
          </section>
        )}

        {tab === 'wealth' && (
          <section className="mt-5">
            <div className="rounded-3xl border border-amber-400/20 bg-amber-400/[.04] p-5 md:p-7">
              <div className="flex flex-wrap items-center gap-2"><Pill tone="amber">{blueprint?.status || 'education only'}</Pill><Pill tone="green">No automatic transfers</Pill></div>
              <h2 className="mt-5 font-display text-2xl font-bold">{blueprint?.name || 'Price Family Capital Engine'}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">{blueprint?.policy?.mission || 'Learn how cash flow becomes durable ownership without betting the base.'}</p>
              <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{(blueprint?.policy?.layers || []).map((l) => <div key={l.layer} className="rounded-2xl border border-white/10 bg-black/30 p-4"><Landmark size={17} className="text-amber-300"/><div className="mt-3 font-semibold capitalize">{l.layer.replaceAll('_',' ')}</div><p className="mt-2 text-xs leading-5 text-slate-500">{l.purpose}</p></div>)}</div>
              <div className="mt-6 rounded-2xl border border-rose-400/15 bg-rose-400/[.035] p-4"><div className="flex items-center gap-2 text-sm font-semibold text-rose-200"><WalletCards size={16}/> Hard gates</div><ul className="mt-3 grid gap-2 text-xs leading-5 text-slate-500 md:grid-cols-2">{(blueprint?.policy?.gates || []).map((g)=><li key={g}>• {g}</li>)}</ul></div>
            </div>
          </section>
        )}

        {tab === 'recovery' && (
          <section className="mt-5 grid gap-4 md:grid-cols-2">
            {privateLinks.start_here_url && <a href={privateLinks.start_here_url} target="_blank" rel="noreferrer" className="rounded-3xl border border-fuchsia-400/20 bg-fuchsia-400/[.04] p-6 hover:border-fuchsia-400/40"><BookOpen className="text-fuchsia-300"/><h2 className="mt-4 font-display text-xl font-semibold">Start Here — private succession record</h2><p className="mt-2 text-sm leading-6 text-slate-500">Family context, operating principles and Kingston's learn → observe → operate → co-admin → inherit path.</p><div className="mt-4 inline-flex items-center gap-2 text-xs text-fuchsia-200"><ExternalLink size={12}/> Open private document</div></a>}
            {privateLinks.vault_url && <a href={privateLinks.vault_url} target="_blank" rel="noreferrer" className="rounded-3xl border border-cyan-400/20 bg-cyan-400/[.04] p-6 hover:border-cyan-400/40"><Vault className="text-cyan-300"/><h2 className="mt-4 font-display text-xl font-semibold">Kingston Heir OS private Drive</h2><p className="mt-2 text-sm leading-6 text-slate-500">Succession materials and private family records. This is not a public asset surface.</p><div className="mt-4 inline-flex items-center gap-2 text-xs text-cyan-200"><ExternalLink size={12}/> Open vault</div></a>}
            {!privateLinks.start_here_url && !privateLinks.vault_url && <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/[.04] p-6 md:col-span-2"><Vault className="text-cyan-300"/><h2 className="mt-4 font-display text-xl font-semibold">Private recovery links stay server-side</h2><p className="mt-2 text-sm leading-6 text-slate-500">Recovery documents are returned only by the authenticated Heir API when the approved account is entitled to them. No private Drive links are embedded in the public website bundle.</p></div>}
            <div className="rounded-3xl border border-white/10 p-6 md:col-span-2"><h2 className="font-display text-xl font-semibold">Recovery invariants</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{Object.entries(state.invariants || {}).map(([k,v])=><div key={k} className="rounded-2xl border border-white/10 bg-white/[.025] p-4"><ShieldCheck size={15} className={v?'text-emerald-300':'text-rose-300'}/><div className="mt-2 text-xs capitalize text-slate-400">{k.replaceAll('_',' ')}</div></div>)}</div></div>
          </section>
        )}
      </div>
    </main>
  );
}
