"use client";

import { useCallback, useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { getContentRequest } from "@/lib/api";
import type { ContentRequest } from "@/lib/types";

const ACCENT = "#2354E8";

const STAGES = [
  { status: "analyzing", label: "Analisando imagem" },
  { status: "copy",      label: "Gerando copy"      },
  { status: "design",    label: "Preparando arte"   },
] as const;

const STATUS_ORDER = ["pending", "analyzing", "copy", "design", "awaiting_approval", "failed"];

interface GeneratingScreenProps {
  requestId: string;
  onDone:    (post: ContentRequest) => void;
  onError:   () => void;
  onCancel:  () => void;
}

export function GeneratingScreen({ requestId, onDone, onError, onCancel }: GeneratingScreenProps) {
  const [status,   setStatus]   = useState<string>("pending");
  const [elapsed,  setElapsed]  = useState(0);
  const [donePost, setDonePost] = useState<ContentRequest | null>(null);

  const handleDone  = useCallback(onDone,  [onDone]);
  const handleError = useCallback(onError, [onError]);

  useEffect(() => {
    if (donePost) return; // polling parado — aguardando ação do usuário

    let active = true;

    async function poll() {
      try {
        const req = await getContentRequest(requestId);
        if (!active) return;
        setStatus(req.status);
        if (req.status === "awaiting_approval") {
          setDonePost(req); // mostra done state; usuário clica para continuar
        } else if (req.status === "failed") {
          handleError();
        }
      } catch {
        // mantém o polling
      }
    }

    poll();
    const iv = setInterval(poll, 3000);
    return () => { active = false; clearInterval(iv); };
  }, [requestId, handleError, donePost]);

  useEffect(() => {
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const currentIdx = STATUS_ORDER.indexOf(status);

  function stageState(s: string): "done" | "active" | "pending" {
    const idx = STATUS_ORDER.indexOf(s);
    if (idx < currentIdx) return "done";
    if (idx === currentIdx) return "active";
    return "pending";
  }

  const mins  = Math.floor(elapsed / 60);
  const secs  = elapsed % 60;
  const timer = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  // ── Done state ─────────────────────────────────────────────────
  if (donePost) {
    return (
      <div className="flex min-h-screen flex-col bg-(--bg-shell)">
        <header className="sticky top-0 z-10 flex h-13.5 shrink-0 items-center border-b border-(--border) bg-(--bg-card) px-5">
          <div className="flex items-center gap-2">
            <div className="flex h-6.5 w-6.5 items-center justify-center rounded-[7px] text-white" style={{ background: ACCENT }}>
              <Zap size={13} fill="white" strokeWidth={0} />
            </div>
            <span className="text-[17px] font-extrabold tracking-tight text-(--text-1)">AutoPost</span>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-6 pb-16">
          {/* Ícone de sucesso */}
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-post-concluida">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="mb-1 text-[20px] font-extrabold tracking-tight text-(--text-1)">
            Post criado com sucesso!
          </h1>
          <p className="mb-10 text-sm text-(--text-3)">Gerado em {timer}</p>

          {/* Todas as etapas concluídas */}
          <div className="w-full max-w-xs space-y-4">
            <StageRow state="done" label="Foto enviada" />
            {STAGES.map(({ status: s, label }) => (
              <StageRow key={s} state="done" label={label} />
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => handleDone(donePost)}
            className="mt-10 w-full max-w-xs rounded-[14px] py-4 text-[16px] font-extrabold text-white"
            style={{ background: ACCENT }}
          >
            Revisar e aprovar →
          </button>

          <button
            onClick={onCancel}
            className="mt-4 text-[13px] font-semibold text-(--text-4) underline-offset-2 hover:underline"
          >
            Voltar ao início
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-(--bg-shell)">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-13.5 shrink-0 items-center border-b border-(--border) bg-(--bg-card) px-5">
        <div className="flex items-center gap-2">
          <div
            className="flex h-6.5 w-6.5 items-center justify-center rounded-[7px] text-white"
            style={{ background: ACCENT }}
          >
            <Zap size={13} fill="white" strokeWidth={0} />
          </div>
          <span className="text-[17px] font-extrabold tracking-tight text-(--text-1)">AutoPost</span>
        </div>
      </header>

      {/* Conteúdo central */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-16">
        {/* Spinner */}
        <div className="relative mb-8">
          <div
            className="h-20 w-20 animate-spin rounded-full border-4 border-(--border)"
            style={{ borderTopColor: ACCENT }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap size={24} fill={ACCENT} stroke="none" />
          </div>
        </div>

        <h1 className="mb-1 text-[20px] font-extrabold tracking-tight text-(--text-1)">
          Criando seu post...
        </h1>
        <p className="mb-10 text-sm text-(--text-3)">{timer}</p>

        {/* Etapas */}
        <div className="w-full max-w-xs space-y-4">
          {/* Upload — sempre concluído quando chegamos aqui */}
          <StageRow state="done"  label="Foto enviada" />

          {STAGES.map(({ status: s, label }) => (
            <StageRow key={s} state={stageState(s)} label={label} />
          ))}
        </div>

        {/* Dica */}
        <p className="mt-10 max-w-[240px] text-center text-[12px] leading-relaxed text-(--text-3)">
          Isso costuma levar entre 30 e 90 segundos. Você pode fechar o app e voltar depois.
        </p>

        {/* Cancelar */}
        <button
          onClick={onCancel}
          className="mt-6 text-[13px] font-semibold text-(--text-4) underline-offset-2 hover:underline"
        >
          Voltar ao início
        </button>
      </main>
    </div>
  );
}

/* ── StageRow ── */
function StageRow({ state, label }: { state: "done" | "active" | "pending"; label: string }) {
  return (
    <div className="flex items-center gap-3">
      {/* Ícone */}
      <div className="flex h-6 w-6 shrink-0 items-center justify-center">
        {state === "done" && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#16A34A]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
        {state === "active" && (
          <div
            className="h-3 w-3 animate-pulse rounded-full"
            style={{ background: ACCENT }}
          />
        )}
        {state === "pending" && (
          <div className="h-3 w-3 rounded-full bg-(--border)" />
        )}
      </div>

      {/* Label */}
      <span
        className={`text-[15px] font-semibold ${
          state === "done"   ? "text-(--text-2)" :
          state === "active" ? "text-(--text-1)" :
          "text-(--text-4)"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
