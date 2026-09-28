"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";

import { usePortalDialog } from "@/components/account/use-portal-dialog";
import type { AccountProfile } from "@/lib/account/types";

type AccountProfileDialogProps = {
  open: boolean;
  profile: AccountProfile | null;
  onClose: () => void;
  onSave: (payload: Partial<AccountProfile>) => Promise<void> | void;
};

export function AccountProfileDialog({
  open,
  profile,
  onClose,
  onSave,
}: AccountProfileDialogProps) {
  const [mounted, setMounted] = useState(false);
  const { dialogRef, handleBackdropClick, close } = usePortalDialog(open, onClose);
  const [status, setStatus] = useState("");

  useEffect(() => setMounted(true), []);

  if (!mounted || !profile) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    const payload = {
      firstName: String(new FormData(f).get("firstName") ?? "").trim(),
      lastName: String(new FormData(f).get("lastName") ?? "").trim(),
      companyName: String(new FormData(f).get("companyName") ?? "").trim(),
      phone: String(new FormData(f).get("phone") ?? "").trim(),
      gstin: String(new FormData(f).get("gstin") ?? "").trim(),
    };
    setStatus("Saving…");
    try {
      await onSave(payload);
      close();
    } catch {
      setStatus("Could not save changes.");
    }
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      className="a295-dialog narrow"
      data-profile-dialog
      onClick={handleBackdropClick}
      onClose={onClose}
    >
      <div className="a295-dialog-shell">
        <header className="a295-dialog-head">
          <div className="a295-dialog-title">
            <span>Account details</span>
            <h2>Edit profile &amp; company</h2>
          </div>
          <button
            type="button"
            className="a295-dialog-close"
            aria-label="Close profile editor"
            onClick={close}
          >
            ×
          </button>
        </header>
        <div className="a295-dialog-body">
          <form onSubmit={handleSubmit}>
            <div className="a295-field-grid">
              <div className="a295-field">
                <label htmlFor="a295FirstName">First name</label>
                <input
                  id="a295FirstName"
                  name="firstName"
                  required
                  defaultValue={profile.firstName}
                />
              </div>
              <div className="a295-field">
                <label htmlFor="a295LastName">Last name</label>
                <input
                  id="a295LastName"
                  name="lastName"
                  required
                  defaultValue={profile.lastName}
                />
              </div>
              <div className="a295-field full">
                <label htmlFor="a295CompanyName">Company name</label>
                <input
                  id="a295CompanyName"
                  name="companyName"
                  defaultValue={profile.companyName}
                />
              </div>
              <div className="a295-field">
                <label htmlFor="a295Phone">Phone</label>
                <input id="a295Phone" name="phone" defaultValue={profile.phone} />
              </div>
              <div className="a295-field">
                <label htmlFor="a295Gstin">GSTIN</label>
                <input
                  id="a295Gstin"
                  name="gstin"
                  maxLength={15}
                  defaultValue={profile.gstin ?? ""}
                />
              </div>
              <div className="a295-field full">
                <label htmlFor="a295Email">Email</label>
                <input
                  id="a295Email"
                  name="email"
                  readOnly
                  aria-label="Read-only value"
                  defaultValue={profile.email}
                />
              </div>
            </div>
            <div className="a295-dialog-actions">
              <button type="button" className="a295-btn" onClick={close}>
                Cancel
              </button>
              <button type="submit" className="a295-btn primary">
                Save changes
              </button>
            </div>
            <p
              className={`a295-form-status${status.includes("Could not") ? " bad" : ""}`}
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
