/* v241 shared vehicle compatibility and AIS certification-coverage data.
   OEMs with identical compatibility matrices are grouped into one customer-facing option. */

type EmissionMap = Record<string, PlanFamily[]>;
type PlanFamily = string;

type OemMember = { key: string; label: string };

type OemEntry = {
  label: string;
  emissions: EmissionMap;
  hidden?: boolean;
  canonical?: string;
  members?: OemMember[];
  partnerPlatform?: string;
  partnerBrand?: string;
  partnerKey?: string;
};

type SegmentEntry = {
  label: string;
  oems: Record<string, OemEntry>;
};

const COMPATIBILITY_MAPS = {
  cabs: { Diesel: ["incert"] as PlanFamily[] },
  threeW: { "BS-VI": ["incert", "insight"] as PlanFamily[] },
  scv: {
    "BS-II / BS-III / BS-IV": ["incert"] as PlanFamily[],
    "BS-VI": ["insight"] as PlanFamily[],
  },
  vansMain: {
    "BS-II / BS-III / BS-IV": ["incert"] as PlanFamily[],
    "BS-VI": ["insight", "ingenious", "invisionplus"] as PlanFamily[],
  },
  vansForce: {
    "BS-II / BS-III": ["incert"] as PlanFamily[],
    "BS-IV / BS-VI": ["insight"] as PlanFamily[],
  },
  lcv: {
    "BS-II / BS-III / BS-IV": ["incert"] as PlanFamily[],
    "BS-VI": ["insight", "ingenious", "invisionplus"] as PlanFamily[],
  },
  mhcvMain: {
    "BS-II / BS-III / BS-IV": ["incert"] as PlanFamily[],
    "BS-VI": ["insight", "ingenious", "invisionplus"] as PlanFamily[],
  },
  mhcvMahindra: {
    "BS-II / BS-III": ["incert"] as PlanFamily[],
    "BS-IV": ["insight"] as PlanFamily[],
    "BS-VI": ["insight", "invisionplus"] as PlanFamily[],
  },
  buses: {
    "BS-II / BS-III / BS-IV": ["incert"] as PlanFamily[],
    "BS-VI": ["insight", "ingenious", "invisionplus"] as PlanFamily[],
  },
};

const oem = (label: string, emissions: EmissionMap, meta: Partial<OemEntry> = {}) =>
  ({ label, emissions, ...meta }) as OemEntry;

const groupedOems = (
  emissions: EmissionMap,
  entries: [string, string][],
  groupKey?: string
) => {
  const key = groupKey || entries.map(([entryKey]) => entryKey).join("-or-");
  const label = entries.map(([, name]) => name).join(" / ");
  const members = entries.map(([entryKey, name]) => ({ key: entryKey, label: name }));
  const grouped: Record<string, OemEntry> = {
    [key]: oem(label, emissions, { members }),
  };
  entries.forEach(([entryKey, name]) => {
    grouped[entryKey] = oem(name, emissions, { hidden: true, canonical: key });
  });
  return grouped;
};

