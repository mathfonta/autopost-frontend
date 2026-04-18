"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Eye, MessageCircle, ExternalLink, ImageOff, Users } from "lucide-react";
import { MetricsBadge } from "./MetricsBadge";
import type { ContentRequest } from "@/lib/types";

interface HistoryPostCardProps {
  post: ContentRequest;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function HistoryPostCard({ post }: HistoryPostCardProps) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);

  const imageUrl = post.design_result?.processed_photo_url ?? post.photo_url;
  const permalink = post.publish_result?.permalink ?? null;
  const metrics = post.publish_result?.metrics as Record<string, number> | undefined;
  const hasMetrics = metrics && Object.keys(metrics).length > 0;
  const caption = post.copy_result?.caption ?? "";

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => router.push(`/posts/${post.id}`)}
    >
      {/* Thumbnail */}
      <div className="aspect-square bg-gray-100 relative">
        {!imgError ? (
          <img
            src={imageUrl}
            alt="Post"
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="w-8 h-8 text-gray-300" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        {/* Data */}
        <p className="text-xs text-gray-400">
          {post.created_at ? formatDate(post.created_at) : "—"}
        </p>

        {/* Caption preview */}
        {caption && (
          <p className="text-xs text-gray-600 line-clamp-2 leading-snug">{caption}</p>
        )}

        {/* Métricas */}
        {hasMetrics ? (
          <div className="flex items-center gap-3 pt-1">
            {metrics.likes !== undefined && (
              <MetricsBadge icon={Heart} value={metrics.likes} label="Curtidas" />
            )}
            {metrics.impressions !== undefined && (
              <MetricsBadge icon={Eye} value={metrics.impressions} label="Impressões" />
            )}
            {metrics.reach !== undefined && (
              <MetricsBadge icon={Users} value={metrics.reach} label="Alcance" />
            )}
            {metrics.comments !== undefined && (
              <MetricsBadge icon={MessageCircle} value={metrics.comments} label="Comentários" />
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-300 italic">Métricas disponíveis em breve</p>
        )}

        {/* Link Instagram */}
        {permalink && (
          <a
            href={permalink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 font-medium"
          >
            <ExternalLink className="w-3 h-3" />
            Ver no Instagram
          </a>
        )}
      </div>
    </div>
  );
}
