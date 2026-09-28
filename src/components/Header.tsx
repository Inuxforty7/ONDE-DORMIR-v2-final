import React from 'react';
import { MapPin, Navigation, Shield, ChevronDown } from 'lucide-react';
import { UserLocationState } from '../types';
import { Logo } from './Logo';

interface HeaderProps {
  userLocation: UserLocationState;
  onOpenLocationModal: () => void;
  onRequestGps: () => void;
  onOpenPrivacyModal: () => void;
  activeTab: string;
  onNavigateHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userLocation,
  onOpenLocationModal,
  onRequestGps,
  onOpenPrivacyModal,
  onNavigateHome,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-3 sm:px-4 py-2 sm:py-2.5 transition-all">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 w-full">
        {/* Logo & Brand */}
        <button 
          onClick={onNavigateHome}
          className="text-left cursor-pointer active:scale-95 transition-transform"
          title="Voltar ao Início"
        >
          <Logo size="md" />
        </button>

        {/* Location selector trigger & quick actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Privacy status icon */}
          <button
            onClick={onOpenPrivacyModal}
            title="Garantia de Privacidade: sem registo público"
            className="h-9 px-2 sm:px-2.5 flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-xl transition-colors cursor-pointer active:scale-95 shrink-0"
            aria-label="Garantia de Privacidade"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="hidden xs:inline">100% Privado</span>
          </button>

          {/* Current location button */}
          <button
            onClick={onOpenLocationModal}
            className="h-9 flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200/80 active:scale-95 text-neutral-800 text-xs font-semibold px-2.5 sm:px-3 rounded-xl border border-neutral-200/90 transition-all max-w-[130px] sm:max-w-[200px] cursor-pointer shrink-0"
            title="Alterar localização ou cidade"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate text-left text-xs">{userLocation.name}</span>
            <ChevronDown className="w-3 h-3 text-neutral-400 shrink-0" />
          </button>

          {/* Quick GPS auto-locate button */}
          <button
            onClick={onRequestGps}
            disabled={userLocation.isLoading}
            className="w-9 h-9 rounded-xl bg-neutral-100 hover:bg-emerald-50 hover:text-emerald-700 text-neutral-700 border border-neutral-200/90 hover:border-emerald-300 transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50 active:scale-95 shrink-0"
            title="Usar minha localização GPS"
            aria-label="Usar minha localização GPS"
          >
            <Navigation
              className={`w-3.5 h-3.5 ${
                userLocation.isLoading ? 'animate-spin text-emerald-600' : 'text-neutral-700'
              }`}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
