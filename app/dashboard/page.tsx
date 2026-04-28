"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, LogOut, History, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useContentRequests } from "@/hooks/useContentRequests";
import { PostCard } from "@/components/dashboard/PostCard";
import { ContentTypeBar } from "@/components/dashboard/ContentTypeBar";
import { UploadScreen } from "@/components/dashboard/UploadScreen";
import { PhotoPreview } from "@/components/dashboard/PhotoPreview";
import { ContextModal } from "@/components/dashboard/ContextModal";
import { MetaTokenWarning } from "@/components/dashboard/MetaTokenWarning";
import { api } from "@/lib/api";
import { getMetaStatus, type MetaStatus } from "@/lib/api";
import type { PostTypeId } from "@/lib/post-types";
import type { VoiceTone } from "@/lib/types";

type Screen = "dashboard" | "upload" | "preview";

const ACCENT = "#2354E8";

export default function DashboardPage() {
  const { user, logout, refresh: refreshUser } = useAuth();
  const router = useRouter();
  const { posts, error, loading, refresh } = useContentRequests();
  const [metaStatus, setMetaStatus] = useState<MetaStatus | null>(null);

  // Navegação entre telas
  const [screen,      setScreen]      = useState<Screen>("dashboard");
  const [postTypeId,  setPostTypeId]  = useState<PostTypeId | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [photoUrl,    setPhotoUrl]    = useState<string | null>(null);

  // Modal de contexto + upload
  const [contextOpen,   setContextOpen]   = useState(false);
  const [uploading,     setUploading]     = useState(false);
  const [uploadingType, setUploadingType] = useState<PostTypeId | null>(null);
  const [uploadError,   setUploadError]   = useState<string | null>(null);

  useEffect(() => {
    getMetaStatus().then(setMetaStatus).catch(() => null);
  }, []);

  function handleTypeSelected(id: PostTypeId) {
    setPostTypeId(id);
    setScreen("upload");
  }

  function handlePhotoSelected(file: File, url: string) {
    setPendingFile(file);
    setPhotoUrl(url);
    setScreen("preview");
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
    setScreen("dashboard");
    setPostTypeId(null);
  }

  async function uploadFile(file: File, intent: PostTypeId | null, context: string | null) {
    setUploadError(null);
    setUploading(true);
    setUploadingType(intent);
    try {
      const formData = new FormData();
      formData.append("photo", file);
      if (intent)         formData.append("content_type", intent);
      if (context?.trim()) formData.append("user_context", context.trim());
      await api.post("/content-requests", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      refresh();
    } catch {
      setUploadError("Erro ao enviar foto. Tente novamente.");
    } finally {
      setUploading(false);
      setUploadingType(null);
      cleanupPhoto();
    }
  }

  function cleanupPhoto() {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(null);
    setPendingFile(null);
    setPostTypeId(null);
  }

  function handleContextConfirm(context: string) {
    setContextOpen(false);
    if (pendingFile) uploadFile(pendingFile, postTypeId, context || null);
  }

  function handleContextSkip() {
    setContextOpen(false);
    if (pendingFile) uploadFile(pendingFile, postTypeId, null);
  }

  function handleContextClose() {
    setContextOpen(false);
    cleanupPhoto();
  }

  const pendingPosts = posts.filter((p) => p.status === "awaiting_approval");
  const otherPosts   = posts.filter((p) => p.status !== "awaiting_approval");

  // ── Tela Upload ───────────────────────────────────────────────────────────
  if (screen === "upload" && postTypeId) {
    return (
      <UploadScreen
        postTypeId={postTypeId}
        onBack={handleUploadBack}
        onPhotoSelected={handlePhotoSelected}
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
        <main className="flex flex-col gap-4.5 overflow-y-auto px-4 pb-9 pt-4.5">

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

          {/* Erros de upload */}
          {uploadError && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
              {uploadError}
            </div>
          )}

          {/* Erro de carregamento */}
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Loading */}
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

          {/* Aguardando aprovação */}
          {pendingPosts.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                <h2 className="text-sm font-semibold text-(--text-2)">
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

          {/* Publicações recentes */}
          {otherPosts.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[17px] font-extrabold tracking-tight text-(--text-1)">
                  Publicações recentes
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {otherPosts.map((post) => (
                  <PostCard key={post.id} post={post} onAction={refresh} />
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Modal de contexto — fora do fluxo de telas */}
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
