"use client";

import Link from "next/link";
import { Spin } from "antd";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { createPortal } from "react-dom";

import { usePortalDialog } from "@/components/account/use-portal-dialog";
import { accountSupportCategories } from "@/config/account-support";
type AccountNewTicketDialogProps = {
  open: boolean;
  onClose: () => void;
  profile: {
    email: string;
    phone: string;
  };
  orderReference?: string;
  onSubmit: (payload: {
    category: string;
    orderReference: string;
    email: string;
    phone: string;
    subject: string;
    description: string;
  }) => Promise<void> | void;
};

export function AccountNewTicketDialog({
  open,
  onClose,
  profile,
  orderReference = "",
  onSubmit,
}: AccountNewTicketDialogProps) {
  const [mounted, setMounted] = useState(false);
  const { dialogRef, handleBackdropClick, close } = usePortalDialog(open, onClose);
  const [category, setCategory] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    setCategory("");
    setCategoryError(false);
    setStatus("");
    setError("");
    setCategoryOpen(false);
    setFormKey((k) => k + 1);
  }, [open, orderReference]);

  useEffect(() => {
    if (!categoryOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!selectRef.current?.contains(e.target as Node)) setCategoryOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, [categoryOpen]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!category) {
        setCategoryError(true);
        setCategoryOpen(true);
        return;
      }
      const form = e.currentTarget;
      if (!form.reportValidity()) return;

      const payload = {
        category,
        orderReference: String(new FormData(form).get("orderReference") ?? ""),
        email: String(new FormData(form).get("email") ?? ""),
        phone: String(new FormData(form).get("phone") ?? ""),
        subject: String(new FormData(form).get("subject") ?? ""),
        description: String(new FormData(form).get("description") ?? ""),
      };
      setSubmitting(true);
      setStatus("Submitting…");
      setError("");
      try {
        await onSubmit(payload);
        close();
      } catch {
        setError("We could not submit the support request. Please try again.");
        setStatus("");
      } finally {
        setSubmitting(false);
      }
    },
    [category, close, onSubmit]
  );

  if (!mounted) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      className="a295-dialog support297-dialog"
      data-new-ticket-dialog
      onClick={handleBackdropClick}
      onClose={onClose}
    >
      <div className="a295-dialog-shell support297-dialog-shell">
        <button
          type="button"
          className="a295-dialog-close support297-floating-close"
          aria-label="Close support form"
          onClick={close}
        >
          ×
        </button>
        <div className="a295-dialog-body support297-dialog-body">
          <form
            key={formKey}
            className="form-card support112-form support297-shared-form"
            data-freshdesk-support-form
            data-support-form
            onSubmit={handleSubmit}
          >
            <div className="support112-form-head">
              <div>
                <h2>Support request</h2>
                <p>
                  Describe the issue and add any photos or documents that will help our
                  support team investigate it.
                </p>
              </div>
            </div>
            <div className="form-grid">
              <div className="field a316-category-field">
                <label id="a316CategoryLabel">
                  Issue category{" "}
                  <span aria-hidden="true" className="required-marker">
                    *
                  </span>
                  <span className="sr-only">required</span>
                </label>
                <div
                  ref={selectRef}
                  className={`a316-select${categoryOpen ? " is-open" : ""}`}
                  data-support-category-select
                >
                  <button
                    type="button"
                    className="a316-select-trigger"
                    data-support-category-trigger
                    aria-expanded={categoryOpen}
                    aria-haspopup="listbox"
                    aria-labelledby="a316CategoryLabel a316CategoryValue"
                    onClick={() => setCategoryOpen((v) => !v)}
                  >
                    <span data-support-category-label id="a316CategoryValue">
                      {category || "Select category"}
                    </span>
                    <svg aria-hidden="true" viewBox="0 0 20 20">
                      <path d="m5 7.5 5 5 5-5" />
                    </svg>
                  </button>
                  <div
                    className="a316-select-menu"
                    data-support-category-menu
                    role="listbox"
                    aria-labelledby="a316CategoryLabel"
                    hidden={!categoryOpen}
                    id="a316CategoryMenu"
                  >
                    {accountSupportCategories.map((value) => (
                      <button
                        key={value}
                        type="button"
                        role="option"
                        data-support-category-option
                        data-value={value}
                        aria-selected={category === value}
                        onClick={() => {
                          setCategory(value);
                          setCategoryError(false);
                          setCategoryOpen(false);
                        }}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  <input id="a297Category" name="category" type="hidden" value={category} />
                </div>
                <p className="a316-select-error" hidden={!categoryError}>
                  Please select an issue category.
                </p>
              </div>
              <div className="field">
                <label htmlFor="a297Order">Order reference, if available</label>
                <input
                  id="a297Order"
                  name="orderReference"
                  autoComplete="off"
                  defaultValue={orderReference}
                  placeholder="For example, SO-10284"
                />
              </div>
              <div className="field">
                <label htmlFor="a297Email">
                  Contact email{" "}
                  <span aria-hidden="true" className="required-marker">
                    *
                  </span>
                  <span className="sr-only">required</span>
                </label>
                <input
                  id="a297Email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  defaultValue={profile.email}
                />
              </div>
              <div className="field">
                <label htmlFor="a297Phone">
                  Mobile number{" "}
                  <span aria-hidden="true" className="required-marker">
                    *
                  </span>
                  <span className="sr-only">required</span>
                </label>
                <input
                  id="a297Phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  defaultValue={profile.phone}
                />
              </div>
              <div className="field full">
                <label htmlFor="a297Subject">
                  Subject{" "}
                  <span aria-hidden="true" className="required-marker">
                    *
                  </span>
                  <span className="sr-only">required</span>
                </label>
                <input
                  id="a297Subject"
                  name="subject"
                  maxLength={120}
                  required
                  placeholder="Briefly describe what you need help with"
                />
              </div>
              <div className="field full">
                <label htmlFor="a297Desc">
                  Issue details{" "}
                  <span aria-hidden="true" className="required-marker">
                    *
                  </span>
                  <span className="sr-only">required</span>
                </label>
                <textarea
                  id="a297Desc"
                  name="description"
                  required
                  placeholder="Describe what happened, what you expected and what you see now"
                />
              </div>
              <div className="field full">
                <label htmlFor="a297Files">Attachments, optional</label>
                <input
                  id="a297Files"
                  name="attachments"
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                />
                <span className="field-hint">
                  Add photos or PDFs if they help show the issue.
                </span>
              </div>
            </div>
            <div className="support112-error" hidden={!error} tabIndex={-1}>
              {error}
            </div>
            <div className="form-footer-row">
              <p className="form-required-note">
                <span aria-hidden="true" className="required-marker">
                  *
                </span>{" "}
                Fields marked with an asterisk are mandatory.
              </p>
              <div className="form-actions">
                <Link className="btn secondary" href="/help">
                  Open Help
                </Link>
                <button
                  className="btn primary inline-flex items-center gap-2"
                  type="submit"
                  data-support-submit
                  disabled={submitting}
                >
                  {submitting ? <Spin size="small" /> : null}
                  {submitting ? "Submitting…" : "Submit support request"}
                </button>
              </div>
            </div>
            <p
              aria-live="polite"
              className={`support297-form-status${status.includes("Could not") ? " bad" : ""}`}
              data-ticket-form-status
            >
              {status}
            </p>
          </form>
        </div>
      </div>
    </dialog>,
    document.body
  );
}
