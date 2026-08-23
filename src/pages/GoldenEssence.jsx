import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  CalendarDays, Car, Clock3, Heart, Mail, MapPin, Menu, MessageCircle,
  Moon, Phone, ShieldCheck, Sparkles, Star, X
} from 'lucide-react';

const GOLD = '#d7a84d';
const TEAL = '#062f31';
const paymentUrl = 'https://buy.stripe.com/9B6cN5caS66q4ym1wY8ww0y';
const phoneHref = 'tel:+14357604808';
const emailHref = 'mailto:goldenessencetherapeutics@gmail.com';

const nav = [
  ['Home', '/portfolio/golden-essence'],
  ['About', '/portfolio/golden-essence/about'],
  ['Services', '/portfolio/golden-essence/services'],
  ['Policies', '/portfolio/golden-essence/policies'],
  ['Contact', '/portfolio/golden-essence/contact'],
];

const services = [
  { name: 'Swedish Massage', copy: 'Long, flowing strokes to improve circulation, reduce stress, and promote overall well-being.', prices: [['60 minutes', '$75'], ['90 minutes', '$110'], ['120 minutes', '$145']] },
  { name: 'Deep Tissue Massage', copy: 'Therapeutic, deep-pressure techniques targeting inner layers of muscles and connective tissue.', prices: [['60 minutes', '$95'], ['90 minutes', '$140'], ['120 minutes', '$180']] },
  { name: 'Reflexology', copy: 'Focused pressure on reflex points in the feet, hands, or ears to support balance and overall wellness.', prices: [['60 minutes', '$75'], ['90 minutes', '$110']] },
  { name: 'Joint Mobilization', copy: 'Gentle, guided joint movement to improve mobility, reduce stiffness, and restore healthy range of motion.', prices: [['60 minutes', '$80'], ['90 minutes', '$115']] },
  { name: 'Craniosacral Therapy', copy: 'A gentle, light-touch therapy supporting the central nervous system, relaxation, and balance.', prices: [['60 minutes', '$110'], ['90 minutes', '$155'], ['120 minutes', '$200']] },
];

const policies = [
  ['Appointments & Booking', 'All sessions are by appointment only. Payment is required 12 hours before the appointment to secure your booking.'],
  ['No Show or Cancellation', 'If you cancel, reschedule, or do not show, the full scheduled price is charged because the time was reserved for you.'],
  ['Late Arrivals', 'Please be ready and on time. A late arrival may shorten the session so the next client can remain on schedule. The full price still applies.'],
  ['Mobile Massage Therapy', 'Please provide a safe, clean, quiet, smoke-free space with enough room for the massage table and therapist to work comfortably.'],
  ['Payment Policy', 'Full payment is required 12 hours before your appointment. Payments are non-refundable for cancellations or no-shows.'],
  ['Professional Boundaries', 'Professional therapeutic massage only. Sexual talk, comments, or requests are not tolerated and will end the session immediately.'],
  ['Personal Hygiene', 'Please shower before your appointment to help create a clean, comfortable, relaxing experience for both client and therapist.'],
  ['Health Information', 'Before the session, disclose medical conditions, injuries, allergies, medications, pregnancy, or anything else relevant to your care.'],
  ['Illness', 'Please reschedule for fever, contagious illness, vomiting, diarrhea, or other symptoms that could put others at risk.'],
  ['Right to Modify or End a Session', 'You may request changes to pressure, techniques, positioning, temperature, or music at any time. Either party may end a session for safety or comfort concerns.'],
  ['Minors', 'Clients under 18 require appropriate parent or legal guardian consent before receiving massage therapy.'],
  ['Privacy', 'Personal and health information is kept private and confidential and is only shared when required or permitted by law.'],
];

function Lotus({ className = '' }) {
  return <div className={`text-[2rem] leading-none ${className}`} style={{ color: GOLD }}>✦</div>;
}

