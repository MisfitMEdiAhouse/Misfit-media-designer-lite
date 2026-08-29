import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleStop,
  Code2,
  ExternalLink,
  Eye,
  FileLock2,
  GitCompareArrows,
  Headphones,
  LockKeyhole,
  Network,
  Pause,
  Play,
  Radar,
  Route,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
  Workflow,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const egnyteSources = [
  {
    label: 'AI Safeguards',
    href: 'https://www.egnyte.com/products/ai-safeguards',
    note: 'Controls what AI can access and surface across Assistant, agents and MCP.',
  },
  {
    label: 'Remote MCP Server',
    href: 'https://helpdesk.egnyte.com/hc/en-us/articles/43305899030797-Egnyte-MCP-Server-Overview',
    note: 'OAuth-secured MCP access lets approved AI clients work with Egnyte content under existing permissions.',
  },
  {
    label: 'AI Connectors',
    href: 'https://helpdesk.egnyte.com/hc/en-us/articles/44605101419789-AI-Connectors-Admin-Guide',
    note: 'Admins can connect external MCP servers and decide which tools run unsupervised versus permission-required.',
  },
  {
    label: 'Agent Builder + Workflow Builder',
    href: 'https://www.egnyte.com/blog/post/build-agents-automate-workflows-and-unlock-your-content-all-in-one-platform',
    note: 'Egnyte is turning governed enterprise content into a native agent/workflow platform.',
  },
  {
    label: 'AI-native SDLC',
    href: 'https://www.egnyte.com/blog/post/adopting-an-ai-native-sdlc-egnyte-search-team-case-study',
    note: 'Egnyte is building skill registries, dynamic tool loading and internal MCP into its own engineering workflow.',
  },
  {
    label: 'Current careers',
    href: 'https://jobs.jobvite.com/egnyte/search',
    note: 'Current hiring makes the platform direction visible: ecosystem, APIs, AI consulting, senior engineering and security.',
  },
];

const hiringSignals = [
  {
    role: 'Director of Product Management, Ecosystem',
    signal: 'Own APIs, SDKs, CLI, developer/partner portals and integration ecosystem strategy.',
    href: 'https://jobs.jobvite.com/egnyte/job/oR1FAfwR',
  },
  {
    role: 'Sr. Manager, Professional Services – AI',
    signal: 'Lead MCP integrations, agentic AI architecture, custom AI solutions, Python/React and enterprise delivery.',
    href: 'https://jobs.jobvite.com/egnyte/job/oF6yAfwD',
  },
  {
    role: 'Staff Software Engineer – Full Stack',
    signal: 'Distributed systems, Python/Java, cloud, observability, security and AI-assisted engineering at platform scale.',
    href: 'https://jobs.jobvite.com/egnyte/job/oaDAAfwH',
  },
  {
    role: 'Sr. Engineering Manager',
    signal: 'Multi-tenant SaaS operations plus advanced AI-assisted SDLC adoption across engineering teams.',
    href: 'https://jobs.jobvite.com/egnyte/job/o4ZwAfwT',
  },
];

const stack = [
  {
    icon: FileLock2,
    name: 'Egnyte',
    role: 'Trusted content + identity boundary',
    body: 'Permissions, sensitive-content policy, enterprise context, MCP access and existing audit controls stay authoritative.',
  },
  {
    icon: Code2,
    name: 'ContextForge',
    role: 'Context-aware change layer',
    body: 'Ground code and system changes in metadata, lineage, ownership and architecture context before an agent edits the stack.',
  },
  {
    icon: ShieldCheck,
    name: 'Castle Gate',
    role: 'Pre-execution consequence gate',
    body: 'Evaluate a proposed action by authority, scope, side effects, reversibility and downstream consequence — not just tool availability.',
  },
  {
    icon: Radar,
    name: 'Sentinel',
    role: 'Runtime watch + anomaly loop',
    body: 'Watch risk, drift, behavior and outbound context; raise a review path when execution no longer matches the trusted envelope.',
  },
  {
    icon: BrainCircuit,
    name: 'GHOSBC OS',
    role: 'Protected cognitive/governance kernel',
    body: 'Preserve the legitimate objective, route decisions, trigger replanning and expose only bounded public-safe outcomes.',
  },
];

