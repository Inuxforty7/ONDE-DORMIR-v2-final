import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  X, 
  ExternalLink, 
  CheckCircle2, 
  ShieldCheck, 
  Key, 
  Sparkles, 
  Smartphone, 
  ArrowRight, 
  RefreshCw, 
  Copy, 
  Check, 
  HelpCircle,
  AlertCircle,
  Compass,
  SlidersHorizontal,
  ChevronRight,
  Layers,
  Info
} from 'lucide-react';
import { e2paymentsService, E2PAYMENTS_OFFICIAL_URLS, E2PaymentsConfig } from '../services/e2paymentsService';

interface E2PaymentsSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const E2PaymentsSetupModal: React.FC<E2PaymentsSetupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [config, setConfig] = useState<E2PaymentsConfig>(e2paymentsService.getConfig());
  const [clientId, setClientId] = useState(config.clientId);
  const [walletId, setWalletId] = useState(config.walletId);
  const [isSandbox, setIsSandbox] = useState(config.isSandbox);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [testAmount, setTestAmount] = useState('20');
  const [testPhone, setTestPhone] = useState('841234567');
  const [testMethod, setTestMethod] = useState<'MPESA' | 'EMOLA'>('MPESA');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Tabs: 'guide' (Onde mexer no site) | 'keys' (Configurar chaves) | 'test' (Testar USSD)
  const [activeTab, setActiveTab] = useState<'guide' | 'keys' | 'test'>('guide');
  const [selectedGuideStep, setSelectedGuideStep] = useState<number>(1);

  useEffect(() => {
    const current = e2paymentsService.getConfig();
    setConfig(current);
    setClientId(current.clientId);
    setWalletId(current.walletId);
    setIsSandbox(current.isSandbox);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    e2paymentsService.saveConfig({
      clientId: clientId.trim(),
      walletId: walletId.trim(),
      isSandbox,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleFillDemoSandbox = () => {
    const demoClientId = 'e2p_demo_client_moz2026';
    const demoWalletId = 'wallet_mpesa_maputo_01';
    setClientId(demoClientId);
    setWalletId(demoWalletId);
    setIsSandbox(true);
    e2paymentsService.saveConfig({
      clientId: demoClientId,
      walletId: demoWalletId,
      isSandbox: true,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(E2PAYMENTS_OFFICIAL_URLS.createAccountFree);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleTestPayment = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await e2paymentsService.initiatePayment({
        amount: Number(testAmount) || 20,
        phone: testPhone,
        reference: `TST-${Date.now().toString().slice(-6)}`,
        method: testMethod,
        description: 'Teste de integração e2Payments',
      });
      setTestResult(`✓ ${res.message} (Ref: ${res.reference})`);
    } catch {
      setTestResult('Falha ao simular envio de pagamento.');
    } finally {
      setIsTesting(false);
    }
  };

  const guideSteps = [
    {
      step: 1,
      badge: '1. Criar Conta Grátis',
      title: 'No Site Inicial da e2Payments',
      subtitle: 'Como entrar e começar a custo 0 MT',
      actionText: 'Abrir Página de Registo',
      actionUrl: E2PAYMENTS_OFFICIAL_URLS.createAccountFree,
      details: [
        'Aceda a e2payments.explicador.co.mz/register',
        'Clique no botão verde superior "Registar" ou "Criar Conta Grátis"',
        'Preencha o seu Nome Completo ou Nome do seu Alojamento / Empresa',
        'Insira o seu E-mail válido e crie uma senha segura',
        'Insira o seu número Vodacom (84/85) ou Movitel (86/87)',
        'Clique em "Concluir Registo" para entrar no painel'
      ],
      tip: 'O plano básico de adesão é 100% gratuito e não exige cartão bancário.'
    },
    {
      step: 2,
      badge: '2. Onde Clicar no Menu',
      title: 'Dentro do Painel (Dashboard)',
      subtitle: 'Onde encontrar a área de Integração / API',
      actionText: 'Entrar no Painel e2Payments',
      actionUrl: E2PAYMENTS_OFFICIAL_URLS.loginPortal,
      details: [
        'Após entrar com o seu email e senha, você verá o ecrã com o seu saldo e gráficos',
        'Olhe para o menu no lado esquerdo (no telemóvel, toque no ícone de 3 linhas ☰ no topo)',
        'Procure e clique na opção chamada "Aplicações" (ou "API / Developers")',
        'Clique no botão azul/verde "+ Criar Nova Aplicação"',
        'Escreva o nome da sua aplicação: "Onde Dormir Moçambique"'
      ],
      tip: 'É nesta área de Aplicações que o sistema gera o identificador seguro da sua conta.'
    },
    {
      step: 3,
      badge: '3. Copiar as Chaves',
      title: 'Copiar Client ID & Client Secret',
      subtitle: 'As chaves que conectam o M-Pesa & e-Mola ao seu app',
      actionText: 'Ver Minhas Aplicações',
      actionUrl: E2PAYMENTS_OFFICIAL_URLS.dashboard,
      details: [
        'Na lista de aplicações, clique em "Ver Detalhes" ou no ícone de chave 🔑',
        'Copie o código chamado "Client ID" (identificador da conta)',
        'Clique em "Revelar" e copie o código "Client Secret" (chave secreta)',
        'Vá também à secção "Wallets" (Carteiras) e aponte o seu "Wallet ID"',
        'Volte a este ecrã do Onde Dormir Moçambique e cole na aba "Configurar Chaves"'
      ],
      tip: 'Não partilhe o seu Client Secret com desconhecidos. Ele é guardado com segurança aqui.'
    },
    {
      step: 4,
      badge: '4. Pronto a Receber!',
      title: 'Recebimentos no Telemóvel do Cliente',
      subtitle: 'Como o pagamento cai na sua carteira móvel',
      actionText: 'Fazer Teste Simulado',
      onClickTab: 'test',
      details: [
        'Quando um hóspede ou cliente desbloqueia um quarto ou aluguer, ele digita o número',
        'O telemóvel dele recebe um Push USSD (ecrã a pedir o PIN do M-Pesa ou e-Mola)',
        'Após ele digitar o PIN, o dinheiro entra na sua carteira da e2Payments instantaneamente',
        'Pode transferir do saldo e2Payments diretamente para o seu M-Pesa pessoal ou conta bancária'
      ],
      tip: 'Tem suporte técnico oficial da e2Payments via WhatsApp se precisar de assistência em Moçambique.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-neutral-900 text-white w-full max-w-3xl rounded-3xl shadow-2xl border border-neutral-700/80 overflow-hidden flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Superior */}
        <div className="p-4 sm:p-5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                  Gateway Moçambique
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-[10px] text-emerald-300 font-bold border border-emerald-800">
                  M-Pesa & e-Mola
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white leading-tight">
                Guia e2Payments • Como Navegar & Ativar
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Abas Navegáveis */}
        <div className="bg-neutral-950/70 border-b border-neutral-800 px-4 sm:px-6 py-2.5 flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-950/40 font-black'
                : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>1. Onde Mexer no Site (Guia Passo a Passo)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('keys')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'keys'
                ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-950/40 font-black'
                : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>2. Configurar Chaves API</span>
            {clientId ? <span className="w-2 h-2 rounded-full bg-emerald-400"></span> : null}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('test')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'test'
                ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-950/40 font-black'
                : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>3. Teste Simulado USSD</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* TAB 1: GUIA PASSO A PASSO "ONDE MEXER NO SITE" */}
          {activeTab === 'guide' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* Card de Resumo e Ajuda Direta */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-emerald-950 border border-emerald-800/60 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block mb-1">
                      Instruções Simples para quem não sabe onde mexer
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      Está perdido no site da e2Payments? Siga este mapa:
                    </h3>
                    <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                      O site oficial da e2Payments é onde você tem a sua carteira virtual para receber o dinheiro do M-Pesa e do e-Mola. Abaixo mostramos com exatidão onde clicar em cada ecrã.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleFillDemoSandbox}
                    className="hidden sm:flex px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-xs font-bold flex-col items-center shrink-0 cursor-pointer transition-all"
                    title="Não quer mexer no site agora? Ative o modo demonstração instantâneo!"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400 mb-0.5" />
                    <span>Ativar Modo Demonstração</span>
                    <span className="text-[9px] text-amber-200 font-normal">Sem mexer no site externo</span>
                  </button>
                </div>

                {/* Botões Rápidos de Acesso ao Portal */}
                <div className="pt-2 flex flex-wrap gap-2">
                  <a
                    href={E2PAYMENTS_OFFICIAL_URLS.createAccountFree}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950/40 cursor-pointer"
                  >
                    <span>1. Clicar Aqui Para Abrir o Registo Grátis</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3.5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Link do Registo Copiado!' : 'Copiar Link do Site'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFillDemoSandbox}
                    className="sm:hidden px-3.5 py-2.5 rounded-xl bg-amber-600/30 border border-amber-500 text-amber-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ativar Demonstração em 1 Clique</span>
                  </button>
                </div>
              </div>

              {/* Seletor Visual dos 4 Passos */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {guideSteps.map((s) => (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => setSelectedGuideStep(s.step)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      selectedGuideStep === s.step
                        ? 'bg-neutral-950 border-emerald-500 shadow-md shadow-emerald-950/30'
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                    }`}
                  >
                    <span className={`text-[10px] font-black uppercase block ${selectedGuideStep === s.step ? 'text-emerald-400' : 'text-neutral-500'}`}>
                      Passo {s.step}
                    </span>
                    <span className="text-xs font-bold text-white block mt-0.5 line-clamp-1">
                      {s.badge.replace(/^\d+\.\s*/, '')}
                    </span>
                  </button>
                ))}
              </div>

              {/* Detalhe do Passo Selecionado */}
              {(() => {
                const cur = guideSteps.find((s) => s.step === selectedGuideStep) || guideSteps[0];
                return (
                  <div className="p-5 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800 inline-block mb-1.5">
                          {cur.badge}
                        </span>
                        <h4 className="text-base sm:text-lg font-black text-white">
                          {cur.title}
                        </h4>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          {cur.subtitle}
                        </p>
                      </div>

                      {cur.actionUrl && (
                        <a
                          href={cur.actionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-emerald-400 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                        >
                          <span>{cur.actionText}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      {cur.onClickTab && (
                        <button
                          type="button"
                          onClick={() => setActiveTab(cur.onClickTab as any)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                        >
                          <span>{cur.actionText}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Lista Ponto a Ponto Exata */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400 block">
                        O que fazer exatamente nesta etapa:
                      </span>
                      <ul className="space-y-2">
                        {cur.details.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-200">
                            <span className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-700 text-emerald-400 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Dica de Especialista */}
                    <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-start gap-2.5 text-xs text-neutral-300">
                      <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">
                        <strong>Dica:</strong> {cur.tip}
                      </span>
                    </div>

                    {/* Navegação Entre Passos */}
                    <div className="pt-2 flex items-center justify-between border-t border-neutral-850">
                      <button
                        type="button"
                        disabled={selectedGuideStep === 1}
                        onClick={() => setSelectedGuideStep((prev) => Math.max(1, prev - 1))}
                        className="px-3 py-1.5 rounded-xl bg-neutral-900 text-xs font-bold text-neutral-400 hover:text-white disabled:opacity-40 cursor-pointer"
                      >
                        ← Passo Anterior
                      </button>

                      {selectedGuideStep < 4 ? (
                        <button
                          type="button"
                          onClick={() => setSelectedGuideStep((prev) => Math.min(4, prev + 1))}
                          className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-emerald-400 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Próximo Passo</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActiveTab('keys')}
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-black flex items-center gap-1 cursor-pointer"
                        >
                          <span>Ir Configurar Chaves</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Botão de Ajuda Direta com Suporte WhatsApp */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-white block">Ainda tem dúvidas ou prefere falar com suporte humano?</span>
                  <span className="text-neutral-400">A equipa moçambicana da Explicador / e2Payments atende no WhatsApp.</span>
                </div>
                <a
                  href={E2PAYMENTS_OFFICIAL_URLS.whatsappSupport}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <span>Chamar no WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          )}

          {/* TAB 2: CONFIGURAR CHAVES API */}
          {activeTab === 'keys' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* Banner Rápido: Modo Sandbox / Teste com 1 clique */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-neutral-950 to-neutral-900 border border-amber-600/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">
                    Facilitador Automático
                  </span>
                  <span className="text-xs font-bold text-white block">
                    Não quer criar conta agora? Quer testar já o funcionamento?
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Preencha credenciais automáticas de simulação sem complicação.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleFillDemoSandbox}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md shadow-amber-950/50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Preencher Chaves de Demonstração</span>
                </button>
              </div>

              {/* Formulário de Configuração das Chaves API */}
              <form onSubmit={handleSave} className="p-4 sm:p-5 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">
                      Credenciais da API e2Payments
                    </h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Copie do menu "Aplicações" no site da e2Payments e cole aqui.
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    clientId ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {clientId ? '🟢 Pronto / Conectado' : '⚪ Vazio'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Client ID (Identificador da Aplicação)
                    </label>
                    <input
                      type="text"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      placeholder="Ex: e2p_client_9824ab..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-[10px] text-neutral-400 mt-1 block">
                      Encontrado em: <strong>e2Payments → Menu Lateral → Aplicações → Detalhes</strong>
                    </span>
                  </div>

                  <div className="p-3 bg-neutral-900 border border-emerald-900/60 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                      <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>Chave Secreta (E2P_CLIENT_SECRET) Protegida</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Por conformidade com as regras de segurança, o <code className="text-emerald-300 font-mono">E2P_CLIENT_SECRET</code> é configurado exclusivamente no servidor backend (<code className="text-neutral-300 font-mono">.env / Cloud Run</code>) e nunca é exposto ou guardado no navegador.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 mb-1">
                        Wallet ID (Carteira Principal)
                      </label>
                      <input
                        type="text"
                        value={walletId}
                        onChange={(e) => setWalletId(e.target.value)}
                        placeholder="Ex: wallet_moz_01"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 text-xs font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 border border-neutral-700 mt-auto">
                      <div>
                        <span className="text-xs font-bold text-white block">Modo Sandbox (Testes)</span>
                        <span className="text-[10px] text-neutral-400">Simulação sem debitar saldo real</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isSandbox}
                        onChange={(e) => setIsSandbox(e.target.checked)}
                        className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {isSaved && (
                  <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Configuração e2Payments guardada com sucesso!</span>
                  </div>
                )}

                <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-emerald-950/40 flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Guardar Configuração</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('test')}
                    className="py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Ir para Teste USSD</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

            </div>
          )}

          {/* TAB 3: TESTE SIMULADO USSD */}
          {activeTab === 'test' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              <div className="p-4 sm:p-5 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider block mb-0.5">
                    Demonstração de Débito Push USSD
                  </span>
                  <h4 className="text-base font-black text-white">
                    Simular Pedido de Pagamento Direto no Telemóvel
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Envie um teste para verificar como o cliente vê o pop-up no telemóvel para inserir o código secreto do M-Pesa ou e-Mola.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                      Operadora / Carteira
                    </label>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setTestMethod('MPESA')}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                          testMethod === 'MPESA' ? 'bg-rose-600 text-white' : 'bg-neutral-900 text-neutral-400'
                        }`}
                      >
                        M-Pesa (84/85)
                      </button>
                      <button
                        type="button"
                        onClick={() => setTestMethod('EMOLA')}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                          testMethod === 'EMOLA' ? 'bg-orange-600 text-white' : 'bg-neutral-900 text-neutral-400'
                        }`}
                      >
                        e-Mola (86/87)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                      Número Moçambique
                    </label>
                    <input
                      type="tel"
                      value={testPhone}
                      onChange={(e) => setTestPhone(e.target.value)}
                      placeholder="84XXXXXXX ou 86XXXXXXX"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                      Valor de Teste (MZN)
                    </label>
                    <input
                      type="number"
                      value={testAmount}
                      onChange={(e) => setTestAmount(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs font-bold"
                    />
                  </div>
                </div>

                {testResult && (
                  <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-600 text-emerald-300 text-xs font-medium space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{testResult}</span>
                    </div>
                    <p className="text-[11px] text-emerald-400/80">
                      Em ambiente real, o cliente recebe a notificação no ecrã para confirmar a transação. O valor é creditado na conta e2Payments imediatamente.
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleTestPayment}
                  disabled={isTesting}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-emerald-950/50"
                >
                  <RefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? 'A disparar pedido ao telemóvel...' : 'Disparar Pedido de Teste (Push USSD)'}</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Rodapé Fixo */}
        <div className="p-3.5 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px]">Compatível com Vodacom Moçambique & Movitel Moçambique</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold cursor-pointer"
          >
            Fechar Janela
          </button>
        </div>

      </div>
    </div>
  );
};
