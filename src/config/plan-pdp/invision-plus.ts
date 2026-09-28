import { assetImage } from "@/lib/assets";

import { driveAiSpec } from "./hardware-specs";
import { inroutePlatform } from "./shared-media";
import type { PlanPdpProductContent } from "./types";

const capabilities = [
  {
    icon: "video" as const,
    title: "AI-Driven Video Telematics",
    description: "Review road and driver events with road-facing and cabin video.",
  },
  {
    icon: "adas" as const,
    title: "Passive ADAS Road-Risk Alerts",
    description: "See supported road-risk alerts from the camera system.",
  },
  {
    icon: "voice" as const,
    title: "In-Cabin Voice Alerts",
    description: "Give drivers immediate voice alerts for supported safety events.",
  },
  {
    icon: "vod" as const,
    title: "Video-on-Demand",
    description: "Request video when you need to review an event.",
  },
];

const shared = {
  tagline: "See the full story behind every journey.",
  value: {
    title: "Combine fleet monitoring with AI-Driven Video Telematics.",
    lead: "Bring predictive health, fuel intelligence and dual-camera video into one solution.",
    whoFor: "Fleets that need video safety alongside the full intelligence stack.",
    chooseOther: "Choose InGenious if video telematics is not required yet.",
    highlightsTitle: "InVision+ highlights",
    capabilities,
  },
  media: {
    platform: {
      ...inroutePlatform,
      title: "Review video events alongside fleet intelligence in InRoute.",
      description: "Connect road and cabin video with tracking, fuel and health signals.",
    },
    hardware: {
      eyebrow: "InVision+ hardware",
      title: "DriveAI hardware.",
      deviceImage: assetImage("driveai-device.webp"),
      deviceAlt: "DriveAI hardware",
      highlights: [
        { label: "Dual camera", value: "Road-facing and in-cabin visibility" },
        { value: "ADAS support", compact: true },
        { value: "Voice alerts", compact: true },
      ],
    },
  },
  tech: {
    deviceName: "DriveAI",
    intro: "This plan uses DriveAI video hardware.",
    rows: driveAiSpec,
  },
};

const orderStandard = {
  title: "Professional install, then InRoute.",
  steps: [
    {
      title: "Install the hardware",
      description: "Professional installation by Intangles.",
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
      description: "Professional installation by Intangles; EdgeEco included where required.",
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

export const invisionPlusPdpContent: PlanPdpProductContent = {
  standard: {
    lineLabel: "Standard",
    summary:
      "Bring vehicle intelligence and video together so your team can understand risk, context and performance.",
    ...shared,
    media: {
      ...shared.media,
      hardware: { ...shared.media.hardware, description: "DriveAI video hardware for Standard." },
    },
    order: orderStandard,
    compareBadge: "Standard",
  },
  ais: {
    lineLabel: "AIS-140 Certified",
    summary:
      "AIS-140 certified video telematics with predictive health and fuel intelligence.",
    ...shared,
    media: {
      ...shared.media,
      hardware: {
        ...shared.media.hardware,
        description: "DriveAI with AIS-140 certified EdgeEco where required.",
      },
    },
    order: orderAis,
    compareBadge: "AIS-140 Certified",
  },
};
