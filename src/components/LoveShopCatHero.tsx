import React from 'react';
import { Sparkles, Gift, Tag, ArrowRight, Heart } from 'lucide-react';

interface LoveShopCatHeroProps {
  onPromoClick?: () => void;
  onStoreClick?: (storeId: string) => void;
}

export const LoveShopCatHero: React.FC<LoveShopCatHeroProps> = ({
  onPromoClick,
  onStoreClick,
}) => {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-xl border border-rose-200/80 bg-gradient-to-br from-rose-600 via-red-600 to-amber-700 text-white p-4 sm:p-6 group">
      {/* Decorative background lights and soft romantic blur */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-400/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-rose-400/25 rounded-full blur-2xl pointer-events-none" />

      {/* Floating hearts animation */}
      <div className="absolute top-3 left-4 text-rose-200/40 text-lg animate-pulse pointer-events-none">💖</div>
      <div className="absolute top-10 right-1/3 text-amber-200/30 text-sm animate-bounce pointer-events-none">✨</div>
      <div className="absolute bottom-4 left-1/3 text-rose-100/40 text-xs pointer-events-none">💝</div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
        
        {/* Left / Top Text Area */}
        <div className="flex-1 text-center md:text-left space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-black tracking-wide uppercase shadow-xs backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>Ofertas Exclusivas Love Shop</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-md leading-tight">
            Presentes que <span className="text-amber-300 underline decoration-amber-400/60 decoration-wavy">aproximam</span> corações.
          </h2>

          <p className="text-xs sm:text-sm text-rose-100/90 max-w-md leading-relaxed font-medium">
            Alianças de noivado, relógios finos, sapatos de luxo e surpresas românticas com entrega rápida em Maputo, Matola e em todo Moçambique.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <button
              onClick={onPromoClick}
              className="h-10 sm:h-11 px-4 sm:px-5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-neutral-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer touch-manipulation"
            >
              <Tag className="w-4 h-4 fill-neutral-950" />
              <span>Ver Promoções Ativas</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onStoreClick && (
              <button
                onClick={() => onStoreClick('store-2')}
                className="h-10 sm:h-11 px-4 bg-white/15 hover:bg-white/25 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-2xl border border-white/25 backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer touch-manipulation"
              >
                <Gift className="w-4 h-4 text-rose-200" />
                <span>Loja Doce Detalhe</span>
              </button>
            )}
          </div>
        </div>

        {/* Right / Cat Mascot Illustration Art - Exact match to user image */}
        <div className="shrink-0 relative flex items-center justify-center">
          {/* Glowing pedestal backdrop */}
          <div className="absolute inset-0 bg-gradient-to-t from-amber-500/30 via-rose-500/20 to-transparent rounded-full blur-xl scale-95 pointer-events-none" />

          {/* SVG Illustration Container of the Waving Kitten with Love Shop Bag */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
            <svg
              viewBox="0 0 320 320"
              className="w-full h-full filter drop-shadow-2xl select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Bag Gradient */}
                <linearGradient id="catBagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="50%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#991b1b" />
                </linearGradient>

                {/* Golden Badge Gradient */}
                <linearGradient id="catGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="30%" stopColor="#facc15" />
                  <stop offset="70%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#ca8a04" />
                </linearGradient>

                {/* Fur Radial Gradients */}
                <radialGradient id="catFurFace" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fffbeb" />
                  <stop offset="65%" stopColor="#fef3c7" />
                  <stop offset="100%" stopColor="#fde68a" />
                </radialGradient>

                <linearGradient id="catStripe" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#92400e" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>
              </defs>

              {/* Gift Box Left Side */}
              <g transform="translate(15, 200) rotate(-6)">
                <rect x="0" y="20" width="60" height="55" rx="8" fill="#f43f5e" />
                <rect x="25" y="20" width="10" height="55" fill="#fef08a" />
                <rect x="0" y="42" width="60" height="10" fill="#fef08a" />
                <path d="M30 18 C20 5, 5 15, 26 20 Z" fill="#fbbf24" />
                <path d="M30 18 C40 5, 55 15, 34 20 Z" fill="#fbbf24" />
              </g>

              {/* Gift Box Right Side */}
              <g transform="translate(245, 195) rotate(8)">
                <rect x="0" y="20" width="62" height="60" rx="8" fill="#ffffff" />
                <rect x="26" y="20" width="10" height="60" fill="#f59e0b" />
                <rect x="0" y="45" width="62" height="10" fill="#f59e0b" />
                <path d="M31 18 C22 4, 8 12, 28 20 Z" fill="#f59e0b" />
                <path d="M31 18 C40 4, 54 12, 34 20 Z" fill="#f59e0b" />
              </g>

              {/* The Cat Body & Head Behind Bag */}
              <g id="catMascot">
                {/* Ears */}
                {/* Left Ear */}
                <path d="M100 115 L68 55 Q95 48 122 75 Z" fill="#b45309" />
                <path d="M98 105 L77 64 Q94 60 114 80 Z" fill="#f472b6" />
                {/* Right Ear */}
                <path d="M175 115 L207 55 Q180 48 153 75 Z" fill="#b45309" />
                <path d="M177 105 L198 64 Q181 60 161 80 Z" fill="#f472b6" />

                {/* Head Base */}
                <ellipse cx="137" cy="120" rx="60" ry="52" fill="url(#catFurFace)" />

                {/* Tabby Stripes on Forehead */}
                <path d="M137 72 L137 92" stroke="url(#catStripe)" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M125 76 L127 94" stroke="url(#catStripe)" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M149 76 L147 94" stroke="url(#catStripe)" strokeWidth="3.5" strokeLinecap="round" />
                {/* Cheeks stripes */}
                <path d="M82 118 L96 117" stroke="url(#catStripe)" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M84 128 L98 126" stroke="url(#catStripe)" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M192 118 L178 117" stroke="url(#catStripe)" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M190 128 L176 126" stroke="url(#catStripe)" strokeWidth="3.5" strokeLinecap="round" />

                {/* Left Eye (Open, Big Green Anime Eye) */}
                <ellipse cx="160" cy="118" rx="14" ry="16" fill="#15803d" />
                <ellipse cx="160" cy="118" rx="9" ry="12" fill="#052e16" />
                <circle cx="156" cy="112" r="5" fill="#ffffff" />
                <circle cx="164" cy="122" r="2.5" fill="#ffffff" />

                {/* Right Eye (Winking Cute Curve) */}
                <path d="M104 122 Q116 110 126 122" fill="none" stroke="#451a03" strokeWidth="4.5" strokeLinecap="round" />

                {/* Cute Pink Nose */}
                <polygon points="137,133 131,126 143,126" fill="#f43f5e" />

                {/* Happy Open Smile & Tongue */}
                <path d="M137 133 C137 142 129 146 123 143 M137 133 C137 142 145 146 151 143" fill="none" stroke="#451a03" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M129 142 Q137 156 145 142 Z" fill="#e11d48" />

                {/* Rosy Cheeks */}
                <ellipse cx="102" cy="132" rx="9" ry="6" fill="#fca5a5" opacity="0.65" />
                <ellipse cx="172" cy="132" rx="9" ry="6" fill="#fca5a5" opacity="0.65" />

                {/* Red Collar with Gold Gift Bell */}
                <path d="M102 165 Q137 180 172 165" fill="none" stroke="#dc2626" strokeWidth="8" strokeLinecap="round" />
                <circle cx="137" cy="178" r="10" fill="url(#catGoldGrad)" stroke="#b45309" strokeWidth="1.5" />
                {/* Gift icon on medal */}
                <rect x="133" y="174" width="8" height="8" rx="1" fill="#dc2626" />
                <line x1="137" y1="174" x2="137" y2="182" stroke="#fef08a" strokeWidth="1.5" />
                <line x1="133" y1="178" x2="141" y2="178" stroke="#fef08a" strokeWidth="1.5" />

                {/* Waving Right Paw (Raised in the Air) */}
                <g transform="translate(205, 75) rotate(-15)">
                  {/* Paw */}
                  <ellipse cx="25" cy="25" rx="18" ry="18" fill="#ffffff" />
                  {/* Pink Paw Pads */}
                  <ellipse cx="25" cy="27" rx="9" ry="7" fill="#f472b6" />
                  <circle cx="16" cy="18" r="3.5" fill="#f472b6" />
                  <circle cx="25" cy="14" r="3.5" fill="#f472b6" />
                  <circle cx="34" cy="18" r="3.5" fill="#f472b6" />
                  
                  {/* Waving Sound / Motion Marks */}
                  <path d="M48 8 Q56 20 48 34" fill="none" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
                  <path d="M56 12 Q64 22 56 30" fill="none" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
                </g>

                {/* Left Paw Resting on the Bag */}
                <g transform="translate(85, 172)">
                  <ellipse cx="16" cy="14" rx="14" ry="11" fill="#ffffff" />
                  <line x1="11" y1="11" x2="11" y2="18" stroke="#fde68a" strokeWidth="2" strokeLinecap="round" />
                  <line x1="17" y1="11" x2="17" y2="19" stroke="#fde68a" strokeWidth="2" strokeLinecap="round" />
                  <line x1="23" y1="11" x2="23" y2="18" stroke="#fde68a" strokeWidth="2" strokeLinecap="round" />
                </g>
              </g>

              {/* The Vibrant Red Shopping Bag with "Love Shop PROMOÇÕES" */}
              <g id="redShoppingBag" transform="translate(42, 170)">
                {/* Bag Body with 3D Trapezoid shape */}
                <polygon points="12,18 200,18 188,140 24,140" fill="url(#catBagGrad)" />
                {/* Top Inner Shadow */}
                <polygon points="12,18 200,18 196,28 16,28" fill="#7f1d1d" opacity="0.6" />

                {/* Bag Golden Handles */}
                <path d="M60 20 C60 -10, 95 -10, 95 20" fill="none" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />
                <path d="M120 20 C120 -10, 155 -10, 155 20" fill="none" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />

                {/* "Love Shop" 3D Text on the Bag */}
                <text x="40" y="60" fill="#ffffff" fontFamily="sans-serif" fontWeight="900" fontSize="28" letterSpacing="0.5">
                  Love
                </text>
                <text x="105" y="88" fill="url(#catGoldGrad)" fontFamily="sans-serif" fontWeight="900" fontSize="32" letterSpacing="0.5">
                  Shop
                </text>

                {/* Small Gift Box Motif next to Love Shop */}
                <g transform="translate(170, 42) rotate(10)">
                  <rect x="0" y="4" width="22" height="20" rx="3" fill="#dc2626" stroke="#ffffff" strokeWidth="1" />
                  <line x1="11" y1="4" x2="11" y2="24" stroke="#fef08a" strokeWidth="3" />
                  <line x1="0" y1="14" x2="22" y2="14" stroke="#fef08a" strokeWidth="3" />
                  <path d="M11 4 C7 -2, 2 2, 9 5 Z" fill="#fbbf24" />
                  <path d="M11 4 C15 -2, 20 2, 13 5 Z" fill="#fbbf24" />
                </g>

                {/* Golden Ribbon Banner "PROMOÇÕES" */}
                <g transform="translate(14, 96)">
                  <rect x="0" y="0" width="184" height="34" rx="17" fill="url(#catGoldGrad)" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="92" y="24" textAnchor="middle" fill="#7f1d1d" fontFamily="sans-serif" fontWeight="950" fontSize="18" letterSpacing="1.5">
                    PROMOÇÕES
                  </text>
                </g>

                {/* Sparkle details around bag */}
                <circle cx="35" cy="40" r="2" fill="#ffffff" opacity="0.8" />
                <circle cx="185" cy="115" r="2" fill="#fef08a" opacity="0.8" />
              </g>
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
};
