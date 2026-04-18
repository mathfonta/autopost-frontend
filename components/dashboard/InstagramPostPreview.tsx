"use client";

import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ImageOff } from "lucide-react";
import type { ContentRequest } from "@/lib/types";

interface InstagramPostPreviewProps {
  post: ContentRequest;
  brandName?: string;
}

export function InstagramPostPreview({ post, brandName = "AutoPost" }: InstagramPostPreviewProps) {
  const [imgError, setImgError] = useState(false);
  const [captionExpanded, setCaptionExpanded] = useState(false);

  const imageUrl = post.design_result?.processed_photo_url ?? post.photo_url;
  const caption = post.copy_result?.caption ?? "";
  const hashtags = post.copy_result?.hashtags ?? [];
  const cta = post.copy_result?.cta ?? "";
  const isLong = caption.length > 100;

  const displayCaption = !captionExpanded && isLong ? caption.slice(0, 100) + "…" : caption;

  return (
    <div className="max-w-[375px] mx-auto border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Header estilo Instagram */}
      <div className="flex items-center gap-3 p-3 border-b border-gray-100">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900 truncate">{brandName}</p>
          <p className="text-xs text-gray-400">Agora</p>
        </div>
        <MoreHorizontal className="w-5 h-5 text-gray-500" />
      </div>

      {/* Imagem quadrada */}
      <div className="aspect-square w-full bg-gray-100">
        {!imgError ? (
          <img
            src={imageUrl}
            alt="Post"
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
            <ImageOff className="h-12 w-12" />
            <span className="text-sm text-gray-400">Imagem processada</span>
          </div>
        )}
      </div>

      {/* Ações estilo Instagram */}
      <div className="flex items-center p-3">
        <div className="flex gap-4 flex-1">
          <Heart className="w-6 h-6 text-gray-800" />
          <MessageCircle className="w-6 h-6 text-gray-800" />
          <Send className="w-6 h-6 text-gray-800" />
        </div>
        <Bookmark className="w-6 h-6 text-gray-800" />
      </div>

      {/* Legenda */}
      {(caption || hashtags.length > 0) && (
        <div className="px-3 pb-4 text-sm space-y-1">
          {caption && (
            <p className="text-gray-900 leading-snug">
              <span className="font-semibold mr-1">{brandName}</span>
              {displayCaption}
              {isLong && (
                <button
                  onClick={() => setCaptionExpanded(!captionExpanded)}
                  className="text-gray-400 ml-1 hover:text-gray-600"
                >
                  {captionExpanded ? "menos" : "mais"}
                </button>
              )}
            </p>
          )}
          {cta && (
            <p className="text-gray-700 font-medium">{cta}</p>
          )}
          {hashtags.length > 0 && (
            <p className="text-blue-500 leading-relaxed">
              {hashtags.map((h) => `#${h}`).join(" ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
