export type PlanPdpLine = "ais" | "standard";

export type PlanPdpCapabilityIcon =
  | "location"
  | "hub"
  | "driver"
  | "trip"
  | "fuel"
  | "fault"
  | "repair"
  | "health"
  | "automation"
  | "analytics"
  | "video"
  | "adas"
  | "voice"
  | "vod";

export type PlanPdpCapability = {
  icon: PlanPdpCapabilityIcon;
  title: string;
  description: string;
};

export type PlanPdpSpecRow =
  | { type: "group"; label: string }
  | { type: "row"; label: string; value: string };

export type PlanPdpOrderStep = {
  title: string;
  description: string;
};

export type PlanPdpVariantContent = {
  lineLabel: string;
  tagline: string;
  summary: string;
  value: {
    title: string;
    lead: string;
    whoFor: string;
    chooseOther: string;
    highlightsTitle: string;
    capabilities: PlanPdpCapability[];
  };
  media: {
    platform: { title: string; description: string; image: string; imageAlt: string };
    hardware: {
      eyebrow: string;
      title: string;
      description: string;
      deviceImage: string;
      deviceAlt: string;
      highlights: { label?: string; value: string; compact?: boolean }[];
    };
  };
  tech: {
    deviceName: string;
    intro: string;
    rows: PlanPdpSpecRow[];
  };
  order: {
    title: string;
    steps: PlanPdpOrderStep[];
  };
  compareBadge: string;
};

export type PlanPdpProductContent = Record<PlanPdpLine, PlanPdpVariantContent>;
