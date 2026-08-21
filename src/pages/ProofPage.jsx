import { ArrowRight, ArrowUpRight, CheckCircle2, Layers3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

export default function ProofPage() {
  const [work, setWork] = useState([]);

  useEffect(() => {
    document.title = 'Portfolio | Misfit Mediahouse';
    fetch('/portfolio-core.json').then((response) => response.json()).then(setWork).catch(() => setWork([]));
  }, []);

  const featured = work.find((item) => item.featured);
  const standardWork = work.filter((item) => !item.featured);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-28">
        <section className="mx-auto max-w-7xl px-5 py-12">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300">Public proof portfolio</div>
          <h1 className="mt-4 max-w-6xl font-display text-[clamp(3rem,10vw,7rem)] font-bold uppercase leading-[0.86] tracking-[-0.055em]">Open the system. Inspect the proof. Test the builder.</h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-400">Live builds are only the first layer. Proof cases expose the operational problem, architecture, numbers, boundaries and disciplines behind the surface—without leaking customer records, credentials or protected IP.</p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.05] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.13em] text-emerald-300">
            <CheckCircle2 size={13} /> {work.length || '—'} public builds · deduplicated
          </div>

          {featured && (
            <article className="relative mt-10 overflow-hidden rounded-[2rem] border border-cyan-400/30 bg-[radial-gradient(circle_at_80%_15%,rgba(0,229,255,.18),transparent_35%),radial-gradient(circle_at_10%_90%,rgba(245,158,11,.11),transparent_30%),rgba(255,255,255,.025)] p-7 sm:p-10">
              <div className="absolute right-5 top-5 hidden rounded-full border border-emerald-400/20 bg-black/40 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-emerald-300 sm:block">Featured proof case</div>
              <div className="flex items-center gap-3 text-cyan-300"><Layers3 size={20} /><span className="font-mono text-[9px] uppercase tracking-[0.16em]">{featured.type}</span></div>
              <h2 className="mt-5 max-w-5xl font-display text-4xl font-bold uppercase leading-[0.92] sm:text-6xl">{featured.title}: the software behind the site.</h2>
              <p className="mt-5 max-w-4xl text-base leading-8 text-slate-300">{featured.summary}</p>
              <div className="mt-7 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {(featured.metrics || []).map((metric) => (
                  <div key={metric} className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-300">{metric}</div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={featured.url} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-cyan-300 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-black hover:bg-white">
                  Open the proof case <ArrowRight size={13} />
                </Link>
                <Link to="/operator#challenge" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/15 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-slate-300 hover:border-amber-300/50 hover:text-amber-300">
                  Put Misfit to the test <ArrowUpRight size={13} />
                </Link>
              </div>
            </article>
          )}

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {standardWork.map((item) => (
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
