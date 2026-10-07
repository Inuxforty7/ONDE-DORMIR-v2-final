import React from 'react';

interface EmblemBadgeProps {
  count: number;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * 💍 Left Emblem: [ Count | Confirmados ]
 * Faithful, high-fidelity 3D game-art medallion:
 * - Ornate gold beveled arch with top puffy 3D ruby heart gem
 * - Deep ruby red heart backdrop with specular gloss & floating pink hearts
 * - 3D interlocking gold rings with metallic luster & deep bevels
 * - White cherry blossoms & pink ribbon bow on bottom-left
 * - 3D green checkmark badge with gold bezel on bottom-right
 * - Bottom gold pill with dark ruby capsule: [ Gold Count | Confirmados ]
 */
export const WeddingConfirmedEmblemBadge: React.FC<EmblemBadgeProps> = ({
  count,
  isActive = false,
  onClick,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col items-center justify-end transition-all duration-200 cursor-pointer active:scale-95 text-left select-none w-full max-w-[210px] mx-auto ${className} ${
        isActive
          ? 'scale-105 drop-shadow-[0_0_16px_rgba(251,191,36,0.85)] filter brightness-110'
          : 'hover:scale-102 hover:brightness-105'
      }`}
      style={{ touchAction: 'manipulation' }}
      title="Confirmados"
    >
      {/* 3D Glossy Medallion SVG */}
      <div className="relative w-full aspect-[16/12] flex items-center justify-center overflow-visible">
        <svg
          viewBox="0 0 200 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)] overflow-visible"
        >
          <defs>
            {/* Outer Gold Rim Gradient */}
            <linearGradient id="em1GoldOuter" x1="10" y1="10" x2="190" y2="130" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFF9C4" />
              <stop offset="18%" stopColor="#FDE047" />
              <stop offset="40%" stopColor="#D97706" />
              <stop offset="65%" stopColor="#FEF08A" />
              <stop offset="85%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>

            {/* Inner Gold Bevel Gradient */}
            <linearGradient id="em1GoldInner" x1="20" y1="15" x2="180" y2="125" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#78350F" />
              <stop offset="25%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#FEF9C3" />
              <stop offset="75%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#451A03" />
            </linearGradient>

            {/* Ruby Red Heart Background Radial Gradient */}
            <radialGradient id="em1RubyBg" cx="100" cy="55" r="75" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF2E63" />
              <stop offset="35%" stopColor="#E11D48" />
              <stop offset="70%" stopColor="#9F1239" />
              <stop offset="95%" stopColor="#4C0519" />
              <stop offset="100%" stopColor="#2A020D" />
            </radialGradient>

            {/* Top Specular Gloss Highlight */}
            <linearGradient id="em1GlossShine" x1="100" y1="16" x2="100" y2="70" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Puffy 3D Mini Hearts Gradient */}
            <radialGradient id="em1PuffyHeart" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#FDA4AF" />
              <stop offset="40%" stopColor="#F43F5E" />
              <stop offset="85%" stopColor="#BE123C" />
              <stop offset="100%" stopColor="#881337" />
            </radialGradient>

            {/* Top Crown Heart Radial */}
            <radialGradient id="em1TopHeart" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#FFCCD5" />
              <stop offset="35%" stopColor="#FF1E56" />
              <stop offset="80%" stopColor="#B80036" />
              <stop offset="100%" stopColor="#4D0014" />
            </radialGradient>

            {/* Left Ring 3D Gradient */}
            <linearGradient id="em1RingLeft" x1="45" y1="35" x2="105" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="25%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="75%" stopColor="#FFFBEB" />
              <stop offset="90%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>

            {/* Right Ring 3D Gradient */}
            <linearGradient id="em1RingRight" x1="85" y1="30" x2="155" y2="105" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="20%" stopColor="#FDE047" />
              <stop offset="45%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#FFFBEB" />
              <stop offset="88%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#451A03" />
            </linearGradient>

            {/* Green Checkmark Badge Gradient */}
            <radialGradient id="em1GreenBadge" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="35%" stopColor="#22C55E" />
              <stop offset="75%" stopColor="#16A34A" />
              <stop offset="100%" stopColor="#14532D" />
            </radialGradient>
          </defs>

          {/* Outer Gold Arch Shield */}
          <path
            d="M 24 116 C 16 88 20 38 66 18 C 86 10 114 10 134 18 C 180 38 184 88 176 116 Z"
            fill="url(#em1GoldOuter)"
            stroke="#5B2109"
            strokeWidth="2.5"
          />

          {/* Inner Golden Bevel Ridge */}
          <path
            d="M 29 113 C 23 88 27 43 69 24 C 87 17 113 17 131 24 C 173 43 177 88 171 113 Z"
            fill="url(#em1GoldInner)"
          />

          {/* Ruby Satin Heart Body */}
          <path
            d="M 34 110 C 29 88 33 47 71 29 C 89 22 111 22 129 29 C 167 47 171 88 166 110 Z"
            fill="url(#em1RubyBg)"
          />

          {/* Gloss Curved Dome Reflection */}
          <path
            d="M 40 82 C 38 52 52 34 76 28 C 90 24 110 24 124 28 C 148 34 162 52 160 82 C 142 48 118 40 84 46 C 60 50 46 64 40 82 Z"
            fill="url(#em1GlossShine)"
          />

          {/* Floating Puffy 3D Pink Hearts */}
          {/* Left Large Heart */}
          <g transform="translate(30, 48) scale(0.95)">
            <path
              d="M 14 24 C 6 16 2 12 2 7 C 2 3 5 1 9 1 C 11.5 1 13 2.2 14 3.5 C 15 2.2 16.5 1 19 1 C 23 1 26 3 26 7 C 26 12 22 16 14 24 Z"
              fill="url(#em1PuffyHeart)"
              stroke="#FFF2A3"
              strokeWidth="1.2"
            />
            <ellipse cx="8" cy="5" rx="2.5" ry="1.2" fill="#FFFFFF" opacity="0.8" transform="rotate(-30 8 5)" />
          </g>

          {/* Left Small Heart */}
          <g transform="translate(56, 38) scale(0.6)">
            <path
              d="M 14 24 C 6 16 2 12 2 7 C 2 3 5 1 9 1 C 11.5 1 13 2.2 14 3.5 C 15 2.2 16.5 1 19 1 C 23 1 26 3 26 7 C 26 12 22 16 14 24 Z"
              fill="url(#em1PuffyHeart)"
              stroke="#FEF08A"
              strokeWidth="1"
            />
          </g>

          {/* Right Large Heart */}
          <g transform="translate(144, 50) scale(0.95)">
            <path
              d="M 14 24 C 6 16 2 12 2 7 C 2 3 5 1 9 1 C 11.5 1 13 2.2 14 3.5 C 15 2.2 16.5 1 19 1 C 23 1 26 3 26 7 C 26 12 22 16 14 24 Z"
              fill="url(#em1PuffyHeart)"
              stroke="#FFF2A3"
              strokeWidth="1.2"
            />
            <ellipse cx="8" cy="5" rx="2.5" ry="1.2" fill="#FFFFFF" opacity="0.8" transform="rotate(-30 8 5)" />
          </g>

          {/* Right Small Upper Heart */}
          <g transform="translate(142, 34) scale(0.55)">
            <path
              d="M 14 24 C 6 16 2 12 2 7 C 2 3 5 1 9 1 C 11.5 1 13 2.2 14 3.5 C 15 2.2 16.5 1 19 1 C 23 1 26 3 26 7 C 26 12 22 16 14 24 Z"
              fill="url(#em1PuffyHeart)"
              stroke="#FEF08A"
              strokeWidth="1"
            />
          </g>

          {/* Right Small Lower Heart */}
          <g transform="translate(158, 76) scale(0.55)">
            <path
              d="M 14 24 C 6 16 2 12 2 7 C 2 3 5 1 9 1 C 11.5 1 13 2.2 14 3.5 C 15 2.2 16.5 1 19 1 C 23 1 26 3 26 7 C 26 12 22 16 14 24 Z"
              fill="url(#em1PuffyHeart)"
              stroke="#FEF08A"
              strokeWidth="1"
            />
          </g>

          {/* Top Crown 3D Ruby Heart */}
          <g transform="translate(86, 4) scale(1)">
            <path
              d="M 14 24 C 6 16 2 12 2 7 C 2 3 5 1 9 1 C 11.5 1 13 2.2 14 3.5 C 15 2.2 16.5 1 19 1 C 23 1 26 3 26 7 C 26 12 22 16 14 24 Z"
              fill="url(#em1TopHeart)"
              stroke="url(#em1GoldOuter)"
              strokeWidth="2.4"
            />
            <ellipse cx="8" cy="5" rx="3.5" ry="1.8" fill="#FFFFFF" opacity="0.85" transform="rotate(-30 8 5)" />
          </g>

          {/* Left Ring (Back Interlocking Band) */}
          <g transform="rotate(-15 76 68)">
            {/* Ambient drop shadow under ring */}
            <ellipse cx="78" cy="71" rx="28" ry="33" stroke="#2A020D" strokeWidth="8.5" opacity="0.45" />
            {/* Main Gold Band Body */}
            <ellipse cx="76" cy="68" rx="27" ry="32" stroke="url(#em1RingLeft)" strokeWidth="9" />
            {/* Inner & Outer Bevel Lines */}
            <ellipse cx="76" cy="68" rx="22.5" ry="27.5" stroke="#78350F" strokeWidth="1" />
            <ellipse cx="76" cy="68" rx="31.5" ry="36.5" stroke="#FFFBEB" strokeWidth="1" opacity="0.9" />
          </g>

          {/* Right Ring (Front Interlocking Band) */}
          <g transform="rotate(18 122 66)">
            {/* Ambient drop shadow under ring */}
            <ellipse cx="124" cy="69" rx="28" ry="33" stroke="#2A020D" strokeWidth="8.5" opacity="0.5" />
            {/* Main Gold Band Body */}
            <ellipse cx="122" cy="66" rx="27" ry="32" stroke="url(#em1RingRight)" strokeWidth="9.5" />
            {/* Inner & Outer Bevel Lines */}
            <ellipse cx="122" cy="66" rx="22.2" ry="27.2" stroke="#78350F" strokeWidth="1.2" />
            <ellipse cx="122" cy="66" rx="31.8" ry="36.8" stroke="#FEF9C3" strokeWidth="1.2" />
          </g>

          {/* Bottom-Left Floral Blossom & Pink Ribbon Bow */}
          <g transform="translate(28, 70) scale(1.15)">
            {/* Green Leaves */}
            <path d="M 12 18 C 5 12 3 5 12 3 C 19 10 17 17 12 18 Z" fill="#22C55E" stroke="#14532D" strokeWidth="1" />
            <path d="M 24 28 C 17 26 12 19 19 14 C 26 17 26 24 24 28 Z" fill="#16A34A" stroke="#14532D" strokeWidth="1" />
            <path d="M 3 24 C -2 18 0 11 8 11 C 11 18 9 24 3 24 Z" fill="#4ADE80" stroke="#15803D" strokeWidth="0.8" />

            {/* Blossom Petals */}
            <circle cx="16" cy="18" r="7.5" fill="#FFFFFF" stroke="#FDA4AF" strokeWidth="0.8" />
            <circle cx="9" cy="25" r="6.5" fill="#FFF1F2" stroke="#FDA4AF" strokeWidth="0.8" />
            <circle cx="24" cy="23" r="6.5" fill="#FFF1F2" stroke="#FDA4AF" strokeWidth="0.8" />
            {/* Yellow Stamen Centers */}
            <circle cx="16" cy="18" r="3" fill="#FBBF24" stroke="#D97706" strokeWidth="0.5" />
            <circle cx="9" cy="25" r="2.5" fill="#FBBF24" stroke="#D97706" strokeWidth="0.5" />
            <circle cx="24" cy="23" r="2.5" fill="#FBBF24" stroke="#D97706" strokeWidth="0.5" />

            {/* Pink Satin Ribbon Bow */}
            <path d="M 26 31 C 19 26 16 36 24 38 C 29 36 31 34 33 31 Z" fill="#F43F5E" stroke="#9F1239" strokeWidth="1" />
            <path d="M 40 31 C 47 26 50 36 42 38 C 37 36 35 34 33 31 Z" fill="#F43F5E" stroke="#9F1239" strokeWidth="1" />
            {/* Center Heart Ribbon Jewel */}
            <circle cx="33" cy="32" r="3.5" fill="#FB7185" stroke="#9F1239" strokeWidth="0.8" />
          </g>

          {/* Green Verified Checkmark Badge (Bottom-Right) */}
          <g transform="translate(144, 78)">
            {/* Gold Rim */}
            <circle cx="20" cy="20" r="18" fill="url(#em1GoldOuter)" stroke="#5B2109" strokeWidth="1.5" />
            {/* Green Body */}
            <circle cx="20" cy="20" r="14.5" fill="url(#em1GreenBadge)" stroke="#FFFFFF" strokeWidth="1.5" />
            {/* White Checkmark */}
            <path
              d="M 12 20 L 17 25 L 28 14"
              stroke="#FFFFFF"
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>

      {/* Bottom Pill Container: [ 3D Gold Count | Confirmados ] */}
      <div className="w-full relative -mt-3.5 sm:-mt-4 z-10">
        {/* Outer Gold Border Frame */}
        <div className="w-full bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 p-[2px] rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.4)]">
          {/* Inner Ruby Capsule */}
          <div className="bg-gradient-to-r from-[#880B2B] via-[#C2185B] to-[#880B2B] px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full flex items-center justify-center gap-2 border border-rose-500/40 shadow-inner">
            {/* 3D Metallic Golden Number */}
            <span
              className="font-black text-sm sm:text-base bg-gradient-to-b from-[#FFFDE7] via-[#FDD835] to-[#F57F17] bg-clip-text text-transparent drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.9)] tracking-tight leading-none"
              style={{
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.85))',
              }}
            >
              {count}
            </span>

            {/* Vertical Divider Line */}
            <span className="w-[1.5px] h-3.5 sm:h-4 bg-white/40 rounded-full" />

            {/* Exact Label: Confirmados */}
            <span className="font-black text-xs sm:text-sm text-white tracking-tight drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.85)] leading-none">
              Confirmados
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

/**
 * 👥 Right Emblem: [ Count | Confirmadas ]
 * Faithful, semi-realistic 3D stylized avatars of two best friends hugging warmly:
 * - Ornate gold beveled arch with top yellow sparkle energy rays
 * - Deep royal sapphire/purple blue backdrop with specular gloss & floating pink hearts
 * - Blue friend (cyan-blue smooth 3D head with soft specular reflection, rounded shoulders, sculpted torso, right arm wrapped around pink friend's shoulder)
 * - Pink friend (magenta-pink smooth 3D head with soft specular reflection, rounded shoulders, sculpted torso, left arm wrapped around blue friend's shoulder)
 * - Natural 3D curved embracing arms with rounded hands resting comfortably on shoulders
 * - 3D green checkmark badge with gold bezel on bottom-right
 * - Bottom gold pill with dark sapphire capsule: [ Gold Count | Confirmadas ]
 */
export const FriendshipConfirmedEmblemBadge: React.FC<EmblemBadgeProps> = ({
  count,
  isActive = false,
  onClick,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col items-center justify-end transition-all duration-200 cursor-pointer active:scale-95 text-left select-none w-full max-w-[210px] mx-auto ${className} ${
        isActive
          ? 'scale-105 drop-shadow-[0_0_16px_rgba(56,189,248,0.85)] filter brightness-110'
          : 'hover:scale-102 hover:brightness-105'
      }`}
      style={{ touchAction: 'manipulation' }}
      title="Confirmadas"
    >
      {/* 3D Glossy Medallion SVG */}
      <div className="relative w-full aspect-[16/12] flex items-center justify-center overflow-visible">
        <svg
          viewBox="0 0 200 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)] overflow-visible"
        >
          <defs>
            {/* Outer Gold Rim Gradient */}
            <linearGradient id="em2GoldOuter" x1="10" y1="10" x2="190" y2="130" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFF9C4" />
              <stop offset="18%" stopColor="#FDE047" />
              <stop offset="40%" stopColor="#D97706" />
              <stop offset="65%" stopColor="#FEF08A" />
              <stop offset="85%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>

            {/* Inner Gold Bevel Gradient */}
            <linearGradient id="em2GoldInner" x1="20" y1="15" x2="180" y2="125" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#78350F" />
              <stop offset="25%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#FEF9C3" />
              <stop offset="75%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#451A03" />
            </linearGradient>

            {/* Sapphire Blue Background Radial Gradient */}
            <radialGradient id="em2SapphireBg" cx="100" cy="55" r="75" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="35%" stopColor="#2563EB" />
              <stop offset="70%" stopColor="#1E1B4B" />
              <stop offset="95%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>

            {/* Top Specular Gloss Highlight */}
            <linearGradient id="em2GlossShine" x1="100" y1="16" x2="100" y2="70" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* 3D Blue Head Spherical Radial Gradient */}
            <radialGradient id="em2HeadBlue" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="22%" stopColor="#38BDF8" />
              <stop offset="55%" stopColor="#0284C7" />
              <stop offset="85%" stopColor="#0369A1" />
              <stop offset="100%" stopColor="#082F49" />
            </radialGradient>

