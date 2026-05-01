"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, ImageOff, Play, Trash2 } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { ApprovalButtons } from "./ApprovalButtons";
import { CaptionEditor } from "./CaptionEditor";
import { CaptionVariantSelector } from "./CaptionVariantSelector";
import { POST_TYPE_MAP } from "@/lib/post-types";
import { deleteContentRequest } from "@/lib/api";
import { getErrorInfo } from "@/lib/errorMessages";
import type { ContentRequest } from "@/lib/types";

interface PostCardProps {
  post:     ContentRequest;
  onAction: () => void;
  onOpen?:  () => void;
}

function getCaption(post: ContentRequest): string {
  return post.copy_result?.caption ?? "";
}

function getPermalink(post: ContentRequest): string | null {
  return post.publish_result?.permalink ?? null;
}

function DeleteButton({ postId, onDeleted }: { postId: string; onDeleted: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteContentRequest(postId);
      onDeleted();
    } catch {
      setDeleting(false);
      setConfirming(false);
    }
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Excluir?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
        >
          {deleting ? "Excluindo…" : "Sim"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          Não
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
      title="Excluir post"
    >
      <Trash2 className="h-3 w-3" />
      Excluir
    </button>
  );
}

export function PostCard({ post, onAction, onOpen }: PostCardProps) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const [editedCaption, setEditedCaption] = useState<string | null>(null);
  const [captionEdited, setCaptionEdited] = useState(post.caption_edited);

  const caption = editedCaption ?? getCaption(post);
  const permalink = getPermalink(post);
  const isAwaitingApproval = post.status === "awaiting_approval";
  const isFailed = post.status === "failed";
  const isRejected = post.status === "rejected";
  const isVideo = post.content_type === "reels" || post.content_type === "story";
  const imageUrl = post.design_result?.processed_photo_url ?? post.photo_url;

  const handleCaptionSave = (newCaption: string) => {
    setEditedCaption(newCaption);
    setCaptionEdited(true);
  };

  const borderClass = isAwaitingApproval
    ? "border-yellow-300 ring-2 ring-yellow-200"
    : isFailed
    ? "border-red-200"
    : "border-gray-100";

  return (
    <div className={`rounded-2xl bg-white shadow-sm overflow-hidden border ${borderClass}`}>
      {/* Imagem */}
      <div
        className="relative aspect-square bg-gray-100 cursor-pointer"
        onClick={onOpen ?? (() => router.push(`/posts/${post.id}`))}
        title={onOpen ? "Revisar post" : "Ver preview completo"}
      >
        {isVideo ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gray-900">
            <Play className="h-10 w-10 text-white opacity-80" fill="white" />
            <span className="text-xs text-gray-300 font-medium capitalize">{post.content_type}</span>
          </div>
        ) : !imgError ? (
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

      {/* Conteúdo */}
      {isAwaitingApproval ? (
        onOpen ? (
          /* Modo compacto: card no dashboard — toque abre ApprovalScreen */
          <div
            className="flex items-center justify-between px-3 py-2.5 cursor-pointer"
            onClick={onOpen}
          >
            <div>
              {post.content_type && POST_TYPE_MAP[post.content_type as keyof typeof POST_TYPE_MAP] && (
                <p className="text-xs font-semibold text-blue-500">
                  {POST_TYPE_MAP[post.content_type as keyof typeof POST_TYPE_MAP].label}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-0.5">Toque para revisar</p>
            </div>
            <span className="text-gray-300 text-lg">›</span>
          </div>
        ) : (
          /* Modo expandido: fora do dashboard (página de detalhe) */
          <div className="p-3">
            {post.content_type && POST_TYPE_MAP[post.content_type as keyof typeof POST_TYPE_MAP] && (
              <p className="text-xs text-blue-500 font-medium mb-1">
                {POST_TYPE_MAP[post.content_type as keyof typeof POST_TYPE_MAP].label}
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
        )
      ) : isFailed ? (
        /* Card de falha: erro amigável + botão excluir */
        <FailedCard post={post} onDeleted={onAction} />
      ) : isRejected ? (
        /* Card rejeitado: motivo + botão excluir */
        <RejectedCard post={post} onDeleted={onAction} />
      ) : post.status === "published" ? (
        <div className="px-3 py-2">
          {permalink && (
            <a
              href={permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              <ExternalLink className="h-3 w-3" />
              Ver no Instagram
            </a>
          )}
        </div>
      ) : (
        <div className="px-3 py-2">
          <p className="text-xs text-gray-400 italic">Gerando conteúdo…</p>
        </div>
      )}
    </div>
  );
}

function FailedCard({ post, onDeleted }: { post: ContentRequest; onDeleted: () => void }) {
  const { message, hint } = getErrorInfo(post);

  return (
    <div className="p-3 space-y-2">
      <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2">
        <p className="text-xs font-semibold text-red-700">{message}</p>
        <p className="text-xs text-red-500 mt-0.5">{hint}</p>
      </div>
      <div className="flex justify-end">
        <DeleteButton postId={post.id} onDeleted={onDeleted} />
      </div>
    </div>
  );
}

function RejectedCard({ post, onDeleted }: { post: ContentRequest; onDeleted: () => void }) {
  return (
    <div className="p-3 space-y-2">
      {post.error_message && (
        <div className="rounded-lg bg-orange-50 border border-orange-100 px-3 py-2">
          <p className="text-xs font-semibold text-orange-700">Descartado</p>
          <p className="text-xs text-orange-500 mt-0.5">{post.error_message}</p>
        </div>
      )}
      <div className="flex justify-end">
        <DeleteButton postId={post.id} onDeleted={onDeleted} />
      </div>
    </div>
  );
}
