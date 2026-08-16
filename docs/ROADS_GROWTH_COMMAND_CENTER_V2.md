# Roads Growth Command Center V2 — Roads Co. × Misfit Mediahouse

## Canonical role split

- **Roads Co.** is the consumer automotive brand, culture, community, merchandise and experience layer.
- **Misfit Mediahouse** is the systems, software, intelligence, attribution, automation and measurable commercial layer.
- **Roads Growth Command Center** is the private operator/back-office surface.
- **Roads Garage OS** is the public vehicle-commerce acquisition surface and a bridge into the private operator system.

Private Roads back office currently lives at:

`https://roads-growth-command-center.pricemedia82.chatgpt.site/`

The authenticated `chatgpt.site` source is not currently present in the connected GitHub/Base44 workspaces. This V2 therefore extends the shared backend and public Roads commerce surface without pretending to modify inaccessible private source code.

## Source provenance

The Growth Command backend is grounded in the connected `RoadsCo.topsecret` Google Drive folder. Misfit Cloud stores source registry records for the following architecture documents:

1. `roads ai growth engine.txt` — Google Drive file `1mTzfj_fMDsxYufOhwSr-CY176DARLgpX`
   - Garage profiles
   - style/customer segments
   - content → commerce
   - personalized drops
   - lifecycle automation
   - owner dashboard

2. `partners/ambassadors.txt` — Google Drive file `1VcCI8fo9W8w8x6HjwuR0m8LgL9nCYnEo`
   - sponsors
   - affiliates
   - ambassadors
   - partner programs and agreements
   - click attribution
   - conversions and payouts
   - events and partner communications

3. `back channels.txt` — Google Drive file `1na4I0SjyieH1_t5eF3Qb9wj5-2sn4ZfP`
   - suppliers
   - sourcing
   - fulfillment channels
   - routing rules
   - purchase orders
   - fulfillment jobs
   - margin-aware routing

4. `roads ai growth engine.txt` — Google Drive file `15VX9mFVTxVuE0E13s82lqpztOSxXwpb-`
   - Roads XP Engine
   - Roads Creator Engine
   - Roads Signal Engine

These are recorded in `roads.source_registry`; `roads.engine_modules` points each engine layer back to its source record.

## Backend

Supabase project: `cibcxqrqiqvzpardbdrw` (`Misfit Cloud`)

Schema: `roads`

### Existing commerce / attribution spine

- `roads.partners`
- `roads.attribution_sessions`
- `roads.attribution_events`
- `roads.vehicle_profiles`
- `roads.toolkit_builds`
- `roads.visualizer_jobs`
- `roads.offer_catalog`
- `roads.conversions`
- `roads.commission_ledger`
- `roads.commission_summary`

### Growth / community layers

- `roads.members`
- `roads.garage_cars`
- `roads.segments`
- `roads.member_segments`
- `roads.xp_levels`
- `roads.xp_members`
- `roads.xp_event_types`
- `roads.xp_events`
- `roads.quests`
- `roads.quest_progress`
- `roads.creators`
- `roads.content_submissions`
- `roads.usage_licenses`
- `roads.collab_drops`

### Alliance / commercial layers

- `roads.partner_programs`
- `roads.partner_agreements`
- `roads.affiliate_profiles`
- `roads.affiliate_links`
- `roads.payouts`
- `roads.events`
- `roads.event_partners`
- `roads.communication_threads`

### Supply / fulfillment layers

- `roads.suppliers`
- `roads.supplier_catalog_items`
- `roads.fulfillment_channels`
- `roads.fulfillment_channel_suppliers`
- `roads.routing_rules`
- `roads.purchase_orders`
- `roads.fulfillment_jobs`

### Signal / operator layers

- `roads.metric_snapshots`
- `roads.segment_performance`
- `roads.insights`
- `roads.operator_handoffs`

### Vehicle intelligence / commerce layers

- `roads.vehicle_service_facts`
- `roads.spare_part_recommendations`
- `roads.overland_guides`
- `roads.overland_guide_items`
- `roads.telemetry_snapshots`
- `roads.dyno_runs`
- `roads.tune_versions`
- `roads.maintenance_events`

## Edge Functions

### `roads-commerce-capture`

Public attribution ingestion with an origin allowlist. Records:

- first / last source
- medium / campaign
- referrer / landing page
- creator token
- referral token
- QR token
- vehicle context
- module
- partner
- offer
- SKU
- outbound URL
- click ID
- revenue when supplied

Roads touches are mirrored into Misfit Cloud's canonical `public.attribution_events` stream.

### `roads-intake`

Public controlled-write facade backed by the service role. Supported actions:

- `save_vehicle_profile`
- `build_toolkit_profile`
- `create_visualizer_job`
- `save_overland_interest`
- `save_member_profile`

The browser never receives direct write permission to private Roads tables.

## Public surface

Route: `/roads`

V2 includes:

- direct link to the authenticated private Roads Growth Command Center
- Roads + Misfit role clarity
- Growth / Alliance / Supply / XP / Creator / Signal engine map
- persistent vehicle profile creation
- Tool DNA build persistence
- Wheel Lab visualizer job persistence
- Power Command guide intake
- Comms Command guide intake
- Tuner Lab backend state
- Roads merchandise clickout tracking
- creator / referral / QR attribution preservation

## Commercial truth

Attribution is not the same as a contractual right to revenue.

Partner states remain explicit:

- Roads Co. — collaboration / operating relationship to formalize as needed
- fifteen52 — Roads-visible relationship; Misfit dealer/commission terms pending
- Snap-on — custom-kitting capability identified; Misfit commercial terms pending
- Misfit Mediahouse — owned system / technology / attribution layer

Commission ledger states remain:

- `uncontracted`
- `confirmed`
- `payable`
- `paid`
- `void`

No system should convert `uncontracted` modeled opportunity into earned revenue without a real commercial rule and reconciled conversion.

## Tool DNA verification doctrine

Tool DNA must never invent socket sizes, torque specs, part numbers or special-tool requirements.

Vehicle service facts carry:

- source name / URL / locator
- verification state
- fastener description
- tool type and size
- drive size
- thread spec
- torque spec
- special tool
- system / component / operation

Customer toolkit builds may be created before the knowledge graph is complete, but generated manifests remain incomplete until the relevant service facts are verified.

## Wheel Lab doctrine

Vehicle and wheel/tire intent can be persisted now. A photoreal image result must not be represented as generated until a real image-render pipeline is connected.

## Next execution sequence

1. Merge and deploy this V2 public bridge.
2. Populate verified service facts for the 1997 K1500 / L31 pilot vehicle.
3. Add public VIN decoding and exact RPO / drivetrain resolution.
4. Connect a real vehicle-image upload store and image generation pipeline.
5. Reconcile a real fifteen52 catalog / fitment source after commercial authorization.
6. Pursue Snap-on custom-kitting/dealer terms using measured Tool DNA demand.
7. Connect Roads Shopify product/order webhooks into conversions and fulfillment.
8. Add Power + Comms affiliate catalogs only where real commercial programs exist.
9. Add an authenticated operator summary API for the private Roads back office.
10. Bridge the private `chatgpt.site` source directly when its project/source becomes accessible.
