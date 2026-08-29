import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  ExternalLink,
  FileLock2,
  GitCompareArrows,
  Network,
  Route,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const egnyteSources = [
  {
    label: 'AI Safeguards',
    href: 'https://www.egnyte.com/products/ai-safeguards',
    note: 'Policies govern AI data visibility and access across Assistant, agents and MCP.',
  },
  {
    label: 'Remote MCP Server',
    href: 'https://developers.egnyte.com/docs/Remote_MCP_Server',
    note: 'OAuth-secured MCP access lets external AI clients work with Egnyte content.',
  },
  {
    label: 'AI Connectors',
    href: 'https://helpdesk.egnyte.com/hc/en-us/articles/44605101419789-AI-Connectors-Admin-Guide',
    note: 'Admins can add custom MCP servers and set each tool to unsupervised or permission-required.',
  },
  {
    label: 'Agent Builder + Workflow Builder',
    href: 'https://www.egnyte.com/press-releases/egnyte-launches-ai-powered-workflow-automation-with-built-in-governance-to-help-organizations-scale-efficiently-and-securely',
    note: 'Egnyte is pushing governed agents and document-heavy automation directly into the content layer.',
  },
  {
    label: 'Agentic CLI',
    href: 'https://developers.egnyte.com/integration/sdks',
    note: 'Agent-first CLI with schema discovery and mandatory dry-run for mutations.',
  },
  {
    label: 'Public API + Agent API',
    href: 'https://developers.egnyte.com/api-docs',
    note: 'REST, OAuth 2.0, webhooks, workflow, AI and agent execution surfaces make Egnyte highly extensible.',
  },
];

const misfitTour = [
  {
    icon: Network,
    title: 'A2A Machine Agent',
    body: 'A public A2A v1.0 agent exposes bounded audit and governance skills while the private GHOSBC implementation stays behind the boundary.',
    href: '/.well-known/agent-card.json',
    cta: 'Inspect Agent Card',
  },
  {
    icon: GitCompareArrows,
    title: 'Raw vs Governed Evaluation',
    body: 'Measure what changes when the same objective is evaluated with consequence assessment, replanning, escalation and audit memory.',
    href: '/agent-evaluation-lab',
    cta: 'Open Evaluation Lab',
  },
  {
    icon: ShieldCheck,
    title: 'Governed Action Check',
    body: 'Structured action metadata can be screened before execution and returned as ALLOW, REVIEW or BLOCK with public-safe rationale and receipt.',
    href: '/agents.md',
    cta: 'Read Machine Contract',
  },
  {
    icon: Workflow,
    title: 'ChangePacket',
    body: 'Persistent delta memory for public webpages and MCP tool surfaces so agents can detect change instead of repeatedly re-reading everything.',
    href: 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/deltafeed',
    cta: 'Inspect ChangePacket',
  },
  {
    icon: BrainCircuit,
    title: 'Private GHOSBC Kernel',
    body: 'The interesting part is the boundary: protected policy/cognitive internals remain private; only sanitized contracts, decisions and audit evidence cross out.',
    href: '/agent-stack.json',
    cta: 'Inspect Public Boundary',
  },
  {
    icon: Route,
    title: 'Machine Discovery + Commerce',
    body: 'A2A, MCP, UCP and machine-readable manifests let AI systems discover what Misfit can safely do without relying on a chat session as the database.',
    href: '/llms.txt',
    cta: 'Read Machine Map',
  },
];

const experiments = [
  {
    n: '01',
    title: 'Preflight Egnyte MCP write tools',
    body: 'Keep Egnyte as the content/permission authority. Before a write-capable MCP tool runs, pass a public-safe action envelope through a Misfit consequence gate. The output can preserve the legitimate goal while allowing, escalating, sandboxing, or replanning the action.',
  },
  {
    n: '02',
    title: 'Benchmark an Egnyte agent twice',
    body: 'Run the same authorized workflow as a baseline and under a governed pre-execution layer. Compare dangerous-action blocks, benign false refusals, goal completion, human escalation and audit completeness instead of debating safety abstractly.',
  },
  {
    n: '03',
    title: 'Detect MCP/tool drift before trust drifts',
    body: 'Track public MCP schemas and external tool surfaces with ChangePacket, then require re-evaluation when a tool gains new mutation capability, scopes or behavior. Trust becomes version-aware instead of static.',
  },
  {
    n: '04',
    title: 'Turn approval into risk-aware routing',
    body: 'Egnyte already exposes unsupervised vs ask-permission controls. A deeper experiment is routing by consequence, authority, reversibility and downstream blast radius so only the right actions trigger a human gate.',
  },
];

