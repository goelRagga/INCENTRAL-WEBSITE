import type { PlanRouteId } from "@/config/plans";

export const comparisonPlanOrder: PlanRouteId[] = [
  "incert",
  "insight",
  "ingenious",
  "invision-plus",
];

export type FeatureGroupIconId =
  | "grid"
  | "driver"
  | "alerts"
  | "score"
  | "camera"
  | "report"
  | "fuel"
  | "pulse";

export type FeatureIconId = string;

type RawFeature = [name: string, inclusion: [number, number, number, number], icon: FeatureIconId];

export type FeatureGroupId =
  | "core-features"
  | "driver-base"
  | "fleet-insights"
  | "driver-insight"
  | "reports"
  | "predictive-intelligence"
  | "driveiq"
  | "fuel-module"
  | "video-alerts";

export type FeatureComparisonRow = {
  name: string;
  icon: FeatureIconId;
  inclusion: Record<PlanRouteId, boolean>;
};

export type FeatureComparisonGroup = {
  id: FeatureGroupId;
  title: string;
  icon: FeatureGroupIconId;
  features: FeatureComparisonRow[];
};

function mapInclusion(values: [number, number, number, number]): Record<PlanRouteId, boolean> {
  return {
    incert: Boolean(values[0]),
    insight: Boolean(values[1]),
    ingenious: Boolean(values[2]),
    "invision-plus": Boolean(values[3]),
  };
}

function featuresFromRaw(rows: RawFeature[]): FeatureComparisonRow[] {
  return rows.map(([name, inclusion, icon]) => ({
    name,
    icon,
    inclusion: mapInclusion(inclusion),
  }));
}

const groupsRecord: Record<
  FeatureGroupId,
  Omit<FeatureComparisonGroup, "features"> & { rawFeatures: RawFeature[] }