            {/* 3D Blue Body Linear Gradient */}
            <linearGradient id="em2BodyBlue" x1="50" y1="65" x2="95" y2="115" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="35%" stopColor="#0284C7" />
              <stop offset="75%" stopColor="#0369A1" />
              <stop offset="100%" stopColor="#0C4A6E" />
            </linearGradient>

            {/* 3D Pink Head Spherical Radial Gradient */}
            <radialGradient id="em2HeadPink" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#FCE7F3" />
              <stop offset="22%" stopColor="#F472B6" />
              <stop offset="55%" stopColor="#DB2777" />
              <stop offset="85%" stopColor="#9D174D" />
              <stop offset="100%" stopColor="#500724" />
            </radialGradient>

            {/* 3D Pink Body Linear Gradient */}
            <linearGradient id="em2BodyPink" x1="105" y1="65" x2="150" y2="115" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="35%" stopColor="#DB2777" />
              <stop offset="75%" stopColor="#BE185D" />
              <stop offset="100%" stopColor="#70072B" />
            </linearGradient>

            {/* Blue Arm Wrapping Around Pink Shoulder */}
            <linearGradient id="em2BlueArmWrap" x1="82" y1="60" x2="145" y2="78" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7DD3FC" />
              <stop offset="30%" stopColor="#0284C7" />
              <stop offset="70%" stopColor="#0369A1" />
              <stop offset="100%" stopColor="#075985" />
            </linearGradient>

