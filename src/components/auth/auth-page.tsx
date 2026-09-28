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
import { useConfiguredCart } from "@/hooks/use-configured-cart";
import { cn } from "@/lib/utils";

function RequiredMarker() {
  return (
    <>
      <span aria-hidden="true" className="required-marker">
        *
      </span>
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

  const { deviceCount } = useConfiguredCart();
  const nextPath = (next?.split("?")[0] ?? "").replace(/^\//, "");
  const accountOnlyNext = nextPath === "account" || nextPath === "orders";
  const showCheckoutContext =
    !accountOnlyNext && (checkout || deviceCount > 0 || !next);

  const expired = searchParams.get("expired") === "1";

  const [activeTab, setActiveTab] = useState<AuthTab>(initialMode);
  const [submitting, setSubmitting] = useState(false);
  const [signInResult, setSignInResult] = useState<FormResult>(
    expired ? { tone: "bad", message: "Your session has expired. Please sign in again." } : null
  );
  const [createResult, setCreateResult] = useState<FormResult>(null);

  useEffect(() => {
    setActiveTab(initialMode);
  }, [initialMode]);

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
      setResult: (r: FormResult) => void
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

      const redirectTarget =
        next && next.startsWith("/") && !next.startsWith("//")
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
      finishAuth("signin", user ?? {}, setSignInResult);
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
      finishAuth("create", user ?? { name, email, mobile, company }, setCreateResult);
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
    <main id="main" className="page-shell commerce-page">
      <section className="auth-v52">
        <Container>
          <div className="auth-v52-grid">
            <aside className="auth-v52-aside">
              <p className="eyebrow eyebrow">{aside.eyebrow}</p>
              <h1>{aside.title}</h1>
              <p className="lead">{aside.lead}</p>
            </aside>

            <div className="auth-v52-form-wrap">
              {showCheckoutContext ? (
                <div className="auth-v52-context" data-auth-checkout-context="">
                  <span data-auth-context-message="">{checkoutContext.message}</span>
                  <Link href={checkoutContext.cartHref}>{checkoutContext.backLabel}</Link>
                </div>
              ) : null}

              <div className="auth-v52-tabs" role="tablist" aria-label="Account mode">
                <button
                  type="button"
                  role="tab"
                  className="tab"
                  aria-selected={activeTab === "signin"}
                  onClick={() => switchTab("signin")}
                >
                  {tabs.signIn}
                </button>
                <button
                  type="button"
                  role="tab"
                  className="tab"
                  aria-selected={activeTab === "create"}
                  onClick={() => switchTab("create")}
                >
                  {tabs.create}
                </button>
              </div>

              <form
                ref={signInFormRef}
                className="auth-v52-panel"
                hidden={activeTab !== "signin"}
                onSubmit={handleSignInSubmit}
              >
                <h2>{signIn.title}</h2>
                <p>{signIn.description}</p>

                <div className="field">
                  <FieldLabel htmlFor="signin-identity">Email address</FieldLabel>
                  <input
                    id="signin-identity"
                    name="identity"
                    type="email"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="field">
                  <FieldLabel htmlFor="signin-password">Password</FieldLabel>
                  <input
                    id="signin-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                  />
                </div>

                {signInResult ? (
                  <div
                    ref={signInResultRef}
                    tabIndex={-1}
                    className={cn(
                      "form-result auth-v52-result",
                      signInResult.tone === "good" ? "good" : "bad"
                    )}
                  >
                    {signInResult.message}
                  </div>
                ) : null}

                <div className="form-footer-row">
                  <p className="form-required-note">
                    <span aria-hidden="true" className="required-marker">
                      *
                    </span>{" "}
                    Fields marked with an asterisk are mandatory.
                  </p>
                  <div className="form-actions">
                    <button type="submit" className="btn primary" disabled={submitting}>
                      {signIn.submit}
                    </button>
                  </div>
                </div>
              </form>

              <form
                ref={createFormRef}
                className="auth-v52-panel auth-v55-create"
                hidden={activeTab !== "create"}
                onSubmit={handleCreateSubmit}
              >
                <div className="auth-v55-create-head">
                  <p className="eyebrow">{create.eyebrow}</p>
                  <h2>{create.title}</h2>
                  <p>{create.description}</p>
                </div>

                <div className="auth-v55-create-grid">
                  <div className="field">
                    <FieldLabel htmlFor="create-name">Full name</FieldLabel>
                    <input
                      id="create-name"
                      name="name"
                      autoComplete="name"
                      placeholder="Full name"
                      required
                    />
                  </div>
                  <div className="field">
                    <FieldLabel htmlFor="create-company">Company</FieldLabel>
                    <input
                      id="create-company"
                      name="company"
                      autoComplete="organization"
                      placeholder="Company name"
                      required
                    />
                  </div>
                  <div className="field">
                    <FieldLabel htmlFor="create-email">Work email</FieldLabel>
                    <input
                      id="create-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@company.com"
                      required
                    />
                  </div>
                  <div className="field">
                    <FieldLabel htmlFor="create-mobile">Mobile number</FieldLabel>
                    <input
                      id="create-mobile"
                      name="mobile"
                      type="tel"
                      autoComplete="tel"
                      placeholder="Mobile number"
                      required
                    />
                  </div>
                  <div className="field">
                    <FieldLabel htmlFor="create-password">Create password</FieldLabel>
                    <input
                      id="create-password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Create password"
                      required
                    />
                  </div>
                  <div className="field">
                    <FieldLabel htmlFor="create-confirm">Confirm password</FieldLabel>
                    <input
                      id="create-confirm"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Confirm password"
                      required
                    />
                  </div>
                </div>

                {createResult ? (
                  <div
                    ref={createResultRef}
                    tabIndex={-1}
                    className={cn(
                      "form-result auth-v52-result",
                      createResult.tone === "good" ? "good" : "bad"
                    )}
                  >
                    {createResult.message}
                  </div>
                ) : null}

                <p className="auth-v55-legal">
                  By creating an account, you agree to the{" "}
                  <Link href={create.termsHref}>Terms & Conditions</Link> and acknowledge the{" "}
                  <Link href={create.privacyHref}>Privacy Notice</Link>.
                </p>

                <div className="form-footer-row auth-v55-create-actions">
                  <p className="form-required-note">
                    <span aria-hidden="true" className="required-marker">
                      *
                    </span>{" "}
                    Fields marked with an asterisk are mandatory.
                  </p>
                  <div className="form-actions">
                    <button type="submit" className="btn primary" disabled={submitting}>
                      {create.submit}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
