import { useEffect } from 'react';
import RoadsGarageOSV3Core from './RoadsGarageOSV3Core.jsx';

const WHEEL_LAB_ENABLED = false;

const copyReplacements = [
  ['Misfit Road Lab', 'Misfit Rig Radar'],
  ['Road Lab', 'Rig Radar'],
  [
    'Street, track or dirt: calculate power, tires, gearing and crawl ratio, build a field kit, mock up wheels, and save everything to one garage.',
    'Street, track or dirt: calculate power, tires, gearing and crawl ratio, build a field kit, plan vehicle systems, and save everything to one garage.',
  ],
  [
    'Tune Lab, Tool DNA, Wheel Lab and Vehicle Systems all use this same saved profile.',
    'Tune Lab, Tool DNA and Vehicle Systems all use this same saved profile.',
  ],
  ['05 / Vehicle Systems', '04 / Vehicle Systems'],
  ['Live garage storage · functional Wheel Lab · saved builds', 'Live garage storage · vehicle math · saved builds'],
];

function applyPublicBranding() {
  const root = document.querySelector('[data-rig-radar-root]');
  if (!root) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    for (const [from, to] of copyReplacements) {
      if (node.nodeValue?.includes(from)) node.nodeValue = node.nodeValue.replace(from, to);
    }
    node = walker.nextNode();
  }

  root.querySelectorAll('[aria-label="Misfit Road Lab home"]').forEach((element) => {
    element.setAttribute('aria-label', 'Misfit Rig Radar home');
  });
}

export default function RoadsGarageOSV2() {
  useEffect(() => {
    applyPublicBranding();
  });

  return (
    <div data-rig-radar-root>
      {!WHEEL_LAB_ENABLED ? (
        <style>{`#wheels, a[href="#wheels"] { display: none !important; }`}</style>
      ) : null}
      <RoadsGarageOSV3Core />
    </div>
  );
}
