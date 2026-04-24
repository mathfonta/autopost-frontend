"use client";

import { useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { api } from "@/lib/api";
import { IntentMenu } from "./IntentMenu";

interface PhotoUploadFABProps {
  onUploadComplete: () => void;
}

export function PhotoUploadFAB({ onUploadComplete }: PhotoUploadFABProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showIntentMenu, setShowIntentMenu] = useState(false);
  const [showSourceMenu, setShowSourceMenu] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isMobile =
    typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;

  const handleFileSelected = async (file: File, intent: string | null) => {
    setShowSourceMenu(false);
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);
      if (intent) formData.append("content_type", intent);
      await api.post("/content-requests", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUploadComplete();
    } catch {
      setError("Erro ao enviar foto. Tente novamente.");
    } finally {
      setUploading(false);
      setSelectedIntent(null);
    }
  };

  const handleIntentSelected = (contentType: string) => {
    setSelectedIntent(contentType);
    setShowIntentMenu(false);
    if (isMobile) {
      setShowSourceMenu(true);
    } else {
      setTimeout(() => galleryInputRef.current?.click(), 50);
    }
  };

  const handleFABClick = () => {
    setShowIntentMenu(true);
  };

  const captureWithIntent = (ref: React.RefObject<HTMLInputElement | null>) => {
    setShowSourceMenu(false);
    setTimeout(() => ref.current?.click(), 50);
  };

  return (
    <>
      {/* Input câmera (mobile) */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        {...{ capture: "environment" }}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelected(file, selectedIntent);
          e.target.value = "";
        }}
      />

      {/* Input galeria / file picker */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelected(file, selectedIntent);
          e.target.value = "";
        }}
      />

      {/* Erro */}
      {error && (
        <div className="fixed bottom-24 right-4 left-4 z-50 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex items-center justify-between gap-3">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="flex-shrink-0">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Etapa 1: Menu de Intenção */}
      {showIntentMenu && (
        <IntentMenu
          onSelect={handleIntentSelected}
          onClose={() => setShowIntentMenu(false)}
        />
      )}

      {/* Etapa 2: Menu câmera vs galeria (mobile) */}
      {showSourceMenu && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowSourceMenu(false)}
          />
          <div className="relative w-full bg-white rounded-t-2xl px-6 pt-6 pb-10 space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide text-center mb-2">
              Enviar foto
            </p>
            <button
              onClick={() => captureWithIntent(cameraInputRef)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                <Camera className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">Tirar foto</p>
                <p className="text-xs text-gray-400">Abrir câmera</p>
              </div>
            </button>
            <button
              onClick={() => captureWithIntent(galleryInputRef)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                <Camera className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">Escolher da galeria</p>
                <p className="text-xs text-gray-400">Fotos e imagens</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={handleFABClick}
          disabled={uploading}
          className="h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center disabled:opacity-60"
          title="Enviar foto"
        >
          {uploading ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Camera className="h-6 w-6" />
          )}
        </button>
      </div>
    </>
  );
}
