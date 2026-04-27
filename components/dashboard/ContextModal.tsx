"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface ContextModalProps {
  photoPreviewUrl: string;
  onConfirm: (context: string) => void;
  onSkip: () => void;
  onClose: () => void;
}

const MAX_CHARS = 200;

export function ContextModal({ photoPreviewUrl, onConfirm, onSkip, onClose }: ContextModalProps) {
  const [context, setContext] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl px-5 pt-5 pb-8 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">
            Adicione contexto <span className="text-gray-400 font-normal">(opcional)</span>
          </p>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Preview da foto */}
        <div className="flex gap-3 items-start">
          <img
            src={photoPreviewUrl}
            alt="Foto selecionada"
            className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-gray-100"
          />
          <p className="text-xs text-gray-500 leading-relaxed pt-1">
            Descreva o serviço, material ou produto. A IA usa isso para refinar a copy.
          </p>
        </div>

        {/* Campo de contexto */}
        <div className="relative">
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value.slice(0, MAX_CHARS))}
            placeholder="Ex: revestimento em porcelanato, banheiro social, água quente e fria, pedra miracema..."
            rows={3}
            className="w-full text-sm rounded-xl border border-gray-200 px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300"
            autoFocus
          />
          <span className="absolute bottom-2 right-3 text-xs text-gray-300">
            {context.length}/{MAX_CHARS}
          </span>
        </div>

        {/* Ações */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onConfirm(context)}
            className="w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all"
          >
            Gerar copy
          </button>
          <button
            onClick={onSkip}
            className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Pular este passo
          </button>
        </div>
      </div>
    </div>
  );
}
