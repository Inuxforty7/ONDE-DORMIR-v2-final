import React from 'react';
import { MapPin, Navigation, Shield, ChevronDown, ArrowLeft, Home, Bell } from 'lucide-react';
import { UserLocationState } from '../types';
import { Logo } from './Logo';

interface HeaderProps {
  userLocation: UserLocationState;
  onOpenLocationModal: () => void;
  onRequestGps: () => void;
  onOpenPrivacyModal: () => void;
  activeTab: string;
  onNavigateHome?: () => void;
  onOpenNotifications?: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  userLocation,
  onOpenLocationModal,
  onRequestGps,
  onOpenPrivacyModal,
  activeTab,
  onNavigateHome,
  onOpenNotifications,
  unreadCount = 0,
}) => {
  // Format clean compact location display for mobile
  const displayLocationName = React.useMemo(() => {
    if (userLocation.isAllMozambique) return 'Moçambique';
    if (userLocation.city) return userLocation.city;
    if (userLocation.province) return userLocation.province;
    return userLocation.name || 'Moçambique';
  }, [userLocation]);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-xs shadow-neutral-950/5 px-2 sm:px-4 py-1.5 sm:py-2 transition-all overflow-hidden">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2 w-full min-w-0">
        
        {/* Left Side: Logo & Home Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Logo & Brand with full text and high contrast */}
          <button 
            onClick={onNavigateHome}
            className="flex items-center text-left cursor-pointer active:scale-95 transition-transform shrink-0"
            title="Voltar ao Início"
          >
            <Logo size="sm" theme="light" showText={true} />
          </button>

          {/* Intuitive "Voltar ao Início" Button when on any sub-tab */}
          {activeTab !== 'home' && onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-xs transition-all cursor-pointer shadow-xs shadow-blue-600/30 shrink-0"
              title="Voltar ao Ecrã Principal"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <Home className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Início</span>
            </button>
          )}
        </div>

        {/* Right Side: Location selector trigger & quick actions */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 justify-end">
          {/* Privacy status icon */}
          <button
            onClick={onOpenPrivacyModal}
            title="Garantia de Privacidade: sem registo público"
            className="w-8 h-8 sm:w-auto sm:px-2 sm:h-8.5 flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-xl transition-colors cursor-pointer active:scale-95 shrink-0"
            aria-label="Garantia de Privacidade"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="hidden lg:inline">100% Privado</span>
          </button>

          {/* Current location button - responsive, clean and never overflows */}
          <button
            onClick={onOpenLocationModal}
            className="h-8 sm:h-8.5 flex items-center gap-1 sm:gap-1.5 bg-neutral-100 hover:bg-neutral-200/80 active:scale-95 text-neutral-800 text-xs font-semibold px-2 sm:px-2.5 rounded-xl border border-neutral-200/90 transition-all max-w-[105px] sm:max-w-[150px] cursor-pointer shrink-0"
            title="Alterar localização ou província"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate text-left text-[11px] sm:text-xs font-bold leading-tight">{displayLocationName}</span>
            <ChevronDown className="w-3 h-3 text-neutral-400 shrink-0" />
          </button>

          {/* Quick GPS auto-locate button */}
          <button
            onClick={onRequestGps}
            disabled={userLocation.isLoading}
            className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-neutral-100 hover:bg-emerald-50 hover:text-emerald-700 text-neutral-700 border border-neutral-200/90 hover:border-emerald-300 transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50 active:scale-95 shrink-0"
            title="Usar minha localização GPS"
            aria-label="Usar minha localização GPS"
          >
            <Navigation
              className={`w-3.5 h-3.5 ${
                userLocation.isLoading ? 'animate-spin text-emerald-600' : 'text-neutral-700'
              }`}
            />
          </button>

          {/* Notification Bell Button */}
          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              className="relative w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-neutral-100 hover:bg-amber-50 text-neutral-700 hover:text-amber-800 border border-neutral-200/90 hover:border-amber-300 transition-all flex items-center justify-center cursor-pointer active:scale-95 shrink-0"
              title="Notificações do Sistema & Oportunidades"
              aria-label="Notificações"
            >
              <Bell className="w-3.5 h-3.5 text-neutral-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center shadow-xs animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

