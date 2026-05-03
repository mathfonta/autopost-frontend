"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register as registerUser } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  company_name: z.string().min(2, "Nome da empresa obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setServerError(null);
    try {
      await registerUser(data);
      router.push("/onboarding");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setServerError(message || "Erro ao criar conta. Tente novamente.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--bg-page) px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">AutoPost</h1>
          <p className="text-(--text-2) text-sm mt-1">Comece a publicar automaticamente</p>
        </div>

        <div className="bg-(--bg-card) rounded-2xl shadow-sm border border-(--border) p-6">
          <h2 className="text-xl font-semibold text-(--text-1) mb-6">Criar conta</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Seu nome</Label>
              <Input
                id="name"
                placeholder="João Silva"
                autoComplete="name"
                error={errors.name?.message}
                {...register("name")}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="company_name">Nome da empresa</Label>
              <Input
                id="company_name"
                placeholder="Construtora Exemplo"
                error={errors.company_name?.message}
                {...register("company_name")}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register("email")}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
                error={errors.password?.message}
                {...register("password")}
              />
            </div>

            {serverError && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                {serverError}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={isSubmitting}
            >
              Criar conta
            </Button>
          </form>

          <p className="text-center text-sm text-(--text-2) mt-4">
            Já tem conta?{" "}
            <Link href="/login" className="text-blue-600 font-medium hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
