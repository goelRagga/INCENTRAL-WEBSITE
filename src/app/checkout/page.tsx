import "@/styles/checkout-headless.css";

import { CheckoutPageContent } from "@/components/checkout/checkout-page-content";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Checkout",
  description:
    "Review your InCentral order details, delivery information and order summary before completing checkout.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  return <CheckoutPageContent />;
}
