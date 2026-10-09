import React, { useState } from 'react';
import { 
  UserCheck, 
  X, 
  Copy, 
  Check, 
  FileText, 
  Phone, 
  ShieldCheck
} from 'lucide-react';
import { RenterProfile } from '../services/renterVerificationService';

interface ClientRentalCredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: RenterProfile;
  onEditProfile?: () => void;
}

export const ClientRentalCredentialModal: React.FC<ClientRentalCredentialModalProps> = ({
  isOpen,
  onClose,
  profile,
  onEditProfile,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(profile.verificationCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl max-w-sm sm:max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200 relative my-auto animate-in zoom-in-95 duration-150 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-neutral-900 text-white p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-orange-400 tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>LOCATÁRIO VERIFICADO</span>
                </span>
                <h3 className="text-sm font-black text-white leading-tight">
                  {profile.fullName}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Card Central */}
          <div className="mt-4 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-neutral-300">Código de Locatário:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-black text-amber-300 text-sm">
                  {profile.verificationCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-1 rounded-md bg-white/20 hover:bg-white/30 text-white cursor-pointer transition-colors"
                  title="Copiar código"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detalhes do Perfil Sanitizado (sem base64 ou fotos sensíveis) */}
        <div className="p-4 sm:p-5 space-y-3 text-xs">
          <div className="space-y-2 bg-neutral-50 p-3 rounded-2xl border border-neutral-200">
            <div className="flex justify-between items-center text-neutral-700">
              <span className="text-neutral-500">Documento de Identificação:</span>
              <span className="font-mono font-bold text-neutral-900">BI {profile.maskedBiNumber}</span>
            </div>
            <div className="flex justify-between items-center text-neutral-700">
              <span className="text-neutral-500">Telefone Contacto:</span>
              <span className="font-bold text-neutral-900">{profile.phone}</span>
            </div>
            <div className="flex justify-between items-center text-neutral-700">
              <span className="text-neutral-500">Estado da Verificação:</span>
              <span className="font-bold text-emerald-700 uppercase">{profile.status}</span>
            </div>
            {profile.driverLicenseNumber && (
              <div className="flex justify-between items-center text-neutral-700">
                <span className="text-neutral-500">Carta de Condução:</span>
                <span className="font-mono font-bold text-neutral-900">{profile.driverLicenseNumber}</span>
              </div>
            )}
          </div>

          <div className="pt-1 flex gap-2">
            {onEditProfile && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEditProfile();
                }}
                className="flex-1 h-10 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs cursor-pointer transition-colors"
              >
                Re-Verificar
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs cursor-pointer transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
