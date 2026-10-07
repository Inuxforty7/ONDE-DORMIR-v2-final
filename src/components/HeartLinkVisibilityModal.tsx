import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Clock, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle,
  Zap,
  Star,
  Flame,
  ArrowRight,
  Phone,
  MessageSquare,
  Lock,
  FileText
} from 'lucide-react';
import { HeartLinkTwoHeartsIcon } from './HeartLinkLogo';
import { P2PGreenHeartIcon, P2PBlueDiamondIcon, P2PGoldenCrownIcon } from './HeartLinkP2PIcons';
import { TermsModal } from './TermsModal';
import { BillingInvoiceModal, BillingInvoiceData } from './BillingInvoiceModal';

export interface VisibilityPlan {
  id: 'vis_24h' | 'vis_7d' | 'vis_30d';
  name: string;
  durationLabel: string;
  durationHours: number;
  priceMt: number;
  description: string;
  badge?: string;
  isPopular?: boolean;
  popularLabel?: string;
  features: string[];
}

export const VISIBILITY_PLANS: VisibilityPlan[] = [
  {
    id: 'vis_24h',
    name: '♥️ CORAÇÃO',
    durationLabel: '24 Horas',
    durationHours: 24,
    priceMt: 100,
    description: 'Acesso a contactos directos e grupo P2P ♥️',
    badge: '100 MT',
    features: [
      '20 mensagens por dia',
      'Participação em grupos',
      'Contactos básicos'
    ]
  },
  {
    id: 'vis_7d',
    name: '💎 DIAMANTE',
    durationLabel: '7 Dias',
    durationHours: 168,
    priceMt: 250,
    description: 'Acesso prioritário e mensagens ilimitadas no Chat P2P',
    badge: '250 MT',
    isPopular: true,
    popularLabel: 'mais escolhido pelos utilizadores',
    features: [
      'Mensagens ilimitadas',
      'Perfil destacado',
      'Prioridade nas pesquisas',
      'Selo Diamante 💎'
    ]
  },
  {
    id: 'vis_30d',
    name: '👑 VIP',
    durationLabel: '30 Dias (VIP)',
    durationHours: 720,
    priceMt: 1000,
    description: 'Acesso exclusivo total com máximo destaque e suporte prioritário',
    badge: '1000 MT',
    features: [
      'Tudo do Diamante',
      'Grupo VIP exclusivo',
      'Perfil no topo das pesquisas',
      'Selo VIP 👑',
      'Máximo destaque e visibilidade',
      'Suporte prioritário'
    ]
  }
];

export interface UserVisibilityData {
  mode: 'anonymous' | 'public_showcase';
  isUnlocked: boolean;
  planId?: 'vis_24h' | 'vis_7d' | 'vis_30d';
  planName?: string;
  expiresAt?: string; // ISO string
  unlockedAt?: string;
  paymentPhone?: string;
  paymentMethod?: 'mpesa' | 'emola';
}

interface HeartLinkVisibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentVisibility: UserVisibilityData;
  onSaveVisibility: (updated: UserVisibilityData) => void;
  userPhone?: string;
  initialPlanId?: 'vis_24h' | 'vis_7d' | 'vis_30d';
}

