import { Eyebrow } from "@/components/layout/marketing";
import type { PlanPdpVariantContent } from "@/config/plan-pdp";

import { PlanPdpContainer } from "./plan-pdp-container";
import { PlanPdpCapIcon } from "./plan-pdp-cap-icons";

type PlanValueShowcaseProps = {
  content: PlanPdpVariantContent["value"];
};

export function PlanValueShowcase({ content }: PlanValueShowcaseProps) {
  return (
    <section className="pdp-value-showcase relative overflow-hidden">
      <PlanPdpContainer>
        <div className="relative overflow-hidden rounded-[28px] border border-[#d6e3eb] bg-white/95 p-[34px] shadow-[0_22px_54px_rgba(20,43,61,0.07)] max-[760px]:rounded-[22px] max-[760px]:p-[22px]">
          <div className="relative z-[1] grid items-start gap-[30px] min-[981px]:grid-cols-[minmax(0,1.18fr)_minmax(300px,0.82fr)] max-[980px]:grid-cols-1">
            <div>
              <Eyebrow>What this plan includes</Eyebrow>
              <h2 className="m-0 max-w-[780px] text-[clamp(34px,3.2vw,46px)] leading-[1.03] font-normal tracking-[-0.045em] max-[760px]:text-[34px]">
                {content.title}
              </h2>
              <p className="mt-[15px] max-w-[760px] text-[15.5px] leading-[1.65] text-[#5d707a]">
                {content.lead}
              </p>
            </div>
            <aside className="overflow-hidden p-0 max-[980px]:max-w-[650px]">
              <div className="grid h-full">
                <div className="border-b border-[#dbe3e8] bg-white px-5 py-[18px]">
                  <span className="mb-1.5 block text-[10.5px] font-bold tracking-[0.07em] text-inc-blue uppercase">
                    Who this is for
                  </span>
                  <p className="m-0 text-[13.5px] leading-[1.48] text-[#344b55]">{content.whoFor}</p>
                </div>
                <div className="bg-[#f7f9fb] px-5 py-[18px]">
                  <span className="mb-1.5 block text-[10.5px] font-bold tracking-[0.07em] text-[#647780] uppercase">
                    Choose another solution if
                  </span>
                  <p className="m-0 text-[13.5px] leading-[1.48] text-[#344b55]">{content.chooseOther}</p>
                </div>
              </div>
            </aside>
          </div>
          <div className="relative z-[1] mt-5 rounded-[23px] border border-[#dbe6ec] bg-[#f7fafc] p-6 max-[760px]:p-[18px]">
            <div className="mb-[17px] grid items-end gap-7 min-[981px]:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] max-[980px]:grid-cols-1">
              <div>
                <span className="block text-[10.5px] font-semibold tracking-[0.095em] text-[#607887] uppercase">
                  Included features
                </span>
                <h3 className="mt-1.5 mb-0 text-2xl font-semibold tracking-[-0.03em]">
                  {content.highlightsTitle}
                </h3>
              </div>
            </div>
            <div className="grid gap-3 min-[761px]:grid-cols-2 max-[760px]:grid-cols-1">
              {content.capabilities.map((cap) => (
                <article
                  key={cap.title}
                  className="grid grid-cols-[44px_minmax(0,1fr)] items-start gap-[13px] rounded-[17px] border border-[#dce6ec] bg-white p-4 transition-[border-color,box-shadow] hover:border-[#bdd3e5] hover:shadow-[0_9px_22px_rgba(20,47,67,0.05)]"
                >
                  <div className="grid size-11 place-items-center rounded-[14px] bg-[#edf5ff] text-[#1765ad] shadow-[inset_0_0_0_1px_#d2e3f4] [&_svg]:size-5 [&_svg]:stroke-[1.8]">
                    <PlanPdpCapIcon icon={cap.icon} />
                  </div>
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="m-0 text-[15.5px] leading-[1.3] font-semibold tracking-[-0.015em]">
                        {cap.title}
                      </h4>
                    </div>
                    <p className="mt-1.5 mb-0 text-[12.8px] leading-normal text-[#677982]">
                      {cap.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </PlanPdpContainer>
    </section>
  );
}
