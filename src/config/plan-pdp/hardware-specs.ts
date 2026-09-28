import type { PlanPdpSpecRow } from "./types";

export const edgeEcoSpec: PlanPdpSpecRow[] = [
  { type: "group", label: "Positioning & connectivity" },
  { type: "row", label: "GNSS", value: "NavIC (IRNSS) + GPS with GAGAN support" },
  { type: "row", label: "SIM", value: "Embedded eSIM (M2M)" },
  { type: "row", label: "Antennas", value: "Internal GNSS and cellular antennas" },
  { type: "row", label: "Communication", value: "Real-time cellular data with dual IP support" },
  { type: "group", label: "Power & continuity" },
  { type: "row", label: "Input voltage", value: "8V to 32V DC" },
  { type: "row", label: "Internal backup battery", value: "More than 48-hour backup" },
  { type: "row", label: "Emergency support", value: "Panic button interface with SMS fallback" },
  { type: "row", label: "Tamper detection", value: "Device and power tamper alerts" },
  { type: "row", label: "Ignition detection", value: "Supported" },
  { type: "row", label: "Vehicle battery disconnect", value: "Supported" },
  { type: "row", label: "Offline data buffering", value: "Supported with automatic upload" },
  { type: "row", label: "Firmware updates", value: "Over-the-Air (OTA)" },
  { type: "group", label: "Storage & identity" },
  { type: "row", label: "Flash memory", value: "8 MB" },
  { type: "row", label: "Expandable memory", value: "16 MB" },
  { type: "row", label: "Device identity", value: "IMEI" },
  { type: "group", label: "Physical specifications" },
  { type: "row", label: "Ingress protection", value: "IP67" },
  { type: "row", label: "Enclosure", value: "Secure, tamper-resistant" },
  { type: "row", label: "Dimensions", value: "155.6 × 148 × 54 mm" },
  { type: "row", label: "Weight", value: "650 g" },
];

/** Shared spec sheet until product-specific EdgePrime / DriveAI rows are ported. */
export const edgePrimeSpec: PlanPdpSpecRow[] = edgeEcoSpec;

export const driveAiSpec: PlanPdpSpecRow[] = edgeEcoSpec;