export const vehicleData: Record<string, SegmentEntry> = {
  cabs: {
    label: "Cabs",
    oems: {
      ...groupedOems(
        COMPATIBILITY_MAPS.cabs,
        [
          ["maruti-suzuki", "Maruti Suzuki"],
          ["hyundai", "Hyundai"],
          ["tata-motors", "Tata Motors"],
          ["toyota", "Toyota"],
          ["honda", "Honda"],
        ],
        "cabs-main"
      ),
    },
  },
  "3w": {
    label: "Three-Wheeler (3W)",
    oems: {
      ...groupedOems(
        COMPATIBILITY_MAPS.threeW,
        [
          ["bajaj-auto", "Bajaj Auto"],
          ["mahindra", "Mahindra"],
          ["piaggio", "Piaggio"],
          ["tvs-motor", "TVS Motor"],
          ["atul-auto", "Atul Auto"],
        ],
        "3w-main"
      ),
    },
  },
  scv: {
    label: "Small Commercial Vehicle (under 3.5T)",
    oems: {
      ...groupedOems(
        COMPATIBILITY_MAPS.scv,
        [
          ["tata-motors", "Tata Motors"],
          ["mahindra", "Mahindra"],
          ["ashok-leyland", "Ashok Leyland"],
          ["maruti-suzuki", "Maruti Suzuki"],
          ["force-motors", "Force Motors"],
        ],
        "scv-main"
      ),
    },
  },
  vans: {
    label: "Vans / Wingers",
    oems: {
      "tata-motors": oem("Tata Motors", COMPATIBILITY_MAPS.vansMain),
      mahindra: oem("Mahindra", COMPATIBILITY_MAPS.vansMain, {
        partnerPlatform: "Mahindra iMAXX",
        partnerBrand: "Mahindra",
        partnerKey: "imaxx",
      }),
      "force-motors": oem("Force Motors", COMPATIBILITY_MAPS.vansForce, {
        partnerPlatform: "Force iPULSe",
        partnerBrand: "Force Motors",
        partnerKey: "ipulse",
      }),
    },
  },
  lcv: {
    label: "LCV / ICV (7.5 to 16T)",
    oems: {
      ...groupedOems(
        COMPATIBILITY_MAPS.lcv,
        [
          ["tata-motors", "Tata Motors"],
          ["ashok-leyland", "Ashok Leyland"],
          ["eicher-vecv", "Eicher (VECV)"],
          ["bharatbenz", "BharatBenz"],
          ["sml-isuzu", "SML Isuzu"],
        ],
        "lcv-main"
      ),
      mahindra: oem("Mahindra", COMPATIBILITY_MAPS.lcv, {
        partnerPlatform: "Mahindra iMAXX",
        partnerBrand: "Mahindra",
        partnerKey: "imaxx",
      }),
      "force-motors": oem("Force Motors", COMPATIBILITY_MAPS.lcv, {
        partnerPlatform: "Force iPULSe",
        partnerBrand: "Force Motors",
        partnerKey: "ipulse",
      }),
    },
  },
  mhcv: {
    label: "M&HCV (16 to 55T)",
    oems: {
      ...groupedOems(
        COMPATIBILITY_MAPS.mhcvMain,
        [
          ["tata-motors", "Tata Motors"],
          ["ashok-leyland", "Ashok Leyland"],
          ["eicher-vecv", "Eicher (VECV)"],
          ["bharatbenz", "BharatBenz"],
          ["sml-isuzu", "SML Isuzu"],
        ],
        "mhcv-main"
      ),
      mahindra: oem("Mahindra", COMPATIBILITY_MAPS.mhcvMahindra, {
        partnerPlatform: "Mahindra iMAXX",
        partnerBrand: "Mahindra",
        partnerKey: "imaxx",
      }),
    },
  },
  buses: {
    label: "Buses",
    oems: {
      ...groupedOems(
        COMPATIBILITY_MAPS.buses,
        [
          ["tata-motors", "Tata Motors"],
          ["ashok-leyland", "Ashok Leyland"],
          ["eicher-vecv", "Eicher (VECV)"],
          ["bharatbenz", "BharatBenz"],
        ],
        "buses-main"
      ),
      "force-motors": oem("Force Motors", COMPATIBILITY_MAPS.buses, {
        partnerPlatform: "Force iPULSe",
        partnerBrand: "Force Motors",
        partnerKey: "ipulse",
      }),
    },
  },
  other: { label: "Other / not listed", oems: {} },
};

export const visibleOemEntries = (segmentKey: string) =>
  Object.entries(vehicleData[segmentKey]?.oems || {}).filter(
    ([, manufacturer]) => !manufacturer.hidden
  );

export const canonicalMake = (segmentKey: string, makeKey: string) =>
  vehicleData[segmentKey]?.oems?.[makeKey]?.canonical || makeKey;

export const resolveOem = (segmentKey: string, makeKey: string) =>
  vehicleData[segmentKey]?.oems?.[canonicalMake(segmentKey, makeKey)] || null;

export type PartnerInstallInfo = {
  brand: string;
  platform: string;
  key: string;
  make: string;
  segment: string;
  emission: string;
};

