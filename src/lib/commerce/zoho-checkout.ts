import { api } from "@/lib/backend";

import { readZohoCartId } from "./zoho-cart-session";

export type ZohoCheckoutRegion = { code: string; name: string };

export type ZohoCheckoutCountry = {
  code: string;
  name: string;
  mobileCode?: string;
  states: ZohoCheckoutRegion[];
};

export type ZohoCheckoutShippingMethod = {
  id: string;
  name: string;
  rate: number;
  deliveryTime: string;
  isDefault: boolean;
};

export type ZohoCheckoutSnapshot = {
  checkoutId: string;
  currencyCode: string;
  currencySymbol: string;
  defaultCountryCode: string;
  countries: ZohoCheckoutCountry[];
  stateOptions: ZohoCheckoutRegion[];
  completedTasks: {
    portal: boolean;
    addressDetail: boolean;
    shippingMethods: boolean;
    order: boolean;
  };
  shippingMethods: ZohoCheckoutShippingMethod[];
  order: {
    subTotal: number;
    total: number;
    taxAmount: number;
    shippingAmount: number;
    discountAmount: number;
    isTaxInclusive: boolean;
  };
};

/**
 * Zoho Storefront uses the cart id from add-to-cart as `checkout_id` on GET /checkout.
 */
export function resolveZohoCheckoutId(): string | null {
  return readZohoCartId();
}

export async function fetchZohoCheckout(checkoutId?: string | null) {
  const id = (checkoutId ?? resolveZohoCheckoutId())?.trim();
  if (!id) {
    throw Object.assign(new Error("Cart id is required for checkout."), { status: 400 });
  }
  const data = await api.checkout.get(id);
  return { data, snapshot: normalizeZohoCheckout(data, id) };
}

export function normalizeZohoCheckout(raw: unknown, checkoutId?: string | null): ZohoCheckoutSnapshot | null {
  if (!raw || typeof raw !== "object") return null;
  const root = raw as Record<string, unknown>;
  const checkout = (root.checkout ?? root) as Record<string, unknown>;
  const addressDetail = (checkout.address_detail ?? {}) as Record<string, unknown>;
  const order = (checkout.order ?? {}) as Record<string, unknown>;
  const cart = (order.cart ?? {}) as Record<string, unknown>;
  const orgMeta = (checkout.org_meta ?? {}) as Record<string, unknown>;
  const currency =
    (checkout.currency as Record<string, unknown> | undefined) ??
    (root.currency as Record<string, unknown> | undefined) ??
    {};

  const id =
    checkoutId?.trim() ||
    String(cart.cart_id ?? checkout.checkout_id ?? "").trim() ||
    resolveZohoCheckoutId() ||
    "";

  const countries = parseCountries(addressDetail);
  const defaultCountryCode =
    String(orgMeta.country_code ?? countries[0]?.code ?? "IN").trim() || "IN";
  const stateOptions =
    countries.find((c) => c.code === defaultCountryCode)?.states ??
    countries.find((c) => c.code === "IN")?.states ??
    [];

  const completed = (checkout.completed_tasks ?? {}) as Record<string, unknown>;

  return {
    checkoutId: id,
    currencyCode: String(currency.code ?? "INR"),
    currencySymbol: String(currency.symbol_formatted ?? currency.symbol ?? "₹"),
    defaultCountryCode,
    countries,
    stateOptions,
    completedTasks: {
      portal: Boolean(completed.portal),
      addressDetail: Boolean(completed.address_detail),
      shippingMethods: Boolean(completed.shipping_methods),
      order: Boolean(completed.order),
    },
    shippingMethods: parseShippingMethods(checkout.shipping_methods),
    order: {
      subTotal: Number(order.sub_total ?? 0),
      total: Number(order.total ?? 0),
      taxAmount: Number(order.tax_amount ?? 0),
      shippingAmount: Number(order.shipping_amount ?? 0),
      discountAmount: Number(order.discount_amount ?? 0),
      isTaxInclusive: Boolean(order.is_tax_inclusive),
    },
  };
}

export function zohoStateLabel(
  stateCode: string,
  snapshot: ZohoCheckoutSnapshot | null
): string {
  if (!stateCode) return "";
  const match = snapshot?.stateOptions.find(
    (s) => s.code.toLowerCase() === stateCode.toLowerCase() || s.name.toLowerCase() === stateCode.toLowerCase()
  );
  return match?.name ?? stateCode;
}

function parseCountries(addressDetail: Record<string, unknown>): ZohoCheckoutCountry[] {
  const primary = addressDetail.countries;
  const source =
    (Array.isArray(primary) && primary.length > 0 && primary) ||
    (Array.isArray(addressDetail.all_countries) && addressDetail.all_countries) ||
    [];

  return (source as Record<string, unknown>[])
    .map((country) => ({
      code: String(country.code ?? "").trim(),
      name: String(country.name ?? "").trim(),
      mobileCode: country.mobile_code != null ? String(country.mobile_code) : undefined,
      states: parseRegions(country.states),
    }))
    .filter((country) => country.code && country.name);
}

function parseRegions(value: unknown): ZohoCheckoutRegion[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((state) => {
      const row = state as Record<string, unknown>;
      const code = String(row.code ?? "").trim();
      const name = String(row.name ?? "").trim();
      if (!code || !name) return null;
      return { code, name };
    })
    .filter((state): state is ZohoCheckoutRegion => state !== null);
}

function parseShippingMethods(value: unknown): ZohoCheckoutShippingMethod[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((method) => {
      const row = method as Record<string, unknown>;
      const id = String(row.id ?? "").trim();
      if (!id) return null;
      return {
        id,
        name: String(row.name ?? row.label ?? "Shipping"),
        rate: Number(row.rate ?? 0),
        deliveryTime: String(row.delivery_time ?? row.deliveryTime ?? ""),
        isDefault: Boolean(row.is_default ?? row.isDefault),
      };
    })
    .filter((method): method is ZohoCheckoutShippingMethod => method !== null);
}
