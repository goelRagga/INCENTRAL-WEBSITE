import { Container } from "@/components/common/container";
import { CtaBand, PageHero, SectionHead } from "@/components/layout/marketing";
import { MarketingCtaLink } from "@/components/ui/marketing-cta-link";
import { plansPage } from "@/config/plans";

import { PlansGrid } from "./plans-grid";

export function PlansPage() {
  const { hero, showcase, closeSection } = plansPage;

  return (
    <main id="main" className="bg-white text-[#14232b]">
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        titleId={hero.titleId}
        lead={hero.lead}
        actions={
          <>
            <MarketingCtaLink
              href={hero.primaryAction.href}
              className="max-[760px]:w-full"
            >
              {hero.primaryAction.label}
            </MarketingCtaLink>
            <MarketingCtaLink
              href={hero.secondaryAction.href}
              variant="secondary"
              className="max-[760px]:w-full"
            >
              {hero.secondaryAction.label}
            </MarketingCtaLink>
          </>
        }
      />

      <section
        aria-labelledby={showcase.titleId}
        className="h139-plans"
      >
        <Container>
          <SectionHead
            variant="h139"
            eyebrow={showcase.eyebrow}
            title={showcase.title}
            titleId={showcase.titleId}
            description={showcase.description}
          />
          <PlansGrid cards={showcase.cards} gridLabel={showcase.gridLabel} />
        </Container>
      </section>

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
