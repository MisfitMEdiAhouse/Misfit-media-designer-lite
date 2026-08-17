import { useLayoutEffect, useRef } from 'react';
import RoadsGarageOSV2Core from './RoadsGarageOSV2Core.jsx';
import { ROADS_LOGO_DATA } from '../assets/roadsLogoData.js';

const TUNER_PHOTO = 'https://roadscollective.com/cdn/shop/files/IMG_5049.jpg?crop=center&height=1200&v=1736916492&width=1200';
const WHEEL_PHOTO = 'https://fifteen52.com/cdn/shop/files/preview_images/5eed44feaf4643899b3a291676264151.thumbnail.0000000000.jpg?v=1768413993&width=1920';
const MERCH_PHOTO = 'https://roadscollective.com/cdn/shop/files/Screenshot_29.png?crop=center&height=1200&v=1736916292&width=1200';

export default function RoadsGarageOSV2() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const applyMedia = () => {
      root.querySelectorAll('img[src="/roads-co-logo.svg"], img[alt="Roads Co."]').forEach((image) => {
        image.src = ROADS_LOGO_DATA;
        image.removeAttribute('srcset');
        image.removeAttribute('sizes');
        image.classList.remove('invert');
        image.style.background = 'transparent';
        image.style.objectFit = 'contain';
        image.style.objectPosition = 'center';
        image.style.width = '132px';
        image.style.height = 'auto';
        image.style.maxWidth = '38vw';
        image.style.maxHeight = '58px';
      });

      root.querySelectorAll('img[src="/roads-tuner.webp"]').forEach((image) => {
        image.src = TUNER_PHOTO;
        image.removeAttribute('srcset');
        image.removeAttribute('sizes');
        image.style.objectFit = 'cover';
        image.style.objectPosition = 'center';
      });

      root.querySelectorAll('img[src="/roads-wheel.webp"]').forEach((image) => {
        image.src = WHEEL_PHOTO;
        image.removeAttribute('srcset');
        image.removeAttribute('sizes');
        image.style.objectFit = 'cover';
        image.style.objectPosition = 'center';
      });

      root.querySelectorAll('img[src="/roads-merch.webp"], img[alt="Roads Collective apparel"]').forEach((image) => {
        image.src = MERCH_PHOTO;
        image.removeAttribute('srcset');
        image.removeAttribute('sizes');
        image.style.objectFit = 'cover';
        image.style.objectPosition = 'center 35%';
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
