import { cn } from "@/lib/utils";
import type { GroupInclusionState } from "@/config/feature-comparison";

const markConfig: Record<
  GroupInclusionState,
  { symbol: string; label: string; className: string }
> = {
  yes: {
    symbol: "✓",
    label: "All features included",
    className: "border-[#d9ece3] bg-[#edf7f2] text-[#176b50]",
  },
  no: {
    symbol: "×",
    label: "Not included",
    className: "border-[#f0dde0] bg-[#fff4f5] text-[#ae4350]",
  },
  partial: {
    symbol: "−",
    label: "Some features included",
    className: "border-[#f0ddb2] bg-[#fff7e8] text-[#a66b00] text-lg",
  },
};

export function ComparisonMark({
  state,
  className,
}: {
  state: GroupInclusionState | "included" | "excluded";
  className?: string;
}) {
  const normalized: GroupInclusionState =
    state === "included" ? "yes" : state === "excluded" ? "no" : state;
  const config = markConfig[normalized];

  return (
    <span
      className={cn(
        "mx-auto inline-flex size-7 items-center justify-center rounded-full border font-[Arial,sans-serif] text-[15px] leading-none font-bold",
        config.className,
        className
      )}
      aria-label={config.label}
      title={config.label}
    >
      {config.symbol}
    </span>
  );
}
