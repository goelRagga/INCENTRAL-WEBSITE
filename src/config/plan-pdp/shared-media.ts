import { assetImage } from "@/lib/assets";

export const inroutePlatform = {
  title: "Track vehicles, trips and hub activity in InRoute.",
  description: "See location, trips, hubs and geofences in one place.",
  image: assetImage("inroute-live-fleet-map.webp"),
  imageAlt: "InRoute operations map showing live fleet and trip tracking across India",
} as const;

export const inroutePlatformShort = {
  title: "Fleet visibility in InRoute.",
  description: "See trips, hubs and alerts in one place.",
  image: assetImage("inroute-live-fleet-map.webp"),
  imageAlt: "InRoute fleet map",
} as const;
