/**
 * My InCentral demo data — mirrors InCentral-Portal account-dashboard-v339.js mock bootstrap.
 * Replace with live API wiring when account endpoints are ready.
 */

import type { AccountBootstrap } from "@/lib/account/types";

export const accountMockBootstrap: AccountBootstrap = {
  profile: {
    firstName: "Naina",
    lastName: "Sharma",
    fullName: "Naina Sharma",
    companyName: "Apex Fleet Logistics Pvt. Ltd.",
    email: "naina.sharma@example.com",
    phone: "+91 98888 56523",
    gstin: "27ABCDE1234F1Z5",
    gstTreatment: "Registered business",
    billingAddress: {
      id: "billing",
      label: "Billing address",
      attention: "Naina Sharma",
      address: "Viman Nagar",
      street2: "",
      city: "Pune",
      state: "Maharashtra",
      zip: "411014",
      country: "India",
    },
    shippingAddresses: [
      {
        id: "shipping-1",
        label: "Primary shipping address",
        attention: "Naina Sharma",
        address: "Viman Nagar",
        street2: "",
        city: "Pune",
        state: "Maharashtra",
        zip: "411014",
        country: "India",
      },
    ],
  },
  orders: [
    {
      id: "so-10284",
      number: "SO-10284",
      date: "2026-09-12T08:42:00+05:30",
      status: "shipped",
      stage: "shipped",
      total: 131994.8,
      items: [
        {
          name: "InGenious",
          variant: "Standard",
          quantity: 5,
          unitPrice: 19600,
          lineTotal: 98000,
        },
        {
          name: "InSight",
          variant: "Standard",
          quantity: 1,
          unitPrice: 10560,
          lineTotal: 10560,
        },
      ],
      shipment: {
        status: "shipped",
        carrier: "Blue Dart",
        trackingNumber: "BD784521963IN",
        deliveryMethod: "Standard shipping",
        shippingDate: "2026-09-14",
        estimatedDelivery: "2026-09-22",
        detail: "Dispatched from Pune",
      },
      invoiceId: "inv-841",
      invoiceNumber: "INV-00841",
      canCancel: false,
    },
    {
      id: "so-10192",
      number: "SO-10192",
      date: "2026-08-28T11:18:00+05:30",
      status: "delivered",
      stage: "delivered",
      total: 26219.6,
      items: [
        {
          name: "InSight",
          variant: "Standard",
          quantity: 2,
          unitPrice: 10560,
          lineTotal: 21120,
        },
      ],
      shipment: {
        status: "delivered",
        carrier: "Delhivery",
        trackingNumber: "DLV94302518",
        deliveryMethod: "Standard shipping",
        shippingDate: "2026-08-30",
        deliveredAt: "2026-09-07",
        detail: "Delivered",
      },
      invoiceId: "inv-802",
      invoiceNumber: "INV-00802",
      canCancel: false,
    },
    {
      id: "so-10077",
      number: "SO-10077",
      date: "2026-07-16T15:05:00+05:30",
      status: "confirmed",
      stage: "confirmed",
      total: 8484.2,
      items: [
        {
          name: "InCert",
          variant: "AIS-140 Certified",
          quantity: 1,
          unitPrice: 7140,
          lineTotal: 7140,
        },
      ],
      shipment: null,
      invoiceId: "inv-744",
      invoiceNumber: "INV-00744",
      canCancel: false,
    },
  ],
  invoices: [
    {
      id: "inv-841",
      number: "INV-00841",
      date: "2026-09-12",
      status: "paid",
      total: 131994.8,
      balance: 0,
      orderNumber: "SO-10284",
    },
    {
      id: "inv-802",
      number: "INV-00802",
      date: "2026-08-28",
      status: "paid",
      total: 26219.6,
      balance: 0,
      orderNumber: "SO-10192",
    },
    {
      id: "inv-744",
      number: "INV-00744",
      date: "2026-07-16",
      status: "paid",
      total: 8484.2,
      balance: 0,
      orderNumber: "SO-10077",
    },
  ],
  payments: [
    {
      id: "pay-841",
      date: "2026-09-12",
      status: "success",
      mode: "Razorpay",
      amount: 131994.8,
      reference: "pay_R9H28K31",
      invoiceNumber: "INV-00841",
    },
    {
      id: "pay-802",
      date: "2026-08-28",
      status: "success",
      mode: "Razorpay",
      amount: 26219.6,
      reference: "pay_P7M42A03",
      invoiceNumber: "INV-00802",
    },
  ],
  tickets: [
    {
      id: 10428,
      subject: "Installation scheduling for SO-10284",
      category: "Installation issue",
      status: 3,
      statusLabel: "Pending",
      createdAt: "2026-09-13T10:15:00+05:30",
      updatedAt: "2026-09-15T12:40:00+05:30",
      orderNumber: "SO-10284",
      description:
        "Please confirm the installation schedule for the five InGenious devices.",
    },
    {
      id: 10372,
      subject: "Invoice copy for SO-10192",
      category: "Billing question",
      status: 4,
      statusLabel: "Resolved",
      createdAt: "2026-09-04T09:20:00+05:30",
      updatedAt: "2026-09-04T14:05:00+05:30",
      orderNumber: "SO-10192",
      description: "Please share the GST invoice for our records.",
    },
  ],
};

/** Deep clone so UI updates do not mutate the static fixture. */
export function loadAccountMockBootstrap(): AccountBootstrap {
  return structuredClone(accountMockBootstrap);
}
