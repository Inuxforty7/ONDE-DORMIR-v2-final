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
  Flame,
  Flag
} from 'lucide-react';
import { Accommodation, AmenityId } from '../types';
import { formatDistance, getDirectionsUrl, getWhatsAppInquiryUrl } from '../utils/geo';
import { getPlatformTenureText } from '../utils/tenure';
import { AMENITIES_CATALOG, ACCOMMODATION_TYPE_LABELS } from '../utils/amenities';
import { analyticsService } from '../services/analyticsService';
import { propertyService } from '../services/propertyService';

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
  const [reportState, setReportState] = useState<'idle' | 'reporting' | 'sent'>('idle');
  const [showAllSeals, setShowAllSeals] = useState(false);

  if (!isOpen || !accommodation) return null;

  const handleReport = async (reason: string) => {
    setReportState('reporting');
    await propertyService.submitReport(
      'PROPERTY',
      accommodation.id,
      reason,
      `Reportado pelo utilizador na aplicação para ${accommodation.name} (${accommodation.location.city})`
    );
    setReportState('sent');
    setTimeout(() => setReportState('idle'), 4000);
  };

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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 overflow-hidden animate-in fade-in duration-200">
      <div 
        className="bg-white w-full sm:max-w-2xl sm:rounded-3xl h-[100dvh] sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative max-w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Top Control Bar */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 z-20 flex items-center justify-between pointer-events-none">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border shadow-md backdrop-blur-md bg-white/95 pointer-events-auto ${typeMeta.badgeColor}`}>
            {typeMeta.label}
          </span>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => onToggleSave(accommodation.id)}
              className="w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-black/60 hover:bg-black/80 text-white shadow-md backdrop-blur-md transition-all active:scale-95 flex items-center justify-center cursor-pointer touch-manipulation"
              title={isSaved ? 'Remover dos guardados' : 'Guardar hospedagem'}
              aria-label={isSaved ? 'Remover dos guardados' : 'Guardar hospedagem'}
            >
              <Heart
                className={`w-4 sm:w-5 h-4 sm:h-5 transition-colors ${
                  isSaved ? 'fill-rose-500 text-rose-500' : 'text-white'
                }`}
              />
            </button>

            <button
              onClick={onClose}
              className="w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-black/60 hover:bg-black/80 text-white shadow-md backdrop-blur-md transition-all active:scale-95 flex items-center justify-center cursor-pointer touch-manipulation"
              title="Fechar"
              aria-label="Fechar"
            >
              <X className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 w-full pb-4 sm:pb-6">
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
                <span className="bg-emerald-950/90 text-emerald-300 border border-emerald-400/50 text-xs font-black px-3 py-1 rounded-xl shadow-sm backdrop-blur-md flex items-center gap-1.5">
                  <Navigation2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{formatDistance(accommodation.distanceKm)}</span>
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
          <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6">
            {/* Title, Location & Pricing Overview */}
            <div className="space-y-2">
              <h1 className="text-lg sm:text-2xl font-black text-neutral-950 leading-snug">
                {accommodation.name}
              </h1>

              {/* 📍 Bairro Central, Cidade */}
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-700">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {accommodation.location.neighborhood}, {accommodation.location.city}
                </span>
              </div>

              {/* 💰 A partir de 1.400 MT/noite */}
              {minPrice && (
                <div className="flex items-center gap-2 text-xs sm:text-base font-extrabold text-neutral-900 bg-amber-50 border border-amber-200 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl w-fit">
                  <span>💰</span>
                  <span>A partir de <strong className="text-emerald-700 font-black text-sm sm:text-lg">{minPrice.toLocaleString('pt-MZ')} MT</strong> / noite</span>
                </div>
              )}

              {/* ⭐⭐⭐⭐ 4.5 Rating & Tenure */}
              <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm font-bold text-neutral-800 pt-0.5">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${
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
                <span className="text-neutral-500 font-medium">({reviewsCount} avaliações)</span>

                <span className="text-neutral-300">•</span>

                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                  <Clock className="w-3 h-3 text-emerald-600" />
                  <span>{getPlatformTenureText(accommodation.registeredAt, accommodation.platformTenure, accommodation.id)}</span>
                </span>
              </div>
            </div>

            {/* NÍVEL DE CONFIANÇA */}
            <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-neutral-50 border border-neutral-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-600">
                  Nível de Confiança
                </h3>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">Auditoria ONDE DORMIR</span>
              </div>

              <div className="space-y-2">
                {/* Active Seal Card */}
                {accommodation.verificationStatus === 'verified_in_person' && (
                  <div className="p-3 rounded-xl sm:rounded-2xl border bg-amber-500/10 border-amber-400 text-neutral-900 ring-1 ring-amber-400/30 flex items-start gap-2.5">
                    <div className="text-lg sm:text-xl shrink-0">🥇</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs sm:text-sm font-black text-neutral-900">
                          Verificado Presencialmente
                        </span>
                        <span className="text-[9px] font-black uppercase bg-amber-500 text-zinc-950 px-2 py-0.5 rounded-md shrink-0">
                          Selo Ativo
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-neutral-600 mt-0.5 leading-snug">
                        A nossa equipa visitou o local, testou climatização, banho, higiene e segurança.
                      </p>
                    </div>
                  </div>
                )}

                {accommodation.verificationStatus === 'verified' && (
                  <div className="p-3 rounded-xl sm:rounded-2xl border bg-emerald-500/10 border-emerald-400 text-neutral-900 ring-1 ring-emerald-400/30 flex items-start gap-2.5">
                    <div className="text-lg sm:text-xl shrink-0">🟢</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs sm:text-sm font-black text-neutral-900">
                          Verificado
                        </span>
                        <span className="text-[9px] font-black uppercase bg-emerald-600 text-white px-2 py-0.5 rounded-md shrink-0">
                          Selo Ativo
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-neutral-600 mt-0.5 leading-snug">
                        Documentação comercial, alvará e número telefónico validados pela plataforma.
                      </p>
                    </div>
                  </div>
                )}

                {accommodation.verificationStatus === 'unverified' && (
                  <div className="p-3 rounded-xl sm:rounded-2xl border bg-neutral-100 border-neutral-300 text-neutral-900 flex items-start gap-2.5">
                    <div className="text-lg sm:text-xl shrink-0">⚪</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs sm:text-sm font-bold text-neutral-800">
                          Não Verificado
                        </span>
                        <span className="text-[9px] font-bold uppercase bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-md shrink-0">
                          Pendente
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5 leading-snug">
                        Submetido pela comunidade de viajantes. Em fase de recolha de referências.
                      </p>
                    </div>
                  </div>
                )}

                {/* Collapsible details for other seals */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAllSeals(!showAllSeals)}
                    className="text-[11px] font-bold text-neutral-500 hover:text-neutral-800 underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{showAllSeals ? 'Ocultar definições de selos' : 'Entender os outros selos de auditoria'}</span>
                  </button>

                  {showAllSeals && (
                    <div className="mt-2 space-y-2 pt-2 border-t border-neutral-200/80 animate-in fade-in duration-150">
                      {accommodation.verificationStatus !== 'verified_in_person' && (
                        <div className="p-2.5 rounded-xl border bg-white/70 border-neutral-200 flex items-start gap-2 text-neutral-600">
                          <span className="text-sm">🥇</span>
                          <div>
                            <span className="text-xs font-bold text-neutral-800 block">Verificado Presencialmente</span>
                            <span className="text-[11px] leading-tight block text-neutral-500">Visita no local com teste de instalações e higiene.</span>
                          </div>
                        </div>
                      )}
                      {accommodation.verificationStatus !== 'verified' && (
                        <div className="p-2.5 rounded-xl border bg-white/70 border-neutral-200 flex items-start gap-2 text-neutral-600">
                          <span className="text-sm">🟢</span>
                          <div>
                            <span className="text-xs font-bold text-neutral-800 block">Verificado</span>
                            <span className="text-[11px] leading-tight block text-neutral-500">Validação documental e contacto telefónico.</span>
                          </div>
                        </div>
                      )}
                      {accommodation.verificationStatus !== 'unverified' && (
                        <div className="p-2.5 rounded-xl border bg-white/70 border-neutral-200 flex items-start gap-2 text-neutral-600">
                          <span className="text-sm">⚪</span>
                          <div>
                            <span className="text-xs font-bold text-neutral-800 block">Não Verificado</span>
                            <span className="text-[11px] leading-tight block text-neutral-500">Submetido por utilizadores, em auditoria.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Localização e Rota */}
            <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-neutral-50 border border-neutral-200 space-y-2.5 sm:space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
                Endereço & Ponto de Referência
              </span>

              <div className="flex items-start gap-2.5 sm:gap-3">
                <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="text-xs sm:text-base font-bold text-neutral-900 truncate">
                    {accommodation.location.neighborhood}, {accommodation.location.city}
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs text-neutral-600 leading-snug">
                      {accommodation.location.address} • {accommodation.location.province}
                    </span>
                    {accommodation.distanceKm !== undefined && (
                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 shrink-0">
                        <Navigation2 className="w-3 h-3 text-emerald-600" />
                        <span>{formatDistance(accommodation.distanceKm)}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {accommodation.location.landmark && (
                <div className="text-xs text-neutral-800 bg-white p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-neutral-200 flex items-start gap-2 sm:gap-2.5">
                  <span className="font-bold text-emerald-700 shrink-0">Referência:</span>
                  <span className="font-medium text-neutral-700 leading-snug">{accommodation.location.landmark}</span>
                </div>
              )}

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-10 sm:h-11 px-3.5 rounded-xl bg-white hover:bg-neutral-100 active:scale-98 text-neutral-800 border border-neutral-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer touch-manipulation shadow-2xs"
              >
                <Navigation2 className="w-4 h-4 text-emerald-600" />
                <span>Traçar Rota no Mapa do Telemóvel</span>
              </a>
            </div>

            {/* Como é o espaço */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Descrição do Espaço
              </h3>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                {accommodation.description}
              </p>
            </div>

            {/* O que oferece */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Comodidades e Serviços
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                {accommodation.amenities.map((amenityId) => {
                  const item = AMENITIES_CATALOG[amenityId];
                  if (!item) return null;
                  return (
                    <div
                      key={amenityId}
                      className="flex items-center gap-2 sm:gap-2.5 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-neutral-50 border border-neutral-200"
                    >
                      <div className="shrink-0">{AMENITY_ICONS[amenityId]}</div>
                      <div className="truncate">
                        <span className="text-xs sm:text-sm font-bold text-neutral-800 block truncate">
                          {item.name}
                        </span>
                        <span className="text-[10px] sm:text-xs text-neutral-500 truncate block mt-0.5">
                          {item.shortDesc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contacto direto */}
            <div className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
              <div className="flex items-start gap-2 sm:gap-2.5">
                <Info className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-bold text-emerald-950">
                    Contacto Direto com a Recepção
                  </h4>
                  <p className="text-xs text-emerald-900/90 leading-relaxed">
                    Não cobramos comissões nem taxas de reserva. Fale diretamente com o alojamento para confirmar disponibilidade em tempo real.
                  </p>
                </div>
              </div>
            </div>

            {/* Reportar Irregularidade (Auditoria & Segurança) */}
            <div className="pt-1 text-center">
              {reportState === 'sent' ? (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Denúncia submetida com sucesso para auditoria da equipa técnica.</span>
                </span>
              ) : reportState === 'reporting' ? (
                <span className="text-xs text-neutral-400">A submeter relatório de segurança...</span>
              ) : (
                <button
                  onClick={() => handleReport('Informações incorretas ou suspeita de irregularidade')}
                  className="text-[11px] text-neutral-400 hover:text-rose-600 transition-colors inline-flex items-center gap-1.5 cursor-pointer font-medium p-1"
                  title="Reportar dados desatualizados ou suspeita de fraude"
                >
                  <Flag className="w-3 h-3 text-neutral-400" />
                  <span>Reportar irregularidade ou dados incorretos</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="shrink-0 bg-white border-t border-neutral-200 px-3.5 sm:px-4 py-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] flex items-center gap-2 sm:gap-2.5 z-30 shadow-lg sm:shadow-none">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => analyticsService.trackWhatsAppClick(accommodation.id, accommodation.location.province)}
            className="flex-1 h-11 sm:h-12 px-3.5 sm:px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 cursor-pointer touch-manipulation"
          >
            <MessageCircle className="w-4 sm:w-5 h-4 sm:h-5 fill-white shrink-0" />
            <span className="truncate">WhatsApp da Recepção</span>
          </a>

          <a
            href={`tel:${accommodation.phone}`}
            onClick={() => analyticsService.trackPhoneClick(accommodation.id, accommodation.location.province)}
            className="h-11 sm:h-12 w-11 sm:w-12 rounded-xl sm:rounded-2xl bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 flex items-center justify-center transition-colors cursor-pointer shrink-0 touch-manipulation"
            title="Ligar para a receção"
            aria-label="Ligar para a receção"
          >
            <Phone className="w-4 sm:w-5 h-4 sm:h-5 text-neutral-800" />
          </a>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 sm:h-12 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0 touch-manipulation"
            title="Abrir rota no mapa do telemóvel"
            aria-label="Abrir rota no mapa"
          >
            <Navigation2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">Rota</span>
          </a>
        </div>
      </div>
    </div>
  );
};
