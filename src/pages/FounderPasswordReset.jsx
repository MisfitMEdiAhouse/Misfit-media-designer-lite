import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cibcxqrqiqvzpardbdrw.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_X-bcgz-3xMIgNZ4rYmAjZA_QNUb69hU';
const OWNER_EMAIL = 'misfitmediahouse@gmail.com';

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

export default function FounderPasswordReset() {
  const [session, setSession] = useState(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    document.title = 'Founder Password Reset — Misfit';
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'robots'; document.head.appendChild(meta); }
    meta.content = 'noindex,nofollow,noarchive,nosnippet';

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session || null);
      setBusy(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => listener.subscription.unsubscribe();
  }, []);

  const sendMagic = async () => {
    setBusy(true); setStatus('');
    const { error } = await supabase.auth.signInWithOtp({
      email: OWNER_EMAIL,
      options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/command-reset` }
    });
    setBusy(false);
    setStatus(error ? error.message : 'Magic link sent. Open it from the owner Gmail account, then return here.');
  };

  const save = async (e) => {
    e.preventDefault();
    setStatus('');
    if (password.length < 12) return setStatus('Use at least 12 characters.');
    if (password !== confirm) return setStatus('The two passwords do not match.');
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return setStatus(error.message);
    setStatus('Founder password replaced successfully. Redirecting to Founder Command…');
    setTimeout(() => { window.location.href = '/command'; }, 900);
  };

  if (busy) return <main className="min-h-screen bg-black text-white grid place-items-center">Checking founder session…</main>;

  return (
    <main className="min-h-screen bg-black px-4 py-12 text-white">
      <div className="mx-auto grid min-h-[82vh] max-w-xl place-items-center">
        <section className="w-full rounded-[2rem] border border-cyan-400/20 bg-[linear-gradient(145deg,#07111d,#000)] p-6 shadow-2xl md:p-8">
          <div className="font-mono text-xs uppercase tracking-[.22em] text-cyan-300">Misfit Founder Recovery</div>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight">REPLACE FOUNDER PASSWORD</h1>
          <p className="mt-4 text-sm leading-6 text-slate-400">The old password cannot be recovered. This securely replaces it on the existing owner account.</p>

          {!session ? (
            <div className="mt-7">
              <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-100">Authenticate the existing owner account first.</div>
              <button onClick={sendMagic} disabled={busy} className="mt-4 w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-black disabled:opacity-50">Send owner magic link</button>
            </div>
          ) : (
            <form onSubmit={save} className="mt-7">
              <label className="font-mono text-[10px] uppercase tracking-[.15em] text-slate-500">New founder password</label>
              <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" autoComplete="new-password" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-400/50" />
              <label className="mt-5 block font-mono text-[10px] uppercase tracking-[.15em] text-slate-500">Confirm new password</label>
              <input value={confirm} onChange={(e)=>setConfirm(e.target.value)} type="password" autoComplete="new-password" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-400/50" />
              <button disabled={busy} className="mt-6 w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-black disabled:opacity-50">{busy ? 'Saving…' : 'Replace founder password'}</button>
            </form>
          )}

          {status && <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-xs leading-5 text-slate-200">{status}</div>}
          <p className="mt-5 text-[11px] leading-5 text-slate-600">Owner account only. No signup. No password is displayed or stored by this page.</p>
        </section>
      </div>
    </main>
  );
}
