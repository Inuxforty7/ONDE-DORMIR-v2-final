import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Bell, 
  X, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  EyeOff
} from 'lucide-react';
import { LockedContactTarget } from '../types/contactUnlock';
import { contactUnlockService } from '../services/contactUnlockService';
import { BillingInvoiceModal, BillingInvoiceData } from './BillingInvoiceModal';
import { FileText } from 'lucide-react';

interface ContactLockedNoticeModalProps {
  target: LockedContactTarget | null;
  isOpen: boolean;
  onClose: () => void;
  onUnlockedSuccess?: (targetId: string) => void;
}

export const ContactLockedNoticeModal: React.FC<ContactLockedNoticeModalProps> = ({
  target,
  isOpen,
  onClose,
  onUnlockedSuccess,
}) => {
  const [isRequestingUnlock, setIsRequestingUnlock] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState<BillingInvoiceData | null>(null);

  if (!isOpen || !target) return null;

  const handleRequestUnlock = async () => {
    setIsRequestingUnlock(true);

    const fee = target.unlockFee || 1000;
    const invoiceNum = `INV-FT-${Math.floor(100000 + Math.random() * 900000)}`;
    const inv: BillingInvoiceData = {
      invoiceNumber: invoiceNum,
      issueDate: new Date().toLocaleDateString('pt-MZ'),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-MZ'),
      status: 'PENDING',
      moduleType: 'general',
      serviceTitle: `Desbloqueio de Contacto • ${target.moduleLabel}`,
      serviceDescription: `Subscrição Mensal de Ativação do Contacto Directo WhatsApp / Chamada (${target.name})`,
      clientName: `${target.name} (Proprietário)`,
      clientNuitOrBi: '400123890',
      clientPhone: target.phone || target.whatsapp || '+258 84 123 4567',
      clientProvince: 'Moçambique',
      clientCity: 'Moçambique',
      itemDetails: [
        {
          description: `Ativação de Contacto Directo (${target.name} • ${target.moduleLabel})`,
          quantity: 1,
          unitPriceMzn: fee,
          totalMzn: fee,
        },
      ],
      subtotalMzn: fee,
      ivaRate: 0,
      ivaAmountMzn: 0,
      totalMzn: fee,
      paymentMethod: 'M-Pesa',
      transactionReference: `TX-MZ-${Math.floor(10000000 + Math.random() * 90000000)}`,
    };

    setGeneratedInvoice(inv);
    setIsRequestingUnlock(false);
    setPendingConfirmation(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3.5 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200 relative animate-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/25 shrink-0 shadow-inner">
              <Lock className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-black tracking-widest text-amber-200">
                Aviso do Sistema
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                Chat P2P Indisponível
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4">
          
          {/* Target Profile Card Summary */}
          <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/90 flex items-center gap-3">
            {target.photo ? (
              <img
                src={target.photo}
                alt={target.name}
                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-neutral-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-black text-sm shrink-0">
                {target.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md inline-block mb-0.5">
                {target.moduleLabel}
              </span>
              <h3 className="font-extrabold text-sm sm:text-base text-neutral-900 truncate">
                {target.name}
              </h3>
              <p className="text-[11px] text-neutral-500 truncate">
                Perfil visível • Chat P2P Indisponível
              </p>
            </div>
          </div>

          {/* Explanation Text */}
          <div className="space-y-1.5 text-xs sm:text-sm text-neutral-800 leading-relaxed bg-rose-50/70 p-3.5 rounded-2xl border border-rose-200/80">
            <p className="font-bold text-rose-950 text-sm">
              Este utilizador ainda não tem o Chat P2P ativo.
            </p>
          </div>

          {/* Automatic System Notification Card */}
          <div className="p-3.5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/90 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs">
              <Bell className="w-4 h-4 text-orange-600 shrink-0 animate-bounce" />
              <span>Notificação Enviada ao Titular:</span>
            </div>
            
            <p className="text-xs text-amber-950/90 leading-snug font-medium bg-white/70 p-2 rounded-xl border border-amber-200">
              <em>&ldquo;Alguém quer conversar consigo no HeartLink. Ative o Chat P2P para poder receber mensagens.&rdquo;</em>
            </p>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-neutral-600 font-medium">
              <EyeOff className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>Privacidade Garantida: O seu número e identidade não foram revelados.</span>
            </div>
          </div>

          {/* Pending Confirmation State */}
          {pendingConfirmation && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl space-y-2 text-xs text-amber-900 font-bold animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
                <span>Pedido de subscrição registado. A aguardar confirmação de pagamento do provedor.</span>
              </div>
              <p className="text-[11px] text-amber-800 font-normal">
                Por regras de segurança, o contacto direto será liberado assim que o pagamento via M-Pesa / e-Mola for autenticado e confirmado.
              </p>
              {generatedInvoice && (
                <button
                  type="button"
                  onClick={() => setIsInvoiceOpen(true)}
                  className="w-full h-10 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <FileText className="w-4 h-4" />
                  <span>Ver Fatura Pro-Forma (Pendente)</span>
                </button>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            {!pendingConfirmation ? (
              <button
                onClick={handleRequestUnlock}
                disabled={isRequestingUnlock}
                className="w-full h-11 px-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50 touch-manipulation"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>
                  {isRequestingUnlock 
                    ? 'A processar pedido...' 
                    : `Solicitar Acesso a Contactos (${target.unlockFee || 1000} MT / Fatura)`}
                </span>
              </button>
            ) : null}

            <button
              onClick={onClose}
              className="w-full h-10 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs rounded-2xl transition-colors cursor-pointer"
            >
              {pendingConfirmation ? 'Concluir' : 'Compreendido, fechar aviso'}
            </button>
          </div>

        </div>
      </div>

      {/* Official Billing Invoice Modal */}
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
