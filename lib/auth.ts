import Cookies from "js-cookie";
import { api } from "./api";

const COOKIE_NAME = "auth_token";
const COOKIE_OPTIONS = {
  expires: 7,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export interface User {
  id: string;
  email: string;
  name?: string;
  company_name?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  company_name: string;
}

export async function login(payload: LoginPayload): Promise<User> {
  const { data } = await api.post("/auth/login", {
    email: payload.email,
    password: payload.password,
  });

  Cookies.set(COOKIE_NAME, data.access_token, COOKIE_OPTIONS);

  const user = await getUser();
  return user;
}

export async function register(payload: RegisterPayload): Promise<User> {
  await api.post("/auth/register", payload);
  return login({ email: payload.email, password: payload.password });
}

export async function getUser(): Promise<User> {
  const { data } = await api.get("/auth/me");
  return data;
}

export function logout(): void {
  Cookies.remove(COOKIE_NAME);
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

export function getToken(): string | undefined {
  return Cookies.get(COOKIE_NAME);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
