import { useLayoutEffect, useRef } from 'react';
import RoadsGarageOSV2Core from './RoadsGarageOSV2Core.jsx';
import { ROADS_LOGO_DATA } from '../assets/roadsLogoData.js';
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
    <>
      <style>{`
        .roads-page-shell img[alt="Roads Co."] {
          opacity: 0 !important;
        }

        .roads-header-logo-lock {
          position: fixed;
          top: 12px;
          left: 16px;
          z-index: 60;
          width: 160px;
          height: 40px;
          display: flex;
          align-items: center;
          pointer-events: none;
        }

        .roads-header-logo-lock img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: left center;
          filter: invert(1);
          background: transparent;
        }

        @media (min-width: 640px) {
          .roads-header-logo-lock {
            top: 16px;
            left: 24px;
            width: 176px;
            height: 40px;
          }
        }
      `}</style>
      <div className="roads-header-logo-lock" aria-hidden="true">
        <img src={ROADS_LOGO_DATA} alt="" />
      </div>
      <div ref={rootRef} className="roads-page-shell">
        <RoadsGarageOSV2Core />
      </div>
    </>
  );
}
