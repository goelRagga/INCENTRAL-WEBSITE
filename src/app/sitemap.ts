import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "/",
    "/solutions",
    "/solutions/incert",
    "/solutions/insight",
    "/solutions/ingenious",
    "/solutions/invision-plus",
    "/compare-solutions",
    "/cart",
    "/ais-140-guide",
    "/help",
    "/support",
    "/policies/returns-refunds-cancellation",
    "/policies/privacy-notice",
    "/policies/terms-conditions",
  ] as const;

  return pages.map((path, index) => ({
    url: new URL(path, siteConfig.url).toString(),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: index === 0 ? 1 : 0.8,
  }));
}
