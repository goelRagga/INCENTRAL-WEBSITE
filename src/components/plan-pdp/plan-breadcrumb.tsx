import Link from "next/link";

import { PlanPdpContainer } from "./plan-pdp-container";

type PlanBreadcrumbProps = {
  planName: string;
  lineLabel: string;
};

export function PlanBreadcrumb({ planName, lineLabel }: PlanBreadcrumbProps) {
  return (
    <PlanPdpContainer>
      <nav
        aria-label="Breadcrumb"
        className="flex min-h-12 items-center gap-2 text-[13px] text-[#74828a]"
      >
        <Link href="/" className="text-[#4d6573] hover:underline">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/solutions" className="text-[#4d6573] hover:underline">
          Solutions
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">
          {planName} · {lineLabel}
        </span>
      </nav>
    </PlanPdpContainer>
  );
}
