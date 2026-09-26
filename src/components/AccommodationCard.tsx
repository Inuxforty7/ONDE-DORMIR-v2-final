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
    badgeColor: 'bg-neutral-100 text-neutral-800 border-neutral-200',
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
        ? 'border-amber-300 ring-2 ring-amber-400/20 shadow-md shadow-amber-900/5' 
        : accommodation.featured 
        ? 'border-blue-200 shadow-sm' 
        : 'border-neutral-200/90 hover:border-emerald-300 shadow-xs hover:shadow-md'
    }`}>
      {/* Top Image area */}
      <div 
        onClick={() => onSelect(accommodation)}
        className="relative aspect-16/10 bg-neutral-100 overflow-hidden cursor-pointer"
      >
        <img
          src={accommodation.photos[0]}
          alt={accommodation.name}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30 pointer-events-none" />

        {/* Top badges: Type & Paid Plan Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-xl border shadow-xs backdrop-blur-md bg-white/95 ${typeMeta.badgeColor}`}>
              {typeMeta.label}
            </span>

            {/* Paid Plan Badges */}
            {accommodation.isPremium && (
              <span className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 px-2.5 py-1 rounded-xl shadow-sm">
                <Crown className="w-3.5 h-3.5 fill-zinc-950" /> PREMIUM
              </span>
            )}

            {accommodation.featured && !accommodation.isPremium && (
              <span className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider bg-amber-400 text-neutral-950 px-2.5 py-1 rounded-xl shadow-xs">
                <Star className="w-3 h-3 fill-neutral-950" /> DESTAQUE
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(accommodation.id);
            }}
            className="w-9 h-9 rounded-full bg-white/95 hover:bg-white text-neutral-700 shadow-sm backdrop-blur-md transition-all active:scale-90 flex items-center justify-center cursor-pointer pointer-events-auto"
            title={isSaved ? 'Remover dos guardados' : 'Guardar hospedagem'}
            aria-label={isSaved ? 'Remover dos guardados' : 'Guardar hospedagem'}
          >
            <Heart
              className={`w-4.5 h-4.5 transition-colors ${
                isSaved ? 'fill-rose-500 text-rose-500' : 'text-neutral-700'
              }`}
            />
          </button>
        </div>

        {/* Bottom image overlay (Trust Level & Distance) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white pointer-events-none">
          <div className="flex items-center gap-1.5">
            {/* Trust Level Pill */}
            {accommodation.verificationStatus === 'verified_in_person' ? (
              <span className="flex items-center gap-1 text-xs font-black bg-amber-500 text-zinc-950 px-2.5 py-1 rounded-lg shadow-sm border border-amber-300">
                <Award className="w-3.5 h-3.5 fill-zinc-950" /> Presencial
              </span>
            ) : accommodation.verificationStatus === 'verified' ? (
              <span className="flex items-center gap-1 text-xs font-bold bg-emerald-700/95 text-white px-2.5 py-1 rounded-lg shadow-xs backdrop-blur-xs">
                <ShieldCheck className="w-3.5 h-3.5" /> Verificado
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-medium bg-neutral-800/80 text-neutral-300 px-2 py-0.5 rounded-lg backdrop-blur-xs">
                ⚪ Não Verificado
              </span>
            )}

            {accommodation.isOpen24h && (
              <span className="flex items-center gap-1 text-xs font-bold bg-neutral-900/90 text-white px-2 py-1 rounded-lg backdrop-blur-xs">
                <Clock className="w-3 h-3 text-amber-400" /> 24h
              </span>
            )}
          </div>

          {accommodation.distanceKm !== undefined && (
            <span className="bg-neutral-900/90 text-white text-xs font-extrabold px-3 py-1 rounded-lg shadow-xs backdrop-blur-xs">
              {formatDistance(accommodation.distanceKm)} de si
            </span>
          )}
        </div>
      </div>

      {/* Card Body formatted exactly as requested */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div 
          onClick={() => onSelect(accommodation)}
          className="cursor-pointer space-y-2"
        >
          {/* 1. Nome do Alojamento */}
          <h3 className="font-black text-neutral-950 text-base sm:text-lg leading-snug group-hover:text-emerald-700 transition-colors line-clamp-1">
            {accommodation.name}
          </h3>

          {/* 2. 📍 Bairro, Cidade */}
          <div className="flex items-start gap-1.5 text-xs sm:text-sm text-neutral-600 font-medium">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="line-clamp-1">
              {accommodation.location.neighborhood}, {accommodation.location.city}
              {accommodation.location.landmark ? ` • ${accommodation.location.landmark}` : ''}
            </span>
          </div>

          {/* 3. 💰 A partir de 1.400 MT/noite */}
          {minPrice && (
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-neutral-900 bg-amber-50/80 border border-amber-200/80 px-2.5 py-1 rounded-xl w-fit">
              <span>💰</span>
              <span>A partir de <strong className="text-emerald-700 text-sm sm:text-base font-black">{minPrice.toLocaleString('pt-MZ')} MT</strong>/noite</span>
            </div>
          )}

          {/* 4. ⭐⭐⭐⭐ 4.5 Rating */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 pt-0.5">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(rating)
                      ? 'fill-amber-400 text-amber-400'
                      : i < rating
                      ? 'fill-amber-200 text-amber-400'
                      : 'text-neutral-300'
                  }`}
                />
              ))}
            </div>
            <span className="font-black text-neutral-900 text-xs sm:text-sm">{rating.toFixed(1)}</span>
            <span className="text-neutral-400 font-medium">({reviewsCount} avaliações)</span>
          </div>

          <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed pt-1">
            {accommodation.tagline || accommodation.description}
          </p>
        </div>

        {/* Action Row */}
        <div className="pt-3 border-t border-neutral-100 flex items-center gap-2">
          {/* WhatsApp Direct */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 h-11 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer touch-manipulation"
            title="Contactar a recepção no WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-white shrink-0" />
            <span>WhatsApp</span>
          </a>

          {/* Phone */}
          <a
            href={`tel:${accommodation.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="h-11 px-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 touch-manipulation"
            title="Ligar para a recepção"
            aria-label="Ligar para a recepção"
          >
            <Phone className="w-4 h-4 text-neutral-800" />
            <span>Ligar</span>
          </a>

          {/* Route */}
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-11 h-11 rounded-xl bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 flex items-center justify-center transition-all cursor-pointer shrink-0 touch-manipulation"
            title="Ver rota no mapa"
            aria-label="Ver rota no mapa"
          >
            <Navigation2 className="w-4.5 h-4.5 text-neutral-800" />
          </a>
        </div>
      </div>
    </div>
  );
};
