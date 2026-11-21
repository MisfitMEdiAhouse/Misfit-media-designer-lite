import { useState } from 'react';
import { Mail, ShieldCheck, Users } from 'lucide-react';

const API = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/gta-vi-fan-interest';

export default function GTAVIFanJoin() {
  const [form, setForm] = useState({ display_name: '', email: '', interest: 'player', over_18: false, marketing_consent: false, website: '' });
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting');
    setMessage('');
    try {
      const params = new URLSearchParams(window.location.search);
      const r = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          utm_source: params.get('utm_source') || '',
          utm_medium: params.get('utm_medium') || '',
          utm_campaign: params.get('utm_campaign') || '',
          referral: params.get('ref') || '',
        }),
      });
      const result = await r.json();
      if (!r.ok || !result.ok) throw new Error(result.error === 'rate_limited'
        ? 'Too many attempts. Please try again later.'
        : 'Signup is temporarily unavailable. Your email was not confirmed or added.');
      setStatus('saved');
      setMessage("Interest received. You're on the unverified interest queue; no marketing emails will be sent until an email-confirmation process is available.");
      setForm({ display_name: '', email: '', interest: 'player', over_18: false, marketing_consent: false, website: '' });
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unable to save your request.');
    }
  };

  return <section id="gta-vi-crew" className="mt-6 overflow-hidden rounded-[2rem] border border-fuchsia-300/25 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.1),transparent_45%),linear-gradient(130deg,#12081c,#060709)] p-5 md:p-8">
    <div className="grid gap-7 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[.15em] text-fuchsia-200">GTA VI LAUNCH · INDEPENDENT MISFIT FAN COMMUNITY</div>
        <h2 className="mt-3 font-display text-3xl font-black leading-tight sm:text-4xl">The game is here. <span className="text-cyan-300">Find your crew.</span></h2>
        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
          Join the free Misfit GTA VI community interest list. Discover independent creator spotlights,
          player meetups and future Misfit events as they become available. This is not access to an
          official GTA VI server or an in-game purchase.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2 text-xs text-slate-300"><Users size={16} className="text-cyan-300"/> Free player & creator interest</div>
          <div className="flex items-center gap-2 text-xs text-slate-300"><ShieldCheck size={16} className="text-fuchsia-300"/> No game account or password needed</div>
        </div>
        <p className="mt-5 text-[11px] leading-5 text-slate-500">
          Misfit Mediahouse is independent and not endorsed by Rockstar Games or Take-Two. GTA V/FiveM community listings are separate from GTA VI.
        </p>
      </div>
      <form onSubmit={submit} className="relative min-w-0 rounded-3xl border border-white/10 bg-black/40 p-4 sm:p-6">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold"><Mail size={18} className="text-cyan-300"/> Free interest signup</div>
        <label htmlFor="gta6-name" className="block text-xs text-slate-300">Name or gamer tag (optional)</label>
        <input id="gta6-name" value={form.display_name} maxLength={70} onChange={e => setForm(v => ({...v,display_name:e.target.value}))} placeholder="Your gamer tag" autoComplete="nickname" className="mt-1 mb-3 min-h-11 w-full rounded-xl border border-white/15 bg-black px-3 text-sm text-white outline-none focus:border-cyan-300"/>
        <label htmlFor="gta6-email" className="block text-xs text-slate-300">Email address</label>
        <input id="gta6-email" required type="email" autoComplete="email" maxLength={254} value={form.email} onChange={e => setForm(v => ({...v,email:e.target.value}))} placeholder="you@example.com" className="mt-1 mb-3 min-h-11 w-full rounded-xl border border-white/15 bg-black px-3 text-sm text-white outline-none focus:border-cyan-300"/>
        <label htmlFor="gta6-interest" className="block text-xs text-slate-300">I'm joining as a…</label>
        <select id="gta6-interest" value={form.interest} onChange={e => setForm(v => ({...v,interest:e.target.value}))} className="mt-1 mb-4 min-h-11 w-full rounded-xl border border-white/15 bg-black px-3 text-sm text-white outline-none">
          <option value="player">Player / fan</option>
          <option value="creator">Creator / streamer</option>
          <option value="community">Community organizer</option>
          <option value="updates">Independent gaming updates</option>
        </select>
        <div className="absolute -left-[10000px]" aria-hidden="true"><label htmlFor="gta6-website">Website</label><input id="gta6-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={e => setForm(v => ({...v,website:e.target.value}))}/></div>
        <label className="mb-3 flex cursor-pointer items-start gap-2 text-xs leading-5 text-slate-300"><input required type="checkbox" checked={form.over_18} onChange={e => setForm(v=>({...v,over_18:e.target.checked}))} className="mt-1 accent-cyan-300"/> I am 18 or older.</label>
        <label className="flex cursor-pointer items-start gap-2 text-xs leading-5 text-slate-300"><input required type="checkbox" checked={form.marketing_consent} onChange={e => setForm(v=>({...v,marketing_consent:e.target.checked}))} className="mt-1 accent-cyan-300"/> I request Misfit gaming community news and promotional emails once my email is verified. I can unsubscribe at any time. This is not an official Rockstar mailing list.</label>
        <button disabled={status === 'submitting'} className="mt-4 min-h-12 w-full rounded-xl bg-cyan-300 px-4 font-mono text-xs font-black text-black hover:bg-cyan-200 disabled:opacity-50">{status === 'submitting' ? 'SAVING…' : 'JOIN THE FREE MISFIT INTEREST LIST'}</button>
        {message && <p role="status" className={'mt-3 rounded-xl border p-3 text-xs leading-5 ' + (status === 'saved' ? 'border-emerald-300/30 bg-emerald-300/5 text-emerald-100' : 'border-amber-300/30 bg-amber-300/5 text-amber-100')}>{message}</p>}
        <p className="mt-4 text-[10px] leading-5 text-slate-500">Your request is stored privately. Email verification and broadcast sending are not yet enabled. See our <a href="/privacy-policy.html" className="underline hover:text-white">privacy policy</a>.</p>
      </form>
    </div>
  </section>;
}
