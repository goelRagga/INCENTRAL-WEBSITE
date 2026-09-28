export const LAST_ORDER_STORAGE_KEY = "incentralLastOrderV247";

export type PlacedOrderRecord = {
  orderId?: string;
  orderNumber?: string;
  paymentId?: string;
  transactionId?: string;
  amount?: number;
  invoiceUrl?: string;
  customer?: { email: string; marketingOptIn?: boolean };
  shippingAddress?: CheckoutAddress;
  billingAddress?: CheckoutAddress;
  taxProfile?: { includeCompanyTax: boolean; companyName: string; gstin: string };
  items?: CheckoutOrderItem[];
  totals?: {
    productSubtotal: number;
    installation: number;
    shipping: number;
    gst: number;
    discount: number;
    total: number;
  };
};

export type CheckoutAddress = {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
};

export type CheckoutOrderItem = {
  sku: string;
  name: string;
  line: string;
  quantity: number;
  unitPriceExGst: number;
  vehicle?: { segment: string; manufacturer: string; powertrain: string };
  aisState?: { id: string; label: string } | null;
  installation?: {
    method: string;
    label: string;
    feePerDeviceExGst: number;
  };
};

export function saveLastOrder(order: PlacedOrderRecord) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(LAST_ORDER_STORAGE_KEY, JSON.stringify(order));
  } catch {
    /* ignore */
  }
}

export function loadLastOrder(): PlacedOrderRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(LAST_ORDER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PlacedOrderRecord;
  } catch {
    return null;
  }
}
