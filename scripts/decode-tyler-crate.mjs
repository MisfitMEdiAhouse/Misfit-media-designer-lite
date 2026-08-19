import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'public', 'tyler-crate-catalog.data');
const target = path.join(root, 'src', 'assets', 'tyler', 'tyler-crate-catalog.webp');

const encoded = fs.readFileSync(source, 'utf8').replace(/\s+/g, '');
if (!encoded.startsWith('UklGR')) {
  throw new Error('Tyler crate catalog source is not a base64 WebP payload');
}

const bytes = Buffer.from(encoded, 'base64');
if (bytes.subarray(0, 4).toString('ascii') !== 'RIFF' || bytes.subarray(8, 12).toString('ascii') !== 'WEBP') {
  throw new Error('Decoded Tyler crate catalog image is not a valid WebP');
}

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, bytes);
console.log(`Decoded Tyler crate catalog image: ${bytes.length} bytes`);
