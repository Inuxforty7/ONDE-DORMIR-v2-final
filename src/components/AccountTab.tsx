import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  MapPin, 
  MessageCircle, 
  Trash2,
  FileText,
  UserCheck,
  Clock,
  ArrowLeft,
  Home
} from 'lucide-react';
import { UserLocationState } from '../types';
import { Logo } from './Logo';
import { TermsModal } from './TermsModal';
import { authService, AuthUser } from '../services/authService';
import { getPlatformTenureText } from '../utils/tenure';
import { BillingInvoiceModal } from './BillingInvoiceModal';

interface AccountTabProps {
  onBackToHome?: () => void;
  userLocation: UserLocationState;
  onOpenPrivacyModal: () => void;
  onOpenRegisterModal: () => void;
  onOpenLocationModal: () => void;
  savedCount: number;
  totalAccommodationsCount: number;
  onClearStorage: () => void;
  onOpenPlatformOwnerDashboard?: () => void;
}

export const AccountTab: React.FC<AccountTabProps> = ({
  onBackToHome,
  userLocation,
  onOpenPrivacyModal,
  onOpenRegisterModal,
  onOpenLocationModal,
  savedCount,
  totalAccommodationsCount,
  onClearStorage,
  onOpenPlatformOwnerDashboard,
}) => {
  const [confirmClear, setConfirmClear] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(authService.getCurrentUser());

  useEffect(() => {
    return authService.subscribe((u) => setCurrentUser(u));
  }, []);

  return (
    <div className="pb-16 sm:pb-20 pt-2 sm:pt-4 max-w-2xl mx-auto px-3 sm:px-4 space-y-4">
      {/* Header Profile Summary with High Contrast Light Logo */}
      <div className="bg-white rounded-3xl p-5 border border-neutral-200/90 shadow-2xs space-y-4">
        <div>
          <Logo size="lg" theme="light" showText={true} />
          <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed font-medium">
            Directório de hospedagens, guias locais, aluguer de viaturas e conexões.
          </p>
        </div>

        {/* Stats Pill Row */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-100">
          <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-150">
            <span className="text-xs text-neutral-500 block font-semibold">Guardados</span>
            <span className="text-lg font-extrabold text-neutral-900 mt-0.5 block">{savedCount}</span>
          </div>
          <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-150">
            <span className="text-xs text-neutral-500 block font-semibold">Hospedagens no Directório</span>
            <span className="text-lg font-extrabold text-neutral-900 mt-0.5 block">{totalAccommodationsCount}</span>
          </div>
        </div>
      </div>

      {/* Indicador de Antiguidade da Conta do Utilizador na Plataforma */}
      <div className="bg-white p-4 rounded-3xl border border-neutral-200/90 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Antiguidade do Perfil</h3>
            <p className="text-sm font-extrabold text-neutral-900 mt-0.5">
              {getPlatformTenureText('2024-03-15', undefined, 'user-account')}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-200">
          Ativo
        </span>
      </div>

      {/* For Property Owners CTA */}
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-3xl p-5 sm:p-6 space-y-3 shadow-md">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Building2 className="w-4 h-4" />
          <span>Proprietários e Anfitriões</span>
        </div>
        <h2 className="text-base sm:text-lg font-extrabold text-white">
          Registe a sua pensão, guest house ou alojamento
        </h2>
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
          Receba contactos directos por WhatsApp e chamada telefónica dos clientes próximos da sua localização.
        </p>
        <div className="pt-2">
          <button
            onClick={onOpenRegisterModal}
            className="w-full h-12 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm touch-manipulation"
          >
            <span>+ Registar Estabelecimento no Directório</span>
          </button>
        </div>
      </div>

      {/* Settings & Privacy Section */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden divide-y divide-neutral-100 shadow-2xs">
        <div className="p-4 bg-neutral-50/70">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Definições & Informações Legais
          </h3>
        </div>

        {/* Location setting */}
        <button
          onClick={onOpenLocationModal}
          className="w-full p-4 flex items-center justify-between hover:bg-neutral-50 active:bg-neutral-100 transition-colors text-left cursor-pointer touch-manipulation"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-neutral-900">Localização de Referência</div>
              <div className="text-xs text-neutral-500 mt-0.5 font-medium">{userLocation.name}</div>
            </div>
          </div>
          <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0">
            Alterar
          </span>
        </button>

        {/* Privacy manifesto modal link */}
        <button
          onClick={onOpenPrivacyModal}
          className="w-full p-4 flex items-center justify-between hover:bg-neutral-50 active:bg-neutral-100 transition-colors text-left cursor-pointer touch-manipulation"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-neutral-900">Privacidade & Anonimato</div>
              <div className="text-xs text-neutral-500 mt-0.5 font-medium">Sem rastreio de buscas</div>
            </div>
          </div>
          <span className="text-xs text-neutral-600 font-semibold px-2">Ver</span>
        </button>

        {/* Terms and Conditions */}
        <button
          onClick={() => setIsTermsOpen(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-neutral-50 active:bg-neutral-100 transition-colors text-left cursor-pointer touch-manipulation"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-neutral-900">Termos e Condições Gerais</div>
              <div className="text-xs text-neutral-500 mt-0.5 font-medium">ÁGUIA Soluções & Serviços (Conexões Rápidas)</div>
            </div>
          </div>
          <span className="text-xs text-blue-700 font-bold bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">Ler</span>
        </button>

        {/* Faturação & Recibos Oficiais (Bill) */}
        <button
          onClick={() => setIsBillingModalOpen(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-neutral-50 active:bg-neutral-100 transition-colors text-left cursor-pointer touch-manipulation"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-neutral-900">Centro de Faturação & Recibos (Bill)</div>
              <div className="text-xs text-neutral-500 mt-0.5 font-medium">Faturas fiscais com NUIT e IVA para alojamentos e frotas</div>
            </div>
          </div>
          <span className="text-xs text-amber-900 font-bold bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-300 shrink-0">
            Consultar
          </span>
        </button>

        {/* Clear stored data */}
        <div className="p-4 flex items-center justify-between text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5 text-neutral-500" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-neutral-900">Limpar Dados Locais</div>
              <div className="text-xs text-neutral-500 mt-0.5 font-medium">Apagar favoritos guardados neste aparelho</div>
            </div>
          </div>

          {confirmClear ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClearStorage();
                  setConfirmClear(false);
                }}
                className="h-9 px-3.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 active:scale-95 cursor-pointer shadow-xs"
              >
                Confirmar
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="h-9 px-3 rounded-xl bg-neutral-200 text-neutral-800 text-xs font-semibold hover:bg-neutral-300 active:scale-95 cursor-pointer"
              >
                Não
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmClear(true)}
              className="text-xs text-neutral-500 hover:text-rose-600 font-bold px-3 py-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Support WhatsApp Contact */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 shadow-2xs">
        <div>
          <h3 className="text-xs sm:text-sm font-extrabold text-neutral-900">
            Suporte Onde Dormir Moçambique
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Contacto directo de atendimento e apoio a parceiros
          </p>
        </div>
        <a
          href="https://wa.me/258847282824?text=Ol%C3%A1!%20Contacto%20a%20partir%20do%20Onde%20Dormir%20Mo%C3%A7ambique."
          target="_blank"
          rel="noopener noreferrer"
          className="h-11 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0 cursor-pointer touch-manipulation"
        >
          <MessageCircle className="w-4 h-4 fill-white shrink-0" />
          <span>Falar no WhatsApp</span>
        </a>
      </div>

      {/* App Version Footer */}
      <div className="text-center text-xs text-neutral-400 space-y-0.5 pt-2">
        <div className="font-semibold">ONDE DORMIR MOÇAMBIQUE • Directório Nacional</div>
        <button
          onClick={onOpenPlatformOwnerDashboard}
          className="text-[10.5px] text-neutral-400 hover:text-neutral-700 transition-colors font-medium cursor-pointer block mx-auto active:scale-95"
          title="Gestão da Plataforma"
        >
          ÁGUIA Soluções & Serviços (Conexões Rápidas)
        </button>
      </div>

      {/* Terms Modal */}
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      {/* Official Billing & Invoicing Modal (Bill) */}
      <BillingInvoiceModal
        isOpen={isBillingModalOpen}
        onClose={() => setIsBillingModalOpen(false)}
      />
    </div>
  );
};