            {/* Pink Arm Wrapping Around Blue Shoulder */}
            <linearGradient id="em2PinkArmWrap" x1="118" y1="60" x2="55" y2="78" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F9A8D4" />
              <stop offset="30%" stopColor="#DB2777" />
              <stop offset="70%" stopColor="#BE185D" />
              <stop offset="100%" stopColor="#831843" />
            </linearGradient>

            {/* Puffy 3D Mini Hearts Gradient */}
            <radialGradient id="em2PuffyHeart" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#FDA4AF" />
              <stop offset="40%" stopColor="#F43F5E" />
              <stop offset="85%" stopColor="#BE123C" />
              <stop offset="100%" stopColor="#881337" />
            </radialGradient>

            {/* Green Checkmark Badge Gradient */}
            <radialGradient id="em2GreenBadge" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="35%" stopColor="#22C55E" />
              <stop offset="75%" stopColor="#16A34A" />
              <stop offset="100%" stopColor="#14532D" />
            </radialGradient>
          </defs>

          {/* Outer Gold Arch Shield */}
          <path
            d="M 24 116 C 16 88 20 38 66 18 C 86 10 114 10 134 18 C 180 38 184 88 176 116 Z"
            fill="url(#em2GoldOuter)"
            stroke="#5B2109"
            strokeWidth="2.5"
          />

