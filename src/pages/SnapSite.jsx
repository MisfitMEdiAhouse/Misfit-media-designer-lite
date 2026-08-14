import { ArrowRight, Check, QrCode, Smartphone, Zap } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const BUY_URL = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/snapsite';
const DEMO_URL = `${BUY_URL}/demo`;

const benefits = [
  'Mobile-first call + text conversion page',
  'Hosted live URL generated after confirmed payment',
  'QR code generated automatically',
  'No monthly software subscription',
  'Built for local service businesses and side hustles',
  'No account or dashboard setup required',
];

export default function SnapSite() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />
      <main>
        <section className="mx-auto max-w-7xl px-5 pb-16 pt-20 sm:pt-28">
          <div className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-300">INSTANT PRODUCT · $49 ONE TIME</div>
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div>
              <h1 className="font-display text-5xl font-extrabold uppercase leading-[.92] tracking-[-.055em] sm:text-7xl lg:text-8xl">A business link built to get the call.</h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">Misfit SnapSite turns a few business details into a sharp, hosted one-page lead site customers can open from a text, social bio, QR code, flyer, business card, or vehicle.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={BUY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.16em] text-black">Build Mine — $49 <ArrowRight size={15}/></a>
                <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-white">Open Live Demo</a>
              </div>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-500">Stripe-hosted checkout · automatic fulfillment · hosting included</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-7 sm:p-9">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">MISFIT SNAPSITE</div>
                  <div className="mt-2 font-display text-4xl font-bold">$49</div>
                </div>
                <Zap className="text-cyan-300" size={30}/>
              </div>
              <div className="mt-6 space-y-4">
                {benefits.map((item) => <div key={item} className="flex gap-3 text-sm leading-6 text-slate-300"><Check size={17} className="mt-1 shrink-0 text-cyan-300"/><span>{item}</span></div>)}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/5 py-16">
          <div className="mx-auto max-w-7xl px-5">
            <div className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-300">ZERO HANDOFF</div>
            <h2 className="mt-4 max-w-4xl font-display text-4xl font-bold uppercase tracking-[-.04em] sm:text-6xl">Fill it out. Pay. Get the live link.</h2>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                [Smartphone, '01', 'Enter the basics', 'Business name, phone, city, services and the offer you want customers to see.'],
                [Zap, '02', 'Stripe confirms payment', 'Checkout is hosted by Stripe. The generator does not publish the site until payment is confirmed.'],
                [QrCode, '03', 'Your URL + QR appear', 'The customer gets the hosted lead page and a QR code immediately on the success screen.'],
              ].map(([Icon, num, title, copy]) => (
                <article key={num} className="rounded-2xl border border-white/10 bg-white/[0.025] p-7">
                  <div className="flex items-center justify-between"><span className="font-mono text-xs text-cyan-300">{num}</span><Icon size={20} className="text-slate-500"/></div>
                  <h3 className="mt-5 font-display text-2xl font-bold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/5 py-16">
          <div className="mx-auto max-w-5xl px-5 text-center">
            <div className="font-mono text-xs uppercase tracking-[0.28em] text-amber-300">BEST FIT</div>
            <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-[-.04em] sm:text-6xl">Junk removal. Detailing. Landscaping. Cleaning. Handyman. Hauling. Mobile service.</h2>
            <p className="mx-auto mt-6 max-w-2xl text-slate-400">SnapSite is deliberately smaller than a custom website. It gives a local operator one fast, clean link whose job is to turn attention into a phone call or text.</p>
            <div className="mt-8 flex justify-center gap-3 flex-wrap">
              <a href={BUY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.16em] text-black">Create a SnapSite <ArrowRight size={15}/></a>
              <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-full border border-white/15 px-6 py-3.5 font-mono text-xs uppercase tracking-[0.16em] text-white">View demo</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
