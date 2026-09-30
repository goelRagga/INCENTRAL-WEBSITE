import type { Metadata, Viewport } from "next";

import { AuthModal } from "@/components/auth/auth-modal";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { OrganizationJsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";

import "./globals.css";

export const metadata: Metadata = {
  ...constructMetadata(),
  authors: [{ name: siteConfig.parentCompany }],
  applicationName: siteConfig.name,
  appleWebApp: {
    title: siteConfig.name,
  },
  icons: {
    icon: siteConfig.assets.favicon,
  },
  referrer: "strict-origin-when-cross-origin",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" id="top">
      <body>
        <OrganizationJsonLd />
        <SiteHeader />
        {children}
        <SiteFooter />
        <AuthModal />
      </body>
    </html>
  );
}
