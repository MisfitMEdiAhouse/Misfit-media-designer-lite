import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const H = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type,x-agent-platform,x-attribution-source,x-attribution-medium,x-attribution-campaign",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Cache-Control": "no-store",
};

const BASE = "https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/coffee-joint-machine-twin";
const STORE = "https://www.coffeeandajoint.co/";

const PRODUCTS = [
  {
    id: "coffeeandjoint_classic_herb_hat_003",
    handle: "classic-herb-marijuana-trucker-hat",
    sku: "CAJ-CLASSIC-HERB-003",
    title: "Classic Herb Marijuana Trucker Hat",
    description: "Black structured high-profile flat-brim mesh snapback with the full Classic Herb Marijuana embroidered patch. Made to order by Printful; U.S. shipping is included in the current $65 checkout.",
    price: { amount: 6500, currency: "USD" },
    availability: { available: true, made_to_order: true },
    fulfillment: { provider: "Printful", owner_manual_fulfillment: false, shipping_countries: ["US"] },
    canonical_store: `${STORE}#classic-herb`,
    checkout_handoff: "https://buy.stripe.com/3cI6oHfn42Ue4ym2B28ww0t",
    tags: ["trucker hat", "marijuana hat", "classic herb", "embroidered patch hat", "coffeeandjoint", "made to order"],
    safety: { controlled_substance: false, physical_merchandise: true, age_restriction_claimed: false },
  },
  {
    id: "coffeeandjoint_classic_herb_patch",
    handle: "classic-herb-embroidered-patch",
    sku: "CAJ-CLASSIC-HERB-PATCH",
    title: "Classic Herb Embroidered Patch",
    description: "Standalone red, white, green, black, and tan Classic Herb Marijuana embroidered patch. Patch only; hat and apparel are not included. Made to order by Printful for the current $15 checkout.",
    price: { amount: 1500, currency: "USD" },
    availability: { available: true, made_to_order: true },
    fulfillment: { provider: "Printful", owner_manual_fulfillment: false, shipping_countries: ["US"] },
    canonical_store: `${STORE}#classic-herb-patch`,
    checkout_handoff: "https://buy.stripe.com/28E8wPcaS9iCd4S7Vm8ww0u",
    tags: ["embroidered patch", "marijuana patch", "classic herb", "coffeeandjoint", "made to order"],
    safety: { controlled_substance: false, physical_merchandise: true, age_restriction_claimed: false },
  },
  {
    id: "coffeeandjoint_drugs_hat_001",
    handle: "drugs-trucker-hat",
    sku: "CAJ-DRUGS-001",
    title: "DRUGS Black Foam Trucker Hat",
    description: "Black foam-front mesh trucker hat with distressed bone-white DRUGS artwork. Made to order and fulfilled by Printify; U.S. shipping is included in the current $45 checkout.",
    price: { amount: 4500, currency: "USD" },
    availability: { available: true, made_to_order: true },
    fulfillment: { provider: "Printify", owner_manual_fulfillment: false, shipping_countries: ["US"] },
    canonical_store: `${STORE}#drugs-hat`,
    checkout_handoff: "https://buy.stripe.com/6oU7sLb6O7au5Cqb7y8ww0k",
    tags: ["trucker hat", "black foam hat", "counterculture apparel", "coffeeandjoint", "drugs hat", "made to order"],
    safety: { controlled_substance: false, physical_merchandise: true, age_restriction_claimed: false },
  },
  {
    id: "coffeeandjoint_surplus_crate_002",
    handle: "limited-military-surplus-crate",
    sku: "CAJ-CRATE-002",
    title: "Make Love Not War — Limited .50-Cal Military Surplus Crate",
    description: "One authentic empty .50-cal military-surplus wooden crate from limited vintage supply. Seller identifies the crates as WWII-era. Flowers, dirt or soil, ammunition, liner, finish, and styling props are not included.",
    price: { amount: 49500, currency: "USD" },
    availability: { available: true, made_to_order: false, limited_supply: true },
    fulfillment: { provider: "CoffeeAndJoint owner", owner_manual_fulfillment: true, shipping_countries: ["US"] },
    canonical_store: `${STORE}#crate`,
    checkout_handoff: "https://buy.stripe.com/7sYeVdcaS1Qa1ma6Ri8ww0v",
    tags: ["military surplus", "wooden crate", "empty crate", "vintage crate", "coffeeandjoint", "limited supply"],
    safety: { controlled_substance: false, ammunition_included: false, physical_merchandise: true, age_restriction_claimed: false },
  },
  {
    id: "coffeeandjoint_drugs_hat_crate_bundle",
    handle: "drugs-hat-empty-crate-bundle",
    sku: "CAJ-BUNDLE-001-002",
    title: "The Full Bad Idea — DRUGS Hat + Empty Surplus Crate",
    description: "One $45 DRUGS trucker hat plus one $495 empty limited-supply military-surplus crate with a $10 bundle reduction. Total $530. Items use separate fulfillment rails and may arrive separately.",
    price: { amount: 53000, currency: "USD", bundle_savings_amount: 1000 },
    availability: { available: true, made_to_order: false, limited_supply: true },
    fulfillment: { provider: "Split: Printify + CoffeeAndJoint owner", owner_manual_fulfillment: true, shipping_countries: ["US"], separate_shipments: true },
    canonical_store: `${STORE}#catalog`,
    checkout_handoff: "https://buy.stripe.com/00w4gzcaS8ey9SGcbC8ww0w",
    tags: ["bundle", "drugs hat", "empty crate", "coffeeandjoint", "save ten dollars"],
    safety: { controlled_substance: false, ammunition_included: false, physical_merchandise: true, age_restriction_claimed: false },
  },
] as const;

