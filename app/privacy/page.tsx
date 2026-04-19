import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade — AutoPost",
  description: "Como o AutoPost coleta, usa e protege seus dados.",
};

export default function PrivacyPage() {
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
            <h1 className="text-3xl font-bold text-gray-900">Política de Privacidade</h1>
            <p className="text-gray-500 text-sm mt-2">Última atualização: 19 de abril de 2026</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">1. Quem somos</h2>
            <p className="text-gray-600 leading-relaxed">
              O AutoPost é um serviço de automação de publicações no Instagram desenvolvido e operado por
              Matheus Fontanella Augusto ("nós", "nosso"). Esta Política descreve como coletamos, usamos,
              armazenamos e protegemos seus dados pessoais em conformidade com a Lei Geral de Proteção
              de Dados (LGPD — Lei nº 13.709/2018).
            </p>
            <p className="text-gray-600">
              Contato: <a href="mailto:matheusfontanellaaugusto@gmail.com" className="text-blue-600 hover:underline">matheusfontanellaaugusto@gmail.com</a>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">2. Dados que coletamos</h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex gap-2"><span className="text-blue-500 mt-1">•</span><span><strong>Dados de conta:</strong> nome, endereço de e-mail e senha (armazenada em hash) fornecidos no cadastro.</span></li>
              <li className="flex gap-2"><span className="text-blue-500 mt-1">•</span><span><strong>Dados da conta Meta/Instagram:</strong> token de acesso OAuth, ID da conta, nome de usuário e dados públicos do perfil do Instagram, obtidos com seu consentimento explícito via login com Facebook.</span></li>
              <li className="flex gap-2"><span className="text-blue-500 mt-1">•</span><span><strong>Conteúdo enviado:</strong> fotos e imagens que você envia para publicação.</span></li>
              <li className="flex gap-2"><span className="text-blue-500 mt-1">•</span><span><strong>Dados de uso:</strong> logs de publicações realizadas, aprovações, rejeições e métricas de engajamento coletadas do Instagram.</span></li>
              <li className="flex gap-2"><span className="text-blue-500 mt-1">•</span><span><strong>Dados técnicos:</strong> endereço IP, tipo de navegador e informações de sessão para fins de segurança.</span></li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">3. Como usamos seus dados</h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex gap-2"><span className="text-blue-500 mt-1">•</span><span>Processar e publicar conteúdo no Instagram em seu nome, conforme aprovado por você.</span></li>
              <li className="flex gap-2"><span className="text-blue-500 mt-1">•</span><span>Gerar legendas e textos para seus posts usando inteligência artificial (Claude da Anthropic).</span></li>
              <li className="flex gap-2"><span className="text-blue-500 mt-1">•</span><span>Exibir o histórico de publicações e métricas de desempenho no seu painel.</span></li>
              <li className="flex gap-2"><span className="text-blue-500 mt-1">•</span><span>Enviar notificações sobre o status das publicações.</span></li>
              <li className="flex gap-2"><span className="text-blue-500 mt-1">•</span><span>Melhorar a qualidade do serviço com base em padrões de uso agregados e anonimizados.</span></li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">4. Compartilhamento de dados com terceiros</h2>
            <p className="text-gray-600">Seus dados são compartilhados apenas com os parceiros essenciais para o funcionamento do serviço:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-600 border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Parceiro</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Finalidade</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Dados compartilhados</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 font-medium">Meta (Facebook/Instagram)</td>
                    <td className="px-4 py-3">Publicação de conteúdo</td>
                    <td className="px-4 py-3">Token OAuth, fotos, legendas</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Anthropic (Claude)</td>
                    <td className="px-4 py-3">Geração de copy e análise de imagem</td>
                    <td className="px-4 py-3">Fotos enviadas, dados do perfil</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Supabase</td>
                    <td className="px-4 py-3">Banco de dados e autenticação</td>
                    <td className="px-4 py-3">Dados de conta e publicações</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Railway</td>
                    <td className="px-4 py-3">Hospedagem da API</td>
                    <td className="px-4 py-3">Dados em trânsito</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Cloudflare R2</td>
                    <td className="px-4 py-3">Armazenamento de imagens</td>
                    <td className="px-4 py-3">Fotos enviadas</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Vercel</td>
                    <td className="px-4 py-3">Hospedagem do aplicativo web</td>
                    <td className="px-4 py-3">Dados em trânsito</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-600 text-sm">Não vendemos, alugamos ou comercializamos seus dados com terceiros para fins de publicidade.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">5. Token de acesso ao Instagram</h2>
            <p className="text-gray-600 leading-relaxed">
              O token OAuth obtido via login com Facebook é armazenado de forma segura e criptografada
              no banco de dados. Ele é usado exclusivamente para publicar conteúdo em seu nome no
              Instagram. Você pode revogar o acesso a qualquer momento em{" "}
              <strong>facebook.com/settings → Aplicativos e sites</strong> ou excluindo sua conta no AutoPost.
              O token expira em 60 dias e pode precisar ser renovado.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">6. Retenção de dados</h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex gap-2"><span className="text-blue-500 mt-1">•</span><span>Dados de conta: mantidos enquanto sua conta estiver ativa.</span></li>
              <li className="flex gap-2"><span className="text-blue-500 mt-1">•</span><span>Fotos enviadas: armazenadas por até 90 dias após a publicação, depois removidas automaticamente.</span></li>
              <li className="flex gap-2"><span className="text-blue-500 mt-1">•</span><span>Histórico de publicações: mantido indefinidamente para seu acesso no painel.</span></li>
              <li className="flex gap-2"><span className="text-blue-500 mt-1">•</span><span>Ao excluir sua conta, todos os dados pessoais são removidos em até 30 dias.</span></li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">7. Seus direitos (LGPD)</h2>
            <p className="text-gray-600">Você tem direito a:</p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex gap-2"><span className="text-blue-500 mt-1">•</span><span><strong>Acesso:</strong> solicitar uma cópia dos seus dados pessoais.</span></li>
              <li className="flex gap-2"><span className="text-blue-500 mt-1">•</span><span><strong>Correção:</strong> corrigir dados incompletos ou imprecisos.</span></li>
              <li className="flex gap-2"><span className="text-blue-500 mt-1">•</span><span><strong>Exclusão:</strong> solicitar a remoção dos seus dados.</span></li>
              <li className="flex gap-2"><span className="text-blue-500 mt-1">•</span><span><strong>Portabilidade:</strong> receber seus dados em formato estruturado.</span></li>
              <li className="flex gap-2"><span className="text-blue-500 mt-1">•</span><span><strong>Revogação do consentimento:</strong> revogar a qualquer momento o acesso ao Instagram.</span></li>
            </ul>
            <p className="text-gray-600">Para exercer seus direitos, entre em contato: <a href="mailto:matheusfontanellaaugusto@gmail.com" className="text-blue-600 hover:underline">matheusfontanellaaugusto@gmail.com</a></p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">8. Segurança</h2>
            <p className="text-gray-600 leading-relaxed">
              Adotamos medidas técnicas e organizacionais para proteger seus dados: senhas em hash (bcrypt),
              comunicação via HTTPS/TLS, tokens armazenados com criptografia, e acesso ao banco de dados
              restrito por políticas de Row-Level Security (RLS).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">9. Alterações nesta Política</h2>
            <p className="text-gray-600 leading-relaxed">
              Podemos atualizar esta Política periodicamente. Quando houver alterações relevantes,
              notificaremos você por e-mail ou via aviso no aplicativo. O uso continuado do serviço
              após as alterações constitui aceitação da nova Política.
            </p>
          </section>

          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-4 text-sm text-gray-500">
            <Link href="/terms" className="text-blue-600 hover:underline">Termos de Serviço</Link>
            <Link href="/login" className="text-blue-600 hover:underline">Voltar ao AutoPost</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
