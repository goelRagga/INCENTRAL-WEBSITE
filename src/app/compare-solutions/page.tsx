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
      <section aria-labelledby="compareHeroTitle" className="compare-page-hero">
        <Container>
          <p className="eyebrow">Compare solutions</p>
          <h1 id="compareHeroTitle">
            See how each InCentral solution builds on the last.
          </h1>
          <p>
            Compare included capabilities across InCert, InSight, InGenious and InVision+. Check
            your vehicle when you are ready to see compatible options and pricing.
          </p>
          <div className="compare-page-actions">
            <Link href="/#check-compatibility" className="btn primary">
              Check compatibility
            </Link>
            <a href="#compare-solutions-main" className="btn secondary">
              Compare capabilities
            </a>
          </div>
          <p className="compare-page-note">
            Pricing is shown after vehicle compatibility is confirmed.
          </p>
        </Container>
      </section>

      <CompareSolutionsProgression />

      <section aria-label="Solution comparison table" className="compare-table-section">
        <SolutionComparisonSection mode="standalone" />
        <Container>
          <div className="compare-bottom">
            <p>
              Found the capabilities you need? Check your vehicle to see which solutions are
              compatible and reveal pricing.
            </p>
            <Link href="/#check-compatibility" className="btn primary">
              Check compatibility &amp; price
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
