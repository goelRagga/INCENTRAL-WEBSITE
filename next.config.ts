import type { NextConfig } from "next";

import { policySlugs } from "./src/config/policies";
import { planRouteIds } from "./src/config/plans";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      ...planRouteIds.map((planId) => ({
        source: `/${planId}`,
        destination: `/plans/${planId}`,
        permanent: true,
      })),
      ...policySlugs.map((slug) => ({
        source: `/${slug}`,
        destination: `/policies/${slug}`,
        permanent: true,
      })),
      {
        source: "/my-incentral",
        destination: "/account",
        permanent: true,
      },
      {
        source: "/plans/invision",
        destination: "/plans/invision-plus?line=standard",
        permanent: true,
      },
      {
        source: "/invision",
        destination: "/plans/invision-plus?line=standard",
        permanent: true,
      },
      {
        source: "/compare-solutions.html",
        destination: "/compare-solutions",
        permanent: true,
      },
      {
        source: "/cart.html",
        destination: "/cart",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
