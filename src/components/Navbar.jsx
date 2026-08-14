import { Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <a href="/" className="font-display text-lg font-bold text-white">MISFIT<span className="text-cyan-400">.</span></a>
        <div className="hidden md:flex items-center gap-5 font-mono text-xs uppercase tracking-[0.14em] text-slate-300">
          <a href="/agents">Agent Network</a>
          <a href="/shopify-ai-audit">Shopify AI Audit</a>
          <a href="/misfit-ai-v2">Misfit AI V2</a>
          <a href="/#offers">Products</a>
          <a href="/proof">Portfolio</a>
          <a href="/enterprise-ai">Enterprise AI</a>
        </div>
        <a href="/#request-demo" className="hidden md:inline-flex rounded-full bg-cyan-400 px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] font-semibold text-black">Work With Misfit</a>
        <a href="/agents" className="md:hidden text-slate-200" aria-label="Open agent network"><Menu size={22}/></a>
      </nav>
    </header>
  );
}
