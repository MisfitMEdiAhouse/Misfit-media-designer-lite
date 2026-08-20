import { useEffect, useMemo, useState } from 'react';
import { Activity, Bot, Check, Copy, ExternalLink, LockKeyhole, Search, Share2, ShieldCheck, ShoppingBag, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const AUDIT = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/shopify-agentic-audit';

function gradeTone(grade) {
  if (grade === 'A') return 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10';
  if (grade === 'B') return 'text-cyan-300 border-cyan-400/30 bg-cyan-400/10';
  if (grade === 'C') return 'text-amber-300 border-amber-400/30 bg-amber-400/10';
  return 'text-rose-300 border-rose-400/30 bg-rose-400/10';
}

export default function ShopifyAgenticAudit() {
  const params = new URLSearchParams(window.location.search);
  const [store, setStore] = useState(params.get('store') || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shareState, setShareState] = useState('');

  const run = async (value = store) => {
    const cleaned = String(value || '').trim();
    if (!cleaned) return;
    setLoading(true); setError(''); setShareState('');
    try {
      const r = await fetch(AUDIT, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ store: cleaned }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || d.error || 'Audit failed');
      setResult(d);
      const url = new URL(window.location.href); url.searchParams.set('store', d.store); window.history.replaceState({}, '', url);
    } catch (e) { setError(e.message || 'Audit failed'); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (params.get('store')) run(params.get('store')); }, []); // intentional one-time shared-link audit

  const consequential = useMemo(() => {
    const names = result?.shopify_surface?.tool_names || [];
    return names.filter((n) => /(^|_)(create|update|complete|cancel|delete|pay|purchase|refund|send|publish|execute)(_|$)/i.test(n));
  }, [result]);

  const classes = result?.shopify_surface?.tool_classes || { catalog: [], cart: [], checkout: [], account: [] };

  const sharePayload = useMemo(() => {
    if (!result) return null;
    const url = result.share_url || window.location.href;
    return {
      title: `${result.store} — Shopify Agentic Grade ${result.grade}`,
      text: `${result.store} scored ${result.score}/100 (Grade ${result.grade}) on Misfit's Shopify Agentic Audit. See what AI shopping agents can discover and which UCP/MCP surfaces need stronger boundaries.`,
      url,
    };
  }, [result]);

  const copyReport = async () => {
    if (!sharePayload) return;
    try {
      await navigator.clipboard.writeText(`${sharePayload.text}\n${sharePayload.url}`);
      setShareState('copied');
      setTimeout(() => setShareState(''), 2200);
    } catch {
      setShareState('copy_failed');
    }
  };

  const copyBadge = async () => {
    if (!result?.badge?.embed_html) return;
    try {
      await navigator.clipboard.writeText(result.badge.embed_html);
      setShareState('badge_copied');
      setTimeout(() => setShareState(''), 2200);
    } catch {
      setShareState('copy_failed');
    }
  };

  const shareReport = async () => {
    if (!sharePayload) return;
    if (navigator.share) {
      try {
        await navigator.share(sharePayload);
        setShareState('shared');
        setTimeout(() => setShareState(''), 2200);
        return;
      } catch (e) {
        if (e?.name === 'AbortError') return;
      }
    }
    await copyReport();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-5 pb-24 pt-32">
        <section className="overflow-hidden rounded-[2rem] border border-emerald-400/20 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,.15),transparent_35%),linear-gradient(135deg,rgba(15,23,42,.92),rgba(0,0,0,1))] p-7 md:p-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-300"><ShoppingBag size={12}/> Shopify × UCP × MCP × GHOSBC</div>
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight md:text-6xl">SHOPIFY <span className="text-emerald-300">AGENTIC AUDIT</span></h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">See what AI shopping agents can discover about a Shopify storefront, including UCP, <code>/agents.md</code>, catalog/cart/checkout MCP tools, and which consequential surfaces deserve explicit safety boundaries before autonomous use.</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Run it on your store, get the grade, publish the live badge, then challenge another merchant or developer to beat it.</p>
            <div className="mt-6 flex flex-wrap gap-2 text-[11px] text-slate-500">
              <span className="rounded-full border border-white/10 px-3 py-1.5">public metadata only</span>
              <span className="rounded-full border border-white/10 px-3 py-1.5">no cart mutation</span>
              <span className="rounded-full border border-white/10 px-3 py-1.5">no checkout execution</span>
              <span className="rounded-full border border-white/10 px-3 py-1.5">no credentials</span>
            </div>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); run(); }} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1"><Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"/><input value={store} onChange={(e) => setStore(e.target.value)} placeholder="your-store.com or store.myshopify.com" className="w-full rounded-2xl border border-white/10 bg-black/50 py-4 pl-12 pr-4 text-sm text-white outline-none placeholder:text-slate-700 focus:border-emerald-400/40" /></div>
            <button disabled={loading} className="rounded-2xl bg-emerald-300 px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.14em] text-black disabled:opacity-50">{loading ? 'Auditing…' : 'Audit storefront'}</button>
          </form>
          {error && <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-300">{error}</div>}
        </section>

        {result && <>
          <section className="mt-6 grid gap-4 md:grid-cols-[220px_1fr]">
            <div className={`rounded-3xl border p-6 ${gradeTone(result.grade)}`}>
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-70">Agentic score</div>
              <div className="mt-3 font-display text-6xl font-bold">{result.score}</div>
              <div className="mt-1 font-display text-2xl font-bold">Grade {result.grade}</div>
              <div className="mt-4 text-xs opacity-70">Misfit diagnostic score, not a Shopify certification.</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex flex-wrap items-center justify-between gap-3"><div><div className="font-display text-2xl font-bold">{result.store}</div><div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-600">{result.shopify_surface?.server_name || 'storefront surface'}</div></div><span className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] ${result.safety_gate?.decision === 'ALLOW' ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' : result.safety_gate?.decision === 'BLOCK' ? 'border-rose-400/30 bg-rose-400/10 text-rose-300' : 'border-amber-400/30 bg-amber-400/10 text-amber-300'}`}>Safety Gate: {result.safety_gate?.decision || 'N/A'}</span></div>
              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><Activity size={17} className="text-cyan-300"/><div className="mt-3 text-xl font-bold">{result.shopify_surface?.ucp_status}</div><div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-600">UCP profile</div></div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><Sparkles size={17} className="text-cyan-300"/><div className="mt-3 text-xl font-bold">{result.shopify_surface?.agents_md_status || '—'}</div><div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-600">agents.md</div></div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><Bot size={17} className="text-emerald-300"/><div className="mt-3 text-xl font-bold">{result.shopify_surface?.tool_count || 0}</div><div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-600">MCP tools</div></div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><LockKeyhole size={17} className="text-fuchsia-300"/><div className="mt-3 text-xl font-bold">{result.shopify_surface?.ucp?.signing_key_count || 0}</div><div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-600">public signing keys</div></div>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-4">
                {[['Catalog', classes.catalog?.length || 0], ['Cart', classes.cart?.length || 0], ['Checkout', classes.checkout?.length || 0], ['Order/account', classes.account?.length || 0]].map(([label, count]) => <div key={label} className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3"><div className="font-display text-xl font-bold text-white">{count}</div><div className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-600">{label} tools</div></div>)}
              </div>
            </div>
          </section>

          <section className="mt-4 rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.04] p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-300">Make the grade travel</div>
                <h2 className="mt-2 font-display text-2xl font-semibold">Think your storefront is more agent-ready? Prove it.</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">The shared link reruns the public audit. The badge points back to the live result, so every store that publishes it becomes another discovery node for the agent-security network.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={shareReport} className="inline-flex items-center gap-2 rounded-full bg-emerald-300 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-black"><Share2 size={13}/> Share grade</button>
                <button onClick={copyReport} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-300">{shareState === 'copied' ? <Check size={13}/> : <Copy size={13}/>} {shareState === 'copied' ? 'Copied' : 'Copy report'}</button>
              </div>
            </div>
            {result.badge?.url && <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <img src={result.badge.url} width="430" height="54" alt={`Misfit Shopify Agentic Audit for ${result.store}`} className="max-w-full" />
                <button onClick={copyBadge} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-emerald-400/30 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-emerald-300"><Copy size={13}/> {shareState === 'badge_copied' ? 'Embed copied' : 'Copy badge embed'}</button>
              </div>
              <div className="mt-3 font-mono text-[9px] leading-5 text-slate-600">Embeddable SVG. The badge shows the latest persisted public audit state and links back to the live storefront report.</div>
            </div>}
            {shareState === 'shared' && <div className="mt-3 text-xs text-emerald-300">Shared. Let somebody try to beat the grade.</div>}
            {shareState === 'copy_failed' && <div className="mt-3 text-xs text-amber-300">Clipboard access was blocked; use the Share button or copy the URL from the address bar.</div>}
          </section>

          <section className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
              <div className="flex items-center gap-2"><Sparkles size={18} className="text-cyan-300"/><h2 className="font-display text-xl font-semibold">UCP capabilities</h2></div>
              <div className="mt-4 flex flex-wrap gap-2">{(result.shopify_surface?.ucp?.capabilities || []).map((c) => <span key={c} className="rounded-full border border-cyan-400/15 bg-cyan-400/5 px-3 py-1.5 font-mono text-[9px] text-cyan-200">{c}</span>)}</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
              <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-amber-300"/><h2 className="font-display text-xl font-semibold">Consequential surface</h2></div>
              <p className="mt-3 text-sm leading-6 text-slate-500">Mutation and checkout tools deserve explicit action bounds before autonomous use. Read-only catalog/order tools should not be penalized merely because their descriptions mention purchasing.</p>
              <div className="mt-4 flex flex-wrap gap-2">{consequential.length ? consequential.map((t) => <span key={t} className="rounded-full border border-amber-400/20 bg-amber-400/5 px-3 py-1.5 font-mono text-[9px] text-amber-200">{t}</span>) : <span className="text-sm text-slate-600">No obvious consequential tool names detected.</span>}</div>
            </div>
          </section>

          <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.025] p-6">
            <h2 className="font-display text-xl font-semibold">Findings</h2>
            <div className="mt-4 space-y-2">{(result.findings?.length ? result.findings : ['No material metadata findings.']).map((f) => <div key={f} className="rounded-2xl border border-white/8 bg-black/30 p-4 text-sm leading-6 text-slate-400">{f}</div>)}</div>
          </section>

          <section className="mt-6 grid gap-4 md:grid-cols-2">
            <a href="/agents#governance" className="rounded-3xl border border-fuchsia-400/20 bg-fuchsia-400/5 p-6 hover:border-fuchsia-400/40"><ShieldCheck className="text-fuchsia-300"/><h3 className="mt-4 font-display text-2xl font-semibold">Put Misfit Governance in front of agent actions</h3><p className="mt-2 text-sm leading-6 text-slate-500">Use the public-safe governed-action contract for bounded advisory decisions while the raw GHOSBC kernel remains private.</p><div className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-fuchsia-300">Explore governed integration <ExternalLink size={12}/></div></a>
            <a href="https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/deltafeed" target="_blank" rel="noreferrer" className="rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-6 hover:border-cyan-400/40"><Activity className="text-cyan-300"/><h3 className="mt-4 font-display text-2xl font-semibold">Watch the surface with ChangePacket</h3><p className="mt-2 text-sm leading-6 text-slate-500">Store the baseline once; later calls return only what changed in public web or MCP surfaces.</p><div className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-300">2,000 calls · $9 <ExternalLink size={12}/></div></a>
          </section>
        </>}
      </main>
      <Footer />
    </div>
  );
}
