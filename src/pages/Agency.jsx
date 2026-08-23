import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';

const services = [
  {
    key: 'snapsite_starter',
    label: 'Easy entry',
    name: 'SnapSite Starter',
    price: '$297 once',
    copy: 'A finished mobile-first business website with up to five pages, launch QA, custom-domain setup, and the first year of one standard domain up to $25.',
    bullets: ['48-hour live preview available', 'Client owns the finished site', 'No unlimited future edits included'],
  },
  {
    key: 'website_care',
    label: 'Optional recurring care',
    name: 'Website Care + Conversion Support',
    price: '$97/mo',
    copy: 'For owners who want Misfit to keep an eye on the site instead of managing every little change themselves.',
    bullets: ['Uptime, SSL, forms + link checks', 'Up to 2 small content/image changes monthly', 'Mobile/desktop QA + CTA cleanup'],
  },
  {
    key: 'booking_payments',
    label: 'Transaction layer',
    name: 'Booking + Payments',
    price: '$500 once',
    copy: 'Turn the site into a working business front door with booking handoff, deposits or full payments, intake, confirmation flows, and QR routing where useful.',
    bullets: ['Calendar / scheduler handoff', 'Deposit or full-payment setup', 'Basic intake + launch testing'],
  },
  {
    key: 'ai_voice',
    label: 'Recurring AI',
    name: 'Misfit AI Voice',
    price: '$500 setup + $297/mo',
    copy: 'A 24/7 AI receptionist for businesses that mainly need calls answered, qualified, routed, and summarized while the team is busy or off the clock.',
    bullets: ['24/7 call coverage', 'Qualification + escalation rules', 'Ongoing tuning + monthly QA'],
  },
  {
    key: 'ai_front_desk',
    label: 'Full AI front door',
    name: 'Misfit AI Front Desk',
    price: '$795 setup + $297/mo',
    copy: 'Voice plus website chat, booking handoff, intake, follow-up, and unified lead routing for businesses that need more than a phone agent.',
    bullets: ['AI voice + website chat', 'Booking / intake handoff', 'Managed knowledge + routing updates'],
  },
  {
    key: 'website_ai_launch',
    label: 'Best-value bundle',
    name: 'SnapSite + AI Activation',
    price: '$1,500 setup + $297/mo',
    copy: 'Rebuild the web front door and install the AI front desk behind it in one launch: website, chat, phone, intake, booking handoff, and managed AI service.',
    bullets: ['Website + booking layer', 'Full AI Front Desk', 'Unified launch + QA'],
  },
  {
    key: 'growth_partner',
    label: 'Managed growth',
    name: 'Growth Partner',
    price: '$2,500 setup + $997/mo',
    copy: 'For businesses that want Misfit actively operating more of the acquisition and conversion loop—not just installing software and walking away.',
    bullets: ['Campaigns + lead revival', 'Conversion / offer testing', 'CRM, follow-up + reporting'],
  },
  {
    key: 'custom',
    label: 'Custom business OS',
    name: 'Full-stack systems',
    price: 'Starting at $7,500',
    copy: 'Custom applications, marketplaces, internal tools, vertical operating systems, proprietary workflows, integrations, and heavier infrastructure.',
    bullets: ['Scoped around the actual operation', 'Human-approved launch', 'Misfit reusable platform IP stays Misfit'],
  },
];

const defaultLinks = {
  snapsite_starter: 'https://buy.stripe.com/fZu6oHfn4bqKfd04Ja8ww0z',
  website_care: 'https://buy.stripe.com/14A3cv5MucuO9SG7Vm8ww0A',
  booking_payments: 'https://buy.stripe.com/00wdR9deWbqK5Cq7Vm8ww0B',
  ai_voice: 'https://buy.stripe.com/28E4gz3Em52m5CqcbC8ww0C',
  ai_front_desk: 'https://buy.stripe.com/bJe7sLej0amG7Ky5Ne8ww0D',
  website_ai_launch: 'https://buy.stripe.com/eVq6oH2AifH09SG3F68ww0E',
  growth_partner: 'https://buy.stripe.com/14A00jcaSbqK9SGdfG8ww0F',
};

