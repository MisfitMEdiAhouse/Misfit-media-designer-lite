import { ArrowUpRight, BrainCircuit, GitCompareArrows, Network, Radar, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import MaturityBadge from '../components/MaturityBadge.jsx';

const proof = [
  {
    status: 'PROOF',
    icon: BrainCircuit,
    title: 'ContextForge',
    copy: 'Metadata-aware code and change context grounded in lineage, ownership, governance and usage instead of source text alone.',
    href: 'https://contextforge-datahub-app.vercel.app/',
    external: true,
  },
  {
    status: 'LIVE',
    icon: ShieldCheck,
    title: 'Governed Agent Fleet',
    copy: 'Change an agent action, authority, financial impact, sensitivity and reversibility; inspect the live governance decision and audit output.',
    href: '/agentic-governed-fleet',
  },
  {
    status: 'LIVE',
    icon: GitCompareArrows,
    title: 'Agent Evaluation Lab',
    copy: 'Raw-versus-governed evaluation, public-safe reports, benchmark contracts, A2A/MCP discovery and measurable evidence.',
    href: '/agent-evaluation-lab',
  },
  {
    status: 'PROOF',
    icon: Sparkles,
    title: 'Identity Signal',
    copy: 'Public-safe cognitive personalization that changes pacing, evidence depth and interaction structure without changing authority or safety policy.',
    href: '/identity-signal',
  },
  {
    status: 'LIVE',
    icon: Network,
    title: 'Provider Scorecard',
    copy: 'Discover, actively probe and rank public machine providers using contract health, latency and persisted evidence.',
    href: '/agent-provider-scorecard',
  },
  {
    status: 'RESEARCH',
    icon: Radar,
    title: 'Frontier Technology Map',
    copy: 'Machine reconsideration, GHX/glyph compression, cyber-physical safety, NeuroMotion, machine-learning architecture and biohybrid research with maturity boundaries attached.',
    href: '/frontier',
  },
];

export default function EnterpriseAI(){
  return <div className="min-h-screen bg-black text-white"><Navbar/><main className="pt-24">
    <section className="relative overflow-hidden border-b border-white/10"><div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(245,158,11,.14),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(34,211,238,.12),transparent_30%)]"/><div className="relative mx-auto max-w-7xl px-5 py-16 sm:py-24">
      <div className="flex flex-wrap items-center gap-3"><div className="font-mono text-xs uppercase tracking-[0.3em] text-amber-300">Enterprise AI · ContextForge + Governance</div><MaturityBadge status="BETA"/></div>
      <h1 className="mt-5 max-w-6xl font-display text-5xl font-bold uppercase leading-[0.88] sm:text-7xl lg:text-8xl">Give agents context before important changes. Then govern what happens next.</h1>
      <p className="mt-7 max-w-4xl text-lg leading-8 text-slate-300">This is no longer a brochure page. The enterprise layer below links directly into the working proof surfaces: context grounding, action governance, provider evidence, personalization and raw-vs-governed evaluation. The broader integrated platform is still being hardened, so the page says exactly which pieces are live, proof, or research.</p>
      <div className="mt-8 flex flex-wrap gap-3"><Link to="/agentic-governed-fleet" className="rounded-full bg-cyan-300 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[.13em] text-black">Test governance</Link><Link to="/agent-evaluation-lab" className="rounded-full border border-white/15 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[.13em] text-slate-200">Open evidence lab</Link><Link to="/frontier" className="rounded-full border border-fuchsia-300/25 bg-fuchsia-300/[.04] px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[.13em] text-fuchsia-200">Explore frontier</Link></div>
    </div></section>

    <section className="mx-auto max-w-7xl px-5 py-14 sm:py-20"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{proof.map(({status,icon:Icon,title,copy,href,external}) => {
      const body = <><div className="flex items-start justify-between gap-3"><div className="rounded-xl border border-white/10 bg-black/45 p-2.5 text-cyan-300"><Icon size={19}/></div><MaturityBadge status={status}/></div><h2 className="mt-5 font-display text-3xl font-bold">{title}</h2><p className="mt-3 text-sm leading-7 text-slate-400">{copy}</p><div className="mt-auto inline-flex items-center gap-2 pt-6 font-mono text-[10px] uppercase tracking-[.12em] text-cyan-300">Inspect proof <ArrowUpRight size={13}/></div></>;
      const classes='flex min-h-[300px] flex-col rounded-3xl border border-white/10 bg-white/[.022] p-6 transition hover:border-cyan-300/30';
      return external ? <a key={title} href={href} target="_blank" rel="noreferrer" className={classes}>{body}</a> : <Link key={title} to={href} className={classes}>{body}</Link>;
    })}</div></section>

    <section className="border-y border-white/10 bg-white/[.018]"><div className="mx-auto max-w-7xl px-5 py-14 sm:py-20"><div className="font-mono text-[10px] uppercase tracking-[.2em] text-emerald-300">Operating principle</div><h2 className="mt-4 max-w-5xl font-display text-4xl font-bold uppercase leading-[.9] sm:text-6xl">Access is not the same thing as authorization to act.</h2><p className="mt-5 max-w-4xl text-base leading-8 text-slate-400">Enterprise systems already own identity, permissions and content boundaries. Misfit's work experiments one layer downstream: context, consequence, reversibility, human gates, runtime evidence and measurable before/after behavior. Protected GHOSBC internals remain behind public-safe contracts.</p></div></section>
  </main><Footer/></div>;
}
