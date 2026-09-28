import { notFound } from "next/navigation";

import { CtaBand } from "@/components/layout/marketing";
import {
  getPlanProductById,
  getPlanShowcaseCardById,
  plansMega,
  type PlanRouteId,
} from "@/config/plans";
import { planMeta, planValueLabel, variantLabel } from "@/lib/plan-finder/plan-meta";
import { planRouteToFamily } from "@/lib/plans/plan-route-map";

import { CustomerStoriesSection } from "@/components/testimonials/customer-stories-section";
import { planCustomerStories } from "@/config/customer-stories";

import { PlanHighlightsSection } from "./plan-highlights-section";
import { PlanPdpHero } from "./plan-pdp-hero";
import { PlanPdpLayout } from "./plan-pdp-layout";

type PlanPdpPageProps = {
  planId: PlanRouteId;
  line?: "ais" | "standard";
};

const planBestFor: Record<PlanRouteId, string> = {
  incert: "Fleet operators that need a clear day-to-day view of vehicles, trips and driver events.",
  insight:
    "Teams that want fuel and repair visibility on top of core tracking and compliance.",
  ingenious:
    "Operators ready for predictive vehicle health, fuel management and fleet automation.",
  "invision-plus":
    "Fleets that need video safety alongside tracking, fuel and predictive health capabilities.",
};

export function PlanPdpPage({ planId, line = "ais" }: PlanPdpPageProps) {
  const product = getPlanProductById(planId);
  const showcase = getPlanShowcaseCardById(planId);
  const family = planRouteToFamily(planId);
  const meta = planMeta[family];

  if (!product || !showcase) notFound();

  const hasAisVariant = product.variants.some((variant) => variant.href.includes("line=ais"));
  const resolvedLine = line === "ais" && hasAisVariant ? "ais" : "standard";
  const lineLabel = variantLabel(resolvedLine === "ais");
  const finderHref = `/?interest=${family}&line=${resolvedLine}#check-compatibility`;

  return (
    <PlanPdpLayout product={product} lineLabel={lineLabel}>
      <PlanPdpHero
        accent={product.accent}
        lineLabel={lineLabel}
        valueLabel={planValueLabel(family, resolvedLine === "ais")}
        name={meta.name}
        tagline={showcase.tagline}
        summary={meta.desc}
        image={meta.art}
        finderHref={finderHref}
      />

      <PlanHighlightsSection
        planName={meta.name}
        features={meta.key}
        bestFor={planBestFor[planId]}
      />

      <CustomerStoriesSection
        variant="plan-pdp"
        id="customer-proof"
        titleId={planCustomerStories[planId].titleId}
        title={planCustomerStories[planId].title}
        description={planCustomerStories[planId].description}
        stories={planCustomerStories[planId].stories}
      />

      <CtaBand
        eyebrow="Compare plans"
        title="Review the full plan range or confirm fit for your fleet."
        description="Use the plan finder to match vehicles, needs and AIS-140 route before you choose."
        primaryAction={plansMega.cta}
        secondaryAction={{ label: "See all plans", href: "/plans" }}
      />
    </PlanPdpLayout>
  );
}
