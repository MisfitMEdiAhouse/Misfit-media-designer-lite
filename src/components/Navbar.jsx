import { BrainCircuit, ChevronDown, Cloud, Cpu, Menu, Network, ShieldCheck, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const primaryItems = [
  ['/', 'Scanner'],
  ['/agency', 'Agency'],
  ['/portfolio', 'Portfolio'],
];

const misfitFamilies = [
  { href: '/explore#cloud', label: 'Misfit Cloud', note: 'Protected control plane', icon: Cloud },
  { href: '/explore#engines', label: 'Misfit Engines', note: 'Products + revenue tools', icon: Cpu },
  { href: '/explore#governance', label: 'Misfit Governance', note: 'Public-safe decisions', icon: ShieldCheck },
  { href: '/explore#ai2ai', label: 'Misfit AI ↔ AI', note: 'Machine-facing channels', icon: Network },
  { href: '/explore#brain', label: 'GHOSBC OS · API Brain', note: 'Sealed private core', icon: BrainCircuit },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  const active = (href) => href === '/' ? pathname === '/' || pathname === '/scrub' : pathname.startsWith(href);
  const exploreActive = pathname === '/explore' || pathname === '/products' || pathname === '/agents' || pathname === '/a2a-agent-audit' || pathname === '/shopify-ai-audit';

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to="/" className="font-display text-lg font-bold text-white" onClick={() => setMobileOpen(false)}>
          MISFIT<span className="text-cyan-400">.</span>
        </Link>

        <div className="hidden items-center gap-7 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400 md:flex">
          <Link to="/" className={active('/') ? 'text-cyan-300' : 'transition hover:text-white'}>Scanner</Link>
          <div className="group relative py-2">
            <Link to="/explore" className={`inline-flex items-center gap-1.5 transition hover:text-white ${exploreActive ? 'text-cyan-300' : ''}`}>
              Explore Misfit <ChevronDown size={13} aria-hidden="true" />
            </Link>
            <div className="invisible absolute left-1/2 top-full w-[680px] -translate-x-1/2 translate-y-2 rounded-3xl border border-white/10 bg-[#07090b]/95 p-3 opacity-0 shadow-2xl shadow-cyan-950/20 backdrop-blur-2xl transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <div className="grid grid-cols-2 gap-1">
                {misfitFamilies.map(({ href, label, note, icon: Icon }, index) => (
                  <a key={href} href={href} className={`flex items-start gap-3 rounded-2xl p-4 text-left normal-case tracking-normal transition hover:bg-white/[0.06] ${index === 4 ? 'col-span-2' : ''}`}>
                    <span className="rounded-xl border border-cyan-400/15 bg-cyan-400/[0.07] p-2 text-cyan-300"><Icon size={17} /></span>
                    <span><span className="block font-display text-base font-semibold text-white">{label}</span><span className="mt-1 block text-[11px] leading-5 text-slate-600">{note}</span></span>
                  </a>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between rounded-2xl border border-white/5 bg-black/40 px-4 py-3 normal-case tracking-normal">
                <span className="text-[11px] text-slate-600">One public house. Protected operating layers.</span>
                <Link to="/products" className="font-mono text-[9px] uppercase tracking-[0.13em] text-cyan-300">All products →</Link>
              </div>
            </div>
          </div>
          {primaryItems.slice(1).map(([href, label]) => (
            <Link key={href} to={href} className={active(href) ? 'text-cyan-300' : 'transition hover:text-white'}>{label}</Link>
          ))}
        </div>

        <Link to="/" className="hidden rounded-full border border-cyan-300/40 px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-200 transition hover:bg-cyan-300 hover:text-black md:inline-flex">
          Scan a site
        </Link>
        <button
          type="button"
          className="text-slate-200 md:hidden"
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((value) => !value)}
        >
          {mobileOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="max-h-[calc(100svh-65px)] overflow-y-auto border-t border-white/10 bg-black/95 px-5 py-4 md:hidden">
          <div className="font-mono text-xs uppercase tracking-[0.14em] text-slate-300">
            <Link to="/" onClick={() => setMobileOpen(false)} className={`block rounded-xl px-3 py-3 ${active('/') ? 'bg-cyan-300/10 text-cyan-300' : 'hover:bg-white/5'}`}>Scanner</Link>
            <div className="mt-2 rounded-2xl border border-white/10 bg-white/[0.025] p-2">
              <Link to="/explore" onClick={() => setMobileOpen(false)} className={`flex items-center justify-between rounded-xl px-3 py-3 ${exploreActive ? 'text-cyan-300' : 'text-white'}`}>
                Explore Misfit <span aria-hidden="true">→</span>
              </Link>
              <div className="grid grid-cols-2 gap-1 border-t border-white/5 pt-2">
                {misfitFamilies.map(({ href, label, icon: Icon }, index) => (
                  <a key={href} href={href} onClick={() => setMobileOpen(false)} className={`flex min-h-[74px] flex-col justify-between rounded-xl p-3 text-[9px] leading-4 text-slate-400 hover:bg-white/5 hover:text-cyan-300 ${index === 4 ? 'col-span-2 min-h-0 flex-row items-center' : ''}`}>
                    <Icon size={15} className="text-cyan-300" /><span className={index === 4 ? 'ml-3 flex-1' : 'mt-3'}>{label}</span>
                  </a>
                ))}
              </div>
            </div>
            {primaryItems.slice(1).map(([href, label]) => (
              <Link key={href} to={href} onClick={() => setMobileOpen(false)} className={`mt-2 block rounded-xl px-3 py-3 ${active(href) ? 'bg-cyan-300/10 text-cyan-300' : 'hover:bg-white/5'}`}>{label}</Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
