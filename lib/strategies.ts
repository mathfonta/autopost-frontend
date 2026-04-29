import type { PostTypeId } from "./post-types";

export type StrategyObjective =
  | "alcance"
  | "engajamento"
  | "saves"
  | "conversão"
  | "confiança"
  | "retenção";

export interface Strategy {
  id:        string;
  label:     string;
  desc:      string;
  objective: StrategyObjective;
  icon:      string;
}

export const STRATEGIES: Record<PostTypeId, Strategy[]> = {
  feed_photo: [
    { id: "prova_social",         label: "Prova Social",         desc: "Mostrar resultado ou entrega",         objective: "confiança",   icon: "✅" },
    { id: "ancora_de_marca",      label: "Âncora de Marca",      desc: "Reforçar identidade visual",           objective: "alcance",     icon: "🎯" },
    { id: "curiosidade_pergunta", label: "Curiosidade + Pergunta",desc: "Gerar comentários e debate",           objective: "engajamento", icon: "💬" },
    { id: "bastidores",           label: "Bastidores",            desc: "Humanizar a marca e a equipe",         objective: "retenção",    icon: "🎬" },
    { id: "hero_shot",            label: "Hero Shot",             desc: "Destacar produto ou serviço",          objective: "conversão",   icon: "⭐" },
  ],
  carousel: [
    { id: "antes_depois",  label: "Antes & Depois",    desc: "Transformação visual em sequência",    objective: "alcance",     icon: "↔️" },
    { id: "passo_a_passo", label: "Passo a Passo",     desc: "Tutorial numerado por slide",          objective: "saves",       icon: "📋" },
    { id: "erros_mitos",   label: "Erros / Mitos",     desc: "Corrigir equívocos do nicho",          objective: "engajamento", icon: "❌" },
    { id: "case_estudo",   label: "Case / Estudo",     desc: "Projeto real do início ao resultado",  objective: "confiança",   icon: "📊" },
    { id: "comparativo",   label: "Comparativo",       desc: "Opção A vs B para o público decidir",  objective: "engajamento", icon: "⚖️" },
    { id: "checklist",     label: "Checklist",         desc: "Lista de referência para salvar",      objective: "saves",       icon: "✔️" },
  ],
  reels: [
    { id: "hook_choque",           label: "Hook de Choque",         desc: "Frase bombástica nos primeiros 3s",    objective: "alcance",     icon: "⚡" },
    { id: "timelapse",             label: "Timelapse",               desc: "Transformação visual acelerada",       objective: "alcance",     icon: "⏩" },
    { id: "tutorial_pov",          label: "Tutorial POV",            desc: "\"POV: você me contrata e vê isso\"",  objective: "saves",       icon: "🎥" },
    { id: "trend_nicho",           label: "Trend + Nicho",           desc: "Áudio viral adaptado ao seu nicho",    objective: "alcance",     icon: "🔥" },
    { id: "bastidores_autenticos", label: "Bastidores Autênticos",   desc: "Processo real sem edição pesada",      objective: "confiança",   icon: "🎞️" },
    { id: "depoimento_video",      label: "Depoimento em Vídeo",     desc: "Cliente real falando sobre resultado", objective: "conversão",   icon: "🗣️" },
  ],
  story: [
    { id: "bastidores_dia",  label: "Bastidores do Dia", desc: "Sequência de 3-5 stories do dia a dia",  objective: "retenção",    icon: "📸" },
    { id: "enquete",         label: "Enquete",           desc: "Sticker de enquete com 2 opções",         objective: "engajamento", icon: "📊" },
    { id: "cta_link",        label: "CTA + Link",        desc: "Oferta ou serviço com link direto",       objective: "conversão",   icon: "🔗" },
    { id: "countdown",       label: "Countdown / Urgência", desc: "Sticker de contagem regressiva",      objective: "conversão",   icon: "⏳" },
    { id: "caixa_perguntas", label: "Caixa de Perguntas", desc: "\"Me manda sua dúvida sobre X\"",       objective: "engajamento", icon: "❓" },
    { id: "repost_feed",     label: "Repost do Feed",    desc: "Re-share do post publicado no feed",      objective: "alcance",     icon: "🔄" },
  ],
};

export const OBJECTIVE_LABELS: Record<StrategyObjective, string> = {
  alcance:     "Alcance",
  engajamento: "Engajamento",
  saves:       "Salvamentos",
  conversão:   "Conversão",
  confiança:   "Confiança",
  retenção:    "Retenção",
};

export const OBJECTIVE_COLORS: Record<StrategyObjective, { color: string; bg: string }> = {
  alcance:     { color: "#2354E8", bg: "#EEF2FF" },
  engajamento: { color: "#D97706", bg: "#FEF3C7" },
  saves:       { color: "#16A34A", bg: "#DCFCE7" },
  conversão:   { color: "#DC2626", bg: "#FEE2E2" },
  confiança:   { color: "#7C3AED", bg: "#EDE9FE" },
  retenção:    { color: "#0891B2", bg: "#CFFAFE" },
};
