"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { AccountOrderProgress } from "@/components/account/account-order-progress";
import { usePortalDialog } from "@/components/account/use-portal-dialog";
import {
  formatAddressLines,
  formatDate,
  formatDateTime,
  formatMoney,
  statusInfo,
} from "@/lib/account/format";
import type { AccountOrder } from "@/lib/account/types";

type AccountOrderDialogProps = {
  order: AccountOrder | null;
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onGetSupport: (orderNumber: string) => void;
  onInvoiceDownload: () => void;
};

export function AccountOrderDialog({
  order,
  open,
  loading,
  onClose,
  onGetSupport,
  onInvoiceDownload,
}: AccountOrderDialogProps) {
  const [mounted, setMounted] = useState(false);
  const { dialogRef, handleBackdropClick, close } = usePortalDialog(open, onClose);

  useEffect(() => setMounted(true), []);

  if (!mounted || !order) return null;

  const st = statusInfo(order.status);
  const detailLoading = loading || order.items.length === 0;

  return createPortal(
    <dialog
      ref={dialogRef}
      className="a295-dialog"
      data-order-dialog
      onClick={handleBackdropClick}
      onClose={onClose}
    >
      <div className="a295-dialog-shell">
        <header className="a295-dialog-head">
          <div className="a295-dialog-title">
            <span>Placed {formatDate(order.date)}</span>
            <h2>{order.number}</h2>
          </div>
          <button
            type="button"
            className="a295-dialog-close"
            aria-label="Close order details"
            onClick={close}
          >
            ×
          </button>
        </header>
        <div className="a295-dialog-body">
          <div className="a295-detail-grid">
            <section className="a295-detail-block a295-detail-span">
              <div className="a295-recent-order-top">
                <div>
                  <div className="a295-order-id">
                    <strong>{order.number}</strong>
                    <span className={`a295-status ${st.cls}`}>{st.label}</span>
                  </div>
                  <span className="a295-order-date">{formatDateTime(order.date)}</span>
                </div>
                <div className="a295-order-total">
                  <span>Total paid</span>
                  <strong>{formatMoney(order.total, order.currencyCode ?? "₹")}</strong>
                </div>
              </div>
              <AccountOrderProgress order={order} />
            </section>

            <section className="a295-detail-block">
              <h3>Items</h3>
              {detailLoading ? (
                <div className="a295-skeleton-lines">
                  <div className="a295-skeleton-line" style={{ width: "70%" }} />
                  <div className="a295-skeleton-line" style={{ width: "50%" }} />
                </div>
              ) : (
                <div className="a295-order-items">
                  {order.items.map((item) => (
                    <div key={`${item.name}-${item.variant}`} className="a295-order-item">
                      <span className="a295-order-item-copy">
                        <strong>
                          {item.name} · {item.variant}
                        </strong>
                        <span>Quantity {item.quantity}</span>
                      </span>
                      <strong>
                        {formatMoney(item.lineTotal || item.unitPrice * item.quantity)}
                      </strong>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="a295-detail-block">
              <h3>Payment &amp; totals</h3>
              {detailLoading ? (
                <div className="a295-skeleton-lines">
                  {[80, 60, 60, 60, 40].map((w, i) => (
                    <div key={i} className="a295-skeleton-line" style={{ width: `${w}%` }} />
                  ))}
                </div>
              ) : (
                <div className="a295-detail-lines">
                  {order.subtotal != null && (
                    <div className="a295-detail-line">
                      <span>Products</span>
                      <strong>{formatMoney(order.subtotal)}</strong>
                    </div>
                  )}
                  {order.installation ? (
                    <div className="a295-detail-line">
                      <span>Installation</span>
                      <strong>{formatMoney(order.installation)}</strong>
                    </div>
                  ) : null}
                  {order.shipping != null && (
                    <div className="a295-detail-line">
                      <span>Shipping</span>
                      <strong>{formatMoney(order.shipping)}</strong>
                    </div>
                  )}
                  {order.discount ? (
                    <div className="a295-detail-line">
                      <span>Discount</span>
                      <strong>−{formatMoney(order.discount)}</strong>
                    </div>
                  ) : null}
                  {order.gst != null && (
                    <div className="a295-detail-line">
                      <span>GST (18%)</span>
                      <strong>{formatMoney(order.gst)}</strong>
                    </div>
                  )}
                  <div className="a295-detail-line">
                    <span>Total</span>
                    <strong>{formatMoney(order.total)}</strong>
                  </div>
                  <div className="a295-detail-line">
                    <span>Payment</span>
                    <strong>
                      {order.paymentMode || "Online"} ·{" "}
                      {statusInfo(order.paymentStatus ?? order.status).label}
                    </strong>
                  </div>
                </div>
              )}
            </section>

            <section className="a295-detail-block">
              <h3>Delivery</h3>
              {order.shipment ? (
                <div className="a295-detail-lines">
                  <div className="a295-detail-line">
                    <span>Method</span>
                    <strong>{order.shipment.deliveryMethod || "Not provided"}</strong>
                  </div>
                  <div className="a295-detail-line">
                    <span>Carrier</span>
                    <strong>{order.shipment.carrier || "Not provided"}</strong>
                  </div>
                  <div className="a295-detail-line">
                    <span>Tracking</span>
                    <strong>{order.shipment.trackingNumber || "Not provided"}</strong>
                  </div>
                  <div className="a295-detail-line">
                    <span>Shipment date</span>
                    <strong>{formatDate(order.shipment.shippingDate)}</strong>
                  </div>
                  {order.shipment.estimatedDelivery ? (
                    <div className="a295-detail-line">
                      <span>Estimated delivery</span>
                      <strong>{formatDate(order.shipment.estimatedDelivery)}</strong>
                    </div>
                  ) : null}
                </div>
              ) : (
                <p style={{ margin: 0, color: "#6e7e86", fontSize: 12, lineHeight: 1.5 }}>
                  Shipment information will appear here once the order is packed.
                </p>
              )}
            </section>

            <section className="a295-detail-block">
              <h3>Installation</h3>
              <div className="a295-detail-lines">
                <div className="a295-detail-line">
                  <span>Method</span>
                  <strong>{order.installationMethod || "Not provided"}</strong>
                </div>
              </div>
            </section>

            <section className="a295-detail-block">
              <h3>Shipping address</h3>
              {detailLoading ? (
                <div className="a295-skeleton-lines">
                  <div className="a295-skeleton-line" style={{ width: "60%" }} />
                  <div className="a295-skeleton-line" style={{ width: "45%" }} />
                </div>
              ) : (
                <p style={{ margin: 0, color: "#5d7079", fontSize: 12, lineHeight: 1.55 }}>
                  {formatAddressLines(order.shippingAddress)}
                </p>
              )}
            </section>

            <section className="a295-detail-block">
              <h3>Billing address</h3>
              {detailLoading ? (
                <div className="a295-skeleton-lines">
                  <div className="a295-skeleton-line" style={{ width: "60%" }} />
                  <div className="a295-skeleton-line" style={{ width: "45%" }} />
                </div>
              ) : (
                <p style={{ margin: 0, color: "#5d7079", fontSize: 12, lineHeight: 1.55 }}>
                  {formatAddressLines(order.billingAddress)}
                </p>
              )}
            </section>
          </div>

          <div className="a295-dialog-actions">
            <button
              type="button"
              className="a295-btn"
              onClick={() => {
                close();
                onGetSupport(order.number);
              }}
            >
              Get support for this order
            </button>
            {order.invoiceId ? (
              <a
                className="a295-btn primary"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onInvoiceDownload();
                }}
              >
                Download invoice
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </dialog>,
    document.body
  );
}
