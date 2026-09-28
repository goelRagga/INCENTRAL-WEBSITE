import { assetImage } from "@/lib/assets";

import type { PlanFamily } from "./types";

export const CAP_LABELS: Record<string, string> = {
  real_time_location_tracking: "Real-time location tracking",
  hub_activity_reports: "Hub activity reports",
  driver_behaviour_alerts: "Driver behaviour alerts",
  trip_management_geofencing: "Trip management and geofencing",
  driver_behaviour_reports: "Driver behaviour reports",
  fuel_consumption_insights: "Fuel consumption insights",
  dtc_fault_code_visibility: "Vehicle fault codes",
  guided_repair_strategy: "Repair guidance",
  predictive_vehicle_health: "Predictive vehicle health",
  comprehensive_fuel_management: "Full fuel management",
  operations_automation: "Automated fleet tasks",
  quantification_engine: "Cost and fuel impact",
  advanced_driver_behaviour_monitoring: "Advanced driver monitoring",
  ai_driven_video_telematics: "AI-Driven Video Telematics",
  video_on_demand: "Video-on-demand",
  passive_adas: "Road-risk alerts (Passive ADAS)",
  driver_attendance_logging: "Driver attendance logging",
  in_cabin_voice_alerts: "In-cabin voice alerts",
};

export const NEED_ALIASES: Record<string, string[]> = {
  fuel_package: ["fuel_def", "repair_help"],
};

export const NEED_SHORT_LABELS: Record<string, string> = {
  tracking: "location tracking and trip management",
  fuel_def: "fuel consumption insights",
  repair_help: "vehicle fault codes and repair guidance",
  predictive_health: "predictive vehicle health",
  driver_behaviour: "driver behaviour monitoring",
  fleet_automation: "fleet operations and automation",
  ai_video_telematics: "driver and road safety",
};

export type PlanMeta = {
  name: string;
  value: { standard: string; ais: string };
  desc: string;
  art: string;
  key: string[];
  hardware: { standard: string; ais?: string };
  install: { standard: string; ais?: string };
};

export const planMeta: Record<PlanFamily, PlanMeta> = {
  incert: {
    name: "InCert",
    value: { standard: "Tracking", ais: "Tracking" },
    desc: "Track vehicles, trips and key driver activity.",
    art: assetImage("hero-incert-concept.webp"),
    key: ["Location, Trips & Geofencing", "Driver Alerts", "Fleet Reports"],
    hardware: { standard: "EdgeEco", ais: "EdgeEco" },
    install: {
      standard: "Self-install or Intangles installation",
      ais: "Self-install or Intangles installation",
    },
  },
  insight: {
    name: "InSight",
    value: { standard: "Fuel & repair", ais: "Fuel & repair" },
    desc: "Add fuel consumption insights, vehicle fault codes and repair guidance.",
    art: assetImage("hero-insight-concept.webp"),
    key: ["Fuel Consumption Insights", "Vehicle Fault Codes", "Repair Guidance"],
    hardware: { standard: "EdgeEco", ais: "EdgeEco" },
    install: {
      standard: "Self-install or Intangles installation",
      ais: "Self-install or Intangles installation",
    },
  },
  ingenious: {
    name: "InGenious",
    value: { standard: "Predictive health", ais: "Predictive health" },
    desc: "Add predictive vehicle health, full fuel management and fleet automation.",
    art: assetImage("hero-ingenious-concept.webp"),
    key: ["Predictive Vehicle Health", "Full Fuel Management", "Automated Fleet Tasks"],
    hardware: { standard: "EdgePrime", ais: "EdgeEco" },
    install: {
      standard: "Self-install or Intangles installation",
      ais: "Self-install or Intangles installation",
    },
  },
  invisionplus: {
    name: "InVision+",
    value: { standard: "Predictive + video", ais: "Predictive + video" },
    desc: "Add AI-Driven Video Telematics to tracking, full fuel management and predictive vehicle health.",
    art: assetImage("hero-invisionplus-concept.webp"),
    key: ["AI-Driven Video Telematics", "Dual-Camera Visibility", "In-Cabin Alerts"],
    hardware: { standard: "DriveAI", ais: "DriveAI + EdgeEco" },
    install: {
      standard: "Professional installation by Intangles",
      ais: "Professional installation by Intangles; EdgeEco included with AIS-140 Certified",
    },
  },
};

export function expandNeeds(rawNeeds: string[]): string[] {
  const expanded: string[] = [];
  rawNeeds.forEach((key) => {
    (NEED_ALIASES[key] || [key]).forEach((item) => expanded.push(item));
  });
  return expanded;
}

export function variantLabel(aisRequired: boolean) {
  return aisRequired ? "AIS-140 Certified" : "Standard";
}

export function planValueLabel(family: PlanFamily, aisRequired: boolean) {
  const meta = planMeta[family];
  return meta.value[aisRequired ? "ais" : "standard"];
}
