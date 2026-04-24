"use client";

import { useState } from "react";
import { AlertTriangle, RefreshCw, X } from "lucide-react";
import { refreshMetaToken, getMetaStatus, type MetaStatus } from "@/lib/api";

interface MetaTokenWarningProps {
  status: MetaStatus;
  onRenewed: () => void;
}

export function MetaTokenWarning({ status, onRenewed }: MetaTokenWarningProps) {
  const [renewing, setRenewing] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (dismissed || !status.connected) return null;

  const isExpired = status.days_until_expiry !== null && status.days_until_expiry <= 0;
  const isExpiringSoon = status.token_expiring_soon && !isExpired;

  if (!isExpired && !isExpiringSoon) return null;

  const handleRenew = async () => {
    setRenewing(true);
    setError(null);
    try {
      await refreshMetaToken();
      onRenewed();
    } catch {
      setError("Não foi possível renovar automaticamente. Reconecte sua conta Meta.");
    } finally {
      setRenewing(false);
    }
  };

  return (
    <div className={`mb-4 rounded-xl border px-4 py-3 flex items-start gap-3 ${
      isExpired
        ? "bg-red-50 border-red-200 text-red-800"
        : "bg-amber-50 border-amber-200 text-amber-800"
    }`}>
      <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">
          {isExpired
            ? "Token Meta expirado — publicações estão bloqueadas"
            : `Token Meta expira em ${status.days_until_expiry} dia${status.days_until_expiry === 1 ? "" : "s"}`}
        </p>
        {error ? (
          <p className="text-xs mt-1 text-red-600">{error}</p>
        ) : (
          <p className="text-xs mt-0.5 opacity-70">
            {isExpired ? "Clique em renovar ou reconecte a conta." : "Renove agora para não interromper as publicações."}
          </p>
        )}
        <button
          onClick={handleRenew}
          disabled={renewing}
          className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold underline-offset-2 hover:underline disabled:opacity-50"
        >
          {renewing ? (
            <RefreshCw className="h-3 w-3 animate-spin" />
          ) : (
            <RefreshCw className="h-3 w-3" />
          )}
          {renewing ? "Renovando..." : "Renovar token"}
        </button>
      </div>
      {!isExpired && (
        <button onClick={() => setDismissed(true)} className="flex-shrink-0 opacity-50 hover:opacity-100">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
