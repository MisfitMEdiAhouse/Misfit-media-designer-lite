import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

export default function ProofPage() {
  const [work, setWork] = useState([]);

  useEffect(() => {
    document.title = 'Portfolio | Misfit Mediahouse';
    fetch('/portfolio-core.json').then((response) => response.json()).then(setWork).catch(() => setWork([]));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-28">
        <section className="mx-auto max-w-7xl px-5 py-12">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300">Public portfolio</div>
          <h1 className="mt-4 max-w-5xl font-display text-[clamp(3rem,10vw,6rem)] font-bold uppercase leading-[0.9] tracking-[-0.05em]">One asset. One card. Open the work.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">Canonical live builds only. Source repos, Base44 backups, Vercel revisions, and owner-only systems are intentionally not repeated here.</p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.05] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.13em] text-emerald-300">
            <CheckCircle2 size={13} /> {work.length || '—'} public builds · deduplicated
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {work.map((item) => (
              <article key={item.id} className="flex min-h-[285px] flex-col rounded-3xl border border-white/10 bg-white/[0.025] p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber-300">{item.type}</div>
                  <div className="rounded-full border border-emerald-400/20 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-emerald-300">Live</div>
                </div>
                <h2 className="mt-4 font-display text-2xl font-bold">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">{item.summary}</p>
                <a
                  href={item.url}
                  target={item.url.startsWith('http') ? '_blank' : undefined}
                  rel={item.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="mt-auto inline-flex items-center gap-2 pt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-cyan-300"
                >
                  Open live work <ArrowUpRight size={13} />
                </a>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
