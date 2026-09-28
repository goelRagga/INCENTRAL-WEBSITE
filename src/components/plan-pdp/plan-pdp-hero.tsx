import Link from "next/link";

import { PlanPdpContainer } from "./plan-pdp-container";

type PlanPdpHeroProps = {
  planName: string;
  lineLabel: string;
  tagline: string;
  summary: string;
  heroImage: string;
  finderHref: string;
};

export function PlanPdpHero({
  planName,
  lineLabel,
  tagline,
  summary,
  heroImage,
  finderHref,
}: PlanPdpHeroProps) {
  return (
    <section className="pdp-hero border-b border-[#e2e2dc] bg-inc-warm">
      <PlanPdpContainer>
        <div className="grid items-center gap-7 min-[1101px]:grid-cols-[minmax(0,0.88fr)_minmax(460px,1.12fr)] min-[1101px]:gap-[42px] max-[1100px]:grid-cols-1 max-[1100px]:gap-7">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="inline-flex min-h-[27px] items-center rounded-full bg-[#eef4fb] px-2.5 text-[10.5px] font-semibold tracking-[0.07em] text-[#245f91] uppercase">
                {lineLabel}
              </span>
            </div>
            <h1 className="m-0 text-[clamp(46px,5vw,68px)] leading-[0.95] font-normal tracking-[-0.05em] max-[760px]:text-[48px]">
              {planName}
            </h1>
            <p className="mt-3.5 max-w-[720px] text-xl leading-[1.35] text-[#4f626d] max-[760px]:text-lg">
              {tagline}
            </p>
            <p className="mt-[18px] max-w-[720px] text-[15px] leading-[1.6] text-[#5e6f77]">
              {summary}
            </p>
            <div className="mt-6 grid items-end gap-5 border-t border-[#d9ddd9] pt-[22px] min-[761px]:grid-cols-[minmax(0,1fr)_auto] max-[760px]:grid-cols-1 max-[760px]:gap-4">
              <div className="min-w-0">
                <span className="block text-[11.5px] font-semibold tracking-[0.06em] text-[#6a797f] uppercase">
                  Pricing
                </span>
                <strong className="mt-1.5 block text-lg leading-[1.28] font-medium tracking-[-0.015em] text-[#15242d]">
                  See the price for your vehicle.
                </strong>
                <small className="mt-[5px] block max-w-[520px] text-[12.5px] leading-[1.48] text-[#687980]">
                  Confirm compatibility to view the plans and pricing that apply.
                </small>
              </div>
              <Link
                href={finderHref}
                className="inline-flex min-h-11 min-w-[220px] items-center justify-center rounded-xl border border-inc-blue bg-inc-blue px-[18px] text-sm font-semibold text-white no-underline hover:border-[#075ab8] hover:bg-[#075ab8] max-[760px]:w-full max-[760px]:min-w-0"
              >
                Check compatibility &amp; price
              </Link>
            </div>
          </div>
          <figure className="m-0 w-full overflow-hidden rounded-[22px] border border-[#d2dde3] bg-[#eaf0f4] shadow-[0_20px_42px_rgba(19,36,48,0.11)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={`${planName} product visual`}
              src={heroImage}
              className="block aspect-[16/10] w-full object-cover"
            />
          </figure>
        </div>
      </PlanPdpContainer>
    </section>
  );
}
