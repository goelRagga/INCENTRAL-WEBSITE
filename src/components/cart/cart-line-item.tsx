"use client";

import { getCartProduct } from "@/lib/commerce/catalog";
import { installationPolicy } from "@/lib/commerce/installation";
import { aisLineNeedsQuote, lineGrossExGst } from "@/lib/commerce/totals";
import { formatMoney } from "@/lib/plan-finder/format";
import type { CartLine, PlanFamily } from "@/lib/plan-finder/types";
import { cn } from "@/lib/utils";

type CartLineItemProps = {
  line: CartLine;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
  onInstallMethod: (method: "self" | "intangles") => void;
};

export function CartLineItem({
  line,
  onIncrease,
  onDecrease,
  onRemove,
  onInstallMethod,
}: CartLineItemProps) {
  const product = getCartProduct(line.sku);
  if (!product) return null;

  const family = (line.family || "incert") as PlanFamily;
  const compliance = line.aisRequired ? "AIS-140 Certified" : "Standard";
  const policy = installationPolicy(line.sku, line);
  const qty = Number(line.quantity);
  const needsQuoteNote = line.aisRequired && line.stateLabel && aisLineNeedsQuote(line);

  return (
    <article className={cn("cart-v165-line", `family-${family}`)}>
      <div>
        <div className="cart-v165-line-top">
          <span className="cart-v165-plan">{product.name}</span>
          <span className="cart-v165-route">{compliance}</span>
        </div>
        <div className="cart-v165-group">
          <div className="cart-v165-fact">
            <span>Vehicle type</span>
            <strong>{line.segmentLabel}</strong>
          </div>
          <div className="cart-v165-fact">
            <span>Manufacturer</span>
            <strong>{line.manufacturerLabel}</strong>
          </div>
          <div className="cart-v165-fact">
            <span>Emission standard</span>
            <strong>{line.emission}</strong>
          </div>
        </div>

        {line.aisRequired && line.stateLabel && !needsQuoteNote ? (
          <p className="cart-v165-line-note">AIS-140 state: {line.stateLabel}</p>
        ) : null}

        {needsQuoteNote ? (
          <p className="cart-v354-state-note">
            <strong>{line.stateLabel}</strong>
            <span>AIS-140 availability pending</span>
          </p>
        ) : null}

        {policy.optional ? (
          <div className="cart-v293-install">
            <span className="cart-v293-install-label">Installation</span>
            <div
              className="cart-v293-install-options"
              role="group"
              aria-label={`Installation for ${product.name}`}
            >
              <button
                type="button"
                className={policy.method === "self" ? "is-active" : undefined}
                onClick={() => onInstallMethod("self")}
              >
                <span>Self-install</span>
                <small>₹0</small>
              </button>
              <button
                type="button"
                className={policy.method === "intangles" ? "is-active" : undefined}
                onClick={() => onInstallMethod("intangles")}
              >
                <span>Installed by Intangles</span>
                <small>₹500 / device</small>
              </button>
            </div>
          </div>
        ) : (
          <div className="cart-v293-install-fixed">
            <span>Installation</span>
            <strong>{policy.label}</strong>
            <small>₹500 per device</small>
          </div>
        )}
      </div>

      <div className="cart-v165-qty">
        <span>Devices</span>
        <div className="cart-v165-stepper">
          <button
            type="button"
            aria-label={`Decrease ${product.name} quantity`}
            onClick={onDecrease}
          >
            −
          </button>
          <strong>{qty}</strong>
          <button
            type="button"
            aria-label={`Increase ${product.name} quantity`}
            onClick={onIncrease}
          >
            +
          </button>
        </div>
        <button className="cart-v165-remove" type="button" onClick={onRemove}>
          Remove
        </button>
      </div>

      <div className="cart-v165-price">
        <span>Line total</span>
        <strong>{formatMoney(lineGrossExGst(line))}</strong>
        <small>
          Product price: {formatMoney(product.price)} / vehicle · 2 years
          {line.installationFeeExGst
            ? ` · Installation ${formatMoney(line.installationFeeExGst)} / device`
            : ""}
        </small>
      </div>
    </article>
  );
}
