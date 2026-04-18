"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, ImageOff } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { ApprovalButtons } from "./ApprovalButtons";
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
  const [expanded, setExpanded] = useState(false);

  const caption = getCaption(post);
  const permalink = getPermalink(post);
  const isAwaitingApproval = post.status === "awaiting_approval";
  const imageUrl = post.design_result?.processed_photo_url ?? post.photo_url;
  const isLong = caption.length > 120;

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

      {/* Conteúdo */}
      <div className="p-3">
        {/* Legenda */}
        {caption ? (
          <div className="mb-2">
            <p className={`text-sm text-gray-700 ${!expanded && isLong ? "line-clamp-3" : ""}`}>
              {caption}
            </p>
            {isLong && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-blue-500 hover:text-blue-700 mt-1 font-medium"
              >
                {expanded ? "Ver menos" : "Ver mais"}
              </button>
            )}
          </div>
        ) : (
          post.status !== "published" && (
            <p className="text-xs text-gray-400 italic mb-2">Gerando conteúdo...</p>
          )
        )}

        {/* Link Instagram */}
        {post.status === "published" && permalink && (
          <a
            href={permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 mb-2"
          >
            <ExternalLink className="h-3 w-3" />
            Ver no Instagram
          </a>
        )}

        {/* Botões de aprovação */}
        {isAwaitingApproval && (
          <ApprovalButtons postId={post.id} onAction={onAction} />
        )}
      </div>
    </div>
  );
}
