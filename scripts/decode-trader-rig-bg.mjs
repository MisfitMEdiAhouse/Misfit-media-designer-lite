import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const parts = [0,1,2,3].map((i) => path.join(root, 'public', '_encoded', `misfit-trader-rig-bg.part${i}`));
const expectedPartLength = 17011;
const expectedPartHashes = [
  '683e65a6dabe91ba601bbd58d4fcc3dc5e71f042aed04afdfcfd4010a5a60912',
  '14081e87b698fec92b2b11fcf086240066610f26f5d13f7b209834d2244a3336',
  '792fad5ca79ebb538f264ec1a54a255f40ebf01b26d0080a9f378a4879f9957e',
  'd20034db6fa36c543902b353e8f227168b56b8a67b4703470993f4876219da65',
];
const expectedBytes = 51032;
const expectedSha256 = '64f134dd9ddeaeb407bb29e85b854971615b77384a6a320a9da6ba580ab9f718';
const hashText = (text) => crypto.createHash('sha256').update(text).digest('hex');

for (const file of parts) if (!fs.existsSync(file)) throw new Error(`Missing Trader background chunk: ${file}`);

const chunks = parts.map((file, i) => {
  let text = fs.readFileSync(file, 'utf8').trim();
  if (i === 2 && text.length === expectedPartLength + 2 && text.endsWith('qv')) text = text.slice(0, -2);
  const textHash = hashText(text);
  console.log(`Trader bg chunk ${i}: ${text.length} chars · ${textHash}`);
  if (text.length !== expectedPartLength) throw new Error(`Trader background chunk ${i} length ${text.length}; expected ${expectedPartLength}`);
  if (textHash !== expectedPartHashes[i]) throw new Error(`Trader background chunk ${i} hash mismatch`);
  return text;
});

const data = Buffer.from(chunks.join(''), 'base64');
const sha256 = crypto.createHash('sha256').update(data).digest('hex');
if (data.length !== expectedBytes) throw new Error(`Trader background decoded ${data.length} bytes; expected ${expectedBytes}`);
if (sha256 !== expectedSha256) throw new Error(`Trader background SHA mismatch: ${sha256}`);

const out = path.join(root, 'public', 'misfit-trader-rig-bg.webp');
fs.writeFileSync(out, data);
console.log(`Decoded exact founder-uploaded Trader rig background: ${data.length} bytes · sha256 ${sha256}`);
