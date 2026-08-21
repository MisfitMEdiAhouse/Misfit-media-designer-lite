export const fieldNotes = [
  {
    slug: 'shopify-store-health-check-before-buying-traffic',
    title: 'Shopify Store Health Check: 27 Things to Fix Before Buying Traffic',
    kicker: 'SHOPIFY · CONVERSION · OPERATIONS',
    description: 'A practical Shopify health-check framework covering storefront speed, merchandising, trust, checkout, tracking, retention, fulfillment, and agent readiness.',
    published: '2026-08-21',
    readTime: '9 min',
    audience: 'Store owners, operators, and growth teams',
    cta: { href: '/', label: 'Scan your store free' },
    sections: [
      {
        heading: 'Traffic does not fix a weak store',
        paragraphs: [
          'Paid traffic magnifies whatever is already true. If product pages are vague, mobile pages are slow, checkout trust is weak, or fulfillment is uncertain, spending more simply buys faster evidence of the leak.',
          'A useful store audit starts with the customer journey and ends with operations. The goal is not a prettier score. The goal is a shorter path from first visit to a delivered order and a second purchase.',
        ],
      },
      {
        heading: '1–6: storefront and mobile experience',
        bullets: [
          'The first screen makes the product, audience, and next action obvious.',
          'The primary product image is sharp, honest, and correctly cropped on a phone.',
          'Navigation is short enough to understand in one glance.',
          'Tap targets, sticky bars, and popups do not block the product or checkout.',
          'Core pages load without broken assets, layout jumps, or console errors.',
          'The store has one canonical domain and no confusing duplicate public versions.',
        ],
      },
      {
        heading: '7–12: product and offer clarity',
        bullets: [
          'Every product has a clear price, variants, material, fit, shipping promise, and return policy.',
          'Lifestyle images support the product instead of replacing proof of the actual item.',
          'Bundles and add-ons increase order value without making the choice harder.',
          'Inventory or made-to-order status is accurate.',
          'The buy button leads to a real checkout for the exact product shown.',
          'No mockup, product name, or price contradicts another section of the site.',
        ],
      },
      {
        heading: '13–18: trust and checkout',
        bullets: [
          'Contact, privacy, terms, shipping, and returns are easy to find.',
          'The checkout domain and payment descriptor match the brand customers saw.',
          'Taxes and shipping do not appear as a surprise at the final step.',
          'Order confirmation contains the purchased item, support route, and fulfillment expectation.',
          'Failed payments and abandoned checkouts enter a useful recovery flow.',
          'Analytics record product view, add-to-cart, checkout, purchase, and source attribution once—not twice.',
        ],
      },
      {
        heading: '19–23: fulfillment and retention',
        bullets: [
          'Every paid SKU maps to a real provider product and variant.',
          'A successful test order reaches production, tracking, and customer notification.',
          'Provider failures create an alert instead of silently accepting money.',
          'Post-purchase email asks for the next useful action: tracking, review, referral, or complementary product.',
          'Returns, replacements, and support ownership are documented before volume arrives.',
        ],
      },
      {
        heading: '24–27: search, feeds, and AI readiness',
        bullets: [
          'Titles, descriptions, structured product data, canonical tags, robots rules, and sitemap agree.',
          'Merchant feeds use the same price, availability, image, and destination URL as the storefront.',
          'Public product facts are readable without requiring a private dashboard or brittle client-only render.',
          'Automated agents are allowed to recommend, diagnose, and draft—but refunds, irreversible changes, and money movement remain governed.',
        ],
      },
      {
        heading: 'The order of operations',
        paragraphs: [
          'Fix purchase blockers first, then fulfillment, then measurement, then acquisition. Once the path survives a real mobile purchase and delivery test, traffic becomes fuel instead of tuition.',
          'Misfit’s public scanner reads storefront, response, DNS, crawl, trust, and agent-facing signals. Connected analytics and commerce data can deepen the diagnosis after the public scan establishes the baseline.',
        ],
      },
    ],
    sources: [
      { label: 'Google Core Web Vitals', href: 'https://web.dev/articles/vitals' },
      { label: 'Shopify storefront performance', href: 'https://help.shopify.com/en/manual/online-store/web-performance' },
      { label: 'Google product structured data', href: 'https://developers.google.com/search/docs/appearance/structured-data/product' },
    ],
  },
  {
    slug: 'print-on-demand-fulfillment-checklist',
    title: 'Print-on-Demand Fulfillment Checklist: Do Not Sell What You Cannot Ship',
    kicker: 'POD · COMMERCE · QUALITY CONTROL',
    description: 'A launch checklist for connecting a print-on-demand catalog to payments without broken variants, silent provider failures, or customer-service chaos.',
    published: '2026-08-21',
    readTime: '8 min',
    audience: 'POD brands, creators, and commerce operators',
    cta: { href: '/coffee-restored', label: 'See Coffee & a Joint' },
    sections: [
      {
        heading: 'The dangerous gap is after checkout',
        paragraphs: [
          'A beautiful product page and a successful card charge are not proof of commerce. The system is complete only when the correct SKU reaches the correct provider, the provider accepts it, tracking returns to the customer, and an exception becomes visible to an operator.',
          'That distinction matters most for small catalogs. Two hats, a patch, and a flag can become a clean, profitable system—but only if every variant has one source of truth.',
        ],
      },
      {
        heading: 'Catalog gate',
        bullets: [
          'Approve the physical sample before approving the lifestyle creative.',
          'Record provider, provider product ID, variant ID, color, size, cost, retail price, weight, and shipping region.',
          'Use the same product name and price in the storefront, checkout, receipt, analytics, and provider order.',
          'Keep discontinued or unmapped variants impossible to buy.',
        ],
      },
      {
        heading: 'Payment-to-production gate',
        bullets: [
          'Verify the payment webhook signature.',
          'Make order handling idempotent so retries cannot create duplicate fulfillment orders.',
          'Fail closed when a paid line item has no provider mapping.',
          'Store the provider response, status, and order ID against the commerce order.',
          'Alert a human when production is rejected, an address fails, or a provider is unavailable.',
        ],
      },
      {
        heading: 'Delivery gate',
        bullets: [
          'Run one end-to-end test order per product family and shipping region.',
          'Confirm packaging, color, embroidery or print placement, tracking latency, and actual delivery time.',
          'Make the customer-facing shipping promise slower than the provider’s best-case estimate.',
          'Define replacement and refund ownership before the first damaged package.',
        ],
      },
      {
        heading: 'Adding flags, decks, and wheels without wrecking trust',
        paragraphs: [
          'A print-on-demand flag is a realistic add-on because no-minimum fulfillment already exists. A skateboard deck can also be hands-off, but the quality gate is higher: construction, concave, pop, print method, and rider feedback matter. Custom wheels are usually a minimum-order manufacturing product, not a true one-off POD product.',
          'That means the honest sequence is flag sample, deck sample comparison, rider test, then catalog. Custom wheels wait until a tested production run is justified by orders. The brand can move fast without pretending every supplier category works the same way.',
        ],
      },
    ],
    sources: [
      { label: 'Printful all-over flag specifications', href: 'https://www.printful.com/custom/decor/flags-signs/all-over-print-flag' },
      { label: 'Prodigi print API', href: 'https://www.prodigi.com/print-api/docs/reference/' },
      { label: 'BoardPusher dropshipping', href: 'https://www.boardpusher.com/sell/' },
    ],
  },
  {
    slug: 'tire-size-gearing-rpm-speedometer-math',
    title: 'Tire Size, Gear Ratio, RPM & Speedometer Math for Real Overland Builds',
    kicker: 'ROAD LAB · FITMENT · OVERLAND',
    description: 'The practical math behind tire diameter, engine RPM, speedometer error, crawl ratio, and the limits of calculator-only fitment advice.',
    published: '2026-08-21',
    readTime: '8 min',
    audience: 'Truck owners, builders, and automotive shops',
    cta: { href: '/roads', label: 'Run the Road Lab' },
    sections: [
      {
        heading: 'A calculator should expose assumptions',
        paragraphs: [
          'Car people reject tools that turn uncertainty into fake precision. A useful build calculator shows the inputs, the formula, the result, and what still requires a tape measure or manufacturer data.',
          'Road Lab is built around that rule: calculate the relationship, then verify the vehicle-specific constraint before buying parts.',
        ],
      },
      {
        heading: 'Metric tire diameter',
        paragraphs: [
          'For a tire labeled 285/70R17, approximate sidewall height is 285 × 0.70 = 199.5 mm. Convert two sidewalls to inches and add the wheel: diameter ≈ 17 + (2 × 199.5 ÷ 25.4), or about 32.7 inches.',
          'That is nominal diameter. Mounted diameter changes with brand, tread, wheel width, pressure, load, and wear. Use the tire manufacturer’s published overall diameter or revolutions per mile for final gearing and calibration work.',
        ],
      },
      {
        heading: 'Highway RPM',
        paragraphs: [
          'A common approximation is RPM = mph × axle ratio × transmission ratio × transfer-case ratio × 336 ÷ tire diameter in inches. In direct drive, transmission and transfer ratios are 1.00. In overdrive, the transmission ratio is below 1.00.',
          'The result is a planning estimate. Converter slip, clutch slip, actual rolling radius, and driveline behavior can move the real number. A good tool therefore reports the math and keeps a visible verification note.',
        ],
      },
      {
        heading: 'Speedometer change',
        paragraphs: [
          'If the vehicle was calibrated for a 30-inch tire and now runs a 33-inch tire, actual speed is approximately indicated speed × 33 ÷ 30. An indicated 60 mph is roughly 66 mph before calibration.',
          'The same ratio affects odometer accumulation. Calibration methods vary by model, year, ECU, axle, and aftermarket controller, so the calculator should never claim universal programming support.',
        ],
      },
      {
        heading: 'Crawl ratio and the part the formula cannot answer',
        paragraphs: [
          'Overall crawl ratio multiplies first gear, transfer-case low range, and axle ratio. It helps compare driveline combinations, but it does not independently predict traction, heat, breakage, braking, or control. Engine torque curve, converter, vehicle mass, tire, surface, and driver input all matter.',
          'Clearance is even more physical. Suspension travel, steering sweep, wheel offset, backspacing, body mounts, bump stops, brake clearance, and loaded articulation must be measured. The right output is a decision aid and a punch list—not “guaranteed fit.”',
        ],
      },
    ],
    sources: [
      { label: 'Tire and Rim Association overview', href: 'https://www.us-tra.org/' },
      { label: 'NHTSA tire safety guidance', href: 'https://www.nhtsa.gov/vehicle-safety/tires' },
    ],
  },
  {
    slug: 'festival-merch-revenue-system',
    title: 'Festival Merch Is a Revenue System, Not a Folding Table',
    kicker: 'COFFEE & A JOINT · FESTIVALS · AFFILIATES',
    description: 'A proof-first playbook for festival merchandise, ambassador attribution, compliant audience building, fulfillment, and post-event revenue.',
    published: '2026-08-21',
    readTime: '7 min',
    audience: 'Merch brands, festival vendors, and ambassadors',
    cta: { href: '/caj-affiliate', label: 'Join the Black Flag Crew' },
    sections: [
      {
        heading: 'The event is the spark, not the whole sale',
        paragraphs: [
          'Festival traffic is concentrated attention. A booth can sell inventory, but the larger asset is a trackable path that keeps working after the last set: a short URL, QR code, creator link, product story, follow-up permission, and a fulfillment system that can handle the spike.',
          'Coffee & a Joint starts with a deliberately small catalog. That makes the choice fast and the creative memorable. It also makes fulfillment, unit economics, attribution, and quality easier to prove before expanding.',
        ],
      },
      {
        heading: 'Build the loop before driving traffic',
        bullets: [
          'Approve samples and complete a live delivery test.',
          'Give each ambassador and event a unique first-party referral code.',
          'Record click, checkout, paid order, refund, and commission in one ledger.',
          'Use consent-based email or SMS capture; never buy a mystery attendee list.',
          'State age, venue, shipping, and content restrictions wherever they apply.',
          'Give partners approved assets and product facts without forcing scripted lifestyle copy.',
        ],
      },
      {
        heading: 'Increase order value without diluting the brand',
        paragraphs: [
          'The best add-on is recognizable, easy to explain, and operationally compatible. A Misfit skull-and-rose flag fits the visual world and can be produced on demand. A quality Canadian-maple deck can become a higher-ticket product after sample and rider testing. Custom wheels require a different manufacturing and quality process, so they should not be slipped into the catalog as if they were another patch.',
          'Bundles should feel inevitable: hat plus patch, hat plus flag, or a limited deck plus flag. Discounting is optional; coherence is not.',
        ],
      },
      {
        heading: 'Earned attention beats scraped attention',
        paragraphs: [
          'Useful third-party coverage begins with something an editor, shop, promoter, or creator can verify: a tight product, a distinct visual system, a working referral route, real fulfillment, and original photography. The pitch is the proof, not a claim that the brand is already everywhere.',
          'That same rule applies to outreach. Public business contacts and opt-in partner programs are legitimate acquisition channels. Purchased personal-email dumps and scraped attendee lists create deliverability, privacy, and reputation risk before they create a customer.',
        ],
      },
    ],
    sources: [
      { label: 'FTC endorsement guides', href: 'https://www.ftc.gov/business-guidance/advertising-marketing/endorsements-influencers-reviews' },
      { label: 'CAN-SPAM compliance guide', href: 'https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business' },
    ],
  },
  {
    slug: 'sema-lead-follow-up-for-automotive-businesses',
    title: 'The SEMA Follow-Up Problem: Turn Product Attention Into Booked Work',
    kicker: 'SEMA · AUTOMOTIVE · B2B REVENUE',
    description: 'A practical post-show system for automotive manufacturers, fabricators, installers, dealers, and overland brands that need qualified follow-up instead of another spreadsheet.',
    published: '2026-08-21',
    readTime: '7 min',
    audience: 'Automotive brands, shops, dealers, and exhibitors',
    cta: { href: '/operator?company=SEMA%20operator&site=semashow.com&challenge=Turn%20show%20attention%20into%20qualified%20follow-up%20and%20booked%20revenue&track=growth', label: 'Bring Misfit a live challenge' },
    sections: [
      {
        heading: 'A badge scan is not a sales system',
        paragraphs: [
          'Shows create dense conversations across dealers, installers, media, distributors, fleet buyers, builders, and consumers. The loss happens afterward: names land in a sheet, context disappears, every lead receives the same message, and the hottest opportunity cools while the team catches up.',
          'The fix is not more automated email. It is structured context, fast routing, and a useful next step matched to why the person stopped at the booth.',
        ],
      },
      {
        heading: 'Capture the reason, not just the address',
        bullets: [
          'Segment dealer, installer, distributor, media, fleet, builder, and consumer interest.',
          'Record product family, vehicle, timing, geography, budget signal, and promised follow-up.',
          'Attach notes, photos, fitment questions, and the staff owner while the conversation is fresh.',
          'Use permissioned contact data from the conversation or official program—not scraped attendee data.',
        ],
      },
      {
        heading: 'Give each segment a working tool',
        paragraphs: [
          'A dealer may need margin, territory, inventory, and onboarding. An installer needs fitment, labor, availability, and technical support. A builder wants configuration, media, or collaboration. A consumer may need a calculator, comparison, or local dealer. Sending all four to the same brochure page wastes the signal.',
          'Misfit’s Road Lab demonstrates the pattern: useful vehicle math and build planning create a reason to engage, while the operator route turns a business problem into a scoped conversation. The same infrastructure can power dealer intake, product qualification, quote routing, and reactivation.',
        ],
      },
      {
        heading: 'The seven-day post-show rail',
        bullets: [
          'Day 0: confirmation with the exact product or promise discussed.',
          'Day 1: route high-intent commercial leads to a human owner.',
          'Day 2–3: deliver the useful calculator, fitment worksheet, dealer pack, or booking path.',
          'Day 4–5: surface unanswered technical and commercial blockers.',
          'Day 7: report response, meetings, quotes, pipeline, and next action by segment.',
        ],
      },
      {
        heading: 'What makes the system credible',
        paragraphs: [
          'The proof is a live workflow using the company’s products and actual handoff rules. Public tools can qualify interest; private systems can hold sensitive commercial context; governed actions can keep contracts, pricing changes, exports, and money movement behind human approval. That is more valuable than a generic “AI follow-up” promise because the operating boundary is visible.',
        ],
      },
    ],
    sources: [
      { label: 'SEMA Show official site', href: 'https://www.semashow.com/' },
      { label: 'FTC CAN-SPAM compliance guide', href: 'https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business' },
    ],
  },
];

export function findFieldNote(slug) {
  return fieldNotes.find((note) => note.slug === slug);
}
