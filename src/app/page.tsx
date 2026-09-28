import { HeroSection, ProofSection, TestimonialsSection } from "@/components/home";
import { PlanFinderSection } from "@/components/plan-finder";
import { PlansSection } from "@/components/plans";
import { plansSectionHome } from "@/config/plans";
import { proofSectionHome } from "@/config/proof";

export default function HomePage() {
  const plans = plansSectionHome;

  return (
    <main id="main">
      <HeroSection />
      <PlansSection
        id={plans.id}
        titleId={plans.titleId}
        eyebrow={plans.eyebrow}
        title={plans.title}
        description={plans.description}
        cards={plans.cards}
        gridLabel={plans.gridLabel}
      />
      <PlanFinderSection />
      <TestimonialsSection />
      <ProofSection {...proofSectionHome} />
    </main>
  );
}