          {/* Inner Golden Bevel Ridge */}
          <path
            d="M 29 113 C 23 88 27 43 69 24 C 87 17 113 17 131 24 C 173 43 177 88 171 113 Z"
            fill="url(#em2GoldInner)"
          />

          {/* Sapphire Blue Satin Body */}
          <path
            d="M 34 110 C 29 88 33 47 71 29 C 89 22 111 22 129 29 C 167 47 171 88 166 110 Z"
            fill="url(#em2SapphireBg)"
          />

          {/* Top Yellow Energy Sparkle Rays */}
          <g stroke="#FDE047" strokeWidth="3" strokeLinecap="round">
            <path d="M 100 8 L 100 18" />
            <path d="M 86 12 L 91 20" />
            <path d="M 114 12 L 109 20" />
          </g>

          {/* Gloss Curved Dome Reflection */}
          <path
            d="M 40 82 C 38 52 52 34 76 28 C 90 24 110 24 124 28 C 148 34 162 52 160 82 C 142 48 118 40 84 46 C 60 50 46 64 40 82 Z"
            fill="url(#em2GlossShine)"
          />

          {/* Floating Puffy 3D Pink Hearts on Sides */}
          {/* Left Heart */}
          <g transform="translate(30, 50) scale(0.95)">
            <path
              d="M 14 24 C 6 16 2 12 2 7 C 2 3 5 1 9 1 C 11.5 1 13 2.2 14 3.5 C 15 2.2 16.5 1 19 1 C 23 1 26 3 26 7 C 26 12 22 16 14 24 Z"
              fill="url(#em2PuffyHeart)"
              stroke="#FFF2A3"
              strokeWidth="1.2"
            />
            <ellipse cx="8" cy="5" rx="2.5" ry="1.2" fill="#FFFFFF" opacity="0.8" transform="rotate(-30 8 5)" />
          </g>

