import React, { useState } from 'react';
import { X, ShieldCheck, EyeOff, UserX, Lock, MessageSquare, Scale, ChevronDown, ChevronUp } from 'lucide-react';
import { TermsModal } from './TermsModal';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleItem = (idx: number) => {
    setExpandedIndex((prev) => (prev === idx ? null : idx));
  };

  if (!isOpen) return null;

  const items = [
    {
      icon: EyeOff,
      title: 'Sem rastreio de visualizações',
      desc: 'Nenhum estabelecimento ou terceiro sabe quem pesquisou ou visualizou um alojamento.',
    },
    {
      icon: UserX,
      title: 'Sem motivo de hospedagem',
      desc: 'Não perguntamos se viaja em trabalho, lazer, trânsito ou descanso. A sua discrição é inviolável.',
    },
    {
      icon: Lock,
      title: 'Sem atividade social pública',
      desc: 'Sem feeds e sem comentários expostos. Estabelecimentos guardados ficam salvos apenas na memória do seu dispositivo.',
    },
    {
      icon: MessageSquare,
      title: 'Contacto direto sem intermediários',
      desc: 'O contacto via WhatsApp ou chamada telefónica é feito diretamente do seu telemóvel para a recepção do estabelecimento.',
    },
  ];

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

          <div className="space-y-2.5">
            {items.map((item, idx) => {
              const Icon = item.icon;
              const isExpanded = expandedIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="rounded-2xl bg-neutral-50 border border-neutral-200/80 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(idx)}
                    className="w-full p-3.5 flex items-center justify-between text-left hover:bg-neutral-100/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <Icon className="w-4 h-4 text-emerald-600 shrink-0" />
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                        {item.title}
                      </h4>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="px-3.5 pb-3.5 pt-0 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-200/50 pt-2">
                      {item.desc}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Official Legal Terms Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsTermsModalOpen(true)}
                className="w-full p-3.5 rounded-2xl bg-blue-50/80 hover:bg-blue-100 border border-blue-200 text-blue-900 flex items-center justify-between text-xs font-bold transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 text-left">
                  <Scale className="w-4 h-4 text-blue-700 shrink-0" />
                  <div>
                    <span className="block font-black">Termos e Condições Gerais</span>
                    <span className="text-[10.5px] text-blue-700/80 font-medium">ÁGUIA Soluções & Serviços (Conexões Rápidas)</span>
                  </div>
                </div>
                <span className="text-xs font-black text-blue-600 group-hover:translate-x-0.5 transition-transform">Ler →</span>
              </button>
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

      {/* Official Legal Terms Modal */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
    </div>
  );
};
