# InCentral × Zoho — Compliance Checklist

> **Rule of thumb:** Zoho owns money, catalog, stock, tax and orders. Front-end owns rules and decisions.
>
> **Build status:** Authentication flow ✅ · Plan Finder ✅ · Add-to-Cart ✅ · Everything else: 🔜 build line by line

---

## Section A — Zoho as System of Record

| # | Requirement | Status | Detail |
|---|---|---|---|
| A1 | 4 plan products in Zoho (InCert, InSight, InGenious, InVision+) | ⚪ N/A (Zoho admin) | BFF wires 8 SKUs correctly |
| A2 | Standard / AIS-140 as "Version" variant attribute | ⚪ N/A (Zoho admin) | BFF matches by "ais"/"standard" substring in variant name |
| A3 | Price in Zoho, fetched live | 🟠 PARTIAL | `applyCatalogPriceRows()` works — checkout defaults to `mock` without `NEXT_PUBLIC_CHECKOUT_MODE=api` |
| A4 | "What this plan includes" → Zoho product description (rich HTML) | 🔴 MISSING | PDP content is static in `src/config/plan-pdp/*.ts`; never fetched from Zoho |
| A5 | Hero / kit images → Zoho product images | 🔴 MISSING | Images come from `shared-media.ts`, not Zoho product documents |
| A6 | Plan grouping → Zoho category | ⚪ N/A (Zoho admin) | BFF endpoint exists; not consumed by UI yet |
| A7 | Stock / availability → Zoho inventory per variant | 🔴 MISSING | No stock check anywhere — out-of-stock variants show as available |
| A8 | GST 18% tax class on products + installation | 🟠 PARTIAL | `GST_RATE=0.18` in `constants.ts` for display math ✓ — Zoho tax class is an admin task |
| A9 | Coupons → Zoho coupon system | 🔴 BROKEN | `coupon.ts` is a local stub — only `FLEET10` hardcoded, never calls BFF `/coupons/apply` → Zoho |
| A10 | Cart / checkout / payment / orders / invoices → Zoho APIs | 🟠 PARTIAL | BFF routes exist; dead in `mock` mode (see A3) |
| A11 | Customers + order history → Zoho | ✅ IMPLEMENTED | Account page proxies Zoho orders / profile |
| A12 | Installation fee ₹500/device → separate Zoho product "Intangles Installation" | 🔴 MISSING | Fee computed client-side; installation product SKU not in any BFF config or env var |

---

## Section B — Front-end Owns Rules & Decisions

| # | Requirement | Status | Detail |
|---|---|---|---|
| B1 | Compatibility rules matrix (segment / make / emission / AIS / state → plan fit) | ✅ IMPLEMENTED | `compatibility-data.ts` + `vehicleEligibility()` |
| B2 | Recommendation engine (Recommended / Closest Fit / Why / Also included / Not covered) | ✅ IMPLEMENTED | `rankEligibleFamilies()` full logic |
| B3 | Needs picker (6 outcomes, labels, icons) | ✅ IMPLEMENTED | 7 NEEDS keys → 6 displayed outcomes via `needOutcomes()` |
| B4 | Compare-solutions feature matrix (9 groups, ✓/×/−) | 🟡 PARTIAL | 9 groups exist; type is `boolean` only — `−` (partial) value can't be represented |
| B5 | Machine-readable capability keys app-side | ✅ IMPLEMENTED | `CAPABILITIES` in engine; human text lives in Zoho |
| B6 | AIS-140 state / UT list + coverage logic | ✅ IMPLEMENTED | `INDIA_REGIONS`, `AIS_COVERAGE_*`, `aisCoverageStatus()`, `aisLineNeedsQuote()` |
| B7 | Quote trigger: qty >25 per-product OR whole-order → relabel "Add to Quote" | 🟡 PARTIAL | Checks whole-order total only (`totalCount > 25`); **per-product line qty >25 not checked** |
| B8 | Add-to-Quote = Zoho add-to-cart API (no separate quote system) | 🔴 BROKEN | Quote flow redirects to `/get-a-quote` form — never calls Zoho's add-to-cart API |
| B9 | Testimonials / geo-gating / marketing copy → presentation layer | ✅ IMPLEMENTED | Static config files, not Zoho |

---

## Section C — Installation Model

