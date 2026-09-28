import { CustomerStoriesSection } from "@/components/testimonials/customer-stories-section";
import { homeStoriesSection } from "@/config/customer-stories";

export function TestimonialsSection() {
  const section = homeStoriesSection;

  return (
    <CustomerStoriesSection
      variant="home"
      id={section.id}
      titleId={section.titleId}
      eyebrow={section.eyebrow}
      title={section.title}
      description={section.description}
      stories={[...section.stories]}
    />
  );
}
