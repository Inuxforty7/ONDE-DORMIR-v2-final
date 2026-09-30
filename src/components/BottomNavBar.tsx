import React from 'react';
import { Home, Heart, Calendar, Map, User } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavBarProps {
  activeTab: ActiveTab;
  onNavigateTab: (tab: ActiveTab) => void;
  savedCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onNavigateTab,
  savedCount = 0,
}) => {
  return (
    <nav 
      aria-label="Navegação Principal"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 px-2 py-1.5 sm:py-2 flex items-center justify-around shadow-2xl max-w-lg mx-auto sm:rounded-t-3xl transition-all"
    >
      {/* 1. Início */}
      <button
        onClick={() => onNavigateTab('home')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
          activeTab === 'home'
            ? 'text-blue-600 font-black'
            : 'text-neutral-500 hover:text-neutral-800 font-semibold'
        }`}
      >
        <Home className={`w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform ${activeTab === 'home' ? 'stroke-[2.5] scale-110' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] sm:text-[11px] mt-0.5 tracking-tight">Início</span>
      </button>

      {/* 2. Favoritos */}
      <button
        onClick={() => onNavigateTab('saved')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl relative transition-all cursor-pointer ${
          activeTab === 'saved'
            ? 'text-blue-600 font-black'
            : 'text-neutral-500 hover:text-neutral-800 font-semibold'
        }`}
      >
        <Heart className={`w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform ${activeTab === 'saved' ? 'stroke-[2.5] scale-110 fill-blue-600 text-blue-600' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] sm:text-[11px] mt-0.5 tracking-tight">Favoritos</span>
        {savedCount > 0 && (
          <span className="absolute top-0.5 right-2 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center">
            {savedCount > 9 ? '9+' : savedCount}
          </span>
        )}
      </button>

      {/* 3. Reservas (Directório / Explorar) */}
      <button
        onClick={() => onNavigateTab('explore')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
          activeTab === 'explore'
            ? 'text-blue-600 font-black'
            : 'text-neutral-500 hover:text-neutral-800 font-semibold'
        }`}
      >
        <Calendar className={`w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform ${activeTab === 'explore' ? 'stroke-[2.5] scale-110' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] sm:text-[11px] mt-0.5 tracking-tight">Reservas</span>
      </button>

      {/* 4. Mapa */}
      <button
        onClick={() => onNavigateTab('map')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
          activeTab === 'map'
            ? 'text-blue-600 font-black'
            : 'text-neutral-500 hover:text-neutral-800 font-semibold'
        }`}
      >
        <Map className={`w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform ${activeTab === 'map' ? 'stroke-[2.5] scale-110' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] sm:text-[11px] mt-0.5 tracking-tight">Mapa</span>
      </button>

      {/* 5. Perfil / Conta */}
      <button
        onClick={() => onNavigateTab('account')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
          activeTab === 'account'
            ? 'text-blue-600 font-black'
            : 'text-neutral-500 hover:text-neutral-800 font-semibold'
        }`}
      >
        <User className={`w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform ${activeTab === 'account' ? 'stroke-[2.5] scale-110' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] sm:text-[11px] mt-0.5 tracking-tight">Perfil</span>
      </button>
    </nav>
  );
};
