import Link from "next/link";

import { Container } from "@/components/common/container";
import { CtaBand } from "@/components/layout/marketing";
import { solutionsPage } from "@/config/plans";

import { SolutionsSection } from "./solutions-section";

export function SolutionsPage() {
  const { hero, showcase, closeSection } = solutionsPage;

  return (
    <main id="main" className="bg-white text-[#14232b]">
      <section
        aria-labelledby={hero.titleId}
        className="border-b border-[#e2e2dc] bg-inc-warm py-[52px] pb-[50px] max-[760px]:py-10 max-[760px]:pb-9"
      >
        <Container>
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1
            id={hero.titleId}
            className="m-0 max-w-[720px] text-[clamp(38px,3.9vw,56px)] leading-[1.01] font-normal tracking-[-0.045em] text-[#15242d]"
          >
            {hero.title}
          </h1>
          <p className="mt-4 max-w-[720px] text-[15px] leading-[1.6] text-[#596a72]">
            {hero.lead}
          </p>
          <div className="compare-page-actions mt-6 flex flex-wrap gap-2.5 max-[760px]:grid max-[760px]:w-full max-[760px]:grid-cols-1">
            <Link href={hero.primaryAction.href} className="btn primary max-[760px]:w-full">
              {hero.primaryAction.label}
            </Link>
            <Link
              href={hero.secondaryAction.href}
              className="btn secondary max-[760px]:w-full"
            >
              {hero.secondaryAction.label}
            </Link>
          </div>
        </Container>
      </section>

      <SolutionsSection
        id="solutions"
        titleId={showcase.titleId}
        eyebrow={showcase.eyebrow}
        title={showcase.title}
        description={showcase.description}
        cards={showcase.cards}
        gridLabel={showcase.gridLabel}
      />

      <CtaBand
        eyebrow={closeSection.eyebrow}
        title={closeSection.title}
        description={closeSection.description}
        primaryAction={closeSection.primaryAction}
        secondaryAction={closeSection.secondaryAction}
      />
    </main>
  );
}
