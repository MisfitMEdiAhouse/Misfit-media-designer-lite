import { useEffect, useMemo, useState } from 'react';

const PAYMENT_URL = 'https://buy.stripe.com/9B6cN5caS66q4ym1wY8ww0y';
const EMAIL = 'goldenessencetherapeutics@gmail.com';
const PHONE_DISPLAY = '435-760-4808';
const PHONE = '+14357604808';

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
  {
    name: 'Swedish Massage',
    description: 'A relaxing full-body massage using long, flowing strokes to improve circulation, reduce stress, and promote overall well-being.',
    prices: [['60 minutes', '$75'], ['90 minutes', '$110'], ['120 minutes', '$145']],
  },
  {
    name: 'Deep Tissue Massage',
    description: 'Therapeutic, deep-pressure techniques that target inner layers of muscles and connective tissue to release chronic tension and pain.',
    prices: [['60 minutes', '$95'], ['90 minutes', '$140'], ['120 minutes', '$180']],
  },
  {
    name: 'Reflexology',
    description: 'Focused pressure on reflex points in the feet, hands, or ears that correspond to different organs and systems to support balance and overall wellness.',
    prices: [['60 minutes', '$75'], ['90 minutes', '$110']],
  },
  {
    name: 'Joint Mobilization',
    description: 'Gentle, guided movements of the joints to improve mobility, reduce stiffness, and restore healthy range of motion.',
    prices: [['60 minutes', '$80'], ['90 minutes', '$115']],
  },
  {
    name: 'Craniosacral Therapy',
    description: 'A gentle, light-touch therapy that supports the central nervous system, relieves tension, and promotes deep relaxation and balance.',
    prices: [['60 minutes', '$110'], ['90 minutes', '$155'], ['120 minutes', '$200']],
  },
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
    <button type="button" onClick={() => scrollTo('home')} className="grid w-full grid-cols-[54px_1fr_54px] items-center gap-2 px-4 py-4 text-[#e9b95a]" aria-label="Golden Essence home">
      <Lotus className="h-11 w-11 justify-self-start" />
      <span className="text-center">
        <span className="block font-serif text-[18px] font-semibold tracking-[0.14em]">GOLDEN ESSENCE</span>
        <span className="mt-0.5 block font-serif text-[10px] tracking-[0.30em] text-[#f1e5d0]">THERAPEUTICS</span>
        <span className="mt-1 block font-serif text-[11px] italic tracking-[0.08em] text-[#d8ad63]">Where Healing Comes Home.</span>
      </span>
      <Lotus className="h-11 w-11 justify-self-end" />
    </button>
  );
}

