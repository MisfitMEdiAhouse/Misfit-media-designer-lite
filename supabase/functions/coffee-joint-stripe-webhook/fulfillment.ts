export type ItemKind = "hat" | "patch" | "crate";
export type Provider = "printify" | "printful" | "owner";
export type ProductKey = "drugs" | "classic_herb" | "classic_patch" | "crate";
export type PlanItem = { itemKind: ItemKind; provider: Provider; productKey: ProductKey };
export type FulfillmentPlan = {
  orderKind: "hat" | "patch" | "crate" | "bundle";
  pendingStatus: "printify_pending" | "printful_pending" | "awaiting_owner_shipment" | "split_pending";
  commissionBaseAmount: number;
  items: PlanItem[];
};

export const LINKS = {
  drugs: "plink_1U1KbLFpcFPyAHAYiFWU9qJz",
  classicLegacy: "plink_1U5YwIFpcFPyAHAYtFcP9QiY",
  classic: "plink_1U6QHWFpcFPyAHAYjjPl6E3N",
  patch: "plink_1U6QHdFpcFPyAHAYlkuFqc7n",
  crate: "plink_1U6RFlFpcFPyAHAY6ukpnzH6",
  bundle: "plink_1U6RFzFpcFPyAHAYugMIScGX",
} as const;

export const PLAN_BY_LINK: Record<string, FulfillmentPlan> = {
  [LINKS.drugs]: {
    orderKind: "hat",
    pendingStatus: "printify_pending",
    commissionBaseAmount: 4500,
    items: [{ itemKind: "hat", provider: "printify", productKey: "drugs" }],
  },
  [LINKS.classicLegacy]: {
    orderKind: "hat",
    pendingStatus: "printful_pending",
    commissionBaseAmount: 6500,
    items: [{ itemKind: "hat", provider: "printful", productKey: "classic_herb" }],
  },
  [LINKS.classic]: {
    orderKind: "hat",
    pendingStatus: "printful_pending",
    commissionBaseAmount: 6500,
    items: [{ itemKind: "hat", provider: "printful", productKey: "classic_herb" }],
  },
  [LINKS.patch]: {
    orderKind: "patch",
    pendingStatus: "printful_pending",
    commissionBaseAmount: 0,
    items: [{ itemKind: "patch", provider: "printful", productKey: "classic_patch" }],
  },
  [LINKS.crate]: {
    orderKind: "crate",
    pendingStatus: "awaiting_owner_shipment",
    commissionBaseAmount: 0,
    items: [{ itemKind: "crate", provider: "owner", productKey: "crate" }],
  },
  [LINKS.bundle]: {
    orderKind: "bundle",
    pendingStatus: "split_pending",
    commissionBaseAmount: 4500,
    items: [
      { itemKind: "hat", provider: "printify", productKey: "drugs" },
      { itemKind: "crate", provider: "owner", productKey: "crate" },
    ],
  },
};

const normalized = (value: unknown) => String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");

export function resolvePlan(session: Record<string, any>): FulfillmentPlan | null {
  const exact = PLAN_BY_LINK[String(session.payment_link ?? "")];
  if (exact) return exact;

  const brand = normalized(session.metadata?.brand);
  const isCoffee = brand === "coffeeandajoint" || session.metadata?.coffeeandajoint === "true";
  if (!isCoffee) return null;

  const sku = normalized(session.metadata?.catalog_sku);
  const orderKind = normalized(session.metadata?.order_kind);
  const provider = normalized(session.metadata?.fulfillment_provider);
  if (sku === "classicherbpatch") return PLAN_BY_LINK[LINKS.patch];
  if (sku === "classicherbhat" || provider === "printful") return PLAN_BY_LINK[LINKS.classic];
  if (orderKind === "bundle") return PLAN_BY_LINK[LINKS.bundle];
  if (orderKind === "crate" || provider === "owner") return PLAN_BY_LINK[LINKS.crate];
  if (provider === "printify" || normalized(session.metadata?.drop) === "001") return PLAN_BY_LINK[LINKS.drugs];
  throw new Error("Coffee checkout has no fulfillment mapping");
}
