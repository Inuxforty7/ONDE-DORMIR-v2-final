import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  Lock, 
  CheckCircle2, 
  EyeOff, 
  Sparkles, 
  Clock, 
  MessageCircle, 
  ArrowRight,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import { ContactAttemptNotification } from '../types/contactUnlock';
import { contactUnlockService } from '../services/contactUnlockService';
import { HeartLinkVisibilityModal } from './HeartLinkVisibilityModal';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBillingModal?: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  onOpenBillingModal,
}) => {
  const [notifications, setNotifications] = useState<ContactAttemptNotification[]>(() =>
    contactUnlockService.getNotifications()
  );
  const [heartLinkModalTarget, setHeartLinkModalTarget] = useState<any | null>(null);

  useEffect(() => {
    if (isOpen) {
      setNotifications(contactUnlockService.getNotifications());
      contactUnlockService.markAllAsRead();
    }
  }, [isOpen]);

  useEffect(() => {
    const unsub = contactUnlockService.subscribe(() => {
      setNotifications(contactUnlockService.getNotifications());
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const handleUnlock = (notif: ContactAttemptNotification) => {
    if (notif.module === 'heartlink') {
      setHeartLinkModalTarget({
        id: notif.targetId,
        name: notif.targetName,
        photo: notif.targetPhoto || '',
        city: 'Moçambique',
        province: 'Moçambique',
      });
      return;
    }
    contactUnlockService.unlockContact(notif.targetId);
    setNotifications(contactUnlockService.getNotifications());
  };

  const handleClear = () => {
    contactUnlockService.clearAllNotifications();
    setNotifications([]);
  };

  const formatTimeAgo = (isoDate: string) => {
    try {
      const diffSec = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
      if (diffSec < 60) return 'Há instantes';
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `Há ${diffMin} min`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `Há ${diffHours} h`;
      const diffDays = Math.floor(diffHours / 24);
      return `Há ${diffDays} dias`;
    } catch (e) {
      return 'Recentemente';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-200 relative animate-in zoom-in-95 duration-200 my-auto flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-950 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/25 shrink-0 shadow-inner">
              <Bell className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-black tracking-widest text-amber-300">
                Central de Oportunidades
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                Notificações de Interessados
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

        {/* Monetization & Privacy Strategy Banner */}
        <div className="p-3 bg-amber-50 border-b border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-950 shrink-0">
          <EyeOff className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <strong>Privacidade dos Visitantes Garantida:</strong> Os números de telefone dos interessados ficam em sigilo até que ative o seu perfil para receber clientes diretamente.
          </div>
        </div>

        {/* Notification List Body */}
        <div className="p-3.5 sm:p-4 overflow-y-auto space-y-3 flex-1">
          {notifications.length === 0 ? (
            <div className="p-8 text-center bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-2 my-4">
              <Bell className="w-8 h-8 text-neutral-300 mx-auto" />
              <h3 className="font-extrabold text-sm text-neutral-800">
                Sem notificações pendentes
              </h3>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Assim que um visitante tentar contactar um perfil com contacto bloqueado, os alertas de clientes interessados surgirão aqui.
              </p>
            </div>
          ) : (
            notifications.map((notif) => {
              const isUnlocked = notif.isUnlocked || contactUnlockService.isContactUnlocked(notif.targetId);

              return (
                <div
                  key={notif.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isUnlocked
                      ? 'bg-neutral-50 border-neutral-200/80'
                      : 'bg-white border-orange-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Photo / Icon */}
                      {notif.targetPhoto ? (
                        <img
                          src={notif.targetPhoto}
                          alt={notif.targetName}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-neutral-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-black text-sm shrink-0">
                          {notif.targetName.substring(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-black uppercase tracking-wider text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md">
                            {notif.moduleLabel}
                          </span>
                          <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-neutral-400" />
                            {formatTimeAgo(notif.timestamp)}
                          </span>
                        </div>

                        {/* Notification Title */}
                        {notif.module === 'heartlink' ? (
                          <h4 className="font-black text-sm text-neutral-900 mt-1 leading-snug">
                            {notif.targetName} quer conversar consigo no HeartLink.
                          </h4>
                        ) : (
                          <h4 className="font-black text-sm text-neutral-900 mt-1 leading-snug">
                            {notif.interestedCount > 1
                              ? `Tem ${notif.interestedCount} pessoas interessadas em falar consigo...`
                              : 'Tem 1 cliente interessado em falar consigo...'}
                          </h4>
                        )}

                        <p className="text-xs text-neutral-600 mt-0.5 truncate">
                          Sobre: <strong>{notif.targetName}</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status & Monetization Action Card */}
                  <div className="mt-3 pt-2.5 border-t border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    {isUnlocked ? (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Contacto Desbloqueado (Ativo no WhatsApp)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                        <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Contacto bloqueado por falta de pagamento</span>
                      </div>
                    )}

                    {!isUnlocked && (
                      <button
                        onClick={() => handleUnlock(notif)}
                        className="h-8.5 px-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-black text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>{notif.module === 'heartlink' ? 'Desbloquear Contacto (20 MT)' : 'Desbloquear (1.000 MT)'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-neutral-50 border-t border-neutral-200/80 flex items-center justify-between shrink-0">
          {notifications.length > 0 ? (
            <button
              onClick={handleClear}
              className="text-xs font-bold text-neutral-500 hover:text-rose-600 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar Notificações</span>
            </button>
          ) : (
            <span className="text-xs text-neutral-400">Directório Nacional Moçambique</span>
          )}

          <button
            onClick={onClose}
            className="h-9 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs cursor-pointer active:scale-95"
          >
            Fechar
          </button>
        </div>
      </div>

      {heartLinkModalTarget && (
        <HeartLinkVisibilityModal
          isOpen={Boolean(heartLinkModalTarget)}
          onClose={() => setHeartLinkModalTarget(null)}
          targetProfile={heartLinkModalTarget}
          initialPlanId="contact_20mt"
          onSuccessUnlock={() => {
            contactUnlockService.unlockContact(heartLinkModalTarget.id);
            setNotifications(contactUnlockService.getNotifications());
            setHeartLinkModalTarget(null);
          }}
        />
      )}
    </div>
  );
};
