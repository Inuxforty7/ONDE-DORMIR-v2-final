import React from 'react';
import { ShoppingBag, Plus, ShieldCheck } from 'lucide-react';

interface LoveShopHeaderBannerProps {
  userRoleMode?: 'visitante' | 'comerciante';
  onSelectRole?: (role: 'visitante' | 'comerciante') => void;
  onOpenOrders: () => void;
  onOpenRegisterStore: () => void;
  pendingReviewsCount?: number;
}

export const LoveShopHeaderBanner: React.FC<LoveShopHeaderBannerProps> = ({
  onOpenOrders,
  onOpenRegisterStore,
  pendingReviewsCount = 0,
}) => {
  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl bg-[#67001a] text-white border border-rose-800/50 p-3 sm:p-4.5 min-h-[160px] sm:min-h-[185px] flex flex-col justify-between group">
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

        {/* Ambient floating romantic bokeh heart particles */}
        <div className="absolute top-4 left-1/4 w-4 h-4 text-rose-300/30 animate-pulse text-xs select-none">
          ❤️
        </div>
        <div className="absolute bottom-5 right-1/4 w-3 h-3 text-pink-300/30 animate-ping text-[10px] select-none">
          ✨
        </div>
      </div>

      {/* TOP ROW: 2 CORNER BUTTONS (Visitante top-left, Registar Loja top-right) - Exact match to Image 1 */}
      <div className="relative z-10 flex items-center justify-between gap-2 w-full">
        {/* Top-Left: Visitante button with badge - Clicking opens "Meus Pedidos & Contactos" (Image 2) */}
        <button
          type="button"
          onClick={onOpenOrders}
          className="h-9 px-3.5 sm:px-4 rounded-2xl bg-white text-neutral-900 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 border border-white/70 hover:bg-neutral-50"
          title="Ver Meus Pedidos & Contactos"
        >
          <ShoppingBag className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-extrabold text-neutral-900">Visitante</span>
          <span className="w-4.5 h-4.5 rounded-full bg-amber-500 text-white text-[10.5px] font-black flex items-center justify-center shrink-0 shadow-xs">
            {pendingReviewsCount > 0 ? pendingReviewsCount : 1}
          </span>
        </button>

        {/* Top-Right: Registar Loja button - Exact match to Image 1 */}
        <button
          type="button"
          onClick={onOpenRegisterStore}
          className="h-9 px-4 sm:px-5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-md shadow-rose-950/40 cursor-pointer border border-rose-400/40 whitespace-nowrap"
          title="Registar Loja na Love Shop"
        >
          <Plus className="w-3.5 h-3.5 shrink-0 stroke-[3]" />
          <span>Registar Loja</span>
        </button>
      </div>

      {/* CENTER: Logo & Typography - Exact match to Image 1 */}
      <div className="relative z-10 my-2 sm:my-3 text-center px-2 sm:px-4 flex flex-col items-center justify-center space-y-1">
        {/* Logo Icon + Love Shop Name */}
        <div className="flex items-center justify-center gap-2 sm:gap-2.5">
          <span className="text-2xl sm:text-3xl select-none filter drop-shadow-md animate-pulse">
            ❤️
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight drop-shadow-xl leading-none">
            <span className="text-white">Love </span>
            <span className="bg-gradient-to-r from-pink-200 via-rose-200 to-pink-300 bg-clip-text text-transparent">
              Shop
            </span>
          </h1>
        </div>

        {/* Slogan */}
        <p className="text-xs sm:text-sm font-bold text-pink-100/95 tracking-wide drop-shadow-sm">
          Presentes que aproximam corações
        </p>
      </div>

      {/* BOTTOM CENTER: Lojas Verificadas Badge - Exact match to Image 1 */}
      <div className="relative z-10 flex items-center justify-center w-full pt-1">
        <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 shadow-sm text-neutral-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-[11px] font-bold tracking-wide">
            Lojas Verificadas
          </span>
        </div>
      </div>
    </div>
  );
};
