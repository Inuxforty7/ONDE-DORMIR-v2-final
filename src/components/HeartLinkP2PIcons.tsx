import React from 'react';

/**
 * 3D Glossy Green Heart Icon
 * Matches the glossy emerald/lime heart from HeartLink Chat P2P design
 */
export const P2PGreenHeartIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-10 h-10',
  size,
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Soft Drop Shadow under the heart */}
        <radialGradient id="greenHeartShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        {/* 3D Body Gradient (Emerald to Lime) */}
        <radialGradient id="greenHeartBody" cx="38%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="25%" stopColor="#22c55e" />
          <stop offset="65%" stopColor="#16a34a" />
          <stop offset="90%" stopColor="#15803d" />
          <stop offset="100%" stopColor="#052e16" />
        </radialGradient>

        {/* Outer Glow / Rim Gradient */}
        <linearGradient id="greenHeartRim" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#22c55e" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#14532d" stopOpacity="0.8" />
        </linearGradient>

        {/* Top Gloss Highlight */}
        <linearGradient id="greenHeartGloss" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="50" cy="88" rx="28" ry="6" fill="url(#greenHeartShadow)" />

      {/* Heart Base Shape */}
      <path
        d="M 50 82 C 46 78, 16 54, 16 34 C 16 20, 28 12, 39 12 C 45 12, 48 15, 50 18 C 52 15, 55 12, 61 12 C 72 12, 84 20, 84 34 C 84 54, 54 78, 50 82 Z"
        fill="url(#greenHeartBody)"
        stroke="url(#greenHeartRim)"
        strokeWidth="2"
      />

      {/* Bottom Rim Ambient Light */}
      <path
        d="M 24 45 C 32 65, 46 76, 50 79 C 54 76, 68 65, 76 45"
        stroke="#86efac"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Top Left Specular Gloss */}
      <path
        d="M 38 16 C 30 16, 21 22, 21 32 C 21 40, 27 50, 36 58 C 30 50, 25 40, 25 32 C 25 24, 31 19, 38 18 C 42 17, 46 19, 48 22 C 46 18, 42 16, 38 16 Z"
        fill="url(#greenHeartGloss)"
      />

      {/* Secondary Top Right Shimmer */}
      <ellipse
        cx="63"
        cy="22"
        rx="8"
        ry="4"
        transform="rotate(25 63 22)"
        fill="#ffffff"
        opacity="0.6"
      />
    </svg>
  );
};

/**
 * 3D Glossy Faceted Blue Diamond Icon
 * Matches the brilliant sapphire/cyan cut gemstone from HeartLink Chat P2P design
 */
export const P2PBlueDiamondIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-10 h-10',
  size,
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Soft Drop Shadow under Diamond */}
        <radialGradient id="blueDiamondShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        {/* Facet Gradients */}
        <linearGradient id="diamondTopCenter" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>

        <linearGradient id="diamondTopLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        <linearGradient id="diamondTopRight" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>

        <linearGradient id="diamondBottomCenter" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="40%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0c4a6e" />
        </linearGradient>

        <linearGradient id="diamondBottomLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0369a1" />
          <stop offset="100%" stopColor="#075985" />
        </linearGradient>

        <linearGradient id="diamondBottomRight" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="50" cy="88" rx="26" ry="5" fill="url(#blueDiamondShadow)" />

      {/* Top Table / Upper Facets */}
      {/* Top Center Table */}
      <polygon points="32,20 68,20 78,38 22,38" fill="url(#diamondTopCenter)" />
      
      {/* Top Left Triangle */}
      <polygon points="32,20 22,38 12,38" fill="url(#diamondTopLeft)" />
      
      {/* Top Right Triangle */}
      <polygon points="68,20 88,38 78,38" fill="url(#diamondTopRight)" />

      {/* Top Center-Left Facet */}
      <polygon points="32,20 50,38 22,38" fill="#7dd3fc" opacity="0.9" />

      {/* Top Center-Right Facet */}
      <polygon points="68,20 78,38 50,38" fill="#bae6fd" opacity="0.95" />

      {/* Bottom Facets */}
      {/* Bottom Center Main Facet */}
      <polygon points="22,38 50,38 50,84" fill="url(#diamondBottomCenter)" />
      <polygon points="50,38 78,38 50,84" fill="#0284c7" />

      {/* Bottom Left Outer */}
      <polygon points="12,38 22,38 50,84" fill="url(#diamondBottomLeft)" />

      {/* Bottom Right Outer */}
      <polygon points="78,38 88,38 50,84" fill="url(#diamondBottomRight)" />

      {/* Brilliant Specular Highlights */}
      <polygon points="34,22 48,22 46,36 30,36" fill="#ffffff" opacity="0.75" />
      <polygon points="52,40 50,80 48,40" fill="#ffffff" opacity="0.4" />

      {/* Facet Glimmer Lines */}
      <line x1="32" y1="20" x2="22" y2="38" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
      <line x1="68" y1="20" x2="78" y2="38" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
      <line x1="12" y1="38" x2="88" y2="38" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
      <line x1="22" y1="38" x2="50" y2="84" stroke="#e0f2fe" strokeWidth="1" opacity="0.5" />
      <line x1="78" y1="38" x2="50" y2="84" stroke="#e0f2fe" strokeWidth="1" opacity="0.5" />
      <line x1="50" y1="38" x2="50" y2="84" stroke="#ffffff" strokeWidth="1.2" opacity="0.7" />

      {/* Center Star Sparkle */}
      <circle cx="50" cy="38" r="2.5" fill="#ffffff" />
    </svg>
  );
};

