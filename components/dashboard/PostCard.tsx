"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ExternalLink, ImageOff, Play, Trash2, X } from "lucide-react";
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
  const [carouselIndex, setCarouselIndex] = useState<number | null>(null);

  const caption = editedCaption ?? getCaption(post);
  const permalink = getPermalink(post);
  const isAwaitingApproval = post.status === "awaiting_approval";
  const isFailed = post.status === "failed";
  const isRejected = post.status === "rejected";
  const isVideo = post.content_type === "reels" || post.content_type === "story";
  const imageUrl = post.design_result?.processed_photo_url ?? post.photo_url;
  const hasMultiplePhotos = (post.photo_urls?.length ?? 0) > 1;

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
        onClick={
          hasMultiplePhotos
            ? () => setCarouselIndex(0)
            : onOpen ?? (() => router.push(`/posts/${post.id}`))
        }
        title={hasMultiplePhotos ? "Ver todas as fotos" : onOpen ? "Revisar post" : "Ver preview completo"}
      >
        {isVideo ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gray-900">
            <Play className="h-10 w-10 text-white opacity-80" fill="white" />
            <span className="text-xs text-gray-300 font-medium capitalize">{post.content_type}</span>
          </div>
        ) : hasMultiplePhotos ? (
          <MultiPhotoStrip urls={post.photo_urls as string[]} />
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

      {hasMultiplePhotos && carouselIndex !== null && (
        <PhotoCarouselModal
          urls={post.photo_urls as string[]}
          startIndex={carouselIndex}
          onClose={() => setCarouselIndex(null)}
        />
      )}

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
              contentType={post.content_type}
              suggestedTime={post.copy_result?.suggested_time}
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

function MultiPhotoStrip({ urls }: { urls: string[] }) {
  const visible = urls.slice(0, 3);
  const remaining = urls.length - visible.length;

  return (
    <div className="w-full h-full grid grid-cols-3 gap-0.5">
      {visible.map((url, i) => {
        const isLast = i === visible.length - 1;
        return (
          <div key={i} className="relative bg-gray-100 overflow-hidden">
            <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
            {isLast && remaining > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="text-white text-sm font-bold">+{remaining}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function PhotoCarouselModal({
  urls,
  startIndex,
  onClose,
}: {
  urls: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((i) => (i - 1 + urls.length) % urls.length);
  };
  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((i) => (i + 1) % urls.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white"
        aria-label="Fechar"
      >
        <X className="h-7 w-7" />
      </button>

      <span className="absolute top-4 left-4 text-white/80 text-sm font-medium">
        {index + 1} / {urls.length}
      </span>

      {urls.length > 1 && (
        <button
          onClick={goPrev}
          className="absolute left-2 text-white/80 hover:text-white p-2"
          aria-label="Foto anterior"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
      )}

      <img
        src={urls[index]}
        alt={`Foto ${index + 1} de ${urls.length}`}
        className="max-h-[85vh] max-w-[90vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {urls.length > 1 && (
        <button
          onClick={goNext}
          className="absolute right-2 text-white/80 hover:text-white p-2"
          aria-label="Próxima foto"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      )}
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
