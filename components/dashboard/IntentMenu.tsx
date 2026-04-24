"use client";

interface IntentOption {
  value: string;
  emoji: string;
  label: string;
  description: string;
}

const INTENT_OPTIONS: IntentOption[] = [
  { value: "post_simples",   emoji: "📸", label: "Post Simples",        description: "Publicação de obra ou produto" },
  { value: "obra_andamento", emoji: "🔨", label: "Obra em Andamento",   description: "Progresso de projeto" },
  { value: "obra_concluida", emoji: "✅", label: "Obra Concluída",      description: "Resultado final entregue" },
  { value: "engajamento",    emoji: "💬", label: "Engajamento",         description: "Pergunta ou enquete para a audiência" },
  { value: "bastidores",     emoji: "🎉", label: "Bastidores",          description: "Momento da equipe ou processo" },
];

interface IntentMenuProps {
  onSelect: (contentType: string) => void;
  onClose: () => void;
}

export function IntentMenu({ onSelect, onClose }: IntentMenuProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full md:max-w-sm bg-white rounded-t-2xl md:rounded-2xl px-5 pt-5 pb-8 md:pb-5 space-y-2 shadow-xl">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide text-center mb-3">
          Que tipo de conteúdo é esse?
        </p>
        {INTENT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-blue-50 active:bg-blue-100 transition-colors text-left"
          >
            <span className="text-2xl">{opt.emoji}</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
              <p className="text-xs text-gray-400">{opt.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export const INTENT_LABELS: Record<string, string> = Object.fromEntries(
  INTENT_OPTIONS.map((o) => [o.value, o.label])
);
