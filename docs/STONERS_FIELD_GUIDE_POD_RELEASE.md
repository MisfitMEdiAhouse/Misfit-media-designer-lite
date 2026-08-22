# The Stoner's Field Guide — POD Release Gate

Status: **STAGED, NOT PRODUCTION**

## Product
- Title: **THE STONER'S FIELD GUIDE**
- Subtitle: **Farming Hemp, Making Fuel & Building Cool Shit**
- Publisher: **Misfit Mediahouse**
- Merchant: **Coffee & A Joint**
- Stripe product: `prod_V7YG10mShJtoRG`
- Stripe price: `$249.00` one-time
- Stripe state: **inactive intentionally**
- SKU: `CAJ-BOOK-SFG-001`

## Physical target
- Blurb/RPI Large Landscape hardcover
- Marketed size: roughly 13 x 11 in
- Current working Collector's Edition: 192 pages
- **No separate digital-book deliverable required**
- Physical book uses real Coffee & A Joint Field Supply QR + stable Field Supply IDs

## Printed QR release gate

Canonical intended destination:

`https://coffeeandajoint.co/field-supply?src=sfg`

Before any physical book is approved for sale:
1. The canonical Coffee & A Joint Field Supply route must be live on the production domain.
2. The QR in the final print PDF must decode to the exact canonical URL.
3. The physical proof must be scanned from a real phone at normal reading distance.
4. The Field Supply page must retain `src=sfg` attribution and resolve the printed Field Supply IDs.
5. No QR may point directly to Amazon or another vendor.
6. Vendor affiliate/dealer routes may activate only after the relevant program/account is approved.

## Release order
1. Jonny approves the actual full Collector's Edition design/content.
2. Remove all fake/decorative QR artwork and any digital-edition language from the final print master.
3. Choose final Blurb/RPI paper + ImageWrap/dust-jacket binding.
4. Generate provider-exact interior bleed and cover/spine template from the provider spec tool; do not guess spine width.
5. Put the canonical Coffee & A Joint Field Supply route live and verify tracking.
6. Generate/embed the real QR and decode-test it from the exported print PDF.
7. Upload/proof physical book and verify one real copy, including QR scan tests.
8. Connect Blurb/RPI fulfillment credentials or approved storefront fulfillment handoff.
9. Activate Stripe product and create the approved checkout collecting email + shipping address.
10. Add the live product card to the canonical `coffeeandajoint.co` catalog and merchant twin.
11. Confirm order -> POD fulfillment -> shipping end-to-end.
12. Only after that, merge/deploy the product release.

## Domain rule
Do not "fix" one Coffee & A Joint hostname in isolation. Current state includes historical Vercel/legacy Coffee & A Joint surfaces plus the canonical `coffeeandajoint.co` destination. Domain/DNS/forwarding cleanup remains a separate reconciliation so the book launch does not create another duplicate store.

## Commerce rule
The physical book contains stable Field Supply IDs and a permanent Coffee & A Joint QR, not raw retailer affiliate links. Current vendor/affiliate/substitute routing lives behind the Field Supply web layer so monetization can change without making the printed book obsolete.
