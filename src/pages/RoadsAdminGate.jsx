import { useEffect } from 'react';

const ROADS_BACK_OFFICE = 'https://roads-growth-command-center.pricemedia82.chatgpt.site/';

export default function RoadsAdminGate() {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.location.replace(ROADS_BACK_OFFICE);
    }, 250);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="grid min-h-screen place-items-center bg-[#050607] px-5 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0a0d0f] p-7 text-center shadow-2xl">
        <img src="/roads-co-logo.svg" alt="Roads Co." className="mx-auto h-14 w-44 object-contain invert" />
        <div className="mt-6 font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#00c7f2]">Private Back Office</div>
        <h1 className="mt-3 font-display text-4xl font-black uppercase tracking-[-0.03em]">Roads Admin</h1>
        <p className="mt-4 text-sm leading-6 text-white/55">Opening the authenticated Roads revenue and success command center.</p>
        <a href={ROADS_BACK_OFFICE} className="mt-7 inline-flex min-h-12 w-full items-center justify-center bg-[#00c7f2] px-5 py-4 font-mono text-[9px] font-black uppercase tracking-[0.15em] text-black">Open Roads Back Office</a>
      </div>
    </main>
  );
}
