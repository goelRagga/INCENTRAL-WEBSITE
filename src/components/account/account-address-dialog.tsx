"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";

import { usePortalDialog } from "@/components/account/use-portal-dialog";
import type { AccountAddress } from "@/lib/account/types";

type AccountAddressDialogProps = {
  open: boolean;
  address: AccountAddress | null;
  onClose: () => void;
  onSave: (payload: AccountAddress) => Promise<void> | void;
};

export function AccountAddressDialog({
  open,
  address,
  onClose,
  onSave,
}: AccountAddressDialogProps) {
  const [mounted, setMounted] = useState(false);
  const { dialogRef, handleBackdropClick, close } = usePortalDialog(open, onClose);
  const [status, setStatus] = useState("");

  useEffect(() => setMounted(true), []);

  if (!mounted || !address) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    const payload: AccountAddress = {
      ...address,
      attention: String(new FormData(f).get("attention") ?? ""),
      address: String(new FormData(f).get("address") ?? ""),
      street2: String(new FormData(f).get("street2") ?? ""),
      city: String(new FormData(f).get("city") ?? ""),
      state: String(new FormData(f).get("state") ?? ""),
      zip: String(new FormData(f).get("zip") ?? ""),
      country: String(new FormData(f).get("country") ?? ""),
    };
    setStatus("Saving…");
    try {
      await onSave(payload);
      close();
    } catch {
      setStatus("Could not save the address.");
    }
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      className="a295-dialog narrow"
      data-address-dialog
      onClick={handleBackdropClick}
      onClose={onClose}
    >
      <div className="a295-dialog-shell">
        <header className="a295-dialog-head">
          <div className="a295-dialog-title">
            <span>Saved address</span>
            <h2>{address.label || "Edit address"}</h2>
          </div>
          <button
            type="button"
            className="a295-dialog-close"
            aria-label="Close address editor"
            onClick={close}
          >
            ×
          </button>
        </header>
        <div className="a295-dialog-body">
          <form onSubmit={handleSubmit}>
            <div className="a295-field-grid">
              <div className="a295-field full">
                <label htmlFor="a295Attention">Contact / attention</label>
                <input
                  id="a295Attention"
                  name="attention"
                  defaultValue={address.attention ?? ""}
                />
              </div>
              <div className="a295-field full">
                <label htmlFor="a295Address">Address</label>
                <input
                  id="a295Address"
                  name="address"
                  required
                  defaultValue={address.address ?? ""}
                />
              </div>
              <div className="a295-field full">
                <label htmlFor="a295Street2">Address line 2</label>
                <input
                  id="a295Street2"
                  name="street2"
                  defaultValue={address.street2 ?? ""}
                />
              </div>
              <div className="a295-field">
                <label htmlFor="a295City">City</label>
                <input id="a295City" name="city" required defaultValue={address.city ?? ""} />
              </div>
              <div className="a295-field">
                <label htmlFor="a295State">State</label>
                <input
                  id="a295State"
                  name="state"
                  required
                  defaultValue={address.state ?? ""}
                />
              </div>
              <div className="a295-field">
                <label htmlFor="a295Zip">PIN code</label>
                <input
                  id="a295Zip"
                  name="zip"
                  inputMode="numeric"
                  required
                  defaultValue={address.zip ?? ""}
                />
              </div>
              <div className="a295-field">
                <label htmlFor="a295Country">Country</label>
                <input
                  id="a295Country"
                  name="country"
                  required
                  defaultValue={address.country ?? "India"}
                />
              </div>
            </div>
            <div className="a295-dialog-actions">
              <button type="button" className="a295-btn" onClick={close}>
                Cancel
              </button>
              <button type="submit" className="a295-btn primary">
                Save address
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
