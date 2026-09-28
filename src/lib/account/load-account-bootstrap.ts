import { accountUseMockData } from "@/config/account";
import { api } from "@/lib/backend";
import { loadAccountMockBootstrap } from "@/lib/account/mock-data";
import { mergeAccountBootstrap } from "@/lib/account/merge-account-bootstrap";
import { buildAccountBootstrapSources } from "@/lib/account/map-api-bootstrap";
import type { AccountBootstrap } from "@/lib/account/types";

type FetchOk<T> = { ok: true; data: T };
type FetchFail = { ok: false; data: null };
type FetchResult<T> = FetchOk<T> | FetchFail;

async function safeFetch<T>(run: () => Promise<T>): Promise<FetchResult<T>> {
  try {
    return { ok: true, data: await run() };
  } catch {
    return { ok: false, data: null };
  }
}

/** Live API where available; mock fixture fills gaps. */
export async function loadAccountBootstrap(session?: {
  name?: string;
  email?: string;
}): Promise<AccountBootstrap> {
  const fallback = loadAccountMockBootstrap();

  if (accountUseMockData) {
    return fallback;
  }

  const [profileRes, ordersRes, addressesRes, invoicesRes, paymentsRes] = await Promise.all([
    safeFetch(() => api.account.profile()),
    safeFetch(() => api.account.orders()),
    safeFetch(() => api.account.addresses()),
    safeFetch(() => api.account.invoices()),
    safeFetch(() => api.account.payments()),
  ]);

  const profilePayload =
    profileRes.ok && profileRes.data && typeof profileRes.data === "object"
      ? (profileRes.data as Record<string, unknown>)
      : null;

  const addressesPayload = addressesRes.ok ? addressesRes.data : undefined;

  const sources = buildAccountBootstrapSources({
    profile: profilePayload,
    orders: ordersRes.ok ? ordersRes.data : [],
    addresses: addressesPayload,
    invoices: invoicesRes.ok ? invoicesRes.data : undefined,
    payments: paymentsRes.ok ? paymentsRes.data : undefined,
    session,
    profileFromApi: profileRes.ok,
    ordersFromApi: ordersRes.ok,
    invoicesFromApi: invoicesRes.ok,
    paymentsFromApi: paymentsRes.ok,
  });

  return mergeAccountBootstrap(sources, fallback, session);
}
