"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { initAnalytics, identifyUser } from "@/lib/analytics";

export function PosthogProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    if (user?.id) identifyUser(user.id, user.email);
  }, [user]);

  return <>{children}</>;
}