> = {
  "core-features": {
    id: "core-features",
    title: "Core Features",
    icon: "grid",
    rawFeatures: [
      ["Real-Time Location Tracking", [1, 1, 1, 1], "location"],
      ["Hub Activity Reports", [1, 1, 1, 1], "hub"],
      ["Trip Management with Geofencing", [1, 1, 1, 1], "geofence"],
    ],
  },
  "driver-base": {
    id: "driver-base",
    title: "Driver Behaviour Alerts",
    icon: "driver",
    rawFeatures: [
      ["Panic Switch", [1, 1, 1, 1], "panic"],
      ["Over Speed", [1, 1, 1, 1], "speed"],
      ["Harsh Acceleration", [1, 1, 1, 1], "accel"],
      ["Hard Brake", [1, 1, 1, 1], "brake"],
      ["Stoppage", [1, 1, 1, 1], "stop"],
      ["Night Driving", [1, 1, 1, 1], "night"],
      ["Continuous Driving", [1, 1, 1, 1], "clock"],
      ["Slow Running", [1, 1, 1, 1], "slow"],
      ["Geofence", [1, 1, 1, 1], "geofence"],
    ],
  },
  "fleet-insights": {
    id: "fleet-insights",
    title: "Fleet Insights",
    icon: "report",
    rawFeatures: [
      ["Driver Behaviour Reports", [0, 1, 1, 1], "driver"],
      ["Fuel Consumption Insights", [0, 1, 1, 1], "fuel"],
      ["Vehicle Fault Codes", [0, 1, 1, 1], "warning"],
      ["Repair Guidance", [0, 1, 1, 1], "wrench"],
    ],
  },
  "driver-insight": {
    id: "driver-insight",
    title: "Additional Driver Behaviour Alerts",
    icon: "alerts",
    rawFeatures: [
      ["Engine Overrun", [0, 1, 1, 1], "engine"],
      ["Idling", [0, 1, 1, 1], "idle"],
      ["Freerunning", [0, 1, 1, 1], "coast"],
      ["Regen Inhibit", [0, 1, 1, 1], "regen"],
      ["Air Conditioning ON", [0, 1, 1, 1], "ac"],
    ],
  },
  reports: {
    id: "reports",
    title: "Reports",
    icon: "report",
    rawFeatures: [
      ["Hub To Hub Report", [1, 1, 1, 1], "route"],
      ["Hub Stoppage Report", [1, 1, 1, 1], "stop"],
      ["Vehicle Daily Report", [1, 1, 1, 1], "report"],
      ["Fleet Daily Report", [0, 0, 1, 1], "fleet"],
      ["ODO Report", [0, 0, 1, 1], "odo"],
      ["Vehicle Movement Report", [0, 0, 1, 1], "route"],
      ["Vehicle Summary Report", [0, 0, 1, 1], "report"],
    ],
  },
  "predictive-intelligence": {
    id: "predictive-intelligence",
    title: "Predictive Intelligence",
    icon: "pulse",
    rawFeatures: [
      ["Predictive Vehicle Health Monitoring", [0, 0, 1, 1], "pulse"],
      ["Comprehensive Fuel Management Insights", [0, 0, 1, 1], "fuel"],
      ["Automated Fleet Tasks", [0, 0, 1, 1], "automation"],
      ["Cost & Fuel Impact", [0, 0, 1, 1], "cost"],
      ["Advanced Driver Behaviour Monitoring", [0, 0, 1, 1], "driver"],
    ],
  },
  driveiq: {
    id: "driveiq",
    title: "DriveIQ Scorecard Metrics",
    icon: "score",
    rawFeatures: [
      ["Fuel Efficiency: Over Speeding", [0, 0, 1, 1], "speed"],
      ["Fuel Efficiency: Over-revving", [0, 0, 1, 1], "rpm"],
      ["Fuel Efficiency: Last Gear %", [0, 0, 1, 1], "gear"],
      ["Fuel Efficiency: Last 2 Gear %", [0, 0, 1, 1], "gear"],
      ["Fuel Efficiency: Idling", [0, 0, 1, 1], "idle"],
      ["Fuel Efficiency: Free Running", [0, 0, 1, 1], "coast"],
      ["Fuel Efficiency: Hard Braking", [0, 0, 1, 1], "brake"],
      ["Fuel Efficiency: First Pickup %", [0, 0, 1, 1], "accel"],
      ["Safety: Hard Braking", [0, 0, 1, 1], "brake"],
      ["Safety: Over Speeding", [0, 0, 1, 1], "speed"],
      ["Safety: Continuous Driving", [0, 0, 1, 1], "clock"],
      ["Safety: Free Running", [0, 0, 1, 1], "coast"],
      ["Safety: Harsh Acceleration", [0, 0, 1, 1], "accel"],
      ["Safety: Night Driving", [0, 0, 1, 1], "night"],
    ],
  },
  "fuel-module": {
    id: "fuel-module",
    title: "Fuel Module",
    icon: "fuel",
    rawFeatures: [
      ["Fleet Performance fuel efficiency view", [0, 0, 1, 1], "efficiency"],
      [
        "Idling and AC-on-while-idling breakdown, with fuel loss in rupees",
        [0, 0, 1, 1],
        "idle",
      ],
      [
        "Overspeeding / hard braking / harsh acceleration / freerunning / AC-on views",
        [0, 0, 1, 1],
        "analytics",
      ],
      ["Refill and theft event log", [0, 0, 1, 1], "fuel"],
    ],
  },
  "video-alerts": {
    id: "video-alerts",
    title: "Video Telematics",
    icon: "camera",
    rawFeatures: [
      ["AI-Driven Video Telematics", [0, 0, 0, 1], "camera"],
      ["Video-on-Demand", [0, 0, 0, 1], "play"],
      ["Passive ADAS", [0, 0, 0, 1], "adas"],
      ["Driver Attendance Logging", [0, 0, 0, 1], "attendance"],
      ["In-Cabin Voice Alerts", [0, 0, 0, 1], "voice"],
      ["Unverified Driver", [0, 0, 0, 1], "person"],
      ["Forward Collision Warning", [0, 0, 0, 1], "collision"],
      ["Pedestrian Collision Warning", [0, 0, 0, 1], "pedestrian"],
      ["Distracted Driving", [0, 0, 0, 1], "distracted"],
      ["Driver Drowsiness", [0, 0, 0, 1], "drowsy"],
      ["Lens Covered", [0, 0, 0, 1], "lens"],
      ["Mobile Phone Usage", [0, 0, 0, 1], "phone"],
      ["No Face Detected", [0, 0, 0, 1], "face"],
      ["SD Card Tampered", [0, 0, 0, 1], "storage"],
      ["Seat Belt Violation", [0, 0, 0, 1], "seatbelt"],
      ["Lane Discipline Warning", [0, 0, 0, 1], "lane"],
      ["Tailgating", [0, 0, 0, 1], "tailgate"],
      ["Emergency Recording", [0, 0, 0, 1], "record"],
      ["Eye Closure", [0, 0, 0, 1], "eye"],
      ["Live Streaming", [0, 0, 0, 1], "stream"],
    ],
  },
};

export const featureComparisonGroupOrder: FeatureGroupId[] = [
  "core-features",
  "driver-base",
  "fleet-insights",
  "driver-insight",
  "reports",
  "predictive-intelligence",
  "driveiq",
  "fuel-module",
  "video-alerts",
];

export const featureComparisonGroups: FeatureComparisonGroup[] =
  featureComparisonGroupOrder.map((id) => {
    const group = groupsRecord[id];
    return {
      id: group.id,
      title: group.title,
      icon: group.icon,
      features: featuresFromRaw(group.rawFeatures),
    };
  });

export type GroupInclusionState = "yes" | "no" | "partial";

export function getGroupInclusionState(
  group: FeatureComparisonGroup,
  planId: PlanRouteId
): GroupInclusionState {
  const total = group.features.length;
  const included = group.features.filter((f) => f.inclusion[planId]).length;
  if (included === 0) return "no";
  if (included === total) return "yes";
  return "partial";
}

export const comparisonPlanLabels: Record<PlanRouteId, string> = {
  incert: "InCert",
  insight: "InSight",
  ingenious: "InGenious",
  "invision-plus": "InVision+",
};
