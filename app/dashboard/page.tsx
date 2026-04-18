"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Camera, LogOut, History } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useContentRequests } from "@/hooks/useContentRequests";
import { PostCard } from "@/components/dashboard/PostCard";
import { getOnboardingStatus, getMetaStatus } from "@/lib/api";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { posts, error, loading, refresh } = useContentRequests();

  // Redireciona para onboarding apenas se nem onboarding concluído nem Instagram conectado
  useEffect(() => {
    Promise.all([
      getOnboardingStatus().catch(() => ({ status: "unknown" })),
      getMetaStatus().catch(() => ({ connected: false })),
    ]).then(([onboarding, meta]) => {
      if (onboarding.status !== "done" && !meta.connected) {
        router.replace("/onboarding");
      }
    });
  }, [router]);

  const pendingPosts = posts.filter((p) => p.status === "awaiting_approval");
  const otherPosts = posts.filter((p) => p.status !== "awaiting_approval");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gray-900">AutoPost</h1>
            {user?.company_name && (
              <p className="text-xs text-gray-500">{user.company_name}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/history")}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              <History className="h-4 w-4" />
              Histórico
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* Erro */}
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading inicial */}
        {loading && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500 mb-3" />
            <p className="text-sm">Carregando posts...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && posts.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Camera className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-base font-semibold text-gray-700 mb-1">Nenhum post ainda</h2>
            <p className="text-sm text-gray-400 max-w-xs">
              Envie sua primeira foto via API e ela aparecerá aqui para aprovação.
            </p>
          </div>
        )}

        {/* Aguardando aprovação — destaque */}
        {pendingPosts.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
              <h2 className="text-sm font-semibold text-gray-700">
                Aguardando aprovação ({pendingPosts.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pendingPosts.map((post) => (
                <PostCard key={post.id} post={post} onAction={refresh} />
              ))}
            </div>
          </section>
        )}

        {/* Outros posts */}
        {otherPosts.length > 0 && (
          <section>
            {pendingPosts.length > 0 && (
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Recentes</h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otherPosts.map((post) => (
                <PostCard key={post.id} post={post} onAction={refresh} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* FAB — Nova Foto (placeholder v1.1) */}
      <div className="fixed bottom-6 right-6">
        <button
          className="h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center"
          title="Nova Foto (em breve)"
          onClick={() => alert("Upload de foto estará disponível em breve!")}
        >
          <Camera className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
