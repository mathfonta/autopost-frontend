"use client";

import { Sparkles } from "lucide-react";
import { POST_TYPES, type PostTypeId } from "@/lib/post-types";
import { PostTypeCard, PostTypeRow } from "./PostTypeCard";

const ACCENT = "#2354E8";

interface ContentTypeBarProps {
  onTypeSelected:        (typeId: PostTypeId) => void;
  onAutonomousSelected?: () => void;
  uploading?:            boolean;
  uploadingType?:        PostTypeId | null;
  layout?:               "grid" | "list";
}

export function ContentTypeBar({
  onTypeSelected,
  onAutonomousSelected,
  uploading,
  uploadingType,
  layout = "grid",
}: ContentTypeBarProps) {
  return (
    <section>
      <h2 className="mb-3 text-[17px] font-extrabold tracking-tight text-(--text-1)">
        O que vamos postar hoje?
      </h2>

      {layout === "grid" ? (
        <div className="grid grid-cols-2 gap-2.5">
          {POST_TYPES.map((pt) => (
            <PostTypeCard
              key={pt.id}
              postType={pt}
              onClick={() => onTypeSelected(pt.id)}
              disabled={uploading}
              loading={uploading && uploadingType === pt.id}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {POST_TYPES.map((pt) => (
            <PostTypeRow
              key={pt.id}
              postType={pt}
              onClick={() => onTypeSelected(pt.id)}
              disabled={uploading}
              loading={uploading && uploadingType === pt.id}
            />
          ))}
        </div>
      )}

      {onAutonomousSelected && (
        <button
          onClick={onAutonomousSelected}
          disabled={uploading}
          className="mt-3 w-full flex items-center gap-3 rounded-2xl border-2 p-3.5 text-left tap disabled:opacity-50"
          style={{ borderColor: ACCENT, background: `${ACCENT}0D` }}
        >
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{ background: ACCENT }}
          >
            <Sparkles size={18} color="white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold" style={{ color: ACCENT }}>
                Carrossel Automático
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase text-white"
                style={{ background: ACCENT }}
              >
                NOVO
              </span>
            </div>
            <p className="text-[12px] text-(--text-3)">
              Gera slides completos sem precisar de foto
            </p>
          </div>
        </button>
      )}
    </section>
  );
}
