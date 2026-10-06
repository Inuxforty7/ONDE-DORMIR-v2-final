import React from 'react';
import { 
  Compass, 
  Car, 
  Heart, 
  ShoppingBag, 
  Map as MapIcon, 
  Building2, 
  MapPin, 
  Bell, 
  ShieldCheck, 
  FileText, 
  ChevronRight, 
  Sparkles,
  PhoneCall,
  Info,
  Layers
} from 'lucide-react';
import { ActiveTab, UserLocationState } from '../types';
import { Logo } from './Logo';

interface MoreTabProps {
  onNavigateToTab: (tab: ActiveTab) => void;
  userLocation: UserLocationState;
  onOpenLocationModal: () => void;
  onOpenRegisterModal: () => void;
  onOpenPrivacyModal: () => void;
  onOpenTermsModal?: () => void;
  onOpenNotifications?: () => void;
  unreadCount?: number;
  onOpenPlatformOwnerDashboard?: () => void;
}

export const MoreTab: React.FC<MoreTabProps> = ({
  onNavigateToTab,
  userLocation,
  onOpenLocationModal,
  onOpenRegisterModal,
  onOpenPrivacyModal,
  onOpenTermsModal,
  onOpenNotifications,
  unreadCount = 0,
  onOpenPlatformOwnerDashboard,
}) => {
  return (
    <div className="min-h-screen bg-neutral-50 pb-24 sm:pb-28 pt-2 sm:pt-4 max-w-2xl mx-auto px-3.5 sm:px-5 space-y-4 sm:space-y-5">
      
      {/* Top Banner / Summary */}
      <div className="bg-white rounded-3xl p-5 border border-neutral-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <Logo size="md" theme="light" showText={true} />
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-wider border border-blue-200/60">
            Hub de Serviços
          </span>
        </div>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium">
          Aceda a todos os módulos, ferramentas de mobilidade, turismo, conexões e gestão da plataforma.
        </p>
      </div>

      {/* Primary Modules Hub */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 px-1">
          <Layers className="w-4 h-4 text-neutral-500" />
          <h2 className="text-xs font-black uppercase tracking-wider text-neutral-500">
            Módulos da Plataforma
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          
          {/* 1. Turismo */}
          <button
            onClick={() => onNavigateToTab('guides')}
            className="w-full text-left p-4 rounded-2xl bg-white hover:bg-emerald-50/50 border border-neutral-200/90 hover:border-emerald-300 transition-all flex items-center justify-between group shadow-2xs active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="font-black text-sm text-neutral-900 group-hover:text-emerald-700 transition-colors">
                  Turismo
                </div>
                <div className="text-xs text-neutral-500 font-medium truncate">
                  Guias & Praias, Lugares e Experiências
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          {/* 2. Rent-a-Car */}
          <button
            onClick={() => onNavigateToTab('rentacar')}
            className="w-full text-left p-4 rounded-2xl bg-white hover:bg-orange-50/50 border border-neutral-200/90 hover:border-orange-300 transition-all flex items-center justify-between group shadow-2xs active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <Car className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="font-black text-sm text-neutral-900 group-hover:text-orange-700 transition-colors">
                  Rent-a-Car
                </div>
                <div className="text-xs text-neutral-500 font-medium truncate">
                  Aluguer de viaturas & 4x4
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          {/* 3. HeartLink */}
          <button
            onClick={() => onNavigateToTab('heartlink')}
            className="w-full text-left p-4 rounded-2xl bg-white hover:bg-rose-50/50 border border-neutral-200/90 hover:border-rose-300 transition-all flex items-center justify-between group shadow-2xs active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <Heart className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="font-black text-sm text-neutral-900 group-hover:text-rose-700 transition-colors">
                  HeartLink
                </div>
                <div className="text-xs text-neutral-500 font-medium truncate">
                  Amizade, namoro e relacionamentos
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          {/* 4. Love Shop */}
          <button
            onClick={() => onNavigateToTab('loveshop')}
            className="w-full text-left p-4 rounded-2xl bg-white hover:bg-pink-50/50 border border-neutral-200/90 hover:border-pink-300 transition-all flex items-center justify-between group shadow-2xs active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="font-black text-sm text-neutral-900 group-hover:text-rose-700 transition-colors">
                  Love Shop
                </div>
                <div className="text-xs text-neutral-500 font-medium truncate">
                  Presentes, alianças & flores
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          {/* 5. Mapa Interativo */}
          <button
            onClick={() => onNavigateToTab('map')}
            className="w-full text-left p-4 rounded-2xl bg-white hover:bg-blue-50/50 border border-neutral-200/90 hover:border-blue-300 transition-all flex items-center justify-between group shadow-2xs active:scale-[0.99] cursor-pointer sm:col-span-2"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <MapIcon className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="font-black text-sm text-neutral-900 group-hover:text-blue-700 transition-colors">
                  Mapa Geral de Alojamentos
                </div>
                <div className="text-xs text-neutral-500 font-medium truncate">
                  Visualização GPS de Pensões e Guest Houses em Moçambique
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        </div>
      </div>

      {/* Owner Acquisition CTA Card */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-850 to-neutral-900 text-white rounded-3xl p-5 border border-neutral-800 shadow-md space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Building2 className="w-4 h-4" />
          <span>Área do Proprietário</span>
        </div>
        <div>
          <h3 className="text-base font-extrabold text-white">
            É proprietário de uma Pensão ou Guest House?
          </h3>
          <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
            Registe o seu estabelecimento no Onde Dormir Moçambique, defina as coordenadas GPS e receba contactos diretos de clientes.
          </p>
        </div>
        <button
          onClick={onOpenRegisterModal}
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-950/20"
        >
          <Sparkles className="w-4 h-4" />
          <span>Registar Estabelecimento</span>
        </button>
      </div>

      {/* Tools & Settings Section */}
      <div className="space-y-2">
        <h2 className="text-xs font-black uppercase tracking-wider text-neutral-500 px-1">
          Preferências & Ferramentas
        </h2>

        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-2xs divide-y divide-neutral-100 overflow-hidden">
          
          {/* Location Selector */}
          <button
            onClick={onOpenLocationModal}
            className="w-full p-4 text-left flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <MapPin className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-neutral-900 group-hover:text-emerald-700">
                  Província Atual
                </div>
                <div className="text-[11px] text-neutral-500 truncate font-medium">
                  {userLocation.isAllMozambique ? 'Moçambique (Todas as Províncias)' : (userLocation.province || userLocation.name)}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 transition-colors shrink-0 ml-2" />
          </button>

          {/* Notifications */}
          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              className="w-full p-4 text-left flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Bell className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-neutral-900 group-hover:text-amber-700">
                    Notificações do Sistema
                  </div>
                  <div className="text-[11px] text-neutral-500 font-medium">
                    {unreadCount > 0 ? `${unreadCount} atualizações pendentes` : 'Tudo em dia'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black">
                    {unreadCount}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 transition-colors shrink-0" />
              </div>
            </button>
          )}

          {/* Privacy */}
          <button
            onClick={onOpenPrivacyModal}
            className="w-full p-4 text-left flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-neutral-900 group-hover:text-emerald-700">
                  Garantia de Privacidade & Anonimato
                </div>
                <div className="text-[11px] text-neutral-500 font-medium">
                  Nenhum dado é partilhado publicamente
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 transition-colors shrink-0 ml-2" />
          </button>

          {/* Terms */}
          {onOpenTermsModal && (
            <button
              onClick={onOpenTermsModal}
              className="w-full p-4 text-left flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-neutral-900 group-hover:text-blue-700">
                    Termos & Condições Oficiais
                  </div>
                  <div className="text-[11px] text-neutral-500 font-medium">
                    Regulamento e políticas de transparência
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 transition-colors shrink-0 ml-2" />
            </button>
          )}
        </div>
      </div>

      {/* Official Footer */}
      <div className="p-4 rounded-2xl bg-neutral-100/80 border border-neutral-200/80 text-center space-y-1.5">
        <div className="text-[11px] font-bold text-neutral-700">
          Onde Dormir Moçambique
        </div>
        <button
          onClick={onOpenPlatformOwnerDashboard}
          className="text-[10px] text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer leading-tight block mx-auto active:scale-95"
          title="Gestão da Plataforma"
        >
          Desenvolvido por Águia Soluções & Serviços - Conexões Rápidas, SU, LDA
        </button>
        <div className="text-[10px] text-neutral-400">
          Versão 1.2.0 • Moçambique
        </div>
      </div>

    </div>
  );
};
