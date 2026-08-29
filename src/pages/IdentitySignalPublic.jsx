import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BrainCircuit, CheckCircle2, Fingerprint, GitCompareArrows, LockKeyhole, Radar, Search, ShieldCheck, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const RPC = 'https://cibcxqrqiqvzpardbdrw.supabase.co/rest/v1/rpc/identity_signal_public';
const PUBLIC_KEY = 'sb_publishable_X-bcgz-3xMIgNZ4rYmAjZA_QNUb69hU';

const presets = [
  ['Evidence first', 'I need to understand what is actually proven, what is experimental, and what my developers can inspect.'],
  ['Explore architecture', 'I am curious how this could plug into our MCP and agent workflow stack without replacing what already works.'],
  ['Ready to test', 'I am ready to run a bounded pilot. Show me the safest next step and what needs human approval.'],
];

function chip(value) {
  return String(value || '—').replaceAll('_', ' ');
}

export default function IdentitySignalPublic() {
  const [name, setName] = useState('');
  const [context, setContext] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const profile = result?.identity_signal;
  const comparison = result?.comparison;
  const structure = useMemo(() => Array.isArray(profile?.preferred_structure) ? profile.preferred_structure : [], [profile]);

  const run = async (event) => {
    event?.preventDefault();
    if (!name.trim() || !context.trim()) {
      setError('Enter a name and one sentence of current context.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch(RPC, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: PUBLIC_KEY,
        },
        body: JSON.stringify({ p_name: name.trim(), p_context: context.trim() }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || payload?.error || 'Identity Signal unavailable.');
      setResult(payload);
    } catch (err) {
      setError(err?.message || 'Identity Signal unavailable.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-24 sm:px-5 md:pt-28">
        <section className="overflow-hidden rounded-[2rem] border border-fuchsia-300/20 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,.16),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(217,70,239,.17),transparent_30%),linear-gradient(135deg,#061018,#020305_55%,#08020b)] p-5 md:p-9">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/25 bg-fuchsia-300/[.07] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[.15em] text-fuchsia-200"><Fingerprint size={13}/> Identity Signal · personalization proof</div>
            <div className="flex flex-wrap gap-2 font-mono text-[9px] uppercase tracking-[.12em]"><span className="rounded-full border border-emerald-300/20 px-3 py-1.5 text-emerald-300">PROOF</span><span className="rounded-full border border-amber-300/20 px-3 py-1.5 text-amber-300">EXPERIMENTAL PERSONALIZATION</span><span className="rounded-full border border-cyan-300/20 px-3 py-1.5 text-cyan-300">PUBLIC-SAFE</span></div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.08fr_.92fr] lg:items-end">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan-300">TRY THE COGNITIVE LAYER ON YOURSELF</div>
              <h1 className="mt-3 max-w-4xl font-display text-4xl font-bold leading-[.98] sm:text-5xl md:text-7xl">SAME FACTS. <span className="text-cyan-300">DIFFERENT HUMAN INTERFACE.</span></h1>
              <p className="mt-5 max-w-3xl text-[15px] leading-7 text-slate-300">Enter your name and one sentence of current context. Name anchors the session; the context drives the adaptation. Identity Signal shows how an agent can change pacing, structure, evidence depth and escalation style without changing facts, authority or safety policy.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/45 p-5">
              <div className="flex items-start gap-3"><LockKeyhole className="mt-1 text-emerald-300" size={18}/><div><div className="text-sm font-semibold">Protected kernel stays sealed.</div><p className="mt-1 text-xs leading-5 text-slate-500">No raw Soul Cipher, private glyph names, symbolic mappings, identity pack or reconstruction material is returned. This is not a psychological assessment and the demo does not store the submitted signal.</p></div></div>
            </div>
          </div>

          <form onSubmit={run} className="mt-8 rounded-3xl border border-cyan-300/20 bg-black/55 p-4 md:p-5">
            <div className="grid gap-3 md:grid-cols-[.42fr_1fr_auto] md:items-end">
              <label className="block"><span className="mb-2 block font-mono text-[9px] uppercase tracking-[.14em] text-slate-500">Identity anchor</span><input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} placeholder="Stan Hansen" className="min-h-14 w-full rounded-2xl border border-white/10 bg-black px-4 text-base outline-none transition focus:border-cyan-300/50"/></label>
              <label className="block"><span className="mb-2 block font-mono text-[9px] uppercase tracking-[.14em] text-slate-500">Current signal / context</span><input value={context} onChange={(e) => setContext(e.target.value)} maxLength={800} placeholder="I need to understand whether this can integrate with our MCP stack..." className="min-h-14 w-full rounded-2xl border border-white/10 bg-black px-4 text-base outline-none transition focus:border-fuchsia-300/50"/></label>
              <button type="submit" disabled={loading} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 font-mono text-xs font-bold uppercase tracking-[.12em] text-black disabled:opacity-50"><Search size={15}/>{loading ? 'Decoding…' : 'Decode'}</button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">{presets.map(([label, text]) => <button key={label} type="button" onClick={() => setContext(text)} className="rounded-full border border-white/10 px-3 py-2 font-mono text-[9px] uppercase tracking-[.1em] text-slate-500 transition hover:border-white/25 hover:text-white">{label}</button>)}</div>
            {error && <div className="mt-4 rounded-2xl border border-rose-300/20 bg-rose-300/[.07] p-3 text-sm text-rose-200">{error}</div>}
          </form>
        </section>

        {profile && comparison && (
          <>
            <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['State marker', chip(profile.state_marker)],
                ['Routing lane', chip(profile.routing_lane)],
                ['Pace', chip(profile.pace)],
                ['Detail depth', chip(profile.detail_depth)],
              ].map(([label, value]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/[.025] p-4"><div className="font-mono text-[9px] uppercase tracking-[.13em] text-slate-600">{label}</div><div className="mt-2 text-lg font-semibold capitalize text-white">{value}</div></div>)}
            </section>

            <section className="mt-5 rounded-3xl border border-fuchsia-300/20 bg-fuchsia-300/[.025] p-5 md:p-7">
              <div className="flex items-center gap-3"><GitCompareArrows className="text-fuchsia-300"/><div><div className="font-mono text-[9px] uppercase tracking-[.15em] text-fuchsia-300">A/B PERSONALIZATION PROOF</div><h2 className="mt-1 text-2xl font-semibold md:text-3xl">Same authority. Different interaction strategy.</h2></div></div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/40 p-5"><div className="font-mono text-[10px] uppercase tracking-[.13em] text-slate-500">Generic agent</div><p className="mt-4 text-base leading-7 text-slate-300">{comparison.generic_agent}</p></div>
                <div className="rounded-2xl border border-cyan-300/25 bg-cyan-300/[.04] p-5"><div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.13em] text-cyan-300"><Sparkles size={13}/> Identity/context-aware agent</div><p className="mt-4 text-base leading-7 text-white">{comparison.identity_context_aware_agent}</p></div>
              </div>
              <div className="mt-4 rounded-2xl border border-emerald-300/15 bg-emerald-300/[.035] p-4 text-center font-mono text-[10px] uppercase tracking-[.13em] text-emerald-200">{comparison.invariant}</div>
            </section>

            <section className="mt-5 grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
              <div className="rounded-3xl border border-white/10 bg-white/[.02] p-5 md:p-6">
                <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.15em] text-cyan-300"><BrainCircuit size={14}/> Response architecture</div>
                <div className="mt-5 space-y-3">{structure.map((item, index) => <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-black/35 p-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cyan-300/20 font-mono text-[10px] text-cyan-300">{index + 1}</span><span className="text-sm capitalize text-slate-300">{item}</span></div>)}</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[.02] p-5 md:p-6">
                <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.15em] text-fuchsia-300"><Radar size={14}/> Public-safe receipt</div>
                <div className="mt-5 space-y-3 text-sm">
                  <Row label="Signal ID" value={profile.signal_id}/>
                  <Row label="Signal strength" value={chip(profile.signal_strength)}/>
                  <Row label="Response mode" value={chip(profile.response_mode)}/>
                  <Row label="Escalation" value={profile.escalation_style}/>
                </div>
                <div className="mt-5 rounded-2xl border border-emerald-300/15 bg-emerald-300/[.035] p-4"><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 shrink-0 text-emerald-300" size={16}/><p className="text-xs leading-6 text-slate-400">Name is used as an identity anchor, not a personality claim. Current context drives the adaptation. The RPC returns no protected Soul Cipher vocabulary and performs no insert/update.</p></div></div>
              </div>
            </section>
          </>
        )}

        <section className="mt-5 rounded-3xl border border-cyan-300/20 bg-[linear-gradient(135deg,rgba(34,211,238,.06),rgba(217,70,239,.04),rgba(0,0,0,.9))] p-5 md:p-7">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div><div className="font-mono text-[9px] uppercase tracking-[.15em] text-cyan-300">WHY THIS MATTERS FOR AGENT SYSTEMS</div><h2 className="mt-2 text-2xl font-semibold md:text-3xl">Personalization should change the interface — not silently change authority.</h2><p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400">Identity Signal is the public-safe personalization proof. ContextForge grounds system context. Castle Gate governs consequence. Sentinel watches runtime behavior. The private GHOSBC/Soul Cipher kernel remains behind those contracts.</p></div>
            <div className="flex flex-wrap gap-2 lg:flex-col"><a href="/stan-hansen" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 font-mono text-[10px] uppercase tracking-[.1em] text-slate-300"><ArrowLeft size={13}/> Stan / Egnyte tour</a><a href="/agent-evaluation-lab" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 font-mono text-[10px] font-bold uppercase tracking-[.1em] text-black">Agent Evaluation Lab <ArrowRight size={13}/></a></div>
          </div>
        </section>

        <section className="mt-5 flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[.018] p-4"><CheckCircle2 className="mt-0.5 shrink-0 text-slate-500" size={15}/><p className="text-xs leading-6 text-slate-600">Status: PROOF · EXPERIMENTAL PERSONALIZATION · PUBLIC-SAFE. This demonstrates bounded adaptation behavior; it does not claim a completed Soul Cipher compiler, psychological diagnosis, behavioral certainty, or exposure of the protected identity engine.</p></section>
      </main>
      <Footer />
    </div>
  );
}

function Row({ label, value }) {
  return <div className="rounded-xl border border-white/8 bg-black/35 p-3"><div className="font-mono text-[8px] uppercase tracking-[.12em] text-slate-600">{label}</div><div className="mt-1 break-words capitalize text-slate-300">{value}</div></div>;
}
