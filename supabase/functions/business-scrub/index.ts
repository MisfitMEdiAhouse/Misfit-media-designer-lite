import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-client-info, apikey, authorization",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
};

const json = (body: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, ...extra } });

const clean = (value: unknown, max = 500) => String(value ?? "").trim().slice(0, max);

function adminClient() {
  const url = Deno.env.get("SUPABASE_URL") || "";
  const secretKeys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}");
  const secret = secretKeys.default || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!url || !secret) throw new Error("server_not_configured");
  return createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function privateIpv4(ip: string) {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return true;
  const [a, b, c] = parts;
  return a === 0 || a === 10 || a === 127 || a >= 224 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0 && c === 0) ||
    (a === 192 && b === 0 && c === 2) ||
    (a === 198 && (b === 18 || b === 19)) ||
    (a === 198 && b === 51 && c === 100) ||
    (a === 203 && b === 0 && c === 113);
}

function privateIpv6(ip: string) {
  const value = ip.toLowerCase().replace(/^\[|\]$/g, "");
  if (value.startsWith("::ffff:")) {
    const mapped = value.slice(7);
    return mapped.includes(".") ? privateIpv4(mapped) : true;
  }
  return value === "::" || value === "::1" || value.startsWith("fc") || value.startsWith("fd") ||
    /^fe[89ab]/.test(value) || value.startsWith("ff") || value.startsWith("2001:db8");
}

async function dnsJson(name: string, type: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);
  try {
    const response = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`, {
      headers: { accept: "application/dns-json" },
      signal: controller.signal,
    });
    if (!response.ok) return { Answer: [] };
    return await response.json().catch(() => ({ Answer: [] }));
  } finally {
    clearTimeout(timeout);
  }
}

function answers(payload: any, types: number[]) {
  return (Array.isArray(payload?.Answer) ? payload.Answer : [])
    .filter((answer: any) => types.includes(Number(answer?.type)) && typeof answer?.data === "string")
    .map((answer: any) => String(answer.data));
}

async function assertPublicHost(rawUrl: string) {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error("invalid_website");
  }
  if (parsed.protocol !== "https:" || parsed.username || parsed.password || (parsed.port && parsed.port !== "443")) {
    throw new Error("https_website_required");
  }
  const hostname = parsed.hostname.toLowerCase().replace(/\.$/, "");
  const blockedSuffix = /(^localhost$|\.localhost$|\.local$|\.internal$|\.lan$|\.home$|\.corp$|\.onion$)/;
  if (!hostname || hostname.length > 253 || blockedSuffix.test(hostname) || hostname === "metadata.google.internal") {
    throw new Error("private_website_rejected");
  }
  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    if (privateIpv4(hostname)) throw new Error("private_website_rejected");
    return hostname;
  }
  if (hostname.includes(":")) {
    if (privateIpv6(hostname)) throw new Error("private_website_rejected");
    return hostname;
  }
  const [a, aaaa] = await Promise.all([dnsJson(hostname, "A"), dnsJson(hostname, "AAAA")]);
  const ips = [...answers(a, [1]), ...answers(aaaa, [28])];
  if (!ips.length) throw new Error("website_dns_failed");
  if (ips.some((ip) => ip.includes(":") ? privateIpv6(ip) : privateIpv4(ip))) {
    throw new Error("private_website_rejected");
  }
  return hostname;
}

async function normalizeWebsite(raw: string) {
  if (!raw.trim()) throw new Error("website_required");
  let parsed: URL;
  try {
    parsed = new URL(raw.includes("://") ? raw : `https://${raw}`);
  } catch {
    throw new Error("invalid_website");
  }
  if (parsed.protocol === "http:") parsed.protocol = "https:";
  if (parsed.protocol !== "https:") throw new Error("https_website_required");
  parsed.pathname = "/";
  parsed.search = "";
  parsed.hash = "";
  const domain = await assertPublicHost(parsed.href);
  return { domain, url: `https://${domain}/` };
}

async function fetchPublic(url: string) {
  let current = new URL(url);
  const started = Date.now();
  for (let hop = 0; hop < 4; hop += 1) {
    await assertPublicHost(current.href);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    let response: Response;
    try {
      response = await fetch(current.href, {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: {
          accept: "text/html,application/xhtml+xml,application/json,text/plain,text/markdown;q=0.9,*/*;q=0.5",
          "user-agent": "Misfit-Business-Scrub/1.0 (+https://misfitmediahouse.com/scrub)",
        },
      });
    } finally {
      clearTimeout(timeout);
    }
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) throw new Error("redirect_without_location");
      current = new URL(location, current);
      continue;
    }
    return { response, finalUrl: current.href, responseMs: Date.now() - started };
  }
  throw new Error("too_many_redirects");
}

