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

## Physical-only product rule

The customer product is the **physical Collector's Edition hardcover only**.

Do not create, bundle, advertise or deliver an ebook, downloadable PDF, digital companion, web-readable duplicate, or other digital-book edition.

The website may contain only:
- the physical product listing / checkout;
- the Field Supply commerce route used by printed QR codes;
- supplier/affiliate/dealer attribution and routing behind those QR codes.

It must not reproduce the book itself.

## Physical target
- Blurb/RPI Large Landscape hardcover
- Marketed size: roughly 13 x 11 in
- Current working Collector's Edition: 192 pages
- Real Coffee & A Joint Field Supply QR + stable Field Supply IDs inside the physical book

## Printed QR release gate

Canonical intended destination:

`https://coffeeandajoint.co/field-supply?src=sfg`

Before any physical book is approved for sale:
1. The canonical Coffee & A Joint Field Supply route must be live on the production domain.
2. Every QR in the final print PDF must decode to the intended Coffee & A Joint URL.
3. The physical proof must be scanned from a real phone at normal reading distance.
4. The Field Supply page must retain `src=sfg` attribution and resolve printed Field Supply IDs.
5. No QR may point directly to Amazon or another vendor.
6. Vendor affiliate/dealer routes may activate only after the relevant account/program is approved.

## Release order
1. Jonny approves the actual full Collector's Edition design/content.
2. Remove all digital-edition language, digital-book artifacts and decorative/fake QR artwork from the print master.
3. Choose final Blurb/RPI paper + ImageWrap/dust-jacket binding.
4. Generate provider-exact interior bleed and cover/spine template; do not guess spine width.
5. Put the canonical Coffee & A Joint Field Supply route live and verify tracking.
6. Generate/embed the real QR codes and decode-test them from the exported print PDF.
7. Upload/proof the physical book and verify one real copy, including QR scans.
8. Connect Blurb/RPI fulfillment credentials or approved storefront fulfillment handoff.
9. Activate Stripe checkout for the physical hardcover.
10. Add the live hardcover product card to the canonical `coffeeandajoint.co` catalog and merchant twin.
11. Confirm order -> POD fulfillment -> shipping end-to-end.
12. Only after that, merge/deploy the product release.

## Domain rule
Do not fix one Coffee & A Joint hostname in isolation. Historical Vercel/legacy surfaces plus the canonical `coffeeandajoint.co` destination must be reconciled as a separate domain-cleanup operation so the book launch does not create another duplicate store.

## Commerce rule
The physical book contains stable Field Supply IDs and permanent Coffee & A Joint QR codes, not raw retailer affiliate links. Vendor/affiliate/substitute routing lives behind the Field Supply web layer so monetization can change without making the printed book obsolete.
