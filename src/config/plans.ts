export type PlanVariant = {
  label: string;
  href: string;
};

export type PlanAccent = "incert" | "insight" | "ingenious" | "invisionplus";

/** v375 h139-card family class on homepage solution cards */
export const planShowcaseCardClass: Record<PlanAccent, string> = {
  incert: "h139-incert",
  insight: "h139-insight",
  ingenious: "h139-ingenious",
  invisionplus: "h139-invision",
};

export type PlanAccentToken = {
  accent: string;
  tint: string;
  markShadow: string;
};

/** Pass 180 plan palette — shared by showcase cards, mega menu, finder, cart. */
export const planAccentTokens: Record<PlanAccent, PlanAccentToken> = {
  incert: {
    accent: "#00a6d6",
    tint: "#ecfafd",
    markShadow: "0 0 0 4px color-mix(in srgb, #00a6d6 10%, transparent)",
  },
  insight: {
    accent: "#0b8b86",
    tint: "#edf9f7",
    markShadow: "0 0 0 4px color-mix(in srgb, #0b8b86 10%, transparent)",
  },
  ingenious: {
    accent: "#2764d8",
    tint: "#eef3fd",
    markShadow: "0 0 0 4px color-mix(in srgb, #2764d8 10%, transparent)",
  },
  invisionplus: {
    accent: "#4a3fa5",
    tint: "#f1f0fa",
    markShadow: "0 0 0 4px color-mix(in srgb, #4a3fa5 10%, transparent)",
  },
};

/** Navigation mega menu — v375 pass 179 blue hierarchy */
export const planMegaMenuAccentTokens: Record<
  PlanAccent,
  { accent: string; tint: string; megaClass: string; mobileClass: string }
> = {
  incert: {
    accent: "#7bb9e9",
    tint: "#f3f8fd",
    megaClass: "inc-mega-incert",
    mobileClass: "inc-mobile-incert",
  },
  insight: {
    accent: "#458ed0",
    tint: "#eef5fb",
    megaClass: "inc-mega-insight",
    mobileClass: "inc-mobile-insight",
  },
  ingenious: {
    accent: "#1f68b0",
    tint: "#ebf2f9",
    megaClass: "inc-mega-ingenious",
    mobileClass: "inc-mobile-ingenious",
  },
  invisionplus: {
    accent: "#0a3c73",
    tint: "#e7eef6",
    megaClass: "inc-mega-invisionplus",
    mobileClass: "inc-mobile-invisionplus",
  },
};

export type PlanProduct = {
  id: string;
  name: string;
  category: string;
  description: string;
  href: string;
  accent: PlanAccent;
  variants: PlanVariant[];
};

export const plansMega = {
  kicker: "Solutions",
  title: "Explore the solution range",
  description:
    "Review product details or find the right solution for your fleet.",
  cta: {
    label: "Find the right solution",
    href: "/#check-compatibility",
  },
} as const;

export type PlanFeatureIconId =
  | "route"
  | "alert"
  | "report"
  | "fuel"
  | "fault"
  | "repair"
  | "health"
  | "automation"
  | "analytics"
  | "camera"
  | "dual"
  | "cabin";

export type PlanShowcaseFeature = {
  icon: PlanFeatureIconId;
  label: string;
};

export type PlanShowcaseCard = {
  id: string;
  accent: PlanAccent;
  value: string;
  number: string;
  image: string;
  name: string;
  tagline: string;
  href?: string;
  features: PlanShowcaseFeature[];
};

/** Homepage plan ladder — four core plans (informational cards). */
export const planShowcaseCards: PlanShowcaseCard[] = [
  {
    id: "incert",
    accent: "incert",
    value: "Tracking",
    number: "01",
    image: "/images/hero/hero-incert-concept.webp",
    name: "InCert",
    tagline: "Stay visible. Stay in control.",
    href: planHref("incert"),
    features: [
      { icon: "route", label: "Location, Trips & Geofencing" },
      { icon: "alert", label: "Driver Alerts" },
      { icon: "report", label: "Fleet Reports" },
    ],
  },
  {
    id: "insight",
    accent: "insight",
    value: "Fuel & repair",
    number: "02",
    image: "/images/hero/hero-insight-concept.webp",
    name: "InSight",
    tagline: "See where fuel and vehicle costs are going.",
    href: planHref("insight"),
    features: [
      { icon: "fuel", label: "Fuel Consumption Insights" },
      { icon: "fault", label: "Vehicle Fault Codes" },
      { icon: "repair", label: "Repair Guidance" },
    ],
  },
  {
    id: "ingenious",
    accent: "ingenious",
    value: "Predictive health",
    number: "03",
    image: "/images/hero/hero-ingenious-concept.webp",
    name: "InGenious",
    tagline: "Predict vehicle issues, manage fuel and automate fleet work.",
    href: planHref("ingenious"),
    features: [
      { icon: "health", label: "Predictive Vehicle Health" },
      { icon: "automation", label: "Automated Fleet Tasks" },
      { icon: "analytics", label: "Full Fuel Management" },
    ],
  },
  {
    id: "invision-plus",
    accent: "invisionplus",
    value: "Predictive + video",
    number: "04",
    image: "/images/hero/hero-invisionplus-concept.webp",
    name: "InVision+",
    tagline:
      "Add AI-Driven Video Telematics to tracking, fuel and predictive vehicle health.",
    href: planHref("invision-plus"),
    features: [
      { icon: "camera", label: "AI-Driven Video Telematics" },
      { icon: "dual", label: "Dual-Camera Visibility" },
      { icon: "cabin", label: "In-Cabin Alerts" },
    ],
  },
];

