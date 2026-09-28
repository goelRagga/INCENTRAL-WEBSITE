import type { ReactNode } from "react";

type IconProps = { children: ReactNode };

function NavIcon({ children }: IconProps) {
  return (
    <span className="a295-nav-icon" aria-hidden>
      <svg viewBox="0 0 24 24">{children}</svg>
    </span>
  );
}

export function IconOverview() {
  return (
    <NavIcon>
      <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
    </NavIcon>
  );
}

export function IconOrders() {
  return (
    <NavIcon>
      <path d="M5 5h14v14H5zM8 9h8M8 13h8M8 17h5" />
    </NavIcon>
  );
}

export function IconBilling() {
  return (
    <NavIcon>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
      <path d="M9 8h6M9 12h6" />
    </NavIcon>
  );
}

export function IconAddresses() {
  return (
    <NavIcon>
      <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.2" />
    </NavIcon>
  );
}

export function IconSupport() {
  return (
    <NavIcon>
      <path d="M4 13a8 8 0 0 1 16 0v4a2 2 0 0 1-2 2h-2v-6h4M4 13h4v6H6a2 2 0 0 1-2-2v-4Z" />
    </NavIcon>
  );
}

export function IconLogout() {
  return (
    <NavIcon>
      <path d="M10 5H5v14h5M14 8l4 4-4 4M8 12h10" />
    </NavIcon>
  );
}

export function IconSummaryOrders() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M5 5h14v14H5zM8 9h8M8 13h8M8 17h5" />
    </svg>
  );
}

export function IconSummaryBilling() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
      <path d="M9 8h6M9 12h6" />
    </svg>
  );
}

export function IconSummarySupport() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M4 13a8 8 0 0 1 16 0v4a2 2 0 0 1-2 2h-2v-6h4M4 13h4v6H6a2 2 0 0 1-2-2v-4Z" />
    </svg>
  );
}
