"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getContentRequests } from "@/lib/api";
import type { ContentRequest } from "@/lib/types";

export function useContentRequests() {
  const [posts, setPosts] = useState<ContentRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const activeRef = useRef(true);

  const refresh = useCallback(async () => {
    if (document.visibilityState === "hidden") return;
    try {
      const data = await getContentRequests();
      if (activeRef.current) {
        setPosts(data.items);
        setError(null);
      }
    } catch {
      if (activeRef.current) setError("Erro ao carregar posts. Tentando novamente...");
    } finally {
      if (activeRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    activeRef.current = true;
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => {
      activeRef.current = false;
      clearInterval(interval);
    };
  }, [refresh]);

  return { posts, error, loading, refresh };
}
