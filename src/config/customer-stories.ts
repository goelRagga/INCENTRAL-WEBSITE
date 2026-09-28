import type { PlanRouteId } from "@/config/plans";

export type CustomerStoryFormat = "standard" | "short";

export type CustomerStory = {
  id: string;
  name: string;
  role?: string;
  company: string;
  topic: string;
  quote: string;
  thumbnail: string;
  youtubeId?: string;
  format?: CustomerStoryFormat;
  /** Homepage tab subtitle, e.g. "Cityflo · Fleet optimisation" */
  tabDetail?: string;
};

const thumb = (file: string) => `/images/stories/${file}`;

export const customerStoriesById: Record<string, CustomerStory> = {
  "rushabh-cityflo": {
    id: "rushabh-cityflo",
    name: "Rushabh Shah",
    role: "Co-founder",
    company: "Cityflo",
    topic: "Fleet optimisation",
    quote:
      "Predictive health monitoring has become a game changer for us. It alerts us before issues escalate, helping reduce downtime and maintenance costs.",
    thumbnail: thumb("cityflo-rushabh-shah.webp"),
    youtubeId: "kxlG_A1sUuc",
    tabDetail: "Cityflo · Fleet optimisation",
  },
  "saurabh-purple": {
    id: "saurabh-purple",
    name: "Saurabh Patwardhan",
    role: "Director",
    company: "Purple Bus · Prasanna Purple Mobility Solutions Pvt. Ltd.",
    topic: "Growth & profitability",
    quote: "Intangles is equal to your path to growth and profitability.",
    thumbnail: thumb("purple-saurabh-patwardhan.webp"),
    youtubeId: "jxVnGxj3yWg",
    format: "short",
    tabDetail: "Purple Bus · Growth",
  },
  "sanyam-chartered-home": {
    id: "sanyam-chartered-home",
    name: "Sanyam Gandhi",
    role: "Whole-time Director",
    company: "Chartered Speed Limited",
    topic: "Fleet efficiency",
    quote:
      "With Intangles, we know when a fault code appears, so we can work proactively and prevent a breakdown.",
    thumbnail: thumb("chartered-sanyam-gandhi.webp"),
    youtubeId: "MNgU-sNtcLw",
    tabDetail: "Chartered Speed · Efficiency",
  },
  "lavanya-professional": {
    id: "lavanya-professional",
    name: "Lavanya Agarwal",
    role: "Owner",
    company: "Professional Automotives Pvt. Ltd.",
    topic: "Driver performance",
    quote:
      "Free-running in our fleet came down to around 2 to 3 percent from more than 90 percent earlier.",
    thumbnail: thumb("professional-lavanya-agarwal.webp"),
    youtubeId: "zeZFAz4zt0w",
    tabDetail: "Professional Automotives · Drivers",
  },
  "mahesh-cts-home": {
    id: "mahesh-cts-home",
    name: "Mahesh Oswal",
    role: "Managing Director",
    company: "CTS Express Logistics Pvt. Ltd.",
    topic: "Fleet visibility",
    quote:
      "Hub-to-hub reports have improved both vehicle monitoring and vehicle utilisation.",
    thumbnail: thumb("cts-mahesh-oswal.webp"),
    youtubeId: "qnPDU0uoGdM",
    tabDetail: "CTS Express · Visibility",
  },
  "sanyam-chartered-pdp": {
    id: "sanyam-chartered-pdp",
    name: "Sanyam Gandhi",
    company: "Chartered Speed Limited",
    topic: "Trip visibility",
    quote:
      "We can track arrival and departure times and use historical patterns to adjust the schedule accordingly.",
    thumbnail: thumb("chartered-sanyam-gandhi.webp"),
    youtubeId: "MNgU-sNtcLw",
  },
  "mahesh-cts-pdp": {
    id: "mahesh-cts-pdp",
    name: "Mahesh Oswal",
    company: "CTS Express Logistics Pvt. Ltd.",
    topic: "Fleet utilisation",
    quote:
      "Hub-to-hub reports have improved both vehicle monitoring and vehicle utilisation.",
    thumbnail: thumb("cts-mahesh-oswal.webp"),
    youtubeId: "qnPDU0uoGdM",
  },
  "jasveer-instant": {
    id: "jasveer-instant",
    name: "Jasveer Singh",
    company: "Instant Transport Solution Pvt. Ltd.",
    topic: "Fuel & fault visibility",
    quote:
      "We get the right fuel mileage and can inform the OEM in advance when a fault code appears.",
    thumbnail: thumb("instant-jasveer-singh.webp"),
    youtubeId: "s0_uTe7Q9kg",
  },
  "sanyam-chartered-insight": {
    id: "sanyam-chartered-insight",
    name: "Sanyam Gandhi",
    company: "Chartered Speed Limited",
    topic: "Proactive maintenance",
    quote:
      "When a fault code appears, we know there may be an issue. If we work proactively, we can prevent a breakdown.",
    thumbnail: thumb("chartered-sanyam-gandhi.webp"),
    youtubeId: "MNgU-sNtcLw",
  },
  "ramratan-sure": {
    id: "ramratan-sure",
    name: "Ramratan Singhi",
    company: "Sure Group",
    topic: "Fuel efficiency",
    quote:
      "We can compare drivers of the same vehicle type to improve mileage, and we learned that fault codes need to be taken seriously.",
    thumbnail: thumb("sure-ramratan-singhi.webp"),
    youtubeId: "Lq0GZa4kNxA",
  },
  "rushabh-predictive": {
    id: "rushabh-predictive",
    name: "Rushabh Shah",
    company: "Cityflo",
    topic: "Predictive health",
    quote:
      "Predictive health monitoring has become a game changer for us. It alerts us before issues escalate, helping reduce downtime and maintenance costs.",
    thumbnail: thumb("cityflo-rushabh-shah.webp"),
    youtubeId: "kxlG_A1sUuc",
  },
  "atirav-lauls": {
    id: "atirav-lauls",
    name: "Atirav Gupta",
    company: "Lauls Pvt. Ltd.",
    topic: "Workshop readiness",
    quote:
      "Predictive alerts give us transparency before a workshop visit, so we know the codes and possible faults that need attention.",
    thumbnail: thumb("lauls-atirav-gupta.webp"),
    youtubeId: "wTmDOKtv4c0",
  },
  "mahesh-ingenious": {
    id: "mahesh-ingenious",
    name: "Mahesh Oswal",
    company: "CTS Express Logistics Pvt. Ltd.",
    topic: "Fleet optimisation",
    quote:
      "Monitoring engine, turbo, coolant and battery health became easier, while fuel and AdBlue visibility improved control.",
    thumbnail: thumb("cts-mahesh-oswal.webp"),
    youtubeId: "qnPDU0uoGdM",
  },
  "archit-mrshah": {
    id: "archit-mrshah",
    name: "Archit Agrawal",
    company: "M. R. Shah Logistics Pvt. Ltd.",
    topic: "Driver behaviour · Fuel efficiency · Predictive alerts",
    quote: "Safer driving. Better fuel. Fewer breakdowns.",
    thumbnail: thumb("mr-shah-archit-agrawal.webp"),
  },
  "jay-nabros": {
    id: "jay-nabros",
    name: "Jay Patel",
    company: "Nabros Transport",
    topic: "Driver performance",
    quote:
      "Harsh acceleration, overspeeding and freerunning came under our attention, which benefited operational safety and fuel efficiency.",
    thumbnail: thumb("nabros-jay-patel.webp"),
    youtubeId: "pI72rnlSogc",
    format: "short",
  },
  "saurabh-invision": {
    id: "saurabh-invision",
    name: "Saurabh Patwardhan",
    company: "Purple Bus · Prasanna Purple Mobility Solutions Pvt. Ltd.",
    topic: "Operating efficiency",
    quote:
      "Using Intangles, we built operating efficiencies, improved fleet uptime and learned what to train each driver for.",
    thumbnail: thumb("purple-saurabh-patwardhan.webp"),
    youtubeId: "jxVnGxj3yWg",
    format: "short",
  },
};