const whyBetter = [
  ['Permission is necessary, not sufficient', 'Egnyte can decide whether content or a connector is available. GHOSBC can ask whether the specific action is wise, authorized and proportionate right now.'],
  ['Human gates become selective', 'Instead of asking a human for every write, route only material, irreversible, ambiguous or authority-sensitive actions to review.'],
  ['Refusal becomes replanning', 'When the first action is unsafe, preserve the user’s legitimate goal and generate a safer path rather than simply stopping.'],
  ['Trust can expire when tools change', 'ChangePacket can detect MCP/tool-surface drift and trigger re-evaluation when capability, scope or behavior changes.'],
  ['AI coding gets a control loop', 'ContextForge grounds a proposed change; Castle Gate evaluates it; Sentinel watches what actually happens after release.'],
  ['Safety becomes measurable', 'Raw-vs-governed evaluation measures dangerous-action blocks, false refusals, goal completion, escalation and audit completeness.'],
];

const scenarios = {
  read: {
    label: 'Read an authorized project file',
    egnyte: 'Existing permissions + AI Safeguards determine whether the content is available to the AI.',
    castle: 'ALLOW when the declared action stays inside identity, purpose, scope and data boundaries.',
    sentinel: 'Watch for abnormal access patterns or context drift without changing the user’s legitimate read path.',
    tone: 'emerald',
  },
  slack: {
    label: 'Send an external Slack message',
    egnyte: 'A write-capable connector can be configured to require permission rather than run silently.',
    castle: 'REVIEW when a message creates an external side effect and mandate or recipient scope is ambiguous.',
    sentinel: 'Record the decision envelope and flag repeated or unusual outbound behavior.',
    tone: 'amber',
  },
  salesforce: {
    label: 'Update a CRM opportunity',
    egnyte: 'Connector permissions establish whether create/update tools are available.',
    castle: 'ALLOW, REVIEW or BLOCK based on authority, value impact, scope and whether the requested mutation matches the business objective.',
    sentinel: 'Watch post-action signals and surface drift from expected patterns or repeated risky mutations.',
    tone: 'amber',
  },
  destructive: {
    label: 'Delete or irreversibly mutate data',
    egnyte: 'Public connector guidance already treats destructive/write actions as candidates for explicit permission.',
    castle: 'Fail closed unless authority, scope, reversibility and consequence checks pass; otherwise replan or escalate.',
    sentinel: 'Escalate anomalous destructive intent or execution patterns and preserve an audit trail.',
    tone: 'rose',
  },
};

const guideSteps = [
  {
    id: 'tour-intro',
    title: 'Why this tour exists',
    narration: 'Stan, Egnyte already owns an unusually strong enterprise content and permission layer. The point of this tour is not to replace it. The question is what happens one layer downstream, when an agent has legitimate access and now wants to take action.',
  },
  {
    id: 'egnyte-better',
    title: 'What GHOSBC could add',
    narration: 'GHOSBC adds consequence-aware routing after access is granted. It can distinguish a technically allowed action from a contextually appropriate one, preserve the legitimate goal, replan weak actions, selectively escalate to humans, and emit a bounded audit receipt.',
  },
  {
    id: 'stack-map',
    title: 'The combined architecture',
    narration: 'Keep Egnyte as the trusted content and identity boundary. ContextForge grounds proposed changes in system context. Castle Gate evaluates consequences before execution. Sentinel watches the runtime. GHOSBC stays protected behind those interfaces and returns only bounded decisions.',
  },
  {
    id: 'contextforge',
    title: 'Why ContextForge matters',
    narration: 'Egnyte is already adopting an AI-native software development lifecycle. ContextForge is relevant because it gives a coding agent more than source text. It can ground a change in metadata, ownership, lineage and architecture before that change ever reaches Castle Gate.',
  },
  {
    id: 'preflight-lab',
    title: 'Try the decision boundary',
    narration: 'This interactive preflight is illustrative. Switch between safe reads, external messages, CRM mutations and destructive actions. Egnyte governs access and tool permission. Castle Gate adds consequence and authority checks. Sentinel adds runtime awareness.',
  },
  {
    id: 'hiring-radar',
    title: 'Why this matches Egnyte now',
    narration: 'The hiring signals line up with the architecture. Egnyte is recruiting leadership for developer ecosystem and integrations, professional services AI focused on MCP and agentic architecture, and senior platform engineers working with AI-assisted development.',
  },
  {
    id: 'ip-boundary',
    title: 'How Misfit protects the IP',
    narration: 'The private kernel is intentionally not exposed. Developers can inspect the contracts, input and output shapes, public decisions, audit evidence and benchmark behavior. They do not need the private policy maps, prompts, symbolic mappings or reconstruction material to integrate with the system.',
  },
];

