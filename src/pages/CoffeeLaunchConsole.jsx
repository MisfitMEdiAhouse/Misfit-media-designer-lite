import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  ArrowUpRight,
  Bot,
  Check,
  CheckCircle2,
  CircleDot,
  Clipboard,
  Clock3,
  ExternalLink,
  KeyRound,
  LogOut,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Truck,
} from 'lucide-react';

const SUPABASE_URL = 'https://cibcxqrqiqvzpardbdrw.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_X-bcgz-3xMIgNZ4rYmAjZA_QNUb69hU';
const ORGANIZATION_ID = 'e408affe-49c6-432a-8564-086e52eaad35';

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

const sectionOrder = ['Revenue rails', 'Fulfillment', 'Launch proof', 'Product expansion'];

const readiness = {
  ready_for_owner: {
    label: 'Ready for you',
    className: 'border-[#d9ff2f]/35 bg-[#d9ff2f]/10 text-[#d9ff2f]',
    icon: CircleDot,
  },
  ready_for_supplier_outreach: {
    label: 'Supplier outreach ready',
    className: 'border-[#d9ff2f]/35 bg-[#d9ff2f]/10 text-[#d9ff2f]',
    icon: CircleDot,
  },
  blocked_by_fulfillment_mapping: {
    label: 'Unlocks after mapping',
    className: 'border-amber-300/30 bg-amber-300/10 text-amber-200',
    icon: Clock3,
  },
  waiting_supplier_reply: {
    label: 'Supplier reply pending',
    className: 'border-cyan-300/30 bg-cyan-300/10 text-cyan-200',
    icon: Clock3,
  },
};

