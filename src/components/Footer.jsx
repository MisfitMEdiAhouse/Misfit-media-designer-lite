import { LockKeyhole } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-10">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="font-display text-xl font-bold text-white">MISFIT<span className="text-cyan-400">.</span></div>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">AI revenue systems, machine commerce, agent infrastructure, enterprise agent-control pilots, and creator-commerce systems. Built by Misfit Mediahouse.</p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-3 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
            <a href="/agents">Agent Network</a>
            <a href="/">Revenue AI</a>
            <a href="/proof">Proof</a>
            <a href="/enterprise-ai">Enterprise AI</a>
            <a href="/creator-commerce">Creator Commerce</a>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
          <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-700">© 2026 Misfit Mediahouse</div>
          <a href="/command" className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-700 hover:text-amber-300"><LockKeyhole size={11}/> Owner</a>
        </div>
      </div>
    </footer>
  );
}
