/** When true, My InCentral uses src/lib/account/mock-data.ts instead of live APIs. */
export const accountUseMockData = true;

export const accountPage = {
  metadata: {
    title: "My InCentral | Orders, Billing & Support",
    description:
      "Manage your InCentral orders, invoices, account details and support requests in one place.",
  },
  intro: {
    eyebrow: "My InCentral",
    lead: "Manage orders, invoices, addresses and support from one place.",
  },
} as const;

export type AccountPanelId =
  | "overview"
  | "orders"
  | "billing"
  | "addresses"
  | "support";

export const accountPanelIds: AccountPanelId[] = [
  "overview",
  "orders",
  "billing",
  "addresses",
  "support",
];
