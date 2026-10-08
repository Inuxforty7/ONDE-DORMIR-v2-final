import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Phone, 
  MessageSquare, 
  FileText,
  User,
  ShieldCheck,
  MapPin,
  Lock
} from 'lucide-react';
import { HeartLinkTwoHeartsIcon } from './HeartLinkLogo';
import { P2PGreenHeartIcon, P2PBlueDiamondIcon, P2PGoldenCrownIcon } from './HeartLinkP2PIcons';
import { TermsModal } from './TermsModal';
import { BillingInvoiceModal, BillingInvoiceData } from './BillingInvoiceModal';
import { 
  heartLinkAccessService, 
  HEARTLINK_ALL_PLANS, 
  HeartLinkPlanId, 
  HeartLinkPlanConfig 
} from '../services/heartLinkAccessService';
import { HeartLinkProfile } from '../types';

export interface UserVisibilityData {
  mode: 'anonymous' | 'public_showcase';
  isUnlocked: boolean;
  planId?: string;
  planName?: string;
  expiresAt?: string;
  unlockedAt?: string;
  paymentPhone?: string;
  paymentMethod?: 'mpesa' | 'emola';
}

interface HeartLinkVisibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProfile?: HeartLinkProfile | null;
  onSuccessUnlock?: (scope: 'single' | '24h' | 'monthly', contactId?: string) => void;
  userPhone?: string;
  initialPlanId?: HeartLinkPlanId | 'vis_24h' | 'vis_7d' | 'vis_30d';
  currentVisibility?: UserVisibilityData;
  onSaveVisibility?: (updated: UserVisibilityData) => void;
}

