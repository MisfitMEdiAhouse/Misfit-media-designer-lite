import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Bot,
  BrainCircuit,
  Database,
  ExternalLink,
  FileText,
  GitBranch,
  HardDrive,
  LockKeyhole,
  Network,
  RefreshCw,
  ShieldCheck,
  Store,
  Wrench,
  Zap,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const HUB = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/misfit-agent-hub/health';
const RECOVERY_DOC = 'https://github.com/MisfitMEdiAhouse/Misfit-media-designer-lite/blob/main/docs/AGENT_CONTROL_PLANE_RECOVERY.md';
const CONTEXTFORGE = 'https://contextforge-datahub-app.vercel.app/';

const FALLBACK = {
  healthy: false,
  agents: [
    { slug: 'agent-revenue-factory', name: 'Agent Revenue Factory', category: 'orchestration', status: 'private', security_class: 'private', summary: 'Private autonomous portfolio operator for machine discovery, product health, real revenue and safe deployment.', capabilities: ['machine discovery', 'revenue verification', 'safe autonomous deployment'] },
    { slug: 'ghosbc-agent-brain-hub', name: 'GHOSBC OS – Agent Brain Hub', category: 'security_runtime', status: 'private', security_class: 'private', summary: 'Private GHOSBC governance runtime.', capabilities: ['Castle Gate', 'approval gates', 'runtime validation', 'sentinel orchestration'] },
    { slug: 'misfit-shield-sentinel', name: 'Misfit Shield – GHOSBC Sentinel', category: 'security_runtime', status: 'private', security_class: 'private', summary: 'Private defensive sentinel interface.', capabilities: ['outbound shielding', 'tripwires', 'threat visualization'] },
    { slug: 'ghosbc-safety-gate', name: 'GHOSBC Safety Gate', category: 'agent_security', status: 'active', security_class: 'public', summary: 'Public governance boundary for agent requests, MCP dependencies and consequential actions.', public_url: 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-safety-gate', mcp_url: 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-safety-gate-mcp', capabilities: ['request screening', 'dependency audit', 'tool screening', 'action gating'] },
    { slug: 'changepacket', name: 'ChangePacket', category: 'agent_infrastructure', status: 'active', security_class: 'public', summary: 'Change memory for public webpages and MCP tool surfaces.', public_url: 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/deltafeed', mcp_url: 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/changepacket-mcp', capabilities: ['web diffs', 'MCP surface diffs', 'MCP App UI'] },
    { slug: 'shopify-agentic-audit', name: 'Misfit Shopify Agentic Audit', category: 'agent_security', status: 'active', security_class: 'public', summary: 'Public-metadata-only Shopify UCP/MCP readiness and tool-surface audit.', public_url: 'https://misfitmediahouse.com/shopify-ai-audit', capabilities: ['Shopify UCP discovery', 'Storefront MCP audit', 'Safety Gate screening'] },
    { slug: 'misfit-machine-store', name: 'Misfit Machine Store', category: 'machine_commerce', status: 'active', security_class: 'public', summary: 'UCP-compatible catalog and MCP storefront for Misfit machine products.', public_url: 'https://misfitmediahouse.com/.well-known/ucp', mcp_url: 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/misfit-machine-store-mcp', capabilities: ['UCP catalog', 'MCP catalog', 'machine discovery'] },
    { slug: 'contextforge', name: 'ContextForge', category: 'agent_infrastructure', status: 'active', security_class: 'public', summary: 'Metadata-aware code generation and change governance grounded in DataHub context.', public_url: CONTEXTFORGE, capabilities: ['DataHub context', 'blast-radius reasoning', 'governed generation', 'decision memory'] },
  ],
  health: {}
};

const healthLabels = {
  ucp_profile: 'UCP profile',
  changepacket_mcp: 'ChangePacket MCP',
  safety_gate_mcp: 'Safety Gate MCP',
  machine_store_mcp: 'Machine Store MCP',
  contextforge: 'ContextForge',
};

const iconFor = (category) => {
  if (category === 'security_runtime') return BrainCircuit;
  if (category === 'agent_security') return ShieldCheck;
  if (category === 'machine_commerce') return Store;
  if (category === 'orchestration') return Network;
  return Bot;
};

const manifestToData = (manifest) => {
  const stack = Array.isArray(manifest?.stack) ? manifest.stack : [];
  if (!stack.length) return FALLBACK;
  const agents = stack.map((item, index) => {
    const privateMode = String(item.class || '').startsWith('private');
    const lower = String(item.class || '').toLowerCase();
    const category = lower.includes('security') ? (privateMode ? 'security_runtime' : 'agent_security') : lower.includes('commerce') ? 'machine_commerce' : lower.includes('orchestration') ? 'orchestration' : 'agent_infrastructure';
    return {
      slug: String(item.name || `agent-${index}`).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      name: item.name || 'Misfit agent',
      category,
      status: privateMode ? 'private' : 'active',
      security_class: privateMode ? 'private' : 'public',
      summary: item.summary || 'Public-safe recovery entry.',
      public_url: item.product || item.ucp || item.public_endpoint || null,
      mcp_url: item.mcp || null,
      capabilities: [],
    };
  });
  return { ...FALLBACK, agents };
};

function StatusPill({ agent }) {
  const privateMode = agent.security_class === 'private';
  return <span className={`rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] ${privateMode ? 'border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-300' : 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'}`}>{privateMode ? 'private core' : agent.status}</span>;
}

function AgentCard({ agent }) {
  const Icon = iconFor(agent.category);
  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-2.5 text-cyan-300"><Icon size={20} /></div>
          <div>
            <div className="font-display text-lg font-semibold text-white">{agent.name}</div>
            <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-600">{agent.category?.replaceAll('_', ' ')}</div>
          </div>
        </div>
        <StatusPill agent={agent} />
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-400">{agent.summary}</p>
      {!!agent.capabilities?.length && <div className="mt-4 flex flex-wrap gap-2">{agent.capabilities.map((c) => <span key={c} className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-slate-400">{c}</span>)}</div>}
      {agent.security_class === 'public' && (agent.public_url || agent.mcp_url) && (
        <div className="mt-5 flex flex-wrap gap-3 border-t border-white/5 pt-4 font-mono text-[10px] uppercase tracking-[0.12em]">
          {agent.public_url && <a href={agent.public_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-cyan-300 hover:text-cyan-200"><ExternalLink size={12}/> Product</a>}
          {agent.mcp_url && <a href={agent.mcp_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-emerald-300 hover:text-emerald-200"><Network size={12}/> MCP</a>}
        </div>
      )}
    </article>
  );
}

function HealthGrid({ health }) {
  const entries = Object.entries(health || {});
  if (!entries.length) return <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-200">Live health is unavailable. The static GitHub/Vercel recovery manifest remains usable.</div>;
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{entries.map(([key, value]) => <div key={key} className="rounded-2xl border border-white/10 bg-black/30 p-4"><div className="flex items-center justify-between gap-2"><div className="font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">{healthLabels[key] || key.replaceAll('_', ' ')}</div><span className={`h-2.5 w-2.5 rounded-full ${value?.ok ? 'bg-emerald-300' : 'bg-rose-300'}`}/></div><div className={`mt-3 text-sm font-semibold ${value?.ok ? 'text-emerald-200' : 'text-rose-200'}`}>{value?.ok ? 'ONLINE' : 'DEGRADED'}</div><div className="mt-1 font-mono text-[9px] text-slate-600">{value?.status || '—'} · {value?.latency_ms ?? '—'} ms</div></div>)}</div>;
}

export default function AgentControlPlane() {
  const [data, setData] = useState(FALLBACK);
  const [mode, setMode] = useState('loading');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    setMode('loading');
    fetch(HUB, { headers: { accept: 'application/json' }, cache: 'no-store' })
      .then((r) => { if (!r.ok) throw new Error('hub unavailable'); return r.json(); })
      .then((d) => { if (active) { setData(d); setMode('live'); } })
      .catch(async () => {
        try {
          const r = await fetch('/agent-stack.json', { cache: 'no-store' });
          if (!r.ok) throw new Error('manifest unavailable');
          const manifest = await r.json();
          if (active) { setData(manifestToData(manifest)); setMode('fallback'); }
        } catch {
          if (active) { setData(FALLBACK); setMode('embedded'); }
        }
      });
    return () => { active = false; };
  }, [refreshKey]);

  const health = data.health || {};
  const online = useMemo(() => Object.values(health).filter((v) => v?.ok).length, [health]);
  const totalHealth = Object.keys(health).length;
  const liveHealthy = mode === 'live' && data.healthy;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 pb-24 pt-32">
        <section className="relative overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.12),transparent_35%),linear-gradient(135deg,rgba(15,23,42,.9),rgba(0,0,0,1))] p-7 md:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300">Durable control plane</span>
                <span className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] ${liveHealthy ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' : 'border-amber-400/30 bg-amber-400/10 text-amber-300'}`}>{mode === 'live' ? (data.healthy ? 'live + healthy' : 'live / degraded') : mode === 'loading' ? 'checking live state' : `${mode} recovery`}</span>
              </div>
              <h1 className="mt-5 font-display text-4xl font-bold tracking-tight md:text-6xl">MISFIT <span className="text-cyan-300">AGENT CONTROL PLANE</span></h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">The machine stack lives in durable infrastructure—not inside one chat feed. Supabase carries canonical runtime state, GitHub carries source + recovery metadata, Vercel carries the public control surface, and private GHOSBC/Castle Gate systems stay sealed behind the boundary.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => setRefreshKey((x) => x + 1)} className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-200"><RefreshCw size={12}/> Refresh health</button>
                <a href={RECOVERY_DOC} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-300"><FileText size={12}/> Recovery guide</a>
              </div>
            </div>
            <div className="grid min-w-[280px] grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><Activity className="text-emerald-300" size={18}/><div className="mt-3 font-display text-3xl font-bold">{totalHealth ? `${online}/${totalHealth}` : 'SAFE'}</div><div className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-600">live checks / fallback ready</div></div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><LockKeyhole className="text-fuchsia-300" size={18}/><div className="mt-3 font-display text-3xl font-bold">SEALED</div><div className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-600">private GHOSBC core</div></div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-4"><div><div className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-400">Runtime pulse</div><h2 className="mt-2 font-display text-2xl font-bold">Public-safe health</h2></div>{data.health_checked_at && <div className="hidden font-mono text-[9px] text-slate-700 sm:block">{new Date(data.health_checked_at).toLocaleString()}</div>}</div>
          <HealthGrid health={health} />
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-4">
          {[
            { icon: Database, title: '1 · Misfit Cloud', body: 'Canonical registry, private recovery notes, telemetry, fulfillment state and edge runtimes.', tone: 'text-cyan-300' },
            { icon: GitBranch, title: '2 · GitHub', body: 'Versioned source, static manifest, MCP registry metadata and a public-safe recovery guide.', tone: 'text-emerald-300' },
            { icon: HardDrive, title: '3 · Vercel + site', body: 'misfitmediahouse.com remains the human control surface and static fallback if the live hub is unavailable.', tone: 'text-amber-300' },
            { icon: LockKeyhole, title: '4 · Private core', body: 'GHOSBC Agent Brain, Castle Gate, Sentinel/Shield and operator recovery data stay outside the public surface.', tone: 'text-fuchsia-300' },
          ].map(({ icon: Icon, title, body, tone }) => <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"><Icon className={tone} size={20}/><h2 className="mt-3 font-display text-lg font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{body}</p></div>)}
        </section>

        <section className="mt-10 grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-fuchsia-400/15 bg-fuchsia-400/[0.035] p-6"><ShieldCheck className="text-fuchsia-300" size={22}/><div className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-fuchsia-300">Security architecture</div><h2 className="mt-2 font-display text-2xl font-semibold">Castle Gate inside. Safety Gate outside.</h2><p className="mt-3 text-sm leading-6 text-slate-400">Private security logic never needs to be handed to outside agents. Public systems consume bounded ALLOW / REVIEW / BLOCK decisions, sanitization, dependency checks and audit receipts.</p></div>
          <a href={CONTEXTFORGE} target="_blank" rel="noreferrer" className="rounded-3xl border border-cyan-400/15 bg-cyan-400/[0.035] p-6 hover:border-cyan-400/35"><Zap className="text-cyan-300" size={22}/><div className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300">ContextForge node</div><h2 className="mt-2 font-display text-2xl font-semibold">Know what a change can break before an agent ships it.</h2><p className="mt-3 text-sm leading-6 text-slate-400">DataHub context, blast-radius reasoning, governed code generation, approval boundaries and decision memory are preserved as a first-class Misfit machine asset.</p><div className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-cyan-200">Open ContextForge <ExternalLink size={12}/></div></a>
          <a href="/shopify-ai-audit" className="rounded-3xl border border-emerald-400/15 bg-emerald-400/[0.035] p-6 hover:border-emerald-400/35"><Store className="text-emerald-300" size={22}/><div className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-300">Agentic commerce wedge</div><h2 className="mt-2 font-display text-2xl font-semibold">Shopify storefronts are becoming machine surfaces.</h2><p className="mt-3 text-sm leading-6 text-slate-400">The audit checks public UCP/MCP readiness and screens exposed tool metadata without executing carts, checkouts, orders, payments or credentials.</p><div className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-emerald-200">Run Shopify audit <ExternalLink size={12}/></div></a>
        </section>

        <section className="mt-12">
          <div className="flex items-end justify-between gap-4"><div><div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-400">Canonical inventory</div><h2 className="mt-2 font-display text-3xl font-bold">Agents + machine products</h2></div><a href="/agent-stack.json" className="hidden sm:inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400 hover:text-white"><ExternalLink size={12}/> static manifest</a></div>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">{(data.agents || FALLBACK.agents).map((agent) => <AgentCard key={agent.slug || agent.name} agent={agent} />)}</div>
        </section>

        <section className="mt-12 rounded-3xl border border-white/10 bg-white/[0.025] p-6 md:p-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-400">Recovery + machine entry points</div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ['UCP business profile', '/.well-known/ucp'],
              ['Agent-readable context', '/llms.txt'],
              ['Static recovery manifest', '/agent-stack.json'],
              ['Live health API', HUB],
              ['Shopify agentic audit', '/shopify-ai-audit'],
              ['Public recovery guide', RECOVERY_DOC],
            ].map(([label, href]) => <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="rounded-2xl border border-white/10 bg-black/30 p-4 hover:border-cyan-400/30"><div className="text-sm font-semibold text-white">{label}</div><div className="mt-2 break-all font-mono text-[9px] text-slate-600">{href}</div></a>)}
          </div>
          <div className="mt-5 rounded-2xl border border-fuchsia-400/15 bg-fuchsia-400/5 p-4 text-sm leading-6 text-slate-400"><strong className="text-fuchsia-200">Private recovery stays private.</strong> This page intentionally does not publish credentials, financial destination details, private GHOSBC prompts, cipher/mapping internals, secret policy tables or runtime reconstruction material.</div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
