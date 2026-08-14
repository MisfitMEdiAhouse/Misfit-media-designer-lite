import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const QUOTELINK_URL = '/quotelink';

const offers = [
  ['Misfit QuoteLink — Instant Lead Page', '$49 one-time', 'quotelink', 'INSTANT PRODUCT', 'A focused mobile quote/call/text lead page for local service businesses. Enter the business details, pay once, and the live hosted page plus QR code is generated automatically after confirmed checkout.'],
  ['Website + AI Launch', '$1,500 one-time', 'website_ai_launch', 'SERVICE', 'A deployment package for a conversion-focused site with Misfit AI-powered lead capture and follow-up where appropriate.'],
  ['Misfit AI V2 — AI Lead Engine', '$297/mo', 'lead_engine', 'FLAGSHIP PRODUCT', 'Misfit Mediahouse\'s canonical AI revenue product for lead response, follow-up, qualification, revival, conversations and booking.'],
  ['Managed Growth', '$997/mo', 'managed_growth', 'SERVICE', 'Hands-on implementation, optimization and growth operations around the systems and conversion stack.'],
];

export default function RevenueOffers() {
  const [links, setLinks] = useState({});
  useEffect(() => {
    fetch('/offers.json').then((r) => r.json()).then(setLinks).catch(() => {});
  }, []);

  return (
    <section id="offers" className="border-t border-white/5 py-16">
      <div className="mx-auto max-w-7xl px-5">
        <div className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-300">PRODUCTS + SERVICES</div>
        <h2 className="mt-4 font-display text-4xl sm:text-6xl font-bold uppercase">A fast first step. A full revenue stack when you need it.</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {offers.map(([name, price, key, type, copy]) => {
            const href = key === 'quotelink' ? QUOTELINK_URL : links[key];
            return (
              <article key={name} className="rounded-2xl border border-white/10 bg-white/[0.025] p-7">
                <div className={`font-mono text-[10px] uppercase tracking-[0.16em] ${type === 'FLAGSHIP PRODUCT' || type === 'INSTANT PRODUCT' ? 'text-cyan-300' : 'text-amber-300'}`}>{type}</div>
                <h3 className="mt-3 font-display text-2xl font-bold">{name}</h3>
                <div className="mt-2 font-mono text-xs uppercase tracking-[0.12em] text-cyan-300">{price}</div>
                <p className="mt-4 text-sm leading-6 text-slate-400">{copy}</p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {href && <a href={href} target={key === 'quotelink' ? undefined : '_blank'} rel={key === 'quotelink' ? undefined : 'noopener noreferrer'} className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-black">{key === 'quotelink' ? 'Build Mine' : 'Start Here'} <ArrowRight size={13}/></a>}
                  {key === 'lead_engine' && <a href="/misfit-ai-v2" className="inline-flex rounded-full border border-white/15 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] text-white">Product details →</a>}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