export const plansSectionHome = {
  id: "solutions",
  titleId: "h139PlansTitle",
  eyebrow: "Solutions",
  title: "Four solutions. See which ones fit your fleet.",
  description:
    "Start with tracking, then add fuel visibility, predictive vehicle health and AI-Driven Video Telematics as you move up the range.",
  cards: planShowcaseCards,
  gridLabel: "Intangles plans",
} as const;

export const plansPage = {
  metadata: {
    title: "Plans | InCentral",
    description:
      "Explore InCentral plans from tracking and fuel visibility to predictive vehicle health and AI-Driven Video Telematics.",
  },
  hero: {
    titleId: "plansPageTitle",
    eyebrow: plansMega.kicker,
    title: plansMega.title,
    lead: plansMega.description,
    primaryAction: plansMega.cta,
    secondaryAction: {
      label: "AIS-140 Guide",
      href: "/ais-140-guide",
    },
  },
  showcase: {
    titleId: "plansShowcaseTitle",
    eyebrow: "Solutions",
    title: "Four solutions. See which ones fit your fleet.",
    description: plansSectionHome.description,
    cards: planShowcaseCards,
    gridLabel: "Intangles plans",
  },
  closeSection: {
    eyebrow: "Find the right solution",
    title: "Not sure which solution fits your fleet?",
    description:
      "Tell us about your vehicles and needs. We will show the solutions that fit.",
    primaryAction: plansMega.cta,
    secondaryAction: { label: "Contact Support", href: "/support" },
  },
} as const;

export const planRouteIds = [
  "incert",
  "insight",
  "ingenious",
  "invision-plus",
] as const;

export type PlanRouteId = (typeof planRouteIds)[number];

export function isPlanRouteId(id: string): id is PlanRouteId {
  return planRouteIds.includes(id as PlanRouteId);
}

export function planHref(planId: PlanRouteId, line?: "ais" | "standard") {
  const base = `/plans/${planId}`;
  if (!line) return base;
  return `${base}?line=${line}`;
}

export function getPlanProductById(id: PlanRouteId) {
  return planProducts.find((product) => product.id === id);
}

export function getPlanShowcaseCardById(id: PlanRouteId) {
  return planShowcaseCards.find((card) => card.id === id);
}

export const planProducts: PlanProduct[] = [
  {
    id: "incert",
    name: "InCert",
    category: "Tracking",
    description: "Tracking, trips, geofencing and driver alerts.",
    href: planHref("incert"),
    accent: "incert",
    variants: [
      { label: "AIS-140 Certified", href: planHref("incert", "ais") },
      { label: "Standard", href: planHref("incert", "standard") },
    ],
  },
  {
    id: "insight",
    name: "InSight",
    category: "Fuel & repair",
    description:
      "Fuel consumption insights, fault codes and repair guidance.",
    href: planHref("insight"),
    accent: "insight",
    variants: [
      { label: "AIS-140 Certified", href: planHref("insight", "ais") },
      { label: "Standard", href: planHref("insight", "standard") },
    ],
  },
  {
    id: "ingenious",
    name: "InGenious",
    category: "Predictive health",
    description:
      "Predictive vehicle health, full fuel management and fleet automation.",
    href: planHref("ingenious"),
    accent: "ingenious",
    variants: [
      { label: "AIS-140 Certified", href: planHref("ingenious", "ais") },
      { label: "Standard", href: planHref("ingenious", "standard") },
    ],
  },
  {
    id: "invision-plus",
    name: "InVision+",
    category: "Predictive + video",
    description:
      "Predictive vehicle health with AI-Driven Video Telematics.",
    href: planHref("invision-plus"),
    accent: "invisionplus",
    variants: [
      { label: "AIS-140 Certified", href: planHref("invision-plus", "ais") },
      { label: "Standard", href: planHref("invision-plus", "standard") },
    ],
  },
];
