import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  Code2,
  Database,
  DollarSign,
  FileCheck2,
  GitCompareArrows,
  LockKeyhole,
  Radar,
  Search,
  ShieldCheck,
  Users,
  Wrench,
} from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';

const LIVE_IALS = 'https://raw.githack.com/MisfitMEdiAhouse/misfit-media-designer/main/ials-command-center-v3/bearing-recovery/';
const IMPLEMENTATION_PR = 'https://github.com/MisfitMEdiAhouse/misfit-media-designer/pull/3';

const metrics = [
  { value: '94', label: 'current repair-price P/N rows', proof: 'Private repair-pricing catalog available to the operator matcher.' },
  { value: '22', label: 'inventory ↔ pricing matches', proof: 'Known inventory records joined to at least one priced repair route.' },
  { value: '4', label: 'multi-shop comparison P/Ns', proof: 'Part numbers with more than one repair route available for comparison.' },
  { value: '12', label: 'priced matches with known qty', proof: 'Matched part numbers with quantity context for a real spend decision.' },
];

const publicSurface = [
  'Exact P/N, alternate-number, NSN and application discovery',
  'Bearing recovery intake for new surplus, serviceable, repairable and core material',
  'Buyer-first T56 / 501D recovery workflow',
  'Program pages for CF6, CFM56, LM2500, TF39 and T56 / 501D',
  'Aggregate repair-economics proof without exposing private rates',
];

const operatorSurface = [
  'Repair-pricing catalog-to-inventory matching and quantity prioritization',
  'Single-route versus multi-shop repair comparison',
  'Human margin gate before inspection or overhaul spend',
  'Buyer, end-use, destination, classification, screening and release workflow',
  'Private repair network, deal ledger, campaign and opportunity lanes',
];

const protocol = [
  {
    icon: Radar,
    step: '01 · Discover',
    title: 'Turn part numbers into demand signals.',
    copy: 'Inventory search, program pages, seller intake and exact-number matching turn scattered bearings into qualified recovery opportunities.',
  },
  {
    icon: GitCompareArrows,
    step: '02 · Decide',
    title: 'Price the route before spending the money.',
    copy: 'Repair pricing, route count, quantity, documentation and compliance state come together before a human authorizes overhaul.',
  },
  {
    icon: Wrench,
    step: '03 · Deliver',
    title: 'Move the deal through a controlled workflow.',
    copy: 'The system supports RFQs, repair routing, customer certification, opportunity campaigns and the handoff from interest to action.',
  },
  {
    icon: LockKeyhole,
    step: '04 · Remember safely',
    title: 'Publish proof. Protect commercial intelligence.',
    copy: 'The public surface shows capability and aggregate evidence while vendor identities, exact rates, customer records and signed documents stay private.',
  },
];

const disciplines = [
  [Search, 'Domain translation', 'Turn aerospace aftermarket language, part identity, repair states and commercial constraints into software behavior.'],
  [Code2, 'Product + interface engineering', 'Build the public acquisition surface and the private operator workflow as one coherent system.'],
  [Database, 'Data modeling + joins', 'Normalize inventory, pricing, quantity and route-count evidence around exact part numbers.'],
  [DollarSign, 'Repair economics', 'Expose the decision signal without leaking private vendor rates or customer pricing.'],
  [ShieldCheck, 'Governed operations', 'Keep export, screening, classification, documentation and officer approval as explicit human gates.'],
  [FileCheck2, 'Document automation', 'Generate a customer-facing certificate from transaction data while preserving the internal case.'],
  [Users, 'Operator translation', 'Read real operator feedback, remove deal-killing friction and preserve the controls that still matter.'],
  [CheckCircle2, 'QA + release evidence', 'Test the renderer, inspect the live interface, preserve source history and publish an auditable change.'],
];

const caseSteps = [
  {
    label: 'The friction',
    title: 'A thorough compliance packet became a commercial threat.',
    copy: 'The first certificate asked a reseller to disclose its downstream customer. That increased order-cancellation risk and ignored how source protection works in the aftermarket.',
  },
  {
    label: 'The operator signal',
    title: 'The customer needed one page, one issuer and one signature.',
    copy: 'Misfit translated direct operator feedback into a purchaser-focused certificate without publishing the downstream customer or contaminating the form with another company’s branding.',
  },
  {
    label: 'The shipped change',
    title: 'Customer friction moved out. Internal control stayed in.',
    copy: 'The new fillable form is IALS-only, transaction-linked and signed by the purchaser. Detailed downstream, screening, classification and licensing fields remain inside the internal case.',
  },
  {
    label: 'The boundary',
    title: 'A signed form supports compliance; it does not replace it.',
    copy: 'The workflow still requires classification, screening, licensing analysis and qualified human review before release or shipment.',
  },
];

