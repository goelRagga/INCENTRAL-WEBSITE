import type {
  AccountAddress,
  AccountOrder,
  AccountProfile,
} from "@/lib/account/types";

import type { AccountBootstrapSources } from "@/lib/account/merge-account-bootstrap";

function mapAddressRow(
  raw: Record<string, unknown>,
  id: string,
  label: string
): AccountAddress {
  return {
    id,
    label,
    attention: String(raw.attention ?? raw.contact_name ?? ""),
    address: String(raw.address ?? raw.street ?? raw.address_line_1 ?? ""),
    street2: String(raw.street2 ?? raw.address_line_2 ?? ""),
    city: String(raw.city ?? ""),
    state: String(raw.state ?? ""),
    zip: String(raw.zip ?? raw.pincode ?? raw.postal_code ?? ""),
    country: String(raw.country ?? "India"),
  };
}

function mapAddresses(data: unknown): {
  billing?: AccountAddress;
  shipping: AccountAddress[];
} {
  if (!data) return { shipping: [] };
  if (Array.isArray(data)) {
    return {
      shipping: data.map((row, index) =>
        mapAddressRow(
          row as Record<string, unknown>,
          String((row as Record<string, unknown>).id ?? `shipping-${index + 1}`),
          String((row as Record<string, unknown>).label ?? "Shipping address")
        )
      ),
    };
  }
  const record = data as Record<string, unknown>;
  const billingRaw = record.billing ?? record.billing_address;
  const shippingRaw =
    record.shipping ?? record.shipping_addresses ?? record.addresses;

  const billing =
    billingRaw && typeof billingRaw === "object"
      ? mapAddressRow(
          billingRaw as Record<string, unknown>,
          "billing",
          "Billing address"
        )
      : undefined;

  const shippingList = Array.isArray(shippingRaw)
    ? shippingRaw
    : shippingRaw && typeof shippingRaw === "object"
      ? [shippingRaw]
      : [];

  return {
    billing,
    shipping: shippingList.map((row, index) =>
      mapAddressRow(
        row as Record<string, unknown>,
        String((row as Record<string, unknown>).id ?? `shipping-${index + 1}`),
        String((row as Record<string, unknown>).label ?? "Shipping address")
      )
    ),
  };
}

export function mapApiProfile(
  profile: Record<string, unknown> | null,
  session?: { name?: string; email?: string },
  addresses?: unknown
): AccountProfile | null {
  if (!profile && !session) return null;

  const contact = String(
    profile?.contact_name ?? profile?.full_name ?? session?.name ?? ""
  );
  const parts = contact.trim().split(/\s+/).filter(Boolean);
  const firstName = String(profile?.first_name ?? parts[0] ?? "");
  const lastName = String(
    profile?.last_name ?? parts.slice(1).join(" ") ?? ""
  );
  const mappedAddresses = mapAddresses(addresses);
  const emptyBilling: AccountAddress = {
    id: "billing",
    label: "Billing address",
    attention: contact || "Not provided",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  };

  return {
    firstName,
    lastName,
    fullName:
      contact ||
      [firstName, lastName].filter(Boolean).join(" ") ||
      session?.name ||
      "Your account",
    companyName: String(profile?.company_name ?? ""),
    email: String(profile?.email ?? session?.email ?? ""),
    phone: String(profile?.phone ?? profile?.mobile ?? ""),
    gstin: profile?.gstin ? String(profile.gstin) : undefined,
    gstTreatment: profile?.gst_treatment
      ? String(profile.gst_treatment)
      : undefined,
    billingAddress: mappedAddresses.billing ?? emptyBilling,
    shippingAddresses: mappedAddresses.shipping,
  };
}

export function mapApiOrders(ordersRaw: unknown): AccountOrder[] {
  const list = Array.isArray(ordersRaw)
    ? ordersRaw
    : ((ordersRaw as { salesorders?: unknown[] })?.salesorders ?? []);

  return list.map((row) => {
    const o = row as Record<string, unknown>;
    return {
      id: String(o.salesorder_id ?? o.id ?? ""),
      number: String(o.salesorder_number ?? o.number ?? ""),
      date: String(o.date ?? o.created_time ?? ""),
      status: String(o.status ?? "pending"),
      stage: o.stage ? String(o.stage) : undefined,
      total: Number(o.total ?? o.grand_total ?? 0),
      currencyCode: o.currency_code ? String(o.currency_code) : "₹",
      deviceCount: o.quantity ? Number(o.quantity) : undefined,
      items: [],
      shipment: null,
    };
  });
}

