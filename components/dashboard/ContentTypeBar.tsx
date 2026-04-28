"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { api } from "@/lib/api";
import { ContextModal } from "./ContextModal";
import type { VoiceTone } from "@/lib/types";

interface ContentTypeBarProps {
  onUploadComplete: () => void;
  currentTone: VoiceTone | null | undefined;
  onToneChanged: () => void;
}

const CONTENT_TYPES = [
  { value: "post_simples",   emoji: "📸", label: "Post Simples",       description: "Publicação de obra ou produto" },
  { value: "obra_andamento", emoji: "🔨", label: "Obra em Andamento",  description: "Progresso de projeto" },
  { value: "obra_concluida", emoji: "✅", label: "Obra Concluída",     description: "Resultado final entregue" },
  { value: "engajamento",    emoji: "💬", label: "Engajamento",        description: "Pergunta ou enquete" },
  { value: "bastidores",     emoji: "🎉", label: "Bastidores",         description: "Momento da equipe ou processo" },
];

export function ContentTypeBar({ onUploadComplete, currentTone, onToneChanged }: ContentTypeBarProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [showSourceMenu, setShowSourceMenu] = useState(false);
  const [showContextModal, setShowContextModal] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const isMobile = typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;

  const uploadFile = async (file: File, intent: string | null, context: string | null) => {
    setError(null);
    setUploading(true);
    setUploadingType(intent);
    try {
      const formData = new FormData();
      formData.append("photo", file);
      if (intent) formData.append("content_type", intent);
      if (context?.trim()) formData.append("user_context", context.trim());
      await api.post("/content-requests", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUploadComplete();
    } catch {
      setError("Erro ao enviar foto. Tente novamente.");
    } finally {
      setUploading(false);
      setUploadingType(null);
      setSelectedType(null);
      setPendingFile(null);
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
        setPhotoPreviewUrl("");
      }
    }
  };

  const handleTypeClick = (contentType: string) => {
    setSelectedType(contentType);
    if (isMobile) {
      setShowSourceMenu(true);
    } else {
      setTimeout(() => galleryInputRef.current?.click(), 50);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setShowSourceMenu(false);
      const previewUrl = URL.createObjectURL(file);
      setPendingFile(file);
      setPhotoPreviewUrl(previewUrl);
      setShowContextModal(true);
    }
    e.target.value = "";
  };

  const handleContextConfirm = (context: string) => {
    setShowContextModal(false);
    if (pendingFile) uploadFile(pendingFile, selectedType, context || null);
  };

  const handleContextSkip = () => {
    setShowContextModal(false);
    if (pendingFile) uploadFile(pendingFile, selectedType, null);
  };

  const handleContextClose = () => {
    setShowContextModal(false);
    setPendingFile(null);
    if (photoPreviewUrl) {
      URL.revokeObjectURL(photoPreviewUrl);
      setPhotoPreviewUrl("");
    }
    setSelectedType(null);
  };

  return (
    <>
      {/* Hidden inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        {...{ capture: "environment" }}
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Erro */}
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700 flex items-center justify-between gap-3">
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Barra de tipos de conteúdo */}
      <div className="rounded-2xl border border-gray-100 bg-white mb-6 overflow-hidden shadow-sm">
        <div className="px-4 pt-4 pb-1">
          <p className="text-sm font-bold text-gray-900">O que vamos postar hoje?</p>
        </div>
        <div className="px-2 pb-2 mt-1 space-y-0.5">
          {CONTENT_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => handleTypeClick(type.value)}
              disabled={uploading}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 active:bg-blue-50 transition-colors text-left disabled:opacity-50"
            >
              <span className="text-xl w-8 text-center leading-none">{type.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">{type.label}</p>
                <p className="text-xs text-gray-400">{type.description}</p>
              </div>
              {uploading && uploadingType === type.value && (
                <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Menu câmera vs galeria (mobile) */}
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
              onClick={() => {
                setShowSourceMenu(false);
                setTimeout(() => cameraInputRef.current?.click(), 50);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-lg">📷</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">Tirar foto</p>
                <p className="text-xs text-gray-400">Abrir câmera</p>
              </div>
            </button>
            <button
              onClick={() => {
                setShowSourceMenu(false);
                setTimeout(() => galleryInputRef.current?.click(), 50);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-lg">🖼️</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">Escolher da galeria</p>
                <p className="text-xs text-gray-400">Fotos e imagens</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Modal de contexto + tom de voz */}
      {showContextModal && photoPreviewUrl && (
        <ContextModal
          photoPreviewUrl={photoPreviewUrl}
          currentTone={currentTone}
          onToneChanged={onToneChanged}
          onConfirm={handleContextConfirm}
          onSkip={handleContextSkip}
          onClose={handleContextClose}
        />
      )}
    </>
  );
}