export const HeartLinkVisibilityModal: React.FC<HeartLinkVisibilityModalProps> = ({
  isOpen,
  onClose,
  targetProfile,
  onSuccessUnlock,
  userPhone = '',
  initialPlanId,
  currentVisibility,
  onSaveVisibility,
}) => {
  const [accessState, setAccessState] = useState(() => heartLinkAccessService.getAccessStatus());

  useEffect(() => {
    const unsub = heartLinkAccessService.subscribe(() => {
      setAccessState(heartLinkAccessService.getAccessStatus());
    });
    return unsub;
  }, []);

  const hasActiveMonthly = accessState.hasActiveMonthlyPlan;

  // Filter available options according to rule:
  // "If the user already has an active 100, 250 or 1000 MT plan, do not show the 20 MT or 50 MT offers.
  // If the user has no active plan, show the contact-unlock options."
  const availablePlans = useMemo(() => {
    if (hasActiveMonthly) {
      return HEARTLINK_ALL_PLANS.filter((p) => p.type === 'monthly');
    }
    if (!targetProfile) {
      return HEARTLINK_ALL_PLANS.filter((p) => p.id !== 'contact_20mt');
    }
    return HEARTLINK_ALL_PLANS;
  }, [hasActiveMonthly, targetProfile]);

  const mapInitialId = (id?: string): HeartLinkPlanId => {
    if (id === 'vis_24h') return 'monthly_100mt';
    if (id === 'vis_7d') return 'monthly_250mt';
    if (id === 'vis_30d') return 'monthly_1000mt';
    if (id && HEARTLINK_ALL_PLANS.some((p) => p.id === id)) return id as HeartLinkPlanId;
    if (targetProfile && !hasActiveMonthly) return 'contact_20mt';
    return 'monthly_100mt';
  };

  const [selectedPlanId, setSelectedPlanId] = useState<HeartLinkPlanId>(() =>
    mapInitialId(initialPlanId)
  );

  useEffect(() => {
    if (initialPlanId) {
      setSelectedPlanId(mapInitialId(initialPlanId));
    } else if (targetProfile && !hasActiveMonthly) {
      setSelectedPlanId('contact_20mt');
    } else if (availablePlans.length > 0 && !availablePlans.some((p) => p.id === selectedPlanId)) {
      setSelectedPlanId(availablePlans[0].id);
    }
  }, [initialPlanId, targetProfile, hasActiveMonthly, availablePlans]);

  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'emola'>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState(
    userPhone ? userPhone.replace('+258', '').replace(/\D/g, '') : '841234567'
  );
  const [step, setStep] = useState<'select_plan' | 'payment_processing' | 'success'>('select_plan');
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(true);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState<BillingInvoiceData | null>(null);

  if (!isOpen) return null;

  const selectedPlan: HeartLinkPlanConfig =
    availablePlans.find((p) => p.id === selectedPlanId) ||
    availablePlans[0] ||
    HEARTLINK_ALL_PLANS[0];

  const handleConfirmPayment = async () => {
    if (!selectedPlan || isProcessing) return;
    setIsProcessing(true);
    setStep('payment_processing');

    try {
      const res = await heartLinkAccessService.initiateAndConfirmPayment({
        planId: selectedPlan.id,
        targetContactId: targetProfile?.id,
        targetContactName: targetProfile?.name,
        amount: selectedPlan.priceMt,
        phoneNumber: phoneNumber.trim(),
        paymentMethod,
      });

      if (res.success) {
        const tx = res.transaction;
        const now = new Date();

        const invoiceNum = `INV-HL-${Math.floor(100000 + Math.random() * 900000)}`;
        const invoiceData: BillingInvoiceData = {
          invoiceNumber: invoiceNum,
          issueDate: now.toLocaleDateString('pt-MZ'),
          dueDate: now.toLocaleDateString('pt-MZ'),
          status: 'PAID',
          moduleType: 'general',
          serviceTitle: `HeartLink • Acesso a Contacto (${selectedPlan.name})`,
          serviceDescription: `Desbloqueio e Acesso a Contacto HeartLink - ${selectedPlan.name}${targetProfile ? ` (${targetProfile.name})` : ''}`,
          clientName: `Utilizador HeartLink (+258 ${phoneNumber})`,
          clientNuitOrBi: 'Consumidor Final (18+)',
          clientPhone: `+258 ${phoneNumber}`,
          clientProvince: 'Moçambique',
          clientCity: 'Moçambique',
          itemDetails: [
            {
              description: `Acesso a Contacto: ${selectedPlan.name}`,
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
          transactionReference: tx.reference,
        };

        setGeneratedInvoice(invoiceData);

        if (onSuccessUnlock) {
          onSuccessUnlock(selectedPlan.type, targetProfile?.id);
        }

        if (onSaveVisibility) {
          onSaveVisibility({
            mode: 'public_showcase',
            isUnlocked: true,
            planId: selectedPlan.id,
            planName: selectedPlan.name,
            expiresAt: tx.expiresAt,
            unlockedAt: tx.createdAt,
            paymentPhone: phoneNumber,
            paymentMethod,
          });
        }

        setIsProcessing(false);
        setStep('success');
      } else {
        setIsProcessing(false);
        setStep('select_plan');
      }
    } catch (e) {
      setIsProcessing(false);
      setStep('select_plan');
    }
  };

  const getPlanIcon = (plan: HeartLinkPlanConfig) => {
    if (plan.tier === 'king') return <P2PGoldenCrownIcon className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" />;
    if (plan.tier === 'diamond') return <P2PBlueDiamondIcon className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" />;
    if (plan.tier === 'heart') return <P2PGreenHeartIcon className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" />;
    if (plan.id === 'contact_20mt') return <User className="w-6 h-6 text-rose-600 shrink-0" />;
    return <Clock className="w-6 h-6 text-amber-600 shrink-0" />;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-200 relative my-auto animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white p-3.5 sm:p-4 relative overflow-hidden shrink-0">
          <div className="flex items-center justify-between gap-2 relative z-10">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shrink-0 shadow-inner">
                <HeartLinkTwoHeartsIcon className="w-6 h-6" variant="white" showStitches={true} />
              </div>
              <div className="min-w-0">
                <span className="text-[9.5px] font-black uppercase tracking-wider bg-black/20 text-amber-300 px-2 py-0.5 rounded-md inline-block">
                  CONTACTOS HEARTLINK
                </span>
                <h2 className="text-base sm:text-lg font-black tracking-tight mt-0.5 truncate leading-tight">
                  {targetProfile ? `Contactar ${targetProfile.name}` : 'Desbloquear Contacto'}
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
        <div className="p-3.5 sm:p-5 space-y-3.5 overflow-y-auto flex-1">

          {/* STEP 1: SELECT PLAN */}
          {step === 'select_plan' && (
            <>
              {/* Target Profile Card (if contacting a specific user) */}
              {targetProfile && (
                <div className="bg-rose-50/80 border border-rose-200/90 rounded-2xl p-3 flex items-center gap-3">
                  {targetProfile.photo ? (
                    <img
                      src={targetProfile.photo}
                      alt={targetProfile.name}
                      className="w-12 h-12 rounded-xl object-cover object-top border border-rose-200 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-rose-200 text-rose-800 flex items-center justify-center font-bold text-sm shrink-0">
                      {targetProfile.name.slice(0, 2)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-extrabold text-sm text-neutral-900 truncate">
                      {targetProfile.name}, {targetProfile.age}
                    </div>
                    <div className="text-[11px] text-neutral-600 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-rose-600 shrink-0" />
                      <span>{targetProfile.city}, {targetProfile.province}</span>
                    </div>
                    <div className="text-[10.5px] text-rose-700 font-semibold mt-0.5">
                      Para iniciar a conversa e ver os contactos, selecione uma das opções abaixo:
                    </div>
                  </div>
                </div>
              )}

              {/* Informative notification if user has active plan */}
              {hasActiveMonthly && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Já possui o plano <strong>{accessState.activeMonthlyPlan?.planId === 'monthly_1000mt' ? 'VIP 👑' : accessState.activeMonthlyPlan?.planId === 'monthly_250mt' ? 'Diamante 💎' : 'Coração ♥️'}</strong> ativo.
                  </span>
                </div>
              )}

              {/* Options List */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-neutral-800 uppercase tracking-wide block">
                  OPÇÕES DE ACESSO AO CONTACTO:
                </label>

                <div className="grid grid-cols-1 gap-2">
                  {availablePlans.map((plan) => {
                    const isSelected = selectedPlanId === plan.id;

                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col gap-1.5 ${
                          isSelected
                            ? 'border-rose-600 bg-rose-50/80 shadow-xs ring-2 ring-rose-600/20'
                            : 'border-neutral-200 hover:border-neutral-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 pr-6">
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            {getPlanIcon(plan)}
                            <div className="min-w-0">
                              <span className="font-black text-xs sm:text-sm text-neutral-900 tracking-tight block truncate">
                                {plan.name}
                              </span>
                              <span className="text-[10px] text-neutral-500 font-medium block">
                                {plan.durationLabel}
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="font-black text-base sm:text-lg text-rose-600 tracking-tight whitespace-nowrap">
                              {plan.priceMt} <span className="text-xs font-bold text-neutral-700">MT</span>
                            </div>
                          </div>
                        </div>

                        {/* Bulleted features */}
                        <div className="pt-1.5 border-t border-neutral-200/70 grid grid-cols-1 gap-1 text-xs">
                          {plan.features.map((feat, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-[10.5px] text-neutral-700">
                              <span className="text-emerald-600 font-bold shrink-0">✓</span>
                              <span className="leading-tight">{feat}</span>
                            </div>
                          ))}
                        </div>

                        {isSelected && (
                          <div className="absolute top-3 right-3 w-4.5 h-4.5 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
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
                    className={`h-10 rounded-xl border-2 flex items-center justify-center gap-2 font-bold text-xs cursor-pointer transition-all ${
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
                    className={`h-10 rounded-xl border-2 flex items-center justify-center gap-2 font-bold text-xs cursor-pointer transition-all ${
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

              {/* Phone number input */}
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
                  Irá receber a confirmação no telemóvel para validar o pagamento com PIN seguro.
                </p>
              </div>

              {/* Terms Acceptance */}
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
                    <span>do HeartLink.</span>
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
                  disabled={phoneNumber.length < 8 || !agreedToTerms || isProcessing}
                  className="flex-1 h-11 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 active:scale-98 disabled:opacity-40 text-white rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <span>Confirmar Pagamento ({selectedPlan.priceMt} MT)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {/* STEP 2: PROCESSING */}
          {step === 'payment_processing' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-rose-100 border-4 border-rose-500 border-t-transparent animate-spin mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-black text-neutral-900">
                  A Processar Pagamento...
                </h3>
                <p className="text-xs text-neutral-600 max-w-xs mx-auto">
                  Por favor, confirme no seu telemóvel (+258 {phoneNumber}) o débito de <strong>{selectedPlan.priceMt} MT</strong>.
                </p>
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
                  Contacto Desbloqueado com Sucesso! ✨
                </h3>
                <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed">
                  O contacto está agora disponível para mensagens directas.
                </p>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200 text-xs text-emerald-950 font-bold space-y-1">
                <div>Acesso Ativo: {selectedPlan.name}</div>
                <div className="text-[11px] text-emerald-800 font-medium">
                  Estado: Disponível para conversar
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
                    <span>Ver Recibo Oficial (Bill)</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <span>Concluir e Conversar</span>
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAccept={() => {
          setAgreedToTerms(true);
          setIsTermsModalOpen(false);
        }}
        contextText="Para desbloquear contactos no HeartLink, confirme a leitura e aceitação dos Termos Gerais (Adultos 18+)."
      />

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
