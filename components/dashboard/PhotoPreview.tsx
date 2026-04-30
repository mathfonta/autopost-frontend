"use client";

import { ChevronLeft, Zap } from "lucide-react";
import { POST_TYPE_MAP, type PostTypeId } from "@/lib/post-types";

interface PhotoPreviewProps {
  postTypeId: PostTypeId;
  photoUrl:   string;
  onBack:     () => void;
  onConfirm:  () => void;
}

export function PhotoPreview({ postTypeId, photoUrl, onBack, onConfirm }: PhotoPreviewProps) {
  const pt = POST_TYPE_MAP[postTypeId];

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
        <span className="text-[17px] font-extrabold tracking-tight text-(--text-1)">Revisar foto</span>
      </header>

      <div className="overflow-y-auto">
        {/* Preview com overlay grade */}
        <div className="relative bg-black">
          <img
            src={photoUrl}
            alt="Preview"
            className="block w-full object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
              backgroundSize: "33.33% 33.33%",
            }}
          />
        </div>

        <div className="px-4 pb-8 pt-4">
          {/* Lembrete de tipo */}
          <div
            className="mb-5 flex items-center gap-2.25 rounded-xl p-[11px_14px]"
            style={{ background: pt.bg }}
          >
            <div
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px]"
              style={{ color: pt.color }}
            >
              <div className="h-3.5 w-3.5">{pt.icon}</div>
            </div>
            <p className="text-[13px] font-semibold text-(--text-2)">
              Tipo: <strong className="text-(--text-1)">{pt.label}</strong>
            </p>
          </div>

          {/* CTA */}
          <button
            className="tap flex w-full items-center justify-center gap-2 rounded-[14px] py-4 text-[16px] font-extrabold text-white"
            style={{ background: pt.color }}
            onClick={onConfirm}
          >
            <Zap size={14} fill="white" strokeWidth={0} />
            Usar esta foto
          </button>

          <button
            onClick={onBack}
            className="mt-2.5 w-full py-2.5 text-[13px] font-semibold text-(--text-4)"
          >
            Escolher outra foto
          </button>
        </div>
      </div>
    </div>
  );
}
