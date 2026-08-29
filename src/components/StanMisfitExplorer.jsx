import { Activity, ArrowUpRight, BrainCircuit, ChevronDown, Code2, ExternalLink, FlaskConical, Grid2X2, Radar, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const groups = [
  {
    title: 'AI + software',
    items: [
      ['/identity-signal', 'Identity Signal', 'Public-safe cognitive personalization proof'],
      ['/misfit-ai-v2', 'Misfit AI V2', 'AI revenue software'],
      ['/enterprise-ai', 'Enterprise AI', 'Enterprise agent + automation work'],
      ['https://contextforge-datahub-app.vercel.app/', 'ContextForge', 'Metadata-aware code + change context'],
      ['/quotelink', 'Misfit QuoteLink', 'Mobile quote + conversion tool'],
      ['/rig-radar', 'Misfit Rig Radar', 'Automotive + overland utility suite'],
      ['https://misfit-equipment-network.vercel.app/', 'Iron Network', 'Equipment rental marketplace'],
    ],
  },
  {
    title: 'Governance + agents',
    items: [
      ['/agent-evaluation-lab', 'Agent Evaluation Lab', 'Raw vs governed agent testing'],
      ['/agentic-governed-fleet', 'Governed Agent Fleet', 'Bounded agent execution'],
      ['/agents', 'Agent Control Plane', 'A2A + MCP + machine surfaces'],
      ['/a2a-agent-audit', 'A2A Trust Audit', 'Agent-card trust inspection'],
      ['/shopify-ai-audit', 'Shopify Agentic Audit', 'Commerce + agent readiness'],
      ['/agent-provider-scorecard', 'Provider Scorecard', 'Machine-provider evidence + ranking'],
    ],
  },
  {
    title: 'Portfolio + proof',
    items: [
      ['/frontier', 'Frontier Technology Map', 'Proof, building + research maturity map'],
      ['/portfolio', 'Public Portfolio', 'Live builds + proof cases'],
      ['/portfolio/ials-turbine-command', 'IALS Turbine Command', 'Aerospace operating system'],
      ['/competitions', 'Competition Lab', 'Bounties, hackathons + products'],
      ['/portfolio/golden-essence', 'Golden Essence', 'Productized mobile service build'],
      ['/tyler-ward', 'Tyler Ward Contractor', 'Mobile contractor lead system'],
      ['https://misfit-media-house-off-grid-water.vercel.app/', 'Off-Grid Water', 'Calculators + digital commerce'],
    ],
  },
  {
    title: 'Commerce + growth',
    items: [
      ['https://www.coffeeandajoint.co/', 'Coffee & A Joint', 'DTC commerce + affiliate system'],
      ['https://www.homeefficiencypros.com/', 'Home Efficiency Pros', 'Dealer lead + booking system'],
      ['https://nexgridenergy.net/', 'NexGrid Energy', 'Energy customer acquisition'],
      ['https://weber-junk-rescue-v9.vercel.app/', 'Weber Junk Rescue', 'Local-service conversion build'],
      ['/', 'Business Health Scanner', 'Public storefront + AI-readiness diagnostic'],
      ['/agency', 'Misfit Agency', 'Custom builds + managed growth'],
    ],
  },
  {
    title: 'Explore + work with Misfit',
    items: [
      ['/explore', 'Explore Misfit', 'Cloud, engines, governance + AI-to-AI'],
      ['/products', 'Products', 'Public tools + machine products'],
      ['/operator', 'Hire + Partner', 'Bring Misfit into a real problem'],
      ['/field-notes', 'Field Notes', 'Build notes + public thinking'],
      ['/creator-commerce', 'Creator Commerce', 'Creator + affiliate commerce systems'],
    ],
  },
];

const egnytePicks = [
  ['/identity-signal', 'Identity Signal', 'PROOF', 'Personalization without changing authority'],
  ['/agentic-governed-fleet', 'Governed Agent Fleet', 'LIVE', 'Hands-on consequence / authority test drive'],
  ['/agent-evaluation-lab', 'Agent Evaluation Lab', 'LIVE', 'Contracts, benchmarks + raw-vs-governed evidence'],
  ['/frontier', 'Frontier Technology Map', 'MIXED', 'Machine reconsideration, GHX/glyphs, robotics + ML maturity'],
];

function Destination({ href, label, note, onOpen }) {
  const external = href.startsWith('http');
  const className = 'group flex items-start justify-between gap-3 rounded-2xl border border-white/8 bg-black/30 p-3.5 text-left transition hover:border-cyan-300/30 hover:bg-white/[0.045]';
  const body = <><span><span className="block text-sm font-semibold text-white group-hover:text-cyan-200">{label}</span><span className="mt-1 block text-[11px] leading-5 text-slate-600">{note}</span></span>{external ? <ExternalLink size={13} className="mt-1 shrink-0 text-slate-700 group-hover:text-cyan-300"/> : <ArrowUpRight size={13} className="mt-1 shrink-0 text-slate-700 group-hover:text-cyan-300"/>}</>;
  if (external) return <a href={href} target="_blank" rel="noreferrer" onClick={onOpen} className={className}>{body}</a>;
  return <Link to={href} onClick={onOpen} className={className}>{body}</Link>;
}

export default function StanMisfitExplorer() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative border-t border-white/8 bg-[#05070a]/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-2.5 sm:px-5">
        <button type="button" onClick={() => setOpen((value) => !value)} className="inline-flex min-h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-slate-300 transition hover:border-cyan-300/30 hover:text-cyan-200" aria-expanded={open}><Grid2X2 size={13}/> Explore all Misfit <ChevronDown size={12} className={open ? 'rotate-180 transition' : 'transition'}/></button>
        <div className="flex items-center gap-2">
          <Link to="/identity-signal" className="inline-flex min-h-9 items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/[0.07] px-3 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-cyan-200 transition hover:border-cyan-200/60 hover:text-white"><BrainCircuit size={13}/> Identity Signal <span className="hidden sm:inline">· proof</span></Link>
          <Link to="/signal" className="inline-flex min-h-9 items-center gap-2 rounded-full border border-fuchsia-300/30 bg-[linear-gradient(90deg,rgba(34,211,238,.1),rgba(217,70,239,.13))] px-3 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-fuchsia-200 transition hover:border-fuchsia-200/60 hover:text-white"><Activity size={13}/> Misfit Trader <span className="hidden sm:inline">· live</span></Link>
          <Link to="/portfolio" className="hidden min-h-9 items-center gap-2 rounded-full border border-white/10 px-3 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500 hover:text-white sm:inline-flex">Portfolio <ArrowUpRight size={12}/></Link>
        </div>
      </div>

      {open && (
        <div className="absolute inset-x-0 top-full z-[70] border-y border-cyan-300/15 bg-[#030507]/[0.985] shadow-2xl shadow-cyan-950/30 backdrop-blur-2xl">
          <div className="mx-auto max-h-[calc(100svh-118px)] max-w-7xl overflow-y-auto px-4 py-5 sm:px-5 md:py-6">
            <div className="relative overflow-hidden rounded-3xl border border-fuchsia-300/20 bg-[radial-gradient(circle_at_80%_10%,rgba(217,70,239,.16),transparent_30%),radial-gradient(circle_at_10%_90%,rgba(34,211,238,.13),transparent_28%),rgba(255,255,255,.025)] p-5 md:p-6">
              <button type="button" onClick={() => setOpen(false)} className="absolute right-4 top-4 rounded-full border border-white/10 p-2 text-slate-500 hover:text-white" aria-label="Close Misfit explorer"><X size={15}/></button>
              <div className="grid gap-5 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
                <div><div className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-fuchsia-300"><Radar size={13}/> Featured rabbit hole</div><h2 className="mt-3 max-w-2xl font-display text-3xl font-bold leading-tight md:text-4xl">Misfit Trader is what happens when the same guarded-agent thinking touches markets.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Live market emotion, real candle data, plain-English pattern intelligence, autonomous paper portfolios and prediction-market signals. Real-money authority stays gated.</p><Link to="/signal" onClick={() => setOpen(false)} className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-fuchsia-300 px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-black">Open Misfit Trader <Activity size={14}/></Link></div>
                <div className="grid grid-cols-3 gap-2"><div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.04] p-4"><Code2 size={16} className="text-cyan-300"/><div className="mt-4 text-xs font-semibold">Context</div><div className="mt-1 text-[10px] leading-4 text-slate-600">Read the field before acting.</div></div><div className="rounded-2xl border border-fuchsia-300/15 bg-fuchsia-300/[0.04] p-4"><ShieldCheck size={16} className="text-fuchsia-300"/><div className="mt-4 text-xs font-semibold">Guardrails</div><div className="mt-1 text-[10px] leading-4 text-slate-600">Paper first. Authority bounded.</div></div><div className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.04] p-4"><BrainCircuit size={16} className="text-amber-300"/><div className="mt-4 text-xs font-semibold">Reasoning</div><div className="mt-1 text-[10px] leading-4 text-slate-600">Signal is evidence, not certainty.</div></div></div>
              </div>
            </div>

            <section className="mt-4 rounded-3xl border border-cyan-300/20 bg-cyan-300/[.025] p-4 md:p-5">
              <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.16em] text-cyan-300"><FlaskConical size={12}/> If you are an Egnyte engineer, start here</div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">{egnytePicks.map(([href,label,status,note]) => <Link key={href} to={href} onClick={() => setOpen(false)} className="rounded-2xl border border-white/8 bg-black/35 p-4 transition hover:border-cyan-300/30"><div className="flex items-center justify-between gap-2"><span className="text-sm font-semibold">{label}</span><span className="font-mono text-[8px] uppercase tracking-[.1em] text-emerald-300">{status}</span></div><p className="mt-2 text-[10px] leading-5 text-slate-600">{note}</p></Link>)}</div>
            </section>

            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{groups.map((group) => <section key={group.title} className="rounded-3xl border border-white/8 bg-white/[0.018] p-4"><div className="mb-3 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-cyan-300"><Sparkles size={11}/>{group.title}</div><div className="space-y-2">{group.items.map(([href,label,note]) => <Destination key={`${href}-${label}`} href={href} label={label} note={note} onOpen={() => setOpen(false)}/>)}</div></section>)}</div>

            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/8 bg-black/40 p-4"><img src="/neon-skull-rose.png" alt="" className="h-12 w-12 rounded-xl object-cover opacity-90"/><div><div className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-500">Misfit Mediahouse public surface</div><div className="mt-1 text-sm text-slate-300">Built in public. Kernel private. And yes — this whole operating estate was built from a phone.</div></div></div>
          </div>
        </div>
      )}
    </div>
  );
}
