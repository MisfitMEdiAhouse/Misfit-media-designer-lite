import { useEffect, useMemo, useState } from 'react';

const PAYMENT_URL = 'https://buy.stripe.com/9B6cN5caS66q4ym1wY8ww0y';
const EMAIL = 'goldenessencetherapeutics@gmail.com';
const PHONE_DISPLAY = '435-760-4808';
const PHONE = '+14357604808';
const HERO = 'https://cdn.shopify.com/s/files/1/0714/0068/5750/files/golden-essence-home.jpg?v=1787457016';
const ABOUT_ART = 'https://cdn.shopify.com/s/files/1/0714/0068/5750/files/golden-essence-about.jpg?v=1787457028';
const SERVICES_ART = 'https://cdn.shopify.com/s/files/1/0714/0068/5750/files/golden-essence-services.jpg?v=1787457091';
const POLICIES_ART = 'https://cdn.shopify.com/s/files/1/0714/0068/5750/files/golden-essence-policies.jpg?v=1787457099';
const CONTACT_ART = 'https://cdn.shopify.com/s/files/1/0714/0068/5750/files/golden-essence-contact.jpg?v=1787457108';

const navItems = [
  ['home', 'Home'],
  ['about', 'About'],
  ['services', 'Services'],
  ['policies', 'Policies'],
  ['contact', 'Contact'],
];

const services = [
  {
    name: 'Swedish Massage',
    blurb: 'A relaxing full-body massage using long, flowing strokes to improve circulation, reduce stress, and support overall well-being.',
    prices: [['60 min', '$75'], ['90 min', '$110'], ['120 min', '$145']],
  },
  {
    name: 'Deep Tissue Massage',
    blurb: 'Therapeutic, deep-pressure techniques that target inner layers of muscle and connective tissue to release chronic tension and pain.',
    prices: [['60 min', '$95'], ['90 min', '$140'], ['120 min', '$180']],
  },
  {
    name: 'Reflexology',
    blurb: 'Focused pressure on reflex points in the feet, hands, or ears that correspond to different organs and systems to support balance and overall wellness.',
    prices: [['60 min', '$75'], ['90 min', '$110']],
  },
  {
    name: 'Joint Mobilization',
    blurb: 'Gentle, guided movements of the joints to improve mobility, reduce stiffness, and restore a healthy range of motion.',
    prices: [['60 min', '$80'], ['90 min', '$115']],
  },
  {
    name: 'Craniosacral Therapy',
    blurb: 'A gentle, light-touch therapy that supports the central nervous system, relieves tension, and promotes deep relaxation and balance.',
    prices: [['60 min', '$110'], ['90 min', '$155'], ['120 min', '$200']],
  },
];

const aboutCards = [
  [
    'My Why',
    'My journey into massage therapy became especially meaningful after experiencing firsthand how much therapeutic touch can support the body during times of pain, stress, and recovery. That experience inspired me to create a business centered around compassionate, personalized care.',
  ],
  [
    'Personalized Care',
    'I believe massage should be more than just an appointment — it should be a moment where you can slow down, breathe, and focus on yourself. Every session is tailored to your individual needs, whether you’re looking for relaxation, relief from everyday muscle tension, or simply time to recharge.',
  ],
  [
    'Comfort & Convenience',
    'As a mobile massage therapist, I bring the experience directly to you, allowing you to enjoy your massage in the comfort and privacy of your own space without having to worry about driving afterward.',
  ],
  [
    'You Matter Here',
    'At Golden Essence Therapeutics, my goal is simple: to create an environment where you feel comfortable, respected, cared for, and heard.',
  ],
  [
    'Holistic Approach',
    'Healing is more than physical. Each session supports your body, mind, and spirit — helping you feel balanced, renewed, and your best.',
  ],
];

