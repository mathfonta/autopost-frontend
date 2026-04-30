"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, LogOut, History, Zap, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useContentRequests } from "@/hooks/useContentRequests";
import { PostCard } from "@/components/dashboard/PostCard";
import { ContentTypeBar } from "@/components/dashboard/ContentTypeBar";
import { StreakBar } from "@/components/dashboard/StreakBar";
import { UploadScreen } from "@/components/dashboard/UploadScreen";
import { PhotoPreview } from "@/components/dashboard/PhotoPreview";
import { ContextModal } from "@/components/dashboard/ContextModal";
import { MetaTokenWarning } from "@/components/dashboard/MetaTokenWarning";
import { SubStrategySelector } from "@/components/dashboard/SubStrategySelector";
import { GeneratingScreen } from "@/components/dashboard/GeneratingScreen";
import { POST_TYPE_MAP } from "@/lib/post-types";
import { api, getMetaStatus, retryContentRequest, type MetaStatus } from "@/lib/api";
import type { PostTypeId } from "@/lib/post-types";
import type { ContentRequest, VoiceTone } from "@/lib/types";

type Screen = "dashboard" | "strategy" | "upload" | "preview" | "generating";

const ACCENT = "#2354E8";

// Mock streak — substituir quando /api/streak existir
const STREAK_MOCK = {
  streak:   3,
  weekDays: [true, true, true, false, false, false, false],
  weekGoal: 5,
};

