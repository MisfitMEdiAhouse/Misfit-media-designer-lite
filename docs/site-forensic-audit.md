# Misfit Mediahouse — Forensic Site / Product / Offer Audit

Status: IN PROGRESS. Final pass occurs after Misfit AI V2 is fully migrated off Base44 and running on the Misfit-owned stack.

## Canonical commercial architecture

### Brand / storefront
- Misfit Mediahouse = company, storefront, portfolio, services, checkout entry point.

### Flagship product
- Misfit AI V2 = the canonical AI lead / revenue operations product.
- Capabilities that are part of Misfit AI V2 must not be sold as separate standalone software products merely because they were previously exposed as separate pages, flows, engines, or offers.
- `ai.misfitmediahouse.com` = application entry point after migration.
- `chat.misfitmediahouse.com` = chat / Twin-facing entry point if still required after migration.

### Services
These may wrap or deploy Misfit AI V2 but must be presented as services, not competing software products:
- Website + AI Launch
- Managed Growth / implementation / operations
- Custom build / consulting work

### Portfolio / proof
- Misfit AI V2 should appear as both a commercial product and portfolio proof.
- Client builds and separate systems belong in portfolio/case-study presentation.
- ContextForge and other systems must be classified based on their actual product readiness and commercial intent, not simply because a deployed page exists.
- GHOSBC OS — Agent Brain Hub is a private upstream cognitive/governance kernel. It is not a public product, checkout offer, public MCP product, or public portfolio item.

## Current duplication findings

1. Homepage brand positioning says Misfit builds "AI revenue systems" focused on follow-up, revival, booking, attribution.
2. The offer rail also sells "Misfit AI V2 — AI Lead Engine" for the same core outcome.
3. The homepage has a separate "Revenue AI" navigation/section that describes the same capability set at a higher level.
4. "Website + AI Launch" includes AI lead capture/follow-up, which overlaps Misfit AI V2. It should be a deployment/service package around the product, not a sibling software product.
5. "Managed Growth" is an operations service and should be clearly separated from software/product pricing.

## Remediation checkpoint — 2026-08-16

- Removed GHOSBC Safety Gate from the public AI product catalog and public portfolio catalog.
- Reclassified GHOSBC OS — Agent Brain Hub as a private cognitive/governance kernel in the public-safe agent stack manifest.
- Rewrote public machine-readable `llms.txt` and `agents.md` so Misfit-branded public contracts remain discoverable while GHOSBC itself is not advertised as a separate product or public MCP product.
- Deactivated the Stripe payment link that sold GHOSBC Safety Gate checks; the link now states that the private internal capability is not a public product.
- Production deployment containing these public-surface changes is READY.
- No GHOSBC source material was added to public surfaces during this remediation.

## Remediation checkpoint — 2026-08-20

- Replaced the public homepage information stack with one above-fold Shopify store + business health scanner.
- Reduced public navigation to Scanner, Agency, Portfolio and Products. Owner, heir, agent-control and admin routes are not advertised in public navigation or the footer.
- Added distinct Agency and Products pages so services, software and proof no longer compete on the homepage.
- Rebuilt the public portfolio as 11 canonical live assets. Coffee & A Joint and Iron Network are included; source repos, Base44 copies, Vercel revisions and owner-only systems are not repeated as separate cards.
- Marked nine older Weber Junk Rescue deployments as superseded by the canonical v9 deployment in the owner registry.
- Imported all discovered Base44 apps into the owner-only registry as migration sources or archives and linked obvious legacy copies to their canonical assets.
- Corrected the Business Scrub lead handoff from a nonexistent local `/api/lead` route to the live rate-limited `lead-capture` Edge Function.
- Removed private Heir recovery document URLs from the public source bundle; authenticated users receive them from owner-only registry metadata after authorization.
- Updated robots, sitemap, redirects and metadata to reinforce the new public/private boundary and scanner-first search position.
- The `ai.misfitmediahouse.com` Base44 path is still not the canonical public Misfit AI V2 link; public portfolio copy points to the verified Vercel deployment until DNS cutover is complete.
- The active $297 Stripe checkout is named `Misfit AI Intake + Membership Engine`; public checkout copy now uses that exact SKU name instead of calling it a generic lead-engine subscription.

## Current route verification

Verified at infrastructure level on 2026-08-13:
- `/` -> HTTP 200
- `/proof` -> HTTP 200
- `/enterprise-ai` -> HTTP 200
- `/creator-commerce` -> HTTP 200
- `/misfit-ai-v2` -> HTTP 200
- `/command` -> redirects to Misfit Cloud login

HTTP 200 does not mean the UX, client-side button target, third-party checkout, or linked external application is correct. Each CTA still requires click-path verification.

## Required final forensic review

After Misfit AI V2 migration is functionally complete:

1. Inventory every public page, nav item, CTA, button, form, checkout link, redirect, and external link.
2. Click-test every path on mobile and desktop.
3. Record response / destination / expected outcome.
4. Remove or redirect dead and duplicate routes.
5. Classify every offer as one of: Product, Service, Portfolio Proof, Internal Tool.
6. Collapse Misfit AI V2-derived fragments into the canonical Misfit AI V2 product.
7. Audit Stripe checkout links against the final product/service catalog.
8. Audit product names, prices, descriptions and promises for consistency.
9. Audit portfolio links and remove stale Base44 URLs.
10. Audit `ai.` and `chat.` entry points after DNS cutover.
11. Audit auth/login/signup/onboarding paths.
12. Audit lead capture, demo request, email, booking and checkout conversion paths.
13. Audit mobile navigation and all responsive CTAs.
14. Run final Base44 dependency scan across source, runtime, DNS, assets and links.
15. Only after all above pass: mark public site commercially clean and Base44 exit complete.

## Release rule

Do not call the public site commercially finished until the final forensic review passes. Do not create additional standalone offers from Misfit AI V2 feature fragments unless there is a deliberate packaging decision.
