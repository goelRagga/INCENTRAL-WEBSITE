"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import type { PlanProduct } from "@/config/plans";
import { cn } from "@/lib/utils";

import { PlanPdpContainer } from "./plan-pdp-container";

type PlanLineToggleProps = {
  product: PlanProduct;
};

export function PlanLineToggle({ product }: PlanLineToggleProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const defaultLine = product.variants.some((v) => v.href.includes("line=ais"))
    ? "ais"
    : "standard";
  const activeLine = searchParams.get("line") || defaultLine;

  if (product.variants.length <= 1) return null;

  return (
    <section
      aria-label="Choose product version"
      className="pdp-line-switch-wrap bg-inc-warm"
    >
      <PlanPdpContainer>
        <div className="flex items-center justify-start gap-4 max-[680px]:flex-col max-[680px]:items-start max-[680px]:gap-2.5">
          <div className="shrink-0">
            <span className="block text-[11px] font-semibold tracking-[0.055em] text-[#6b7b81] uppercase max-[680px]:text-[10.5px]">
              Plan version
            </span>
          </div>
          <div
            role="tablist"
            aria-label={`${product.name} version`}
            className="inline-grid max-w-[520px] grid-cols-2 gap-0.5 rounded-full border border-[#c9d6dc] bg-[#edf3f7] p-1 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.65)] max-[680px]:w-full"
          >
            {product.variants.map((variant) => {
              const line = variant.href.includes("line=ais") ? "ais" : "standard";
              const isActive = activeLine === line;
              const href = `${pathname}?line=${line}`;

              return (
                <Link
                  key={variant.href}
                  href={href}
                  role="tab"
                  aria-selected={isActive}
                  data-pdp-line-select={line}
                  className={cn(
                    "flex min-h-9 items-center justify-center rounded-full border border-transparent px-[18px] text-[12px] font-semibold whitespace-nowrap text-[#5e6f78] no-underline transition-[background,border-color,color,box-shadow] duration-150 max-[680px]:min-h-8 max-[680px]:px-2.5 max-[680px]:text-[11.5px]",
                    "hover:bg-white/60 hover:text-[#143844]",
                    isActive &&
                      "border-[#0a5fc5] bg-[#0a5fc5] text-white shadow-[0_8px_18px_rgba(10,95,197,0.24)] hover:bg-[#0957b5] hover:text-white",
                    "focus-visible:outline focus-visible:outline-3 focus-visible:outline-[#005fcc] focus-visible:outline-offset-2"
                  )}
                >
                  {variant.label}
                </Link>
              );
            })}
          </div>
        </div>
      </PlanPdpContainer>
    </section>
  );
}
