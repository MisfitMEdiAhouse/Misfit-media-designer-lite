# The Stoner's Field Guide — Hands-Off Monetization

Status: STAGED ONLY. Do not merge/deploy until the book + POD release gate is approved.

## Owner rule

The owner does not stock, pack, ship, source ad hoc inventory, or manually fulfill equipment orders. Coffee & A Joint owns discovery, attribution, audience and merchandising. The manufacturer, dealer, POD printer or retailer owns fulfillment.

## Product rule

There is **no separate downloadable/digital edition requirement**. The paid product is the physical Collector's Edition. The printed book carries stable Field Supply IDs plus one permanent Coffee & A Joint QR destination. That web destination is an equipment/supplier portal, not a second copy of the book.

## Printed QR architecture

Canonical QR destination:

`https://coffeeandajoint.co/field-supply?src=sfg`

Rules:
1. The QR must be generated as a real standards-compliant QR code, not decorative AI artwork.
2. The code must be decoded from the final print PDF and from the physical proof before release.
3. The QR points only to Coffee & A Joint, never directly to Amazon or a vendor.
4. Printed Field Supply IDs identify the recommendation; the web route resolves each ID to the current partner, dealer, substitute, price/spec page, or source.
5. The inbound `src=sfg` attribution records that the visit originated from the printed Stoner's Field Guide.
6. Partner click/order attribution is reconciled behind the Field Supply ID so commissions can be measured without reprinting the book.
7. If a vendor or commission rail changes, routing changes online while the printed QR and Field Supply ID stay valid.

## Funnel

1. Reader buys or encounters the physical Stoner's Field Guide.
2. Reader scans the printed Coffee & A Joint Field Supply QR.
3. Reader selects or searches the Field Supply ID printed beside the tool/equipment recommendation.
4. Routing chooses the best **approved** active commercial rail:
   - direct manufacturer sales-rep/dealer/referral margin;
   - high-commission creator/affiliate partner;
   - specialty retailer affiliate;
   - Amazon fallback for commodity parts.
5. Vendor fulfills the order.
6. Referral/affiliate/dealer revenue reconciles back to the Field Supply ID and source `sfg`.
7. If a better supplier or commission rail appears, routing changes without changing the printed book.

## Amazon rule

Amazon Special Links must not be printed in the book or embedded in a PDF/ebook. The printed book links only to Coffee & A Joint. A live Coffee & A Joint web page may carry compliant Amazon Associates links after program approval.

## Priority B2B relationships

### Seedburo
Publicly recruiting sales representatives with competitive margins. Strong first direct relationship because the Stoner's Field Guide has legitimate hemp moisture / grain / seed QC use cases. Ask for rep margin, attribution, quote flow, territory, product feed and direct fulfillment.

### PITEBA
Manufacturer sells worldwide and already maintains a dealer network. Ask for a US referral/dealer arrangement for homestead and micro-scale oil presses, accessories and replacement parts with direct fulfillment.

### Farmet
Manufacturer explicitly says partners can become sales representatives and already has US dealers. Ask for referral/rep terms for small-capacity oilseed presses and turnkey systems, with leads fulfilled by Farmet or an assigned US dealer.

## Public affiliate rails

Candidates only until approved in-account:
- Lowe's Creator
- Home Depot Creator
- Northern Tool + Equipment / CJ
- Tractor Supply affiliate network
- Amazon Associates
- VEVOR affiliate program

## Current partnership status

Outreach has been sent to Seedburo, PITEBA and Farmet. No negotiated agreement is considered active until a reply/approval and terms are verified. Public affiliate rails are also **not active** merely because a public program exists; account approval, tax and payout onboarding are required first.

## Human gates

The remaining application gates require owner/account-holder information that should not be guessed or hard-coded:

1. Lowe's Creator application — identity, social/site profile, tax/payment onboarding.
2. Home Depot Creator application — identity/profile, terms, tax/payment onboarding.
3. Northern Tool / CJ application — publisher account, tax/payment onboarding.
4. Tractor Supply affiliate-network application — publisher account, tax/payment onboarding.
5. Amazon Associates application — site/account, tax/payment onboarding and program review.
6. VEVOR affiliate application if used.
7. Review any negotiated Seedburo/PITEBA/Farmet agreement before acceptance.

## Data model

Every buyable recommendation should resolve through:

`Printed QR -> src=sfg -> Field Supply ID -> category -> active partner -> destination -> attribution -> vendor fulfillment -> revenue reconciliation`

Track partner, commission model, attribution window, fulfillment owner, last verified date, backup partner, clicks, leads, orders and commission revenue.

## Release rule

Do not expose affiliate claims, commission rates or partner logos publicly until the corresponding program is approved and the terms are verified in the account. The Field Supply page can show unbiased equipment recommendations before monetization is active.
