import { SUPPORTED_POWERTRAINS } from "@/lib/commerce/constants";
import { QUOTE_STORAGE_KEY } from "@/lib/plan-finder/cart";
import type { CartLine } from "@/lib/plan-finder/types";

export type QuoteContextRecord = {
  planName?: string;
  quantity?: number;
  totalCartQuantity?: number;
  cartItems?: CartLine[];
  aisRequired?: boolean;
  stateLabel?: string;
  quoteReason?: string;
  quoteReasonLabel?: string;
  unsupportedStateLabels?: string[];
  segmentLabel?: string;
  make?: string;
  manufacturerLabel?: string;
  emission?: string;
  hardware?: string;
  source?: string;
  sku?: string;
  family?: string;
  stateId?: string;
  segment?: string;
  id?: string;
};

const PLAN_FALLBACK_OPTIONS = [
  "InCert, AIS-140 Certified",
  "InSight, AIS-140 Certified",
  "InGenious, AIS-140 Certified",
  "InVision+, AIS-140 Certified",
  "InCert, Standard",
  "InSight, Standard",
  "InGenious, Standard",
  "InVision+, Standard",
  "Not sure yet",
] as const;

export { PLAN_FALLBACK_OPTIONS };

export function loadQuoteContext(): QuoteContextRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(QUOTE_STORAGE_KEY);
    if (!raw) return null;
    const context = JSON.parse(raw) as QuoteContextRecord;
    if (
      context.emission &&
      !SUPPORTED_POWERTRAINS.has(String(context.emission))
    ) {
      sessionStorage.removeItem(QUOTE_STORAGE_KEY);
      return null;
    }
    return context;
  } catch {
    return null;
  }
}

export function clearQuoteContext() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(QUOTE_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function isCartQuoteContext(context: QuoteContextRecord | null) {
  return Boolean(
    context &&
      Array.isArray(context.cartItems) &&
      context.cartItems.length > 0 &&
      Number(context.totalCartQuantity || context.quantity) > 0
  );
}

export function isQuoteContextValid(context: QuoteContextRecord | null) {
  if (!context) return false;
  if (isCartQuoteContext(context)) return true;
  const plan = String(context.planName || "").trim();
  const qty = Number(context.quantity || 0);
  return Boolean(plan && qty > 0);
}

export function quoteQuantity(context: QuoteContextRecord, cartContext: boolean) {
  return Math.max(
    1,
    Number(
      cartContext
        ? context.totalCartQuantity || context.quantity
        : context.quantity
    ) || 1
  );
}

export function routeLabel(context: QuoteContextRecord, cartContext: boolean) {
  if (cartContext) {
    const lines = context.cartItems || [];
    const hasAis = lines.some(
      (x) => x.aisRequired || String(x.line || "").includes("AIS-140")
    );
    const hasStandard = lines.some(
      (x) => !x.aisRequired && !String(x.line || "").includes("AIS-140")
    );
    if (hasAis && hasStandard) return "AIS-140 Certified + Standard";
    if (hasAis) return "AIS-140 Certified";
    return "Standard";
  }
  return context.aisRequired ? "AIS-140 Certified" : "Standard";
}

export function vehicleLabel(context: QuoteContextRecord) {
  const parts = [
    context.segmentLabel,
    context.manufacturerLabel || context.make,
    context.emission,
  ].filter(Boolean);
  return parts.join(" · ");
}

export function quotePlanLabel(context: QuoteContextRecord, cartContext: boolean) {
  if (!cartContext) return context.planName || "";
  const names = [
    ...new Set(
      (context.cartItems || [])
        .map((x) => [x.planName, x.line].filter(Boolean).join(" · "))
        .filter(Boolean)
    ),
  ];
  return names.length ? `Mixed cart: ${names.join(", ")}` : "Mixed cart request";
}

export function unsupportedStateLabels(
  context: QuoteContextRecord,
  cartContext: boolean
) {
  const fromContext = Array.isArray(context.unsupportedStateLabels)
    ? context.unsupportedStateLabels.filter(Boolean)
    : [];
  if (fromContext.length) return [...new Set(fromContext)];
  if (!cartContext) return context.stateLabel ? [context.stateLabel] : [];
  return [
    ...new Set(
      (context.cartItems || [])
        .filter(
          (x) =>
            x.aisRequired &&
            x.stateLabel &&
            context.quoteReason !== "quantity_over_25_total_cart"
        )
        .map((x) => x.stateLabel as string)
    ),
  ];
}

export type QuoteAsideCopy = {
  eyebrow: string;
  title: string;
  lead: string;
};

export function quoteAsideCopy(
  context: QuoteContextRecord,
  cartContext: boolean
): QuoteAsideCopy {
  const qty = quoteQuantity(context, cartContext);
  const locationQuote =
    !cartContext &&
    ["ais_state_not_listed", "ais_coverage_confirmation", "ais_state_not_empanelled"].includes(
      String(context.quoteReason || "")
    );

  if (locationQuote) {
    return {
      eyebrow: "AIS-140 quote",
      title: "AIS-140 availability check",
      lead: `Review your request for ${qty} device${qty === 1 ? "" : "s"}.`,
    };
  }
  if (cartContext) {
    const states = unsupportedStateLabels(context, cartContext);
    return {
      eyebrow: "Fleet quote",
      title: "Your cart is ready for a quote",
      lead: states.length
        ? `AIS-140 is not currently available in ${states.join(", ")}. Review the request below.`
        : `Your cart contains ${qty} devices. Review the request below.`,
    };
  }
  return {
    eyebrow: "Fleet enquiry",
    title: "Get a Quote",
    lead: "Share your vehicle and plan details with our team to get a quote.",
  };
}
