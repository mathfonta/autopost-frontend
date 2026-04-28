"use client";

const ACCENT = "#2354E8";
const DAY_LABELS = ["S", "T", "Q", "Q", "S", "S", "D"];

interface StreakData {
  streak: number;
  weekDays: boolean[];
  weekGoal: number;
}

interface StreakBarProps {
  data: StreakData;
}

export function StreakBar({ data }: StreakBarProps) {
  const { streak, weekDays, weekGoal } = data;
  const done = weekDays.filter(Boolean).length;
  const pct  = Math.min(100, (done / weekGoal) * 100);
  const left = weekGoal - done;

  return (
    <div className="overflow-hidden rounded-2xl border border-(--border) bg-(--bg-card) shadow-sm">
      {/* Banner colorido */}
      <div
        className="flex items-center justify-between px-4 pb-3 pt-[13px]"
        style={{ background: ACCENT }}
      >
        <div className="flex items-center gap-[9px]">
          <span className="block text-[22px] leading-none">🔥</span>
          <div>
            <p className="text-[19px] font-extrabold leading-none text-white">
              {streak} dias seguidos!
            </p>
            <p className="mt-0.5 text-[11.5px] font-medium text-white/75">
              Continue assim — você está voando 🚀
            </p>
          </div>
        </div>
        <div className="shrink-0 rounded-[10px] bg-white/20 px-[10px] py-[5px] text-center">
          <p className="text-[13px] font-extrabold text-white">{weekGoal}/sem</p>
          <p className="text-[9px] font-bold uppercase tracking-[.05em] text-white/70">meta</p>
        </div>
      </div>

      {/* Bolinhas de dias + barra de progresso */}
      <div className="px-4 pb-[13px] pt-[11px]">
        <div className="flex gap-[5px]">
          {DAY_LABELS.map((label, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="flex w-full items-center justify-center rounded-[8px]"
                style={{
                  aspectRatio: "1",
                  background:  weekDays[i] ? ACCENT : "var(--bg-input)",
                  border:      `1.5px solid ${weekDays[i] ? ACCENT : "var(--border)"}`,
                  boxShadow:   weekDays[i] ? `0 2px 6px ${ACCENT}44` : "none",
                }}
              >
                {weekDays[i] ? (
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <div className="h-1 w-1 rounded-full bg-(--border)" />
                )}
              </div>
              <span
                className="text-[9.5px] font-bold"
                style={{ color: weekDays[i] ? ACCENT : "var(--text-4)" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-[10px] flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-(--bg-input)">
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{ width: `${pct}%`, background: ACCENT }}
            />
          </div>
          <span className="shrink-0 text-[11px] font-bold" style={{ color: ACCENT }}>
            {done}/{weekGoal}
          </span>
        </div>

        <p className="mt-[5px] text-[11px] font-medium text-(--text-3)">
          {left > 0
            ? `Mais ${left} post${left !== 1 ? "s" : ""} para completar a semana ⭐`
            : "Meta da semana concluída! 🎉"}
        </p>
      </div>
    </div>
  );
}
