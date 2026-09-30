import React from 'react';
import { Search } from 'lucide-react';

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
    <div className="relative w-full rounded-3xl overflow-hidden shadow-xl bg-[#67001a] text-white border border-rose-800/40 p-4 sm:p-5.5 min-h-[160px] sm:min-h-[175px] flex flex-col justify-between group">
      
      {/* 
        Scenic Romantic Background on Right Side:
        White gift box with satin red bow, velvety red roses, glowing candles, red heart and perfume bottle in bokeh
      */}
      <div className="absolute inset-y-0 right-0 w-3/5 sm:w-7/12 pointer-events-none overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80"
          alt="Presentes românticos Love Shop"
          className="w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        {/* Horizontal blend gradient from left to right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#67001a] via-[#67001a]/70 to-transparent" />
        {/* Soft top & bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#67001a]/80 via-transparent to-black/25" />

        {/* Ambient floating romantic bokeh heart particles */}
        <div className="absolute top-3 right-12 w-4 h-4 text-rose-300/40 animate-pulse text-xs select-none">
          ❤️
        </div>
        <div className="absolute bottom-6 right-20 w-3 h-3 text-pink-300/35 animate-ping text-[10px] select-none">
          ✨
        </div>
      </div>

      {/* Top Left: Logo & Slogan (Faithfully matching image.png) */}
      <div className="relative z-10 space-y-1.5 max-w-[65%] sm:max-w-xs">
        {/* Heart + Love Shop */}
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl select-none shrink-0 filter drop-shadow-md">
            ❤️
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight drop-shadow-md leading-none">
            <span className="text-white">Love </span>
            <span className="bg-gradient-to-r from-pink-200 via-rose-200 to-pink-300 bg-clip-text text-transparent">Shop</span>
          </h1>
        </div>

        {/* Slogan on 2 lines matching the print: "Presentes que aproximam / corações." */}
        <div className="text-xs sm:text-sm font-extrabold leading-snug drop-shadow-md">
          <div className="text-white">Presentes que aproximam</div>
          <div className="text-pink-200 font-black">corações.</div>
        </div>
      </div>

      {/* Middle/Bottom: White Pill Search Bar Input (Exact match to image.png) */}
      <div className="relative z-10 pt-3 sm:pt-4 max-w-[260px] sm:max-w-xs md:max-w-sm">
        <div className="relative w-full shadow-lg rounded-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-600 shrink-0" />
          <input
            type="text"
            placeholder="Buscar produtos ou lojas..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-9 sm:h-10 pl-9 pr-8 rounded-full bg-white text-neutral-900 placeholder:text-neutral-400 text-xs sm:text-sm font-semibold shadow-inner border border-white/90 focus:outline-none focus:ring-2 focus:ring-rose-400 transition-all touch-manipulation"
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

    </div>
  );
};
