import React from 'react';
import { MapPin, ShoppingBag, ChevronRight, Gift } from 'lucide-react';
import { LoveShopStore } from '../types';

interface LoveShopStoreCardProps {
  store: LoveShopStore;
  onClick: () => void;
}

export const LoveShopStoreCard: React.FC<LoveShopStoreCardProps> = ({
  store,
  onClick,
}) => {
  // Brand Badge Style based on store ID
  const renderBrandBadge = () => {
    switch (store.id) {
      case 'store-1': // Amor & Mais
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-neutral-950 text-white p-1.5 flex flex-col items-center justify-center text-center shrink-0 border border-neutral-800 shadow-md">
            <Gift className="w-4 h-4 text-amber-300 mb-0.5" />
            <span className="text-[9px] font-black uppercase tracking-wider text-amber-200 leading-tight">
              AMOR & MAIS
            </span>
            <span className="text-[7px] text-neutral-400 uppercase tracking-widest mt-0.5 flex items-center gap-0.5">
              LOVE SHOP <span className="text-rose-500">❤</span>
            </span>
          </div>
        );

      case 'store-2': // Doce Detalhe
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-b from-rose-50 to-pink-100 text-rose-700 p-1.5 flex flex-col items-center justify-center text-center shrink-0 border border-rose-200 shadow-md">
            <div className="text-base leading-none mb-0.5">🎀</div>
            <span className="text-[9px] font-black tracking-tight text-rose-600 leading-tight">
              DoceDetalhe
            </span>
            <span className="text-[6.5px] font-bold text-rose-400 uppercase tracking-wider mt-0.5">
              PRESENTES ESPECIAIS
            </span>
          </div>
        );

      case 'store-3': // Elegance
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#2e081d] text-amber-200 p-1.5 flex flex-col items-center justify-center text-center shrink-0 border border-amber-900/40 shadow-md">
            <div className="text-sm leading-none mb-0.5">🦋</div>
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-300 leading-tight">
              ELEGANCE
            </span>
            <span className="text-[6px] text-amber-200/70 uppercase tracking-wider mt-0.5">
              PRESENTES & PERFUMES
            </span>
          </div>
        );

      case 'store-4': // Cantinho Romântico
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#fff5f5] text-rose-800 p-1.5 flex flex-col items-center justify-center text-center shrink-0 border border-rose-200 shadow-md">
            <div className="text-sm leading-none mb-0.5 text-rose-500">♡</div>
            <span className="text-[8.5px] font-black uppercase tracking-tight text-neutral-900 leading-tight">
              CANTINHO
            </span>
            <span className="text-[8.5px] font-black uppercase tracking-tight text-rose-700 leading-none">
              ROMÂNTICO
            </span>
            <span className="text-[6.5px] text-neutral-400 uppercase tracking-widest mt-0.5">
              LOVE SHOP
            </span>
          </div>
        );

      default:
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-neutral-900 text-white p-1.5 flex flex-col items-center justify-center text-center shrink-0 border border-neutral-700 shadow-md">
            <span className="text-lg">{store.logo || '🎁'}</span>
            <span className="text-[8px] font-black uppercase tracking-tight text-neutral-200 truncate max-w-full">
              {store.name}
            </span>
          </div>
        );
    }
  };

  // Right Scenic Banner (matches Image 3)
  const renderRightBanner = () => {
    // Default: Photographic scenic banner (Roses, Perfume, Ring Box matching Image 3)
    const coverUrl = store.coverImage || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80';

    return (
      <div className="relative w-28 sm:w-40 h-full min-h-[72px] sm:min-h-[82px] overflow-hidden rounded-r-2xl sm:rounded-r-3xl shrink-0">
        <img
          src={coverUrl}
          alt={store.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Soft gradient fade so the left blends into the card */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-transparent to-black/20 pointer-events-none" />
      </div>
    );
  };

  return (
    <div
      onClick={onClick}
      className="relative bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between overflow-hidden group touch-manipulation active:scale-[0.99]"
    >
      {/* Left: Brand Badge & Info */}
      <div className="p-2.5 sm:p-3.5 flex items-center gap-2.5 sm:gap-3.5 flex-1 min-w-0">
        {/* Logo Badge */}
        {renderBrandBadge()}

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          {/* Store Name + Verified Blue Badge + Anti-Fraud Badge */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-black text-sm sm:text-base text-neutral-950 truncate group-hover:text-rose-600 transition-colors">
              {store.name}
            </h3>
            {store.verified && (
              <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-black shrink-0" title="Loja Verificada">
                ✓
              </span>
            )}
            <span className="text-[9px] sm:text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shrink-0">
              🛡️ BI & Biometria
            </span>
          </div>

          {/* Slogan */}
          <p className="text-[11px] sm:text-xs text-neutral-500 truncate mt-0.5">
            {store.slogan}
          </p>

          {/* Details (WITHOUT STARS - strictly per user request: "vamos retirar isso estrela") */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 mt-1.5 text-[11px] sm:text-xs text-neutral-600 flex-wrap">
            <div className="flex items-center gap-1 text-neutral-500 font-medium">
              <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
              <span>{store.city}</span>
            </div>

            <span className="text-neutral-300">•</span>

            <div className="flex items-center gap-1 text-neutral-700 font-semibold">
              <ShoppingBag className="w-3 h-3 text-neutral-400 shrink-0" />
              <span>{store.salesCount.toLocaleString('pt-MZ')} vendas com sucesso</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Scenic Photo Banner & Floating Chevron Action Button */}
      <div className="relative self-stretch flex items-center">
        {renderRightBanner()}

        {/* Floating White Circular Chevron Button (Matching Image 3) */}
        <div className="absolute right-2 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 text-neutral-700 shadow-md flex items-center justify-center border border-neutral-100 group-hover:bg-white group-hover:scale-105 transition-transform shrink-0">
          <ChevronRight className="w-4 h-4 text-neutral-900" />
        </div>
      </div>
    </div>
  );
};
