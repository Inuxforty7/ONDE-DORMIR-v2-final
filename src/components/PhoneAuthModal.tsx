import React, { useState } from 'react';
import { Phone, Lock, X, CheckCircle2, AlertCircle, ArrowRight, Smartphone } from 'lucide-react';
import { verificationService } from '../services/verificationService';
import { authService, AuthUser } from '../services/authService';

interface PhoneAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: AuthUser) => void;
}

export const PhoneAuthModal: React.FC<PhoneAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 8) {
      setErrorMsg('Insira um número de telefone moçambicano válido (+258 82/83/84/85/86/87).');
      return;
    }

    setIsSubmitting(true);
    try {
      const formatted = cleanPhone.startsWith('258') ? cleanPhone : `258${cleanPhone}`;
      const res = await verificationService.requestOtp(formatted);
      setIsSubmitting(false);

      if (res.success && res.data) {
        if (res.data.demoCode) {
          setDemoCode(res.data.demoCode);
        }
        setStep('otp');
      } else {
        setErrorMsg(res.error || 'Não foi possível enviar o SMS. Tente novamente.');
      }
    } catch {
      setIsSubmitting(false);
      setErrorMsg('Erro de comunicação. Verifique a ligação e tente novamente.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (otpCode.trim().length < 4) {
      setErrorMsg('Insira o código de verificação recebido por SMS.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formatted = phoneNumber.replace(/\D/g, '');
      const fullPhone = formatted.startsWith('258') ? formatted : `258${formatted}`;
      const res = await verificationService.verifyOtp(fullPhone, otpCode.trim());
      setIsSubmitting(false);

      if (res.success && res.data) {
        onAuthSuccess(res.data.user);
        onClose();
      } else {
        setErrorMsg(res.error || 'Código incorreto ou expirado.');
      }
    } catch {
      setIsSubmitting(false);
      setErrorMsg('Erro na verificação do código. Tente novamente.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-neutral-200 relative my-auto animate-in zoom-in-95 duration-150 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-neutral-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-orange-600 text-white flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white leading-tight">
                Autenticação de Conta
              </h3>
              <p className="text-[11px] text-neutral-400">
                {step === 'phone' ? 'Introduza o seu número de telemóvel' : 'Confirme o código recebido por SMS'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-3 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Número de Telemóvel (+258) *
                </label>
                <div className="relative">
                  <span className="text-xs font-bold text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2">
                    +258
                  </span>
                  <input
                    type="tel"
                    required
                    autoFocus
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="84 123 4567"
                    className="w-full h-11 pl-13 pr-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-900 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-orange-600 hover:bg-orange-700 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'A enviar SMS...' : 'Enviar Código SMS'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-3">
              {demoCode && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-bold flex items-center justify-between">
                  <span>Código SMS de Teste:</span>
                  <span className="font-mono text-sm tracking-wider font-black">{demoCode}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Código de Verificação SMS *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    autoFocus
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Ex: 123456"
                    className="w-full h-11 pl-9 pr-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm font-mono font-bold tracking-wider text-neutral-900 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="h-11 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-11 bg-orange-600 hover:bg-orange-700 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'A verificar...' : 'Confirmar & Continuar'}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
