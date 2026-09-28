import type { AccountBootstrap } from "@/lib/account/types";

const emptyBootstrap: AccountBootstrap = {
  profile: {
    firstName: "",
    lastName: "",
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    billingAddress: {
      id: "billing",
      label: "Billing address",
      attention: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "India",
    },
    shippingAddresses: [],
  },
  orders: [],
  invoices: [],
  payments: [],
  tickets: [],
};

export function loadAccountMockBootstrap(): AccountBootstrap {
  return structuredClone(emptyBootstrap);
}
