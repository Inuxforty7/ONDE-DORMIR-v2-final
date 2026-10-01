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
import { contactUnlockService } from '../services/contactUnlockService';

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
    <div className={`bg-white rounded-3xl border transition-all overflow-hidden flex flex-col h-full group ${
      accommodation.isPremium 
        ? 'border-amber-300 ring-2 ring-amber-400/20 shadow-sm' 
        : 'border-neutral-200/90 hover:border-emerald-300 shadow-2xs hover:shadow-md'
    }`}>
      {/* Top Image area */}
      <div 
        onClick={() => onSelect(accommodation)}
        className="relative aspect-[16/10] sm:aspect-[16/9] bg-neutral-100 overflow-hidden cursor-pointer shrink-0"
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
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-black/65 backdrop-blur-md text-white">
              {typeMeta.label}
            </span>

            {accommodation.photos && accommodation.photos.length > 1 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-black/50 backdrop-blur-md text-white">
                {accommodation.photos.length} fotos
              </span>
            )}

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
            className="w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all active:scale-90 flex items-center justify-center cursor-pointer pointer-events-auto shrink-0"
            title={isSaved ? 'Remover dos guardados' : 'Guardar hospedagem'}
            aria-label={isSaved ? 'Remover dos guardados' : 'Guardar hospedagem'}
          >
            <Heart
              className={`w-4.5 h-4.5 transition-colors ${
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
            ) : accommodation.verificationStatus === 'pending' || accommodation.isPendingVerification ? (
              <span className="flex items-center gap-1 text-[11px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-md shadow-xs">
                <Clock className="w-3 h-3" /> Verificação Pendente
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
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
        <div 
          onClick={() => onSelect(accommodation)}
          className="cursor-pointer space-y-1"
        >
          {/* 1. Nome do Alojamento */}
          <h3 className="font-extrabold text-neutral-900 text-base leading-snug group-hover:text-emerald-700 transition-colors line-clamp-1">
            {accommodation.name}
          </h3>

          {/* 2. Localização & Antiguidade na Plataforma (Sem duplicação de categoria) */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-600 truncate">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-semibold text-neutral-800 truncate">
              {accommodation.location.neighborhood || accommodation.location.city}, {accommodation.location.city}
            </span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span className="text-neutral-500 text-[11px] shrink-0 truncate">
              {getPlatformTenureText(accommodation.registeredAt, accommodation.platformTenure, accommodation.id)}
            </span>
          </div>

          {/* 3. Ponto de Referência (Se existir) */}
          {accommodation.location.landmark && (
            <div className="text-[11px] text-neutral-500 line-clamp-1 flex items-center gap-1 pt-0.5">
              <span className="text-neutral-400 font-bold">Ref:</span>
              <span className="truncate">{accommodation.location.landmark}</span>
            </div>
          )}

          {/* 4. Preço & Avaliação */}
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

        {/* Action Row - Clear distinction between WhatsApp (chat), Ligar (voice call), and Rota (maps) */}
        <div className="pt-2 mt-auto border-t border-neutral-100 flex items-center gap-2">
          {/* 1. WhatsApp Mensagem */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              const allowed = contactUnlockService.triggerContactAttempt(
                {
                  id: accommodation.id,
                  name: accommodation.name,
                  photo: accommodation.photos?.[0],
                  phone: accommodation.phone,
                  whatsapp: accommodation.whatsapp,
                  module: 'accommodation',
                  moduleLabel: 'Onde Dormir',
                  unlockFee: 1000,
                },
                accommodation.isContactUnlocked
              );
              if (!allowed) {
                e.preventDefault();
              }
            }}
            className="flex-1 h-11 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer touch-manipulation min-h-[44px]"
            title="Enviar mensagem no WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-white shrink-0" />
            <span>WhatsApp</span>
          </a>

          {/* 2. Chamada Telefónica Direta */}
          <a
            href={`tel:${accommodation.phone.replace(/\s+/g, '')}`}
            onClick={(e) => {
              e.stopPropagation();
              const allowed = contactUnlockService.triggerContactAttempt(
                {
                  id: accommodation.id,
                  name: accommodation.name,
                  photo: accommodation.photos?.[0],
                  phone: accommodation.phone,
                  whatsapp: accommodation.whatsapp,
                  module: 'accommodation',
                  moduleLabel: 'Onde Dormir',
                  unlockFee: 1000,
                },
                accommodation.isContactUnlocked
              );
              if (!allowed) {
                e.preventDefault();
              }
            }}
            className="h-11 px-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 active:scale-95 text-neutral-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 touch-manipulation min-h-[44px]"
            title="Fazer chamada telefónica de voz"
            aria-label="Fazer chamada telefónica"
          >
            <Phone className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
            <span>Ligar</span>
          </a>

          {/* 3. Abrir Rota GPS */}
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-11 h-11 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 active:scale-95 text-neutral-800 flex items-center justify-center transition-all cursor-pointer shrink-0 touch-manipulation min-h-[44px] min-w-[44px]"
            title="Abrir rota no Google Maps"
            aria-label="Abrir rota no Google Maps"
          >
            <Navigation2 className="w-4 h-4 text-emerald-700" />
          </a>
        </div>
      </div>
    </div>
  );
};