function PreviewBar() {
  return (
    <div className="sticky top-0 z-[70] border-b border-white/10 bg-black/95 px-4 py-2 text-white backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 text-[11px] sm:text-xs">
        <div className="font-mono uppercase tracking-[0.16em] text-white/65">Misfit Mediahouse portfolio preview</div>
        <a href={paymentUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-amber-300/40 bg-amber-300 px-4 py-2 font-semibold text-black transition hover:bg-white">
          Activate this site · $297
        </a>
      </div>
    </div>
  );
}

function BrandHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  return (
    <header className="sticky top-[49px] z-50 border-b border-amber-300/25 bg-[#031f21]/95 text-white backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 lg:px-8">
        <Link to="/portfolio/golden-essence" className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full border border-amber-300/50 text-2xl">✦</div>
            <div>
              <div className="font-serif text-lg font-semibold tracking-[0.12em] text-amber-300 sm:text-xl">GOLDEN ESSENCE</div>
              <div className="font-serif text-[10px] tracking-[0.35em] text-white/80 sm:text-xs">THERAPEUTICS</div>
              <div className="font-serif text-xs italic text-amber-200/80">Where Healing Comes Home.</div>
            </div>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([label, href]) => {
            const active = pathname === href;
            return <Link key={href} to={href} className={`border-b pb-1 text-xs uppercase tracking-[0.12em] transition ${active ? 'border-amber-300 text-amber-300' : 'border-transparent text-white/80 hover:text-amber-200'}`}>{label}</Link>;
          })}
          <Link to="/portfolio/golden-essence/contact" className="rounded-lg bg-gradient-to-b from-amber-200 to-amber-500 px-5 py-3 font-serif text-sm font-semibold text-[#082526] shadow-lg shadow-amber-950/30">Book Your Session</Link>
        </nav>
        <button onClick={() => setOpen((v) => !v)} className="rounded-lg border border-white/15 p-2 lg:hidden" aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-[#031f21] px-4 py-4 lg:hidden">
          <div className="grid gap-2">
            {nav.map(([label, href]) => <Link onClick={() => setOpen(false)} key={href} to={href} className="rounded-lg px-3 py-3 text-sm uppercase tracking-[0.14em] text-white/85 hover:bg-white/5">{label}</Link>)}
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-amber-300/20 bg-[#031f21] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[1.2fr_.8fr_.8fr] lg:px-8">
        <div>
          <div className="font-serif text-2xl text-amber-300">Golden Essence Therapeutics</div>
          <div className="mt-1 font-serif italic text-amber-100/80">Where Healing Comes Home.</div>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/60">Professional, personalized mobile massage therapy serving Cache County and surrounding areas in Utah.</p>
        </div>
        <div className="space-y-3 text-sm text-white/70">
          <a className="flex items-center gap-2 hover:text-amber-200" href={phoneHref}><Phone size={15}/> 435-760-4808</a>
          <a className="flex items-center gap-2 break-all hover:text-amber-200" href={emailHref}><Mail size={15}/> goldenessencetherapeutics@gmail.com</a>
          <div className="flex items-start gap-2"><MapPin size={15} className="mt-1 shrink-0"/> Cache County & surrounding areas</div>
        </div>
        <div className="text-sm text-white/60">
          <div className="font-serif text-lg text-amber-300">Relax · Restore · Renew</div>
          <p className="mt-2">Mobile massage therapy in the comfort and privacy of your home, office, or chosen space.</p>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-4 text-center text-[11px] text-white/40">© 2026 Golden Essence Therapeutics · Portfolio preview built by Misfit Mediahouse</div>
    </footer>
  );
}

function Layout({ children }) {
  return <div className="min-h-screen bg-[#f5efe5] text-[#062f31]"><PreviewBar/><BrandHeader/>{children}<Footer/></div>;
}

function HeroBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_50%_25%,rgba(225,178,78,.22),transparent_22%),radial-gradient(circle_at_15%_60%,rgba(3,67,66,.85),transparent_35%),linear-gradient(180deg,#03191b_0%,#063d3e_56%,#031f21_100%)]">
      <div className="absolute left-[42%] top-14 h-[55%] w-[22%] rounded-b-[45%] bg-gradient-to-b from-white/80 via-cyan-100/35 to-transparent blur-[2px] opacity-70" />
      <div className="absolute bottom-[-10%] left-[-8%] h-[55%] w-[120%] rounded-[50%] border-t border-cyan-200/20 bg-[radial-gradient(ellipse_at_center,rgba(8,120,115,.7),rgba(2,35,37,.96)_65%)]" />
      <div className="absolute right-[7%] top-[14%] h-56 w-56 rounded-full bg-amber-300 shadow-[0_0_90px_rgba(246,194,87,.45)] sm:h-72 sm:w-72" />
      <div className="absolute right-[1%] top-[10%] h-64 w-64 rounded-full bg-[#03191b] sm:h-80 sm:w-80" />
      <div className="absolute bottom-[12%] right-[8%] text-5xl text-cyan-300/70 drop-shadow-xl">🦋</div>
      <div className="absolute left-[8%] top-[25%] text-4xl text-amber-300/70">🦋</div>
    </div>
  );
}

