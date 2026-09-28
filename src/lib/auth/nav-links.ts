import { authPage } from "@/config/auth";

export function getHeaderAccountLink(isAuthenticated: boolean) {
  if (isAuthenticated) {
    return {
      label: "My InCentral",
      href: authPage.accountOverviewHref,
      ariaLabel: "Open My InCentral account dashboard",
    };
  }

  return {
    label: "Sign In",
    href: authPage.signInHref,
    ariaLabel: "Sign in to InCentral",
  };
}

export function getOrdersLink(isAuthenticated: boolean) {
  return isAuthenticated
    ? `${authPage.accountHref}#orders`
    : `${authPage.signInHref}&next=orders`;
}

/** Footer / account menu: Sign In when signed out, Dashboard when signed in. */
export function getFooterDashboardLink(isAuthenticated: boolean) {
  if (isAuthenticated) {
    return { label: "Dashboard" as const, href: authPage.accountOverviewHref };
  }
  return { label: "Sign In" as const, href: authPage.signInHref };
}

export function getSupportNavHref(isAuthenticated: boolean) {
  return isAuthenticated ? authPage.accountSupportHref : "/support";
}