function SectionLabel({ children }) {
  return <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#dda94f]">{children}</div>;
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
    <main className="min-h-screen overflow-x-hidden bg-[#011013] pb-20 text-[#f6efe3]">
      <header className="sticky top-0 z-50 border-b border-[#b78535]/50 bg-[#011013]/98 shadow-[0_8px_24px_rgba(0,0,0,.28)] backdrop-blur">
        <BrandHeader />
      </header>

      <section id="home" className="scroll-mt-28 relative overflow-hidden border-b border-[#b78535]/35">
        <div className="absolute inset-0 opacity-90" style={{ background: 'radial-gradient(circle at 70% 20%, rgba(234,181,82,.24), transparent 22%), radial-gradient(circle at 24% 42%, rgba(13,104,103,.38), transparent 35%), linear-gradient(160deg, #011013 0%, #062d30 52%, #011013 100%)' }} />
        <div className="absolute -right-16 top-16 h-52 w-52 rounded-full border-[18px] border-[#e8b658]/80 shadow-[0_0_70px_rgba(232,182,88,.18)]" />
        <div className="relative px-6 pb-16 pt-16 text-center">
          <div className="mx-auto mb-7 w-fit rounded-full border border-[#c79642]/35 bg-[#052326]/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#e6b65b]">Mobile Massage Therapy · Cache County</div>
          <h1 className="font-serif text-[48px] leading-[0.92] text-[#fffaf0]">Golden Essence<br /><span className="text-[#e4ad4f]">Therapeutics</span></h1>
          <p className="mx-auto mt-5 max-w-sm font-serif text-2xl italic text-[#dcb66f]">Where Healing Comes Home.</p>
          <p className="mx-auto mt-7 max-w-md text-[17px] leading-8 text-[#ece4d7]/82">Professional, personalized mobile massage therapy serving Cache County and surrounding areas in Utah.</p>
          <div className="mx-auto mt-8 grid max-w-sm gap-3">
            <button onClick={() => scrollTo('services')} className="rounded-full bg-[#e0a23a] px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-[#06292c]">View Services & Pricing</button>
            <button onClick={() => scrollTo('contact')} className="rounded-full border border-[#d7a34b]/60 bg-[#041c1f] px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-[#efc26d]">Contact / Questions</button>
          </div>
        </div>
        <div className="relative border-t border-[#b78535]/30 bg-[#031c1f] px-6 py-8 text-center">
          <Lotus className="mx-auto h-14 w-14 text-[#d6a449]" />
          <div className="mt-3 font-serif text-2xl tracking-[0.11em] text-[#e0ae51]">RELAX · RESTORE · RENEW</div>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#ded6c8]/75">Bringing healing, relaxation, and balance into your life — so you can feel your best, wherever you are.</p>
        </div>
      </section>

      <section id="about" className="scroll-mt-28 px-5 py-14">
        <div className="mx-auto max-w-xl">
          <SectionLabel>About</SectionLabel>
          <h2 className="mt-3 font-serif text-4xl leading-tight text-[#f7f0e4]">Care that feels personal, calm, and close to home.</h2>
          <p className="mt-5 text-base leading-7 text-[#ddd5c8]/82">Golden Essence Therapeutics was created from a passion for helping people feel better in their bodies and giving them a safe space to relax, restore, and renew.</p>
          <p className="mt-4 text-base leading-7 text-[#ddd5c8]/82">The experience is built around compassionate, personalized care — not a rushed appointment. The goal is to create space to slow down, breathe, and focus on what your body needs.</p>

          <div className="mt-8 space-y-3">
            {aboutCards.map(([title, body], index) => (
              <details key={title} className="group overflow-hidden rounded-2xl border border-[#b88738]/28 bg-[#052629]" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 marker:hidden">
                  <span className="font-serif text-2xl text-[#edbd63]">{title}</span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#d4a34c]/45 text-xl text-[#dca94d] transition group-open:rotate-45">＋</span>
                </summary>
                <p className="border-t border-[#b88738]/18 px-5 pb-6 pt-4 text-[15px] leading-7 text-[#e3dacd]/80">{body}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="scroll-mt-28 bg-[#f5eee2] px-5 py-14 text-[#12383b]">
        <div className="mx-auto max-w-xl">
          <SectionLabel>Services & Pricing</SectionLabel>
          <h2 className="mt-3 font-serif text-4xl leading-tight text-[#0d3c40]">Massage therapy, clearly priced.</h2>
          <p className="mt-4 text-base leading-7 text-[#36595c]">All sessions are customized to your needs. Prices reflect massage time only. Travel fees apply to all mobile appointments.</p>

          <div className="mt-8 space-y-4">
            {services.map((service) => (
              <article key={service.name} className="rounded-3xl border border-[#c9a46a]/40 bg-[#fffaf2] p-5 shadow-sm">
                <h3 className="font-serif text-2xl text-[#17484c]">{service.name}</h3>
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
              <p className="mt-2 text-sm leading-6 text-[#f0e6d5]/80">Add smooth, heated stones to any massage to melt away tension and promote deeper relaxation.</p>
              <div className="mt-4 font-serif text-4xl text-[#f1c46e]">+ $20</div>
            </article>

            <article className="rounded-3xl border border-[#c9a46a]/40 bg-[#fffaf2] p-6">
              <h3 className="font-serif text-2xl text-[#17484c]">Chair Massage</h3>
              <div className="mt-4 flex justify-between border-b border-[#ddc9a7] py-3"><span>15 minutes</span><strong className="font-serif text-2xl text-[#9a6523]">$20</strong></div>
              <div className="flex justify-between py-3"><span>30 minutes</span><strong className="font-serif text-2xl text-[#9a6523]">$35</strong></div>
            </article>

            <article className="rounded-3xl border border-[#c9a46a]/40 bg-[#fffaf2] p-6">
              <h3 className="font-serif text-2xl text-[#17484c]">Mobile Massage Travel Fee</h3>
              <p className="mt-2 text-sm leading-6 text-[#446467]">Travel fees are based on one-way distance to the client’s location.</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[['0–10 miles', '$10'], ['11–20 miles', '$25'], ['21–50 miles', '$50'], ['51+ miles', '$75+']].map(([distance, price]) => (
                  <div key={distance} className="rounded-2xl border border-[#d8c09a] bg-[#f8eee0] p-4 text-center">
                    <div className="text-xs font-bold uppercase tracking-[0.08em] text-[#5d7274]">{distance}</div>
                    <div className="mt-1 font-serif text-3xl text-[#9a6523]">{price}</div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-5 text-[#607678]">51+ miles requires a 90-minute minimum appointment or multiple clients at the same location. Additional fees may apply for distances over 50 miles.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="policies" className="scroll-mt-28 px-5 py-14">
        <div className="mx-auto max-w-xl">
          <SectionLabel>Policies</SectionLabel>
          <h2 className="mt-3 font-serif text-4xl leading-tight text-[#f7f0e4]">Professional care. Clear expectations. Peace of mind.</h2>
          <p className="mt-4 text-base leading-7 text-[#ddd5c8]/82">Tap any policy below to read it. Nothing is hidden inside a desktop graphic.</p>
          <div className="mt-8 space-y-3">
            {policies.map(([title, body], index) => (
              <details key={title} className="group rounded-2xl border border-[#b88738]/28 bg-[#052629]" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 marker:hidden">
                  <span className="font-serif text-xl text-[#efbf68]">{title}</span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#d4a34c]/45 text-xl text-[#dca94d] transition group-open:rotate-45">＋</span>
                </summary>
                <p className="border-t border-[#b88738]/18 px-5 pb-6 pt-4 text-[15px] leading-7 text-[#e3dacd]/80">{body}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-28 bg-[#f5eee2] px-5 py-14 text-[#143b3e]">
        <div className="mx-auto max-w-xl">
          <SectionLabel>Contact</SectionLabel>
          <h2 className="mt-3 font-serif text-4xl leading-tight text-[#0d3c40]">Questions? Reach out anytime.</h2>
          <p className="mt-4 text-base leading-7 text-[#446467]">Booking will be added later. For now, this site gives future clients a clean way to learn about Golden Essence and ask questions.</p>

          <div className="mt-7 space-y-3">
            <a href={`tel:${PHONE}`} className="flex items-center gap-4 rounded-2xl border border-[#c9a46a]/40 bg-[#fffaf2] p-4">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#07383b] text-xl text-[#e8b75d]">☎</span>
              <span><span className="block text-xs font-bold uppercase tracking-[0.12em] text-[#728486]">Phone</span><span className="font-semibold">{PHONE_DISPLAY}</span></span>
            </a>
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-4 rounded-2xl border border-[#c9a46a]/40 bg-[#fffaf2] p-4">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#07383b] text-xl text-[#e8b75d]">✉</span>
              <span className="min-w-0"><span className="block text-xs font-bold uppercase tracking-[0.12em] text-[#728486]">Email</span><span className="block break-all font-semibold">{EMAIL}</span></span>
            </a>
            <div className="flex items-center gap-4 rounded-2xl border border-[#c9a46a]/40 bg-[#fffaf2] p-4">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#07383b] text-xl text-[#e8b75d]">⌖</span>
              <span><span className="block text-xs font-bold uppercase tracking-[0.12em] text-[#728486]">Service Area</span><span className="font-semibold">Cache County & surrounding areas, Utah</span></span>
            </div>
          </div>

          <form onSubmit={(event) => { event.preventDefault(); window.location.href = mailto; }} className="mt-6 rounded-3xl border border-[#c9a46a]/40 bg-[#fffaf2] p-5 shadow-lg">
            <h3 className="font-serif text-2xl text-[#17484c]">Send a Message</h3>
            <p className="mt-1 text-sm text-[#617779]">Your email app will open with the message ready to send.</p>
            <div className="mt-5 grid gap-4">
              <label className="text-sm font-semibold">Full Name<input required value={form.name} onChange={update('name')} className="mt-2 w-full rounded-xl border border-[#cfbb96] bg-white px-4 py-3 text-base outline-none focus:border-[#a87527]" placeholder="Your name" /></label>
              <label className="text-sm font-semibold">Email<input required type="email" value={form.email} onChange={update('email')} className="mt-2 w-full rounded-xl border border-[#cfbb96] bg-white px-4 py-3 text-base outline-none focus:border-[#a87527]" placeholder="you@example.com" /></label>
              <label className="text-sm font-semibold">Phone<input type="tel" value={form.phone} onChange={update('phone')} className="mt-2 w-full rounded-xl border border-[#cfbb96] bg-white px-4 py-3 text-base outline-none focus:border-[#a87527]" placeholder="Optional" /></label>
              <label className="text-sm font-semibold">Subject<select value={form.subject} onChange={update('subject')} className="mt-2 w-full rounded-xl border border-[#cfbb96] bg-white px-4 py-3 text-base outline-none focus:border-[#a87527]"><option>General question</option><option>Help choosing a service</option><option>School / business information</option><option>Other question</option></select></label>
              <label className="text-sm font-semibold">Message<textarea required rows={5} value={form.message} onChange={update('message')} className="mt-2 w-full resize-none rounded-xl border border-[#cfbb96] bg-white px-4 py-3 text-base outline-none focus:border-[#a87527]" placeholder="How can I help?" /></label>
              <button type="submit" className="rounded-full bg-[#dca13a] px-5 py-4 text-sm font-bold uppercase tracking-[0.08em] text-[#073034]">Send Message</button>
            </div>
          </form>
        </div>
      </section>

      <footer className="px-5 py-12 text-center">
        <Lotus className="mx-auto h-16 w-16 text-[#d8a64b]" />
        <div className="mt-4 font-serif text-xl tracking-[0.12em] text-[#e6ad4c]">GOLDEN ESSENCE THERAPEUTICS</div>
        <div className="mt-1 font-serif italic text-[#d4aa64]">Where Healing Comes Home.</div>
        <p className="mx-auto mt-4 max-w-sm text-xs leading-5 text-[#d5ccbd]/60">Mobile massage therapy serving Cache County and surrounding areas in Utah.</p>
        <a href={PAYMENT_URL} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex rounded-full bg-[#f2c85d] px-7 py-4 text-sm font-bold text-[#08272a]">Activate this site · $297</a>
        <div className="mt-4 text-[10px] uppercase tracking-[0.18em] text-[#c8bca8]/45">Portfolio preview built by Misfit Mediahouse</div>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#b78535]/45 bg-[#011013]/98 px-2 py-2 backdrop-blur" aria-label="Golden Essence mobile navigation">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {navItems.map(([id, label]) => (
            <button key={id} type="button" onClick={() => scrollTo(id)} className="rounded-xl px-1 py-2.5 text-[9px] font-bold uppercase tracking-[0.05em] text-[#e8b75d] active:bg-[#17383a]">{label}</button>
          ))}
        </div>
      </nav>
    </main>
  );
}
