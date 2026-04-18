"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, History } from "lucide-react";
import { HistoryPostCard } from "@/components/history/HistoryPostCard";
import { getContentRequests } from "@/lib/api";
import type { ContentRequest } from "@/lib/types";

const PAGE_SIZE = 20;

export default function HistoryPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<ContentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchHistory = useCallback(async (pageNum: number, append = false) => {
    try {
      const data = await getContentRequests(pageNum);
      const published = data.items.filter((p) => p.status === "published");
      setPosts((prev) => append ? [...prev, ...published] : published);
      setTotal(data.total);
      setHasMore(pageNum < data.pages);
    } catch {
      // silencioso — usuário pode recarregar
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory(1);
  }, [fetchHistory]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setLoadingMore(true);
    fetchHistory(nextPage, true);
  };

  const publishedTotal = posts.length;

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
        <div className="flex-1">
          <h1 className="font-semibold text-gray-900 text-sm">Histórico de Posts</h1>
          {!loading && (
            <p className="text-xs text-gray-400">{publishedTotal} post{publishedTotal !== 1 ? "s" : ""} publicado{publishedTotal !== 1 ? "s" : ""}</p>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <History className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-base font-semibold text-gray-700 mb-1">Nenhum post publicado ainda</h2>
            <p className="text-sm text-gray-400 max-w-xs">
              Os posts publicados aparecerão aqui com suas métricas.
            </p>
          </div>
        )}

        {/* Grid de posts */}
        {posts.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {posts.map((post) => (
                <HistoryPostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="mt-6 text-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-6 py-2.5 text-sm font-medium text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 disabled:opacity-50 transition-colors"
                >
                  {loadingMore ? "Carregando..." : "Carregar mais"}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
