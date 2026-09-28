"use client";

import { formatMoney } from "@/lib/plan-finder/format";
import type { CartLine } from "@/lib/plan-finder/types";
import type { CartTotals } from "@/lib/commerce/totals";
import { lineGrossExGst } from "@/lib/commerce/totals";

type CheckoutSummaryProps = {
  lines: CartLine[];
  totals: CartTotals;
};

export function CheckoutSummary({ lines, totals }: CheckoutSummaryProps) {
  return (
    <aside className="coh-summary">
      <div className="coh-summary-head">
        <h2>Order summary</h2>
        <p>
          {totals.totalCount} device{totals.totalCount === 1 ? "" : "s"}
        </p>
      </div>
      <div className="coh-summary-items">
        {lines.map((line) => (
          <div key={line.id} className="coh-summary-item">
            <div>
              <strong>{line.planName}</strong>
              <small>
                {line.line} · {line.quantity} device{line.quantity === 1 ? "" : "s"}
                {line.manufacturerLabel ? ` · ${line.manufacturerLabel}` : ""} ·{" "}
                {line.installationLabel}
              </small>
            </div>
            <strong>{formatMoney(lineGrossExGst(line))}</strong>
          </div>
        ))}
      </div>
      <div className="coh-summary-totals">
        <div className="coh-total-row">
          <span>Product subtotal</span>
          <strong>{formatMoney(totals.productBase)}</strong>
        </div>
        <div className="coh-total-row">
          <span>Installation</span>
          <strong>{formatMoney(totals.installationBase)}</strong>
        </div>
        <div className="coh-total-row">
          <span>Shipping</span>
          <strong>{formatMoney(totals.shippingBase)}</strong>
        </div>
        <div className="coh-total-row">
          <span>GST (18%)</span>
          <strong>{formatMoney(totals.gst)}</strong>
        </div>
        <div className="coh-total-row" hidden={totals.discount <= 0}>
          <span>
            {totals.coupon.code ? `Coupon (${totals.coupon.code})` : "Coupon"}
          </span>
          <strong data-coh-discount="">−{formatMoney(totals.discount)}</strong>
        </div>
        <div className="coh-total-row total">
          <span>Total</span>
          <strong>{formatMoney(totals.total)}</strong>
        </div>
      </div>
    </aside>
  );
}
