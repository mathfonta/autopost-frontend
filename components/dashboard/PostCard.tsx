"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, ImageOff } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { ApprovalButtons } from "./ApprovalButtons";
import { CaptionEditor } from "./CaptionEditor";
import { CaptionVariantSelector } from "./CaptionVariantSelector";
import { INTENT_LABELS } from "./IntentMenu";
import type { ContentRequest } from "@/lib/types";

interface PostCardProps {
  post: ContentRequest;
  onAction: () => void;
}

function getCaption(post: ContentRequest): string {
  return post.copy_result?.caption ?? "";
}

function getPermalink(post: ContentRequest): string | null {
  return post.publish_result?.permalink ?? null;
}

export function PostCard({ post, onAction }: PostCardProps) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const [editedCaption, setEditedCaption] = useState<string | null>(null);
  const [captionEdited, setCaptionEdited] = useState(post.caption_edited);

  const caption = editedCaption ?? getCaption(post);
  const permalink = getPermalink(post);
  const isAwaitingApproval = post.status === "awaiting_approval";
  const imageUrl = post.design_result?.processed_photo_url ?? post.photo_url;

  const handleCaptionSave = (newCaption: string) => {
    setEditedCaption(newCaption);
    setCaptionEdited(true);
  };

  return (
    <div className={`rounded-2xl bg-white shadow-sm overflow-hidden border ${isAwaitingApproval ? "border-yellow-300 ring-2 ring-yellow-200" : "border-gray-100"}`}>
      {/* Imagem — clicável para abrir preview */}
      <div
        className="relative aspect-square bg-gray-100 cursor-pointer"
        onClick={() => router.push(`/posts/${post.id}`)}
        title="Ver preview completo"
      >
        {!imgError ? (
          <img
            src={imageUrl}
            alt="Post"
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
            <ImageOff className="h-10 w-10" />
            <span className="text-xs text-gray-400">Imagem processada</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <StatusBadge status={post.status} />
        </div>
      </div>

      {/* Conteúdo — completo apenas para aprovação pendente */}
      {isAwaitingApproval ? (
        <div className="p-3">
          {post.content_type && INTENT_LABELS[post.content_type] && (
            <p className="text-xs text-blue-500 font-medium mb-1">
              {INTENT_LABELS[post.content_type]}
            </p>
          )}
          {caption && (
            <div className="mb-2">
              {post.caption_long ? (
                <CaptionVariantSelector
                  post={post}
                  onVariantSelected={(text) => setEditedCaption(text)}
                />
              ) : (
                <CaptionEditor
                  postId={post.id}
                  caption={caption}
                  captionEdited={captionEdited}
                  onSave={handleCaptionSave}
                />
              )}
            </div>
          )}
          <ApprovalButtons
            postId={post.id}
            retryCount={post.retry_count}
            captionOverride={editedCaption}
            onAction={onAction}
          />
        </div>
      ) : (
        /* Posts não-pendentes: linha mínima com link ou status */
        <div className="px-3 py-2 flex items-center gap-2 min-h-[2rem]">
          {post.status === "published" && permalink ? (
            <a
              href={permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              <ExternalLink className="h-3 w-3" />
              Ver no Instagram
            </a>
          ) : post.status === "failed" ? (
            <p className="text-xs text-red-400 italic truncate">
              {post.error_message ?? "Falha no processamento"}
            </p>
          ) : post.status === "rejected" ? (
            <p className="text-xs text-orange-500 italic truncate">
              {post.error_message ? `Rejeitado: ${post.error_message}` : "Rejeitado"}
            </p>
          ) : (
            <p className="text-xs text-gray-400 italic">Gerando conteúdo…</p>
          )}
        </div>
      )}
    </div>
  );
}
