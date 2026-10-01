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
  PackageCheck
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

  // Client Orders pending reviews count for real-time badge
  const clientOrders = useMemo(() => loveShopOrderService.getOrders(), [isClientOrdersOpen, selectedProduct, isRegisterStoreOpen]);
  const pendingReviewsCount = clientOrders.filter((o) => o.status === 'concluido' && !o.hasReviewed).length;

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
    <div className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto px-3 sm:px-4 pt-2 pb-16 sm:pb-20 space-y-3.5 animate-in fade-in duration-200">
      
      {/* 0. Top Access Bar: Entrar como Visitante vs. Entrar como Comerciante (Strictly 100% Width - Zero Overflow Leaks) */}
      <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 border border-neutral-200/90 shadow-2xs space-y-2.5 overflow-hidden">
        {/* Full-width 2-column Segmented Control (Prevents side leaks on mobile) */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-neutral-100/90 rounded-xl sm:rounded-2xl border border-neutral-200/60 w-full">
          <button
            type="button"
            onClick={() => setUserRoleMode('visitante')}
            className={`py-2 px-2 sm:px-3 rounded-lg sm:rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 min-w-0 ${
              userRoleMode === 'visitante'
                ? 'bg-white text-rose-700 shadow-xs font-black'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span className="truncate">Entrar como Visitante</span>
          </button>

          <button
            type="button"
            onClick={() => setUserRoleMode('comerciante')}
            className={`py-2 px-2 sm:px-3 rounded-lg sm:rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 min-w-0 ${
              userRoleMode === 'comerciante'
                ? 'bg-neutral-900 text-white shadow-xs font-black'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate">Entrar como Comerciante</span>
          </button>
        </div>

        {/* Visitante Quick Actions Bar */}
        {userRoleMode === 'visitante' && (
          <div className="flex items-center justify-between gap-2 pt-0.5 animate-in fade-in duration-150">
            <button
              type="button"
              onClick={() => setIsClientOrdersOpen(true)}
              className="relative h-9 px-3.5 bg-neutral-100 hover:bg-rose-50 text-neutral-800 hover:text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-200/80 min-w-0"
              title="Ver meus pedidos"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span className="truncate">Meus Pedidos</span>
              {pendingReviewsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center shrink-0 animate-pulse">
                  {pendingReviewsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsRegisterStoreOpen(true)}
              className="h-9 px-3.5 sm:px-4 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0 ml-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registar Loja</span>
            </button>
          </div>
        )}

        {/* Dedicated Black Merchant Card at Top ("Venda na Love Shop") - Faithful to Image 2 */}
        {userRoleMode === 'comerciante' && (
          <div className="animate-in fade-in duration-200 space-y-2.5">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 text-white rounded-2xl sm:rounded-3xl border border-neutral-800 shadow-md space-y-3">
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-black text-white tracking-tight">
                  Venda na Love Shop
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed max-w-md">
                  Publique o catálogo da sua loja e receba encomendas diretamente no seu WhatsApp.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsRegisterStoreOpen(true)}
                  className="h-10 px-5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Registar Loja</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (stores.length > 0) {
                      setStoreModalInitialTab('pedidos');
                      setSelectedStore(stores[0]);
                    }
                  }}
                  className="h-10 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <PackageCheck className="w-4 h-4 text-emerald-400" />
                  <span>Pedidos Recebidos</span>
                </button>
              </div>
            </div>

            {/* Quick Access to Registered Stores */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-neutral-600 block px-1">
                Suas Lojas Cadastradas & Gestão de Vendas:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {stores.slice(0, 4).map((s) => {
                  const sOrders = loveShopOrderService.getOrdersByStoreId(s.id);
                  const pendingOrders = sOrders.filter((o) => o.status === 'pendente').length;

                  return (
                    <div
                      key={s.id}
                      onClick={() => {
                        setStoreModalInitialTab('pedidos');
                        setSelectedStore(s);
                      }}
                      className="p-2.5 bg-neutral-50 hover:bg-rose-50/50 rounded-xl border border-neutral-200/90 hover:border-rose-300 transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {s.name.charAt(0)}
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold text-neutral-900 group-hover:text-rose-700 truncate">
                            {s.name}
                          </div>
                          <div className="text-[10px] text-neutral-500">
                            {s.city} • {sOrders.length} pedido{sOrders.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {pendingOrders > 0 ? (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md border border-amber-200">
                            {pendingOrders} pendente{pendingOrders > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-[10.5px] font-bold text-rose-600 group-hover:translate-x-0.5 transition-transform">
                            Gerir &rarr;
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      
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
          <h2 className="text-base font-black text-neutral-900">
            Artigos ({filteredProducts.length})
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsClientOrdersOpen(true)}
              className="text-xs font-bold text-neutral-700 hover:text-rose-600 bg-neutral-100 hover:bg-rose-50 px-2.5 py-1 rounded-xl border border-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-rose-600" />
              <span>Meus Pedidos</span>
            </button>

            <button
              onClick={() => setIsRegisterStoreOpen(true)}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
            >
              + Registar Loja
            </button>
          </div>
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

      {/* 5. Faixa do Comerciante */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-850 to-neutral-900 text-white rounded-3xl p-4 sm:p-5 border border-neutral-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-sm sm:text-base font-black text-white">
            Venda na Love Shop
          </h3>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Publique o catálogo da sua loja e receba encomendas diretamente no seu WhatsApp.
          </p>
        </div>

        <button
          onClick={() => setIsRegisterStoreOpen(true)}
          className="h-10 px-5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold rounded-2xl flex items-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Registar Loja</span>
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
        initialTab={storeModalInitialTab}
        onClose={() => {
          setSelectedStore(null);
          setStoreModalInitialTab('catalogo');
        }}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
      />

      {/* Client Orders & Reviews Modal */}
      <LoveShopClientOrdersModal
        isOpen={isClientOrdersOpen}
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
