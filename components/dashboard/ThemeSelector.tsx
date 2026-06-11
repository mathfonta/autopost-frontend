"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { getThemes, type Theme, type ThemesResponse } from "@/lib/api";

const ACCENT = "#2354E8";

interface ThemeSelectorProps {
  onSelect: (themeId: string) => void;
  onBack:   () => void;
}

function ThemeSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-(--border) bg-(--bg-card) p-4 space-y-2">
      <div className="h-4 w-3/4 rounded bg-(--bg-input)" />
      <div className="h-3 w-1/2 rounded bg-(--bg-input)" />
      <div className="flex gap-2 mt-3">
        <div className="h-5 w-16 rounded-full bg-(--bg-input)" />
        <div className="h-5 w-12 rounded-full bg-(--bg-input)" />
      </div>
    </div>
  );
}

const OBJECTIVE_LABELS: Record<string, string> = {
  autoridade:  "🏆 Autoridade",
  engajamento: "💬 Engajamento",
  alcance:     "📈 Alcance",
  conversão:   "💰 Conversão",
  confiança:   "🤝 Confiança",
  saves:       "🔖 Salvamentos",
};

export function ThemeSelector({ onSelect, onBack }: ThemeSelectorProps) {
  const [data, setData]       = useState<ThemesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  async function fetchThemes() {
    setLoading(true);
    setError(null);
    try {
      const res = await getThemes();
      setData(res);
    } catch {
      setError("Não foi possível carregar os temas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchThemes(); }, []);

  return (
    <div className="flex min-h-screen flex-col bg-(--bg-shell)">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-13.5 shrink-0 items-center gap-3 border-b border-(--border) bg-(--bg-card) px-4">
        <button
          onClick={onBack}
          className="tap flex h-9 w-9 items-center justify-center rounded-icon bg-(--bg-input) text-(--text-1)"
          aria-label="Voltar"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>
        <div className="flex items-center gap-2">
          <Sparkles size={18} style={{ color: ACCENT }} />
          <span className="text-[17px] font-extrabold tracking-tight text-(--text-1)">
            Carrossel Automático
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pt-5 pb-8 space-y-4">
        {/* Subtítulo do nicho */}
        {data && (
          <p className="text-[13px] text-(--text-3)">
            Temas para:{" "}
            <strong className="text-(--text-2) capitalize">{data.segment}</strong>
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            <ThemeSkeleton />
            <ThemeSkeleton />
            <ThemeSkeleton />
          </div>
        )}

        {/* Erro */}
        {error && !loading && (
          <div className="rounded-2xl border border-(--border) bg-(--bg-card) p-5 text-center space-y-3">
            <p className="text-[14px] text-(--text-2)">{error}</p>
            <button
              onClick={fetchThemes}
              className="text-[13px] font-semibold"
              style={{ color: ACCENT }}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Lista de temas */}
        {!loading && !error && data?.themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onSelect(theme.id)}
            className="w-full text-left rounded-2xl border border-(--border) bg-(--bg-card) p-4 flex items-center gap-3 tap"
          >
            <div className="flex-1 space-y-1">
              <p className="text-[15px] font-bold text-(--text-1) leading-snug">
                {theme.title}
              </p>
              <p className="text-[13px] text-(--text-3) leading-relaxed">
                {theme.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {/* Badge objetivo */}
                <span
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
                  style={{ background: ACCENT }}
                >
                  {OBJECTIVE_LABELS[theme.objective] ?? theme.objective}
                </span>
                {/* Contagem de slides */}
                <span className="rounded-full border border-(--border) px-2.5 py-0.5 text-[11px] font-medium text-(--text-3)">
                  {theme.slide_count} cards
                </span>
              </div>
            </div>
            <ChevronRight size={18} className="shrink-0 text-(--text-4)" />
          </button>
        ))}
      </div>
    </div>
  );
}
