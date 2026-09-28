export const notFoundPage = {
  code: "404 · Page not found",
  title: "We could not find this page.",
  devStatus: {
    label: "Development in progress",
    hint: "New routes and features are being added to InCentral.",
  },
  actions: {
    primary: { label: "Back to InCentral", href: "/" },
    secondary: {
      label: "Find the right solution",
      href: "/#check-compatibility",
    },
  },
  shortcuts: {
    label: "Continue to",
    links: [
      { label: "Solutions", href: "/solutions" },
      { label: "Help", href: "/help" },
      { label: "Support", href: "/support" },
    ],
  },
  visual: {
    image: "/images/hero/hero-ingenious-concept.webp",
    note: "Useful links",
  },
} as const;
