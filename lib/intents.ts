import type { PostTypeId } from "./post-types";

export type MarketingIntent =
  | "gerar_orcamentos"
  | "ganhar_seguidores"
  | "aumentar_engajamento"
  | "construir_autoridade"
  | "manter_ativo";

export interface Intent {
  id:          MarketingIntent;
  label:       string;
  description: string;
  icon:        string;
  recommendation: {
    postTypeId: PostTypeId;
    strategyId: string;
    reason:     string;
    byFormat:   Partial<Record<PostTypeId, string>>;
  };
}

export const INTENTS: Intent[] = [
  {
    id: "gerar_orcamentos",
    label: "Gerar orçamentos",
    description: "Transformar visitantes em contatos qualificados",
    icon: "💰",
    recommendation: {
      postTypeId: "feed_photo",
      strategyId: "prova_social",
      reason: "Resultado entregue + CTA de orçamento é o caminho mais direto para conversão",
      byFormat: {
        feed_photo: "prova_social",
        carousel:   "case_estudo",
        reels:      "depoimento_video",
        story:      "cta_link",
      },
    },
  },
  {
    id: "ganhar_seguidores",
    label: "Ganhar seguidores",
    description: "Aumentar o alcance e crescimento do perfil",
    icon: "📈",
    recommendation: {
      postTypeId: "reels",
      strategyId: "hook_choque",
      reason: "Reels com hook forte têm o maior alcance orgânico da plataforma",
      byFormat: {
        feed_photo: "ancora_de_marca",
        carousel:   "erros_mitos",
        reels:      "hook_choque",
        story:      "repost_feed",
      },
    },
  },
  {
    id: "aumentar_engajamento",
    label: "Aumentar engajamento",
    description: "Gerar mais comentários, salvamentos e compartilhamentos",
    icon: "💬",
    recommendation: {
      postTypeId: "carousel",
      strategyId: "comparativo",
      reason: "Carrossel comparativo gera mais comentários e salvamentos",
      byFormat: {
        feed_photo: "curiosidade_pergunta",
        carousel:   "comparativo",
        reels:      "trend_nicho",
        story:      "caixa_perguntas",
      },
    },
  },
  {
    id: "construir_autoridade",
    label: "Construir autoridade",
    description: "Ser reconhecido como especialista no nicho",
    icon: "🏆",
    recommendation: {
      postTypeId: "carousel",
      strategyId: "passo_a_passo",
      reason: "Tutorial técnico posiciona como especialista e gera saves",
      byFormat: {
        feed_photo: "bastidores",
        carousel:   "passo_a_passo",
        reels:      "tutorial_pov",
        story:      "bastidores_dia",
      },
    },
  },
  {
    id: "manter_ativo",
    label: "Manter perfil ativo",
    description: "Publicar com consistência sem muito esforço",
    icon: "📅",
    recommendation: {
      postTypeId: "story",
      strategyId: "bastidores_dia",
      reason: "Baixo esforço de produção, alta frequência possível",
      byFormat: {
        feed_photo: "hero_shot",
        carousel:   "checklist",
        reels:      "bastidores_autenticos",
        story:      "bastidores_dia",
      },
    },
  },
];
