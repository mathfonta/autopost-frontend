"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { InstagramPostPreview } from "@/components/dashboard/InstagramPostPreview";
import { ApprovalButtons } from "@/components/dashboard/ApprovalButtons";
import { PostMetrics } from "@/components/dashboard/PostMetrics";
import { SkeletonPostCard } from "@/components/dashboard/SkeletonPostCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { getContentRequest } from "@/lib/api";
import type { ContentRequest } from "@/lib/types";

export default function PostPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [post, setPost] = useState<ContentRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    try {
      const data = await getContentRequest(id);
      setPost(data);
      setError(null);
    } catch {
      setError("Não foi possível carregar o post.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
    // Polling só se post ainda não foi publicado/falhou
    const interval = setInterval(async () => {
      if (post && (post.status === "published" || post.status === "failed")) return;
      try {
        const data = await getContentRequest(id);
        setPost(data);
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const permalink = post?.publish_result?.permalink ?? null;
  const isAwaitingApproval = post?.status === "awaiting_approval";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-1 -ml-1 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="font-semibold text-gray-900 text-sm">Preview do Post</h1>
        {post && (
          <div className="ml-auto">
            <StatusBadge status={post.status} />
          </div>
        )}
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto space-y-6">
        {loading && <SkeletonPostCard />}

        {error && (
          <div className="text-center py-12 text-gray-500">
            <p>{error}</p>
            <button
              onClick={fetchPost}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {post && (
          <>
            <InstagramPostPreview post={post} />

            {/* Botões de aprovação */}
            {isAwaitingApproval && (
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500 mb-3 text-center">
                  Como ficou? Aprove para publicar ou rejeite para refazer.
                </p>
                <ApprovalButtons postId={post.id} onAction={fetchPost} />
              </div>
            )}

            {/* Link Instagram */}
            {post.status === "published" && permalink && (
              <a
                href={permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-medium text-sm hover:opacity-90 transition-opacity"
              >
                <ExternalLink className="w-4 h-4" />
                Ver no Instagram
              </a>
            )}

            {/* Métricas */}
            {post.status === "published" && <PostMetrics post={post} />}
          </>
        )}
      </main>
    </div>
  );
}
