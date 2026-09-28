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
      items: [],
      shipment: null,
    };
  });
}

export function buildAccountBootstrapSources(input: {
  profile: Record<string, unknown> | null;
  orders: unknown;
  addresses?: unknown;
  session?: { name?: string; email?: string };
  profileFromApi: boolean;
  ordersFromApi: boolean;
}): AccountBootstrapSources {
  return {
    profile: input.profileFromApi
      ? mapApiProfile(input.profile, input.session, input.addresses)
      : null,
    orders: input.ordersFromApi ? mapApiOrders(input.orders) : [],
    profileFromApi: input.profileFromApi,
    ordersFromApi: input.ordersFromApi,
  };
}
