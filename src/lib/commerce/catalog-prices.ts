import { setCartProductPriceOverrides } from "@/lib/commerce/catalog";
import { setProductPriceOverrides } from "@/lib/plan-finder/recommendation-engine";

let zohoProducts: unknown[] = [];

export function storeCatalogProducts(rows: unknown[]): void {
  zohoProducts = rows.filter((p: unknown) => {
    const product = p as Record<string, unknown>;
    return product.status === "active" && product.show_in_storefront === true;
  });
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log(
      "[incentral] Zoho catalog cached:",
      rows.map((p: unknown) => {
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

/** Map live catalog API rows to plan-finder SKUs; ignore unknown rows. */
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
    const variants = Array.isArray(record.variants) ? record.variants : [];

    if (variants.length > 0) {
      // Zoho Admin API: prices are on variants, not product root
      for (const v of variants) {
        const variant = v as Record<string, unknown>;
        const sku = String(variant.sku ?? "").trim().toLowerCase();
        const price = Number(
          variant.rate ?? variant.price ?? variant.selling_price ?? variant.unit_price
        );
        if (!sku || !Number.isFinite(price) || price <= 0) continue;
        overrides[sku] = price;
      }
    } else {
      // Fallback: product-level SKU/price
      const sku = String(
        record.sku ?? record.item_sku ?? record.product_sku ?? ""
      ).trim().toLowerCase();
      const price = Number(
        record.price ?? record.rate ?? record.unit_price ?? record.selling_price
      );
      if (!sku || !Number.isFinite(price) || price <= 0) continue;
      overrides[sku] = price;
    }
  }

  if (Object.keys(overrides).length === 0) return;
  setProductPriceOverrides(overrides);
  setCartProductPriceOverrides(overrides);
}
