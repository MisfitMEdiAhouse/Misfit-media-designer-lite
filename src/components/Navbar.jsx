import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  ['/agents', 'Agent Network'],
  ['/shopify-ai-audit', 'Shopify AI Audit'],
  ['/misfit-ai-v2', 'Misfit AI V2'],
  ['/#offers', 'Products + Services'],
  ['/proof', 'Portfolio'],
  ['/enterprise-ai', 'Enterprise AI'],
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <a href="/" className="font-display text-lg font-bold text-white">MISFIT<span className="text-cyan-400">.</span></a>
        <div className="hidden md:flex items-center gap-5 font-mono text-xs uppercase tracking-[0.14em] text-slate-300">
          {navItems.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </div>
        <a href="/#request-demo" className="hidden md:inline-flex rounded-full bg-cyan-400 px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] font-semibold text-black">Work With Misfit</a>
        <button type="button" className="md:hidden text-slate-200" aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileOpen} onClick={() => setMobileOpen((v) => !v)}>
          {mobileOpen ? <X size={22}/> : <Menu size={22}/>} 
        </button>
      </nav>
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/95 px-5 pb-5 pt-3">
          <div className="flex flex-col gap-1 font-mono text-xs uppercase tracking-[0.14em] text-slate-300">
            {navItems.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-3 hover:bg-white/5">{label}</a>
            ))}
            <a href="/#request-demo" onClick={() => setMobileOpen(false)} className="mt-2 rounded-full bg-cyan-400 px-4 py-3 text-center font-semibold text-black">Work With Misfit</a>
          </div>
        </div>
      )}
    </header>
  );
}
