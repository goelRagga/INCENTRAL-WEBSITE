import { authPage } from "@/config/auth";

export function resolveAuthRedirect(
  next: string | null,
  checkout: boolean
): string {
  if (next && next.startsWith("/") && !next.startsWith("//")) {
    return next;
  }

  if (checkout || next === "checkout") {
    return "/checkout";
  }

  if (next === "orders") {
    return `${authPage.accountHref}#orders`;
  }

  return "/";
}
