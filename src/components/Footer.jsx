export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-10">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="font-display text-xl font-bold text-white">MISFIT<span className="text-cyan-400">.</span></div>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">Business diagnostics, websites, AI revenue systems, commerce, custom software, and managed growth.</p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-3 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
            <a href="/">Scanner</a>
            <a href="/explore">Explore Misfit</a>
            <a href="/agency">Agency</a>
            <a href="/portfolio">Portfolio</a>
            <a href="/operator">Hire + Partner</a>
            <a href="/products">Products</a>
            <a href="/field-notes">Field Notes</a>
          </div>
        </div>
        <div className="mt-8 border-t border-white/5 pt-6">
          <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-700">© 2026 Misfit Mediahouse</div>
        </div>
      </div>
    </footer>
  );
}
