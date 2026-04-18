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
