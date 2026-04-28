"use client";

import { useRef } from "react";
import { Camera, Image, ChevronLeft } from "lucide-react";
import { POST_TYPE_MAP, type PostTypeId } from "@/lib/post-types";

interface UploadScreenProps {
  postTypeId:      PostTypeId;
  onBack:          () => void;
  onPhotoSelected: (file: File, previewUrl: string) => void;
}

export function UploadScreen({ postTypeId, onBack, onPhotoSelected }: UploadScreenProps) {
  const pt         = POST_TYPE_MAP[postTypeId];
  const cameraRef  = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onPhotoSelected(file, url);
    e.target.value = "";
  }

  const isMobile = typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;

  return (
    <div className="flex flex-col min-h-screen bg-(--bg-shell)">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-13.5 shrink-0 items-center gap-3 border-b border-(--border) bg-(--bg-card) px-4">
        <button
          onClick={onBack}
          className="tap flex h-9 w-9 items-center justify-center rounded-icon bg-(--bg-input) text-(--text-1)"
          aria-label="Voltar"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>
        <span className="text-[17px] font-extrabold tracking-tight text-(--text-1)">
          {pt.label}
        </span>
      </header>

      <div className="overflow-y-auto px-4 pb-9 pt-6">
        {/* Indicador de tipo */}
        <div className="mb-6 flex items-center gap-2">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
            style={{ background: pt.bg, color: pt.color }}
          >
            <div className="h-3.5 w-3.5">{pt.icon}</div>
          </div>
          <span className="text-[14px] font-semibold text-(--text-2)">
            Escolha a foto para este post
          </span>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col gap-3">
          {isMobile && (
            <button
              className="tap flex w-full items-center gap-4 rounded-2xl px-5 py-4.5 text-left shadow-sm"
              style={{ background: pt.color }}
              onClick={() => cameraRef.current?.click()}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: "rgba(255,255,255,.18)" }}>
                <Camera size={22} />
              </div>
              <div className="flex-1">
                <p className="text-[16px] font-extrabold leading-none text-white">Tirar foto agora</p>
                <p className="mt-1 text-[12px] font-medium text-white/70">Abre a câmera do celular</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          )}

          <button
            className="tap flex w-full items-center gap-4 rounded-2xl border border-(--border) bg-(--bg-card) px-5 py-4.5 text-left shadow-sm"
            onClick={() => galleryRef.current?.click()}
          >
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
              style={{ background: pt.bg, color: pt.color }}
            >
              <Image size={22} />
            </div>
            <div className="flex-1">
              <p className="text-[16px] font-extrabold leading-none text-(--text-1)">
                {isMobile ? "Escolher da galeria" : "Selecionar foto"}
              </p>
              <p className="mt-1 text-[12px] font-medium text-(--text-3)">
                {isMobile ? "Fotos do seu celular" : "JPG, PNG ou HEIC"}
              </p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-4)" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        {/* Inputs ocultos */}
        <input ref={cameraRef}  type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
        <input ref={galleryRef} type="file" accept="image/*"                        onChange={handleFile} className="hidden" />

        {/* Dica */}
        <div className="mt-6 flex gap-2.5 rounded-[14px] bg-(--bg-input) p-[13px_14px]">
          <span className="shrink-0 text-base">💡</span>
          <p className="text-[12.5px] font-medium leading-relaxed text-(--text-2)">
            Fotos bem iluminadas geram copies melhores. Prefira fotos tiradas de dia ou com boa iluminação no ambiente.
          </p>
        </div>
      </div>
    </div>
  );
}
