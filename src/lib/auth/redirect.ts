import { authPage } from "@/config/auth";

export function resolveAuthRedirect(
  next: string | null,
  checkout: boolean
): string {
  if (checkout || next === "checkout") {
    return authPage.checkoutContext.cartHref;
  }

  if (next === "orders") {
    return `${authPage.accountHref}#orders`;
  }

  if (next && next.startsWith("/") && !next.startsWith("//")) {
    return next;
  }

  return "/";
}
