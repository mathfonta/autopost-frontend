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
  };
}

export const INTENTS: Intent[] = [
  {
    id: "gerar_orcamentos",
    label: "Gerar orçamentos",
    description: "Transformar visitantes em contatos qualificados",
    icon: "💰",
    recommendation: { postTypeId: "feed_photo", strategyId: "prova_social", reason: "Resultado entregue + CTA de orçamento é o caminho mais direto para conversão" },
  },
  {
    id: "ganhar_seguidores",
    label: "Ganhar seguidores",
    description: "Aumentar o alcance e crescimento do perfil",
    icon: "📈",
    recommendation: { postTypeId: "reels", strategyId: "hook_choque", reason: "Reels com hook forte têm o maior alcance orgânico da plataforma" },
  },
  {
    id: "aumentar_engajamento",
    label: "Aumentar engajamento",
    description: "Gerar mais comentários, salvamentos e compartilhamentos",
    icon: "💬",
    recommendation: { postTypeId: "carousel", strategyId: "comparativo", reason: "Carrossel comparativo gera mais comentários e salvamentos" },
  },
  {
    id: "construir_autoridade",
    label: "Construir autoridade",
    description: "Ser reconhecido como especialista no nicho",
    icon: "🏆",
    recommendation: { postTypeId: "carousel", strategyId: "passo_a_passo", reason: "Tutorial técnico posiciona como especialista e gera saves" },
  },
  {
    id: "manter_ativo",
    label: "Manter perfil ativo",
    description: "Publicar com consistência sem muito esforço",
    icon: "📅",
    recommendation: { postTypeId: "story", strategyId: "bastidores_dia", reason: "Baixo esforço de produção, alta frequência possível" },
  },
];
