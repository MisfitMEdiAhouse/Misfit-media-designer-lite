(() => {
  const path = location.pathname.replace(/\/+$/, '') || '/';
  if (path !== '/stan-hansen' && path !== '/egnyte') return;

  const replacements = new Map([
    ['99e6fd08-af19-4ea3-a511-900906eef13f', 'https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/4eb1b2ca-5d08-403f-97e9-2a4e695488dc.mp3'],
    ['dbef0ba3-fc3e-4261-8bae-b98d2fe7a0df', 'https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/5c9f9e3f-4081-4644-b3d0-bc20056a0d49.mp3'],
    ['97662568-c7fd-47ef-951f-a7c7c033fdfa', 'https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/42b569eb-5134-418b-a023-d412726a85a2.mp3'],
    ['dca8b502-13ff-498e-8d62-a132be05260d', 'https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/7ec1f5ce-a9ea-4eba-a312-8d8301383561.mp3'],
    ['a00b0efc-ca1d-4ce6-abe0-cbdf5e3d6140', 'https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/8c767931-e80b-41b5-879d-9114ca2ba473.mp3'],
    ['007396d1-3994-4001-a4a6-dc8f3b7d62fb', 'https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/80859971-d12c-437d-ac68-ebae82549e70.mp3'],
    ['78e05bea-0765-47bf-9fc9-6be2444f711d', 'https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/c4859a61-f430-4bc3-b180-12639a7d88e1.mp3'],
    ['77a56f17-dfd3-4814-a2b2-232185ea1d54', 'https://storage.googleapis.com/adm--audio-playback--7d--public/mcp-preview/238fbaa7-1a6d-4a6f-a03a-323d1beccf35.mp3'],
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
    directPlayableSources: true,
  });
})();
