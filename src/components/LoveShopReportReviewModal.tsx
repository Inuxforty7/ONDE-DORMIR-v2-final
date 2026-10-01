import React, { useState } from 'react';
import { X, Flag, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { LoveShopReview } from '../types';
import { loveShopOrderService } from '../services/loveShopOrderService';

interface LoveShopReportReviewModalProps {
  review: LoveShopReview | null;
  isOpen: boolean;
  onClose: () => void;
  onReportSubmitted: () => void;
}

export const LoveShopReportReviewModal: React.FC<LoveShopReportReviewModalProps> = ({
  review,
  isOpen,
  onClose,
  onReportSubmitted,
}) => {
  const [reason, setReason] = useState<'nao_foi_cliente' | 'linguagem_ofensiva' | 'avaliacao_fraudulenta'>('nao_foi_cliente');
  const [details, setDetails] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !review) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loveShopOrderService.reportReview(review.id, reason);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onReportSubmitted();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center">
              <Flag className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 leading-tight">
                Denunciar Avaliação
              </h3>
              <p className="text-[11px] text-neutral-500 font-medium mt-0.5">
                Proteção do Vendedor Contra Má-Fé
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {isSuccess ? (
            <div className="p-6 text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-neutral-900">
                Denúncia Submetida para Moderação
              </h4>
              <p className="text-xs text-neutral-600">
                A avaliação foi sinalizada e enviada para a equipa de auditoria de segurança da plataforma.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-900">{review.userName}</span>
                  <span className="text-neutral-400">{review.date}</span>
                </div>
                {review.comment && (
                  <p className="text-xs text-neutral-600 italic">"{review.comment}"</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-800 block">
                  Motivo da Denúncia *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 cursor-pointer text-xs font-medium text-neutral-800">
                    <input
                      type="radio"
                      name="reason"
                      value="nao_foi_cliente"
                      checked={reason === 'nao_foi_cliente'}
                      onChange={() => setReason('nao_foi_cliente')}
                      className="accent-rose-600"
                    />
                    <span>Não foi meu cliente / Transação não ocorreu</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 cursor-pointer text-xs font-medium text-neutral-800">
                    <input
                      type="radio"
                      name="reason"
                      value="linguagem_ofensiva"
                      checked={reason === 'linguagem_ofensiva'}
                      onChange={() => setReason('linguagem_ofensiva')}
                      className="accent-rose-600"
                    />
                    <span>Linguagem ofensiva, difamatória ou injuriosa</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 cursor-pointer text-xs font-medium text-neutral-800">
                    <input
                      type="radio"
                      name="reason"
                      value="avaliacao_fraudulenta"
                      checked={reason === 'avaliacao_fraudulenta'}
                      onChange={() => setReason('avaliacao_fraudulenta')}
                      className="accent-rose-600"
                    />
                    <span>Avaliação fraudulenta ou de concorrência desleal</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  Detalhes Adicionais (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Explique o contexto para a equipa de auditoria..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs focus:border-rose-600 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-10 px-4 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="h-10 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Enviar Denúncia
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