export default function DashboardPage() {
  const { user, logout, refresh: refreshUser } = useAuth();
  const router = useRouter();
  const { posts, error, loading, refresh } = useContentRequests();
  const [metaStatus, setMetaStatus] = useState<MetaStatus | null>(null);

  const [screen,        setScreen]        = useState<Screen>("dashboard");
  const [postTypeId,    setPostTypeId]    = useState<PostTypeId | null>(null);
  const [strategyId,    setStrategyId]    = useState<string | null>(null);
  const [pendingFile,   setPendingFile]   = useState<File | null>(null);
  const [pendingFiles,  setPendingFiles]  = useState<File[]>([]);
  const [photoUrl,      setPhotoUrl]      = useState<string | null>(null);

  const [contextOpen,   setContextOpen]   = useState(false);
  const [uploading,     setUploading]     = useState(false);
  const [uploadingType, setUploadingType] = useState<PostTypeId | null>(null);
  const [uploadError,   setUploadError]   = useState<string | null>(null);
  const [generatingId,  setGeneratingId]  = useState<string | null>(null);

  useEffect(() => {
    getMetaStatus().then(setMetaStatus).catch(() => null);
  }, []);

  function handleTypeSelected(id: PostTypeId) {
    setPostTypeId(id);
    setStrategyId(null);
    setScreen("strategy");
  }

  function handleStrategySelected(id: string) {
    setStrategyId(id);
    setScreen("upload");
  }

  function handleStrategyBack() {
    setScreen("dashboard");
    setPostTypeId(null);
    setStrategyId(null);
  }

  function handlePhotoSelected(file: File, url: string) {
    setPendingFile(file);
    setPhotoUrl(url);
    // vídeos saltam o PhotoPreview (que renderiza <img>) e vão direto ao contexto
    if (file.type.startsWith("video/")) {
      setScreen("dashboard");
      setContextOpen(true);
    } else {
      setScreen("preview");
    }
  }

  function handlePhotosSelected(files: File[]) {
    setPendingFiles(files);
    const url = URL.createObjectURL(files[0]);
    setPhotoUrl(url);
    setScreen("dashboard");
    setContextOpen(true);
  }

  function handlePreviewConfirm() {
    setScreen("dashboard");
    setContextOpen(true);
  }

  function handlePreviewBack() {
    setScreen("upload");
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(null);
    setPendingFile(null);
  }

  function handleUploadBack() {
    setScreen("strategy");
    setStrategyId(null);
  }

  async function uploadFile(
    files: File | File[],
    intent: PostTypeId | null,
    context: string | null,
  ) {
    setUploadError(null);
    setUploading(true);
    setUploadingType(intent);
    try {
      const formData = new FormData();
      if (intent === "carousel") {
        (files as File[]).forEach(f => formData.append("photos", f));
      } else {
        formData.append("photo", Array.isArray(files) ? files[0] : files);
      }
      if (intent)           formData.append("content_type", intent);
      if (strategyId)       formData.append("strategy", strategyId);
      if (context?.trim())  formData.append("user_context", context.trim());
      const { data } = await api.post<{ id: string }>("/content-requests", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      cleanupPhoto();
      setGeneratingId(data.id);
      setScreen("generating");
    } catch {
      setUploadError("Erro ao enviar. Tente novamente.");
      cleanupPhoto();
    } finally {
      setUploading(false);
      setUploadingType(null);
    }
  }

  function handleGeneratingDone(_post: ContentRequest) {
    setGeneratingId(null);
    setScreen("dashboard");
    refresh();
  }

  function handleGeneratingError() {
    setGeneratingId(null);
    setScreen("dashboard");
    refresh();
  }

  function handleGeneratingCancel() {
    setGeneratingId(null);
    setScreen("dashboard");
    refresh();
  }

  function cleanupPhoto() {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(null);
    setPendingFile(null);
    setPendingFiles([]);
    setPostTypeId(null);
    setStrategyId(null);
  }

  function handleContextConfirm(context: string) {
    setContextOpen(false);
    if (postTypeId === "carousel") {
      if (pendingFiles.length >= 2) uploadFile(pendingFiles, postTypeId, context || null);
    } else if (pendingFile) {
      uploadFile(pendingFile, postTypeId, context || null);
    }
  }

  function handleContextSkip() {
    setContextOpen(false);
    if (postTypeId === "carousel") {
      if (pendingFiles.length >= 2) uploadFile(pendingFiles, postTypeId, null);
    } else if (pendingFile) {
      uploadFile(pendingFile, postTypeId, null);
    }
  }

  function handleContextClose() {
    setContextOpen(false);
    cleanupPhoto();
  }

  async function handleRetry(post: ContentRequest) {
    try {
      await retryContentRequest(post.id);
      refresh();
    } catch {
      // silencioso
    }
  }

  const pendingPosts   = posts.filter((p) => p.status === "awaiting_approval");
  const publishedPosts = posts.filter((p) => p.status === "published");
  const failedPosts    = posts.filter((p) => p.status === "failed");

  // ── Tela Sub-estratégia ───────────────────────────────────────────────────
  if (screen === "strategy" && postTypeId) {
    return (
      <SubStrategySelector
        postTypeId={postTypeId}
        onBack={handleStrategyBack}
        onSelect={handleStrategySelected}
      />
    );
  }

  // ── Tela Geração ─────────────────────────────────────────────────────────
  if (screen === "generating" && generatingId) {
    return (
      <GeneratingScreen
        requestId={generatingId}
        onDone={handleGeneratingDone}
        onError={handleGeneratingError}
        onCancel={handleGeneratingCancel}
      />
    );
  }

  // ── Tela Upload ───────────────────────────────────────────────────────────
  if (screen === "upload" && postTypeId) {
    return (
      <UploadScreen
        postTypeId={postTypeId}
        onBack={handleUploadBack}
        onPhotoSelected={handlePhotoSelected}
        onPhotosSelected={handlePhotosSelected}
      />
    );
  }

  // ── Tela Preview ──────────────────────────────────────────────────────────
  if (screen === "preview" && postTypeId && photoUrl) {
    return (
      <PhotoPreview
        postTypeId={postTypeId}
        photoUrl={photoUrl}
        onBack={handlePreviewBack}
        onConfirm={handlePreviewConfirm}
      />
    );
  }

  // ── Dashboard principal ───────────────────────────────────────────────────
  return (
    <>
      <div className="flex min-h-screen flex-col bg-(--bg-shell)">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-13.5 shrink-0 items-center justify-between border-b border-(--border) bg-(--bg-card) px-5">
          <div className="flex items-center gap-2">
            <div
              className="flex h-6.5 w-6.5 items-center justify-center rounded-[7px] text-white"
              style={{ background: ACCENT }}
            >
              <Zap size={13} fill="white" strokeWidth={0} />
            </div>
            <div>
              <span className="text-[17px] font-extrabold tracking-tight text-(--text-1)">AutoPost</span>
              {user?.company_name && (
                <span className="ml-2 text-xs text-(--text-3)">{user.company_name}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/history")}
              className="tap flex items-center gap-1.5 text-[13px] font-semibold text-(--text-2)"
            >
              <History size={15} /> Histórico
            </button>
            <button
              onClick={logout}
              className="tap flex items-center gap-1.5 text-[13px] font-semibold text-(--text-2)"
            >
              <LogOut size={15} /> Sair
            </button>
          </div>
        </header>

        {/* Conteúdo */}
        <main className="flex flex-col gap-[18px] overflow-y-auto px-4 pb-9 pt-[18px]">

          {/* Streak semanal */}
          <StreakBar data={STREAK_MOCK} />

          {/* Seletor de tipo de conteúdo */}
          <ContentTypeBar
            onTypeSelected={handleTypeSelected}
            uploading={uploading}
            uploadingType={uploadingType}
          />

          {/* Aviso de token Meta */}
          {metaStatus && (
            <MetaTokenWarning
              status={metaStatus}
              onRenewed={() => getMetaStatus().then(setMetaStatus).catch(() => null)}
            />
          )}

          {/* Erros */}
          {(uploadError || error) && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
              {uploadError || error}
            </div>
          )}

          {/* Loading inicial */}
          {loading && posts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-(--text-3)">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-(--border) border-t-blue-500 mb-3" />
              <p className="text-sm">Carregando posts...</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && posts.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 rounded-full bg-(--bg-input) flex items-center justify-center mb-4">
                <Camera className="h-8 w-8 text-(--text-3)" />
              </div>
              <h2 className="text-base font-semibold text-(--text-2) mb-1">Nenhum post ainda</h2>
              <p className="text-sm text-(--text-3) max-w-xs">
                Escolha um tipo de conteúdo acima e envie sua primeira foto.
              </p>
            </div>
          )}

          {/* Aguardando aprovação — PostCard completo com botões */}
          {pendingPosts.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                <h2 className="text-[15px] font-bold text-(--text-2)">
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

          {/* Publicações recentes — galeria compacta */}
          {(publishedPosts.length > 0 || failedPosts.length > 0) && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[17px] font-extrabold tracking-tight text-(--text-1)">
                  Publicações recentes
                </h2>
                <button
                  onClick={() => router.push("/history")}
                  className="tap text-[12px] font-bold"
                  style={{ color: ACCENT }}
                >
                  Ver todas
                </button>
              </div>

              {publishedPosts.length > 0 && (
                <div className="mb-4">
                  <p className="mb-2 text-[10.5px] font-bold uppercase tracking-[.06em] text-(--text-3)">
                    ✓ Publicados ({publishedPosts.length})
                  </p>
                  <GalleryGrid posts={publishedPosts} onRetry={handleRetry} />
                </div>
              )}

              {failedPosts.length > 0 && (
                <div>
                  <p className="mb-2 text-[10.5px] font-bold uppercase tracking-[.06em] text-(--text-3)">
                    ⚠ Falharam ({failedPosts.length})
                  </p>
                  <GalleryGrid posts={failedPosts} onRetry={handleRetry} />
                </div>
              )}
            </section>
          )}
        </main>
      </div>

      {/* Modal de contexto */}
      {postTypeId && photoUrl && (
        <ContextModal
          open={contextOpen}
          postTypeId={postTypeId}
          photoPreviewUrl={photoUrl}
          currentTone={user?.voice_tone as VoiceTone | null | undefined}
          onToneChanged={refreshUser}
          onConfirm={handleContextConfirm}
          onSkip={handleContextSkip}
          onClose={handleContextClose}
        />
      )}
    </>
  );
}

/* ── GalleryGrid — grade compacta 3 colunas ── */
function GalleryGrid({
  posts,
  onRetry,
}: {
  posts: ContentRequest[];
  onRetry: (post: ContentRequest) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {posts.map((post) => {
        const imageUrl = post.design_result?.processed_photo_url ?? post.photo_url;
        const pub      = post.status === "published";
        const pt       = post.content_type ? POST_TYPE_MAP[post.content_type as PostTypeId] : null;

        return (
          <div
            key={post.id}
            className="relative aspect-square overflow-hidden rounded-[12px] bg-(--bg-card) shadow-sm"
          >
            {imageUrl ? (
              <img src={imageUrl} alt="" className="block h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[9px] font-semibold text-(--text-4)">
                Sem foto
              </div>
            )}

            {/* Gradiente inferior */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

            {/* Badge status */}
            <div className="absolute right-[6px] top-[6px]">
              <div
                className={`flex items-center gap-[3px] rounded-full px-[6px] py-[2px] ${
                  pub ? "bg-[#16A34A]" : "bg-red-500/90"
                }`}
              >
                {pub && (
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                <span className="text-[8px] font-extrabold text-white">
                  {pub ? "OK" : "FALHOU"}
                </span>
              </div>
            </div>

            {/* Ação no rodapé */}
            <div className="absolute bottom-0 left-0 right-0 p-[6px]">
              {pub ? (
                (() => {
                  const permalink = (post.publish_result as { permalink?: string } | undefined)?.permalink;
                  const inner = (
                    <>
                      {pt && <span className="text-[8px] font-extrabold text-white/80">{pt.label}</span>}
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </>
                  );
                  const cls = "flex w-full items-center justify-center gap-0.75 rounded-[7px] border border-white/30 bg-white/15 py-1 backdrop-blur-sm";
                  return permalink
                    ? <a href={permalink} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
                    : <div className={cls}>{inner}</div>;
                })()
              ) : (
                <button
                  onClick={() => onRetry(post)}
                  className="flex w-full items-center justify-center gap-[3px] rounded-[7px] py-1 text-[9px] font-extrabold text-white"
                  style={{ background: ACCENT }}
                >
                  <RefreshCw size={10} /> Tentar novamente
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
