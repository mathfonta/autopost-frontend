"use client";

import { useState } from "react";
import { Music, Zap } from "lucide-react";
import { BottomSheet, SheetCloseButton } from "@/components/ui/BottomSheet";
import { VoiceToneSelector } from "./VoiceToneSelector";
import { POST_TYPE_MAP, type PostTypeId } from "@/lib/post-types";
import type { VoiceTone } from "@/lib/types";

interface ContextModalProps {
  open:            boolean;
  postTypeId:      PostTypeId | null;
  photoPreviewUrl: string;
  currentTone?:    VoiceTone | null;
  onToneChanged?:  () => void;
  onConfirm:       (context: string) => void;
  onSkip:          () => void;
  onClose:         () => void;
}

const MAX_CHARS = 200;
const MAX_MUSIC_CHARS = 100;

export function ContextModal({
  open,
  postTypeId,
  photoPreviewUrl,
  currentTone,
  onToneChanged,
  onConfirm,
  onSkip,
  onClose,
}: ContextModalProps) {
  const [context, setContext] = useState("");
  const [music, setMusic] = useState("");
  const pt = postTypeId ? POST_TYPE_MAP[postTypeId] : null;

  function handleConfirm() {
    let full = context.trim();
    if (music.trim()) {
      full = [full, `Música de fundo: ${music.trim()}`].filter(Boolean).join("\n\n");
    }
    setContext("");
    setMusic("");
    onConfirm(full);
  }

  function handleSkip() {
    setContext("");
    setMusic("");
    onSkip();
  }

  return (
    <BottomSheet open={open} onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-4 pt-3">
        <div className="flex items-center gap-[10px]">
          <img
            src={photoPreviewUrl}
            alt=""
            className="h-9 w-9 rounded-[10px] object-cover"
          />
          <div>
            <p className="text-[16px] font-extrabold text-[var(--text-1)]">Preparar post</p>
            {pt && (
              <p className="text-[12px] font-bold" style={{ color: pt.color }}>
                {pt.label}
              </p>
            )}
          </div>
        </div>
        <SheetCloseButton onClose={onClose} />
      </div>

      <div className="px-5 pb-7">
        {/* Tom de voz */}
        {currentTone !== undefined && onToneChanged && (
          <div className="mb-4">
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[.07em] text-[var(--text-3)]">
              Tom de voz
            </p>
            <VoiceToneSelector currentTone={currentTone} onChanged={onToneChanged} />
          </div>
        )}

        {/* Contexto */}
        <div className="mb-6">
          <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[.07em] text-[var(--text-3)]">
            Descreva o conteúdo
          </p>
          <div className="relative">
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Ex: revestimento em porcelanato, banheiro social..."
              rows={3}
              className="w-full resize-none rounded-[12px] border-2 border-[var(--border)] bg-[var(--bg-input)] p-[12px_14px] text-[14px] leading-relaxed text-[var(--text-1)] outline-none transition-colors placeholder:text-[var(--text-4)] focus:border-[var(--border)]"
              style={{ fontFamily: "inherit" }}
              onFocus={(e) => pt && (e.target.style.borderColor = pt.color)}
              onBlur={(e)  => (e.target.style.borderColor = "var(--border)")}
              autoFocus
            />
          </div>
          <p className="mt-1 text-right text-[11px] text-[var(--text-4)]">
            {context.length}/{MAX_CHARS}
          </p>
        </div>

        {/* Música de fundo */}
        <div className="mb-6">
          <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[.07em] text-[var(--text-3)]">
            Música de fundo <span className="font-normal normal-case tracking-normal text-(--text-4)">(opcional)</span>
          </p>
          <div className="relative flex items-center gap-2 rounded-xl border-2 border-(--border) bg-(--bg-input) px-3 py-2.5 transition-colors focus-within:border-(--border)"
            onFocus={(e) => { if (pt) (e.currentTarget as HTMLDivElement).style.borderColor = pt.color; }}
            onBlur={(e)  => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"; }}
          >
            <Music size={14} className="shrink-0 text-(--text-4)" />
            <input
              type="text"
              value={music}
              onChange={(e) => setMusic(e.target.value.slice(0, MAX_MUSIC_CHARS))}
              placeholder="Ex: Gustavo Mioto — Não, Não Vou"
              className="flex-1 bg-transparent text-[14px] text-(--text-1) outline-none placeholder:text-(--text-4)"
              style={{ fontFamily: "inherit" }}
            />
          </div>
          {music.length > 0 && (
            <p className="mt-1 text-right text-[11px] text-(--text-4)">
              {music.length}/{MAX_MUSIC_CHARS}
            </p>
          )}
        </div>

        <button
          onClick={handleConfirm}
          className="tap flex w-full items-center justify-center gap-2 rounded-[14px] py-4 text-[16px] font-extrabold text-white"
          style={{ background: pt?.color ?? "#2354E8" }}
        >
          <Zap size={14} fill="white" strokeWidth={0} />
          Gerar copy com IA
        </button>

        <button
          onClick={handleSkip}
          className="mt-[10px] w-full py-[10px] text-[13px] font-semibold text-[var(--text-4)]"
        >
          Pular este passo
        </button>
      </div>
    </BottomSheet>
  );
}