function StatusPill({ gate }) {
  if (gate.status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1.5 font-mono text-[9px] font-black uppercase tracking-[.14em] text-emerald-200">
        <CheckCircle2 size={12} /> Complete
      </span>
    );
  }
  const config = readiness[gate.payload?.readiness] || readiness.ready_for_owner;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[9px] font-black uppercase tracking-[.14em] ${config.className}`}>
      <Icon size={12} /> {config.label}
    </span>
  );
}

function Login({ onSession }) {
  const [email, setEmail] = useState('misfitmediahouse@gmail.com');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  async function login(event) {
    event.preventDefault();
    setBusy(true);
    setStatus('');
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) return setStatus(error.message);
    onSession(data.session);
  }

  async function sendMagicLink() {
    if (!email.trim()) return setStatus('Enter the approved owner email first.');
    setBusy(true);
    setStatus('');
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/coffee/admin`,
      },
    });
    setBusy(false);
    setStatus(error ? error.message : 'Owner magic link sent. Open it on this device.');
  }

  return (
    <main className="min-h-screen bg-[#070808] px-5 py-12 text-white">
      <div className="mx-auto grid min-h-[82vh] max-w-5xl place-items-center">
        <section className="w-full overflow-hidden rounded-[2rem] border border-[#d9ff2f]/20 bg-[radial-gradient(circle_at_top_right,rgba(217,255,47,.12),transparent_34%),linear-gradient(145deg,#111,#030303)] p-6 shadow-2xl md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[.16em] text-white/55">
            <ShieldCheck size={13} className="text-[#d9ff2f]" /> Owner only · noindex
          </div>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_.85fr]">
            <div>
              <div className="font-mono text-[10px] font-black uppercase tracking-[.2em] text-[#78d9d4]">Misfit Mediahouse control plane</div>
              <h1 className="mt-4 font-display text-5xl font-black uppercase leading-[.86] tracking-[-.055em] md:text-7xl">Coffee &amp; A Joint<br/><span className="text-[#d9ff2f]">Launch Console</span></h1>
              <p className="mt-6 max-w-xl text-sm leading-7 text-white/60 md:text-base">Every owner login, billing approval, sample purchase, physical quality decision, and launch unlock lives here. Public customers never see this page.</p>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  ['Revenue rails', Sparkles],
                  ['Fulfillment proof', Truck],
                  ['Product QA', ShoppingBag],
                ].map(([label, Icon]) => (
                  <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.025] p-4 text-xs text-white/55">
                    <Icon size={16} className="text-[#78d9d4]" /> {label}
                  </div>
                ))}
              </div>
            </div>
            <form onSubmit={login} className="rounded-3xl border border-white/10 bg-black/45 p-5 md:p-6">
              <div className="flex items-center gap-2 text-[#d9ff2f]"><KeyRound size={18}/><span className="font-mono text-[10px] uppercase tracking-[.16em]">Owner authentication</span></div>
              <label className="mt-6 block font-mono text-[9px] uppercase tracking-[.14em] text-white/40">Approved email</label>
              <input value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" type="email" required className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-white/[.04] px-4 text-sm outline-none focus:border-[#78d9d4]/60" placeholder="misfitmediahouse@gmail.com" />
              <label className="mt-5 block font-mono text-[9px] uppercase tracking-[.14em] text-white/40">Password</label>
              <input value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" type="password" required className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-white/[.04] px-4 text-sm outline-none focus:border-[#78d9d4]/60" placeholder="••••••••••••" />
              <button disabled={busy} className="mt-6 min-h-12 w-full rounded-xl bg-[#d9ff2f] px-4 font-mono text-[10px] font-black uppercase tracking-[.14em] text-black disabled:opacity-50">{busy ? 'Opening…' : 'Open launch console'}</button>
              <button type="button" onClick={sendMagicLink} disabled={busy} className="mt-3 min-h-12 w-full rounded-xl border border-white/12 px-4 text-sm text-white/65 hover:border-[#78d9d4]/40 hover:text-[#78d9d4]">Send owner magic link instead</button>
              {status && <div className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/5 p-3 text-xs leading-5 text-amber-100">{status}</div>}
              <p className="mt-5 text-[11px] leading-5 text-white/30">No signup is available here. Passwords stay in the account provider and your password manager—not in this console.</p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

function GateCard({ gate, session, onReload }) {
  const [note, setNote] = useState(gate.payload?.owner_notes || '');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const payload = gate.payload || {};
  const complete = gate.status === 'completed';

  async function updateGate(patch) {
    setBusy(true);
    setNotice('');
    const { error } = await supabase
      .from('human_gates')
      .update(patch)
      .eq('id', gate.id)
      .eq('organization_id', ORGANIZATION_ID);
    setBusy(false);
    if (error) return setNotice(error.message);
    await onReload();
  }

  async function toggleComplete() {
    const next = complete ? 'pending' : 'completed';
    await updateGate({
      status: next,
      decided_by: complete ? null : session.user.id,
      decided_at: complete ? null : new Date().toISOString(),
    });
  }

  async function saveNote() {
    await updateGate({ payload: { ...payload, owner_notes: note.trim() } });
    setNotice('Note saved.');
  }

  async function copyHandoff() {
    const lines = [
      `Walk me through this Misfit human gate: ${payload.title || gate.gate_type}.`,
      `Current status: ${gate.status}.`,
      `Human action: ${payload.human_action || gate.reason}`,
      '',
      'Steps:',
      ...(payload.steps || []).map((step, index) => `${index + 1}. ${step}`),
      '',
      'Use my connected apps for everything you can do safely. Give me the exact link when I must take over, wait for me, then verify the evidence and update the gate. Do not claim completion without proof.',
    ];
    await navigator.clipboard.writeText(lines.join('\n'));
    setNotice('Chat handoff copied.');
  }

  return (
    <article className={`overflow-hidden rounded-[1.75rem] border ${complete ? 'border-emerald-300/20 bg-emerald-300/[.035]' : 'border-white/10 bg-white/[.025]'}`}>
      <div className="p-5 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-black font-display text-sm font-black text-white/60">{String(payload.priority || 0).padStart(2, '0')}</div>
            <div>
              <div className="font-mono text-[8px] font-black uppercase tracking-[.16em] text-[#78d9d4]">{payload.section || 'Human gate'}</div>
              <h3 className="mt-1 font-display text-2xl font-black uppercase leading-[.95] tracking-[-.025em] md:text-3xl">{payload.title || gate.gate_type}</h3>
            </div>
          </div>
          <StatusPill gate={gate} />
        </div>

        <p className="mt-5 text-sm leading-6 text-white/55">{gate.reason}</p>

        <div className="mt-5 rounded-2xl border border-[#d9ff2f]/15 bg-[#d9ff2f]/[.045] p-4">
          <div className="font-mono text-[8px] font-black uppercase tracking-[.16em] text-[#d9ff2f]">Your move</div>
          <p className="mt-2 text-sm leading-6 text-white/75">{payload.human_action}</p>
        </div>

        <ol className="mt-5 space-y-2.5">
          {(payload.steps || []).map((step, index) => (
            <li key={step} className="flex gap-3 text-sm leading-6 text-white/60">
              <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-white/12 bg-black font-mono text-[8px] text-white/40">{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        {payload.evidence_required?.length ? (
          <div className="mt-5 border-t border-white/[.08] pt-5">
            <div className="font-mono text-[8px] font-black uppercase tracking-[.16em] text-white/35">Proof required before this closes</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {payload.evidence_required.map((item) => <span key={item} className="rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[10px] text-white/50">{item}</span>)}
            </div>
          </div>
        ) : null}

        <div className="mt-5 rounded-2xl border border-cyan-300/15 bg-cyan-300/[.035] p-4">
          <div className="flex items-center gap-2 font-mono text-[8px] font-black uppercase tracking-[.16em] text-cyan-200"><Bot size={13}/> What AI does immediately after</div>
          <p className="mt-2 text-xs leading-5 text-white/55">{payload.ai_after}</p>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <a href={payload.action_url} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#d9ff2f] px-4 font-mono text-[9px] font-black uppercase tracking-[.13em] text-black">
            Open exact screen <ArrowUpRight size={14}/>
          </a>
          <button type="button" onClick={copyHandoff} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/12 px-4 font-mono text-[9px] font-black uppercase tracking-[.13em] text-white/70 hover:border-cyan-300/40 hover:text-cyan-200">
            Copy ChatGPT walkthrough <Clipboard size={14}/>
          </button>
        </div>

        {payload.secondary_urls?.length ? (
          <div className="mt-3 flex flex-wrap gap-3">
            {payload.secondary_urls.map((url, index) => (
              <a key={url} href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[10px] text-white/40 hover:text-white/75">Alternate {index + 1}<ExternalLink size={11}/></a>
            ))}
          </div>
        ) : null}

        <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
          <input value={note} onChange={(event) => setNote(event.target.value)} className="min-h-11 rounded-xl border border-white/10 bg-black/55 px-4 text-xs text-white outline-none placeholder:text-white/20 focus:border-[#78d9d4]/50" placeholder="Paste confirmation ID, provider IDs, tracking, or your QA decision" />
          <button type="button" disabled={busy} onClick={saveNote} className="min-h-11 rounded-xl border border-white/12 px-4 font-mono text-[9px] font-black uppercase tracking-[.12em] text-white/60 disabled:opacity-50">Save proof note</button>
          <button type="button" disabled={busy} onClick={toggleComplete} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 font-mono text-[9px] font-black uppercase tracking-[.12em] disabled:opacity-50 ${complete ? 'border border-white/12 text-white/45' : 'bg-emerald-300 text-black'}`}>
            {complete ? 'Reopen' : <><Check size={13}/> Mark complete</>}
          </button>
        </div>
        {notice && <div className="mt-3 text-xs text-amber-100/75">{notice}</div>}
      </div>
    </article>
  );
}

export default function CoffeeLaunchConsole() {
  const [session, setSession] = useState(null);
  const [gates, setGates] = useState([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session || null);
      setBusy(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => listener.subscription.unsubscribe();
  }, []);

  async function load() {
    if (!session) return;
    setBusy(true);
    setError('');
    const { data, error: queryError } = await supabase
      .from('human_gates')
      .select('id,gate_type,status,reason,payload,created_at,decided_at')
      .eq('organization_id', ORGANIZATION_ID)
      .contains('payload', { surface: 'coffee_launch_console' });
    setBusy(false);
    if (queryError) {
      setGates([]);
      return setError(queryError.message);
    }
    setGates((data || []).sort((left, right) => Number(left.payload?.priority || 999) - Number(right.payload?.priority || 999)));
  }

  useEffect(() => {
    if (session) load();
    else setGates([]);
  }, [session]);

  const grouped = useMemo(() => Object.fromEntries(sectionOrder.map((section) => [section, gates.filter((gate) => gate.payload?.section === section)])), [gates]);
  const completed = gates.filter((gate) => gate.status === 'completed').length;
  const readyStates = new Set(['ready_for_owner', 'ready_for_supplier_outreach']);
  const readyNow = gates.filter((gate) => gate.status !== 'completed' && readyStates.has(gate.payload?.readiness)).length;
  const waiting = Math.max(0, gates.length - completed - readyNow);
  const progress = gates.length ? Math.round((completed / gates.length) * 100) : 0;
  const nextGate = gates.find((gate) => gate.status !== 'completed' && readyStates.has(gate.payload?.readiness));

  if (busy && !session) return <main className="grid min-h-screen place-items-center bg-black text-[#d9ff2f]"><RefreshCw className="animate-spin"/></main>;
  if (!session) return <Login onSession={setSession} />;

  return (
    <main className="min-h-screen bg-[#070808] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/90 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div>
            <a href="/" className="font-display text-lg font-black uppercase tracking-[-.03em]">MISFIT<span className="text-[#78d9d4]">.</span></a>
            <div className="font-mono text-[7px] uppercase tracking-[.16em] text-white/30">Coffee &amp; A Joint · owner launch console</div>
          </div>
          <div className="flex items-center gap-2">
            <a href="https://www.coffeeandajoint.co/" target="_blank" rel="noreferrer" className="hidden min-h-10 items-center gap-2 rounded-xl border border-white/10 px-3 font-mono text-[8px] uppercase tracking-[.12em] text-white/50 sm:inline-flex"><Store size={13}/> Store</a>
            <button type="button" onClick={load} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white/45 hover:text-[#78d9d4]" aria-label="Refresh gates"><RefreshCw size={15} className={busy ? 'animate-spin' : ''}/></button>
            <button type="button" onClick={() => supabase.auth.signOut()} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/10 px-3 font-mono text-[8px] uppercase tracking-[.12em] text-white/45"><LogOut size={13}/> Exit</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-7 md:px-6 md:pt-10">
        <section className="overflow-hidden rounded-[2rem] border border-[#d9ff2f]/20 bg-[radial-gradient(circle_at_top_right,rgba(217,255,47,.11),transparent_35%),linear-gradient(145deg,#111,#030303)] p-6 md:p-9">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-[#d9ff2f]/30 bg-[#d9ff2f]/10 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.14em] text-[#d9ff2f]">Owner private</span>
            <span className="rounded-full border border-[#78d9d4]/30 bg-[#78d9d4]/10 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.14em] text-[#78d9d4]">Misfit Cloud synced</span>
            <span className="rounded-full border border-white/10 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.14em] text-white/40">Noindex</span>
          </div>
          <div className="mt-6 grid gap-7 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
            <div>
              <div className="font-mono text-[9px] font-black uppercase tracking-[.18em] text-[#78d9d4]">Human gates → verified launch</div>
              <h1 className="mt-3 font-display text-5xl font-black uppercase leading-[.82] tracking-[-.06em] md:text-7xl">Do the human part.<br/><span className="text-[#d9ff2f]">AI takes it back.</span></h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55">This is the permanent handoff rail. Open the exact screen, finish only what requires your identity, payment approval, terms acceptance, or physical judgment, save the evidence, and hand control back to ChatGPT.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
              <div className="flex items-end justify-between gap-4"><div><div className="font-mono text-[8px] uppercase tracking-[.14em] text-white/35">Launch proof</div><div className="mt-2 text-4xl font-black">{progress}%</div></div><div className="text-right text-xs leading-5 text-white/35">{completed} complete<br/>{gates.length - completed} remaining</div></div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[.08]"><div className="h-full bg-[#d9ff2f] transition-all" style={{ width: `${progress}%` }}/></div>
              {nextGate ? <a href={nextGate.payload?.action_url} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 w-full items-center justify-between rounded-xl bg-[#d9ff2f] px-4 font-mono text-[9px] font-black uppercase tracking-[.13em] text-black"><span>Start next: {nextGate.payload?.title}</span><ArrowUpRight size={14}/></a> : null}
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            ['Ready for you now', readyNow, '#d9ff2f'],
            ['Waiting or blocked', waiting, '#78d9d4'],
            ['Verified complete', completed, '#86efac'],
          ].map(([label, value, color]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/[.025] p-5"><div className="font-mono text-[8px] uppercase tracking-[.14em] text-white/35">{label}</div><div className="mt-2 text-3xl font-black" style={{ color }}>{value}</div></div>)}
        </section>

        <section className="mt-5 rounded-3xl border border-red-300/20 bg-red-300/[.045] p-5 md:p-6">
          <div className="font-mono text-[9px] font-black uppercase tracking-[.16em] text-red-200">Traffic lock</div>
          <p className="mt-2 text-sm leading-6 text-white/65">Do not scale paid or mass consumer traffic until both fulfillment mappings are green and real test orders return provider IDs, tracking, delivery, and owner quality approval.</p>
        </section>

        {error && <div className="mt-5 rounded-2xl border border-red-300/20 bg-red-300/5 p-4 text-sm text-red-100">{error}</div>}

        {sectionOrder.map((section) => grouped[section]?.length ? (
          <section key={section} className="mt-10">
            <div className="mb-4 flex items-center justify-between gap-4"><div><div className="font-mono text-[9px] font-black uppercase tracking-[.18em] text-[#78d9d4]">Coffee operation</div><h2 className="mt-2 font-display text-3xl font-black uppercase tracking-[-.035em] md:text-4xl">{section}</h2></div><div className="font-mono text-[9px] text-white/25">{grouped[section].length} gate{grouped[section].length === 1 ? '' : 's'}</div></div>
            <div className="grid gap-4">
              {grouped[section].map((gate) => <GateCard key={gate.id} gate={gate} session={session} onReload={load} />)}
            </div>
          </section>
        ) : null)}

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[.025] p-6 md:p-8">
          <div className="font-mono text-[9px] font-black uppercase tracking-[.18em] text-[#d9ff2f]">Locked product architecture</div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              ['RC', 'Three hero units—not an RC store: a Misfit drift car, overland truck/Suburban path, and aircraft only after licensing, parts support, branded fulfillment, and physical testing.'],
              ['Skate', 'Decks and ready-to-skate completes first. Custom wheels and trucks launch only when pro-level construction, durometer, bearings, and replacement supply are verified.'],
              ['Black Flag', 'A real 3 × 5 double-sided flag with correct reverse readability, durable seams, metal grommets, blind shipping, and an outdoor sample test.'],
            ].map(([title, copy]) => <article key={title} className="rounded-2xl border border-white/10 bg-black/35 p-5"><h3 className="font-display text-xl font-black uppercase">{title}</h3><p className="mt-3 text-xs leading-6 text-white/45">{copy}</p></article>)}
          </div>
        </section>
      </div>
    </main>
  );
}
