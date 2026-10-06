import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  theme?: 'dark' | 'light' | 'auto';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = true,
  theme = 'dark'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 sm:w-11 sm:h-11 rounded-2xl',
    lg: 'w-12 h-12 sm:w-14 sm:h-14 rounded-2xl',
    xl: 'w-[88px] h-[88px] sm:w-[104px] sm:h-[104px] md:w-[120px] md:h-[120px] rounded-[24px] sm:rounded-[28px] md:rounded-[32px]',
  };

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-2.5',
    lg: 'gap-3 sm:gap-3.5',
    xl: 'gap-3.5 sm:gap-4 md:gap-5',
  };

  const textClasses = {
    sm: 'text-[12.5px] sm:text-sm font-black',
    md: 'text-sm sm:text-base md:text-lg font-black',
    lg: 'text-base sm:text-lg md:text-xl font-black',
    xl: 'text-[28px] sm:text-[34px] md:text-[42px] font-black',
  };

  const subTextClasses = {
    sm: 'text-[9px] font-black',
    md: 'text-[11px] font-black',
    lg: 'text-[13px] font-black',
    xl: 'text-[15px] sm:text-[18px] md:text-[22px] font-black',
  };

  return (
    <div className={`flex items-center justify-center ${gapClasses[size]} shrink-0 min-w-0 ${className}`}>
      {/* Official App Icon SVG - 100% Faithful to Image Reference */}
      <div 
        className={`${sizeClasses[size]} relative overflow-hidden shrink-0 shadow-lg shadow-blue-950/40 border border-white/40 transition-transform active:scale-95`}
      >
        <svg 
          viewBox="0 0 512 512" 
          className="w-full h-full" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Background Blue Gradient */}
            <linearGradient id="odmBgGrad" x1="50" y1="30" x2="460" y2="480" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0066FF"/>
              <stop offset="45%" stopColor="#0047BA"/>
              <stop offset="100%" stopColor="#001845"/>
            </linearGradient>

            {/* Golden Tropical Sun Gradient */}
            <linearGradient id="odmSunGrad" x1="280" y1="50" x2="440" y2="240" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFF200"/>
              <stop offset="35%" stopColor="#FFB700"/>
              <stop offset="100%" stopColor="#FF6600"/>
            </linearGradient>

            {/* Roof Golden-Yellow Gradient */}
            <linearGradient id="odmRoofGrad" x1="100" y1="120" x2="400" y2="300" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFEA00"/>
              <stop offset="45%" stopColor="#FFB300"/>
              <stop offset="100%" stopColor="#FF7A00"/>
            </linearGradient>

            {/* Wave 1 Cyan to Royal Blue Gradient */}
            <linearGradient id="odmWave1" x1="50" y1="360" x2="470" y2="440" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00F0FF"/>
              <stop offset="50%" stopColor="#0099FF"/>
              <stop offset="100%" stopColor="#0044CC"/>
            </linearGradient>

            {/* Wave 2 Deep Cyan Blue Gradient */}
            <linearGradient id="odmWave2" x1="50" y1="410" x2="470" y2="480" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00D2FF"/>
              <stop offset="50%" stopColor="#0077EE"/>
              <stop offset="100%" stopColor="#002B88"/>
            </linearGradient>

            {/* Subtle Drop Shadow */}
            <filter id="odmShadow" x="-10%" y="-10%" width="125%" height="125%">
              <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000e2b" floodOpacity="0.5"/>
            </filter>
          </defs>

          {/* Icon Rounded Rect Background */}
          <rect width="512" height="512" rx="112" fill="url(#odmBgGrad)"/>

          {/* Top-Left Glass Reflection Highlights */}
          <path 
            d="M48 135 C48 80, 80 48, 135 48 L380 48 C300 70, 160 125, 75 270 Z" 
            fill="#FFFFFF" 
            opacity="0.12"
          />

          {/* Cyan Growth Arrow at Top Left */}
          <g filter="url(#odmShadow)">
            <path 
              d="M102 168 L102 122 L116 122 L116 168 Z" 
              fill="#00E5FF" 
            />
            <path 
              d="M109 98 L128 128 L90 128 Z" 
              fill="#00E5FF" 
            />
          </g>

          {/* Golden Tropical Sun in Upper Right */}
          <circle cx="340" cy="165" r="110" fill="url(#odmSunGrad)"/>

          {/* Dark Tropical Palm Tree Silhouette over Sun */}
          <g fill="#021B42" opacity="0.95">
            {/* Trunk */}
            <path d="M380 255 C372 208 382 165 396 138 C388 140 376 172 368 255 Z"/>
            {/* Palm Fronds */}
            <path d="M396 138 C424 125 450 135 460 152 C440 150 418 146 396 138 Z"/>
            <path d="M396 138 C430 144 452 164 456 186 C440 178 418 165 396 138 Z"/>
            <path d="M396 138 C370 120 345 128 332 145 C350 145 375 142 396 138 Z"/>
            <path d="M396 138 C360 132 338 152 328 174 C346 168 370 158 396 138 Z"/>
            <path d="M396 138 C400 110 418 96 428 92 C422 110 414 124 396 138 Z"/>
            <path d="M396 138 C386 112 372 98 362 96 C372 112 384 125 396 138 Z"/>
          </g>

          {/* House Gable Roof (Golden-Yellow Chevron) */}
          <g filter="url(#odmShadow)">
            <path 
              d="M72 278 L238 128 C250 118 266 118 278 128 L408 278 L364 278 L258 175 L116 278 Z" 
              fill="url(#odmRoofGrad)"
            />
          </g>

          {/* White Attic Window (2x2 Grid) */}
          <g fill="#FFFFFF" filter="url(#odmShadow)">
            <rect x="238" y="196" width="14" height="14" rx="2"/>
            <rect x="256" y="196" width="14" height="14" rx="2"/>
            <rect x="238" y="214" width="14" height="14" rx="2"/>
            <rect x="256" y="214" width="14" height="14" rx="2"/>
          </g>

          {/* White House Pillars & Left/Right Base Walls */}
          <g fill="#FFFFFF" filter="url(#odmShadow)">
            <polygon points="106,294 136,270 136,360 106,360" />
            <polygon points="384,294 354,270 354,360 384,360" />
          </g>

          {/* White Bed & Sleeping Figure Icon */}
          <g fill="#FFFFFF" filter="url(#odmShadow)">
            {/* Headboard Post */}
            <rect x="180" y="238" width="18" height="98" rx="6"/>
            {/* Pillow / Head */}
            <circle cx="226" cy="272" r="16"/>
            {/* Blanket / Body Mattress */}
            <rect x="242" y="264" width="94" height="24" rx="7"/>
            {/* Bed Frame & Legs */}
            <path d="M198 290 H336 C342 290 346 294 346 300 V334 C346 337 343 340 340 340 H324 C321 340 318 337 318 334 V314 H198 V334 C198 337 195 340 192 340 H184 V290 Z" />
          </g>

          {/* Flowing Cyan Ocean Waves at Bottom */}
          <g filter="url(#odmShadow)">
            <path 
              d="M62 400 C138 344 235 402 324 378 C386 360 434 336 484 324 C434 376 364 412 292 412 C206 412 140 376 62 400 Z" 
              fill="url(#odmWave1)"
            />
            <path 
              d="M66 436 C142 386 240 438 328 416 C388 400 436 378 482 366 C432 418 364 452 292 452 C206 452 142 416 66 436 Z" 
              fill="url(#odmWave2)"
            />
          </g>
        </svg>
      </div>

      {/* Brand Text - ONDE DORMIR MOÇAMBIQUE */}
      {showText && (
        <div className="flex flex-col shrink-0 min-w-0 justify-center text-left">
          <div className={`${textClasses[size]} tracking-tight font-black leading-none whitespace-nowrap`}>
            {theme === 'light' ? (
              <>
                <span className="text-[#071739] font-black drop-shadow-xs">ONDE </span>
                <span className="text-[#E68A00] font-black drop-shadow-xs">DORMIR</span>
              </>
            ) : (
              <>
                <span className="text-white font-black drop-shadow-sm">ONDE </span>
                <span className="text-[#FFD200] font-black drop-shadow-sm">DORMIR</span>
              </>
            )}
          </div>
          {/* Line 2: MOÇAMBIQUE - Perfectly framed to full width of ONDE DORMIR */}
          <div 
            aria-label="MOÇAMBIQUE"
            className={`w-full flex justify-between items-center ${subTextClasses[size]} uppercase leading-none select-none ${
              size === 'xl' ? 'mt-1.5 sm:mt-2.5' : 'mt-0.5'
            } ${
              theme === 'light' ? 'text-[#1E293B]' : 'text-white drop-shadow-md'
            }`}
          >
            <span>M</span>
            <span>O</span>
            <span>Ç</span>
            <span>A</span>
            <span>M</span>
            <span>B</span>
            <span>I</span>
            <span>Q</span>
            <span>U</span>
            <span>E</span>
          </div>
        </div>
      )}
    </div>
  );
};

