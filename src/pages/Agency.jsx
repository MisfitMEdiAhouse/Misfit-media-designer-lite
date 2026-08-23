import { ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';

const defaultLinks = {
  snapsite_starter: 'https://buy.stripe.com/fZu6oHfn4bqKfd04Ja8ww0z',
  website_care: 'https://buy.stripe.com/14A3cv5MucuO9SG7Vm8ww0A',
  booking_payments: 'https://buy.stripe.com/00wdR9deWbqK5Cq7Vm8ww0B',
  ai_voice: 'https://buy.stripe.com/28E4gz3Em52m5CqcbC8ww0C',
  ai_front_desk: 'https://buy.stripe.com/bJe7sLej0amG7Ky5Ne8ww0D',
  website_ai_launch: 'https://buy.stripe.com/eVq6oH2AifH09SG3F68ww0E',
  growth_partner: 'https://buy.stripe.com/14A00jcaSbqK9SGdfG8ww0F',
};

const proof = [
  {
    name: 'Golden Essence Therapeutics',
    type: 'Local service website',
    copy: 'Branded five-page mobile massage site with service pricing, policies, contact paths, custom-domain activation, and a live purchase flow.',
    href: '/portfolio/golden-essence',
  },
  {
    name: 'Weber Junk Rescue',
    type: 'Local service conversion',
    copy: 'Mobile-first quote, intake, deposit, and booking experience built to move a local-service visitor toward an actual job.',
    href: 'https://weber-junk-rescue-v9.vercel.app/',
  },
  {
    name: 'Home Efficiency Pros',
    type: 'Dealer lead system',
    copy: 'Live dealer site with product education, AI intake, quote requests, appointment booking, and installation coordination.',
    href: 'https://www.homeefficiencypros.com/',
  },
  {
    name: 'Misfit AI V2',
    type: 'AI revenue software',
    copy: 'Lead intake, response, qualification, follow-up, revival, booking, and revenue operations in one working product.',
    href: 'https://misfit-ai-v2.vercel.app/',
  },
  {
    name: 'Coffee & A Joint',
    type: 'Ecommerce',
    copy: 'Direct-to-consumer storefront with live products, checkout, attribution, and a distinct branded shopping experience.',
    href: 'https://www.coffeeandajoint.co/',
  },
  {
    name: 'IALS Turbine Command',
    type: 'Custom business system',
    copy: 'Aerospace aftermarket operating system with 94 repair-price rows, 22 inventory matches, deal controls, and transaction workflows.',
    href: '/portfolio/ials-turbine-command',
  },
];

const startingOffers = [
  {
    key: 'snapsite_starter',
    kicker: 'Need a website?',
    name: 'Website Launch',
    price: '$297 once',
    copy: 'A real mobile-first business website—not a template handoff. Up to five pages, launch QA, custom-domain setup, and the first year of one standard domain up to $25.',
    bullets: ['48-hour live preview available', 'You own the finished client-specific site', 'No required Misfit subscription'],
    cta: 'Launch my site',
  },
  {
    key: 'ai_voice',
    kicker: 'Missing calls?',
    name: 'AI Voice Receptionist',
    price: '$500 setup + $297/mo',
    copy: 'A 24/7 AI receptionist trained on your business that answers, qualifies, routes, and summarizes calls while your team is busy or off the clock.',
    bullets: ['24/7 inbound call coverage', 'Lead qualification + human transfer rules', 'Ongoing tuning and managed QA'],
    cta: 'Add AI Voice',
  },
  {
    key: 'website_ai_launch',
    kicker: 'Need the whole front door?',
    name: 'Website + AI Front Desk',
    price: '$1,500 setup + $297/mo',
    copy: 'We build the site and connect the AI layer behind it: phone, web chat, intake, booking handoff, follow-up, and one managed launch.',
    bullets: ['Website + booking foundation', 'AI voice + web intake', 'Unified setup, testing + launch'],
    cta: 'Build the full system',
    featured: true,
  },
];

const upgrades = [
  {
    key: 'website_care',
    name: 'Website Care',
    price: '$97/mo',
    copy: 'Hosting oversight, SSL/forms/link checks, up to two small content or image updates each month, QA, and support.',
  },
  {
    key: 'booking_payments',
    name: 'Booking + Payments',
    price: '$500 once',
    copy: 'Calendar or booking handoff, deposits/full payments, intake, confirmations, QR routing, and launch testing.',
  },
  {
    key: 'ai_front_desk',
    name: 'Full AI Front Desk',
    price: '$795 setup + $297/mo',
    copy: 'For businesses that already have a good site but want AI voice plus web chat, booking, intake, follow-up, and unified lead routing.',
  },
  {
    key: 'growth_partner',
    name: 'Growth Partner',
    price: '$2,500 setup + $997/mo',
    copy: 'Managed campaigns, lead revival, offer/conversion testing, CRM follow-up, reporting, and ongoing growth operations.',
  },
];

export default function Agency() {
  const [links, setLinks] = useState(defaultLinks);
  const [email, setEmail] = useState('');

  useEffect(() => {
    document.title = 'Misfit Mediahouse Agency | Websites + AI for Businesses';
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
            <div className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-300">MISFIT MEDIAHOUSE · WEB + AI AGENCY</div>
            <h1 className="mt-5 max-w-6xl font-display text-[clamp(3.2rem,9vw,7rem)] font-bold uppercase leading-[0.86] tracking-[-0.055em]">
              We build websites and AI systems
              <span className="block text-cyan-300">that help businesses win customers.</span>
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
              Misfit Mediahouse is a Utah-based agency building business websites, booking and payment flows, AI receptionists, lead follow-up, ecommerce, and custom software. Start with the piece you need. Add more when it makes money.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={links.snapsite_starter} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-black">
                Get a website — $297 <ArrowRight size={15} />
              </a>
              <a href="#proof" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white">
                See live work <ArrowRight size={15} />
              </a>
            </div>
            <div className="mt-8 grid max-w-4xl gap-3 sm:grid-cols-3">
              {[
                ['WEB', 'Sites built to call, book, quote or sell.'],
                ['AI', 'Voice + chat that answers and qualifies leads.'],
                ['SYSTEMS', 'Payments, automation, CRM and custom software.'],
              ].map(([label, copy]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                  <div className="font-mono text-[10px] font-bold tracking-[0.2em] text-cyan-300">{label}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-400">{copy}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="proof" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:py-20">
          <div className="max-w-4xl">
            <div className="font-mono text-xs uppercase tracking-[0.28em] text-amber-300">OPEN THE WORK</div>
            <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-[-.04em] sm:text-6xl">We do not sell mockups. Here is live proof.</h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-400">Local service sites, ecommerce, AI revenue software, lead systems, and full business operating systems—built and shipped by Misfit Mediahouse.</p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {proof.map((item) => (
              <a key={item.name} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noreferrer' : undefined} className="group flex min-h-[250px] flex-col rounded-3xl border border-white/10 bg-white/[0.025] p-7 transition hover:border-cyan-300/40 hover:bg-white/[0.045]">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300">{item.type}</div>
                <h3 className="mt-4 font-display text-2xl font-bold">{item.name}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-400">{item.copy}</p>
                <div className="mt-auto flex items-center gap-2 pt-6 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-white">
                  Open live proof <ExternalLink size={13} />
                </div>
              </a>
            ))}
          </div>
          <a href="/portfolio" className="mt-7 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-cyan-300">See the full portfolio <ArrowRight size={14} /></a>
        </section>

        <section className="border-y border-white/10 bg-white/[0.018]">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
            <div className="max-w-4xl">
              <div className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-300">THREE EASY STARTING POINTS</div>
              <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-[-.04em] sm:text-6xl">Pick the problem you actually have.</h2>
              <p className="mt-5 text-base leading-7 text-slate-400">Most businesses do not need seven packages. Start with a website, AI call coverage, or the complete front door.</p>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {startingOffers.map((offer) => (
                <article key={offer.key} className={`flex min-h-[460px] flex-col rounded-3xl border p-7 ${offer.featured ? 'border-cyan-300/45 bg-cyan-300/[0.06]' : 'border-white/10 bg-black/40'}`}>
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-300">{offer.kicker}</div>
                  <h3 className="mt-4 font-display text-3xl font-bold">{offer.name}</h3>
                  <div className="mt-3 font-display text-2xl font-bold text-cyan-300">{offer.price}</div>
                  <p className="mt-5 text-sm leading-7 text-slate-400">{offer.copy}</p>
                  <div className="mt-6 space-y-3 text-sm text-slate-300">
                    {offer.bullets.map((item) => (
                      <div key={item} className="flex items-start gap-2"><CheckCircle2 size={15} className="mt-1 shrink-0 text-cyan-300" /><span>{item}</span></div>
                    ))}
                  </div>
                  <a href={links[offer.key]} target="_blank" rel="noreferrer" className={`mt-auto inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.13em] ${offer.featured ? 'bg-cyan-300 text-black' : 'border border-white/15 text-white'}`}>
                    {offer.cta} <ArrowRight size={14} />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
          <div className="max-w-4xl">
            <div className="font-mono text-xs uppercase tracking-[0.28em] text-amber-300">UPGRADES + ONGOING SERVICE</div>
            <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-[-.04em] sm:text-6xl">Need more? Add it. Do not rebuild from scratch.</h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {upgrades.map((item) => (
              <article key={item.key} className="flex min-h-[320px] flex-col rounded-3xl border border-white/10 bg-white/[0.025] p-6">
                <h3 className="font-display text-2xl font-bold">{item.name}</h3>
                <div className="mt-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-cyan-300">{item.price}</div>
                <p className="mt-5 text-sm leading-7 text-slate-400">{item.copy}</p>
                <a href={links[item.key]} target="_blank" rel="noreferrer" className="mt-auto inline-flex items-center gap-2 pt-7 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-300">See / start this option <ArrowRight size={13} /></a>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.018]">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
            <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
              <div>
                <div className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-300">WHO WE ARE</div>
                <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-[-.04em] sm:text-6xl">One agency from the website to the backend.</h2>
              </div>
              <div className="space-y-5 text-base leading-8 text-slate-400">
                <p>Misfit Mediahouse designs brands and websites, writes the code, connects payments and booking, builds AI voice and chat, creates automation, and can go all the way into custom internal software when the business needs it.</p>
                <p>That means you do not need one person for the website, another for the phone system, another for AI, and another for the automation. We can build the pieces together—or just fix the one thing you need today.</p>
                <p className="text-slate-300">You own the client-specific site and your business content. Misfit keeps ownership of its reusable platform code, internal tools, templates, and systems. Ongoing management is paid and clearly scoped.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
          <div className="max-w-4xl">
            <div className="font-mono text-xs uppercase tracking-[0.28em] text-amber-300">STRAIGHT ANSWERS</div>
            <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-[-.04em] sm:text-6xl">What happens after you buy?</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {[
              ['Do I own my website?', 'Yes. When the website is paid and launched, you own the client-specific finished site and your business content.'],
              ['Is there a required monthly website fee?', 'No Misfit subscription is required just to own the basic $297 website. Website Care is optional at $97/month.'],
              ['What about the domain?', 'The first year of one standard available domain up to $25 is included with the $297 launch. Premium domains require approval. Normal renewals after year one belong to the site owner.'],
              ['Can you add booking or payments later?', 'Yes. Booking, deposits, full payments, intake forms and QR flows can be added without rebuilding the whole site.'],
              ['Can I add AI later?', 'Yes. AI Voice starts at $500 setup + $297/month. The full AI Front Desk adds chat, booking/intake handoff and follow-up.'],
              ['What if I need something bigger?', 'Custom applications, marketplaces, operating systems and integrations are scoped separately. Those builds start at $7,500.'],
            ].map(([q, a]) => (
              <div key={q} className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
                <h3 className="font-display text-xl font-bold">{q}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 bg-cyan-300 text-black">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 px-5 py-12 sm:flex-row sm:items-center">
            <div>
              <div className="font-display text-3xl font-bold uppercase sm:text-4xl">Need a better website?</div>
              <p className="mt-2 max-w-2xl text-sm font-medium text-black/70">Start with the $297 site. If you need AI, booking, payments or growth after that, we can add it.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={links.snapsite_starter} target="_blank" rel="noreferrer" className="inline-flex rounded-full bg-black px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-white">Start the $297 site</a>
              <a href={email ? `mailto:${email}?subject=Misfit%20Agency%20Project` : '/portfolio'} className="inline-flex rounded-full border border-black/25 px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-black">Talk to Misfit</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
