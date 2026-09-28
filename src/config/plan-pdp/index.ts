import type { PlanRouteId } from "@/config/plans";
import { assetImage } from "@/lib/assets";
import { planRouteToFamily } from "@/lib/plans/plan-route-map";

import { incertPdpContent } from "./incert";
import { ingeniousPdpContent } from "./ingenious";
import { insightPdpContent } from "./insight";
import { invisionPlusPdpContent } from "./invision-plus";
import type { PlanPdpLine, PlanPdpProductContent, PlanPdpVariantContent } from "./types";

export type {
  PlanPdpCapability,
  PlanPdpCapabilityIcon,
  PlanPdpLine,
  PlanPdpProductContent,
  PlanPdpVariantContent,
} from "./types";

const planPdpCatalog: Record<PlanRouteId, PlanPdpProductContent> = {
  incert: incertPdpContent,
  insight: insightPdpContent,
  ingenious: ingeniousPdpContent,
  "invision-plus": invisionPlusPdpContent,
};

export function getPlanPdpVariant(
  planId: PlanRouteId,
  line: PlanPdpLine
): PlanPdpVariantContent {
  return planPdpCatalog[planId][line];
}

export function planPdpHeroImage(planId: PlanRouteId): string {
  const family = planRouteToFamily(planId);
  const heroByFamily: Record<string, string> = {
    incert: "hero-incert-concept.webp",
    insight: "hero-insight-concept.webp",
    ingenious: "hero-ingenious-concept.webp",
    invisionplus: "hero-invisionplus-concept.webp",
  };
  return assetImage(heroByFamily[family] ?? "hero-incert-concept.webp");
}