          {/* Right Heart */}
          <g transform="translate(144, 50) scale(0.95)">
            <path
              d="M 14 24 C 6 16 2 12 2 7 C 2 3 5 1 9 1 C 11.5 1 13 2.2 14 3.5 C 15 2.2 16.5 1 19 1 C 23 1 26 3 26 7 C 26 12 22 16 14 24 Z"
              fill="url(#em2PuffyHeart)"
              stroke="#FFF2A3"
              strokeWidth="1.2"
            />
            <ellipse cx="8" cy="5" rx="2.5" ry="1.2" fill="#FFFFFF" opacity="0.8" transform="rotate(-30 8 5)" />
          </g>

          {/* ============================================================ */}
          {/* 3D TWO FRIENDS EMBRACING (ICONIC & SEMI-REALISTIC)           */}
          {/* ============================================================ */}

          {/* Ground / Body Contact Shadows */}
          <ellipse cx="74" cy="112" rx="26" ry="4.5" fill="#020617" opacity="0.6" />
          <ellipse cx="126" cy="112" rx="26" ry="4.5" fill="#020617" opacity="0.6" />

          {/* --- BLUE FRIEND (LEFT) --- */}
          <g id="blueFriendMain">
            {/* Torso */}
            <path
              d="M 52 110 L 52 82 C 52 69 61 62 75 62 C 89 62 98 69 98 82 L 98 110 Z"
              fill="url(#em2BodyBlue)"
              stroke="#082F49"
              strokeWidth="1.2"
            />
            {/* Torso Specular Left Ridge */}
            <path
              d="M 54 108 L 54 83 C 54 71 62 64 74 64"
              stroke="#BAE6FD"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.8"
            />
            {/* Left Dropping Arm */}
            <path
              d="M 54 75 C 46 80 44 94 44 110 L 54 110 C 54 96 56 86 63 80 Z"
              fill="url(#em2BodyBlue)"
              stroke="#082F49"
              strokeWidth="1.2"
            />
            <path
              d="M 46 88 C 46 96 47 104 48 108"
              stroke="#BAE6FD"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.85"
            />

