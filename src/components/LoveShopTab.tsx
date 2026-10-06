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
  Home, 
  Play, 
  ShoppingBag, 
  Star, 
  Search 
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
import { LoveShopClientOrdersModal } from './LoveShopClientOrdersModal';
import { contactUnlockService } from '../services/contactUnlockService';
import { loveShopOrderService } from '../services/loveShopOrderService';

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

  // Products state (Keeps the main screen clean, balanced and never flooded with 15 cards)
  const [products, setProducts] = useState<LoveShopProduct[]>(() => {
    try {
      localStorage.removeItem('onde_dormir_loveshop_custom_products');
    } catch (e) {
      // ignore
    }
    return INITIAL_LOVE_SHOP_PRODUCTS;
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<LoveShopCategoryId>('presentes');
  const [isMoreCategoriesOpen, setIsMoreCategoriesOpen] = useState(false);

  // Modals & Role Mode
  const [userRoleMode, setUserRoleMode] = useState<'visitante' | 'comerciante'>('visitante');
  const [storeModalInitialTab, setStoreModalInitialTab] = useState<'catalogo' | 'pedidos' | 'reputacao'>('catalogo');
  const [isRegisterStoreOpen, setIsRegisterStoreOpen] = useState(false);
  const [isClientOrdersOpen, setIsClientOrdersOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<LoveShopProduct | null>(null);
  const [selectedStore, setSelectedStore] = useState<LoveShopStore | null>(null);
  const [viewAllStores, setViewAllStores] = useState(false);

  // Client & Merchant Orders pending count for real-time badge
  const clientOrders = useMemo(() => loveShopOrderService.getOrders(), [isClientOrdersOpen, selectedProduct, isRegisterStoreOpen]);
  const pendingReviewsCount = clientOrders.filter((o) => o.status === 'concluido' && !o.hasReviewed).length;
  const pendingMerchantOrdersCount = clientOrders.filter((o) => o.status === 'pendente').length;

  // Handle Add Store with its 15 to 25 catalog products (Saved strictly inside store details, NOT on the main screen)
  const handleAddStore = (newStore: LoveShopStore, newProducts?: LoveShopProduct[]) => {
    setStores((prev) => {
      const updated = [newStore, ...prev];
      localStorage.setItem('onde_dormir_loveshop_stores', JSON.stringify(updated.filter((s) => s.id.startsWith('store-'))));
      return updated;
    });

    if (newProducts && newProducts.length > 0) {
      // Save specifically for this store's catalog details
      localStorage.setItem(
        `onde_dormir_store_catalog_${newStore.id}`,
        JSON.stringify(newProducts)
      );
    }
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
    <div className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto px-2.5 sm:px-4 pt-1 sm:pt-3 pb-16 sm:pb-20 space-y-2.5 sm:space-y-3.5 animate-in fade-in duration-200">
      
      {/* 1. Placa Principal "Love Shop" (Cabeçalho do Módulo, sem botões a sobrepor-se no topo) */}
      <LoveShopHeaderBanner
        userRoleMode={userRoleMode}
        onSelectRole={setUserRoleMode}
        onOpenOrders={() => setIsClientOrdersOpen(true)}
        onOpenRegisterStore={() => setIsRegisterStoreOpen(true)}
        pendingReviewsCount={userRoleMode === 'comerciante' ? pendingMerchantOrdersCount : pendingReviewsCount}
      />

      {/* 2. Sticky Search Bar & Category Selector Bar */}
      <div className="sticky top-[48px] sm:top-[56px] z-20 bg-white/95 backdrop-blur-md p-2.5 sm:p-3.5 rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-sm space-y-2">
        {/* Campo de Busca */}
        <div className="w-full">
          <div className="relative w-full shadow-2xs rounded-xl sm:rounded-2xl bg-neutral-50 border border-neutral-200/90 hover:border-neutral-300 transition-colors">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-600 shrink-0" />
            <input
              type="text"
              placeholder="Buscar produtos ou lojas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 sm:h-11 pl-10 pr-9 rounded-xl sm:rounded-2xl bg-transparent text-neutral-900 placeholder:text-neutral-400 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/30 transition-all touch-manipulation"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-neutral-200 hover:bg-neutral-300 text-neutral-600 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                title="Limpar busca"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Category Buttons */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
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
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl sm:rounded-2xl transition-all cursor-pointer touch-manipulation active:scale-95 ${
                  isSelected
                    ? 'bg-rose-50 text-rose-700 border-2 border-rose-400/80 shadow-xs font-black'
                    : 'bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200/80 shadow-2xs font-bold'
                }`}
              >
                <span className="text-lg sm:text-xl mb-0.5">{cat.icon}</span>
                <span className="text-[10.5px] sm:text-xs truncate max-w-full">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
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
          <h2 className="text-base font-black text-neutral-900">
            Artigos ({filteredProducts.length})
          </h2>
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
          /* Balanced 2-Column Dynamic Waterfall - Zero Gaps or Empty Holes */
          <div className="grid grid-cols-2 gap-3 sm:gap-3.5 items-start">
            {/* Left Column (Items 0, 2, 4...) */}
            <div className="flex flex-col gap-3 sm:gap-3.5">
              {filteredProducts.filter((_, i) => i % 2 === 0).map((prod) => {
                const hasVideo = Boolean(prod.videoUrl);
                const isFashionModel = Boolean(
                  prod.id.startsWith('prod-kaftan') ||
                  prod.storeId === 'store-7' ||
                  prod.name.toLowerCase().includes('vestido') ||
                  prod.name.toLowerCase().includes('kaftan') ||
                  prod.name.toLowerCase().includes('boubou')
                );
                const mediaAspectClass = (hasVideo || isFashionModel)
                  ? 'aspect-[9/14]' 
                  : prod.category === 'casamento' || prod.category === 'noivado'
                    ? 'aspect-[4/5]' 
                    : 'aspect-square';
                const photoCount = prod.photos?.length || 1;

                return (
                  <div
                    key={prod.id}
                    onClick={() => setSelectedProduct(prod)}
                    className="bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:border-neutral-300 transition-all cursor-pointer flex flex-col group active:scale-[0.98] touch-manipulation relative"
                  >
                    {/* Product Image/Video Container (Dynamic Vertical Framing) */}
                    <div className={`relative ${mediaAspectClass} bg-neutral-100 overflow-hidden shrink-0 border-b border-neutral-100 flex items-center justify-center`}>
                      {hasVideo ? (
                        <video
                          src={prod.videoUrl}
                          poster={prod.photo}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <img
                          src={prod.photo}
                          alt={prod.name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      )}

                      {/* Top Left: Media Count / Video Indicator (Intuitive Affordance) */}
                      <div className="absolute top-2 left-2 flex items-center gap-1 z-10 pointer-events-none">
                        {hasVideo ? (
                          <div className="w-6 h-6 rounded-full bg-black/60 backdrop-blur-xs text-white flex items-center justify-center shadow-xs">
                            <Play className="w-3 h-3 fill-white text-white ml-0.5" />
                          </div>
                        ) : photoCount > 1 ? (
                          <span className="text-[10px] font-bold bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-md shadow-xs">
                            {photoCount} fotos
                          </span>
                        ) : null}
                      </div>

                      {/* Discount Badge */}
                      {prod.discountPercent && (
                        <div className="absolute top-2 right-2 bg-rose-600 text-white text-[9.5px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
                          -{prod.discountPercent}%
                        </div>
                      )}

                      {/* Bottom Image Subtle Tap Cue */}
                      <div className="absolute bottom-2 inset-x-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <span className="text-[10px] font-bold text-white bg-black/65 backdrop-blur-xs px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                          Ver detalhes
                        </span>
                      </div>
                    </div>

                    {/* Info Container */}
                    <div className="p-2.5 sm:p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Title */}
                        <h3 className="font-bold text-xs sm:text-sm text-neutral-900 line-clamp-2 leading-snug group-hover:text-rose-600 transition-colors">
                          {prod.name}
                        </h3>

                        {/* Store & Location */}
                        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-neutral-500 font-medium mt-1 truncate">
                          <Store className="w-3 h-3 text-rose-600 shrink-0" />
                          <span className="truncate">{prod.storeName}</span>
                          <span className="text-neutral-300">•</span>
                          <span className="shrink-0">{prod.city}</span>
                        </div>
                      </div>

                      {/* Price Row & Action Button */}
                      <div className="pt-2 mt-2 border-t border-neutral-100 flex items-center justify-between gap-1">
                        <div className="min-w-0">
                          <span className="text-xs sm:text-sm font-black text-rose-600 truncate block">
                            {prod.price.toLocaleString('pt-MZ')} MT
                          </span>
                          {prod.originalPrice && (
                            <span className="text-[10px] text-neutral-400 line-through block truncate">
                              {prod.originalPrice.toLocaleString('pt-MZ')} MT
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <span className="hidden sm:inline-block text-[10.5px] font-bold text-neutral-400 group-hover:text-rose-600 transition-colors pr-0.5">
                            Ver &rarr;
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              loveShopOrderService.createOrderOnContact(prod);
                              const allowed = contactUnlockService.triggerContactAttempt(
                                {
                                  id: prod.storeId || prod.id,
                                  name: `${prod.name} (${prod.storeName})`,
                                  photo: prod.photo,
                                  whatsapp: prod.whatsapp,
                                  phone: prod.phone,
                                  module: 'loveshop',
                                  moduleLabel: 'Love Shop',
                                  unlockFee: 1000,
                                },
                                prod.isContactUnlocked
                              );
                              if (!allowed) {
                                return;
                              }
                              const msg = encodeURIComponent(
                                `Olá! Vi o produto "${prod.name}" (${prod.price.toLocaleString('pt-MZ')} MT) na Love Shop do Onde Dormir Moçambique e gostaria de encomendar.`
                              );
                              window.open(`https://wa.me/${prod.whatsapp}?text=${msg}`, '_blank');
                            }}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer touch-manipulation shrink-0"
                            title="Encomendar no WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column (Items 1, 3, 5...) */}
            <div className="flex flex-col gap-3 sm:gap-3.5">
              {filteredProducts.filter((_, i) => i % 2 !== 0).map((prod) => {
                const hasVideo = Boolean(prod.videoUrl);
                const isFashionModel = Boolean(
                  prod.id.startsWith('prod-kaftan') ||
                  prod.storeId === 'store-7' ||
                  prod.name.toLowerCase().includes('vestido') ||
                  prod.name.toLowerCase().includes('kaftan') ||
                  prod.name.toLowerCase().includes('boubou')
                );
                const mediaAspectClass = (hasVideo || isFashionModel)
                  ? 'aspect-[9/14]' 
                  : prod.category === 'casamento' || prod.category === 'noivado'
                    ? 'aspect-[4/5]' 
                    : 'aspect-square';
                const photoCount = prod.photos?.length || 1;

                return (
                  <div
                    key={prod.id}
                    onClick={() => setSelectedProduct(prod)}
                    className="bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:border-neutral-300 transition-all cursor-pointer flex flex-col group active:scale-[0.98] touch-manipulation relative"
                  >
                    {/* Product Image/Video Container (Dynamic Vertical Framing) */}
                    <div className={`relative ${mediaAspectClass} bg-neutral-100 overflow-hidden shrink-0 border-b border-neutral-100 flex items-center justify-center`}>
                      {hasVideo ? (
                        <video
                          src={prod.videoUrl}
                          poster={prod.photo}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <img
                          src={prod.photo}
                          alt={prod.name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      )}

                      {/* Top Left: Media Count / Video Indicator (Intuitive Affordance) */}
                      <div className="absolute top-2 left-2 flex items-center gap-1 z-10 pointer-events-none">
                        {hasVideo ? (
                          <div className="w-6 h-6 rounded-full bg-black/60 backdrop-blur-xs text-white flex items-center justify-center shadow-xs">
                            <Play className="w-3 h-3 fill-white text-white ml-0.5" />
                          </div>
                        ) : photoCount > 1 ? (
                          <span className="text-[10px] font-bold bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-md shadow-xs">
                            {photoCount} fotos
                          </span>
                        ) : null}
                      </div>

                      {/* Discount Badge */}
                      {prod.discountPercent && (
                        <div className="absolute top-2 right-2 bg-rose-600 text-white text-[9.5px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
                          -{prod.discountPercent}%
                        </div>
                      )}

                      {/* Bottom Image Subtle Tap Cue */}
                      <div className="absolute bottom-2 inset-x-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <span className="text-[10px] font-bold text-white bg-black/65 backdrop-blur-xs px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                          Ver detalhes
                        </span>
                      </div>
                    </div>

                    {/* Info Container */}
                    <div className="p-2.5 sm:p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Title */}
                        <h3 className="font-bold text-xs sm:text-sm text-neutral-900 line-clamp-2 leading-snug group-hover:text-rose-600 transition-colors">
                          {prod.name}
                        </h3>

                        {/* Store & Location */}
                        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-neutral-500 font-medium mt-1 truncate">
                          <Store className="w-3 h-3 text-rose-600 shrink-0" />
                          <span className="truncate">{prod.storeName}</span>
                          <span className="text-neutral-300">•</span>
                          <span className="shrink-0">{prod.city}</span>
                        </div>
                      </div>

                      {/* Price Row & Action Button */}
                      <div className="pt-2 mt-2 border-t border-neutral-100 flex items-center justify-between gap-1">
                        <div className="min-w-0">
                          <span className="text-xs sm:text-sm font-black text-rose-600 truncate block">
                            {prod.price.toLocaleString('pt-MZ')} MT
                          </span>
                          {prod.originalPrice && (
                            <span className="text-[10px] text-neutral-400 line-through block truncate">
                              {prod.originalPrice.toLocaleString('pt-MZ')} MT
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <span className="hidden sm:inline-block text-[10.5px] font-bold text-neutral-400 group-hover:text-rose-600 transition-colors pr-0.5">
                            Ver &rarr;
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              loveShopOrderService.createOrderOnContact(prod);
                              const allowed = contactUnlockService.triggerContactAttempt(
                                {
                                  id: prod.storeId || prod.id,
                                  name: `${prod.name} (${prod.storeName})`,
                                  photo: prod.photo,
                                  whatsapp: prod.whatsapp,
                                  phone: prod.phone,
                                  module: 'loveshop',
                                  moduleLabel: 'Love Shop',
                                  unlockFee: 1000,
                                },
                                prod.isContactUnlocked
                              );
                              if (!allowed) {
                                return;
                              }
                              const msg = encodeURIComponent(
                                `Olá! Vi o produto "${prod.name}" (${prod.price.toLocaleString('pt-MZ')} MT) na Love Shop do Onde Dormir Moçambique e gostaria de encomendar.`
                              );
                              window.open(`https://wa.me/${prod.whatsapp}?text=${msg}`, '_blank');
                            }}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer touch-manipulation shrink-0"
                            title="Encomendar no WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
        initialTab={storeModalInitialTab}
        onClose={() => {
          setSelectedStore(null);
          setStoreModalInitialTab('catalogo');
        }}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
      />

      {/* Client & Merchant Orders Modal */}
      <LoveShopClientOrdersModal
        isOpen={isClientOrdersOpen}
        initialTab={userRoleMode === 'comerciante' ? 'vendas' : 'compras'}
        onClose={() => setIsClientOrdersOpen(false)}
        onSelectProduct={(prodId) => {
          const found = products.find((p) => p.id === prodId);
          if (found) setSelectedProduct(found);
        }}
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