const policies = [
  ['Appointments & Booking', 'Massage sessions are by appointment only. Full payment is required 12 hours before the appointment to secure the time. Same-day booking inside that 12-hour window is not available.'],
  ['No Show or Cancellation', 'If you cancel, reschedule, or do not show for your appointment, the full price of the scheduled massage is charged. This policy protects time reserved specifically for you.'],
  ['Late Arrivals', 'Please be ready and on time. Late arrival may result in a shorter session so the schedule can stay on time. The full session price still applies.'],
  ['Payment Policy', 'Full payment is required 12 hours before the appointment. Payment for cancellations and no-shows is non-refundable.'],
  ['Mobile Massage Therapy', 'Please provide a safe, clean, quiet, smoke-free space with enough room for the massage table and for the therapist to work comfortably. Travel fees are based on one-way distance.'],
  ['Professional Boundaries', 'This is professional therapeutic massage only. Sexual talk, comments, or requests are not tolerated. Inappropriate behavior ends the session immediately and the full price remains due.'],
  ['Personal Hygiene', 'Please shower before your appointment to help create a clean, comfortable, relaxing experience for both client and therapist.'],
  ['Health Information', 'Before the session, disclose medical conditions, injuries, allergies, medications, pregnancy, or anything else that may affect safe treatment.'],
  ['Illness', 'Please reschedule if you have a fever, contagious illness, vomiting, diarrhea, or symptoms that could put others at risk. The therapist may also reschedule when needed for health and safety.'],
  ['Right to Modify or End a Session', 'You may request changes to pressure, techniques, positioning, temperature, or music at any time. Either person may end the session for discomfort, a safety concern, or inappropriate behavior.'],
  ['Minors', 'Clients under 18 must have appropriate parent or legal guardian consent before receiving massage therapy. Additional requirements may apply based on age and circumstances.'],
  ['Privacy', 'Personal and health information is kept private and confidential and will only be shared when required or permitted by law.'],
  ['Service Area', 'Serving Cache County and surrounding areas in Utah. Travel fees may apply based on distance.'],
];

function LotusMark({ small = false }) {
  return (
    <div className={`flex shrink-0 items-center justify-center ${small ? 'h-12 w-12' : 'h-16 w-16'}`} aria-hidden="true">
      <svg viewBox="0 0 84 64" className="h-full w-full" fill="none" stroke="#dfa94c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M42 51C34 41 34 26 42 10C50 26 50 41 42 51Z" />
        <path d="M39 51C29 44 25 31 29 17C38 27 42 39 39 51Z" />
        <path d="M45 51C55 44 59 31 55 17C46 27 42 39 45 51Z" />
        <path d="M35 52C23 49 15 40 14 27C27 31 35 39 35 52Z" />
        <path d="M49 52C61 49 69 40 70 27C57 31 49 39 49 52Z" />
        <path d="M30 54C18 54 10 48 7 38C20 39 28 44 30 54Z" />
        <path d="M54 54C66 54 74 48 77 38C64 39 56 44 54 54Z" />
        <path d="M11 48C20 58 31 61 42 61C53 61 64 58 73 48" />
      </svg>
    </div>
  );
}

