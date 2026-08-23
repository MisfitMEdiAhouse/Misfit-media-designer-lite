import { useEffect, useMemo, useState } from 'react';

const PAYMENT_URL = 'https://buy.stripe.com/9B6cN5caS66q4ym1wY8ww0y';
const EMAIL = 'goldenessencetherapeutics@gmail.com';
const PHONE_DISPLAY = '435-760-4808';
const PHONE = '+14357604808';

const HOME_BG = 'https://cdn.shopify.com/s/files/1/0714/0068/5750/files/golden-essence-mobile-home-spa.jpg?v=1787463302';
const ABOUT_BG = 'https://cdn.shopify.com/s/files/1/0714/0068/5750/files/golden-essence-mobile-about-spa.jpg?v=1787463311';
const SERVICES_BG = 'https://cdn.shopify.com/s/files/1/0714/0068/5750/files/golden-essence-mobile-services-spa.jpg?v=1787463320';
const POLICIES_BG = 'https://cdn.shopify.com/s/files/1/0714/0068/5750/files/golden-essence-mobile-policies-spa.jpg?v=1787463330';
const CONTACT_BG = 'https://cdn.shopify.com/s/files/1/0714/0068/5750/files/golden-essence-mobile-contact-spa.jpg?v=1787463340';

const navItems = [
  ['home', 'Home'],
  ['about', 'About'],
  ['services', 'Services'],
  ['policies', 'Policies'],
  ['contact', 'Contact'],
];

const aboutCards = [
  ['My Why', 'My journey into massage therapy became especially meaningful after experiencing firsthand how much therapeutic touch can support the body during times of pain, stress, and recovery. That experience inspired me to create a business centered around compassionate, personalized care.'],
  ['Personalized Care', 'I believe massage should be more than just an appointment — it should be a moment where you can slow down, breathe, and focus on yourself. Every session is tailored to your individual needs, whether you are looking for relaxation, relief from everyday muscle tension, or simply time to recharge.'],
  ['Comfort & Convenience', 'As a mobile massage therapist, I bring the experience directly to you, allowing you to enjoy your massage in the comfort and privacy of your own space without having to worry about driving afterward.'],
  ['You Matter Here', 'At Golden Essence Therapeutics, my goal is simple: to create an environment where you feel comfortable, respected, cared for, and heard.'],
  ['Holistic Approach', 'Healing is more than physical. Each session supports your body, mind, and spirit — helping you feel balanced, renewed, and your best.'],
];

const services = [
  { name: 'Swedish Massage', description: 'A relaxing full-body massage using long, flowing strokes to improve circulation, reduce stress, and promote overall well-being.', prices: [['60 minutes', '$75'], ['90 minutes', '$110'], ['120 minutes', '$145']] },
  { name: 'Deep Tissue Massage', description: 'Therapeutic, deep-pressure techniques that target inner layers of muscles and connective tissue to release chronic tension and pain.', prices: [['60 minutes', '$95'], ['90 minutes', '$140'], ['120 minutes', '$180']] },
  { name: 'Reflexology', description: 'Focused pressure on reflex points in the feet, hands, or ears that correspond to different organs and systems to support balance and overall wellness.', prices: [['60 minutes', '$75'], ['90 minutes', '$110']] },
  { name: 'Joint Mobilization', description: 'Gentle, guided movements of the joints to improve mobility, reduce stiffness, and restore healthy range of motion.', prices: [['60 minutes', '$80'], ['90 minutes', '$115']] },
  { name: 'Craniosacral Therapy', description: 'A gentle, light-touch therapy that supports the central nervous system, relieves tension, and promotes deep relaxation and balance.', prices: [['60 minutes', '$110'], ['90 minutes', '$155'], ['120 minutes', '$200']] },
];

