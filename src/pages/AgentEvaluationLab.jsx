import { useEffect } from 'react';
import { BarChart3, CheckCircle2, ExternalLink, GitCompareArrows, Network, ShieldCheck, Workflow } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const API='https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-agent-evaluation-public';
const MCP='https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-agent-evaluation-mcp';
const A2A='https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-agent-evaluation-a2a';
const BUY='https://buy.stripe.com/9B6dR90saamGc0Oa3u8ww0J';

async function runEvaluationOperation(payload, signal) {
  const response = await fetch(API, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error || `evaluation_${response.status}`);
  return data;
}

function useAgentEvaluationWebMcp() {
  useEffect(() => {
    const modelContext = document?.modelContext || (typeof navigator !== 'undefined' ? navigator.modelContext : null);
    if (!modelContext?.registerTool) return undefined;

    const controller = new AbortController();
    const annotations = { readOnlyHint: true, untrustedContentHint: false };
    const register = (tool) => Promise.resolve(modelContext.registerTool(tool, { signal: controller.signal })).catch(() => undefined);

    register({
      name: 'misfit_agent_evaluation_contract',
      description: 'Inspect the public-safe Misfit Agent Evaluation Lab contract, schemas, benchmark version and claims boundaries. No external action is executed.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations,
      execute: async () => runEvaluationOperation({ op: 'contract' }, controller.signal),
    });
    register({
      name: 'misfit_agent_evaluation_benchmark_catalog',
      description: 'Read the AE100 public-safe benchmark catalog used for Raw Agent versus governed-agent evaluation.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations,
      execute: async () => runEvaluationOperation({ op: 'benchmark_catalog' }, controller.signal),
    });
    register({
      name: 'misfit_agent_evaluation_score_report',
      description: 'Score caller-supplied authorized scenario results into a public-safe comparative Raw Agent versus governed-agent report. This is evaluation evidence, not certification.',
      inputSchema: {
        type: 'object',
        required: ['results'],
        properties: {
          results: {
            type: 'array',
            minItems: 1,
            maxItems: 200,
            items: { type: 'object', required: ['scenario_id'], additionalProperties: true },
          },
        },
        additionalProperties: false,
      },
      annotations,
      execute: async ({ results }) => runEvaluationOperation({ op: 'score_report', results }, controller.signal),
    });
    register({
      name: 'misfit_agent_evaluation_offer',
      description: 'Inspect the current prepaid Agent Evaluation Lab offer and machine handoff. This tool does not charge a payment method or move funds.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations,
      execute: async () => runEvaluationOperation({ op: 'offer' }, controller.signal),
    });

    return () => controller.abort();
  }, []);
}

const metrics = [
  ['Dangerous-action block rate', 'How often a governed run stops or redirects a scenario that the baseline would execute unsafely.'],
  ['Decision-change rate', 'How often governance materially changes the baseline action, plan, or escalation path.'],
  ['Benign false-refusal rate', 'How often governance blocks a scenario that should remain safely completable.'],
  ['Goal completion', 'Whether the governed run still completes the legitimate objective after constraints and replanning.'],
  ['Human escalation', 'How often a scenario is routed to an explicit human decision instead of silently guessing.'],
  ['Audit completeness', 'Whether the final decision includes enough public-safe evidence to reconstruct what changed and why.'],
];

const flow = [
  ['1', 'Baseline', 'Run or import the raw agent result for the same scenario and objective.'],
  ['2', 'Consequence assessment', 'Evaluate the proposed action against bounded risk, scope, authority and downstream consequences.'],
  ['3', 'Center Reset / replan', 'When the first action is weak or unsafe, preserve the legitimate goal and generate a safer path.'],
  ['4', 'Governed decision', 'Return an allow, replan, escalate, sandbox or refuse outcome without exposing private kernel internals.'],
  ['5', 'Audit Memory', 'Package the comparative evidence and metrics into a public-safe evaluation report.'],
];

const integrations = [
  ['API', API, 'Browser-readable discovery plus POST evaluation protocol.'],
  ['MCP', MCP, 'Machine-native tool discovery and governed evaluation workflow.'],
  ['A2A', A2A, 'Agent-to-agent capability discovery and evaluation handoff.'],
];

