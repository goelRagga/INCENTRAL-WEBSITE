"use client";

import Link from "next/link";

import { planFinderSection } from "@/config/plan-finder";
import { readZohoCartId, withCartIdQuery } from "@/lib/commerce/zoho-cart-session";
import { cn } from "@/lib/utils";

type PlanFinderCartSuccessProps = {
  title: string;
  summary: string;
  onAnother: () => void;
  className?: string;
};

/** Matches portal h152-success / h152-success-actions (homepage-v333.css). */
export function PlanFinderCartSuccess({
  title,
  summary,
  onAnother,
  className,
}: PlanFinderCartSuccessProps) {
  const { commerce } = planFinderSection;

  return (
    <div
      className={cn(
        "plan-finder-cart-success grid w-full min-w-0 grid-cols-[46px_minmax(0,1fr)] content-center gap-x-[13px] gap-y-0 px-0.5 py-1 max-[760px]:grid-cols-[42px_minmax(0,1fr)] max-[760px]:gap-x-[11px] max-[1050px]:min-h-0 max-[1050px]:py-[5px]",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="plan-finder-cart-success-mark grid size-[46px] shrink-0 place-items-center rounded-[15px] border border-[#c6e7d8] bg-[linear-gradient(145deg,#e8f7f0,#d7f1e5)] text-[22px] font-medium text-[#24745c] shadow-[0_8px_18px_rgba(36,116,92,0.10)] max-[760px]:size-[42px] max-[760px]:rounded-[13px] max-[760px]:text-xl"
      >
        ✓
      </div>
      <div className="min-w-0 pt-px">
        <span className="block text-[11px] font-semibold tracking-[0.05em] text-[#24745c] uppercase">
          {commerce.cartSuccessKicker}
        </span>
        <h5 className="mt-1 mb-0 text-2xl leading-[1.1] font-medium tracking-[-0.025em] text-[#173844] max-[760px]:text-[21px]">
          {title}
        </h5>
        <p className="mt-1.5 mb-0 text-[12.5px] leading-[1.45] font-normal wrap-anywhere text-[#617781]">
          {summary}
        </p>
      </div>
      <div className="plan-finder-cart-success-actions col-span-full mt-1.5">
        <button
          type="button"
          className="plan-finder-cart-success-another flex min-h-[46px] min-w-0 cursor-pointer items-center justify-center rounded-[11px] border border-[#bfd0d8] bg-white text-[13px] font-semibold text-[#1767ad] hover:border-[#9fbac6] hover:bg-[#f5f9fb] max-[760px]:min-h-[44px] max-[420px]:text-[12.5px]"
          onClick={onAnother}
        >
          {commerce.cartAnotherLabel}
        </button>
        <Link
          href={withCartIdQuery("/cart", readZohoCartId())}
          className="plan-finder-cart-success-cart flex min-h-[46px] min-w-0 items-center justify-center gap-[9px] rounded-[11px] border border-[#176fc0] bg-[#176fc0] text-[13px] font-semibold text-white no-underline shadow-[0_8px_18px_rgba(23,111,192,0.17)] hover:border-[#0e61ae] hover:bg-[#0e61ae] max-[760px]:min-h-[44px]"
        >
          {commerce.cartViewLabel}
          <span aria-hidden="true" className="text-base font-normal">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
