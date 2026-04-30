"use client";

import { useState } from "react";
import { ChevronLeft, Pencil, X, Check, Video } from "lucide-react";
import { CaptionVariantSelector } from "./CaptionVariantSelector";
import { ApprovalButtons } from "./ApprovalButtons";
import { POST_TYPE_MAP } from "@/lib/post-types";
import { patchContentRequest } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import type { ContentRequest } from "@/lib/types";
import type { PostTypeId } from "@/lib/post-types";

const ACCENT   = "#2354E8";
const MAX_CHARS = 2200;
const VIDEO_TYPES = new Set(["reels", "story"]);

interface ApprovalScreenProps {
  post:     ContentRequest;
  onBack:   () => void;
  onAction: () => void;
}

export function ApprovalScreen({ post, onBack, onAction }: ApprovalScreenProps) {
  const { toast } = useToast();
  const isVideo = VIDEO_TYPES.has(post.content_type ?? "");
  const pt      = post.content_type ? POST_TYPE_MAP[post.content_type as PostTypeId] : null;

  // Caption state — começa com a variante longa (ou o caption do copy_result)
  const defaultCaption = post.caption_long ?? post.copy_result?.caption ?? "";
  const [activeCaption, setActiveCaption] = useState(defaultCaption);
  const [editing,       setEditing]       = useState(false);
  const [draft,         setDraft]         = useState(defaultCaption);
  const [saving,        setSaving]        = useState(false);
  const [captionEdited, setCaptionEdited] = useState(post.caption_edited ?? false);

  // URL da mídia: foto_url é refrescada pelo backend a cada GET
  const mediaUrl = post.photo_url ?? "";

  function startEdit() {
    setDraft(activeCaption);
    setEditing(true);
  }

  async function handleSave() {
    if (draft === activeCaption) { setEditing(false); return; }
    setSaving(true);
    try {
      await patchContentRequest(post.id, draft);
      setActiveCaption(draft);
      setCaptionEdited(true);
      setEditing(false);
      toast("Legenda atualizada.");
    } catch {
      toast("Erro ao salvar. Tente novamente.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-(--bg-shell)">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-13.5 shrink-0 items-center gap-3 border-b border-(--border) bg-(--bg-card) px-4">
        <button
          onClick={onBack}
          className="tap flex h-9 w-9 items-center justify-center rounded-icon bg-(--bg-input) text-(--text-1)"
          aria-label="Voltar"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>
        <span className="text-[17px] font-extrabold tracking-tight text-(--text-1)">Revisar post</span>
      </header>

      {/* Conteúdo rolável */}
      <div className="flex-1 overflow-y-auto">

        {/* Mídia */}
        <div className="relative bg-black">
          {isVideo ? (
            mediaUrl ? (
              <video
                src={mediaUrl}
                controls
                playsInline
                className="block w-full"
                style={{ maxHeight: "55vh" }}
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center">
                <Video size={48} className="text-(--text-4)" />
              </div>
            )
          ) : (
            mediaUrl ? (
              <img src={mediaUrl} alt="Post" className="block w-full object-cover" />
            ) : (
              <div className="aspect-square bg-(--bg-card) flex items-center justify-center text-(--text-4)">
                Sem imagem
              </div>
            )
          )}
        </div>

        <div className="px-4 pt-5 space-y-4">
          {/* Badge de tipo */}
          {pt && (
            <div
              className="flex items-center gap-2.25 rounded-xl p-[10px_14px]"
              style={{ background: pt.bg }}
            >
              <div className="flex h-5 w-5 shrink-0 items-center justify-center" style={{ color: pt.color }}>
                <div className="h-3.5 w-3.5">{pt.icon}</div>
              </div>
              <p className="text-[13px] font-semibold text-(--text-2)">
                Tipo: <strong style={{ color: pt.color }}>{pt.label}</strong>
              </p>
            </div>
          )}

          {/* Legenda */}
          <div>
            {/* Header da seção */}
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-extrabold uppercase tracking-[.07em] text-(--text-3)">
                Legenda
                {captionEdited && (
                  <span className="ml-2 text-[10px] font-semibold normal-case tracking-normal" style={{ color: ACCENT }}>
                    editada
                  </span>
                )}
              </p>
              {!editing && (
                <button
                  onClick={startEdit}
                  className="flex items-center gap-1 text-[12px] font-semibold"
                  style={{ color: ACCENT }}
                >
                  <Pencil size={12} />
                  Editar
                </button>
              )}
            </div>

            {/* Seletor de variantes (apenas se tiver variantes) */}
            {!editing && post.caption_long && (
              <CaptionVariantSelector
                post={post}
                onVariantSelected={(text) => setActiveCaption(text)}
              />
            )}

            {/* Texto ativo (quando não tem variantes) */}
            {!editing && !post.caption_long && (
              <p className="text-[15px] leading-relaxed text-(--text-1) whitespace-pre-line">
                {activeCaption}
              </p>
            )}

            {/* Modo edição inline */}
            {editing && (
              <div className="space-y-2">
                <textarea
                  className="w-full rounded-xl border border-(--border) bg-(--bg-input) p-3 text-[14px] text-(--text-1) resize-none focus:outline-none focus:ring-2"
                  style={{ "--tw-ring-color": ACCENT } as React.CSSProperties}
                  rows={7}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  autoFocus
                />
                <div className="flex items-center justify-between">
                  <span className={`text-[12px] ${draft.length > MAX_CHARS ? "text-red-500 font-semibold" : "text-(--text-4)"}`}>
                    {draft.length}/{MAX_CHARS}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(false)}
                      disabled={saving}
                      className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-[13px] font-semibold text-(--text-2) bg-(--bg-input)"
                    >
                      <X size={13} /> Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving || draft.length > MAX_CHARS}
                      className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-[13px] font-extrabold text-white disabled:opacity-50"
                      style={{ background: ACCENT }}
                    >
                      <Check size={13} />
                      {saving ? "Salvando…" : "Salvar"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer — sempre visível no fundo do container */}
      <div className="border-t border-(--border) bg-(--bg-card) px-4 py-3">
        <ApprovalButtons
          postId={post.id}
          retryCount={post.retry_count}
          captionOverride={activeCaption !== defaultCaption ? activeCaption : null}
          onAction={onAction}
        />
      </div>
    </div>
  );
}
