"use client";

import { useState } from "react";
import type { PostType } from "@/lib/post-types";

interface PostTypeCardProps {
  postType:  PostType;
  onClick:   () => void;
  disabled?: boolean;
  loading?:  boolean;
}

/** Variante grid — layout 2 colunas */
export function PostTypeCard({ postType: pt, onClick, disabled, loading }: PostTypeCardProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      disabled={disabled}
      className="tap flex min-h-[92px] w-full flex-col gap-[9px] rounded-[16px] border p-[13px_12px] text-left shadow-sm transition-all duration-120 disabled:opacity-50"
      style={{
        background:  pressed ? pt.bg : "var(--bg-card)",
        borderColor: pressed ? `${pt.color}33` : "var(--border)",
        boxShadow:   pressed ? `0 0 0 3px ${pt.color}18` : undefined,
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px]"
          style={{ background: pt.bg, color: pt.color }}
        >
          <div className="h-4 w-4">{pt.icon}</div>
        </div>
        <span className="text-[13px] font-bold leading-snug text-(--text-1)">
          {pt.label}
        </span>
      </div>
      <span className="text-[11.5px] font-medium leading-snug text-(--text-3)">
        {pt.sub}
      </span>
      {loading && (
        <div
          className="h-3.5 w-3.5 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: pt.color, borderTopColor: "transparent" }}
        />
      )}
    </button>
  );
}

/** Variante row — largura total */
export function PostTypeRow({ postType: pt, onClick, disabled, loading }: PostTypeCardProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      disabled={disabled}
      className="tap flex min-h-[68px] w-full items-center gap-[13px] rounded-[14px] border px-4 py-[13px] text-left shadow-sm transition-all duration-120 disabled:opacity-50"
      style={{
        background:  pressed ? pt.bg : "var(--bg-card)",
        borderColor: pressed ? `${pt.color}33` : "var(--border)",
        boxShadow:   pressed ? `0 0 0 2px ${pt.color}33` : undefined,
      }}
    >
      <div
        className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px]"
        style={{ background: pt.bg, color: pt.color }}
      >
        <div className="h-[18px] w-[18px]">{pt.icon}</div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-bold text-(--text-1)">{pt.label}</p>
        <p className="mt-0.5 text-[12px] text-(--text-3)">{pt.sub}</p>
      </div>
      {loading ? (
        <div
          className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: pt.color, borderTopColor: "transparent" }}
        />
      ) : (
        <svg className="shrink-0 text-(--text-4)" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      )}
    </button>
  );
}
