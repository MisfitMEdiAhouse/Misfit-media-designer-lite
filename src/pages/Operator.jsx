import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  Code2,
  Handshake,
  Network,
  Radar,
  Send,
  ShieldCheck,
  Sparkles,
  Store,
  Workflow,
  Wrench,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';

const LEAD_ENDPOINT = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/lead-capture';

const workingTracks = [
  {
    key: 'embedded',
    icon: BriefcaseBusiness,
    label: 'Hire / embed',
    title: 'Put the builder inside the company.',
    copy: 'Full-stack product, AI systems, agent infrastructure, migrations, growth engineering, and the messy work between departments.',
    action: 'Discuss a role',
  },
  {
    key: 'fractional',
    icon: Wrench,
    label: 'Contract / fractional',
    title: 'Put Misfit on one valuable problem.',
    copy: 'A broken funnel, stalled product, old-lead pile, disconnected stack, failed migration, or hard prototype with a measurable finish line.',
    action: 'Scope a mission',
  },
  {
    key: 'partner',
    icon: Handshake,
    label: 'Partner / dealer',
    title: 'Bring the offer. Misfit builds the engine.',
    copy: 'Dealer programs, fulfillment alliances, referrals, white-label systems, revenue share, product distribution, and market-entry partnerships.',
    action: 'Open a partnership',
  },
  {
    key: 'client',
    icon: Store,
    label: 'Client / agency',
    title: 'Scan the business. Fix the leaks.',
    copy: 'Websites, commerce, AI intake, lead revival, booking, conversion, custom software, and ongoing growth operations under one accountable roof.',
    action: 'Bring a business',
  },
];

const proof = [
  {
    icon: Radar,
    label: 'Acquisition engine',
    name: 'Misfit Business Health Scanner',
    copy: 'A live public-signal diagnostic that turns a website into prioritized revenue leaks and a qualified next move.',
    href: '/',
  },
  {
    icon: Bot,
    label: 'AI revenue software',
    name: 'Misfit AI V2',
    copy: 'Lead intake, response, qualification, follow-up, revival, booking, and conversation operations.',
    href: '/misfit-ai-v2',
  },
  {
    icon: Network,
    label: 'Marketplace system',
    name: 'Iron Network',
    copy: 'Equipment inventory, rental requests, owner connections, checkout, evidence, and settlement workflows.',
    href: 'https://misfit-equipment-network.vercel.app/',
  },
  {
    icon: Store,
    label: 'Direct commerce',
    name: 'Coffee & A Joint',
    copy: 'A branded storefront with live products, checkout, fulfillment paths, and campaign attribution.',
    href: 'https://www.coffeeandajoint.co/',
  },
  {
    icon: Code2,
    label: 'Enterprise AI',
    name: 'ContextForge',
    copy: 'Metadata-aware code generation and change governance grounded in DataHub context.',
    href: 'https://contextforge-datahub-app.vercel.app/',
  },
  {
    icon: ShieldCheck,
    label: 'Governed agent stack',
    name: 'Misfit AI-to-AI + Governance',
    copy: 'Public A2A, MCP, UCP, agent discovery, trust audits, and bounded advisory action checks around a sealed private core.',
    href: '/agents',
  },
];

function cleanParam(value, limit = 180) {
  return String(value || '').trim().slice(0, limit);
}

