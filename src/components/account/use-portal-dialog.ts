"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type MouseEvent,
  type RefCallback,
} from "react";

export function usePortalDialog(open: boolean, onClose: () => void) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const syncDialogOpen = useCallback((el: HTMLDialogElement | null) => {
    if (!el) return;
    if (open) {
      if (!el.open) el.showModal();
    } else if (el.open) {
      el.close();
    }
  }, [open]);

  const setDialogRef: RefCallback<HTMLDialogElement> = useCallback(
    (el) => {
      dialogRef.current = el;
      syncDialogOpen(el);
    },
    [syncDialogOpen]
  );

  useEffect(() => {
    syncDialogOpen(dialogRef.current);
  }, [syncDialogOpen]);

  const handleBackdropClick = useCallback(
    (e: MouseEvent<HTMLDialogElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  const close = useCallback(() => {
    dialogRef.current?.close();
    onClose();
  }, [onClose]);

  return { dialogRef: setDialogRef, handleBackdropClick, close };
}
