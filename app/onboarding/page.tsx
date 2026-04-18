"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProgressBar } from "@/components/onboarding/ProgressBar";
import { StepBrandProfile } from "@/components/onboarding/StepBrandProfile";
import { StepConnectInstagram } from "@/components/onboarding/StepConnectInstagram";
import { StepComplete } from "@/components/onboarding/StepComplete";
import { getOnboardingStatus, getMetaStatus } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

const STEPS = ["Perfil da Marca", "Instagram", "Concluído"];

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [step, setStep] = useState(0);
  const [connectedUsername, setConnectedUsername] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        // Se onboarding já concluído, redirecionar ao dashboard
        const status = await getOnboardingStatus();
        if (status.status === "done") {
          // Verificar também se Instagram está conectado — se sim, onboarding realmente completo
          const meta = await getMetaStatus();
          if (meta.connected) {
            router.replace("/dashboard");
            return;
          }
        }

        // Retorno do OAuth Meta: ?connected=true&username=xxx
        const connected = searchParams.get("connected");
        const username = searchParams.get("username");
        if (connected === "true" && username) {
          setConnectedUsername(username);
          setStep(2); // pula para etapa Concluído
          toast(`Instagram @${username} conectado com sucesso!`);
          return;
        }

        // Retornar à etapa onde parou
        if (status.status === "in_progress") {
          setStep(1); // brand profile enviado, falta instagram
        }

        // Verificar se já tem Instagram conectado
        const meta = await getMetaStatus();
        if (meta.connected) {
          setConnectedUsername(meta.instagram_username);
          setStep(2);
        }
      } catch {
        // Se não autenticado, middleware já redireciona
      } finally {
        setChecking(false);
      }
    };
    init();
  }, []);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <h1 className="text-lg font-bold text-gray-900">AutoPost</h1>
        <p className="text-xs text-gray-400 mt-0.5">Configuração inicial</p>
      </header>

      <main className="flex-1 px-6 py-8 max-w-md mx-auto w-full">
        {/* Progress */}
        <div className="mb-8">
          <ProgressBar currentStep={step} steps={STEPS} />
        </div>

        {/* Step content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {step === 0 && (
            <>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Perfil da sua marca</h2>
              <p className="text-sm text-gray-500 mb-6">
                Essas informações ajudam o AutoPost a criar posts no tom certo para sua empresa.
              </p>
              <StepBrandProfile onNext={() => setStep(1)} />
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Conectar Instagram</h2>
              <p className="text-sm text-gray-500 mb-6">
                Autorize o AutoPost a publicar em seu perfil Business do Instagram.
              </p>
              <StepConnectInstagram
                connectedUsername={connectedUsername}
                onNext={() => setStep(2)}
                onSkip={() => setStep(2)}
              />
            </>
          )}

          {step === 2 && <StepComplete />}
        </div>
      </main>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense>
      <OnboardingContent />
    </Suspense>
  );
}
