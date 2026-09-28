import type { PlanShowcaseCard } from "@/config/plans";
import { cn } from "@/lib/utils";

import { SolutionCard } from "./solution-card";

type SolutionsGridProps = {
  cards: PlanShowcaseCard[];
  className?: string;
  gridLabel?: string;
};

export function SolutionsGrid({
  cards,
  className,
  gridLabel = "Intangles solutions",
}: SolutionsGridProps) {
  return (
    <div
      aria-label={gridLabel}
      className={cn(
        "grid grid-cols-4 gap-3.5 max-[1120px]:grid-cols-2",
        "max-[780px]:-mr-[var(--gutter-mobile)] max-[780px]:flex max-[780px]:snap-x max-[780px]:gap-3 max-[780px]:overflow-x-auto max-[780px]:pr-[var(--gutter-mobile)] max-[780px]:scrollbar-none",
        "min-[761px]:max-[780px]:-mr-[var(--gutter-tablet)] min-[761px]:max-[780px]:pr-[var(--gutter-tablet)]",
        className
      )}
    >
      {cards.map((card) => (
        <SolutionCard
          key={card.id}
          card={card}
          className="max-[780px]:w-[min(82vw,330px)] max-[780px]:shrink-0 max-[780px]:snap-start"
        />
      ))}
    </div>
  );
}
