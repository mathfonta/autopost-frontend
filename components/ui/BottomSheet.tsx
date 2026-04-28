"use client";

import { type ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface BottomSheetProps {
  open:       boolean;
  onClose:    () => void;
  children:   ReactNode;
  maxHeight?: string;
}

export function BottomSheet({ open, onClose, children, maxHeight = "90vh" }: BottomSheetProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else      document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="anim-fade-in fixed inset-0 z-300 flex items-end justify-center bg-black/55"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="anim-slide-up w-full max-w-107.5 overflow-y-auto rounded-t-modal bg-(--bg-card)"
        style={{ maxHeight }}
      >
        <div className="flex justify-center pb-0 pt-3">
          <div className="h-1 w-9 rounded-full bg-(--border)" />
        </div>
        {children}
      </div>
    </div>
  );
}

export function SheetCloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-(--bg-input) text-(--text-2)"
      aria-label="Fechar"
    >
      <X size={18} strokeWidth={2.5} />
    </button>
  );
}
