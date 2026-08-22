# The Stoner's Field Guide — Hands-Off Monetization

Status: STAGED ONLY. Do not merge/deploy until the physical book + POD release gate is approved.

## Product rule

**One paid product: the physical Collector's Edition hardcover.**

There is no ebook, downloadable edition, digital companion, web-readable copy, or duplicate digital guide product.

The only web layer connected to the book is commerce infrastructure:

`printed book -> Coffee & A Joint Field Supply QR -> Field Supply ID -> approved vendor/dealer/affiliate -> vendor fulfillment -> Misfit attribution/commission`

The website must not reproduce the book. It only sells the hardcover and resolves current equipment/supply purchasing routes.

## Owner rule

The owner does not stock, pack, ship, source ad hoc inventory, or manually fulfill equipment orders. Coffee & A Joint owns discovery, attribution, audience and merchandising. The manufacturer, dealer, POD printer or retailer owns fulfillment.

## Printed QR architecture

Canonical QR destination:

`https://coffeeandajoint.co/field-supply?src=sfg`

Rules:
1. The QR must be a real standards-compliant code, never decorative AI artwork.
2. Decode-test the QR from the final print PDF and from the physical proof before release.
3. The printed QR points only to Coffee & A Joint, never directly to Amazon or another vendor.
4. Printed Field Supply IDs identify the recommendation; the web route resolves each ID to the current approved supplier/partner route.
5. `src=sfg` records that the visit originated from the physical Stoner's Field Guide.
6. Partner click/order attribution reconciles to the Field Supply ID.
7. Vendor routing may change without reprinting the book.

## Commercial routing priority

1. Direct manufacturer sales-rep/dealer/referral margin.
2. Approved high-commission creator/affiliate partner.
3. Specialty retailer affiliate.
4. Amazon fallback for commodity parts when compliant and approved.

## Amazon rule

Amazon Special Links are never printed in the hardcover or embedded in any book file. The hardcover points only to Coffee & A Joint. A live Coffee & A Joint Field Supply page may carry compliant Amazon Associates links only after account approval.

## Priority B2B relationships

### Seedburo
Pursue a direct sales-rep/referral arrangement for hemp moisture, grain and seed QC equipment with Seedburo fulfilling the order.

### PITEBA
Pursue a US referral/dealer arrangement for homestead/micro-scale presses, parts and accessories with direct fulfillment.

### Farmet
Pursue referral/rep terms for small-capacity oilseed presses and turnkey systems with Farmet or an assigned dealer fulfilling leads.

## Affiliate candidates

Candidates only until approved in-account:
- Lowe's Creator
- Home Depot Creator
- Northern Tool + Equipment / CJ
- Tractor Supply affiliate network
- Amazon Associates
- VEVOR affiliate program

## Current partnership status

Outreach has been sent to Seedburo, PITEBA and Farmet. No negotiated relationship is active until a reply/approval and terms are verified. Public affiliate programs are not active merely because the program exists; account approval, tax and payout onboarding are required.

## Human gates

1. Affiliate/dealer applications requiring owner identity, tax or payout information.
2. Acceptance of negotiated Seedburo/PITEBA/Farmet terms.
3. Approval of the physical proof before checkout is activated.

## Data model

`Printed QR -> src=sfg -> Field Supply ID -> active partner -> destination -> attribution -> vendor fulfillment -> revenue reconciliation`

Track partner, commission model, attribution window, fulfillment owner, last verified date, backup partner, clicks, leads, orders and commission revenue.

## Release rule

Do not expose partner logos, commission claims or payout rates publicly until the corresponding account/program is approved and terms are verified. The Field Supply page can show unbiased equipment recommendations before monetization is active.
