import { useLayoutEffect, useRef } from 'react';
import RoadsGarageOSV3Core from './RoadsGarageOSV3Core.jsx';
import { ROADS_TUNER_DATA, ROADS_WHEEL_DATA, ROADS_MERCH_DATA } from '../assets/roadsMediaData.js';

// Roads visual assets are deliberately pinned here so mobile never falls back to broken placeholders.
const FALLBACK = {
  tuner: 'https://roadscollective.com/cdn/shop/files/IMG_5049.jpg?crop=center&height=1000&v=1736916492&width=1000',
  wheel: 'https://roadscollective.com/cdn/shop/files/Red-porsche-next-to-fine-art.jpg?crop=center&height=1000&v=1736899403&width=1000',
  merch: 'https://roadscollective.com/cdn/shop/files/DSC09062-Edit.jpg?crop=center&height=1000&v=1755978742&width=1000',
};

function setMedia(image, src, fallback) {
  image.removeAttribute('srcset');
  image.removeAttribute('sizes');
  image.onerror = fallback
    ? () => {
        image.onerror = null;
        image.src = fallback;
      }
    : null;
  image.src = src;
}

export default function RoadsGarageOSV2() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const applyMedia = () => {
      root.querySelectorAll('img[alt="Roads engine work"]').forEach((image) => {
        setMedia(image, ROADS_TUNER_DATA, FALLBACK.tuner);
        image.style.objectFit = 'cover';
        image.style.objectPosition = 'center';
      });

      root.querySelectorAll('img[alt="Roads wheel and fitment"]').forEach((image) => {
        setMedia(image, ROADS_WHEEL_DATA, FALLBACK.wheel);
        image.style.objectFit = 'cover';
        image.style.objectPosition = 'center';
      });

      root.querySelectorAll('img[alt="Roads Collective apparel"]').forEach((image) => {
        setMedia(image, ROADS_MERCH_DATA, FALLBACK.merch);
        image.style.display = 'block';
        image.style.objectFit = 'cover';
        image.style.objectPosition = 'center 38%';
      });
    };

    applyMedia();
    const observer = new MutationObserver(applyMedia);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="roads-page-shell">
      <RoadsGarageOSV3Core />
      <a
        href="/roads/admin"
        className="fixed bottom-5 right-4 z-[70] rounded-full border border-white/15 bg-black/90 px-4 py-3 font-mono text-[8px] font-black uppercase tracking-[0.14em] text-white/55 shadow-2xl backdrop-blur-xl transition hover:border-[#00c7f2]/50 hover:text-[#7eeaff] sm:bottom-6 sm:right-6"
        aria-label="Open Roads admin back office"
      >
        Roads Admin ↗
      </a>
    </div>
  );
}
