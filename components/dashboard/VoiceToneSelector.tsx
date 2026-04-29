"use client";

import { useState } from "react";
import { updateProfile } from "@/lib/api";
import type { VoiceTone } from "@/lib/types";

interface Option {
  value: VoiceTone;
  label: string;
  description: string;
}

const OPTIONS: Option[] = [
  { value: "formal",    label: "Formal",       description: "Profissional e aspiracional" },
  { value: "casual",    label: "Descontraído", description: "Próximo e direto" },
  { value: "technical", label: "Técnico",      description: "Preciso e informativo" },
];

interface Props {
  currentTone: VoiceTone | null | undefined;
  onChanged: (tone: VoiceTone) => void;
}

export function VoiceToneSelector({ currentTone, onChanged }: Props) {
  const [selected, setSelected] = useState<VoiceTone>(currentTone || "casual");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSelect(tone: VoiceTone) {
    if (tone === selected || saving) return;
    setSelected(tone);
    setSaving(true);
    setSaved(false);
    try {
      await updateProfile(tone);
      onChanged(tone);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setSelected(currentTone || "casual");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-end h-4 mb-2">
        {saved  && <span className="text-xs font-medium text-green-600">Salvo</span>}
        {saving && <span className="text-xs text-(--text-4)">Salvando…</span>}
      </div>
      <div className="flex gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            disabled={saving}
            className="flex-1 rounded-icon border px-2 py-2 text-left transition-all"
            style={
              selected === opt.value
                ? { borderColor: "#2354E8", background: "#2354E815" }
                : { borderColor: "var(--border)", background: "var(--bg-input)" }
            }
          >
            <p
              className="text-xs font-semibold"
              style={{ color: selected === opt.value ? "#2354E8" : "var(--text-2)" }}
            >
              {opt.label}
            </p>
            <p className="text-[10px] leading-tight mt-0.5 text-(--text-4)">{opt.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
