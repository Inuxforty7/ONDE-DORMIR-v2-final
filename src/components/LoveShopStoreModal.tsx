import React, { useState } from 'react';
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
  Sparkles, 
  Plus, 
  Trash2, 
  Upload, 
  AlertCircle, 
  Play,
  PackageCheck,
  XCircle,
  Flag,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import { LoveShopStore, LoveShopProduct, LoveShopOrder, LoveShopReview } from '../types';
import { DEFAULT_AFRO_CHIC_CATALOG } from '../data/loveShopData';
import { loveShopOrderService } from '../services/loveShopOrderService';
import { LoveShopReportReviewModal } from './LoveShopReportReviewModal';

interface LoveShopStoreModalProps {
  store: LoveShopStore | null;
  products: LoveShopProduct[];
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: LoveShopProduct) => void;
  initialTab?: 'catalogo' | 'pedidos' | 'reputacao';
}

export const LoveShopStoreModal: React.FC<LoveShopStoreModalProps> = ({
  store,
  products,
  isOpen,
  onClose,
  onSelectProduct,
  initialTab = 'catalogo',
}) => {
  // Active Tab: 'catalogo' | 'pedidos' | 'reputacao'
  const [activeStoreTab, setActiveStoreTab] = useState<'catalogo' | 'pedidos' | 'reputacao'>(initialTab);

  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveStoreTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Modal states for adding products and upsell upgrade
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedReviewToReport, setSelectedReviewToReport] = useState<LoveShopReview | null>(null);

  // Orders and reviews state
  const [storeOrders, setStoreOrders] = useState<LoveShopOrder[]>(() => 
    store ? loveShopOrderService.getOrdersByStoreId(store.id) : []
  );
  const [storeReviews, setStoreReviews] = useState<LoveShopReview[]>(() =>
    store ? loveShopOrderService.getReviewsByStoreId(store.id) : []
  );

  const refreshOrdersAndReviews = () => {
    if (store) {
      setStoreOrders(loveShopOrderService.getOrdersByStoreId(store.id));
      setStoreReviews(loveShopOrderService.getReviewsByStoreId(store.id));
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: 'concluido' | 'cancelado') => {
    loveShopOrderService.updateOrderStatus(orderId, status);
    refreshOrdersAndReviews();
  };

  // New product form state (1 to 4 photo slides + 1 optional video)
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState<number | ''>(1200);
  const [newProdCategory, setNewProdCategory] = useState<'presentes' | 'noivado' | 'casamento'>('presentes');
  const [newProdPhotos, setNewProdPhotos] = useState<string[]>([]);
  const [newProdVideoUrl, setNewProdVideoUrl] = useState('');
  const [newProdDescription, setNewProdDescription] = useState('');

  // Store custom products in state initialized from localStorage
  const [customCatalog, setCustomCatalog] = useState<LoveShopProduct[]>(() => {
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
    if (store.id === 'store-7') {
      return DEFAULT_AFRO_CHIC_CATALOG;
    }
    return products.filter((p) => p.storeId === store.id);
  });

  // Re-sync when store changes
  React.useEffect(() => {
    if (!store) return;
    const saved = localStorage.getItem(`onde_dormir_store_catalog_${store.id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCustomCatalog(parsed);
          return;
        }
      } catch (e) {
        // fallback
      }
    }
    if (store.id === 'store-7') {
      setCustomCatalog(DEFAULT_AFRO_CHIC_CATALOG);
      return;
    }
    setCustomCatalog(products.filter((p) => p.storeId === store.id));
    setStoreOrders(loveShopOrderService.getOrdersByStoreId(store.id));
    setStoreReviews(loveShopOrderService.getReviewsByStoreId(store.id));
  }, [store?.id, products]);

  if (!isOpen || !store) return null;

  const storeProducts = customCatalog;
  const storeReputation = loveShopOrderService.calculateStoreReputation(store.id);

  // Handle Photo Slide Change (Index 0 to 3)
  const handleUpdateSlidePhoto = (index: number, url: string) => {
    setNewProdPhotos((prev) => {
      const next = [...prev];
      if (url && url.trim().length > 0) {
        next[index] = url.trim();
      } else {
        next.splice(index, 1);
      }
      return next.filter(Boolean);
    });
  };

  const handleOpenAddProduct = () => {
    if (storeProducts.length >= 25) {
      setShowUpgradeModal(true);
      return;
    }
    setNewProdName('');
    setNewProdPrice(1200);
    setNewProdPhotos([]);
    setNewProdVideoUrl('');
    setNewProdDescription('');
    setIsAddProductOpen(true);
  };

  // Add new product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) return;

    const newProd: LoveShopProduct = {
      id: `prod-${store.id}-${Date.now()}`,
      storeId: store.id,
      storeName: store.name,
      storeVerified: store.verified,
      name: newProdName.trim(),
      price: Number(newProdPrice),
      description: newProdDescription.trim() || `${newProdName} disponível na loja ${store.name}.`,
      category: newProdCategory,
      categoryLabel: newProdCategory === 'presentes' ? 'Vestidos & Presentes' : newProdCategory === 'noivado' ? 'Noivado' : 'Casamento',
      photo: newProdPhotos[0] || 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1790850247/WhatsApp_Image_2026-10-01_at_09.57.42_pazcz5.jpg',
      photos: newProdPhotos.length > 0 ? newProdPhotos : ['https://res.cloudinary.com/dwlfwnbt0/image/upload/v1790850247/WhatsApp_Image_2026-10-01_at_09.57.42_pazcz5.jpg'],
      videoUrl: newProdVideoUrl.trim() || undefined,
      videoDuration: newProdVideoUrl.trim() ? '0:35 min' : undefined,
      inStock: true,
      city: store.city,
      province: store.province,
      phone: store.phone,
      whatsapp: store.whatsapp,
      registeredAt: new Date().toISOString().split('T')[0],
      platformTenure: 'Novo Artigo'
    };

    const updated = [...storeProducts, newProd];
    setCustomCatalog(updated);
    localStorage.setItem(`onde_dormir_store_catalog_${store.id}`, JSON.stringify(updated));
    setIsAddProductOpen(false);
  };

  // Remove product from store
  const handleRemoveProduct = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = storeProducts.filter((p) => p.id !== productId);
    setCustomCatalog(updated);
    localStorage.setItem(`onde_dormir_store_catalog_${store.id}`, JSON.stringify(updated));
  };

  const whatsappMessage = encodeURIComponent(
    `Olá ${store.name}! Encontrei a vossa loja no módulo Love Shop do Onde Dormir Moçambique e gostaria de encomendar.`
  );
  const whatsappUrl = `https://wa.me/${store.whatsapp}?text=${whatsappMessage}`;

  return (
    <>
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
                    <span>{storeReputation.count > 0 ? storeReputation.rating.toFixed(1) : store.rating.toFixed(1)}</span>
                    <span className="text-[11px] text-neutral-300 font-normal">({storeReputation.count || store.reviewsCount})</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-300 block">
                    🛍️ {store.salesCount.toLocaleString('pt-MZ')} vendas
                  </span>
                </div>
              </div>
            </div>

            {/* Store Navigation Tabs (Catálogo, Pedidos & Vendas, Reputação) */}
            <div className="flex items-center border-b border-neutral-200 bg-white sticky top-0 z-10 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveStoreTab('catalogo')}
                className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeStoreTab === 'catalogo'
                    ? 'border-rose-600 text-rose-700 bg-rose-50/50'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Catálogo ({storeProducts.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveStoreTab('pedidos')}
                className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeStoreTab === 'pedidos'
                    ? 'border-rose-600 text-rose-700 bg-rose-50/50'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <PackageCheck className="w-3.5 h-3.5" />
                <span>Gestão de Pedidos ({storeOrders.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveStoreTab('reputacao')}
                className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeStoreTab === 'reputacao'
                    ? 'border-rose-600 text-rose-700 bg-rose-50/50'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                <span>Reputação</span>
              </button>
            </div>

            {/* TAB 1: CATÁLOGO */}
            {activeStoreTab === 'catalogo' && (
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-neutral-500">
                      Artigos em Vitrine ({storeProducts.length})
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleOpenAddProduct}
                      className="h-8 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Adicionar Artigo</span>
                    </button>
                  </div>
                </div>

                {storeProducts.length >= 25 && (
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-300 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-amber-950 font-bold">
                      <span>👑</span>
                      <span>Limite de 25 artigos atingido.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowUpgradeModal(true)}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-black cursor-pointer shadow-2xs"
                    >
                      Upgrade &rarr;
                    </button>
                  </div>
                )}

                {storeProducts.length === 0 ? (
                  <div className="p-8 text-center bg-neutral-50 rounded-2xl border border-neutral-200 text-neutral-500 text-xs">
                    Nenhum artigo adicionado ainda.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 items-start">
                    {/* Left Column */}
                    <div className="flex flex-col gap-3">
                      {storeProducts.filter((_, i) => i % 2 === 0).map((prod) => {
                        const hasVideo = Boolean(prod.videoUrl);
                        const isFashionModel = Boolean(
                          prod.id.startsWith('prod-kaftan') ||
                          prod.storeId === 'store-7' ||
                          prod.name.toLowerCase().includes('vestido') ||
                          prod.name.toLowerCase().includes('kaftan') ||
                          prod.name.toLowerCase().includes('boubou')
                        );
                        const mediaAspectClass = (hasVideo || isFashionModel) ? 'aspect-[9/14]' : 'aspect-[4/5]';

                        return (
                          <div
                            key={prod.id}
                            onClick={() => {
                              onSelectProduct(prod);
                              onClose();
                            }}
                            className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col group relative"
                          >
                            <div className={`relative ${mediaAspectClass} bg-neutral-100 overflow-hidden`}>
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
                                />
                              )}
                              
                              {/* Video indicator if product has video (No Text) */}
                              {hasVideo && (
                                <div className="absolute bottom-2 left-2 w-6 h-6 rounded-full bg-black/60 backdrop-blur-xs text-white flex items-center justify-center shadow-md">
                                  <Play className="w-3 h-3 fill-white text-white ml-0.5" />
                                </div>
                              )}

                              {/* Remove button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveProduct(prod.id, e);
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer shadow-sm"
                                title="Remover artigo"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
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
                        );
                      })}
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-3">
                      {storeProducts.filter((_, i) => i % 2 !== 0).map((prod) => {
                        const hasVideo = Boolean(prod.videoUrl);
                        const isFashionModel = Boolean(
                          prod.id.startsWith('prod-kaftan') ||
                          prod.storeId === 'store-7' ||
                          prod.name.toLowerCase().includes('vestido') ||
                          prod.name.toLowerCase().includes('kaftan') ||
                          prod.name.toLowerCase().includes('boubou')
                        );
                        const mediaAspectClass = (hasVideo || isFashionModel) ? 'aspect-[9/14]' : 'aspect-[4/5]';

                        return (
                          <div
                            key={prod.id}
                            onClick={() => {
                              onSelectProduct(prod);
                              onClose();
                            }}
                            className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col group relative"
                          >
                            <div className={`relative ${mediaAspectClass} bg-neutral-100 overflow-hidden`}>
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
                                />
                              )}
                              
                              {/* Video indicator if product has video (No Text) */}
                              {hasVideo && (
                                <div className="absolute bottom-2 left-2 w-6 h-6 rounded-full bg-black/60 backdrop-blur-xs text-white flex items-center justify-center shadow-md">
                                  <Play className="w-3 h-3 fill-white text-white ml-0.5" />
                                </div>
                              )}

                              {/* Remove button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveProduct(prod.id, e);
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer shadow-sm"
                                title="Remover artigo"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
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
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: GESTÃO DE PEDIDOS RECEBIDOS */}
            {activeStoreTab === 'pedidos' && (
              <div className="p-4 space-y-3.5">
                <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1 text-xs text-neutral-600">
                  <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Painel de Controlo do Vendedor</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Quando o cliente contacta via WhatsApp, o sistema cria o pedido. Ao concluir a venda, clique em <strong>"Marcar como Concluído"</strong> para libertar a avaliação verificada.
                  </p>
                </div>

                {storeOrders.length === 0 ? (
                  <div className="p-8 text-center bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-500">
                    Nenhum pedido registado para esta loja ainda.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {storeOrders.map((order) => {
                      const isPending = order.status === 'pendente';
                      const isCompleted = order.status === 'concluido';
                      const isCancelled = order.status === 'cancelado';

                      return (
                        <div
                          key={order.id}
                          className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3"
                        >
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="font-mono font-bold text-neutral-800">
                              {order.id}
                            </span>
                            {isPending && (
                              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                                🟡 Negociação Pendente
                              </span>
                            )}
                            {isCompleted && (
                              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                                🟢 Venda Concluída
                              </span>
                            )}
                            {isCancelled && (
                              <span className="text-[10px] font-bold bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-md">
                                🔴 Cancelado
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <img
                              src={order.productPhoto}
                              alt={order.productName}
                              className="w-12 h-12 rounded-xl object-cover border border-neutral-200 shrink-0"
                            />
                            <div className="min-w-0 flex-1 space-y-0.5 text-xs">
                              <h4 className="font-bold text-neutral-900 truncate">
                                {order.productName}
                              </h4>
                              <div className="text-neutral-500 text-[11px]">
                                Cliente: <strong>{order.clientName}</strong> ({order.clientPhone || 'WhatsApp'})
                              </div>
                              <div className="text-rose-600 font-black text-xs">
                                {order.productPrice.toLocaleString('pt-MZ')} MT • Data: {order.createdAt}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons for Seller */}
                          <div className="pt-2 border-t border-neutral-200/80 flex items-center justify-end gap-2">
                            {isPending && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateOrderStatus(order.id, 'cancelado')}
                                  className="h-8 px-3 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  <XCircle className="w-3.5 h-3.5 text-red-500" />
                                  <span>Cancelar</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateOrderStatus(order.id, 'concluido')}
                                  className="h-8 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer flex items-center gap-1"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Marcar como Concluído</span>
                                </button>
                              </>
                            )}

                            {isCompleted && (
                              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                                ✅ Venda Fechada • {order.hasReviewed ? 'Cliente Avaliou ⭐' : 'Avaliação Libertada'}
                              </span>
                            )}

                            {isCancelled && (
                              <span className="text-[11px] font-bold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-lg">
                                ❌ Contacto Encerrado
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: REPUTAÇÃO INTELIGENTE & AVALIAÇÕES */}
            {activeStoreTab === 'reputacao' && (
              <div className="p-4 space-y-4">
                {/* Store Reputation Breakdown */}
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-neutral-500">
                        Reputação Global da Loja
                      </h4>
                      <p className="text-[11px] text-neutral-500">
                        Calculada com base no Atendimento, Entrega, Recomendação e Satisfação
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-rose-600 flex items-center gap-1 justify-end">
                        <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                        <span>{storeReputation.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400">
                        {storeReputation.count} avaliações verificadas
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-200 text-xs">
                    <div className="p-2 bg-white rounded-xl border border-neutral-100">
                      <span className="text-neutral-500 block text-[10.5px]">Atendimento</span>
                      <strong className="text-neutral-900 font-black">{storeReputation.breakdown.customerService.toFixed(1)} ⭐</strong>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-neutral-100">
                      <span className="text-neutral-500 block text-[10.5px]">Tempo de Entrega</span>
                      <strong className="text-neutral-900 font-black">{storeReputation.breakdown.deliverySpeed.toFixed(1)} ⭐</strong>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-neutral-100">
                      <span className="text-neutral-500 block text-[10.5px]">Recomendação</span>
                      <strong className="text-neutral-900 font-black">{storeReputation.breakdown.recommendation.toFixed(1)} ⭐</strong>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-neutral-100">
                      <span className="text-neutral-500 block text-[10.5px]">Satisfação Geral</span>
                      <strong className="text-neutral-900 font-black">{storeReputation.breakdown.overallSatisfaction.toFixed(1)} ⭐</strong>
                    </div>
                  </div>
                </div>

                {/* Reviews List with Report Button */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-neutral-500">
                    Avaliações de Clientes Verificados ({storeReviews.length})
                  </h4>

                  {storeReviews.length === 0 ? (
                    <div className="p-6 text-center bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-500">
                      Nenhuma avaliação verificada registada ainda.
                    </div>
                  ) : (
                    storeReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-3.5 bg-white rounded-2xl border border-neutral-200 space-y-2 text-xs shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-neutral-900">{rev.userName}</span>
                            <span className="text-neutral-400 text-[11px] ml-1.5">• {rev.userCity} ({rev.date})</span>
                          </div>
                          <div className="flex items-center gap-1 font-black text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{rev.storeRatingAverage.toFixed(1)}</span>
                          </div>
                        </div>

                        {rev.productName && (
                          <div className="text-[11px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md inline-block font-semibold">
                            Artigo: {rev.productName} • Qualidade: {rev.productQualityRating} ⭐
                          </div>
                        )}

                        {rev.comment && (
                          <p className="text-neutral-700 leading-relaxed text-xs">
                            "{rev.comment}"
                          </p>
                        )}

                        {/* Report review button for merchant */}
                        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Compra Verificada (Pedido: {rev.orderId})
                          </span>

                          {rev.isReported ? (
                            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">
                              🚩 Em Análise
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setSelectedReviewToReport(rev)}
                              className="text-neutral-400 hover:text-red-600 transition-colors flex items-center gap-1 font-semibold cursor-pointer"
                              title="Denunciar se não foi seu cliente ou avaliação fraudulenta"
                            >
                              <Flag className="w-3 h-3" />
                              <span>Denunciar</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
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

        {/* Add Product Modal (1 to 4 Slides + 1 Optional Video) */}
        {isAddProductOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white w-full max-w-lg rounded-3xl p-5 shadow-2xl border border-neutral-200 space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <h3 className="text-sm font-black text-neutral-900">
                  + Novo Artigo ({storeProducts.length + 1}/25)
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                      Nome do Artigo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Vestido Kaftan Tie-Dye com Lenço"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-neutral-300 text-xs font-bold focus:border-rose-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                      Preço (MT) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="1200"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value ? Number(e.target.value) : '')}
                      className="w-full h-10 px-3 rounded-xl border border-neutral-300 text-xs font-bold text-rose-600 focus:border-rose-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 4 Photo Slides (Flexible 1 to 4) */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-800 block">
                    Fotografias (até 4 slides)
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[0, 1, 2, 3].map((sIdx) => {
                      const photo = newProdPhotos[sIdx];
                      return (
                        <div
                          key={sIdx}
                          className="p-2 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col items-center justify-between min-h-[110px]"
                        >
                          <span className="text-[9px] font-bold uppercase text-neutral-500 mb-1">
                            Slide {sIdx + 1} {sIdx === 0 && '• Capa'}
                          </span>

                          {photo ? (
                            <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-neutral-200">
                              <img src={photo} alt={`Slide ${sIdx + 1}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => handleUpdateSlidePhoto(sIdx, '')}
                                className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <label className="cursor-pointer flex flex-col items-center justify-center p-2 w-full flex-1 border border-dashed border-neutral-300 rounded-lg hover:bg-rose-50/50 transition-colors">
                              <Upload className="w-4 h-4 text-neutral-400 mb-0.5" />
                              <span className="text-[10px] font-semibold text-neutral-600">+ Slide {sIdx + 1}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) {
                                    const r = new FileReader();
                                    r.onload = (ev) => handleUpdateSlidePhoto(sIdx, ev.target?.result as string);
                                    r.readAsDataURL(f);
                                  }
                                }}
                              />
                            </label>
                          )}

                          <input
                            type="text"
                            placeholder="Ou link URL"
                            value={photo || ''}
                            onChange={(e) => handleUpdateSlidePhoto(sIdx, e.target.value)}
                            className="w-full h-6 px-1.5 mt-1.5 text-[9px] border border-neutral-200 rounded text-neutral-600 focus:outline-none truncate"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Optional Video Slide */}
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                  <label className="text-[11px] font-bold text-neutral-800 flex items-center gap-1.5">
                    <span>🎬</span>
                    <span>Vídeo demonstrativo (opcional)</span>
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="flex-1 w-full flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="Link do vídeo MP4"
                        value={newProdVideoUrl}
                        onChange={(e) => setNewProdVideoUrl(e.target.value)}
                        className="flex-1 h-9 px-3 rounded-xl border border-neutral-300 text-xs focus:border-rose-600 focus:outline-none"
                      />
                      {newProdVideoUrl && (
                        <button
                          type="button"
                          onClick={() => setNewProdVideoUrl('')}
                          className="px-2.5 h-9 rounded-xl bg-neutral-200 hover:bg-red-100 text-neutral-600 hover:text-red-600 text-xs font-bold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <label className="w-full sm:w-auto h-9 px-3.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shrink-0">
                      <Upload className="w-3.5 h-3.5 text-rose-600" />
                      <span>Carregar Vídeo</span>
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => setNewProdVideoUrl(ev.target?.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="pt-2 flex items-center justify-between gap-2 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setIsAddProductOpen(false)}
                    className="h-10 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-10 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/25 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Guardar Artigo</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 25 Products Standard Limit Upsell Upgrade Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-neutral-200 space-y-4 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-2xl font-black shadow-inner">
                👑
              </div>

              <div className="text-center space-y-1.5">
                <h3 className="text-base font-black text-neutral-900">
                  Plano Ilimitado Love Shop
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  A sua loja atingiu a capacidade máxima standard. Fale connosco no WhatsApp para expandir a quota de produtos da sua loja.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <a
                  href="https://wa.me/258841234560?text=Ol%C3%A1!%20Tenho%20uma%20loja%20no%20Love%20Shop%20e%20pretendo%20fazer%20upgrade%20para%20mais%20de%2025%20produtos."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/25"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contactar Suporte no WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full h-10 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-2xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Report Review Modal */}
      {selectedReviewToReport && (
        <LoveShopReportReviewModal
          review={selectedReviewToReport}
          isOpen={Boolean(selectedReviewToReport)}
          onClose={() => setSelectedReviewToReport(null)}
          onReportSubmitted={() => {
            refreshOrdersAndReviews();
            setSelectedReviewToReport(null);
          }}
        />
      )}
    </>
  );
};
