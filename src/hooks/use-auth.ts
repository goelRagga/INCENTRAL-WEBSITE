"use client";

import { useCallback, useEffect, useState } from "react";

import { authPage } from "@/config/auth";
import { api } from "@/lib/backend";
import {
  clearAuthSession,
  readAuthSession,
  writeAuthSession,
  type AuthSession,
} from "@/lib/auth/session";

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setSession(readAuthSession());
    setReady(true);
  }, []);

  useEffect(() => {
    // Hydrate from sessionStorage for instant render, then always verify cookie with server
    const cached = readAuthSession();
    if (cached) {
      setSession(cached);
      setReady(true);
    }

    api.auth.me()
      .then((user: Record<string, unknown>) => {
        const s: AuthSession = {
          authenticated: true,
          identity: String(user.email || user.mobile || "account"),
          name: user.name as string | undefined,
          company: user.company as string | undefined,
          email: user.email as string | undefined,
          mobile: user.mobile as string | undefined,
          mode: "signin",
          signedInAt: new Date().toISOString(),
        };
        writeAuthSession(s);
        setSession(s);
      })
      .catch(() => {
        // Cookie gone or expired — clear stale local session
        if (readAuthSession()) {
          clearAuthSession();
          setSession(null);
        }
      })
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    const onChange = () => refresh();
    window.addEventListener("incentral:auth-changed", onChange);
    return () => {
      window.removeEventListener("incentral:auth-changed", onChange);
    };
  }, [refresh]);

  const signOut = useCallback(async () => {
    await api.auth.signOut().catch(() => {});
    clearAuthSession();
    refresh();
  }, [refresh]);

  return {
    ready,
    session,
    isAuthenticated: Boolean(session?.authenticated),
    accountHref: authPage.accountHref,
    signInHref: authPage.signInHref,
    signOut,
  };
}
