import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  Bed, 
  Compass, 
  Car, 
  Heart, 
  Map, 
  User, 
  Grid,
  X,
  Sparkles
} from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  savedCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  savedCount,
}) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close "Mais" menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };
    if (isMoreMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMoreMenuOpen]);

  const isMoreTabActive = activeTab === 'map' || activeTab === 'saved' || activeTab === 'account';

  const handleSelectTab = (tab: ActiveTab) => {
    onChangeTab(tab);
    setIsMoreMenuOpen(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none pb-[calc(env(safe-area-inset-bottom,0px)+8px)] px-2 sm:px-4 w-full">
      {/* "Mais Opções" Popup Sheet (Mapa, Favoritos, Perfil) */}
      {isMoreMenuOpen && (
        <div 
          ref={menuRef}
          className="pointer-events-auto max-w-sm mx-auto mb-2 bg-white/95 backdrop-blur-xl border border-neutral-200/90 rounded-3xl p-3 shadow-2xl shadow-neutral-950/20 animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100 px-2">
            <span className="text-xs font-black uppercase tracking-wider text-neutral-500">
              Mais Opções & Ferramentas
            </span>
            <button
              onClick={() => setIsMoreMenuOpen(false)}
              className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center cursor-pointer active:scale-90"
              aria-label="Fechar menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Mapa */}
            <button
              onClick={() => handleSelectTab('map')}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all cursor-pointer active:scale-95 touch-manipulation ${
                activeTab === 'map'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border border-neutral-200/80'
              }`}
            >
              <Map className="w-5 h-5 mb-1" />
              <span className="text-xs font-bold">Mapa</span>
            </button>

            {/* Favoritos */}
            <button
              onClick={() => handleSelectTab('saved')}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all cursor-pointer relative active:scale-95 touch-manipulation ${
                activeTab === 'saved'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border border-neutral-200/80'
              }`}
            >
              <div className="relative">
                <Heart className={`w-5 h-5 mb-1 ${activeTab === 'saved' ? 'fill-white' : 'text-rose-500'}`} />
                {savedCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center border border-white">
                    {savedCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold">Guardados</span>
            </button>

            {/* Perfil / Conta */}
            <button
              onClick={() => handleSelectTab('account')}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all cursor-pointer active:scale-95 touch-manipulation ${
                activeTab === 'account'
                  ? 'bg-neutral-900 text-white shadow-md'
                  : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border border-neutral-200/80'
              }`}
            >
              <User className="w-5 h-5 mb-1" />
              <span className="text-xs font-bold">Conta</span>
            </button>
          </div>
        </div>
      )}

      {/* Main 6-Item Bottom Bar - 100% Width Fit (No Horizontal Scroll) */}
      <nav className="pointer-events-auto w-full max-w-lg mx-auto bg-white/95 backdrop-blur-xl border border-neutral-200/90 rounded-2xl sm:rounded-full p-1 sm:p-1.5 shadow-xl shadow-neutral-900/10 transition-all overflow-hidden">
        <div className="grid grid-cols-6 items-center gap-0.5 w-full">
          {/* 1. Início */}
          <button
            onClick={() => handleSelectTab('home')}
            className={`flex flex-col items-center justify-center h-12 rounded-xl sm:rounded-full transition-all cursor-pointer active:scale-95 touch-manipulation ${
              activeTab === 'home'
                ? 'text-blue-700 bg-blue-500/15 font-bold shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-900 font-medium'
            }`}
          >
            <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5px] scale-105' : 'stroke-[1.8px]'}`} />
            <span className="text-[10px] sm:text-xs mt-0.5 tracking-tight whitespace-nowrap font-bold truncate max-w-full px-0.5">
              Início
            </span>
          </button>

          {/* 2. Hospedagens */}
          <button
            onClick={() => handleSelectTab('explore')}
            className={`flex flex-col items-center justify-center h-12 rounded-xl sm:rounded-full transition-all cursor-pointer active:scale-95 touch-manipulation ${
              activeTab === 'explore'
                ? 'text-emerald-700 bg-emerald-500/15 font-bold shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-900 font-medium'
            }`}
          >
            <Bed className={`w-5 h-5 ${activeTab === 'explore' ? 'stroke-[2.5px] scale-105' : 'stroke-[1.8px]'}`} />
            <span className="text-[10px] sm:text-xs mt-0.5 tracking-tight whitespace-nowrap font-bold truncate max-w-full px-0.5">
              Dormir
            </span>
          </button>

          {/* 3. Guias */}
          <button
            onClick={() => handleSelectTab('guides')}
            className={`flex flex-col items-center justify-center h-12 rounded-xl sm:rounded-full transition-all cursor-pointer active:scale-95 touch-manipulation ${
              activeTab === 'guides'
                ? 'text-emerald-700 bg-emerald-500/15 font-bold shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-900 font-medium'
            }`}
          >
            <Compass className={`w-5 h-5 ${activeTab === 'guides' ? 'stroke-[2.5px] scale-105' : 'stroke-[1.8px]'}`} />
            <span className="text-[10px] sm:text-xs mt-0.5 tracking-tight whitespace-nowrap font-bold truncate max-w-full px-0.5">
              Guias
            </span>
          </button>

          {/* 4. Rent-a-Car */}
          <button
            onClick={() => handleSelectTab('rentacar')}
            className={`flex flex-col items-center justify-center h-12 rounded-xl sm:rounded-full transition-all cursor-pointer active:scale-95 touch-manipulation ${
              activeTab === 'rentacar'
                ? 'text-orange-600 bg-orange-500/15 font-bold shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-900 font-medium'
            }`}
          >
            <Car className={`w-5 h-5 ${activeTab === 'rentacar' ? 'stroke-[2.5px] scale-105' : 'stroke-[1.8px]'}`} />
            <span className="text-[10px] sm:text-xs mt-0.5 tracking-tight whitespace-nowrap font-bold truncate max-w-full px-0.5">
              Carros
            </span>
          </button>

          {/* 5. HeartLink */}
          <button
            onClick={() => handleSelectTab('heartlink')}
            className={`flex flex-col items-center justify-center h-12 rounded-xl sm:rounded-full transition-all cursor-pointer relative active:scale-95 touch-manipulation ${
              activeTab === 'heartlink'
                ? 'text-rose-600 bg-rose-500/15 font-extrabold shadow-2xs'
                : 'text-rose-500 hover:text-rose-700 font-medium'
            }`}
          >
            <div className="relative">
              <Heart className={`w-5 h-5 ${activeTab === 'heartlink' ? 'fill-rose-600 stroke-[2.5px] scale-105' : 'stroke-[2px]'}`} />
              {activeTab !== 'heartlink' && (
                <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </div>
            <span className="text-[10px] sm:text-xs mt-0.5 tracking-tight whitespace-nowrap font-bold truncate max-w-full px-0.5 text-rose-600">
              HeartLink
            </span>
          </button>

          {/* 6. Mais (Mapa / Guardados / Conta) */}
          <button
            onClick={() => setIsMoreMenuOpen((prev) => !prev)}
            className={`flex flex-col items-center justify-center h-12 rounded-xl sm:rounded-full transition-all cursor-pointer relative active:scale-95 touch-manipulation ${
              isMoreTabActive || isMoreMenuOpen
                ? 'text-neutral-900 bg-neutral-200/80 font-extrabold shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-900 font-medium'
            }`}
          >
            <div className="relative">
              <Grid className={`w-5 h-5 ${isMoreTabActive ? 'stroke-[2.5px] scale-105' : 'stroke-[1.8px]'}`} />
              {savedCount > 0 && !isMoreTabActive && (
                <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500" />
              )}
            </div>
            <span className="text-[10px] sm:text-xs mt-0.5 tracking-tight whitespace-nowrap font-bold truncate max-w-full px-0.5">
              {activeTab === 'map' ? 'Mapa' : activeTab === 'saved' ? 'Salvos' : activeTab === 'account' ? 'Conta' : 'Mais'}
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
};
