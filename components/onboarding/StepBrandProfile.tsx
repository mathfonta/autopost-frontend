"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { startOnboarding, sendOnboardingMessage } from "@/lib/api";

const SEGMENTS = [
  "Construção civil",
  "Alimentação",
  "Moda e vestuário",
  "Saúde e beleza",
  "Educação",
  "Tecnologia",
  "Outro",
];

const TONES = [
  { value: "profissional", label: "Profissional e sério" },
  { value: "amigavel", label: "Amigável e próximo" },
  { value: "divertido", label: "Divertido e descontraído" },
  { value: "inspirador", label: "Inspirador e motivacional" },
];

interface StepBrandProfileProps {
  onNext: () => void;
}

export function StepBrandProfile({ onNext }: StepBrandProfileProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    company: "",
    segment: "",
    tone: "",
    colors: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company.trim() || !form.segment || !form.tone) {
      setError("Preencha os campos obrigatórios.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await startOnboarding();
      const message = [
        `Empresa: ${form.company}`,
        `Segmento: ${form.segment}`,
        `Tom de voz: ${form.tone}`,
        form.colors ? `Cores da marca: ${form.colors}` : "",
      ]
        .filter(Boolean)
        .join("\n");
      await sendOnboardingMessage(message);
      onNext();
    } catch {
      setError("Erro ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome da empresa <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          placeholder="Ex: Espectra Construção"
          className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Segmento <span className="text-red-500">*</span>
        </label>
        <select
          value={form.segment}
          onChange={(e) => setForm({ ...form, segment: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Selecione o segmento</option>
          {SEGMENTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tom de voz <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {TONES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setForm({ ...form, tone: value })}
              className={`px-3 py-2 rounded-xl border text-sm text-left transition-colors ${
                form.tone === value
                  ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cores da marca{" "}
          <span className="text-gray-400 font-normal">(opcional)</span>
        </label>
        <input
          type="text"
          value={form.colors}
          onChange={(e) => setForm({ ...form, colors: e.target.value })}
          placeholder="Ex: azul escuro e dourado"
          className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 text-white rounded-2xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? "Salvando..." : "Continuar"}
      </button>
    </form>
  );
}
