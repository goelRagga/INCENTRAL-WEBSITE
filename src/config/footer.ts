export type FooterLink = {
  id: string;
  label: string;
  href: string;
};

export type FooterNavGroup = {
  id: string;
  title: string;
  links: FooterLink[];
};

export const footerSupport = {
  kicker: "24×7 customer support",
  title: "Need help choosing a solution or managing an order?",
  phone: {
    label: "Phone support",
    value: "1800-268-9111",
    href: "tel:18002689111",
  },
  email: {
    label: "Email support",
    value: "commandcenter@intangles.com",
    href: "mailto:commandcenter@intangles.com",
  },
  cta: {
    label: "Contact Support →",
    href: "/support",
  },
} as const;

export const footerNavGroups: FooterNavGroup[] = [
  {
    id: "explore",
    title: "Explore",
    links: [
      { id: "finder", label: "Find the right solution", href: "/#check-compatibility" },
      { id: "solutions", label: "Solutions", href: "/solutions" },
      { id: "compare", label: "Compare Solutions", href: "/compare-solutions" },
      { id: "ais", label: "AIS-140 Guide", href: "/ais-140-guide" },
    ],
  },
  {
    id: "account",
    title: "My InCentral",
    links: [
      { id: "dashboard", label: "Sign In", href: "/sign-in?mode=login" },
      { id: "orders", label: "Orders", href: "/sign-in?mode=login&next=orders" },
      { id: "cart", label: "Cart", href: "/cart" },
    ],
  },
  {
    id: "help",
    title: "Help",
    links: [
      { id: "help-home", label: "Help", href: "/help" },
      { id: "support", label: "Support", href: "/support" },
      { id: "warranty", label: "Warranty", href: "/help/warranty-support" },
    ],
  },
  {
    id: "policies",
    title: "Policies",
    links: [
      {
        id: "returns",
        label: "Returns, Refunds & Cancellation",
        href: "/policies/returns-refunds-cancellation",
      },
      { id: "privacy", label: "Privacy Notice", href: "/policies/privacy-notice" },
      { id: "terms", label: "Terms & Conditions", href: "/policies/terms-conditions" },
    ],
  },
];

export const footerCompany = {
  kicker: "Company information",
} as const;

export const footerSocial = {
  kicker: "Follow Intangles",
} as const;

export const footerSocialLinks = [
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://in.linkedin.com/company/intangles-lab-pvt-ltd",
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/intangles",
  },
  {
    id: "x",
    label: "X",
    href: "https://x.com/intangles",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/intangles.lab/",
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@intangles",
  },
] as const;
