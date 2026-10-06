import React from 'react';
import { 
  ChevronRight,
  MapPin,
  Bell
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

      {/* Main Content Container matching the mobile screen mockup with adaptive viewport */}
      <div className="relative z-10 w-full max-w-md sm:max-w-lg mx-auto px-3.5 sm:px-5 pt-2 sm:pt-4 pb-20 sm:pb-24 flex flex-col items-center justify-between min-h-[calc(100dvh-65px)]">
        
        {/* TOP BRAND HEADER - IDENTICAL TO REFERENCE IMAGE */}
        <div className="w-full flex flex-col items-center text-center pt-1 sm:pt-3 space-y-2 sm:space-y-2.5">
          
          {/* Official Logo with Vector Emblem & Typography */}
          <Logo size="xl" showText={true} theme="dark" className="w-full justify-between sm:justify-center px-0.5 sm:px-2" />

          {/* Slogan exactly as written on the print */}
          <p className="text-xs sm:text-sm font-semibold text-white/95 max-w-xs drop-shadow-lg leading-snug px-2 text-center">
            Encontre onde dormir, quem o pode guiar e como se deslocar.
          </p>

          {/* Quick Province Pill & Notification Bell Row */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenLocationModal}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/35 text-white text-[11px] font-bold transition-all active:scale-95 shadow-md cursor-pointer"
              title="Alterar Província"
            >
              <MapPin className="w-3 h-3 text-emerald-300 shrink-0" />
              <span className="truncate max-w-[180px]">
                {userLocation.isAllMozambique
                  ? 'Moçambique (Todas as Províncias)'
                  : `${userLocation.province || userLocation.name}`}
              </span>
            </button>

            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                className="relative px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/35 text-white text-[11px] font-bold transition-all active:scale-95 shadow-md cursor-pointer flex items-center gap-1"
                title="Notificações & Interessados"
                aria-label="Notificações"
              >
                <Bell className="w-3.5 h-3.5 text-amber-300" />
                <span className="px-1.5 py-0.2 bg-rose-600 text-white rounded-full text-[9px] font-black">
                  {unreadCount > 0 ? unreadCount : 2}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* 5 MAIN COLOR-CODED BUTTONS - EXACTLY LIKE THE REFERENCE IMAGE */}
        <div className="w-full space-y-2.5 sm:space-y-3 pt-3 sm:pt-4">
          
          {/* 1. ONDE DORMIR (Blue) */}
          <button
            onClick={() => onNavigateToTab('explore')}
            className="w-full group bg-gradient-to-r from-[#0055EE] to-[#003CB3] hover:from-[#0066FF] hover:to-[#0044CC] active:scale-[0.98] text-white rounded-[22px] p-3 sm:p-3.5 border-2 border-white/90 shadow-xl transition-all flex items-center justify-between cursor-pointer touch-manipulation"
          >
            <div className="flex items-center gap-3 sm:gap-3.5 text-left min-w-0">
              {/* White bed silhouette icon matching reference */}
              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-[#0039A6]/40 border border-white/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Tall Headboard */}
                  <rect x="4" y="7" width="3.5" height="18" rx="1.75" fill="white" />
                  {/* Pillow / Head */}
                  <circle cx="11.5" cy="13" r="2.5" fill="white" />
                  {/* Sleeping Body / Mattress */}
                  <path d="M14 12h10.5c1.9 0 3.5 1.6 3.5 3.5v2.5H14v-6z" fill="white" />
                  {/* Bed Frame & Legs */}
                  <path d="M7 18h21v3.5h-2.5v2.5h-2.5v-2.5H11v2.5H8.5v-2.5H7V18z" fill="white" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="font-black text-base sm:text-lg tracking-wide uppercase leading-tight drop-shadow-xs truncate">
                  ONDE DORMIR
                </div>
                <div className="text-xs sm:text-sm text-white/90 font-medium mt-0.5 truncate">
                  Hotéis, pensões, residenciais
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform ml-2">
              <ChevronRight className="w-6 h-6 text-white stroke-[3]" />
            </div>
          </button>

          {/* 2. GUIA TURÍSTICO (Green) */}
          <button
            onClick={() => onNavigateToTab('guides')}
            className="w-full group bg-gradient-to-r from-[#009E4F] to-[#007A3D] hover:from-[#00B359] hover:to-[#008F47] active:scale-[0.98] text-white rounded-[22px] p-3 sm:p-3.5 border-2 border-white/90 shadow-xl transition-all flex items-center justify-between cursor-pointer touch-manipulation"
          >
            <div className="flex items-center gap-3 sm:gap-3.5 text-left min-w-0">
              {/* Traveler guide in safari hat icon matching reference */}
              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-[#005C2B]/40 border border-white/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Safari Hat Crown */}
                  <path d="M11 8.5c0-2 2-3 5-3s5 1 5 3v1.5h-10V8.5z" fill="white" />
                  {/* Safari Hat Brim */}
                  <path d="M5.5 10c0-.8 4.7-1.5 10.5-1.5s10.5.7 10.5 1.5-4.7 1.5-10.5 1.5S5.5 10.8 5.5 10z" fill="white" />
                  {/* Guide Face */}
                  <path d="M11.5 12c0 2.5 2 4.5 4.5 4.5s4.5-2 4.5-4.5h-9z" fill="white" />
                  {/* Guide Torso & Explorer Vest */}
                  <path d="M9.5 18c-2.5 1.2-3.5 3-3.5 5.5v3.5h20v-3.5c0-2.5-1-4.3-3.5-5.5l-4.5 3.5c-1.2.9-2.8.9-4 0l-4.5-3.5z" fill="white" />
                  {/* Vest Collar / Lapels */}
                  <path d="M14.5 19.5h3v7h-3z" fill="white" opacity="0.35" />
                  <circle cx="16" cy="22" r="0.85" fill="white" />
                  <circle cx="16" cy="24.5" r="0.85" fill="white" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="font-black text-base sm:text-lg tracking-wide uppercase leading-tight drop-shadow-xs truncate">
                  GUIA TURÍSTICO
                </div>
                <div className="text-xs sm:text-sm text-white/90 font-medium mt-0.5 truncate">
                  Guias locais e passeios
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform ml-2">
              <ChevronRight className="w-6 h-6 text-white stroke-[3]" />
            </div>
          </button>

          {/* 3. RENT-A-CAR (Orange) */}
          <button
            onClick={() => onNavigateToTab('rentacar')}
            className="w-full group bg-gradient-to-r from-[#FF5500] to-[#E64000] hover:from-[#FF6611] hover:to-[#F04800] active:scale-[0.98] text-white rounded-[22px] p-3 sm:p-3.5 border-2 border-white/90 shadow-xl transition-all flex items-center justify-between cursor-pointer touch-manipulation"
          >
            <div className="flex items-center gap-3 sm:gap-3.5 text-left min-w-0">
              {/* Front Car Silhouette matching reference */}
              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-[#A82B00]/40 border border-white/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Slanted Windshield & Roof */}
                  <path d="M10 7.5h12c1.4 0 2.6.9 3 2.3l1.8 5.2H5.2L7 9.8c.4-1.4 1.6-2.3 3-2.3z" fill="white" opacity="0.95"/>
                  {/* Car Main Body */}
                  <path d="M4.5 15c0-.8.7-1.5 1.5-1.5h20c.8 0 1.5.7 1.5 1.5v8c0 .8-.7 1.5-1.5 1.5H6c-.8 0-1.5-.7-1.5-1.5v-8z" fill="white"/>
                  {/* Side Mirrors */}
                  <path d="M4 14.5c-.8 0-1.5.4-1.5 1.1v1.8c0 .7.7 1.1 1.5 1.1h.5v-4H4zM28 14.5c.8 0 1.5.4 1.5 1.1v1.8c0 .7-.7 1.1-1.5 1.1h-.5v-4h.5z" fill="white"/>
                  {/* Left & Right Headlights */}
                  <circle cx="8.5" cy="18.5" r="2.2" fill="#E64000"/>
                  <circle cx="23.5" cy="18.5" r="2.2" fill="#E64000"/>
                  {/* Center Grille */}
                  <rect x="12.5" y="18" width="7" height="2" rx="1" fill="#E64000" opacity="0.75"/>
                  {/* Front Wheels */}
                  <rect x="6.5" y="23" width="3.5" height="3" rx="1" fill="white"/>
                  <rect x="22" y="23" width="3.5" height="3" rx="1" fill="white"/>
                </svg>
              </div>
              <div className="min-w-0">
                <div className="font-black text-base sm:text-lg tracking-wide uppercase leading-tight drop-shadow-xs truncate">
                  RENT-A-CAR
                </div>
                <div className="text-xs sm:text-sm text-white/90 font-medium mt-0.5 truncate">
                  Aluguer de viaturas
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform ml-2">
              <ChevronRight className="w-6 h-6 text-white stroke-[3]" />
            </div>
          </button>

          {/* 4. HeartLink (Pink/Magenta/Red) */}
          <button
            onClick={() => onNavigateToTab('heartlink')}
            className="w-full group bg-gradient-to-r from-[#E91E63] to-[#C2185B] hover:from-[#F0286F] hover:to-[#D81B60] active:scale-[0.98] text-white rounded-[22px] p-3 sm:p-3.5 border-2 border-white/90 shadow-xl transition-all flex items-center justify-between cursor-pointer touch-manipulation"
          >
            <div className="flex items-center gap-3 sm:gap-3.5 text-left min-w-0">
              {/* Twin Joined Outline Hearts matching reference */}
              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-[#8A0033]/40 border border-white/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Big Left Heart Outline */}
                  <path 
                    d="M13 7C10.5 4.5 6.5 4.8 4.2 7.3c-2.4 2.6-2.2 6.8.6 9.7L13 25l5.5-5.3c-.9-1.3-1.5-2.9-1.5-4.7 0-3.6 2.9-6.5 6.5-6.5.6 0 1.2.1 1.7.3C24.4 6.8 22 5.2 19.5 5.2 17 5.2 14.5 6.3 13 7z" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="2.6" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  {/* Small Right Heart Outline */}
                  <path 
                    d="M23.5 11.5c-1.6-1.6-4.2-1.3-5.6.3-1.5 1.6-1.3 4.2.3 5.8l5.3 5 5.3-5c1.6-1.6 1.8-4.2.3-5.8-1.4-1.6-4-1.9-5.6-.3z" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="2.4" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="font-black text-base sm:text-lg tracking-wide leading-tight drop-shadow-xs truncate">
                  HeartLink
                </div>
                <div className="text-xs sm:text-sm text-white/90 font-medium mt-0.5 truncate">
                  Amizade, namoro e relacionamentos
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform ml-2">
              <ChevronRight className="w-6 h-6 text-white stroke-[3]" />
            </div>
          </button>

          {/* 5. Love Shop (Purple/Violet) - 5.º Módulo Oficial */}
          <button
            onClick={() => onNavigateToTab('loveshop')}
            className="w-full group bg-gradient-to-r from-[#7B1FA2] to-[#512DA8] hover:from-[#8E24AA] hover:to-[#5E35B1] active:scale-[0.98] text-white rounded-[22px] p-3 sm:p-3.5 border-2 border-white/90 shadow-xl transition-all flex items-center justify-between cursor-pointer touch-manipulation"
          >
            <div className="flex items-center gap-3 sm:gap-3.5 text-left min-w-0">
              {/* 3D Gift Box with Red Ribbon matching reference image */}
              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-[#3E0B59]/40 border border-white/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                <svg className="w-8 h-8 sm:w-9 sm:h-9" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Red Bow Fluffy Loops */}
                  <path d="M24 16C20 10 13 9 13 13.5C13 18 20 17 24 17Z" fill="#FF1744" stroke="#D50000" strokeWidth="0.8"/>
                  <path d="M24 16C28 10 35 9 35 13.5C35 18 28 17 24 17Z" fill="#FF1744" stroke="#D50000" strokeWidth="0.8"/>
                  {/* Red Bow Knot Center */}
                  <circle cx="24" cy="16.5" r="3" fill="#D50000"/>
                  <circle cx="24" cy="16.5" r="1.8" fill="#FF5252"/>
                  
                  {/* Gift Box Lid (White with Red Center Ribbon) */}
                  <rect x="8" y="17" width="32" height="7" rx="2" fill="#FFFFFF"/>
                  <rect x="21.5" y="17" width="5" height="7" fill="#FF1744"/>

                  {/* Gift Box Body (White with Red Vertical Ribbon) */}
                  <path d="M10 24H38V37.5C38 39 36.8 40.5 35 40.5H13C11.2 40.5 10 39 10 37.5V24Z" fill="#F8FAFC"/>
                  <path d="M10 24H13V38.5C11.5 38.5 10 37.5 10 36.5V24Z" fill="#E2E8F0"/>
                  <path d="M38 24H35V38.5C36.5 38.5 38 37.5 38 36.5V24Z" fill="#CBD5E1"/>
                  {/* Center Vertical Ribbon */}
                  <rect x="21.5" y="24" width="5" height="16.5" fill="#FF1744"/>
                  <rect x="22.5" y="24" width="1.5" height="16.5" fill="#FF5252" opacity="0.6"/>
                </svg>
              </div>
              <div className="min-w-0">
                <div className="font-black text-base sm:text-lg tracking-wide leading-tight drop-shadow-xs flex items-center gap-1.5 truncate">
                  <span className="text-rose-400">❤️</span>
                  <span className="truncate">Love Shop</span>
                </div>
                <div className="text-xs sm:text-sm text-white/90 font-medium mt-0.5 truncate">
                  Presentes que aproximam corações.
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform ml-2">
              <ChevronRight className="w-6 h-6 text-white stroke-[3]" />
            </div>
          </button>
        </div>

        {/* Official Rodapé / Footer (Tela Principal) */}
        <div className="w-full pt-4 sm:pt-6 pb-2 px-2 flex flex-col items-center justify-center text-center gap-2">
          {/* Quick Legal Links in Footer */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap text-xs font-bold text-white drop-shadow-sm">
            <button
              type="button"
              onClick={onOpenTermsModal}
              className="hover:underline underline-offset-4 text-white/95 hover:text-white cursor-pointer transition-colors"
            >
              Termos e Condições
            </button>
            <span className="text-white/40">•</span>
            <button
              type="button"
              onClick={onOpenPrivacyModal}
              className="hover:underline underline-offset-4 text-white/95 hover:text-white cursor-pointer transition-colors"
            >
              Privacidade & Segurança
            </button>
          </div>

          {/* Corporate Attribution */}
          <div className="space-y-0.5">
            <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white/90 drop-shadow-md">
              ÁGUIA Soluções & Serviços (Conexões Rápidas)
            </p>
            <p className="text-[9px] sm:text-[9.5px] italic text-white/80 font-normal drop-shadow-sm max-w-md mx-auto">
              "Conectando negócios e necessidades à solução, com agilidade – confiança – acessibilidade"
            </p>
            <p className="text-[9.5px] sm:text-[10px] text-white/70 font-medium drop-shadow-sm pt-0.5">
              Onde Dormir • Guia Turístico • Rent-a-Car • HeartLink • Love Shop
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
