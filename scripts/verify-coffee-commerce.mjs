import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { LINKS, resolvePlan } from '../supabase/functions/coffee-joint-stripe-webhook/fulfillment.ts';

const expected = [
  [LINKS.drugs, 'hat', 'printify', 4500],
  [LINKS.classic, 'hat', 'printful', 6500],
  [LINKS.patch, 'patch', 'printful', 0],
  [LINKS.crate, 'crate', 'owner', 0],
  [LINKS.bundle, 'bundle', 'printify', 4500],
];

for (const [paymentLink, orderKind, provider, commissionBaseAmount] of expected) {
  const plan = resolvePlan({ payment_link: paymentLink });
  assert.ok(plan, `${paymentLink} should resolve`);
  assert.equal(plan.orderKind, orderKind);
  assert.equal(plan.items[0].provider, provider);
  assert.equal(plan.commissionBaseAmount, commissionBaseAmount);
}

assert.equal(
  resolvePlan({ metadata: { brand: 'CoffeeAndAJoint', catalog_sku: 'classic-herb-patch' } })?.orderKind,
  'patch',
);
assert.equal(
  resolvePlan({ metadata: { brand: 'coffeeandajoint', fulfillment_provider: 'printify' } })?.items[0].productKey,
  'drugs',
);
assert.equal(resolvePlan({ metadata: { brand: 'some-other-store' } }), null);
assert.throws(
  () => resolvePlan({ metadata: { brand: 'CoffeeAndAJoint', catalog_sku: 'unknown' } }),
  /no fulfillment mapping/,
);

const affiliatePage = await readFile(new URL('../public/caj-affiliate.html', import.meta.url), 'utf8');
const affiliateFunction = await readFile(
  new URL('../supabase/functions/coffee-joint-affiliates/index.ts', import.meta.url),
  'utf8',
);
const coffeePage = await readFile(new URL('../public/coffee-restored.html', import.meta.url), 'utf8');
assert.ok(affiliatePage.includes("const link=j.link||('https://misfitmediahouse.com/coffee-restored?ref='"));
assert.ok(!affiliatePage.includes('coffeeandajoint.co/r/'));
assert.ok(affiliateFunction.includes('https://misfitmediahouse.com/coffee-restored'));
assert.ok(coffeePage.includes("params.get('ref')"));
assert.ok(coffeePage.includes("'client_reference_id='"));

console.log('coffee commerce verified: live Stripe SKUs route, unknown SKUs fail closed, and ambassador links reach checkout with attribution');
