import type { ReactNode } from "react";

export type PostTypeId = "feed_photo" | "carousel" | "reels" | "story";

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
    id: "feed_photo",
    label: "Feed Photo",
    sub: "Imagem única no feed",
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
    id: "carousel",
    label: "Carrossel",
    sub: "Até 10 fotos em sequência",
    color: "#D97706",
    bg: "#FEF3C7",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="14" height="14" rx="2" />
        <path d="M18 9h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-2" />
      </svg>
    ),
  },
  {
    id: "reels",
    label: "Reels",
    sub: "Vídeo curto até 3 minutos",
    color: "#DC2626",
    bg: "#FEE2E2",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
  },
  {
    id: "story",
    label: "Story",
    sub: "Desaparece em 24 horas",
    color: "#7C3AED",
    bg: "#EDE9FE",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <line x1="12" y1="18" x2="12" y2="18.01" />
      </svg>
    ),
  },
];

export const POST_TYPE_MAP = Object.fromEntries(
  POST_TYPES.map((p) => [p.id, p])
) as Record<PostTypeId, PostType>;
