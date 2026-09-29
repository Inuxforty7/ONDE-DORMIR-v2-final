import React from 'react';
import { 
  ChevronRight,
  MapPin
} from 'lucide-react';
import { Accommodation, AccommodationType, ActiveTab, UserLocationState } from '../types';
import { Logo } from './Logo';
import { HeartLinkTwoHeartsIcon } from './HeartLinkLogo';
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
  onNavigateToExplore: (typeFilter?: AccommodationType, query?: string) => void;
  onNavigateToTab: (tab: ActiveTab) => void;
  onNavigateToMap: () => void;
  onOpenRegisterModal: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  userLocation,
  onOpenLocationModal,
  onNavigateToTab,
}) => {
  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full flex flex-col justify-between overflow-hidden">
      {/* 
        Full Bleed Tropical Coastal Background identical to the mobile print:
        Turquoise Mozambican bay, white sand beach, anchored boats, green hills and foreground palm trees
      */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url(${heroBgImage})`,
          backgroundPosition: 'center 20%',
        }}
      >
        {/* Soft vignette/gradient to ensure buttons and logo pop vividly without washing out the landscape */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/75 via-transparent to-blue-950/60 pointer-events-none" />
      </div>

      {/* Main Content Container matching the mobile screen mockup */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4 sm:px-5 pt-3 sm:pt-6 pb-28 flex flex-col items-center justify-between min-h-[calc(100vh-75px)]">
        
        {/* TOP BRAND HEADER - IDENTICAL TO PRINT */}
        <div className="w-full flex flex-col items-center text-center pt-2 sm:pt-4 space-y-3">
          
          {/* Logo & Stacked Typography Group */}
          <div className="flex items-center justify-center gap-3">
            {/* Logo Emblem Icon */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl shadow-2xl overflow-hidden shrink-0 filter drop-shadow-lg">
              <Logo size="xl" showText={false} />
            </div>

            {/* ONDE DORMIR MOÇAMBIQUE Stacked */}
            <div className="flex flex-col text-left justify-center">
              <div className="text-2xl sm:text-3xl font-black tracking-tight leading-none drop-shadow-md">
                <span className="text-white drop-shadow-md">ONDE </span>
                <span className="text-amber-400 drop-shadow-md">DORMIR</span>
              </div>
              <div className="text-xs sm:text-sm font-black tracking-[0.28em] uppercase text-white/95 leading-tight mt-1 drop-shadow-md">
                MOÇAMBIQUE
              </div>
            </div>
          </div>

          {/* Slogan exactly as written on the print */}
          <p className="text-xs sm:text-sm font-semibold text-white max-w-xs drop-shadow-lg leading-snug px-2 text-center">
            Encontre onde dormir, quem o pode guiar e como se deslocar.
          </p>

          {/* Optional Quick Province Pill */}
          <button
            onClick={onOpenLocationModal}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/35 text-white text-[11px] font-bold transition-all active:scale-95 shadow-md cursor-pointer"
            title="Alterar Província"
          >
            <MapPin className="w-3 h-3 text-emerald-300 shrink-0" />
            <span className="truncate max-w-[200px]">
              {userLocation.isAllMozambique
                ? 'Moçambique (Todas as Províncias)'
                : `${userLocation.province || userLocation.name}`}
            </span>
          </button>
        </div>

        {/* 4 MAIN COLOR-CODED BUTTONS - EXACTLY LIKE THE PRINT */}
        <div className="w-full space-y-3 pt-4 sm:pt-6">
          
          {/* 1. ONDE DORMIR (Blue) */}
          <button
            onClick={() => onNavigateToTab('explore')}
            className="w-full group bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 active:scale-[0.98] text-white rounded-2xl p-3.5 sm:p-4 border border-white/35 shadow-xl transition-all flex items-center justify-between cursor-pointer touch-manipulation backdrop-blur-xs"
          >
            <div className="flex items-center gap-3.5 text-left">
              {/* White glyph on translucent square */}
              <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/25 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>
                </svg>
              </div>
              <div>
                <div className="font-black text-base sm:text-lg tracking-wide uppercase leading-tight drop-shadow-xs">
                  ONDE DORMIR
                </div>
                <div className="text-xs sm:text-sm text-blue-100 font-medium mt-0.5">
                  Hotéis, pensões, residenciais
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </button>

          {/* 2. GUIA TURÍSTICO (Green) */}
          <button
            onClick={() => onNavigateToTab('guides')}
            className="w-full group bg-gradient-to-r from-emerald-600 via-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 active:scale-[0.98] text-white rounded-2xl p-3.5 sm:p-4 border border-white/35 shadow-xl transition-all flex items-center justify-between cursor-pointer touch-manipulation backdrop-blur-xs"
          >
            <div className="flex items-center gap-3.5 text-left">
              {/* Traveler guide icon in safari hat */}
              <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/25 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                  {/* Safari Hat & Guide Silhouette matching print */}
                  <path d="M12 2c-2.8 0-4 1.5-4 1.5l-1.5.5C5.6 4.3 4 5.2 4 6c0 .8 3.6 1.5 8 1.5s8-.7 8-1.5c0-.8-1.6-1.7-2.5-2l-1.5-.5S14.8 2 12 2zm0 6.5c-1.9 0-3.5.7-3.5 2.5 0 1.2.9 2.2 2 2.4V14l-2.5 1.5C6.8 16.2 6 17.5 6 19v3h12v-3c0-1.5-.8-2.8-2-3.5L13.5 14v-.6c1.1-.2 2-1.2 2-2.4 0-1.8-1.6-2.5-3.5-2.5z"/>
                </svg>
              </div>
              <div>
                <div className="font-black text-base sm:text-lg tracking-wide uppercase leading-tight drop-shadow-xs">
                  GUIA TURÍSTICO
                </div>
                <div className="text-xs sm:text-sm text-emerald-100 font-medium mt-0.5">
                  Guias locais e passeios
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </button>

          {/* 3. RENT-A-CAR (Orange) */}
          <button
            onClick={() => onNavigateToTab('rentacar')}
            className="w-full group bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-400 hover:to-amber-500 active:scale-[0.98] text-white rounded-2xl p-3.5 sm:p-4 border border-white/35 shadow-xl transition-all flex items-center justify-between cursor-pointer touch-manipulation backdrop-blur-xs"
          >
            <div className="flex items-center gap-3.5 text-left">
              {/* Car Front Icon */}
              <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/25 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM7.5 15c-.83 0-1.5-.67-1.5-1.5S6.67 12 7.5 12s1.5.67 1.5 1.5S8.33 15 7.5 15zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
              </div>
              <div>
                <div className="font-black text-base sm:text-lg tracking-wide uppercase leading-tight drop-shadow-xs">
                  RENT-A-CAR
                </div>
                <div className="text-xs sm:text-sm text-orange-100 font-medium mt-0.5">
                  Aluguer de viaturas
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </button>

          {/* 4. HeartLink (Pink/Magenta/Red) */}
          <button
            onClick={() => onNavigateToTab('heartlink')}
            className="w-full group bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-500 active:scale-[0.98] text-white rounded-2xl p-3.5 sm:p-4 border border-white/35 shadow-xl transition-all flex items-center justify-between cursor-pointer touch-manipulation backdrop-blur-xs"
          >
            <div className="flex items-center gap-3.5 text-left">
              {/* Two intertwined hearts icon */}
              <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/25 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                <HeartLinkTwoHeartsIcon className="w-7 h-7" variant="white" showStitches={true} />
              </div>
              <div>
                <div className="font-black text-base sm:text-lg tracking-wide leading-tight drop-shadow-xs">
                  HeartLink
                </div>
                <div className="text-xs sm:text-sm text-pink-100 font-medium mt-0.5">
                  Amizade, namoro e relacionamentos
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </button>
        </div>

        {/* Space revealing the turquoise ocean bay, boats and palm trees behind */}
        <div className="w-full py-4 text-center">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/90 drop-shadow-md">
            POWERED BY ÁGUIA SOLUÇÕES & SERVIÇOS - CONEXÕES RÁPIDAS, SU, LDA
          </span>
        </div>
      </div>
    </div>
  );
};
