"use client";

import { POST_TYPES, type PostTypeId } from "@/lib/post-types";
import { PostTypeCard, PostTypeRow } from "./PostTypeCard";

interface ContentTypeBarProps {
  onTypeSelected: (typeId: PostTypeId) => void;
  uploading?:     boolean;
  uploadingType?: PostTypeId | null;
  layout?:        "grid" | "list";
}

export function ContentTypeBar({
  onTypeSelected,
  uploading,
  uploadingType,
  layout = "grid",
}: ContentTypeBarProps) {
  return (
    <div className="rounded-2xl border border-(--border) bg-(--bg-card) mb-6 overflow-hidden shadow-sm">
      <div className="px-4 pt-4 pb-3">
        <p className="text-[17px] font-extrabold tracking-tight text-(--text-1)">
          O que vamos postar hoje?
        </p>
      </div>

      <div className="px-3 pb-3">
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
      </div>
    </div>
  );
}
