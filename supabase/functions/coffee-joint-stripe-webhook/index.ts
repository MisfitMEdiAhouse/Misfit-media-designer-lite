import "jsr:@supabase/functions-js@2/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.109.0";
import { resolvePlan, type FulfillmentPlan, type PlanItem } from "./fulfillment.ts";

type Json = Record<string, any>;

const SIGNATURE_TOLERANCE_SECONDS = 300;
const db = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const response = (status: number, body: Json) => new Response(JSON.stringify(body), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
});

const clean = (value: any, max = 500) =>
  typeof value === "string" && value.trim() ? value.trim().slice(0, max) : null;

const affiliateCode = (value: any) => {
  const candidate = clean(value, 64)?.toUpperCase() ?? null;
  return candidate && /^[A-Z0-9_-]+$/.test(candidate) ? candidate : null;
};

const stripeId = (value: any) => typeof value === "string" ? value : value?.id ?? null;

async function hmac(secret: string, message: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return [...new Uint8Array(signed)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

async function verifySignature(raw: string, header: string, secret: string) {
  const parts = header.split(",").map((part) => part.trim());
  const timestamp = parts.find((part) => part.startsWith("t="))?.slice(2);
  const signatures = parts.filter((part) => part.startsWith("v1=")).map((part) => part.slice(3));
  if (!timestamp || !/^\d+$/.test(timestamp) || !signatures.length) return false;
  if (Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp)) > SIGNATURE_TOLERANCE_SECONDS) return false;
  const expected = await hmac(secret, `${timestamp}.${raw}`);
  return signatures.some((signature) => timingSafeEqual(signature, expected));
}