            {/* Head Spherical 3D */}
            <circle cx="74" cy="38" r="20" fill="url(#em2HeadBlue)" stroke="#082F49" strokeWidth="1.5" />
            {/* Head Specular Gloss Sheen */}
            <path
              d="M 62 29 C 65 22 73 21 80 22 C 74 23 68 26 65 32 C 63 36 63 40 63 42 C 61 38 61 32 62 29 Z"
              fill="#FFFFFF"
              opacity="0.92"
            />
            <circle cx="83" cy="25" r="2.5" fill="#FFFFFF" opacity="0.85" />
          </g>

          {/* --- PINK FRIEND (RIGHT) --- */}
          <g id="pinkFriendMain">
            {/* Torso */}
            <path
              d="M 102 110 L 102 82 C 102 69 111 62 125 62 C 139 62 148 69 148 82 L 148 110 Z"
              fill="url(#em2BodyPink)"
              stroke="#500724"
              strokeWidth="1.2"
            />
            {/* Torso Specular Right Ridge */}
            <path
              d="M 146 108 L 146 83 C 146 71 138 64 126 64"
              stroke="#FBCFE8"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.8"
            />
            {/* Right Dropping Arm */}
            <path
              d="M 146 75 C 154 80 156 94 156 110 L 146 110 C 146 96 144 86 137 80 Z"
              fill="url(#em2BodyPink)"
              stroke="#500724"
              strokeWidth="1.2"
            />
            <path
              d="M 154 88 C 154 96 153 104 152 108"
              stroke="#FBCFE8"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.85"
            />

            {/* Head Spherical 3D */}
            <circle cx="126" cy="38" r="20" fill="url(#em2HeadPink)" stroke="#500724" strokeWidth="1.5" />
            {/* Head Specular Gloss Sheen */}
            <path
              d="M 114 29 C 117 22 125 21 132 22 C 126 23 120 26 117 32 C 115 36 115 40 115 42 C 113 38 113 32 114 29 Z"
              fill="#FFFFFF"
              opacity="0.92"
            />
            <circle cx="135" cy="25" r="2.5" fill="#FFFFFF" opacity="0.85" />
          </g>

