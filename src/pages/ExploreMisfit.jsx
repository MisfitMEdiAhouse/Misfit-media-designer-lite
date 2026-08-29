import {
  ArrowUpRight,
  BrainCircuit,
  Cloud,
  Cpu,
  FlaskConical,
  LockKeyhole,
  Network,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';

const families = [
  {
    id: 'cloud',
    icon: Cloud,
    name: 'Misfit Cloud',
    label: 'Protected control plane',
    copy: 'The owner-facing home for canonical assets, runtime state, health, approvals, fulfillment, telemetry, and recovery.',
    href: '/command',
    action: 'Owner access',
    tone: 'cyan',
  },
  {
    id: 'engines',
    icon: Cpu,
    name: 'Misfit Engines',
    label: 'Public revenue tools',
    copy: 'Scanners, websites, lead systems, machine products, commerce surfaces, and custom software that do a defined job.',
    href: '/products',
    action: 'Open the engines',
    tone: 'amber',
  },
  {
    id: 'governance',
    icon: ShieldCheck,
    name: 'Misfit Governance',
    label: 'Public-safe decision layer',
    copy: 'Trust audits, dependency checks, human gates, and bounded ALLOW / REVIEW / BLOCK decisions around consequential agent actions.',
    href: '/agents#governance',
    action: 'See governance',
    tone: 'emerald',
  },
  {
    id: 'ai2ai',
    icon: Network,
    name: 'Misfit AI ↔ AI',
    label: 'Machine-facing channels',
    copy: 'A2A, MCP, UCP, agent-readable maps, catalog discovery, and truthful checkout handoffs for other machines.',
    href: '/agents',
    action: 'Open AI-to-AI',
    tone: 'cyan',
  },
  {
    id: 'frontier',
    icon: FlaskConical,
    name: 'Misfit Frontier',
    label: 'Proof + research maturity map',
    copy: 'Machine reconsideration, Identity Signal, GHX/glyph compression, cyber-physical safety, NeuroMotion, safe learning, and biohybrid research—each labeled by what is live, proven, building, or still research.',
    href: '/frontier',
    action: 'Enter the proving ground',
    tone: 'fuchsia',
  },
  {
    id: 'brain',
    icon: BrainCircuit,
    name: 'GHOSBC OS · API Brain',
    label: 'Private cognitive core',
    copy: 'The protected reasoning and policy kernel behind Misfit-controlled systems. Outside agents receive sanitized decisions—not raw prompts, secrets, policy tables, or reconstruction material.',
    href: '/agents#private-core',
    action: 'View the boundary',
    tone: 'fuchsia',
  },
];

const toneClasses = {
  cyan: 'border-cyan-400/20 bg-cyan-400/[0.035] text-cyan-300 hover:border-cyan-400/45',
  amber: 'border-amber-400/20 bg-amber-400/[0.035] text-amber-300 hover:border-amber-400/45',
  emerald: 'border-emerald-400/20 bg-emerald-400/[0.035] text-emerald-300 hover:border-emerald-400/45',
  fuchsia: 'border-fuchsia-400/20 bg-fuchsia-400/[0.035] text-fuchsia-300 hover:border-fuchsia-400/45',
};

const revenueRail = [
  ['Acquire', 'Free Business + Shopify scanners', '/', 'Turn a public website into a scored, prioritized opportunity.'],
  ['Productize', 'Machine products + focused tools', '/products', 'Sell repeatable diagnostics, change memory, QuoteLink, and software instead of reinventing delivery.'],
  ['Activate', 'AI system + website build', '/agency', 'Install the customer-facing system and connect the working revenue path.'],
  ['Operate', 'Managed growth + governed automation', '/agency', 'Keep the system improving while approvals protect consequential actions.'],
];

export default function ExploreMisfit() {
  useEffect(() => {
    document.title = 'Explore Misfit | Cloud, Engines, Governance + AI-to-AI';
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-24">
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,.15),transparent_38%),radial-gradient(circle_at_85%_75%,rgba(217,70,239,.1),transparent_28%)]" />
          <div className="relative mx-auto max-w-7xl px-5 py-20 text-center sm:py-28">
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-300 sm:text-xs">Explore Misfit</div>
            <h1 className="mx-auto mt-6 max-w-6xl font-display text-[clamp(3.4rem,10vw,8.2rem)] font-bold uppercase leading-[0.8] tracking-[-0.065em]">One house.<span className="block text-cyan-300">Every engine has a job.</span></h1>
            <p className="mx-auto mt-7 max-w-3xl text-base leading-7 text-slate-400 sm:text-xl sm:leading-8">The public sees a clean set of products and outcomes. Misfit Cloud runs the estate. Misfit Governance controls risk. AI-to-AI channels distribute the work. The GHOSBC core stays sealed.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-black sm:px-7">Scan a business <ScanSearch size={14} /></Link>
              <Link to="/products" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-slate-200 sm:px-7">Browse products <ArrowUpRight size={14} /></Link>
              <Link to="/frontier" className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/25 bg-fuchsia-300/[.04] px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-fuchsia-200 sm:px-7">Frontier + proving ground <FlaskConical size={14}/></Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            {families.map(({ id, icon: Icon, name, label, copy, href, action, tone }) => (
              <article id={id} key={name} className={`group flex min-h-[315px] scroll-mt-24 flex-col rounded-[1.75rem] border p-6 transition ${toneClasses[tone]} xl:col-span-2`}>
                <div className="flex items-start justify-between gap-4"><Icon size={23} /><span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.14em] opacity-70">{label}</span></div>
                <h2 className="mt-8 font-display text-3xl font-bold text-white sm:text-4xl">{name}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-400">{copy}</p>
                <Link to={href} className="mt-auto inline-flex items-center gap-2 pt-7 font-mono text-[10px] font-bold uppercase tracking-[0.13em]">{action} <ArrowUpRight size={13} /></Link>
              </article>
            ))}
          </div>
        </section>

        <section id="operations" className="border-y border-white/10 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300">Misfit protocol + operations rail</div>
                <h2 className="mt-5 font-display text-5xl font-bold uppercase leading-[0.88] tracking-[-0.04em] sm:text-7xl">Discover. Decide. Deliver. Remember.</h2>
                <p className="mt-6 max-w-xl text-base leading-8 text-slate-400">Public machines discover bounded contracts. Governance evaluates risk. Humans approve consequential work. Fulfillment and evidence land in durable systems—not a temporary chat feed.</p>
              </div>
              <div className="grid gap-3">
                {[[Sparkles, '01 · Discover', 'Scanners, agent cards, machine catalogs, and public business surfaces create qualified demand.'],[ShieldCheck, '02 · Decide', 'Misfit Governance applies privacy boundaries, risk classes, human gates, and advisory decisions.'],[Workflow, '03 · Deliver', 'The correct engine performs the approved job through the existing site, API, software, or agency rail.'],[LockKeyhole, '04 · Remember safely', 'Misfit Cloud keeps canonical state and evidence while protected GHOSBC material remains private.']].map(([Icon, title, copy]) => (
                  <div key={title} className="grid grid-cols-[auto_1fr] gap-4 rounded-2xl border border-white/10 bg-black/40 p-5"><div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-2.5 text-cyan-300"><Icon size={19} /></div><div><h3 className="font-display text-xl font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{copy}</p></div></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-amber-300">Revenue rail</div>
          <div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><h2 className="max-w-4xl font-display text-5xl font-bold uppercase leading-[0.88] tracking-[-0.04em] sm:text-7xl">One front door. Multiple ways to earn.</h2><p className="max-w-md text-sm leading-7 text-slate-500">The scanner acquires. Products monetize repeatable work. The agency activates larger systems. Governance keeps higher-risk automation inside a controlled rail.</p></div>
          <div className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {revenueRail.map(([stage, name, href, copy]) => <Link key={stage} to={href} className="group flex min-h-[250px] flex-col rounded-3xl border border-white/10 bg-white/[0.025] p-6 transition hover:border-cyan-400/35"><div className="font-mono text-[9px] uppercase tracking-[0.16em] text-cyan-300">{stage}</div><h3 className="mt-5 font-display text-2xl font-bold">{name}</h3><p className="mt-4 text-sm leading-6 text-slate-500">{copy}</p><div className="mt-auto inline-flex items-center gap-2 pt-6 font-mono text-[9px] uppercase tracking-[0.13em] text-slate-300">Open rail <ArrowUpRight size={12} /></div></Link>)}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