async function readLimited(response: Response, maxBytes: number) {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let output = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      throw new Error("response_too_large");
    }
    output += decoder.decode(value, { stream: true });
  }
  output += decoder.decode();
  return output;
}

async function publicResource(origin: string, pathname: string, maxBytes = 180_000) {
  try {
    const fetched = await fetchPublic(new URL(pathname, origin).href);
    const text = await readLimited(fetched.response, maxBytes);
    return { ok: fetched.response.ok && text.trim().length > 0, status: fetched.response.status, text, url: fetched.finalUrl };
  } catch (error) {
    return { ok: false, status: 0, text: "", url: new URL(pathname, origin).href, error: String(error) };
  }
}

function tagAttribute(tag: string, attribute: string) {
  const quoted = tag.match(new RegExp(`${attribute}\\s*=\\s*["']([^"']*)["']`, "i"));
  if (quoted) return quoted[1].trim();
  const bare = tag.match(new RegExp(`${attribute}\\s*=\\s*([^\\s>]+)`, "i"));
  return bare?.[1]?.trim() || "";
}

function metaContent(html: string, key: string, attribute = "name") {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  const tag = tags.find((item) => tagAttribute(item, attribute).toLowerCase() === key.toLowerCase());
  return tag ? tagAttribute(tag, "content") : "";
}

function linkHref(html: string, relation: string) {
  const tags = html.match(/<link\b[^>]*>/gi) || [];
  const tag = tags.find((item) => tagAttribute(item, "rel").toLowerCase().split(/\s+/).includes(relation));
  return tag ? tagAttribute(tag, "href") : "";
}

