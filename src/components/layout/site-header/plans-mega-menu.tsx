import Link from "next/link";

import {
  planMegaMenuAccentTokens,
  planProducts,
  solutionsMega,
} from "@/config/plans";

type PlansMegaMenuProps = {
  open: boolean;
  menuId: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onNavigate?: () => void;
};

export function PlansMegaMenu({
  open,
  menuId,
  onMouseEnter,
  onMouseLeave,
  onNavigate,
}: PlansMegaMenuProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      id={menuId}
      data-inc-plans-menu
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="inc-plans-mega"
    >
      <div className="inc-mega-shell">
        <div className="inc-mega-top">
          <div className="inc-mega-title">
            <p className="inc-plans-mega-kicker">{solutionsMega.kicker}</p>
            <h2>{solutionsMega.title}</h2>
            <p>{solutionsMega.description}</p>
          </div>
          <Link
            href={solutionsMega.cta.href}
            className="inc-mega-primary shrink-0"
            onClick={onNavigate}
          >
            {solutionsMega.cta.label}
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div aria-label="Intangles plans" className="inc-mega-products">
          {planProducts.map((plan) => {
            const tokens = planMegaMenuAccentTokens[plan.accent];

            return (
              <article key={plan.id} className={`inc-mega-product ${tokens.megaClass}`}>
                <Link
                  href={plan.href}
                  aria-label={`View ${plan.name} plan details`}
                  className="inc-mega-card-main"
                  onClick={onNavigate}
                >
                  <div className="inc-mega-product-head">
                    <span aria-hidden="true" className="inc-mega-product-mark" />
                    <span className="inc-mega-product-type">{plan.category}</span>
                  </div>
                  <h3>{plan.name}</h3>
                  <p>{plan.description}</p>
                </Link>

                <div className="inc-mega-variants">
                  {plan.variants.map((variant) => (
                    <Link key={variant.href} href={variant.href} onClick={onNavigate}>
                      <span className="inc-mega-link-label">{variant.label}</span>
                      <span aria-hidden="true" className="inc-mega-link-arrow">
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
