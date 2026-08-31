import TraderGTALane from './TraderGTALane.jsx';
import TraderNetworkLane from './TraderNetworkLane.jsx';

export default function Footer() {
  const onTrader = typeof window !== 'undefined' && window.location.pathname === '/signal';
  return (
    <>
      {onTrader&&<div className="bg-black"><div className="mx-auto max-w-7xl px-4 sm:px-5"><TraderNetworkLane/><TraderGTALane/></div></div>}
      <footer className="border-t border-white/10 bg-black py-10">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <div className="font-display text-xl font-bold text-white">MISFIT<span className="text-cyan-400">.</span></div>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">Business diagnostics, websites, AI revenue systems, commerce, custom software, governed agents, competition builds, and managed growth.</p>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-3 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
              <a href="/">Scanner</a>
              <a href="/explore">Explore Misfit</a>
              <a href="/agency">Agency</a>
              <a href="/portfolio">Portfolio</a>
              <a href="/competitions">Competitions</a>
              <a href="/operator">Hire + Partner</a>
              <a href="/products">Products</a>
              <a href="/field-notes">Field Notes</a>
            </div>
          </div>
          <div className="mt-8 grid gap-5 border-t border-white/5 pt-6 md:grid-cols-[1fr_auto] md:items-center">
            <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-700">© 2026 Misfit Mediahouse · Build in public. Keep the kernel private.</div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-[9px] uppercase tracking-[0.13em] text-slate-500">
              <a href="https://github.com/MisfitMEdiAhouse" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://www.linkedin.com/in/misfit-mediahouse-undefined-31a235431" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://x.com/misfitmediahous" target="_blank" rel="noopener noreferrer">X</a>
              <a href="https://www.instagram.com/misfit_mediahouse/" target="_blank" rel="noopener noreferrer">Instagram</a>
              <span title="Discord username">Discord @misfitmediahouse</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
