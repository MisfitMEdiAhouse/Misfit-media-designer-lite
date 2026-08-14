import { useEffect, useState } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const capabilities = [
  ['Fast lead response', 'Give new leads a structured first response path instead of letting inquiries sit.'],
  ['Persistent follow-up', 'Keep conversations moving with organized follow-up and next-step logic.'],
  ['Qualification', 'Capture intent, context and useful lead information before the human handoff.'],
  ['Lead revival', 'Work old or inactive lead pools instead of treating them as dead data.'],
  ['Conversation operations', 'Centralize messaging, outcomes, assignments and operational context around the lead.'],
  ['Booking + revenue workflow', 'Move qualified conversations toward appointments, deals and measurable business outcomes.'],
];

export default function MisfitAIV2() {
  const [checkout, setCheckout] = useState('');

  useEffect(() => {
    fetch('/offers.json')
      .then((r) => r.json())
      .then((data) => setCheckout(data.lead_engine || ''))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-28">
        <section className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300">MISFIT MEDIAHOUSE PRODUCT</div>
          <h1 className="mt-5 max-w-6xl font-display text-[clamp(3.4rem,11vw,8rem)] font-bold uppercase leading-[0.82] tracking-[-0.055em]">
            MISFIT AI <span className="text-cyan-300">V2</span>
          </h1>
          <p className="mt-7 max-w-3xl text-xl leading-9 text-slate-300">
            An AI lead engine built to turn more inquiries, conversations and existing lead data into qualified next steps, appointments and revenue.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            {checkout && (
              <a href={checkout} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-black">
                Start for $297/mo <ArrowRight size={14} />
              </a>
            )}
            <a href="https://ai.misfitmediahouse.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-white">
              Open live product <ExternalLink size={14} />
            </a>
          </div>
        </section>

        <section className="border-y border-white/5 bg-white/[0.02]">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-[0.85fr_1.15fr]">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.25em] text-amber-300">THE BUSINESS PROBLEM</div>
              <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-tight">Most leads do not need more software. They need a better response system.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {capabilities.map(([title, copy]) => (
                <article key={title} className="rounded-2xl border border-white/10 bg-black/40 p-5">
                  <h3 className="font-display text-xl font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="grid gap-6 lg:grid-cols-3">
            <article className="rounded-3xl border border-cyan-400/30 bg-cyan-400/[0.06] p-7 lg:col-span-2">
              <div className="font-mono text-xs uppercase tracking-[0.22em] text-cyan-300">PRODUCT + PORTFOLIO</div>
              <h2 className="mt-4 font-display text-4xl font-bold uppercase">Built by Misfit Mediahouse. Sold by Misfit Mediahouse.</h2>
              <p className="mt-5 max-w-3xl leading-7 text-slate-300">
                Misfit AI V2 is both a commercial product and inspectable proof of the systems work behind Misfit Mediahouse: lead operations, messaging workflows, AI-assisted conversations, booking logic, revenue operations and business software architecture.
              </p>
              <a href="/proof" className="mt-7 inline-flex font-mono text-xs uppercase tracking-[0.15em] text-cyan-300">See the full portfolio →</a>
            </article>

            <article className="rounded-3xl border border-white/10 bg-white/[0.025] p-7">
              <div className="font-mono text-xs uppercase tracking-[0.22em] text-amber-300">START HERE</div>
              <div className="mt-4 font-display text-5xl font-bold">$297<span className="text-xl text-slate-400">/mo</span></div>
              <p className="mt-4 text-sm leading-6 text-slate-400">Misfit AI V2 — AI Lead Engine.</p>
              {checkout && (
                <a href={checkout} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-black">
                  Buy through Misfit <ArrowRight size={14} />
                </a>
              )}
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
