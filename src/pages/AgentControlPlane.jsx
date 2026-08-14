import { useEffect, useMemo, useState } from 'react';
import { Activity, Bot, BrainCircuit, ExternalLink, LockKeyhole, Network, ShieldCheck, Store, Wrench } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const HUB = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/misfit-agent-hub/health';

const FALLBACK = {
  healthy: false,
  agents: [
    { slug: 'ghosbc-agent-brain-hub', name: 'GHOSBC OS – Agent Brain Hub', category: 'security_runtime', status: 'private', security_class: 'private', summary: 'Private GHOSBC governance runtime.', capabilities: ['Castle Gate', 'approval gates', 'runtime validation'] },
    { slug: 'misfit-shield-sentinel', name: 'Misfit Shield – GHOSBC Sentinel', category: 'security_runtime', status: 'private', security_class: 'private', summary: 'Private defensive sentinel interface.', capabilities: ['outbound shielding', 'tripwires', 'threat visualization'] },
    { slug: 'ghosbc-safety-gate', name: 'GHOSBC Safety Gate', category: 'agent_security', status: 'active', security_class: 'public', summary: 'Public governance boundary for agents and MCP dependencies.', public_url: 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-safety-gate', mcp_url: 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-safety-gate-mcp', capabilities: ['request screening', 'tool screening', 'action gating'] },
    { slug: 'changepacket', name: 'ChangePacket', category: 'agent_infrastructure', status: 'active', security_class: 'public', summary: 'Change memory for webpages and MCP tool surfaces.', public_url: 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/deltafeed', mcp_url: 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/changepacket-mcp', capabilities: ['web diffs', 'MCP surface diffs', 'MCP App UI'] },
    { slug: 'misfit-machine-store', name: 'Misfit Machine Store', category: 'machine_commerce', status: 'active', security_class: 'public', summary: 'UCP-compatible catalog for Misfit machine products.', public_url: 'https://misfitmediahouse.com/.well-known/ucp', mcp_url: 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/misfit-machine-store-mcp', capabilities: ['UCP catalog', 'MCP catalog', 'machine discovery'] },
    { slug: 'contextforge', name: 'ContextForge', category: 'agent_infrastructure', status: 'active', security_class: 'public', summary: 'Metadata-aware code generation grounded in DataHub context.', public_url: 'https://contextforge-datahub-app.vercel.app/', capabilities: ['DataHub context', 'metadata-aware generation'] },
  ],
  health: {}
};

const iconFor = (category) => {
  if (category === 'security_runtime') return BrainCircuit;
  if (category === 'agent_security') return ShieldCheck;
  if (category === 'machine_commerce') return Store;
  if (category === 'orchestration') return Network;
  return Bot;
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

export default function AgentControlPlane() {
  const [data, setData] = useState(FALLBACK);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(HUB, { headers: { accept: 'application/json' } })
      .then((r) => { if (!r.ok) throw new Error('hub unavailable'); return r.json(); })
      .then((d) => { if (active) { setData(d); setLive(true); } })
      .catch(() => fetch('/agent-stack.json').then((r) => r.json()).catch(() => null));
    return () => { active = false; };
  }, []);

  const health = data.health || {};
  const online = useMemo(() => Object.values(health).filter((v) => v?.ok).length, [health]);
  const totalHealth = Object.keys(health).length;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 pb-24 pt-32">
        <section className="relative overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.12),transparent_35%),linear-gradient(135deg,rgba(15,23,42,.9),rgba(0,0,0,1))] p-7 md:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300">Durable control plane</span>
                <span className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] ${live && data.healthy ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' : 'border-amber-400/30 bg-amber-400/10 text-amber-300'}`}>{live ? (data.healthy ? 'live + healthy' : 'live / degraded') : 'static fallback'}</span>
              </div>
              <h1 className="mt-5 font-display text-4xl font-bold tracking-tight md:text-6xl">MISFIT <span className="text-cyan-300">AGENT CONTROL PLANE</span></h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">The machine stack lives here now—not inside one chat thread. Public endpoints, private security runtimes, commerce rails, ContextForge, and recovery anchors are inventoried in durable infrastructure.</p>
            </div>
            <div className="grid min-w-[260px] grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><Activity className="text-emerald-300" size={18}/><div className="mt-3 font-display text-3xl font-bold">{totalHealth ? `${online}/${totalHealth}` : '—'}</div><div className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-600">live systems</div></div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><LockKeyhole className="text-fuchsia-300" size={18}/><div className="mt-3 font-display text-3xl font-bold">SEALED</div><div className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-600">private GHOSBC core</div></div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"><ShieldCheck className="text-cyan-300" size={20}/><h2 className="mt-3 font-display text-lg font-semibold">Castle Gate inside, Safety Gate outside</h2><p className="mt-2 text-sm leading-6 text-slate-500">Private governance stays private. Public agents receive bounded decisions and sanitized outputs instead of GHOSBC internals.</p></div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"><Wrench className="text-emerald-300" size={20}/><h2 className="mt-3 font-display text-lg font-semibold">Recovery without chat memory</h2><p className="mt-2 text-sm leading-6 text-slate-500">Supabase holds the canonical inventory; GitHub/Vercel publish a static fallback manifest; Base44 remains the private security workspace.</p></div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"><Store className="text-amber-300" size={20}/><h2 className="mt-3 font-display text-lg font-semibold">Machine commerce native</h2><p className="mt-2 text-sm leading-6 text-slate-500">UCP, MCP Registry, MCP Apps, llms.txt, and the Misfit Machine Store expose products to agents without requiring human sales calls.</p></div>
        </section>

        <section className="mt-12">
          <div className="flex items-end justify-between gap-4"><div><div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-400">Canonical inventory</div><h2 className="mt-2 font-display text-3xl font-bold">Agents + machine products</h2></div><a href="/agent-stack.json" className="hidden sm:inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400 hover:text-white"><ExternalLink size={12}/> static manifest</a></div>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">{(data.agents || FALLBACK.agents).map((agent) => <AgentCard key={agent.slug || agent.name} agent={agent} />)}</div>
        </section>

        <section className="mt-12 rounded-3xl border border-white/10 bg-white/[0.025] p-6 md:p-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-400">Machine entry points</div>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {[
              ['UCP business profile', '/.well-known/ucp'],
              ['Agent-readable context', '/llms.txt'],
              ['Static recovery manifest', '/agent-stack.json'],
              ['Live health API', HUB],
            ].map(([label, href]) => <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="rounded-2xl border border-white/10 bg-black/30 p-4 hover:border-cyan-400/30"><div className="text-sm font-semibold text-white">{label}</div><div className="mt-2 break-all font-mono text-[9px] text-slate-600">{href}</div></a>)}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
