"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Container } from "@/components/common/container";
import { applyCouponCode } from "@/lib/commerce/coupon";
import {
  persistZohoCartId,
  readZohoCartId,
  withCartIdQuery,
  ZOHO_CART_ID_QUERY_PARAM,
} from "@/lib/commerce/zoho-cart-session";
import { normalizeConfiguredLine } from "@/lib/commerce/installation";
import { saveCartQuoteContext } from "@/lib/commerce/quote-context";
import { calculateCartTotals } from "@/lib/commerce/totals";
import { formatMoney } from "@/lib/plan-finder/format";
import { useAuth } from "@/hooks/use-auth";
import { useConfiguredCart } from "@/hooks/use-configured-cart";
import { cn } from "@/lib/utils";

import { PlanFinderVehicleStepLink } from "@/components/plan-finder/plan-finder-vehicle-step-link";

import { CartEmptyState } from "./cart-empty-state";
import { CartLineItem } from "./cart-line-item";

export function CartPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { lines, coupon, deviceCount, lineCount, updateLines, clearCart, updateCoupon } =
    useConfiguredCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponStatus, setCouponStatus] = useState<{
    text: string;
    tone: "neutral" | "good" | "error";
  }>({ text: "", tone: "neutral" });
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const totals = useMemo(() => calculateCartTotals(lines, coupon), [lines, coupon]);
  const hasItems = lines.length > 0;
  const hasCouponApplied =
    !totals.quoteRequired && Boolean(totals.coupon.code) && totals.discount > 0;

  const mutateLine = (
    id: string,
    updater: (line: (typeof lines)[number]) => (typeof lines)[number] | null
  ) => {
    const next = lines
      .map((line) => (line.id === id ? updater(line) : line))
      .filter((line): line is (typeof lines)[number] => line !== null);
    updateLines(next, hasCouponApplied);
  };

  const handleApplyCoupon = async () => {
    if (totals.quoteRequired) return;
    const code = couponInput.trim();
    if (!code) {
      setCouponStatus({ text: "Enter a coupon code first.", tone: "error" });
      return;
    }
    setApplyingCoupon(true);
    try {
      const result = await applyCouponCode(code, lines, coupon);
      if (result.valid) {
        updateCoupon({ code: code.toUpperCase(), discount: result.discount, message: result.message });
        setCouponStatus({ text: result.message || "Coupon applied.", tone: "good" });
      } else {
        updateCoupon(null);
        setCouponStatus({ text: result.message, tone: "error" });
      }
    } catch (err) {
      updateCoupon(null);
      setCouponStatus({
        text: err instanceof Error ? err.message : "Coupon could not be applied.",
        tone: "error",
      });
    } finally {
      setApplyingCoupon(false);
    }
  };

  useEffect(() => {
    const fromUrl = searchParams.get(ZOHO_CART_ID_QUERY_PARAM);
    if (fromUrl?.trim()) {
      persistZohoCartId(fromUrl);
      return;
    }
    const stored = readZohoCartId();
    if (stored) {
      router.replace(withCartIdQuery("/cart", stored), { scroll: false });
    }
  }, [router, searchParams]);

  const checkoutHref = useMemo(() => {
    const cartId = readZohoCartId();
    if (totals.quoteRequired) return "/get-a-quote?source=cart";
    if (isAuthenticated) return withCartIdQuery("/checkout", cartId);
    return `/sign-in?mode=login&checkout=1&next=${encodeURIComponent(withCartIdQuery("/checkout", cartId))}`;
  }, [isAuthenticated, searchParams, totals.quoteRequired]);

  const handleContinue = () => {
    if (totals.quoteRequired) {
      saveCartQuoteContext(lines);
    }
  };

  const deviceLabel = `${deviceCount} device${deviceCount === 1 ? "" : "s"}`;
  const groupLabel = `${lineCount} item${lineCount === 1 ? "" : "s"}`;

  return (
    <main id="main" className="page-shell commerce-page">
      <section className="cart-v165">
        <Container>
          <header className="cart-v165-head">
            <div>
              <p className="eyebrow">Cart</p>
              <h1>Review your cart.</h1>
              <p>Review your devices and quantities before checkout.</p>
            </div>
            <div
              className={cn("cart-v165-account", isAuthenticated && "is-signed-in")}
              data-cart-account-status=""
            >
              <span aria-hidden="true" className="cart-v165-account-dot" />
              <span data-cart-account-label="">
                {isAuthenticated
                  ? "Signed in to InCentral"
                  : "Sign in required before adding to cart"}
              </span>
            </div>
          </header>

          {!hasItems ? (
            <CartEmptyState />
          ) : (
            <section className="cart-v165-populated">
              <div className="cart-v165-layout">
                <section aria-labelledby="cart-v165-list-title" className="cart-v165-main">
                  <header className="cart-v165-main-head">
                    <div>
                      <span>Order items</span>
                      <h2 id="cart-v165-list-title">Your cart</h2>
                    </div>
                    <PlanFinderVehicleStepLink className="cart-v165-add">
                      Check another vehicle type
                    </PlanFinderVehicleStepLink>
                  </header>

                  <div className="cart-v165-list">
                    {lines.map((line) => (
                      <CartLineItem
                        key={line.id}
                        line={line}
                        onIncrease={() =>
                          mutateLine(line.id, (current) =>
                            normalizeConfiguredLine({
                              ...current,
                              quantity: Number(current.quantity) + 1,
                            })
                          )
                        }
                        onDecrease={() =>
                          mutateLine(line.id, (current) => {
                            const nextQty = Number(current.quantity) - 1;
                            if (nextQty < 1) return null;
                            return normalizeConfiguredLine({ ...current, quantity: nextQty });
                          })
                        }
                        onRemove={() => mutateLine(line.id, () => null)}
                        onInstallMethod={(method) =>
                          mutateLine(line.id, (current) =>
                            normalizeConfiguredLine({ ...current, installationMethod: method })
                          )
                        }
                      />
                    ))}
                  </div>

                  <footer className="cart-v165-main-foot">
                    <p>
                      <span>{deviceLabel}</span> · <span>{groupLabel}</span>
                    </p>
                    <button
                      className="cart-v165-clear"
                      type="button"
                      onClick={() => {
                        clearCart();
                        setCouponStatus({ text: "", tone: "neutral" });
                        setCouponInput("");
                      }}
                    >
                      Clear cart
                    </button>
                  </footer>
                </section>

                <aside className="cart-v165-summary">
                  <div className="cart-v165-summary-head">
                    <h2>Order summary</h2>
                  </div>
                  <div className="cart-v165-summary-body">
                    <div className="cart-v165-summary-row">
                      <span>Items</span>
                      <strong>{lineCount}</strong>
                    </div>
                    <div className="cart-v165-summary-row">
                      <span>Devices</span>
                      <strong>{deviceCount}</strong>
                    </div>
                    <div className="cart-v165-summary-row cart-v293-tax-row">
                      <span>Product subtotal</span>
                      <strong>{formatMoney(totals.productBase)}</strong>
                    </div>
                    <div className="cart-v165-summary-row cart-v293-tax-row">
                      <span>
                        Installation
                        <small>₹500 per device where selected / required</small>
                      </span>
                      <strong>{formatMoney(totals.installationBase)}</strong>
                    </div>
                    <div className="cart-v165-summary-row cart-v293-tax-row">
                      <span>
                        Shipping
                        <small>₹50 per device</small>
                      </span>
                      <strong>{formatMoney(totals.shippingBase)}</strong>
                    </div>
                    <div className="cart-v165-summary-row cart-v293-tax-row">
                      <span>
                        GST (18%)
                        <small>products + installation + shipping</small>
                      </span>
                      <strong>{formatMoney(totals.gst)}</strong>
                    </div>
                    <div
                      className="cart-v165-summary-row cart-v293-tax-row"
                      data-cart-discount-row=""
                      hidden={!hasCouponApplied}
                    >
                      <span>{hasCouponApplied ? `Coupon (${totals.coupon.code})` : "Coupon discount"}</span>
                      <strong>−{formatMoney(totals.discount)}</strong>
                    </div>
                    <div className="cart-v165-summary-row is-total">
                      <span>Total</span>
                      <strong>{formatMoney(totals.total)}</strong>
                    </div>

                    {totals.quoteRequired ? (
                      <p className="cart-v165-note">{totals.quoteReasonLabel}</p>
                    ) : (
                      <p className="cart-v165-note">
                        GST, installation and shipping are itemised separately.
                      </p>
                    )}

                    {!totals.quoteRequired ? (
                      <div className="cart-v293-coupon">
                        <div className="cart-v293-coupon-head">
                          <strong>Have a coupon code?</strong>
                        </div>
                        <div className="cart-v293-coupon-form">
                          <input
                            type="text"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            placeholder="Enter coupon code"
                            autoComplete="off"
                            aria-label="Coupon code"
                          />
                          <button type="button" disabled={applyingCoupon} onClick={handleApplyCoupon}>
                            {applyingCoupon ? "Applying..." : "Apply"}
                          </button>
                        </div>
                        {couponStatus.text ? (
                          <p
                            aria-live="polite"
                            className={cn(
                              "cart-v293-coupon-status",
                              couponStatus.tone === "good" && "is-good",
                              couponStatus.tone === "error" && "is-error"
                            )}
                          >
                            {couponStatus.text}
                          </p>
                        ) : null}
                      </div>
                    ) : null}

                    <Link
                      href={checkoutHref}
                      onClick={handleContinue}
                      className="btn primary"
                      data-cart-checkout=""
                    >
                      {totals.quoteRequired ? "Get a Quote" : "Continue to checkout"}
                    </Link>

                    <p className="cart-v165-support">
                      Need help before you continue?{" "}
                      <a href="tel:18002689111">Contact our team.</a>
                    </p>
                  </div>
                </aside>
              </div>
            </section>
          )}
        </Container>
      </section>
    </main>
  );
}
