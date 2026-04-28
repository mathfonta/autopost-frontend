import type { ReactNode } from "react";

export type PostTypeId =
  | "post_simples"
  | "obra_andamento"
  | "obra_concluida"
  | "engajamento"
  | "bastidores";

export interface PostType {
  id:    PostTypeId;
  label: string;
  sub:   string;
  color: string;
  bg:    string;
  icon:  ReactNode;
}

export const POST_TYPES: PostType[] = [
  {
    id: "post_simples",
    label: "Post Simples",
    sub: "Publicação de obra ou produto",
    color: "#2354E8",
    bg: "#EEF2FF",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    id: "obra_andamento",
    label: "Obra em Andamento",
    sub: "Progresso do projeto",
    color: "#D97706",
    bg: "#FEF3C7",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    id: "obra_concluida",
    label: "Obra Concluída",
    sub: "Resultado final entregue",
    color: "#16A34A",
    bg: "#DCFCE7",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    id: "engajamento",
    label: "Engajamento",
    sub: "Pergunta ou enquete",
    color: "#7C3AED",
    bg: "#EDE9FE",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: "bastidores",
    label: "Bastidores",
    sub: "Equipe ou processo",
    color: "#DB2777",
    bg: "#FCE7F3",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export const POST_TYPE_MAP = Object.fromEntries(
  POST_TYPES.map((p) => [p.id, p])
) as Record<PostTypeId, PostType>;
