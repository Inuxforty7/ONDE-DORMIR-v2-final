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
  const [isSimulatingUnlock, setIsSimulatingUnlock] = useState(false);
  const [unlockedSuccess, setUnlockedSuccess] = useState(false);

  if (!isOpen || !target) return null;

  const handleSimulateUnlock = () => {
    setIsSimulatingUnlock(true);
    setTimeout(() => {
      contactUnlockService.unlockContact(target.id);
      setIsSimulatingUnlock(false);
      setUnlockedSuccess(true);
      if (onUnlockedSuccess) {
        onUnlockedSuccess(target.id);
      }
      setTimeout(() => {
        setUnlockedSuccess(false);
        onClose();
      }, 1800);
    }, 800);
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
                Contacto não desbloqueado
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
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md inline-block mb-0.5">
                {target.moduleLabel}
              </span>
              <h3 className="font-extrabold text-sm sm:text-base text-neutral-900 truncate">
                {target.name}
              </h3>
              <p className="text-[11px] text-neutral-500 truncate">
                Recepção direta e WhatsApp bloqueados
              </p>
            </div>
          </div>

          {/* Explanation Text */}
          <div className="space-y-2 text-xs sm:text-sm text-neutral-700 leading-relaxed">
            <p className="font-medium">
              Este perfil ainda não pagou a taxa mensal de ativação (<strong>{target.unlockFee || 1000} MT/mês</strong>) para receber chamadas e mensagens no WhatsApp.
            </p>
          </div>

          {/* Automatic System Notification Card */}
          <div className="p-3.5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/90 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs">
              <Bell className="w-4 h-4 text-orange-600 shrink-0 animate-bounce" />
              <span>Notificação Automática Enviada ao Proprietário:</span>
            </div>
            
            <p className="text-xs text-amber-950/90 leading-snug">
              <em>&ldquo;Tem clientes interessados em falar consigo sobre <strong>{target.name}</strong>...&rdquo;</em>
            </p>

            <div className="flex items-center gap-2 pt-1 border-t border-amber-200/60 text-[11px] text-neutral-600 font-medium">
              <EyeOff className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>Privacidade Garantida: O seu número e identidade não foram revelados.</span>
            </div>
          </div>

          {/* Success State when Unlocked */}
          {unlockedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-900 font-bold animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Contacto desbloqueado com sucesso! Acesso ao WhatsApp libertado.</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={handleSimulateUnlock}
              disabled={isSimulatingUnlock || unlockedSuccess}
              className="w-full h-11 px-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50 touch-manipulation"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>
                {isSimulatingUnlock 
                  ? 'A validar taxa de 1.000 MT...' 
                  : unlockedSuccess
                    ? 'Desbloqueado ✓'
                    : 'Desbloquear Perfil (Taxa 1.000 MT / Fatura)'}
              </span>
            </button>

            <button
              onClick={onClose}
              className="w-full h-10 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs rounded-2xl transition-colors cursor-pointer"
            >
              Compreendido, fechar aviso
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
