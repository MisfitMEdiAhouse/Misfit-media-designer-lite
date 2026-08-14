import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const offers = [
  ['Website + AI Launch', '$1,500 one-time', 'website_ai_launch', 'Launch a conversion-focused site with AI lead capture and follow-up.'],
  ['Misfit AI V2 — AI Lead Engine', '$297/mo', 'lead_engine', 'Misfit Mediahouse\'s flagship AI revenue product for lead response, follow-up, qualification, revival, conversations and booking.'],
  ['Managed Growth', '$997/mo', 'managed_growth', 'Hands-on growth operations layered around the systems, follow-up and conversion work.'],
];

export default function RevenueOffers() {
  const [links, setLinks] = useState({});
  useEffect(() => {
    fetch('/offers.json').then((r) => r.json()).then(setLinks).catch(() => {});
  }, []);

  return (
    <section id="offers" className="border-t border-white/5 py-16">
      <div className="mx-auto max-w-7xl px-5">
        <div className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-300">THREE WAYS TO START</div>
        <h2 className="mt-4 font-display text-4xl sm:text-6xl font-bold uppercase">Buy the outcome you need.</h2>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {offers.map(([name, price, key, copy]) => (
            <article key={name} className="rounded-2xl border border-white/10 bg-white/[0.025] p-7">
              <h3 className="font-display text-2xl font-bold">{name}</h3>
              <div className="mt-2 font-mono text-xs uppercase tracking-[0.12em] text-cyan-300">{price}</div>
              <p className="mt-4 text-sm leading-6 text-slate-400">{copy}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {links[key] && <a href={links[key]} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-black">Start Here <ArrowRight size={13}/></a>}
                {key === 'lead_engine' && <a href="/misfit-ai-v2" className="inline-flex rounded-full border border-white/15 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] text-white">Product details →</a>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
