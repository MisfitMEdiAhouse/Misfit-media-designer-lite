import { useLayoutEffect, useRef } from 'react';
import RoadsGarageOSV2Core from './RoadsGarageOSV2Core.jsx';
import { ROADS_LOGO_DATA } from '../assets/roadsLogoData.js';
import { ROADS_TUNER_DATA, ROADS_WHEEL_DATA, ROADS_MERCH_DATA } from '../assets/roadsMediaData.js';

export default function RoadsGarageOSV2() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const swap = (selector, src, afterSwap) => {
      root.querySelectorAll(selector).forEach((image) => {
        image.src = src;
        image.removeAttribute('srcset');
        image.removeAttribute('sizes');
        if (afterSwap) afterSwap(image);
      });
    };

    swap('img[src="/roads-co-logo.svg"]', ROADS_LOGO_DATA, (image) => {
      image.classList.remove('invert');
      image.style.background = 'transparent';
    });
    swap('img[src="/roads-tuner.webp"]', ROADS_TUNER_DATA);
    swap('img[src="/roads-wheel.webp"]', ROADS_WHEEL_DATA);
    swap('img[src="/roads-merch.webp"]', ROADS_MERCH_DATA);
  }, []);

  return (
    <div ref={rootRef}>
      <RoadsGarageOSV2Core />
    </div>
  );
}
