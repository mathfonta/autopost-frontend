"use client";

import { useEffect, useState } from "react";
import { TrendingUp, RefreshCw } from "lucide-react";
import { getWeeklyInsight, type WeeklyInsight } from "@/lib/api";

const ACCENT = "#2354E8";

function formatWeekDate(isoDate: string): string {
  const date = new Date(isoDate + "T12:00:00"); // força horário do meio-dia para evitar off-by-one de fuso
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function parseBullets(summary: string | null): string[] {
  if (!summary) return [];
  // Suporta bullet com "•" ou "- " ou numerado "1. "
  return summary
    .split("\n")
    .map((line) => line.replace(/^[\s•\-\d.]+\s*/, "").trim())
    .filter((line) => line.length > 0)
    .slice(0, 5);
}

export function WeeklyInsightCard() {
  const [insight, setInsight]   = useState<WeeklyInsight | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);

  async function load() {
    setLoading(true);
    setError(false);
    try {
      const data = await getWeeklyInsight();
      setInsight(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Estado de carregamento
  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-(--border) bg-(--bg-card) shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-(--border) border-t-blue-500" />
          <span className="text-[13px] text-(--text-3)">Carregando inteligência de mercado…</span>
        </div>
      </div>
    );
  }

  // Sem dados ou erro — não renderiza o card (silencioso)
  if (error || !insight) {
    return null;
  }

  const bullets  = parseBullets(insight.summary);
  const hashtags = (insight.hashtags ?? []).slice(0, 5);
  const weekDate = formatWeekDate(insight.week_of);

  return (
    <div className="overflow-hidden rounded-2xl border border-(--border) bg-(--bg-card) shadow-sm">
      {/* Cabeçalho */}
      <div
        className="flex items-center justify-between px-4 py-[11px]"
        style={{ background: `${ACCENT}12` }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-[8px]"
            style={{ background: ACCENT }}
          >
            <TrendingUp size={14} color="white" />
          </div>
          <div>
            <p className="text-[13.5px] font-extrabold leading-tight text-(--text-1)">
              Inteligência de mercado
            </p>
            <p className="text-[11px] font-medium text-(--text-3)">
              Semana de {weekDate}
            </p>
          </div>
        </div>
        <button
          onClick={load}
          className="tap rounded-lg p-1.5 text-(--text-3) hover:bg-(--bg-input)"
          title="Atualizar"
        >
          <RefreshCw size={13} />
        </button>
      </div>

      {/* Corpo */}
      <div className="px-4 pb-[14px] pt-[10px]">
        {/* Bullet points do resumo */}
        {bullets.length > 0 && (
          <ul className="mb-3 space-y-[5px]">
            {bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-2">
                <span
                  className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: ACCENT }}
                />
                <span className="text-[12.5px] leading-snug text-(--text-2)">{bullet}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Hashtags em alta */}
        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-[6px]">
            {hashtags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-[9px] py-[3px] text-[11px] font-bold"
                style={{
                  background: `${ACCENT}15`,
                  color: ACCENT,
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Estado vazio */}
        {bullets.length === 0 && hashtags.length === 0 && (
          <p className="text-[12.5px] text-(--text-3)">
            Dados de mercado ainda não disponíveis para esta semana.
          </p>
        )}
      </div>
    </div>
  );
}