          {/* --- WARM EMBRACE ARMS WRAPPED AROUND SHOULDERS --- */}

          {/* Blue Arm wrapping over Pink's Right Shoulder (Back of neck to front shoulder) */}
          <g id="blueArmEmbrace">
            {/* Ambient Shadow under arm */}
            <path
              d="M 82 64 C 98 52 126 56 142 70 C 136 76 128 76 120 68 C 108 58 92 60 84 70 Z"
              fill="#300416"
              opacity="0.4"
            />
            {/* Blue Arm Band */}
            <path
              d="M 80 62 C 98 50 126 54 140 68 C 135 73 128 73 120 66 C 108 56 92 58 84 68 Z"
              fill="url(#em2BlueArmWrap)"
              stroke="#082F49"
              strokeWidth="1.4"
            />
            {/* Arm Highlight */}
            <path
              d="M 90 56 C 104 50 122 52 135 63"
              stroke="#BAE6FD"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.85"
            />
            {/* Blue Rounded Hand on Pink's Shoulder */}
            <circle cx="136" cy="69" r="6" fill="url(#em2BlueArmWrap)" stroke="#082F49" strokeWidth="1.2" />
            <circle cx="134" cy="67" r="3.2" fill="#BAE6FD" opacity="0.8" />
          </g>

          {/* Pink Arm wrapping over Blue's Left Shoulder (Back of neck to front shoulder) */}
          <g id="pinkArmEmbrace">
            {/* Ambient Shadow under arm */}
            <path
              d="M 118 64 C 102 52 74 56 58 70 C 64 76 72 76 80 68 C 92 58 108 60 116 70 Z"
              fill="#062134"
              opacity="0.4"
            />
            {/* Pink Arm Band */}
            <path
              d="M 120 62 C 102 50 74 54 60 68 C 65 73 72 73 80 66 C 92 56 108 58 116 68 Z"
              fill="url(#em2PinkArmWrap)"
              stroke="#500724"
              strokeWidth="1.4"
            />
            {/* Arm Highlight */}
            <path
              d="M 110 56 C 96 50 78 52 65 63"
              stroke="#FBCFE8"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.85"
            />
            {/* Pink Rounded Hand on Blue's Shoulder */}
            <circle cx="64" cy="69" r="6" fill="url(#em2PinkArmWrap)" stroke="#500724" strokeWidth="1.2" />
            <circle cx="66" cy="67" r="3.2" fill="#FBCFE8" opacity="0.8" />
          </g>

          {/* Green Verified Checkmark Badge (Bottom-Right) */}
          <g transform="translate(144, 78)">
            {/* Gold Rim */}
            <circle cx="20" cy="20" r="18" fill="url(#em2GoldOuter)" stroke="#5B2109" strokeWidth="1.5" />
            {/* Green Body */}
            <circle cx="20" cy="20" r="14.5" fill="url(#em2GreenBadge)" stroke="#FFFFFF" strokeWidth="1.5" />
            {/* White Checkmark */}
            <path
              d="M 12 20 L 17 25 L 28 14"
              stroke="#FFFFFF"
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>

      {/* Bottom Pill Container: [ 3D Gold Count | Confirmadas ] */}
      <div className="w-full relative -mt-3.5 sm:-mt-4 z-10">
        {/* Outer Gold Border Frame */}
        <div className="w-full bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 p-[2px] rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.4)]">
          {/* Inner Sapphire Capsule */}
          <div className="bg-gradient-to-r from-[#0F172A] via-[#1D4ED8] to-[#0F172A] px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full flex items-center justify-center gap-2 border border-sky-400/40 shadow-inner">
            {/* 3D Metallic Golden Number */}
            <span
              className="font-black text-sm sm:text-base bg-gradient-to-b from-[#FFFDE7] via-[#FDD835] to-[#F57F17] bg-clip-text text-transparent drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.9)] tracking-tight leading-none"
              style={{
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.85))',
              }}
            >
              {count}
            </span>

            {/* Vertical Divider Line */}
            <span className="w-[1.5px] h-3.5 sm:h-4 bg-white/40 rounded-full" />

            {/* Exact Label: Confirmadas */}
            <span className="font-black text-xs sm:text-sm text-white tracking-tight drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.85)] leading-none">
              Confirmadas
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};