export default function Agency() {
  const [links, setLinks] = useState(defaultLinks);
  const [email, setEmail] = useState('');

  useEffect(() => {
    document.title = 'Misfit Agency | Websites, AI + Growth Systems';
    Promise.all([
      fetch('/offers.json').then((response) => response.json()),
      fetch('/contact.json').then((response) => response.json()),
    ]).then(([offers, contact]) => {
      setLinks({ ...defaultLinks, ...(offers || {}) });
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
              Start with the leak.
              <span className="block text-cyan-300">Build only what earns its keep.</span>
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-400">
              A $297 website can be the whole job—or the first layer of booking, payments, AI voice, automated intake, and managed growth. You own the client-specific site and business content. Ongoing Misfit work is scoped and paid, not hidden inside a fake lifetime promise.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">
              <span className="rounded-full border border-white/10 px-4 py-2">$297 website hook</span>
              <span className="rounded-full border border-white/10 px-4 py-2">$97/mo care</span>
              <span className="rounded-full border border-white/10 px-4 py-2">$297/mo managed AI</span>
              <span className="rounded-full border border-white/10 px-4 py-2">$997/mo growth</span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="mb-9 max-w-3xl">
            <div className="font-mono text-xs uppercase tracking-[0.28em] text-amber-300">Choose the problem—not the biggest package</div>
            <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-[-.04em] sm:text-6xl">The Misfit menu.</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => {
              const href = service.key === 'custom'
                ? (email ? `mailto:${email}?subject=Custom%20Misfit%20Build` : '/portfolio')
                : links[service.key];
              return (
                <article key={service.key} className="flex min-h-[390px] flex-col rounded-3xl border border-white/10 bg-white/[0.025] p-7">
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber-300">{service.label}</div>
                  <h3 className="mt-4 font-display text-3xl font-bold">{service.name}</h3>
                  <div className="mt-3 font-mono text-xs uppercase tracking-[0.12em] text-cyan-300">{service.price}</div>
                  <p className="mt-5 text-sm leading-7 text-slate-400">{service.copy}</p>
                  <div className="mt-6 space-y-2 text-xs text-slate-500">
                    {service.bullets.map((item) => (
                      <div key={item} className="flex items-start gap-2"><CheckCircle2 size={14} className="mt-0.5 shrink-0 text-cyan-300" /> {item}</div>
                    ))}
                  </div>
                  {href && (
                    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined} className="mt-auto inline-flex items-center gap-2 pt-8 font-mono text-[11px] font-semibold uppercase tracking-[0.13em] text-cyan-300">
                      {service.key === 'custom' ? 'Scope the build' : 'Start here'} <ArrowRight size={14} />
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.02]">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 md:grid-cols-3">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300">No site / weak site</div>
              <div className="mt-2 font-display text-2xl font-bold">Start at $297.</div>
              <p className="mt-2 text-sm leading-6 text-slate-500">Get the front door right before piling software on top of it.</p>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300">Missed calls / slow intake</div>
              <div className="mt-2 font-display text-2xl font-bold">Start at $500 + $297/mo.</div>
              <p className="mt-2 text-sm leading-6 text-slate-500">AI Voice handles the phone. Full Front Desk adds web chat, booking, intake, and follow-up.</p>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300">Need both</div>
              <div className="mt-2 font-display text-2xl font-bold">Bundle it at $1,500 + $297/mo.</div>
              <p className="mt-2 text-sm leading-6 text-slate-500">One launch for the site, booking layer, phone, chat, intake, and managed AI.</p>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-white/[0.02]">
          <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-5 py-12 sm:flex-row sm:items-center">
            <div>
              <div className="font-display text-3xl font-bold uppercase">Start with evidence.</div>
              <p className="mt-2 text-sm text-slate-500">Run the free Business Scrub first if you are not sure which layer is actually leaking.</p>
            </div>
            <a href="/" className="inline-flex rounded-full bg-cyan-300 px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.13em] text-black">Scan my site</a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
