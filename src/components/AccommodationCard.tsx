import React from 'react';
import { 
  MapPin, 
  Heart, 
  ShieldCheck, 
  MessageCircle, 
  Crown
} from 'lucide-react';
import { Accommodation } from '../types';
import { formatDistanceShort, getWhatsAppInquiryUrl } from '../utils/geo';
import { contactUnlockService } from '../services/contactUnlockService';
import { 
  getPropertyServicesForAccommodation, 
  getRoomFeaturesForAccommodation 
} from '../utils/amenities';

interface AccommodationCardProps {
  accommodation: Accommodation;
  onSelect: (accommodation: Accommodation) => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  layout?: 'compact' | 'detailed';
}

// Key conditions prioritized: Quarto Casal, AC, WC Privativo, Wi-Fi, Estacionamento, Piscina, Bar, Restaurante, 24h
const getKeyConditions = (acc: Accommodation): string[] => {
  const conditions: string[] = [];
  const propertyServices = getPropertyServicesForAccommodation(acc);
  const roomFeatures = getRoomFeaturesForAccommodation(acc);

  const hasDoubleBed = roomFeatures.some((r) => r.id === 'double_bed');
  const hasPrivateBathroom = roomFeatures.some((r) => r.id === 'private_bathroom');
  const hasAC = roomFeatures.some((r) => r.id === 'ac');
  const hasWifi = propertyServices.some((s) => s.id === 'wifi');
  const hasBar = propertyServices.some((s) => s.id === 'bar');
  const hasRestaurant = propertyServices.some((s) => s.id === 'restaurant');
  const hasPool = propertyServices.some((s) => s.id === 'pool');
  const hasParking = propertyServices.some((s) => s.id === 'parking');
  const hasGenerator = propertyServices.some((s) => s.id === 'generator') || acc.isOpen24h;

  // Prioritize room comfort first
  if (hasDoubleBed) conditions.push('Quarto Casal');
  if (hasPrivateBathroom) conditions.push('WC Privativo');
  if (hasAC) conditions.push('AC');
  if (hasWifi) conditions.push('Wi-Fi');

  // Then real property services (Bar, Restaurante, Piscina, Parque, 24h)
  if (hasBar) conditions.push('Bar');
  if (hasRestaurant) conditions.push('Restaurante');
  if (hasPool) conditions.push('Piscina');
  if (hasParking) conditions.push('Estacionamento');
  if (hasGenerator) conditions.push('24h');

  return conditions.slice(0, 4);
};

export const AccommodationCard: React.FC<AccommodationCardProps> = ({
  accommodation,
  onSelect,
  isSaved,
  onToggleSave,
}) => {
  const whatsappUrl = getWhatsAppInquiryUrl(
    accommodation.whatsapp,
    accommodation.name,
    `Olá! Vi a ${accommodation.name} no Onde Dormir e gostaria de confirmar disponibilidade de quarto casal/privativo.`
  );
  const minPrice = accommodation.priceEstimate?.approxMin;
  const keyConditions = getKeyConditions(accommodation);

  return (
    <div className={`bg-white rounded-3xl border transition-all overflow-hidden flex flex-col h-full group active:scale-[0.99] touch-manipulation ${
      accommodation.isPremium 
        ? 'border-amber-300 ring-2 ring-amber-400/20 shadow-xs' 
        : 'border-neutral-200/90 hover:border-emerald-300 shadow-2xs hover:shadow-md'
    }`}>
      {/* 1. Foto Principal */}
      <div 
        onClick={() => onSelect(accommodation)}
        className="relative aspect-[16/9] bg-neutral-100 overflow-hidden cursor-pointer shrink-0"
      >
        <img
          src={accommodation.photos[0]}
          alt={accommodation.name}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          loading="lazy"
        />

        {/* Premium Badge (se aplicável) */}
        {accommodation.isPremium && (
          <div className="absolute top-2.5 left-2.5 pointer-events-none">
            <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-amber-400 text-zinc-950 px-2 py-0.5 rounded-md shadow-xs">
              <Crown className="w-3 h-3 fill-zinc-950" /> PREMIUM
            </span>
          </div>
        )}

        {/* Botão Favorito */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(accommodation.id);
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs text-white hover:bg-black/60 active:scale-90 flex items-center justify-center transition-all cursor-pointer"
          title={isSaved ? 'Remover dos guardados' : 'Guardar alojamento'}
          aria-label={isSaved ? 'Remover dos guardados' : 'Guardar alojamento'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isSaved ? 'fill-rose-500 text-rose-500' : 'text-white'
            }`}
          />
        </button>
      </div>

      {/* Card Body: Nome, Verificação, Distância, Preço, Condições, WhatsApp */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
        <div 
          onClick={() => onSelect(accommodation)}
          className="cursor-pointer space-y-1.5"
        >
          {/* 2. Nome */}
          <h3 className="font-extrabold text-neutral-900 text-base leading-snug group-hover:text-emerald-700 transition-colors line-clamp-1">
            {accommodation.name}
          </h3>

          {/* 6. Verificação */}
          {accommodation.verificationStatus === 'verified_in_person' ? (
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Verificado Presencialmente</span>
            </div>
          ) : accommodation.verificationStatus === 'verified' ? (
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Verificado</span>
            </div>
          ) : null}

          {/* 4. Distância e Localização */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-600 truncate font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">
              {accommodation.location.neighborhood || accommodation.location.district || accommodation.location.city}
            </span>
            {accommodation.distanceKm !== undefined && (
              <>
                <span aria-hidden="true" className="text-neutral-300">·</span>
                <span className="text-emerald-700 font-bold shrink-0">
                  {formatDistanceShort(accommodation.distanceKm).replace('.', ',')}
                </span>
              </>
            )}
          </div>

          {/* 3. Preço */}
          <div className="text-xs text-neutral-600 pt-0.5">
            {minPrice ? (
              <span>
                A partir de <strong className="text-emerald-700 text-sm font-black">{minPrice.toLocaleString('pt-MZ')} MT</strong><span className="text-[11px] text-neutral-400">/noite</span>
              </span>
            ) : (
              <span className="font-bold text-neutral-700">Sob consulta</span>
            )}
          </div>

          {/* 5. Condições Principais */}
          {keyConditions.length > 0 && (
            <div className="text-[11.5px] text-neutral-500 font-medium truncate pt-0.5">
              {keyConditions.join(' · ')}
            </div>
          )}
        </div>

        {/* 7. WhatsApp (Ação Principal Direta) */}
        <div className="pt-2 mt-auto border-t border-neutral-100">
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
            className="w-full h-11 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer touch-manipulation"
            title="Contactar directamente via WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-white shrink-0" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