/**
 * 3D Glossy Golden Crown Icon
 * Matches the regal gold crown with ruby jewels from HeartLink Chat P2P design
 */
export const P2PGoldenCrownIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-10 h-10',
  size,
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Soft Drop Shadow under Crown */}
        <radialGradient id="goldCrownShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        {/* Rich Gold Body Gradient */}
        <linearGradient id="goldBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="25%" stopColor="#facc15" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="75%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>

        {/* Base Rim Gradient */}
        <linearGradient id="goldBaseRim" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#713f12" />
        </linearGradient>

        {/* Ruby Jewel Gradient */}
        <radialGradient id="rubyJewel" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="40%" stopColor="#e11d48" />
          <stop offset="85%" stopColor="#9f1239" />
          <stop offset="100%" stopColor="#4c0519" />
        </radialGradient>

        {/* Golden Pearls */}
        <radialGradient id="goldPearl" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#a16207" />
        </radialGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="50" cy="85" rx="30" ry="6" fill="url(#goldCrownShadow)" />

      {/* Main Crown Body */}
      <path
        d="M 18 68 L 14 36 L 32 50 L 50 24 L 68 50 L 86 36 L 82 68 Z"
        fill="url(#goldBody)"
        stroke="#a16207"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Inner Shadow / 3D Depth Curve */}
      <path
        d="M 18 68 C 30 74, 70 74, 82 68 L 86 36 L 68 50 L 50 24 L 32 50 L 14 36 Z"
        fill="url(#goldBody)"
      />

      {/* Crown Base Band */}
      <path
        d="M 16 67 C 32 74, 68 74, 84 67 L 85 75 C 68 82, 32 82, 15 75 Z"
        fill="url(#goldBaseRim)"
        stroke="#713f12"
        strokeWidth="1.2"
      />

      {/* Upper Base Trim */}
      <path
        d="M 16 67 C 32 73, 68 73, 84 67"
        stroke="#fef08a"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Crown Tip Pearls */}
      {/* Left Tip */}
      <circle cx="14" cy="35" r="4.5" fill="url(#goldPearl)" stroke="#854d0e" strokeWidth="0.8" />
      {/* Center Left Peak */}
      <circle cx="32" cy="49" r="3.5" fill="url(#goldPearl)" stroke="#854d0e" strokeWidth="0.8" />
      {/* Center King Tip */}
      <circle cx="50" cy="22" r="5.5" fill="url(#goldPearl)" stroke="#854d0e" strokeWidth="0.8" />
      {/* Center Right Peak */}
      <circle cx="68" cy="49" r="3.5" fill="url(#goldPearl)" stroke="#854d0e" strokeWidth="0.8" />
      {/* Right Tip */}
      <circle cx="86" cy="35" r="4.5" fill="url(#goldPearl)" stroke="#854d0e" strokeWidth="0.8" />

      {/* Center Ruby on Crown Base */}
      <ellipse cx="50" cy="74" rx="4.5" ry="4.5" fill="url(#rubyJewel)" stroke="#4c0519" strokeWidth="0.8" />
      <ellipse cx="32" cy="73" rx="3.5" ry="3.5" fill="url(#rubyJewel)" stroke="#4c0519" strokeWidth="0.8" />
      <ellipse cx="68" cy="73" rx="3.5" ry="3.5" fill="url(#rubyJewel)" stroke="#4c0519" strokeWidth="0.8" />
      <ellipse cx="20" cy="71" rx="2.5" ry="2.5" fill="url(#rubyJewel)" stroke="#4c0519" strokeWidth="0.8" />
      <ellipse cx="80" cy="71" rx="2.5" ry="2.5" fill="url(#rubyJewel)" stroke="#4c0519" strokeWidth="0.8" />

      {/* Ruby Specular Gleams */}
      <circle cx="48.5" cy="72.5" r="1.2" fill="#ffffff" />
      <circle cx="30.8" cy="71.8" r="1" fill="#ffffff" />
      <circle cx="66.8" cy="71.8" r="1" fill="#ffffff" />

      {/* Crown Specular Highlights */}
      <path
        d="M 46 29 L 49 26 L 50 48 L 47 54 Z"
        fill="#ffffff"
        opacity="0.65"
      />
    </svg>
  );
};
