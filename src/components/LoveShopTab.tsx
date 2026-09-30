import React, { useState, useMemo } from 'react';
import { 
  ChevronRight, 
  Store, 
  CheckCircle2, 
  MessageCircle, 
  Plus, 
  MapPin, 
  Clock,
  Gift,
  ArrowLeft,
  Home
} from 'lucide-react';
import { 
  LoveShopStore, 
  LoveShopProduct, 
  LoveShopCategoryId, 
  UserLocationState 
} from '../types';
import { 
  INITIAL_LOVE_SHOP_STORES, 
  INITIAL_LOVE_SHOP_PRODUCTS 
} from '../data/loveShopData';
import { LoveShopHeaderBanner } from './LoveShopHeaderBanner';
import { LoveShopStoreCard } from './LoveShopStoreCard';
import { RegisterLoveShopStoreModal } from './RegisterLoveShopStoreModal';
import { LoveShopProductDetailModal } from './LoveShopProductDetailModal';
import { LoveShopStoreModal } from './LoveShopStoreModal';
import { LoveShopPromoCatMascot } from './LoveShopPromoCatMascot';

interface LoveShopTabProps {
  onBackToHome?: () => void;
  userLocation: UserLocationState;
  onOpenLocationModal?: () => void;
  onSelectProvince?: (prov: string) => void;
  onSelectAllMozambique?: () => void;
}

// 4 Clean Categories strictly per Image 3 (Pra Ela, Pra Ele, Surpresas removed)
const CLEAN_CATEGORIES: { id: LoveShopCategoryId; label: string; icon: string }[] = [
  { id: 'presentes', label: 'Presentes', icon: '🎁' },
  { id: 'noivado', label: 'Noivado', icon: '💍' },
  { id: 'casamento', label: 'Casamento', icon: '💒' },
  { id: 'todos', label: 'Mais', icon: '⋯' },
];

