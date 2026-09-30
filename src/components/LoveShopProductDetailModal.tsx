import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  MessageCircle, 
  Phone, 
  ShieldCheck, 
  Tag, 
  Store,
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Film, 
  Image as ImageIcon,
  Rotate3d,
  Layers,
  Sparkles,
  Eye,
  Volume2,
  VolumeX
} from 'lucide-react';
import { LoveShopProduct } from '../types';
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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const touchStartX = useRef<number | null>(null);

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
    badge: string;
    icon: any;
    duration?: string;
    description: string;
  }> = [];

  const photoLabels = [
    { label: '1. Vista Frontal (Principal)', badge: '1. Frente', icon: ImageIcon, desc: 'Ângulo frontal principal' },
    { label: '2. Ângulo Lateral (Perfil)', badge: '2. Lateral', icon: Rotate3d, desc: 'Espessura e detalhes de perfil' },
    { label: '3. Interior (Aberto / Estrutura)', badge: '3. Aberto', icon: Layers, desc: 'Visão interna ou modelo ajustado' },
    { label: '4. Vista Traseira & Acabamentos', badge: '4. Traseira', icon: Eye, desc: 'Costuras, fechos e detalhes do verso' },
  ];

  photoList.slice(0, 4).forEach((url, idx) => {
    const info = photoLabels[idx] || { label: `Foto ${idx + 1}`, badge: `Foto ${idx + 1}`, icon: ImageIcon, desc: 'Ângulo do produto' };
    mediaItems.push({
      id: `media-photo-${idx + 1}`,
      type: 'image',
      url,
      label: info.label,
      badge: info.badge,
      icon: info.icon,
      description: info.desc,
    });
  });

  // Optional Demonstrative Video (only included if provided by vendor)
  const hasVideo = Boolean(product.videoUrl && product.videoUrl.trim().length > 0);
  if (hasVideo) {
    mediaItems.push({
      id: 'media-video-demo',
      type: 'video',
      url: product.videoUrl!,
      label: `${mediaItems.length + 1}. Vídeo Demonstrativo ao Vivo`,
      badge: `${mediaItems.length + 1}. 🎬 Vídeo`,
      icon: Film,
      duration: product.videoDuration || '0:45 min',
      description: product.videoTitle || 'Demonstração de caimento, movimento, aberturas e detalhes ao vivo',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-200 relative"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center cursor-pointer shadow-md backdrop-blur-md transition-all active:scale-95"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1">
          {/* Main Media Carousel Section (4 Photos + 1 Video) */}
          <div 
            className="relative aspect-4/3 bg-neutral-950 overflow-hidden select-none group"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {currentMedia.type === 'image' ? (
              <img
                src={currentMedia.url}
                alt={`${product.name} - ${currentMedia.label}`}
                className="w-full h-full object-cover transition-all duration-300"
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

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Top Bar Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-20 max-w-[80%]">
              <span className="text-[11px] font-black uppercase bg-rose-600 text-white px-2.5 py-0.5 rounded-lg shadow-md">
                {product.categoryLabel}
              </span>
              {product.discountPercent && (
                <span className="text-[11px] font-black bg-amber-400 text-zinc-950 px-2 py-0.5 rounded-lg shadow-md flex items-center gap-1">
                  <Tag className="w-3 h-3" /> -{product.discountPercent}% OFF
                </span>
              )}
              {currentMedia.type === 'video' && (
                <span className="text-[11px] font-extrabold bg-emerald-500 text-black px-2.5 py-0.5 rounded-lg shadow-md flex items-center gap-1 animate-pulse">
                  <Play className="w-3 h-3 fill-black" /> Vídeo {currentMedia.duration}
                </span>
              )}
            </div>

            {/* Carousel Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-90 cursor-pointer"
              title="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-90 cursor-pointer"
              title="Próximo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Bottom Media Label Indicator */}
            <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between text-white">
              <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10">
                <currentMedia.icon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-xs font-bold truncate">
                  {currentMedia.label}
                </span>
              </div>

              <span className="text-xs font-black bg-emerald-600/90 text-white px-2.5 py-1 rounded-xl backdrop-blur-md border border-emerald-400/30">
                {activeMediaIndex + 1} de {mediaItems.length}
              </span>
            </div>
          </div>

          {/* 5-Position Media Selection Tabs (4 Photos + 1 Video) */}
          <div className="p-2.5 bg-neutral-900 border-b border-neutral-800">
            <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
              {mediaItems.map((item, idx) => {
                const isActive = idx === activeMediaIndex;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveMediaIndex(idx)}
                    className={`flex-1 min-w-[72px] py-1.5 px-2 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      isActive
                        ? item.type === 'video'
                          ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-400 scale-102'
                          : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400 scale-102'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-750'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : item.type === 'video' ? 'text-rose-400' : 'text-neutral-400'}`} />
                    <span className="truncate w-full text-center">{item.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details Body */}
          <div className="p-4 sm:p-5 space-y-4">
            {/* Title & Price */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-black uppercase text-rose-600 tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Artigo Oficial Love Shop
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
            <div className="space-y-1 bg-neutral-50 p-3.5 rounded-2xl border border-neutral-150">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500">
                Descrição e Especificações do Artigo
              </h3>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Multi-angle media guarantee notice */}
            <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-950 flex items-start gap-2.5">
              <Rotate3d className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-snug">
                <p className="font-bold">Galeria Multi-Ângulo + Vídeo Opcional:</p>
                <p className="text-[11px] text-rose-800 mt-0.5">
                  {hasVideo 
                    ? 'Deslize para explorar as posições do artigo em diferentes ângulos e assista ao vídeo demonstrativo ao vivo na última posição.'
                    : 'Deslize para explorar os diferentes ângulos do artigo (frente, perfil, abertura e traseira). Vídeo demonstrativo opcional.'}
                </p>
              </div>
            </div>

            {/* Buyer Notice */}
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="leading-snug">
                <strong>Acesso Livre para Compradores:</strong> Sem comissões intermediárias. Encomende diretamente com a loja parceira pelo WhatsApp ou por chamada.
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
            className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-white shrink-0" />
            <span>Comprar no WhatsApp</span>
          </a>

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
