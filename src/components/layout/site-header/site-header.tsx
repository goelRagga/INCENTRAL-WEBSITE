"use client";

import { ChevronDown, Menu, Phone, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { Logo } from "@/components/common/logo";
import { NavLink } from "@/components/common/nav-link";
import { headerActions, primaryNavLinks } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { useAuth } from "@/hooks/use-auth";
import { useConfiguredCart } from "@/hooks/use-configured-cart";
import { getHeaderAccountLink } from "@/lib/auth/nav-links";
import { isNavLinkActive } from "@/lib/navigation-utils";
import { cn } from "@/lib/utils";

import { MobileNavigation } from "./mobile-navigation";
import { PlansMegaMenu } from "./plans-mega-menu";

export function SiteHeader() {
  const desktopMegaBreakpoint = 1100;
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const { deviceCount } = useConfiguredCart();
  const accountLink = getHeaderAccountLink(isAuthenticated);
  const plansMenuId = useId();
  const mobileMenuId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const plansCloseTimer = useRef<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [plansOpen, setPlansOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
    setPlansOpen(false);
  }

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const closePlansMenu = useCallback(() => {
    setPlansOpen(false);
  }, []);

  const openPlansMenu = useCallback(() => {
    if (plansCloseTimer.current) {
      window.clearTimeout(plansCloseTimer.current);
      plansCloseTimer.current = null;
    }
    setPlansOpen(true);
  }, []);

  const scheduleClosePlansMenu = useCallback(() => {
    if (plansCloseTimer.current) {
      window.clearTimeout(plansCloseTimer.current);
    }
    plansCloseTimer.current = window.setTimeout(() => {
      setPlansOpen(false);
      plansCloseTimer.current = null;
    }, 180);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", mobileOpen);
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileMenu();
        closePlansMenu();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeMobileMenu, closePlansMenu]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        closePlansMenu();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [closePlansMenu]);

  return (
    <header
      ref={headerRef}
      data-inc-header
      className="sticky top-0 z-[1000] h-[var(--spacing-header-mobile)] overflow-visible border-b border-inc-header-border bg-white/[0.985] shadow-[0_1px_0_rgba(17,25,29,0.02)] backdrop-blur-[16px] min-[1100px]:h-[var(--spacing-header)] relative"
    >
      <div
        className={cn(
          "mx-auto h-full w-[calc(100%-24px)] max-[390px]:w-[calc(100%-16px)]",
          "min-[761px]:max-[1100px]:w-[min(calc(100%-64px),1320px)]",
          "min-[1101px]:w-[min(calc(100%-96px),1320px)]",
          "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 max-[390px]:gap-1 min-[1100px]:grid-cols-[auto_minmax(0,1fr)_auto] min-[1100px]:gap-[26px]"
        )}
      >
        <Logo />

        <nav
          aria-label="Primary navigation"
          className="inc-primary-nav hidden min-w-0 justify-self-center min-[1100px]:block"
        >
          <ul className="m-0 flex list-none items-center justify-center gap-[27px] p-0 max-[1160px]:gap-[17px]">
            <li
              className="inc-nav-plans"
              onMouseEnter={() => {
                if (window.innerWidth >= desktopMegaBreakpoint) {
                  openPlansMenu();
                }
              }}
              onMouseLeave={() => {
                if (window.innerWidth >= desktopMegaBreakpoint) {
                  scheduleClosePlansMenu();
                }
              }}
            >
              <div className="flex items-center gap-0.5">
                <Link
                  href="/solutions"
                  data-nav="plans"
                  onClick={closePlansMenu}
                  className={cn(
                    "inc-nav-trigger inc-nav-underline relative flex min-h-12 items-center px-0.5 text-[15px] font-medium whitespace-nowrap text-inc-nav no-underline transition-colors duration-200",
                    "hover:text-inc-nav-hover focus-visible:text-inc-nav-hover",
                    plansOpen && "text-inc-nav-hover"
                  )}
                >
                  Solutions
                </Link>
                <button
                  type="button"
                  aria-controls={plansMenuId}
                  aria-expanded={plansOpen}
                  aria-label="Show solution menu"
                  data-inc-plans-trigger
                  data-active={plansOpen ? "true" : "false"}
                  onClick={(event) => {
                    event.stopPropagation();
                    setPlansOpen((current) => !current);
                  }}
                  className={cn(
                    "inc-nav-trigger relative flex size-8 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-inc-nav transition-colors duration-200",
                    "hover:bg-[#f4f8fd] hover:text-inc-nav-hover focus-visible:text-inc-nav-hover",
                    plansOpen && "text-inc-nav-hover"
                  )}
                >
                  <ChevronDown
                    className={cn(
                      "size-[13px] stroke-[1.7] transition-transform duration-[180ms]",
                      plansOpen && "-scale-y-100"
                    )}
                    aria-hidden="true"
                  />
                </button>
              </div>
              <PlansMegaMenu
                open={plansOpen}
                menuId={plansMenuId}
                onMouseEnter={openPlansMenu}
                onMouseLeave={scheduleClosePlansMenu}
                onNavigate={closePlansMenu}
              />
            </li>

            {primaryNavLinks.map((link) => (
              <li key={link.id}>
                <NavLink
                  href={link.href}
                  data-nav={link.id}
                  active={isNavLinkActive(pathname, link.href)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex min-w-max items-center justify-end gap-[5px] max-[390px]:gap-0.5 min-[1100px]:gap-[7px]">
          <Link
            href={accountLink.href}
            aria-label={accountLink.ariaLabel}
            data-inc-account-link=""
            className="inc-account-link hidden min-h-11 items-center justify-center rounded-full border border-inc-blue bg-inc-blue px-[18px] text-[15px] leading-none font-semibold whitespace-nowrap text-white no-underline transition-[background,border-color,box-shadow,transform] duration-200 hover:border-inc-blue-hover hover:bg-inc-blue-hover hover:shadow-[0_8px_22px_rgba(5,101,207,0.16)] min-[1100px]:inline-flex motion-safe:hover:-translate-y-px"
          >
            {accountLink.label}
          </Link>

          <Link
            href={headerActions.cart.href}
            aria-label={headerActions.cart.label}
            className="relative grid size-11 min-h-11 min-w-11 place-items-center rounded-full border border-[#d8dfe2] bg-white p-0 text-[#152129] no-underline transition-[background,border-color,color,box-shadow,transform] duration-[180ms] hover:border-[#a8c9ec] hover:bg-[#f4f8fd] hover:text-inc-nav-hover hover:shadow-[0_7px_18px_rgba(20,55,85,0.08)] motion-safe:hover:-translate-y-px"
          >
            <ShoppingCart className="size-5 stroke-[1.8]" />
            <span
              data-inc-cart-count
              hidden={deviceCount < 1}
              className="absolute -top-1.5 -right-1.5 h-6 min-w-6 rounded-full border-2 border-white bg-[#0b65c8] px-1.5 text-center text-[15px] leading-5 font-semibold text-white tabular-nums"
            >
              {deviceCount}
            </span>
          </Link>

          <Link
            href={`tel:${siteConfig.phone.raw}`}
            aria-label="Call Intangles support"
            className="inline-flex min-h-11 items-center justify-center gap-[7px] rounded-full border border-[#d8dfe2] bg-white px-[13px] text-[13px] font-semibold whitespace-nowrap text-[#263a44] no-underline transition-[border-color,background,color,transform] duration-[180ms] hover:border-[#a7c5df] hover:bg-[#f5f9fd] hover:text-inc-nav-hover motion-safe:hover:-translate-y-px max-[1160px]:size-11 max-[1160px]:min-w-11 max-[1160px]:p-0"
          >
            <Phone className="size-[15px] stroke-[1.7]" />
            <span className="max-[1160px]:sr-only">{headerActions.call.label}</span>
          </Link>

          <button
            type="button"
            id="menuBtn"
            aria-controls={mobileMenuId}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((current) => !current)}
            className="grid size-11 min-h-11 min-w-11 place-items-center rounded-full border border-[#d8dfe2] bg-white p-0 text-[#152129] transition-[background,border-color,color,box-shadow,transform] duration-[180ms] hover:border-[#a8c9ec] hover:bg-[#f4f8fd] hover:text-inc-nav-hover hover:shadow-[0_7px_18px_rgba(20,55,85,0.08)] motion-safe:hover:-translate-y-px min-[1100px]:hidden"
          >
            {mobileOpen ? (
              <X className="size-5 stroke-[1.8]" />
            ) : (
              <Menu className="size-5 stroke-[1.8]" />
            )}
          </button>
        </div>
      </div>

      <MobileNavigation
        open={mobileOpen}
        menuId={mobileMenuId}
        onNavigate={closeMobileMenu}
      />
    </header>
  );
}
