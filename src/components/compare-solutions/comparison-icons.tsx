import type { FeatureGroupIconId } from "@/config/feature-comparison";
import {
  featureComparisonGroupIconPaths,
  featureComparisonIconPaths,
} from "@/lib/feature-comparison/feature-icon-paths";

type ComparisonSvgProps = {
  markup: string;
  className?: string;
};

function ComparisonSvg({ markup, className }: ComparisonSvgProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={className}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}

export function FeatureGroupIcon({
  icon,
  className,
}: {
  icon: FeatureGroupIconId;
  className?: string;
}) {
  const markup =
    featureComparisonGroupIconPaths[icon] ??
    featureComparisonGroupIconPaths.grid;
  return <ComparisonSvg markup={markup} className={className} />;
}

export function FeatureRowIcon({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) {
  const markup =
    featureComparisonIconPaths[icon] ?? featureComparisonIconPaths.report;
  return <ComparisonSvg markup={markup} className={className} />;
}
