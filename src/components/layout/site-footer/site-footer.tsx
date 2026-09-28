"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type MouseEvent } from "react";

import { Container } from "@/components/common/container";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  XSocialIcon,
  YouTubeIcon,
} from "@/components/common/social-icons";
import {
  footerCompany,
  footerNavGroups,
  footerSocial,
  footerSocialLinks,
  footerSupport,
} from "@/config/footer";
import { siteConfig } from "@/config/site";
import { useAuth } from "@/hooks/use-auth";
import { navigateAccountPanelHref } from "@/lib/account/account-panel-nav";
import {
  getFooterDashboardLink,
  getOrdersLink,
  getSupportNavHref,
} from "@/lib/auth/nav-links";
import { cn } from "@/lib/utils";

export function SiteFooter() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const dashboardLink = getFooterDashboardLink(isAuthenticated);

  const onAccountPanelLinkClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith("/account#")) return;
      event.preventDefault();
      if (navigateAccountPanelHref(href) === "handled") return;
      void router.push(href);
    },
    [router]
  );
  const resolvedFooterNavGroups = footerNavGroups.map((group) => {
    if (group.id === "account") {
      return {
        ...group,
        links: group.links.map((link) => {
          if (link.id === "dashboard") {
            return {
              ...link,
              label: dashboardLink.label,
              href: dashboardLink.href,
            };
          }
          if (link.id === "orders") {
            return { ...link, href: getOrdersLink(isAuthenticated) };
          }
          return link;
        }),
      };
    }

    if (group.id === "help") {
      return {
        ...group,
        links: group.links.map((link) =>
          link.id === "support"
            ? { ...link, href: getSupportNavHref(isAuthenticated) }
            : link
        ),
      };
    }

    return group;
  });

  const socialIconMap = {
    linkedin: LinkedInIcon,
    facebook: FacebookIcon,
    x: XSocialIcon,
    instagram: InstagramIcon,
    youtube: YouTubeIcon,
  } as const;

  const [showBackToTop, setShowBackToTop] = useState(false);
  const year = new Date().getFullYear();

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 480);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <footer
      id="siteFooter"
      className="incf-footer m-0 border-0 bg-inc-dark p-0 text-white"
    >
      <Container>
        <section
          aria-labelledby="incf-support-title"
          className="grid items-center gap-[9px] border-b border-inc-footer-border py-[17px] pb-[15px] max-[800px]:gap-[9px] min-[801px]:gap-3 min-[981px]:grid-cols-[minmax(300px,0.78fr)_minmax(560px,1.22fr)] min-[981px]:gap-8 min-[981px]:py-5"
        >
          <div className="incf-support-copy">
            <p className="mb-[5px] text-[11.5px] leading-[1.25] font-medium tracking-[0.085em] text-[#8f989f] uppercase">
              {footerSupport.kicker}
            </p>
            <h2
              id="incf-support-title"
              className="m-0 max-w-[520px] text-[19px] leading-[1.2] font-normal tracking-[-0.018em] text-white max-[800px]:text-[17px] max-[420px]:text-base"
            >
              {footerSupport.title}
            </h2>
          </div>

          <div className="grid items-center gap-0 max-[800px]:grid-cols-1 min-[801px]:grid-cols-[160px_minmax(250px,1fr)_auto] min-[801px]:gap-2 min-[981px]:grid-cols-[minmax(150px,0.78fr)_minmax(250px,1.25fr)_auto] min-[981px]:gap-2">
            <a
              href={footerSupport.phone.href}
              className="flex min-h-[42px] flex-col justify-center rounded-[7px] border border-[#32363a] bg-[#121517] px-[11px] py-[7px] no-underline transition-colors hover:border-[#57616a] hover:bg-[#191d20] max-[800px]:min-h-[34px] max-[800px]:flex-row max-[800px]:items-center max-[800px]:gap-2.5 max-[800px]:border-0 max-[800px]:bg-transparent max-[800px]:p-0 max-[800px]:hover:border-transparent max-[800px]:hover:bg-transparent"
            >
              <span className="text-[10.5px] leading-[1.15] font-medium tracking-[0.07em] text-[#8f989f] uppercase max-[800px]:min-w-[78px]">
                {footerSupport.phone.label}
              </span>
              <strong className="mt-0.5 text-[13px] leading-[1.25] font-medium wrap-anywhere text-white max-[800px]:mt-0 max-[420px]:text-[12.5px]">
                {footerSupport.phone.value}
              </strong>
            </a>
            <a
              href={footerSupport.email.href}
              className="flex min-h-[42px] flex-col justify-center rounded-[7px] border border-[#32363a] bg-[#121517] px-[11px] py-[7px] no-underline transition-colors hover:border-[#57616a] hover:bg-[#191d20] max-[800px]:min-h-[34px] max-[800px]:flex-row max-[800px]:items-center max-[800px]:gap-2.5 max-[800px]:border-0 max-[800px]:bg-transparent max-[800px]:p-0 max-[800px]:hover:border-transparent max-[800px]:hover:bg-transparent"
            >
              <span className="text-[10.5px] leading-[1.15] font-medium tracking-[0.07em] text-[#8f989f] uppercase max-[800px]:min-w-[78px]">
                {footerSupport.email.label}
              </span>
              <strong className="mt-0.5 text-[13px] leading-[1.25] font-medium wrap-anywhere text-white max-[800px]:mt-0 max-[420px]:text-[12.5px]">
                {footerSupport.email.value}
              </strong>
            </a>
            <Link
              href={footerSupport.cta.href}
              className="inline-flex min-h-[42px] items-center self-end px-0.5 text-[13px] font-medium whitespace-nowrap text-inc-footer-support no-underline hover:underline max-[800px]:hidden"
            >
              {footerSupport.cta.label}
            </Link>
          </div>
        </section>

        <div className="hidden grid-cols-4 gap-[34px] border-b border-inc-footer-border py-[23px] pb-[21px] min-[801px]:grid">
          {resolvedFooterNavGroups.map((group) => (
            <nav key={group.id} aria-labelledby={`incf-${group.id}`}>
              <h2
                id={`incf-${group.id}`}
                className="mb-2 text-[11.5px] leading-[1.2] font-medium tracking-[0.085em] text-inc-footer-muted uppercase"
              >
                {group.title}
              </h2>
              <ul className="m-0 grid list-none gap-1 p-0">
                {group.links.map((link) => (
                  <li key={`${group.id}-${link.id}`} className="m-0 p-0">
                    <Link
                      href={link.href}
                      data-incf-account={
                        link.id === "dashboard" ? "" : undefined
                      }
                      data-incf-orders={
                        link.id === "orders" ? "" : undefined
                      }
                      onClick={(e) => onAccountPanelLinkClick(e, link.href)}
                      className="inline-flex min-h-[23px] items-center text-[13.5px] leading-[1.35] font-normal text-inc-footer-link no-underline hover:text-white hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-b border-inc-footer-border py-[5px] pb-[7px] min-[801px]:hidden">
          {resolvedFooterNavGroups.map((group) => (
            <details
              key={group.id}
              className="group/details border-b border-[#24272a] last:border-b-0"
            >
              <summary className="flex min-h-[43px] cursor-pointer list-none items-center justify-between text-[13.5px] font-medium text-white [&::-webkit-details-marker]:hidden after:text-[17px] after:font-normal after:text-[#9da5ac] after:content-['+'] group-open/details:after:content-['−']">
                {group.title}
              </summary>
              <ul className="m-0 grid list-none gap-px pb-[9px] p-0">
                {group.links.map((link) => (
                  <li key={`${group.id}-${link.id}`} className="m-0 p-0">
                    <Link
                      href={link.href}
                      data-incf-account={
                        link.id === "dashboard" ? "" : undefined
                      }
                      data-incf-orders={
                        link.id === "orders" ? "" : undefined
                      }
                      onClick={(e) => onAccountPanelLinkClick(e, link.href)}
                      className="inline-flex min-h-9 w-full items-center text-[13px] text-inc-footer-link no-underline hover:text-white hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>

        <div className="grid items-center gap-9 border-b border-inc-footer-border py-[17px] pb-4 max-[800px]:gap-3.5 max-[800px]:py-4 max-[800px]:pb-[15px] min-[801px]:grid-cols-[minmax(0,1fr)_auto]">
          <section aria-labelledby="incf-company-title" className="incf-company">
            <a
              href={siteConfig.parentBrandUrl}
              aria-label="Visit Intangles website"
              className="mb-[22px] inline-flex w-max items-center no-underline max-[760px]:mb-[18px]"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Image
                src={siteConfig.assets.logoWhite}
                alt="Intangles"
                width={228}
                height={52}
                className="block h-[52px] w-auto max-w-[228px] object-contain max-[760px]:h-11 max-[760px]:max-w-[194px]"
              />
            </a>
            <p
              id="incf-company-title"
              className="mb-[5px] text-[11.5px] leading-[1.25] font-medium tracking-[0.085em] text-[#8f989f] uppercase"
            >
              {footerCompany.kicker}
            </p>
            <p className="mb-1 text-[13.5px] leading-[1.35] font-medium text-white">
              {siteConfig.company.name}
            </p>
            <address className="m-0 text-[12.5px] leading-[1.42] text-[#90999f] not-italic max-[800px]:leading-[1.45]">
              {siteConfig.company.address.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </address>
            <p className="mt-[5px] text-xs leading-[1.35] text-[#a7afb4]">
              <strong className="font-medium">GSTIN</strong>{" "}
              {siteConfig.company.gstin}
            </p>
          </section>

          <section
            aria-labelledby="incf-social-title"
            className="flex items-center gap-3 min-[801px]:justify-self-end max-[800px]:justify-self-start max-[800px]:gap-[11px] max-[420px]:flex-col max-[420px]:items-start max-[420px]:gap-[7px]"
          >
            <p
              id="incf-social-title"
              className="m-0 text-[11.5px] leading-[1.25] font-medium tracking-[0.085em] whitespace-nowrap text-[#8f989f] uppercase"
            >
              {footerSocial.kicker}
            </p>
            <div className="flex gap-[7px]">
              {footerSocialLinks.map((social) => {
                const Icon = socialIconMap[social.id];

                return (
                  <a
                    key={social.id}
                    href={social.href}
                    aria-label={social.label}
                    title={social.label}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="grid size-8 min-h-8 place-items-center rounded-full border border-[#2e3438] bg-[#111416] p-0 text-[#aeb8bf] no-underline transition-[border-color,background,transform] hover:-translate-y-px hover:border-[#4f667a] hover:bg-[#151a1e] hover:text-white"
                  >
                    <Icon className="size-[15px] fill-current" />
                    <span className="sr-only">{social.label}</span>
                  </a>
                );
              })}
            </div>
          </section>
        </div>

        <div className="flex min-h-11 flex-col justify-center gap-[5px] py-2.5 text-[11.5px] leading-[1.35] text-[#7f898f] max-[800px]:min-h-[50px] max-[800px]:items-start max-[800px]:py-2.5 min-[801px]:flex-row min-[801px]:items-center min-[801px]:justify-between min-[801px]:gap-[18px] min-[801px]:text-xs">
          <span>
            © {year} {siteConfig.company.name}. All rights reserved.
          </span>
          <a
            href="#top"
            data-incf-backtop
            className={cn(
              "inline-flex min-h-8 items-center text-xs font-medium text-[#b4bcc1] no-underline hover:underline",
              !showBackToTop && "hidden"
            )}
          >
            ↑ Back to top
          </a>
        </div>
      </Container>
    </footer>
  );
}
