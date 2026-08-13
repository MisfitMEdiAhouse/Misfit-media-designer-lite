import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const work = [
  ['ContextForge', 'Enterprise AI', 'Metadata-aware agent control, governance, human approval and decision memory.'],
  ['Home Efficiency Pros', 'Client deployment', 'Lead intake, booking, revival and growth-system work for a real operating business.'],
  ['NexGrid Energy', 'Energy', 'Customer-acquisition and energy-resilience product work.'],
  ['Misfit Equipment Network', 'Marketplace', 'Heavy-equipment rental and network product architecture.'],
  ['Weber Junk Rescue', 'Local services', 'Mobile-first quote, intake, deposit and booking flow.'],
  ['Off-Grid Water', 'Digital commerce', 'Property test, calculators, paid guides and checkout flow.'],
  ['IALS Turbine Logistics', 'Aviation', 'B2B inventory, RFQ and operations workflow work for a client business.'],
  ['GHOSBC OS', 'AI systems architecture', 'Symbolic runtime, safety gates, agent routing, audit and developer-runtime architecture.'],
];

export default function ProofPage() {
  const [links, setLinks] = useState({});
  useEffect(() => {
    fetch('/portfolio-core.json').then((r) => r.json()).then((rows) => setLinks(Object.fromEntries(rows.map((x) => [x.title, x.url])))).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-28">
        <section className="mx-auto max-w-7xl px-5 py-12">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300">MISFIT PROOF</div>
          <h1 className="mt-4 max-w-5xl font-display text-[clamp(3rem,10vw,6rem)] font-bold uppercase leading-[0.9] tracking-[-0.05em]">Open the work. Judge the build.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">Client deployments, live products, AI systems, competition work and technical architecture organized as inspectable proof.</p>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {work.map(([title, type, copy]) => (
              <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber-300">{type}</div>
                <h2 className="mt-3 font-display text-2xl font-bold">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">{copy}</p>
                {links[title] && <a href={links[title]} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex font-mono text-[11px] uppercase tracking-[0.14em] text-cyan-300">Open live work →</a>}
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