export const LoveShopTab: React.FC<LoveShopTabProps> = ({
  onBackToHome,
  userLocation,
  onOpenLocationModal,
}) => {
  // Persistence for user added stores
  const [stores, setStores] = useState<LoveShopStore[]>(() => {
    const saved = localStorage.getItem('onde_dormir_loveshop_stores');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...parsed, ...INITIAL_LOVE_SHOP_STORES];
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_LOVE_SHOP_STORES;
  });

  const [products] = useState<LoveShopProduct[]>(INITIAL_LOVE_SHOP_PRODUCTS);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<LoveShopCategoryId>('presentes');
  const [isMoreCategoriesOpen, setIsMoreCategoriesOpen] = useState(false);

  // Modals
  const [isRegisterStoreOpen, setIsRegisterStoreOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<LoveShopProduct | null>(null);
  const [selectedStore, setSelectedStore] = useState<LoveShopStore | null>(null);
  const [viewAllStores, setViewAllStores] = useState(false);

  // Handle Add Store
  const handleAddStore = (newStore: LoveShopStore) => {
    setStores((prev) => {
      const updated = [newStore, ...prev];
      localStorage.setItem('onde_dormir_loveshop_stores', JSON.stringify(updated.filter((s) => s.id.startsWith('store-'))));
      return updated;
    });
  };

  // Filtered Stores
  const filteredStores = useMemo(() => {
    if (!searchQuery.trim()) return stores;
    const q = searchQuery.toLowerCase();
    return stores.filter((store) => {
      const matchName = store.name.toLowerCase().includes(q);
      const matchSlogan = store.slogan.toLowerCase().includes(q);
      const matchCity = store.city.toLowerCase().includes(q);
      return matchName || matchSlogan || matchCity;
    });
  }, [stores, searchQuery]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      if (selectedCategory !== 'todos' && prod.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = prod.name.toLowerCase().includes(q);
        const matchDesc = prod.description.toLowerCase().includes(q);
        const matchStore = prod.storeName.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchStore) return false;
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 pt-2 pb-28 space-y-3.5 animate-in fade-in duration-200">
      
      {/* 1. Crimson Hero Banner with Search Bar (Exact match to Image 3) */}
      <LoveShopHeaderBanner
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Category Buttons (Exact match to Image 3 - Pra Ela, Pra Ele, Surpresas removed) */}
      <div className="grid grid-cols-4 gap-2 px-1">
        {CLEAN_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                if (cat.id === 'todos') {
                  setIsMoreCategoriesOpen(!isMoreCategoriesOpen);
                  setSelectedCategory('todos');
                } else {
                  setSelectedCategory(cat.id);
                  setIsMoreCategoriesOpen(false);
                }
              }}
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl transition-all cursor-pointer touch-manipulation active:scale-95 ${
                isSelected
                  ? 'bg-rose-50 text-rose-700 border-2 border-rose-400/80 shadow-xs font-black'
                  : 'bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200/80 shadow-2xs font-bold'
              }`}
            >
              <span className="text-xl sm:text-2xl mb-1">{cat.icon}</span>
              <span className="text-[11px] sm:text-xs truncate max-w-full">
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Extra categories sheet when "Mais" is tapped */}
      {isMoreCategoriesOpen && (
        <div className="bg-white p-3 rounded-2xl border border-rose-200 shadow-sm animate-in fade-in duration-150 space-y-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-rose-700 block">
            Mais Artigos & Acessórios de Moda:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'aliancas' as LoveShopCategoryId, label: 'Alianças & Anéis', icon: '💎' },
              { id: 'relogios' as LoveShopCategoryId, label: 'Relógios & Fios', icon: '⌚' },
              { id: 'brincos' as LoveShopCategoryId, label: 'Brincos', icon: '✨' },
              { id: 'sapatos' as LoveShopCategoryId, label: 'Sapatos de Qualidade', icon: '👠' },
              { id: 'malas' as LoveShopCategoryId, label: 'Malas & Bolsas', icon: '👜' },
            ].map((subCat) => (
              <button
                key={subCat.id}
                onClick={() => {
                  setSelectedCategory(subCat.id);
                  setIsMoreCategoriesOpen(false);
                }}
                className="h-8 px-2.5 rounded-xl bg-neutral-100 hover:bg-rose-100 text-neutral-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <span>{subCat.icon}</span>
                <span>{subCat.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. 🔥 Lojas em Destaque Section (Exact match to Image 3) */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="text-base">🔥</span>
            <h2 className="text-base sm:text-lg font-black text-neutral-900">
              Lojas em destaque
            </h2>
          </div>
          <button
            onClick={() => setViewAllStores(!viewAllStores)}
            className="text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors flex items-center gap-0.5 cursor-pointer"
          >
            <span>{viewAllStores ? 'Ver menos' : 'Ver todas'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Store Cards List (Organized exactly per Image 3, with zero stars) */}
        <div className="space-y-2.5">
          {(viewAllStores ? filteredStores : filteredStores.slice(0, 4)).map((store) => (
            <LoveShopStoreCard
              key={store.id}
              store={store}
              onClick={() => setSelectedStore(store)}
            />
          ))}
        </div>
      </div>

      {/* 4. Product Showcase Catalog Grid */}
      <div className="space-y-3 pt-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-base font-black text-neutral-900">
              Artigos da Categoria ({filteredProducts.length})
            </h2>
            <p className="text-[11px] text-neutral-500">
              Acesso livre para compradores • Contacto direto com a loja
            </p>
          </div>

          <button
            onClick={() => setIsRegisterStoreOpen(true)}
            className="text-xs font-bold text-rose-600 hover:text-rose-800 underline cursor-pointer"
          >
            + Registar Minha Loja
          </button>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-neutral-200/80 space-y-2">
            <Gift className="w-8 h-8 text-neutral-400 mx-auto" />
            <h3 className="text-xs font-bold text-neutral-800">
              Nenhum artigo encontrado nesta seleção
            </h3>
            <button
              onClick={() => {
                setSelectedCategory('todos');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-rose-600 underline cursor-pointer"
            >
              Ver todos os artigos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => setSelectedProduct(prod)}
                className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                {/* Photo */}
                <div className="relative aspect-square bg-neutral-900 overflow-hidden">
                  <img
                    src={prod.photo}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {prod.discountPercent && (
                    <span className="absolute top-2 left-2 text-[10px] font-black bg-amber-400 text-zinc-950 px-1.5 py-0.5 rounded shadow-xs">
                      -{prod.discountPercent}%
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-2.5 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-500">
                      <Store className="w-2.5 h-2.5 text-rose-600 shrink-0" />
                      <span className="truncate">{prod.storeName}</span>
                    </div>

                    <h3 className="font-bold text-xs text-neutral-900 line-clamp-2 leading-snug group-hover:text-rose-600 transition-colors mt-0.5">
                      {prod.name}
                    </h3>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-1 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs sm:text-sm font-black text-rose-600 block">
                        {prod.price.toLocaleString('pt-MZ')} MT
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const msg = encodeURIComponent(
                          `Olá! Vi o produto "${prod.name}" (${prod.price.toLocaleString('pt-MZ')} MT) na Love Shop do Onde Dormir Moçambique e gostaria de encomendar.`
                        );
                        window.open(`https://wa.me/${prod.whatsapp}?text=${msg}`, '_blank');
                      }}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                      title="Comprar no WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Vendedores & Lojistas Registration Banner */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-850 text-white rounded-3xl p-4 sm:p-5 border border-neutral-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-rose-400 text-[10px] font-bold uppercase tracking-wider">
            <Store className="w-3.5 h-3.5" />
            <span>Área do Comerciante Love Shop</span>
          </div>
          <h3 className="text-sm sm:text-base font-black text-white mt-0.5">
            Tem uma loja de presentes, joias ou moda?
          </h3>
          <p className="text-[11px] text-neutral-300 mt-0.5">
            Registo comercial com taxa fixa de <strong>1.000 MT/mês</strong> e fatura emitida no sistema.
          </p>
        </div>

        <button
          onClick={() => setIsRegisterStoreOpen(true)}
          className="h-10 px-4 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold rounded-2xl flex items-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Registar Minha Loja</span>
        </button>
      </div>

      {/* Modals */}
      <RegisterLoveShopStoreModal
        isOpen={isRegisterStoreOpen}
        onClose={() => setIsRegisterStoreOpen(false)}
        onAddStore={handleAddStore}
        defaultCity={userLocation.city || 'Maputo'}
        defaultProvince={userLocation.province || 'Maputo Cidade'}
      />

      <LoveShopProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSelectStore={(storeId) => {
          const found = stores.find((s) => s.id === storeId);
          if (found) setSelectedStore(found);
        }}
      />

      <LoveShopStoreModal
        store={selectedStore}
        products={products}
        isOpen={!!selectedStore}
        onClose={() => setSelectedStore(null)}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
      />

      {/* Floating Waving Cat Mascot in Corner for Promotions */}
      <LoveShopPromoCatMascot
        onSelectPromoStore={(storeId) => {
          const s = stores.find((x) => x.id === storeId);
          if (s) setSelectedStore(s);
        }}
      />

    </div>
  );
};