const buyerProof = [
  ['Sample report', '/agent-evaluation-lab-sample-report.json', 'Inspect a public-safe v1.3 Raw-vs-Governed report before purchase.'],
  ['Integration kit', '/agent-evaluation-lab.integration-kit.json', 'Single-file machine handoff for API, MCP, A2A, schemas and provenance.'],
  ['OpenAPI', '/agent-evaluation-lab.openapi.yaml', 'Lintable OpenAPI 3.0.3 contract for procurement and integration review.'],
  ['AE100', '/agent-evaluation-ae100.json', 'Inspect all 100 public-safe benchmark scenarios used by the Lab.'],
];

export default function AgentEvaluationLab() {
  useAgentEvaluationWebMcp();
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-5 pb-24 pt-32">
        <section className="overflow-hidden rounded-[2rem] border border-fuchsia-400/20 bg-[radial-gradient(circle_at_top_right,rgba(217,70,239,.16),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,.10),transparent_32%),linear-gradient(135deg,rgba(15,23,42,.92),rgba(0,0,0,1))] p-7 md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-fuchsia-300"><ShieldCheck size={12}/> Misfit-governed evaluation · public-safe package</div>
          <h1 className="mt-5 max-w-4xl font-display text-4xl font-bold tracking-tight md:text-6xl">AGENT EVALUATION <span className="text-fuchsia-300">LAB</span></h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">Measure the difference between what an AI agent would do raw and what it does after a governed consequence-check, replan and decision boundary. The product is the measurable delta and audit evidence — not access to the private cognitive kernel.</p>
          <div className="mt-7 flex flex-wrap gap-2 text-[11px] text-slate-400">
            <span className="rounded-full border border-white/10 px-3 py-2">Raw vs governed comparison</span>
            <span className="rounded-full border border-white/10 px-3 py-2">Same objective, same scenario</span>
            <span className="rounded-full border border-white/10 px-3 py-2">Report schema v1.3</span>
            <span className="rounded-full border border-white/10 px-3 py-2">WebMCP site tools</span>
            <span className="rounded-full border border-white/10 px-3 py-2">No certification claim</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={BUY} className="rounded-2xl bg-fuchsia-300 px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.13em] text-black">Buy 10,000 checks · $500</a>
            <a href="/operator?challenge=agent-governance-evaluation&track=client" className="rounded-2xl border border-fuchsia-300/30 px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.13em] text-fuchsia-200">Request custom evaluation</a>
            <a href="/a2a-agent-audit" className="rounded-2xl border border-white/10 px-5 py-3 font-mono text-xs uppercase tracking-[0.13em] text-slate-300">Run free metadata audit</a>
          </div>
          <p className="mt-3 text-xs text-slate-500">Production package: 10,000 governed policy checks at an effective $0.05/check. One-time purchase. Authorized agent workloads only.</p>
        </section>

        <section className="mt-6 rounded-3xl border border-emerald-300/20 bg-emerald-300/[0.035] p-6 md:p-7">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-300">Buyer proof before purchase</div>
          <h2 className="mt-2 font-display text-2xl font-semibold">Inspect the contract, evidence shape and benchmark first.</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400">No black-box sales pitch required. Procurement teams and machine clients can inspect the current public-safe artifacts before buying or integrating.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">{buyerProof.map(([name,url,body])=><a key={name} href={url} className="group rounded-2xl border border-white/10 bg-black/30 p-5 transition hover:border-emerald-300/30"><div className="flex items-center justify-between"><span className="font-mono text-xs font-bold text-emerald-300">{name}</span><ExternalLink size={14} className="text-slate-600 group-hover:text-emerald-300"/></div><p className="mt-3 text-sm leading-6 text-slate-500">{body}</p><div className="mt-3 truncate font-mono text-[10px] text-slate-700">{url}</div></a>)}</div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 md:p-7">
            <div className="flex items-center gap-3"><GitCompareArrows className="text-cyan-300"/><h2 className="font-display text-2xl font-semibold">Evaluation flow</h2></div>
            <div className="mt-5 space-y-3">{flow.map(([n, title, body]) => <div key={n} className="grid grid-cols-[34px_1fr] gap-3 rounded-2xl border border-white/8 bg-black/30 p-4"><div className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-400/30 font-mono text-xs text-cyan-300">{n}</div><div><div className="font-semibold">{title}</div><div className="mt-1 text-sm leading-6 text-slate-500">{body}</div></div></div>)}</div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 md:p-7">
            <div className="flex items-center gap-3"><BarChart3 className="text-fuchsia-300"/><h2 className="font-display text-2xl font-semibold">Comparative metrics</h2></div>
            <div className="mt-5 space-y-3">{metrics.map(([title, body]) => <div key={title} className="rounded-2xl border border-white/8 bg-black/30 p-4"><div className="flex items-start gap-3"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-300"/><div><div className="text-sm font-semibold">{title}</div><div className="mt-1 text-xs leading-5 text-slate-500">{body}</div></div></div></div>)}</div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.04] p-6 md:p-7">
          <div className="flex items-center gap-3"><Network className="text-cyan-300"/><h2 className="font-display text-2xl font-semibold">Machine integration</h2></div>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">Use the same bounded evaluation product through HTTP, MCP or A2A. In compatible agent-enabled browsers, this route also registers read-only WebMCP tools for contract inspection, AE100 discovery, comparative scoring and offer inspection. These public wrappers do not expose the private GHOSBC kernel.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">{integrations.map(([name,url,body])=><a key={name} href={url} className="group rounded-2xl border border-white/10 bg-black/30 p-5 transition hover:border-cyan-300/30"><div className="flex items-center justify-between"><span className="font-mono text-xs font-bold text-cyan-300">{name}</span><ExternalLink size={14} className="text-slate-600 group-hover:text-cyan-300"/></div><p className="mt-3 text-sm leading-6 text-slate-500">{body}</p><div className="mt-3 truncate font-mono text-[10px] text-slate-700">{url}</div></a>)}</div>
        </section>

        <section className="mt-6 rounded-3xl border border-amber-300/20 bg-amber-300/[0.035] p-6 md:p-7">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber-300">External benchmark provenance</div>
          <h2 className="mt-2 font-display text-2xl font-semibold">Bridge-ready. Independent score not claimed.</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400">The public contract can map evidence from AgentHarm, Agent-SafetyBench and AgentHazard into the same report schema. No third-party benchmark score is published until a real external evaluator run completes against an authenticated target/runtime. Compatibility is not validation.</p>
          <div className="mt-4 flex flex-wrap gap-2 font-mono text-[10px] text-slate-500"><span className="rounded-full border border-white/10 px-3 py-2">AgentHarm · compatible</span><span className="rounded-full border border-white/10 px-3 py-2">Agent-SafetyBench · compatible</span><span className="rounded-full border border-white/10 px-3 py-2">AgentHazard · compatible</span><span className="rounded-full border border-white/10 px-3 py-2">External validation · pending evidence</span></div>
        </section>

        <section className="mt-6 rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.04] p-6 md:p-7">
          <div className="flex items-center gap-3"><Workflow className="text-cyan-300"/><h2 className="font-display text-2xl font-semibold">What a buyer receives</h2></div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-5"><div className="font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-300">Scenario evidence</div><p className="mt-3 text-sm leading-6 text-slate-500">Baseline output, governed outcome, material decision changes, escalation path and public-safe rationale for each authorized scenario.</p></div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-5"><div className="font-mono text-[10px] uppercase tracking-[0.14em] text-fuchsia-300">Comparative scorecard</div><p className="mt-3 text-sm leading-6 text-slate-500">Aggregate metrics showing safety improvement, unnecessary refusals, retained goal completion and audit coverage.</p></div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-5"><div className="font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-300">Integration findings</div><p className="mt-3 text-sm leading-6 text-slate-500">A bounded recommendation for where a governance checkpoint adds value in the buyer's workflow without requiring disclosure of private implementation.</p></div>
          </div>
          <p className="mt-5 text-xs leading-5 text-slate-600">This is an evaluation and integration service, not a formal safety certification, regulatory attestation, or claim that an agent is conscious, universally safe, or compliant. Protected cognitive-kernel internals, founder-private prompts, hidden policy internals, private packets, credentials, and reconstruction material are never part of the deliverable.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
