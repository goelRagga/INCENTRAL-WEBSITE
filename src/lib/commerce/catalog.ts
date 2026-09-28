import { planHref } from "@/config/plans";

export type CartProduct = {
  name: string;
  line: string;
  price: number;
  href: string;
};

export const CART_PRODUCTS: Record<string, CartProduct> = {
  "incert-ais-140": {
    name: "InCert",
    line: "AIS-140 Certified",
    price: 7140,
    href: planHref("incert", "ais"),
  },
  "insight-ais-140": {
    name: "InSight",
    line: "AIS-140 Certified",
    price: 11280,
    href: planHref("insight", "ais"),
  },
  "incert-standard": {
    name: "InCert",
    line: "Standard",
    price: 6660,
    href: planHref("incert", "standard"),
  },
  "insight-standard": {
    name: "InSight",
    line: "Standard",
    price: 10560,
    href: planHref("insight", "standard"),
  },
  "ingenious-ais-140": {
    name: "InGenious",
    line: "AIS-140 Certified",
    price: 21780,
    href: planHref("ingenious", "ais"),
  },
  "invision-plus-ais-140": {
    name: "InVision+",
    line: "AIS-140 Certified",
    price: 57380,
    href: planHref("invision-plus", "ais"),
  },
  "ingenious-standard": {
    name: "InGenious",
    line: "Standard",
    price: 19600,
    href: planHref("ingenious", "standard"),
  },
  "invision-plus-standard": {
    name: "InVision+",
    line: "Standard",
    price: 51200,
    href: planHref("invision-plus", "standard"),
  },
};

export function getCartProduct(sku: string) {
  return CART_PRODUCTS[sku] ?? null;
}
