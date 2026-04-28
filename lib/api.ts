import axios from "axios";
import Cookies from "js-cookie";
import type { ContentRequest, ContentRequestListResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function getContentRequests(page = 1): Promise<ContentRequestListResponse> {
  const { data } = await api.get<ContentRequestListResponse>("/content-requests", {
    params: { page, page_size: 20 },
  });
  return data;
}

export async function getContentRequest(id: string): Promise<ContentRequest> {
  const { data } = await api.get<ContentRequest>(`/content-requests/${id}`);
  return data;
}

export async function approveContentRequest(id: string): Promise<void> {
  await api.post(`/content-requests/${id}/approve`);
}

export async function rejectContentRequest(id: string, reason?: string): Promise<void> {
  await api.post(`/content-requests/${id}/reject`, { reason: reason || null });
}

export async function patchContentRequest(id: string, caption: string): Promise<ContentRequest> {
  const { data } = await api.patch<ContentRequest>(`/content-requests/${id}`, { caption });
  return data;
}

export async function selectCaptionVariant(
  id: string,
  caption_selected: "long" | "short" | "stories",
  caption: string,
): Promise<ContentRequest> {
  const { data } = await api.patch<ContentRequest>(`/content-requests/${id}`, {
    caption_selected,
    caption,
  });
  return data;
}

export async function retryContentRequest(id: string): Promise<{ id: string; status: string; retry_count: number }> {
  const { data } = await api.post(`/content-requests/${id}/retry`);
  return data;
}

// ─── Onboarding ─────────────────────────────────────────────────

export interface OnboardingStatus {
  status: "not_started" | "in_progress" | "done";
  brand_profile?: Record<string, unknown>;
}

export interface OnboardingReply {
  reply: string;
  done: boolean;
}

export async function getOnboardingStatus(): Promise<OnboardingStatus> {
  const { data } = await api.get<OnboardingStatus>("/onboarding/status");
  return data;
}

export async function startOnboarding(): Promise<OnboardingReply> {
  const { data } = await api.post<OnboardingReply>("/onboarding/start");
  return data;
}

export async function sendOnboardingMessage(message: string): Promise<OnboardingReply> {
  const { data } = await api.post<OnboardingReply>("/onboarding/message", { message });
  return data;
}

// ─── Meta / Instagram ───────────────────────────────────────────

export interface MetaStatus {
  connected: boolean;
  instagram_username: string | null;
  facebook_page_name: string | null;
  token_expires_at: string | null;
  days_until_expiry: number | null;
  token_expiring_soon: boolean;
}

export async function refreshMetaToken(): Promise<{ renewed: boolean; token_expires_at: string; days_until_expiry: number }> {
  const { data } = await api.post("/meta/refresh");
  return data;
}

export async function getMetaConnectUrl(): Promise<string> {
  const { data } = await api.get<{ auth_url: string }>("/meta/connect");
  return data.auth_url;
}

export async function getMetaStatus(): Promise<MetaStatus> {
  const { data } = await api.get<MetaStatus>("/meta/status");
  return data;
}

// ─── Perfil ──────────────────────────────────────────────────────

export async function updateProfile(voice_tone: string): Promise<void> {
  await api.patch("/auth/profile", { voice_tone });
}

// ─── Content requests ────────────────────────────────────────────

export async function deleteContentRequest(id: string): Promise<void> {
  await api.delete(`/content-requests/${id}`);
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("auth_token");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
