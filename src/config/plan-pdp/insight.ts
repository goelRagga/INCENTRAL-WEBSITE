import { assetImage } from "@/lib/assets";

import { edgeEcoSpec } from "./hardware-specs";
import { inroutePlatform } from "./shared-media";
import type { PlanPdpProductContent } from "./types";

const capabilities = [
  {
    icon: "driver" as const,
    title: "Driver Behaviour Reports",
    description: "See recurring driver behaviour patterns in reports.",
  },
  {
    icon: "fuel" as const,
    title: "Fuel Consumption Insights",
    description: "See basic fuel-consumption trends alongside fleet activity.",
  },
  {
    icon: "fault" as const,
    title: "Vehicle Fault Codes",
    description: "See vehicle fault codes in the same fleet view.",
  },
  {
    icon: "repair" as const,
    title: "Repair Guidance",
    description: "Give maintenance teams clear repair guidance using available vehicle data.",
  },
];

const shared = {
  tagline: "Turn everyday fleet activity into smarter decisions.",
  value: {
    title: "See fuel use and vehicle faults more clearly.",
    lead: "Build on core tracking with fuel consumption insights, vehicle fault codes and repair guidance.",
    whoFor: "Fleets that need tracking plus fuel and repair visibility on the same platform.",
    chooseOther: "Choose InGenious if predictive health and full fuel management matter next.",
    highlightsTitle: "InSight highlights",
    capabilities,
  },
  media: {
    platform: {
      ...inroutePlatform,
      title: "See fuel and fault data alongside fleet activity in InRoute.",
      description: "Review consumption trends, fault codes and repair guidance in one place.",
    },
    hardware: {
      eyebrow: "InSight hardware",
      title: "EdgeEco hardware.",
      deviceImage: assetImage("edgeeco-device.webp"),
      deviceAlt: "EdgeEco hardware",
      highlights: [
        { label: "GNSS", value: "NavIC (IRNSS) + GPS with GAGAN support" },
        { value: "IP67", compact: true },
        { value: "OTA Updates", compact: true },
      ],
    },
  },
  tech: {
    deviceName: "EdgeEco",
    intro: "This plan uses EdgeEco hardware.",
    rows: edgeEcoSpec,
  },
};

const orderStandard = {
  title: "Setup, then start using InRoute.",
  steps: [
    {
      title: "Install the hardware",
      description: "Self-install or choose installation by Intangles.",
    },
    {
      title: "InRoute access",
      description: "Your team completes setup and enables access.",
    },
  ],
};

const orderAis = {
  title: "From fitment to InRoute access.",
  steps: [
    {
      title: "Install the hardware",
      description: "Self-install or choose installation by Intangles.",
    },
    {
      title: "AIS-140 certification",
      description: "Intangles completes the certification step after fitment.",
    },
    {
      title: "InRoute access",
      description: "Your InRoute access follows certification.",
    },
  ],
};

export const insightPdpContent: PlanPdpProductContent = {
  standard: {
    lineLabel: "Standard",
    summary:
      "See where fuel and vehicle issues are creating waste, so your team can act sooner.",
    ...shared,
    media: {
      ...shared.media,
      hardware: { ...shared.media.hardware, description: "Tracking hardware for Standard." },
    },
    order: orderStandard,
    compareBadge: "Standard",
  },
  ais: {
    lineLabel: "AIS-140 Certified",
    summary:
      "AIS-140 certified tracking with fuel and repair visibility for regulated fleets.",
    ...shared,
    media: {
      ...shared.media,
      hardware: {
        ...shared.media.hardware,
        description: "AIS-140 certified EdgeEco hardware.",
      },
    },
    order: orderAis,
    compareBadge: "AIS-140 Certified",
  },
};
