export const authPage = {
  metadata: {
    title: "Sign In or Create Account",
    description:
      "Sign in to InCentral or create an account to manage orders, invoices, support and purchases.",
  },
  aside: {
    eyebrow: "My InCentral",
    title: "Sign In",
    lead: "Access your orders, invoices, support requests and account details.",
  },
  tabs: {
    signIn: "Sign In",
    create: "Create Account",
  },
  signIn: {
    title: "Welcome back",
    description: "Enter the email or mobile number linked to your account.",
    submit: "Sign In",
  },
  create: {
    eyebrow: "New to InCentral?",
    title: "Create your account",
    description: "Enter your details to create an InCentral account.",
    submit: "Create Account",
    termsHref: "/policies/terms-conditions",
    privacyHref: "/policies/privacy-notice",
  },
  checkoutContext: {
    message: "Sign in or create an account to continue to checkout.",
    backLabel: "Back to Cart",
    cartHref: "/cart",
  },
  messages: {
    passwordMismatch: "The passwords do not match.",
    signedIn: "Signed in.",
    accountCreated: "Account created.",
    signedInBrowse: "Signed in. You can continue browsing InCentral.",
    accountCreatedBrowse:
      "Account created. You are signed in and can continue browsing InCentral.",
    notConnected: "Account sign-in is not connected in this preview.",
  },
  demoAuthEnabled: true,
  accountHref: "/account",
  /** Account overview panel (dashboard home). */
  accountOverviewHref: "/account#overview",
  /** Signed-in support requests live in My InCentral, not the public /support page. */
  accountSupportHref: "/account#support",
  signInHref: "/sign-in?mode=login",
} as const;

export type AuthTab = "signin" | "create";
