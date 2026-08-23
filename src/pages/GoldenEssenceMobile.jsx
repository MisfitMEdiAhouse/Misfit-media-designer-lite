import { useEffect, useMemo, useState } from 'react';

const PAYMENT_URL = 'https://buy.stripe.com/9B6cN5caS66q4ym1wY8ww0y';
const EMAIL = 'goldenessencetherapeutics@gmail.com';
const PHONE_DISPLAY = '435-760-4808';
const PHONE = '+14357604808';

const HOME_ART = 'https://cdn.shopify.com/s/files/1/0714/0068/5750/files/golden-essence-home.jpg?v=1787457016';
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
    <button type="button" onClick={() => scrollTo('home')} className="grid w-full grid-cols-[48px_1fr_48px] items-center gap-2 px-4 py-3.5 text-[#e9b95a]" aria-label="Golden Essence home">
      <Lotus className="h-10 w-10 justify-self-start" />
      <span className="text-center">
        <span className="block font-serif text-[18px] font-semibold leading-none tracking-[0.13em]">GOLDEN ESSENCE</span>
        <span className="mt-1 block font-serif text-[9px] tracking-[0.30em] text-[#f1e5d0]">THERAPEUTICS</span>
        <span className="mt-1 block font-serif text-[10px] italic tracking-[0.05em] text-[#d8ad63]">Where Healing Comes Home.</span>
      </span>
      <Lotus className="h-10 w-10 justify-self-end" />
    </button>
  );
}

function SectionLabel({ children, light = false }) {
  return <div className={`text-[11px] font-bold uppercase tracking-[0.28em] ${light ? 'text-[#f0bd60]' : 'text-[#b87b25]'}`}>{children}</div>;
}

