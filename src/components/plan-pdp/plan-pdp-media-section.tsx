import { Eyebrow } from "@/components/layout/marketing";
import type { PlanPdpVariantContent } from "@/config/plan-pdp";
import { cn } from "@/lib/utils";

import { PlanPdpContainer } from "./plan-pdp-container";

type PlanPdpMediaSectionProps = {
  media: PlanPdpVariantContent["media"];
};

export function PlanPdpMediaSection({ media }: PlanPdpMediaSectionProps) {
  const { platform, hardware } = media;
  const isDriveAi = hardware.eyebrow.toLowerCase().includes("drive");

  return (
    <section className="pdp-media-section">
      <PlanPdpContainer>
        <div className="grid items-stretch gap-[22px] min-[901px]:grid-cols-[minmax(0,1.68fr)_minmax(300px,1fr)] max-[900px]:grid-cols-1">
          <article className="flex min-w-0 flex-col overflow-hidden rounded-[22px] border border-[#dbe5eb] bg-white shadow-[0_12px_32px_rgba(24,49,67,0.055)]">
            <div className="min-h-0 px-7 pt-[22px] pb-5 max-[620px]:px-[18px] max-[620px]:pt-[18px]">
              <Eyebrow>InRoute</Eyebrow>
              <h2 className="mt-2.5 mb-0 text-[clamp(24px,2.2vw,31px)] leading-[1.08] font-medium tracking-[-0.035em]">
                {platform.title}
              </h2>
              <p className="mt-2 mb-0 text-[13.5px] leading-[1.52] text-[#687982]">
                {platform.description}
              </p>
            </div>
            <div className="mx-7 mb-7 flex min-h-[310px] flex-1 items-end justify-center overflow-hidden rounded-2xl border border-[#dfe8ed] bg-white px-5 pt-[18px] max-[900px]:min-h-[270px] max-[620px]:mx-4 max-[620px]:mb-[18px] max-[620px]:min-h-[215px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={platform.imageAlt}
                decoding="async"
                loading="lazy"
                src={platform.image}
                className="block h-auto w-[96%] max-w-none object-contain max-[900px]:max-h-[225px] max-[620px]:max-h-[180px]"
              />
            </div>
          </article>

          <article className="flex min-w-0 flex-col overflow-hidden rounded-[22px] border border-[#dbe5eb] bg-white shadow-[0_12px_32px_rgba(24,49,67,0.055)]">
            <div className="min-h-0 px-7 pt-[22px] pb-0 max-[620px]:px-[18px] max-[620px]:pt-[18px]">
              <Eyebrow>{hardware.eyebrow}</Eyebrow>
              <h2 className="mt-2.5 mb-0 text-[clamp(24px,2.2vw,31px)] leading-[1.08] font-medium tracking-[-0.035em]">
                {hardware.title}
              </h2>
              <p className="mt-2 mb-0 text-[13.5px] leading-[1.52] text-[#687982]">
                {hardware.description}
              </p>
            </div>
            <div
              aria-label="EdgeEco key hardware specifications"
              className={cn(
                "mx-7 mt-[18px] mb-[22px] grid grid-cols-2 gap-x-[22px] gap-y-0 max-[620px]:mx-[18px] max-[420px]:grid-cols-1",
                isDriveAi && "gap-y-0"
              )}
            >
              {hardware.highlights.map((item, index) => {
                const isFirst = index === 0;
                const isSecond = index === 1;
                const isThird = index === 2;

                return (
                  <div
                    key={`${item.label ?? ""}-${item.value}`}
                    className={cn(
                      "flex flex-col items-start gap-[5px] p-0",
                      isFirst &&
                        "col-span-2 mb-4 grid grid-cols-[72px_minmax(0,1fr)] items-start gap-x-[18px] border-b border-[#e2e8ec] pb-4 max-[620px]:mb-3.5 max-[620px]:grid-cols-1 max-[620px]:gap-y-[5px] max-[620px]:pb-3.5",
                      isThird && "border-l border-[#e2e8ec] pl-[22px] max-[620px]:pl-4 max-[420px]:border-l-0 max-[420px]:pl-0",
                      isSecond &&
                        "max-[420px]:mb-3.5 max-[420px]:border-b max-[420px]:border-[#e2e8ec] max-[420px]:pb-3.5"
                    )}
                  >
                    {item.label ? (
                      <span className="mt-0.5 text-[10px] leading-[1.2] font-bold tracking-[0.095em] text-[#71818a] uppercase max-[620px]:mt-0">
                        {item.label}
                      </span>
                    ) : null}
                    <strong
                      className={cn(
                        "m-0 text-[15px] leading-[1.35] font-[650] tracking-[-0.015em] text-[#1f2c33]",
                        item.compact && !isFirst && "text-[17px] leading-[1.2] tracking-[-0.02em]",
                        isDriveAi && item.compact && !item.label && "text-sm leading-[1.35] tracking-[-0.012em]"
                      )}
                    >
                      {item.value}
                    </strong>
                  </div>
                );
              })}
            </div>
            <div className="mx-7 mb-7 flex min-h-[310px] flex-1 items-center justify-center overflow-hidden rounded-2xl border border-[#dfe8ed] bg-white p-5 max-[900px]:min-h-[270px] max-[620px]:mx-4 max-[620px]:mb-[18px] max-[620px]:min-h-[215px] max-[620px]:p-[18px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={hardware.deviceAlt}
                decoding="async"
                loading="lazy"
                src={hardware.deviceImage}
                className="block h-full w-full max-h-[255px] object-contain max-[900px]:max-h-[225px] max-[620px]:max-h-[180px]"
              />
            </div>
          </article>
        </div>
      </PlanPdpContainer>
    </section>
  );
}
