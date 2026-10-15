import { Pause, Play, Volume2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const VOICE_URL = 'https://www.aidocmaker.com/g0/audio?name=f57ee0e236414ce294be8eb93f226476';

export default function MisfitVoiceGuide() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    const stop = () => setPlaying(false);
    const fail = () => {
      setPlaying(false);
      setError('Voice is temporarily unavailable. The page and checkout links still work.');
    };
    audio.addEventListener('ended', stop);
    audio.addEventListener('pause', stop);
    audio.addEventListener('error', fail);
    return () => {
      audio.removeEventListener('ended', stop);
      audio.removeEventListener('pause', stop);
      audio.removeEventListener('error', fail);
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    setError('');
    if (!audio.paused) {
      audio.pause();
      return;
    }
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setError('Tap again to start Misfit Voice.');
    }
  };

  return (
    <aside className="fixed bottom-4 right-4 z-[80] w-[min(360px,calc(100vw-2rem))] rounded-2xl border border-cyan-300/25 bg-black/95 p-3 shadow-2xl shadow-cyan-500/10 backdrop-blur">
      <audio ref={audioRef} src={VOICE_URL} preload="none" />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-300 text-black"
          aria-label={playing ? 'Pause Misfit Voice' : 'Play Misfit Voice'}
        >
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-300">
            <Volume2 size={13} /> Misfit Voice
          </div>
          <div className="mt-1 text-xs leading-5 text-slate-300">Fancy voice · sales guide · tap to hear what Misfit can do for you.</div>
        </div>
      </div>
      {error && <div className="mt-2 text-[11px] leading-4 text-amber-300">{error}</div>}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <a href="/" className="rounded-lg border border-white/10 px-3 py-2 text-center font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-white">Free scan</a>
        <a href="/agency" className="rounded-lg bg-white px-3 py-2 text-center font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-black">Buy / hire Misfit</a>
      </div>
    </aside>
  );
}
