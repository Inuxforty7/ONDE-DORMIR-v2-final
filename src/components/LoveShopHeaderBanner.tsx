import React from 'react';
import { Search, Gift } from 'lucide-react';

interface LoveShopHeaderBannerProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onTagSelect?: (tag: string) => void;
}

export const LoveShopHeaderBanner: React.FC<LoveShopHeaderBannerProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-lg bg-gradient-to-r from-[#800a26] via-[#941132] to-[#a31539] text-white border border-rose-700/50 p-4 sm:p-5.5 min-h-[160px] flex flex-col justify-between">
      
      {/* Background Decorative Soft Radial Glows */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
      
      {/* Top Row: Title, Slogan & Decorative Badge */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl select-none shrink-0 filter drop-shadow-sm">❤️</span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-sm leading-tight">
              Love Shop
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-medium text-rose-100/90 leading-tight">
            Presentes que aproximam corações.
          </p>
        </div>

        {/* Subtle Romantic Accent Pill */}
        <div className="hidden xs:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-rose-100 shadow-2xs shrink-0">
          <Gift className="w-3.5 h-3.5 text-amber-300" />
          <span>Presentes Especiais</span>
        </div>
      </div>

      {/* Middle Row: Search Bar Input */}
      <div className="relative z-10 my-2.5 sm:my-3">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-600 shrink-0" />
          <input
            type="text"
            placeholder="Buscar presentes, flores, perfumes, joias..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 sm:h-11 pl-10 pr-9 rounded-2xl bg-white text-neutral-900 placeholder:text-neutral-400 text-xs sm:text-sm font-semibold shadow-xs border border-white/90 focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400 hover:text-neutral-800 cursor-pointer"
              title="Limpar busca"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Quick Suggestion Tags */}
      <div className="relative z-10 flex items-center gap-1.5 flex-wrap pt-0.5">
        <span className="text-[10.5px] sm:text-xs font-bold text-rose-200/80 uppercase tracking-wider hidden xs:inline">
          Ideias:
        </span>
        {['Alianças', 'Relógios', 'Perfumes', 'Flores', 'Chocolates', 'Peluches'].map((tag) => (
          <button
            key={tag}
            onClick={() => onSearchChange(tag)}
            className="text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white transition-all shrink-0 cursor-pointer whitespace-nowrap shadow-2xs border border-white/10"
          >
            {tag}
          </button>
        ))}
      </div>

    </div>
  );
};
