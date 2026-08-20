import { Activity, Gauge, ShoppingBag, Sparkles } from 'lucide-react';
import BusinessScrubSearch from './BusinessScrubSearch.jsx';

const scanSignals = [
  [ShoppingBag, 'Storefront'],
  [Gauge, 'Conversion'],
  [Activity, 'Site health'],
  [Sparkles, 'AI readiness'],
];

export default function RevenueHero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pb-8 pt-24 sm:pt-28">
      <div className="absolute inset-0 grid-bg opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_26%,rgba(0,229,255,.15),transparent_35%),radial-gradient(circle_at_85%_90%,rgba(217,70,239,.08),transparent_30%)]" />
      <div className="relative mx-auto w-full max-w-6xl px-5 text-center">
        <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-300 sm:text-xs">
          Shopify store + business health scanner
        </div>
        <h1 className="mx-auto mt-5 max-w-5xl font-display text-[clamp(2.75rem,9vw,6.8rem)] font-bold uppercase leading-[0.86] tracking-[-0.055em]">
          Enter your site.
          <span className="block text-cyan-300">Find what is costing you sales.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-6 text-slate-400 sm:text-lg sm:leading-8">
          Misfit reads the public surface, scores the leaks, and gives you the next fixes—whether you run a Shopify store or a service business.
        </p>
        <BusinessScrubSearch />
        <div className="mx-auto mt-7 grid max-w-2xl grid-cols-2 gap-2 sm:flex sm:justify-center sm:gap-3">
          {scanSignals.map(([Icon, label]) => (
            <div key={label} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.1em] text-slate-500">
              <Icon size={13} className="text-cyan-300/80" aria-hidden="true" /> {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
