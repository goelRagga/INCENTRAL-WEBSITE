/** When true, skip API reads and use mock-data.ts only (local demo). */
export const accountUseMockData = false;

/** When true, support/profile saves and invoice PDF placeholders use in-memory mock handlers. */
export const accountUseMockMutations = false;

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
