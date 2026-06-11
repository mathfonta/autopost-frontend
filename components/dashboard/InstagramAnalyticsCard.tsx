"use client";

import { useEffect, useState } from "react";
import { BarChart2, RefreshCw } from "lucide-react";
import { getInstagramAnalytics, type InstagramAnalyticsData } from "@/lib/api";

const ACCENT = "#2354E8";

function fmt(n: number): string {
  return n.toLocaleString("pt-BR");
}

interface MetricTileProps {
  label: string;
  value: number;
  description: string;
  highlight?: boolean;
}

function MetricTile({ label, value, description, highlight }: MetricTileProps) {
  return (
    <div className="flex flex-col gap-0.5 rounded-xl border border-(--border) bg-(--bg-input) px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-(--text-3)">{label}</p>
      <p
        className="text-[22px] font-extrabold leading-tight"
        style={{ color: highlight ? ACCENT : "var(--text-1)" }}
      >
        {highlight && value > 0 ? "+" : ""}
        {fmt(value)}
      </p>
      <p className="text-[11px] text-(--text-4)">{description}</p>
    </div>
  );
}

export function InstagramAnalyticsCard() {
  const [data, setData]       = useState<InstagramAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const result = await getInstagramAnalytics();
      setData(result);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        "Não foi possível carregar as métricas.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-(--border) bg-(--bg-card) shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-(--border) border-t-blue-500" />
          <span className="text-[13px] text-(--text-3)">Carregando métricas do Instagram…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-hidden rounded-2xl border border-(--border) bg-(--bg-card) shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-[13px] text-(--text-3)">{error}</p>
          <button
            onClick={load}
            className="tap rounded-lg p-1.5 text-(--text-3) hover:bg-(--bg-input)"
            title="Tentar novamente"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const updatedAt = new Date(data.collected_at).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

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
            <BarChart2 size={14} color="white" />
          </div>
          <div>
            <p className="text-[13.5px] font-extrabold leading-tight text-(--text-1)">
              Analytics Orgânico
            </p>
            <p className="text-[11px] font-medium text-(--text-3)">
              Últimos {data.period_days} dias · Atualizado {updatedAt}
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

      {/* Grid de métricas */}
      <div className="grid grid-cols-2 gap-3 p-4">
        <MetricTile
          label="Alcance total"
          value={data.reach_total}
          description="Contas únicas alcançadas"
        />
        <MetricTile
          label="Novos seguidores"
          value={data.follower_growth}
          description="Crescimento líquido no período"
          highlight
        />
        <MetricTile
          label="Contas engajadas"
          value={data.accounts_engaged}
          description="Interações (28d)"
        />
        <MetricTile
          label="Visitas ao perfil"
          value={data.profile_views}
          description="Cliques no perfil (28d)"
        />
      </div>
    </div>
  );
}
