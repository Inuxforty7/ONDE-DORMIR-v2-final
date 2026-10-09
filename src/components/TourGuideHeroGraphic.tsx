import React from 'react';
import guidePhoto from '../assets/images/moz_profile_ana_1790448736252.jpg';

/**
 * Photorealistic representation of the professional local Mozambican tour guide
 * matching the user's reference image:
 * - Real photograph of the smiling Black female guide
 * - Natural blend into the coastal background
 * - Official ID badge credential ("GUIA TURÍSTICA")
 * - Dynamic fluid wave ribbons at bottom-right (emerald, teal & golden yellow)
 */
export const TourGuideHeroGraphic: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full flex items-end justify-end pointer-events-none select-none overflow-hidden ${className}`}>
      {/* 1. Real Photograph of the Local Tour Guide */}
      <div className="relative h-full w-full flex items-end justify-end pr-1 sm:pr-3 pb-0">
        <div className="relative h-[94%] max-h-[185px] sm:max-h-[215px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-400/30 mr-1 sm:mr-3 mb-0.5">
          <img
            src={guidePhoto}
            alt="Guia Turística Oficial de Moçambique"
            className="w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.03]"
          />
          {/* Subtle warm sunlight vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-amber-400/10" />

          {/* Official Badge on Lanyard */}
          <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-white/95 backdrop-blur-md rounded-lg py-1 px-1.5 border border-neutral-200/90 shadow-md flex items-center justify-between gap-1">
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-xs shrink-0">🧭</span>
              <span className="text-[9px] sm:text-[10px] font-black text-emerald-950 uppercase tracking-tight truncate">Guia Oficial</span>
            </div>
            <span className="text-[8px] sm:text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded-full shrink-0">INATUR</span>
          </div>
        </div>
      </div>

      {/* 2. Wave Ribbons in Bottom-Right Corner (Matches reference image) */}
      <div className="absolute right-0 bottom-0 w-32 sm:w-44 h-14 sm:h-18 pointer-events-none z-10">
        <svg viewBox="0 0 180 75" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="waveEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>
            <linearGradient id="waveTealGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0d9488" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="waveGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          {/* Deep emerald wave base */}
          <path d="M 0 75 Q 70 38 180 44 L 180 75 Z" fill="url(#waveEmeraldGrad)" />
          {/* Teal dynamic wave */}
          <path d="M 25 75 Q 90 42 180 52 L 180 75 Z" fill="url(#waveTealGrad)" opacity="0.9" />
          {/* Golden Yellow wave curve */}
          <path d="M 60 75 Q 115 48 180 62 L 180 75 Z" fill="url(#waveGoldGrad)" />
        </svg>
      </div>
    </div>
  );
};
