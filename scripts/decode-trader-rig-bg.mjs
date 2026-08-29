import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const dir = path.join(root, 'public', '_encoded');
const expectedTopLength = 17011;
const expectedTopHashes = [
  '683e65a6dabe91ba601bbd58d4fcc3dc5e71f042aed04afdfcfd4010a5a60912',
  '14081e87b698fec92b2b11fcf086240066610f26f5d13f7b209834d2244a3336',
  '792fad5ca79ebb538f264ec1a54a255f40ebf01b26d0080a9f378a4879f9957e',
  'd20034db6fa36c543902b353e8f227168b56b8a67b4703470993f4876219da65',
];
const segmentLengths = [2836,2835,2835,2835,2835,2835];
const segmentHashes = [
  '28e3b84011e9293d32862c71ab43f94bdfb7640ffb7d094ff64e9a9e72ee50ad',
  'd01aae950f67983738b4e9b8f087ea860212de286bae9b2dd400e8355853004f',
  '0f374d097c5784b5292845c187caf942b36e8a7193b6bd3ff1eab8628a525955',
  'be69be5e3493801a76db8d0fe5916c774543eee6af43ee3d6cfc67cee2d9ae7d',
  '00997a85e1400206be33558f56f2a9252a1cf5b5c44b5944eefa6ae83462b07e',
  'df9d7caf64c4074c765f97b3365fa420e72fdf25ba728a6dba087916a801aa7d',
];
const expectedBytes = 51032;
const expectedSha256 = '64f134dd9ddeaeb407bb29e85b854971615b77384a6a320a9da6ba580ab9f718';
const hashText = (text) => crypto.createHash('sha256').update(text).digest('hex');
const read = (name) => {
  const file = path.join(dir, name);
  if (!fs.existsSync(file)) throw new Error(`Missing Trader background chunk: ${file}`);
  return fs.readFileSync(file, 'utf8').trim();
};

const top0 = read('misfit-trader-rig-bg.part0');
const top1 = read('misfit-trader-rig-bg.part1');
const top3 = read('misfit-trader-rig-bg.part3');
const segments = segmentHashes.map((expectedHash, i) => {
  const text = read(`misfit-trader-rig-bg.part2.${i}`);
  const hash = hashText(text);
  console.log(`Trader bg part2.${i}: ${text.length} chars · ${hash}`);
  if (text.length !== segmentLengths[i]) throw new Error(`Trader background segment 2.${i} length mismatch`);
  if (hash !== expectedHash) throw new Error(`Trader background segment 2.${i} hash mismatch`);
  return text;
});
const top2 = segments.join('');
const tops = [top0,top1,top2,top3];

tops.forEach((text,i) => {
  const hash = hashText(text);
  console.log(`Trader bg top chunk ${i}: ${text.length} chars · ${hash}`);
  if (text.length !== expectedTopLength) throw new Error(`Trader background top chunk ${i} length mismatch`);
  if (hash !== expectedTopHashes[i]) throw new Error(`Trader background top chunk ${i} hash mismatch`);
});

const data = Buffer.from(tops.join(''), 'base64');
const sha256 = crypto.createHash('sha256').update(data).digest('hex');
if (data.length !== expectedBytes) throw new Error(`Trader background decoded ${data.length} bytes; expected ${expectedBytes}`);
if (sha256 !== expectedSha256) throw new Error(`Trader background SHA mismatch: ${sha256}`);

const out = path.join(root, 'public', 'misfit-trader-rig-bg.webp');
fs.writeFileSync(out, data);
console.log(`Decoded exact founder-uploaded Trader rig background: ${data.length} bytes · sha256 ${sha256}`);