const scenarios = {
  read: {
    label: 'Read an authorized project file',
    egnyte: 'Existing user permissions + AI Safeguards govern whether the content is visible to AI.',
    misfit: 'Illustrative outcome: ALLOW when action, identity, scope and declared data boundary remain inside the authorized envelope.',
    tone: 'emerald',
  },
  slack: {
    label: 'Send a Slack message through an MCP connector',
    egnyte: 'Egnyte documents write-capable connector tools as candidates for “Always ask permission.”',
    misfit: 'Illustrative outcome: REVIEW when the action creates an external side effect and the user mandate needs confirmation.',
    tone: 'amber',
  },
  salesforce: {
    label: 'Update a Salesforce opportunity',
    egnyte: 'Egnyte can expose create/update tools through MCP and lets admins choose unsupervised vs permission-required.',
    misfit: 'Illustrative outcome: REVIEW or BLOCK if the change exceeds authority, conflicts with policy, or lacks a bounded business mandate.',
    tone: 'amber',
  },
  destructive: {
    label: 'Delete or irreversibly mutate an external object',
    egnyte: 'Public connector guidance recommends explicit permission for destructive/write actions.',
    misfit: 'Illustrative outcome: fail closed unless authority, scope, reversibility and consequence checks pass; otherwise replan or escalate.',
    tone: 'rose',
  },
};

function ScenarioCard() {
  const [scenarioKey, setScenarioKey] = useState('slack');
  const scenario = useMemo(() => scenarios[scenarioKey], [scenarioKey]);
  const toneClass = scenario.tone === 'emerald'
    ? 'border-emerald-300/20 bg-emerald-300/[0.04] text-emerald-200'
    : scenario.tone === 'rose'
      ? 'border-rose-300/20 bg-rose-300/[0.04] text-rose-200'
      : 'border-amber-300/20 bg-amber-300/[0.04] text-amber-200';

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 md:p-7">
      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300">Illustrative preflight</div>
      <h2 className="mt-2 font-display text-2xl font-semibold">Same tool. Deeper decision boundary.</h2>
      <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400">This is not claiming access to Egnyte internals. It shows the architectural difference using behaviors documented publicly by Egnyte and Misfit’s public-safe governance contract.</p>
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
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-sky-300">Egnyte documented layer</div>
          <p className="mt-3 text-sm leading-6 text-slate-400">{scenario.egnyte}</p>
        </div>
        <div className={`rounded-2xl border p-5 ${toneClass}`}>
          <div className="font-mono text-[10px] uppercase tracking-[0.14em]">Misfit consequence layer</div>
          <p className="mt-3 text-sm leading-6 text-slate-300">{scenario.misfit}</p>
        </div>
      </div>
    </div>
  );
}

