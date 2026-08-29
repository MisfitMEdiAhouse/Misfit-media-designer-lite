(() => {
  const path = location.pathname.replace(/\/+$/, '') || '/';
  if (path !== '/stan-hansen' && path !== '/egnyte') return;

  const NativeAudio = window.Audio;
  if (typeof NativeAudio !== 'function') return;

  const INTRO_CLIP_ID = '99e6fd08-af19-4ea3-a511-900906eef13f';

  function setPreservesPitch(audio, value) {
    try { audio.preservesPitch = value; } catch (_) {}
    try { audio.webkitPreservesPitch = value; } catch (_) {}
    try { audio.mozPreservesPitch = value; } catch (_) {}
  }

  function attachNormalizer(audio) {
    let introMode = false;

    const refreshMode = () => {
      const src = String(audio.currentSrc || audio.src || '');
      introMode = src.includes(INTRO_CLIP_ID);
      if (!introMode) {
        try { audio.playbackRate = 1; } catch (_) {}
        setPreservesPitch(audio, true);
      }
    };

    const normalizeIntro = () => {
      refreshMode();
      if (!introMode) return;

      const t = Number(audio.currentTime || 0);
      // The original render drags through the opening sentence, then rushes the back half.
      // Converge both sections toward one natural cadence without changing the source file.
      let rate = 1.04;
      if (t >= 7.55 && t < 8.35) rate = 0.98;
      if (t >= 8.35) rate = 0.92;

      setPreservesPitch(audio, false);
      try {
        if (Math.abs(Number(audio.playbackRate || 1) - rate) > 0.01) audio.playbackRate = rate;
      } catch (_) {}
    };

    audio.addEventListener('loadedmetadata', normalizeIntro);
    audio.addEventListener('play', normalizeIntro);
    audio.addEventListener('timeupdate', normalizeIntro);
    audio.addEventListener('emptied', refreshMode);
    return audio;
  }

  function AudioProxy(src) {
    const audio = src === undefined ? new NativeAudio() : new NativeAudio(src);
    return attachNormalizer(audio);
  }

  AudioProxy.prototype = NativeAudio.prototype;
  try { Object.setPrototypeOf(AudioProxy, NativeAudio); } catch (_) {}
  window.Audio = AudioProxy;
})();
