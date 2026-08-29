import { ArrowRight, BrainCircuit, CheckCircle2, Cpu, Dna, FlaskConical, Languages, LockKeyhole, RefreshCcw, ShieldCheck, Sparkles, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import MaturityBadge, { MATURITY_LABELS } from '../components/MaturityBadge.jsx';

const systems = [
  {
    status: 'PROOF',
    evidence: '26/26 LOCAL ENGINEERED TESTS · EXTERNAL HOLDOUT VALIDATION PENDING',
    icon: RefreshCcw,
    title: 'Machine Reconsideration',
    copy: 'A proposed action can fail consequence or policy review, be withheld, preserve the legitimate objective, reset/replan, generate a safer candidate and reassess before any authorized trajectory continues.',
    boundary: 'The local R5 evidence infrastructure passed 18/18 R5 tests plus 8/8 durable-ledger tests. Two formal external holdout attempts were invalid/incomplete diagnostics, so Misfit does not claim an external pass rate.',
    href: '/agent-evaluation-lab',
    action: 'Open Evaluation Lab',
  },
  {
    status: 'PROOF',
    evidence: 'PUBLIC-SAFE RPC · EXPERIMENTAL PERSONALIZATION',
    icon: BrainCircuit,
    title: 'Identity Signal',
    copy: 'A public-safe personalization adapter demonstrates how the same facts, authority and safety policy can be presented differently based on current context without exposing the protected Soul Cipher kernel.',
    boundary: 'Name anchors the session; current context drives adaptation. This is not a psychological assessment and the public demo does not expose protected symbolic mappings.',
    href: '/identity-signal',
    action: 'Test personalization',
  },
  {
    status: 'RESEARCH',
    evidence: 'DOCS / CODE-ARCHITECTURE CANDIDATE · NO RUNTIME EFFECT',
    icon: Languages,
    title: 'GHX Compression + Glyph Language',
    copy: 'A state-translation architecture where one bounded state can become a machine-readable compressed packet, a visual glyph packet and a public-safe human translation before an output adapter turns it into an interface, policy, report or other artifact.',
    boundary: 'The recovered canon explicitly marks the Glyph Codec / GHX output-adapter layer as discovery architecture: no runtime effect, no public-claim effect and launchReady=false. Private token and mapping tables remain sealed.',
  },
  {
    status: 'RESEARCH',
    evidence: 'CYBER-PHYSICAL SECURITY SPEC · DOCS-ONLY · NO LIVE ROBOT CLAIM',
    icon: ShieldCheck,
    title: 'Cyber-Physical Safety Gate',
    copy: 'The Robot Immune System thesis puts identity, intent, context, motion safety, anomaly state, human proximity, force risk, sensor state and update integrity between an AI command and a physical actuator.',
    boundary: 'Core law: robots should execute gated intelligence, not raw intelligence. Current work is a security/spec candidate only; Misfit does not claim that GHOSBC currently protects a real robot.',
  },
  {
    status: 'RESEARCH',
    evidence: 'RECOMMENDATION-ONLY V1 · HUMAN IN LOOP',
    icon: Waves,
    title: 'Adaptive NeuroMotion Engine',
    copy: 'A proposed wearable-assist software layer for EEG, EMG, IMU, accelerometer, gyroscope, pressure, strain, posture and user feedback, producing movement-state candidates, confidence, support recommendations, safety gates and audit events.',
    boundary: 'V1 is recommendation-only and explicitly excludes autonomous physical control, medical-device claims, thought-reading claims and treatment claims.',
  },
  {
    status: 'BUILDING',
    evidence: 'ARCHITECTURE DEFINED · UNIFIED ML INTERFACE NOT BUILT YET',
    icon: Cpu,
    title: 'GHOSBC Machine Learning Interface',
    copy: 'The planned safe-learning layer is intended to learn from agent conversations, feedback, identity-safe signals, successful and failed outputs, governance decisions, audit records and later cyber/robot outcomes through quarantined learning records and regression validation.',
    boundary: 'The recovered canon explicitly says the unified GHOSBC OS Machine Learning Interface is not built yet and must come after fixture/compiler/runtime rails, before public plug-in/API channels.',
  },
  {
    status: 'RESEARCH',
    evidence: 'DARKLABS · BIOHYBRID SYSTEMS CANDIDATE · RUNTIME NONE',
    icon: Dna,
    title: 'Nature Signal / Biohybrid Architecture',
    copy: 'A quarantined frontier-research lane exploring how robotics could become biology-literate through vibration/tension networks, plant-derived fibers, bioelectric pathways, responsive media and translated signal patterns.',
    boundary: 'No claim of living-machine control, proven bio-compute, guaranteed growth effects or production robotics. Current runtime, launch and public-claim effect are none.',
  },
  {
    status: 'PRIVATE',
    evidence: 'PROTECTED KERNEL · PUBLIC CONTRACTS ONLY',
    icon: LockKeyhole,
    title: 'GHOSBC OS Private Core',
    copy: 'The protected cognitive/policy kernel remains behind public-safe adapters. External developers can inspect contracts, bounded outputs, decisions, evidence and benchmark behavior without receiving private prompts, symbolic maps or reconstruction material.',
    boundary: 'Public surfaces describe capability boundaries and measurable behavior; they do not publish the private kernel.',
  },
];

export default function FrontierMap() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-24">
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(34,211,238,.15),transparent_31%),radial-gradient(circle_at_85%_10%,rgba(217,70,239,.14),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(124,58,237,.1),transparent_34%)]" />
          <div className="relative mx-auto max-w-7xl px-5 py-16 sm:py-24">
            <div className="font-mono text-[10px] uppercase tracking-[.22em] text-fuchsia-300">Misfit technology map · maturity visible by design</div>
            <h1 className="mt-5 max-w-6xl font-display text-[clamp(3.3rem,9vw,7.5rem)] font-bold uppercase leading-[.82] tracking-[-.06em]">Rabbit hole,<br/><span className="text-cyan-300">not maze.</span></h1>
            <p className="mt-7 max-w-4xl text-base leading-8 text-slate-400 sm:text-lg">Misfit spans deployed products, working proofs, systems still being hardened and frontier research. Every card below says what stage it is in, what evidence exists and what is still unproven so breadth never gets confused with production readiness.</p>
            <div className="mt-8 flex flex-wrap gap-2">{MATURITY_LABELS.map(([status, description]) => <div key={status} className="flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-2"><MaturityBadge status={status}/><span className="hidden text-[10px] text-slate-500 sm:inline">{description}</span></div>)}</div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {systems.map(({ status, evidence, icon: Icon, title, copy, boundary, href, action }) => (
              <article key={title} className="flex min-h-[390px] flex-col rounded-[1.75rem] border border-white/10 bg-white/[.022] p-6">
                <div className="flex items-start justify-between gap-4"><div className="rounded-xl border border-white/10 bg-black/45 p-2.5 text-cyan-300"><Icon size={20}/></div><MaturityBadge status={status}/></div>
                <div className="mt-5 font-mono text-[8px] uppercase tracking-[.13em] text-slate-600">{evidence}</div>
                <h2 className="mt-3 font-display text-3xl font-bold leading-tight">{title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-400">{copy}</p>
                <div className="mt-5 rounded-2xl border border-white/8 bg-black/40 p-4"><div className="flex items-start gap-2"><CheckCircle2 size={14} className="mt-1 shrink-0 text-slate-600"/><p className="text-xs leading-6 text-slate-500">{boundary}</p></div></div>
                {href ? <Link to={href} className="mt-auto inline-flex items-center gap-2 pt-6 font-mono text-[10px] font-bold uppercase tracking-[.12em] text-cyan-300">{action} <ArrowRight size={13}/></Link> : <div className="mt-auto pt-6 font-mono text-[9px] uppercase tracking-[.12em] text-slate-700">No public runtime test yet</div>}
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[.018]">
          <div className="mx-auto grid max-w-7xl gap-7 px-5 py-14 lg:grid-cols-[.9fr_1.1fr] lg:items-center sm:py-20">
            <div><div className="font-mono text-[10px] uppercase tracking-[.18em] text-emerald-300">Developer proving ground</div><h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[.9] sm:text-6xl">Inspect behavior before believing claims.</h2></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link to="/agentic-governed-fleet" className="rounded-2xl border border-cyan-300/20 bg-cyan-300/[.035] p-5"><Sparkles size={18} className="text-cyan-300"/><div className="mt-4 font-semibold">Governed Agent Fleet</div><p className="mt-2 text-xs leading-6 text-slate-500">Change action, sensitivity, authority and reversibility; inspect the governance result.</p></Link>
              <Link to="/agent-evaluation-lab" className="rounded-2xl border border-fuchsia-300/20 bg-fuchsia-300/[.035] p-5"><FlaskConical size={18} className="text-fuchsia-300"/><div className="mt-4 font-semibold">Agent Evaluation Lab</div><p className="mt-2 text-xs leading-6 text-slate-500">Compare raw vs governed behavior, contracts and evidence.</p></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
