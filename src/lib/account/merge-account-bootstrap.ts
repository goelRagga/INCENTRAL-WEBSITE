import type {
  AccountAddress,
  AccountBootstrap,
  AccountProfile,
} from "@/lib/account/types";

function pickStr(primary: string | undefined, fallback: string): string {
  const value = (primary ?? "").trim();
  return value || fallback;
}

function hasAddressData(address?: AccountAddress): boolean {
  if (!address) return false;
  return Boolean(
    (address.address ?? "").trim() ||
      (address.city ?? "").trim() ||
      (address.attention ?? "").trim()
  );
}

export function mergeProfile(
  api: AccountProfile | null,
  fallback: AccountProfile,
  session?: { name?: string; email?: string }
): AccountProfile {
  if (!api) {
    return {
      ...fallback,
      email: pickStr(fallback.email, session?.email ?? ""),
      fullName: pickStr(fallback.fullName, session?.name ?? "Your account"),
    };
  }

  const sessionParts = (session?.name ?? "").trim().split(/\s+/).filter(Boolean);
  const sessionFirst = sessionParts[0] ?? "";
  const sessionLast = sessionParts.slice(1).join(" ");

  const firstName = pickStr(api.firstName, pickStr(sessionFirst, fallback.firstName));
  const lastName = pickStr(api.lastName, pickStr(sessionLast, fallback.lastName));
  const fullName =
    pickStr(api.fullName, "") ||
    [firstName, lastName].filter(Boolean).join(" ") ||
    pickStr(session?.name ?? "", pickStr(fallback.fullName, "Your account"));

  return {
    firstName,
    lastName,
    fullName,
    companyName: pickStr(api.companyName, fallback.companyName),
    email: pickStr(api.email, fallback.email) || session?.email || "",
    phone: pickStr(api.phone, fallback.phone),
    gstin: api.gstin?.trim() ? api.gstin : fallback.gstin,
    gstTreatment: api.gstTreatment?.trim()
      ? api.gstTreatment
      : fallback.gstTreatment,
    billingAddress: hasAddressData(api.billingAddress)
      ? api.billingAddress
      : fallback.billingAddress,
    shippingAddresses:
      api.shippingAddresses?.length > 0
        ? api.shippingAddresses
        : fallback.shippingAddresses,
  };
}

export type AccountBootstrapSources = {
  profile: AccountProfile | null;
  orders: AccountBootstrap["orders"];
  invoices?: AccountBootstrap["invoices"];
  payments?: AccountBootstrap["payments"];
  tickets?: AccountBootstrap["tickets"];
  profileFromApi: boolean;
  ordersFromApi: boolean;
  invoicesFromApi?: boolean;
  paymentsFromApi?: boolean;
  ticketsFromApi?: boolean;
};

/** Prefer live API slices; use mock fixture only where API did not return data. */
export function mergeAccountBootstrap(
  api: AccountBootstrapSources,
  fallback: AccountBootstrap,
  session?: { name?: string; email?: string }
): AccountBootstrap {
  return {
    profile: api.profileFromApi
      ? mergeProfile(api.profile, fallback.profile, session)
      : mergeProfile(null, fallback.profile, session),
    orders: api.ordersFromApi ? api.orders : fallback.orders,
    invoices:
      api.invoicesFromApi && api.invoices !== undefined
        ? api.invoices
        : fallback.invoices,
    payments:
      api.paymentsFromApi && api.payments !== undefined
        ? api.payments
        : fallback.payments,
    tickets:
      api.ticketsFromApi && api.tickets !== undefined
        ? api.tickets
        : fallback.tickets,
  };
}
