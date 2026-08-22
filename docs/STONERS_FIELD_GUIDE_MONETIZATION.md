# The Stoner's Field Guide — Hands-Off Monetization

Status: STAGED ONLY. Do not merge/deploy until the book + POD release gate is approved.

## Owner rule

The owner does not stock, pack, ship, source ad hoc inventory, or manually fulfill equipment orders. Coffee & A Joint owns discovery, attribution, audience and merchandising. The manufacturer, dealer, POD printer or retailer owns fulfillment.

## Funnel

1. Search/social/share reaches free Stoner's Field Guide content.
2. Reader lands on a Coffee & A Joint Field Supply page using a stable Field Supply ID.
3. Routing chooses the best active commercial rail:
   - direct manufacturer sales-rep/dealer/referral margin;
   - high-commission creator/affiliate partner;
   - specialty retailer affiliate;
   - Amazon fallback for commodity parts.
4. Vendor fulfills the order.
5. Referral/affiliate/dealer revenue reconciles back to the Field Supply ID.
6. If a better supplier or commission rail appears, routing changes without changing the printed book.

## Print / digital rule

The physical book and downloadable book should use stable Coffee & A Joint Field Supply URLs/IDs, not retailer affiliate URLs. Amazon Special Links must not be printed in the book or embedded in an ebook/PDF. The live web destination may carry compliant affiliate links after program approval.

## Priority B2B relationships

### Seedburo
Publicly recruiting sales representatives with competitive margins. Strongest first direct relationship because the Stoner's Field Guide has legitimate hemp moisture / grain / seed QC use cases. Ask for rep margin, attribution, quote flow, territory, product feed and direct fulfillment.

### PITEBA
Manufacturer sells worldwide and already maintains a dealer network. Ask for a US referral/dealer arrangement for homestead and micro-scale oil presses, accessories and replacement parts with direct fulfillment.

### Farmet
Manufacturer explicitly says partners can become sales representatives and already has US dealers. Ask for referral/rep terms for small-capacity oilseed presses and turnkey systems, with leads fulfilled by Farmet or an assigned US dealer.

## Public affiliate rails

- Lowe's Creator: up to 25% depending on category, 30-day attribution.
- Home Depot Creator: advertises 8% on everything plus bonus opportunities.
- Northern Tool + Equipment: 30-day cookie; CJ program; high-value tool/equipment basket.
- Tractor Supply: performance-marketing affiliate program with competitive commissions.
- Amazon Associates: 3% standard rate in relevant US categories; fallback only, not the primary rail.

## Human gates

The remaining application gates require owner/account-holder information that should not be guessed or hard-coded:

1. Lowe's Creator application — identity, social/site profile, tax/payment onboarding.
2. Home Depot Creator application — identity/profile, terms, tax/payment onboarding.
3. Northern Tool / CJ application — publisher account, tax/payment onboarding.
4. Tractor Supply affiliate-network application — publisher account, tax/payment onboarding.
5. Amazon Associates application — site/account, tax/payment onboarding and program review.
6. Review any negotiated Seedburo/PITEBA/Farmet agreement before acceptance.

## Data model

Every buyable recommendation should resolve through:

`Field Supply ID -> category -> active partner -> destination -> attribution -> vendor fulfillment -> revenue reconciliation`

Track partner, commission model, attribution window, fulfillment owner, last verified date, backup partner, clicks, leads, orders and commission revenue.

## Release rule

Do not expose affiliate claims, commission rates or partner logos publicly until the corresponding program is approved and the terms are verified in the account. The free guide can still show unbiased equipment recommendations before monetization is active.
