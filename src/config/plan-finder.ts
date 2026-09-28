export type NeedOptionConfig = {
  id: string;
  value: string;
  kind: "tracking" | "fuel" | "health" | "video" | "driver" | "operations";
  title: string;
  description: string;
};

export const planFinderSection = {
  id: "check-compatibility",
  titleId: "planFinderTitle",
  eyebrow: "Find the right solution",
  title: "Find the right solution for your fleet.",
  description: "Tell us about your vehicles. We will show the solutions that fit.",
  phoneLabel: "Prefer to talk?",
  phoneCta: "Call us",
  vehicleStep: {
    kicker: "Start here",
    title: "Tell us about your vehicle.",
    segmentLabel: "Vehicle type",
    segmentPlaceholder: "Choose vehicle type",
    makeLabel: "Manufacturer",
    makePlaceholder: "Choose manufacturer",
    emissionLabel: "Emission standard",
    emissionPlaceholder: "Choose emission standard",
    needsEyebrow: "Tailored for your fleet",
    needsTitle: "What are you trying to improve?",
    needsDescription:
      "Choose the priorities that matter for this vehicle.",
    needsGroupLabel: "What are you trying to improve?",
    submitLabel: "See solutions that fit",
    validationError:
      "Choose the vehicle type, manufacturer and emission standard.",
  },
  resultsStep: {
    summaryLabel: "Vehicle details",
    editLabel: "Edit",
    plansKicker: "Plans that fit",
    planRailLabel: "Plans that fit",
    planRailHint: "Choose a solution to review the fit and price.",
    resultsIntro:
      "Select a solution to review what it includes and see the price for your vehicle.",
    unverifiedMessage:
      "We could not find a plan for these vehicle details. Check the details or contact us.",
  },
  commerce: {
    aisHeadline: "Choose AIS-140 Certified or Standard",
    priceNote: "Per vehicle · 2 years · excl. GST",
    devicesLabel: "Devices",
    totalNote: "Product total · excl. GST",
    stateLabel: "State for AIS-140 coverage",
    statePlaceholder: "Select state / union territory",
    featuresSummary: "See all included features",
    cartSuccessKicker: "Added to your cart",
    cartAnotherLabel: "Check another vehicle type",
    cartViewLabel: "View cart",
  },
} as const;

export const needOptions: NeedOptionConfig[] = [
  {
    id: "tracking",
    value: "tracking",
    kind: "tracking",
    title: "Track vehicles and manage trips",
    description: "Know where vehicles are, where they stop and how trips run.",
  },
  {
    id: "fuel",
    value: "fuel_package",
    kind: "fuel",
    title: "Reduce fuel waste",
    description: "Understand consumption, fuel loss and repair needs.",
  },
  {
    id: "health",
    value: "predictive_health",
    kind: "health",
    title: "Prevent unexpected breakdowns",
    description: "Predict issues early and plan maintenance.",
  },
  {
    id: "driver",
    value: "driver_behaviour",
    kind: "driver",
    title: "Improve driver behaviour",
    description: "Track risky and inefficient driving patterns.",
  },
  {
    id: "operations",
    value: "fleet_automation",
    kind: "operations",
    title: "Run fleet operations more efficiently",
    description: "Automate fleet tasks, reporting and performance follow-up.",
  },
  {
    id: "video",
    value: "ai_video_telematics",
    kind: "video",
    title: "Improve driver and road safety",
    description: "AI video, road alerts and in-cabin feedback.",
  },
];

export const MAX_DIRECT_CART_QTY = 25;
