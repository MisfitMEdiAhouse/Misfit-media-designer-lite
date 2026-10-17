import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cibcxqrqiqvzpardbdrw.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_X-bcgz-3xMIgNZ4rYmAjZA_QNUb69hU';
const OWNER_EMAIL = 'misfitmediahouse@gmail.com';

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

const modules = [
  ['My Case Vault', 'Self-Defense', 'Pending source confirmation'],
  ['Timeline & Strategy', 'Self-Defense', 'Pending source confirmation'],
  ['Playbooks', 'Shared', 'Pending source confirmation'],
  ['Co-Counsel', 'Shared', 'Pending source confirmation'],
  ['Allies & Funding', 'Shared', 'Pending source confirmation'],
  ['Wellness', 'Shared', 'Pending source confirmation'],
];

function Login({ onSession }) {
  const [email, setEmail] = useState(OWNER_EMAIL);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');

  const login = async (event) => {
    event.preventDefault();
    setBusy(true);
    setStatus('');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (error) return setStatus(error.message);
    onSession(data.session);
  };

  const magic = async () => {
    setBusy(true);
    setStatus('');
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/legal-os`,
      },
    });
    setBusy(false);
    setStatus(error ? error.message : 'Magic link sent to the approved owner account.');
  };

  return (
    <main className="min-h-screen bg-[#050607] px-4 py-10 text-white">
      <div className="mx-auto grid min-h-[84vh] max-w-5xl place-items-center">
        <section className="w-full overflow-hidden rounded-[2rem] border border-amber-300/20 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,.14),transparent_34%),linear-gradient(145deg,#11100c,#030303)] p-6 shadow-2xl md:p-10">
          <div className="font-mono text-[9px] uppercase tracking-[.18em] text-amber-300">Owner private · migration workspace</div>
          <div className="mt-7 grid gap-10 lg:grid-cols-[1.15fr_.85fr]">
            <div>
              <h1 className="font-display text-4xl font-black tracking-tight md:text-6xl">
                MISFIT JUSTICE OS
                <span className="block text-amber-300">LEGAL COMPASS MIGRATION</span>
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">
                Private migration shell for moving the legacy Base44 legal-organizer system onto Misfit Cloud and the canonical Misfit Mediahouse site.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  'Base44 stays read-only provenance',
                  'Misfit Cloud is the target backend',
                  'No public case data',
                  'No legal-advice or filing claims',
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/[.035] p-4 text-sm text-slate-300">{item}</div>
                ))}
              </div>
            </div>
            <form onSubmit={login} className="rounded-3xl border border-white/10 bg-black/45 p-5 md:p-6">
              <label className="font-mono text-[10px] uppercase tracking-[.15em] text-slate-500">Owner email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-amber-300/50" />
              <label className="mt-5 block font-mono text-[10px] uppercase tracking-[.15em] text-slate-500">Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-amber-300/50" placeholder="••••••••••••" />
              <button disabled={busy} className="mt-6 w-full rounded-xl bg-amber-300 px-4 py-3 font-semibold text-black hover:bg-amber-200 disabled:opacity-50">
                {busy ? 'Authenticating…' : 'Enter Legal OS Migration'}
              </button>
              <button type="button" disabled={busy} onClick={magic} className="mt-3 w-full rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 hover:border-amber-300/30">
                Send magic link instead
              </button>
              {status && <div className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/5 p-3 text-xs leading-5 text-amber-100">{status}</div>}
              <p className="mt-5 text-[11px] leading-5 text-slate-600">No signup. This migration surface is owner-only and no case material is public.</p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

function Badge({ children, tone = 'slate' }) {
  const toneClass = tone === 'amber'
    ? 'border-amber-300/25 bg-amber-300/10 text-amber-200'
    : tone === 'emerald'
      ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-200'
      : 'border-white/10 bg-white/[.04] text-slate-300';
  return <span className={`rounded-full border px-3 py-1 font-mono text-[9px] uppercase tracking-[.13em] ${toneClass}`}>{children}</span>;
}

export default function LegalOSMigration() {
  const [session, setSession] = useState(null);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    document.title = 'Misfit Justice OS — Private Migration';
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex,nofollow,noarchive,nosnippet';

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session || null);
      setBusy(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => listener.subscription.unsubscribe();
  }, []);

  if (busy) {
    return <main className="grid min-h-screen place-items-center bg-[#050607] text-sm text-slate-500">Loading private migration workspace…</main>;
  }

  if (!session || session.user?.email?.toLowerCase() !== OWNER_EMAIL) {
    return <Login onSession={setSession} />;
  }

  return (
    <main className="min-h-screen bg-[#050607] text-white">
      <header className="border-b border-white/10 bg-black/70 px-4 py-4 backdrop-blur md:px-7">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[.18em] text-amber-300">Misfit Mediahouse · Owner Private</div>
            <div className="mt-1 font-display text-xl font-black">Misfit Justice OS — GHOSBC Legal Compass</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="emerald">Migration started</Badge>
            <Badge tone="amber">Base44 source connection required</Badge>
            <button onClick={() => supabase.auth.signOut()} className="rounded-full border border-white/10 px-3 py-1 font-mono text-[9px] uppercase tracking-[.13em] text-slate-400 hover:text-white">Sign out</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-7 md:py-12">
        <section className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <div className="rounded-[2rem] border border-amber-300/20 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,.12),transparent_32%),#0a0b0c] p-6 md:p-8">
            <div className="font-mono text-[10px] uppercase tracking-[.17em] text-amber-300">Base44 → Misfit Cloud</div>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-black tracking-tight md:text-6xl">THE EXIT HAS STARTED. SOURCE PARITY HAS NOT.</h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300">
              The private migration ledger now exists in Misfit Cloud. Exact Base44 code, entity, record and function absorption remains blocked until the legacy source app is connected and inventoried.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                ['Verified evidence', '3'],
                ['Reconstructed modules', '6'],
                ['Captured Base44 assets', '0'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-black/35 p-4">
                  <div className="text-3xl font-black">{value}</div>
                  <div className="mt-1 font-mono text-[8px] uppercase tracking-[.14em] text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-white/[.03] p-6">
            <div className="font-mono text-[9px] uppercase tracking-[.16em] text-slate-500">Canonical boundary</div>
            <div className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
              <div><strong className="text-white">Target backend:</strong> Misfit Cloud / Supabase</div>
              <div><strong className="text-white">Target site:</strong> misfitmediahouse.com</div>
              <div><strong className="text-white">Legacy source:</strong> Base44, read-only provenance</div>
              <div><strong className="text-white">Source app ID:</strong> not yet verified</div>
              <div><strong className="text-white">Restore drill:</strong> not yet eligible</div>
            </div>
          </aside>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-white/[.025] p-6">
            <div className="font-mono text-[9px] uppercase tracking-[.16em] text-slate-500">Verified legacy identity</div>
            <h2 className="mt-3 font-display text-2xl font-black">Two operating modes</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="font-semibold">Self-Defense Mode</div>
                <p className="mt-2 text-xs leading-5 text-slate-400">Individual case-information organization.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="font-semibold">Firm Mode</div>
                <p className="mt-2 text-xs leading-5 text-slate-400">Conceptual workflow intelligence for law firms.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-red-300/15 bg-red-300/[.035] p-6">
            <div className="font-mono text-[9px] uppercase tracking-[.16em] text-red-200">Hard legal boundary</div>
            <h2 className="mt-3 font-display text-2xl font-black">Organization, not representation.</h2>
            <div className="mt-5 space-y-2 text-sm leading-6 text-slate-300">
              <div>• No claim of legal advice.</div>
              <div>• No automated court filing authority.</div>
              <div>• No autonomous legal commitments or submissions.</div>
              <div>• No public exposure of case data.</div>
              <div>• Source behavior is preserved before any redesign.</div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-white/10 bg-white/[.025] p-6 md:p-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-[.16em] text-slate-500">Recovered module map</div>
              <h2 className="mt-2 font-display text-2xl font-black">Pending exact Base44 confirmation</h2>
            </div>
            <Badge>Not presented as migrated functionality</Badge>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {modules.map(([name, mode, status]) => (
              <article key={name} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="font-semibold">{name}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge>{mode}</Badge>
                  <Badge tone="amber">{status}</Badge>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-cyan-300/15 bg-cyan-300/[.03] p-6 md:p-7">
          <div className="font-mono text-[9px] uppercase tracking-[.16em] text-cyan-200">Next migration gate</div>
          <h2 className="mt-2 font-display text-2xl font-black">Connect the exact Base44 source, then inventory before rebuilding.</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">
            Once the legacy app is accessible, migration proceeds in this order: source tree and hashes → entity schemas and record counts → backend functions → route inventory → data absorption → behavior parity → restore drill → Base44 archive-only status.
          </p>
          <a href="/command" className="mt-5 inline-flex rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-4 py-3 text-sm font-semibold text-cyan-100 hover:bg-cyan-300/15">Open Founder Command</a>
        </section>
      </div>
    </main>
  );
}