export function mapApiInvoices(raw: unknown): import("@/lib/account/types").AccountInvoice[] {
  const list = Array.isArray(raw) ? raw : ((raw as { invoices?: unknown[] })?.invoices ?? []);
  return list.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      id: String(r.invoice_id ?? r.id ?? ""),
      number: String(r.invoice_number ?? r.number ?? ""),
      date: String(r.date ?? r.created_time ?? ""),
      status: String(r.status ?? ""),
      total: Number(r.total ?? 0),
      balance: Number(r.balance ?? 0),
      orderNumber: r.salesorder_number ? String(r.salesorder_number) : undefined,
      url: r.invoice_url ? String(r.invoice_url) : r.url ? String(r.url) : undefined,
    };
  });
}

export function mapApiOrderDetail(raw: unknown): import("@/lib/account/types").AccountOrder | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const so = (o.salesorder ?? o) as Record<string, unknown>;

  const lineItems = Array.isArray(so.line_items) ? so.line_items : [];
  const items = lineItems.map((li: Record<string, unknown>) => ({
    name: String(li.name ?? li.item_name ?? ""),
    variant: String(li.attribute_option_name1 ?? li.sku ?? ""),
    quantity: Number(li.quantity ?? 1),
    unitPrice: Number(li.rate ?? 0),
    lineTotal: Number(li.item_total ?? 0),
  }));

  const invoices = Array.isArray(so.invoices) ? so.invoices as Record<string, unknown>[] : [];
  const firstInvoice = invoices[0];

  const billing = so.billing_address as Record<string, unknown> | undefined;
  const shipping = so.shipping_address as Record<string, unknown> | undefined;

  return {
    id: String(so.salesorder_id ?? so.id ?? ""),
    number: String(so.salesorder_number ?? so.number ?? ""),
    date: String(so.date ?? so.created_time ?? ""),
    status: String(so.status ?? "pending"),
    stage: so.stage ? String(so.stage) : undefined,
    total: Number(so.total ?? 0),
    currencyCode: so.currency_code ? String(so.currency_code) : "₹",
    subtotal: Number(so.sub_total ?? 0),
    gst: Number(so.tax_total ?? 0),
    shipping: Number(so.shipping_charge ?? 0),
    discount: Number(so.discount_total ?? so.discount ?? 0) || undefined,
    installation: Number(so.adjustment ?? 0) || undefined,
    paymentMode: so.payment_mode ? String(so.payment_mode) : undefined,
    paymentStatus: so.paid_status ? String(so.paid_status) : undefined,
    items,
    shipment: null,
    billingAddress: billing ? {
      id: "billing",
      attention: String(billing.attention ?? ""),
      address: String(billing.address ?? ""),
      city: String(billing.city ?? ""),
      state: String(billing.state ?? ""),
      zip: String(billing.zip ?? ""),
      country: String(billing.country ?? "India"),
    } : undefined,
    shippingAddress: shipping ? {
      id: "shipping",
      attention: String(shipping.attention ?? ""),
      address: String(shipping.address ?? ""),
      city: String(shipping.city ?? ""),
      state: String(shipping.state ?? ""),
      zip: String(shipping.zip ?? ""),
      country: String(shipping.country ?? "India"),
    } : undefined,
    invoiceId: firstInvoice ? String(firstInvoice.invoice_id ?? "") : undefined,
    invoiceNumber: firstInvoice ? String(firstInvoice.invoice_number ?? "") : undefined,
  };
}

export function mapApiPayments(raw: unknown): import("@/lib/account/types").AccountPayment[] {
  const list = Array.isArray(raw) ? raw : ((raw as { customerpayments?: unknown[] })?.customerpayments ?? []);
  return list.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      id: String(r.payment_id ?? r.id ?? ""),
      date: String(r.date ?? ""),
      mode: String(r.payment_mode ?? r.mode ?? ""),
      amount: Number(r.amount ?? 0),
      reference: r.reference_number ? String(r.reference_number) : undefined,
      invoiceNumber: r.invoice_number ? String(r.invoice_number) : undefined,
    };
  });
}

export function buildAccountBootstrapSources(input: {
  profile: Record<string, unknown> | null;
  orders: unknown;
  addresses?: unknown;
  invoices?: unknown;
  payments?: unknown;
  session?: { name?: string; email?: string };
  profileFromApi: boolean;
  ordersFromApi: boolean;
  invoicesFromApi?: boolean;
  paymentsFromApi?: boolean;
}): AccountBootstrapSources {
  return {
    profile: input.profileFromApi
      ? mapApiProfile(input.profile, input.session, input.addresses)
      : null,
    orders: input.ordersFromApi ? mapApiOrders(input.orders) : [],
    invoices: input.invoicesFromApi ? mapApiInvoices(input.invoices) : undefined,
    payments: input.paymentsFromApi ? mapApiPayments(input.payments) : undefined,
    profileFromApi: input.profileFromApi,
    ordersFromApi: input.ordersFromApi,
    invoicesFromApi: input.invoicesFromApi,
    paymentsFromApi: input.paymentsFromApi,
    ticketsFromApi: false, // no tickets backend endpoint yet — always use fallback
  };
}