function db() {
  const url = Deno.env.get("SUPABASE_URL") || "";
  const secretSet = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}");
  const key = secretSet.default || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!url || !key) throw new Error("server_not_configured");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...H, "Content-Type": "application/json" } });
}

function attribution(req: Request) {
  return {
    source: (req.headers.get("x-attribution-source") || "").slice(0, 200),
    medium: (req.headers.get("x-attribution-medium") || "").slice(0, 200),
    campaign: (req.headers.get("x-attribution-campaign") || "").slice(0, 200),
  };
}

async function log(req: Request, operation: string, ids: string[]) {
  try {
    const client = db();
    const platform = (req.headers.get("x-agent-platform") || "unknown").slice(0, 300);
    await client.from("machine_discovery_events").insert({
      channel: "merchant_twin",
      platform_profile: platform,
      operation,
      matched_product_ids: ids,
      attribution: attribution(req),
    });
  } catch (error) {
    console.error("merchant_twin_log", error);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: H });
  const url = new URL(req.url);
  const sub = (url.pathname.split("/coffee-joint-machine-twin")[1] || "").replace(/^\//, "");
  const ids = PRODUCTS.map((product) => product.id);

  if (req.method === "GET" && (sub === "" || sub === "manifest")) {
    await log(req, "manifest", ids);
    return json({
      schema: "misfit.merchant-twin.v1",
      merchant: {
        name: "CoffeeAndJoint",
        canonical_domain: "www.coffeeandajoint.co",
        canonical_url: STORE,
        legacy_aliases: ["coffeeandajoint", "coffeeandajoint-corrected.vercel.app"],
        fulfillment_modes: ["POD", "owner", "split"],
      },
      capabilities: { catalog_search: true, catalog_lookup: true, checkout_handoff: true, ucp_checkout: false, autonomous_payment: false },
      products: PRODUCTS,
      endpoints: { manifest: BASE, catalog: `${BASE}/catalog`, lookup_template: `${BASE}/product/{id}`, search: `${BASE}/search`, health: `${BASE}/health` },
      rules: { checkout_is_handoff_only: true, no_agent_payment_execution: true, no_false_ucp_checkout_claim: true },
    });
  }

  if (req.method === "GET" && sub === "health") {
    return json({ ok: true, service: "coffee-joint-machine-twin", version: "2.0.0", merchant: "CoffeeAndJoint", product_count: PRODUCTS.length, checkout_handoff: true, ucp_checkout: false, autonomous_payment: false });
  }

  if (req.method === "GET" && sub === "catalog") {
    await log(req, "catalog_search", ids);
    return json({ schema: "misfit.merchant-twin.v1", products: PRODUCTS, total_count: PRODUCTS.length });
  }

  if (req.method === "GET" && sub.startsWith("product/")) {
    const id = decodeURIComponent(sub.slice(8));
    const product = PRODUCTS.find((entry) => [entry.id, entry.handle, entry.sku].some((value) => value === id));
    await log(req, "catalog_lookup", product ? [product.id] : []);
    return product ? json({ schema: "misfit.merchant-twin.v1", product }) : json({ error: "not_found" }, 404);
  }

  if (req.method === "POST" && sub === "search") {
    const body: any = await req.json().catch(() => ({}));
    const query = String(body?.query || "").trim().toLowerCase();
    const terms = query.split(/\s+/).filter(Boolean);
    const matches = PRODUCTS.filter((product) => {
      const corpus = `${product.title} ${product.description} ${product.tags.join(" ")}`.toLowerCase();
      return !terms.length || terms.every((term) => corpus.includes(term));
    });
    await log(req, "catalog_search", matches.map((product) => product.id));
    return json({ schema: "misfit.merchant-twin.v1", products: matches, total_count: matches.length });
  }

  return json({ error: "not_found" }, 404);
});
