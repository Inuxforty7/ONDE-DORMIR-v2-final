import React, { useState, useEffect } from 'react';
import { Smartphone, Lock, X, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import { verificationService } from '../services/verificationService';
import { tourismVerificationService } from '../services/tourismVerificationService';

export const COUNTRY_CODES = [
  { code: '+258', country: 'Moçambique', flag: '🇲🇿', digits: 9 },
  { code: '+27', country: 'África do Sul', flag: '🇿🇦', digits: 9 },
  { code: '+351', country: 'Portugal', flag: '🇵🇹', digits: 9 },
  { code: '+1', country: 'EUA / Canadá', flag: '🇺🇸', digits: 10 },
  { code: '+44', country: 'Reino Unido', flag: '🇬🇧', digits: 10 },
  { code: '+49', country: 'Alemanha', flag: '🇩🇪', digits: 10 },
  { code: '+33', country: 'França', flag: '🇫🇷', digits: 9 },
  { code: '+34', country: 'Espanha', flag: '🇪🇸', digits: 9 },
  { code: '+55', country: 'Brasil', flag: '🇧🇷', digits: 11 },
  { code: '+91', country: 'Índia', flag: '🇮🇳', digits: 10 },
  { code: '+244', country: 'Angola', flag: '🇦🇴', digits: 9 },
  { code: '+255', country: 'Tanzânia', flag: '🇹🇿', digits: 9 },
  { code: '+260', country: 'Zâmbia', flag: '🇿🇲', digits: 9 },
  { code: '+263', country: 'Zimbábue', flag: '🇿🇼', digits: 9 },
  { code: '+267', country: 'Botsuana', flag: '🇧🇼', digits: 8 },
  { code: '+238', country: 'Cabo Verde', flag: '🇨🇻', digits: 7 },
  { code: '+239', country: 'São Tomé e Príncipe', flag: '🇸🇹', digits: 7 },
];

interface TouristPhoneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetName?: string;
  onVerified: () => void;
}

export const TouristPhoneVerificationModal: React.FC<TouristPhoneVerificationModalProps> = ({
  isOpen,
  onClose,
  targetName,
  onVerified,
}) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [selectedCountryCode, setSelectedCountryCode] = useState('+258');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [consentShare, setConsentShare] = useState(true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: any = null;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((c) => Math.max(0, c - 1));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldown]);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 6) {
      setErrorMsg('Insira um número de telefone válido.');
      return;
    }

    if (cooldown > 0) {
      setErrorMsg(`Aguarde ${cooldown}s antes de solicitar novo SMS.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const fullNumber = `${selectedCountryCode}${cleanPhone}`;
      const res = await verificationService.requestOtp(fullNumber);
      setIsSubmitting(false);

      if (res.success && res.data) {
        setIsDemoMode(Boolean(res.data.isDemo));
        if (res.data.demoCode) {
          setDemoCode(res.data.demoCode);
        }
        setStep('otp');
        setCooldown(45); // Cooldown to prevent spam / rate limits
      } else {
        setErrorMsg(res.error || 'Não foi possível enviar o SMS. Verifique o número e tente novamente.');
      }
    } catch {
      setIsSubmitting(false);
      setErrorMsg('Erro de rede ao comunicar com o servidor de SMS.');
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
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      const fullNumber = `${selectedCountryCode}${cleanPhone}`;
      const res = await verificationService.verifyOtp(fullNumber, otpCode.trim());
      setIsSubmitting(false);

      if (res.success) {
        // Persist tourist phone verification
        tourismVerificationService.saveTouristVerification({
          phoneNumber: fullNumber,
          countryCode: selectedCountryCode,
          isVerified: true,
          verifiedAt: new Date().toISOString(),
          consentSharePhone: consentShare,
        });

        onVerified();
        onClose();
      } else {
        setErrorMsg(res.error || 'Código SMS incorreto. Verifique e tente novamente.');
      }
    } catch {
      setIsSubmitting(false);
      setErrorMsg('Erro de comunicação ao validar código.');
    }
  };

  const selectedCountry = COUNTRY_CODES.find((c) => c.code === selectedCountryCode) || COUNTRY_CODES[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-neutral-200 relative my-auto animate-in zoom-in-95 duration-150 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-emerald-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Smartphone className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Verificação de Turista</span>
              </span>
              <h3 className="text-sm font-black text-white leading-tight">
                {targetName ? `Contactar ${targetName}` : 'Verificar Número de Telemóvel'}
              </h3>
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
        <div className="p-4 sm:p-5 space-y-3.5 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-3.5">
              <p className="text-neutral-600 leading-relaxed text-[11.5px]">
                Para proteger os guias e turistas contra spam, introduza o seu telemóvel para receber um código SMS único.
              </p>

              <div>
                <label className="block text-xs font-extrabold text-neutral-800 mb-1">
                  País e Número de Telemóvel *
                </label>

                <div className="grid grid-cols-12 gap-1.5">
                  {/* Country Selector */}
                  <div className="col-span-5 relative">
                    <select
                      value={selectedCountryCode}
                      onChange={(e) => setSelectedCountryCode(e.target.value)}
                      className="w-full h-11 px-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-900 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none cursor-pointer appearance-none"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code} ({c.country})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Phone input */}
                  <div className="col-span-7">
                    <input
                      type="tel"
                      required
                      autoFocus
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Ex: 84 123 4567"
                      className="w-full h-11 px-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-900 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Privacy Consent Checkbox */}
              <label className="flex items-start gap-2 pt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consentShare}
                  onChange={(e) => setConsentShare(e.target.checked)}
                  className="mt-0.5 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-[11px] text-neutral-600 leading-tight">
                  Permitir incluir o meu número no texto do WhatsApp para coordenação direta da visita.
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting || cooldown > 0}
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'A enviar SMS...' : cooldown > 0 ? `Aguarde ${cooldown}s` : 'Enviar Código SMS'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-3.5">
              {/* DEMO MODE NOTICE */}
              {isDemoMode && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-950 text-xs space-y-1">
                  <div className="flex items-center justify-between font-black">
                    <span className="flex items-center gap-1 text-amber-800">
                      <Globe className="w-3.5 h-3.5" /> Modo Demo Ativo
                    </span>
                    <span className="font-mono text-sm tracking-wider bg-amber-200/90 text-amber-950 px-2 py-0.5 rounded font-black">
                      {demoCode || '123456'}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-amber-800 leading-tight">
                    Modo sandbox ativado (gateway SMS em teste). Utilize o código acima para validar.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Código de Verificação SMS (6 dígitos) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    autoFocus
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Ex: 123456"
                    className="w-full h-11 pl-9 pr-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm font-mono font-bold tracking-widest text-center text-neutral-900 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
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
                  className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'A verificar...' : 'Confirmar & Iniciar Contacto'}</span>
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
