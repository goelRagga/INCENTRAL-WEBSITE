import { api } from "@/lib/backend";

import type { CheckoutAddress } from "./order-storage";

const CHECKOUT_ID_KEY = "zoho_checkout_id";
const PAYMENT_URL_KEY = "zoho_payment_url";

function ssGet(key: string) {
  if (typeof window === "undefined") return null;
  try { return sessionStorage.getItem(key); } catch { return null; }
}
function ssSet(key: string, val: string) {
  if (typeof window === "undefined") return;
  try { sessionStorage.setItem(key, val); } catch {}
}
function ssDel(key: string) {
  if (typeof window === "undefined") return;
  try { sessionStorage.removeItem(key); } catch {}
}

export type ShippingMethod = {
  id: string;
  name: string;
  description?: string;
  rate?: number;
};

function normalizeShippingMethods(raw: unknown[]): ShippingMethod[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((m: any) => ({
    id: String(m.shipping_method_id ?? m.id ?? ""),
    name: m.shipping_method_name ?? m.name ?? "Standard shipping",
    description: m.delivery_time ?? m.description ?? "",
    rate: Number(m.rate ?? m.shipping_rate ?? 0),
  }));
}

export const checkoutApi = {
  getCheckoutId: () => ssGet(CHECKOUT_ID_KEY),
  getStoredPaymentUrl: () => ssGet(PAYMENT_URL_KEY),

  clearSession() {
    ssDel(CHECKOUT_ID_KEY);
    ssDel(PAYMENT_URL_KEY);
  },

  async validateAddress(params: {
    items: Array<{ sku: string; quantity: number }>;
    email: string;
    shippingAddress: CheckoutAddress;
    billingAddress?: CheckoutAddress;
    sameBillingAddress: boolean;
  }): Promise<{ shippingMethods: ShippingMethod[] }> {
    let checkoutId = ssGet(CHECKOUT_ID_KEY);
    if (!checkoutId) {
      const sync = await api.checkout.syncCart({ items: params.items });
      checkoutId = sync.checkoutId as string;
      ssSet(CHECKOUT_ID_KEY, checkoutId);
    }
    const result = await api.checkout.address({
      checkoutId,
      email: params.email,
      shippingAddress: params.shippingAddress,
      billingAddress: params.billingAddress,
      sameBillingAddress: params.sameBillingAddress,
    });
    return { shippingMethods: normalizeShippingMethods(result.shippingMethods ?? []) };
  },

  async selectShipping(shippingMethodId: string): Promise<{ paymentUrl: string | null }> {
    const checkoutId = ssGet(CHECKOUT_ID_KEY);
    const result = await api.checkout.shipping({ shippingMethodId, checkoutId });
    const paymentUrl = result.paymentUrl as string | null ?? null;
    if (paymentUrl) ssSet(PAYMENT_URL_KEY, paymentUrl);
    return { paymentUrl };
  },
};
