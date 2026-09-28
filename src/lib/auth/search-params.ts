import type { AuthTab } from "@/config/auth";

export type AuthSearchParams = {
  mode: AuthTab;
  next: string | null;
  checkout: boolean;
};

export function parseAuthSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): AuthSearchParams {
  const modeParam = pickParam(searchParams.mode);
  const mode: AuthTab =
    modeParam === "create" || modeParam === "signup" ? "create" : "signin";

  const next = pickParam(searchParams.next);

  return {
    mode,
    next,
    checkout:
      pickParam(searchParams.checkout) === "1" ||
      pickParam(searchParams.cart) === "1" ||
      isCheckoutNext(next),
  };
}

function isCheckoutNext(next: string | null) {
  if (!next) return false;
  const path = next.startsWith("/") ? next.split("?")[0] : `/${next.split("?")[0]}`;
  return path === "/checkout";
}

function pickParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}
