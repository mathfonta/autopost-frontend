"use client";

import { useState } from "react";
import { selectCaptionVariant } from "@/lib/api";
import type { ContentRequest } from "@/lib/types";

type Variant = "long" | "short" | "stories";

interface Tab {
  key: Variant;
  label: string;
  text: string | null;
}

interface Props {
  post: ContentRequest;
  onVariantSelected: (caption: string, selected: Variant) => void;
}

export function CaptionVariantSelector({ post, onVariantSelected }: Props) {
  const [active, setActive] = useState<Variant>(post.caption_selected || "long");
  const [saving, setSaving] = useState(false);

  if (!post.caption_long) return null;

  const tabs: Tab[] = [
    { key: "long",    label: "Completa", text: post.caption_long },
    { key: "short",   label: "Curta",    text: post.caption_short },
    { key: "stories", label: "Stories",  text: post.caption_stories },
  ].filter((t) => t.text) as Tab[];

  if (tabs.length <= 1) return null;

  async function handleSelect(tab: Tab) {
    if (tab.key === active || saving || !tab.text) return;
    setSaving(true);
    try {
      await selectCaptionVariant(post.id, tab.key, tab.text);
      setActive(tab.key);
      onVariantSelected(tab.text, tab.key);
    } catch {
      // falha silenciosa — seleção reverte
    } finally {
      setSaving(false);
    }
  }

  const preview = tabs.find((t) => t.key === active)?.text ?? "";

  return (
    <div className="mb-2">
      {/* Tabs */}
      <div className="flex gap-1 mb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleSelect(tab)}
            disabled={saving}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              active === tab.key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Preview da variação ativa */}
      <p className="text-sm text-gray-700 leading-snug">{preview}</p>
    </div>
  );
}
