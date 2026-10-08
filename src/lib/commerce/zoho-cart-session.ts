/**
 * Client-side Zoho cart id (mirrors backend `zoho_cart_id` cookie).
 * Storefront `checkout_id` on GET /checkout is this same value.
 */

export const ZOHO_CART_ID_STORAGE_KEY = "incentral.zoho_cart_id";
export const ZOHO_CART_ID_QUERY_PARAM = "cartId";

export function extractCartId(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  const topLevel = record.cart_id ?? record.cartId;
  if (topLevel != null && String(topLevel).trim()) {
    return String(topLevel).trim();
  }
  const cart = record.cart;
  if (cart && typeof cart === "object") {
    const nested = (cart as Record<string, unknown>).cart_id ?? (cart as Record<string, unknown>).cartId;
    if (nested != null && String(nested).trim()) {
      return String(nested).trim();
    }
  }
  return null;
}

function readStoredCartId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = sessionStorage.getItem(ZOHO_CART_ID_STORAGE_KEY);
    return stored?.trim() ? stored.trim() : null;
  } catch {
    return null;
  }
}

function readCartIdFromLocation(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get(ZOHO_CART_ID_QUERY_PARAM) ?? params.get("cart_id");
    return fromUrl?.trim() ? fromUrl.trim() : null;
  } catch {
    return null;
  }
}

/** Prefer session storage, then current URL (for checkout links). */
export function readZohoCartId(): string | null {
  return readStoredCartId() ?? readCartIdFromLocation();
}

export function persistZohoCartId(cartId: string): void {
  const id = cartId.trim();
  if (!id || typeof window === "undefined") return;
  try {
    sessionStorage.setItem(ZOHO_CART_ID_STORAGE_KEY, id);
  } catch {
    /* ignore quota / private mode */
  }
}

export function withCartIdQuery(path: string, cartId?: string | null): string {
  const id = cartId?.trim() || readZohoCartId();
  if (!id) return path;
  const [base, existingQuery = ""] = path.split("?");
  const params = new URLSearchParams(existingQuery);
  params.set(ZOHO_CART_ID_QUERY_PARAM, id);
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

export function applyCartIdSearchParam(
  pathname: string,
  searchParams: URLSearchParams,
  cartId: string
): string {
  const params = new URLSearchParams(searchParams.toString());
  params.set(ZOHO_CART_ID_QUERY_PARAM, cartId.trim());
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
