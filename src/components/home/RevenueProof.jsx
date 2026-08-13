const builds = [
  'Home Efficiency Pros',
  'NexGrid Energy',
  'ContextForge',
  'Weber Junk Rescue',
  'Off-Grid Water',
  'IALS Turbine Logistics',
];

export default function RevenueProof() {
  return (
    <section id="proof" className="border-t border-white/5 py-16">
      <div className="mx-auto max-w-7xl px-5">
        <div className="font-mono text-xs uppercase tracking-[0.28em] text-amber-300">PROOF</div>
        <h2 className="mt-4 font-display text-4xl sm:text-6xl font-bold uppercase">Open the work.</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {builds.map((name) => (
            <div key={name} className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
              <div className="font-display text-xl font-bold">{name}</div>
              <p className="mt-2 text-sm text-slate-400">Built by Misfit Mediahouse.</p>
            </div>
          ))}
        </div>
        <a href="/proof" className="mt-7 inline-flex rounded-full border border-white/15 px-5 py-3 font-mono text-xs uppercase tracking-[0.15em]">Full portfolio →</a>
      </div>
    </section>
  );
}
