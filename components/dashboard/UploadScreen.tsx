"use client";

import { useRef, useState, useEffect } from "react";
import { Camera, Image, FileUp, ChevronLeft, Play, Plus, X, Zap } from "lucide-react";
import { POST_TYPE_MAP, type PostTypeId } from "@/lib/post-types";

interface UploadScreenProps {
  postTypeId:         PostTypeId;
  onBack:             () => void;
  onPhotoSelected:    (file: File, previewUrl: string) => void;
  onPhotosSelected?:  (files: File[]) => void;
}

export function UploadScreen({
  postTypeId,
  onBack,
  onPhotoSelected,
  onPhotosSelected,
}: UploadScreenProps) {
  const pt = POST_TYPE_MAP[postTypeId];

  const mode =
    postTypeId === "carousel"   ? "multi-image"
    : postTypeId === "reels"    ? "video"
    : postTypeId === "story"    ? "image-or-video"
    : "single-image";

  const cameraRef   = useRef<HTMLInputElement>(null);
  const galleryRef  = useRef<HTMLInputElement>(null);
  const fileRef     = useRef<HTMLInputElement>(null);
  const multiRef    = useRef<HTMLInputElement>(null);
  const videoRef    = useRef<HTMLInputElement>(null);
  const anyFileRef  = useRef<HTMLInputElement>(null);

  const isMobile = typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;

  // carousel state
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [thumbUrls,    setThumbUrls]    = useState<string[]>([]);

  // video / image-or-video preview state
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl,  setPreviewUrl]  = useState<string | null>(null);

  // revoke all blob URLs on unmount
  const thumbUrlsRef  = useRef(thumbUrls);
  thumbUrlsRef.current = thumbUrls;
  const previewUrlRef  = useRef(previewUrl);
  previewUrlRef.current = previewUrl;

  useEffect(() => {
    return () => {
      thumbUrlsRef.current.forEach(u => URL.revokeObjectURL(u));
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  // ── single image handler ───────────────────────────────────────
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onPhotoSelected(file, url);
    e.target.value = "";
  }

  // ── multi-image (carousel) ─────────────────────────────────────
  function handleMultiFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(e.target.files ?? []);
    if (!newFiles.length) return;
    const remaining = 10 - pendingFiles.length;
    const toAdd     = newFiles.slice(0, remaining);
    const newUrls   = toAdd.map(f => URL.createObjectURL(f));
    setPendingFiles(prev => [...prev, ...toAdd]);
    setThumbUrls(prev => [...prev, ...newUrls]);
    e.target.value = "";
  }

  function removeFile(idx: number) {
    URL.revokeObjectURL(thumbUrls[idx]);
    setPendingFiles(prev => prev.filter((_, i) => i !== idx));
    setThumbUrls(prev => prev.filter((_, i) => i !== idx));
  }

  function confirmCarousel() {
    if (pendingFiles.length >= 2) onPhotosSelected?.(pendingFiles);
  }

  // ── video / image-or-video ─────────────────────────────────────
  function handleSingleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setPreviewFile(file);
    setPreviewUrl(url);
    e.target.value = "";
  }

  function confirmSingle() {
    if (previewFile && previewUrl) onPhotoSelected(previewFile, previewUrl);
  }

  const isVideo = previewFile?.type.startsWith("video/") ?? false;

  // ── single-image actions ───────────────────────────────────────
  const singleActions = [
    {
      label:   "Tirar foto agora",
      sub:     "Abre a câmera do celular",
      icon:    <Camera size={22} />,
      primary: true,
      ref:     cameraRef,
    },
    {
      label:   "Escolher da galeria",
      sub:     "Fotos do seu celular",
      icon:    <Image size={22} />,
      primary: false,
      ref:     galleryRef,
    },
    {
      label:   "Enviar arquivo",
      sub:     "JPG, PNG ou HEIC",
      icon:    <FileUp size={22} />,
      primary: false,
      ref:     fileRef,
    },
  ];

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
            {mode === "multi-image"     ? "Selecione 2 a 10 fotos"
            : mode === "video"          ? "Escolha o vídeo do Reels"
            : mode === "image-or-video" ? "Escolha a foto ou vídeo"
            : "Escolha a foto para este post"}
          </span>
        </div>

        {/* ── single-image: layout original ── */}
        {mode === "single-image" && (
          <>
            <div className="flex flex-col gap-3">
              {singleActions.map((action, i) => (
                <button
                  key={i}
                  className="tap flex w-full items-center gap-4 rounded-2xl border border-(--border) bg-(--bg-card) px-5 py-4.5 text-left shadow-sm"
                  style={action.primary ? { background: pt.color, border: "none" } : {}}
                  onClick={() => action.ref.current?.click()}
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                    style={
                      action.primary
                        ? { background: "rgba(255,255,255,.18)", color: "#fff" }
                        : { background: pt.bg, color: pt.color }
                    }
                  >
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-[16px] font-extrabold leading-none"
                      style={{ color: action.primary ? "#fff" : "var(--text-1)" }}
                    >
                      {action.label}
                    </p>
                    <p
                      className="mt-1 text-[12px] font-medium"
                      style={{ color: action.primary ? "rgba(255,255,255,.7)" : "var(--text-3)" }}
                    >
                      {action.sub}
                    </p>
                  </div>
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke={action.primary ? "rgba(255,255,255,.5)" : "var(--text-4)"}
                    strokeWidth="2.5" strokeLinecap="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ))}
            </div>

            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture={isMobile ? "environment" : undefined}
              onChange={handleFile}
              className="hidden"
            />
            <input ref={galleryRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            <input ref={fileRef}    type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </>
        )}

        {/* ── multi-image (carousel) ── */}
        {mode === "multi-image" && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[13px] font-bold text-(--text-2)">
                {pendingFiles.length}/10 fotos
              </span>
              <button
                className="tap flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-bold text-white disabled:opacity-40"
                style={{ background: pt.color }}
                onClick={() => multiRef.current?.click()}
                disabled={pendingFiles.length >= 10}
              >
                <Plus size={14} />
                Adicionar fotos
              </button>
            </div>

            {pendingFiles.length > 0 ? (
              <div className="mb-5 grid grid-cols-3 gap-2">
                {thumbUrls.map((url, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-(--bg-input)">
                    <img src={url} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
                    <button
                      onClick={() => removeFile(i)}
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                      aria-label="Remover foto"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="mb-5 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-10 text-center"
                style={{ borderColor: pt.color + "40" }}
              >
                <Image size={32} color={pt.color} className="mb-2 opacity-60" />
                <p className="text-[14px] font-semibold text-(--text-3)">Nenhuma foto selecionada</p>
                <p className="mt-1 text-[12px] text-(--text-4)">Toque em "Adicionar fotos"</p>
              </div>
            )}

            <button
              className="tap flex w-full items-center justify-center gap-2 rounded-[14px] py-4 text-[16px] font-extrabold text-white disabled:opacity-40"
              style={{ background: pt.color }}
              disabled={pendingFiles.length < 2}
              onClick={confirmCarousel}
            >
              <Zap size={14} fill="white" strokeWidth={0} />
              {pendingFiles.length >= 2
                ? `Confirmar ${pendingFiles.length} fotos`
                : "Confirmar fotos"}
            </button>

            {pendingFiles.length < 2 && (
              <p className="mt-2 text-center text-[12px] text-(--text-3)">
                Selecione pelo menos 2 fotos
              </p>
            )}

            <input
              ref={multiRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleMultiFiles}
              className="hidden"
            />
          </>
        )}

        {/* ── video (reels) ── */}
        {mode === "video" && (
          <>
            {previewFile ? (
              <>
                <div
                  className="relative mb-4 aspect-video w-full overflow-hidden rounded-2xl bg-black"
                  onClick={() => videoRef.current?.click()}
                >
                  <video
                    src={previewUrl ?? undefined}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/50">
                      <Play size={26} fill="white" color="white" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">
                    {previewFile.name.split(".").pop()?.toUpperCase()}
                  </div>
                </div>

                <button
                  className="tap flex w-full items-center justify-center gap-2 rounded-[14px] py-4 text-[16px] font-extrabold text-white"
                  style={{ background: pt.color }}
                  onClick={confirmSingle}
                >
                  <Zap size={14} fill="white" strokeWidth={0} />
                  Usar este vídeo
                </button>
                <button
                  onClick={() => videoRef.current?.click()}
                  className="mt-2 w-full py-2 text-[13px] font-semibold text-(--text-4)"
                >
                  Escolher outro vídeo
                </button>
              </>
            ) : (
              <button
                className="tap flex w-full items-center gap-4 rounded-2xl border-none px-5 py-4.5 text-left shadow-sm"
                style={{ background: pt.color }}
                onClick={() => videoRef.current?.click()}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
                  <Play size={22} fill="white" color="white" />
                </div>
                <div className="flex-1">
                  <p className="text-[16px] font-extrabold leading-none text-white">Escolher vídeo</p>
                  <p className="mt-1 text-[12px] font-medium text-white/70">MP4 ou MOV · até 20MB</p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            )}

            <input
              ref={videoRef}
              type="file"
              accept="video/mp4,video/quicktime,video/*"
              onChange={handleSingleFile}
              className="hidden"
            />
          </>
        )}

        {/* ── image-or-video (story) ── */}
        {mode === "image-or-video" && (
          <>
            {previewFile ? (
              <>
                <div
                  className="relative mb-4 overflow-hidden rounded-2xl bg-black"
                  style={{ aspectRatio: "9/16", maxHeight: "52vh" }}
                >
                  {isVideo ? (
                    <>
                      <video
                        src={previewUrl ?? undefined}
                        className="h-full w-full object-cover"
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/50">
                          <Play size={26} fill="white" color="white" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <img src={previewUrl ?? undefined} alt="Preview" className="h-full w-full object-cover" />
                  )}
                </div>

                <button
                  className="tap flex w-full items-center justify-center gap-2 rounded-[14px] py-4 text-[16px] font-extrabold text-white"
                  style={{ background: pt.color }}
                  onClick={confirmSingle}
                >
                  <Zap size={14} fill="white" strokeWidth={0} />
                  {isVideo ? "Usar este vídeo" : "Usar esta foto"}
                </button>
                <button
                  onClick={() => anyFileRef.current?.click()}
                  className="mt-2 w-full py-2 text-[13px] font-semibold text-(--text-4)"
                >
                  Escolher outro arquivo
                </button>
              </>
            ) : (
              <button
                className="tap flex w-full items-center gap-4 rounded-2xl border-none px-5 py-4.5 text-left shadow-sm"
                style={{ background: pt.color }}
                onClick={() => anyFileRef.current?.click()}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
                  <FileUp size={22} color="white" />
                </div>
                <div className="flex-1">
                  <p className="text-[16px] font-extrabold leading-none text-white">
                    Escolher foto ou vídeo
                  </p>
                  <p className="mt-1 text-[12px] font-medium text-white/70">
                    JPEG, PNG, WEBP, MP4, MOV
                  </p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            )}

            <input
              ref={anyFileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/*"
              onChange={handleSingleFile}
              className="hidden"
            />
          </>
        )}

        {/* Dica */}
        <div className="mt-6 flex gap-2.5 rounded-[14px] bg-(--bg-input) p-[13px_14px]">
          <span className="shrink-0 text-base">💡</span>
          <p className="text-[12.5px] font-medium leading-relaxed text-(--text-2)">
            {mode === "video"
              ? "Vídeos curtos (15–30s) têm mais distribuição orgânica no Instagram. Tamanho máximo: 20MB."
              : mode === "image-or-video"
                ? "Stories com vídeo têm mais cliques no link. Imagens ou vídeos até 20MB."
                : mode === "multi-image"
                  ? "Carrosséis têm a maior taxa de saves e compartilhamentos do feed."
                  : "Fotos bem iluminadas geram copies melhores. Prefira fotos tiradas de dia ou com boa iluminação."}
          </p>
        </div>
      </div>
    </div>
  );
}
