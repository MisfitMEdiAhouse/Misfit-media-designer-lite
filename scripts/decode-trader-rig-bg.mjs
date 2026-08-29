import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const parts = [0,1,2,3].map((i) => path.join(root, 'public', '_encoded', `misfit-trader-rig-bg.part${i}`));
const expectedPartLength = 17011;
const expectedBytes = 51032;
const expectedSha256 = '64f134dd9ddeaeb407bb29e85b854971615b77384a6a320a9da6ba580ab9f718';

for (const file of parts) {
  if (!fs.existsSync(file)) throw new Error(`Missing Trader background chunk: ${file}`);
}

const chunks = parts.map((file, i) => {
  let text = fs.readFileSync(file, 'utf8').trim();
  // GitHub text transport added two trailing characters to part 2. Strip only that
  // known transport artifact, then verify the reconstructed binary by exact SHA.
  if (i === 2 && text.length === expectedPartLength + 2 && text.endsWith('qv')) {
    text = text.slice(0, -2);
    console.log('Trimmed known 2-character transport artifact from Trader background chunk 2');
  }
  if (text.length !== expectedPartLength) throw new Error(`Trader background chunk ${i} length ${text.length}; expected ${expectedPartLength}`);
  return text;
});

const data = Buffer.from(chunks.join(''), 'base64');
const sha256 = crypto.createHash('sha256').update(data).digest('hex');
if (data.length !== expectedBytes) throw new Error(`Trader background decoded ${data.length} bytes; expected ${expectedBytes}`);
if (sha256 !== expectedSha256) throw new Error(`Trader background SHA mismatch: ${sha256}`);

const out = path.join(root, 'public', 'misfit-trader-rig-bg.webp');
fs.writeFileSync(out, data);
console.log(`Decoded exact founder-uploaded Trader rig background: ${data.length} bytes · sha256 ${sha256}`);
