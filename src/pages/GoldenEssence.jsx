import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PAYMENT_URL = 'https://buy.stripe.com/9B6cN5caS66q4ym1wY8ww0y';
const EMAIL = 'goldenessencetherapeutics@gmail.com';
const PHONE = '+14357604808';

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
    title: 'Golden Essence Therapeutics | Services & Pricing',
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

const portraitNav = [
  ['home', 38.0, 1.4, 7.0, 5.5],
  ['about', 45.0, 1.4, 7.2, 5.5],
  ['services', 52.2, 1.4, 8.5, 5.5],
  ['services', 60.8, 1.4, 7.4, 5.5],
  ['contact', 68.2, 1.4, 8.3, 5.5],
  ['contact', 76.5, 1.4, 7.4, 5.5],
  ['contact', 83.4, 1.0, 15.7, 6.0],
];

const landscapeNav = [
  ['home', 41.2, 0.9, 5.4, 7.5],
  ['about', 46.6, 0.9, 5.8, 7.5],
  ['services', 52.4, 0.9, 6.4, 7.5],
  ['services', 58.8, 0.9, 5.6, 7.5],
  ['contact', 64.4, 0.9, 6.5, 7.5],
  ['contact', 70.9, 0.9, 6.1, 7.5],
  ['contact', 77.2, 0.6, 20.5, 8.2],
];

function Hotspot({ left, top, width, height, label, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="absolute z-20 cursor-pointer rounded-sm bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` }}
    />
  );
}

function NavigationHotspots({ landscape, navigate }) {
  const nav = landscape ? landscapeNav : portraitNav;
  return (
    <>
      <Hotspot left={1} top={0.5} width={landscape ? 37 : 35} height={landscape ? 8 : 6.5} label="Golden Essence home" onClick={() => navigate(pages.home.path)} />
      {nav.map(([key, left, top, width, height], i) => (
        <Hotspot key={`${key}-${i}`} left={left} top={top} width={width} height={height} label={`Open ${key}`} onClick={() => navigate(pages[key].path)} />
      ))}
    </>
  );
}

function ContactFormOverlay() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const fieldStyle = (value) => ({ background: value ? 'rgba(248,244,236,.98)' : 'rgba(255,255,255,.015)' });

  const submit = (event) => {
    event.preventDefault();
    const subject = form.subject || 'Golden Essence website inquiry';
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      '',
      form.message,
    ].join('\n');
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const common = 'absolute z-30 border-0 px-[1.1%] text-[#18363a] outline-none focus:ring-2 focus:ring-[#c68a2f]';
  return (
    <form onSubmit={submit} className="absolute inset-0 z-30" aria-label="Golden Essence contact form">
      <input required aria-label="Full name" value={form.name} onChange={update('name')} className={common} style={{ left: '32.1%', top: '41.4%', width: '33.5%', height: '2.9%', ...fieldStyle(form.name), fontSize: 'clamp(8px,1.15vw,15px)' }} />
      <input required type="email" aria-label="Email address" value={form.email} onChange={update('email')} className={common} style={{ left: '32.1%', top: '45.8%', width: '33.5%', height: '2.9%', ...fieldStyle(form.email), fontSize: 'clamp(8px,1.15vw,15px)' }} />
      <input type="tel" aria-label="Phone number" value={form.phone} onChange={update('phone')} className={common} style={{ left: '32.1%', top: '50.2%', width: '33.5%', height: '2.9%', ...fieldStyle(form.phone), fontSize: 'clamp(8px,1.15vw,15px)' }} />
      <select aria-label="Subject" value={form.subject} onChange={update('subject')} className={common} style={{ left: '32.1%', top: '54.6%', width: '33.5%', height: '2.9%', ...fieldStyle(form.subject), fontSize: 'clamp(8px,1.15vw,15px)', opacity: form.subject ? 1 : 0.02 }}>
        <option value="">Select a topic</option>
        <option>New client question</option>
        <option>Help choosing a service</option>
        <option>Booking request</option>
        <option>Other question</option>
      </select>
      <textarea required aria-label="Message" value={form.message} onChange={update('message')} className={`${common} resize-none py-[1%]`} style={{ left: '32.1%', top: '59.0%', width: '33.5%', height: '7.7%', ...fieldStyle(form.message), fontSize: 'clamp(8px,1.15vw,15px)' }} />
      <button type="submit" aria-label="Send message" className="absolute z-40 cursor-pointer bg-transparent" style={{ left: '32.1%', top: '67.7%', width: '33.5%', height: '3.25%' }} />
      <a href={`tel:${PHONE}`} aria-label="Call Golden Essence" className="absolute z-40" style={{ left: '7.5%', top: '39.2%', width: '22%', height: '5%' }} />
      <a href={`mailto:${EMAIL}`} aria-label="Email Golden Essence" className="absolute z-40" style={{ left: '7.5%', top: '44.2%', width: '23%', height: '5%' }} />
    </form>
  );
}

export default function GoldenEssence() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const key = routeKey(pathname);
  const page = pages[key];
  const landscape = page.width > page.height;

  useEffect(() => {
    document.title = page.title;
  }, [page.title]);

  const aspect = useMemo(() => `${page.width} / ${page.height}`, [page.width, page.height]);

  return (
    <main className="min-h-screen bg-[#031d20]">
      <div className="relative mx-auto w-full" style={{ maxWidth: `${page.width}px`, aspectRatio: aspect }}>
        <img
          key={page.src}
          src={page.src}
          width={page.width}
          height={page.height}
          alt={`Golden Essence Therapeutics ${key} page`}
          className="block h-auto w-full select-none"
          draggable="false"
        />
        <NavigationHotspots landscape={landscape} navigate={navigate} />

        {key === 'home' && (
          <Hotspot left={34.0} top={52.7} width={31.5} height={5.8} label="Book your session" onClick={() => navigate(pages.contact.path)} />
        )}

        {key === 'contact' && <ContactFormOverlay />}
      </div>

      <a
        href={PAYMENT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 z-[80] rounded-full border border-[#f2c85d] bg-[#f2c85d] px-4 py-2.5 text-xs font-bold text-[#08272a] shadow-2xl shadow-black/40 transition hover:bg-white sm:px-5 sm:py-3 sm:text-sm"
      >
        Activate site · $297
      </a>
    </main>
  );
}
