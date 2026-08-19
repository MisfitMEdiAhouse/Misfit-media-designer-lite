import { useLayoutEffect } from 'react';
import TylerWard from './TylerWard.jsx';

const EDEN_MOUNTAIN_HOME = 'https://images.pexels.com/photos/7746904/pexels-photo-7746904.jpeg?auto=compress&cs=tinysrgb&w=1800';
const CRATE_IMAGE = '/tyler-crate-catalog-v16.webp';

export default function TylerWardLive() {
  useLayoutEffect(() => {
    const gallery = document.querySelector('.tw-live .tw .catalogImage');
    const first = gallery?.querySelector('img');
    if (!gallery || !first) return;

    gallery.querySelectorAll('img[data-crate-angle="alternate"]').forEach((node) => node.remove());
    first.removeAttribute('srcset');
    first.loading = 'eager';
    first.decoding = 'async';
    first.alt = 'Flower-filled vintage .50 caliber ammunition crate planter on a white catalog background';
    first.src = CRATE_IMAGE;
    gallery.dataset.exactCrates = 'ready';
  }, []);

  return (
    <div className="tw-live">
      <style>{`
        .tw-live .tw .heroMedia {
          background-image: url("${EDEN_MOUNTAIN_HOME}") !important;
          background-size: cover !important;
          background-position: center 58% !important;
          background-repeat: no-repeat !important;
        }
        .tw-live .tw .heroMedia img { display: none !important; }
        .tw-live .tw .heroShade {
          background: linear-gradient(90deg,rgba(7,9,7,.92) 0%,rgba(7,9,7,.80) 28%,rgba(7,9,7,.34) 55%,rgba(7,9,7,.04) 100%) !important;
        }

        @media (max-width: 880px) {
          .tw-live .tw .heroMedia { background-position: 58% center !important; }
        }

        @media (max-width: 640px) {
          .tw-live .tw .heroMedia { background-position: 56% center !important; }
          .tw-live .tw .heroShade { display: none !important; }
        }
      `}</style>
      <TylerWard />
    </div>
  );
}
