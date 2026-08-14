import { useEffect, useState } from 'react';
import { Activity, Check, Copy, ExternalLink, Network, Search, Share2, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const AUDIT = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/a2a-agent-trust-audit';

function gradeTone(grade) {
  if (grade === 'A') return 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10';
  if (grade === 'B') return 'text-cyan-300 border-cyan-400/30 bg-cyan-400/10';
  if (grade === 'C') return 'text-amber-300 border-amber-400/30 bg-amber-400/10';
  return 'text-rose-300 border-rose-400/30 bg-rose-400/10';
}

export default function A2AAgentAudit() {
  const params = new URLSearchParams(window.location.search);
  const [card, setCard] = useState(params.get('card') || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shareState, setShareState] = useState('');

  const run = async (value = card) => {
    const cleaned = String(value || '').trim();
    if (!cleaned) return;
    setLoading(true); setError(''); setShareState('');
    try {
      const r = await fetch(AUDIT, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ card_url: cleaned }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || d.error || 'Audit failed');
      setResult(d);
      setCard(d.card_url);
      const u = new URL(window.location.href); u.searchParams.set('card', d.card_url); window.history.replaceState({}, '', u);
    } catch (e) { setError(e.message || 'Audit failed'); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (params.get('card')) run(params.get('card')); }, []); // shared report reruns public metadata only

  const copyText = async (text, state) => {
    try { await navigator.clipboard.writeText(text); setShareState(state); setTimeout(() => setShareState(''), 2200); }
    catch { setShareState('copy_failed'); }
  };

  const share = async () => {
    if (!result) return;
    const payload = { title: `${result.agent?.name || 'A2A Agent'} — Trust Grade ${result.grade}`, text: `${result.agent?.name || 'A2A agent'} scored ${result.score}/100 (Grade ${result.grade}, ${result.decision}) on Misfit's public A2A Agent Trust Audit.`, url: result.share_url };
    if (navigator.share) {
      try { await navigator.share(payload); setShareState('shared'); setTimeout(() => setShareState(''), 2200); return; }
      catch (e) { if (e?.name === 'AbortError') return; }
    }
    await copyText(`${payload.text}\n${payload.url}`, 'copied');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-5 pb-24 pt-32">
        <section className="overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.15),transparent_35%),linear-gradient(135deg,rgba(15,23,42,.92),rgba(0,0,0,1))] p-7 md:p-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300"><Network size={12}/> A2A Agent Card × Trust × GHOSBC</div>
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight md:text-6xl">A2A AGENT <span className="text-cyan-300">TRUST AUDIT</span></h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">Audit what another AI agent publicly claims before depending on it. We inspect the Agent Card, declared protocol bindings, skills, security declarations, public endpoints and third-party registry verification.</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500"><strong>This diagnostic never calls or executes the target agent's skills.</strong> Public metadata only. No credentials. No task execution. No payments.</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); run(); }} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1"><Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"/><input value={card} onChange={(e) => setCard(e.target.value)} placeholder="https://agent.example/.well-known/agent-card.json" className="w-full rounded-2xl border border-white/10 bg-black/50 py-4 pl-12 pr-4 text-sm text-white outline-none placeholder:text-slate-700 focus:border-cyan-400/40" /></div>
            <button disabled={loading} className="rounded-2xl bg-cyan-300 px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.14em] text-black disabled:opacity-50">{loading ? 'Auditing…' : 'Audit Agent Card'}</button>
          </form>
          {error && <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-300">{error}</div>}
        </section>

        {result && <>
          <section className="mt-6 grid gap-4 md:grid-cols-[220px_1fr]">
            <div className={`rounded-3xl border p-6 ${gradeTone(result.grade)}`}>
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-70">Trust score</div>
              <div className="mt-3 font-display text-6xl font-bold">{result.score}</div>
              <div className="mt-1 font-display text-2xl font-bold">Grade {result.grade}</div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em]">{result.decision}</div>
              <div className="mt-4 text-xs opacity-70">Misfit diagnostic, not an A2A certification.</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex flex-wrap items-start justify-between gap-3"><div><div className="font-display text-2xl font-bold">{result.agent?.name || 'Unnamed agent'}</div><div className="mt-1 break-all font-mono text-[9px] text-slate-600">{result.card_url}</div></div><span className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] ${result.registry?.task_verified ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' : result.registry?.listed ? 'border-amber-400/30 bg-amber-400/10 text-amber-300' : 'border-white/10 text-slate-500'}`}>{result.registry?.task_verified ? 'registry task-verified' : result.registry?.listed ? 'registry listed' : 'registry not observed'}</span></div>
              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><Network size={17} className="text-cyan-300"/><div className="mt-3 text-xl font-bold">{result.agent?.bindings?.length || 0}</div><div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-600">bindings</div></div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><Activity size={17} className="text-emerald-300"/><div className="mt-3 text-xl font-bold">{result.agent?.skill_count || 0}</div><div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-600">skills</div></div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><ShieldCheck size={17} className="text-fuchsia-300"/><div className="mt-3 text-xl font-bold">{result.agent?.security_scheme_names?.length || 0}</div><div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-600">security schemes</div></div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><Activity size={17} className="text-amber-300"/><div className="mt-3 text-xl font-bold">{result.agent?.protocol_versions?.join(', ') || '—'}</div><div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-600">A2A version</div></div>
              </div>
            </div>
          </section>

          <section className="mt-4 rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.04] p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl"><div className="font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300">Make trust portable</div><h2 className="mt-2 font-display text-2xl font-semibold">Publish the audit, rerun it, challenge the next agent.</h2><p className="mt-2 text-sm leading-6 text-slate-500">The shared URL reruns public metadata. The SVG badge links back to the report, creating a machine-native proof/discovery loop without trusting a screenshot.</p></div>
              <div className="flex flex-wrap gap-2"><button onClick={share} className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-black"><Share2 size={13}/> Share audit</button><button onClick={() => copyText(`${result.agent?.name}: ${result.score}/100 Grade ${result.grade} ${result.decision}\n${result.share_url}`, 'copied')} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-300">{shareState === 'copied' ? <Check size={13}/> : <Copy size={13}/>} {shareState === 'copied' ? 'Copied' : 'Copy report'}</button></div>
            </div>
            {result.badge?.url && <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><img src={result.badge.url} width="470" height="62" alt={`Misfit A2A Agent Trust Audit for ${result.agent?.name || 'agent'}`} className="max-w-full"/><button onClick={() => copyText(result.badge.embed_html, 'badge_copied')} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-cyan-400/30 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-cyan-300"><Copy size={13}/> {shareState === 'badge_copied' ? 'Embed copied' : 'Copy badge embed'}</button></div></div>}
          </section>

          <section className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6"><h2 className="font-display text-xl font-semibold">Declared interfaces</h2><div className="mt-4 space-y-2">{(result.agent?.bindings || []).map((b) => <div key={`${b.binding}-${b.url}`} className="rounded-2xl border border-white/8 bg-black/30 p-4"><div className="font-mono text-[10px] uppercase tracking-[0.12em] text-cyan-300">{b.binding || 'unspecified'} · {b.version || 'version unspecified'}</div><div className="mt-2 break-all text-xs text-slate-500">{b.url}</div></div>)}</div></div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6"><h2 className="font-display text-xl font-semibold">Skill screening</h2><div className="mt-4 space-y-2">{(result.skill_evaluations || []).map((s) => <div key={s.id || s.name} className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-black/30 p-4"><div><div className="text-sm font-semibold">{s.name || s.id}</div><div className="mt-1 text-xs text-slate-600">{(s.flags || []).join(' · ') || 'no static metadata flags'}</div></div><span className={`font-mono text-[10px] ${s.decision === 'BLOCK' ? 'text-rose-300' : s.decision === 'REVIEW' ? 'text-amber-300' : 'text-emerald-300'}`}>{s.decision}</span></div>)}</div></div>
          </section>

          <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.025] p-6"><h2 className="font-display text-xl font-semibold">Findings</h2><div className="mt-4 space-y-2">{(result.findings?.length ? result.findings : ['No material public-metadata findings.']).map((f) => <div key={f} className="rounded-2xl border border-white/8 bg-black/30 p-4 text-sm leading-6 text-slate-400">{f}</div>)}</div></section>

          <section className="mt-6 rounded-3xl border border-fuchsia-400/20 bg-fuchsia-400/5 p-6"><ShieldCheck className="text-fuchsia-300"/><h3 className="mt-4 font-display text-2xl font-semibold">Metadata audit first. Safety Gate before execution.</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">The trust audit tells an agent what the public card claims. GHOSBC Safety Gate is the next boundary when a live tool, dependency, payment, write or other consequential action is actually about to execute.</p><a href="https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-safety-gate" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-fuchsia-300">10,000 checks · $19 <ExternalLink size={12}/></a></section>
        </>}
      </main>
      <Footer />
    </div>
  );
}
