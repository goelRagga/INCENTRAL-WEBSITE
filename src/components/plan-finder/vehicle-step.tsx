"use client";

import { Spin } from "antd";

import { needOptions, planFinderSection } from "@/config/plan-finder";

import { NeedOption } from "./need-option";
import type { PlanFinderController } from "./use-plan-finder";
import { VehicleSelectField } from "./vehicle-select-field";

type VehicleStepProps = {
  finder: PlanFinderController;
};

export function VehicleStep({ finder }: VehicleStepProps) {
  const { state, error, segmentOptions, makeOptions, emissionOptions } = finder;
  const copy = planFinderSection.vehicleStep;

  return (
    <section aria-labelledby="planFinderVehicleTitle" className="px-[38px] pt-[34px] pb-[26px] max-[760px]:px-[17px] max-[760px]:pt-[23px]">
      <div className="mb-0">
        <span className="mb-1.5 block text-[11px] font-semibold tracking-[0.1em] text-[#1767ad] uppercase">
          {copy.kicker}
        </span>
        <h3
          id="planFinderVehicleTitle"
          className="m-0 text-[32px] leading-[1.05] font-normal tracking-[-0.04em] text-[#163541] min-[761px]:text-[clamp(29px,2.5vw,38px)]"
        >
          {copy.title}
        </h3>
      </div>

      <div className="mt-[26px] grid grid-cols-3 gap-0 overflow-visible rounded-[18px] border border-[#ccdbe3] bg-white shadow-[0_8px_22px_rgba(24,59,75,0.045)] max-[900px]:grid-cols-1 max-[900px]:overflow-hidden max-[900px]:rounded-2xl">
        <VehicleSelectField
          connected
          id="plan-finder-segment"
          label={copy.segmentLabel}
          placeholder={copy.segmentPlaceholder}
          value={state.segment}
          options={segmentOptions}
          onValueChange={finder.setSegment}
          className="max-[900px]:first:rounded-t-[15px] min-[901px]:first:rounded-l-[17px]"
        />

        <VehicleSelectField
          connected
          id="plan-finder-make"
          label={copy.makeLabel}
          placeholder={copy.makePlaceholder}
          value={state.make}
          disabled={!state.segment}
          options={makeOptions}
          onValueChange={finder.setMake}
        />

        <VehicleSelectField
          connected
          id="plan-finder-emission"
          label={copy.emissionLabel}
          placeholder={copy.emissionPlaceholder}
          value={state.emission}
          disabled={!state.make}
          options={emissionOptions}
          onValueChange={finder.setEmission}
          className="max-[900px]:last:rounded-b-[15px] min-[901px]:last:rounded-r-[17px]"
        />
      </div>

      <div className="relative mt-7 overflow-hidden rounded-[26px] border border-[#dce6ee] bg-[linear-gradient(145deg,#ffffff_0%,#fbfdff_56%,#f6faff_100%)] px-[30px] pt-[30px] pb-[26px] shadow-[0_15px_38px_rgba(28,58,78,0.055)] before:pointer-events-none before:absolute before:top-[-125px] before:right-[-120px] before:h-60 before:w-[340px] before:rounded-full before:bg-[radial-gradient(circle,rgba(53,132,225,0.09),rgba(53,132,225,0)_68%)] before:content-[''] max-[680px]:px-[18px] max-[680px]:pt-[22px] max-[680px]:pb-[18px]">
        <div className="relative z-[1] mb-[13px] inline-flex items-center gap-[9px] text-[11px] font-bold tracking-[0.075em] text-[#1267c7] uppercase">
          <span className="grid size-8 place-items-center rounded-[10px] bg-[#edf4ff] text-[#0b67d2] shadow-[inset_0_0_0_1px_rgba(11,103,210,0.04)]">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[17px]">
              <path d="m5 10 1.4-3.4A2 2 0 0 1 8.25 5.4h7.5a2 2 0 0 1 1.85 1.2L19 10" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="M4 10h16v7H4z" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="M6 17v2M18 17v2M7.5 13h.01M16.5 13h.01" fill="none" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </span>
          <span>{copy.needsEyebrow}</span>
        </div>
        <div className="relative z-[1] max-w-[840px]">
          <h4 className="m-0 text-[28px] leading-[1.08] font-semibold tracking-[-0.04em] text-[#102b3a] min-[681px]:text-[clamp(25px,2.2vw,34px)] max-[680px]:text-[25px]">
            {copy.needsTitle}
          </h4>
          <p className="mt-2.5 mb-0 text-[15px] leading-[1.55] text-[#687d8a] max-[680px]:text-[13.5px]">
            {copy.needsDescription}
          </p>
        </div>
        <div
          role="group"
          aria-label={copy.needsGroupLabel}
          className="relative z-[1] mt-6 grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-2 max-[680px]:mt-[18px] max-[680px]:grid-cols-1 max-[680px]:gap-2.5"
        >
          {needOptions.map((option) => (
            <NeedOption
              key={option.id}
              option={option}
              checked={finder.isNeedChecked(option.value)}
              onChange={(checked) => finder.toggleNeed(option.value, checked)}
            />
          ))}
        </div>
      </div>

      {error ? (
        <p className="mt-3.5 mb-0 rounded-[11px] bg-[#fff1ef] px-[13px] py-[11px] text-xs text-[#8b3b2e]">
          {error}
        </p>
      ) : null}

      <div className="mt-[22px] flex items-center justify-end gap-5 border-t border-[#e6ecef] pt-5 max-[760px]:flex-col max-[760px]:items-stretch">
        <button
          type="button"
          disabled={finder.catalogLoading}
          className="inline-flex min-h-[52px] cursor-pointer items-center justify-center gap-[13px] rounded-[13px] border-0 bg-[#0d67bd] px-[22px] text-sm font-semibold text-white shadow-[0_10px_24px_rgba(13,103,189,0.18)] transition-[background,transform] duration-150 hover:-translate-y-px hover:bg-[#075bab] disabled:cursor-not-allowed disabled:opacity-60 max-[760px]:w-full"
          onClick={finder.validateAndRecommend}
        >
          {finder.catalogLoading ? (
            <>
              <Spin size="small" />
              Loading…
            </>
          ) : (
            <>
              {copy.submitLabel}
              <span aria-hidden="true" className="text-lg font-normal">→</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}
