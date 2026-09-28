import Link from "next/link";

import { Container } from "@/components/common/container";
import {
  CompareSolutionsProgression,
  SolutionComparisonSection,
} from "@/components/compare-solutions/solution-comparison-section";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Compare Solutions",
  description:
    "Compare InCentral fleet intelligence solutions by capability. Check vehicle compatibility to see available options and pricing.",
  path: "/compare-solutions",
});

export default function CompareSolutionsPage() {
  return (
    <main id="main" className="bg-white text-[#14232b]">
      <section
        aria-labelledby="compareHeroTitle"
        className="border-b border-[#e3e9ec] bg-[linear-gradient(180deg,#f8fbfd_0%,#fff_72%)] py-14 pb-12"
      >
        <Container>
          <p className="m-0 text-[11px] font-bold tracking-[0.12em] text-[#1767ad] uppercase">
            Compare solutions
          </p>
          <h1
            id="compareHeroTitle"
            className="mt-3 mb-0 max-w-[760px] text-[clamp(32px,4vw,44px)] leading-[1.05] font-normal tracking-[-0.04em] text-[#163541]"
          >
            See how each InCentral solution builds on the last.
          </h1>
          <p className="mt-4 mb-0 max-w-[680px] text-[15px] leading-[1.55] text-[#61747d]">
            Compare included capabilities across InCert, InSight, InGenious and InVision+. Check
            your vehicle when you are ready to see compatible options and pricing.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/#check-compatibility"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-inc-blue bg-inc-blue px-5 text-[14px] font-semibold text-white no-underline hover:bg-inc-blue-dark"
            >
              Check compatibility
            </Link>
            <a
              href="#compare-solutions-main"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#c9d5dc] bg-white px-5 text-[14px] font-semibold text-[#15242d] no-underline hover:bg-[#f6f7f7]"
            >
              Compare capabilities
            </a>
          </div>
          <p className="mt-4 mb-0 text-[13px] text-[#6d7c84]">
            Pricing is shown after vehicle compatibility is confirmed.
          </p>
        </Container>
      </section>

      <CompareSolutionsProgression />

      <section aria-label="Solution comparison table" className="border-t border-[#e3e9ec] bg-white">
        <SolutionComparisonSection mode="standalone" />
        <Container className="pb-12">
          <div className="mt-[22px] flex items-center justify-between gap-6 rounded-[15px] border border-[#dae3e8] bg-[#f8fafb] px-[22px] py-5 max-[960px]:flex-col max-[960px]:items-start max-[620px]:gap-4">
            <p className="m-0 max-w-[720px] text-[14px] leading-[1.5] text-[#60737c]">
              Found the capabilities you need? Check your vehicle to see which solutions are
              compatible and reveal pricing.
            </p>
            <Link
              href="/#check-compatibility"
              className="inline-flex shrink-0 items-center justify-center rounded-full border border-inc-blue bg-inc-blue px-6 py-2.5 text-[14px] font-semibold whitespace-nowrap text-white no-underline hover:bg-inc-blue-dark max-[620px]:w-full max-[620px]:min-h-11"
            >
              Check compatibility &amp; price
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
