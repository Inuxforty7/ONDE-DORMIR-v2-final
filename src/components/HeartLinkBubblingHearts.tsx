import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, X, Check } from 'lucide-react';

interface FloatingBubble {
  id: number;
  emoji: string;
  leftOffset: number; // percentage offset
  size: number; // font size in px
  delay: number; // in seconds
  duration: number; // in seconds
}

const HEART_EMOJIS = ['💖', '💕', '❤️', '💓', '💗', '✨', '💘', '🥰'];

export const HeartLinkBubblingHearts: React.FC = () => {
  // Stored state for bubbling hearts in HeartLink
  const [isActive, setIsActive] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('heartlink_bubbling_hearts_active');
      return saved === null ? true : saved === 'true';
    } catch {
      return true;
    }
  });

  const [bubbles, setBubbles] = useState<FloatingBubble[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  // Generate continuous bubbling hearts stream when active
  useEffect(() => {
    if (!isActive) {
      setBubbles([]);
      return;
    }

    // Initialize 6 staggered bubbles
    const initialBubbles: FloatingBubble[] = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      emoji: HEART_EMOJIS[i % HEART_EMOJIS.length],
      leftOffset: 10 + Math.random() * 70, // 10% to 80% horizontal range
      size: 18 + Math.floor(Math.random() * 14), // 18px to 32px
      delay: i * 0.45,
      duration: 2.2 + Math.random() * 0.8,
    }));
    setBubbles(initialBubbles);

    // Periodically refresh bubbles for continuous stream
    const interval = setInterval(() => {
      setBubbles((prev) =>
        prev.map((b) => ({
          ...b,
          emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
          leftOffset: 10 + Math.random() * 70,
        }))
      );
    }, 3500);

    return () => clearInterval(interval);
  }, [isActive]);

  const toggleBubbles = (active: boolean) => {
    setIsActive(active);
    try {
      localStorage.setItem('heartlink_bubbling_hearts_active', String(active));
    } catch {
      // ignore
    }
  };

  return (
    <>
      {/* CORNER FLOATING BUBBLING HEARTS WIDGET */}
      <div className="fixed bottom-5 right-3.5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end pointer-events-auto select-none">
        
        {isActive ? (
          /* ACTIVE STATE: Bubbling Floating Hearts Stream & Glowing Heart Button */
          <div className="relative flex flex-col items-center">
            
            {/* The Bubbling Rising Hearts Stream */}
            <div className="absolute -top-24 left-0 right-0 h-28 pointer-events-none overflow-visible">
              {bubbles.map((bubble) => (
                <span
                  key={bubble.id}
                  className="absolute bottom-0 select-none pointer-events-none drop-shadow-md"
                  style={{
                    left: `${bubble.leftOffset}%`,
                    fontSize: `${bubble.size}px`,
                    animation: `heart-bubble-float ${bubble.duration}s ease-in-out infinite`,
                    animationDelay: `${bubble.delay}s`,
                  }}
                >
                  {bubble.emoji}
                </span>
              ))}
            </div>

            {/* Glowing Heart Trigger Button */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-rose-600 via-pink-500 to-rose-400 text-white flex items-center justify-center shadow-xl border-2 border-white/90 hover:scale-110 active:scale-95 transition-all cursor-pointer animate-heart-pulse-glow group"
              title="Corações Balbuciando HeartLink - Clique para activar ou desactivar"
            >
              <Heart className="w-7 h-7 sm:w-8 sm:h-8 fill-white text-white drop-shadow-md transition-transform group-hover:scale-115" />
              
              {/* Little Sparkle Accent */}
              <div className="absolute top-1 right-1.5 w-4 h-4 text-amber-200 animate-spin">
                <Sparkles className="w-full h-full" />
              </div>

              {/* Status Dot */}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-xs" />
            </button>

            {/* Micro Badge */}
            <span className="mt-1 text-[8.5px] font-black uppercase text-rose-600 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full shadow-xs border border-rose-200">
              Corações ON
            </span>

          </div>
        ) : (
          /* DEACTIVATED STATE: Compact button allowing easy re-activation */
          <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-neutral-300 px-3 py-1.5 rounded-2xl shadow-lg animate-in fade-in duration-200">
            <span className="text-sm select-none">🤍</span>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-neutral-500 leading-tight">Corações HeartLink</span>
              <span className="text-[11px] font-black text-neutral-800 leading-tight">Desativado</span>
            </div>
            <button
              onClick={() => toggleBubbles(true)}
              className="ml-1 px-2.5 py-1 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-black text-[10px] uppercase rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
              title="Activar corações balbuciando"
            >
              Activar
            </button>
          </div>
        )}

      </div>

      {/* QUICK SETTINGS POPOVER */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xs w-full overflow-hidden shadow-2xl border border-pink-200 p-4 space-y-3.5 animate-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl select-none">💖</span>
                <div>
                  <h4 className="font-black text-sm text-neutral-900 leading-tight">
                    Corações Balbuciando
                  </h4>
                  <p className="text-[10.5px] text-pink-600 font-semibold">
                    Animação romântica do HeartLink
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Toggle Row */}
            <div className="p-3 rounded-2xl bg-pink-50/70 border border-pink-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-neutral-900 block">
                  Estado da Animação
                </span>
                <span className="text-[10px] text-neutral-500 font-medium">
                  {isActive ? 'Corações balbuciando ativos' : 'Animação desativada'}
                </span>
              </div>

              <button
                onClick={() => toggleBubbles(!isActive)}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer active:scale-95 shadow-xs ${
                  isActive
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {isActive ? 'Desactivar' : 'Activar'}
              </button>
            </div>

            {/* Description */}
            <p className="text-[11px] text-neutral-500 leading-snug px-1">
              Pode activar ou desactivar o efeito de corações flutuantes a qualquer momento neste cantinho.
            </p>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full py-2 rounded-xl bg-neutral-900 text-white font-black text-xs hover:bg-black transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
};
