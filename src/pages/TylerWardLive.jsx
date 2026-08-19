import TylerWard from './TylerWard.jsx';
import crateCatalogAlt from '../assets/tyler/tyler-crate-catalog-2.webp';

const EDEN_MOUNTAIN_HOME = 'https://images.pexels.com/photos/7746904/pexels-photo-7746904.jpeg?auto=compress&cs=tinysrgb&w=1800';

export default function TylerWardLive() {
  return (
    <div className="tw-live">
      <style>{`
        /* Contractor hero stays separate from the product catalog. */
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

        /* Exact supplied crate catalog photos. The first is the real img from TylerWard;
           the second is a second flex panel, so no external host or Coffee dependency exists. */
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
        .tw-live .tw .catalogImage > img,
        .tw-live .tw .catalogImage::after {
          flex: 1 1 50% !important;
          width: 50% !important;
          min-width: 0 !important;
          min-height: 390px !important;
          max-height: 500px !important;
          background-color: #fff !important;
          background-position: center !important;
          background-repeat: no-repeat !important;
          background-size: contain !important;
        }
        .tw-live .tw .catalogImage > img {
          display: block !important;
          height: auto !important;
          object-fit: contain !important;
          object-position: center !important;
        }
        .tw-live .tw .catalogImage::after {
          content: "" !important;
          display: block !important;
          background-image: url("${crateCatalogAlt}") !important;
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
          .tw-live .tw .catalogImage > img,
          .tw-live .tw .catalogImage::after {
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
