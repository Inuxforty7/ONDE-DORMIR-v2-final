import React from 'react';
import { 
  ChevronRight, 
  MapPin, 
  Bell 
} from 'lucide-react';
import { Accommodation, AccommodationType, ActiveTab, UserLocationState } from '../types';
import { Logo } from './Logo';
import heroBgImage from '../assets/images/mozambique_coastal_hero_bg_1790583006189.jpg';

interface HomeTabProps {
  userLocation: UserLocationState;
  accommodations: Accommodation[];
  onSelectAccommodation: (item: Accommodation) => void;
  isSaved: (id: string) => boolean;
  onToggleSave: (id: string) => void;
  onOpenLocationModal: () => void;
  onRequestGps: () => void;
  onOpenPrivacyModal: () => void;
  onOpenTermsModal?: () => void;
  onNavigateToExplore: (typeFilter?: AccommodationType, query?: string) => void;
  onNavigateToTab: (tab: ActiveTab) => void;
  onNavigateToMap: () => void;
  onOpenRegisterModal: () => void;
  onOpenNotifications?: () => void;
  unreadCount?: number;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  userLocation,
  onOpenLocationModal,
  onOpenPrivacyModal,
  onOpenTermsModal,
  onNavigateToTab,
  onOpenNotifications,
  unreadCount = 0,
}) => {
  return (
    <div className="relative h-dvh max-h-dvh w-full flex flex-col justify-between overflow-hidden select-none">
      
      {/* Tropical Coastal Background with vignette */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url(${heroBgImage})`,
          backgroundPosition: 'center 20%',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/80 via-blue-950/40 to-blue-950/85 pointer-events-none" />
      </div>

      {/* Main Container tailored to fit exact mobile viewport without scrolling */}
      <div className="relative z-10 w-full max-w-md sm:max-w-lg mx-auto px-3.5 sm:px-5 py-2.5 sm:py-4 flex flex-col items-center justify-between h-full flex-1">
        
        {/* TOP BRAND HEADER */}
        <div className="w-full flex flex-col items-center text-center space-y-1.5 sm:space-y-2 pt-0.5">
          
          {/* Logo */}
          <Logo size="xl" showText={true} theme="dark" className="w-full justify-center px-1" />

          {/* Slogan */}
          <p className="text-[11px] sm:text-xs font-semibold text-white/95 max-w-xs drop-shadow-md leading-tight px-2 text-center">
            Encontre onde dormir, quem o pode guiar e como se deslocar.
          </p>

          {/* Location & Notification pill */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <button
              onClick={onOpenLocationModal}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/35 text-white text-[10.5px] font-bold transition-all active:scale-95 shadow-xs cursor-pointer"
              title="Alterar Província"
            >
              <MapPin className="w-3 h-3 text-emerald-300 shrink-0" />
              <span className="truncate max-w-[170px]">
                {userLocation.isAllMozambique
                  ? 'Moçambique (Todas as Províncias)'
                  : `${userLocation.province || userLocation.name}`}
              </span>
            </button>

            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                className="relative px-2 py-0.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/35 text-white text-[10.5px] font-bold transition-all active:scale-95 shadow-xs cursor-pointer flex items-center gap-1"
                title="Notificações"
                aria-label="Notificações"
              >
                <Bell className="w-3 h-3 text-amber-300" />
                <span className="px-1 py-0.2 bg-rose-600 text-white rounded-full text-[8.5px] font-black leading-none">
                  {unreadCount > 0 ? unreadCount : 2}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* 5 MAIN MODULE COLOR BUTTONS - Compact, ergonomic & viewport-fitted */}
        <div className="w-full space-y-2 sm:space-y-2.5 py-1.5 flex-1 flex flex-col justify-center max-h-[64vh]">
          
          {/* 1. ONDE DORMIR (Blue) */}
          <button
            onClick={() => onNavigateToTab('explore')}
            className="w-full group bg-gradient-to-r from-[#0055EE] to-[#003CB3] hover:from-[#0066FF] hover:to-[#0044CC] active:scale-[0.98] text-white rounded-2xl p-2.5 sm:p-3 border-2 border-white/90 shadow-lg transition-all flex items-center justify-between cursor-pointer touch-manipulation"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 text-left min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#0039A6]/50 border border-white/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                <svg className="w-6 h-6 text-white" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="7" width="3.5" height="18" rx="1.75" fill="white" />
                  <circle cx="11.5" cy="13" r="2.5" fill="white" />
                  <path d="M14 12h10.5c1.9 0 3.5 1.6 3.5 3.5v2.5H14v-6z" fill="white" />
                  <path d="M7 18h21v3.5h-2.5v2.5h-2.5v-2.5H11v2.5H8.5v-2.5H7V18z" fill="white" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="font-black text-sm sm:text-base tracking-wide uppercase leading-tight drop-shadow-xs truncate">
                  ONDE DORMIR
                </div>
                <div className="text-[11px] sm:text-xs text-white/90 font-medium truncate">
                  Pensões, guest houses & residenciais
                </div>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform ml-1.5">
              <ChevronRight className="w-5 h-5 text-white stroke-[3]" />
            </div>
          </button>

          {/* 2. TURISMO (Green) */}
          <button
            onClick={() => onNavigateToTab('guides')}
            className="w-full group bg-gradient-to-r from-[#009E4F] to-[#007A3D] hover:from-[#00B359] hover:to-[#008F47] active:scale-[0.98] text-white rounded-2xl p-2.5 sm:p-3 border-2 border-white/90 shadow-lg transition-all flex items-center justify-between cursor-pointer touch-manipulation"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 text-left min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#005C2B]/50 border border-white/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                <svg className="w-6 h-6 text-white" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 8.5c0-2 2-3 5-3s5 1 5 3v1.5h-10V8.5z" fill="white" />
                  <path d="M5.5 10c0-.8 4.7-1.5 10.5-1.5s10.5.7 10.5 1.5-4.7 1.5-10.5 1.5S5.5 10.8 5.5 10z" fill="white" />
                  <path d="M11.5 12c0 2.5 2 4.5 4.5 4.5s4.5-2 4.5-4.5h-9z" fill="white" />
                  <path d="M9.5 18c-2.5 1.2-3.5 3-3.5 5.5v3.5h20v-3.5c0-2.5-1-4.3-3.5-5.5l-4.5 3.5c-1.2.9-2.8.9-4 0l-4.5-3.5z" fill="white" />
                  <path d="M14.5 19.5h3v7h-3z" fill="white" opacity="0.35" />
                  <circle cx="16" cy="22" r="0.85" fill="white" />
                  <circle cx="16" cy="24.5" r="0.85" fill="white" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="font-black text-sm sm:text-base tracking-wide uppercase leading-tight drop-shadow-xs truncate">
                  TURISMO
                </div>
                <div className="text-[11px] sm:text-xs text-white/90 font-medium truncate">
                  Guias & Praias
                </div>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform ml-1.5">
              <ChevronRight className="w-5 h-5 text-white stroke-[3]" />
            </div>
          </button>

          {/* 3. RENT-A-CAR (Orange) */}
          <button
            onClick={() => onNavigateToTab('rentacar')}
            className="w-full group bg-gradient-to-r from-[#FF5500] to-[#E64000] hover:from-[#FF6611] hover:to-[#F04800] active:scale-[0.98] text-white rounded-2xl p-2.5 sm:p-3 border-2 border-white/90 shadow-lg transition-all flex items-center justify-between cursor-pointer touch-manipulation"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 text-left min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#A82B00]/50 border border-white/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                <svg className="w-6 h-6 text-white" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 7.5h12c1.4 0 2.6.9 3 2.3l1.8 5.2H5.2L7 9.8c.4-1.4 1.6-2.3 3-2.3z" fill="white" opacity="0.95"/>
                  <path d="M4.5 15c0-.8.7-1.5 1.5-1.5h20c.8 0 1.5.7 1.5 1.5v8c0 .8-.7 1.5-1.5 1.5H6c-.8 0-1.5-.7-1.5-1.5v-8z" fill="white"/>
                  <path d="M4 14.5c-.8 0-1.5.4-1.5 1.1v1.8c0 .7.7 1.1 1.5 1.1h.5v-4H4zM28 14.5c.8 0 1.5.4 1.5 1.1v1.8c0 .7-.7 1.1-1.5 1.1h-.5v-4h.5z" fill="white"/>
                  <circle cx="8.5" cy="18.5" r="2" fill="#E64000"/>
                  <circle cx="23.5" cy="18.5" r="2" fill="#E64000"/>
                  <rect x="12.5" y="18" width="7" height="1.8" rx="0.9" fill="#E64000" opacity="0.75"/>
                  <rect x="6.5" y="23" width="3.5" height="2.5" rx="1" fill="white"/>
                  <rect x="22" y="23" width="3.5" height="2.5" rx="1" fill="white"/>
                </svg>
              </div>
              <div className="min-w-0">
                <div className="font-black text-sm sm:text-base tracking-wide uppercase leading-tight drop-shadow-xs truncate">
                  RENT-A-CAR
                </div>
                <div className="text-[11px] sm:text-xs text-white/90 font-medium truncate">
                  Aluguer de viaturas & 4x4
                </div>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform ml-1.5">
              <ChevronRight className="w-5 h-5 text-white stroke-[3]" />
            </div>
          </button>

          {/* 4. HeartLink (Pink/Red) */}
          <button
            onClick={() => onNavigateToTab('heartlink')}
            className="w-full group bg-gradient-to-r from-[#E91E63] to-[#C2185B] hover:from-[#F0286F] hover:to-[#D81B60] active:scale-[0.98] text-white rounded-2xl p-2.5 sm:p-3 border-2 border-white/90 shadow-lg transition-all flex items-center justify-between cursor-pointer touch-manipulation"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 text-left min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#8A0033]/50 border border-white/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M13 7C10.5 4.5 6.5 4.8 4.2 7.3c-2.4 2.6-2.2 6.8.6 9.7L13 25l5.5-5.3c-.9-1.3-1.5-2.9-1.5-4.7 0-3.6 2.9-6.5 6.5-6.5.6 0 1.2.1 1.7.3C24.4 6.8 22 5.2 19.5 5.2 17 5.2 14.5 6.3 13 7z" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="2.4" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <path 
                    d="M23.5 11.5c-1.6-1.6-4.2-1.3-5.6.3-1.5 1.6-1.3 4.2.3 5.8l5.3 5 5.3-5c1.6-1.6 1.8-4.2.3-5.8-1.4-1.6-4-1.9-5.6-.3z" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="2.2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="font-black text-sm sm:text-base tracking-wide leading-tight drop-shadow-xs truncate">
                  HeartLink
                </div>
                <div className="text-[11px] sm:text-xs text-white/90 font-medium truncate">
                  Amizade, namoro e relacionamentos
                </div>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform ml-1.5">
              <ChevronRight className="w-5 h-5 text-white stroke-[3]" />
            </div>
          </button>

          {/* 5. Love Shop (Violet) */}
          <button
            onClick={() => onNavigateToTab('loveshop')}
            className="w-full group bg-gradient-to-r from-[#7B1FA2] to-[#512DA8] hover:from-[#8E24AA] hover:to-[#5E35B1] active:scale-[0.98] text-white rounded-2xl p-2.5 sm:p-3 border-2 border-white/90 shadow-lg transition-all flex items-center justify-between cursor-pointer touch-manipulation"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 text-left min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#3E0B59]/50 border border-white/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                <svg className="w-7 h-7" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 16C20 10 13 9 13 13.5C13 18 20 17 24 17Z" fill="#FF1744" stroke="#D50000" strokeWidth="0.8"/>
                  <path d="M24 16C28 10 35 9 35 13.5C35 18 28 17 24 17Z" fill="#FF1744" stroke="#D50000" strokeWidth="0.8"/>
                  <circle cx="24" cy="16.5" r="2.5" fill="#D50000"/>
                  <rect x="8" y="17" width="32" height="6.5" rx="1.5" fill="#FFFFFF"/>
                  <rect x="21.5" y="17" width="5" height="6.5" fill="#FF1744"/>
                  <path d="M10 23.5H38V37C38 38.5 36.8 40 35 40H13C11.2 40 10 38.5 10 37V23.5Z" fill="#F8FAFC"/>
                  <rect x="21.5" y="23.5" width="5" height="16.5" fill="#FF1744"/>
                </svg>
              </div>
              <div className="min-w-0">
                <div className="font-black text-sm sm:text-base tracking-wide leading-tight drop-shadow-xs flex items-center gap-1.5 truncate">
                  <span className="text-rose-400 text-xs">❤️</span>
                  <span className="truncate">Love Shop</span>
                </div>
                <div className="text-[11px] sm:text-xs text-white/90 font-medium truncate">
                  Presentes que aproximam corações
                </div>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform ml-1.5">
              <ChevronRight className="w-5 h-5 text-white stroke-[3]" />
            </div>
          </button>
        </div>

        {/* COMPACT CLEAN FOOTER (Fits smoothly in 100dvh without scroll) */}
        <div className="w-full pt-1 sm:pt-2 pb-1 flex flex-col items-center justify-center text-center space-y-1">
          {/* Legal Links */}
          <div className="flex items-center justify-center gap-2.5 text-[10.5px] font-bold text-white/95 drop-shadow-sm">
            <button
              type="button"
              onClick={onOpenTermsModal}
              className="hover:underline text-white/90 hover:text-white cursor-pointer transition-colors"
            >
              Termos & Condições
            </button>
            <span className="text-white/40">•</span>
            <button
              type="button"
              onClick={onOpenPrivacyModal}
              className="hover:underline text-white/90 hover:text-white cursor-pointer transition-colors"
            >
              Privacidade & Segurança
            </button>
          </div>

          {/* Corporate Attribution */}
          <div className="text-[9px] sm:text-[9.5px] font-semibold text-white/80 drop-shadow-md">
            ÁGUIA Soluções & Serviços (Conexões Rápidas) • Moçambique
          </div>
        </div>

      </div>
    </div>
  );
};
