"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBestPostingTime, type BestPostingTime } from "@/lib/api";

const MAX_SCHEDULE_DAYS = 30;

const FONTE_LABEL: Partial<Record<BestPostingTime["fonte"], string>> = {
  historico: "baseado no seu histórico de posts",
  exa: "baseado em boas práticas do seu nicho",
};

interface ScheduleModalProps {
  onConfirm: (scheduledForISO: string) => void;
  onCancel: () => void;
  loading: boolean;
  initialSuggestedTime?: string | null; // copy_result.suggested_time, formato "HH:MM"
  contentType?: string | null;
}

/** Próxima ocorrência de HH:MM a partir de agora (hoje, ou amanhã se já passou). */
function nextOccurrence(hhmm: string): Date {
  const [h, m] = hhmm.split(":").map(Number);
  const now = new Date();
  const candidate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
  if (candidate <= now) candidate.setDate(candidate.getDate() + 1);
  return candidate;
}

/** Formata um Date para o formato aceito por <input type="datetime-local">. */
function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function ScheduleModal({
  onConfirm,
  onCancel,
  loading,
  initialSuggestedTime,
  contentType,
}: ScheduleModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  const [value, setValue] = useState(() =>
    toDatetimeLocalValue(nextOccurrence(initialSuggestedTime || "19:00"))
  );
  const [suggestion, setSuggestion] = useState<BestPostingTime | null>(null);
  const [userEdited, setUserEdited] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Busca sugestão refinada (histórico/Exa); se o usuário ainda não mexeu no
  // campo, atualiza o valor com o horário mais preciso quando chegar.
  useEffect(() => {
    let cancelled = false;
    getBestPostingTime(contentType || undefined)
      .then((data) => {
        if (cancelled) return;
        setSuggestion(data);
        // "sem_dados" não traz horário real — mantém o default silencioso
        // já preenchido (copy_result.suggested_time ou 19:00), só a partir
        // de fonte real (histórico/Exa) o valor do campo é atualizado.
        if (!userEdited && data.horario) {
          setValue(toDatetimeLocalValue(nextOccurrence(data.horario)));
        }
      })
      .catch(() => {
        // Falha silenciosa — já temos o default de copy_result.suggested_time
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onCancel();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserEdited(true);
    setValue(e.target.value);
    setError(null);
  };

  const handleConfirm = () => {
    if (!value) {
      setError("Escolha uma data e horário.");
      return;
    }
    const chosen = new Date(value);
    const now = new Date();
    const maxDate = new Date(now.getTime() + MAX_SCHEDULE_DAYS * 24 * 60 * 60 * 1000);

    if (chosen <= now) {
      setError("O horário precisa ser no futuro.");
      return;
    }
    if (chosen > maxDate) {
      setError(`Não é possível agendar mais de ${MAX_SCHEDULE_DAYS} dias à frente.`);
      return;
    }
    onConfirm(chosen.toISOString());
  };

  // Enquanto a análise real (histórico/Exa) não chega, não mostra nenhum
  // horário como se fosse recomendação — o valor inicial do campo (baseado
  // em copy_result.suggested_time) é só um palpite de conveniência para
  // pré-preencher o seletor, nunca apresentado como análise de dados.
  const reasonText = suggestion
    ? suggestion.fonte === "sem_dados"
      ? suggestion.mensagem
      : `Sugerido: ${suggestion.horario} — ${FONTE_LABEL[suggestion.fonte]}`
    : "Calculando o melhor horário com base nos seus dados...";

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
            <Calendar className="h-5 w-5 text-blue-600" />
            Agendar publicação
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {reasonText && (
          <p className="mb-3 text-sm text-gray-600">{reasonText}</p>
        )}

        <label className="block text-xs font-semibold text-gray-500 mb-1.5">
          Data e horário
        </label>
        <input
          type="datetime-local"
          value={value}
          onChange={handleChange}
          disabled={loading}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <div className="flex gap-3 mt-5">
          <Button variant="outline" className="flex-1" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="default" className="flex-1" loading={loading} onClick={handleConfirm}>
            Agendar
          </Button>
        </div>
      </div>
    </div>
  );
}