/** BS-VI InGenious installs via OEM telematics partner (Mahindra iMAXX, Force iPULSe, etc.). */
export function partnerInstallFor(
  segmentKey: string,
  makeKey: string,
  emission: string
): PartnerInstallInfo | null {
  const manufacturer = resolveOem(segmentKey, makeKey);
  if (!manufacturer || emission !== "BS-VI" || !manufacturer.partnerPlatform) {
    return null;
  }
  const compatible = manufacturer.emissions?.[emission] || [];
  if (!compatible.includes("ingenious")) return null;
  return {
    brand: manufacturer.partnerBrand || manufacturer.label,
    platform: manufacturer.partnerPlatform,
    key: manufacturer.partnerKey || "",
    make: canonicalMake(segmentKey, makeKey),
    segment: segmentKey,
    emission,
  };
}

export const INDIA_REGIONS = [
  { id: "andhra-pradesh", label: "Andhra Pradesh", type: "state" },
  { id: "arunachal-pradesh", label: "Arunachal Pradesh", type: "state" },
  { id: "assam", label: "Assam", type: "state" },
  { id: "bihar", label: "Bihar", type: "state" },
  { id: "chhattisgarh", label: "Chhattisgarh", type: "state" },
  { id: "goa", label: "Goa", type: "state" },
  { id: "gujarat", label: "Gujarat", type: "state" },
  { id: "haryana", label: "Haryana", type: "state" },
  { id: "himachal-pradesh", label: "Himachal Pradesh", type: "state" },
  { id: "jharkhand", label: "Jharkhand", type: "state" },
  { id: "karnataka", label: "Karnataka", type: "state" },
  { id: "kerala", label: "Kerala", type: "state" },
  { id: "madhya-pradesh", label: "Madhya Pradesh", type: "state" },
  { id: "maharashtra", label: "Maharashtra", type: "state" },
  { id: "manipur", label: "Manipur", type: "state" },
  { id: "meghalaya", label: "Meghalaya", type: "state" },
  { id: "mizoram", label: "Mizoram", type: "state" },
  { id: "nagaland", label: "Nagaland", type: "state" },
  { id: "odisha", label: "Odisha", type: "state" },
  { id: "punjab", label: "Punjab", type: "state" },
  { id: "rajasthan", label: "Rajasthan", type: "state" },
  { id: "sikkim", label: "Sikkim", type: "state" },
  { id: "tamil-nadu", label: "Tamil Nadu", type: "state" },
  { id: "telangana", label: "Telangana", type: "state" },
  { id: "tripura", label: "Tripura", type: "state" },
  { id: "uttar-pradesh", label: "Uttar Pradesh", type: "state" },
  { id: "uttarakhand", label: "Uttarakhand", type: "state" },
  { id: "west-bengal", label: "West Bengal", type: "state" },
  { id: "andaman-nicobar", label: "Andaman and Nicobar Islands", type: "ut" },
  { id: "chandigarh", label: "Chandigarh", type: "ut" },
  {
    id: "dadra-nagar-haveli-daman-diu",
    label: "Dadra and Nagar Haveli and Daman and Diu",
    type: "ut",
  },
  { id: "delhi", label: "Delhi", type: "ut" },
  { id: "jammu-kashmir", label: "Jammu and Kashmir", type: "ut" },
  { id: "ladakh", label: "Ladakh", type: "ut" },
  { id: "lakshadweep", label: "Lakshadweep", type: "ut" },
  { id: "puducherry", label: "Puducherry", type: "ut" },
] as const;

export const AIS_COVERAGE_CONFIRMED = new Set([
  "andaman-nicobar",
  "andhra-pradesh",
  "arunachal-pradesh",
  "assam",
  "bihar",
  "chandigarh",
  "chhattisgarh",
  "delhi",
  "goa",
  "gujarat",
  "haryana",
  "himachal-pradesh",
  "jammu-kashmir",
  "jharkhand",
  "kerala",
  "manipur",
  "mizoram",
  "nagaland",
  "odisha",
  "puducherry",
  "rajasthan",
  "sikkim",
  "telangana",
  "uttarakhand",
]);

export const AIS_COVERAGE_REQUIRES_CONFIRMATION = new Set([
  "dadra-nagar-haveli-daman-diu",
]);
