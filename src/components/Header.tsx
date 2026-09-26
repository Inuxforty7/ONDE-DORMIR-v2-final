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
}

export const Header: React.FC<HeaderProps> = ({
  userLocation,
  onOpenLocationModal,
  onRequestGps,
  onOpenPrivacyModal,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-2.5 sm:px-4 py-2 sm:py-2.5 transition-all overflow-hidden">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3 w-full">
        {/* Logo & Brand */}
        <Logo size="md" />

        {/* Location selector trigger & actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 min-w-0">
          {/* Privacy badge */}
          <button
            onClick={onOpenPrivacyModal}
            title="Garantia de Privacidade: sem histórico público"
            className="h-9 sm:h-10 px-2 sm:px-3 flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/90 rounded-xl transition-colors cursor-pointer active:scale-95 shrink-0 touch-manipulation"
            aria-label="Garantia de Privacidade"
          >
            <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="hidden sm:inline">100% Privado</span>
          </button>

          {/* Current location pill */}
          <button
            onClick={onOpenLocationModal}
            className="h-9 sm:h-10 flex items-center gap-1.5 sm:gap-2 bg-neutral-100 hover:bg-neutral-200/80 active:scale-95 text-neutral-800 text-xs sm:text-sm font-semibold px-2.5 sm:px-3 rounded-xl border border-neutral-200/90 transition-all max-w-[125px] xs:max-w-[160px] sm:max-w-[220px] cursor-pointer shrink-0 touch-manipulation"
            title="Alterar localização ou bairro"
          >
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
            <span className="truncate text-left text-xs sm:text-sm">{userLocation.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          </button>

          {/* Quick GPS auto-locate button */}
          <button
            onClick={onRequestGps}
            disabled={userLocation.isLoading}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-neutral-100 hover:bg-emerald-50 hover:text-emerald-700 text-neutral-700 border border-neutral-200/90 hover:border-emerald-300 transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50 active:scale-95 shrink-0 touch-manipulation"
            title="Usar minha localização GPS atual"
            aria-label="Usar minha localização GPS atual"
          >
            <Navigation
              className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${
                userLocation.isLoading ? 'animate-spin text-emerald-600' : 'text-neutral-700'
              }`}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
