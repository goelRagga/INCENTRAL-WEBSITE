"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import { Container } from "@/components/common/container";
import { authPage, type AuthTab } from "@/config/auth";
import { parseAuthSearchParams } from "@/lib/auth/search-params";
import { resolveAuthRedirect } from "@/lib/auth/redirect";
import { writeAuthSession } from "@/lib/auth/session";
import { api } from "@/lib/backend";
import { cn } from "@/lib/utils";

function RequiredMarker() {
  return (
    <>
      <span aria-hidden="true" className="auth-required-marker">*</span>
      <span className="sr-only"> required</span>
    </>
  );
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor}>
      {children}
      <RequiredMarker />
    </label>
  );
}

type FormResult = { tone: "good" | "bad"; message: string } | null;

export function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const signInFormRef = useRef<HTMLFormElement>(null);
  const createFormRef = useRef<HTMLFormElement>(null);
  const signInResultRef = useRef<HTMLDivElement>(null);
  const createResultRef = useRef<HTMLDivElement>(null);

  const { mode: initialMode, next, checkout } = useMemo(
    () => parseAuthSearchParams(Object.fromEntries(searchParams.entries())),
    [searchParams]
  );

  const expired = searchParams.get("expired") === "1";

  const [activeTab, setActiveTab] = useState<AuthTab>(initialMode);
  const [submitting, setSubmitting] = useState(false);
  const [signInResult, setSignInResult] = useState<FormResult>(
    expired ? { tone: "bad", message: "Your session has expired. Please sign in again." } : null
  );
  const [createResult, setCreateResult] = useState<FormResult>(null);

  useEffect(() => { setActiveTab(initialMode); }, [initialMode]);

  const switchTab = useCallback(
    (tab: AuthTab) => {
      setActiveTab(tab);
      setSignInResult(null);
      setCreateResult(null);
      const params = new URLSearchParams(searchParams.toString());
      params.set("mode", tab === "create" ? "create" : "login");
      router.replace(`/sign-in?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const finishAuth = useCallback(
    (
      mode: AuthTab,
      user: { name?: string; company?: string; email?: string; mobile?: string },
      setResult: (r: FormResult) => void,
      resultRef: React.RefObject<HTMLDivElement | null>
    ) => {
      writeAuthSession({
        authenticated: true,
        identity: user.email ?? user.mobile ?? "account",
        name: user.name,
        company: user.company,
        email: user.email,
        mobile: user.mobile,
        mode: mode === "create" ? "create" : "signin",
        signedInAt: new Date().toISOString(),
      });

      const redirectTarget = next && next.startsWith("/") && !next.startsWith("//")
        ? next
        : resolveAuthRedirect(next, checkout);

      setResult({
        tone: "good",
        message: mode === "create" ? authPage.messages.accountCreated : authPage.messages.signedIn,
      });
      window.setTimeout(() => router.push(redirectTarget), 180);
    },
    [checkout, next, router]
  );

  const handleSignInSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = signInFormRef.current;
    if (!form?.reportValidity()) return;

    setSubmitting(true);
    setSignInResult(null);

    const data = new FormData(form);
    const email = String(data.get("identity") || "").trim();
    const password = String(data.get("password") || "");

    try {
      const { user } = await api.auth.signIn({ email, password });
      finishAuth("signin", user ?? {}, setSignInResult, signInResultRef);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign in failed. Check your credentials.";
      setSignInResult({ tone: "bad", message });
      signInResultRef.current?.focus();
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = createFormRef.current;
    if (!form?.reportValidity()) return;

    const data = new FormData(form);
    const password = String(data.get("password") || "");
    const confirmPassword = String(data.get("confirmPassword") || "");

    if (password !== confirmPassword) {
      setCreateResult({ tone: "bad", message: authPage.messages.passwordMismatch });
      createResultRef.current?.focus();
      return;
    }

    setSubmitting(true);
    setCreateResult(null);

    const name = String(data.get("name") || "").trim();
    const company = String(data.get("company") || "").trim();
    const email = String(data.get("email") || "").trim();
    const mobile = String(data.get("mobile") || "").trim();

    try {
      const { user } = await api.auth.signUp({ name, company, email, mobile, password });
      finishAuth("create", user ?? { name, email, mobile, company }, setCreateResult, createResultRef);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Account creation failed. Please try again.";
      setCreateResult({ tone: "bad", message });
      createResultRef.current?.focus();
    } finally {
      setSubmitting(false);
    }
  };

  const { aside, tabs, signIn, create, checkoutContext } = authPage;

  return (
    <main id="main" className="auth-page">
      <Container>
        <div className="auth-grid">
          <aside className="auth-aside">
            <p className="auth-eyebrow">{aside.eyebrow}</p>
            <h1>{aside.title}</h1>
            <p className="auth-lead">{aside.lead}</p>
            <p className="auth-aside-copy">{aside.body}</p>

            <div aria-label="Account journey" className="auth-path">
              {aside.journey.map((step, index) => (
                <div key={step.title} className="auth-path-item">
                  <span className="auth-path-num">{index + 1}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <span>{step.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <div className="auth-form-wrap">
            {checkout ? (
              <div className="auth-context">
                <span>
                  <strong>{checkoutContext.message}</strong>{" "}
                  {checkoutContext.detail}
                </span>
                <Link href={checkoutContext.cartHref}>{checkoutContext.backLabel}</Link>
              </div>
            ) : null}

            <div className="auth-tabs" role="tablist" aria-label="Account mode">
              <button type="button" role="tab" aria-selected={activeTab === "signin"} className="auth-tab" onClick={() => switchTab("signin")}>
                {tabs.signIn}
              </button>
              <button type="button" role="tab" aria-selected={activeTab === "create"} className="auth-tab" onClick={() => switchTab("create")}>
                {tabs.create}
              </button>
            </div>

            <form
              ref={signInFormRef}
              className={cn("auth-panel", activeTab !== "signin" && "hidden")}
              role="tabpanel"
              aria-hidden={activeTab !== "signin"}
              onSubmit={handleSignInSubmit}
            >
              <h2>{signIn.title}</h2>
              <p>{signIn.description}</p>

              <div className="auth-field">
                <FieldLabel htmlFor="signin-identity">Email or mobile number</FieldLabel>
                <input id="signin-identity" name="identity" autoComplete="username" required />
              </div>

              <div className="auth-field">
                <FieldLabel htmlFor="signin-password">Password</FieldLabel>
                <input id="signin-password" name="password" type="password" autoComplete="current-password" required />
              </div>

              {signInResult ? (
                <div ref={signInResultRef} tabIndex={-1} className={cn("auth-result", signInResult.tone === "good" ? "good" : "bad")}>
                  {signInResult.message}
                </div>
              ) : null}

              <p className="auth-note">
                {signIn.privacyNote}{" "}
                <Link href={signIn.privacyHref}>Privacy Notice</Link>
              </p>

              <div className="auth-footer-row">
                <p className="auth-required-note">
                  <span aria-hidden="true" className="auth-required-marker">*</span>{" "}
                  Fields marked with an asterisk are mandatory.
                </p>
                <button type="submit" className="auth-submit" disabled={submitting}>
                  {signIn.submit}
                </button>
              </div>
            </form>

            <form
              ref={createFormRef}
              className={cn("auth-panel", activeTab !== "create" && "hidden")}
              role="tabpanel"
              aria-hidden={activeTab !== "create"}
              onSubmit={handleCreateSubmit}
            >
              <div className="auth-create-head">
                <p className="auth-eyebrow">{create.eyebrow}</p>
                <h2>{create.title}</h2>
                <p>{create.description}</p>
              </div>

              <div className="auth-create-grid">
                <div className="auth-field">
                  <FieldLabel htmlFor="create-name">Full name</FieldLabel>
                  <input id="create-name" name="name" autoComplete="name" placeholder="Full name" required />
                </div>
                <div className="auth-field">
                  <FieldLabel htmlFor="create-company">Company</FieldLabel>
                  <input id="create-company" name="company" autoComplete="organization" placeholder="Company name" required />
                </div>
                <div className="auth-field">
                  <FieldLabel htmlFor="create-email">Work email</FieldLabel>
                  <input id="create-email" name="email" type="email" autoComplete="email" placeholder="name@company.com" required />
                </div>
                <div className="auth-field">
                  <FieldLabel htmlFor="create-mobile">Mobile number</FieldLabel>
                  <input id="create-mobile" name="mobile" type="tel" autoComplete="tel" placeholder="Mobile number" required />
                </div>
                <div className="auth-field">
                  <FieldLabel htmlFor="create-password">Create password</FieldLabel>
                  <input id="create-password" name="password" type="password" autoComplete="new-password" placeholder="Create password" required />
                </div>
                <div className="auth-field">
                  <FieldLabel htmlFor="create-confirm">Confirm password</FieldLabel>
                  <input id="create-confirm" name="confirmPassword" type="password" autoComplete="new-password" placeholder="Confirm password" required />
                </div>
              </div>

              {createResult ? (
                <div ref={createResultRef} tabIndex={-1} className={cn("auth-result", createResult.tone === "good" ? "good" : "bad")}>
                  {createResult.message}
                </div>
              ) : null}

              <p className="auth-legal">
                By creating an account, you agree to the{" "}
                <Link href={create.termsHref}>Terms & Conditions</Link> and acknowledge the{" "}
                <Link href={create.privacyHref}>Privacy Notice</Link>.
              </p>

              <div className="auth-footer-row auth-create-actions">
                <p className="auth-required-note">
                  <span aria-hidden="true" className="auth-required-marker">*</span>{" "}
                  Fields marked with an asterisk are mandatory.
                </p>
                <button type="submit" className="auth-submit" disabled={submitting}>
                  {create.submit}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </main>
  );
}
