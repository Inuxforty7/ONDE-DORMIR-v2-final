import React, { useState, useEffect } from 'react';
import { Sparkles, X, Gift, Bell, Check, Tag } from 'lucide-react';
import catHeroImg from '../assets/images/love_shop_cat_hero.jpg';

const CLOUDINARY_IMAGE_URL = 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1790768823/WhatsApp_Image_2026-09-30_at_07.35.42_wp3c8v.jpg';

interface LoveShopPromoCatMascotProps {
  onSelectPromoStore?: (storeId: string) => void;
}

export const LoveShopPromoCatMascot: React.FC<LoveShopPromoCatMascotProps> = ({
  onSelectPromoStore,
}) => {
  // Stored active state for promo mascot (activated when there is a promotion, deactivated when not)
  const [isActive, setIsActive] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('love_shop_promo_cat_active');
      return saved === null ? true : saved === 'true';
    } catch {
      return true;
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isKeyboardOrInputActive, setIsKeyboardOrInputActive] = useState(false);

  // Auto-hide widget when typing on mobile keyboard or when dialogs are active
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
        setIsKeyboardOrInputActive(true);
      }
    };

    const handleFocusOut = () => {
      setTimeout(() => {
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          setIsKeyboardOrInputActive(false);
        }
      }, 150);
    };

    const handleViewportResize = () => {
      if (window.visualViewport && window.visualViewport.height < window.innerHeight * 0.78) {
        setIsKeyboardOrInputActive(true);
      } else {
        setTimeout(() => {
          if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
            setIsKeyboardOrInputActive(false);
          }
        }, 150);
      }
    };

    window.addEventListener('focusin', handleFocusIn);
    window.addEventListener('focusout', handleFocusOut);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportResize);
    }

    return () => {
      window.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('focusout', handleFocusOut);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportResize);
      }
    };
  }, []);

  const togglePromo = (active: boolean) => {
    setIsActive(active);
    try {
      localStorage.setItem('love_shop_promo_cat_active', String(active));
    } catch {
      // ignore localStorage errors
    }
  };

  if (isKeyboardOrInputActive) {
    return null;
  }

  return (
    <>
      {/* CORNER FLOATING PROMO MASCOT WIDGET */}
      <div className="fixed bottom-5 right-3.5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end pointer-events-auto select-none transition-all">
        
        {isActive ? (
          /* ACTIVE STATE: Waving Paw Cat Mascot with Animated Motion & Badges */
          <div className="flex flex-col items-end group">
            {/* Mascot Container */}
            <div className="relative flex items-center justify-end">
              
              {/* Animated Floating Pill on Top of Mascot */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="absolute -top-3 right-1 z-20 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md border border-white/60 flex items-center gap-1 animate-pulse hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                title="Ver detalhes da promoção"
              >
                <Gift className="w-3 h-3 text-amber-300" />
                <span>Promoções</span>
              </button>

              {/* The Waving Cat Card Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl shadow-2xl bg-white border-2 border-rose-400 overflow-hidden cursor-pointer hover:shadow-rose-500/30 transition-all hover:scale-105 active:scale-95 animate-cat-bob flex items-center justify-center p-0.5 group"
                title="Mascote de Promoções Love Shop - Clique para gerir ou ver descontos"
              >
                {/* Real Image of the Adorable Kitten with Love Shop PROMOÇÕES Bag */}
                <img
                  src={catHeroImg || CLOUDINARY_IMAGE_URL}
                  alt="Gatinho Mascote de Promoções Love Shop"
                  className="w-full h-full object-cover object-center rounded-xl sm:rounded-2xl select-none"
                />

                {/* Animated Gold Waving Arc overlay lines matching the image */}
                <div className="absolute top-2 right-2.5 pointer-events-none animate-paw-wave">
                  <svg viewBox="0 0 40 40" className="w-6 h-6 text-amber-400 drop-shadow-sm fill-none stroke-current stroke-[3] stroke-linecap-round">
                    <path d="M10,8 C18,8 24,14 26,22" />
                    <path d="M16,4 C26,4 34,12 36,22" />
                  </svg>
                </div>

                {/* Subtle Glow Ring */}
                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-rose-500/40 pointer-events-none group-hover:border-rose-600 transition-colors" />
              </button>

              {/* Quick Toggle Pill below Mascot */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="absolute -bottom-2 right-1/2 translate-x-1/2 bg-neutral-900/90 hover:bg-neutral-950 backdrop-blur-md text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-white/20 shadow-md whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                title="Gerir Mascote de Promoção"
              >
                PAINEL PROMO
              </button>
            </div>

          </div>
        ) : (
          /* DEACTIVATED STATE: Sleek, compact pill allowing the user/merchant to re-activate when there are promotions */
          <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-neutral-300 px-3 py-1.5 rounded-2xl shadow-lg animate-in fade-in duration-200">
            <span className="text-sm select-none">🐾</span>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-neutral-500 leading-tight">Promoções Love Shop</span>
              <span className="text-[11px] font-black text-neutral-800 leading-tight">Mascote Desativado</span>
            </div>
            <button
              onClick={() => togglePromo(true)}
              className="ml-1 px-2.5 py-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-[10px] uppercase rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
              title="Ativar mascote de promoções"
            >
              Ativar
            </button>
          </div>
        )}

      </div>

      {/* PROMOTIONS MANAGEMENT & STORE OFFERS MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-rose-200 animate-in zoom-in-95 duration-150 flex flex-col">
            
            {/* Modal Header with Cat Hero */}
            <div className="relative bg-gradient-to-r from-[#800a26] via-[#941132] to-[#a31539] text-white p-4.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md shrink-0 bg-white">
                  <img
                    src={catHeroImg || CLOUDINARY_IMAGE_URL}
                    alt="Mascote Love Shop"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-black text-base leading-tight">
                    Mascote Love Shop 🐾
                  </h3>
                  <p className="text-[11px] text-rose-200 font-semibold">
                    Acena para anunciar promoções especiais
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer transition-colors"
                title="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Status & Active Offers */}
            <div className="p-4 space-y-3.5 max-h-[75vh] overflow-y-auto">
              
              {/* Promotion Activation Switch */}
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                    isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-200 text-neutral-500'
                  }`}>
                    {isActive ? <Check className="w-4 h-4" /> : <Tag className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-neutral-900">
                      Estado da Promoção
                    </h4>
                    <p className="text-[10.5px] text-neutral-500 font-medium">
                      {isActive ? 'Mascote acenando com promoções ativas' : 'Mascote desativado (sem promoções)'}
                    </p>
                  </div>
                </div>

                {/* Toggle Button */}
                <button
                  onClick={() => togglePromo(!isActive)}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer active:scale-95 shadow-xs ${
                    isActive
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {isActive ? 'Desativar' : 'Activar'}
                </button>
              </div>

              {/* Active Promotion Cards */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-neutral-500">
                    Lojas com Promoção Hoje:
                  </span>
                  <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                    Ativas
                  </span>
                </div>

                {/* Promo Store 1: Doce Detalhe */}
                <div className="p-3 rounded-2xl border border-rose-200 bg-rose-50/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl select-none">🐾</span>
                    <div>
                      <h5 className="font-extrabold text-xs text-neutral-900">
                        Doce Detalhe (Mascote Oficial)
                      </h5>
                      <p className="text-[10.5px] text-neutral-600">
                        Até 25% de desconto em flores & chocolates
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      onSelectPromoStore?.('store-2');
                    }}
                    className="px-2.5 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-[10.5px] shrink-0 cursor-pointer active:scale-95 shadow-xs"
                  >
                    Ver Loja
                  </button>
                </div>

                {/* Promo Store 2: Amor & Mais */}
                <div className="p-3 rounded-2xl border border-amber-200 bg-amber-50/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl select-none">💍</span>
                    <div>
                      <h5 className="font-extrabold text-xs text-neutral-900">
                        Amor & Mais Joias
                      </h5>
                      <p className="text-[10.5px] text-neutral-600">
                        Alianças banhadas a ouro com oferta de gravação
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      onSelectPromoStore?.('store-1');
                    }}
                    className="px-2.5 py-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-[10.5px] shrink-0 cursor-pointer active:scale-95 shadow-xs"
                  >
                    Ver Loja
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[10px] text-neutral-500 font-medium">
                Alterne o botão para ativar ou desativar o mascote.
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-neutral-200 hover:bg-neutral-300 font-bold text-neutral-800 text-xs cursor-pointer active:scale-95"
              >
                Concluir
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
