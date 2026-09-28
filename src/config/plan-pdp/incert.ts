import { assetImage } from "@/lib/assets";

import { edgeEcoSpec } from "./hardware-specs";
import { inroutePlatform } from "./shared-media";
import type { PlanPdpProductContent } from "./types";

const capabilities = [
  {
    icon: "location" as const,
    title: "Real-Time Location Tracking",
    description: "See vehicle position and movement as it happens.",
  },
  {
    icon: "hub" as const,
    title: "Hub Activity Reports",
    description: "Review hub arrivals, departures and stoppage activity.",
  },
  {
    icon: "driver" as const,
    title: "Driver Behaviour Alerts",
    description: "See the key driving behaviours that need attention.",
  },
  {
    icon: "trip" as const,
    title: "Trip Management with Geofencing",
    description: "Set trip boundaries and location-based geofences.",
  },
];

const shared = {
  tagline: "Keep your fleet visible and your day in control.",
  value: {
    title: "The basics for everyday fleet control.",
    lead: "Track vehicles, manage trips and hubs, set geofences and monitor key driver events.",
    whoFor: "Fleets that need core tracking, trips, geofencing and driver alerts.",
    chooseOther: "Choose InSight if fuel use, vehicle faults or repair guidance also matter.",
    highlightsTitle: "InCert highlights",
    capabilities,
  },
  media: {
    platform: inroutePlatform,
    hardware: {
      eyebrow: "InCert hardware",
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

export const incertPdpContent: PlanPdpProductContent = {
  standard: {
    lineLabel: "Standard",
    summary:
      "A clear, simple way to stay on top of vehicle movement and keep everyday fleet operations running smoothly.",
    ...shared,
    media: {
      ...shared.media,
      hardware: { ...shared.media.hardware, description: "Tracking hardware for Standard." },
    },
    order: {
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
    },
    compareBadge: "Standard",
  },
  ais: {
    lineLabel: "AIS-140 Certified",
    summary:
      "AIS-140 certified tracking for fleets that need regulatory compliance alongside everyday visibility.",
    ...shared,
    media: {
      ...shared.media,
      hardware: {
        ...shared.media.hardware,
        description: "AIS-140 certified EdgeEco hardware.",
      },
    },
    order: {
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
    },
    compareBadge: "AIS-140 Certified",
  },
};
