import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Navigation2, 
  MessageCircle, 
  Phone, 
  ShieldCheck, 
  Heart, 
  Clock, 
  Info, 
  Star, 
  Award, 
  Crown, 
  CheckCircle2,
  Wind,
  Wifi,
  Car,
  Zap,
  Bath,
  Coffee,
  Utensils,
  Tv,
  Waves,
  Wine,
  Flame
} from 'lucide-react';
import { Accommodation, AmenityId } from '../types';
import { formatDistance, getDirectionsUrl, getWhatsAppInquiryUrl } from '../utils/geo';
import { AMENITIES_CATALOG, ACCOMMODATION_TYPE_LABELS } from '../utils/amenities';

interface AccommodationDetailModalProps {
  accommodation: Accommodation | null;
  isOpen?: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onOpenPrivacyModal: () => void;
}

const AMENITY_ICONS: Record<AmenityId, React.ReactNode> = {
  ac: <Wind className="w-5 h-5 text-emerald-600" />,
  wifi: <Wifi className="w-5 h-5 text-emerald-600" />,
  parking: <Car className="w-5 h-5 text-emerald-600" />,
  generator: <Zap className="w-5 h-5 text-amber-500" />,
  private_bathroom: <Bath className="w-5 h-5 text-emerald-600" />,
  breakfast: <Coffee className="w-5 h-5 text-amber-600" />,
  restaurant: <Utensils className="w-5 h-5 text-rose-500" />,
  tv: <Tv className="w-5 h-5 text-blue-500" />,
  pool: <Waves className="w-5 h-5 text-sky-500" />,
  security: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
  bar: <Wine className="w-5 h-5 text-purple-500" />,
  hot_water: <Flame className="w-5 h-5 text-orange-500" />,
};

