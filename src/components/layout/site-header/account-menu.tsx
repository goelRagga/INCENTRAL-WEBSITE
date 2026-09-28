"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";

import { authPage } from "@/config/auth";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

function AccountUserIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="3" />
      <path d="M5 20c.7-4 3-6 7-6s6.3 2 7 6" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <path d="m4 6 4 4 4-4" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 13a8 8 0 0 1 16 0v4a2 2 0 0 1-2 2h-2v-6h4M4 13h4v6H6a2 2 0 0 1-2-2v-4Z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M10 5H5v14h5M14 8l4 4-4 4M8 12h10" />
    </svg>
  );
}

export function HeaderAccountMenu() {
  const menuId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const [open, setOpen] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
      }
    };

    const onPointerDown = (event: globalThis.MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) {
        close(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [close, open]);

  const toggleMenu = (event: ReactMouseEvent) => {
    event.preventDefault();
    setOpen((current) => !current);
  };

  const handleLogout = async (event: ReactMouseEvent) => {
    event.preventDefault();
    close(false);
    await signOut();
    router.push(authPage.signInHref);
  };

  return (
    <div
      ref={wrapRef}
      className={cn("inc-account-menu-wrap", open && "is-open")}
    >
      <Link
        ref={triggerRef}
        href={authPage.accountHref}
        aria-label="Open My InCentral account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        data-inc-account-link=""
        className="inc-account-link inc-account-trigger"
        onClick={toggleMenu}
      >
        <span className="inc-account-trigger-icon">
          <AccountUserIcon />
        </span>
        <span>My InCentral</span>
        <span className="inc-account-trigger-chevron">
          <ChevronIcon />
        </span>
      </Link>

      <div
        id={menuId}
        className="inc-account-menu"
        role="menu"
        hidden={!open}
      >
        <Link href={authPage.accountHref} role="menuitem" onClick={() => close(false)}>
          <span className="inc-account-menu-icon">
            <DashboardIcon />
          </span>
          <span>Dashboard</span>
        </Link>
        <Link href="/support" role="menuitem" onClick={() => close(false)}>
          <span className="inc-account-menu-icon">
            <SupportIcon />
          </span>
          <span>Support</span>
        </Link>
        <div className="inc-account-menu-sep" role="separator" />
        <button type="button" role="menuitem" data-inc-account-logout="" onClick={handleLogout}>
          <span className="inc-account-menu-icon">
            <LogoutIcon />
          </span>
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}

type MobileAccountMenuProps = {
  onNavigate: () => void;
};

export function MobileAccountMenu({ onNavigate }: MobileAccountMenuProps) {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    onNavigate();
    await signOut();
    router.push(authPage.signInHref);
  };

  return (
    <details className="inc-mobile-account-details">
      <summary>
        <span>
          <AccountUserIcon />
        </span>
        <strong>My InCentral</strong>
        <span className="inc-mobile-account-chevron">
          <ChevronIcon />
        </span>
      </summary>
      <div className="inc-mobile-account-panel">
        <Link href={authPage.accountHref} onClick={onNavigate}>
          Dashboard
        </Link>
        <Link href="/support" onClick={onNavigate}>
          Support
        </Link>
        <button type="button" data-inc-account-logout="" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </details>
  );
}
