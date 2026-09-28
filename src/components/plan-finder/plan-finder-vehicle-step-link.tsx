"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { requestPlanFinderVehicleStep } from "@/lib/plan-finder/session-reset";

type PlanFinderVehicleStepLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href?: ComponentProps<typeof Link>["href"];
};

/** Navigates to the plan finder and opens step 1 (clears saved solutions step). */
export function PlanFinderVehicleStepLink({
  href = "/#check-compatibility",
  onClick,
  ...props
}: PlanFinderVehicleStepLinkProps) {
  return (
    <Link
      href={href}
      {...props}
      onClick={(event) => {
        requestPlanFinderVehicleStep();
        onClick?.(event);
      }}
    />
  );
}
