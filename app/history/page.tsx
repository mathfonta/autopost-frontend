"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Heart, MessageCircle, RefreshCw } from "lucide-react";
import { getContentRequests, retryContentRequest } from "@/lib/api";
import { POST_TYPES, POST_TYPE_MAP } from "@/lib/post-types";
import type { ContentRequest, ContentStatus } from "@/lib/types";
import type { PostTypeId } from "@/lib/post-types";

const ACCENT = "#2354E8";

type StatusFilter = "all" | "published" | "failed";

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all",       label: "Todos" },
  { id: "published", label: "Publicados" },
  { id: "failed",    label: "Falharam" },
];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
  });
}

export default function HistoryPage() {
  const router = useRouter();
  const [posts, setPosts]           = useState<ContentRequest[]>([]);
  const [loading, setLoading]       = useState(true);
  const [statusFilter, setStatus]   = useState<StatusFilter>("all");
  const [typeFilter, setType]       = useState<PostTypeId | null>(null);
  const [retrying, setRetrying]     = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      // Busca até 100 posts para cálculo de stats e filtros client-side
      const data = await getContentRequests(1);
      setPosts(data.items);
    } catch {
      // silencioso
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function handleRetry(id: string) {
    setRetrying(id);
    try {
      await retryContentRequest(id);
      await fetchAll();
    } catch {
      // silencioso
    } finally {
      setRetrying(null);
    }
  }

  // Filtros
  const filtered = posts.filter((p) => {
    if (statusFilter === "published" && p.status !== "published") return false;
    if (statusFilter === "failed"    && p.status !== "failed")    return false;
    if (statusFilter === "all" && p.status !== "published" && p.status !== "failed") return false;
    if (typeFilter !== null && p.content_type !== typeFilter) return false;
    return true;
  });

  // Stats
  const publishedList  = posts.filter((p) => p.status === "published");
  const totalPublished = publishedList.length;
  const totalLikes     = publishedList.reduce((acc, p) => {
    const m = p.publish_result?.metrics as Record<string, number> | undefined;
    return acc + (m?.likes ?? 0);
  }, 0);
  const totalAttempts  = posts.filter((p) => p.status === "published" || p.status === "failed").length;
  const successRate    = totalAttempts > 0 ? Math.round((totalPublished / totalAttempts) * 100) : 0;

  const stats = [
    { label: "Publicados",     value: totalPublished,    icon: "✅" },
    { label: "Curtidas",       value: totalLikes,         icon: "❤️" },
    { label: "Taxa de sucesso", value: `${successRate}%`, icon: "📈" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-(--bg-shell)">
      {/* TopBar */}
      <header className="sticky top-0 z-10 flex h-13.5 shrink-0 items-center border-b border-(--border) bg-(--bg-card) px-4">
        <button
          onClick={() => router.back()}
          className="tap flex h-9 w-9 shrink-0 items-center justify-center rounded-icon bg-(--bg-input) text-(--text-1)"
          aria-label="Voltar"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>
        <h1 className="flex-1 text-center text-[17px] font-extrabold tracking-tight text-(--text-1)">
          Histórico
        </h1>
        <div className="w-9 shrink-0">
          <span className="text-[12px] font-medium text-(--text-3)">
            {new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
          </span>
        </div>
      </header>

      <div className="overflow-y-auto px-4 pb-8 pt-4">

        {/* Stats */}
        <div className="mb-5 grid grid-cols-3 gap-2">
          {stats.map((s, i) => (
            <div
              key={i}
              className="rounded-[14px] border border-(--border) bg-(--bg-card) p-3 text-center shadow-sm"
            >
              <p className="mb-1 text-lg">{s.icon}</p>
              <p className="text-[17px] font-extrabold text-(--text-1)">{s.value}</p>
              <p className="mt-0.5 text-[10px] font-semibold text-(--text-3)">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Chips de status */}
        <div className="mb-3 flex gap-[7px] overflow-x-auto pb-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setStatus(f.id)}
              className="tap shrink-0 rounded-full px-[14px] py-[7px] text-[12px] font-bold transition-all duration-120"
              style={{
                background: statusFilter === f.id ? ACCENT : "var(--bg-card)",
                color:      statusFilter === f.id ? "#fff"  : "var(--text-2)",
                border:     statusFilter === f.id ? "none"  : "1.5px solid var(--border)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Chips de tipo */}
        <div className="mb-5 flex gap-[6px] overflow-x-auto pb-1">
          <button
            onClick={() => setType(null)}
            className="tap shrink-0 rounded-full px-[10px] py-[5px] text-[11px] font-semibold transition-all duration-120"
            style={{
              background: typeFilter === null ? "var(--text-1)" : "var(--bg-card)",
              color:      typeFilter === null ? "var(--bg-card)" : "var(--text-3)",
              border:     typeFilter === null ? "none" : "1px solid var(--border)",
            }}
          >
            Todos tipos
          </button>
          {POST_TYPES.map((pt) => (
            <button
              key={pt.id}
              onClick={() => setType(typeFilter === pt.id ? null : pt.id)}
              className="tap shrink-0 rounded-full px-[10px] py-[5px] text-[11px] font-semibold transition-all duration-120"
              style={{
                background: typeFilter === pt.id ? pt.bg    : "var(--bg-card)",
                color:      typeFilter === pt.id ? pt.color : "var(--text-3)",
                border:     typeFilter === pt.id ? "none"   : "1px solid var(--border)",
              }}
            >
              {pt.label}
            </button>
          ))}
        </div>

        {/* Lista de posts */}
        {loading ? (
          <div className="flex flex-col gap-[10px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-[72px] animate-pulse rounded-[14px] bg-(--bg-card)" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center">
            <p className="mb-2 text-[32px]">🔍</p>
            <p className="text-[14px] font-bold text-(--text-3)">Nenhum resultado</p>
          </div>
        ) : (
          <div className="flex flex-col gap-[10px]">
            {filtered.map((post) => {
              const pt      = post.content_type ? POST_TYPE_MAP[post.content_type as PostTypeId] : null;
              const pub     = post.status === "published";
              const imageUrl = post.design_result?.processed_photo_url ?? post.photo_url;
              const metrics  = post.publish_result?.metrics as Record<string, number> | undefined;

              return (
                <div
                  key={post.id}
                  className="flex overflow-hidden rounded-[14px] border border-(--border) bg-(--bg-card) shadow-sm"
                >
                  {/* Thumbnail */}
                  <div className="w-[72px] shrink-0">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt=""
                        className="block h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-(--bg-input) text-[9px] font-semibold text-(--text-4)">
                        Sem foto
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1 p-[11px_13px]">
                    <div className="mb-[5px] flex items-center justify-between gap-2">
                      {/* Chip de tipo */}
                      {pt ? (
                        <div className="flex items-center gap-[5px]">
                          <div
                            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px]"
                            style={{ background: pt.bg, color: pt.color }}
                          >
                            <div className="h-[9px] w-[9px]">{pt.icon}</div>
                          </div>
                          <span className="text-[11px] font-bold" style={{ color: pt.color }}>
                            {pt.label}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] font-semibold text-(--text-3)">—</span>
                      )}

                      {/* Badge status */}
                      <div
                        className={`flex items-center gap-1 rounded-full px-2 py-[2px] ${
                          pub ? "bg-[#DCFCE7]" : "bg-red-100"
                        }`}
                      >
                        <div className={`h-[5px] w-[5px] rounded-full ${pub ? "bg-[#16A34A]" : "bg-red-500"}`} />
                        <span className={`text-[10px] font-bold ${pub ? "text-[#15803D]" : "text-red-600"}`}>
                          {pub ? "Publicado" : "Falhou"}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] font-medium text-(--text-3)">
                      {post.created_at ? formatDate(post.created_at) : "—"}
                    </p>

                    {pub && metrics && (
                      <div className="mt-[7px] flex gap-3">
                        {metrics.likes !== undefined && (
                          <div className="flex items-center gap-[3px]">
                            <Heart size={11} className="text-red-400" fill="currentColor" strokeWidth={0} />
                            <span className="text-[11px] font-bold text-(--text-2)">{metrics.likes}</span>
                          </div>
                        )}
                        {metrics.comments !== undefined && (
                          <div className="flex items-center gap-[3px] text-(--text-3)">
                            <MessageCircle size={11} />
                            <span className="text-[11px] font-bold text-(--text-2)">{metrics.comments}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {!pub && (
                      <button
                        onClick={() => handleRetry(post.id)}
                        disabled={retrying === post.id}
                        className="mt-[7px] flex items-center gap-1 rounded-[8px] px-[10px] py-1 text-[10px] font-bold text-white disabled:opacity-50"
                        style={{ background: ACCENT }}
                      >
                        <RefreshCw size={10} className={retrying === post.id ? "animate-spin" : ""} />
                        {retrying === post.id ? "Aguarde..." : "Tentar novamente"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
