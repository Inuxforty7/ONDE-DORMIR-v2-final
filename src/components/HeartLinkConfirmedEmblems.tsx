import React from 'react';
import { Users, Check, BarChart2 } from 'lucide-react';
import { HeartLinkTwoHeartsIcon, TwoWeddingRingsIcon } from './HeartLinkLogo';

interface ConfirmedConnectionsCardProps {
  friendshipsCount?: number;
  datingCount?: number;
  marriagesCount?: number;
  activeSubTab?: 'amizades' | 'namoros' | 'confirmados' | 'confirmadas' | 'pessoas' | null;
  onSelectSubTab?: (tab: 'amizades' | 'namoros' | 'confirmados') => void;
  className?: string;
}

/**
 * 📊 Conexões Confirmadas Card
 * Faithful, high-fidelity reproduction of the glossy pink card with 3 sub-cards:
 * 1. Amizades Confirmadas (Green, 3 People Group Icon)
 * 2. Namoros Confirmados (Pink, Two Hearts Icon)
 * 3. Casamentos Confirmados (Gold, Wedding Rings with Diamond Icon)
 */
export const ConfirmedConnectionsCard: React.FC<ConfirmedConnectionsCardProps> = ({
  friendshipsCount = 128,
  datingCount = 56,
  marriagesCount = 12,
  activeSubTab,
  onSelectSubTab,
  className = '',
}) => {
  return (
    <div className={`w-full max-w-2xl mx-auto select-none ${className}`}>
      {/* Outer Glossy Magenta Capsule Container */}
      <div className="relative rounded-[2rem] sm:rounded-[2.25rem] p-2.5 sm:p-3.5 bg-gradient-to-r from-[#d90066] via-[#ff007a] to-[#d90066] border-2 border-pink-300/90 shadow-[0_8px_25px_rgba(255,0,122,0.35),inset_0_2px_4px_rgba(255,255,255,0.7),inset_0_-3px_6px_rgba(0,0,0,0.3)] overflow-hidden">
        
        {/* Top Gloss Specular Sheen */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/45 via-white/15 to-transparent rounded-t-[2rem] sm:rounded-t-[2.25rem] pointer-events-none" />

        {/* Top Header Bar */}
        <div className="relative z-10 flex items-center justify-between px-2 sm:px-4 py-1 sm:py-2 mb-2">
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Small Bar Chart Icon Badge */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/25 backdrop-blur-xs flex items-center justify-center border border-white/40 shadow-inner shrink-0">
              <BarChart2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
            </div>

            {/* Title: Conexões Confirmadas */}
            <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] font-sans">
              Conexões Confirmadas
            </h2>
          </div>

          {/* Right Scalloped Pink Verified Checkmark Badge */}
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#e60067] border-2 border-white flex items-center justify-center shadow-md shrink-0">
            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[3.5]" />
          </div>
        </div>

        {/* Inner White Container */}
        <div className="relative z-10 bg-white rounded-2xl sm:rounded-[1.75rem] p-1 sm:p-2.5 shadow-inner border border-pink-100/80">
          <div className="grid grid-cols-3 gap-1 sm:gap-2.5">
            
            {/* 1. Amizades Confirmadas (Green) */}
            <div
              onClick={() => onSelectSubTab?.('amizades')}
              className={`p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#f0fdf4] to-[#e6f4ea] border transition-all cursor-pointer relative flex flex-col sm:flex-row items-center gap-1 sm:gap-2.5 ${
                activeSubTab === 'amizades' || activeSubTab === 'confirmadas'
                  ? 'border-emerald-500 ring-2 ring-emerald-400/40 shadow-md bg-white'
                  : 'border-emerald-200/90 hover:border-emerald-300'
              }`}
            >
              {/* Green Circular Badge Icon */}
              <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-800 text-white flex items-center justify-center shadow-md border border-emerald-300/80 shrink-0">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>

              {/* Text Info */}
              <div className="min-w-0 flex-1 text-center sm:text-left w-full">
                <div className="flex items-center justify-center sm:justify-between gap-1">
                  <span className="font-black text-sm sm:text-lg md:text-xl text-emerald-900 tracking-tight leading-none">
                    {friendshipsCount}
                  </span>
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 border border-white shadow-2xs">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                </div>
                <div className="mt-0.5">
                  <span className="font-black text-[10px] sm:text-xs text-slate-900 block leading-tight whitespace-nowrap">
                    Amizades
                  </span>
                  <span className="font-extrabold text-[8.5px] sm:text-[10px] text-slate-500 block leading-tight tracking-tight whitespace-nowrap">
                    Confirmadas
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Namoros Confirmados (Pink/Magenta) */}
            <div
              onClick={() => onSelectSubTab?.('namoros')}
              className={`p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#fff0f5] to-[#fce4ec] border transition-all cursor-pointer relative flex flex-col sm:flex-row items-center gap-1 sm:gap-2.5 ${
                activeSubTab === 'namoros'
                  ? 'border-rose-500 ring-2 ring-rose-400/40 shadow-md bg-white'
                  : 'border-pink-200/90 hover:border-pink-300'
              }`}
            >
              {/* Magenta Circular Badge Icon */}
              <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-rose-500 via-pink-600 to-rose-800 text-white flex items-center justify-center shadow-md border border-pink-300/80 shrink-0">
                <HeartLinkTwoHeartsIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
              </div>

              {/* Text Info */}
              <div className="min-w-0 flex-1 text-center sm:text-left w-full">
                <div className="flex items-center justify-center sm:justify-between gap-1">
                  <span className="font-black text-sm sm:text-lg md:text-xl text-rose-950 tracking-tight leading-none">
                    {datingCount}
                  </span>
                  <div className="w-3.5 h-3.5 rounded-full bg-pink-500 text-white flex items-center justify-center shrink-0 border border-white shadow-2xs">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                </div>
                <div className="mt-0.5">
                  <span className="font-black text-[10px] sm:text-xs text-slate-900 block leading-tight whitespace-nowrap">
                    Namoros
                  </span>
                  <span className="font-extrabold text-[8.5px] sm:text-[10px] text-slate-500 block leading-tight tracking-tight whitespace-nowrap">
                    Confirmados
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Casamentos Confirmados (Gold/Amber) */}
            <div
              onClick={() => onSelectSubTab?.('confirmados')}
              className={`p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#fffbeb] to-[#fef3c7] border transition-all cursor-pointer relative flex flex-col sm:flex-row items-center gap-1 sm:gap-2.5 ${
                activeSubTab === 'confirmados'
                  ? 'border-amber-500 ring-2 ring-amber-400/40 shadow-md bg-white'
                  : 'border-amber-200/90 hover:border-amber-300'
              }`}
            >
              {/* Gold Circular Badge Icon */}
              <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 text-white flex items-center justify-center shadow-md border border-amber-300/80 shrink-0">
                <TwoWeddingRingsIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
              </div>

              {/* Text Info */}
              <div className="min-w-0 flex-1 text-center sm:text-left w-full">
                <div className="flex items-center justify-center sm:justify-between gap-1">
                  <span className="font-black text-sm sm:text-lg md:text-xl text-amber-950 tracking-tight leading-none">
                    {marriagesCount}
                  </span>
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 border border-white shadow-2xs">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                </div>
                <div className="mt-0.5">
                  <span className="font-black text-[10px] sm:text-xs text-slate-900 block leading-tight whitespace-nowrap">
                    Casamentos
                  </span>
                  <span className="font-extrabold text-[8.5px] sm:text-[10px] text-slate-500 block leading-tight tracking-tight whitespace-nowrap">
                    Confirmados
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

// Legacy backward compatibility wrappers
export const WeddingConfirmedEmblemBadge: React.FC<{ count: number; isActive?: boolean; onClick?: () => void }> = ({ count, isActive, onClick }) => (
  <ConfirmedConnectionsCard marriagesCount={count} activeSubTab={isActive ? 'confirmados' : null} onSelectSubTab={onClick} />
);

export const FriendshipConfirmedEmblemBadge: React.FC<{ count: number; isActive?: boolean; onClick?: () => void }> = ({ count, isActive, onClick }) => (
  <ConfirmedConnectionsCard friendshipsCount={count} activeSubTab={isActive ? 'amizades' : null} onSelectSubTab={onClick} />
);