async function secrets(keys: string[]) {
  const { data, error } = await db
    .from("service_runtime_secrets")
    .select("secret_key,secret_value")
    .in("secret_key", keys);
  if (error) throw error;
  return Object.fromEntries((data ?? []).map((row: Json) => [row.secret_key, String(row.secret_value)]));
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function beginEvent(event: Json, raw: string) {
  const { error } = await db.from("webhook_events").insert({
    provider: "stripe_coffee_joint",
    provider_event_id: event.id,
    event_type: event.type,
    payload_hash: await sha256(raw),
    status: "received",
  });
  if (!error) return true;
  if (error.code !== "23505") throw error;
  const { data } = await db
    .from("webhook_events")
    .select("status")
    .eq("provider", "stripe_coffee_joint")
    .eq("provider_event_id", event.id)
    .maybeSingle();
  return !["processed", "ignored"].includes(data?.status);
}

async function finishEvent(id: string, status: "processed" | "ignored" | "failed", error?: string) {
  await db.from("webhook_events").update({
    status,
    error: error?.slice(0, 1000) ?? null,
    processed_at: new Date().toISOString(),
  }).eq("provider", "stripe_coffee_joint").eq("provider_event_id", id);
}

function shippingDetails(session: Json) {
  return session.shipping_details ?? session.collected_information?.shipping_details ?? {};
}

function recipient(session: Json) {
  const shipping = shippingDetails(session);
  const address = shipping.address ?? {};
  const customer = session.customer_details ?? {};
  return {
    name: clean(shipping.name ?? customer.name, 200) ?? "Customer",
    address1: address.line1,
    address2: address.line2 ?? "",
    city: address.city,
    state_code: address.state ?? "",
    country_code: address.country,
    zip: address.postal_code,
    phone: clean(customer.phone, 40) ?? "",
    email: clean(customer.email, 254) ?? "orders@coffeeandajoint.co",
  };
}

async function upsertItem(
  orderId: string,
  spec: PlanItem,
  status: string,
  patch: Json = {},
) {
  const { data: existing, error: lookupError } = await db
    .from("commerce_fulfillment_items")
    .select("*")
    .eq("order_id", orderId)
    .eq("item_kind", spec.itemKind)
    .maybeSingle();
  if (lookupError) throw lookupError;

  if (existing) {
    const terminal = ["submitted", "shipped", "fulfilled"].includes(existing.status);
    const { data, error } = await db.from("commerce_fulfillment_items").update({
      ...patch,
      fulfillment_provider: spec.provider,
      status: terminal ? existing.status : status,
      updated_at: new Date().toISOString(),
    }).eq("id", existing.id).select("*").single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await db.from("commerce_fulfillment_items").insert({
    order_id: orderId,
    item_kind: spec.itemKind,
    quantity: 1,
    fulfillment_provider: spec.provider,
    status,
    ...patch,
    evidence: { product_key: spec.productKey, ...(patch.evidence ?? {}) },
  }).select("*").single();
  if (error) throw error;
  return data;
}

function splitName(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts.length === 1
    ? { first_name: parts[0], last_name: "." }
    : { first_name: parts.slice(0, -1).join(" "), last_name: parts.at(-1) ?? "." };
}

async function dispatchPrintify(order: Json, session: Json, spec: PlanItem) {
  const current = await upsertItem(order.id, spec, "awaiting_dispatch");
  if (["submitted", "shipped", "fulfilled"].includes(current.status)) return;

  const secret = await secrets([
    "printify_api_token",
    "printify_shop_id",
    "printify_hat_product_id",
    "printify_hat_variant_id",
    "printify_shipping_method",
  ]);
  if (!secret.printify_api_token || !secret.printify_shop_id || !secret.printify_hat_product_id || !secret.printify_hat_variant_id) {
    await upsertItem(order.id, spec, "configuration_required", {
      last_error: "Printify token, shop, product, and variant mapping are required before automatic dispatch.",
    });
    return;
  }

  const shipping = shippingDetails(session);
  const address = shipping.address ?? {};
  const customer = session.customer_details ?? {};
  if (!address.line1 || !address.city || !address.country || !address.postal_code) {
    await upsertItem(order.id, spec, "failed", { last_error: "Complete Stripe shipping address missing." });
    return;
  }

  const name = splitName(clean(shipping.name ?? customer.name, 200) ?? "Customer");
  const body = {
    external_id: `${session.id}-drugs`,
    label: `Coffee & A Joint ${session.id}`,
    line_items: [{
      product_id: secret.printify_hat_product_id,
      variant_id: Number(secret.printify_hat_variant_id),
      quantity: 1,
    }],
    shipping_method: Number(secret.printify_shipping_method ?? "1"),
    send_shipping_notification: true,
    address_to: {
      ...name,
      email: clean(customer.email, 254) ?? "orders@coffeeandajoint.co",
      phone: clean(customer.phone, 40) ?? "",
      country: address.country,
      region: address.state ?? "",
      address1: address.line1,
      address2: address.line2 ?? "",
      city: address.city,
      zip: address.postal_code,
    },
  };
  const result = await fetch(
    `https://api.printify.com/v1/shops/${encodeURIComponent(secret.printify_shop_id)}/orders.json`,
    {
      method: "POST",
      headers: { authorization: `Bearer ${secret.printify_api_token}`, "content-type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  const text = await result.text();
  let json: Json = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    // Keep the bounded raw response for the error ledger.
  }
  if (!result.ok) {
    await upsertItem(order.id, spec, "failed", {
      last_error: `Printify ${result.status}: ${clean(json.message ?? text, 500) ?? "request failed"}`,
    });
    throw new Error(`Printify ${result.status}`);
  }
  await upsertItem(order.id, spec, "submitted", {
    external_order_id: clean(json.id, 200),
    last_error: null,
    submitted_at: new Date().toISOString(),
    evidence: { external_id: body.external_id, http_status: result.status, product_key: spec.productKey },
  });
}

async function dispatchPrintful(order: Json, session: Json, spec: PlanItem) {
  const current = await upsertItem(order.id, spec, "awaiting_dispatch");
  if (["submitted", "shipped", "fulfilled"].includes(current.status)) return;

  const prefix = spec.productKey === "classic_patch" ? "printful_patch" : "printful_classic";
  const secret = await secrets([
    "printful_api_token",
    "printful_store_id",
    `${prefix}_sync_variant_id`,
    `${prefix}_variant_id`,
    `${prefix}_artwork_url`,
  ]);
  const syncVariantId = secret[`${prefix}_sync_variant_id`];
  const variantId = secret[`${prefix}_variant_id`];
  const artworkUrl = secret[`${prefix}_artwork_url`];
  if (!secret.printful_api_token || (!syncVariantId && !(variantId && artworkUrl))) {
    await upsertItem(order.id, spec, "configuration_required", {
      last_error: `Printful token and ${spec.productKey} variant mapping are required before automatic dispatch.`,
    });
    return;
  }

  const destination = recipient(session);
  if (!destination.address1 || !destination.city || !destination.country_code || !destination.zip) {
    await upsertItem(order.id, spec, "failed", { last_error: "Complete Stripe shipping address missing." });
    return;
  }

  const lineItem = syncVariantId
    ? { sync_variant_id: Number(syncVariantId), quantity: 1 }
    : { variant_id: Number(variantId), quantity: 1, files: [{ url: artworkUrl }] };
  const headers: Json = {
    authorization: `Bearer ${secret.printful_api_token}`,
    "content-type": "application/json",
  };
  if (secret.printful_store_id) headers["X-PF-Store-Id"] = secret.printful_store_id;
  const externalId = `${session.id}-${spec.productKey}`;
  const body = { external_id: externalId, shipping: "STANDARD", recipient: destination, items: [lineItem] };
  const result = await fetch("https://api.printful.com/orders?confirm=1&update_existing=1", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const text = await result.text();
  let json: Json = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    // Keep the bounded raw response for the error ledger.
  }
  if (!result.ok) {
    await upsertItem(order.id, spec, "failed", {
      last_error: `Printful ${result.status}: ${clean(json.error?.message ?? json.result ?? text, 500) ?? "request failed"}`,
    });
    throw new Error(`Printful ${result.status}`);
  }
  await upsertItem(order.id, spec, "submitted", {
    external_order_id: clean(json.result?.id ?? json.data?.id, 200),
    last_error: null,
    submitted_at: new Date().toISOString(),
    evidence: { external_id: externalId, http_status: result.status, product_key: spec.productKey },
  });
}

async function dispatchOwner(order: Json, spec: PlanItem) {
  await upsertItem(order.id, spec, "awaiting_owner_shipment", {
    last_error: null,
    evidence: { product_key: spec.productKey, action: "owner_pack_and_ship" },
  });
}

async function refreshOrderStatus(orderId: string, plan: FulfillmentPlan) {
  const { data: items, error } = await db
    .from("commerce_fulfillment_items")
    .select("status")
    .eq("order_id", orderId);
  if (error) throw error;
  const statuses = (items ?? []).map((item: Json) => item.status);
  let fulfillmentStatus: string = plan.pendingStatus;
  if (statuses.some((status: string) => ["configuration_required", "failed", "review_required"].includes(status))) {
    fulfillmentStatus = "review_required";
  } else if (statuses.length && statuses.every((status: string) => status === "fulfilled")) {
    fulfillmentStatus = "fulfilled";
  } else if (plan.orderKind === "crate" && statuses.includes("awaiting_owner_shipment")) {
    fulfillmentStatus = "awaiting_owner_shipment";
  }
  await db.from("commerce_orders").update({ fulfillment_status: fulfillmentStatus, updated_at: new Date().toISOString() }).eq("id", orderId);
}

async function recordCommission(order: Json, plan: FulfillmentPlan) {
  if (!order.affiliate_code || plan.commissionBaseAmount <= 0) return;
  const { data: affiliate, error } = await db
    .from("coffee_affiliates")
    .select("id,code,status,commission_bps")
    .eq("code", order.affiliate_code)
    .maybeSingle();
  if (error) throw error;
  if (!affiliate || affiliate.status !== "active") return;
  const base = Math.min(plan.commissionBaseAmount, Number(order.amount_total ?? plan.commissionBaseAmount));
  const amount = Math.round(base * Number(affiliate.commission_bps) / 10000);
  const { error: commissionError } = await db.from("coffee_affiliate_commissions").upsert({
    order_id: order.id,
    affiliate_id: affiliate.id,
    affiliate_code: affiliate.code,
    commission_base_amount: base,
    commission_bps: affiliate.commission_bps,
    commission_amount: amount,
    currency: order.currency ?? "usd",
    status: "pending_fulfillment",
    evidence: { rule: "headwear_only", order_kind: plan.orderKind },
    updated_at: new Date().toISOString(),
  }, { onConflict: "order_id" });
  if (commissionError) throw commissionError;
}

async function handlePaid(event: Json, session: Json) {
  const plan = resolvePlan(session);
  if (!plan) return false;
  const shipping = shippingDetails(session);
  const customer = session.customer_details ?? {};
  const paid = ["paid", "no_payment_required"].includes(session.payment_status);
  const payload = {
    provider: "stripe",
    stripe_checkout_session_id: session.id,
    stripe_payment_link_id: clean(session.payment_link, 200),
    stripe_payment_intent_id: stripeId(session.payment_intent),
    stripe_customer_id: clean(session.customer, 200),
    stripe_event_id: event.id,
    order_kind: plan.orderKind,
    payment_status: paid ? "paid" : "unpaid",
    fulfillment_status: paid ? plan.pendingStatus : "pending",
    customer_email: clean(customer.email, 254),
    customer_name: clean(customer.name, 200),
    customer_phone: clean(customer.phone, 40),
    shipping_name: clean(shipping.name, 200),
    shipping_address: shipping.address ?? null,
    currency: clean(session.currency, 10),
    amount_subtotal: Number.isInteger(session.amount_subtotal) ? session.amount_subtotal : null,
    amount_discount: Number.isInteger(session.total_details?.amount_discount) ? session.total_details.amount_discount : 0,
    amount_total: Number.isInteger(session.amount_total) ? session.amount_total : null,
    affiliate_code: affiliateCode(session.client_reference_id ?? session.metadata?.affiliate_code),
    stripe_metadata: session.metadata ?? {},
    paid_at: paid ? new Date(Number(event.created) * 1000).toISOString() : null,
    updated_at: new Date().toISOString(),
  };
  const { data: order, error } = await db
    .from("commerce_orders")
    .upsert(payload, { onConflict: "stripe_checkout_session_id" })
    .select("*")
    .single();
  if (error) throw error;
  if (!paid) return true;

  await recordCommission(order, plan);
  for (const item of plan.items) {
    if (item.provider === "printful") await dispatchPrintful(order, session, item);
    else if (item.provider === "printify") await dispatchPrintify(order, session, item);
    else await dispatchOwner(order, item);
  }
  await refreshOrderStatus(order.id, plan);
  return true;
}

async function handleExpired(session: Json) {
  const plan = resolvePlan(session);
  if (!plan) return false;
  const { data: order } = await db
    .from("commerce_orders")
    .select("id,payment_status")
    .eq("stripe_checkout_session_id", session.id)
    .maybeSingle();
  if (order && order.payment_status !== "paid") {
    await db.from("commerce_orders").update({
      payment_status: "expired",
      fulfillment_status: "cancelled",
      updated_at: new Date().toISOString(),
    }).eq("id", order.id);
  }
  return true;
}

async function handleChargeException(charge: Json, paymentStatus: "refunded" | "disputed") {
  const paymentIntent = stripeId(charge.payment_intent);
  if (!paymentIntent) return false;
  const { data: order, error } = await db
    .from("commerce_orders")
    .select("id")
    .eq("stripe_payment_intent_id", paymentIntent)
    .maybeSingle();
  if (error) throw error;
  if (!order) return false;
  const fulfillmentStatus = paymentStatus === "refunded" ? "cancelled" : "review_required";
  await db.from("commerce_orders").update({
    payment_status: paymentStatus,
    fulfillment_status: fulfillmentStatus,
    updated_at: new Date().toISOString(),
  }).eq("id", order.id);
  await db.from("coffee_affiliate_commissions").update({
    status: "voided",
    evidence: { reason: paymentStatus },
    updated_at: new Date().toISOString(),
  }).eq("order_id", order.id).neq("status", "paid");
  await db.from("commerce_fulfillment_items").update({
    status: paymentStatus === "refunded" ? "cancelled" : "review_required",
    updated_at: new Date().toISOString(),
  }).eq("order_id", order.id).in("status", ["awaiting_dispatch", "configuration_required", "failed", "awaiting_owner_shipment"]);
  return true;
}

Deno.serve(async (request) => {
  if (request.method === "GET") {
    return response(200, {
      ok: true,
      service: "coffee-joint-stripe-webhook",
      version: 4,
      routes: {
        drugs_hat: "printify",
        classic_herb_hat: "printful",
        classic_patch: "printful",
        crate: "owner",
        bundle: "printify+owner",
      },
    });
  }
  if (request.method !== "POST") return response(405, { error: "method_not_allowed" });

  let eventId: string | null = null;
  try {
    const raw = await request.text();
    const signature = request.headers.get("stripe-signature");
    if (!signature) return response(400, { error: "missing_stripe_signature" });
    const secret = await secrets(["coffee_joint_stripe_webhook_signing_secret"]);
    if (!secret.coffee_joint_stripe_webhook_signing_secret) throw new Error("webhook secret missing");
    if (!(await verifySignature(raw, signature, secret.coffee_joint_stripe_webhook_signing_secret))) {
      return response(400, { error: "invalid_stripe_signature" });
    }

    const event = JSON.parse(raw);
    eventId = clean(event.id, 200);
    if (!eventId || !event.type || !event.data?.object) return response(400, { error: "invalid_stripe_event" });
    if (!(await beginEvent(event, raw))) return response(200, { received: true, duplicate: true });

    let handled = false;
    if (["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event.type)) {
      handled = await handlePaid(event, event.data.object);
    } else if (event.type === "checkout.session.expired") {
      handled = await handleExpired(event.data.object);
    } else if (event.type === "charge.refunded") {
      handled = await handleChargeException(event.data.object, "refunded");
    } else if (event.type === "charge.dispute.created") {
      handled = await handleChargeException(event.data.object, "disputed");
    }

    await finishEvent(eventId, handled ? "processed" : "ignored");
    return response(200, { received: true, handled });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (eventId) {
      try {
        await finishEvent(eventId, "failed", message);
      } catch {
        // Preserve the original handler error.
      }
    }
    console.error(message);
    return response(500, { error: "webhook_processing_failed" });
  }
});
