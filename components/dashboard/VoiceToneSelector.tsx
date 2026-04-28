"use client";

import { useState } from "react";
import { updateProfile } from "@/lib/api";

type VoiceTone = "formal" | "casual" | "technical";

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
    <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 mb-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tom de voz</p>
        {saved && <span className="text-xs text-green-600">Salvo</span>}
        {saving && <span className="text-xs text-gray-400">Salvando…</span>}
      </div>
      <div className="flex gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            disabled={saving}
            className={`flex-1 rounded-lg border px-2 py-2 text-left transition-colors ${
              selected === opt.value
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <p className={`text-xs font-semibold ${selected === opt.value ? "text-blue-700" : "text-gray-700"}`}>
              {opt.label}
            </p>
            <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{opt.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
