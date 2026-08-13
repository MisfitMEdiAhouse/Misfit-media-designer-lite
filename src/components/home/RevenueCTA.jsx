import { useEffect, useState } from 'react';

export default function RevenueCTA() {
  const [email, setEmail] = useState('');
  useEffect(() => {
    fetch('/contact.json').then((r) => r.json()).then((v) => setEmail(v.email || '')).catch(() => {});
  }, []);
  return (
    <section id="request-demo" className="border-t border-white/5 py-16">
      <div className="mx-auto max-w-5xl px-5 text-center">
        <h2 className="font-display text-4xl sm:text-6xl font-bold uppercase">Build with Misfit.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-slate-400">Bring the business problem. We’ll figure out the system.</p>
        {email && <a href={`mailto:${email}?subject=Build%20with%20Misfit`} className="mt-7 inline-flex rounded-full bg-cyan-400 px-6 py-3 font-mono text-xs font-semibold uppercase text-black">Start a project</a>}
      </div>
    </section>
  );
}
