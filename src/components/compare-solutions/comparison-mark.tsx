import { cn } from "@/lib/utils";
import type { GroupInclusionState } from "@/config/feature-comparison";

const markConfig: Record<
  GroupInclusionState,
  { symbol: string; label: string; className: string }
> = {
  yes: {
    symbol: "✓",
    label: "All features included",
    className: "pcmp-mark yes",
  },
  no: {
    symbol: "×",
    label: "Not included",
    className: "pcmp-mark no",
  },
  partial: {
    symbol: "−",
    label: "Some features included",
    className: "pcmp-mark partial",
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
      className={cn(config.className, className)}
      aria-label={config.label}
      title={config.label}
    >
      {config.symbol}
    </span>
  );
}
