"use client";

import { useState } from "react";
import { ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";
import { POST_TYPE_MAP, type PostTypeId } from "@/lib/post-types";
import { STRATEGIES, OBJECTIVE_LABELS, OBJECTIVE_COLORS } from "@/lib/strategies";

const ACCENT = "#2354E8";

interface SubStrategySelectorProps {
  postTypeId:             PostTypeId;
  onBack:                 () => void;
  onSelect:               (strategyId: string) => void;
  recommendedStrategyId?: string;
}

export function SubStrategySelector({ postTypeId, onBack, onSelect, recommendedStrategyId }: SubStrategySelectorProps) {
  const pt         = POST_TYPE_MAP[postTypeId];
  const rawStrategies = STRATEGIES[postTypeId] ?? [];

  // Move a estratégia recomendada para o topo
  const strategies = recommendedStrategyId
    ? [
        ...rawStrategies.filter((s) => s.id === recommendedStrategyId),
        ...rawStrategies.filter((s) => s.id !== recommendedStrategyId),
      ]
    : rawStrategies;

  const [expandedId, setExpandedId] = useState<string | null>(null);

  function handleChevronClick(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    setExpandedId((prev) => (prev === id ? null : id));
  }

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
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
            style={{ background: pt.bg, color: pt.color }}
          >
            <div className="h-3.5 w-3.5">{pt.icon}</div>
          </div>
          <span className="text-[17px] font-extrabold tracking-tight text-(--text-1)">
            {pt.label}
          </span>
        </div>
      </header>

      <div className="overflow-y-auto px-4 pb-9 pt-6">
        <p className="mb-5 text-[14px] font-semibold text-(--text-2)">
          Qual é o objetivo deste post?
        </p>

        <div className="flex flex-col gap-[10px]">
          {strategies.map((s) => {
            const objStyle  = OBJECTIVE_COLORS[s.objective];
            const isExpanded = expandedId === s.id;
            const isRecommended = recommendedStrategyId === s.id;

            return (
              <div
                key={s.id}
                className="rounded-2xl border border-(--border) bg-(--bg-card) shadow-sm overflow-hidden"
              >
                {/* Linha principal — clicável para selecionar */}
                <button
                  onClick={() => onSelect(s.id)}
                  className="tap flex w-full items-center gap-4 px-4 py-[14px] text-left"
                >
                  {/* Ícone */}
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
                    style={{ background: pt.bg }}
                  >
                    {s.icon}
                  </div>

                  {/* Texto */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[15px] font-extrabold leading-tight text-(--text-1)">
                        {s.label}
                      </p>
                      {isRecommended && (
                        <span
                          className="rounded-full px-[8px] py-[2px] text-[10px] font-bold text-white"
                          style={{ background: ACCENT }}
                        >
                          ✨ Recomendado
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[12px] font-medium text-(--text-3)">
                      {s.desc}
                    </p>
                  </div>

                  {/* Badge objetivo */}
                  <div
                    className="shrink-0 rounded-full px-[9px] py-[3px] text-[10px] font-bold"
                    style={{ background: objStyle.bg, color: objStyle.color }}
                  >
                    {OBJECTIVE_LABELS[s.objective]}
                  </div>

                  {/* Chevron toggle */}
                  <button
                    onClick={(e) => handleChevronClick(e, s.id)}
                    className="tap flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-(--text-3)"
                    aria-label={isExpanded ? "Recolher detalhes" : "Expandir detalhes"}
                  >
                    {isExpanded
                      ? <ChevronUp size={16} strokeWidth={2.5} />
                      : <ChevronDown size={16} strokeWidth={2.5} />
                    }
                  </button>
                </button>

                {/* Conteúdo expandido */}
                {isExpanded && (
                  <div className="border-t border-(--border) px-4 pb-4 pt-3 flex flex-col gap-[10px]">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-(--text-3) mb-[3px]">
                        📍 Quando usar
                      </p>
                      <p className="text-[13px] text-(--text-2)">
                        {s.when_to_use}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-(--text-3) mb-[3px]">
                        📷 O que você precisa
                      </p>
                      <p className="text-[13px] text-(--text-2)">
                        {s.input_needed}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-(--text-3) mb-[3px]">
                        ✏️ Exemplo de resultado
                      </p>
                      <p className="text-[13px] italic text-(--text-2)">
                        &ldquo;{s.output_example}&rdquo;
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