function HomePage() {
  return (
    <Layout>
      <main>
        <section className="relative isolate min-h-[760px] overflow-hidden text-white sm:min-h-[820px]">
          <HeroBackdrop />
          <div className="relative z-10 mx-auto flex min-h-[760px] max-w-7xl items-center justify-center px-5 py-20 text-center sm:min-h-[820px] lg:px-8">
            <div className="max-w-4xl">
              <div className="font-serif text-3xl uppercase tracking-[0.18em] text-white sm:text-5xl">Where</div>
              <h1 className="mt-2 font-serif text-[clamp(4.5rem,13vw,9rem)] leading-[.82] tracking-[-0.04em] text-amber-300">Healing</h1>
              <div className="mt-3 font-serif text-[clamp(3rem,8vw,6rem)] italic leading-none text-amber-300">comes home</div>
              <div className="mx-auto my-8 flex max-w-md items-center gap-4 text-amber-300"><span className="h-px flex-1 bg-amber-300/50"/><Lotus/><span className="h-px flex-1 bg-amber-300/50"/></div>
              <p className="font-serif text-lg uppercase tracking-[0.22em] text-white sm:text-2xl">Mobile Massage Therapy</p>
              <p className="mt-2 font-serif text-xl italic text-white/85 sm:text-3xl">in Cache County & Surrounding Areas</p>
              <Link to="/portfolio/golden-essence/contact" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-gradient-to-b from-amber-200 to-amber-500 px-7 py-4 font-serif text-lg font-semibold text-[#062f31] shadow-2xl shadow-black/30"><CalendarDays size={20}/> Book Your Session</Link>
            </div>
          </div>
        </section>
        <section className="relative overflow-hidden bg-[#073336] px-5 py-20 text-center text-white">
          <div className="mx-auto max-w-3xl">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-amber-300/40 text-4xl text-amber-300">✦</div>
            <h2 className="mt-6 font-serif text-3xl uppercase tracking-[0.14em] text-amber-300 sm:text-5xl">Relax. Restore. Renew.</h2>
            <div className="mx-auto mt-5 h-px w-32 bg-amber-300/50" />
            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-white/75">Bringing healing, relaxation, and balance into your life — so you can feel your best, wherever you are.</p>
          </div>
        </section>
      </main>
    </Layout>
  );
}

function AboutPage() {
  const cards = [
    [Heart, 'My Why', 'My journey into massage therapy became especially meaningful after experiencing firsthand how therapeutic touch can support the body during pain, stress, and recovery.'],
    [Star, 'Personalized Care', 'Massage should be more than an appointment. Every session is tailored to your individual needs, whether you are looking for relaxation, everyday muscle relief, or time to recharge.'],
    [Car, 'Comfort & Convenience', 'As a mobile massage therapist, I bring the experience directly to you so you can enjoy your massage in your own space without having to drive afterward.'],
    [ShieldCheck, 'You Matter Here', 'The goal is simple: create an environment where you feel comfortable, respected, cared for, and heard.'],
    [Sparkles, 'Holistic Approach', 'Healing is more than physical. Each session supports your body, mind, and spirit — helping you feel balanced, renewed, and your best.'],
  ];
  return (
    <Layout>
      <main>
        <section className="bg-[radial-gradient(circle_at_80%_30%,rgba(215,168,77,.22),transparent_20%),linear-gradient(135deg,#fbf7ef,#e9dfcf)] px-5 py-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="font-serif text-2xl uppercase tracking-[0.15em] text-[#0c5b5f]">About</div>
              <h1 className="mt-2 font-serif text-5xl uppercase leading-[.95] text-[#a9731f] sm:text-7xl">Golden Essence <span className="block text-[#0c5b5f]">Therapeutics</span></h1>
              <p className="mt-5 font-serif text-3xl italic text-[#b2822f]">Where Healing Comes Home.</p>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-[#203d3d]">Golden Essence Therapeutics was created from a passion for helping people feel better in their bodies and giving them a safe space to relax, restore, and renew.</p>
            </div>
            <div className="relative min-h-[420px] overflow-hidden rounded-[3rem] border border-amber-300/40 bg-[radial-gradient(circle_at_70%_25%,rgba(255,239,179,.6),transparent_12%),linear-gradient(145deg,#0b4f4c,#062a2b_65%)] shadow-2xl">
              <div className="absolute left-1/2 top-10 h-[55%] w-28 -translate-x-1/2 rounded-b-full bg-gradient-to-b from-white/85 via-cyan-100/30 to-transparent" />
              <div className="absolute bottom-0 left-0 h-1/2 w-full rounded-t-[50%] bg-[radial-gradient(ellipse_at_center,rgba(20,112,107,.8),rgba(5,45,47,.95)_65%)]" />
              <div className="absolute bottom-12 left-10 text-6xl">🪷</div><div className="absolute bottom-14 right-12 text-5xl">🦋</div>
            </div>
          </div>
        </section>
        <section className="px-5 py-16 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-5">
            {cards.map(([Icon, title, copy]) => <article key={title} className="rounded-3xl border border-[#cfa75d]/35 bg-white/65 p-6 text-center shadow-sm"><Icon className="mx-auto text-[#0b6767]" size={34}/><h2 className="mt-4 font-serif text-lg uppercase tracking-[0.08em] text-[#0b5558]">{title}</h2><div className="mx-auto my-3 h-px w-16 bg-amber-500/40"/><p className="text-sm leading-6 text-[#314c4b]">{copy}</p></article>)}
          </div>
        </section>
      </main>
    </Layout>
  );
}

function ServicesPage() {
  return (
    <Layout>
      <main className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="font-serif text-2xl uppercase tracking-[0.15em] text-[#0c5b5f]">Our</div>
            <h1 className="font-serif text-6xl uppercase leading-none text-[#a9731f] sm:text-8xl">Services</h1>
            <p className="mt-3 font-serif text-3xl italic">Relax. Restore. Renew.</p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#304c4c]">Customized massage therapy designed to help you relax, relieve tension, reduce stress, and support your overall wellness. All sessions are tailored to your unique needs.</p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_320px]">
            <div className="overflow-hidden rounded-3xl border border-amber-700/20 bg-white/70">
              {services.map((s, i) => <div key={s.name} className={`grid gap-4 p-6 md:grid-cols-[1fr_220px] ${i ? 'border-t border-amber-700/15' : ''}`}><div><h2 className="font-serif text-2xl uppercase text-[#173c3d]">{s.name}</h2><p className="mt-2 text-sm leading-6 text-[#49605f]">{s.copy}</p></div><div className="space-y-2">{s.prices.map(([t,p]) => <div className="flex justify-between border-b border-dashed border-amber-700/15 pb-2" key={t}><span className="font-serif uppercase text-[#314b4a]">{t}</span><span className="font-serif text-xl text-[#9a661c]">{p}</span></div>)}</div></div>)}
            </div>
            <div className="space-y-5">
              <article className="rounded-3xl border border-amber-300/40 bg-[#073639] p-6 text-white"><h2 className="font-serif text-3xl uppercase text-amber-300">Hot Stones</h2><div className="my-5 grid h-40 place-items-center rounded-2xl bg-[radial-gradient(circle_at_50%_50%,rgba(231,176,74,.24),transparent_40%),linear-gradient(135deg,#171717,#4a2e19)] text-5xl">● ● ●</div><p className="leading-7 text-white/75">Add smooth, heated stones to any massage to melt away tension and promote deeper relaxation.</p><div className="mt-5 font-serif text-2xl text-amber-300">+ $20</div></article>
              <article className="rounded-3xl border border-amber-700/20 bg-white/70 p-6"><h2 className="font-serif text-2xl uppercase">Chair Massage</h2><p className="mt-2 text-sm text-[#49605f]">Perfect for quick relief anywhere.</p><div className="mt-5 space-y-3 font-serif text-lg"><div className="flex justify-between"><span>15 minutes</span><span className="text-[#9a661c]">$20</span></div><div className="flex justify-between"><span>30 minutes</span><span className="text-[#9a661c]">$35</span></div></div></article>
            </div>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <article className="rounded-3xl border border-amber-700/20 bg-white/70 p-6"><div className="flex items-center gap-3"><Car className="text-[#0c5b5f]"/><h2 className="font-serif text-2xl uppercase">Mobile Massage Therapy</h2></div><p className="mt-3 text-sm leading-6 text-[#49605f]">Enjoy a professional massage in the comfort and privacy of your own home, office, or any space you choose.</p></article>
            <article className="rounded-3xl border border-amber-700/20 bg-white/70 p-6"><h2 className="font-serif text-2xl uppercase">Travel Fee · One Way</h2><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{[['0–10 miles','$10'],['11–20 miles','$25'],['21–50 miles','$50'],['51+ miles','$75+']].map(([a,b])=><div key={a} className="rounded-xl border border-amber-700/15 p-3 text-center"><div className="text-xs uppercase text-[#5d6d6c]">{a}</div><div className="mt-1 font-serif text-xl text-[#9a661c]">{b}</div></div>)}</div><p className="mt-3 text-xs text-[#5f6e6d]">51+ miles requires a 90-minute minimum appointment or multiple clients at the same location. Additional fees may apply for distances over 50 miles.</p></article>
          </div>
        </div>
      </main>
    </Layout>
  );
}

function PoliciesPage() {
  return (
    <Layout>
      <main>
        <section className="bg-[#073639] px-5 py-16 text-white lg:px-8"><div className="mx-auto max-w-7xl"><div className="flex items-center gap-4 text-amber-300"><ShieldCheck/><span className="font-serif uppercase tracking-[0.16em]">Golden Essence Therapeutics</span></div><h1 className="mt-4 font-serif text-6xl uppercase text-amber-300 sm:text-8xl">Policies</h1><p className="mt-3 font-serif text-xl text-white/75">Professional Care · Clear Expectations · Peace of Mind</p></div></section>
        <section className="px-5 py-12 lg:px-8"><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2">{policies.map(([title, copy],i)=><article key={title} className="rounded-3xl border border-amber-700/20 bg-white/65 p-6"><div className="flex gap-4"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#073639] text-amber-300">{i%3===0?<CalendarDays size={22}/>:i%3===1?<ShieldCheck size={22}/>:<Clock3 size={22}/>}</div><div><h2 className="font-serif text-xl uppercase text-[#173c3d]">{title}</h2><p className="mt-2 text-sm leading-6 text-[#49605f]">{copy}</p></div></div></article>)}</div><div className="mx-auto mt-6 max-w-3xl rounded-3xl bg-[#073639] px-6 py-5 text-center text-sm text-white/70"><MapPin className="mx-auto mb-2 text-amber-300"/>Serving Cache County and surrounding areas in Utah. Travel fees may apply based on distance.</div></section>
      </main>
    </Layout>
  );
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = encodeURIComponent(data.get('subject') || 'Golden Essence session inquiry');
    const body = encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\nPhone: ${data.get('phone')}\n\n${data.get('message')}`);
    setSent(true);
    window.location.href = `mailto:goldenessencetherapeutics@gmail.com?subject=${subject}&body=${body}`;
  };
  return (
    <Layout>
      <main>
        <section className="bg-[radial-gradient(circle_at_75%_30%,rgba(215,168,77,.26),transparent_22%),linear-gradient(135deg,#fbf7ef,#e9dfcf)] px-5 py-16 lg:px-8"><div className="mx-auto max-w-7xl"><h1 className="font-serif text-6xl uppercase text-[#062f31] sm:text-8xl">Contact Us</h1><p className="mt-2 font-serif text-3xl italic text-[#b2822f]">We’re Here to Help You.</p><p className="mt-6 max-w-2xl text-base leading-7 text-[#304c4c]">Have questions or ready to book your session? Reach out anytime and I’ll get back to you as soon as possible. Your wellness is my priority.</p></div></section>
        <section className="px-5 py-12 lg:px-8"><div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[320px_1fr_320px]">
          <aside className="rounded-3xl border border-amber-700/20 bg-white/70 p-6"><h2 className="font-serif text-2xl uppercase">Get In Touch</h2><div className="mt-6 space-y-5 text-sm"><a className="flex gap-3" href={phoneHref}><Phone className="mt-1 text-[#0c5b5f]"/><span><strong className="block font-serif text-lg">Phone</strong>435-760-4808</span></a><a className="flex gap-3 break-all" href={emailHref}><Mail className="mt-1 shrink-0 text-[#0c5b5f]"/><span><strong className="block font-serif text-lg">Email</strong>goldenessencetherapeutics@gmail.com</span></a><div className="flex gap-3"><MapPin className="mt-1 text-[#0c5b5f]"/><span><strong className="block font-serif text-lg">Service Area</strong>Cache County & surrounding areas in Utah</span></div><div className="flex gap-3"><Clock3 className="mt-1 text-[#0c5b5f]"/><span><strong className="block font-serif text-lg">Response Time</strong>Typically within 24 hours</span></div></div></aside>
          <form onSubmit={submit} className="rounded-3xl border border-amber-700/20 bg-white/70 p-6"><div className="flex items-center gap-3"><MessageCircle className="text-[#0c5b5f]"/><h2 className="font-serif text-2xl uppercase">Send a Message</h2></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-sm">Full Name *<input required name="name" className="mt-1 w-full rounded-xl border border-amber-700/20 bg-white px-4 py-3 outline-none focus:border-amber-500" placeholder="Your name"/></label><label className="text-sm">Email Address *<input required type="email" name="email" className="mt-1 w-full rounded-xl border border-amber-700/20 bg-white px-4 py-3 outline-none focus:border-amber-500" placeholder="Your email"/></label><label className="text-sm">Phone Number<input name="phone" className="mt-1 w-full rounded-xl border border-amber-700/20 bg-white px-4 py-3 outline-none focus:border-amber-500" placeholder="Your phone number"/></label><label className="text-sm">Subject<input name="subject" className="mt-1 w-full rounded-xl border border-amber-700/20 bg-white px-4 py-3 outline-none focus:border-amber-500" placeholder="Booking or question"/></label></div><label className="mt-4 block text-sm">Message *<textarea required name="message" rows="6" className="mt-1 w-full rounded-xl border border-amber-700/20 bg-white px-4 py-3 outline-none focus:border-amber-500" placeholder="How can I help you?"/></label><button className="mt-4 w-full rounded-xl bg-gradient-to-b from-amber-200 to-amber-500 px-5 py-4 font-serif text-lg font-semibold text-[#062f31]">Send Message</button>{sent && <p className="mt-3 text-center text-xs text-[#49605f]">Opening your email app with this message prepared.</p>}</form>
          <aside className="space-y-5"><div className="rounded-3xl border border-amber-700/20 bg-white/70 p-6"><h2 className="font-serif text-2xl uppercase">Questions?</h2><div className="mt-5 space-y-5 text-sm leading-6 text-[#49605f]"><p><strong className="block font-serif text-lg text-[#173c3d]">New Client?</strong>I’m happy to answer questions about your first session.</p><p><strong className="block font-serif text-lg text-[#173c3d]">Not Sure Which Service?</strong>I can help you choose the best massage for your needs.</p><p><strong className="block font-serif text-lg text-[#173c3d]">Ready to Book?</strong>Call, email, or send a message directly.</p></div></div><div className="rounded-3xl border border-amber-700/20 bg-white/70 p-6"><h2 className="font-serif text-2xl uppercase">Hours</h2><p className="font-serif italic text-[#9a661c]">By Appointment Only</p><div className="mt-4 space-y-2 text-sm"><div className="flex justify-between"><span>Monday – Friday</span><span>9 AM – 7 PM</span></div><div className="flex justify-between"><span>Saturday</span><span>9 AM – 5 PM</span></div><div className="flex justify-between"><span>Sunday</span><span className="text-[#9a661c]">Not Available</span></div></div></div></aside>
        </div></section>
      </main>
    </Layout>
  );
}

export default function GoldenEssence() {
  const { pathname } = useLocation();
  useEffect(() => { document.title = 'Golden Essence Therapeutics | Where Healing Comes Home'; }, []);
  if (pathname.endsWith('/about')) return <AboutPage/>;
  if (pathname.endsWith('/services')) return <ServicesPage/>;
  if (pathname.endsWith('/policies')) return <PoliciesPage/>;
  if (pathname.endsWith('/contact')) return <ContactPage/>;
  return <HomePage/>;
}
