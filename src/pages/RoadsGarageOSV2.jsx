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
      root.querySelectorAll('img[alt="Roads Co."]').forEach((image) => {
        setMedia(image, ROADS_LOGO_DATA);
        image.classList.remove('invert');
        image.style.background = 'transparent';
        image.style.objectFit = 'contain';
        image.style.objectPosition = 'center';
        image.style.width = '138px';
        image.style.height = 'auto';
        image.style.maxWidth = '42vw';
        image.style.maxHeight = '64px';
        if (image.parentElement) image.parentElement.style.overflow = 'visible';
      });

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
    <div ref={rootRef}>
      <RoadsGarageOSV2Core />
    </div>
  );
}
