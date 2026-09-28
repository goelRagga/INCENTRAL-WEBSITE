"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { XIcon } from "lucide-react";

import { Container } from "@/components/common/container";
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
  /** Standalone compare page vs embedded on a plan PDP */
  mode?: "standalone" | "plan-pdp";
  currentPlanId?: PlanRouteId;
  badgeLabel?: string;
  subtitle?: string;
  className?: string;
};

export function SolutionComparisonSection({
  id = "compare-solutions-main",
  mode = "standalone",
  currentPlanId,
  badgeLabel,
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

  const closeDialog = useCallback(() => {
    setActiveGroupId(null);
  }, []);

  const resolvedBadge =
    badgeLabel ?? (mode === "standalone" ? "Capabilities" : "Standard");

  const resolvedSubtitle =
    subtitle ??
    (mode === "standalone"
      ? "Select any capability group to see exactly what each solution includes."
      : "Select any feature group to open the detailed feature-by-feature comparison.");

  return (
    <>
      <section
        id={id}
        aria-labelledby={`${id}-title`}
        data-line="standard"
        className={cn(
          mode === "standalone" ? "bg-white py-0" : "bg-white py-[54px] pb-[58px]",
          className
        )}
      >
        <Container>
          <div className="pb-6">
            <div className="flex flex-col items-start justify-between gap-3.5 min-[761px]:flex-row min-[761px]:items-end min-[761px]:gap-7">
              <div className="max-w-[720px]">
                <p className="m-0 mb-2.5 text-[11px] font-bold tracking-[0.12em] text-[#1767ad] uppercase">
                  Compare solutions
                </p>
                <h2
                  id={`${id}-title`}
                  className="m-0 text-[clamp(30px,2.8vw,42px)] leading-[1.06] font-normal tracking-[-0.038em] text-[#17212b]"
                >
                  Compare the solution range.
                </h2>
                <p className="mt-3 mb-0 max-w-[720px] text-[15px] leading-[1.6] text-[#64757d]">
                  {resolvedSubtitle}
                </p>
              </div>
              <span className="inline-flex min-h-8 shrink-0 items-center justify-center rounded-full border border-[#d5e2ec] bg-[#f5f8fa] px-3 text-[11px] font-bold tracking-[0.065em] text-[#526773] uppercase">
                {resolvedBadge}
              </span>
            </div>

            <div className="mt-6 overflow-x-auto overscroll-x-contain rounded-[18px] border border-[#dfe6eb] bg-white [scrollbar-gutter:stable_both-edges]">
              <table className="w-full min-w-[780px] table-fixed border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="sticky left-0 z-[4] h-16 w-[36%] min-w-[300px] border-b border-[#dfe6eb] bg-[#f7f9fa] px-3.5 py-0 text-left text-[11px] font-bold tracking-[0.075em] text-[#65747e] uppercase"
                    >
                      Feature group
                    </th>
                    {comparisonPlanOrder.map((planId) => {
                      const isCurrent = currentPlanId === planId;
                      return (
                        <th
                          key={planId}
                          scope="col"
                          data-plan={planId}
                          className={cn(
                            "h-16 border-b border-[#dfe6eb] bg-[#f7f9fa] px-3.5 py-0 text-center align-middle text-[11px] font-bold tracking-[0.075em] text-[#65747e] uppercase",
                            isCurrent && "shadow-[inset_0_-2px_0_#1767ad]"
                          )}
                        >
                          <span className="relative flex h-16 w-full flex-col items-center justify-center gap-0">
                            <strong className="block text-base leading-[1.2] font-semibold tracking-[-0.018em] text-[#17212b] normal-case">
                              {comparisonPlanLabels[planId]}
                            </strong>
                            {isCurrent ? (
                              <span className="absolute bottom-[7px] left-1/2 min-h-[13px] -translate-x-1/2 text-[9.5px] leading-[1.2] font-semibold tracking-[0.065em] text-[#7b8992] uppercase">
                                Current Solution
                              </span>
                            ) : null}
                          </span>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {featureComparisonGroups.map((group) => (
                    <tr key={group.id}>
                      <th
                        scope="row"
                        className="sticky left-0 z-[2] border-b border-[#e5ebef] bg-white p-0 text-left align-middle last:border-b-0"
                      >
                        <button
                          type="button"
                          onClick={() => openGroup(group.id)}
                          className="flex min-h-[68px] w-full cursor-pointer items-center gap-3 border-0 bg-white px-4 py-3 text-left font-inherit text-[#17212b] hover:bg-[#f8fafc] focus-visible:bg-[#f8fafc] focus-visible:outline-none max-[760px]:min-h-16 max-[760px]:px-3"
                        >
                          <span className="grid size-9 shrink-0 place-items-center rounded-[10px] border border-[#e0e8ef] bg-[#f0f5fa] text-[#1767ad]">
                            <FeatureGroupIcon icon={group.icon} className="size-[18px]" />
                          </span>
                          <span className="grid min-w-0 gap-0.5">
                            <strong className="text-[15px] leading-[1.35] font-semibold tracking-[-0.006em] text-[#1d2a33]">
                              {group.title}
                            </strong>
                            <small className="text-xs leading-[1.35] font-normal text-[#71808a]">
                              {group.features.length} feature
                              {group.features.length === 1 ? "" : "s"} · Select to view details
                            </small>
                          </span>
                          <span className="ml-auto hidden text-xs font-semibold whitespace-nowrap text-[#1767ad] min-[761px]:inline">
                            View →
                          </span>
                        </button>
                      </th>
                      {comparisonPlanOrder.map((planId) => {
                        const state = getGroupInclusionState(group, planId);
                        const isCurrent = currentPlanId === planId;
                        return (
                          <td
                            key={planId}
                            data-plan={planId}
                            className={cn(
                              "h-[68px] border-b border-[#e5ebef] bg-white px-3.5 py-3 text-center align-middle last:border-b-0 max-[760px]:h-16",
                              isCurrent && "bg-[#f3f7fb]"
                            )}
                          >
                            <ComparisonMark state={state} />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </section>

      <FeatureGroupDialog
        group={activeGroup}
        open={activeGroup !== null}
        onOpenChange={(open) => {
          if (!open) closeDialog();
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
        <DialogPrimitive.Backdrop
          className={cn(
            "fixed inset-0 z-[1200] bg-[rgba(8,20,31,0.62)] backdrop-blur-[5px]",
            "transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0"
          )}
        />
        <DialogPrimitive.Popup
          className={cn(
            "fixed top-1/2 left-1/2 z-[1201] flex max-h-[min(820px,calc(100vh-34px))] w-[min(1120px,calc(100vw-34px))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[20px] bg-white text-[#17212b] shadow-[0_30px_90px_rgba(9,24,37,0.26)]",
            "transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0",
            "max-[760px]:max-h-[calc(100vh-20px)] max-[760px]:w-[calc(100vw-20px)] max-[760px]:rounded-2xl"
          )}
        >
          <div className="flex max-h-[inherit] flex-col">
            <div className="flex items-start justify-between gap-5 border-b border-[#dce4eb] bg-[#fafcfd] px-[26px] pt-6 pb-5 max-[760px]:px-[17px] max-[760px]:pt-[19px]">
              <div className="flex items-start gap-3.5 max-[760px]:gap-2.5">
                <span className="grid size-[46px] shrink-0 place-items-center rounded-[13px] bg-[#eef4fa] text-[#1767ad] max-[760px]:size-[42px]">
                  <FeatureGroupIcon icon={group.icon} className="size-[23px]" />
                </span>
                <div>
                  <DialogPrimitive.Title className="m-0 text-[11px] font-bold tracking-[0.085em] text-[#1767ad] uppercase">
                    Feature comparison
                  </DialogPrimitive.Title>
                  <p className="m-0 mt-1 text-[26px] leading-[1.14] font-medium tracking-[-0.028em] text-[#17212b] max-[760px]:text-[22px]">
                    {group.title}
                  </p>
                  <DialogPrimitive.Description className="mt-1.5 mb-0 text-[13px] leading-normal text-[#667684]">
                    {comparePage ? featureCountLabel : `Standard line · ${featureCountLabel}`}
                  </DialogPrimitive.Description>
                </div>
              </div>
              <DialogPrimitive.Close
                aria-label="Close comparison"
                className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border border-[#d8e1e8] bg-white text-[22px] leading-none text-[#425463] hover:bg-[#f2f6f8] hover:text-[#17212b]"
              >
                <XIcon className="size-5" strokeWidth={1.75} />
              </DialogPrimitive.Close>
            </div>

            <div className="overflow-auto overscroll-contain bg-white">
              <table className="w-full min-w-[850px] border-separate border-spacing-0 max-[760px]:min-w-[720px]">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="sticky top-0 left-0 z-[5] min-w-[320px] bg-[#f7f9fa] px-4 py-3 text-left text-[11px] font-bold tracking-[0.07em] text-[#60707e] uppercase max-[760px]:min-w-[250px]"
                    >
                      Feature
                    </th>
                    {comparisonPlanOrder.map((planId) => {
                      const isCurrent = currentPlanId === planId;
                      return (
                        <th
                          key={planId}
                          scope="col"
                          data-plan={planId}
                          className={cn(
                            "sticky top-0 z-[3] h-14 bg-[#f7f9fa] px-3 py-3 text-center align-middle text-[11px] font-bold tracking-[0.07em] text-[#60707e] uppercase",
                            isCurrent && "shadow-[inset_0_-2px_0_#1767ad]"
                          )}
                        >
                          <span className="flex min-h-8 flex-col items-center justify-center gap-0.5">
                            <strong className="text-sm leading-[1.2] font-semibold tracking-[-0.01em] text-[#1d2933] normal-case">
                              {comparisonPlanLabels[planId]}
                            </strong>
                            {isCurrent ? (
                              <span className="text-[9.5px] tracking-[0.065em] text-[#7a8894] uppercase">
                                Current solution
                              </span>
                            ) : (
                              <span className="min-h-[13px]" aria-hidden />
                            )}
                          </span>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {group.features.map((feature) => (
                    <tr key={feature.name}>
                      <th
                        scope="row"
                        className="sticky left-0 z-[2] min-w-[320px] border-b border-[#e7edf2] bg-white px-4 py-3 text-left align-middle max-[760px]:min-w-[250px]"
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="grid size-[34px] shrink-0 place-items-center rounded-[10px] border border-[#e3eaf0] bg-[#f2f6fa] text-[#28679c]">
                            <FeatureRowIcon className="size-[18px]" />
                          </span>
                          <span className="text-sm leading-[1.35] font-semibold text-[#1c2933]">
                            {feature.name}
                          </span>
                        </span>
                      </th>
                      {comparisonPlanOrder.map((planId) => {
                        const included = feature.inclusion[planId];
                        const isCurrent = currentPlanId === planId;
                        return (
                          <td
                            key={planId}
                            data-plan={planId}
                            className={cn(
                              "h-[62px] border-b border-[#e7edf2] px-3 py-3 text-center align-middle",
                              isCurrent && "bg-[#f3f7fb]"
                            )}
                          >
                            <ComparisonMark state={included ? "included" : "excluded"} />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between gap-[18px] border-t border-[#dce4eb] bg-[#fbfcfd] px-[26px] py-[17px] max-[760px]:flex-col max-[760px]:items-stretch max-[760px]:px-[17px] max-[760px]:py-[15px]">
              <p className="m-0 text-xs leading-normal text-[#657582]">
                ✓ Included &nbsp;&nbsp; × Not included
              </p>
              <Link
                href={
                  currentPlanId
                    ? `/#check-compatibility?interest=${currentPlanId}`
                    : "/#check-compatibility"
                }
                className="inline-flex min-h-11 min-w-[170px] items-center justify-center rounded-xl border border-inc-blue bg-inc-blue px-5 text-[14px] font-semibold text-white no-underline hover:bg-inc-blue-dark max-[760px]:w-full"
              >
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

  return (
    <section aria-label="Solution progression" className="py-12">
      <Container>
        <div className="grid gap-4 min-[900px]:grid-cols-2 min-[1200px]:grid-cols-4">
          {progression.map(({ step, productId }) => {
            const product = getPlanProductById(productId);
            if (!product) return null;

            const progressionCopy: Record<PlanRouteId, string> = {
              incert: "Location, trips, geofencing and core driver alerts.",
              insight: "Add fuel consumption insights, fault visibility and repair guidance.",
              ingenious:
                "Add predictive vehicle health, full fuel management and fleet automation.",
              "invision-plus":
                "Add AI-Driven Video Telematics, road-risk alerts and in-cabin feedback.",
            };

            return (
              <article
                key={productId}
                className="compare-solution-card flex min-h-full flex-col rounded-[18px] border border-[#dde5e9] bg-white p-5 shadow-[0_8px_24px_rgba(24,40,51,0.04)]"
              >
                <span className="text-[11px] font-bold tracking-[0.06em] text-[#6a7880] uppercase">
                  {step}
                </span>
                <h2 className="mt-2 mb-0 text-[22px] font-semibold tracking-[-0.03em] text-[#163541]">
                  {product.name}
                </h2>
                <p className="mt-2 mb-0 flex-1 text-[13.5px] leading-[1.5] text-[#61747d]">
                  {progressionCopy[productId]}
                </p>
                <Link
                  href={product.href}
                  className="mt-4 inline-flex text-[13px] font-semibold text-[#1767ad] no-underline hover:underline"
                >
                  View {product.name} →
                </Link>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
