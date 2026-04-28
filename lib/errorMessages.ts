import type { ContentRequest } from "./types";

interface ErrorInfo {
  message: string;
  stage: string;
  hint: string;
}

const RULES: Array<{ pattern: RegExp; message: string; hint: string }> = [
  {
    pattern: /token.*expir|expir.*token|token meta/i,
    message: "Token do Instagram expirado",
    hint: "Acesse Configurações → Redes Sociais para renovar.",
  },
  {
    pattern: /JSONDecodeError|json.*decode|Expecting value|invalid.*json/i,
    message: "A IA retornou uma resposta inesperada",
    hint: "Isso é temporário. Tente postar a foto novamente.",
  },
  {
    pattern: /timeout|timed out|time.?out/i,
    message: "O processamento demorou mais que o esperado",
    hint: "Geralmente acontece com fotos muito grandes. Tente uma foto menor.",
  },
  {
    pattern: /rate.?limit|quota|too many request/i,
    message: "Limite de requisições atingido",
    hint: "Aguarde alguns minutos e tente novamente.",
  },
  {
    pattern: /connection|network|connect|conexão/i,
    message: "A conexão caiu durante o processamento",
    hint: "Verifique sua internet e tente novamente.",
  },
  {
    pattern: /instagram|meta.*api|graph.*api|MetaAPI/i,
    message: "Erro na comunicação com o Instagram",
    hint: "O Instagram pode estar fora do ar. Tente em alguns minutos.",
  },
  {
    pattern: /storage|R2|S3|boto|armazenamento/i,
    message: "Erro ao armazenar a imagem",
    hint: "Problema temporário de armazenamento. Tente novamente.",
  },
  {
    pattern: /design|pillow|PIL|imag.*process/i,
    message: "Erro ao processar o design da imagem",
    hint: "Tente com uma foto em formato JPEG ou PNG.",
  },
  {
    pattern: /copy|caption|legenda|copywriter/i,
    message: "Erro ao gerar o texto do post",
    hint: "Isso é temporário. Tente postar a foto novamente.",
  },
  {
    pattern: /analys|analise|analyzer|photo.*analys/i,
    message: "Erro ao analisar a foto",
    hint: "A foto pode estar muito escura ou sem detalhes. Tente outra.",
  },
];

function detectStage(post: ContentRequest): string {
  if (!post.analysis_result) return "na análise da foto";
  if (!post.copy_result) return "na geração do texto";
  if (!post.design_result) return "no processamento do design";
  return "na publicação";
}

export function getErrorInfo(post: ContentRequest): ErrorInfo {
  const raw = post.error_message ?? "";
  const stage = detectStage(post);

  for (const rule of RULES) {
    if (rule.pattern.test(raw)) {
      return { message: rule.message, stage, hint: rule.hint };
    }
  }

  return {
    message: "Algo deu errado " + stage,
    hint: "Tente postar a foto novamente.",
    stage,
  };
}
