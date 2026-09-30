"use client";

import { useEffect, useRef } from "react";

import { AuthPage } from "./auth-page";

export function AuthModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const close = () => dialogRef.current?.close();

  useEffect(() => {
    const open = () => dialogRef.current?.showModal();
    window.addEventListener("incentral:open-auth-modal", open);
    return () => window.removeEventListener("incentral:open-auth-modal", open);
  }, []);

  // Close on backdrop click
  const onDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) close();
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={onDialogClick}
      className="auth-modal-dialog"
      aria-label="Sign in"
    >
      <div className="auth-modal-panel">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="auth-modal-close"
        >
          ×
        </button>
        <AuthPage onSuccess={close} />
      </div>
    </dialog>
  );
}
