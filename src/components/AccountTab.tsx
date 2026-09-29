import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  MapPin, 
  MessageCircle, 
  Trash2,
  FileText,
  Lock,
  UserCheck,
  Server
} from 'lucide-react';
import { UserLocationState } from '../types';
import { Logo } from './Logo';
import { TermsModal } from './TermsModal';
import { authService, AuthUser } from '../services/authService';
import { UserRole } from '../types/rbac';
import { PackagesTimeIndicator } from './PackagesTimeIndicator';
import { BillingInvoiceModal } from './BillingInvoiceModal';

interface AccountTabProps {
  userLocation: UserLocationState;
  onOpenPrivacyModal: () => void;
  onOpenRegisterModal: () => void;
  onOpenLocationModal: () => void;
  savedCount: number;
  totalAccommodationsCount: number;
  onClearStorage: () => void;
}

export const AccountTab: React.FC<AccountTabProps> = ({
  userLocation,
  onOpenPrivacyModal,
  onOpenRegisterModal,
  onOpenLocationModal,
  savedCount,
  totalAccommodationsCount,
  onClearStorage,
}) => {
  const [confirmClear, setConfirmClear] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(authService.getCurrentUser());

  useEffect(() => {
    return authService.subscribe((u) => setCurrentUser(u));
  }, []);

  const handleRoleChange = (role: UserRole) => {
    authService.setSession('token_demo_' + role.toLowerCase(), {
      id: 'usr_' + role.toLowerCase(),
      phoneNumber: '+258 84 000 0000',
      fullName: role === 'SUPER_ADMIN' ? 'Super Administrador' : role === 'ADMIN' ? 'Auditor / Moderador' : role === 'OWNER' ? 'Proprietário Verificado' : 'Utilizador Padrão',
      role,
      phoneVerified: true,
      verificationLevel: role === 'USER' ? 'NOT_VERIFIED' : 'VERIFIED_ON_SITE',
      isPremium: role !== 'USER'
    });
  };

  return (
    <div className="pb-32 pt-2 sm:pt-4 max-w-2xl mx-auto px-3.5 sm:px-4 space-y-4">
      {/* Header Profile Summary */}
      <div className="bg-white rounded-3xl p-5 border border-neutral-200/90 shadow-2xs space-y-4">
        <div>
          <Logo size="lg" />
          <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
            Directório de hospedagens, guias locais, aluguer de viaturas e conexões.
          </p>
        </div>

        {/* Stats Pill Row */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-100">
          <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-150">
            <span className="text-xs text-neutral-500 block font-semibold">Favoritos Guardados</span>
            <span className="text-lg font-extrabold text-neutral-900 mt-0.5 block">{savedCount}</span>
          </div>
          <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-150">
            <span className="text-xs text-neutral-500 block font-semibold">Hospedagens no Directório</span>
            <span className="text-lg font-extrabold text-neutral-900 mt-0.5 block">{totalAccommodationsCount}</span>
          </div>
        </div>
      </div>

      {/* Indicador de Tempo do Utilizador nos 4 Pacotes */}
      <PackagesTimeIndicator
        moduleName="Todos os Pacotes"
        packageTitle="Os 4 Pacotes da Plataforma"
        variant="card"
      />

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

      {/* RBAC Security & Session Architecture Card */}
      <div className="bg-white rounded-3xl p-5 border border-neutral-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider">
            <Lock className="w-4 h-4 text-blue-600" />
            <span>Segurança & Controlo de Acesso (RBAC)</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            Backend Ativo
          </span>
        </div>

        <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-150 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500 font-semibold">Papel Ativo no Sistema:</span>
            <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
              {currentUser?.role || 'USER'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500 font-semibold">Nível de Verificação:</span>
            <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
              {currentUser?.verificationLevel === 'VERIFIED_ON_SITE' ? 'Verificado no Local' : currentUser?.verificationLevel === 'VERIFIED' ? 'Verificado Digital' : 'Não Verificado'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500 font-semibold">Autoridade de Regras:</span>
            <span className="font-bold text-neutral-800">Servidor (Backend Express + API)</span>
          </div>
        </div>

        {/* Role Switcher for Architecture Evaluation */}
        <div className="pt-1">
          <div className="text-[11px] font-bold text-neutral-500 mb-1.5">Simular Papel para Teste de Permissões:</div>
          <div className="grid grid-cols-4 gap-1.5">
            {(['USER', 'OWNER', 'ADMIN', 'SUPER_ADMIN'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => handleRoleChange(r)}
                className={`py-1.5 px-1 rounded-xl text-[10px] font-black tracking-tight transition-all cursor-pointer ${
                  (currentUser?.role || 'USER') === r
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                {r === 'SUPER_ADMIN' ? 'SUPER' : r}
              </button>
            ))}
          </div>
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
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-neutral-900">Termos e Condições de Uso</div>
              <div className="text-xs text-neutral-500 mt-0.5 font-medium">Directrizes e responsabilidade</div>
            </div>
          </div>
          <span className="text-xs text-neutral-600 font-semibold px-2">Ler</span>
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
          href="https://wa.me/258843210980?text=Ol%C3%A1!%20Contacto%20a%20partir%20do%20Onde%20Dormir%20Mo%C3%A7ambique."
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
