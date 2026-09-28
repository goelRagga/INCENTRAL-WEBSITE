"use client";

import { cn } from "@/lib/utils";

import { ResultsStep } from "./results-step";
import { usePlanFinder, type UsePlanFinderOptions } from "./use-plan-finder";
import { VehicleStep } from "./vehicle-step";

export type PlanFinderProps = UsePlanFinderOptions & {
  resultsTitleId?: string;
  className?: string;
  showStepper?: boolean;
};

export function PlanFinder({
  variant = "section",
  onAddedToCart,
  resultsTitleId = "planFinderResultsTitle",
  className,
  showStepper = true,
}: PlanFinderProps) {
  const finder = usePlanFinder({ variant, onAddedToCart });
  const { state } = finder;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-[rgba(169,193,205,0.85)] bg-[rgba(255,255,255,0.96)] shadow-[0_24px_60px_rgba(22,52,67,0.11)]",
        "before:absolute before:inset-x-0 before:top-0 before:z-[2] before:h-[3px] before:bg-[linear-gradient(90deg,#1767ad,#50a6d6,#9ed3eb)] before:content-['']",
        "max-[760px]:rounded-[20px]",
        className
      )}
    >
      {showStepper ? (
        <div
          aria-label="Plan finder progress"
          className="flex min-h-[62px] items-center justify-center gap-[11px] border-b border-[#e5ebee] bg-[linear-gradient(180deg,#fff,#fbfcfd)] px-6 py-3 max-[760px]:min-h-[54px]"
        >
          <button
            type="button"
            aria-label="Go to vehicle details"
            className={cn(
              "flex items-center gap-[9px] border-0 bg-transparent px-1.5 py-[5px] text-[12px] font-medium",
              state.step === 1 ? "text-[#163846]" : "cursor-pointer text-[#1767ad] hover:text-[#0e5c9d] hover:[&_span]:underline hover:[&_span]:underline-offset-[3px]"
            )}
            onClick={() => state.step === 2 && finder.goToStep(1)}
          >
            <b
              className={cn(
                "grid size-[28px] place-items-center rounded-full border text-[10.5px] font-semibold",
                state.step === 1
                  ? "border-[#1767ad] bg-[#1767ad] text-white"
                  : "border-[#93bddd] bg-[#f3f8fc] text-[#1767ad]"
              )}
            >
              01
            </b>
            <span>Vehicle details</span>
          </button>
          <i aria-hidden="true" className="h-px w-[52px] bg-[#d8e2e7]" />
          <span
            className={cn(
              "flex items-center gap-[9px] text-[12px] font-medium",
              state.step === 2 ? "text-[#163846]" : "text-[#8a989f]"
            )}
          >
            <b
              className={cn(
                "grid size-[28px] place-items-center rounded-full border text-[10.5px] font-semibold",
                state.step === 2
                  ? "border-[#1767ad] bg-[#1767ad] text-white"
                  : "border-[#ccd8de] bg-white text-inherit"
              )}
            >
              02
            </b>
            <span>Solutions</span>
          </span>
        </div>
      ) : null}

      {state.step === 1 ? <VehicleStep finder={finder} /> : null}
      {state.step === 2 ? (
        <ResultsStep finder={finder} resultsTitleId={resultsTitleId} />
      ) : null}
    </div>
  );
}
