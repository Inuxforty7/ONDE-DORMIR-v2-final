import React from 'react';
import { ShoppingBag, Store, Plus, PackageCheck } from 'lucide-react';

interface LoveShopHeaderBannerProps {
  userRoleMode: 'visitante' | 'comerciante';
  onSelectRole: (role: 'visitante' | 'comerciante') => void;
  onOpenOrders: () => void;
  onOpenRegisterStore: () => void;
  pendingReviewsCount?: number;
}

export const LoveShopHeaderBanner: React.FC<LoveShopHeaderBannerProps> = ({
  userRoleMode,
  onSelectRole,
  onOpenOrders,
  onOpenRegisterStore,
  pendingReviewsCount = 0,
}) => {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-xl bg-[#67001a] text-white border border-rose-800/40 p-3 sm:p-4 min-h-[170px] sm:min-h-[190px] flex flex-col justify-between group">
      {/* 
        Scenic Romantic Background:
        Subtle bokeh, roses & candles vignette overlaid with rich burgundy gradient
      */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80"
          alt="Love Shop"
          className="w-full h-full object-cover object-center scale-105 opacity-25 group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        {/* Gradients blending smoothly across the entire plate */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#67001a]/95 via-[#540015]/85 to-[#67001a]/95" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/35" />

        {/* Ambient floating romantic bokeh heart particles */}
        <div className="absolute top-4 left-1/4 w-4 h-4 text-rose-300/30 animate-pulse text-xs select-none">
          ❤️
        </div>
        <div className="absolute bottom-4 right-1/4 w-3 h-3 text-pink-300/30 animate-ping text-[10px] select-none">
          ✨
        </div>
      </div>

      {/* TOP ROW: 2 CORNER BUTTONS (Visitante top-left, Comerciante top-right) */}
      <div className="relative z-10 flex items-center justify-between gap-2 w-full">
        {/* Top-Left: Visitante */}
        <button
          type="button"
          onClick={() => onSelectRole('visitante')}
          className={`h-8 sm:h-8.5 px-3 sm:px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md shadow-xs active:scale-95 ${
            userRoleMode === 'visitante'
              ? 'bg-white text-[#67001a] font-black shadow-md ring-2 ring-white/80'
              : 'bg-black/35 hover:bg-black/50 text-white/95 border border-white/20'
          }`}
          title="Modo Visitante"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span>Visitante</span>
        </button>

        {/* Top-Right: Comerciante */}
        <button
          type="button"
          onClick={() => onSelectRole('comerciante')}
          className={`h-8 sm:h-8.5 px-3 sm:px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md shadow-xs active:scale-95 ${
            userRoleMode === 'comerciante'
              ? 'bg-white text-neutral-900 font-black shadow-md ring-2 ring-white/80'
              : 'bg-black/35 hover:bg-black/50 text-white/95 border border-white/20'
          }`}
          title="Modo Comerciante"
        >
          <Store className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span>Comerciante</span>
        </button>
      </div>

      {/* CENTER: Module Name ("Love Shop") & Subtitle ("Presentes que aproximam corações") */}
      <div className="relative z-10 my-2.5 sm:my-3 text-center px-4 space-y-1">
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl sm:text-3xl select-none shrink-0 filter drop-shadow-md animate-pulse">
            ❤️
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight drop-shadow-lg leading-none">
            <span className="text-white">Love </span>
            <span className="bg-gradient-to-r from-pink-200 via-rose-200 to-pink-300 bg-clip-text text-transparent">
              Shop
            </span>
          </h1>
        </div>

        <p className="text-xs sm:text-sm font-bold text-pink-100/95 tracking-wide drop-shadow-md">
          Presentes que aproximam corações
        </p>
      </div>

      {/* BOTTOM ROW: 2 CORNER BUTTONS (Meus Pedidos bottom-left, Registar Loja bottom-right) */}
      <div className="relative z-10 flex items-center justify-between gap-2 w-full pt-1">
        {/* Bottom-Left: Meus Pedidos */}
        <button
          type="button"
          onClick={onOpenOrders}
          className="relative h-8 sm:h-8.5 px-3 sm:px-3.5 rounded-xl bg-black/35 hover:bg-black/50 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-white/20 backdrop-blur-md cursor-pointer shadow-xs active:scale-95"
          title="Ver Meus Pedidos"
        >
          <PackageCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
          <span>Meus Pedidos</span>
          {pendingReviewsCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center shrink-0 animate-pulse">
              {pendingReviewsCount}
            </span>
          )}
        </button>

        {/* Bottom-Right: Registar Loja */}
        <button
          type="button"
          onClick={onOpenRegisterStore}
          className="h-8 sm:h-8.5 px-3 sm:px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-rose-950/40 cursor-pointer border border-rose-400/40 whitespace-nowrap"
          title="Registar Loja na Love Shop"
        >
          <Plus className="w-3.5 h-3.5 shrink-0" />
          <span>Registar Loja</span>
        </button>
      </div>
    </div>
  );
};
