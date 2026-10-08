import { planHref } from "@/config/plans";

export type CartProduct = {
  name: string;
  line: string;
  price: number;
  href: string;
  zohoVariantId: string;
};

export const CART_PRODUCTS: Record<string, CartProduct> = {
  "incert-ais-140": {
    name: "InCert",
    line: "AIS-140 Certified",
    price: 7140,
    href: planHref("incert", "ais"),
    zohoVariantId: "1916683000072816004",
  },
  "insight-ais-140": {
    name: "InSight",
    line: "AIS-140 Certified",
    price: 11280,
    href: planHref("insight", "ais"),
    zohoVariantId: "1916683000072816078",
  },
  "incert-standard": {
    name: "InCert",
    line: "Standard",
    price: 6660,
    href: planHref("incert", "standard"),
    zohoVariantId: "1916683000072816006",
  },
  "insight-standard": {
    name: "InSight",
    line: "Standard",
    price: 10560,
    href: planHref("insight", "standard"),
    zohoVariantId: "1916683000072816079",
  },
  "ingenious-ais-140": {
    name: "InGenious",
    line: "AIS-140 Certified",
    price: 21780,
    href: planHref("ingenious", "ais"),
    zohoVariantId: "1916683000072816145",
  },
  "invision-plus-ais-140": {
    name: "InVision+",
    line: "AIS-140 Certified",
    price: 57380,
    href: planHref("invision-plus", "ais"),
    zohoVariantId: "1916683000072816203",
  },
  "ingenious-standard": {
    name: "InGenious",
    line: "Standard",
    price: 19600,
    href: planHref("ingenious", "standard"),
    zohoVariantId: "1916683000072816146",
  },
  "invision-plus-standard": {
    name: "InVision+",
    line: "Standard",
    price: 51200,
    href: planHref("invision-plus", "standard"),
    zohoVariantId: "1916683000072816204",
  },
};

let cartPriceOverrides: Record<string, number> = {};

export function setCartProductPriceOverrides(overrides: Record<string, number>) {
  cartPriceOverrides = { ...overrides };
}

export function getCartProduct(sku: string) {
  const base = CART_PRODUCTS[sku];
  if (!base) return null;
  const price = cartPriceOverrides[sku] ?? base.price;
  return price === base.price ? base : { ...base, price };
}
