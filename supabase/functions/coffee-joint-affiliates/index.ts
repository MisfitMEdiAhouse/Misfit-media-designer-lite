import "jsr:@supabase/functions-js@2/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.109.0";

const CANONICAL_COFFEE_URL = "https://misfitmediahouse.com/coffee-restored";
const cors = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: cors });
const clean = (value: unknown, max = 160) => String(value ?? "").trim().slice(0, max);
const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const trackedLink = (code: string) => `${CANONICAL_COFFEE_URL}?ref=${encodeURIComponent(code)}`;
const makeCode = (name: string) => {
  const stem = name.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5) || "MISFT";
  const bytes = crypto.getRandomValues(new Uint8Array(3));
  return `${stem}${Array.from(bytes).map((byte) => (byte % 36).toString(36).toUpperCase()).join("")}`;
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  const db = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  try {
    const url = new URL(request.url);
    if (request.method === "GET" && url.searchParams.get("action") === "click") {
      const ref = clean(url.searchParams.get("ref"), 32).toUpperCase();
      const path = clean(url.searchParams.get("path"), 240);
      if (!ref) return json({ ok: false, error: "missing_ref" }, 400);
      const { data: affiliate } = await db
        .from("coffee_affiliates")
        .select("code,status")
        .eq("code", ref)
        .maybeSingle();
      if (!affiliate || affiliate.status !== "active") return json({ ok: false, error: "unknown_ref" }, 404);
      await db.from("coffee_referral_clicks").insert({ affiliate_code: ref, landing_path: path || "/coffee-restored" });
      return json({ ok: true, ref });
    }

    if (request.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);
    const body = await request.json().catch(() => ({}));
    const name = clean(body.name, 100);
    const email = clean(body.email, 160).toLowerCase();
    const payoutEmail = clean(body.payoutEmail || body.payout_email, 160).toLowerCase();
    if (name.length < 2 || !validEmail(email) || (payoutEmail && !validEmail(payoutEmail))) {
      return json({ ok: false, error: "invalid_input" }, 400);
    }

    const { data: existing, error: existingError } = await db
      .from("coffee_affiliates")
      .select("name,email,payout_email,code,status,commission_bps")
      .ilike("email", email)
      .maybeSingle();
    if (existingError) throw existingError;
    if (existing) {
      return json({
        ok: true,
        existing: true,
        affiliate: {
          name: existing.name,
          email: existing.email,
          payoutEmail: existing.payout_email,
          code: existing.code,
          status: existing.status,
          commissionPercent: existing.commission_bps / 100,
        },
        link: trackedLink(existing.code),
      });
    }

    let created: Record<string, any> | null = null;
    for (let attempt = 0; attempt < 5 && !created; attempt += 1) {
      const code = makeCode(name);
      const { data, error } = await db.from("coffee_affiliates").insert({
        name,
        email,
        payout_email: payoutEmail || email,
        code,
      }).select("name,email,payout_email,code,status,commission_bps").single();
      if (!error) created = data;
      else if (error.code !== "23505") throw error;
    }
    if (!created) throw new Error("could_not_allocate_code");

    return json({
      ok: true,
      existing: false,
      affiliate: {
        name: created.name,
        email: created.email,
        payoutEmail: created.payout_email,
        code: created.code,
        status: created.status,
        commissionPercent: created.commission_bps / 100,
      },
      link: trackedLink(created.code),
    }, 201);
  } catch (error) {
    console.error("coffee-joint-affiliates", error);
    return json({ ok: false, error: "server_error" }, 500);
  }
});
