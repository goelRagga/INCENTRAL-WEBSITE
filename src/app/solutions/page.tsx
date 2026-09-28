import { SolutionsPage } from "@/components/solutions";
import { solutionsPage } from "@/config/plans";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: solutionsPage.metadata.title,
  description: solutionsPage.metadata.description,
  path: "/solutions",
});

export default function SolutionsRoute() {
  return <SolutionsPage />;
}