| # | Requirement | Status | Detail |
|---|---|---|---|
| C1 | "Intangles Installation" Zoho product (₹500, GST-taxable, hidden) | ⚪ N/A (Zoho admin) | SKU / product ID not yet referenced in any BFF config or env var |
| C2 | BFF composes two-line cart: Installed → device(N) + Installation(N); Self → device only | 🔴 MISSING | `POST /cart` sends one line only; two-line composition not implemented in BFF |
| C3 | InVision+ → always add Installation line, hide "self" (driven by `installation_policy`) | 🟡 PARTIAL | `installationPolicy()` enforces this display-side via SKU prefix; Zoho never gets the installation line (C2 missing) |
| C4 | Store chosen method on order line (custom field / note) | 🔴 MISSING | `placeOrder()` passes only `{ payment_method }` — no installation method note sent to Zoho |

---

## Section D — Zoho Product Custom Fields

| # | Field | Status | Detail |
|---|---|---|---|
| D1 | `family_key` (incert/insight/ingenious/invisionplus) | ⚪ N/A (Zoho admin) | Not consumed by BFF yet |
| D2 | `tier_rank` (1–4) | ⚪ N/A (Zoho admin) | Ranking done app-side via `FAMILY_RANK` |
| D3 | `installation_policy` (mandatory/optional/none) | 🟡 PARTIAL | Logic inferred from SKU prefix (`invision*`), not read from Zoho custom field |
| D4 | `capability_tags` (optional comma list) | ✅ N/A | Capability logic stays app-side per spec |

---

## Section E — Future Dashboard Split

| # | Requirement | Status | Detail |
|---|---|---|---|
| E1 | Commerce fields → Zoho Admin API | 🟡 PARTIAL | BFF `GET /catalog/products` + `applyCatalogPriceRows()` work; stock/images/description not consumed |
| E2 | Logic metadata → own config store | ✅ IMPLEMENTED | All matrices/engines in `src/config/` and `src/lib/plan-finder/` |

---

## Zoho Setup Checklist (code-side verifications)

| # | Check | Status | Detail |
|---|---|---|---|
| Z1 | `GET /products` returns all 4 plans with Version variants + prices | 🟡 PARTIAL | Endpoint exists; variant name matching via substring is fragile |
| Z2 | Installation product surfaces with ₹500 + tax | 🔴 MISSING | No code filters / surfaces "Intangles Installation" from catalog; SKU not referenced |
| Z3 | Custom fields appear in product payload | 🔴 MISSING | `applyCatalogPriceRows()` ignores custom fields entirely — no mapping for `family_key`, `tier_rank`, `installation_policy` |
| Z4 | Test cart: device + installation line, GST correct | 🔴 MISSING | Two-line cart not implemented (C2); GST display math correct on front-end only |

---

## Bug Priority — Code Fixes Needed

| Priority | Bug | File |
|---|---|---|
| 🔴 1 | Coupon is a local stub — `FLEET10` hardcoded, no Zoho call | `src/lib/commerce/coupon.ts` |
| 🔴 2 | Installation line never sent to Zoho — BFF `POST /cart` is single-line only | `INCENTRAL-BACKEND/src/routes/cart.js` |
| 🔴 3 | Add-to-Quote routes to a form instead of Zoho add-to-cart API | `src/components/get-a-quote/get-a-quote-page-content.tsx` |
| 🟠 4 | Checkout stuck in mock mode — `NEXT_PUBLIC_CHECKOUT_MODE=api` not set by default | `src/lib/checkout/checkout-api.ts` |
| 🟠 5 | No stock check — inventory never queried; out-of-stock variants show available | PDP + add-to-cart flow |
| 🟠 6 | Installation method not stored on order — `placeOrder()` drops it | `INCENTRAL-BACKEND/src/zoho/storefront.js` |
| 🟠 7 | Installation product SKU not in BFF config — no env var for "Intangles Installation" ID | `INCENTRAL-BACKEND/src/config.js` |
| 🟡 8 | Per-product qty >25 check missing — only whole-order total checked | `src/lib/commerce/quote-context.ts` |
| 🟡 9 | `installation_policy` not read from Zoho — SKU prefix hack instead of custom field | `src/lib/commerce/installation.ts` |
| 🟡 10 | Compare matrix lacks `−` (partial) value — boolean type only | `src/config/feature-comparison.ts` |
| ⚪ 11 | Product description not fetched from Zoho — static config, Zoho not yet SOR | `src/config/plan-pdp/*.ts` |
| ⚪ 12 | Hero / kit images not fetched from Zoho — static `shared-media.ts` | `src/config/plan-pdp/shared-media.ts` |
| ⚪ 13 | `family_key`, `installation_policy` not consumed from Zoho product payload | BFF catalog route |

---

## Currently Complete & Tested Flows

- ✅ **Authentication flow** — sign-in, session, account dashboard
- ✅ **Plan Finder** — vehicle step, compatibility, recommendation engine, needs picker, results
- ✅ **Add-to-Cart** — variant selection, quantity, installation policy display, Zoho cart API call

*Everything else is built feature by feature, tested before merge.*
