import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const assets = [
  {
    parts: [
      'public/tyler-crate-a.part0',
      'public/tyler-crate-a.part1',
      'public/tyler-crate-a.part2',
      'public/tyler-crate-a.part3',
    ],
    sha256: '9a7952558292d423fec43352198929c00dcfdf245271b23aa0729310ebc793aa',
    outputs: [
      'src/assets/tyler/tyler-crate-catalog.webp',
      'public/tyler-crate-catalog.webp',
    ],
  },
  {
    parts: [
      'public/tyler-crate-b.part0',
      'public/tyler-crate-b.part1',
      'public/tyler-crate-b.part2',
      'public/tyler-crate-b.part3',
    ],
    sha256: 'e66824adaeb7d763353044be1035ede19dbfd15871126c87330b4dc766a7e1ca',
    outputs: [
      'src/assets/tyler/tyler-crate-catalog-2.webp',
      'public/tyler-crate-catalog-2.webp',
    ],
  },
];

for (const asset of assets) {
  const encoded = asset.parts
    .map((part) => fs.readFileSync(path.join(root, part), 'utf8'))
    .join('')
    .replace(/\s+/g, '');

  if (!encoded.startsWith('UklGR')) {
    throw new Error(`Invalid base64 WebP header for ${asset.parts[0]}`);
  }

  const bytes = Buffer.from(encoded, 'base64');
  if (
    bytes.subarray(0, 4).toString('ascii') !== 'RIFF' ||
    bytes.subarray(8, 12).toString('ascii') !== 'WEBP'
  ) {
    throw new Error(`Decoded asset is not WebP: ${asset.parts[0]}`);
  }

  const digest = crypto.createHash('sha256').update(bytes).digest('hex');
  if (digest !== asset.sha256) {
    throw new Error(`SHA mismatch for ${asset.parts[0]}: ${digest}`);
  }

  for (const output of asset.outputs) {
    const target = path.join(root, output);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, bytes);
  }

  console.log(`Decoded ${asset.parts[0]}: ${bytes.length} bytes`);
}

console.log('Decoded Tyler crate catalog assets');
