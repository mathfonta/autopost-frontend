import type { PostTypeId } from "./post-types";

export type StrategyObjective =
  | "alcance"
  | "engajamento"
  | "saves"
  | "conversão"
  | "confiança"
  | "retenção";

export interface Strategy {
  id:             string;
  label:          string;
  desc:           string;
  objective:      StrategyObjective;
  icon:           string;
  when_to_use:    string;
  input_needed:   string;
  output_example: string;
}

export const STRATEGIES: Record<PostTypeId, Strategy[]> = {
  feed_photo: [
    {
      id: "prova_social", label: "Prova Social", desc: "Mostrar resultado ou entrega", objective: "confiança", icon: "✅",
      when_to_use:    "Após entregar um serviço ou projeto concluído",
      input_needed:   "Foto do resultado final + nome da cidade",
      output_example: "Mais um banheiro entregue em Joinville. Cada detalhe, nosso padrão.",
    },
    {
      id: "ancora_de_marca", label: "Âncora de Marca", desc: "Reforçar identidade visual", objective: "alcance", icon: "🎯",
      when_to_use:    "Quando quer reforçar o posicionamento da empresa",
      input_needed:   "Foto com identidade visual da marca",
      output_example: "Qualidade não é sorte. É o nosso processo.",
    },
    {
      id: "curiosidade_pergunta", label: "Curiosidade + Pergunta", desc: "Gerar comentários e debate", objective: "engajamento", icon: "💬",
      when_to_use:    "Quando quer gerar comentários e debate",
      input_needed:   "Qualquer foto relacionada ao nicho",
      output_example: "Você sabia que 70% das reformas atrasam por falta de planejamento?",
    },
    {
      id: "bastidores", label: "Bastidores", desc: "Humanizar a marca e a equipe", objective: "retenção", icon: "🎬",
      when_to_use:    "Quando quer humanizar a marca e mostrar o processo",
      input_needed:   "Foto da equipe ou do trabalho em andamento",
      output_example: "Por trás de cada entrega existe uma equipe que chegou cedo.",
    },
    {
      id: "hero_shot", label: "Hero Shot", desc: "Destacar produto ou serviço", objective: "conversão", icon: "⭐",
      when_to_use:    "Quando tem uma foto de alta qualidade do produto/serviço",
      input_needed:   "Melhor foto do trabalho, boa iluminação",
      output_example: "Acabamento premium. Do rascunho à entrega em 21 dias.",
    },
  ],
  carousel: [
    {
      id: "antes_depois", label: "Antes & Depois", desc: "Transformação visual em sequência", objective: "alcance", icon: "↔️",
      when_to_use:    "Quando tem fotos do antes e depois de um projeto",
      input_needed:   "Mínimo 2 fotos: estado inicial + resultado",
      output_example: "Impossível virou entregue. Desliza para ver a transformação.",
    },
    {
      id: "passo_a_passo", label: "Passo a Passo", desc: "Tutorial numerado por slide", objective: "saves", icon: "📋",
      when_to_use:    "Quando quer ensinar algo do seu processo",
      input_needed:   "Fotos de cada etapa do trabalho",
      output_example: "5 passos que seguimos em toda obra — salva esse post.",
    },
    {
      id: "erros_mitos", label: "Erros / Mitos", desc: "Corrigir equívocos do nicho", objective: "engajamento", icon: "❌",
      when_to_use:    "Quando quer corrigir equívocos comuns do nicho",
      input_needed:   "Qualquer foto do contexto de trabalho",
      output_example: "3 erros que encarecem qualquer reforma. O 2º ninguém fala.",
    },
    {
      id: "case_estudo", label: "Case / Estudo", desc: "Projeto real do início ao resultado", objective: "confiança", icon: "📊",
      when_to_use:    "Quando tem um projeto com resultado mensurável",
      input_needed:   "Fotos do projeto + dados do resultado",
      output_example: "Cliente queria reformar em 30 dias. Entregamos em 22.",
    },
    {
      id: "comparativo", label: "Comparativo", desc: "Opção A vs B para o público decidir", objective: "engajamento", icon: "⚖️",
      when_to_use:    "Quando quer ajudar o cliente a decidir entre opções",
      input_needed:   "Fotos de duas versões ou materiais",
      output_example: "Cerâmica ou porcelanato? Desliza e decide o que faz mais sentido.",
    },
    {
      id: "checklist", label: "Checklist", desc: "Lista de referência para salvar", objective: "saves", icon: "✔️",
      when_to_use:    "Quando quer ser referência e gerar salvamentos",
      input_needed:   "Foto de contexto do nicho",
      output_example: "Checklist da reforma: o que conferir antes de assinar o contrato.",
    },
  ],
  reels: [
    {
      id: "hook_choque", label: "Hook de Choque", desc: "Frase bombástica nos primeiros 3s", objective: "alcance", icon: "⚡",
      when_to_use:    "Quando tem vídeo com algo surpreendente nos primeiros 3s",
      input_needed:   "Vídeo com elemento de surpresa no início",
      output_example: "90% das pessoas cometem esse erro na reforma. Você faz isso?",
    },
    {
      id: "timelapse", label: "Timelapse", desc: "Transformação visual acelerada", objective: "alcance", icon: "⏩",
      when_to_use:    "Quando tem gravação acelerada de uma transformação",
      input_needed:   "Vídeo timelapse do trabalho",
      output_example: "De obra bruta a entregue em 47 segundos.",
    },
    {
      id: "tutorial_pov", label: "Tutorial POV", desc: "\"POV: você me contrata e vê isso\"", objective: "saves", icon: "🎥",
      when_to_use:    "Quando quer mostrar o processo na perspectiva do cliente",
      input_needed:   "Vídeo mostrando execução do serviço",
      output_example: "POV: você me contrata e recebe isso no final.",
    },
    {
      id: "trend_nicho", label: "Trend + Nicho", desc: "Áudio viral adaptado ao seu nicho", objective: "alcance", icon: "🔥",
      when_to_use:    "Quando quer usar um áudio viral adaptado ao nicho",
      input_needed:   "Qualquer vídeo do trabalho",
      output_example: "Quando o cliente fala 'capricha no acabamento' e a gente capricha de verdade 🏆",
    },
    {
      id: "bastidores_autenticos", label: "Bastidores Autênticos", desc: "Processo real sem edição pesada", objective: "confiança", icon: "🎞️",
      when_to_use:    "Quando quer mostrar o dia real sem edição pesada",
      input_needed:   "Vídeo espontâneo do dia a dia",
      output_example: "Ninguém mostra isso. Mas é assim que começa toda entrega nossa.",
    },
    {
      id: "depoimento_video", label: "Depoimento em Vídeo", desc: "Cliente real falando sobre resultado", objective: "conversão", icon: "🗣️",
      when_to_use:    "Quando tem vídeo de cliente falando sobre o resultado",
      input_needed:   "Vídeo com depoimento real do cliente",
      output_example: "\"Não esperava esse resultado.\" — cliente real, projeto real.",
    },
  ],
  story: [
    {
      id: "bastidores_dia", label: "Bastidores do Dia", desc: "Sequência de 3-5 stories do dia a dia", objective: "retenção", icon: "📸",
      when_to_use:    "Quando quer mostrar o dia a dia da equipe",
      input_needed:   "Foto ou vídeo curto do trabalho no dia",
      output_example: "No campo desde cedo. ☀️",
    },
    {
      id: "enquete", label: "Enquete", desc: "Sticker de enquete com 2 opções", objective: "engajamento", icon: "📊",
      when_to_use:    "Quando quer saber a opinião do público",
      input_needed:   "Qualquer foto de contexto",
      output_example: "Qual material você prefere? A: Madeira / B: Porcelanato",
    },
    {
      id: "cta_link", label: "CTA + Link", desc: "Oferta ou serviço com link direto", objective: "conversão", icon: "🔗",
      when_to_use:    "Quando tem uma oferta ou serviço com link",
      input_needed:   "Foto do serviço ou produto em promoção",
      output_example: "Orçamento grátis só esta semana. 👇 Clica no link da bio.",
    },
    {
      id: "countdown", label: "Countdown / Urgência", desc: "Sticker de contagem regressiva", objective: "conversão", icon: "⏳",
      when_to_use:    "Quando tem uma oferta ou prazo real acabando",
      input_needed:   "Foto de contexto da oferta",
      output_example: "Últimas vagas deste mês. ⏳ Conta regressiva no story.",
    },
    {
      id: "caixa_perguntas", label: "Caixa de Perguntas", desc: "\"Me manda sua dúvida sobre X\"", objective: "engajamento", icon: "❓",
      when_to_use:    "Quando quer coletar dúvidas do público",
      input_needed:   "Qualquer foto do contexto de trabalho",
      output_example: "Me manda sua dúvida sobre reforma — respondo aqui.",
    },
    {
      id: "repost_feed", label: "Repost do Feed", desc: "Re-share do post publicado no feed", objective: "alcance", icon: "🔄",
      when_to_use:    "Quando acabou de publicar no feed e quer ampliar",
      input_needed:   "Screenshot ou imagem do post publicado",
      output_example: "Acabei de postar — não deixa de ver esse 👆",
    },
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
