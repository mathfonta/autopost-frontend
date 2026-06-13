"use client";

import { useState } from "react";
import { AtSign, LogOut, AlertCircle } from "lucide-react";
import { disconnectMeta, type MetaStatus } from "@/lib/api";

interface MetaAccountCardProps {
  status: MetaStatus;
  onDisconnected: () => void;
}

export function MetaAccountCard({ status, onDisconnected }: MetaAccountCardProps) {
  const [confirming, setConfirming] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!status.connected || !status.instagram_username) return null;

  const handleDisconnect = async () => {
    setDisconnecting(true);
    setError(null);
    try {
      await disconnectMeta();
      onDisconnected();
    } catch {
      setError("Erro ao desconectar. Tente novamente.");
      setConfirming(false);
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className="rounded-xl border border-(--border) bg-(--bg-card) px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-pink-500">
            <AtSign className="h-3.5 w-3.5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-(--text-1) truncate">
              @{status.instagram_username}
            </p>
            <p className="text-[11px] text-(--text-3)">Conta Instagram conectada</p>
          </div>
        </div>

        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            className="shrink-0 flex items-center gap-1 text-[12px] font-medium text-(--text-3) hover:text-red-500 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Trocar conta
          </button>
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[12px] text-(--text-3)">Confirmar?</span>
            <button
              onClick={handleDisconnect}
              disabled={disconnecting}
              className="text-[12px] font-semibold text-red-500 hover:text-red-700 disabled:opacity-50"
            >
              {disconnecting ? "Saindo..." : "Sim"}
            </button>
            <button
              onClick={() => setConfirming(false)}
              disabled={disconnecting}
              className="text-[12px] font-medium text-(--text-3) hover:text-(--text-2) disabled:opacity-50"
            >
              Não
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-[12px] text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
