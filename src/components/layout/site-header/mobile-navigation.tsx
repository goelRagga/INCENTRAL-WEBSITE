"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { headerActions, primaryNavLinks } from "@/config/navigation";
import {
  planMegaMenuAccentTokens,
  planProducts,
  solutionsMega,
} from "@/config/plans";
import { siteConfig } from "@/config/site";
import { useAuth } from "@/hooks/use-auth";
import { MobileAccountMenu } from "@/components/layout/site-header/account-menu";
import { getHeaderAccountLink } from "@/lib/auth/nav-links";
import { authPage } from "@/config/auth";
import { isNavLinkActive } from "@/lib/navigation-utils";
import { cn } from "@/lib/utils";

type MobileNavigationProps = {
  open: boolean;
  menuId: string;
  onNavigate: () => void;
};

export function MobileNavigation({
  open,
  menuId,
  onNavigate,
}: MobileNavigationProps) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const accountLink = getHeaderAccountLink(isAuthenticated);

  if (!open) {
    return null;
  }

  return (
    <nav
      id={menuId}
      aria-label="Mobile navigation"
      className="fixed inset-x-0 top-[var(--spacing-header-mobile)] bottom-0 z-[1100] isolate block overflow-auto overscroll-contain border-t border-[#eef0f1] bg-white min-[1100px]:hidden"
    >
      <div className="mx-auto flex h-full min-h-full w-[min(640px,calc(100%-32px))] flex-col py-[18px] pb-6">
        <ul className="m-0 list-none p-0">
          <li className="border-b border-[#edf0f1]">
            <details className="group/details" open={open}>
              <summary className="flex min-h-[57px] cursor-pointer list-none items-center justify-between text-base font-semibold text-[#152129] [&::-webkit-details-marker]:hidden after:text-lg after:font-normal after:text-[#60717a] after:content-['+'] group-open/details:after:content-['−']">
                Solutions
              </summary>

              <div className="inc-mobile-plan-list grid gap-[9px] pb-3.5">
                {planProducts.map((plan) => {
                  const tokens = planMegaMenuAccentTokens[plan.accent];
                  return (
                    <div
                      key={plan.id}
                      style={
                        { "--plan-accent": tokens.accent } as CSSProperties
                      }
                      className={cn(
                        "inc-mobile-plan-family relative overflow-hidden rounded-xl border border-[#e1e7ea] bg-[#fafcfd] p-3 before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-[var(--plan-accent)]",
                        tokens.mobileClass
                      )}
                    >
                      <Link
                        href={plan.href}
                        onClick={onNavigate}
                        className="relative z-[1] flex items-baseline justify-between gap-3 no-underline max-[560px]:grid max-[560px]:gap-[3px]"
                      >
                        <strong className="text-sm text-[#172126]">{plan.name}</strong>
                        <span className="text-right text-[9.5px] font-[650] text-[#6b7b83] max-[560px]:text-left">
                          {plan.category}
                        </span>
                      </Link>
                      <div className="inc-mobile-variants relative z-[2] mt-[9px] flex flex-wrap gap-[7px] max-[560px]:grid max-[560px]:grid-cols-2">
                        {plan.variants.map((variant) => (
                          <Link
                            key={variant.href}
                            href={variant.href}
                            onClick={onNavigate}
                            className="relative inline-flex min-h-[34px] items-center rounded-full border border-[#d7e1e6] bg-white px-2.5 text-[11px] font-[650] text-[#225c90] no-underline max-[560px]:justify-center"
                          >
                            {variant.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="inc-mobile-plan-actions grid gap-2 pb-[15px]">
                <Link
                  href="/solutions"
                  onClick={onNavigate}
                  className="flex min-h-[42px] items-center justify-center rounded-full border border-[#d7e1e6] bg-white text-[13px] font-[650] text-[#225c90] no-underline"
                >
                  View all solutions
                </Link>
                <Link
                  href={solutionsMega.cta.href}
                  onClick={onNavigate}
                  className="flex min-h-[42px] items-center justify-center rounded-full bg-inc-blue text-[13px] font-[650] text-white no-underline"
                >
                  {solutionsMega.cta.label}
                </Link>
              </div>
            </details>
          </li>

          {primaryNavLinks.map((link) => {
            const active = isNavLinkActive(pathname, link.href);

            return (
              <li key={link.id} className="border-b border-[#edf0f1]">
                <Link
                  href={link.href}
                  data-nav={link.id}
                  onClick={onNavigate}
                  className={cn(
                    "relative flex min-h-[57px] items-center border-0 p-0 text-base font-medium text-[#152129] no-underline",
                    active &&
                      "font-semibold text-inc-nav-active before:mr-[11px] before:h-6 before:w-[3px] before:shrink-0 before:rounded-full before:bg-inc-blue before:content-['']"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {isAuthenticated ? (
          <div className="mt-auto">
            <MobileAccountMenu onNavigate={onNavigate} />
          </div>
        ) : (
          <Link
            href={authPage.signInHref}
            aria-label={accountLink.ariaLabel}
            data-inc-mobile-account=""
            onClick={onNavigate}
            className="inc-mobile-cta mt-auto flex min-h-[50px] w-full items-center justify-center rounded-full border border-inc-blue bg-inc-blue px-[18px] text-[15px] font-semibold text-white no-underline"
          >
            {accountLink.label}
          </Link>
        )}
        <Link
          href={`tel:${siteConfig.phone.raw}`}
          onClick={onNavigate}
          className="mt-[9px] flex min-h-11 items-center justify-center rounded-full border border-[#cdd8de] text-[13px] font-[650] text-[#285b82] no-underline"
        >
          {headerActions.call.label}
        </Link>
      </div>
    </nav>
  );
}
