import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PAYMENT_URL = 'https://buy.stripe.com/9B6cN5caS66q4ym1wY8ww0y';
const EMAIL = 'goldenessencetherapeutics@gmail.com';
const PHONE = '+14357604808';
const pageOrder = ['home', 'about', 'services', 'policies', 'contact'];

const pages = {
  home: {
    path: '/portfolio/golden-essence',
    src: 'https://cdn.shopify.com/s/files/1/0714/0068/5750/files/golden-essence-home.jpg?v=1787457016',
    width: 1024,
    height: 1536,
    title: 'Golden Essence Therapeutics | Home',
  },
  about: {
    path: '/portfolio/golden-essence/about',
    src: 'https://cdn.shopify.com/s/files/1/0714/0068/5750/files/golden-essence-about.jpg?v=1787457028',
    width: 1536,
    height: 1229,
    title: 'Golden Essence Therapeutics | About',
  },
  services: {
    path: '/portfolio/golden-essence/services',
    src: 'https://cdn.shopify.com/s/files/1/0714/0068/5750/files/golden-essence-services.jpg?v=1787457091',
    width: 1024,
    height: 1536,
    title: 'Golden Essence Therapeutics | Services',
  },
  policies: {
    path: '/portfolio/golden-essence/policies',
    src: 'https://cdn.shopify.com/s/files/1/0714/0068/5750/files/golden-essence-policies.jpg?v=1787457099',
    width: 1024,
    height: 1536,
    title: 'Golden Essence Therapeutics | Policies',
  },
  contact: {
    path: '/portfolio/golden-essence/contact',
    src: 'https://cdn.shopify.com/s/files/1/0714/0068/5750/files/golden-essence-contact.jpg?v=1787457108',
    width: 1024,
    height: 1536,
    title: 'Golden Essence Therapeutics | Contact',
  },
};

function routeKey(pathname) {
  if (pathname.endsWith('/about')) return 'about';
  if (pathname.endsWith('/services')) return 'services';
  if (pathname.endsWith('/policies')) return 'policies';
  if (pathname.endsWith('/contact')) return 'contact';
  return 'home';
}

