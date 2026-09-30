"use client";

import type { CSSProperties } from "react";
import Image from "next/image";

import { Spin } from "antd";

import { planFinderSection } from "@/config/plan-finder";
import { planAccentTokens } from "@/config/plans";
import {
  buildPlanNeedCopy,
  CAP_LABELS,
  INDIA_REGIONS,
  MAX_DIRECT_QTY,
  planMeta,
  planValueLabel,
  productFor,
} from "@/lib/plan-finder";
import { getZohoDescription } from "@/lib/commerce/catalog-prices";
import type { PlanFamily } from "@/lib/plan-finder";
import { cn } from "@/lib/utils";

import { PlanBadge } from "./plan-badge";
import { PlanFinderCartSuccess } from "./plan-finder-cart-success";
import { PlanWhySection } from "./plan-why-section";
import type { PlanFinderController } from "./use-plan-finder";

type PlanDetailPanelProps = {
  finder: PlanFinderController;
};

export function PlanDetailPanel({ finder }: PlanDetailPanelProps) {
  const { state, result, selectedRecommendation, cartSuccess } = finder;

  if (!result || result.status !== "VERIFIED" || !selectedRecommendation) {
    return null;
  }

  const family = selectedRecommendation.family as PlanFamily;
  const meta = planMeta[family];
  const tokens = planAccentTokens[family === "invisionplus" ? "invisionplus" : family];
  const product = productFor(family, state.aisRequired);
  const stdProduct = productFor(family, false);
  const aisProduct = productFor(family, true);
  const cov = finder.coverageStatus();
  const canProceed =
    !state.aisRequired || cov.status === "ready" || cov.status === "confirm";
  const badge = finder.getBadge(selectedRecommendation, result.recommendations.length, result);
  const qty = Math.max(1, state.quantity);
  const total = (product?.price || 0) * qty;

  const hasNeeds = finder.expandedNeeds.length > 0;
  const needCopy = buildPlanNeedCopy(
    selectedRecommendation,
    result,
    finder.expandedNeeds
  );
  const fitCopy = hasNeeds
    ? needCopy.fit || "✓ Compatible with your vehicle"
    : `✓ Fits ${result.summary.manufacturerLabel} · ${result.summary.emission}`;

  const coverageMessage = [
    finder.quoteThresholdNotice,
    state.aisRequired ? cov.copy : "",
  ]
    .filter(Boolean)
    .join(" ");

  const zohoDesc = getZohoDescription(family === "invisionplus" ? "invision-plus" : family);
  const caps = finder.cumulativeCapabilities(family);
  const isQuote = qty > MAX_DIRECT_QTY;
  const purchaseLabel = !finder.catalogReady
    ? "Loading prices…"
    : finder.purchasing
      ? "Adding…"
      : isQuote
        ? "Send Quote"
        : "Add to Cart";

  return (
    <article
      className={cn("grid min-h-full overflow-hidden rounded-[20px] border border-[#cfdee5] bg-white shadow-[0_14px_34px_rgba(20,52,68,0.07)] max-[1050px]:grid-cols-1 min-[1051px]:grid-cols-[minmax(0,1fr)_minmax(0,360px)]")}
      style={{ "--accent": tokens.accent } as CSSProperties}
    >
      <div className="relative flex min-w-0 flex-col justify-start px-[26px] pt-[26px] pb-[22px] before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-[var(--accent)] max-[760px]:px-[19px] max-[760px]:pt-[21px] max-[760px]:pb-[17px]">
        <div className="flex flex-wrap items-start gap-[9px]">
          <span className="text-[10px] leading-none font-semibold tracking-[0.07em] text-[var(--accent)] uppercase">
            {planValueLabel(family, state.aisRequired)}
          </span>
          {badge ? <PlanBadge label={badge.label} variant={badge.variant} /> : null}
        </div>
        <h4 className="mt-2 mb-0 text-[36px] leading-none font-medium tracking-[-0.045em] text-[#15343f] max-[760px]:text-[31px]">
          {meta.name}
        </h4>
        <p className="mt-[9px] mb-0 max-w-[560px] text-[13.5px] leading-[1.45] text-[#5f7480]">
          {zohoDesc ?? meta.desc}
        </p>
        <div className="mt-[13px] text-[11.5px] font-medium text-[#2f7057]">{fitCopy}</div>
        <PlanWhySection copy={needCopy} />
        <div className="mt-[18px] grid gap-2">
          {meta.key.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-[9px] text-[12.5px] font-medium text-[#38535f]"
            >
              <span className="grid size-5 place-items-center rounded-full bg-[color-mix(in_srgb,var(--accent)_10%,#fff)] text-[10px] text-[var(--accent)]">
                ✓
              </span>
              {feature}
            </div>
          ))}
        </div>
        <details className="mt-[18px] border-t border-[#e3eaed]">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-[11.5px] font-semibold text-[#1767ad] [&::-webkit-details-marker]:hidden after:text-lg after:font-normal after:content-['+'] open:after:content-['−']">
            {planFinderSection.commerce.featuresSummary}
          </summary>
          <div className="pb-1">
            <div className="grid grid-cols-2 gap-x-3.5 gap-y-1.5 max-[760px]:grid-cols-1">
              {caps.map((capability) => (
                <span
                  key={capability}
                  className="relative pl-3 text-[10.5px] leading-[1.35] text-[#566d77] before:absolute before:top-[0.48em] before:left-0 before:size-1 before:rounded-full before:bg-[var(--accent)] before:content-['']"
                >
                  {CAP_LABELS[capability] || capability}
                </span>
              ))}
            </div>
          </div>
        </details>
      </div>

      <aside className="flex min-w-0 flex-col border-[#d8e4e9] bg-[linear-gradient(180deg,#f5f9fb_0%,#eef5f8_100%)] max-[1050px]:border-t max-[1050px]:border-l-0 min-[1051px]:border-l">
        <div className="relative h-[158px] overflow-hidden bg-[#e5eef3] max-[1050px]:h-[130px] max-[760px]:h-[135px]">
          <Image src={meta.art} alt="" fill className="object-cover" sizes="400px" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col p-[18px] max-[1050px]:p-[15px]">
          {!cartSuccess ? (
            <div>
              <div className="flex items-end justify-between gap-3 max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-[3px]">
                <span className="text-xs font-semibold text-[#233f4b]">
                  {planFinderSection.commerce.aisHeadline}
                </span>
                <small className="text-[9.5px] text-[#7a8c95] max-[760px]:text-left min-[761px]:text-right">
                  {planFinderSection.commerce.priceNote}
                </small>
              </div>
              <div className="mt-[9px] grid grid-cols-2 gap-[7px]" role="group" aria-label={planFinderSection.commerce.aisHeadline}>
                <button
                  type="button"
                  className={cn(
                    "min-h-[58px] cursor-pointer rounded-xl border px-[11px] py-[9px] text-left",
                    state.aisRequired
                      ? "border-[var(--accent)] bg-white shadow-[0_0_0_2px_color-mix(in_srgb,var(--accent)_10%,transparent)]"
                      : "border-[#ccdce3] bg-white text-[#415b66]"
                  )}
                  onClick={() => finder.setAisRequired(true)}
                >
                  <span className="block text-[9.5px]">AIS-140 Certified</span>
                  <strong className="mt-1 block text-base font-semibold text-[#173844]">
                    {finder.formatMoney(aisProduct?.price || 0)}
                  </strong>
                </button>
                <button
                  type="button"
                  className={cn(
                    "min-h-[58px] cursor-pointer rounded-xl border px-[11px] py-[9px] text-left",
                    !state.aisRequired
                      ? "border-[var(--accent)] bg-white shadow-[0_0_0_2px_color-mix(in_srgb,var(--accent)_10%,transparent)]"
                      : "border-[#ccdce3] bg-white text-[#415b66]"
                  )}
                  onClick={() => finder.setAisRequired(false)}
                >
                  <span className="block text-[9.5px]">Standard</span>
                  <strong className="mt-1 block text-base font-semibold text-[#173844]">
                    {finder.formatMoney(stdProduct?.price || 0)}
                  </strong>
                </button>
              </div>

              {state.aisRequired ? (
                <div className="mt-[9px]">
                  <label
                    htmlFor="plan-finder-state"
                    className="mb-[5px] block text-[10px] font-semibold text-[#627680]"
                  >
                    {planFinderSection.commerce.stateLabel}
                  </label>
                  <select
                    id="plan-finder-state"
                    value={state.stateId}
                    onChange={(event) => finder.setStateId(event.target.value)}
                    className="h-[38px] w-full rounded-[9px] border border-[#c8d8df] bg-white px-2.5 text-[11px] text-[#29434f]"
                  >
                    <option value="">{planFinderSection.commerce.statePlaceholder}</option>
                    {INDIA_REGIONS.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div className="mt-auto grid grid-cols-[104px_minmax(0,1fr)] items-end gap-2 pt-3.5 max-[760px]:grid-cols-[98px_minmax(0,1fr)]">
                <label>
                  <span className="mb-[5px] block text-[9.5px] font-semibold tracking-[0.05em] text-[#637780] uppercase">
                    {planFinderSection.commerce.devicesLabel}
                  </span>
                  <div className="grid h-12 grid-cols-[28px_1fr_28px] overflow-hidden rounded-[11px] border border-[#c7d8df] bg-white">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      className="cursor-pointer border-0 bg-transparent text-base text-[#45606b]"
                      onClick={() => finder.setQuantity(qty - 1)}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      step={1}
                      inputMode="numeric"
                      aria-label="Number of devices"
                      value={qty}
                      onChange={(event) => finder.setQuantity(Number(event.target.value))}
                      className="min-w-0 w-full border-0 bg-transparent text-center text-[13px] font-semibold text-[#173844] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      className="cursor-pointer border-0 bg-transparent text-base text-[#45606b]"
                      onClick={() => finder.setQuantity(qty + 1)}
                    >
                      +
                    </button>
                  </div>
                </label>
                <button
                  type="button"
                  disabled={!canProceed || finder.purchasing || !finder.catalogReady}
                  className="flex h-12 items-center justify-center gap-2 cursor-pointer rounded-[11px] border-0 bg-[#176fc0] text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(23,111,192,0.18)] hover:bg-[#0e61ae] disabled:cursor-not-allowed disabled:opacity-[0.48]"
                  onClick={finder.purchaseSelected}
                >
                  {finder.purchasing ? <Spin size="small" /> : null}
                  {purchaseLabel}
                </button>
              </div>

              <div
                aria-live="polite"
                className="mt-3.5 flex items-center justify-between gap-5 rounded-[13px] border border-[#d6e2ef] bg-[linear-gradient(135deg,#f7faff_0%,#eef5fd_100%)] px-4 py-[15px] shadow-[inset_0_1px_0_rgba(255,255,255,0.86)] max-[560px]:gap-3 max-[560px]:px-3.5"
              >
                <div className="min-w-0">
                  <span className="block text-[13px] leading-[1.25] font-semibold text-[#263b48]">
                    Total for {qty} {qty === 1 ? "device" : "devices"}
                  </span>
                  <small className="mt-1 block text-[11.5px] leading-[1.3] text-[#70808a]">
                    {planFinderSection.commerce.totalNote}
                  </small>
                </div>
                <strong className="shrink-0 text-[22px] leading-none font-semibold tracking-[-0.025em] text-[#123f70] max-[560px]:text-xl">
                  {finder.formatMoney(total)}
                </strong>
              </div>

              {finder.error ? (
                <p className="mt-2 text-[9.5px] leading-[1.35] text-[#c0392b]">
                  {finder.error}
                </p>
              ) : coverageMessage ? (
                <p className="mt-2 min-h-3.5 text-[9.5px] leading-[1.35] text-[#667b85]">
                  {coverageMessage}
                </p>
              ) : null}
            </div>
          ) : (
            <PlanFinderCartSuccess
              title={cartSuccess.title}
              summary={cartSuccess.summary}
              onAnother={finder.resetForAnother}
              className="flex-1"
            />
          )}
        </div>
      </aside>
    </article>
  );
}
