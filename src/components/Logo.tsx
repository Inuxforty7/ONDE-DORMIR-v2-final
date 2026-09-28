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
  theme = 'light'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl',
    lg: 'w-11 h-11 sm:w-12 sm:h-12 rounded-2xl',
    xl: 'w-14 h-14 sm:w-16 sm:h-16 rounded-3xl',
  };

  const textClasses = {
    sm: 'text-xs sm:text-sm font-black',
    md: 'text-sm sm:text-base font-black',
    lg: 'text-base sm:text-xl font-black',
    xl: 'text-xl sm:text-2xl font-black',
  };

  return (
    <div className={`flex items-center gap-2 shrink-0 min-w-0 ${className}`}>
      {/* Official App Icon SVG */}
      <div 
        className={`${sizeClasses[size]} relative overflow-hidden shadow-md shadow-blue-900/20 shrink-0 border border-blue-400/30 transition-transform active:scale-95`}
      >
        <svg 
          viewBox="0 0 512 512" 
          className="w-full h-full" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Background Blue Gradient */}
            <linearGradient id="bgGrad" x1="64" y1="32" x2="448" y2="480" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1366E2"/>
              <stop offset="50%" stopColor="#0B4DB7"/>
              <stop offset="100%" stopColor="#052C75"/>
            </linearGradient>

            {/* Sun Orange/Yellow Gradient */}
            <linearGradient id="sunGrad" x1="280" y1="60" x2="430" y2="240" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFE600"/>
              <stop offset="40%" stopColor="#FFAA00"/>
              <stop offset="100%" stopColor="#FF4400"/>
            </linearGradient>

            {/* Roof Gradient Yellow-Orange-Red */}
            <linearGradient id="roofGrad" x1="120" y1="120" x2="380" y2="300" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFDD00"/>
              <stop offset="35%" stopColor="#FF8800"/>
              <stop offset="100%" stopColor="#F0330A"/>
            </linearGradient>

            {/* Top Wave Cyan Gradient */}
            <linearGradient id="waveGrad1" x1="60" y1="380" x2="460" y2="430" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00E5FF"/>
              <stop offset="60%" stopColor="#0088FF"/>
              <stop offset="100%" stopColor="#0055D4"/>
            </linearGradient>

            {/* Bottom Wave Blue Gradient */}
            <linearGradient id="waveGrad2" x1="60" y1="420" x2="460" y2="470" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00C8FF"/>
              <stop offset="60%" stopColor="#0066EE"/>
              <stop offset="100%" stopColor="#003FA8"/>
            </linearGradient>

            {/* Drop Shadow Filter for 3D depth */}
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#02153B" floodOpacity="0.45"/>
            </filter>
          </defs>

          {/* Icon Rounded Rect Background */}
          <rect width="512" height="512" rx="115" fill="url(#bgGrad)"/>
          
          {/* Subtle Top-Left Glass Reflection */}
          <path 
            d="M50 140 C50 85, 85 50, 140 50 L372 50 C300 70, 150 120, 70 260 Z" 
            fill="#FFFFFF" 
            opacity="0.08"
          />

          {/* Golden Tropical Sun */}
          <circle cx="345" cy="170" r="105" fill="url(#sunGrad)"/>

          {/* Tropical Palm Tree Silhouette in Sun */}
          <g fill="#072047" opacity="0.95">
            <path d="M375 240 C370 200 376 160 388 135 C383 136 372 165 363 240 Z"/>
            <path d="M388 135 C415 125 438 135 448 152 C430 152 410 148 388 135 Z"/>
            <path d="M388 135 C422 140 442 160 446 182 C430 174 410 162 388 135 Z"/>
            <path d="M388 135 C365 118 340 125 328 142 C345 142 368 140 388 135 Z"/>
            <path d="M388 135 C355 130 332 148 322 170 C340 165 362 155 388 135 Z"/>
            <path d="M388 135 C392 108 408 95 418 92 C412 110 405 122 388 135 Z"/>
            <path d="M388 135 C378 110 365 98 355 96 C365 112 375 124 388 135 Z"/>
          </g>

          {/* House Gable Roof */}
          <g filter="url(#shadow)">
            <path 
              d="M65 272 L236 122 C248 112 264 112 276 122 L405 272 L362 272 L256 168 L108 272 Z" 
              fill="url(#roofGrad)"
            />
          </g>

          {/* House Pillars */}
          <g fill="#FFFFFF" filter="url(#shadow)">
            <polygon points="106,290 134,268 134,352 106,352" />
            <polygon points="378,290 350,268 350,352 378,352" />
          </g>

          {/* Bed Icon inside House */}
          <g fill="#FFFFFF" filter="url(#shadow)">
            <rect x="178" y="222" width="20" height="108" rx="8"/>
            <circle cx="222" cy="262" r="15"/>
            <rect x="238" y="254" width="90" height="22" rx="6"/>
            <path d="M198 280 H332 C338 280 342 284 342 290 V328 C342 331 339 334 336 334 H320 C317 334 314 331 314 328 V306 H198 V328 C198 331 195 334 192 334 H184 V280 Z" />
          </g>

          {/* Flowing Cyan Ocean Waves at Bottom */}
          <g filter="url(#shadow)">
            <path 
              d="M62 402 C135 348 230 405 320 380 C382 363 430 338 480 326 C430 376 360 412 290 412 C205 412 140 378 62 402 Z" 
              fill="url(#waveGrad1)"
            />
            <path 
              d="M68 436 C140 388 235 440 325 418 C385 402 432 380 478 368 C428 418 360 452 290 452 C205 452 142 418 68 436 Z" 
              fill="url(#waveGrad2)"
            />
          </g>
        </svg>
      </div>

      {/* Brand Text - ONDE DORMIR MOÇAMBIQUE */}
      {showText && (
        <div className="flex flex-col shrink min-w-0 justify-center">
          <div className={`${textClasses[size]} tracking-tight font-black truncate leading-tight`}>
            {theme === 'dark' ? (
              <>
                <span className="text-white drop-shadow-xs">ONDE </span>
                <span className="text-amber-400 drop-shadow-xs">DORMIR</span>
              </>
            ) : (
              <>
                <span className="text-neutral-950">ONDE </span>
                <span className="text-blue-600">DORMIR</span>
              </>
            )}
          </div>
          <span 
            className={`text-[9px] sm:text-[10px] font-black tracking-[0.22em] uppercase leading-tight mt-0.5 ${
              theme === 'dark' ? 'text-sky-200 drop-shadow-xs' : 'text-blue-700'
            }`}
          >
            MOÇAMBIQUE
          </span>
        </div>
      )}
    </div>
  );
};
