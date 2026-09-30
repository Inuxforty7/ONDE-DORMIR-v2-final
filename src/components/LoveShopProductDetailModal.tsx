import React from 'react';
import { 
  X, 
  MessageCircle, 
  Phone, 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  Share2, 
  Tag, 
  Store,
  Clock,
  Sparkles
} from 'lucide-react';
import { LoveShopProduct } from '../types';

interface LoveShopProductDetailModalProps {
  product: LoveShopProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectStore?: (storeId: string) => void;
}

export const LoveShopProductDetailModal: React.FC<LoveShopProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onSelectStore,
}) => {
  if (!isOpen || !product) return null;

  const whatsappMessage = encodeURIComponent(
    `Olá! Vi o produto "${product.name}" (${product.price.toLocaleString('pt-MZ')} MT) na Love Shop do Onde Dormir Moçambique e gostaria de encomendar.`
  );
  const whatsappUrl = `https://wa.me/${product.whatsapp}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 relative"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer shadow-md backdrop-blur-md transition-all active:scale-95"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {/* Product Image */}
          <div className="relative aspect-4/3 bg-neutral-900 overflow-hidden">
            <img
              src={product.photo}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Badges on photo */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              <span className="text-[11px] font-black uppercase bg-rose-600 text-white px-2.5 py-0.5 rounded-lg shadow-md">
                {product.categoryLabel}
              </span>
              {product.discountPercent && (
                <span className="text-[11px] font-black bg-amber-400 text-zinc-950 px-2 py-0.5 rounded-lg shadow-md flex items-center gap-1">
                  <Tag className="w-3 h-3" /> -{product.discountPercent}% OFF
                </span>
              )}
            </div>

            <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
              <span className="text-xs font-bold bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                📍 {product.city}, {product.province}
              </span>
              <span className="text-xs font-black text-emerald-400 bg-emerald-950/80 border border-emerald-400/40 px-2.5 py-1 rounded-lg backdrop-blur-md">
                Disponível em Stock
              </span>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-4 sm:p-5 space-y-4">
            {/* Title & Price */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
                  Artigo Oficial Love Shop
                </span>
                {product.platformTenure && (
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {product.platformTenure}
                  </span>
                )}
              </div>

              <h2 className="text-lg sm:text-xl font-black text-neutral-950 leading-snug mt-1">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-2.5 mt-2">
                <span className="text-2xl font-black text-rose-600">
                  {product.price.toLocaleString('pt-MZ')} MT
                </span>
                {product.originalPrice && (
                  <span className="text-sm font-semibold text-neutral-400 line-through">
                    {product.originalPrice.toLocaleString('pt-MZ')} MT
                  </span>
                )}
              </div>
            </div>

            {/* Store Banner */}
            <div 
              onClick={() => {
                if (onSelectStore) {
                  onSelectStore(product.storeId);
                  onClose();
                }
              }}
              className="p-3 bg-neutral-50 hover:bg-neutral-100 rounded-2xl border border-neutral-200 flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-base shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-black text-neutral-900 truncate">
                      {product.storeName}
                    </span>
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  </div>
                  <span className="text-[11px] text-neutral-500 block truncate">
                    Vendedor Certificado • Ver catálogo completo
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-rose-600 shrink-0">
                Ver Loja &rarr;
              </span>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Descrição do Artigo
              </h3>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Buyer Notice (Acesso 100% Livre) */}
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="leading-snug">
                <strong>Acesso Livre para Compradores:</strong> Não precisa de cadastro nem taxas intermediárias. Compre diretamente com a loja parceira pelo WhatsApp ou chamada telefónica.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 bg-white border-t border-neutral-200 flex items-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-white shrink-0" />
            <span>Comprar no WhatsApp</span>
          </a>

          <a
            href={`tel:${product.phone}`}
            className="w-12 h-12 rounded-2xl bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Ligar para a loja"
          >
            <Phone className="w-5 h-5 text-neutral-800" />
          </a>
        </div>
      </div>
    </div>
  );
};
