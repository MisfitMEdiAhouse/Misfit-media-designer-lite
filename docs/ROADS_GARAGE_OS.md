# Roads Garage OS — Roads Co. × Misfit Mediahouse

## Purpose

Roads Garage OS is a vehicle-specific automotive commerce and intelligence surface conceived and engineered by Misfit Mediahouse for a co-branded Roads Co. experience.

The operating split is deliberate:

- **Roads Co.** — automotive culture, community, merchandising and consumer-facing brand.
- **Misfit Mediahouse** — systems architecture, software, vehicle intelligence, attribution, analytics, commerce plumbing and automation.

This repository history is a dated engineering record of the product architecture. It is not a substitute for formal IP registration, partnership agreements, dealer agreements, affiliate agreements or legal advice.

## Product modules

### 1. Tool DNA

Vehicle-specific field service kit generation:

- year / make / model / trim / engine / drivetrain
- verified fastener-to-tool mapping
- common failure mode mapping
- spare-parts and consumables manifest
- Roadside / Overland / Field Service / Master kit tiers
- duplicate-tool and carried-weight optimization
- custom kitting / fulfillment pathway

Snap-on is modeled as a prospective custom-kitting vendor. No commission is considered earned without a signed commercial relationship or reconciled order data supporting it.

### 2. Wheel Lab

Vehicle image + fitment + wheel/tire commerce surface:

- vehicle photo intake
- wheel family / size / tire intent
- fitment data
- AI visualization pipeline
- saved visualizer job
- partner/dealer clickout
- order reconciliation

fifteen52 is modeled as the current wheel-path candidate because Roads Co. public content shows fifteen52 wheel collaboration. Dealer / wholesale / commission terms for Misfit remain pending unless separately executed.

### 3. Power Command

Vehicle-specific overland electrical architecture:

- solar
- alternator / DC-DC charging
- battery bank
- inverter
- refrigeration
- lighting
- fused distribution
- charging loads
- affiliate-ready bill of materials

### 4. Comms Command

Vehicle-specific communications architecture:

- satellite
- GMRS / amateur / appropriate radio categories
- antenna placement
- navigation redundancy
- emergency signaling
- power redundancy
- installation guides

### 5. Tuner Lab

Vehicle history and telemetry product:

- OBD / CAN telemetry
- diagnostic trouble code history
- engine hours
- temperature / pressure / boost / AFR when supported
- dyno session records
- tune version history
- maintenance and hardware change logs

Tuner Lab is intended for lawful telemetry, diagnostics, documented calibration history and sanctioned performance work. It is not designed around emissions defeat or unsafe road use.

### 6. Roads Supply

Roads Co. merchandise inside the same measurable customer journey.

## Attribution doctrine

Every measurable event should preserve as many of these dimensions as are available:

1. Anonymous session ID
2. First-touch source / medium / campaign / referrer / landing page
3. Last-touch source / medium / campaign / referrer / landing page
4. Creator, QR, referral or campaign token
5. Vehicle profile
6. Module
7. Partner
8. Offer
9. Product / SKU
10. Outbound destination
11. Click ID
12. Conversion / order ID
13. Gross revenue
14. Net revenue when available
15. Final-touch source
16. Commission rule
17. Commission status

The Roads schema also mirrors public journey events into Misfit Cloud's canonical `public.attribution_events` stream so Roads activity remains visible to the broader Misfit control plane.

## Commission doctrine

Attribution is not the same thing as money owed.

Commission ledger statuses should be treated as:

- `uncontracted` — revenue opportunity can be modeled, but no commission is represented as earned.
- `confirmed` — a valid commercial rule and conversion support the earning.
- `payable` — partner settlement terms make the earning due.
- `paid` — funds have been received / reconciled.
- `void` — conversion was canceled, returned, rejected or otherwise invalidated.

This keeps Misfit's contribution measurable without inventing contractual rights that do not yet exist.

## Current backend

Supabase project: Misfit Cloud.

Dedicated schema: `roads`

Core tables:

- `roads.partners`
- `roads.attribution_sessions`
- `roads.attribution_events`
- `roads.vehicle_profiles`
- `roads.toolkit_builds`
- `roads.visualizer_jobs`
- `roads.offer_catalog`
- `roads.conversions`
- `roads.commission_ledger`

Public event ingestion runs through the `roads-commerce-capture` Edge Function. Browser clients do not receive direct table permissions.

## Commercial partner state at V1

| Partner | Role | V1 status |
| --- | --- | --- |
| Misfit Mediahouse | Systems / software / intelligence / attribution | Owned system layer |
| Roads Co. | Consumer automotive brand | Collaboration planned / relationship to formalize |
| fifteen52 | Wheel candidate / existing Roads-visible collaborator | Dealer / commercial terms pending |
| Snap-on | Custom tool kitting candidate | Outreach / commercial terms pending |

## Funnel

`content / creator / QR / SEO → vehicle profile → module → configured build → partner / product → clickout → quote / cart → order → conversion reconciliation → commission ledger`

The free calculators and visualizers are acquisition surfaces. The vehicle profile is the durable commerce key.

## Build sequence

1. Ship co-branded Roads Garage OS landing surface and attribution.
2. Collect real vehicle + module demand.
3. Build the verified vehicle service-data layer for Tool DNA.
4. Connect a real wheel fitment catalog and AI image-render pipeline.
5. Add partner-specific commerce links only when terms are known.
6. Add order/webhook reconciliation for Roads, wheel partners and tool fulfillment.
7. Add affiliate catalogs for overland power/comms where commercial programs exist.
8. Build telemetry ingestion and owner garage histories.
9. Turn high-intent vehicle profiles into fabrication, parts and service offers.

## Non-negotiables

- No fake fitment.
- No fake tool sizes.
- No fake partner agreements.
- No fake commissions.
- Preserve Misfit attribution across every measurable path.
- Keep Roads Co. consumer-facing and Misfit Mediahouse visible as the systems / technology layer.
