import { useEffect, useRef, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Gauge,
  Globe2,
  LockKeyhole,
  Radar,
  Search,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ShopifyStartLink from '../components/ShopifyStartLink.jsx';

const SCRUB_ENDPOINT = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/business-scrub';
const LEAD_ENDPOINT = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/lead-capture';

const OFFER_DETAILS = {
  quotelink: {
    name: 'Misfit QuoteLink',
    price: '$49 once',
    href: '/quotelink',
    action: 'Build the fast fix',
  },
  website_ai_launch: {
    name: 'SnapSite Website + AI Activation',
    price: '$1,500 once',
    action: 'Launch the rebuild',
  },
  lead_engine: {
    name: 'Misfit AI V2 — Intake + Membership Engine',
    price: '$297/mo',
    href: '/misfit-ai-v2',
    action: 'See the system',
  },
  managed_growth: {
    name: 'Growth Partner / Managed Marketing',
    price: '$997/mo',
    action: 'Put Misfit to work',
  },
};

const ERROR_COPY = {
  website_required: 'Enter a public business website first.',
  invalid_website: 'That does not look like a valid website address.',
  https_website_required: 'Use a public HTTPS website. Private networks and nonstandard ports are blocked.',
  private_website_rejected: 'Private, local, and internal network targets cannot be scanned.',
  website_dns_failed: 'That domain did not resolve to a public website.',
  domain_rate_limit: 'That website has been scrubbed several times this hour. Try again later.',
  rate_limited: 'This connection has reached the hourly scrub limit. Try again later.',
  response_too_large: 'The homepage response was too large for the safe public scanner.',
};

function gradeTone(grade) {
  if (grade === 'A') return 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300';
  if (grade === 'B') return 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300';
  if (grade === 'C') return 'border-amber-400/30 bg-amber-400/10 text-amber-300';
  return 'border-rose-400/30 bg-rose-400/10 text-rose-300';
}

function impactTone(impact) {
  if (impact === 'critical') return 'border-rose-400/30 bg-rose-400/10 text-rose-300';
  if (impact === 'high') return 'border-amber-400/30 bg-amber-400/10 text-amber-300';
  return 'border-cyan-400/20 bg-cyan-400/5 text-cyan-300';
}

function titleCase(value) {
  return String(value || 'unknown').replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function BusinessScrub() {
  const [params, setParams] = useSearchParams();
  const initialSite = params.get('site') || '';
  const [site, setSite] = useState(initialSite);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [offerLinks, setOfferLinks] = useState({});
  const [shareState, setShareState] = useState('');
  const [lead, setLead] = useState({ name: '', business: '', contact: '', companyWebsite: '' });
  const [leadState, setLeadState] = useState('');
  const autoRan = useRef(false);

  useEffect(() => {
    document.title = 'Shopify Store + Business Health Scan | Misfit Mediahouse';
    fetch('/offers.json').then((response) => response.json()).then(setOfferLinks).catch(() => {});
  }, []);

  const runScrub = async (value = site) => {
    const cleaned = String(value || '').trim();
    if (!cleaned || loading) return;
    setLoading(true);
    setError('');
    setResult(null);
    setLeadState('');
    try {
      const response = await fetch(SCRUB_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ website: cleaned }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || data.message || 'scrub_failed');
      setResult(data);
      setSite(data.domain);
      setLead((current) => ({ ...current, business: current.business || data.domain }));
      setParams({ site: data.domain }, { replace: true });
      window.setTimeout(() => document.getElementById('scrub-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    } catch (caught) {
      const code = caught?.message || 'scrub_failed';
      setError(ERROR_COPY[code] || 'The public scanner could not complete this scrub. Check the address and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialSite || autoRan.current) return;
    autoRan.current = true;
    runScrub(initialSite);
  }, []); // shared scrub links run once on arrival

  const submitLead = async (event) => {
    event.preventDefault();
    if (!result || leadState === 'sending') return;
    setLeadState('sending');
    try {
      const response = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: lead.name,
          businessName: lead.business || result.domain,
          websiteUrl: result.website,
          contact: lead.contact,
          companyWebsite: lead.companyWebsite,
          requestedService: `business_scrub_${result.recommended_offer?.key || 'assessment'}`,
          source: 'business_scrub_results',
          landingPage: `${window.location.pathname}${window.location.search}`,
          message: `Business Scrub ${result.score}/100 (${result.grade}). Priority leaks: ${(result.revenue_leaks || []).slice(0, 3).map((item) => item.title).join('; ')}`,
        }),
      });
      if (!response.ok) throw new Error('capture_failed');
      setLeadState('sent');
    } catch {
      setLeadState('error');
    }
  };

  const share = async () => {
    if (!result) return;
    const payload = {
      title: `${result.domain} — Misfit Business Scrub ${result.grade}`,
      text: `${result.domain} scored ${result.score}/100 on the Misfit Business Scrub.`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(payload);
        setShareState('shared');
        return;
      } catch (caught) {
        if (caught?.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${payload.text}\n${payload.url}`);
      setShareState('copied');
    } catch {
      setShareState('failed');
    }
  };

  const recommended = result?.recommended_offer
    ? { ...result.recommended_offer, ...OFFER_DETAILS[result.recommended_offer.key] }
    : null;
  const offerHref = recommended?.href || offerLinks[recommended?.key] || '/#request-demo';
  const categories = result?.category_scores ? Object.values(result.category_scores) : [];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pb-24 pt-28">
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 grid-bg opacity-25" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,229,255,.16),transparent_48%)]" />
          <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300">
              <Radar size={13} aria-hidden="true" /> Shopify store + business health scan
            </div>
            <h1 className="mt-6 max-w-5xl font-display text-[clamp(3.2rem,10vw,7rem)] font-bold uppercase leading-[0.86] tracking-[-0.055em]">
              Drop in a website.
              <span className="block text-cyan-300">Find what is costing sales.</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-slate-300 sm:text-xl sm:leading-8">
              One public URL becomes a first-pass teardown of the site foundation, conversion path, discoverability, trust signals, automation, and AI readiness—then Misfit routes the highest-value next move.
            </p>
            <form onSubmit={(event) => { event.preventDefault(); runScrub(); }} className="mt-9 flex max-w-5xl flex-col gap-2 rounded-[1.6rem] border border-white/15 bg-white/[0.06] p-2 sm:flex-row sm:rounded-full">
              <label htmlFor="business-scrub-site" className="sr-only">Business website</label>
              <div className="relative min-w-0 flex-1">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-300" aria-hidden="true" />
                <input
                  id="business-scrub-site"
                  value={site}
                  onChange={(event) => setSite(event.target.value)}
                  inputMode="url"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  placeholder="yourstore.com"
                  className="min-h-14 w-full rounded-2xl bg-transparent py-3 pl-12 pr-4 text-base outline-none placeholder:text-slate-600 sm:rounded-full sm:text-lg"
                />
              </div>
              <button disabled={loading} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-7 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-black disabled:cursor-wait disabled:opacity-60 sm:rounded-full">
                {loading ? 'Scanning…' : 'Scan this site'} <ArrowRight size={15} aria-hidden="true" />
              </button>
            </form>
            <div className="mt-4 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.12em] text-slate-600">
              {['Public website only', 'Safe DNS checks', 'No credentials', 'No mutations', 'No checkout actions'].map((item) => <span key={item} className="rounded-full border border-white/10 px-3 py-1.5">{item}</span>)}
            </div>
            {error && <div role="alert" className="mt-5 max-w-3xl rounded-2xl border border-rose-400/25 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</div>}
          </div>
        </section>

        {loading && (
          <section className="mx-auto max-w-6xl px-5 py-12" aria-live="polite">
            <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.04] p-6 sm:p-8">
              <div className="flex items-center gap-3"><Activity className="animate-pulse text-cyan-300" /><div><div className="font-display text-2xl font-semibold">Scrubbing the public surface</div><div className="mt-1 text-sm text-slate-500">Checking reachability, conversion, search signals, DNS trust, automation, and agent-facing metadata.</div></div></div>
            </div>
          </section>
        )}

        {result && (
          <div id="scrub-results" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-12">
            <section className="grid gap-5 lg:grid-cols-[240px_1fr]">
              <div className={`rounded-3xl border p-6 ${gradeTone(result.grade)}`}>
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-70">Public revenue readiness</div>
                <div className="mt-4 font-display text-7xl font-bold">{result.score}</div>
                <div className="mt-1 font-display text-2xl font-bold">Grade {result.grade}</div>
                <div className="mt-4 text-xs leading-5 opacity-70">Misfit diagnostic score—not a revenue guarantee, certification, security test, or compliance opinion.</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="break-all font-display text-2xl font-bold sm:text-3xl">{result.domain}</div>
                    <a href={result.website} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 text-xs text-cyan-300 hover:text-white">Open public site <ExternalLink size={12} /></a>
                  </div>
                  <button onClick={share} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-300">
                    {shareState === 'copied' ? <Check size={13} /> : shareState === 'failed' ? <Copy size={13} /> : <Share2 size={13} />}
                    {shareState === 'copied' ? 'Link copied' : shareState === 'shared' ? 'Shared' : shareState === 'failed' ? 'Copy URL' : 'Share scrub'}
                  </button>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {[
                    [Globe2, 'Business type', titleCase(result.business_type)],
                    [Sparkles, 'Platform', result.platform || 'Unknown'],
                    [Activity, 'HTTP', result.status_code || 'No response'],
                    [Gauge, 'HTML', result.performance?.html_kb ? `${result.performance.html_kb} KB` : '—'],
                    [Radar, 'Response', result.performance?.response_ms ? `${result.performance.response_ms} ms` : '—'],
                  ].map(([Icon, label, value]) => <div key={label} className="rounded-2xl border border-white/10 bg-black/30 p-4"><Icon size={16} className="text-cyan-300"/><div className="mt-3 text-sm font-semibold">{value}</div><div className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-600">{label}</div></div>)}
                </div>
              </div>
            </section>

            <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {categories.map((category) => (
                <div key={category.key} className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                  <div className="flex items-end justify-between gap-2"><span className="font-display text-2xl font-bold">{category.score}</span><span className="text-xs text-slate-600">/ {category.max}</span></div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-cyan-300" style={{ width: `${Math.round((category.score / category.max) * 100)}%` }} /></div>
                  <div className="mt-3 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">{category.label}</div>
                </div>
              ))}
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
              <div>
                <div className="flex items-center gap-2"><AlertTriangle size={18} className="text-amber-300"/><h2 className="font-display text-3xl font-semibold">Priority revenue leaks</h2></div>
                <div className="mt-4 space-y-3">
                  {(result.revenue_leaks || []).map((item, index) => (
                    <article key={`${item.title}-${index}`} className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
                      <div className="flex flex-wrap items-center gap-3"><span className={`rounded-full border px-3 py-1 font-mono text-[9px] uppercase tracking-[0.12em] ${impactTone(item.impact)}`}>{item.impact} impact</span><span className="font-mono text-[9px] uppercase tracking-[0.12em] text-slate-600">Fix {String(index + 1).padStart(2, '0')}</span></div>
                      <h3 className="mt-4 font-display text-xl font-semibold">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{item.evidence}</p>
                      <div className="mt-4 border-l border-cyan-400/30 pl-4 text-sm leading-6 text-cyan-100/80"><strong className="text-cyan-300">Recommended fix:</strong> {item.fix}</div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <section className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.04] p-6">
                  <div className="flex items-center gap-2 text-emerald-300"><CheckCircle2 size={18}/><h2 className="font-display text-xl font-semibold">What is already working</h2></div>
                  <div className="mt-4 space-y-3">{(result.wins || []).map((win, index) => <div key={`${win}-${index}`} className="flex gap-3 text-sm leading-6 text-slate-400"><CheckCircle2 size={15} className="mt-1 shrink-0 text-emerald-300"/><span>{win}</span></div>)}</div>
                </section>
                <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
                  <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-cyan-300"/><h2 className="font-display text-xl font-semibold">What this scrub can—and cannot—see</h2></div>
                  <p className="mt-3 text-sm leading-6 text-slate-500">This scan reads public HTML, response headers, DNS, robots/sitemap, and public agent metadata. JavaScript-only experiences can hide some signals. Actual Google coverage, traffic, CRM, ad spend, close rate, and revenue require approved account connections.</p>
                </section>
              </div>
            </section>

            {recommended && (
              <section className="mt-8 overflow-hidden rounded-[2rem] border border-cyan-400/25 bg-[radial-gradient(circle_at_top_right,rgba(0,229,255,.15),transparent_35%),linear-gradient(135deg,rgba(15,23,42,.95),rgba(0,0,0,1))] p-6 sm:p-9">
                <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300">Best next Misfit move</div>
                    <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">{recommended.name}</h2>
                    <div className="mt-2 text-xl font-semibold text-white">{recommended.price}</div>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">{recommended.reason}</p>
                  </div>
                  <a href={offerHref} target={offerHref.startsWith('http') ? '_blank' : undefined} rel={offerHref.startsWith('http') ? 'noreferrer' : undefined} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-cyan-300 px-7 font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-black hover:bg-white">
                    {recommended.action || 'Start the fix'} <ArrowRight size={15}/>
                  </a>
                </div>
                {result.deeper_audit?.href && <a href={`${result.deeper_audit.href}${result.deeper_audit.query ? `?${result.deeper_audit.query}=${encodeURIComponent(result.domain)}` : ''}`} className="mt-5 inline-flex items-center gap-2 text-xs text-cyan-300 hover:text-white">{result.deeper_audit.label} <ExternalLink size={12}/></a>}
                <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div><div className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-600">Starting fresh?</div><div className="mt-1 text-sm text-slate-400">Launch the store on Shopify, then bring Misfit back for the build and revenue system.</div></div>
                  <ShopifyStartLink label="Start a new Shopify store →" moduleKey="business_scrub_results" className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 px-5 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-white hover:border-cyan-300/50 hover:text-cyan-300" />
                </div>
              </section>
            )}

            <section className="mt-8 grid gap-7 rounded-[2rem] border border-white/10 bg-white/[0.025] p-6 sm:p-9 lg:grid-cols-[.8fr_1.2fr]">
              <div>
                <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-fuchsia-300"><LockKeyhole size={13}/> Human-approved handoff</div>
                <h2 className="mt-4 font-display text-3xl font-semibold">Send the scrub to Misfit.</h2>
                <p className="mt-3 text-sm leading-7 text-slate-500">Give us a real contact path and this diagnostic becomes a qualified agency conversation. No account changes, contracts, purchases, or outbound campaigns happen from this form.</p>
              </div>
              {leadState === 'sent' ? (
                <div className="flex min-h-56 items-center rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.04] p-6"><div><CheckCircle2 className="text-emerald-300"/><h3 className="mt-4 font-display text-2xl font-semibold">Scrub received.</h3><p className="mt-2 text-sm text-slate-500">Misfit now has the website, score, and priority leaks for a human-approved follow-up.</p></div></div>
              ) : (
                <form onSubmit={submitLead} className="grid gap-3 sm:grid-cols-2">
                  <label className="text-xs text-slate-500">Your name<input value={lead.name} onChange={(event) => setLead({ ...lead, name: event.target.value })} className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/50 px-4 text-sm text-white outline-none focus:border-cyan-400/40" placeholder="Name" /></label>
                  <label className="text-xs text-slate-500">Business<input value={lead.business} onChange={(event) => setLead({ ...lead, business: event.target.value })} className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/50 px-4 text-sm text-white outline-none focus:border-cyan-400/40" placeholder="Business name" /></label>
                  <label className="text-xs text-slate-500 sm:col-span-2">Email or phone<input required value={lead.contact} onChange={(event) => setLead({ ...lead, contact: event.target.value })} className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/50 px-4 text-sm text-white outline-none focus:border-cyan-400/40" placeholder="you@business.com or phone" /></label>
                  <input tabIndex="-1" autoComplete="off" value={lead.companyWebsite} onChange={(event) => setLead({ ...lead, companyWebsite: event.target.value })} className="hidden" aria-hidden="true" />
                  <button disabled={leadState === 'sending'} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-black disabled:opacity-60 sm:col-span-2">{leadState === 'sending' ? 'Sending…' : 'Send scrub + request plan'} <Send size={14}/></button>
                  {leadState === 'error' && <p className="text-xs text-rose-300 sm:col-span-2">The handoff did not save. Try again or use the offer link above.</p>}
                </form>
              )}
            </section>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
