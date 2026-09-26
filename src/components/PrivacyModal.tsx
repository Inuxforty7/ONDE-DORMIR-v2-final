import React from 'react';
import { X, ShieldCheck, EyeOff, UserX, Lock, MessageSquare } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[88vh] animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-emerald-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-neutral-900">
                Privacidade & Discrição
              </h2>
              <p className="text-xs text-emerald-800 font-medium">
                ONDE DORMIR • Princípios Fundamentais
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-emerald-100/70 text-neutral-600 hover:text-neutral-900 transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium">
            O <strong>ONDE DORMIR</strong> foi concebido para ser uma ponte simples, rápida e 100% privada entre si e os alojamentos em Moçambique.
          </p>

          <div className="space-y-3">
            <div className="flex gap-3.5 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <EyeOff className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-neutral-900">Sem rastreio de visualizações</h4>
                <p className="text-xs sm:text-sm text-neutral-600 mt-0.5 leading-relaxed">
                  Nenhum estabelecimento ou terceiro sabe quem pesquisou ou visualizou um alojamento.
                </p>
              </div>
            </div>

            <div className="flex gap-3.5 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <UserX className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-neutral-900">Sem motivo de hospedagem</h4>
                <p className="text-xs sm:text-sm text-neutral-600 mt-0.5 leading-relaxed">
                  Não perguntamos se viaja em trabalho, lazer, trânsito ou descanso. A sua discrição é inviolável.
                </p>
              </div>
            </div>

            <div className="flex gap-3.5 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-neutral-900">Sem atividade social pública</h4>
                <p className="text-xs sm:text-sm text-neutral-600 mt-0.5 leading-relaxed">
                  Sem feeds e sem comentários expostos. Estabelecimentos guardados ficam salvos apenas na memória do seu dispositivo.
                </p>
              </div>
            </div>

            <div className="flex gap-3.5 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-neutral-900">Contacto direto sem intermediários</h4>
                <p className="text-xs sm:text-sm text-neutral-600 mt-0.5 leading-relaxed">
                  O contacto via WhatsApp ou chamada telefónica é feito diretamente do seu telemóvel para a recepção do estabelecimento.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with 48px button */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer touch-manipulation"
          >
            Entendido, continuar a navegar
          </button>
        </div>
      </div>
    </div>
  );
};
