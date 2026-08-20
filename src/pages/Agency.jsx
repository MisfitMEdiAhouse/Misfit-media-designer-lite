import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';

const services = [
  {
    key: 'website_ai_launch',
    label: 'Launch service',
    name: 'SnapSite Website + AI Activation',
    price: '$1,500 once',
    copy: 'A conversion-focused site, AI intake where it makes sense, launch support, and the measurement foundation connected from day one.',
  },
  {
    key: 'managed_growth',
    label: 'Managed service',
    name: 'Growth Partner / Managed Marketing',
    price: '$997/mo',
    copy: 'Ongoing campaign, offer, conversion, attribution, content, follow-up, and growth operations around the business.',
  },
  {
    key: 'custom',
    label: 'Custom build',
    name: 'Full-stack systems',
    price: 'Scoped to the build',
    copy: 'Commerce, marketplaces, lead systems, internal tools, AI workflows, integrations, and the infrastructure needed to run them.',
  },
];

export default function Agency() {
  const [links, setLinks] = useState({});
  const [email, setEmail] = useState('');

  useEffect(() => {
    document.title = 'Misfit Agency | Websites, AI + Growth Systems';
    Promise.all([
      fetch('/offers.json').then((response) => response.json()),
      fetch('/contact.json').then((response) => response.json()),
    ]).then(([offers, contact]) => {
      setLinks(offers || {});
      setEmail(contact?.email || '');
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-24">
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="relative mx-auto max-w-7xl px-5 py-16 sm:py-24">
            <div className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-300">The agency</div>
            <h1 className="mt-5 max-w-6xl font-display text-[clamp(3.3rem,10vw,7.5rem)] font-bold uppercase leading-[0.84] tracking-[-0.055em]">
              The scanner finds the leaks.
              <span className="block text-cyan-300">Misfit fixes them.</span>
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-400">
              Strategy, design, code, automation, AI, commerce, and growth operations under one roof—without pretending every business needs the same subscription.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="grid gap-4 lg:grid-cols-3">
            {services.map((service) => {
              const href = service.key === 'custom'
                ? (email ? `mailto:${email}?subject=Custom%20Misfit%20Build` : '/portfolio')
                : links[service.key];
              return (
                <article key={service.key} className="flex min-h-[360px] flex-col rounded-3xl border border-white/10 bg-white/[0.025] p-7">
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber-300">{service.label}</div>
                  <h2 className="mt-4 font-display text-3xl font-bold">{service.name}</h2>
                  <div className="mt-3 font-mono text-xs uppercase tracking-[0.12em] text-cyan-300">{service.price}</div>
                  <p className="mt-5 text-sm leading-7 text-slate-400">{service.copy}</p>
                  <div className="mt-6 space-y-2 text-xs text-slate-500">
                    {['Clear scope', 'Human-approved launch', 'Built on the right stack'].map((item) => (
                      <div key={item} className="flex items-center gap-2"><CheckCircle2 size={14} className="text-cyan-300" /> {item}</div>
                    ))}
                  </div>
                  {href && (
                    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined} className="mt-auto inline-flex items-center gap-2 pt-8 font-mono text-[11px] font-semibold uppercase tracking-[0.13em] text-cyan-300">
                      Start here <ArrowRight size={14} />
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.02]">
          <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-5 py-12 sm:flex-row sm:items-center">
            <div>
              <div className="font-display text-3xl font-bold uppercase">Start with evidence.</div>
              <p className="mt-2 text-sm text-slate-500">Run the free scan before buying anything.</p>
            </div>
            <a href="/" className="inline-flex rounded-full bg-cyan-300 px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.13em] text-black">Scan my site</a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
