"use client";

import { ChevronLeft } from "lucide-react";
import { INTENTS, type MarketingIntent } from "@/lib/intents";

const ACCENT = "#2354E8";

interface IntentSelectorProps {
  onSelect: (intentId: MarketingIntent) => void;
  onBack:   () => void;
  onSkip:   () => void;
}

export function IntentSelector({ onSelect, onBack, onSkip }: IntentSelectorProps) {
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
        <span className="text-[17px] font-extrabold tracking-tight text-(--text-1)">
          Novo Post
        </span>
      </header>

      <div className="overflow-y-auto px-4 pb-9 pt-6">
        <p className="mb-5 text-[14px] font-semibold text-(--text-2)">
          O que você quer com este post?
        </p>

        <div className="flex flex-col gap-[10px]">
          {INTENTS.map((intent) => (
            <button
              key={intent.id}
              onClick={() => onSelect(intent.id)}
              className="tap flex items-center gap-4 rounded-2xl border border-(--border) bg-(--bg-card) px-4 py-[14px] text-left shadow-sm"
            >
              {/* Ícone */}
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl"
                style={{ background: "#EEF2FF" }}
              >
                {intent.icon}
              </div>

              {/* Texto */}
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-extrabold leading-tight text-(--text-1)">
                  {intent.label}
                </p>
                <p className="mt-0.5 text-[12px] font-medium text-(--text-3)">
                  {intent.description}
                </p>
              </div>

              {/* Seta */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-(--text-3)"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ))}
        </div>

        {/* Link para escolha manual */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onSkip}
            className="tap text-[13px] font-semibold"
            style={{ color: ACCENT }}
          >
            Escolher formato manualmente →
          </button>
        </div>
      </div>
    </div>
  );
}
