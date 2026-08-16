import RoadsGarageOSV2Core from './RoadsGarageOSV2Core.jsx';

export default function RoadsGarageOSV2() {
  return (
    <div className="roads-v4 relative">
      <style>{`
        .roads-v4 nav,
        .roads-v4 footer { display: none !important; }
        .roads-v4 main { padding-top: 0 !important; }
        .roads-v4 main > section:first-child {
          background-image: url('/roads-command-hero-v2.webp');
          background-size: cover;
          background-position: center;
        }
        .roads-v4 main > section:first-child > img { display: none !important; }
        .roads-v4 main > section:first-child > div.relative > div:first-child {
          justify-content: flex-end !important;
        }
        .roads-v4 main > section:first-child > div.relative > div:first-child > div:first-child {
          display: none !important;
        }
        .roads-v4 main > section:first-child .max-w-4xl > div:first-child {
          display: none !important;
        }
      `}</style>

      <img
        src="/roads-misfit-black-flag-lockup.webp"
        alt="Roads Co. × Misfit Mediahouse"
        className="pointer-events-none absolute left-5 top-5 z-[60] h-28 w-28 object-contain drop-shadow-[0_0_22px_rgba(0,199,242,0.20)] sm:h-36 sm:w-36 lg:h-40 lg:w-40"
      />

      <RoadsGarageOSV2Core />
    </div>
  );
}
