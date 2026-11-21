import "jsr:@supabase/functions-js@2/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

// Independent Misfit GTA VI audience-interest capture.
// NEVER imports game purchasers or sends marketing email on its own.
// Existing gaming_portal_requests receives only owner-private, UNVERIFIED leads.
// No exposed database keys, list-read routes or mass-email actions.
const allowedOrigins = new Set([
  "https://misfitmediahouse.com",
  "https://www.misfitmediahouse.com",
]);
const baseHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "Vary": "Origin",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "content-type, apikey, x-client-info",
};
const ok = (body: unknown, code: number, origin: string | null) =>
  new Response(JSON.stringify(body), {
    status: code,
    headers: {
      ...baseHeaders,
      ...(origin && allowedOrigins.has(origin) ? { "Access-Control-Allow-Origin": origin } : {}),
    },
  });

const clean = (value: unknown, length = 100) =>
  typeof value === "string" ? value.trim().slice(0, length) : "";
const hash = async (value: string) => {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), (n) => n.toString(16).padStart(2, "0")).join("");
};
function admin() {
  const url = Deno.env.get("SUPABASE_URL") || "";
  const map = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}");
  const key = map.default || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!url || !key) throw new Error("not_configured");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (origin && !allowedOrigins.has(origin)) return ok({ error: "origin_not_allowed" }, 403, null);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: {
    ...baseHeaders, ...(origin ? { "Access-Control-Allow-Origin": origin } : {}),
  } });
  if (req.method === "GET") return ok({ service: "misfit_gta_vi_fan_interest", status: "online", email_marketing_enabled: false }, 200, origin);
  if (req.method !== "POST") return ok({ error: "method_not_allowed" }, 405, origin);
  if (Number(req.headers.get("content-length") || 0) > 4096) return ok({ error: "payload_too_large" }, 413, origin);

  let data: Record<string, unknown>;
  try {
    data = await req.json();
    if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("bad_json");
  } catch {
    return ok({ error: "invalid_request" }, 400, origin);
  }

  const email = clean(data.email, 254).toLowerCase();
  const name = clean(data.display_name, 70);
  const interest = clean(data.interest, 32);
  const honeypot = clean(data.website, 100);
  if (honeypot) return ok({ ok: true, status: "interest_received", email_verified: false }, 202, origin);
  if (!/^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/.test(email)) return ok({ error: "valid_email_required" }, 400, origin);
  if (data.marketing_consent !== true || data.over_18 !== true) return ok({ error: "consent_and_adult_required" }, 400, origin);
  if (!["player", "creator", "community", "updates"].includes(interest)) return ok({ error: "interest_invalid" }, 400, origin);

  try {
    const db = admin();
    const ip = clean(req.headers.get("x-forwarded-for")?.split(",")[0], 128) || "unknown";
    const ua = clean(req.headers.get("user-agent"), 200);
    const key = await hash(ip + "|" + ua + "|gta-vi-fan-interest");
    const { data: allowed, error: limiterError } = await db.rpc("consume_public_rate_limit_admin", { p_key_hash: key, p_limit: 5 });
    if (limiterError) throw new Error("rate_limit_unavailable");
    if (!allowed) return ok({ error: "rate_limited" }, 429, origin);

    // Query is server-side only, and returns no subscriber data to the caller.
    const existing = await db.from("gaming_portal_requests")
      .select("id")
      .eq("request_type", "partnership")
      .eq("email", email)
      .contains("details", { kind: "gta_vi_fan_interest" })
      .limit(1);
    if (existing.error) throw new Error("lookup_failed");
    if (!existing.data?.length) {
      const details = {
        kind: "gta_vi_fan_interest",
        verified_email: false,
        marketing_email_allowed: false,
        marketing_consent_requested: true,
        consent_text_version: "2026-11-21-misfit-gta-vi-independent",
        consent_recorded_at: new Date().toISOString(),
        over_18_self_attested: true,
        interest,
        utm_source: clean(data.utm_source, 50),
        utm_medium: clean(data.utm_medium, 50),
        utm_campaign: clean(data.utm_campaign, 50),
        referral: clean(data.referral, 50),
        source: "misfitmediahouse.com/gta",
      };
      const result = await db.from("gaming_portal_requests").insert({
        request_type: "partnership", // existing allowed enum; details.kind identifies fan-intake
        name: name || "GTA VI fan",
        email,
        details,
        status: "new",
      });
      if (result.error) throw new Error("insert_failed");
    }
    // Deliberately no email subscription confirmed, no mailing or list enumeration.
    return ok({ ok: true, status: "interest_received", email_verified: false }, 202, origin);
  } catch (error) {
    console.error("gta-vi-interest", error instanceof Error ? error.message : "unexpected_error");
    return ok({ error: "temporarily_unavailable" }, 503, origin);
  }
});