function pickStories(ids: string[]): CustomerStory[] {
  return ids.map((id) => {
    const story = customerStoriesById[id];
    if (!story) throw new Error(`Missing customer story: ${id}`);
    return story;
  });
}

export const homeStoriesSection = {
  id: "customer-stories",
  titleId: "homeStoriesTitle",
  eyebrow: "Customer stories",
  title: "Proof from the people running fleets every day.",
  description:
    "Hear how fleet operators use Intangles to improve vehicle health, fuel efficiency, driver performance and day-to-day operations.",
  stories: pickStories([
    "rushabh-cityflo",
    "saurabh-purple",
    "sanyam-chartered-home",
    "lavanya-professional",
    "mahesh-cts-home",
  ]),
} as const;

export type PlanStoriesSectionConfig = {
  titleId: string;
  title: string;
  description: string;
  stories: CustomerStory[];
};

export const planCustomerStories: Record<PlanRouteId, PlanStoriesSectionConfig> = {
  incert: {
    titleId: "pdtStoriesTitle-incert",
    title: "See how fleet teams turn visibility into smoother operations.",
    description:
      "Customer stories focused on tracking, hub activity, schedule performance and vehicle utilisation.",
    stories: pickStories(["sanyam-chartered-pdp", "mahesh-cts-pdp"]),
  },
  insight: {
    titleId: "pdtStoriesTitle-insight",
    title: "Better fuel and repair decisions start with better visibility.",
    description:
      "Stories from fleets using vehicle fault codes, mileage insights and driver behaviour data to act earlier.",
    stories: pickStories([
      "jasveer-instant",
      "sanyam-chartered-insight",
      "ramratan-sure",
    ]),
  },
  ingenious: {
    titleId: "pdtStoriesTitle-ingenious",
    title: "Predictive intelligence that changes day-to-day fleet decisions.",
    description:
      "See how operators use predictive health, fuel intelligence and advanced driver behaviour to reduce cost and improve uptime.",
    stories: pickStories([
      "rushabh-predictive",
      "atirav-lauls",
      "lavanya-professional",
      "mahesh-ingenious",
      "archit-mrshah",
    ]),
  },
  "invision-plus": {
    titleId: "pdtStoriesTitle-invision-plus",
    title: "Customer outcomes across the intelligence stack inside InVision+.",
    description:
      "These stories focus on predictive health, driver performance and operating efficiency included in the broader InVision+ solution.",
    stories: pickStories(["rushabh-predictive", "jay-nabros", "saurabh-invision"]),
  },
};
