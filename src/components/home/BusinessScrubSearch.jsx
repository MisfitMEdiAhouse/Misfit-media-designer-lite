import { ArrowRight, Search } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function BusinessScrubSearch() {
  const [website, setWebsite] = useState('');
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const submit = (event) => {
    event.preventDefault();
    const value = website.trim();
    if (!value) {
      setShowError(true);
      return;
    }
    navigate(`/scrub?site=${encodeURIComponent(value)}`);
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-4xl sm:mt-10">
      <form
        onSubmit={submit}
        className="flex min-h-[66px] items-center rounded-full border border-white/20 bg-white/[0.07] p-1.5 pl-4 shadow-[0_24px_100px_rgba(0,229,255,.12)] backdrop-blur-xl transition focus-within:border-cyan-300/60 sm:min-h-[76px] sm:pl-6"
      >
        <label htmlFor="homepage-business-scrub" className="sr-only">Enter a Shopify store or business website</label>
        <Search size={21} className="shrink-0 text-cyan-300" aria-hidden="true" />
        <input
          id="homepage-business-scrub"
          value={website}
          onChange={(event) => { setWebsite(event.target.value); setShowError(false); }}
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="url"
          spellCheck="false"
          placeholder="Enter your Shopify store or website"
          className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600 sm:px-5 sm:text-lg"
        />
        <button
          type="submit"
          aria-label="Scan this website"
          className="inline-flex min-h-[52px] shrink-0 items-center justify-center gap-2 rounded-full bg-cyan-300 px-4 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-black transition hover:bg-white sm:min-h-[62px] sm:px-7 sm:text-[11px]"
        >
          <span className="hidden min-[390px]:inline">Scan site</span>
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      </form>
      <div className="mt-4 flex flex-col items-center justify-center gap-2 text-center text-[11px] leading-5 text-slate-600 sm:flex-row sm:gap-5">
        <span>Free public-signal scan · no login required</span>
        <Link to="/quotelink" className="text-slate-400 underline decoration-white/20 underline-offset-4 hover:text-cyan-300">
          No website yet? Build one with Misfit →
        </Link>
      </div>
      {showError && <p role="alert" className="mt-3 text-center text-xs text-rose-300">Enter a public store or business website to start.</p>}
    </div>
  );
}
