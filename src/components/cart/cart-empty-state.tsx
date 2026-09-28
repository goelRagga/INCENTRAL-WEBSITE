import Link from "next/link";

import { PlanFinderVehicleStepLink } from "@/components/plan-finder/plan-finder-vehicle-step-link";
import { footerSupport } from "@/config/footer";

export function CartEmptyState() {
  return (
    <section className="cart-v165-empty">
      <div className="cart-v165-empty-copy">
        <div className="cart-v165-empty-label">
          <span aria-hidden="true" className="cart-v165-empty-icon">
            <svg viewBox="0 0 24 24">
              <path d="M3 4h2l2.1 9.1a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 7H6.1" />
              <circle cx="10" cy="19" r="1.3" />
              <circle cx="18" cy="19" r="1.3" />
            </svg>
          </span>
          <p className="eyebrow">Your Cart Is Empty</p>
        </div>
        <h2>Start by finding the right plan</h2>
        <p>Check each vehicle type to see which plans are compatible.</p>
        <div className="cart-v165-empty-actions">
          <PlanFinderVehicleStepLink className="btn primary cart-v165-empty-primary">
            Find the right solution <span aria-hidden="true">→</span>
          </PlanFinderVehicleStepLink>
        </div>
      </div>

      <aside className="cart-v165-empty-help">
        <div className="cart-v165-empty-help-inner">
          <div className="cart-v165-help-label">
            <span aria-hidden="true" className="cart-v165-help-icon">
              <svg viewBox="0 0 24 24">
                <path d="M4 13v-2a8 8 0 0 1 16 0v2" />
                <path d="M6 18H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h1v6Zm12 0h1a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-1v6Z" />
                <path d="M18 18c0 2-1.6 3-4 3h-2" />
              </svg>
            </span>
            <p className="eyebrow eyebrow">Fleet support</p>
          </div>
          <h3>Talk to our team about your fleet</h3>
          <p>Contact us for help with mixed fleets, plan selection or installation.</p>
          <div className="cart-v165-contact-list">
            <a className="cart-v165-contact-row" href={footerSupport.phone.href}>
              <span aria-hidden="true" className="cart-v165-contact-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M5 3h4l2 5-2.5 1.8a15.5 15.5 0 0 0 5.7 5.7L16 13l5 2v4a2 2 0 0 1-2 2C10.2 21 3 13.8 3 5a2 2 0 0 1 2-2Z" />
                </svg>
              </span>
              <span>
                <small>Phone</small>
                <strong>{footerSupport.phone.value}</strong>
              </span>
            </a>
            <a className="cart-v165-contact-row" href={footerSupport.email.href}>
              <span aria-hidden="true" className="cart-v165-contact-icon">
                <svg viewBox="0 0 24 24">
                  <rect height="14" rx="2" width="18" x="3" y="5" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
              </span>
              <span>
                <small>Email</small>
                <strong>{footerSupport.email.value}</strong>
              </span>
            </a>
          </div>
          <Link className="cart-v165-support-cta" href="/support">
            Contact Support <span aria-hidden="true">→</span>
          </Link>
        </div>
      </aside>
    </section>
  );
}