function normalizeWebsite(value) {
  const cleaned = cleanParam(value, 240);
  if (!cleaned) return '';
  return cleaned.replace(/^https?:\/\//i, '').replace(/\/$/, '');
}

function outbound(href) {
  return /^https?:\/\//i.test(href);
}

export default function Operator() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const company = useMemo(() => cleanParam(params.get('company'), 100), [params]);
  const sharedSite = useMemo(() => normalizeWebsite(params.get('site')), [params]);
  const sharedChallenge = useMemo(() => cleanParam(params.get('challenge'), 360), [params]);
  const sharedTrack = useMemo(() => cleanParam(params.get('track'), 40), [params]);
  const initialTrack = workingTracks.some((item) => item.key === sharedTrack) ? sharedTrack : 'fractional';

  const [scanSite, setScanSite] = useState(sharedSite);
  const [form, setForm] = useState({
    name: '',
    business: company,
    contact: '',
    website: sharedSite,
    track: initialTrack,
    challenge: sharedChallenge,
    companyWebsite: '',
  });
  const [submitState, setSubmitState] = useState('');

  useEffect(() => {
    document.title = company ? `${company} × Misfit | Live Build Challenge` : 'Hire, Partner or Build with Misfit';
  }, [company]);

  const chooseTrack = (track) => {
    setForm((current) => ({ ...current, track }));
    window.setTimeout(() => document.getElementById('challenge')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
  };

  const scan = (event) => {
    event.preventDefault();
    const site = normalizeWebsite(scanSite);
    if (!site) return;
    navigate(`/scrub?site=${encodeURIComponent(site)}`);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (submitState === 'sending') return;
    setSubmitState('sending');
    const selected = workingTracks.find((item) => item.key === form.track);
    const website = normalizeWebsite(form.website);
    try {
      const response = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          businessName: form.business || company || 'Operator inquiry',
          websiteUrl: website ? `https://${website}` : '',
          contact: form.contact,
          companyWebsite: form.companyWebsite,
          requestedService: `operator_${form.track}`,
          source: 'operator_proof_funnel',
          landingPage: `${window.location.pathname}${window.location.search}`,
          message: `${selected?.label || form.track}. Challenge: ${form.challenge || sharedChallenge || 'Open-ended live build challenge'}`,
        }),
      });
      if (!response.ok) throw new Error('capture_failed');
      setSubmitState('sent');
    } catch {
      setSubmitState('error');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-20">
        <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 grid-bg opacity-25" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_18%,rgba(0,229,255,.18),transparent_35%),radial-gradient(circle_at_12%_82%,rgba(217,70,239,.12),transparent_30%)]" />
          <div className="relative mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl flex-col justify-center px-5 py-14 sm:py-20">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/[0.08] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-cyan-300 sm:text-[10px]">
                <Sparkles size={12} /> Proof-first operator
              </div>
              {company && (
                <div className="rounded-full border border-fuchsia-400/25 bg-fuchsia-400/[0.08] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-fuchsia-300 sm:text-[10px]">
                  Prepared for {company}
                </div>
              )}
            </div>

            <h1 className="mt-7 max-w-7xl font-display text-[clamp(3.35rem,10vw,8rem)] font-bold uppercase leading-[0.79] tracking-[-0.065em]">
              Don&apos;t read a résumé.
              <span className="block text-cyan-300">Put Misfit on the problem.</span>
            </h1>
            <p className="mt-7 max-w-3xl text-base leading-7 text-slate-300 sm:text-xl sm:leading-8">
              Full-stack products, AI revenue systems, agent infrastructure, commerce, migrations, and growth operations. Start with something real and judge the shipped result.
            </p>

            {sharedChallenge && (
              <div className="mt-6 max-w-3xl rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-4 sm:p-5">
                <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-amber-300">Proposed live challenge</div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{sharedChallenge}</p>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#challenge" className="inline-flex min-h-13 items-center gap-2 rounded-full bg-white px-6 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-black hover:bg-cyan-300">
                Give Misfit a live challenge <ArrowRight size={14} />
              </a>
              <Link to="/portfolio" className="inline-flex min-h-13 items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-slate-200 hover:border-cyan-300/50 hover:text-cyan-300">
                Open shipped work <ArrowUpRight size={14} />
              </Link>
            </div>

            <form onSubmit={scan} className="mt-9 flex max-w-3xl flex-col gap-2 rounded-3xl border border-white/15 bg-white/[0.055] p-2 sm:flex-row sm:rounded-full">
              <label htmlFor="operator-scan" className="sr-only">Company website to scan</label>
              <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                <Radar size={17} className="shrink-0 text-cyan-300" />
                <input
                  id="operator-scan"
                  value={scanSite}
                  onChange={(event) => setScanSite(event.target.value)}
                  placeholder={company ? `${company.toLowerCase().replace(/\s+/g, '')}.com` : 'company.com'}
                  inputMode="url"
                  autoCapitalize="none"
                  spellCheck="false"
                  className="min-h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-600"
                />
              </div>
              <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-black sm:rounded-full">
                Scan their public site <ArrowRight size={13} />
              </button>
            </form>
            <p className="mt-3 max-w-3xl text-[10px] leading-5 text-slate-600">Public signals only. No logins, mutations, checkout actions, or account access. The proof starts safely.</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fuchsia-300">Pick the relationship after the proof</div>
          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-5xl font-display text-5xl font-bold uppercase leading-[0.88] tracking-[-0.045em] sm:text-7xl">Employment is one rail. Business is the whole network.</h2>
            <p className="max-w-md text-sm leading-7 text-slate-500">No forced subscription and no vague title hunting. Choose the structure that best fits the problem and upside.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {workingTracks.map(({ key, icon: Icon, label, title, copy, action }) => (
              <article key={key} className={`flex min-h-[330px] flex-col rounded-3xl border p-6 transition ${form.track === key ? 'border-cyan-400/40 bg-cyan-400/[0.055]' : 'border-white/10 bg-white/[0.025]'}`}>
                <div className="flex items-center justify-between gap-3">
                  <Icon size={20} className="text-cyan-300" />
                  <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-slate-500">{label}</span>
                </div>
                <h3 className="mt-7 font-display text-2xl font-bold">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-500">{copy}</p>
                <button onClick={() => chooseTrack(key)} className="mt-auto inline-flex items-center gap-2 pt-7 text-left font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-cyan-300">
                  {action} <ArrowRight size={12} />
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
            <div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:items-start">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300">Working proof</div>
                <h2 className="mt-5 font-display text-5xl font-bold uppercase leading-[0.88] tracking-[-0.045em] sm:text-7xl">Products beat adjectives.</h2>
                <p className="mt-6 max-w-xl text-sm leading-7 text-slate-500">These are openable systems across acquisition, AI, marketplaces, commerce, enterprise tooling, and governed machine channels. The complete canonical portfolio stays deduplicated.</p>
                <Link to="/portfolio" className="mt-7 inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-cyan-300">Open the full portfolio <ArrowUpRight size={13} /></Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {proof.map(({ icon: Icon, label, name, copy, href }) => (
                  <a key={name} href={href} target={outbound(href) ? '_blank' : undefined} rel={outbound(href) ? 'noreferrer' : undefined} className="group flex min-h-[245px] flex-col rounded-3xl border border-white/10 bg-black/40 p-6 transition hover:border-cyan-400/35">
                    <div className="flex items-center justify-between gap-3"><Icon size={19} className="text-cyan-300" /><ArrowUpRight size={14} className="text-slate-700 group-hover:text-cyan-300" /></div>
                    <div className="mt-6 font-mono text-[8px] uppercase tracking-[0.15em] text-amber-300">{label}</div>
                    <h3 className="mt-3 font-display text-xl font-bold">{name}</h3>
                    <p className="mt-3 text-xs leading-6 text-slate-500">{copy}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-300">The proof protocol</div>
              <h2 className="mt-5 font-display text-5xl font-bold uppercase leading-[0.88] tracking-[-0.045em] sm:text-7xl">Bring the mess. Make the work visible.</h2>
              <div className="mt-9 grid gap-3">
                {[
                  [Workflow, '01 · Name the valuable problem', 'A real bottleneck, target, broken handoff, launch, migration, or revenue opportunity—not a made-up interview exercise.'],
                  [Code2, '02 · Set the boundary', 'Agree on public data, access, time box, success evidence, and the actions that require human approval.'],
                  [Sparkles, '03 · Ship inspectable proof', 'Prototype, diagnostic, repair plan, working flow, or deployed slice that the company can actually evaluate.'],
                  [Handshake, '04 · Choose the upside', 'Role, contract, fractional mission, client engagement, dealer agreement, partnership, or a clean no.'],
                ].map(([Icon, title, copy]) => (
                  <div key={title} className="grid grid-cols-[auto_1fr] gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                    <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/[0.08] p-2.5 text-cyan-300"><Icon size={18} /></div>
                    <div><h3 className="font-display text-lg font-semibold">{title}</h3><p className="mt-2 text-xs leading-6 text-slate-500">{copy}</p></div>
                  </div>
                ))}
              </div>
            </div>

            <section id="challenge" className="scroll-mt-24 rounded-[2rem] border border-cyan-400/25 bg-[radial-gradient(circle_at_top_right,rgba(0,229,255,.13),transparent_38%),rgba(255,255,255,.025)] p-6 sm:p-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.17em] text-cyan-300">Give Misfit the problem</div>
              <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">Skip the résumé pile. Start a real conversation.</h2>
              <p className="mt-3 text-sm leading-7 text-slate-500">This sends a qualified human handoff. Nothing is purchased, deployed, changed, or connected from this form.</p>

              {submitState === 'sent' ? (
                <div className="mt-8 rounded-3xl border border-emerald-400/25 bg-emerald-400/[0.06] p-6">
                  <CheckCircle2 className="text-emerald-300" />
                  <h3 className="mt-4 font-display text-2xl font-bold">Challenge received.</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Misfit has the relationship track, company context, and problem for a direct follow-up.</p>
                </div>
              ) : (
                <form onSubmit={submit} className="mt-7 grid gap-3 sm:grid-cols-2">
                  <label className="text-xs text-slate-500">Your name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/55 px-4 text-sm text-white outline-none focus:border-cyan-400/45" placeholder="Name" /></label>
                  <label className="text-xs text-slate-500">Company<input required value={form.business} onChange={(event) => setForm({ ...form, business: event.target.value })} className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/55 px-4 text-sm text-white outline-none focus:border-cyan-400/45" placeholder="Company" /></label>
                  <label className="text-xs text-slate-500">Email or phone<input required value={form.contact} onChange={(event) => setForm({ ...form, contact: event.target.value })} className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/55 px-4 text-sm text-white outline-none focus:border-cyan-400/45" placeholder="you@company.com" /></label>
                  <label className="text-xs text-slate-500">Company website<input value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/55 px-4 text-sm text-white outline-none focus:border-cyan-400/45" placeholder="company.com" inputMode="url" /></label>
                  <label className="text-xs text-slate-500 sm:col-span-2">Working relationship<select value={form.track} onChange={(event) => setForm({ ...form, track: event.target.value })} className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/55 px-4 text-sm text-white outline-none focus:border-cyan-400/45">{workingTracks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}</select></label>
                  <label className="text-xs text-slate-500 sm:col-span-2">What should Misfit solve or build?<textarea required value={form.challenge} onChange={(event) => setForm({ ...form, challenge: event.target.value })} className="mt-2 min-h-32 w-full resize-y rounded-xl border border-white/10 bg-black/55 p-4 text-sm leading-6 text-white outline-none focus:border-cyan-400/45" placeholder="Give us the bottleneck, target, broken system, or opportunity." /></label>
                  <input tabIndex="-1" autoComplete="off" value={form.companyWebsite} onChange={(event) => setForm({ ...form, companyWebsite: event.target.value })} className="hidden" aria-hidden="true" />
                  <button disabled={submitState === 'sending'} className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-white px-5 font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-black hover:bg-cyan-300 disabled:opacity-60 sm:col-span-2">
                    {submitState === 'sending' ? 'Sending…' : 'Send the live challenge'} {submitState === 'sending' ? <Workflow size={14} /> : <Send size={14} />}
                  </button>
                  {submitState === 'error' && <p role="alert" className="text-xs text-rose-300 sm:col-span-2">The handoff did not save. Try again or email misfitmediahouse@gmail.com.</p>}
                </form>
              )}
              <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5 font-mono text-[8px] uppercase tracking-[0.12em] text-slate-600">
                {['Proof before pitch', 'Human-approved access', 'No hidden actions', 'Measurable finish line'].map((item) => <span key={item} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1.5"><Check size={10} /> {item}</span>)}
              </div>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
