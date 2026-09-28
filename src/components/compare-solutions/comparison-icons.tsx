import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  FileText,
  Fuel,
  LayoutGrid,
  TriangleAlert,
  UserRound,
  Video,
} from "lucide-react";

import type { FeatureGroupIconId } from "@/config/feature-comparison";

const groupIconMap: Record<FeatureGroupIconId, LucideIcon> = {
  grid: LayoutGrid,
  driver: UserRound,
  alerts: TriangleAlert,
  score: BarChart3,
  camera: Video,
  report: FileText,
  fuel: Fuel,
  pulse: Activity,
};

export function FeatureGroupIcon({
  icon,
  className,
}: {
  icon: FeatureGroupIconId;
  className?: string;
}) {
  const Icon = groupIconMap[icon];
  return <Icon className={className} aria-hidden strokeWidth={1.75} />;
}

export function FeatureRowIcon({ className }: { className?: string }) {
  return <FileText className={className} aria-hidden strokeWidth={1.75} />;
}
