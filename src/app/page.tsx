import { HeroSection, ProofSection, TestimonialsSection } from "@/components/home";
import { PlanFinderSection } from "@/components/plan-finder";
import { SolutionsSection } from "@/components/solutions";
import { solutionsSectionHome } from "@/config/plans";
import { proofSectionHome } from "@/config/proof";

export default function HomePage() {
  const solutions = solutionsSectionHome;

  return (
    <main id="main">
      <HeroSection />
      <SolutionsSection
        id={solutions.id}
        titleId={solutions.titleId}
        eyebrow={solutions.eyebrow}
        title={solutions.title}
        description={solutions.description}
        cards={solutions.cards}
        gridLabel={solutions.gridLabel}
      />
      <PlanFinderSection />
      <TestimonialsSection />
      <ProofSection {...proofSectionHome} />
    </main>
  );
}
