import { setCartProductPriceOverrides } from "@/lib/commerce/catalog";
import { setProductPriceOverrides } from "@/lib/plan-finder/recommendation-engine";

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
    const sku = String(
      record.sku ?? record.item_sku ?? record.product_sku ?? record.id ?? ""
    )
      .trim()
      .toLowerCase();
    const price = Number(
      record.price ?? record.rate ?? record.unit_price ?? record.selling_price
    );
    if (!sku || !Number.isFinite(price) || price <= 0) continue;
    overrides[sku] = price;
  }

  if (Object.keys(overrides).length === 0) return;
  setProductPriceOverrides(overrides);
  setCartProductPriceOverrides(overrides);
}
