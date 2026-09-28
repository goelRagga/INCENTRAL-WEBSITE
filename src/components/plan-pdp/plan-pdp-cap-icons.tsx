import type { PlanPdpCapabilityIcon } from "@/config/plan-pdp";

export function PlanPdpCapIcon({ icon }: { icon: PlanPdpCapabilityIcon }) {
  switch (icon) {
    case "location":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
          <circle cx="12" cy="10" r="2.2" />
        </svg>
      );
    case "hub":
    case "fuel":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M5 3h10l4 4v14H5V3Z" />
          <path d="M15 3v5h4M8 16v-3M12 16v-6M16 16v-4" />
        </svg>
      );
    case "driver":
    case "repair":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="3" />
          <path d="M6 20c.7-4 2.7-6 6-6s5.3 2 6 6M3 12a9 9 0 0 1 18 0" />
        </svg>
      );
    case "trip":
    case "fault":
    case "health":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="m5 7 7-4 7 4v10l-7 4-7-4V7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "automation":
    case "analytics":
    case "video":
    case "adas":
    case "voice":
    case "vod":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <rect x="4" y="5" width="16" height="14" rx="2" />
          <path d="M8 9h8M8 13h5" />
        </svg>
      );
    default:
      return null;
  }
}
