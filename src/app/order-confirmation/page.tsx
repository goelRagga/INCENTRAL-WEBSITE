import "@/styles/checkout-headless.css";

import { Suspense } from "react";

import { OrderConfirmationContent } from "@/components/checkout/order-confirmation-content";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Order Confirmation",
  description: "View the confirmation and summary for your recent InCentral order.",
  path: "/order-confirmation",
  noIndex: true,
});

export default function OrderConfirmationPage() {
  return (
    <Suspense>
      <OrderConfirmationContent />
    </Suspense>
  );
}