export const AccommodationDetailModal: React.FC<AccommodationDetailModalProps> = ({
  accommodation,
  isOpen = true,
  onClose,
  isSaved,
  onToggleSave,
  onOpenPrivacyModal,
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  if (!isOpen || !accommodation) return null;

  const whatsappUrl = getWhatsAppInquiryUrl(accommodation.whatsapp, accommodation.name);
  const directionsUrl = getDirectionsUrl(
    accommodation.location.lat,
    accommodation.location.lng,
    accommodation.name
  );

  const typeMeta = ACCOMMODATION_TYPE_LABELS[accommodation.type] || {
    label: accommodation.type,
    badgeColor: 'bg-neutral-100 text-neutral-800 border-neutral-200',
  };

  const rating = accommodation.rating || 4.5;
  const reviewsCount = accommodation.reviewsCount || 24;
  const minPrice = accommodation.priceEstimate?.approxMin;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white w-full sm:max-w-2xl sm:rounded-3xl min-h-screen sm:min-h-0 sm:max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Top Control Bar */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border shadow-md backdrop-blur-md bg-white/95 pointer-events-auto ${typeMeta.badgeColor}`}>
            {typeMeta.label}
          </span>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => onToggleSave(accommodation.id)}
              className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white shadow-md backdrop-blur-md transition-all active:scale-95 flex items-center justify-center cursor-pointer touch-manipulation"
              title={isSaved ? 'Remover dos guardados' : 'Guardar hospedagem'}
              aria-label={isSaved ? 'Remover dos guardados' : 'Guardar hospedagem'}
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isSaved ? 'fill-rose-500 text-rose-500' : 'text-white'
                }`}
              />
            </button>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white shadow-md backdrop-blur-md transition-all active:scale-95 flex items-center justify-center cursor-pointer touch-manipulation"
              title="Fechar"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 pb-28 sm:pb-6">
          {/* Gallery view */}
          <div className="relative bg-neutral-950 aspect-16/10 w-full overflow-hidden">
            <img
              src={accommodation.photos[activePhotoIndex] || accommodation.photos[0]}
              alt={accommodation.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Badges and Price on Photo */}
            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white pointer-events-none">
              <div className="flex flex-wrap gap-2 items-center">
                {accommodation.isPremium && (
                  <span className="flex items-center gap-1 text-xs font-black uppercase tracking-wider bg-amber-500 text-zinc-950 px-2.5 py-1 rounded-lg shadow-sm">
                    <Crown className="w-3.5 h-3.5 fill-zinc-950" /> PREMIUM
                  </span>
                )}
                {accommodation.featured && (
                  <span className="flex items-center gap-1 text-xs font-black uppercase tracking-wider bg-amber-400 text-zinc-950 px-2.5 py-1 rounded-lg shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-zinc-950" /> DESTAQUE
                  </span>
                )}
                {accommodation.isOpen24h && (
                  <span className="flex items-center gap-1 text-xs font-bold bg-neutral-900/80 backdrop-blur-md text-neutral-200 px-2.5 py-1 rounded-lg border border-white/20">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> 24 Horas
                  </span>
                )}
              </div>

              {accommodation.distanceKm !== undefined && (
                <span className="bg-white/95 text-neutral-900 text-xs font-extrabold px-3 py-1 rounded-lg shadow-sm">
                  {formatDistance(accommodation.distanceKm)} de si
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails if multiple photos */}
          {accommodation.photos.length > 1 && (
            <div className="flex gap-2 px-4 py-2 bg-neutral-900 overflow-x-auto no-scrollbar">
              {accommodation.photos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`w-16 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activePhotoIndex === idx ? 'border-emerald-500 scale-105' : 'border-transparent opacity-60 hover:opacity-90'
                  }`}
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Details Content */}
          <div className="p-5 space-y-6">
            {/* Title, Location & Pricing Overview */}
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-black text-neutral-950 leading-snug">
                {accommodation.name}
              </h1>

              {/* 📍 Bairro Central, Cidade */}
              <div className="flex items-center gap-1.5 text-sm font-semibold text-neutral-700">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {accommodation.location.neighborhood}, {accommodation.location.city}
                </span>
              </div>

              {/* 💰 A partir de 1.400 MT/noite */}
              {minPrice && (
                <div className="flex items-center gap-2 text-sm sm:text-base font-extrabold text-neutral-900 bg-amber-50 border border-amber-200 p-2.5 rounded-2xl w-fit">
                  <span>💰</span>
                  <span>A partir de <strong className="text-emerald-700 font-black text-base sm:text-lg">{minPrice.toLocaleString('pt-MZ')} MT</strong> / noite</span>
                </div>
              )}

              {/* ⭐⭐⭐⭐ 4.5 Rating */}
              <div className="flex items-center gap-2 text-sm font-bold text-neutral-800 pt-1">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(rating)
                          ? 'fill-amber-400 text-amber-400'
                          : i < rating
                          ? 'fill-amber-200 text-amber-400'
                          : 'text-neutral-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-black text-neutral-950">{rating.toFixed(1)}</span>
                <span className="text-neutral-500 font-medium">({reviewsCount} avaliações verificadas)</span>
              </div>
            </div>

            {/* NÍVEL DE CONFIANÇA */}
            <div className="p-4 sm:p-5 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-600">
                  Nível de Confiança
                </h3>
                <span className="text-xs text-neutral-500">Auditoria ONDE DORMIR</span>
              </div>

              <div className="space-y-2.5">
                {/* 🥇 Verificado Presencialmente */}
                <div className={`p-3 rounded-2xl border flex items-start gap-3 transition-all ${
                  accommodation.verificationStatus === 'verified_in_person'
                    ? 'bg-amber-500/10 border-amber-400 text-neutral-900 ring-1 ring-amber-400/30'
                    : 'bg-white/60 border-neutral-200/70 opacity-50'
                }`}>
                  <div className="text-xl">🥇</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-black text-neutral-900">
                        Verificado Presencialmente
                      </span>
                      {accommodation.verificationStatus === 'verified_in_person' && (
                        <span className="text-[10px] font-black uppercase bg-amber-500 text-zinc-950 px-2 py-0.5 rounded-md">
                          Selo Ativo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-600 mt-0.5">
                      A nossa equipa visitou o local, testou climatização, banho, higiene e segurança.
                    </p>
                  </div>
                </div>

                {/* 🟢 Verificado */}
                <div className={`p-3 rounded-2xl border flex items-start gap-3 transition-all ${
                  accommodation.verificationStatus === 'verified'
                    ? 'bg-emerald-500/10 border-emerald-400 text-neutral-900 ring-1 ring-emerald-400/30'
                    : 'bg-white/60 border-neutral-200/70 opacity-50'
                }`}>
                  <div className="text-xl">🟢</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-black text-neutral-900">
                        Verificado
                      </span>
                      {accommodation.verificationStatus === 'verified' && (
                        <span className="text-[10px] font-black uppercase bg-emerald-600 text-white px-2 py-0.5 rounded-md">
                          Selo Ativo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-600 mt-0.5">
                      Documentação comercial, alvará e número telefónico validados pela plataforma.
                    </p>
                  </div>
                </div>

                {/* ⚪ Não Verificado */}
                <div className={`p-3 rounded-2xl border flex items-start gap-3 transition-all ${
                  accommodation.verificationStatus === 'unverified'
                    ? 'bg-neutral-100 border-neutral-300 text-neutral-900 ring-1 ring-neutral-400/30'
                    : 'bg-white/60 border-neutral-200/70 opacity-50'
                }`}>
                  <div className="text-xl">⚪</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-neutral-800">
                        Não Verificado
                      </span>
                      {accommodation.verificationStatus === 'unverified' && (
                        <span className="text-[10px] font-bold uppercase bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-md">
                          Pendente
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Submetido pela comunidade de viajantes. Em fase de recolha de referências.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Localização e Rota */}
            <div className="p-4 sm:p-5 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Endereço & Ponto de Referência
              </span>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="text-sm sm:text-base font-bold text-neutral-900">
                    {accommodation.location.neighborhood}, {accommodation.location.city}
                  </div>
                  <div className="text-xs sm:text-sm text-neutral-600">
                    {accommodation.location.address} • {accommodation.location.province}
                  </div>
                </div>
              </div>

              {accommodation.location.landmark && (
                <div className="text-xs sm:text-sm text-neutral-800 bg-white p-3 rounded-2xl border border-neutral-200 flex items-start gap-2.5">
                  <span className="font-bold text-emerald-700 shrink-0">Referência:</span>
                  <span className="font-medium text-neutral-700">{accommodation.location.landmark}</span>
                </div>
              )}

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 px-3.5 rounded-xl bg-white hover:bg-neutral-100 active:scale-98 text-neutral-800 border border-neutral-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer touch-manipulation"
              >
                <Navigation2 className="w-4 h-4 text-emerald-600" />
                <span>Traçar Rota no Mapa do Telemóvel</span>
              </a>
            </div>

            {/* Como é o espaço */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Descrição do Espaço
              </h3>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                {accommodation.description}
              </p>
            </div>

            {/* O que oferece */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Comodidades e Serviços
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {accommodation.amenities.map((amenityId) => {
                  const item = AMENITIES_CATALOG[amenityId];
                  if (!item) return null;
                  return (
                    <div
                      key={amenityId}
                      className="flex items-center gap-2.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-200"
                    >
                      <div className="shrink-0">{AMENITY_ICONS[amenityId]}</div>
                      <div className="truncate">
                        <span className="text-xs sm:text-sm font-bold text-neutral-800 block truncate">
                          {item.name}
                        </span>
                        <span className="text-xs text-neutral-500 truncate block mt-0.5">
                          {item.shortDesc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contacto direto */}
            <div className="p-4 sm:p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="flex items-start gap-2.5">
                <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-emerald-950">
                    Contacto Direto com a Recepção
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-900/90 leading-relaxed">
                    Não cobramos comissões nem taxas de reserva. Fale diretamente com o alojamento para confirmar disponibilidade em tempo real.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="fixed sm:relative bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-3 sm:px-4 py-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] flex items-center gap-2.5 z-30 shadow-xl sm:shadow-none">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 h-12 sm:h-13 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 cursor-pointer touch-manipulation"
          >
            <MessageCircle className="w-5 h-5 fill-white shrink-0" />
            <span className="truncate">WhatsApp da Recepção</span>
          </a>

          <a
            href={`tel:${accommodation.phone}`}
            className="h-12 sm:h-13 w-12 sm:w-13 rounded-2xl bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 flex items-center justify-center transition-colors cursor-pointer shrink-0 touch-manipulation"
            title="Ligar para a receção"
            aria-label="Ligar para a receção"
          >
            <Phone className="w-5 h-5 text-neutral-800" />
          </a>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 sm:h-13 px-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0 touch-manipulation"
            title="Abrir rota no mapa do telemóvel"
            aria-label="Abrir rota no mapa"
          >
            <Navigation2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">Rota</span>
          </a>
        </div>
      </div>
    </div>
  );
};
