import type { ReactNode } from "react";
import { Suspense } from "react";

import type { PlanProduct } from "@/config/plans";

import { PlanBreadcrumb } from "./plan-breadcrumb";
import { PlanPdpBodyAttrs } from "./plan-pdp-body-attrs";
import { PlanLineToggle } from "./plan-line-toggle";

type PlanPdpLayoutProps = {
  product: PlanProduct;
  lineLabel: string;
  productFamily: string;
  children: ReactNode;
};

export function PlanPdpLayout({
  product,
  lineLabel,
  productFamily,
  children,
}: PlanPdpLayoutProps) {
  return (
    <>
      <PlanPdpBodyAttrs productFamily={productFamily} />
      <main className="min-h-[52vh]" id="main">
        <PlanBreadcrumb planName={product.name} lineLabel={lineLabel} />
        <Suspense fallback={null}>
          <PlanLineToggle product={product} />
        </Suspense>
        <div data-product-name={product.name} data-product-variant-root="">
          {children}
        </div>
      </main>
    </>
  );
}