function SectionEyebrow({ children }) {
  return <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#d9a548]">{children}</div>;
}

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function GoldenEssenceMobile() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'General question', message: '' });

  useEffect(() => {
    document.title = 'Golden Essence Therapeutics';
  }, []);

  const mailto = useMemo(() => {
    const body = [`Name: ${form.name}`, `Email: ${form.email}`, `Phone: ${form.phone}`, '', form.message].join('\n');
    return `mailto:${EMAIL}?subject=${encodeURIComponent(`Golden Essence — ${form.subject}`)}&body=${encodeURIComponent(body)}`;
  }, [form]);

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  return (
    <main className="min-h-screen bg-[#011013] text-[#f5efe5] selection:bg-[#d9a548] selection:text-[#011013]">
      <header className="sticky top-0 z-50 border-b border-[#a7782e]/55 bg-[#011013]/95 backdrop-blur">
        <div className="mx-auto grid max-w-5xl grid-cols-[52px_1fr_52px] items-center gap-2 px-3 py-3">
          <LotusMark small />
          <button type="button" onClick={() => scrollToId('home')} className="min-w-0 text-center" aria-label="Golden Essence home">
            <div className="font-serif text-[18px] font-semibold leading-none tracking-[0.08em] text-[#e4af4f] sm:text-xl">GOLDEN ESSENCE</div>
            <div className="mt-1 font-serif text-[9px] tracking-[0.30em] text-[#efe4d0]">THERAPEUTICS</div>
            <div className="mt-0.5 font-serif text-[10px] tracking-[0.08em] text-[#d7b26b] sm:text-xs">Where Healing Comes Home.</div>
          </button>
          <LotusMark small />
        </div>
      </header>

      <section id="home" className="scroll-mt-24">
        <div className="relative isolate min-h-[78svh] overflow-hidden">
          <img src={HERO} alt="Waterfall and golden moon Golden Essence artwork" className="absolute inset-0 h-full w-full object-cover object-[52%_18%]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#011013]/25 via-[#011013]/15 to-[#011013]/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#011013]/50 via-transparent to-[#011013]/15" />
          <div className="relative mx-auto flex min-h-[78svh] max-w-5xl flex-col justify-end px-5 pb-10 pt-24 sm:px-8">
            <div className="max-w-xl rounded-[28px] border border-[#d3a14b]/25 bg-[#011013]/68 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
              <SectionEyebrow>Mobile Massage Therapy · Cache County</SectionEyebrow>
              <h1 className="font-serif text-5xl leading-[0.92] text-[#fffaf0] sm:text-6xl">Where <span className="text-[#e6ad4c]">Healing</span> <em className="font-normal text-[#efbd64]">comes home.</em></h1>
              <p className="mt-5 max-w-md text-base leading-7 text-[#efe8dc]/86">Professional, personalized care designed around comfort, relaxation, and balance — brought into your own space.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => scrollToId('services')} className="rounded-full bg-[#e0a43d] px-5 py-3.5 text-sm font-bold text-[#082326] shadow-lg">View services & pricing</button>
                <button type="button" onClick={() => scrollToId('contact')} className="rounded-full border border-[#e0a43d]/70 bg-[#011013]/55 px-5 py-3.5 text-sm font-bold text-[#f1c56e]">Contact / Questions</button>
              </div>
            </div>
          </div>
        </div>
        <div className="border-y border-[#a7782e]/35 bg-[#031b1d] px-5 py-7 text-center">
          <div className="font-serif text-2xl tracking-[0.14em] text-[#e6ad4c]">RELAX · RESTORE · RENEW</div>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#d8d1c4]/78">Bringing healing, relaxation, and balance into your life — so you can feel your best, wherever you are.</p>
        </div>
      </section>

      <section id="about" className="scroll-mt-24 px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <SectionEyebrow>About Golden Essence</SectionEyebrow>
          <div className="grid gap-7 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div>
              <h2 className="font-serif text-4xl leading-tight text-[#f8f1e6] sm:text-5xl">Care that feels personal, calm, and close to home.</h2>
              <p className="mt-5 text-base leading-7 text-[#ddd5c8]/85">Golden Essence Therapeutics was created from a passion for helping people feel better in their bodies and giving them a safe space to relax, restore, and renew.</p>
              <p className="mt-4 text-base leading-7 text-[#ddd5c8]/85">The experience is built around compassionate, personalized care — not a rushed appointment. The goal is to create space to slow down, breathe, and focus on what your body needs.</p>
            </div>
            <div className="overflow-hidden rounded-[28px] border border-[#c59139]/30 bg-[#021719] shadow-xl">
              <img src={ABOUT_ART} alt="Golden Essence waterfall and spa artwork" className="aspect-[4/3] w-full object-cover object-[70%_22%]" />
            </div>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {aboutCards.map(([title, body]) => (
              <article key={title} className="rounded-2xl border border-[#bd8c39]/24 bg-[#062427] p-5">
                <div className="mb-3 text-xl text-[#e5ad4b]">✦</div>
                <h3 className="font-serif text-xl text-[#f2c36a]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#dcd4c8]/78">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="scroll-mt-24 border-y border-[#a7782e]/28 bg-[#f5eee2] px-5 py-16 text-[#102d31] sm:px-8">
        <div className="mx-auto max-w-5xl">
          <SectionEyebrow>Services & Pricing</SectionEyebrow>
          <h2 className="font-serif text-4xl leading-tight text-[#0b3437] sm:text-5xl">Massage therapy, clearly priced.</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#26484b]/82">These are the planned services and prices from Golden Essence. Booking will be connected later; for now this page is informational.</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {services.map((service) => (
              <article key={service.name} className="rounded-[24px] border border-[#c89b52]/35 bg-[#fffaf1] p-5 shadow-sm sm:p-6">
                <h3 className="font-serif text-2xl text-[#17464a]">{service.name}</h3>
                <p className="mt-2 text-sm leading-6 text-[#37585b]/82">{service.blurb}</p>
                <div className="mt-5 divide-y divide-[#d9c6a8]/60 rounded-xl border border-[#d5bc92]/60 bg-[#f9f1e4]">
                  {service.prices.map(([duration, price]) => (
                    <div key={duration} className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm font-semibold uppercase tracking-[0.08em] text-[#4a6263]">{duration}</span>
                      <span className="font-serif text-2xl text-[#9a6420]">{price}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <article className="rounded-[24px] bg-[#07373a] p-6 text-[#f7eee0]">
              <h3 className="font-serif text-2xl text-[#efbd64]">Hot Stone Upgrade</h3>
              <p className="mt-2 text-sm leading-6 text-[#efe5d4]/80">Add smooth, heated stones to any massage to melt away tension and promote deeper relaxation.</p>
              <div className="mt-5 font-serif text-4xl text-[#f2c46d]">+ $20</div>
            </article>
            <article className="rounded-[24px] border border-[#c89b52]/35 bg-[#fffaf1] p-6">
              <h3 className="font-serif text-2xl text-[#17464a]">Chair Massage</h3>
              <div className="mt-4 flex items-center justify-between border-b border-[#dcc8a7] py-3"><span>15 minutes</span><strong className="font-serif text-2xl text-[#9a6420]">$20</strong></div>
              <div className="flex items-center justify-between py-3"><span>30 minutes</span><strong className="font-serif text-2xl text-[#9a6420]">$35</strong></div>
            </article>
          </div>
          <article className="mt-4 overflow-hidden rounded-[24px] border border-[#c89b52]/35 bg-[#fffaf1]">
            <div className="grid gap-0 md:grid-cols-[.8fr_1.2fr]">
              <div className="relative min-h-52 overflow-hidden bg-[#07373a]">
                <img src={SERVICES_ART} alt="Golden Essence service artwork" className="absolute inset-0 h-full w-full object-cover object-[77%_17%] opacity-85" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#07373a]/45 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-2xl text-[#17464a]">Mobile Massage Travel Fee</h3>
                <p className="mt-2 text-sm leading-6 text-[#37585b]/82">Travel fees are based on one-way distance to the client’s location.</p>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[['0–10 mi', '$10'], ['11–20 mi', '$25'], ['21–50 mi', '$50'], ['51+ mi', '$75+']].map(([miles, price]) => (
                    <div key={miles} className="rounded-xl border border-[#d7c2a0] bg-[#f8efe1] p-3 text-center"><div className="text-xs font-bold uppercase tracking-[0.08em] text-[#4d6668]">{miles}</div><div className="mt-1 font-serif text-2xl text-[#9a6420]">{price}</div></div>
                  ))}
                </div>
                <p className="mt-3 text-xs leading-5 text-[#587071]">51+ miles requires a 90-minute minimum appointment or multiple clients at the same location. Additional fees may apply beyond 50 miles.</p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section id="policies" className="scroll-mt-24 px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <SectionEyebrow>Policies</SectionEyebrow>
          <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <h2 className="font-serif text-4xl leading-tight text-[#f8f1e6] sm:text-5xl">Professional care. Clear expectations. Peace of mind.</h2>
              <p className="mt-4 text-base leading-7 text-[#ddd5c8]/82">Golden Essence policies are here in readable form instead of being locked inside a desktop graphic.</p>
              <img src={POLICIES_ART} alt="Golden Essence policies artwork" className="mt-6 aspect-[16/9] w-full rounded-[24px] border border-[#b88738]/30 object-cover object-[60%_8%] opacity-90" />
            </div>
            <div className="space-y-3">
              {policies.map(([title, body]) => (
                <details key={title} className="group rounded-2xl border border-[#b88738]/24 bg-[#052326] open:bg-[#082c2f]" open={title === 'Appointments & Booking'}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-serif text-lg text-[#efbd64] marker:hidden">
                    {title}<span className="text-[#d7a54e] transition group-open:rotate-45">＋</span>
                  </summary>
                  <p className="px-5 pb-5 text-sm leading-6 text-[#dfd7ca]/80">{body}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 border-t border-[#a7782e]/35 bg-[#f5eee2] px-5 py-16 text-[#153639] sm:px-8">
        <div className="mx-auto max-w-5xl">
          <SectionEyebrow>Contact</SectionEyebrow>
          <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <h2 className="font-serif text-4xl leading-tight text-[#0b3437] sm:text-5xl">Questions? Reach out anytime.</h2>
              <p className="mt-4 text-base leading-7 text-[#38585b]/82">Booking will be added later. For now, this gives future clients a clean way to learn about Golden Essence and ask questions.</p>
              <div className="mt-6 space-y-3">
                <a href={`tel:${PHONE}`} className="flex items-center gap-4 rounded-2xl border border-[#c89b52]/35 bg-[#fffaf1] p-4"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#07373a] text-[#e8b75d]">☎</span><div><div className="text-xs uppercase tracking-[0.12em] text-[#6d7e7e]">Phone</div><div className="font-semibold">{PHONE_DISPLAY}</div></div></a>
                <a href={`mailto:${EMAIL}`} className="flex items-center gap-4 rounded-2xl border border-[#c89b52]/35 bg-[#fffaf1] p-4"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#07373a] text-[#e8b75d]">✉</span><div className="min-w-0"><div className="text-xs uppercase tracking-[0.12em] text-[#6d7e7e]">Email</div><div className="break-all font-semibold">{EMAIL}</div></div></a>
                <div className="flex items-center gap-4 rounded-2xl border border-[#c89b52]/35 bg-[#fffaf1] p-4"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#07373a] text-[#e8b75d]">⌖</span><div><div className="text-xs uppercase tracking-[0.12em] text-[#6d7e7e]">Service Area</div><div className="font-semibold">Cache County & surrounding areas, Utah</div></div></div>
              </div>
              <img src={CONTACT_ART} alt="Golden Essence contact artwork" className="mt-5 aspect-[16/10] w-full rounded-[24px] border border-[#c89b52]/35 object-cover object-[68%_12%]" />
            </div>
            <form action={mailto} method="get" onSubmit={(event) => { event.preventDefault(); window.location.href = mailto; }} className="rounded-[28px] border border-[#c89b52]/40 bg-[#fffaf1] p-5 shadow-xl sm:p-7">
              <h3 className="font-serif text-2xl text-[#17464a]">Send a message</h3>
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
        </div>
      </section>

      <footer className="bg-[#011013] px-5 py-10 text-center">
        <div className="mx-auto flex max-w-xl flex-col items-center">
          <LotusMark />
          <div className="mt-2 font-serif text-xl tracking-[0.12em] text-[#e6ad4c]">GOLDEN ESSENCE THERAPEUTICS</div>
          <div className="mt-1 font-serif text-[#d4aa64]">Where Healing Comes Home.</div>
          <p className="mt-4 text-xs leading-5 text-[#d5ccbd]/60">Portfolio preview · Built by Misfit Mediahouse</p>
          <a href={PAYMENT_URL} target="_blank" rel="noopener noreferrer" className="mt-6 rounded-full border border-[#f2c85d] bg-[#f2c85d] px-6 py-3 text-sm font-bold text-[#08272a]">Activate this site · $297</a>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#a7782e]/55 bg-[#011013]/96 px-2 py-2 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {navItems.map(([id, label]) => (
            <button key={id} type="button" onClick={() => scrollToId(id)} className="rounded-xl px-1 py-2 text-[9px] font-bold uppercase tracking-[0.05em] text-[#e5b65c] active:bg-[#17383a]">{label}</button>
          ))}
        </div>
      </div>
      <div className="h-16 bg-[#011013] md:hidden" />
    </main>
  );
}
