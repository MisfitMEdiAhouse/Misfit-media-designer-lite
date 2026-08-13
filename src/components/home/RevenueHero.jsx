import { ArrowRight } from 'lucide-react';
import Reveal from '../Reveal.jsx';

const MISFIT_LOGO = '/misfit-logo.svg';

export default function RevenueHero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20">
      <div className="absolute inset-0 grid-bg opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,229,255,0.11),transparent_58%)]" />
      <div className="relative mx-auto max-w-7xl px-5">
        <div className="max-w-5xl">
          <Reveal>
            <img
              src={MISFIT_LOGO}
              alt="Misfit Mediahouse neon skull and rose logo"
              className="mb-6 w-40 sm:w-48 drop-shadow-[0_0_38px_rgba(0,229,255,0.32)]"
            />
            <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-cyan-300">MISFIT AI REVENUE SYSTEMS</div>
            <h1 className="mt-5 font-display text-[clamp(3rem,11vw,6.8rem)] font-bold uppercase leading-[0.88] tracking-[-0.055em]">
              Stop losing leads.
              <span className="block text-cyan-400">Turn more attention into revenue.</span>
            </h1>
            <p className="mt-7 max-w-3xl text-lg sm:text-xl leading-8 text-slate-300">
              Misfit Mediahouse builds AI revenue systems for service businesses that need faster follow-up, old-lead revival, better booking, stronger websites, and clear attribution from lead to money.
            </p>
          </Reveal>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href="#request-demo" className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-black glow-cyan">
              Find My Revenue Leaks <ArrowRight size={15}/>
            </a>
            <a href="/proof" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3.5 font-mono text-xs uppercase tracking-[0.14em]">
              See Live Results <ArrowRight size={15}/>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
