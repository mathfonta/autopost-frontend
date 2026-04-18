"use client";

import { useRouter } from "next/navigation";
import { PartyPopper, Camera, CheckCircle } from "lucide-react";

export function StepComplete() {
  const router = useRouter();

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

      <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Como funciona
        </p>
        {[
          { icon: Camera, text: "Tire uma foto e envie via WhatsApp ou API" },
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
        onClick={() => router.push("/dashboard")}
        className="w-full py-3 bg-blue-600 text-white rounded-2xl font-semibold text-sm hover:bg-blue-700 transition-colors"
      >
        Ir para o Dashboard
      </button>
    </div>
  );
}
