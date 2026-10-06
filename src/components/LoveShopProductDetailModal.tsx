import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  MessageCircle, 
  Phone, 
  ShieldCheck, 
  Store, 
  Play, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  ArrowLeft,
  Share2,
  Heart,
  Star,
  ThumbsUp,
  MessageSquareQuote,
  MapPin
} from 'lucide-react';
import { LoveShopProduct, ProductReview } from '../types';
import { contactUnlockService } from '../services/contactUnlockService';
import { loveShopOrderService } from '../services/loveShopOrderService';

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
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const reviewsRef = useRef<HTMLDivElement | null>(null);

  // Reviews Drawer Open State
  const [isReviewsDrawerOpen, setIsReviewsDrawerOpen] = useState<boolean>(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState<boolean>(false);

  // Reviews System State (4 Critérios de Avaliação - Dataset Único via loveShopOrderService)
  const [isAddingReview, setIsAddingReview] = useState<boolean>(false);
  const [newReviewName, setNewReviewName] = useState<string>('');
  const [newReviewCity, setNewReviewCity] = useState<string>('Maputo');
  const [newQuality, setNewQuality] = useState<number>(5);
  const [newCustomerService, setNewCustomerService] = useState<number>(5);
  const [newDeliverySpeed, setNewDeliverySpeed] = useState<number>(5);
  const [newRecommendation, setNewRecommendation] = useState<number>(5);
  const [newReviewComment, setNewReviewComment] = useState<string>('');

  const [reviews, setReviews] = useState(() => {
    if (product) {
      return loveShopOrderService.getReviewsByStoreId(product.storeId);
    }
    return [];
  });

  // Keep reviews synced when product changes
  useEffect(() => {
    if (product) {
      setReviews(loveShopOrderService.getReviewsByStoreId(product.storeId));
    }
  }, [product?.id, product?.storeId]);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !product) return; // Name & Stars required. Comment is OPTIONAL!

    loveShopOrderService.addDirectProductReview(
      product.id,
      product.storeId,
      product.name,
      newReviewName,
      newReviewCity,
      {
        productQuality: newQuality,
        customerService: newCustomerService,
        recommendation: newRecommendation,
        overallSatisfaction: newDeliverySpeed,
        deliverySpeed: newDeliverySpeed,
      },
      newReviewComment
    );

    // Refresh reviews from the ONE unified source of truth immediately
    setReviews(loveShopOrderService.getReviewsByStoreId(product.storeId));

    setNewReviewName('');
    setNewReviewComment('');
    setNewQuality(5);
    setNewCustomerService(5);
    setNewDeliverySpeed(5);
    setNewRecommendation(5);
    setIsAddingReview(false);
  };

  // Reset gallery to position 0 when product changes
  useEffect(() => {
    setActiveMediaIndex(0);
  }, [product?.id]);

  if (!isOpen || !product) return null;

  // Build dynamic media items (Video as FIRST item if present, followed by photo slides)
  const photoList: string[] = [];
  if (product.photos && product.photos.length > 0) {
    photoList.push(...product.photos.slice(0, 4));
  } else if (product.photo) {
    photoList.push(product.photo);
  }

  const mediaItems: Array<{
    id: string;
    type: 'image' | 'video';
    url: string;
    label: string;
    duration?: string;
  }> = [];

  // 1. Vídeo como primeiro artigo/apresentação deste card
  const hasVideo = Boolean(product.videoUrl && product.videoUrl.trim().length > 0);
  if (hasVideo) {
    mediaItems.push({
      id: 'media-video-demo',
      type: 'video',
      url: product.videoUrl!,
      label: 'Vídeo 🎬',
      duration: product.videoDuration || '0:35 min',
    });
  }

  // 2. Seguido pelas fotografias do artigo (até 4 slides)
  photoList.forEach((url, idx) => {
    mediaItems.push({
      id: `media-photo-${idx + 1}`,
      type: 'image',
      url,
      label: `Slide ${idx + 1}`,
    });
  });

  const currentMedia = mediaItems[activeMediaIndex] || mediaItems[0];

  const handleNext = () => {
    setActiveMediaIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const handlePrev = () => {
    setActiveMediaIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext(); // swipe left -> next
      } else {
        handlePrev(); // swipe right -> prev
      }
    }
    touchStartX.current = null;
  };

  const whatsappMessage = encodeURIComponent(
    `Olá! Vi o produto "${product.name}" (${product.price.toLocaleString('pt-MZ')} MT) na Love Shop do Onde Dormir Moçambique e gostaria de encomendar.`
  );
  const whatsappUrl = `https://wa.me/${product.whatsapp}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[88vh] sm:max-h-[90vh] animate-in zoom-in-95 duration-200 relative"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header: Clean Take24Hr Style (Back Arrow + "Product Details" + Close/Favorite) */}
        <div className="px-4 py-3 bg-white border-b border-neutral-100 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 flex items-center justify-center transition-all cursor-pointer active:scale-95"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-700" />
          </button>

          <h2 className="text-sm font-bold text-neutral-900 tracking-tight">
            Detalhes do Artigo
          </h2>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className="w-9 h-9 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Favorito"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : 'text-neutral-600'}`} />
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-4 h-4 text-neutral-600" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 pb-4">
          
          {/* 1. Pure Visual Showcase Area (Compact Vertical Framing for Screen Ergonomics) */}
          <div 
            className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[260px] sm:max-h-[310px] bg-gradient-to-b from-neutral-100 to-neutral-200/70 select-none overflow-hidden flex items-center justify-center p-2"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {currentMedia.type === 'image' ? (
              <img
                src={currentMedia.url}
                alt={product.name}
                className="w-full h-full object-contain rounded-xl transition-opacity duration-200"
              />
            ) : (
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl">
                <video
                  ref={videoRef}
                  src={currentMedia.url}
                  poster={photoList[0] || product.photo}
                  autoPlay
                  loop
                  playsInline
                  muted={isMuted}
                  className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl shadow-xs"
                />
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="absolute bottom-2 right-2 z-20 w-8 h-8 rounded-full bg-neutral-900/75 backdrop-blur-md text-white flex items-center justify-center cursor-pointer hover:bg-neutral-900 transition-all shadow-md active:scale-90"
                  aria-label={isMuted ? 'Ativar som' : 'Silenciar'}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-white" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            )}

            {/* Subtle Circular Navigation Arrows Only - Clean & High Contrast */}
            {mediaItems.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-all active:scale-90 cursor-pointer shadow-md"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-all active:scale-90 cursor-pointer shadow-md"
                  aria-label="Próxima foto"
                >
                  <ChevronRight className="w-4.5 h-4.5" />
                </button>

                {/* Subtle Carousel Pagination Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-neutral-900/60 backdrop-blur-xs px-2.5 py-1 rounded-full">
                  {mediaItems.map((_, dotIdx) => (
                    <span
                      key={`dot-${dotIdx}`}
                      onClick={() => setActiveMediaIndex(dotIdx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        dotIdx === activeMediaIndex
                          ? 'w-5 bg-rose-500 shadow-xs'
                          : 'w-1.5 bg-white/70 hover:bg-white'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* 2. Clean Row of Thumbnails (Below the Image, on White Background) */}
          <div className="px-4 py-2 bg-white border-b border-neutral-100">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {mediaItems.map((item, idx) => {
                const isActive = idx === activeMediaIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveMediaIndex(idx)}
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 transition-all cursor-pointer border-2 bg-neutral-100 ${
                      isActive
                        ? 'border-rose-600 ring-2 ring-rose-500/30 scale-102 shadow-sm'
                        : 'border-neutral-200/90 hover:border-neutral-400 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {item.type === 'image' ? (
                      <img
                        src={item.url}
                        alt={item.label}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="relative w-full h-full bg-neutral-900 flex items-center justify-center">
                        <img
                          src={photoList[0] || product.photo}
                          alt="Vídeo"
                          className="w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Play className="w-5 h-5 text-rose-400 fill-rose-400" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Product Information (Compact, Side-by-Side Layout to Minimize Vertical Scroll) */}
          <div className="px-4 pt-3 space-y-3">
            {/* Top Row: Category/Location (Left) + Reviews/Rating (Right) Side-by-Side */}
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 min-w-0 truncate text-neutral-500">
                <span className="font-bold text-rose-700 uppercase tracking-wide shrink-0">
                  {product.categoryLabel}
                </span>
                <span aria-hidden="true" className="text-neutral-300">·</span>
                <span className="flex items-center gap-1 text-neutral-600 font-medium truncate">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="truncate">{product.city}</span>
                </span>
              </div>

              {/* Quick Rating Summary */}
              <button
                type="button"
                onClick={() => setIsReviewsDrawerOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-700 hover:text-rose-600 transition-colors cursor-pointer shrink-0 active:scale-95"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                <span className="font-black text-neutral-900">4.8</span>
                <span className="text-neutral-400 font-normal">({reviews.length})</span>
                <span className="text-rose-600 font-bold ml-0.5">&rarr;</span>
              </button>
            </div>

            {/* Main Row: Product Title (Left) + Price Block (Right) Side-by-Side */}
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-base sm:text-lg font-bold text-neutral-900 leading-snug flex-1">
                {product.name}
              </h1>

              <div className="text-right shrink-0">
                <span className="text-xl sm:text-2xl font-black text-rose-600 tracking-tight block">
                  MT {product.price.toLocaleString('pt-MZ')}.00
                </span>
                {product.originalPrice && (
                  <span className="text-xs font-semibold text-neutral-400 line-through block">
                    MT {product.originalPrice.toLocaleString('pt-MZ')}.00
                  </span>
                )}
              </div>
            </div>

            {/* Store Information Card (Compact & Clean) */}
            <div 
              onClick={() => {
                if (onSelectStore) {
                  onSelectStore(product.storeId);
                  onClose();
                }
              }}
              className="p-2.5 bg-neutral-50 hover:bg-neutral-100 rounded-2xl border border-neutral-200/80 flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm shrink-0">
                  <Store className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                      {product.storeName}
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  </div>
                  <span className="text-[11px] text-neutral-500 block truncate">
                    Loja Oficial Verificada
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-rose-600 shrink-0 ml-2">
                Ver Loja &rarr;
              </span>
            </div>

            {/* Description Accordion (Minimalist, Click to Expand) */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                className="w-full p-3 bg-neutral-50 hover:bg-neutral-100 rounded-2xl border border-neutral-200/90 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="text-xs font-bold text-neutral-800">
                  Descrição do Artigo
                </span>
                <span className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                  <span>{isDescriptionOpen ? 'Recolher' : 'Ver detalhes'}</span>
                  <span>{isDescriptionOpen ? '↑' : '↓'}</span>
                </span>
              </button>

              {isDescriptionOpen && (
                <div className="mt-2 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs sm:text-sm text-neutral-700 leading-relaxed animate-in fade-in duration-150">
                  {product.description}
                </div>
              )}
            </div>

            {/* Subtle Trust Line */}
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 px-1 pt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Compra direta com a loja parceira</span>
            </div>
          </div>
        </div>

        {/* 4. Fixed Bottom Action Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-neutral-200 flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <span className="text-[10px] text-neutral-400 font-semibold block uppercase">
              Preço
            </span>
            <span className="text-sm sm:text-base font-black text-neutral-900 block truncate">
              MT {product.price.toLocaleString('pt-MZ')}.00
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${product.phone}`}
              onClick={(e) => {
                loveShopOrderService.createOrderOnContact(product);
                const allowed = contactUnlockService.triggerContactAttempt(
                  {
                    id: product.storeId || product.id,
                    name: `${product.name} (${product.storeName})`,
                    photo: product.photo,
                    whatsapp: product.whatsapp,
                    phone: product.phone,
                    module: 'loveshop',
                    moduleLabel: 'Love Shop',
                    unlockFee: 1000,
                  },
                  product.isContactUnlocked
                );
                if (!allowed) {
                  e.preventDefault();
                }
              }}
              className="w-11 h-11 rounded-2xl bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Ligar"
            >
              <Phone className="w-4 h-4 text-neutral-800" />
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                loveShopOrderService.createOrderOnContact(product);
                const allowed = contactUnlockService.triggerContactAttempt(
                  {
                    id: product.storeId || product.id,
                    name: `${product.name} (${product.storeName})`,
                    photo: product.photo,
                    whatsapp: product.whatsapp,
                    phone: product.phone,
                    module: 'loveshop',
                    moduleLabel: 'Love Shop',
                    unlockFee: 1000,
                  },
                  product.isContactUnlocked
                );
                if (!allowed) {
                  e.preventDefault();
                }
              }}
              className="h-11 px-4 sm:px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white shrink-0" />
              <span>Comprar no WhatsApp</span>
            </a>
          </div>
        </div>

        {/* REVIEWS SLIDE-UP DRAWER (Opens when user clicks "Confira a avaliação") */}
        {isReviewsDrawerOpen && (
          <div className="absolute inset-0 z-40 bg-white flex flex-col animate-in slide-in-from-bottom duration-200">
            {/* Drawer Header */}
            <div className="px-4 py-3 bg-white border-b border-neutral-100 flex items-center justify-between shrink-0">
              <button
                onClick={() => setIsReviewsDrawerOpen(false)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-neutral-950 bg-neutral-100 px-3 py-1.5 rounded-xl cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar ao Artigo</span>
              </button>

              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-neutral-900">4.8</span>
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-neutral-500 font-medium">
                  ({reviews.length})
                </span>
              </div>

              <button
                onClick={() => setIsReviewsDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="p-4 overflow-y-auto flex-1 space-y-4">
              {(() => {
                const storeReputation = loveShopOrderService.calculateStoreReputation(product.storeId);
                const sellerApprovalPercent = Math.round((storeReputation.rating / 5) * 100);

                return (
                  <>
                    {/* 1. RELATÓRIO DE CLASSIFICAÇÃO GERAL */}
                    <div className="p-3.5 sm:p-4 bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 space-y-3 shadow-2xs overflow-hidden">
                      {/* Header: Title */}
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <h3 className="text-sm sm:text-base font-black text-neutral-950 leading-tight">
                            Relatório de Classificação Geral da Loja
                          </h3>
                          <p className="text-[11px] text-neutral-500 mt-0.5">
                            Calculado estritamente pelos 3 critérios do Vendedor
                          </p>
                        </div>
                      </div>

                      {/* Button: Avaliar esta Loja */}
                      <div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingReview(!isAddingReview);
                            setIsReviewsDrawerOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-black border border-rose-200/80 transition-colors shadow-2xs cursor-pointer active:scale-95"
                        >
                          <Star className="w-3.5 h-3.5 fill-rose-600" />
                          <span>{isAddingReview ? '✕ Fechar Formulário' : 'Avaliar esta Loja'}</span>
                        </button>
                      </div>

                      {/* Inline Form when Avaliar esta Loja is clicked */}
                      {isAddingReview && (
                        <form 
                          onSubmit={handleAddReview} 
                          className="p-3.5 sm:p-4 bg-rose-50/70 rounded-2xl border border-rose-200 space-y-3 animate-in fade-in duration-200 shadow-2xs"
                        >
                          <div className="flex items-center justify-between border-b border-rose-200/80 pb-2.5 gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                              <span className="text-[11px] xs:text-xs sm:text-sm font-black text-neutral-900 tracking-tight truncate leading-tight">
                                Avaliar Compra por Estrelas (4 Critérios)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setIsAddingReview(false)}
                              className="w-6 h-6 rounded-full hover:bg-rose-100 flex items-center justify-center text-neutral-400 hover:text-neutral-700 transition-colors shrink-0 text-xs font-bold cursor-pointer"
                              title="Fechar Formulário"
                            >
                              ✕
                            </button>
                          </div>

                          <div className="space-y-2.5">
                            {[
                              { label: 'Qualidade do produto', value: newQuality, setValue: setNewQuality },
                              { label: 'Atendimento', value: newCustomerService, setValue: setNewCustomerService },
                              { label: 'Recomendação', value: newRecommendation, setValue: setNewRecommendation },
                              { label: 'Satisfação Geral', value: newDeliverySpeed, setValue: setNewDeliverySpeed },
                            ].map((item, idx) => (
                              <div
                                key={idx}
                                className="p-3 bg-white rounded-xl border border-neutral-200/90 space-y-1 shadow-2xs"
                              >
                                <div className="min-w-0">
                                  <span className="text-xs font-bold text-neutral-900 block leading-tight">
                                    {item.label}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 pt-0.5 flex-wrap">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={() => item.setValue(star)}
                                      className="p-0.5 cursor-pointer transition-transform hover:scale-110 active:scale-95 shrink-0"
                                      title={`${item.label}: ${star} estrelas`}
                                    >
                                      <Star
                                        className={`w-5 h-5 sm:w-5.5 sm:h-5.5 transition-colors ${
                                          star <= item.value
                                            ? 'fill-amber-400 text-amber-400 drop-shadow-2xs'
                                            : 'text-neutral-300'
                                        }`}
                                      />
                                    </button>
                                  ))}
                                  <span className="text-xs font-black text-neutral-700 ml-1.5">{item.value}.0</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            <input
                              type="text"
                              required
                              placeholder="Seu nome (ex: Artur M.)"
                              value={newReviewName}
                              onChange={(e) => setNewReviewName(e.target.value)}
                              className="h-10 px-3 bg-white rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-rose-600 font-medium"
                            />
                            <input
                              type="text"
                              placeholder="Sua cidade (ex: Matola, Maputo)"
                              value={newReviewCity}
                              onChange={(e) => setNewReviewCity(e.target.value)}
                              className="h-10 px-3 bg-white rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-rose-600 font-medium"
                            />
                          </div>

                          <textarea
                            rows={2}
                            placeholder="Qual é a sua experiência? (Comentário opcional...)"
                            value={newReviewComment}
                            onChange={(e) => setNewReviewComment(e.target.value)}
                            className="w-full p-3 bg-white rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-rose-600 resize-none font-medium"
                          />

                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setIsAddingReview(false)}
                              className="h-10 px-4 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                            >
                              Cancelar
                            </button>
                            <button
                              type="submit"
                              className="flex-1 h-10 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm shadow-rose-600/30"
                            >
                              <Star className="w-4 h-4 fill-white" />
                              <span>Submeter Avaliação</span>
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Dark Metric Box (ÍNDICE GLOBAL DE APROVAMENTO) - Baseado estritamente nos 3 critérios do Vendedor */}
                      <div className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-zinc-950 text-white border border-emerald-500/30 shadow-lg space-y-3 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[11px] sm:text-xs font-black tracking-wider uppercase text-emerald-400 block leading-tight">
                              ÍNDICE GLOBAL DE APROVAMENTO
                            </span>
                            <span className="text-[10px] text-neutral-400">
                              Overall Rating {storeReputation.rating.toFixed(1)} ⭐
                            </span>
                          </div>
                          <div className="flex items-baseline gap-1.5 text-right">
                            <span className="text-2xl sm:text-3xl font-black text-white leading-none tracking-tight">
                              {sellerApprovalPercent}%
                            </span>
                            <span className="text-[11px] text-neutral-300 font-bold">
                              de Satisfação
                            </span>
                          </div>
                        </div>

                        {/* 3 Store-Level Criteria Breakdown */}
                        <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-neutral-800 text-[10.5px]">
                          <div className="p-2 bg-neutral-800/80 rounded-xl border border-neutral-700/50 text-center">
                            <span className="text-neutral-400 block text-[9.5px]">Atendimento</span>
                            <strong className="text-amber-400 font-black">{storeReputation.breakdown.customerService.toFixed(1)} ★</strong>
                          </div>
                          <div className="p-2 bg-neutral-800/80 rounded-xl border border-neutral-700/50 text-center">
                            <span className="text-neutral-400 block text-[9.5px]">Recomendação</span>
                            <strong className="text-amber-400 font-black">{storeReputation.breakdown.recommendation.toFixed(1)} ★</strong>
                          </div>
                          <div className="p-2 bg-neutral-800/80 rounded-xl border border-neutral-700/50 text-center">
                            <span className="text-neutral-400 block text-[9.5px]">Satisfação Geral</span>
                            <strong className="text-amber-400 font-black">{storeReputation.breakdown.overallSatisfaction.toFixed(1)} ★</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}

              {/* 2. AVALIAÇÃO INDIVIDUAL DE COMPRADORES VERIFICADOS (LISTA + ESTRELAS) */}
              <div className="p-4 bg-white rounded-2xl border border-neutral-200/90 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-neutral-100">
                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                    <span>Avaliações Individuais de Compradores</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                      {reviews.length} Verificadas
                    </span>
                  </h4>
                </div>

                {reviews.length === 0 ? (
                  <div className="p-6 text-center bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-500 font-medium space-y-1">
                    <p className="font-bold text-neutral-800">Ainda sem avaliações verificadas.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-3.5 bg-neutral-50/80 rounded-2xl border border-neutral-200/90 space-y-2 shadow-2xs hover:border-neutral-300 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-black text-xs flex items-center justify-center shrink-0 border border-rose-200">
                              {rev.userName.charAt(0)}
                            </div>
                            <div>
                              <span className="font-extrabold text-xs text-neutral-900 block">
                                {rev.userName} <span className="text-[10px] text-neutral-400 font-normal">({rev.userCity})</span>
                              </span>
                              <div className="flex items-center text-amber-400 gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${i < Math.round(rev.storeRatingAverage) ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'}`}
                                  />
                                ))}
                                <span className="text-[11px] font-bold text-neutral-700 ml-1">
                                  {rev.storeRatingAverage.toFixed(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-neutral-400 font-medium block">
                              {rev.date}
                            </span>
                            <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 inline-block mt-0.5">
                              ✓ Compra Verificada
                            </span>
                          </div>
                        </div>

                        {rev.comment && (
                          <p className="text-xs text-neutral-700 leading-relaxed font-medium pt-1">
                            "{rev.comment}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Bottom Bar */}
            <div className="p-3 bg-white border-t border-neutral-200 flex items-center justify-end">
              <button
                onClick={() => setIsReviewsDrawerOpen(false)}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Voltar ao Artigo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