export default function IALSTurbineCommand() {
  useEffect(() => {
    document.title = 'IALS Turbine Command Case Study | Misfit Mediahouse';
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-20">
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 grid-bg opacity-25" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(0,229,255,.18),transparent_34%),radial-gradient(circle_at_12%_82%,rgba(245,158,11,.13),transparent_30%)]" />
          <div className="relative mx-auto max-w-7xl px-5 py-16 sm:py-24">
            <div className="flex flex-wrap gap-2 font-mono text-[9px] uppercase tracking-[0.16em] sm:text-[10px]">
              <span className="rounded-full border border-cyan-400/25 bg-cyan-400/[0.08] px-3 py-1.5 text-cyan-300">Aerospace aftermarket operating system</span>
              <span className="rounded-full border border-emerald-400/25 bg-emerald-400/[0.06] px-3 py-1.5 text-emerald-300">Live proof case</span>
              <span className="rounded-full border border-amber-400/25 bg-amber-400/[0.06] px-3 py-1.5 text-amber-300">Built by Misfit Mediahouse</span>
            </div>

            <h1 className="mt-7 max-w-7xl font-display text-[clamp(3.5rem,10vw,8rem)] font-bold uppercase leading-[0.79] tracking-[-0.065em]">
              IALS Turbine Command.
              <span className="block text-cyan-300">Not a brochure. An operating system.</span>
            </h1>
            <p className="mt-7 max-w-4xl text-base leading-8 text-slate-300 sm:text-xl sm:leading-9">
              Misfit turned an aerospace inventory business into a two-surface revenue and risk system: public demand acquisition outside, private repair economics and governed deal control inside.
            </p>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-500 sm:text-base">
              The software maps turbine-bearing identity, matches repair pricing to inventory, prioritizes known quantities, compares repair routes, gates spend before overhaul and carries international transactions through evidence-backed human review.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a href={LIVE_IALS} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-13 items-center gap-2 rounded-full bg-cyan-300 px-6 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-black hover:bg-white">
                Open the live recovery system <ArrowUpRight size={14} />
              </a>
              <Link to="/operator#challenge" className="inline-flex min-h-13 items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-slate-200 hover:border-amber-300/50 hover:text-amber-300">
                Think it is hype? Test the builder <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300">Current published system snapshot</div>
                <h2 className="mt-3 font-display text-4xl font-bold uppercase sm:text-5xl">Numbers with definitions.</h2>
              </div>
              <p className="max-w-md text-xs leading-6 text-slate-600">Counts are public. Vendor names, exact rates, quotes, customer records and commercial terms are intentionally excluded.</p>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <article key={metric.label} className="rounded-3xl border border-white/10 bg-black/45 p-6">
                  <div className="font-display text-6xl font-bold tracking-[-0.055em] text-white">{metric.value}</div>
                  <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-cyan-300">{metric.label}</div>
                  <p className="mt-4 text-xs leading-6 text-slate-500">{metric.proof}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-300">The architecture people miss</div>
          <h2 className="mt-5 max-w-6xl font-display text-5xl font-bold uppercase leading-[0.88] tracking-[-0.045em] sm:text-7xl">One system. Two surfaces. A human gate between them.</h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
            <article className="rounded-[2rem] border border-cyan-400/20 bg-cyan-400/[0.045] p-6 sm:p-8">
              <div className="flex items-center gap-3 text-cyan-300"><Radar size={21} /><span className="font-mono text-[10px] uppercase tracking-[0.16em]">Public acquisition surface</span></div>
              <h3 className="mt-5 font-display text-3xl font-bold">Make demand and inventory discoverable.</h3>
              <ul className="mt-6 grid gap-3">
                {publicSurface.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-400"><CheckCircle2 size={15} className="mt-1 shrink-0 text-cyan-300" />{item}</li>)}
              </ul>
            </article>

            <div className="flex items-center justify-center py-2 lg:py-0">
              <div className="rounded-full border border-amber-400/30 bg-amber-400/[0.08] px-4 py-3 text-center font-mono text-[9px] uppercase tracking-[0.14em] text-amber-300 lg:max-w-28">
                Human margin + compliance gate
              </div>
            </div>

            <article className="rounded-[2rem] border border-fuchsia-400/20 bg-fuchsia-400/[0.045] p-6 sm:p-8">
              <div className="flex items-center gap-3 text-fuchsia-300"><LockKeyhole size={21} /><span className="font-mono text-[10px] uppercase tracking-[0.16em]">Private operator surface</span></div>
              <h3 className="mt-5 font-display text-3xl font-bold">Turn activity into controlled decisions.</h3>
              <ul className="mt-6 grid gap-3">
                {operatorSurface.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-400"><CheckCircle2 size={15} className="mt-1 shrink-0 text-fuchsia-300" />{item}</li>)}
              </ul>
            </article>
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
            <div className="max-w-4xl">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300">Misfit protocol in production</div>
              <h2 className="mt-5 font-display text-5xl font-bold uppercase leading-[0.88] tracking-[-0.045em] sm:text-7xl">Discover. Decide. Deliver. Remember safely.</h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {protocol.map(({ icon: Icon, step, title, copy }) => (
                <article key={step} className="flex min-h-[330px] flex-col rounded-3xl border border-white/10 bg-black/40 p-6">
                  <Icon size={21} className="text-cyan-300" />
                  <div className="mt-7 font-mono text-[9px] uppercase tracking-[0.16em] text-amber-300">{step}</div>
                  <h3 className="mt-3 font-display text-2xl font-bold">{title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-500">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:items-start">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-300">Real transaction friction · anonymized</div>
              <h2 className="mt-5 font-display text-5xl font-bold uppercase leading-[0.88] tracking-[-0.045em] sm:text-7xl">The software changed when the operator spoke.</h2>
              <p className="mt-6 text-sm leading-7 text-slate-500">This is product work, not page decoration: listen to the commercial objection, preserve the risk controls, change the artifact, test it and ship evidence.</p>
              <a href={IMPLEMENTATION_PR} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-cyan-300">
                Inspect the implementation evidence <ArrowUpRight size={13} />
              </a>
            </div>
            <div className="grid gap-3">
              {caseSteps.map((item, index) => (
                <article key={item.label} className="grid gap-4 rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:grid-cols-[auto_1fr]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.07] font-mono text-xs text-cyan-300">{String(index + 1).padStart(2, '0')}</div>
                  <div>
                    <div className="font-mono text-[8px] uppercase tracking-[0.15em] text-amber-300">{item.label}</div>
                    <h3 className="mt-2 font-display text-xl font-bold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-500">{item.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
            <div className="grid gap-8 lg:grid-cols-[.82fr_1.18fr] lg:items-end">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fuchsia-300">What one builder actually covered</div>
                <h2 className="mt-5 font-display text-5xl font-bold uppercase leading-[0.88] tracking-[-0.045em] sm:text-7xl">Eight disciplines. One accountable system.</h2>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-slate-500">Calling this a website erases most of the work. Replacing it means replacing the product thinking, data logic, domain translation, governed workflow, document system, QA and operator handoff—not just the pixels.</p>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {disciplines.map(([Icon, title, copy]) => (
                <article key={title} className="rounded-3xl border border-white/10 bg-black/45 p-6">
                  <Icon size={19} className="text-cyan-300" />
                  <h3 className="mt-5 font-display text-xl font-bold">{title}</h3>
                  <p className="mt-3 text-xs leading-6 text-slate-500">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
          <div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
            <article className="rounded-[2rem] border border-cyan-400/25 bg-[radial-gradient(circle_at_top_right,rgba(0,229,255,.16),transparent_40%),rgba(255,255,255,.025)] p-7 sm:p-10">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300">The challenge</div>
              <h2 className="mt-5 max-w-4xl font-display text-5xl font-bold uppercase leading-[0.88] tracking-[-0.045em] sm:text-7xl">Yeah right? Good. Bring the problem.</h2>
              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300">Name the valuable bottleneck, set the access boundary and define the finish line. Judge Misfit on the inspectable result—not a résumé, pedigree or pile of adjectives.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/operator#challenge" className="inline-flex min-h-13 items-center gap-2 rounded-full bg-white px-6 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-black hover:bg-cyan-300">
                  Put Misfit on a live challenge <ArrowRight size={14} />
                </Link>
                <Link to="/portfolio" className="inline-flex min-h-13 items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-slate-300 hover:border-cyan-400/40 hover:text-cyan-300">
                  Back to the portfolio <Boxes size={14} />
                </Link>
              </div>
            </article>

            <article className="rounded-[2rem] border border-amber-400/20 bg-amber-400/[0.045] p-7 sm:p-8">
              <div className="flex items-center gap-3 text-amber-300"><ShieldCheck size={20} /><span className="font-mono text-[9px] uppercase tracking-[0.15em]">Proof boundary</span></div>
              <h3 className="mt-5 font-display text-3xl font-bold">Credibility includes the limits.</h3>
              <p className="mt-4 text-sm leading-7 text-slate-400">The current admin is an operator prototype, not a production security claim. Production requires real authentication, encrypted shared storage, access logging, backups and qualified export-compliance ownership.</p>
              <p className="mt-4 text-xs leading-6 text-slate-600">The public case study intentionally excludes customer identities, private vendor names, exact rates, signed documents and controlled technical data.</p>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
