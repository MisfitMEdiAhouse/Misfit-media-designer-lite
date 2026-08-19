import TylerWard from './TylerWard.jsx';

const EDEN_MOUNTAIN_HOME = 'https://images.pexels.com/photos/7746904/pexels-photo-7746904.jpeg?auto=compress&cs=tinysrgb&w=1800';
const CRATE_CATALOG = 'https://coffeeandajoint.co/images/make-love-not-war-crate.png';

export default function TylerWardLive() {
  return (
    <div className="tw-live">
      <style>{`
        /* Actual contractor hero: mountain-home architecture, not the planter product. */
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

        /* Product is a clean ecommerce/catalog image. No zoom, no dark overlay, no fake lifestyle background. */
        .tw-live .tw .productVisual {
          background-color: #fff !important;
          background-image: url("${CRATE_CATALOG}") !important;
          background-size: contain !important;
          background-position: center center !important;
          background-repeat: no-repeat !important;
          min-height: 520px !important;
        }
        .tw-live .tw .productVisual:before { display: none !important; }
        .tw-live .tw .buyBox { z-index: 4 !important; }

        @media (max-width: 880px) {
          .tw-live .tw .heroMedia { background-position: 58% center !important; }
          .tw-live .tw .productVisual { min-height: 500px !important; }
        }
        @media (max-width: 600px) {
          .tw-live .tw .heroMedia {
            background-position: 56% center !important;
          }
          .tw-live .tw .heroShade {
            background: linear-gradient(180deg,rgba(8,10,8,.04) 0%,rgba(8,10,8,.10) 35%,rgba(8,10,8,.72) 63%,rgba(8,10,8,.98) 84%) !important;
          }
          .tw-live .tw .productVisual {
            background-color: #fff !important;
            background-size: contain !important;
            min-height: 430px !important;
          }
        }
      `}</style>
      <TylerWard />
    </div>
  );
}
