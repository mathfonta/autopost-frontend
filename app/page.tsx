"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const type = params.get("type");

    if (type === "recovery") {
      // Link de reset de senha — preserva o hash completo com o token
      router.replace(`/reset-password${window.location.hash}`);
    } else {
      router.replace("/login");
    }
  }, [router]);

  return null;
}