const policies = [
  ['Appointments & Booking', 'All massage sessions are by appointment only. Full payment is required 12 hours before the appointment to secure your booking. You cannot book within 12 hours of the appointment you want to schedule.'],
  ['No Show or Cancellation', 'If you cancel, reschedule, or do not show for your appointment, you will be charged the full price of the scheduled massage. This policy is firm in order to respect the time reserved just for you.'],
  ['Late Arrivals', 'Please be ready and on time for your appointment. Late arrivals may result in a shortened session so the schedule can remain on time. You will be charged the full price.'],
  ['Mobile Massage Therapy', 'I bring the massage experience to you. Please provide a safe, clean, quiet, smoke-free space with enough room for the massage table and for me to work comfortably. Travel fees are based on one-way distance to your location.'],
  ['Payment Policy', 'Full payment is required 12 hours before your appointment. This secures your time and allows me to prepare for your session. Payment is non-refundable for cancellations or no-shows.'],
  ['Professional Boundaries', 'This is a professional therapeutic massage only. There will be no sexual talk, comments, or requests of any kind. If any of these occur, the massage will be ended immediately and you will be charged the full price. This is your first and only warning. It will not be tolerated.'],
  ['Personal Hygiene', 'Please shower before your appointment. This helps create a clean, comfortable, and relaxing experience for both of us. Thank you for your respect and courtesy.'],
  ['Health Information', 'Before we begin, please list any medical conditions, injuries, allergies, medications, pregnancy, or anything else I should be aware of. Your health and safety are my top priority.'],
  ['Illness', 'Please reschedule if you are experiencing a fever, contagious illness, vomiting, diarrhea, or any symptoms that could put me or others at risk. I may also reschedule if needed to protect your health and safety.'],
  ['Right to Modify or End a Session', 'Your comfort and safety matter. You can request changes to pressure, techniques, positioning, temperature, or music at any time. Either you or I may end the session at any time if there is discomfort, a safety concern, or inappropriate behavior.'],
  ['Minors', 'Clients under 18 must have appropriate parent or legal guardian consent before receiving massage therapy. Additional requirements may apply depending on the client’s age and circumstances.'],
  ['Privacy', 'Your personal and health information is kept private and confidential. It will never be shared except when required or permitted by law.'],
  ['Service Area', 'Serving Cache County and surrounding areas in Utah. Travel fees may apply based on distance.'],
];

function Lotus({ className = 'h-12 w-12' }) {
  return (
    <svg viewBox="0 0 120 84" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M60 71C48 60 42 46 60 14c18 32 12 46 0 57Z" />
      <path d="M55 69C37 61 26 49 28 25c24 12 31 28 27 44Z" />
      <path d="M65 69c18-8 29-20 27-44-24 12-31 28-27 44Z" />
      <path d="M48 70C29 68 15 59 8 39c24 3 37 14 40 31Z" />
      <path d="M72 70c19-2 33-11 40-31-24 3-37 14-40 31Z" />
      <path d="M25 72c20 5 50 5 70 0" />
    </svg>
  );
}

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function BrandHeader() {
  return (
    <button type="button" onClick={() => scrollTo('home')} className="grid w-full grid-cols-[48px_1fr_48px] items-center gap-2 px-4 py-3 text-[#e9b95a]" aria-label="Golden Essence home">
      <Lotus className="h-10 w-10 justify-self-start" />
      <span className="text-center">
        <span className="block font-serif text-[17px] font-semibold tracking-[0.13em]">GOLDEN ESSENCE</span>
        <span className="mt-0.5 block font-serif text-[9px] tracking-[0.30em] text-[#f1e5d0]">THERAPEUTICS</span>
        <span className="mt-1 block font-serif text-[10px] italic tracking-[0.06em] text-[#d8ad63]">Where Healing Comes Home.</span>
      </span>
      <Lotus className="h-10 w-10 justify-self-end" />
    </button>
  );
}

