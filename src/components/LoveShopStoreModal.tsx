import React from 'react';
import { 
  X, 
  Store, 
  ShieldCheck, 
  Star, 
  MapPin, 
  MessageCircle, 
  Phone, 
  CheckCircle2, 
  ShoppingBag,
  Clock,
  Sparkles
} from 'lucide-react';
import { LoveShopStore, LoveShopProduct } from '../types';

interface LoveShopStoreModalProps {
  store: LoveShopStore | null;
  products: LoveShopProduct[];
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: LoveShopProduct) => void;
}

export const LoveShopStoreModal: React.FC<LoveShopStoreModalProps> = ({
  store,
  products,
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  if (!isOpen || !store) return null;

  const storeProducts = React.useMemo(() => {
    if (!store) return [];
    const saved = localStorage.getItem(`onde_dormir_store_catalog_${store.id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // fallback
      }
    }
    return products.filter((p) => p.storeId === store.id);
  }, [store?.id, products]);

  const whatsappMessage = encodeURIComponent(
    `Olá ${store.name}! Encontrei a vossa loja no módulo Love Shop do Onde Dormir Moçambique e gostaria de conhecer o vosso catálogo de presentes.`
  );
  const whatsappUrl = `https://wa.me/${store.whatsapp}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 relative"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer shadow-md backdrop-blur-md transition-all active:scale-95"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {/* Cover Header */}
          <div className="relative aspect-16/7 bg-neutral-900 overflow-hidden">
            {store.coverImage && (
              <img
                src={store.coverImage}
                alt={store.name}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

            <div className="absolute bottom-3 left-4 right-4 text-white flex items-end justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xl font-black text-white">{store.name}</h2>
                  {store.verified && (
                    <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-black">
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-xs text-rose-200 font-medium mt-0.5">{store.slogan}</p>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1 text-amber-300 font-black text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{store.rating.toFixed(1)}</span>
                  <span className="text-[11px] text-neutral-300 font-normal">({store.reviewsCount})</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-300 block">
                  🛍️ {store.salesCount.toLocaleString('pt-MZ')} vendas
                </span>
              </div>
            </div>
          </div>

          {/* Store Info Bar */}
          <div className="p-4 bg-neutral-50 border-b border-neutral-200 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-700">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{store.address ? `${store.address} • ` : ''}{store.city}, {store.province}</span>
              </div>

              {store.platformTenure && (
                <div className="flex items-center gap-1 text-[11px] font-semibold text-neutral-600 bg-white border border-neutral-200 px-2 py-0.5 rounded-md">
                  <Clock className="w-3 h-3 text-emerald-600" />
                  <span>{store.platformTenure}</span>
                </div>
              )}
            </div>

            {/* Anti-Fraud Verified Shield Banner */}
            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[11px] font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Loja Oficial Verificada Anti-Fraude • BI & Biometria do Titular Validados</span>
              </div>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-200/60 px-2 py-0.5 rounded-md">
                100% Autêntica
              </span>
            </div>
          </div>

          {/* Products from this Store */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-500">
                Catálogo da Loja ({storeProducts.length} artigos)
              </h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Compre Direto com a Loja
              </span>
            </div>

            {storeProducts.length === 0 ? (
              <div className="p-8 text-center bg-neutral-50 rounded-2xl border border-neutral-200 text-neutral-500 text-xs">
                Esta loja ainda não adicionou artigos ao catálogo online. Entre em contacto pelo WhatsApp abaixo!
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {storeProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      onSelectProduct(prod);
                      onClose();
                    }}
                    className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="relative aspect-square bg-neutral-900 overflow-hidden">
                      <img
                        src={prod.photo}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {prod.discountPercent && (
                        <span className="absolute top-2 left-2 text-[10px] font-black bg-amber-400 text-zinc-950 px-1.5 py-0.5 rounded shadow-xs">
                          -{prod.discountPercent}%
                        </span>
                      )}
                    </div>
                    <div className="p-2.5 space-y-1">
                      <h4 className="text-xs font-bold text-neutral-900 line-clamp-1 group-hover:text-rose-600 transition-colors">
                        {prod.name}
                      </h4>
                      <div className="text-xs font-black text-rose-600">
                        {prod.price.toLocaleString('pt-MZ')} MT
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            <span>Falar com a Loja no WhatsApp</span>
          </a>

          <a
            href={`tel:${store.phone}`}
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
