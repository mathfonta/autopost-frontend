"use client";

import { ChevronLeft } from "lucide-react";
import { POST_TYPE_MAP, type PostTypeId } from "@/lib/post-types";
import { STRATEGIES, OBJECTIVE_LABELS, OBJECTIVE_COLORS } from "@/lib/strategies";

interface SubStrategySelectorProps {
  postTypeId: PostTypeId;
  onBack:     () => void;
  onSelect:   (strategyId: string) => void;
}

export function SubStrategySelector({ postTypeId, onBack, onSelect }: SubStrategySelectorProps) {
  const pt         = POST_TYPE_MAP[postTypeId];
  const strategies = STRATEGIES[postTypeId] ?? [];

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
            const objStyle = OBJECTIVE_COLORS[s.objective];
            return (
              <button
                key={s.id}
                onClick={() => onSelect(s.id)}
                className="tap flex items-center gap-4 rounded-2xl border border-(--border) bg-(--bg-card) px-4 py-[14px] text-left shadow-sm"
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
                  <p className="text-[15px] font-extrabold leading-tight text-(--text-1)">
                    {s.label}
                  </p>
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
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
