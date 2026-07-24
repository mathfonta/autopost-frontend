"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PartyPopper, Camera, CheckCircle, Bell, Sparkles } from "lucide-react";
import { subscribeToPush } from "@/lib/push";
import { getScoutStatus, acceptScoutSuggestion, type ScoutInsights } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

const SCOUT_POLL_INTERVAL_MS = 5000;
const SCOUT_POLL_MAX_ATTEMPTS = 12; // ~60s — o Scout roda em background; se demorar mais, o usuário só não vê a sugestão nesta sessão (AC2/AC6: nunca bloqueia)

export function StepComplete() {
  const router = useRouter();
  const { toast } = useToast();
  const [pushState, setPushState] = useState<"idle" | "asking" | "granted" | "denied">("idle");

  // Agente Scout (Epic 22, Story 22.5) — status é sempre um enriquecimento
  // opcional: nenhum estado aqui bloqueia os botões de navegação existentes.
  const [scoutAnalyzing, setScoutAnalyzing] = useState(false);
  const [scoutSuggestion, setScoutSuggestion] = useState<ScoutInsights | null>(null);
  const [scoutDismissed, setScoutDismissed] = useState(false);
  const [scoutAccepting, setScoutAccepting] = useState(false);
  const scoutAttempts = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const poll = async () => {
      if (cancelled) return;
      try {
        const status = await getScoutStatus();
        if (cancelled) return;

        if (status.scout_status === "pending" || status.scout_status === "running") {
          // "pending" é o default do banco para QUALQUER cliente, inclusive
          // quem nunca conectou o Instagram (ex.: clicou em "Conectar depois").
          // Só mostra o indicador quando a análise está de fato em andamento —
          // "pending" apenas continua fazendo polling em silêncio, sem exibir
          // nada enganoso para quem não tem nenhuma análise acontecendo.
          setScoutAnalyzing(status.scout_status === "running");
          scoutAttempts.current += 1;
          if (scoutAttempts.current < SCOUT_POLL_MAX_ATTEMPTS) {
            timer = setTimeout(poll, SCOUT_POLL_INTERVAL_MS);
          } else {
            setScoutAnalyzing(false); // desiste silenciosamente — AC6
          }
          return;
        }

        setScoutAnalyzing(false);
        if (status.scout_status === "done" && status.scout_insights?.suggested_segment) {
          setScoutSuggestion(status.scout_insights);
        }
        // skipped/failed: nada é exibido (AC5) — já é o estado padrão
      } catch {
        // Falha ao consultar o status nunca deve incomodar o usuário (AC5/AC6)
        setScoutAnalyzing(false);
      }
    };

    poll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const handleAcceptSuggestion = async () => {
    setScoutAccepting(true);
    try {
      await acceptScoutSuggestion();
      setScoutSuggestion(null); // sucesso: dispensa o card
    } catch {
      // Não há tela de configurações para ajustar o segmento depois — se a
      // aplicação falhar, mantém o card visível (com feedback) para o
      // usuário poder tentar de novo, em vez de dispensar silenciosamente.
      toast("Não foi possível aplicar o segmento agora. Tente novamente.", "error");
    } finally {
      setScoutAccepting(false);
    }
  };

  useEffect(() => {
    const requestPush = async () => {
      if (!("Notification" in window)) return;
      if (Notification.permission === "granted") {
        setPushState("granted");
        await subscribeToPush();
        return;
      }
      if (Notification.permission === "denied") {
        setPushState("denied");
        return;
      }
      // Solicitar permissão após onboarding concluído (AC6)
      setPushState("asking");
      const granted = await subscribeToPush();
      setPushState(granted ? "granted" : "denied");
    };

    const timer = setTimeout(requestPush, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6 text-center">
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
          <PartyPopper className="w-10 h-10 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Tudo pronto!</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Sua conta está configurada. Agora é só enviar fotos e aprovar os posts.
        </p>
      </div>

      {pushState === "granted" && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-left">
          <Bell className="w-4 h-4 text-green-600 flex-shrink-0" />
          <p className="text-xs text-green-700">
            Notificações ativas — você será avisado quando um post precisar de aprovação.
          </p>
        </div>
      )}

      {scoutAnalyzing && (
        <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-xl px-4 py-3 text-left">
          <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <p className="text-xs text-purple-700">
            Analisando seu perfil do Instagram para personalizar seu conteúdo…
          </p>
        </div>
      )}

      {scoutSuggestion?.suggested_segment && !scoutDismissed && (
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 text-left space-y-3">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-purple-900 leading-relaxed">
              Analisamos seus posts recentes e identificamos que seu negócio parece ser mais
              específico do que <strong>{scoutSuggestion.suggested_segment}</strong>
              {scoutSuggestion.refined_niche ? ` (${scoutSuggestion.refined_niche}).` : "."} Quer
              usar esse segmento para personalizar ainda mais seu conteúdo?
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAcceptSuggestion}
              disabled={scoutAccepting}
              className="flex-1 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold hover:bg-purple-700 disabled:opacity-60 transition-colors"
            >
              {scoutAccepting ? "Aplicando..." : "Usar este segmento"}
            </button>
            <button
              onClick={() => setScoutDismissed(true)}
              disabled={scoutAccepting}
              className="flex-1 py-2 text-purple-600 rounded-xl text-xs font-semibold hover:bg-purple-100 disabled:opacity-60 transition-colors"
            >
              Manter o meu
            </button>
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Como funciona
        </p>
        {[
          { icon: Camera, text: "Escolha o formato e envie a foto direto no app" },
          { icon: CheckCircle, text: "O AutoPost gera a legenda e processa a imagem" },
          { icon: CheckCircle, text: "Você aprova com um toque — o post vai ao ar" },
        ].map(({ icon: Icon, text }, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <p className="text-sm text-gray-700 leading-snug">{text}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push("/dashboard?action=new-post")}
        className="w-full py-3 bg-blue-600 text-white rounded-2xl font-semibold text-sm hover:bg-blue-700 transition-colors"
      >
        Criar meu primeiro post →
      </button>
      <button
        onClick={() => router.push("/dashboard")}
        className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        Explorar o dashboard primeiro
      </button>
    </div>
  );
}
