import { accountPanelIds, type AccountPanelId } from "@/config/account";

export function panelIdFromAccountHref(href: string): AccountPanelId | null {
  if (!href.startsWith("/account#")) return null;
  const id = href.slice("/account#".length) as AccountPanelId;
  return accountPanelIds.includes(id) ? id : null;
}

/**
 * When already on /account, update hash and notify listeners (App Router
 * router.push often skips hashchange on the same pathname).
 */
export function navigateAccountPanelHref(href: string): "handled" | "navigate" {
  const panel = panelIdFromAccountHref(href);
  if (!panel || typeof window === "undefined") return "navigate";
  if (window.location.pathname !== "/account") return "navigate";

  const nextUrl = `/account#${panel}`;
  if (window.location.hash !== `#${panel}`) {
    window.history.pushState(null, "", nextUrl);
  }
  window.dispatchEvent(new HashChangeEvent("hashchange"));
  return "handled";
}
