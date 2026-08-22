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
- Interior working trim: 12.50 x 10.625 in
- Current manuscript: 72 pages
- Physical purchase should include digital companion + live Field Supply Index

## Release order
1. Jonny approves the actual 72-page book.
2. Choose final Blurb/RPI paper + ImageWrap/dust-jacket binding.
3. Generate provider-exact interior bleed and cover/spine template from the provider spec tool; do not guess spine width.
4. Upload/proof physical book and verify one real copy.
5. Connect Blurb/RPI fulfillment credentials or approved storefront fulfillment handoff.
6. Activate Stripe product and create a Payment Link collecting email + shipping address.
7. Add the live product card to `public/coffee-restored.html` / canonical `coffeeandajoint.co` catalog.
8. Add the book to the Coffee & A Joint merchant twin / machine catalog with real checkout handoff.
9. Confirm order -> POD fulfillment -> shipping -> digital companion delivery end-to-end.
10. Only after that, merge/deploy.

## Domain rule
Do not "fix" one Coffee & A Joint hostname in isolation. Current state includes historical `coffeeandajoint-corrected.vercel.app`, canonical `www.coffeeandajoint.co`, and an older affiliate path through `misfitmediahouse.com/coffee-restored`. Domain/DNS/forwarding cleanup is a separate reconciliation after the book product is proven.

## Commerce rule
The physical book contains stable Field Supply IDs, not raw Amazon Associates links. Current vendor/affiliate/substitute links live in `public/coffeeandjoint/field-supply-index.json` and the future companion page so monetization can change without making the printed book obsolete.
