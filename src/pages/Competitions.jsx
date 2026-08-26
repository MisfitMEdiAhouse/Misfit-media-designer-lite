import { ArrowUpRight, BadgeDollarSign, CheckCircle2, Clock3, Trophy } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const competitions = [
  {
    name: 'All Things Agentic Hackathon',
    organizer: 'Google · Devpost',
    purse: '$180,000 cash prize pool',
    status: 'Registered · building',
    deadline: 'Aug 31, 2026 · 6:00 PM MDT',
    summary: 'A new-project-only governed agent fleet built on Gemini, Google agent tooling, and Google Cloud. Misfit is competing with a clean-room build that demonstrates agent coordination and governance without exposing private GHOSBC internals.',
    href: 'https://allthingsagentichackathon.devpost.com/',
    product: 'Governed Agent Fleet → reusable enterprise agent-governance product',
    live: true,
  },
  {
    name: 'Trace the Ace',
    organizer: 'Public data-science competition',
    purse: '$50,000 target prize',
    status: 'Final competition push',
    deadline: 'Aug 27, 2026',
    summary: 'Predictive modeling competition used as a public proving ground for Misfit experimentation, evaluation discipline, feature work, and measurable model performance.',
    href: '/portfolio',
    product: 'Competition pipeline → reusable modeling + evaluation workflow',
    live: true,
  },
  {
    name: 'ContextForge · DataHub',
    organizer: 'DataHub Hackathon',
    purse: 'Hackathon submission',
    status: 'Built · submitted',
    deadline: 'Submission complete',
    summary: 'Metadata-aware code generation grounded in DataHub context, lineage, ownership, governance, and usage. Built as a competition entry, preserved as a standalone product and portfolio asset.',
    href: 'https://contextforge-datahub-app.vercel.app/',
    product: 'Hackathon build → enterprise metadata-aware development product',
    live: false,
  },
];

export default function Competitions() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-28">
        <section className="mx-auto max-w-7xl px-5 py-12">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-amber-300">Build in public · competition proving ground</div>
          <h1 className="mt-4 max-w-6xl font-display text-[clamp(3rem,10vw,7rem)] font-bold uppercase leading-[0.86] tracking-[-0.055em]">Compete. Ship. Measure. Turn the work into products.</h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-400">Misfit uses hackathons, bounties and public competitions as live proving grounds. The prize matters, but the deeper objective is to leave every competition with reusable software, evidence, distribution, and a stronger commercial asset.</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl border border-amber-300/20 bg-amber-300/[0.04] p-5"><BadgeDollarSign className="text-amber-300" size={20}/><div className="mt-4 font-display text-3xl font-bold">$230K+</div><div className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-500">Named prize targets shown here</div></div>
            <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.04] p-5"><Trophy className="text-cyan-300" size={20}/><div className="mt-4 font-display text-3xl font-bold">3</div><div className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-500">Current public proof cases</div></div>
            <div className="rounded-3xl border border-emerald-300/20 bg-emerald-300/[0.04] p-5"><CheckCircle2 className="text-emerald-300" size={20}/><div className="mt-4 font-display text-3xl font-bold">Productized</div><div className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-500">Competition code does not die after judging</div></div>
          </div>

          <div className="mt-10 grid gap-5">
            {competitions.map((item) => (
              <article key={item.name} className="rounded-[2rem] border border-white/10 bg-white/[0.025] p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`rounded-full border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.13em] ${item.live ? 'border-emerald-400/25 text-emerald-300' : 'border-white/10 text-slate-400'}`}>{item.status}</span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-slate-600">{item.organizer}</span>
                </div>
                <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_280px]">
                  <div>
                    <h2 className="font-display text-3xl font-bold sm:text-5xl">{item.name}</h2>
                    <p className="mt-4 max-w-4xl text-base leading-7 text-slate-400">{item.summary}</p>
                    <div className="mt-5 rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.025] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.11em] text-cyan-200">{item.product}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                    <div className="font-mono text-[9px] uppercase tracking-[0.13em] text-slate-600">Prize / value</div>
                    <div className="mt-2 font-display text-2xl font-bold text-amber-300">{item.purse}</div>
                    <div className="mt-5 flex items-center gap-2 text-sm text-slate-400"><Clock3 size={15}/>{item.deadline}</div>
                    <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.13em] text-cyan-300">Open proof / competition <ArrowUpRight size={13}/></a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_10%_0%,rgba(34,211,238,.10),transparent_35%),rgba(255,255,255,.02)] p-7">
            <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-cyan-300">Operating principle</div>
            <p className="mt-3 max-w-5xl font-display text-2xl font-semibold leading-tight sm:text-4xl">Prize pursuit is R&D with a scoreboard. Every serious entry should become a product, benchmark, case study, API, dataset, workflow, or distribution asset whether it wins or not.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
