# v375 reference parity (`InCentral-Portal-v375-not-covered-red`)

Living checklist against the static portal. **Source of truth:** v375 HTML + `assets/css/*`.

## Global chrome

| Area | v375 | Next app | Status |
|------|------|----------|--------|
| Logo | Endorsed text “InCentral” + “Powered by Intangles” | `Logo` component | Aligned |
| Nav label | “Solutions” mega menu | `SiteHeader` | Aligned |
| Footer support | “…choosing a **solution**…” | `footer.ts` | Aligned |
| Footer explore | `/#solutions`, `/#check-compatibility` | `footer.ts` | Aligned |
| Mega menu | 4 products, boxed AIS/Standard (no arrows) | `plans-mega-menu.tsx` | **Aligned** |
| Mobile Solutions | `inc-mobile-plan-*` | `mobile-navigation.tsx` | Mostly aligned |

## Homepage (`index.html`)

| Section | v375 classes | Next | Status |
|---------|--------------|------|--------|
| Hero | `h132-hero`, copy + CTAs | `hero-section.tsx` + `globals.css` | **Aligned (this pass)** |
| Intelligence panel | `h140-intelligence-panel` | `intelligence-panel.tsx` | **Aligned (this pass)** |
| Solutions grid | `h139-plans`, `h139-card` | `plans-section` + `globals.css` | **Aligned** |
| Solution finder | `h144-checker`, `h144-*` | `plan-finder-section` | Copy aligned; **full h144 CSS pending** |
| Proof band | `h149-proof` | `proof-section.tsx` | **Aligned (this pass)** |
| Testimonials | `home-testimonials` JS block | — | **Not ported** |

## Routes

| v375 file | Next route | Status |
|-----------|------------|--------|
| `index.html` | `/` | In progress (homepage sections above) |
| `incert.html` | `/solutions/incert` | PDP — review vs v375 |
| `insight.html` | `/solutions/insight` | PDP — review |
| `ingenious.html` | `/solutions/ingenious` | PDP — review |
| `invision-plus.html` | `/solutions/invision-plus` | PDP — review |
| `compare-solutions.html` | `/compare-solutions` | Review |
| `ais-140-guide.html` | `/ais-140-guide` | Review |
| `help.html` | `/help` | Review |
| `support.html` | `/support` | Review |
| `sign-in.html` | `/sign-in` | Review |
| `cart.html` | `/cart` | Review |
| `checkout.html` | `/checkout` | Review |
| `get-a-quote.html` | `/get-a-quote` | Review |
| `order-confirmation.html` | — | **Missing route** |
| `my-incentral.html` | `/account` | Review |
| `privacy-notice.html` | `/policies/privacy-notice` | Review |
| `terms-conditions.html` | `/policies/terms-conditions` | Review |
| `returns-refunds-cancellation.html` | `/policies/returns-refunds-cancellation` | Review |
| `404.html` | `not-found.tsx` | Review |
| `region-unavailable.html` | — | **Missing route** |

## Assets

| Asset | v375 | Next `public/` | Status |
|-------|------|----------------|--------|
| Hero concept images | `assets/images/hero-*` | `/images/hero/` | Present |
| `intangles-logo-white-horizontal.png` | footer/geo | `/images/brand/` | Present |
| Customer story thumbnails | many `.webp` | partial | **Gap for PDP/testimonials** |
| `homepage-fleet-lineup.webp` | homepage | — | **Not copied** |

## CSS strategy

- Shared v375 blocks (h132/h139/h140/h149) live in `src/app/globals.css` only — no separate CSS files.
- Prefer **semantic class names** from v375 over one-off Tailwind on migrated sections.
- Plan finder (`h144-*`) and commerce pages still use component Tailwind — next migration targets.

## Suggested next passes

1. Port `h144-checker` / plan-finder shell CSS from `homepage-v333.css` + `compatibility-checker-v338.css`.
2. Add `/order-confirmation` and `/region-unavailable`.
3. PDP pages (`incert`, etc.): diff against v375 product templates section-by-section.
4. Homepage testimonials carousel from v375 inline script → React component.
5. Copy remaining `assets/images/*` used on PDPs and marketing pages.