export default function StanHansenEgnyte() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-5 pb-24 pt-32">
        <section className="overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(217,70,239,.13),transparent_34%),linear-gradient(135deg,rgba(15,23,42,.94),rgba(0,0,0,1))] p-7 md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-200"><Sparkles size={12}/> Private tour link · public-safe technical surface</div>
          <h1 className="mt-5 max-w-5xl font-display text-4xl font-bold tracking-tight md:text-6xl">STAN HANSEN × <span className="text-cyan-300">MISFIT</span></h1>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.16em] text-slate-500">Built after studying Egnyte’s current AI, MCP, agent and governance stack</p>
          <p className="mt-6 max-w-4xl text-base leading-8 text-slate-300">The interesting overlap is not file storage. Egnyte already has the governed content layer. Misfit is experimenting one layer downstream: what should an agent be allowed to <em>do</em> after it has legitimate access — and how do you prove the decision changed safely without exposing the private policy engine?</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#dev-tour" className="inline-flex items-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.13em] text-black">Start the dev tour <ArrowRight size={14}/></a>
            <a href="/.well-known/agent-card.json" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-cyan-300/30 px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.13em] text-cyan-200">Open A2A Agent Card <ExternalLink size={14}/></a>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4"><div className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Egnyte strength</div><div className="mt-2 text-sm font-semibold">Governed enterprise content + MCP</div></div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4"><div className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Misfit experiment</div><div className="mt-2 text-sm font-semibold">Consequence-aware agent action governance</div></div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4"><div className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Boundary</div><div className="mt-2 text-sm font-semibold">Show decisions. Keep kernel private.</div></div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.025] p-6 md:p-7">
          <div className="flex items-center gap-3"><FileLock2 className="text-sky-300"/><h2 className="font-display text-2xl font-semibold">What we noticed about Egnyte</h2></div>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400">Egnyte’s 2026 stack is already unusually agent-ready: governed AI access, remote MCP, custom MCP connectors, no-code agents, workflow automation, AI/Agent APIs and an agentic CLI. The links below are the public sources used for this portal.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">{egnyteSources.map((source) => <a key={source.label} href={source.href} target="_blank" rel="noreferrer" className="group rounded-2xl border border-white/10 bg-black/30 p-5 transition hover:border-sky-300/30"><div className="flex items-center justify-between"><span className="font-mono text-xs font-bold text-sky-300">{source.label}</span><ExternalLink size={14} className="text-slate-600 group-hover:text-sky-300"/></div><p className="mt-3 text-sm leading-6 text-slate-500">{source.note}</p></a>)}</div>
        </section>

        <section className="mt-6 rounded-3xl border border-fuchsia-300/20 bg-fuchsia-300/[0.035] p-6 md:p-7">
          <div className="flex items-center gap-3"><BrainCircuit className="text-fuchsia-300"/><h2 className="font-display text-2xl font-semibold">The layer Misfit is exploring</h2></div>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400">Egnyte’s public docs emphasize content visibility, user access, connector permissions and auditability. Misfit’s public-safe GHOSBC boundary adds a different question before execution: <strong className="text-slate-200">given the goal, authority, scope and consequences, should this proposed action proceed, be replanned, or hit a human gate?</strong></p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              ['1', 'Assess consequence', 'Look beyond whether a tool is technically available and examine scope, authority, side effects and reversibility.'],
              ['2', 'Preserve the goal', 'If the first action is weak or unsafe, replan instead of blindly refusing the legitimate objective.'],
              ['3', 'Emit evidence', 'Return a public-safe decision, reason class and audit receipt without leaking private policy/cognitive internals.'],
            ].map(([n,title,body]) => <div key={n} className="rounded-2xl border border-white/10 bg-black/30 p-5"><div className="font-mono text-[10px] text-fuchsia-300">0{n}</div><div className="mt-2 font-semibold">{title}</div><p className="mt-2 text-sm leading-6 text-slate-500">{body}</p></div>)}
          </div>
        </section>

        <section id="dev-tour" className="mt-6">
          <div className="mb-4 flex items-center gap-3"><Bot className="text-cyan-300"/><h2 className="font-display text-3xl font-semibold">Hands-on public-safe dev tour</h2></div>
          <div className="grid gap-4 md:grid-cols-2">{misfitTour.map(({icon: Icon,title,body,href,cta}) => <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.025] p-6"><Icon className="text-cyan-300"/><h3 className="mt-4 font-display text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-500">{body}</p><a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined} className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-cyan-300">{cta}<ArrowRight size={13}/></a></div>)}</div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {experiments.map((item) => <div key={item.n} className="rounded-3xl border border-white/10 bg-white/[0.025] p-6"><div className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-300">Experiment {item.n}</div><h3 className="mt-2 font-display text-xl font-semibold">{item.title}</h3><p className="mt-3 text-sm leading-7 text-slate-500">{item.body}</p></div>)}
        </section>

        <section className="mt-6"><ScenarioCard /></section>

        <section className="mt-6 rounded-3xl border border-emerald-300/20 bg-emerald-300/[0.035] p-6 md:p-7">
          <div className="flex items-center gap-3"><CheckCircle2 className="text-emerald-300"/><h2 className="font-display text-2xl font-semibold">What is real today</h2></div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-5"><div className="font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-300">Published</div><p className="mt-3 text-sm leading-6 text-slate-400">A2A Agent Card, machine-readable stack manifest, llms.txt, bounded agent trust audits, Shopify agentic audits, ChangePacket, machine commerce discovery and the Agent Evaluation Lab.</p></div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-5"><div className="font-mono text-[10px] uppercase tracking-[0.14em] text-amber-300">Deliberately private</div><p className="mt-3 text-sm leading-6 text-slate-400">GHOSBC kernel internals, private prompts, policy mappings, reconstruction material, credentials and protected packets. This portal is designed to prove the boundary without handing out the recipe.</p></div>
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-cyan-300/20 bg-[linear-gradient(135deg,rgba(34,211,238,.09),rgba(217,70,239,.06),rgba(0,0,0,.9))] p-7 md:p-9">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300">The engineering question</div>
          <h2 className="mt-3 max-w-4xl font-display text-3xl font-semibold md:text-4xl">What happens when governed enterprise content meets governed agent action?</h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-400">That is the conversation this portal is built to start. Misfit does not need to replace Egnyte’s content controls. The interesting prototype is a composable layer that can sit before consequential MCP/A2A actions, preserve user intent, generate a safer route when needed, and produce audit evidence engineering and security teams can inspect.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/agent-evaluation-lab" className="inline-flex items-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.13em] text-black">Inspect the evaluation layer <ArrowRight size={14}/></a>
            <a href="/agent-stack.json" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.13em] text-slate-300">Inspect public stack boundary <ExternalLink size={14}/></a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