function SectionHero({ id, image, eyebrow, title, subtitle, children, position = 'center' }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="relative isolate min-h-[430px] overflow-hidden border-y border-[#b78535]/35">
        <img src={image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: position }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#011013]/32 via-[#011013]/52 to-[#011013]/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#011013]/68 via-[#011013]/22 to-[#011013]/40" />
        <div className="relative mx-auto flex min-h-[430px] max-w-xl flex-col justify-end px-5 pb-8 pt-12">
          <div className="rounded-[28px] border border-[#d3a14b]/35 bg-[#011013]/72 p-6 shadow-2xl backdrop-blur-[2px]">
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#e5b55b]">{eyebrow}</div>
            <h2 className="mt-3 font-serif text-[42px] leading-[0.98] text-[#fff9ed]">{title}</h2>
            {subtitle && <p className="mt-4 text-base leading-7 text-[#eee5d8]/88">{subtitle}</p>}
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function GoldenEssenceMobile() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'General question', message: '' });

  useEffect(() => { document.title = 'Golden Essence Therapeutics'; }, []);

  const mailto = useMemo(() => {
    const body = [`Name: ${form.name}`, `Email: ${form.email}`, `Phone: ${form.phone}`, '', form.message].join('\n');
    return `mailto:${EMAIL}?subject=${encodeURIComponent(`Golden Essence — ${form.subject}`)}&body=${encodeURIComponent(body)}`;
  }, [form]);

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#011013] pb-20 text-[#f6efe3]">
      <header className="sticky top-0 z-50 border-b border-[#b78535]/55 bg-[#011013]/98 shadow-[0_8px_24px_rgba(0,0,0,.3)] backdrop-blur">
        <BrandHeader />
      </header>

      <section id="home" className="scroll-mt-24">
        <div className="relative isolate min-h-[78svh] overflow-hidden">
          <img src={HOME_BG} alt="Waterfall, candles, lotus and spa setting" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#011013]/18 via-[#011013]/34 to-[#011013]/94" />
          <div className="relative mx-auto flex min-h-[78svh] max-w-xl flex-col justify-end px-5 pb-10 pt-24 text-center">
            <div className="rounded-[30px] border border-[#d4a24a]/40 bg-[#011013]/72 p-6 shadow-2xl backdrop-blur-[2px]">
              <div className="text-[10px] font-bold uppercase tracking-[0.23em] text-[#e3b25a]">Mobile Massage Therapy · Cache County</div>
              <h1 className="mt-4 font-serif text-[48px] leading-[0.95] text-[#fff9ef]">Golden Essence <span className="text-[#e4ad4f]">Therapeutics</span></h1>
              <p className="mt-4 font-serif text-2xl italic text-[#f0c26d]">Where Healing Comes Home.</p>
              <p className="mt-5 text-base leading-7 text-[#eee5d8]/90">Professional, personalized mobile massage therapy serving Cache County and surrounding areas in Utah.</p>
              <div className="mt-7 grid gap-3">
                <button onClick={() => scrollTo('services')} className="rounded-full bg-[#e2a53c] px-5 py-4 text-sm font-bold uppercase tracking-[0.08em] text-[#06292c]">View Services & Pricing</button>
                <button onClick={() => scrollTo('contact')} className="rounded-full border border-[#d6a24a]/65 bg-[#011013]/65 px-5 py-4 text-sm font-bold uppercase tracking-[0.08em] text-[#efc26d]">Contact / Questions</button>
              </div>
            </div>
          </div>
        </div>
        <div className="border-y border-[#b78535]/35 bg-[#031c1f] px-5 py-8 text-center">
          <Lotus className="mx-auto h-12 w-12 text-[#d7a64a]" />
          <div className="mt-2 font-serif text-xl tracking-[0.12em] text-[#e5b45b]">RELAX · RESTORE · RENEW</div>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#ded6c8]/78">Bringing healing, relaxation, and balance into your life — so you can feel your best, wherever you are.</p>
        </div>
      </section>

      <SectionHero id="about" image={ABOUT_BG} eyebrow="About" title="Care that feels personal, calm, and close to home." subtitle="Golden Essence Therapeutics was created from a passion for helping people feel better in their bodies and giving them a safe space to relax, restore, and renew." position="52% 38%" />
      <section className="px-5 py-10">
        <div className="mx-auto max-w-xl">
          <p className="text-base leading-7 text-[#ddd5c8]/84">The experience is built around compassionate, personalized care — not a rushed appointment. The goal is to create space to slow down, breathe, and focus on what your body needs.</p>
          <div className="mt-7 space-y-3">
            {aboutCards.map(([title, body], index) => (
              <details key={title} className="group overflow-hidden rounded-2xl border border-[#b88738]/30 bg-[#052629]" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 marker:hidden">
                  <span className="font-serif text-[23px] text-[#efbd63]">{title}</span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#d4a34c]/45 text-xl text-[#dca94d] transition group-open:rotate-45">＋</span>
                </summary>
                <p className="border-t border-[#b88738]/18 px-5 pb-6 pt-4 text-[15px] leading-7 text-[#e3dacd]/82">{body}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <SectionHero id="services" image={SERVICES_BG} eyebrow="Services & Pricing" title="Massage therapy designed around you." subtitle="Relax. Restore. Renew. Clear pricing, personalized care, and a calm mobile experience." position="50% 44%" />
      <section className="bg-[#f5eee2] px-5 py-10 text-[#12383b]">
        <div className="mx-auto max-w-xl">
          <p className="text-base leading-7 text-[#36595c]">All sessions are customized to your needs. Prices reflect massage time only. Travel fees apply to all mobile appointments.</p>
          <div className="mt-7 space-y-4">
            {services.map((service) => (
              <article key={service.name} className="rounded-3xl border border-[#c9a46a]/45 bg-[#fffaf2] p-5 shadow-sm">
                <h3 className="font-serif text-[27px] text-[#17484c]">{service.name}</h3>
                <p className="mt-2 text-sm leading-6 text-[#446467]">{service.description}</p>
                <div className="mt-5 divide-y divide-[#dfcdae] rounded-2xl border border-[#dcc6a2] bg-[#f9f0e2]">
                  {service.prices.map(([duration, price]) => (
                    <div key={duration} className="flex items-center justify-between px-4 py-3.5">
                      <span className="font-semibold text-[#536c6e]">{duration}</span>
                      <span className="font-serif text-2xl text-[#9a6523]">{price}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <div className="mt-4 grid gap-4">
            <article className="rounded-3xl bg-[#07383b] p-6 text-[#f7eee0]">
              <h3 className="font-serif text-2xl text-[#efbf68]">Hot Stone Upgrade</h3>
              <p className="mt-2 text-sm leading-6 text-[#efe5d4]/82">Add smooth, heated stones to any massage to melt away tension and promote deeper relaxation.</p>
              <div className="mt-4 font-serif text-4xl text-[#f2c46d]">+ $20</div>
            </article>
            <article className="rounded-3xl border border-[#c9a46a]/45 bg-[#fffaf2] p-6">
              <h3 className="font-serif text-2xl text-[#17484c]">Chair Massage</h3>
              <div className="mt-4 flex items-center justify-between border-b border-[#dfcdae] py-3"><span>15 minutes</span><strong className="font-serif text-2xl text-[#9a6523]">$20</strong></div>
              <div className="flex items-center justify-between py-3"><span>30 minutes</span><strong className="font-serif text-2xl text-[#9a6523]">$35</strong></div>
            </article>
            <article className="rounded-3xl border border-[#c9a46a]/45 bg-[#fffaf2] p-6">
              <h3 className="font-serif text-2xl text-[#17484c]">Mobile Massage Travel Fee</h3>
              <p className="mt-2 text-sm leading-6 text-[#446467]">Travel fees are based on one-way distance to the client’s location.</p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                {[['0–10 mi', '$10'], ['11–20 mi', '$25'], ['21–50 mi', '$50'], ['51+ mi', '$75+']].map(([miles, price]) => (
                  <div key={miles} className="rounded-2xl border border-[#d9c29d] bg-[#f7eddd] p-4 text-center">
                    <div className="text-xs font-bold uppercase tracking-[0.08em] text-[#577072]">{miles}</div>
                    <div className="mt-1 font-serif text-3xl text-[#996522]">{price}</div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs leading-5 text-[#5a7475]">51+ miles requires a 90-minute minimum appointment or multiple clients at the same location. Additional fees may apply beyond 50 miles.</p>
            </article>
          </div>
        </div>
      </section>

      <SectionHero id="policies" image={POLICIES_BG} eyebrow="Policies" title="Professional care. Clear expectations. Peace of mind." subtitle="Tap any policy below to read the full details." position="52% 44%" />
      <section className="px-5 py-10">
        <div className="mx-auto max-w-xl space-y-3">
          {policies.map(([title, body], index) => (
            <details key={title} className="group overflow-hidden rounded-2xl border border-[#b88738]/28 bg-[#052629]" open={index === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 marker:hidden">
                <span className="font-serif text-[21px] text-[#efbd63]">{title}</span>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#d4a34c]/45 text-xl text-[#dca94d] transition group-open:rotate-45">＋</span>
              </summary>
              <p className="border-t border-[#b88738]/18 px-5 pb-6 pt-4 text-[15px] leading-7 text-[#e3dacd]/82">{body}</p>
            </details>
          ))}
        </div>
      </section>

      <SectionHero id="contact" image={CONTACT_BG} eyebrow="Contact" title="Questions? Reach out anytime." subtitle="Booking will be connected later. For now, future clients can learn about Golden Essence and get in touch directly." position="50% 44%" />
      <section className="bg-[#f5eee2] px-5 py-10 text-[#153639]">
        <div className="mx-auto max-w-xl">
          <div className="space-y-3">
            <a href={`tel:${PHONE}`} className="flex items-center gap-4 rounded-2xl border border-[#c89b52]/40 bg-[#fffaf1] p-4">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#07373a] text-[#e8b75d]">☎</span>
              <div><div className="text-xs uppercase tracking-[0.12em] text-[#6d7e7e]">Phone</div><div className="font-semibold">{PHONE_DISPLAY}</div></div>
            </a>
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-4 rounded-2xl border border-[#c89b52]/40 bg-[#fffaf1] p-4">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#07373a] text-[#e8b75d]">✉</span>
              <div className="min-w-0"><div className="text-xs uppercase tracking-[0.12em] text-[#6d7e7e]">Email</div><div className="break-all font-semibold">{EMAIL}</div></div>
            </a>
            <div className="flex items-center gap-4 rounded-2xl border border-[#c89b52]/40 bg-[#fffaf1] p-4">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#07373a] text-[#e8b75d]">⌖</span>
              <div><div className="text-xs uppercase tracking-[0.12em] text-[#6d7e7e]">Service Area</div><div className="font-semibold">Cache County & surrounding areas, Utah</div></div>
            </div>
          </div>

          <form onSubmit={(event) => { event.preventDefault(); window.location.href = mailto; }} className="mt-6 rounded-[28px] border border-[#c89b52]/45 bg-[#fffaf1] p-5 shadow-xl">
            <h3 className="font-serif text-2xl text-[#17464a]">Send a Message</h3>
            <p className="mt-1 text-sm text-[#597173]">Fill this out and your email app will open with the message ready to send.</p>
            <div className="mt-5 grid gap-4">
              <label className="text-sm font-semibold">Full name<input value={form.name} onChange={update('name')} required className="mt-2 w-full rounded-xl border border-[#ccb78f] bg-white px-4 py-3 text-base outline-none focus:border-[#ad7624]" placeholder="Your name" /></label>
              <label className="text-sm font-semibold">Email<input value={form.email} onChange={update('email')} type="email" required className="mt-2 w-full rounded-xl border border-[#ccb78f] bg-white px-4 py-3 text-base outline-none focus:border-[#ad7624]" placeholder="you@example.com" /></label>
              <label className="text-sm font-semibold">Phone<input value={form.phone} onChange={update('phone')} type="tel" className="mt-2 w-full rounded-xl border border-[#ccb78f] bg-white px-4 py-3 text-base outline-none focus:border-[#ad7624]" placeholder="Optional" /></label>
              <label className="text-sm font-semibold">Subject<select value={form.subject} onChange={update('subject')} className="mt-2 w-full rounded-xl border border-[#ccb78f] bg-white px-4 py-3 text-base outline-none focus:border-[#ad7624]"><option>General question</option><option>Help choosing a service</option><option>School / business information</option><option>Other question</option></select></label>
              <label className="text-sm font-semibold">Message<textarea value={form.message} onChange={update('message')} required rows={5} className="mt-2 w-full resize-none rounded-xl border border-[#ccb78f] bg-white px-4 py-3 text-base outline-none focus:border-[#ad7624]" placeholder="How can I help?" /></label>
              <button type="submit" className="rounded-full bg-[#dca13a] px-5 py-4 text-sm font-bold uppercase tracking-[0.08em] text-[#0b3033] shadow-lg">Send Message</button>
            </div>
          </form>
        </div>
      </section>

      <footer className="border-t border-[#b78535]/35 bg-[#011013] px-5 py-10 text-center">
        <Lotus className="mx-auto h-14 w-14 text-[#d8a74d]" />
        <div className="mt-3 font-serif text-xl tracking-[0.12em] text-[#e6ad4c]">GOLDEN ESSENCE THERAPEUTICS</div>
        <div className="mt-1 font-serif italic text-[#d4aa64]">Where Healing Comes Home.</div>
        <p className="mt-4 text-xs leading-5 text-[#d5ccbd]/60">Mobile portfolio preview · Built by Misfit Mediahouse</p>
        <a href={PAYMENT_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex rounded-full border border-[#f2c85d] bg-[#f2c85d] px-6 py-3 text-sm font-bold text-[#08272a]">Activate this site · $297</a>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#a7782e]/55 bg-[#011013]/96 px-2 py-2 backdrop-blur" aria-label="Golden Essence mobile navigation">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {navItems.map(([id, label]) => (
            <button key={id} type="button" onClick={() => scrollTo(id)} className="rounded-xl px-1 py-2 text-[9px] font-bold uppercase tracking-[0.05em] text-[#e5b65c] active:bg-[#17383a]">{label}</button>
          ))}
        </div>
      </nav>
    </main>
  );
}
