import { notFound } from "next/navigation";

import { SolutionComparisonSection } from "@/components/compare-solutions/solution-comparison-section";
import { getPlanProductById, type PlanRouteId } from "@/config/plans";
import { planCustomerStories } from "@/config/customer-stories";
import {
  getPlanPdpVariant,
  planPdpHeroImage,
  type PlanPdpLine,
} from "@/config/plan-pdp";
import { planMeta } from "@/lib/plan-finder/plan-meta";
import { planRouteToFamily } from "@/lib/plans/plan-route-map";

import { PlanPdpCustomerProof } from "./plan-pdp-customer-proof";
import { PlanPdpHero } from "./plan-pdp-hero";
import { PlanPdpLayout } from "./plan-pdp-layout";
import { PlanPdpMediaSection } from "./plan-pdp-media-section";
import { PlanPdpOrderPath } from "./plan-pdp-order-path";
import { PlanPdpTechSection } from "./plan-pdp-tech-section";
import { PlanValueShowcase } from "./plan-value-showcase";

type PlanPdpPageProps = {
  planId: PlanRouteId;
  line?: PlanPdpLine;
};

export function PlanPdpPage({ planId, line = "ais" }: PlanPdpPageProps) {
  const product = getPlanProductById(planId);
  const family = planRouteToFamily(planId);
  const meta = planMeta[family];

  if (!product) notFound();

  const hasAisVariant = product.variants.some((variant) => variant.href.includes("line=ais"));
  const resolvedLine: PlanPdpLine =
    line === "ais" && hasAisVariant ? "ais" : "standard";
  const variant = getPlanPdpVariant(planId, resolvedLine);
  const finderHref = `/?interest=${family}&line=${resolvedLine}#check-compatibility`;
  const storiesConfig = planCustomerStories[planId];

  return (
    <PlanPdpLayout
      product={product}
      lineLabel={variant.lineLabel}
      productFamily={family}
    >
      <PlanPdpHero
        planName={meta.name}
        lineLabel={variant.lineLabel}
        tagline={variant.tagline}
        summary={variant.summary}
        heroImage={planPdpHeroImage(planId)}
        finderHref={finderHref}
      />

      <PlanValueShowcase content={variant.value} />

      <PlanPdpMediaSection media={variant.media} />

      <PlanPdpTechSection tech={variant.tech} />

      <PlanPdpOrderPath order={variant.order} />

      <PlanPdpCustomerProof
        titleId={storiesConfig.titleId}
        title={storiesConfig.title}
        description={storiesConfig.description}
        stories={storiesConfig.stories}
      />

      <SolutionComparisonSection
        mode="plan-pdp"
        currentPlanId={planId}
        badgeLabel={variant.compareBadge}
        compareLine={resolvedLine}
        id={`compare-solutions-${resolvedLine}-${planId}`}
      />
    </PlanPdpLayout>
  );
}
