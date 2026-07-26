"use client";

import { useEffect, useState } from "react";
import { Calendar, Play } from "lucide-react";
import { getScheduledPosts, cancelScheduledPost, rescheduleContentRequest } from "@/lib/api";
import { ScheduleModal } from "./ScheduleModal";
import { useToast } from "@/components/ui/toast";
import type { ContentRequest } from "@/lib/types";

interface ScheduledPostsSectionProps {
  /** Chamado após cancelar/reagendar com sucesso — dashboard atualiza a lista principal
   * (o post cancelado volta para "aguardando aprovação"). */
  onChange?: () => void;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** "Hoje às 19:00" / "Amanhã às 09:00" / "27/07 às 12:00" */
function formatScheduledFor(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const time = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  if (isSameDay(date, now)) return `Hoje às ${time}`;

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (isSameDay(date, tomorrow)) return `Amanhã às ${time}`;

  const day = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  return `${day} às ${time}`;
}

export function ScheduledPostsSection({ onChange }: ScheduledPostsSectionProps) {
  const [posts, setPosts] = useState<ContentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [reschedulingLoading, setReschedulingLoading] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    try {
      const data = await getScheduledPosts();
      setPosts(data);
    } catch {
      // Falha ao carregar agendados não deve travar o dashboard — seção
      // fica vazia (mesmo efeito visual do estado "sem agendados").
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return null;

  /**
   * Recarrega a lista e verifica se `id` ainda está nela — se não estiver
   * mais, o item saiu de `scheduled` enquanto a UI estava desatualizada
   * (ex.: o Beat da Story 19.2 já publicou nesse intervalo). Usado para dar
   * uma mensagem específica em vez de "tente de novo" num erro que nunca
   * vai ter sucesso (achado do QA — gate 19.5, CONCERN-001).
   */
  const reloadAndCheckStillPresent = async (id: string): Promise<boolean> => {
    const data = await getScheduledPosts();
    setPosts(data);
    return data.some((p) => p.id === id);
  };

  const handleCancel = async (id: string) => {
    setCancelingId(id);
    try {
      await cancelScheduledPost(id);
      toast("Agendamento cancelado. O post voltou para aguardando aprovação.");
      await load();
      onChange?.();
    } catch {
      const stillPresent = await reloadAndCheckStillPresent(id).catch(() => true);
      if (stillPresent) {
        toast("Erro ao cancelar. Tente novamente.", "error");
      } else {
        toast("Este post já não está mais agendado (provavelmente já foi publicado).", "error");
        onChange?.();
      }
    } finally {
      setCancelingId(null);
    }
  };

  const handleReschedule = async (scheduledForISO: string) => {
    if (!reschedulingId) return;
    const id = reschedulingId;
    setReschedulingLoading(true);
    try {
      await rescheduleContentRequest(id, scheduledForISO);
      toast("Reagendado com sucesso.");
      setReschedulingId(null);
      await load();
      onChange?.();
    } catch {
      const stillPresent = await reloadAndCheckStillPresent(id).catch(() => true);
      if (stillPresent) {
        toast("Erro ao reagendar. Tente novamente.", "error");
      } else {
        toast("Este post já não está mais agendado (provavelmente já foi publicado).", "error");
        setReschedulingId(null);
        onChange?.();
      }
    } finally {
      setReschedulingLoading(false);
    }
  };

  const reschedulingPost = posts.find((p) => p.id === reschedulingId) ?? null;

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Calendar className="h-4 w-4 text-purple-600" />
        <h2 className="text-[15px] font-bold text-(--text-2)">
          Posts agendados{posts.length > 0 ? ` (${posts.length})` : ""}
        </h2>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-(--border) bg-(--bg-card) px-4 py-5 text-center">
          <p className="text-[13px] text-(--text-3)">Nenhum post agendado.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => {
            const isVideo = post.content_type === "reels" || post.content_type === "story";
            const imageUrl = isVideo
              ? post.design_result?.thumbnail_url
              : (post.design_result?.processed_photo_url ?? post.photo_url);
            return (
              <div
                key={post.id}
                className="flex items-center gap-3 rounded-2xl border border-(--border) bg-(--bg-card) p-3"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-(--bg-input)">
                  {imageUrl && <img src={imageUrl} alt="" className="h-full w-full object-cover" />}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="h-4 w-4 text-white" fill="white" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-(--text-1)">
                    {post.scheduled_for ? formatScheduledFor(post.scheduled_for) : "—"}
                  </p>
                  <p className="truncate text-[12px] text-(--text-3)">
                    {post.copy_result?.caption?.slice(0, 60) ?? "Sem legenda"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button
                    onClick={() => setReschedulingId(post.id)}
                    disabled={cancelingId === post.id}
                    className="rounded-lg bg-(--bg-input) px-2.5 py-1.5 text-[12px] font-semibold text-(--text-2) disabled:opacity-50"
                  >
                    Reagendar
                  </button>
                  <button
                    onClick={() => handleCancel(post.id)}
                    disabled={cancelingId === post.id}
                    className="rounded-lg bg-red-50 px-2.5 py-1.5 text-[12px] font-semibold text-red-600 disabled:opacity-50"
                  >
                    {cancelingId === post.id ? "..." : "Cancelar"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {reschedulingPost && (
        <ScheduleModal
          onConfirm={handleReschedule}
          onCancel={() => setReschedulingId(null)}
          loading={reschedulingLoading}
          initialSuggestedTime={reschedulingPost.copy_result?.suggested_time}
          contentType={reschedulingPost.content_type}
        />
      )}
    </section>
  );
}
