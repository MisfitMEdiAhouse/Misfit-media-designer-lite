(() => {
  const path = location.pathname.replace(/\/+$/, '') || '/';
  if (path !== '/stan-hansen' && path !== '/egnyte') return;

  const replacements = new Map([
    ['99e6fd08-af19-4ea3-a511-900906eef13f', 'https://www.aidocmaker.com/g0/audio?name=46f690c0103747859c8b6d4b4d47c9ea'],
    ['dbef0ba3-fc3e-4261-8bae-b98d2fe7a0df', 'https://www.aidocmaker.com/g0/audio?name=ee0f12223f0741c2affb3fd478a885c2'],
    ['97662568-c7fd-47ef-951f-a7c7c033fdfa', 'https://www.aidocmaker.com/g0/audio?name=ec0ef06a97f3472ea26009ea08e3e765'],
    ['dca8b502-13ff-498e-8d62-a132be05260d', 'https://www.aidocmaker.com/g0/audio?name=495c6f582cc24c95806c4bee38f4dfdc'],
    ['a00b0efc-ca1d-4ce6-abe0-cbdf5e3d6140', 'https://www.aidocmaker.com/g0/audio?name=89ba510a522640b28154d5e88f457b76'],
    ['007396d1-3994-4001-a4a6-dc8f3b7d62fb', 'https://www.aidocmaker.com/g0/audio?name=5dbb1370d5954c75b82eba8f491b0649'],
    ['78e05bea-0765-47bf-9fc9-6be2444f711d', 'https://www.aidocmaker.com/g0/audio?name=7f391304ec4548db8103c1d5166cb355'],
    ['77a56f17-dfd3-4814-a2b2-232185ea1d54', 'https://www.aidocmaker.com/g0/audio?name=6981d40d3ba4445a91bf244560cc453b'],
  ]);

  function remap(value) {
    const src = String(value || '');
    for (const [id, replacement] of replacements) {
      if (src.includes(id)) return replacement;
    }
    return value;
  }

  const NativeAudio = window.Audio;
  if (typeof NativeAudio !== 'function') return;

  const mediaSrc = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');

  function patchAudioElement(audio) {
    if (!audio || !mediaSrc?.get || !mediaSrc?.set) return audio;
    try {
      Object.defineProperty(audio, 'src', {
        configurable: true,
        enumerable: true,
        get() { return mediaSrc.get.call(audio); },
        set(value) { mediaSrc.set.call(audio, remap(value)); },
      });
    } catch (_) {}

    const nativeSetAttribute = audio.setAttribute?.bind(audio);
    if (nativeSetAttribute) {
      audio.setAttribute = (name, value) => nativeSetAttribute(name, String(name).toLowerCase() === 'src' ? remap(value) : value);
    }
    return audio;
  }

  function AudioProxy(src) {
    const audio = src === undefined ? new NativeAudio() : new NativeAudio(remap(src));
    return patchAudioElement(audio);
  }

  AudioProxy.prototype = NativeAudio.prototype;
  try { Object.setPrototypeOf(AudioProxy, NativeAudio); } catch (_) {}
  window.Audio = AudioProxy;

  window.__MISFIT_STAN_VOICE__ = Object.freeze({
    provider: 'AI Voice Generator',
    profile: 'fancy',
    sourceCount: replacements.size,
    playbackRate: 1,
    pitchProcessing: false,
    mixedVoiceFallback: false,
    spokenBrand: 'Ghost BC OS',
  });
})();
