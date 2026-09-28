import { api } from "@/lib/backend";

import type { CheckoutAddress, PlacedOrderRecord } from "./order-storage";

const mode =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_CHECKOUT_MODE === "api"
    ? "api"
    : "mock";

const wait = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));

function mockOrderNumber() {
  return `INC-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${String(Math.floor(1000 + Math.random() * 9000))}`;
}

export type CheckoutPlacePayload = PlacedOrderRecord & {
  dispatch?: { method: string; shippingFeeExGst: number; shippingFeeGross: number };
  couponCode?: string | null;
  notes?: string;
  paymentProvider?: string;
};

export const checkoutApi = {
  mode,
  async validateAddress(address: CheckoutAddress & { turnstileToken?: string }) {
    if (mode === "api") {
      return api.checkout.address(address);
    }
    await wait(260);
    return { valid: true, normalized: address };
  },
  async getDispatchOptions(payload: unknown) {
    if (mode === "api") {
      return api.checkout.shipping(payload);
    }
    await wait(220);
    return {
      options: [
        {
          id: "standard",
          label: "Standard shipping",
          eta: "8 to 12 days from order date",
          pricePerDevice: 50,
        },
      ],
    };
  },
  async createOrder(payload: CheckoutPlacePayload) {
    if (mode === "api") {
      return api.checkout.place(payload);
    }
    await wait(520);
    return {
      orderId: `zoho_${Date.now()}`,
      orderNumber: mockOrderNumber(),
      status: "draft",
      amount: payload.totals?.total ?? 0,
      currency: "INR",
    };
  },
  async createPaymentOrder(payload: {
    orderId: string;
    amount: number;
    currency: string;
  }) {
    if (mode === "api") {
      return apiFetchPaymentOrder(payload);
    }
    await wait(340);
    return {
      razorpayOrderId: `order_${Date.now()}`,
      amount: payload.amount,
      currency: payload.currency,
    };
  },
  async verifyPayment(payload: {
    orderId: string;
    razorpayOrderId: string;
  }) {
    if (mode === "api") {
      return apiFetchPaymentVerify(payload);
    }
    await wait(850);
    return {
      success: true,
      paymentId: `pay_${Date.now()}`,
      transactionId: `TXN${Date.now()}`,
      paidAt: new Date().toISOString(),
    };
  },
};

async function apiFetchPaymentOrder(payload: {
  orderId: string;
  amount: number;
  currency: string;
}) {
  const res = await fetch("/api/checkout/payment/order", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Could not start payment.");
  return res.json();
}

async function apiFetchPaymentVerify(payload: {
  orderId: string;
  razorpayOrderId: string;
}) {
  const res = await fetch("/api/checkout/payment/verify", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Payment verification failed.");
  return res.json();
}
