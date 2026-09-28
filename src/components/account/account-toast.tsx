"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ToastType = "good" | "bad";

export function useAccountToast() {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = useCallback((message: string, type: ToastType = "good") => {
    setToast({ message, type });
  }, []);

  const toastNode =
    mounted && toast ? (
      <div className="a295-toast" data-type={toast.type} role="status">
        {toast.message}
      </div>
    ) : null;

  return {
    showToast,
    toastPortal: toastNode ? createPortal(toastNode, document.body) : null,
  };
}
