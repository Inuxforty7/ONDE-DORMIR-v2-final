import React from 'react';
import { P2PTier } from '../services/heartLinkService';
import { P2PGreenHeartIcon, P2PBlueDiamondIcon, P2PGoldenCrownIcon } from './HeartLinkP2PIcons';

interface HeartLinkP2PCapsuleProps {
  activeTier: P2PTier | null;
  onSelectTier: (tier: P2PTier, planId: 'vis_24h' | 'vis_7d' | 'vis_30d') => void;
}

export const HeartLinkP2PCapsule: React.FC<HeartLinkP2PCapsuleProps> = ({
  activeTier,
  onSelectTier,
}) => {
  const tiers = [
    {
      tier: 'heart' as const,
      name: 'Coração',
      symbol: '♥',
      price: '100 MT',
      planId: 'vis_24h' as const,
      Icon: P2PGreenHeartIcon,
      hoverGlow: 'hover:drop-shadow-[0_0_12px_rgba(74,222,128,0.8)]',
      activeRing: 'ring-2 ring-emerald-300 shadow-[0_0_15px_rgba(74,222,128,0.9)]',
    },
    {
      tier: 'diamond' as const,
      name: 'Diamante',
      symbol: '◆',
      price: '250 MT',
      planId: 'vis_7d' as const,
      Icon: P2PBlueDiamondIcon,
      hoverGlow: 'hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]',
      activeRing: 'ring-2 ring-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.9)]',
    },
    {
      tier: 'king' as const,
      name: 'VIP',
      symbol: '♛',
      price: '1000 MT',
      planId: 'vis_30d' as const,
      Icon: P2PGoldenCrownIcon,
      hoverGlow: 'hover:drop-shadow-[0_0_14px_rgba(250,204,21,0.8)]',
      activeRing: 'ring-2 ring-amber-300 shadow-[0_0_15px_rgba(250,204,21,0.9)]',
    },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center py-2 sm:py-3 select-none">
      {/* 3D Glossy Title */}
      <div className="mb-2 sm:mb-3 text-center">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#ff1a8c] via-[#e60067] to-[#b3004b] drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)]"
          style={{
            WebkitTextStroke: '1px #ffffff',
            filter: 'drop-shadow(0 2px 8px rgba(255, 0, 122, 0.35))',
          }}
        >
          CHAT P2P
        </h2>
      </div>

      {/* Glossy Pink/Magenta Capsule Container */}
      <div className="w-full max-w-xl mx-auto px-1 sm:px-4">
        <div className="relative rounded-full p-2 sm:p-2.5 bg-gradient-to-r from-[#d90066] via-[#ff007a] to-[#d90066] border-2 border-pink-300/80 shadow-[0_6px_20px_rgba(255,0,122,0.45),inset_0_2px_4px_rgba(255,255,255,0.6),inset_0_-3px_6px_rgba(0,0,0,0.3)] overflow-hidden">
          {/* Top Half Curved Gloss Specular Sheen */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/45 via-white/15 to-transparent rounded-t-full pointer-events-none" />

          {/* 3 Tier Buttons Divided by Vertical Lines */}
          <div className="relative z-10 flex items-center justify-around">
            {tiers.map((t, idx) => {
              const isActive = activeTier === t.tier;
              const IconComponent = t.Icon;

              return (
                <React.Fragment key={t.tier}>
                  {idx > 0 && (
                    <div className="h-8 sm:h-10 md:h-12 w-[1.5px] sm:w-[2px] bg-white/40 rounded-full mx-1 sm:mx-2 shrink-0 shadow-[0_0_2px_rgba(255,255,255,0.8)]" />
                  )}

                  <button
                    type="button"
                    onClick={() => onSelectTier(t.tier, t.planId)}
                    className={`group relative flex-1 flex flex-col items-center justify-center py-1 sm:py-1.5 px-2 rounded-2xl sm:rounded-3xl transition-all duration-200 cursor-pointer touch-manipulation active:scale-95 ${
                      isActive
                        ? 'bg-black/20 backdrop-blur-xs scale-105'
                        : 'hover:bg-white/10 hover:scale-105'
                    }`}
                    title={`${t.symbol} ${t.name} • ${t.price}`}
                  >
                    {/* Active Glow Aura */}
                    {isActive && (
                      <span className="absolute -top-1 px-2 py-0.2 rounded-full bg-emerald-400 text-emerald-950 font-black text-[9px] uppercase tracking-wider shadow-md animate-pulse">
                        Ativo
                      </span>
                    )}

                    {/* 3D Icon - Compact, Aesthetic and Refined */}
                    <div
                      className={`relative flex items-center justify-center transition-transform duration-200 ${t.hoverGlow}`}
                    >
                      <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 shrink-0 filter drop-shadow-[0_3px_5px_rgba(0,0,0,0.35)]" />
                    </div>

                    {/* Price Pill Tag */}
                    <span className="mt-1 text-[10px] sm:text-[11px] font-black text-white px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-xs border border-white/25 tracking-tight shadow-2xs group-hover:bg-black/45 transition-colors">
                      {t.price}
                    </span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
