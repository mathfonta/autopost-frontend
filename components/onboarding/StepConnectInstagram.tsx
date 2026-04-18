"use client";

import { useState } from "react";
import { Share2, CheckCircle, Loader2 } from "lucide-react";
import { getMetaConnectUrl } from "@/lib/api";

interface StepConnectInstagramProps {
  connectedUsername?: string | null;
  onNext: () => void;
  onSkip: () => void;
}

export function StepConnectInstagram({
  connectedUsername,
  onNext,
  onSkip,
}: StepConnectInstagramProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const authUrl = await getMetaConnectUrl();
      window.location.href = authUrl;
    } catch {
      setError("Não foi possível iniciar a conexão. Tente novamente.");
      setLoading(false);
    }
  };

  if (connectedUsername) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-center">
            <span className="font-semibold text-gray-900">Instagram conectado!</span>
            <br />
            <span className="text-gray-500 text-sm">@{connectedUsername}</span>
          </p>
        </div>
        <button
          onClick={onNext}
          className="w-full py-3 bg-blue-600 text-white rounded-2xl font-semibold text-sm hover:bg-blue-700 transition-colors"
        >
          Continuar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center">
          <Share2 className="w-8 h-8 text-white" />
        </div>
        <p className="text-center text-sm text-gray-600 leading-relaxed">
          Conecte sua conta do Instagram para que o AutoPost possa publicar os posts automaticamente após aprovação.
        </p>
      </div>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <button
        onClick={handleConnect}
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-semibold text-sm hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 transition-opacity"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Share2 className="w-4 h-4" />
        )}
        {loading ? "Redirecionando..." : "Conectar com Instagram"}
      </button>

      <button
        onClick={onSkip}
        className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        Conectar depois
      </button>
    </div>
  );
}
