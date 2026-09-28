"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import { Container } from "@/components/common/container";
import { PlanPdpContainer } from "@/components/plan-pdp/plan-pdp-container";
import { ComparisonMark } from "@/components/compare-solutions/comparison-mark";
import {
  FeatureGroupIcon,
  FeatureRowIcon,
} from "@/components/compare-solutions/comparison-icons";
import {
  comparisonPlanLabels,
  comparisonPlanOrder,
  featureComparisonGroups,
  getGroupInclusionState,
  type FeatureComparisonGroup,
  type FeatureGroupId,
} from "@/config/feature-comparison";
import { getPlanProductById, type PlanRouteId } from "@/config/plans";
import { cn } from "@/lib/utils";

type SolutionComparisonSectionProps = {
  id?: string;
  mode?: "standalone" | "plan-pdp";
  currentPlanId?: PlanRouteId;
  badgeLabel?: string;
  compareLine?: "ais" | "standard";
  subtitle?: string;
  className?: string;
};

export function SolutionComparisonSection({
  id = "compare-solutions-main",
  mode = "standalone",
  currentPlanId,
  badgeLabel,
  compareLine = "standard",
  subtitle,
  className,
}: SolutionComparisonSectionProps) {
  const [activeGroupId, setActiveGroupId] = useState<FeatureGroupId | null>(null);

  const activeGroup = useMemo(
    () => featureComparisonGroups.find((g) => g.id === activeGroupId) ?? null,
    [activeGroupId]
  );

  const openGroup = useCallback((groupId: FeatureGroupId) => {
    setActiveGroupId(groupId);
  }, []);

  const resolvedBadge =
    badgeLabel ?? (mode === "standalone" ? "Capabilities" : "Standard");

  const resolvedSubtitle =
    subtitle ??
    (mode === "standalone"
      ? "Select any capability group to see exactly what each solution includes."
      : "Select any feature group to open the detailed feature-by-feature comparison.");

  const SectionContainer = mode === "plan-pdp" ? PlanPdpContainer : Container;

  return (
    <>
      <section
        id={id}
        aria-labelledby={`${id}-title`}
        data-line={compareLine}
        className={cn(
          "pcmp-section",
          mode === "standalone" && "compare-standalone",
          className
        )}
      >
        <SectionContainer>
          <div className="pcmp-shell">
            <div className="pcmp-head">
              <div className="pcmp-head-copy">
                <p className="eyebrow">Compare solutions</p>
                <h2 id={`${id}-title`}>Compare the solution range.</h2>
                <p>{resolvedSubtitle}</p>
              </div>
              <span className="pcmp-current">{resolvedBadge}</span>
            </div>

            <div className="pcmp-main-wrap">
              <table className="pcmp-main-table">
                <thead>
                  <tr>
                    <th scope="col">Feature group</th>
                    {comparisonPlanOrder.map((planId) => (
                      <th key={planId} scope="col" data-plan={planId}>
                        <span className="pcmp-plan-head">
                          <strong>{comparisonPlanLabels[planId]}</strong>
                          <span>
                            {currentPlanId === planId ? "Current Solution" : ""}
                          </span>
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {featureComparisonGroups.map((group) => (
                    <tr key={group.id}>
                      <th scope="row">
                        <button
                          type="button"
                          className="pcmp-group-trigger"
                          data-feature-group={group.id}
                          data-line={compareLine}
                          onClick={() => openGroup(group.id)}
                        >
                          <span className="pcmp-group-icon">
                            <FeatureGroupIcon icon={group.icon} className="size-[18px]" />
                          </span>
                          <span className="pcmp-group-text">
                            <strong>{group.title}</strong>
                            <small>
                              {group.features.length} feature
                              {group.features.length === 1 ? "" : "s"} · Select to view details
                            </small>
                          </span>
                          <span className="pcmp-group-open">View</span>
                        </button>
                      </th>
                      {comparisonPlanOrder.map((planId) => (
                        <td key={planId} data-plan={planId}>
                          <ComparisonMark state={getGroupInclusionState(group, planId)} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </SectionContainer>
      </section>

      <FeatureGroupDialog
        group={activeGroup}
        open={activeGroup !== null}
        onOpenChange={(open) => {
          if (!open) setActiveGroupId(null);
        }}
        currentPlanId={currentPlanId}
        comparePage={mode === "standalone"}
      />
    </>
  );
}

function FeatureGroupDialog({
  group,
  open,
  onOpenChange,
  currentPlanId,
  comparePage,
}: {
  group: FeatureComparisonGroup | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlanId?: PlanRouteId;
  comparePage: boolean;
}) {
  if (!group) return null;

  const featureCountLabel = `${group.features.length} feature${group.features.length === 1 ? "" : "s"}`;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="pcmp-dialog-backdrop" />
        <DialogPrimitive.Popup className="pcmp-dialog">
          <div className="pcmp-modal">
            <div className="pcmp-modal-head">
              <div className="pcmp-modal-titlewrap">
                <span className="pcmp-modal-icon">
                  <FeatureGroupIcon icon={group.icon} className="size-[23px]" />
                </span>
                <div>
                  <DialogPrimitive.Title className="pcmp-modal-kicker">
                    Feature comparison
                  </DialogPrimitive.Title>
                  <h3>{group.title}</h3>
                  <DialogPrimitive.Description className="pcmp-modal-sub">
                    {comparePage ? featureCountLabel : `Standard line · ${featureCountLabel}`}
                  </DialogPrimitive.Description>
                </div>
              </div>
              <DialogPrimitive.Close
                type="button"
                aria-label="Close comparison"
                className="pcmp-close"
              >
                ×
              </DialogPrimitive.Close>
            </div>

            <div className="pcmp-table-wrap">
              <table className="pcmp-table">
                <thead>
                  <tr>
                    <th scope="col">Feature</th>
                    {comparisonPlanOrder.map((planId) => (
                      <th key={planId} scope="col" data-plan={planId}>
                        <span className="pcmp-plan-head">
                          <strong>{comparisonPlanLabels[planId]}</strong>
                          <span>
                            {currentPlanId === planId ? "Current solution" : ""}
                          </span>
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {group.features.map((feature) => (
                    <tr key={feature.name}>
                      <th scope="row">
                        <span className="pcmp-feature">
                          <span className="pcmp-feature-icon" aria-hidden="true">
                            <FeatureRowIcon icon={feature.icon} />
                          </span>
                          <span className="pcmp-feature-name">{feature.name}</span>
                        </span>
                      </th>
                      {comparisonPlanOrder.map((planId) => (
                        <td key={planId} data-plan={planId}>
                          <ComparisonMark
                            state={feature.inclusion[planId] ? "included" : "excluded"}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pcmp-modal-foot">
              <p>✓ Included &nbsp;&nbsp; × Not included</p>
              <Link href="/#check-compatibility" className="btn primary">
                Check Compatibility
              </Link>
            </div>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export function CompareSolutionsProgression() {
  const progression = [
    { step: "01 · Tracking", productId: "incert" as const },
    { step: "02 · Fuel & repair", productId: "insight" as const },
    { step: "03 · Predictive health", productId: "ingenious" as const },
    { step: "04 · Predictive + video", productId: "invision-plus" as const },
  ];

  const progressionCopy: Record<PlanRouteId, string> = {
    incert: "Location, trips, geofencing and core driver alerts.",
    insight: "Add fuel consumption insights, fault visibility and repair guidance.",
    ingenious: "Add predictive vehicle health, full fuel management and fleet automation.",
    "invision-plus":
      "Add AI-Driven Video Telematics, road-risk alerts and in-cabin feedback.",
  };

  return (
    <section aria-label="Solution progression" className="compare-progression">
      <Container>
        <div className="compare-progression-grid">
          {progression.map(({ step, productId }) => {
            const product = getPlanProductById(productId);
            if (!product) return null;

            return (
              <article key={productId} className="compare-solution-card">
                <span>{step}</span>
                <h2>{product.name}</h2>
                <p>{progressionCopy[productId]}</p>
                <Link href={product.href}>View {product.name} →</Link>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