function Hotspot({ left, top, width, height, label, onClick, className = '' }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`absolute z-30 cursor-pointer rounded-sm bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${className}`}
      style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` }}
    />
  );
}

function HeaderCleanup({ pageKey, go }) {
  if (pageKey === 'policies') return null;
  const landscape = pageKey === 'about';
  const style = landscape
    ? { left: '31%', top: '0%', width: '69%', height: '9.2%' }
    : { left: '34%', top: '0%', width: '66%', height: '8.1%' };

  return (
    <div className="absolute z-20 border-b border-[#b77d2b]/70 bg-[#031d20]" style={style}>
      <div className="hidden h-full items-center justify-end gap-[2.1%] px-[2.2%] md:flex">
        {pageOrder.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => go(key)}
            className="whitespace-nowrap border-b border-transparent pb-1 font-serif text-[clamp(9px,1.05vw,14px)] uppercase tracking-[0.04em] text-[#f7eee0] transition hover:border-[#e2ad45] hover:text-[#e7b44d]"
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}

function PoliciesDesktopNav({ go }) {
  return (
    <nav className="hidden border-b border-[#b77d2b]/70 bg-[#031d20] text-[#f7eee0] md:block" aria-label="Golden Essence desktop navigation">
      <div className="mx-auto flex max-w-[1024px] items-center justify-between gap-6 px-6 py-4">
        <button type="button" onClick={() => go('home')} className="text-left">
          <div className="font-serif text-lg tracking-[0.08em] text-[#e7b44d]">GOLDEN ESSENCE</div>
          <div className="font-serif text-[10px] tracking-[0.28em] text-[#f7eee0]/80">THERAPEUTICS</div>
        </button>
        <div className="flex items-center gap-6">
          {pageOrder.map((key) => (
            <button key={key} type="button" onClick={() => go(key)} className="font-serif text-xs uppercase tracking-[0.06em] hover:text-[#e7b44d]">
              {key}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

function HomeContactCTA({ go }) {
  return (
    <button
      type="button"
      onClick={() => go('contact')}
      className="absolute z-40 flex items-center justify-center rounded-[4px] border border-[#e3ae43] bg-gradient-to-b from-[#f1c86e] to-[#d8932f] font-serif font-semibold uppercase tracking-[0.03em] text-[#092c2e] shadow-lg"
      style={{ left: '34%', top: '52.55%', width: '31.8%', height: '5.95%', fontSize: 'clamp(9px,2.3vw,24px)' }}
      aria-label="Contact Golden Essence"
    >
      Contact / Questions
    </button>
  );
}

function ContactQuestionCleanup() {
  return (
    <div
      className="absolute z-20 flex flex-col justify-center rounded-md bg-[#f7f1e8] px-[1.4%] text-[#18363a]"
      style={{ left: '70.0%', top: '50.9%', width: '24.5%', height: '8.2%', fontSize: 'clamp(8px,1.15vw,14px)' }}
    >
      <div className="font-serif font-semibold">Have a Question?</div>
      <div className="mt-1 leading-snug">Send a message and I’ll get back to you as soon as I can.</div>
    </div>
  );
}

function ContactFormOverlay() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const fieldStyle = (value) => ({ background: value ? 'rgba(248,244,236,.98)' : 'rgba(255,255,255,.015)' });

  const submit = (event) => {
    event.preventDefault();
    const subject = form.subject || 'Golden Essence website inquiry';
    const body = [`Name: ${form.name}`, `Email: ${form.email}`, `Phone: ${form.phone}`, '', form.message].join('\n');
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const common = 'pointer-events-auto absolute z-30 border-0 px-[1.1%] text-[#18363a] outline-none focus:ring-2 focus:ring-[#c68a2f]';
  return (
    <form onSubmit={submit} className="pointer-events-none absolute inset-0 z-30" aria-label="Golden Essence contact form">
      <input required aria-label="Full name" value={form.name} onChange={update('name')} className={common} style={{ left: '32.1%', top: '41.4%', width: '33.5%', height: '2.9%', ...fieldStyle(form.name), fontSize: 'clamp(10px,1.15vw,15px)' }} />
      <input required type="email" aria-label="Email address" value={form.email} onChange={update('email')} className={common} style={{ left: '32.1%', top: '45.8%', width: '33.5%', height: '2.9%', ...fieldStyle(form.email), fontSize: 'clamp(10px,1.15vw,15px)' }} />
      <input type="tel" aria-label="Phone number" value={form.phone} onChange={update('phone')} className={common} style={{ left: '32.1%', top: '50.2%', width: '33.5%', height: '2.9%', ...fieldStyle(form.phone), fontSize: 'clamp(10px,1.15vw,15px)' }} />
      <select aria-label="Subject" value={form.subject} onChange={update('subject')} className={common} style={{ left: '32.1%', top: '54.6%', width: '33.5%', height: '2.9%', ...fieldStyle(form.subject), fontSize: 'clamp(10px,1.15vw,15px)', opacity: form.subject ? 1 : 0.02 }}>
        <option value="">Select a topic</option>
        <option>New client question</option>
        <option>Help choosing a service</option>
        <option>School / business information</option>
        <option>Other question</option>
      </select>
      <textarea required aria-label="Message" value={form.message} onChange={update('message')} className={`${common} resize-none py-[1%]`} style={{ left: '32.1%', top: '59.0%', width: '33.5%', height: '7.7%', ...fieldStyle(form.message), fontSize: 'clamp(10px,1.15vw,15px)' }} />
      <button type="submit" aria-label="Send message" className="pointer-events-auto absolute z-40 cursor-pointer bg-transparent" style={{ left: '32.1%', top: '67.7%', width: '33.5%', height: '3.25%' }} />
      <a href={`tel:${PHONE}`} aria-label="Call Golden Essence" className="pointer-events-auto absolute z-40" style={{ left: '7.5%', top: '39.2%', width: '22%', height: '5%' }} />
      <a href={`mailto:${EMAIL}`} aria-label="Email Golden Essence" className="pointer-events-auto absolute z-40" style={{ left: '7.5%', top: '44.2%', width: '23%', height: '5%' }} />
    </form>
  );
}

function ArtworkPage({ pageKey, go, mobile = false }) {
  const page = pages[pageKey];
  return (
    <section
      id={`golden-${pageKey}`}
      className="relative mx-auto w-full scroll-mt-16 bg-[#031d20]"
      style={{ maxWidth: mobile ? '100%' : `${page.width}px` }}
      aria-label={`Golden Essence ${pageKey}`}
    >
      {pageKey === 'policies' && !mobile && <PoliciesDesktopNav go={go} />}
      <div className="relative w-full" style={{ aspectRatio: `${page.width} / ${page.height}` }}>
        <img
          src={page.src}
          width={page.width}
          height={page.height}
          alt={`Golden Essence Therapeutics ${pageKey} page`}
          className="block h-auto w-full select-none"
          draggable="false"
        />
        <HeaderCleanup pageKey={pageKey} go={go} />
        {pageKey !== 'policies' && (
          <Hotspot left={1} top={0.4} width={pageKey === 'about' ? 29 : 33} height={pageKey === 'about' ? 8 : 6.5} label="Golden Essence home" onClick={() => go('home')} />
        )}
        {pageKey === 'home' && <HomeContactCTA go={go} />}
        {pageKey === 'contact' && <ContactQuestionCleanup />}
        {pageKey === 'contact' && <ContactFormOverlay />}
      </div>
    </section>
  );
}

function MobileNav({ go }) {
  return (
    <nav className="sticky top-0 z-[70] border-b border-[#b77d2b]/50 bg-[#031d20]/95 px-2 py-2 backdrop-blur md:hidden" aria-label="Golden Essence mobile navigation">
      <div className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {pageOrder.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => go(key)}
            className="shrink-0 rounded-full border border-[#c79339]/40 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#f0c466] active:bg-[#c79339] active:text-[#031d20]"
          >
            {key}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default function GoldenEssence() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const key = routeKey(pathname);

  const go = (target) => {
    if (window.matchMedia('(max-width: 767px)').matches) {
      const node = document.getElementById(`golden-${target}`);
      if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (window.location.pathname !== pages[target].path) window.history.replaceState({}, '', pages[target].path);
      return;
    }
    navigate(pages[target].path);
  };

  useEffect(() => {
    document.title = pages[key].title;
    if (window.matchMedia('(max-width: 767px)').matches && key !== 'home') {
      const timer = window.setTimeout(() => document.getElementById(`golden-${key}`)?.scrollIntoView({ block: 'start' }), 80);
      return () => window.clearTimeout(timer);
    }
  }, [key]);

  return (
    <main className="min-h-screen bg-[#031d20]">
      <div className="md:hidden">
        <MobileNav go={go} />
        {pageOrder.map((pageKey) => <ArtworkPage key={pageKey} pageKey={pageKey} go={go} mobile />)}
      </div>

      <div className="hidden md:block">
        <ArtworkPage pageKey={key} go={go} />
      </div>

      <a
        href={PAYMENT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-3 right-3 z-[90] rounded-full border border-[#f2c85d] bg-[#f2c85d] px-3 py-2 text-[11px] font-bold text-[#08272a] shadow-2xl shadow-black/40 transition hover:bg-white sm:bottom-4 sm:right-4 sm:px-5 sm:py-3 sm:text-sm"
      >
        Activate site · $297
      </a>
    </main>
  );
}
