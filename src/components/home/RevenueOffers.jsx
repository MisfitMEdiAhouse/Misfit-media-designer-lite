const offers = [
  ['Website + AI Launch', '$1,500 one-time'],
  ['Misfit AI Lead Engine', '$297/mo'],
  ['Managed Growth', '$997/mo'],
];

export default function RevenueOffers() {
  return (
    <section id="offers" className="border-t border-white/5 py-16">
      <div className="mx-auto max-w-7xl px-5">
        <div className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-300">THREE WAYS TO START</div>
        <h2 className="mt-4 font-display text-4xl sm:text-6xl font-bold uppercase">Buy the outcome you need.</h2>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {offers.map(([name, price]) => (
            <article key={name} className="rounded-2xl border border-white/10 bg-white/[0.025] p-7">
              <h3 className="font-display text-2xl font-bold">{name}</h3>
              <div className="mt-2 font-mono text-xs uppercase tracking-[0.12em] text-cyan-300">{price}</div>
              <p className="mt-4 text-sm leading-6 text-slate-400">Scoped around measurable business outcomes, not another pile of software.</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
