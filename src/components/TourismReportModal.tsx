import React, { useState } from 'react';
import { ShieldAlert, X, AlertTriangle, CheckCircle2, Lock } from 'lucide-react';
import { tourismVerificationService } from '../services/tourismVerificationService';

interface TourismReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetType: 'guide' | 'experience' | 'place';
  targetName: string;
  onReported?: () => void;
}

export const TourismReportModal: React.FC<TourismReportModalProps> = ({
  isOpen,
  onClose,
  targetId,
  targetType,
  targetName,
  onReported,
}) => {
  const [reason, setReason] = useState('Perfil Falso / Informação Incorreta');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    const res = await tourismVerificationService.submitReport({
      targetId,
      targetType,
      targetName,
      reason,
      details,
    });

    setIsSubmitting(false);

    if (res.success) {
      setIsSuccess(true);
      if (onReported) onReported();
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2500);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleBlockOnly = () => {
    tourismVerificationService.blockItem(targetId, targetName);
    if (onReported) onReported();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl max-w-sm sm:max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200 relative my-auto animate-in zoom-in-95 duration-150 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-rose-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-rose-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldAlert className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-rose-200 tracking-wider">
                Segurança e Moderação
              </span>
              <h3 className="text-sm font-black text-white leading-tight">
                Denunciar ou Bloquear
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
          {isSuccess ? (
            <div className="py-6 text-center space-y-2 animate-in zoom-in-95">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-black text-neutral-900">
                Denúncia Enviada com Sucesso
              </h4>
              <p className="text-xs text-neutral-600 max-w-xs mx-auto">
                A nossa equipa de auditoria vai analisar o perfil. O item foi ocultado do seu catálogo local.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitReport} className="space-y-3">
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-neutral-500">Alvo da Denúncia:</span>
                <div className="font-extrabold text-neutral-900 text-sm">{targetName}</div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs font-bold">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-extrabold text-neutral-800 mb-1">
                  Motivo Principal *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full h-11 px-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-900 focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none cursor-pointer"
                >
                  <option value="Perfil Falso / Informação Incorreta">Perfil Falso ou Informação Incorreta</option>
                  <option value="Tentativa de Burla ou Cobrança Indevida">Tentativa de Burla ou Cobrança Indevida</option>
                  <option value="Comportamento Inadequado ou Abusivo">Comportamento Inadequado ou Abusivo</option>
                  <option value="Guia Não Autorizado / Falta de Credenciais">Guia Não Autorizado / Falta de Credenciais</option>
                  <option value="Outro Motivo de Segurança">Outro Motivo de Segurança</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Detalhes Adicionais (Opcional)
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Descreva brevemente o sucedido..."
                  className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-900 focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleBlockOnly}
                  className="h-11 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  title="Bloqueia este item no seu catálogo local sem submeter relatório"
                >
                  <Lock className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Apenas Bloquear</span>
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-11 bg-rose-700 hover:bg-rose-800 active:scale-98 text-white rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-300" />
                  <span>{isSubmitting ? 'A Enviar...' : 'Submeter Denúncia'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
