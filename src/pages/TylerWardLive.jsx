import { useEffect } from 'react';
import TylerWard from './TylerWard.jsx';

const EDEN_MOUNTAIN_HOME = 'https://images.pexels.com/photos/7746904/pexels-photo-7746904.jpeg?auto=compress&cs=tinysrgb&w=1800';
const CRATE_A = ['/tyler-crate-a.part0', '/tyler-crate-a.part1', '/tyler-crate-a.part2', '/tyler-crate-a.part3'];
const CRATE_B = ['/tyler-crate-b.part0', '/tyler-crate-b.part1', '/tyler-crate-b.part2', '/tyler-crate-b.part3'];

async function loadCrate(parts) {
  const encoded = (await Promise.all(parts.map(async (url) => {
    const response = await fetch(url, { cache: 'force-cache' });
    if (!response.ok) throw new Error(`crate chunk ${response.status}: ${url}`);
    return response.text();
  }))).join('').replace(/\s+/g, '');

  if (!encoded.startsWith('UklGR')) throw new Error('invalid crate WebP payload');
  return `data:image/webp;base64,${encoded}`;
}

export default function TylerWardLive() {
  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      const gallery = document.querySelector('.tw-live .tw .catalogImage');
      if (!gallery || gallery.dataset.exactCrates === 'ready') return;

      try {
        const [front, alternate] = await Promise.all([loadCrate(CRATE_A), loadCrate(CRATE_B)]);
        if (cancelled) return;

        const first = gallery.querySelector('img');
        if (!first) return;
        first.removeAttribute('srcset');
        first.loading = 'eager';
        first.decoding = 'async';
        first.alt = 'Flower-filled vintage .50 caliber ammunition crate planter, front angle';
        first.src = front;

        let second = gallery.querySelector('img[data-crate-angle="alternate"]');
        if (!second) {
          second = document.createElement('img');
          second.dataset.crateAngle = 'alternate';
          second.loading = 'lazy';
          second.decoding = 'async';
          second.alt = 'Flower-filled vintage .50 caliber ammunition crate planter, alternate angle';
          gallery.appendChild(second);
        }
        second.src = alternate;
        gallery.dataset.exactCrates = 'ready';
      } catch (error) {
        console.error('Tyler crate gallery failed to hydrate', error);
      }
    };

    hydrate();
    const retry = window.setInterval(hydrate, 600);
    const stop = window.setTimeout(() => window.clearInterval(retry), 10000);

    return () => {
      cancelled = true;
      window.clearInterval(retry);
      window.clearTimeout(stop);
    };
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

        .tw-live .tw .catalogImage {
          display: flex !important;
          align-items: stretch !important;
          justify-content: flex-start !important;
          gap: 1px !important;
          padding: 0 !important;
          min-height: 390px !important;
          background: #e7e3da !important;
          overflow: hidden !important;
        }
        .tw-live .tw .catalogImage > img {
          display: block !important;
          flex: 1 1 50% !important;
          width: 50% !important;
          min-width: 0 !important;
          min-height: 390px !important;
          height: auto !important;
          max-height: 500px !important;
          object-fit: contain !important;
          object-position: center !important;
          background: #fff !important;
        }

        @media (max-width: 880px) {
          .tw-live .tw .heroMedia { background-position: 58% center !important; }
        }

        @media (max-width: 640px) {
          .tw-live .tw .heroMedia { background-position: 56% center !important; }
          .tw-live .tw .heroShade { display: none !important; }
          .tw-live .tw .catalogImage {
            min-height: 0 !important;
            height: auto !important;
            aspect-ratio: auto !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
            scroll-snap-type: x mandatory !important;
            scrollbar-width: none !important;
          }
          .tw-live .tw .catalogImage::-webkit-scrollbar { display: none !important; }
          .tw-live .tw .catalogImage > img {
            flex: 0 0 100% !important;
            width: 100% !important;
            min-width: 100% !important;
            min-height: 0 !important;
            height: auto !important;
            max-height: none !important;
            aspect-ratio: 1 / 1 !important;
            scroll-snap-align: start !important;
          }
        }
      `}</style>
      <TylerWard />
    </div>
  );
}
