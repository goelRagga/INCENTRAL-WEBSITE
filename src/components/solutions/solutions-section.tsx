import type { PlanShowcaseCard } from "@/config/plans";
import { cn } from "@/lib/utils";

import { Container } from "@/components/common/container";
import { SectionHead } from "@/components/layout/marketing";

import { SolutionsGrid } from "./solutions-grid";

export type SolutionsSectionProps = {
  id?: string;
  titleId?: string;
  eyebrow: string;
  title: string;
  description: string;
  cards: PlanShowcaseCard[];
  className?: string;
  gridClassName?: string;
  gridLabel?: string;
};

export function SolutionsSection({
  id,
  titleId,
  eyebrow,
  title,
  description,
  cards,
  className,
  gridClassName,
  gridLabel = "Intangles solutions",
}: SolutionsSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={cn(
        "scroll-mt-[90px] border-b border-[#e3e9ec] bg-gradient-to-b from-white to-[#f8fafc] py-12 pb-[52px] max-[520px]:py-10 max-[520px]:pb-11",
        className
      )}
    >
      <Container>
        <SectionHead
          variant="h139"
          eyebrow={eyebrow}
          title={title}
          titleId={titleId}
          description={description}
        />
        <SolutionsGrid
          cards={cards}
          className={gridClassName}
          gridLabel={gridLabel}
        />
      </Container>
    </section>
  );
}
