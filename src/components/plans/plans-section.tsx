import type { PlanShowcaseCard } from "@/config/plans";
import { cn } from "@/lib/utils";

import { Container } from "@/components/common/container";
import { SectionHead } from "@/components/layout/marketing";

import { PlansGrid } from "./plans-grid";

export type PlansSectionProps = {
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

export function PlansSection({
  id,
  titleId,
  eyebrow,
  title,
  description,
  cards,
  className,
  gridClassName,
  gridLabel = "Intangles plans",
}: PlansSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={cn("h139-plans", className)}
    >
      <Container>
        <SectionHead
          variant="h139"
          eyebrow={eyebrow}
          title={title}
          titleId={titleId}
          description={description}
        />
        <PlansGrid
          cards={cards}
          className={gridClassName}
          gridLabel={gridLabel}
        />
      </Container>
    </section>
  );
}