function ScenicPanel({ image, position = '70% 45%', eyebrow, title, subtitle }) {
  return (
    <div className="relative min-h-[330px] overflow-hidden border-y border-[#b78535]/35">
      <img src={image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-[1.03] object-cover" style={{ objectPosition: position }} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#001214]/20 via-[#001214]/42 to-[#001214]/96" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#001214]/82 via-[#001214]/30 to-transparent" />
      <div className="relative flex min-h-[330px] flex-col justify-end px-6 pb-8 pt-12">
        <SectionLabel light>{eyebrow}</SectionLabel>
        <h2 className="mt-3 max-w-[330px] font-serif text-[40px] leading-[1.02] text-[#fff8ed]">{title}</h2>
        {subtitle && <p className="mt-3 max-w-[330px] text-[15px] leading-6 text-[#f2e8db]/80">{subtitle}</p>}
      </div>
    </div>
  );
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
      <header className="sticky top-0 z-50 border-b border-[#b78535]/55 bg-[#011013]/97 shadow-[0_8px_26px_rgba(0,0,0,.32)] backdrop-blur">
        <BrandHeader />
      </header>

      <section id="home" className="scroll-mt-24 relative min-h-[86svh] overflow-hidden border-b border-[#b78535]/40">
        <img src={HOME_ART} alt="Golden Essence waterfall, moon, lotus and butterflies" className="absolute inset-0 h-full w-full object-cover object-[52%_30%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#011013]/12 via-[#011013]/18 to-[#011013]/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#011013]/30 via-transparent to-[#011013]/12" />
        <div className="relative flex min-h-[86svh] flex-col justify-end px-6 pb-10 pt-20 text-center">
          <div className="mx-auto w-full max-w-sm rounded-[30px] border border-[#e0b45c]/35 bg-[#011013]/64 p-6 shadow-[0_18px_60px_rgba(0,0,0,.42)] backdrop-blur-[2px]">
            <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#e4b158]">Mobile Massage Therapy · Cache County</div>
            <h1 className="mt-3 font-serif text-[47px] leading-[0.94] text-[#fffaf0]">Golden Essence<br /><span className="text-[#e4ad4f]">Therapeutics</span></h1>
            <p className="mt-4 font-serif text-2xl italic text-[#e6bd70]">Where Healing Comes Home.</p>
            <p className="mt-5 text-[15px] leading-7 text-[#f0e8dc]/86">Professional, personalized mobile massage therapy serving Cache County and surrounding areas in Utah.</p>
            <div className="mt-6 grid gap-3">
              <button onClick={() => scrollTo('services')} className="rounded-full bg-[#e0a23a] px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-[#06292c] shadow-lg">View Services & Pricing</button>
              <button onClick={() => scrollTo('contact')} className="rounded-full border border-[#d7a34b]/70 bg-[#011013]/78 px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-[#efc26d]">Contact / Questions</button>
            </div>
          </div>
          <div className="mx-auto mt-7 flex items-center gap-3 text-[#dca84c]">
            <span className="h-px w-14 bg-[#dca84c]/60" /><Lotus className="h-9 w-9" /><span className="h-px w-14 bg-[#dca84c]/60" />
          </div>
          <div className="mt-2 font-serif text-lg tracking-[0.13em] text-[#e4b356]">RELAX · RESTORE · RENEW</div>
        </div>
      </section>

      <section id="about" className="scroll-mt-24">
        <ScenicPanel
          image={ABOUT_ART}
          position="78% 40%"
          eyebrow="About"
          title="Care that feels personal, calm, and close to home."
          subtitle="Golden Essence was created from a passion for helping people feel better in their bodies and giving them a safe space to relax, restore, and renew."
        />
        <div className="px-5 py-10">
          <div className="mx-auto max-w-xl">
            <p className="text-base leading-7 text-[#e2dacd]/84">The experience is built around compassionate, personalized care — not a rushed appointment. The goal is to create space to slow down, breathe, and focus on what your body needs.</p>
            <div className="mt-7 space-y-3">
              {aboutCards.map(([title, body], index) => (
                <details key={title} className="group overflow-hidden rounded-2xl border border-[#b88738]/30 bg-[#052629] shadow-[0_8px_25px_rgba(0,0,0,.16)]" open={index === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 marker:hidden">
                    <span className="flex items-center gap-3 font-serif text-[22px] text-[#edbd63]"><span className="text-sm">✦</span>{title}</span>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#d4a34c]/45 text-xl text-[#dca94d] transition group-open:rotate-45">＋</span>
                  </summary>
                  <p className="border-t border-[#b88738]/20 px-5 pb-6 pt-4 text-[15px] leading-7 text-[#e3dacd]/82">{body}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="scroll-mt-24 bg-[#f5eee2] text-[#12383b]">
        <ScenicPanel
          image={SERVICES_ART}
          position="80% 28%"
          eyebrow="Services & Pricing"
          title="Massage therapy designed around you."
          subtitle="Relax. Restore. Renew. Clear pricing, personalized care, and mobile service brought to your space."
        />
        <div className="px-5 py-10">
          <div className="mx-auto max-w-xl">
            <p className="text-base leading-7 text-[#36595c]">All sessions are customized to your needs. Prices reflect massage time only. Travel fees apply to all mobile appointments.</p>
            <div className="mt-7 space-y-4">
              {services.map((service) => (
                <article key={service.name} className="overflow-hidden rounded-3xl border border-[#c9a46a]/45 bg-[#fffaf2] shadow-[0_10px_30px_rgba(76,49,14,.08)]">
                  <div className="border-b border-[#dcc7a2] bg-gradient-to-r from-[#fffaf2] to-[#f0e1c8] px-5 py-4">
                    <h3 className="font-serif text-2xl text-[#17484c]">{service.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#446467]">{service.description}</p>
                  </div>
                  <div className="divide-y divide-[#dfcdae]">
                    {service.prices.map(([duration, price]) => (
                      <div key={duration} className="flex items-center justify-between px-5 py-4">
                        <span className="font-semibold text-[#536c6e]">{duration}</span>
                        <span className="font-serif text-[28px] text-[#9a6523]">{price}</span>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-4 grid gap-4">
              <article className="relative overflow-hidden rounded-3xl bg-[#07383b] p-6 text-[#f7eee0] shadow-lg">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#d99d36]/12" />
                <h3 className="font-serif text-2xl text-[#efbf68]">Hot Stone Upgrade</h3>
                <p className="mt-2 text-sm leading-6 text-[#efe3d2]/82">Add smooth, heated stones to any massage to melt away tension and promote deeper relaxation.</p>
                <div className="mt-5 font-serif text-4xl text-[#f3c56f]">+ $20</div>
              </article>
              <article className="rounded-3xl border border-[#c9a46a]/45 bg-[#fffaf2] p-6 shadow-sm">
                <h3 className="font-serif text-2xl text-[#17484c]">Chair Massage</h3>
                <div className="mt-4 flex items-center justify-between border-b border-[#dfcdae] py-3"><span>15 minutes</span><span className="font-serif text-2xl text-[#9a6523]">$20</span></div>
                <div className="flex items-center justify-between py-3"><span>30 minutes</span><span className="font-serif text-2xl text-[#9a6523]">$35</span></div>
              </article>
              <article className="rounded-3xl border border-[#c9a46a]/45 bg-[#fffaf2] p-6 shadow-sm">
                <h3 className="font-serif text-2xl text-[#17484c]">Mobile Massage Travel Fee</h3>
                <p className="mt-2 text-sm leading-6 text-[#446467]">Travel fees are based on one-way distance to the client’s location.</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[['0–10 mi', '$10'], ['11–20 mi', '$25'], ['21–50 mi', '$50'], ['51+ mi', '$75+']].map(([miles, price]) => (
                    <div key={miles} className="rounded-2xl border border-[#d7bd92] bg-[#f8efe1] px-3 py-4 text-center">
                      <div className="text-xs font-bold uppercase tracking-[0.08em] text-[#5b7071]">{miles}</div>
                      <div className="mt-1 font-serif text-[30px] text-[#9a6523]">{price}</div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs leading-5 text-[#617577]">51+ miles requires a 90-minute minimum appointment or multiple clients at the same location. Additional fees may apply beyond 50 miles.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="policies" className="scroll-mt-24 bg-[#011013]">
        <ScenicPanel
          image={POLICIES_ART}
          position="72% 4%"
          eyebrow="Policies"
          title="Professional care. Clear expectations. Peace of mind."
          subtitle="Every policy is readable and expandable right here on your phone."
        />
        <div className="px-5 py-10">
          <div className="mx-auto max-w-xl space-y-3">
            {policies.map(([title, body], index) => (
              <details key={title} className="group overflow-hidden rounded-2xl border border-[#b88738]/28 bg-[#052629]" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 marker:hidden">
                  <span className="font-serif text-[21px] text-[#edbd63]">{title}</span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#d4a34c]/45 text-xl text-[#dca94d] transition group-open:rotate-45">＋</span>
                </summary>
                <p className="border-t border-[#b88738]/18 px-5 pb-6 pt-4 text-[15px] leading-7 text-[#e3dacd]/82">{body}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 bg-[#f5eee2] text-[#143b3e]">
        <ScenicPanel
          image={CONTACT_ART}
          position="80% 14%"
          eyebrow="Contact"
          title="Questions? I’m here to help."
          subtitle="Booking will be connected when Golden Essence is ready. For now, reach out with questions about services or the future business."
        />
        <div className="px-5 py-10">
          <div className="mx-auto max-w-xl">
            <div className="grid gap-3">
              <a href={`tel:${PHONE}`} className="flex items-center gap-4 rounded-2xl border border-[#c9a46a]/45 bg-[#fffaf2] p-4 shadow-sm"><span className="grid h-11 w-11 place-items-center rounded-full bg-[#07383b] text-[#efbd64]">☎</span><div><div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#788889]">Phone</div><div className="mt-1 font-semibold">{PHONE_DISPLAY}</div></div></a>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-4 rounded-2xl border border-[#c9a46a]/45 bg-[#fffaf2] p-4 shadow-sm"><span className="grid h-11 w-11 place-items-center rounded-full bg-[#07383b] text-[#efbd64]">✉</span><div className="min-w-0"><div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#788889]">Email</div><div className="mt-1 break-all font-semibold">{EMAIL}</div></div></a>
              <div className="flex items-center gap-4 rounded-2xl border border-[#c9a46a]/45 bg-[#fffaf2] p-4 shadow-sm"><span className="grid h-11 w-11 place-items-center rounded-full bg-[#07383b] text-[#efbd64]">⌖</span><div><div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#788889]">Service Area</div><div className="mt-1 font-semibold">Cache County & surrounding areas, Utah</div></div></div>
            </div>

            <form onSubmit={(event) => { event.preventDefault(); window.location.href = mailto; }} className="mt-6 rounded-3xl border border-[#c9a46a]/45 bg-[#fffaf2] p-5 shadow-[0_14px_35px_rgba(76,49,14,.09)]">
              <h3 className="font-serif text-3xl text-[#17484c]">Send a Message</h3>
              <p className="mt-2 text-sm leading-6 text-[#5c7375]">Fill this out and your email app will open with the message ready to send.</p>
              <div className="mt-5 grid gap-4">
                <label className="text-sm font-semibold">Full Name<input required value={form.name} onChange={update('name')} className="mt-2 w-full rounded-xl border border-[#cfba96] bg-white px-4 py-3 text-base outline-none focus:border-[#b67c29]" placeholder="Your name" /></label>
                <label className="text-sm font-semibold">Email<input required type="email" value={form.email} onChange={update('email')} className="mt-2 w-full rounded-xl border border-[#cfba96] bg-white px-4 py-3 text-base outline-none focus:border-[#b67c29]" placeholder="you@example.com" /></label>
                <label className="text-sm font-semibold">Phone<input type="tel" value={form.phone} onChange={update('phone')} className="mt-2 w-full rounded-xl border border-[#cfba96] bg-white px-4 py-3 text-base outline-none focus:border-[#b67c29]" placeholder="Optional" /></label>
                <label className="text-sm font-semibold">Subject<select value={form.subject} onChange={update('subject')} className="mt-2 w-full rounded-xl border border-[#cfba96] bg-white px-4 py-3 text-base outline-none focus:border-[#b67c29]"><option>General question</option><option>Help choosing a service</option><option>School / business information</option><option>Other question</option></select></label>
                <label className="text-sm font-semibold">Message<textarea required rows={5} value={form.message} onChange={update('message')} className="mt-2 w-full resize-none rounded-xl border border-[#cfba96] bg-white px-4 py-3 text-base outline-none focus:border-[#b67c29]" placeholder="How can I help?" /></label>
                <button type="submit" className="rounded-full bg-[#dda13a] px-5 py-4 text-sm font-bold uppercase tracking-[0.09em] text-[#082c2f] shadow-lg">Send Message</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <footer className="bg-[#011013] px-5 py-10 text-center">
        <div className="mx-auto flex max-w-xl flex-col items-center">
          <div className="grid w-full grid-cols-[58px_1fr_58px] items-center gap-2 text-[#dfac4e]">
            <Lotus className="h-12 w-12" />
            <div><div className="font-serif text-xl tracking-[0.12em]">GOLDEN ESSENCE</div><div className="mt-1 text-[10px] tracking-[0.28em] text-[#f0e6d7]">THERAPEUTICS</div></div>
            <Lotus className="h-12 w-12 justify-self-end" />
          </div>
          <div className="mt-2 font-serif italic text-[#d7ae66]">Where Healing Comes Home.</div>
          <p className="mt-4 text-xs leading-5 text-[#d5ccbd]/58">Portfolio preview · Built by Misfit Mediahouse</p>
          <a href={PAYMENT_URL} target="_blank" rel="noopener noreferrer" className="mt-6 rounded-full bg-[#f0c55f] px-7 py-4 text-sm font-bold text-[#08272a] shadow-lg">Activate this site · $297</a>
        </div>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#ad7d30]/55 bg-[#011013]/96 px-2 py-2 shadow-[0_-10px_30px_rgba(0,0,0,.24)] backdrop-blur" aria-label="Golden Essence mobile navigation">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {navItems.map(([id, label]) => (
            <button key={id} type="button" onClick={() => scrollTo(id)} className="rounded-xl px-1 py-2.5 text-[9px] font-bold uppercase tracking-[0.05em] text-[#e6b45a] active:bg-[#15383a]">{label}</button>
          ))}
        </div>
      </nav>
    </main>
  );
}
