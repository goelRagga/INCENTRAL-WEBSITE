"use client";

import { formatMoney } from "@/lib/plan-finder/format";

type CheckoutPaymentModalProps = {
  open: boolean;
  amount: number;
  email: string;
  phone: string;
  processing: boolean;
  error: string;
  onClose: () => void;
  onPay: () => void;
};

export function CheckoutPaymentModal({
  open,
  amount,
  email,
  phone,
  processing,
  error,
  onClose,
  onPay,
}: CheckoutPaymentModalProps) {
  if (!open) return null;

  return (
    <div
      className="coh-payment-modal"
      role="dialog"
      aria-label="Secure payment"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="coh-rzp">
        <div className="coh-rzp-head">
          <div className="coh-rzp-brand">
            <strong>Intangles Lab Pvt. Ltd.</strong>
            <span>Razorpay secure checkout</span>
          </div>
          <div className="coh-rzp-amount">{formatMoney(amount)}</div>
        </div>
        <div className="coh-rzp-body">
          {!processing ? (
            <div>
              <div className="coh-rzp-methods">
                <label className="coh-rzp-method">
                  <input type="radio" name="rzpMethod" defaultChecked /> UPI
                </label>
                <label className="coh-rzp-method">
                  <input type="radio" name="rzpMethod" /> Card
                </label>
                <label className="coh-rzp-method">
                  <input type="radio" name="rzpMethod" /> Net banking
                </label>
              </div>
              <div className="coh-rzp-contact">
                <div>
                  <span>Email</span>
                  <strong>{email}</strong>
                </div>
                <div>
                  <span>Mobile</span>
                  <strong>{phone}</strong>
                </div>
              </div>
              <div className="coh-rzp-actions">
                <button type="button" className="coh-rzp-pay" onClick={onPay}>
                  Pay securely
                </button>
                <button type="button" className="coh-rzp-cancel" onClick={onClose}>
                  Cancel
                </button>
              </div>
              {error ? <p className="coh-rzp-error">{error}</p> : null}
            </div>
          ) : (
            <div className="coh-rzp-processing">
              <span aria-hidden="true" className="coh-spinner" />
              <strong>Confirming payment</strong>
              <span>Please keep this window open.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
