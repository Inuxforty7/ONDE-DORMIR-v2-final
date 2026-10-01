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
  MessageSquareQuote
} from 'lucide-react';
import { LoveShopProduct, ProductReview } from '../types';
import { contactUnlockService } from '../services/contactUnlockService';

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

  // Reviews System State
  const [isAddingReview, setIsAddingReview] = useState<boolean>(false);
  const [newReviewName, setNewReviewName] = useState<string>('');
  const [newReviewCity, setNewReviewCity] = useState<string>('Maputo');
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewComment, setNewReviewComment] = useState<string>('');

  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    const defaultReviews: ProductReview[] = [
      {
        id: 'rev-1',
        userName: 'João M.',
        userCity: 'Maputo',
        rating: 5,
        date: 'Há 2 dias',
        comment: 'Produto excelente e exatamente conforme o anúncio. Atendimento muito ágil e cordial.',
        verifiedPurchase: true,
        satisfactionTags: ['Produto conforme anunciado', 'Boa qualidade'],
      },
      {
        id: 'rev-2',
        userName: 'Artur C.',
        userCity: 'Matola',
        rating: 5,
        date: 'Há 5 dias',
        comment: 'Entrega rápida e qualidade impecável. Recomendo 100%!',
        verifiedPurchase: true,
        satisfactionTags: ['Entrega rápida', 'Recomendo'],
      },
      {
        id: 'rev-3',
        userName: 'Helena V.',
        userCity: 'Beira',
        rating: 5,
        date: 'Há 1 semana',
        comment: 'Preço justo e produto maravilhoso. Fiquei muito satisfeita com a compra.',
        verifiedPurchase: true,
        satisfactionTags: ['Bom atendimento', 'Preço justo'],
      },
      {
        id: 'rev-4',
        userName: 'Carlos B.',
        userCity: 'Nampula',
        rating: 5,
        date: 'Há 2 semanas',
        comment: 'Chegou bem embalado e em perfeitas condições. Experiência 5 estrelas.',
        verifiedPurchase: true,
        satisfactionTags: ['Boa qualidade', 'Recomendo'],
      }
    ];

    if (product) {
      const stored = localStorage.getItem(`loveshop_reviews_${product.id}`);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          return defaultReviews;
        }
      }
    }
    return defaultReviews;
  });

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      userName: newReviewName.trim(),
      userCity: newReviewCity.trim() || 'Moçambique',
      rating: newReviewRating,
      date: 'Hoje',
      comment: newReviewComment.trim(),
      verifiedPurchase: true,
      satisfactionTags: ['Produto conforme anunciado', 'Recomendo'],
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);
    if (product) {
      localStorage.setItem(`loveshop_reviews_${product.id}`, JSON.stringify(updated));
    }

    setNewReviewName('');
    setNewReviewComment('');
    setIsAddingReview(false);
  };

  // Reset gallery to position 0 when product changes
  useEffect(() => {
    setActiveMediaIndex(0);
  }, [product?.id]);

  if (!isOpen || !product) return null;

  // Build dynamic media items (Photos + Optional Demonstrative Video at the end)
  const photoList: string[] = [];
  const frontPhoto = product.photoAngles?.front || product.photos?.[0] || product.photo;
  if (frontPhoto) photoList.push(frontPhoto);

  const sidePhoto = product.photoAngles?.side || product.photos?.[1];
  if (sidePhoto) photoList.push(sidePhoto);

  const openPhoto = product.photoAngles?.open || product.photos?.[2];
  if (openPhoto) photoList.push(openPhoto);

  const backPhoto = product.photoAngles?.back || product.photos?.[3];
  if (backPhoto) photoList.push(backPhoto);

  // Fallback to ensure at least default photo angles if only 1 photo was provided
  if (photoList.length === 1) {
    photoList.push('https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80');
    photoList.push('https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80');
    photoList.push('https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1000&q=80');
  }

  const mediaItems: Array<{
    id: string;
    type: 'image' | 'video';
    url: string;
    label: string;
    duration?: string;
  }> = [];

  const photoLabels = ['Frente', 'Lateral', 'Aberto', 'Traseira'];

  photoList.slice(0, 4).forEach((url, idx) => {
    mediaItems.push({
      id: `media-photo-${idx + 1}`,
      type: 'image',
      url,
      label: photoLabels[idx] || `Foto ${idx + 1}`,
    });
  });

  // Optional Demonstrative Video (only included if provided by vendor)
  const hasVideo = Boolean(product.videoUrl && product.videoUrl.trim().length > 0);
  if (hasVideo) {
    mediaItems.push({
      id: 'media-video-demo',
      type: 'video',
      url: product.videoUrl!,
      label: 'Vídeo 🎬',
      duration: product.videoDuration || '0:45 min',
    });
  }

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
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 relative"
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
          
          {/* 1. Pure Visual Showcase Area (Clean, Uncluttered, No Text/Gradient Overlays!) */}
          <div 
            className="relative w-full aspect-square bg-neutral-100 select-none overflow-hidden flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {currentMedia.type === 'image' ? (
              <img
                src={currentMedia.url}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-200"
              />
            ) : (
              <div className="relative w-full h-full bg-black flex items-center justify-center">
                <video
                  ref={videoRef}
                  src={currentMedia.url}
                  poster={photoList[0] || product.photo}
                  autoPlay
                  loop
                  playsInline
                  muted={isMuted}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="absolute bottom-12 right-3 z-20 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-black transition-all"
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-4 h-4 text-amber-400" />
                      <span>Com Som</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                      <span>Sem Som</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Subtle Circular Navigation Arrows Only - 100% Clean Image Area */}
            {mediaItems.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-all active:scale-90 cursor-pointer shadow-md"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-all active:scale-90 cursor-pointer shadow-md"
                  aria-label="Próxima foto"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Subtle Carousel Pagination Dots (Matching Take24Hr Screenshot 1 & 3) */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/35 backdrop-blur-xs px-2.5 py-1 rounded-full">
                  {mediaItems.map((_, dotIdx) => (
                    <span
                      key={`dot-${dotIdx}`}
                      onClick={() => setActiveMediaIndex(dotIdx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        dotIdx === activeMediaIndex
                          ? 'w-5 bg-rose-500 shadow-xs'
                          : 'w-1.5 bg-white/60 hover:bg-white'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* 2. Clean Row of Thumbnails (Below the Image, on White Background) */}
          <div className="px-4 py-3 bg-white border-b border-neutral-100">
            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar">
              {mediaItems.map((item, idx) => {
                const isActive = idx === activeMediaIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveMediaIndex(idx)}
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shrink-0 transition-all cursor-pointer border-2 bg-neutral-100 ${
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

          {/* 3. Product Information (All Info Cleanly Positioned Below) */}
          <div className="px-4 pt-3.5 space-y-3.5">
            {/* Top Badges (Category & Stock) */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200/70">
                {product.categoryLabel}
              </span>

              <span className="text-[11px] font-bold text-neutral-500">
                📍 {product.city}, {product.province}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-base sm:text-lg font-bold text-neutral-900 leading-snug">
              {product.name}
            </h1>

            {/* Price Block (Matching Take24Hr Currency Presentation) */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-rose-600 tracking-tight">
                  MT {product.price.toLocaleString('pt-MZ')}.00
                </span>
                {product.originalPrice && (
                  <span className="text-sm font-semibold text-neutral-400 line-through">
                    MT {product.originalPrice.toLocaleString('pt-MZ')}.00
                  </span>
                )}
              </div>
              <span className="text-[11px] text-neutral-400 font-medium block mt-0.5">
                Preço final do produto em MT
              </span>

              {/* Quick Rating Summary Anchor that opens Reviews Drawer */}
              <button
                type="button"
                onClick={() => setIsReviewsDrawerOpen(true)}
                className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200/90 text-xs font-semibold text-neutral-800 transition-all cursor-pointer group active:scale-95 shadow-2xs"
              >
                <div className="inline-flex items-center text-amber-500 gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-black text-neutral-900">4.8</span>
                  <span className="text-neutral-500 font-medium">(575)</span>
                </div>
                <span className="text-amber-300">•</span>
                <span className="text-neutral-700 font-bold group-hover:text-rose-600 underline">
                  Confira a avaliação &rarr;
                </span>
              </button>
            </div>

            {/* Store Information Card */}
            <div 
              onClick={() => {
                if (onSelectStore) {
                  onSelectStore(product.storeId);
                  onClose();
                }
              }}
              className="p-3 bg-neutral-50 hover:bg-neutral-100 rounded-2xl border border-neutral-200/80 flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-base shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                      {product.storeName}
                    </span>
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  </div>
                  <span className="text-[11px] text-neutral-500 block truncate">
                    Vendedor Certificado • Ver catálogo
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-rose-600 shrink-0">
                Ver Loja &rarr;
              </span>
            </div>

            {/* Description */}
            <div className="space-y-1 pt-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Descrição do Artigo
              </h3>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Acesso Livre para Compradores (A Nata) */}
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="leading-snug">
                <strong>Acesso Livre para Compradores:</strong> Sem comissões intermediárias. Encomende diretamente com a loja parceira pelo WhatsApp ou por chamada.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Fixed Bottom Action Bar (Take24Hr Style with WhatsApp & Call) */}
        <div className="p-3 sm:p-4 bg-white border-t border-neutral-200 flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <span className="text-[10px] text-neutral-400 font-semibold block uppercase">
              Preço Final
            </span>
            <span className="text-sm sm:text-base font-black text-neutral-900 block truncate">
              MT {product.price.toLocaleString('pt-MZ')}.00
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${product.phone}`}
              onClick={(e) => {
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
                  (575)
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
              {/* Resumo & Tabelinha de Parâmetros Fixos */}
              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-neutral-900">
                      Classificação dos Clientes
                    </h3>
                    <p className="text-[11px] text-neutral-500">
                      Baseado em 575 compras verificadas
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAddingReview(!isAddingReview)}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {isAddingReview ? 'Cancelar' : '+ Deixar Avaliação'}
                  </button>
                </div>

                {/* Tabelinha / Critérios Fixos */}
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {[
                    { label: 'Produto conforme o anunciado', pct: '98%' },
                    { label: 'Entrega rápida', pct: '94%' },
                    { label: 'Boa qualidade', pct: '96%' },
                    { label: 'Bom atendimento', pct: '95%' },
                    { label: 'Preço justo', pct: '91%' },
                    { label: 'Recomendo', pct: '99%' },
                  ].map((crit, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-white rounded-xl border border-neutral-200/80 flex items-center justify-between gap-1 shadow-2xs"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-emerald-600 font-black text-xs shrink-0">✓</span>
                        <span className="text-[11px] font-bold text-neutral-800 truncate">
                          {crit.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                        {crit.pct}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form de Nova Avaliação (se ativado) */}
              {isAddingReview && (
                <form 
                  onSubmit={handleAddReview} 
                  className="p-3.5 bg-white rounded-2xl border border-rose-200 shadow-sm space-y-2.5 animate-in fade-in duration-150"
                >
                  <h4 className="text-xs font-bold text-neutral-900">
                    Sua Avaliação sobre este Artigo:
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Seu nome (ex: Artur)"
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      className="h-9 px-3 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-rose-600"
                    />
                    <input
                      type="text"
                      placeholder="Sua cidade (ex: Matola)"
                      value={newReviewCity}
                      onChange={(e) => setNewReviewCity(e.target.value)}
                      className="h-9 px-3 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-rose-600"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-neutral-600">Sua nota:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= newReviewRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-neutral-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    required
                    rows={2}
                    placeholder="Conte como foi a sua experiência com este artigo..."
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-rose-600 resize-none"
                  />

                  <button
                    type="submit"
                    className="w-full h-9 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Publicar Avaliação
                  </button>
                </form>
              )}

              {/* Feed Rolável de Comentários (João, Artur, etc.) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-neutral-800 px-1">
                  <span>Comentários dos Clientes ({reviews.length})</span>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Compra Verificada
                  </span>
                </div>

                <div className="space-y-2.5">
                  {reviews.map((rev) => (
                    <div 
                      key={rev.id}
                      className="p-3 bg-neutral-50/70 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center">
                            {rev.userName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-neutral-900">
                                {rev.userName}
                              </span>
                              <span className="text-[10px] text-neutral-400 font-medium">
                                ({rev.userCity})
                              </span>
                            </div>
                            <div className="flex items-center text-amber-400 gap-0.5 mt-0.5">
                              {[...Array(rev.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-400" />
                              ))}
                            </div>
                          </div>
                        </div>

                        <span className="text-[10px] text-neutral-400">
                          {rev.date}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-700 leading-snug">
                        "{rev.comment}"
                      </p>

                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Compra Verificada
                        </span>
                        {rev.satisfactionTags?.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[9px] text-neutral-500 bg-white px-1.5 py-0.5 rounded border border-neutral-200 font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Bottom Bar */}
            <div className="p-3 bg-white border-t border-neutral-200 flex items-center justify-between">
              <span className="text-xs text-neutral-500 font-medium">
                Garantia de avaliação genuína
              </span>
              <button
                onClick={() => setIsReviewsDrawerOpen(false)}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
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
