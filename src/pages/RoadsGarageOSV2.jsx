import { useLayoutEffect, useRef } from 'react';
import RoadsGarageOSV2Core from './RoadsGarageOSV2Core.jsx';
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
        /* Browser-proof Roads wordmark: kill the failing image entirely and render the
           brand as live text on the real header link. There is nothing left to 404. */
        .roads-page-shell a[aria-label="Roads Garage home"] {
          position: relative !important;
          display: inline-flex !important;
          align-items: center !important;
          width: 154px !important;
          min-width: 154px !important;
          height: 48px !important;
          overflow: visible !important;
          text-decoration: none !important;
        }

        .roads-page-shell a[aria-label="Roads Garage home"] img[alt="Roads Co."] {
          display: none !important;
        }

        .roads-page-shell a[aria-label="Roads Garage home"]::before {
          content: "Roads Co.";
          position: absolute;
          left: 1px;
          top: 50%;
          transform: translateY(-54%) rotate(-4deg) skewX(-6deg);
          transform-origin: left center;
          white-space: nowrap;
          color: #fff;
          font-family: "Permanent Marker", "Brush Script MT", "Segoe Print", cursive;
          font-size: 29px;
          font-weight: 400;
          line-height: 1;
          letter-spacing: -0.055em;
          text-shadow:
            0 1px 0 #fff,
            1px 0 0 #fff,
            -1px 0 0 #fff,
            0 0 14px rgba(255,255,255,.14);
        }

        .roads-page-shell a[aria-label="Roads Garage home"]::after {
          content: "";
          position: absolute;
          left: 7px;
          bottom: 7px;
          width: 122px;
          height: 3px;
          border-radius: 999px;
          background: #fff;
          opacity: .9;
          transform: rotate(-3deg) skewX(-22deg);
          box-shadow: 0 0 7px rgba(255,255,255,.16);
        }

        @media (min-width: 640px) {
          .roads-page-shell a[aria-label="Roads Garage home"] {
            width: 176px !important;
            min-width: 176px !important;
            height: 52px !important;
          }

          .roads-page-shell a[aria-label="Roads Garage home"]::before {
            font-size: 33px;
          }

          .roads-page-shell a[aria-label="Roads Garage home"]::after {
            width: 139px;
          }
        }
      `}</style>
      <div ref={rootRef} className="roads-page-shell">
        <RoadsGarageOSV2Core />
      </div>
    </>
  );
}
