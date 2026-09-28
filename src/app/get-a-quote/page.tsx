import { Suspense } from "react";

import { GetAQuotePageContent } from "@/components/get-a-quote/get-a-quote-page-content";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Request a Fleet Quote",
  description:
    "Request an InCentral fleet quote for larger deployments or configurations that need help from the Intangles team.",
  path: "/get-a-quote",
});

export default function GetAQuotePage() {
  return (
    <Suspense fallback={null}>
      <GetAQuotePageContent />
    </Suspense>
  );
}
