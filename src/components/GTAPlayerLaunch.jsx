import { useState } from 'react';
import { Check, Copy, Mail, Send, ShieldCheck, Users } from 'lucide-react';

const SB = 'https://cibcxqrqiqvzpardbdrw.supabase.co';
const PK = 'sb_publishable_X-bcgz-3xMIgNZ4rYmAjZA_QNUb69hU';
const INBOX = 'misfitmediahouse@gmail.com';
const ROLES = ['Player', 'Creator / streamer', 'GTA V / FiveM server operator'];
const PLATFORMS = ['PlayStation 5', 'Xbox Series X|S', 'PC / FiveM', 'Other'];
const FORM_VERSION = 'gta_launch_optin_2026_11_21_v1';

const sanitize = (input, limit) => String(input || '').trim().slice(0, limit);

function makeEmail({ email, handle, role, platform }) {
  const subject = 'MISFIT GTA - Free community signup request';
  const body = [
    'I want to join the free, independent Misfit GTA community.',
    '',
    'Email: ' + email,
    'Display handle (optional): ' + (handle || 'Not supplied'),
    'Interest: ' + role,
    'Platform: ' + platform,
    'I confirm I am 18 or older: YES',
    'I consent to Misfit GTA community updates and promotional emails: YES',
    'I understand this is independent from Rockstar/Take-Two: YES',
    'Form version: ' + FORM_VERSION,
    '',
    'Please process this signup only if it is sent from my email account. I can request removal by emailing this address.',
  ].join('\n');
  return `mailto:${INBOX}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Public, opt-in discovery funnel. When Misfit Cloud is writable it uses
 * the existing validated/rate-limited public-catalog intake API.
 * When the API is unavailable, no confirmation is claimed: the visitor
 * must send a prefilled email from their own mail app.
 *
 * No hidden tracking, mass outreach, email enumeration or game credentials.
 */
export default function GTAPlayerLaunch() {
  const [email, setEmail] = useState('');
  const [handle, setHandle] = useState('');
  const [role, setRole] = useState(ROLES[0]);
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [adult, setAdult] = useState(false);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState('idle');
  const [message, setMessage] = useState('');

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSubmit = validEmail && adult && consent;
  const details = {
    email: sanitize(email.toLowerCase(), 254),
    handle: sanitize(handle, 64),
    role,
    platform,
  };
  const mailLink = makeEmail(details);

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit || busy) return;
    setBusy(true);
    setMessage('');
    setState('idle');
    try {
      const ctl = new AbortController();
      const deadline = setTimeout(() => ctl.abort(), 12000);
      let response;
      try {
        response = await fetch(`${SB}/functions/v1/public-catalog`, {
          method: 'POST',
          headers: { 'content-type': 'application/json', apikey: PK },
          body: JSON.stringify({
            operation: 'join_gta_vi_interest',
            display_name: details.handle || 'GTA community member',
            email: details.email,
            interest: details.role === 'Player' ? 'player' : details.role === 'Creator / streamer' ? 'creator' : 'community',
            platform: details.platform,
            over_18: adult,
            marketing_consent: consent,
            utm_source: new URLSearchParams(window.location.search).get('utm_source') || '',
            utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || '',
            utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || '',
            referral: new URLSearchParams(window.location.search).get('ref') || '',
          }),
          signal: ctl.signal,
        });
      } finally {
        clearTimeout(deadline);
      }
      const json = await response.json().catch(() => ({}));
      if (!response.ok || json?.ok !== true || json?.status !== 'interest_received') {
        throw new Error('intake_unavailable');
      }
      setState('saved');
      setMessage('Your interest request was saved in Misfit Cloud. Email verification and marketing broadcasts are not enabled yet; you can request removal at any time.');
    } catch {
      setState('email');
      setMessage('The online signup could not be saved. Open your email app below and press Send to complete the request manually.');
    } finally {
      setBusy(false);
    }
  };

  const share = async () => {
    const url = `${window.location.origin}/gta#join`;
    try {
      if (navigator.share) await navigator.share({ title: 'Misfit GTA community', text: 'Free independent GTA community and creator network', url });
      else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setMessage('Invite link copied. Share it with another GTA fan.');
      } else setMessage('Share this link: ' + url);
    } catch { /* Visitor canceled the native share sheet; no effect. */ }
  };

  return (
    <section id="join" aria-labelledby="misfit-gta-signup-heading" className="mt-6 scroll-mt-28 overflow-hidden rounded-[1.7rem] border border-cyan-300/25 bg-[radial-gradient(circle_at_15%_0%,rgba(34,211,238,.12),transparent_46%),#06090c] p-5 text-white md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.17em] text-cyan-300">
            <Users size={15} /> GTA VI Launch Community — Free
          </div>
          <h2 id="misfit-gta-signup-heading" className="mt-3 font-display text-3xl font-black leading-tight md:text-5xl">The game launched. <span className="text-cyan-300">Find your people.</span></h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Join an independent Misfit community for GTA news, creator spotlights, and future community updates.
            Our existing server directory is for GTA V / FiveM; we are not hosting a GTA VI server.
          </p>
        </div>
        <div className="rounded-xl border border-emerald-300/25 bg-emerald-300/[.07] px-4 py-3 text-xs font-semibold text-emerald-200">Free · No card · Ages 18+</div>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <form onSubmit={submit} className="grid min-w-0 gap-3 rounded-2xl border border-white/10 bg-black/45 p-4 md:p-5">
          <label className="text-xs font-semibold text-slate-300" htmlFor="misfit-gta-email">Email address</label>
          <input id="misfit-gta-email" type="email" required value={email} onChange={e => { setEmail(e.target.value); setState('idle'); }} placeholder="you@example.com" autoComplete="email" maxLength={254} className="min-h-12 w-full min-w-0 rounded-xl border border-white/15 bg-black px-3 text-sm text-white outline-none focus:border-cyan-300" />
          <label className="text-xs font-semibold text-slate-300" htmlFor="misfit-gta-handle">Gamer or creator name (optional)</label>
          <input id="misfit-gta-handle" value={handle} onChange={e => setHandle(e.target.value)} maxLength={64} placeholder="Your gamer tag" className="min-h-12 w-full min-w-0 rounded-xl border border-white/15 bg-black px-3 text-sm text-white outline-none focus:border-cyan-300" />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-xs font-semibold text-slate-300" htmlFor="misfit-gta-role">I'm a...</label>
              <select id="misfit-gta-role" value={role} onChange={e=>setRole(e.target.value)} className="min-h-12 min-w-0 rounded-xl border border-white/15 bg-black px-3 text-sm text-white">{ROLES.map(value=><option key={value} value={value}>{value}</option>)}</select>
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-semibold text-slate-300" htmlFor="misfit-gta-platform">I play on...</label>
              <select id="misfit-gta-platform" value={platform} onChange={e=>setPlatform(e.target.value)} className="min-h-12 min-w-0 rounded-xl border border-white/15 bg-black px-3 text-sm text-white">{PLATFORMS.map(value=><option key={value} value={value}>{value}</option>)}</select>
            </div>
          </div>
          <label className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-slate-300">
            <input type="checkbox" required checked={adult} onChange={e=>setAdult(e.target.checked)} className="mt-1 h-4 w-4 accent-cyan-300" />
            <span>I confirm I am at least 18 years old.</span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-slate-300">
            <input type="checkbox" required checked={consent} onChange={e=>setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-cyan-300" />
            <span>I agree to receive Misfit GTA community updates and promotional emails. I can request removal at <a className="underline decoration-slate-500 underline-offset-2" href={`mailto:${INBOX}?subject=Unsubscribe%20from%20Misfit%20GTA`}>{INBOX}</a>.</span>
          </label>
          <button type="submit" disabled={busy || !canSubmit || state === 'saved'} className="mt-1 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 text-sm font-black text-black transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50">
            {state === 'saved' ? <><Check size={17}/> Request received</> : busy ? 'Checking signup…' : <><Send size={17}/> Request free signup</>}
          </button>
          {message && <p role="status" aria-live="polite" className={`rounded-xl border px-3 py-3 text-xs leading-6 ${state === 'saved' ? 'border-emerald-300/25 bg-emerald-300/[.06] text-emerald-200' : 'border-amber-300/25 bg-amber-300/[.06] text-amber-200'}`}>{message}</p>}
          {state === 'email' && <a href={mailLink} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-amber-300/40 bg-amber-300/10 px-3 text-center text-sm font-bold text-amber-200"><Mail size={17}/> Open email app to send request</a>}
          <p className="text-[11px] leading-5 text-slate-500">
            An interest request is saved only when the site confirms storage; email marketing requires later verification. If you use the email alternative, you must press Send in your own mail app. No game credentials or payment information requested.
          </p>
        </form>
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-fuchsia-300/20 bg-fuchsia-300/[.035] p-5">
            <div className="text-xs font-bold uppercase tracking-widest text-fuchsia-200">Create your network</div>
            <h3 className="mt-2 text-2xl font-black">Players → Creators → Communities</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">Bring your crew. Discover approved GTA V/FiveM communities, meet creators, and follow the launch conversation without pretending GTA VI custom servers exist.</p>
            <button type="button" onClick={share} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-fuchsia-300/30 px-4 text-sm font-semibold text-fuchsia-200"><Copy size={16}/> Invite a friend</button>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/30 p-5 text-xs leading-6 text-slate-400">
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-emerald-300"/>
            <span>Independent fan/community service. Not affiliated with or endorsed by Rockstar Games or Take-Two. The current FiveM ecosystem is GTA V on PC, not GTA VI.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
