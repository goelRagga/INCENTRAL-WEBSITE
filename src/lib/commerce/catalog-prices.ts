import { setCartProductPriceOverrides } from "@/lib/commerce/catalog";
import { setProductPriceOverrides } from "@/lib/plan-finder/recommendation-engine";

let zohoProducts: unknown[] = [];

// Zoho product name → internal family key (matches PRODUCTS in recommendation-engine)
const PRODUCT_NAME_TO_FAMILY: Record<string, string> = {
  incert: "incert",
  insight: "insight",
  ingenious: "ingenious",
  "invision+": "invision-plus",
};

function deriveInternalSku(productName: string, variantName: string): string | null {
  const family = PRODUCT_NAME_TO_FAMILY[productName.toLowerCase().trim()];
  if (!family) return null;
  const isAis = variantName.toLowerCase().includes("ais");
  return `${family}-${isAis ? "ais-140" : "standard"}`;
}

// Zoho short descriptions keyed by internal family name
let zohoDescriptions: Record<string, string> = {};

/** Returns plain text (HTML tags stripped) from Zoho's product_short_description, or null. */
export function getZohoDescription(family: string): string | null {
  const html = zohoDescriptions[family];
  if (!html) return null;
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() || null;
}

export function storeCatalogProducts(rows: unknown[]): void {
  zohoProducts = rows.filter((p: unknown) => {
    const product = p as Record<string, unknown>;
    return product.status === "active" && product.show_in_storefront !== false;
  });

  // Index short descriptions by family key
  const descs: Record<string, string> = {};
  for (const p of zohoProducts) {
    const product = p as Record<string, unknown>;
    const name = String(product.name ?? product.product_name ?? "");
    const family = PRODUCT_NAME_TO_FAMILY[name.toLowerCase().trim()];
    const desc = String(product.product_short_description ?? product.description ?? "");
    if (family && desc) descs[family] = desc;
  }
  zohoDescriptions = descs;

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log(
      "[incentral] Zoho catalog cached:",
      zohoProducts.map((p: unknown) => {
        const product = p as Record<string, unknown>;
        return {
          name: product.name ?? product.product_name,
          variants: (Array.isArray(product.variants) ? product.variants : []).map(
            (v: unknown) => {
              const variant = v as Record<string, unknown>;
              return { name: variant.name ?? variant.variant_name, id: variant.variant_id ?? variant.id };
            }
          ),
        };
      })
    );
  }
}

export function findZohoVariantId(planName: string, aisRequired: boolean): string | undefined {
  const nameLower = planName.toLowerCase();
  const variantKeyword = aisRequired ? "ais" : "standard";
  for (const product of zohoProducts) {
    const p = product as Record<string, unknown>;
    const pName = String(p.name ?? p.product_name ?? "").toLowerCase();
    if (!pName.includes(nameLower)) continue;
    const variants = Array.isArray(p.variants) ? p.variants : [];
    for (const v of variants) {
      const variant = v as Record<string, unknown>;
      const vName = String(variant.name ?? variant.variant_name ?? "").toLowerCase();
      if (vName.includes(variantKeyword)) {
        return String(variant.variant_id ?? variant.id ?? "") || undefined;
      }
    }
    return String(p.variant_id ?? p.product_variant_id ?? p.id ?? "") || undefined;
  }
  return undefined;
}

/** Map live Zoho catalog rows to internal plan-finder SKUs by product name + variant name. */
export function applyCatalogPriceRows(rows: unknown): void {
  const list = Array.isArray(rows)
    ? rows
    : ((rows as { products?: unknown[] })?.products ??
      (rows as { items?: unknown[] })?.items ??
      []);

  const overrides: Record<string, number> = {};

  for (const row of list) {
    if (!row || typeof row !== "object") continue;
    const record = row as Record<string, unknown>;
    const productName = String(record.name ?? record.product_name ?? "");
    const variants = Array.isArray(record.variants) ? record.variants : [];

    if (variants.length > 0) {
      for (const v of variants) {
        const variant = v as Record<string, unknown>;
        const variantName = String(variant.name ?? variant.variant_name ?? "");
        const internalSku = deriveInternalSku(productName, variantName);
        const price = Number(
          variant.rate ?? variant.price ?? variant.selling_price ?? variant.unit_price
        );
        if (!internalSku || !Number.isFinite(price) || price <= 0) continue;
        overrides[internalSku] = price;
      }
    } else {
      // Single-variant product: derive from product name, assume standard
      const internalSku = deriveInternalSku(productName, "standard");
      const price = Number(
        record.price ?? record.rate ?? record.unit_price ?? record.selling_price
      );
      if (!internalSku || !Number.isFinite(price) || price <= 0) continue;
      overrides[internalSku] = price;
    }
  }

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log("[incentral] Price overrides resolved:", overrides);
  }

  if (Object.keys(overrides).length === 0) return;
  setProductPriceOverrides(overrides);
  setCartProductPriceOverrides(overrides);
}
