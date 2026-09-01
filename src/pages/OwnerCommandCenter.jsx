import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cibcxqrqiqvzpardbdrw.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_X-bcgz-3xMIgNZ4rYmAjZA_QNUb69hU';
const OWNER_API = `${SUPABASE_URL}/functions/v1/misfit-owner-command`;
const OWNER_EMAIL = 'misfitmediahouse@gmail.com';

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

const MODES = [
  ['command', 'Command', 'Send an owner instruction to the existing Agent Factory.'],
  ['research', 'Research', 'Queue bounded zero-cost research with Market Scout.'],
  ['build', 'Build', 'Queue bounded zero-cost build work with Product Builder.'],
  ['note', 'Memory', 'Save durable context without creating a factory job.'],
];

const money = (cents = 0) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(cents || 0) / 100);
const fmtTime = (value) => {
  if (!value) return '';
  try { return new Intl.DateTimeFormat('en-US', { month:'short', day:'numeric', hour:'numeric', minute:'2-digit' }).format(new Date(value)); }
  catch { return ''; }
};

async function api(session, body) {
  const response = await fetch(OWNER_API, {
    method: body ? 'POST' : 'GET',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      apikey: SUPABASE_PUBLISHABLE_KEY,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || `Founder Command request failed (${response.status})`);
  return payload;
}

function Login({ onSession }) {
  const [email, setEmail] = useState(OWNER_EMAIL);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');

  const login = async (e) => {
    e.preventDefault();
    setBusy(true); setStatus('');
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) return setStatus(error.message);
    onSession(data.session);
  };

  const magic = async () => {
    setBusy(true); setStatus('');
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/command` }
    });
    setBusy(false);
    setStatus(error ? error.message : 'Magic link sent to the approved owner account.');
  };

  return (
    <main className="min-h-screen bg-black px-4 py-12 text-white">
      <div className="mx-auto grid min-h-[82vh] max-w-5xl place-items-center">
        <section className="w-full overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.14),transparent_34%),linear-gradient(145deg,#07111d,#000)] p-6 shadow-2xl md:p-10">
          <div className="flex flex-wrap gap-2 font-mono text-[9px] uppercase tracking-[.15em]"><span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-cyan-200">Owner private</span><span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-emerald-200">Misfit Cloud memory</span></div>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_.8fr]">
            <div>
              <div className="font-mono text-xs uppercase tracking-[.22em] text-cyan-300">Misfit Founder Command</div>
              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-6xl">ONE COCKPIT. <span className="text-cyan-300">DURABLE MEMORY.</span></h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">Command the existing Misfit Agent Factory from your site. Threads, instructions and completed job results are stored in canonical Misfit Cloud instead of living only inside a chat feed.</p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">{['Persistent command threads','Agent Factory execution','Human-gate visibility','Private GHOSBC protected'].map((x)=><div key={x} className="rounded-2xl border border-white/10 bg-white/[.035] p-4 text-sm text-slate-300">{x}</div>)}</div>
            </div>
            <form onSubmit={login} className="rounded-3xl border border-white/10 bg-black/45 p-5 md:p-6">
              <label className="font-mono text-[10px] uppercase tracking-[.15em] text-slate-500">Owner email</label>
              <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" autoComplete="email" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-400/50" />
              <label className="mt-5 block font-mono text-[10px] uppercase tracking-[.15em] text-slate-500">Password</label>
              <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" autoComplete="current-password" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-400/50" placeholder="••••••••••••" />
              <button disabled={busy} className="mt-6 w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-black hover:bg-cyan-300 disabled:opacity-50">{busy ? 'Authenticating…' : 'Enter Founder Command'}</button>
              <button type="button" disabled={busy} onClick={magic} className="mt-3 w-full rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 hover:border-cyan-400/30">Send magic link instead</button>
              {status && <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-xs leading-5 text-amber-200">{status}</div>}
              <p className="mt-5 text-[11px] leading-5 text-slate-600">No signup is offered here. Backend access is hard-locked to the Misfit owner account.</p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value, sub }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[.035] p-4"><div className="text-xl font-bold text-white">{value}</div><div className="mt-1 font-mono text-[8px] uppercase tracking-[.14em] text-slate-500">{label}</div>{sub && <div className="mt-1 text-[10px] text-slate-600">{sub}</div>}</div>;
}

export default function OwnerCommandCenter() {
  const [session, setSession] = useState(null);
  const [busy, setBusy] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [dashboard, setDashboard] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [conversationId, setConversationId] = useState('');
  const [messages, setMessages] = useState([]);
  const [mode, setMode] = useState('command');
  const [text, setText] = useState('');

  useEffect(() => {
    document.title = 'Misfit Founder Command — Private';
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'robots'; document.head.appendChild(meta); }
    meta.content = 'noindex,nofollow,noarchive,nosnippet';
    supabase.auth.getSession().then(({data})=>{ setSession(data.session || null); setBusy(false); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event,next)=>setSession(next));
    return () => listener.subscription.unsubscribe();
  }, []);

  const loadDashboard = async (s = session) => { if (s) setDashboard(await api(s)); };
  const loadConversations = async (s = session, preferredId = conversationId) => {
    if (!s) return '';
    const out = await api(s, { action:'list_conversations' });
    let list = out.conversations || [];
    if (!list.length) {
      const created = await api(s, { action:'new_conversation', title:'Founder Command' });
      list = [created.conversation];
    }
    setConversations(list);
    const next = preferredId && list.some((c)=>c.id===preferredId) ? preferredId : list[0]?.id || '';
    setConversationId(next);
    return next;
  };
  const loadThread = async (id = conversationId, s = session) => {
    if (!s || !id) return;
    const out = await api(s, { action:'get_conversation', conversation_id:id });
    setMessages(out.messages || []);
  };
  const fullLoad = async (s = session) => {
    if (!s) return;
    setBusy(true); setError('');
    try {
      await loadDashboard(s);
      const id = await loadConversations(s);
      if (id) await loadThread(id, s);
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  useEffect(() => { if (session) fullLoad(session); else { setDashboard(null); setConversations([]); setMessages([]); } }, [session]);
  useEffect(() => { if (session && conversationId) loadThread(conversationId, session).catch((e)=>setError(e.message)); }, [conversationId]);
  useEffect(() => {
    if (!session || !conversationId) return;
    const timer = setInterval(() => { loadThread(conversationId, session).catch(()=>{}); loadDashboard(session).catch(()=>{}); }, 7000);
    return () => clearInterval(timer);
  }, [session, conversationId]);

  const newThread = async () => {
    setBusy(true); setError('');
    try {
      const out = await api(session, { action:'new_conversation', title:`Founder Command ${new Date().toLocaleDateString()}` });
      await loadConversations(session, out.conversation.id);
      setConversationId(out.conversation.id);
      await loadThread(out.conversation.id, session);
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  const send = async (e) => {
    e.preventDefault();
    const clean = text.trim();
    if (!clean || !session) return;
    setSending(true); setError('');
    try {
      const out = await api(session, { action:'send_message', conversation_id:conversationId || undefined, text:clean, mode });
      setText('');
      const id = out.conversation_id || conversationId;
      if (id) setConversationId(id);
      await loadConversations(session, id);
      await loadThread(id, session);
      await loadDashboard(session);
    } catch (e) { setError(e.message); }
    finally { setSending(false); }
  };

  const summary = dashboard?.summary || {};
  const jobs = dashboard?.jobs || [];
  const pendingJobs = jobs.filter((j)=>['queued','running','blocked'].includes(j.status));
  const gates = (dashboard?.human_gates || []).filter((g)=>!['completed','approved','rejected','canceled'].includes(String(g.status).toLowerCase()));
  const selected = conversations.find((c)=>c.id===conversationId);
  const modeHelp = MODES.find((m)=>m[0]===mode)?.[2] || MODES[0][2];

  if (busy && !session) return <main className="min-h-screen bg-black text-white grid place-items-center">Loading Founder Command…</main>;
  if (!session) return <Login onSession={setSession} />;

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 px-3 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3"><div><div className="font-display text-lg font-bold">MISFIT <span className="text-cyan-300">FOUNDER COMMAND</span></div><div className="font-mono text-[8px] uppercase tracking-[.16em] text-slate-600">Canonical Misfit Cloud memory · owner only</div></div><div className="flex gap-2"><button onClick={()=>fullLoad()} disabled={busy} className="rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-400">Refresh</button><button onClick={()=>supabase.auth.signOut()} className="rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-400">Exit</button></div></div>
      </header>

      <div className="mx-auto max-w-7xl px-3 pb-28 pt-4 md:px-6">
        <section className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <Stat label="Real gross revenue" value={money(summary.real_gross_revenue_cents)} sub="Canonical venture ledger" />
          <Stat label="Paid orders" value={summary.paid_orders || 0} />
          <Stat label="Active jobs" value={pendingJobs.length} sub={`${summary.jobs_by_status?.running || 0} running`} />
          <Stat label="Human gates" value={summary.pending_human_gates || gates.length} />
        </section>

        {error && <div className="mt-3 rounded-2xl border border-rose-400/25 bg-rose-400/5 p-4 text-sm text-rose-200">{error}</div>}

        <section className="mt-4 grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)_280px]">
          <aside className="order-2 rounded-3xl border border-white/10 bg-white/[.025] p-3 lg:order-1">
            <div className="flex items-center justify-between"><div className="font-mono text-[9px] uppercase tracking-[.14em] text-slate-500">Command threads</div><button onClick={newThread} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-cyan-300">New</button></div>
            <div className="mt-3 flex gap-2 overflow-x-auto lg:block lg:space-y-2 lg:overflow-visible">{conversations.map((c)=><button key={c.id} onClick={()=>setConversationId(c.id)} className={`min-w-[180px] rounded-2xl border p-3 text-left lg:w-full ${conversationId===c.id?'border-cyan-400/35 bg-cyan-400/10':'border-white/10 bg-black/20'}`}><div className="truncate text-xs font-semibold text-slate-200">{c.metadata?.title || 'Founder Command'}</div><div className="mt-1 font-mono text-[8px] text-slate-600">{fmtTime(c.updated_at)}</div></button>)}</div>
          </aside>

          <section className="order-1 flex min-h-[68vh] flex-col overflow-hidden rounded-3xl border border-cyan-400/15 bg-[linear-gradient(180deg,rgba(8,15,25,.96),#000)] lg:order-2">
            <div className="border-b border-white/10 px-4 py-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="font-display text-xl font-semibold">{selected?.metadata?.title || 'Founder Command'}</div><div className="mt-1 text-xs text-slate-500">Durable thread · factory results sync back here</div></div><div className="rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 font-mono text-[8px] uppercase tracking-[.13em] text-emerald-300">Private GHOSBC protected</div></div></div>
            <div className="flex-1 space-y-4 overflow-y-auto px-3 py-4 md:px-5">{messages.map((m)=><div key={m.id} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}><article className={`max-w-[92%] whitespace-pre-wrap rounded-2xl border px-4 py-3 text-sm leading-6 md:max-w-[82%] ${m.role==='user'?'border-cyan-400/25 bg-cyan-400/10 text-cyan-50':'border-white/10 bg-white/[.035] text-slate-300'}`}><div>{m.body}</div><div className="mt-2 font-mono text-[8px] uppercase tracking-[.12em] text-slate-600">{m.role==='user'?'Founder':'Misfit Cloud'} · {fmtTime(m.created_at)}</div></article></div>)}</div>
            <form onSubmit={send} className="border-t border-white/10 bg-black/80 p-3 md:p-4">
              <div className="mb-3 flex gap-2 overflow-x-auto">{MODES.map(([key,label])=><button type="button" key={key} onClick={()=>setMode(key)} className={`shrink-0 rounded-full border px-3 py-2 font-mono text-[8px] uppercase tracking-[.12em] ${mode===key?'border-cyan-400/40 bg-cyan-400/10 text-cyan-200':'border-white/10 text-slate-500'}`}>{label}</button>)}</div>
              <textarea value={text} onChange={(e)=>setText(e.target.value)} rows={4} placeholder="Command Misfit…" className="w-full resize-none rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3 text-sm leading-6 outline-none placeholder:text-slate-700 focus:border-cyan-400/40" />
              <div className="mt-2 flex items-center justify-between gap-3"><div className="text-[10px] leading-4 text-slate-600">{modeHelp} Money movement, payout changes, spend, protected-IP exposure and binding external terms remain human-gated.</div><button disabled={sending || !text.trim()} className="shrink-0 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-black disabled:opacity-40">{sending?'Sending…':'Run'}</button></div>
            </form>
          </section>

          <aside className="order-3 space-y-4">
            <section className="rounded-3xl border border-white/10 bg-white/[.025] p-4"><div className="font-mono text-[9px] uppercase tracking-[.14em] text-slate-500">Factory now</div><div className="mt-3 space-y-2">{pendingJobs.slice(0,7).map((j)=><div key={j.id} className="rounded-2xl border border-white/10 bg-black/25 p-3"><div className="text-xs font-semibold text-slate-300">{j.job_type}</div><div className="mt-1 flex justify-between gap-2 font-mono text-[8px] uppercase text-slate-600"><span>{j.worker_key}</span><span className={j.status==='running'?'text-emerald-300':j.status==='blocked'?'text-amber-300':'text-cyan-300'}>{j.status}</span></div></div>)}{!pendingJobs.length && <div className="text-xs text-slate-600">No active jobs.</div>}</div></section>
            <section className="rounded-3xl border border-amber-400/15 bg-amber-400/[.025] p-4"><div className="font-mono text-[9px] uppercase tracking-[.14em] text-amber-300">Human gates</div><div className="mt-3 space-y-2">{gates.slice(0,6).map((g)=><div key={g.id} className="rounded-2xl border border-white/10 bg-black/25 p-3"><div className="text-xs font-semibold text-slate-300">{g.title}</div><div className="mt-1 text-[10px] leading-4 text-slate-600">{g.human_action || g.readiness}</div>{g.action_url && <a href={g.action_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[10px] text-cyan-300">Open gate →</a>}</div>)}{!gates.length && <div className="text-xs text-slate-600">No pending human gates.</div>}</div></section>
          </aside>
        </section>
      </div>
    </main>
  );
}
