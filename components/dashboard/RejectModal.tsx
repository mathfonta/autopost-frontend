"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RejectModalProps {
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  loading: boolean;
}

export function RejectModal({ onConfirm, onCancel, loading }: RejectModalProps) {
  const [reason, setReason] = useState("");
  const backdropRef = useRef<HTMLDivElement>(null);

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onCancel();
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Rejeitar post</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <textarea
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
          rows={3}
          placeholder="Motivo (opcional) — ex: foto muito escura, texto não reflete a marca..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={loading}
        />

        <div className="flex gap-3 mt-4">
          <Button variant="outline" className="flex-1" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            loading={loading}
            onClick={() => onConfirm(reason)}
          >
            Rejeitar
          </Button>
        </div>
      </div>
    </div>
  );
}
