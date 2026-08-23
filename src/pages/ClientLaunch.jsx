import { ArrowLeft, ArrowRight, CheckCircle2, Globe2, KeyRound, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const API_BASE = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/site-activation';

const sites = {
  'golden-essence': {
    displayName: 'Golden Essence Therapeutics',
    price: '$297',
    checkoutUrl: 'https://buy.stripe.com/9B6cN5caS66q4ym1wY8ww0y',
    previewUrl: '/portfolio/golden-essence',
  },
};

const situations = [
  {
    key: 'need_domain',
    title: 'I need a new domain',
    copy: "I do not own a domain yet. Tell Misfit what I want and handle the setup with me.",
  },
  {
    key: 'own_domain',
    title: 'I already own a domain',
    copy: 'I already bought my domain somewhere. Connect it without asking me for my password.',
  },
  {
    key: 'existing_site',
    title: 'I already have a website',
    copy: 'I have an existing site/domain and want Misfit to replace, move, or connect the new build.',
  },
  {
    key: 'not_sure',
    title: "I don't know / just handle it",
    copy: 'I am not sure what I own or where it is hosted. Tell me the one next step I need to do.',
  },
];

function OwnershipPromise() {
  const rows = [
    'You own the client-specific finished website and business content after purchase.',
    'Your domain is registered for you as the owner. You control the registrar login.',
    'You receive administrator access and can move the site to another host or designer later.',
    'There is no required Misfit monthly plan just to keep ownership of the basic site.',
    'Misfit keeps only its reusable tools, frameworks, platform code, and internal development systems.',
    'Future edits, management, AI, booking, payments, or growth services are optional paid work.',
  ];

  return (
    <section className="rounded-3xl border border-cyan-300/25 bg-cyan-300/[0.045] p-6 sm:p-8">
      <div className="flex items-center gap-3 text-cyan-300">
        <ShieldCheck size={22} />
        <div className="font-mono text-xs font-bold uppercase tracking-[0.18em]">Ownership in writing</div>
      </div>
      <h2 className="mt-4 font-display text-3xl font-bold uppercase tracking-[-.03em] sm:text-4xl">You buy it. You own it.</h2>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {rows.map((row) => (
          <div key={row} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-slate-300">
            <CheckCircle2 size={16} className="mt-1 shrink-0 text-cyan-300" />
            <span>{row}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ClientLaunch() {
  const { siteKey = 'golden-essence' } = useParams();
  const config = useMemo(() => sites[siteKey] || null, [siteKey]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [situation, setSituation] = useState('');
  const [form, setForm] = useState({
    email: '',
    business_name: config?.displayName || '',
    desired_domain: '',
    backup_domain: '',
    current_domain: '',
    current_site: '',
    registrar: '',
    notes: '',
  });
  const [submitState, setSubmitState] = useState('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.title = config ? `${config.displayName} | Site Activation` : 'Client Activation | Misfit Mediahouse';
  }, [config]);

  useEffect(() => {
    if (!config) return;
    let alive = true;
    const load = async () => {
      try {
        const response = await fetch(`${API_BASE}/status?site=${encodeURIComponent(siteKey)}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('status');
        const data = await response.json();
        if (alive) setStatus(data);
      } catch (_) {
        if (alive) setStatus(null);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    const timer = window.setInterval(load, 2500);
    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, [config, siteKey]);

  if (!config) {
    return (
      <main className="min-h-screen bg-black px-5 py-20 text-white">
        <div className="mx-auto max-w-xl rounded-3xl border border-white/10 p-8">
          <div className="font-display text-3xl font-bold">Activation link not found.</div>
          <Link to="/agency" className="mt-6 inline-flex text-cyan-300">Go to Misfit Agency</Link>
        </div>
      </main>
    );
  }

  const activated = Boolean(status?.activated || status?.status === 'active');
  const submitted = status?.launch_status === 'submitted' || submitState === 'done';

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setSubmitState('sending');
    setMessage('');
    try {
      const response = await fetch(`${API_BASE}/launch-intake`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ site_key: siteKey, situation, ...form }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (data?.error === 'use_email_from_checkout') throw new Error('Use the same email address you entered in Stripe checkout.');
        if (data?.error === 'payment_not_confirmed_yet') throw new Error('Stripe is still confirming the payment. Give it a few seconds and try again.');
        throw new Error('I could not save that yet. Please try again.');
      }
      setSubmitState('done');
      setMessage('Got it. Misfit now has the launch information and will handle the next technical step from here.');
    } catch (error) {
      setSubmitState('error');
      setMessage(error.message || 'Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="border-b border-white/10 bg-black/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link to={config.previewUrl} className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            <ArrowLeft size={14} /> Back to site
          </Link>
          <div className="font-display text-xl font-bold">MISFIT<span className="text-cyan-300">.</span></div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:py-16">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.22em] text-cyan-300">{config.displayName}</div>
            <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.8rem,8vw,5.5rem)] font-bold uppercase leading-[.9] tracking-[-.05em]">
              {activated ? 'Payment confirmed. We handle the rest.' : 'One payment. Clear ownership. No domain homework.'}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              {activated
                ? 'Pick the situation that sounds like you. You do not need to understand DNS, hosting, transfers, or delegate access—Misfit will route the correct next step.'
                : `The ${config.price} activation buys the finished site and launch. You do not need a GoDaddy account, a domain choice, or hosting knowledge before you pay.`}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-7">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-300">What the {config.price} covers</div>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              <div className="flex gap-3"><CheckCircle2 size={16} className="mt-1 shrink-0 text-cyan-300" />Finished client website + launch</div>
              <div className="flex gap-3"><CheckCircle2 size={16} className="mt-1 shrink-0 text-cyan-300" />Custom-domain setup</div>
              <div className="flex gap-3"><CheckCircle2 size={16} className="mt-1 shrink-0 text-cyan-300" />First year of one normal available domain</div>
              <div className="flex gap-3"><CheckCircle2 size={16} className="mt-1 shrink-0 text-cyan-300" />Owner/admin handoff</div>
            </div>
            <p className="mt-5 border-t border-white/10 pt-5 text-xs leading-5 text-slate-500">
              Premium/high-priced domains are never purchased without your approval. Normal annual domain renewal after the included first year is the owner's responsibility.
            </p>
            {!activated && (
              <a href={config.checkoutUrl} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-300 px-5 py-4 font-mono text-xs font-bold uppercase tracking-[0.13em] text-black">
                Pay {config.price} securely <ArrowRight size={15} />
              </a>
            )}
            {loading && <div className="mt-4 text-center text-xs text-slate-600">Checking activation status…</div>}
          </div>
        </section>

        <div className="mt-8"><OwnershipPromise /></div>

        {activated && !submitted && (
          <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-amber-300">Step 1 of 1</div>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase sm:text-5xl">Which one sounds like you?</h2>
            <div className="mt-7 grid gap-3 md:grid-cols-2">
              {situations.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setSituation(item.key)}
                  className={`rounded-2xl border p-5 text-left transition ${situation === item.key ? 'border-cyan-300 bg-cyan-300/[0.08]' : 'border-white/10 bg-black/35 hover:border-white/25'}`}
                >
                  <div className="flex items-center gap-3">
                    {item.key === 'need_domain' ? <Globe2 size={18} className="text-cyan-300" /> : item.key === 'not_sure' ? <Sparkles size={18} className="text-cyan-300" /> : <KeyRound size={18} className="text-cyan-300" />}
                    <div className="font-display text-xl font-bold">{item.title}</div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{item.copy}</p>
                </button>
              ))}
            </div>

            {situation && (
              <form onSubmit={submit} className="mt-8 grid gap-5 rounded-3xl border border-white/10 bg-black/35 p-5 sm:p-7">
                <label className="grid gap-2 text-sm text-slate-300">
                  Email used at checkout
                  <input required type="email" value={form.email} onChange={update('email')} placeholder="you@business.com" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-cyan-300" />
                </label>
                <label className="grid gap-2 text-sm text-slate-300">
                  Business name
                  <input value={form.business_name} onChange={update('business_name')} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-cyan-300" />
                </label>

                {situation === 'need_domain' && (
                  <>
                    <label className="grid gap-2 text-sm text-slate-300">
                      What domain would you like if it is available?
                      <input value={form.desired_domain} onChange={update('desired_domain')} placeholder="goldenessencetherapeutics.com" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-cyan-300" />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-300">
                      Backup idea <span className="text-slate-600">optional</span>
                      <input value={form.backup_domain} onChange={update('backup_domain')} placeholder="Leave blank if you want Misfit to suggest one" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-cyan-300" />
                    </label>
                    <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.04] p-4 text-sm leading-6 text-slate-300">
                      <strong className="text-white">No GoDaddy account? No problem.</strong> Do not create random accounts or buy anything yet. Misfit will check availability first and give you the correct owner-account/delegate step. You keep the login and ownership.
                    </div>
                  </>
                )}

                {situation === 'own_domain' && (
                  <>
                    <label className="grid gap-2 text-sm text-slate-300">
                      Domain you already own
                      <input required value={form.current_domain} onChange={update('current_domain')} placeholder="yourbusiness.com" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-cyan-300" />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-300">
                      Where did you buy it? <span className="text-slate-600">GoDaddy, Squarespace, Namecheap, Cloudflare, not sure…</span>
                      <input value={form.registrar} onChange={update('registrar')} placeholder="Not sure is fine" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-cyan-300" />
                    </label>
                  </>
                )}

                {situation === 'existing_site' && (
                  <>
                    <label className="grid gap-2 text-sm text-slate-300">
                      Current website
                      <input required value={form.current_site} onChange={update('current_site')} placeholder="https://yourbusiness.com" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-cyan-300" />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-300">
                      Host or registrar if you know it
                      <input value={form.registrar} onChange={update('registrar')} placeholder="GoDaddy / Shopify / Squarespace / Wix / not sure" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-cyan-300" />
                    </label>
                  </>
                )}

                <label className="grid gap-2 text-sm text-slate-300">
                  Anything else Misfit should know? <span className="text-slate-600">optional</span>
                  <textarea rows={4} value={form.notes} onChange={update('notes')} placeholder="You can also just leave this blank." className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-cyan-300" />
                </label>

                <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.035] p-4 text-xs leading-5 text-slate-400">
                  Never send passwords in this form. If DNS, hosting, or registrar access is needed, Misfit uses the provider's proper delegate/collaborator access whenever possible.
                </div>

                {message && submitState === 'error' && <div className="text-sm text-rose-300">{message}</div>}
                <button disabled={submitState === 'sending'} type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.13em] text-black disabled:opacity-50">
                  {submitState === 'sending' ? 'Saving…' : 'Give Misfit the handoff'} <ArrowRight size={15} />
                </button>
              </form>
            )}
          </section>
        )}

        {activated && submitted && (
          <section className="mt-8 rounded-3xl border border-emerald-300/25 bg-emerald-300/[0.05] p-7 sm:p-9">
            <div className="flex items-center gap-3 text-emerald-300"><CheckCircle2 size={22} /><span className="font-mono text-xs font-bold uppercase tracking-[0.16em]">Launch handoff received</span></div>
            <h2 className="mt-4 font-display text-3xl font-bold uppercase sm:text-5xl">You are done with the technical homework.</h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">{message || 'Misfit has the launch information. The next step is on us: domain review, access request if needed, DNS connection, launch, and owner/admin handoff.'}</p>
          </section>
        )}
      </div>
    </main>
  );
}
