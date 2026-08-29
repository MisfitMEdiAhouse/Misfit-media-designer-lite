# Misfit Responsive UI Operations Standard

**Status:** Canonical operating standard  
**Scope:** `misfitmediahouse.com` and Misfit-owned public/product/admin web surfaces  
**Purpose:** Prevent page-by-page UI drift, clipped content, desktop artifacts inside mobile layouts, unreachable controls, inconsistent status language, and regressions caused by one-off fixes.

## 1. Core law

A page is not complete because it renders at one viewport.

Every shipped surface must preserve the same information hierarchy, controls, evidence boundaries, and product truth across supported viewports. Mobile and desktop may use different composition, but they may not expose different product claims or hide required actions.

**No horizontal page scroll is allowed unless the component is explicitly a horizontal data surface such as a table, timeline, code viewer, or intentional carousel.** Hiding overflow is not considered a fix for a broken layout.

## 2. Canonical viewport rails

Minimum release checks:

| Class | Widths to check | Required behavior |
| --- | --- | --- |
| Small mobile | 320 / 360 CSS px | Single-column content, no clipped text, no off-screen controls |
| Standard mobile | 390 / 430 CSS px | Same information hierarchy, comfortable gutters and tap targets |
| Tablet | 768 CSS px | Breakpoints transition without overlap or orphaned controls |
| Small desktop | 1024 CSS px | Multi-column layouts remain readable and bounded |
| Desktop | 1280 / 1440 CSS px | Intended max-width rails, no stretched long-form content |

Device-specific smoke checks should include Android Chrome/WebView and iOS Safari when the route is customer-facing or revenue-critical.

## 3. Layout rails

1. Main page content must be bounded by a centered max-width rail with responsive horizontal gutters.
2. Grid and flex children must be allowed to shrink (`min-width: 0`).
3. Cards must never inherit the min-content width of a URL, code token, or long unbroken identifier.
4. Fixed pixel widths are allowed only when protected behind a breakpoint and proven not to leak into narrower layouts.
5. No desktop screenshot or desktop-layout image may be used as a substitute for a real mobile layout.
6. `overflow-x: hidden` / `clip` may protect the root viewport, but it must not be used to conceal a known off-screen card or control.
7. Intentional horizontal data surfaces must have their own scroll container, edge affordance, and label.

Canonical CSS primitives:

- `.misfit-page-rail`
- `.misfit-card-rail`
- `.misfit-url-rail`
- `.misfit-wrap-anywhere`
- `.misfit-action-rail`

## 4. Long text, URLs, IDs and machine surfaces

Machine-facing pages are especially vulnerable to min-content overflow.

- Long URLs/IDs must wrap on mobile or truncate deliberately inside a bounded card.
- Full values must remain accessible through the link target, copy action, title/tooltip, expanded view, or wrapped mobile presentation.
- Never allow an API/MCP/A2A endpoint to size its parent card wider than the viewport.
- Code blocks must scroll internally rather than forcing the whole page to scroll horizontally.
- Labels and status pills must wrap rather than disappear off-screen.

## 5. Controls and tap targets

- Primary mobile actions stack when necessary rather than compressing into unreadable rows.
- Customer-facing and navigation tap targets should be approximately 44x44 CSS px or larger.
- Icon-only controls require accessible labels.
- Fixed headers/menus must keep content reachable with `100svh`-aware scrolling.
- The mobile menu must never cover an action with no way to scroll to it.

## 6. Typography

- Headings may scale by breakpoint but must never be cropped.
- Body text must remain readable without pinch zoom.
- Long technical prose must use bounded line length on desktop.
- Monospace text does not get special permission to overflow.
- All-caps tracking must be reduced on narrow screens if it creates width pressure.

## 7. Media

- Images, SVG, video and canvas must remain within the content rail by default.
- `object-cover` is used only when cropping is intentional; evidence screenshots and instructional content must not lose important edges.
- Mobile may use a different crop/source when needed, but not a screenshot of desktop UI as the mobile experience.
- Media loading must not push required controls outside the viewport.

## 8. Product truth and maturity rail

Public surfaces use the canonical maturity taxonomy:

- `LIVE`
- `BETA`
- `PROOF`
- `BUILDING`
- `RESEARCH`
- `CONCEPT`
- `PRIVATE`

The same asset must not be labeled differently on Portfolio, Products, Explorer, Frontier or a technical demo without an explicit documented reason. Payment rails, real-money execution, external validation and production-readiness claims must match canonical backend evidence.

## 9. Navigation and route consistency

Every public route must have:

- clear path back into the Misfit navigation system;
- no broken or hidden primary CTA;
- route-aware title/metadata where supported;
- consistent header spacing so fixed navigation does not cover the first content block;
- a deliberate mobile composition rather than a squeezed desktop composition.

Private routes must preserve their noindex/private cache rules.

## 10. Release gate

Before a UI-changing commit is considered production-ready:

1. Build passes.
2. Responsive rail audit passes.
3. Target route returns HTTP 200.
4. No new runtime-error cluster appears after deploy.
5. Mobile check confirms no document-level horizontal overflow.
6. Desktop check confirms max-width and multi-column composition.
7. Primary actions are visible/reachable at mobile and desktop widths.
8. Long URLs/IDs/code stay inside their component rail.
9. Status/maturity copy matches canonical backend state.
10. High-value protected routes (Stan/Egnyte, Founder Command, owner/admin surfaces) receive a regression smoke after shared CSS/navigation changes.

## 11. Incident rule

Any screenshot showing clipped content, mixed desktop/mobile composition, hidden actions, overlapping navigation, unintended horizontal scroll or inconsistent product state is treated as an **operations defect**, not cosmetic feedback.

The repair sequence is:

**capture evidence → identify shared cause → repair the narrow component → harden the shared rail if safe → deploy → mobile/desktop smoke → record canonical state**.

If the defect reveals a reusable failure pattern, update this standard and the build audit rather than fixing only one route.

## 12. Change discipline

- Shared CSS changes must be conservative and regression-smoked on protected/high-value routes.
- Do not destabilize a known-good customer/partner experience to cosmetically normalize unrelated pages.
- Route-specific exceptions are allowed only when documented in code or this standard.
- No protected GHOSBC kernel material belongs in UI standards or public-facing components.

---

**Operational owner:** Misfit Mediahouse  
**System of record:** Misfit Cloud / `owner_asset_registry`  
**Enforcement:** shared CSS rails + build-time source audit + production smoke checks + reliability jobs for unresolved defects.
