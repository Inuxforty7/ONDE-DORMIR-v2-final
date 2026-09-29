import React from 'react';
import { 
  MapPin, 
  Heart, 
  ShieldCheck, 
  MessageCircle, 
  Navigation2, 
  Phone,
  Clock,
  Star,
  Award,
  Crown
} from 'lucide-react';
import { Accommodation } from '../types';
import { formatDistance, getDirectionsUrl, getWhatsAppInquiryUrl } from '../utils/geo';
import { ACCOMMODATION_TYPE_LABELS } from '../utils/amenities';
import { getPlatformTenureText } from '../utils/tenure';

interface AccommodationCardProps {
  accommodation: Accommodation;
  onSelect: (accommodation: Accommodation) => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  layout?: 'compact' | 'detailed';
}

export const AccommodationCard: React.FC<AccommodationCardProps> = ({
  accommodation,
  onSelect,
  isSaved,
  onToggleSave,
}) => {
  const typeMeta = ACCOMMODATION_TYPE_LABELS[accommodation.type] || {
    label: accommodation.type,
    badgeColor: 'bg-neutral-900/80 text-white',
  };

  const whatsappUrl = getWhatsAppInquiryUrl(accommodation.whatsapp, accommodation.name);
  const directionsUrl = getDirectionsUrl(
    accommodation.location.lat,
    accommodation.location.lng,
    accommodation.name
  );

  const minPrice = accommodation.priceEstimate?.approxMin;
  const rating = accommodation.rating || 4.5;
  const reviewsCount = accommodation.reviewsCount || 20;

  return (
    <div className={`bg-white rounded-3xl border transition-all overflow-hidden flex flex-col group ${
      accommodation.isPremium 
        ? 'border-amber-300 ring-2 ring-amber-400/20 shadow-sm' 
        : 'border-neutral-200/90 hover:border-emerald-300 shadow-2xs hover:shadow-md'
    }`}>
      {/* Top Image area */}
      <div 
        onClick={() => onSelect(accommodation)}
        className="relative aspect-16/10 sm:aspect-16/9 bg-neutral-900 overflow-hidden cursor-pointer"
      >
        <img
          src={accommodation.photos[0]}
          alt={accommodation.name}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/30 pointer-events-none" />

        {/* Top badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white border border-white/20">
              {typeMeta.label}
            </span>

            {accommodation.isPremium && (
              <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-amber-400 text-zinc-950 px-2 py-0.5 rounded-lg shadow-xs">
                <Crown className="w-3 h-3 fill-zinc-950" /> PREMIUM
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(accommodation.id);
            }}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all active:scale-90 flex items-center justify-center cursor-pointer pointer-events-auto"
            title={isSaved ? 'Remover dos guardados' : 'Guardar hospedagem'}
            aria-label={isSaved ? 'Remover dos guardados' : 'Guardar hospedagem'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isSaved ? 'fill-rose-500 text-rose-500' : 'text-white'
              }`}
            />
          </button>
        </div>

        {/* Bottom image overlay: Status & Distance */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white pointer-events-none">
          <div className="flex items-center gap-1.5">
            {accommodation.verificationStatus === 'verified_in_person' || accommodation.verificationStatus === 'verified' ? (
              <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-md shadow-xs">
                <ShieldCheck className="w-3 h-3" /> Verificado
              </span>
            ) : null}

            {accommodation.isOpen24h && (
              <span className="flex items-center gap-1 text-[11px] font-bold bg-black/60 text-white px-2 py-0.5 rounded-md backdrop-blur-xs">
                <Clock className="w-3 h-3 text-amber-300" /> 24h
              </span>
            )}
          </div>

          {accommodation.distanceKm !== undefined && (
            <span className="bg-emerald-950/90 text-emerald-300 border border-emerald-400/50 text-[11px] font-black px-2.5 py-0.5 rounded-md backdrop-blur-md flex items-center gap-1 shadow-sm">
              <Navigation2 className="w-3 h-3 text-emerald-300" />
              <span>{formatDistance(accommodation.distanceKm)}</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div 
          onClick={() => onSelect(accommodation)}
          className="cursor-pointer space-y-1.5"
        >
          {/* 1. Nome do Alojamento */}
          <h3 className="font-extrabold text-neutral-900 text-base leading-snug group-hover:text-emerald-700 transition-colors line-clamp-1">
            {accommodation.name}
          </h3>

          {/* 🕒 Antiguidade / Tempo na Plataforma */}
          <div className="flex items-center gap-1 text-[11px] font-semibold text-neutral-600 bg-neutral-100/90 border border-neutral-200/70 px-2 py-0.5 rounded-md w-fit">
            <Clock className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>{getPlatformTenureText(accommodation.registeredAt, accommodation.platformTenure, accommodation.id)}</span>
          </div>

          {/* 2. Bairro, Cidade & Distância Preliminar */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs text-neutral-600">
            <div className="flex items-center gap-1 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">
                {accommodation.location.neighborhood}, {accommodation.location.city}
              </span>
            </div>
            {accommodation.distanceKm !== undefined && (
              <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/90 shrink-0 shadow-2xs">
                <Navigation2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                <span>{formatDistance(accommodation.distanceKm)}</span>
              </span>
            )}
            {accommodation.location.landmark && (
              <span className="text-[11px] text-neutral-400 truncate">
                · {accommodation.location.landmark}
              </span>
            )}
          </div>

          {/* 3. Preço & Rating (Inline minimal clean layout) */}
          <div className="flex items-center justify-between pt-1">
            {minPrice ? (
              <div className="text-xs text-neutral-600">
                A partir de <strong className="text-emerald-700 text-sm sm:text-base font-black">{minPrice.toLocaleString('pt-MZ')} MT</strong><span className="text-[11px] text-neutral-400">/noite</span>
              </div>
            ) : (
              <div className="text-xs font-bold text-neutral-700">Consulte diárias</div>
            )}

            <div className="flex items-center gap-1 text-xs font-bold text-neutral-800">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
              <span>{rating.toFixed(1)}</span>
              <span className="text-neutral-400 font-normal text-[11px]">({reviewsCount})</span>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-2 border-t border-neutral-100 flex items-center gap-2">
          {/* WhatsApp Direct */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 h-10 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer touch-manipulation"
            title="Contactar a recepção no WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-white shrink-0" />
            <span>WhatsApp</span>
          </a>

          {/* Phone */}
          <a
            href={`tel:${accommodation.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="h-10 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shrink-0 touch-manipulation"
            title="Ligar para a recepção"
            aria-label="Ligar para a recepção"
          >
            <Phone className="w-3.5 h-3.5 text-neutral-800" />
            <span>Ligar</span>
          </a>

          {/* Route */}
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-10 h-10 rounded-xl bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 flex items-center justify-center transition-all cursor-pointer shrink-0 touch-manipulation"
            title="Ver rota no mapa"
            aria-label="Ver rota no mapa"
          >
            <Navigation2 className="w-4 h-4 text-neutral-800" />
          </a>
        </div>
      </div>
    </div>
  );
};
