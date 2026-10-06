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
  Flag,
  ChevronDown,
  ChevronUp,
  FileText,
  Sparkles,
  BedDouble
} from 'lucide-react';
import { Accommodation, AmenityId } from '../types';
import { formatDistance, getDirectionsUrl, getWhatsAppInquiryUrl } from '../utils/geo';
import { getPlatformTenureText } from '../utils/tenure';
import { 
  AMENITIES_CATALOG, 
  ACCOMMODATION_TYPE_LABELS,
  getPropertyServicesForAccommodation,
  getRoomFeaturesForAccommodation
} from '../utils/amenities';
import { analyticsService } from '../services/analyticsService';
import { propertyService } from '../services/propertyService';
import { contactUnlockService } from '../services/contactUnlockService';

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
  double_bed: <BedDouble className="w-5 h-5 text-rose-500" />,
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
  const [expandedSections, setExpandedSections] = useState<{
    about: boolean;
    amenities: boolean;
    location: boolean;
    verification: boolean;
    ratings: boolean;
  }>({
    about: false,
    amenities: false,
    location: false,
    verification: false,
    ratings: true,
  });

  const toggleSection = (section: 'about' | 'amenities' | 'location' | 'verification' | 'ratings') => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

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

  const propertyServices = getPropertyServicesForAccommodation(accommodation);
  const roomFeatures = getRoomFeaturesForAccommodation(accommodation);

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
          <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white pointer-events-auto">
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
        <div className="overflow-y-auto flex-1 w-full pb-4 sm:pb-6">
          {/* Gallery view */}
          <div className="relative bg-neutral-950 aspect-16/10 w-full overflow-hidden">
            <img
              src={accommodation.photos[activePhotoIndex] || accommodation.photos[0]}
              alt={accommodation.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Clean bottom overlay on Photo */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white pointer-events-none">
              <div className="flex items-center gap-2">
                {accommodation.isOpen24h && (
                  <span className="text-xs font-semibold bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-lg">
                    Recepção 24h
                  </span>
                )}
                {accommodation.isPremium && (
                  <span className="text-xs font-bold bg-amber-400 text-zinc-950 px-2 py-0.5 rounded-lg">
                    Premium
                  </span>
                )}
              </div>

              {accommodation.distanceKm !== undefined && (
                <span className="bg-black/60 text-white text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-md flex items-center gap-1.5">
                  <Navigation2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>a {formatDistance(accommodation.distanceKm)}</span>
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
            {/* Title, Location & Pricing Overview (Side-by-Side Compact Layout) */}
            <div className="space-y-2.5">
              {/* Top Row: Name & Location (Left) + Price (Right) */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1 min-w-0">
                  <h1 className="text-lg sm:text-2xl font-black text-neutral-950 leading-snug">
                    {accommodation.name}
                  </h1>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-600">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">
                      {accommodation.location.neighborhood || accommodation.location.district || accommodation.location.city}, {accommodation.location.city} · {accommodation.location.province}
                    </span>
                  </div>
                </div>

                {minPrice ? (
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-neutral-400 font-medium block uppercase tracking-wider">A partir de</span>
                    <strong className="text-emerald-700 font-black text-lg sm:text-2xl block tracking-tight">
                      {minPrice.toLocaleString('pt-MZ')} MT
                    </strong>
                    <span className="text-[10px] text-neutral-400 font-medium block">/ noite</span>
                  </div>
                ) : (
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-neutral-400 font-medium block uppercase tracking-wider">Tarifa</span>
                    <strong className="text-neutral-600 font-bold text-xs sm:text-sm block">
                      Preço não publicado
                    </strong>
                  </div>
                )}
              </div>

              {/* Rating em percentagem & Antiguidade */}
              <div className="flex items-center gap-2 flex-wrap text-xs font-semibold text-neutral-700 pt-1.5 border-t border-neutral-100">
                <div className="flex items-center text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <Award className="w-4 h-4 text-emerald-600 shrink-0 mr-1.5" />
                  <span className="font-black text-emerald-900 text-sm">{Math.round((rating / 5) * 100)}%</span>
                  <span className="text-emerald-700 font-bold ml-1.5">Avaliação Positiva</span>
                  <span className="text-emerald-600 font-normal ml-1">({reviewsCount} relatórios)</span>
                </div>

                <span aria-hidden="true" className="text-neutral-300">·</span>

                <span className="inline-flex items-center gap-1 text-xs text-neutral-600">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{getPlatformTenureText(accommodation.registeredAt, accommodation.platformTenure, accommodation.id)}</span>
                </span>
              </div>
            </div>

            {/* 1. Sobre o Alojamento (Card Interativo com Toque Intuitivo) */}
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => toggleSection('about')}
                className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-neutral-100/80 active:scale-[0.99] transition-all group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white border border-neutral-200/80 flex items-center justify-center text-neutral-700 shrink-0 shadow-2xs group-hover:border-emerald-500 transition-colors">
                    <FileText className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight group-hover:text-emerald-700 transition-colors">
                      Sobre o Alojamento
                    </h3>
                    <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                      {expandedSections.about ? 'Toque para recolher' : 'História, ambiente e detalhes do espaço'}
                    </p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-white border border-neutral-200 shadow-2xs flex items-center justify-center text-neutral-600 group-hover:text-emerald-700 group-hover:border-emerald-300 transition-all shrink-0 ml-2">
                  {expandedSections.about ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>
              {expandedSections.about && (
                <div className="px-4 pb-4 pt-1 border-t border-neutral-200/60 bg-white animate-in fade-in duration-150">
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed pt-2">
                    {accommodation.description}
                  </p>
                </div>
              )}
            </div>

            {/* 2. Comodidades e Serviços (Card Interativo com Toque Intuitivo) */}
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => toggleSection('amenities')}
                className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-neutral-100/80 active:scale-[0.99] transition-all group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white border border-neutral-200/80 flex items-center justify-center text-neutral-700 shrink-0 shadow-2xs group-hover:border-emerald-500 transition-colors">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight group-hover:text-emerald-700 transition-colors">
                        Comodidades e Serviços
                      </h3>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-md">
                        {accommodation.amenities.length}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                      {expandedSections.amenities ? 'Toque para recolher' : 'Wi-Fi, AC, Piscina, Estacionamento...'}
                    </p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-white border border-neutral-200 shadow-2xs flex items-center justify-center text-neutral-600 group-hover:text-emerald-700 group-hover:border-emerald-300 transition-all shrink-0 ml-2">
                  {expandedSections.amenities ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>
              {expandedSections.amenities && (
                <div className="px-4 pb-4 pt-2 border-t border-neutral-200/60 bg-white animate-in fade-in duration-150 space-y-3.5">
                  {/* Serviços do Estabelecimento (Property Services) */}
                  {propertyServices.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase text-neutral-500 tracking-wider">
                        <span>🏢 Serviços do Estabelecimento</span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md font-bold">
                          {propertyServices.length}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {propertyServices.map((service) => (
                          <div
                            key={service.id}
                            className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/80"
                          >
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                            <div className="truncate">
                              <span className="text-xs font-bold text-neutral-800 block truncate">
                                {service.name}
                              </span>
                              <span className="text-[10px] text-neutral-500 truncate block">
                                {service.shortDesc}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Comodidades do Quarto (Room Features) */}
                  {roomFeatures.length > 0 && (
                    <div className="space-y-1.5 pt-1 border-t border-neutral-100">
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase text-neutral-500 tracking-wider">
                        <span>🛏️ Comodidades do Quarto</span>
                        <span className="text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded-md font-bold">
                          {roomFeatures.length}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {roomFeatures.map((room) => (
                          <div
                            key={room.id}
                            className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/80"
                          >
                            <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
                            <div className="truncate">
                              <span className="text-xs font-bold text-neutral-800 block truncate">
                                {room.name}
                              </span>
                              <span className="text-[10px] text-neutral-500 truncate block">
                                {room.shortDesc}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 3. Localização & Ponto de Referência (Hierarquia Completa) */}
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => toggleSection('location')}
                className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-neutral-100/80 active:scale-[0.99] transition-all group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white border border-neutral-200/80 flex items-center justify-center text-neutral-700 shrink-0 shadow-2xs group-hover:border-emerald-500 transition-colors">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight group-hover:text-emerald-700 transition-colors">
                      Localização & Ponto de Referência
                    </h3>
                    <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                      {accommodation.location.neighborhood}, {accommodation.location.city} · {accommodation.location.province}
                    </p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-white border border-neutral-200 shadow-2xs flex items-center justify-center text-neutral-600 group-hover:text-emerald-700 group-hover:border-emerald-300 transition-all shrink-0 ml-2">
                  {expandedSections.location ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>
              
              {expandedSections.location && (
                <div className="px-4 pb-4 pt-2 border-t border-neutral-200/60 bg-white animate-in fade-in duration-150 space-y-3">
                  {/* Location Breadcrumb Hierarchy */}
                  <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 flex items-center gap-1 flex-wrap">
                    <span className="text-neutral-400">Moçambique</span>
                    <span className="text-neutral-300">›</span>
                    <span className="text-neutral-800">{accommodation.location.province}</span>
                    <span className="text-neutral-300">›</span>
                    <span className="text-neutral-800">{accommodation.location.city}</span>
                    {accommodation.location.district && (
                      <>
                        <span className="text-neutral-300">›</span>
                        <span className="text-neutral-800">{accommodation.location.district}</span>
                      </>
                    )}
                    <span className="text-neutral-300">›</span>
                    <span className="text-emerald-700 font-bold">{accommodation.location.neighborhood}</span>
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="leading-snug">
                      <span className="font-bold text-neutral-900 block text-xs sm:text-sm">
                        {accommodation.location.address}
                      </span>
                      <span className="text-neutral-500 block text-[11px] mt-0.5">
                        Bairro {accommodation.location.neighborhood}, {accommodation.location.city}
                      </span>
                    </div>
                  </div>

                  {accommodation.location.landmark && (
                    <div className="text-xs text-neutral-700 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/70">
                      <strong className="text-amber-950 font-bold">Ponto de referência:</strong> {accommodation.location.landmark}
                    </div>
                  )}

                  {/* Exact Pin Location & Directions */}
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-emerald-950">
                    <div className="flex items-center gap-1.5">
                      <Navigation2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="text-[11px] font-medium">
                        Pin GPS: <strong>{accommodation.location.lat.toFixed(4)}, {accommodation.location.lng.toFixed(4)}</strong>
                      </span>
                    </div>
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[11px] transition-colors shrink-0"
                    >
                      Rota no Mapa
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Verificação & Segurança (Card Interativo com Toque Intuitivo) */}
            <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50/40 overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => toggleSection('verification')}
                className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-emerald-50/80 active:scale-[0.99] transition-all group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 shadow-2xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight group-hover:text-emerald-800 transition-colors">
                      Verificação & Segurança
                    </h3>
                    <p className="text-[11px] text-emerald-700/90 truncate mt-0.5">
                      Dossiê de Auditoria Oficial Onde Dormir
                    </p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-white border border-emerald-200 shadow-2xs flex items-center justify-center text-emerald-700 transition-all shrink-0 ml-2">
                  {expandedSections.verification ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {expandedSections.verification && (
                <div className="px-4 pb-4 pt-2 border-t border-emerald-100 bg-white animate-in fade-in duration-150 space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap pt-2">
                    <span className="text-xs font-bold text-neutral-900">
                      {accommodation.verificationStatus === 'verified_in_person'
                        ? 'Verificado Presencialmente com BI'
                        : accommodation.verificationStatus === 'verified'
                        ? 'Alojamento Verificado'
                        : '⚪ Não Verificado (Registo em Análise)'}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                      accommodation.verificationStatus === 'verified_in_person' || accommodation.verificationStatus === 'verified'
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                        : 'text-neutral-600 bg-neutral-100 border-neutral-200'
                    }`}>
                      {accommodation.verificationStatus === 'verified_in_person' || accommodation.verificationStatus === 'verified'
                        ? 'Auditoria Concluída'
                        : 'Aguardando Auditoria'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {accommodation.verificationStatus === 'verified_in_person'
                      ? 'A nossa equipa visitou o local e validou presencialmente as condições de conforto, higiene e segurança.'
                      : accommodation.verificationStatus === 'verified'
                      ? 'Documentação comercial, alvará e contacto de atendimento validados pela plataforma.'
                      : 'Atenção: A localização no mapa não é automaticamente verificada por Onde Dormir. Novos registos de proprietários iniciam como Não Verificados até à auditoria presencial da nossa equipa.'}
                  </p>
                </div>
              )}
            </div>

            {/* 5. Relatório Consolidado de Avaliações (Percentagem - Sem exposição de pessoas) */}
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => toggleSection('ratings')}
                className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-neutral-100/80 active:scale-[0.99] transition-all group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white border border-neutral-200/80 flex items-center justify-center text-neutral-700 shrink-0 shadow-2xs group-hover:border-emerald-500 transition-colors">
                    <Award className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight group-hover:text-emerald-700 transition-colors">
                        Relatório de Avaliações & Satisfação
                      </h3>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded-md">
                        {Math.round((rating / 5) * 100)}%
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                      Relatório estatístico de {reviewsCount} avaliações individuais
                    </p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-white border border-neutral-200 shadow-2xs flex items-center justify-center text-neutral-600 group-hover:text-emerald-700 group-hover:border-emerald-300 transition-all shrink-0 ml-2">
                  {expandedSections.ratings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {expandedSections.ratings && (
                <div className="px-4 pb-4 pt-2 border-t border-neutral-200/60 bg-white animate-in fade-in duration-150 space-y-3">
                  <div className="p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200/70 text-[11px] text-emerald-950 font-medium leading-relaxed">
                    ℹ️ <strong>Transparência & Privacidade:</strong> Os dados abaixo correspondem ao relatório consolidado de satisfação calculado a partir das {reviewsCount} avaliações individuais registadas para este estabelecimento. Não são publicadas avaliações nominativas nem comentários pessoais de clientes.
                  </div>

                  {/* Summary Metric Header */}
                  <div className="flex items-center justify-between p-3 bg-neutral-900 text-white rounded-xl">
                    <div>
                      <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">Satisfação Geral do Alojamento</span>
                      <span className="text-xs text-neutral-300">Baseado em {reviewsCount} relatórios de verificação</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-emerald-400 tracking-tight">{Math.round((rating / 5) * 100)}%</span>
                      <span className="text-[9.5px] text-emerald-200 block font-semibold">Aprovação Global</span>
                    </div>
                  </div>

                  {/* Percentage Progress Bars */}
                  <div className="space-y-2.5 pt-1">
                    {[
                      { label: 'Limpeza, Higiene e Organização', percent: Math.min(100, Math.round((rating / 5) * 100 + 2)), color: 'bg-emerald-600' },
                      { label: 'Atendimento e Recepção', percent: Math.min(100, Math.round((rating / 5) * 100 + 1)), color: 'bg-emerald-500' },
                      { label: 'Conforto do Quarto e Cama', percent: Math.round((rating / 5) * 100), color: 'bg-teal-500' },
                      { label: 'Localização e Acesso ao Local', percent: Math.max(70, Math.round((rating / 5) * 100 - 1)), color: 'bg-sky-500' },
                      { label: 'Relação Qualidade / Preço', percent: Math.max(65, Math.round((rating / 5) * 100 - 2)), color: 'bg-amber-500' },
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-neutral-800">{item.label}</span>
                          <span className="font-extrabold text-neutral-900">{item.percent}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                          <div
                            className={`h-full ${item.color} rounded-full transition-all duration-500`}
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Informação de Apoio */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                <Info className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Reserva Direta e Sem Comissões</span>
              </div>
              <p className="text-xs text-emerald-900/90 leading-relaxed pl-6">
                Fale diretamente com a recepção no WhatsApp para confirmar quartos disponíveis e efetuar o check-in.
              </p>
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
          {accommodation.whatsapp ? (
            <>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
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
                    return;
                  }
                  analyticsService.trackWhatsAppClick(accommodation.id, accommodation.location.province);
                }}
                className="flex-1 h-11 sm:h-12 px-3.5 sm:px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 cursor-pointer touch-manipulation"
              >
                <MessageCircle className="w-4 sm:w-5 h-4 sm:h-5 fill-white shrink-0" />
                <span className="truncate">WhatsApp da Recepção</span>
              </a>

              {accommodation.phone && (
                <a
                  href={`tel:${accommodation.phone}`}
                  onClick={(e) => {
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
                      return;
                    }
                    analyticsService.trackPhoneClick(accommodation.id, accommodation.location.province);
                  }}
                  className="h-11 sm:h-12 w-11 sm:w-12 rounded-xl sm:rounded-2xl bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 flex items-center justify-center transition-colors cursor-pointer shrink-0 touch-manipulation"
                  title="Ligar para a receção"
                  aria-label="Ligar para a receção"
                >
                  <Phone className="w-4 sm:w-5 h-4 sm:h-5 text-neutral-800" />
                </a>
              )}
            </>
          ) : accommodation.phone ? (
            <a
              href={`tel:${accommodation.phone}`}
              onClick={(e) => {
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
                  return;
                }
                analyticsService.trackPhoneClick(accommodation.id, accommodation.location.province);
              }}
              className="flex-1 h-11 sm:h-12 px-3.5 sm:px-4 bg-neutral-900 hover:bg-neutral-800 active:scale-98 text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer touch-manipulation"
            >
              <Phone className="w-4 sm:w-5 h-4 sm:h-5 text-white shrink-0" />
              <span className="truncate">Ligar para a Recepção ({accommodation.phone})</span>
            </a>
          ) : (
            <div className="flex-1 h-11 sm:h-12 px-3.5 bg-neutral-100 text-neutral-400 rounded-xl sm:rounded-2xl text-xs font-medium flex items-center justify-center">
              <span>Contacto telefónico não publicado</span>
            </div>
          )}

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