export const HeartLinkVisibilityModal: React.FC<HeartLinkVisibilityModalProps> = ({
  isOpen,
  onClose,
  currentVisibility,
  onSaveVisibility,
  userPhone = '',
  initialPlanId
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<'vis_24h' | 'vis_7d' | 'vis_30d'>(
    initialPlanId || currentVisibility.planId || 'vis_24h'
  );

  React.useEffect(() => {
    if (initialPlanId) {
      setSelectedPlanId(initialPlanId);
    }
  }, [initialPlanId]);

  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'emola'>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState(
    userPhone ? userPhone.replace('+258', '').replace(/\s+/g, '') : '841234567'
  );
  const [step, setStep] = useState<'select_plan' | 'payment_processing' | 'success'>('select_plan');
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(true);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState<BillingInvoiceData | null>(null);

  if (!isOpen) return null;

  const selectedPlan = VISIBILITY_PLANS.find((p) => p.id === selectedPlanId) || VISIBILITY_PLANS[1];

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setStep('payment_processing');

    // Simulate real M-Pesa / E-Mola push STK confirmation
    setTimeout(() => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + selectedPlan.durationHours * 60 * 60 * 1000).toISOString();

      const newVisibility: UserVisibilityData = {
        mode: 'public_showcase',
        isUnlocked: true,
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        expiresAt: expiresAt,
        unlockedAt: now.toISOString(),
        paymentPhone: phoneNumber,
        paymentMethod: paymentMethod
      };

      // Prepare official billing invoice
      const invoiceNum = `INV-HL-${Math.floor(100000 + Math.random() * 900000)}`;
      const invoiceData: BillingInvoiceData = {
        invoiceNumber: invoiceNum,
        issueDate: new Date().toLocaleDateString('pt-MZ'),
        dueDate: new Date(now.getTime() + selectedPlan.durationHours * 60 * 60 * 1000).toLocaleDateString('pt-MZ'),
        status: 'PAID',
        moduleType: 'general',
        serviceTitle: `HeartLink • Acesso a Contactos (${selectedPlan.name})`,
        serviceDescription: `Subscrição de Acesso a Contactos HeartLink (${selectedPlan.name})`,
        clientName: `Utilizador HeartLink (+258 ${phoneNumber})`,
        clientNuitOrBi: 'Consumidor Final (18+)',
        clientPhone: `+258 ${phoneNumber}`,
        clientProvince: 'Moçambique',
        clientCity: 'Moçambique',
        itemDetails: [
          {
            description: `Ativação de Acesso a Contactos (${selectedPlan.name}) • HeartLink`,
            quantity: 1,
            unitPriceMzn: selectedPlan.priceMt,
            totalMzn: selectedPlan.priceMt,
          },
        ],
        subtotalMzn: selectedPlan.priceMt,
        ivaRate: 0,
        ivaAmountMzn: 0,
        totalMzn: selectedPlan.priceMt,
        paymentMethod: paymentMethod === 'mpesa' ? 'M-Pesa' : 'e-Mola',
        transactionReference: `TX-HL-${Math.floor(10000000 + Math.random() * 90000000)}`,
      };

      setGeneratedInvoice(invoiceData);
      onSaveVisibility(newVisibility);
      setIsProcessing(false);
      setStep('success');
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-200 relative my-auto animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white p-3.5 sm:p-5 relative overflow-hidden shrink-0">
          <div className="flex items-center justify-between gap-2 relative z-10">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shrink-0 shadow-inner">
                <HeartLinkTwoHeartsIcon className="w-6 h-6 sm:w-7 sm:h-7" variant="white" showStitches={true} />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-black/20 text-amber-300 px-2 py-0.5 rounded-md inline-block whitespace-nowrap">
                  CHAT P2P HEARTLINK
                </span>
                <h2 className="text-sm sm:text-lg font-black tracking-tight mt-0.5 truncate leading-tight">
                  Desbloquear Chat P2P
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-3.5 sm:p-5 space-y-3.5 max-h-[80vh] overflow-y-auto">

          {/* STEP 1: SELECT PLAN */}
          {step === 'select_plan' && (
            <>
              {/* Informative Banner */}
              <div className="bg-rose-50/90 border border-rose-200/90 rounded-2xl p-3 sm:p-3.5 space-y-2">
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-rose-600 shrink-0" />
                  <p className="font-bold text-rose-900 leading-relaxed text-[11.5px] sm:text-xs min-w-0 flex-1">
                    Acesso às salas de conversa P2P e contactos diretos.
                  </p>
                </div>

                {/* If user currently has active P2P plan */}
                {currentVisibility.isUnlocked && (
                  <div className="pt-2 border-t border-rose-200/70 flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-rose-900 font-bold truncate">Plano Ativo: {currentVisibility.planName || 'Chat P2P'}</span>
                  </div>
                )}
              </div>

              {/* 3 Packages Cards */}
              <div className="space-y-2">
                <label className="text-[11px] sm:text-xs font-black text-neutral-800 uppercase tracking-wide block">
                  ESCOLHA O SEU PLANO:
                </label>

                <div className="grid grid-cols-1 gap-2 sm:gap-2.5">
                  {VISIBILITY_PLANS.map((plan) => {
                    const isSelected = selectedPlanId === plan.id;
                    const IconComponent =
                      plan.id === 'vis_24h'
                        ? P2PGreenHeartIcon
                        : plan.id === 'vis_7d'
                        ? P2PBlueDiamondIcon
                        : P2PGoldenCrownIcon;

                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`p-3 sm:p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col gap-2 ${
                          isSelected
                            ? 'border-rose-600 bg-rose-50/80 shadow-xs ring-2 ring-rose-600/20'
                            : 'border-neutral-200 hover:border-neutral-300 bg-white'
                        }`}
                      >
                        {/* Top Header: Icon, Title & Price */}
                        <div className="flex items-center justify-between gap-2 pr-6">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 filter drop-shadow-xs" />
                            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                              <span className="font-black text-xs sm:text-sm text-neutral-900 tracking-tight whitespace-nowrap">
                                {plan.name}
                              </span>
                              {plan.popularLabel && (
                                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-amber-400 text-amber-950 border border-amber-500/30 whitespace-nowrap">
                                  ⭐ {plan.popularLabel}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="font-black text-base sm:text-lg text-rose-600 tracking-tight whitespace-nowrap">
                              {plan.priceMt} <span className="text-xs font-bold text-neutral-700">MT</span>
                            </div>
                          </div>
                        </div>

                        {/* Bulleted Feature List */}
                        <div className="pt-2 border-t border-neutral-200/80 grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-1.5 text-xs text-neutral-800">
                          {plan.features.map((feat, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 font-bold text-[10.5px] sm:text-[11px]">
                              <span className="text-emerald-600 font-extrabold text-xs shrink-0">✅</span>
                              <span className="text-neutral-800 leading-tight">{feat}</span>
                            </div>
                          ))}
                        </div>

                        {isSelected && (
                          <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Method Selector (M-Pesa / E-Mola) */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-black text-neutral-800 uppercase tracking-wide block">
                  Método de Pagamento Instantâneo:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`h-11 rounded-xl border-2 flex items-center justify-center gap-2 font-bold text-xs cursor-pointer transition-all ${
                      paymentMethod === 'mpesa'
                        ? 'border-red-600 bg-red-50 text-red-700 shadow-2xs'
                        : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0" />
                    <span>M-Pesa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('emola')}
                    className={`h-11 rounded-xl border-2 flex items-center justify-center gap-2 font-bold text-xs cursor-pointer transition-all ${
                      paymentMethod === 'emola'
                        ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-2xs'
                        : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                    <span>E-Mola</span>
                  </button>
                </div>
              </div>

              {/* Phone number input for M-Pesa / E-Mola */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700 block">
                  Número de Celular para Débito ({paymentMethod === 'mpesa' ? '84/85' : '86/87'}) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-500">
                    +258
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                    placeholder={paymentMethod === 'mpesa' ? '84 123 4567' : '86 123 4567'}
                    className="w-full h-10 pl-14 pr-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-900 focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none"
                  />
                </div>
                <p className="text-[10.5px] text-neutral-500">
                  Irá receber um pedido USSD no ecrã do seu telemóvel para inserir o seu PIN com total segurança.
                </p>
              </div>

              {/* Terms Acceptance Checkbox */}
              <div className="pt-0.5">
                <label className="flex items-start gap-2.5 cursor-pointer p-2.5 rounded-xl border border-neutral-200 bg-neutral-50/60 hover:bg-neutral-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 rounded text-rose-600 focus:ring-rose-500 w-4 h-4 accent-rose-600 shrink-0 cursor-pointer"
                  />
                  <div className="text-[11px] text-neutral-700 leading-snug">
                    <span>Declaro que sou maior de 18 anos e aceito os </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsTermsModalOpen(true);
                      }}
                      className="text-rose-700 font-bold underline hover:text-rose-900 cursor-pointer"
                    >
                      Termos Gerais
                    </button>{' '}
                    <span>do Onde Dormir Moçambique (Cláusula 11 - HeartLink).</span>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-1 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-11 px-4 bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  disabled={phoneNumber.length < 8 || !agreedToTerms}
                  className="flex-1 h-11 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 active:scale-98 disabled:opacity-40 text-white rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <span>Pagar {selectedPlan.priceMt} MT e Ativar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {/* STEP 2: PROCESSING SIMULATION */}
          {step === 'payment_processing' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-100 border-4 border-rose-500 border-t-transparent animate-spin mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-black text-neutral-900">
                  A Enviar Notificação {paymentMethod === 'mpesa' ? 'M-Pesa' : 'E-Mola'}...
                </h3>
                <p className="text-xs text-neutral-600 max-w-xs mx-auto">
                  Por favor, confirme no seu telemóvel (+258 {phoneNumber}) o débito de <strong>{selectedPlan.priceMt} MT</strong> para ativar o <strong>{selectedPlan.name}</strong>.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                <span>Aguardando introdução do PIN no celular...</span>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 'success' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-neutral-900">
                  Chat P2P Ativado com Sucesso! ✨
                </h3>
                <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed">
                  O seu acesso ao Chat P2P e contactos diretos está agora ativo.
                </p>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200 text-xs text-emerald-950 font-bold space-y-1">
                <div>Plano Ativo: {selectedPlan.name} ({selectedPlan.durationLabel})</div>
                <div className="text-[11px] text-emerald-800 font-medium">
                  Estado: Contacto disponível
                </div>
              </div>

              <div className="pt-2 space-y-2">
                {generatedInvoice && (
                  <button
                    type="button"
                    onClick={() => setIsInvoiceOpen(true)}
                    className="w-full h-11 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Ver Fatura Oficial & Recibo (Bill)</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <span>Concluir</span>
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Official Terms and Conditions Modal */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAccept={() => {
          setAgreedToTerms(true);
          setIsTermsModalOpen(false);
        }}
        contextText="Para ativar acesso a contactos no HeartLink, confirme a leitura e aceitação dos Termos Gerais (Adultos 18+)."
      />

      {/* Official Billing & Invoice Modal */}
      {generatedInvoice && (
        <BillingInvoiceModal
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
          invoiceData={generatedInvoice}
        />
      )}
    </div>
  );
};
