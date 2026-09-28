"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Container } from "@/components/common/container";
import { loadLastOrder, type PlacedOrderRecord } from "@/lib/checkout/order-storage";
import { formatMoney } from "@/lib/plan-finder/format";

function installCopy(order: PlacedOrderRecord) {
  const items = order.items || [];
  const hasAis = items.some((x) => x.aisState);
  const hasProfessional = items.some((x) => x.installation?.method === "intangles");
  const hasSelf = items.some((x) => x.installation?.method === "self");
  if (hasProfessional && hasSelf) {
    return "Your order includes both self-install and Intangles-installed items. Our team will coordinate installation for the items you selected.";
  }
  if (hasProfessional) {
    return "Our team will coordinate installation for the items you selected after dispatch.";
  }
  if (hasAis) {
    return "You selected self-install for your AIS-140 devices. Certification and activation steps are handled separately after fitment.";
  }
  return "You selected self-install for the eligible devices in this order.";
}

export function OrderConfirmationContent() {
  const [order, setOrder] = useState<PlacedOrderRecord | null | undefined>(undefined);

  useEffect(() => {
    setOrder(loadLastOrder());
  }, []);

  if (order === undefined) return null;

  if (!order) {
    return (
      <main id="main" className="page-shell checkout-headless-page">
        <section className="coh-confirmation" data-order-confirmation="">
          <Container>
            <div className="coh-empty">
              <h2>No recent order found.</h2>
              <p>Return to Solutions or My InCentral to continue.</p>
              <Link className="coh-btn primary" href="/#solutions">
                View solutions
              </Link>
            </div>
          </Container>
        </section>
      </main>
    );
  }

  const a = order.shippingAddress;

  return (
    <main id="main" className="page-shell checkout-headless-page">
      <section className="coh-confirmation" data-order-confirmation="">
        <Container>
          <div className="coc-card">
            <div className="coc-hero">
              <div aria-hidden="true" className="coc-icon">
                ✓
              </div>
              <div className="coc-success-copy">
                <p className="eyebrow">Payment successful</p>
                <h1>Order confirmed.</h1>
                <p>
                  Your payment is confirmed. We will use the vehicle, installation and
                  delivery details you reviewed at checkout to fulfil your order. A
                  confirmation will be sent to the email used at checkout.
                </p>
              </div>
            </div>
            <div className="coc-meta">
              <div>
                <span>Order number</span>
                <strong>{order.orderNumber || "Order confirmed"}</strong>
              </div>
              <div>
                <span>Payment reference</span>
                <strong>
                  {order.paymentId || order.transactionId || "Confirmed"}
                </strong>
              </div>
              <div>
                <span>Amount paid</span>
                <strong>{formatMoney(order.totals?.total ?? order.amount ?? 0)}</strong>
              </div>
            </div>
            <div className="coc-body">
              <section>
                <h2>Order details</h2>
                <div className="coc-items">
                  {(order.items || []).map((x, index) => {
                    const qty = Number(x.quantity || 0);
                    const install = Number(x.installation?.feePerDeviceExGst || 0);
                    const line = (Number(x.unitPriceExGst || 0) + install) * qty;
                    return (
                      <div key={`${x.sku}-${index}`} className="coc-item">
                        <div>
                          <strong>
                            {x.name} · {x.line}
                          </strong>
                          <small>
                            {qty} device{qty === 1 ? "" : "s"}
                            {x.vehicle?.manufacturer
                              ? ` · ${x.vehicle.manufacturer}`
                              : ""}
                            {x.installation?.label ? ` · ${x.installation.label}` : ""}
                          </small>
                        </div>
                        <strong>{formatMoney(line)}</strong>
                      </div>
                    );
                  })}
                </div>
                <div className="coh-summary-totals">
                  <div className="coh-total-row">
                    <span>Product subtotal</span>
                    <strong>{formatMoney(order.totals?.productSubtotal ?? 0)}</strong>
                  </div>
                  <div className="coh-total-row">
                    <span>Installation</span>
                    <strong>{formatMoney(order.totals?.installation ?? 0)}</strong>
                  </div>
                  <div className="coh-total-row">
                    <span>
                      Shipping <small>₹50 per device</small>
                    </span>
                    <strong>{formatMoney(order.totals?.shipping ?? 0)}</strong>
                  </div>
                  <div className="coh-total-row">
                    <span>GST (18%)</span>
                    <strong>{formatMoney(order.totals?.gst ?? 0)}</strong>
                  </div>
                  <div className="coh-total-row total">
                    <span>Amount paid</span>
                    <strong>{formatMoney(order.totals?.total ?? order.amount ?? 0)}</strong>
                  </div>
                </div>
                <h2 className="coc-section-spaced">Delivery address</h2>
                <div className="coh-address-card">
                  {a ? (
                    <>
                      <strong>
                        {a.firstName} {a.lastName}
                      </strong>
                      <br />
                      {a.address1}
                      <br />
                      {a.city}, {a.state} {a.postalCode}
                      <br />
                      {a.country || "India"}
                      {a.phone ? (
                        <>
                          <br />
                          {a.phone}
                        </>
                      ) : null}
                    </>
                  ) : null}
                </div>
              </section>
              <section>
                <h2>What happens next</h2>
                <div className="coc-next">
                  <div className="coc-step">
                    <span>1</span>
                    <div>
                      <strong>Order confirmed</strong>
                      <p>Your payment and order details are confirmed.</p>
                    </div>
                  </div>
                  <div className="coc-step">
                    <span>2</span>
                    <div>
                      <strong>Dispatch</strong>
                      <p>
                        Total delivery is estimated at 8 to 12 days from your order date.
                      </p>
                    </div>
                  </div>
                  <div className="coc-step">
                    <span>3</span>
                    <div>
                      <strong>Installation and access</strong>
                      <p>{installCopy(order)}</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <div className="coc-actions">
              <Link className="coh-btn primary" href="/account">
                Go to My InCentral
              </Link>
              {order.invoiceUrl ? (
                <a
                  className="coh-btn"
                  href={order.invoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download invoice
                </a>
              ) : (
                <a
                  className="coh-btn"
                  href="#"
                  aria-disabled="true"
                  onClick={(event) => event.preventDefault()}
                >
                  Invoice pending
                </a>
              )}
              <Link className="coh-btn" href="/#solutions">
                Continue exploring solutions
              </Link>
              <Link className="coh-btn" href="/support">
                Need help?
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
