import { assetImage } from "@/lib/assets";

import { edgeEcoSpec, edgePrimeSpec } from "./hardware-specs";
import { inroutePlatform } from "./shared-media";
import type { PlanPdpProductContent } from "./types";

const capabilities = [
  {
    icon: "health" as const,
    title: "Predictive Vehicle Health Monitoring",
    description: "Spot developing vehicle problems before they become breakdowns.",
  },
  {
    icon: "fuel" as const,
    title: "Full Fuel Management",
    description:
      "Go beyond basic consumption to see fuel loss, refills, theft and efficiency trends.",
  },
  {
    icon: "automation" as const,
    title: "Automated Fleet Tasks",
    description: "Automate recurring fleet checks and routine actions.",
  },
  {
    icon: "analytics" as const,
    title: "Cost & Fuel Impact",
    description: "See the cost and fuel impact of fleet events.",
  },
];

const shared = {
  tagline: "Stay ahead of problems before they slow you down.",
  value: {
    title: "Act before small problems become bigger ones.",
    lead: "Add predictive vehicle health, full fuel management and fleet automation on top of core visibility.",
    whoFor: "Operators ready for predictive intelligence and automated fleet workflows.",
    chooseOther: "Choose InVision+ if video safety and cabin visibility also matter.",
    highlightsTitle: "InGenious highlights",
    capabilities,
  },
  media: {
    platform: {
      ...inroutePlatform,
      title: "Use predictive and fuel intelligence in InRoute.",
      description: "See health signals, fuel trends and automated fleet actions together.",
    },
    hardware: {
      eyebrow: "InGenious hardware",
      title: "EdgePrime hardware.",
      deviceImage: assetImage("edgeprime-device.webp"),
      deviceAlt: "EdgePrime hardware",
      highlights: [
        { label: "GNSS", value: "NavIC (IRNSS) + GPS with GAGAN support" },
        { value: "IP67", compact: true },
        { value: "OTA Updates", compact: true },
      ],
    },
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

export const ingeniousPdpContent: PlanPdpProductContent = {
  standard: {
    lineLabel: "Standard",
    summary:
      "Use smarter fleet intelligence to reduce surprises, plan earlier and keep vehicles running.",
    ...shared,
    media: {
      ...shared.media,
      hardware: {
        ...shared.media.hardware,
        title: "EdgePrime hardware.",
        description: "Predictive hardware for Standard.",
      },
    },
    tech: {
      deviceName: "EdgePrime",
      intro: "This plan uses EdgePrime hardware.",
      rows: edgePrimeSpec,
    },
    order: orderStandard,
    compareBadge: "Standard",
  },
  ais: {
    lineLabel: "AIS-140 Certified",
    summary:
      "AIS-140 certified fitment with predictive health and full fuel management capabilities.",
    ...shared,
    media: {
      ...shared.media,
      hardware: {
        ...shared.media.hardware,
        title: "EdgeEco hardware.",
        deviceImage: assetImage("edgeeco-device.webp"),
        description: "AIS-140 certified EdgeEco with InGenious capabilities.",
      },
    },
    tech: {
      deviceName: "EdgeEco",
      intro: "This plan uses EdgeEco hardware with AIS-140 certification.",
      rows: edgeEcoSpec,
    },
    order: orderAis,
    compareBadge: "AIS-140 Certified",
  },
};
