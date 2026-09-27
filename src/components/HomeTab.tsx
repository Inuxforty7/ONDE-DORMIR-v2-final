import React from 'react';
import { 
  Bed,
  ChevronRight,
  Compass,
  Car,
  Heart,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { Accommodation, AccommodationType, ActiveTab, UserLocationState } from '../types';
import { Logo } from './Logo';

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
  onOpenPrivacyModal,
  onNavigateToTab,
  onOpenRegisterModal,
}) => {
  return (
    <div className="pb-32 pt-2 sm:pt-4 max-w-xl mx-auto px-3.5 sm:px-4 space-y-4">
      {/* 
        =======================================================
        PORTAL HUB HERO & SERVICE SELECTION CARDS
        Clean, Focused & Intuitive
        =======================================================
      */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-sky-200/40 bg-neutral-900 text-white flex flex-col justify-between">
        {/* Tropical Coastal Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-950/85 via-sky-900/70 to-sky-950/85" />

        {/* Top Brand Header */}
        <div className="relative z-10 p-5 sm:p-6 text-center space-y-2">
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg mx-auto">
            <Logo size="xl" showText={false} />
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
            ONDE <span className="text-blue-400">DORMIR</span>
          </h1>

          {/* Active Province Selector Button */}
          <div className="pt-1">
            <button
              onClick={onOpenLocationModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-xs font-bold transition-all active:scale-95 shadow-xs cursor-pointer"
              title="Clique para alterar a província"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span>
                {userLocation.isAllMozambique
                  ? '🌍 Todas as Províncias'
                  : `📍 Província de ${userLocation.province || userLocation.name}`}
              </span>
              <span className="text-[10px] bg-white/30 px-1.5 py-0.2 rounded-full ml-1">Mudar</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-white/90 max-w-sm mx-auto drop-shadow-sm pt-0.5">
            Selecione o que procura nesta região:
          </p>
        </div>

        {/* 4 Main Service Cards with comfortable touch targets */}
        <div className="relative z-10 p-4 sm:p-6 space-y-3 w-full">
          {/* 1. ONDE DORMIR */}
          <button
            onClick={() => onNavigateToTab('explore')}
            className="w-full group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] text-white rounded-2xl p-4 border-2 border-white/40 shadow-lg transition-all flex items-center justify-between cursor-pointer touch-manipulation"
          >
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Bed className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-black text-base sm:text-lg tracking-wide uppercase leading-tight">
                  ONDE DORMIR
                </div>
                <div className="text-xs sm:text-sm text-blue-100 font-medium mt-0.5">
                  Hotéis, pensões, residenciais
                </div>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </button>

          {/* 2. GUIA TURÍSTICO */}
          <button
            onClick={() => onNavigateToTab('guides')}
            className="w-full group bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 active:scale-[0.98] text-white rounded-2xl p-4 border-2 border-white/40 shadow-lg transition-all flex items-center justify-between cursor-pointer touch-manipulation"
          >
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-black text-base sm:text-lg tracking-wide uppercase leading-tight">
                  GUIA TURÍSTICO
                </div>
                <div className="text-xs sm:text-sm text-emerald-100 font-medium mt-0.5">
                  Guias locais e passeios
                </div>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </button>

          {/* 3. RENT-A-CAR */}
          <button
            onClick={() => onNavigateToTab('rentacar')}
            className="w-full group bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 active:scale-[0.98] text-white rounded-2xl p-4 border-2 border-white/40 shadow-lg transition-all flex items-center justify-between cursor-pointer touch-manipulation"
          >
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-black text-base sm:text-lg tracking-wide uppercase leading-tight">
                  RENT-A-CAR
                </div>
                <div className="text-xs sm:text-sm text-orange-100 font-medium mt-0.5">
                  Aluguer de viaturas
                </div>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </button>

          {/* 4. HeartLink */}
          <button
            onClick={() => onNavigateToTab('heartlink')}
            className="w-full group bg-gradient-to-r from-rose-600 to-pink-700 hover:from-rose-500 hover:to-pink-600 active:scale-[0.98] text-white rounded-2xl p-4 border-2 border-white/40 shadow-lg transition-all flex items-center justify-between cursor-pointer touch-manipulation"
          >
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Heart className="w-6 h-6 fill-white text-white" />
              </div>
              <div>
                <div className="font-black text-base sm:text-lg tracking-wide leading-tight">
                  HeartLink
                </div>
                <div className="text-xs sm:text-sm text-pink-100 font-medium mt-0.5">
                  Amizade, encontros e convívio
                </div>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </button>
        </div>
      </div>

      {/* Privacy Guarantee strip */}
      <div className="p-4 rounded-3xl bg-emerald-50/90 border border-emerald-200/90 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs sm:text-sm text-emerald-950 font-bold">
            100% Privado • Contactos diretos sem intermediação
          </div>
        </div>
        <button
          onClick={onOpenPrivacyModal}
          className="text-xs font-black text-emerald-800 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer shrink-0 shadow-2xs"
        >
          Saber Mais
        </button>
      </div>

      {/* Add Establishment CTA */}
      <div className="text-center py-2 space-y-1">
        <button
          onClick={onOpenRegisterModal}
          className="text-xs sm:text-sm font-bold text-neutral-600 hover:text-emerald-700 hover:underline cursor-pointer"
        >
          + Registar alojamento no directório
        </button>
      </div>
    </div>
  );
};