function stripTags(value: string) {
  return value.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function detectPlatform(html: string, headers: Headers) {
  const haystack = `${html.slice(0, 500_000)} ${headers.get("server") || ""} ${headers.get("x-powered-by") || ""}`.toLowerCase();
  if (/cdn\.shopify\.com|shopify\.theme|myshopify|shopify-payment-button/.test(haystack)) return "Shopify";
  if (/woocommerce|wp-content|wp-includes/.test(haystack)) return "WordPress / WooCommerce";
  if (/static\.wixstatic\.com|wix-code-sdk|wixsite/.test(haystack)) return "Wix";
  if (/static1\.squarespace\.com|squarespace/.test(haystack)) return "Squarespace";
  if (/webflow\.com|data-wf-page/.test(haystack)) return "Webflow";
  if (/base44|base44\.app/.test(haystack)) return "Base44";
  if (headers.has("x-vercel-id") || /\bvercel\b/.test(haystack)) return "Vercel";
  if (headers.has("x-nf-request-id") || /\bnetlify\b/.test(haystack)) return "Netlify";
  return "Unknown";
}

function chooseBusinessType(text: string, html: string, platform: string) {
  if (platform.includes("Shopify") || platform.includes("WooCommerce") || /add to cart|buy now|checkout|shop all|product catalog/i.test(text)) return "ecommerce";
  if (/get (a )?quote|free estimate|book (a |an )?(call|appointment|service)|service area|request service|call now|\bagency\b|consulting|lead generation|revenue systems|we build|we help/i.test(text)) return "service";
  if (/\bsaas\b|software platform|developer docs|api documentation|sign in|log in|start free trial/i.test(text)) return "software";
  if (/podcast|newsletter|subscribe|creator|patreon|youtube channel|latest episode/i.test(text)) return "creator";
  if (/restaurant|menu|reservations?|order online|hours today/i.test(text)) return "hospitality";
  if (/<form\b/i.test(html) && /contact|inquiry|consultation/i.test(text)) return "service";
  return "unknown";
}

function parseJson(text: string) {
  try { return JSON.parse(text); } catch { return null; }
}

function offerFor(input: { healthy: boolean; foundation: number; conversion: number; businessType: string; platform: string; hasForm: boolean; hasDirectContact: boolean }) {
  if (!input.healthy || input.foundation <= 12 || input.platform === "Base44") {
    return {
      key: "website_ai_launch",
      name: "Website + AI Launch",
      price: "$1,500 once",
      action: "Launch the rebuild",
      reason: input.platform === "Base44"
        ? "The public surface still appears tied to Base44. The highest-value move is a conversion-focused rebuild on the Misfit-owned stack with the lead path connected from day one."
        : "The web foundation is too weak for more traffic to solve the problem. Fix the public site, conversion path, and measurement layer together before buying attention.",
    };
  }
  if (input.businessType === "service" && !input.hasForm && input.hasDirectContact) {
    return {
      key: "quotelink",
      name: "Misfit QuoteLink",
      price: "$49 once",
      action: "Build the fast fix",
      reason: "The business has a contact path but no focused quote flow. QuoteLink is the fastest low-friction way to turn calls, texts, QR scans, and social traffic into a trackable lead page.",
    };
  }
  if (input.businessType === "ecommerce") {
    return {
      key: "managed_growth",
      name: "Managed Growth",
      price: "$997/mo",
      action: "Put Misfit to work",
      reason: "The store needs ongoing conversion, attribution, campaign, merchandising, and agent-commerce work—not another isolated audit with nobody operating the fixes.",
    };
  }
  if (input.conversion < 18) {
    return {
      key: "lead_engine",
      name: "Misfit AI V2 Lead Engine",
      price: "$297/mo",
      action: "Install the lead engine",
      reason: "The site is reachable, but the public conversion path is thin. Misfit AI V2 adds structured response, qualification, follow-up, revival, booking, and lead-to-revenue operations.",
    };
  }
  return {
    key: "managed_growth",
    name: "Managed Growth",
    price: "$997/mo",
    action: "Put Misfit to work",
    reason: "The fundamentals are in place. The next lift comes from continuous experiments, attribution, follow-up, offer work, and human-approved revenue operations across the whole funnel.",
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "GET" && req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const admin = adminClient();
  try {
    const body = req.method === "GET"
      ? { website: new URL(req.url).searchParams.get("website") || new URL(req.url).searchParams.get("site") }
      : await req.json().catch(() => ({}));
    const normalized = await normalizeWebsite(clean(body?.website || body?.site || body?.url));
    const domainHash = await sha256(normalized.domain);

    const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const userAgent = clean(req.headers.get("user-agent"), 300) || "unknown";
    const requestHash = await sha256(`${forwarded}|${userAgent}|business-scrub`);
    const { data: allowed, error: rateError } = await admin.rpc("consume_public_rate_limit_admin", {
      p_key_hash: requestHash,
      p_limit: 20,
    });
    if (rateError) throw new Error("rate_check_failed");
    if (!allowed) return json({ error: "rate_limited" }, 429, { "Retry-After": "3600" });

    const since = new Date(Date.now() - 3_600_000).toISOString();
    const { count, error: countError } = await admin.from("business_scrub_audits")
      .select("id", { count: "exact", head: true })
      .eq("domain_hash", domainHash)
      .gte("created_at", since);
    if (countError) throw new Error("audit_store_unavailable");
    if (Number(count || 0) >= 6) return json({ error: "domain_rate_limit" }, 429, { "Retry-After": "3600" });

    let root: Awaited<ReturnType<typeof fetchPublic>> | null = null;
    let html = "";
    let rootError = "";
    try {
      root = await fetchPublic(normalized.url);
      html = await readLimited(root.response, 800_000);
    } catch (error) {
      rootError = error instanceof Error ? error.message : String(error);
    }

    const finalUrl = root?.finalUrl || normalized.url;
    const finalOrigin = new URL(finalUrl).origin;
    const finalDomain = new URL(finalUrl).hostname;
    const mailDomain = finalDomain.replace(/^www\./, "");
    const scriptUrls = (html.match(/<script\b[^>]*\bsrc\s*=\s*["'][^"']+["'][^>]*>/gi) || [])
      .map((tag) => tagAttribute(tag, "src"))
      .map((source) => { try { return new URL(source, finalOrigin); } catch { return null; } })
      .filter((url): url is URL => Boolean(url && url.origin === finalOrigin && /\.(?:m?js)(?:$|\?)/i.test(url.href)));
    const clientRendered = /<div\b[^>]*\bid\s*=\s*["'](?:root|app|__next)["']/i.test(html) && scriptUrls.length > 0;
    const mainScriptUrl = scriptUrls.find((url) => /\/assets\/|\/static\/|\/_next\//i.test(url.pathname)) || scriptUrls[0] || null;

    const [robots, sitemap, agentsDoc, llmsDoc, ucpDoc, agentCardDoc, clientScriptDoc, mxDns, txtDns, dmarcDns] = await Promise.all([
      publicResource(finalOrigin, "/robots.txt", 120_000),
      publicResource(finalOrigin, "/sitemap.xml", 250_000),
      publicResource(finalOrigin, "/agents.md", 180_000),
      publicResource(finalOrigin, "/llms.txt", 180_000),
      publicResource(finalOrigin, "/.well-known/ucp", 180_000),
      publicResource(finalOrigin, "/.well-known/agent-card.json", 180_000),
      clientRendered && mainScriptUrl
        ? publicResource(finalOrigin, mainScriptUrl.href, 1_000_000)
        : Promise.resolve({ ok: false, status: 0, text: "", url: "" }),
      dnsJson(mailDomain, "MX"),
      dnsJson(mailDomain, "TXT"),
      dnsJson(`_dmarc.${mailDomain}`, "TXT"),
    ]);

    const statusCode = root?.response.status || 0;
    const healthy = statusCode >= 200 && statusCode < 400;
    const headers = root?.response.headers || new Headers();
    const text = stripTags(html).slice(0, 500_000);
    const clientBundle = clientScriptDoc.ok ? clientScriptDoc.text : "";
    const publicCorpus = `${html}\n${clientBundle}`;
    const analysisText = `${text}\n${clientBundle}`;
    const title = (html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").replace(/\s+/g, " ").trim();
    const description = metaContent(html, "description");
    const viewport = metaContent(html, "viewport");
    const robotsMeta = metaContent(html, "robots");
    const canonical = linkHref(html, "canonical");
    const openGraph = Boolean(metaContent(html, "og:title", "property") && metaContent(html, "og:description", "property"));
    const h1Count = (html.match(/<h1\b/gi) || []).length;
    const schemaCount = (html.match(/application\/ld\+json/gi) || []).length;
    const staticForms = (html.match(/<form\b/gi) || []).length;
    const clientForm = clientRendered && /(?:jsx|jsxs|createElement)\([^,]{0,80}["']form["']|["']form["']\s*,\s*\{[^}]{0,600}onSubmit|\/api\/lead|requestedService/i.test(clientBundle);
    const forms = staticForms + (clientForm ? 1 : 0);
    const directPhone = /(?:href\s*=\s*["']|["'])tel:/i.test(publicCorpus);
    const directEmail = /(?:href\s*=\s*["']|["'])mailto:/i.test(publicCorpus);
    const contactLink = /href\s*=\s*["'][^"']*(contact|quote|estimate|inquiry)/i.test(html) || /["'][^"']*(?:contact|quote|estimate|inquiry|request-demo)[^"']*["']/i.test(clientBundle);
    const booking = /calendly|acuityscheduling|setmore|booksy|squareup\.com\/appointments|hubspot.*meetings|book (a |an )?(call|appointment|service)/i.test(analysisText);
    const chat = /intercom|drift\.com|tawk\.to|tidio|crisp\.chat|gorgias|livechat|chatbot/i.test(publicCorpus);
    const proof = /testimonials?|case studies|customer stories|reviews?|our work|portfolio|live results/i.test(analysisText);
    const pricing = /pricing|plans|starting at|\$\d|buy now|shop now|add to cart/i.test(analysisText);
    const staticCtaLabels = [...html.matchAll(/<(?:a|button)\b[^>]*>([\s\S]{0,320}?)<\/(?:a|button)>/gi)]
      .map((match) => stripTags(match[1]))
      .filter((label) => /get|start|book|call|quote|buy|shop|schedule|contact|try|demo|subscribe|order/i.test(label));
    const clientCtaLabels = clientRendered
      ? [...new Set(clientBundle.match(/\b(?:Get|Start|Book|Call|Request|Buy|Shop|Schedule|Contact|Try|View|See|Send|Order)[ A-Za-z0-9+&'’$—-]{2,58}/g) || [])].slice(0, 8)
      : [];
    const ctaLabels = [...staticCtaLabels, ...clientCtaLabels];
    const analytics = /googletagmanager|google-analytics|gtag\(|plausible\.io|segment\.com|analytics\.js|matomo|clarity\.ms|fbq\(/i.test(publicCorpus);
    const crmAutomation = /hubspot|gohighlevel|leadconnector|marketo|mailchimp|activecampaign|klaviyo|salesforce|pardot/i.test(publicCorpus);
    const hasPrivacy = /href\s*=\s*["'][^"']*privacy/i.test(html) || /["'][^"']*privacy[^"']*["']/i.test(clientBundle);
    const hasTerms = /href\s*=\s*["'][^"']*(terms|legal)/i.test(html) || /["'][^"']*(terms|legal)[^"']*["']/i.test(clientBundle);
    const hasAbout = /href\s*=\s*["'][^"']*(about|team|story)/i.test(html) || /["'][^"']*(about|team|story)[^"']*["']/i.test(clientBundle);
    const hasContact = contactLink || /href\s*=\s*["'][^"']*contact/i.test(html);
    const indexable = !/\bnoindex\b/i.test(robotsMeta);
    const hasSitemap = sitemap.ok || /sitemap\s*:/i.test(robots.text);
    const hasAgents = agentsDoc.ok && agentsDoc.text.trim().length >= 40;
    const hasLlms = llmsDoc.ok && llmsDoc.text.trim().length >= 40;
    const ucp = ucpDoc.ok ? parseJson(ucpDoc.text) : null;
    const agentCard = agentCardDoc.ok ? parseJson(agentCardDoc.text) : null;
    const hasUcp = Boolean(ucp && typeof ucp === "object");
    const hasAgentCard = Boolean(agentCard && typeof agentCard === "object");
    const mxRecords = answers(mxDns, [15]);
    const txtRecords = answers(txtDns, [16]);
    const dmarcRecords = answers(dmarcDns, [16]);
    const hasMx = mxRecords.length > 0;
    const hasSpf = txtRecords.some((record) => /v=spf1/i.test(record));
    const hasDmarc = dmarcRecords.some((record) => /v=dmarc1/i.test(record));
    const platform = detectPlatform(html, headers);
    const businessType = chooseBusinessType(`${title}\n${description}\n${text}`, html, platform);
    const hasDirectContact = directPhone || directEmail || contactLink;

    let foundation = 0;
    if (healthy) foundation += 8; else if (statusCode > 0 && statusCode < 500) foundation += 3;
    foundation += 4; // the normalized and final public scan path is HTTPS
    if (title.length >= 10) foundation += 4;
    if (description.length >= 50) foundation += 3;
    if (viewport) foundation += 3;
    if (canonical) foundation += 3;
    foundation = Math.min(25, foundation);

    let conversion = 0;
    if (ctaLabels.length > 0) conversion += 6;
    if (forms > 0) conversion += 5;
    if (hasDirectContact) conversion += 5;
    if (booking || chat) conversion += 4;
    if (pricing || proof) conversion += 5;
    conversion = Math.min(25, conversion);

    let discoverability = 0;
    if (robots.ok) discoverability += 3;
    if (hasSitemap) discoverability += 5;
    if (h1Count === 1) discoverability += 3; else if (h1Count > 0) discoverability += 1;
    if (schemaCount > 0) discoverability += 4;
    if (openGraph) discoverability += 3;
    if (indexable) discoverability += 2;
    discoverability = Math.min(20, discoverability);

    let trust = 0;
    if (hasContact) trust += 3;
    if (hasAbout) trust += 2;
    if (hasPrivacy) trust += 3;
    if (hasTerms) trust += 2;
    if (hasMx) trust += 2;
    if (hasSpf) trust += 1;
    if (hasDmarc) trust += 2;
    trust = Math.min(15, trust);

    let automation = 0;
    if (analytics) automation += 3;
    if (booking || chat) automation += 3;
    if (hasAgents || hasLlms) automation += 3;
    if (hasUcp || hasAgentCard) automation += 3;
    if (crmAutomation || forms > 0) automation += 3;
    automation = Math.min(15, automation);

    const score = foundation + conversion + discoverability + trust + automation;
    const grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";
    const categoryScores = {
      foundation: { key: "foundation", label: "Web foundation", score: foundation, max: 25 },
      conversion: { key: "conversion", label: "Conversion", score: conversion, max: 25 },
      discoverability: { key: "discoverability", label: "Discoverability", score: discoverability, max: 20 },
      trust: { key: "trust", label: "Trust + email", score: trust, max: 15 },
      automation: { key: "automation", label: "Automation + AI", score: automation, max: 15 },
    };

    const leaks: Array<{ impact: string; title: string; evidence: string; fix: string; category: string }> = [];
    const addLeak = (impact: string, titleText: string, evidence: string, fix: string, category: string) => leaks.push({ impact, title: titleText, evidence, fix, category });
    if (!healthy) addLeak("critical", "The public homepage is not returning a healthy response", statusCode ? `The scanner received HTTP ${statusCode}. A blocked or failed homepage stops the rest of the funnel before it starts.` : `The public fetch failed: ${rootError || "no response"}.`, "Restore a clean HTTPS 2xx/3xx response, then verify the primary domain, redirects, origin deployment, and CDN/DNS route.", "foundation");
    if (ctaLabels.length === 0) addLeak(clientRendered ? "medium" : "high", clientRendered ? "The client-rendered action path needs browser verification" : "No clear action was visible in the public HTML", clientRendered ? "The site renders in JavaScript and no action-oriented string was found in the inspected same-origin bundle. A real-browser pass is needed before calling the path absent." : "The scanner did not find a button or link labeled around calling, booking, quoting, buying, starting, or contacting.", "Put one primary action above the fold, repeat it at decision points, and make the outcome specific.", "conversion");
    if (forms === 0 && !booking) addLeak(clientRendered ? "medium" : "high", "The site has no obvious lead-capture or booking path", clientRendered ? "No form or scheduling signal was found in the initial HTML or inspected same-origin app bundle." : "No public form or recognized scheduling path was detected in the initial HTML.", "Add a low-friction quote, booking, or qualification flow with attribution and a defined response owner.", "conversion");
    if (!hasDirectContact) addLeak(clientRendered ? "medium" : "high", "Visitors may not have a one-tap human path", clientRendered ? "No direct telephone, email, quote, or inquiry route string was observed in the initial HTML or inspected app bundle." : "No direct telephone, email, quote, or inquiry link was observed.", "Add tap-to-call/text/email actions and preserve the source through the lead handoff.", "conversion");
    if (!analytics) addLeak("high", "Attribution appears blind", "No common public analytics or tag-manager signal was detected, so lead source and funnel drop-off may be invisible.", "Install privacy-aware analytics and record source → inquiry → appointment → closed revenue.", "automation");
    if (!description || !canonical || !hasSitemap) addLeak("medium", "Search discovery signals are incomplete", `Meta description: ${description ? "present" : "missing"}; canonical: ${canonical ? "present" : "missing"}; sitemap: ${hasSitemap ? "present" : "missing"}.`, "Publish a unique title/description, canonical URL, healthy robots.txt, and XML sitemap, then verify actual coverage in Search Console.", "discoverability");
    if (!indexable) addLeak("critical", "The homepage declares noindex", "A robots meta noindex directive was observed on the public homepage.", "Confirm intent before removing it; if this is the revenue site, allow indexing and request validation in Search Console.", "discoverability");
    if (schemaCount === 0) addLeak("medium", "Search and AI systems get little structured business context", "No JSON-LD structured data block was observed in the initial HTML.", "Publish valid Organization or LocalBusiness schema, then add service, product, FAQ, and offer markup only where truthful.", "discoverability");
    if (!hasDmarc) addLeak("medium", "Email trust is missing a visible DMARC policy", `MX: ${hasMx ? "present" : "not observed"}; SPF: ${hasSpf ? "present" : "not observed"}; DMARC: not observed.`, "Verify the sending inventory, then publish SPF, DKIM, and a staged DMARC policy without breaking legitimate mail.", "trust");
    if (!hasAgents && !hasLlms && !hasUcp && !hasAgentCard) addLeak("opportunity", "The business is hard for AI agents to understand", "No healthy agents.md, llms.txt, UCP profile, or Agent Card was observed.", "Publish a truthful machine-readable business map and keep consequential actions behind explicit authorization boundaries.", "automation");
    const htmlKb = Math.round(new TextEncoder().encode(html).byteLength / 1024);
    if (htmlKb > 500) addLeak("medium", "The initial HTML payload is heavy", `The fetched HTML was approximately ${htmlKb} KB before images and other assets.`, "Reduce duplicated markup and third-party scripts, then measure Core Web Vitals in real browsers before and after.", "foundation");
    const rank: Record<string, number> = { critical: 0, high: 1, medium: 2, opportunity: 3 };
    const revenueLeaks = leaks.sort((a, b) => rank[a.impact] - rank[b.impact]).slice(0, 5);

    const wins: string[] = [];
    if (healthy) wins.push(`The homepage returned HTTP ${statusCode} over HTTPS.`);
    if (title && description) wins.push("The homepage has both a title and meta description.");
    if (ctaLabels.length > 0) wins.push(`${ctaLabels.length} action-oriented public link${ctaLabels.length === 1 ? "" : "s"} were observed.`);
    if (forms > 0 || booking) wins.push("A public lead-capture or scheduling path is visible.");
    if (schemaCount > 0) wins.push(`${schemaCount} structured-data block${schemaCount === 1 ? " was" : "s were"} observed.`);
    if (clientRendered && clientScriptDoc.ok) wins.push("A same-origin client app bundle was inspected for conversion signals instead of treating the empty app shell as the whole site.");
    if (hasSitemap && robots.ok) wins.push("robots.txt and a sitemap signal are present.");
    if (analytics) wins.push("A public analytics or tag-manager signal is present.");
    if (hasDmarc && hasSpf) wins.push("SPF and DMARC email-authentication signals are present.");
    if (hasAgents || hasLlms || hasUcp || hasAgentCard) wins.push("At least one public AI/agent discovery surface is present.");
    if (!wins.length) wins.push("The domain resolves publicly, which gives Misfit a concrete surface to repair.");

    const recommendedOffer = offerFor({ healthy, foundation, conversion, businessType, platform, hasForm: forms > 0 || booking, hasDirectContact });
    const signals = {
      title: Boolean(title), description: Boolean(description), viewport: Boolean(viewport), canonical: Boolean(canonical), open_graph: openGraph,
      h1_count: h1Count, schema_count: schemaCount, robots: robots.ok, sitemap: hasSitemap, indexable,
      cta_count: ctaLabels.length, forms, direct_phone: directPhone, direct_email: directEmail, booking, chat, proof, pricing,
      analytics, crm_automation: crmAutomation, privacy: hasPrivacy, terms: hasTerms, about: hasAbout, contact: hasContact,
      mx: hasMx, spf: hasSpf, dmarc: hasDmarc, agents_md: hasAgents, llms_txt: hasLlms, ucp: hasUcp, agent_card: hasAgentCard,
      client_rendered_app: clientRendered, client_bundle_inspected: clientScriptDoc.ok,
    };

    const responseBody = {
      product: "Misfit Business Scrub",
      scope: "Public website, response headers, DNS, robots/sitemap, and public agent metadata only. No credentials, forms, carts, checkouts, payments, mutations, or private analytics.",
      domain: normalized.domain,
      website: finalUrl,
      status_code: statusCode || null,
      healthy,
      business_type: businessType,
      platform,
      score,
      grade,
      category_scores: categoryScores,
      performance: { response_ms: root?.responseMs || null, html_kb: htmlKb, javascript_kb: clientBundle ? Math.round(new TextEncoder().encode(clientBundle).byteLength / 1024) : null, note: "Server response and transfer sizes only; not Core Web Vitals." },
      analysis_confidence: clientRendered ? (clientScriptDoc.ok ? "medium" : "limited") : "high",
      signals,
      wins: wins.slice(0, 6),
      revenue_leaks: revenueLeaks,
      recommended_offer: recommendedOffer,
      deeper_audit: platform === "Shopify" ? { label: "Run the Shopify Agentic Audit", href: "/shopify-ai-audit", query: "store" } : null,
      checked_at: new Date().toISOString(),
      actual_search_coverage_requires_search_console: true,
    };

    const { error: insertError } = await admin.from("business_scrub_audits").insert({
      domain: normalized.domain,
      domain_hash: domainHash,
      final_url: finalUrl,
      status_code: statusCode || null,
      business_type: businessType,
      platform,
      score,
      grade,
      category_scores: categoryScores,
      signals,
      revenue_leaks: revenueLeaks,
      recommended_offer: recommendedOffer.key,
    });
    if (insertError) console.error("business_scrub_insert", insertError.message);

    return json(responseBody);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("business_scrub", message);
    const publicErrors = new Set(["website_required", "invalid_website", "https_website_required", "private_website_rejected", "website_dns_failed", "response_too_large"]);
    return json({ error: publicErrors.has(message) ? message : "scrub_failed" }, publicErrors.has(message) ? 400 : 500);
  }
});
