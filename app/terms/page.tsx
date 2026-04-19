import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Serviço — AutoPost",
  description: "Termos e condições de uso do AutoPost.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/login" className="text-blue-600 font-semibold text-lg hover:underline">
            AutoPost
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Termos de Serviço</h1>
            <p className="text-gray-500 text-sm mt-2">Última atualização: 19 de abril de 2026</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">1. Aceitação dos termos</h2>
            <p className="text-gray-600 leading-relaxed">
              Ao criar uma conta ou utilizar o AutoPost, você concorda com estes Termos de Serviço.
              Se você não concordar com qualquer parte destes termos, não utilize o serviço.
              O AutoPost é operado por Matheus Fontanella Augusto ("nós", "nosso").
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">2. Descrição do serviço</h2>
            <p className="text-gray-600 leading-relaxed">
              O AutoPost é uma plataforma de automação de publicações no Instagram que permite:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex gap-2"><span className="text-blue-500 mt-1">•</span><span>Enviar fotos para análise e geração automática de legendas via inteligência artificial.</span></li>
              <li className="flex gap-2"><span className="text-blue-500 mt-1">•</span><span>Revisar e aprovar o conteúdo antes da publicação.</span></li>
              <li className="flex gap-2"><span className="text-blue-500 mt-1">•</span><span>Publicar posts automaticamente na conta do Instagram Business conectada.</span></li>
              <li className="flex gap-2"><span className="text-blue-500 mt-1">•</span><span>Acompanhar o histórico e métricas das publicações.</span></li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">3. Elegibilidade e cadastro</h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex gap-2"><span className="text-blue-500 mt-1">•</span><span>Você deve ter pelo menos 18 anos para usar o AutoPost.</span></li>
              <li className="flex gap-2"><span className="text-blue-500 mt-1">•</span><span>Você deve possuir uma conta no Instagram Business ou Creator válida.</span></li>
              <li className="flex gap-2"><span className="text-blue-500 mt-1">•</span><span>Você é responsável por manter a segurança das suas credenciais de acesso.</span></li>
              <li className="flex gap-2"><span className="text-blue-500 mt-1">•</span><span>Cada conta AutoPost corresponde a um único perfil Instagram.</span></li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">4. Uso aceitável</h2>
            <p className="text-gray-600">Ao usar o AutoPost, você concorda em NÃO:</p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex gap-2"><span className="text-red-400 mt-1">•</span><span>Publicar conteúdo que viole as <a href="https://help.instagram.com/477434105621119" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Diretrizes da Comunidade do Instagram</a> ou as <a href="https://developers.facebook.com/terms/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Políticas da Plataforma Meta</a>.</span></li>
              <li className="flex gap-2"><span className="text-red-400 mt-1">•</span><span>Publicar conteúdo ilegal, difamatório, obsceno, fraudulento ou que infrinja direitos de terceiros.</span></li>
              <li className="flex gap-2"><span className="text-red-400 mt-1">•</span><span>Usar o serviço para spam, automação em massa não autorizada ou manipulação de métricas.</span></li>
              <li className="flex gap-2"><span className="text-red-400 mt-1">•</span><span>Tentar acessar dados de outros usuários ou comprometer a segurança da plataforma.</span></li>
              <li className="flex gap-2"><span className="text-red-400 mt-1">•</span><span>Usar o serviço de forma que viole os termos de uso do Instagram ou do Facebook.</span></li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">5. Conteúdo do usuário</h2>
            <p className="text-gray-600 leading-relaxed">
              Você mantém todos os direitos sobre o conteúdo que envia ao AutoPost. Ao enviar conteúdo,
              você nos concede uma licença limitada, não exclusiva e revogável para processar, armazenar
              e publicar esse conteúdo exclusivamente para prestar o serviço contratado.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Você declara e garante que possui todos os direitos necessários sobre o conteúdo enviado,
              incluindo direitos de imagem de pessoas retratadas nas fotos.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">6. Integração com Meta/Instagram</h2>
            <p className="text-gray-600 leading-relaxed">
              O AutoPost utiliza a API oficial do Instagram para publicação de conteúdo. O serviço está
              sujeito às políticas e disponibilidade da Meta Platforms. Não nos responsabilizamos por
              interrupções, mudanças de API ou restrições impostas pela Meta que possam afetar o
              funcionamento do serviço.
            </p>
            <p className="text-gray-600 leading-relaxed">
              O token de acesso ao Instagram expira em 60 dias e pode precisar ser renovado. É sua
              responsabilidade reconectar a conta quando necessário.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">7. Limitação de responsabilidade</h2>
            <p className="text-gray-600 leading-relaxed">
              O AutoPost é fornecido "como está" e "conforme disponível". Não garantimos que o serviço
              será ininterrupto ou livre de erros. Em nenhuma hipótese seremos responsáveis por danos
              indiretos, incidentais ou consequentes decorrentes do uso do serviço, incluindo perda de
              dados, perda de receita ou danos à reputação.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Nossa responsabilidade total perante você, por qualquer causa, não excederá o valor pago
              pelo serviço nos últimos 3 meses.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">8. Suspensão e encerramento</h2>
            <p className="text-gray-600 leading-relaxed">
              Podemos suspender ou encerrar sua conta imediatamente, sem aviso prévio, caso você viole
              estes Termos ou as políticas da Meta. Você pode encerrar sua conta a qualquer momento
              entrando em contato pelo e-mail de suporte.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">9. Alterações nos termos</h2>
            <p className="text-gray-600 leading-relaxed">
              Podemos atualizar estes Termos periodicamente. Notificaremos você sobre mudanças relevantes
              por e-mail ou via aviso no aplicativo. O uso continuado do serviço após as alterações
              constitui aceitação dos novos Termos.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">10. Lei aplicável</h2>
            <p className="text-gray-600 leading-relaxed">
              Estes Termos são regidos pelas leis brasileiras. Qualquer disputa será submetida ao
              foro da comarca de domicílio do usuário, salvo disposição legal em contrário.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">11. Contato</h2>
            <p className="text-gray-600">
              Para dúvidas sobre estes Termos, entre em contato:{" "}
              <a href="mailto:matheusfontanellaaugusto@gmail.com" className="text-blue-600 hover:underline">
                matheusfontanellaaugusto@gmail.com
              </a>
            </p>
          </section>

          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-4 text-sm text-gray-500">
            <Link href="/privacy" className="text-blue-600 hover:underline">Política de Privacidade</Link>
            <Link href="/login" className="text-blue-600 hover:underline">Voltar ao AutoPost</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
