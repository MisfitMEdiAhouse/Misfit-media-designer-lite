import { useEffect } from 'react';
import RoadsGarageOSV3Core from './RoadsGarageOSV3Core.jsx';

const WHEEL_LAB_ENABLED = false;

const copyReplacements = [
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

function applyWheelLabGate() {
  if (WHEEL_LAB_ENABLED) return;

  const root = document.querySelector('[data-road-lab-root]');
  if (!root) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    for (const [from, to] of copyReplacements) {
      if (node.nodeValue?.includes(from)) node.nodeValue = node.nodeValue.replace(from, to);
    }
    node = walker.nextNode();
  }
}

export default function RoadsGarageOSV2() {
  useEffect(() => {
    applyWheelLabGate();
  });

  return (
    <div data-road-lab-root>
      {!WHEEL_LAB_ENABLED ? (
        <style>{`#wheels, a[href="#wheels"] { display: none !important; }`}</style>
      ) : null}
      <RoadsGarageOSV3Core />
    </div>
  );
}
