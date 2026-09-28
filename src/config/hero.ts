export const heroContent = {
  eyebrow: "Flexible fleet intelligence",
  title: "Choose the solution that fits each vehicle's needs.",
  lead:
    "With solutions across cabs, three-wheelers, commercial vehicles and buses, Intangles gives you the flexibility to choose different plans for different vehicles based on what each one requires.",
  actions: {
    primary: {
      label: "Find the right solution",
      href: "#check-compatibility",
    },
    secondary: {
      label: "Explore all solutions",
      href: "/solutions",
    },
  },
  intelligencePanel: {
    kicker: "Capability range",
    title: "Choose the capabilities that fit the job.",
    chip: "Flexible By Need",
    capabilities: [
      {
        id: "health",
        title: "Predictive Vehicle Health Monitoring",
        toneClass: "h140-violet",
      },
      {
        id: "automation",
        title: "Automated Fleet Tasks & Fleet Reports",
        toneClass: "h140-teal",
      },
      {
        id: "fuel",
        title: "Fuel Consumption & Management",
        toneClass: "h140-cyan",
      },
      {
        id: "fault",
        title: "Vehicle Fault Codes and Repair Guidance",
        toneClass: "h140-amber",
      },
      {
        id: "driver",
        title: "Driver Behaviour Monitoring",
        toneClass: "h140-blue",
      },
      {
        id: "video",
        title: "AI-Driven Video Telematics",
        toneClass: "h140-green",
      },
    ],
  },
} as const;
