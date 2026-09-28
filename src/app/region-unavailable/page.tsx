import { Suspense } from "react";

import { RegionUnavailablePage } from "@/components/region-unavailable/region-unavailable-page";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Regional Availability",
  description:
    "InCentral is not currently available in every region. Contact Intangles to discuss fleet solutions and deployment options for your market.",
  path: "/region-unavailable",
  noIndex: true,
});

export default function RegionUnavailableRoute() {
  return (
    <Suspense fallback={null}>
      <RegionUnavailablePage />
    </Suspense>
  );
}