function ScenarioLab() {
  const [scenarioKey, setScenarioKey] = useState('slack');
  const scenario = useMemo(() => scenarios[scenarioKey], [scenarioKey]);
  const toneClass = scenario.tone === 'emerald'
    ? 'border-emerald-300/20 bg-emerald-300/[0.04]'
    : scenario.tone === 'rose'
      ? 'border-rose-300/20 bg-rose-300/[0.04]'
      : 'border-amber-300/20 bg-amber-300/[0.04]';

  return (
    <section id="preflight-lab" className="scroll-mt-28 mt-6 rounded-3xl border border-white/10 bg-white/[0.025] p-6 md:p-7">
      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300">Interactive preflight lab</div>
      <h2 className="mt-2 font-display text-2xl font-semibold md:text-3xl">Same permission. Deeper decision boundary.</h2>
      <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400">This is an architectural demonstration, not a claim of access to Egnyte internals. It uses Egnyte’s documented control model and Misfit’s bounded governance pattern.</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {Object.entries(scenarios).map(([key, item]) => (
          <button
            key={key}
            type="button"
            onClick={() => setScenarioKey(key)}
            className={`rounded-full border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] transition ${scenarioKey === key ? 'border-cyan-300/40 bg-cyan-300/10 text-cyan-200' : 'border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300'}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <div className="rounded-2xl border border-sky-300/15 bg-sky-300/[0.035] p-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-sky-300">Egnyte layer</div>
          <p className="mt-3 text-sm leading-6 text-slate-400">{scenario.egnyte}</p>
        </div>
        <div className={`rounded-2xl border p-5 ${toneClass}`}>
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-fuchsia-300">Castle Gate</div>
          <p className="mt-3 text-sm leading-6 text-slate-300">{scenario.castle}</p>
        </div>
        <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.03] p-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-300">Sentinel</div>
          <p className="mt-3 text-sm leading-6 text-slate-400">{scenario.sentinel}</p>
        </div>
      </div>
    </section>
  );
}

function TourGuide({ active, onClose }) {
  const [step, setStep] = useState(0);
  const [voiceOn, setVoiceOn] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const lastSpokenStep = useRef(-1);

  const current = guideSteps[step];

  const stopVoice = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const speak = (text) => {
    if (!voiceOn || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.96;
    utterance.pitch = 0.9;
    utterance.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((voice) => /en-US/i.test(voice.lang) && /Google|Microsoft|Samantha|Daniel|Alex/i.test(voice.name)) || voices.find((voice) => /en/i.test(voice.lang));
    if (preferred) utterance.voice = preferred;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!active) {
      stopVoice();
      return undefined;
    }
    const target = document.getElementById(current.id);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (voiceOn && lastSpokenStep.current !== step) {
      const timer = window.setTimeout(() => {
        speak(current.narration);
        lastSpokenStep.current = step;
      }, 450);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [active, step, voiceOn]);

  useEffect(() => () => stopVoice(), []);

  if (!active) return null;

  const next = () => {
    stopVoice();
    setStep((value) => Math.min(guideSteps.length - 1, value + 1));
  };
  const back = () => {
    stopVoice();
    setStep((value) => Math.max(0, value - 1));
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[80] rounded-3xl border border-cyan-300/30 bg-slate-950/95 p-4 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl md:left-auto md:w-[440px]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300"><Headphones size={13}/> Misfit voice guide · {step + 1}/{guideSteps.length}</div>
          <div className="mt-2 font-semibold text-white">{current.title}</div>
        </div>
        <button type="button" onClick={() => { stopVoice(); onClose(); }} className="rounded-full border border-white/10 p-2 text-slate-500 hover:text-white" aria-label="Close tour"><CircleStop size={16}/></button>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-400">{current.narration}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex gap-2">
          <button type="button" onClick={back} disabled={step === 0} className="rounded-xl border border-white/10 p-2 text-slate-300 disabled:opacity-30" aria-label="Previous step"><ChevronLeft size={16}/></button>
          <button type="button" onClick={() => {
            if (speaking) stopVoice();
            else speak(current.narration);
          }} className="rounded-xl border border-white/10 p-2 text-slate-300" aria-label="Play or pause narration">{speaking ? <Pause size={16}/> : <Play size={16}/>}</button>
          <button type="button" onClick={() => {
            stopVoice();
            setVoiceOn((value) => !value);
          }} className="rounded-xl border border-white/10 p-2 text-slate-300" aria-label="Toggle voice">{voiceOn ? <Volume2 size={16}/> : <VolumeX size={16}/>}</button>
        </div>
        <button type="button" onClick={next} disabled={step === guideSteps.length - 1} className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-black disabled:opacity-40">Next <ChevronRight size={14}/></button>
      </div>
    </div>
  );
}

export default function StanHansenEgnyte() {
  const [mode, setMode] = useState('stan');
  const [guideActive, setGuideActive] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className={`mx-auto max-w-6xl px-5 pt-32 ${guideActive ? 'pb-80 md:pb-64' : 'pb-24'}`}>
        <section id="tour-intro" className="scroll-mt-28 overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(217,70,239,.13),transparent_34%),linear-gradient(135deg,rgba(15,23,42,.94),rgba(0,0,0,1))] p-7 md:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-200"><Sparkles size={12}/> Stan Hansen × Egnyte · public-safe private-link tour</div>
            <div className="rounded-full border border-fuchsia-300/20 bg-fuchsia-300/[0.06] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-fuchsia-200">GHOSBC internals protected</div>
          </div>
          <h1 className="mt-5 max-w-5xl font-display text-4xl font-bold tracking-tight md:text-6xl">WHAT IF EGNYTE COULD GOVERN <span className="text-cyan-300">THE ACTION AFTER ACCESS?</span></h1>
          <p className="mt-4 max-w-4xl text-base leading-8 text-slate-300">Egnyte already has the hard part most AI stacks are missing: governed enterprise content, identity, permissions and an expanding MCP/agent layer. GHOSBC OS is interesting because it can sit <em>after</em> that trust boundary and reason about the proposed action — consequence, authority, reversibility, escalation and safer replanning — without exposing the private kernel.</p>

          <div className="mt-7 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-black/30 p-2 font-mono text-[10px] uppercase tracking-[0.12em]">
            <button type="button" onClick={() => setMode('stan')} className={`rounded-xl px-4 py-2 transition ${mode === 'stan' ? 'bg-cyan-300 text-black' : 'text-slate-500 hover:text-white'}`}>Stan mode · business value</button>
            <button type="button" onClick={() => setMode('dev')} className={`rounded-xl px-4 py-2 transition ${mode === 'dev' ? 'bg-fuchsia-300 text-black' : 'text-slate-500 hover:text-white'}`}>Developer mode · architecture</button>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-5">
            {mode === 'stan' ? (
              <div><div className="font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-300">The sales version</div><p className="mt-2 max-w-4xl text-sm leading-7 text-slate-300">Egnyte keeps the customer’s content secure. GHOSBC can make agentic workflows safer and more autonomous by deciding which actions can move immediately, which need a human, and which should be replanned before they create a bad outcome.</p></div>
            ) : (
              <div><div className="font-mono text-[10px] uppercase tracking-[0.14em] text-fuchsia-300">The engineering version</div><p className="mt-2 max-w-4xl text-sm leading-7 text-slate-300">Treat GHOSBC as a protected policy/replanning kernel behind bounded contracts: structured action envelope in → ALLOW / REVIEW / BLOCK / REPLAN class out → public-safe reason + audit receipt. Egnyte remains the content and identity authority.</p></div>
            )}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <button type="button" onClick={() => setGuideActive(true)} className="inline-flex items-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.13em] text-black"><Volume2 size={15}/> Start Misfit voice tour</button>
            <a href="#egnyte-better" className="inline-flex items-center gap-2 rounded-2xl border border-cyan-300/30 px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.13em] text-cyan-200">Explore manually <ArrowRight size={14}/></a>
            <a href="/.well-known/agent-card.json" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-5 py-3 font-mono text-xs uppercase tracking-[0.13em] text-slate-300">A2A Agent Card <ExternalLink size={14}/></a>
          </div>
        </section>

        <section id="egnyte-better" className="scroll-mt-28 mt-6 rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.035] p-6 md:p-7">
          <div className="flex items-center gap-3"><Sparkles className="text-cyan-300"/><h2 className="font-display text-2xl font-semibold md:text-3xl">How GHOSBC could make Egnyte better</h2></div>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400">Not by replacing Egnyte’s safeguards. By adding an action-level decision and recovery loop to the content-level governance Egnyte already owns.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">{whyBetter.map(([title, body]) => <div key={title} className="rounded-2xl border border-white/10 bg-black/30 p-5"><div className="flex items-start gap-3"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-300"/><div><div className="font-semibold">{title}</div><p className="mt-2 text-sm leading-6 text-slate-500">{body}</p></div></div></div>)}</div>
        </section>

        <section id="stack-map" className="scroll-mt-28 mt-6 rounded-3xl border border-fuchsia-300/20 bg-fuchsia-300/[0.03] p-6 md:p-7">
          <div className="flex items-center gap-3"><Network className="text-fuchsia-300"/><h2 className="font-display text-2xl font-semibold md:text-3xl">Egnyte × Misfit governed stack</h2></div>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400">The architecture is complementary. Egnyte does not have to surrender data ownership or identity control for this to be useful.</p>
          <div className="mt-6 space-y-3">{stack.map((item, index) => { const Icon = item.icon; return <div key={item.name} className="grid gap-4 rounded-2xl border border-white/10 bg-black/30 p-5 md:grid-cols-[48px_180px_1fr]"><div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]"><Icon size={20} className={index === 0 ? 'text-sky-300' : index === 1 ? 'text-cyan-300' : index === 2 ? 'text-fuchsia-300' : index === 3 ? 'text-emerald-300' : 'text-amber-300'}/></div><div><div className="font-semibold">{item.name}</div><div className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-600">{item.role}</div></div><p className="text-sm leading-6 text-slate-400">{item.body}</p></div>; })}</div>
        </section>

        <section id="contextforge" className="scroll-mt-28 mt-6 overflow-hidden rounded-3xl border border-cyan-400/20 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,.10),transparent_28%),rgba(255,255,255,.02)] p-6 md:p-7">
          <div className="flex items-center gap-3"><Code2 className="text-cyan-300"/><h2 className="font-display text-2xl font-semibold md:text-3xl">ContextForge is the developer wedge</h2></div>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400">Egnyte’s own Search team is experimenting with skill registries, dynamic tool loading, internal MCP and AI-native SDLC. ContextForge speaks directly to that world: give coding agents architectural context before they generate the change, then govern the change before it executes.</p>
          <div className="mt-6 grid gap-3 lg:grid-cols-4">
            {[
              ['1', 'Context', 'Metadata, lineage, ownership, service boundaries and declared intent.'],
              ['2', 'Generate', 'AI proposes code or configuration grounded in the real system instead of a blank prompt.'],
              ['3', 'Castle Gate', 'Evaluate mutation scope, authority, risk, blast radius and rollback before execution.'],
              ['4', 'Sentinel', 'Watch the released behavior and detect drift from the intended envelope.'],
            ].map(([n,title,body]) => <div key={n} className="rounded-2xl border border-white/10 bg-black/30 p-5"><div className="font-mono text-[10px] text-cyan-300">0{n}</div><div className="mt-2 font-semibold">{title}</div><p className="mt-2 text-xs leading-5 text-slate-500">{body}</p></div>)}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="https://contextforge-datahub-app.vercel.app/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-black">Open ContextForge <ExternalLink size={14}/></a>
            <a href="/enterprise-ai" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-5 py-3 font-mono text-xs uppercase tracking-[0.12em] text-slate-300">Misfit enterprise AI</a>
          </div>
        </section>

        <ScenarioLab />

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-7">
          <div className="flex items-center gap-3"><GitCompareArrows className="text-fuchsia-300"/><h2 className="font-display text-2xl font-semibold md:text-3xl">Prove the delta instead of pitching it</h2></div>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400">The cleanest Egnyte experiment is an authorized workflow run twice: once with the existing control path and once with a bounded GHOSBC pre-execution layer. Then compare what changed.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">{[
            ['Dangerous-action block rate', 'Did the governed path stop or redirect actions the baseline would execute unsafely?'],
            ['Benign false-refusal rate', 'Did governance get in the way when the workflow was actually safe?'],
            ['Goal completion', 'Did replanning preserve the legitimate business objective?'],
            ['Human escalation', 'Were humans asked only when a meaningful judgment was required?'],
            ['Decision-change rate', 'How often did context and consequence materially alter the action path?'],
            ['Audit completeness', 'Can a reviewer reconstruct what changed and why without seeing private kernel internals?'],
          ].map(([title,body]) => <div key={title} className="rounded-2xl border border-white/10 bg-black/30 p-4"><div className="text-sm font-semibold">{title}</div><p className="mt-2 text-xs leading-5 text-slate-500">{body}</p></div>)}</div>
          <a href="/agent-evaluation-lab" className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-fuchsia-300/30 px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-fuchsia-200">Open Raw vs Governed Lab <ArrowRight size={14}/></a>
        </section>

        <section id="hiring-radar" className="scroll-mt-28 mt-6 rounded-3xl border border-amber-300/20 bg-amber-300/[0.025] p-6 md:p-7">
          <div className="flex items-center gap-3"><BriefcaseBusiness className="text-amber-300"/><h2 className="font-display text-2xl font-semibold md:text-3xl">Egnyte’s hiring radar says this matters now</h2></div>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400">Current openings point at developer ecosystem expansion, customer-facing agentic AI/MCP delivery, distributed platform engineering and AI-native engineering operations.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">{hiringSignals.map((job) => <a key={job.role} href={job.href} target="_blank" rel="noreferrer" className="group rounded-2xl border border-white/10 bg-black/30 p-5 transition hover:border-amber-300/30"><div className="flex items-start justify-between gap-4"><div className="font-semibold text-amber-100">{job.role}</div><ExternalLink size={14} className="mt-1 shrink-0 text-slate-600 group-hover:text-amber-300"/></div><p className="mt-3 text-sm leading-6 text-slate-500">{job.signal}</p></a>)}</div>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-7">
          <div className="flex items-center gap-3"><Eye className="text-sky-300"/><h2 className="font-display text-2xl font-semibold md:text-3xl">What Egnyte’s devs can inspect</h2></div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {[
              ['A2A Agent Card', '/.well-known/agent-card.json', 'Public skill declarations, interfaces and bounded governance/evaluation contracts.'],
              ['Agent Evaluation Lab', '/agent-evaluation-lab', 'Raw-vs-governed comparative evaluation and public-safe metrics.'],
              ['Agent Stack', '/agent-stack.json', 'Machine-readable public/private boundary and current public-safe agent assets.'],
              ['Agent docs', '/agents.md', 'Developer-facing explanation of bounded agent capabilities.'],
              ['Machine context', '/llms.txt', 'Agent-readable map of Misfit’s public machine surfaces.'],
              ['ContextForge', 'https://contextforge-datahub-app.vercel.app/', 'Metadata-aware developer workflow and interactive guided demonstration.'],
            ].map(([title,href,body]) => <a key={title} href={href} target={href.startsWith('http') || href.endsWith('.json') || href.endsWith('.txt') || href.endsWith('.md') ? '_blank' : undefined} rel="noreferrer" className="rounded-2xl border border-white/10 bg-black/30 p-5 transition hover:border-sky-300/30"><div className="flex items-center justify-between gap-3"><span className="font-mono text-[11px] font-bold text-sky-300">{title}</span><ExternalLink size={13} className="text-slate-600"/></div><p className="mt-3 text-xs leading-5 text-slate-500">{body}</p></a>)}</div>
        </section>

        <section id="ip-boundary" className="scroll-mt-28 mt-6 rounded-3xl border border-rose-300/20 bg-rose-300/[0.025] p-6 md:p-7">
          <div className="flex items-center gap-3"><LockKeyhole className="text-rose-300"/><h2 className="font-display text-2xl font-semibold md:text-3xl">The product is the boundary — not the secret sauce dump</h2></div>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400">Serious developers should be able to test GHOSBC without being handed the protected kernel. Integration value lives in observable behavior, contracts and evidence.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.03] p-5"><div className="font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-300">Show them</div><p className="mt-3 text-sm leading-7 text-slate-400">Inputs and outputs, schemas, ALLOW/REVIEW/BLOCK/REPLAN classes, public-safe reason codes, benchmark behavior, audit receipts, latency, reliability, integration patterns and measurable before/after results.</p></div>
            <div className="rounded-2xl border border-rose-300/20 bg-rose-300/[0.03] p-5"><div className="font-mono text-[10px] uppercase tracking-[0.14em] text-rose-300">Keep sealed</div><p className="mt-3 text-sm leading-7 text-slate-400">Private GHOSBC reconstruction material, hidden prompts, symbolic/cipher mappings, private policy maps, credentials, proprietary source and anything unnecessary to integrate or validate behavior.</p></div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.035] p-6 md:p-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300">The experiment I would put in front of Egnyte engineering</div>
          <h2 className="mt-2 max-w-4xl font-display text-3xl font-semibold md:text-4xl">Give us one bounded agent workflow and let the data decide.</h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-400">No replacement pitch. No access to customer secrets. No GHOSBC source dump. Take one authorized workflow with meaningful actions, define success and authority, run baseline versus governed, and compare safety, completion, escalation and audit quality.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/agent-evaluation-lab" className="inline-flex items-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-black">Inspect evaluation contract <ArrowRight size={14}/></a>
            <a href="https://www.egnyte.com/blog/post/adopting-an-ai-native-sdlc-egnyte-search-team-case-study" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-5 py-3 font-mono text-xs uppercase tracking-[0.12em] text-slate-300">Egnyte AI-native SDLC <ExternalLink size={14}/></a>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-7">
          <div className="flex items-center gap-3"><Bot className="text-slate-300"/><h2 className="font-display text-2xl font-semibold">Research trail</h2></div>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-500">The Egnyte statements in this tour are grounded in Egnyte’s public product/help content and current careers material. Misfit claims are limited to public-safe surfaces and current demonstrable architecture.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">{egnyteSources.map((source) => <a key={source.label} href={source.href} target="_blank" rel="noreferrer" className="group rounded-2xl border border-white/10 bg-black/30 p-4 transition hover:border-white/20"><div className="flex items-center justify-between gap-3"><span className="font-mono text-[10px] font-bold uppercase tracking-[0.11em] text-slate-300">{source.label}</span><ExternalLink size={13} className="text-slate-700 group-hover:text-slate-300"/></div><p className="mt-2 text-xs leading-5 text-slate-600">{source.note}</p></a>)}</div>
        </section>
      </main>
      <Footer />
      <TourGuide active={guideActive} onClose={() => setGuideActive(false)} />
    </div>
  );
}
