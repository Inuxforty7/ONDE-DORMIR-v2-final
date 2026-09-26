import React from 'react';
import { 
  Navigation, 
  MapPin, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  Bed,
  Hotel,
  Palmtree,
  ChevronRight,
  Compass,
  Car,
  Heart
} from 'lucide-react';
import { Accommodation, AccommodationType, ActiveTab, UserLocationState } from '../types';
import { AccommodationCard } from './AccommodationCard';
import { Logo } from './Logo';

interface HomeTabProps {
  userLocation: UserLocationState;
  accommodations: Accommodation[];
  onSelectAccommodation: (item: Accommodation) => void;
  isSaved: (id: string) => boolean;
  onToggleSave: (id: string) => void;
  onOpenLocationModal: () => void;
  onRequestGps: () => void;
  onOpenPrivacyModal: () => void;
  onNavigateToExplore: (typeFilter?: AccommodationType, query?: string) => void;
  onNavigateToTab: (tab: ActiveTab) => void;
  onNavigateToMap: () => void;
  onOpenRegisterModal: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  userLocation,
  accommodations,
  onSelectAccommodation,
  isSaved,
  onToggleSave,
  onOpenLocationModal,
  onRequestGps,
  onOpenPrivacyModal,
  onNavigateToExplore,
  onNavigateToTab,
  onNavigateToMap,
  onOpenRegisterModal,
}) => {
  const [homeCategoryFilter, setHomeCategoryFilter] = React.useState<AccommodationType | 'all'>('all');
  const [quickSearch, setQuickSearch] = React.useState('');

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      onNavigateToExplore(undefined, quickSearch.trim());
    } else {
      onNavigateToExplore();
    }
  };

  // Filter and sort by nearest
  const filteredAccommodations = React.useMemo(() => {
    let list = [...accommodations];
    if (homeCategoryFilter === 'pensao') {
      list = list.filter((item) => item.type === 'pensao' || item.type === 'guest_house' || item.type === 'residencial');
    } else if (homeCategoryFilter !== 'all') {
      list = list.filter((item) => item.type === homeCategoryFilter);
    }
    return list
      .sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999))
      .slice(0, 4);
  }, [accommodations, homeCategoryFilter]);

  return (
    <div className="pb-32 pt-2 sm:pt-4 max-w-5xl mx-auto px-3.5 sm:px-4 space-y-4 sm:space-y-5">
      {/* 
        =======================================================
        PORTAL HUB HERO (EXACT DESIGN MATCH: IMG-20260926-WA0014.jpg)
        Tropical Coast + 4 Mobile-Friendly Service Cards
        =======================================================
      */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-sky-200/50 bg-neutral-900 text-white min-h-[390px] sm:min-h-[430px] flex flex-col justify-between">
        {/* Tropical Coastal Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-950/85 via-sky-900/65 to-sky-950/85" />

        {/* Top Brand Header */}
        <div className="relative z-10 p-5 sm:p-6 text-center space-y-2.5">
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg mx-auto">
            <Logo size="xl" showText={false} />
          </div>

          <p className="text-xs sm:text-sm font-semibold text-white/95 max-w-md mx-auto drop-shadow-md">
            Encontre onde dormir, quem o pode guiar e como se deslocar.
          </p>
        </div>

        {/* 4 Clean Main Service Cards with generous touch targets (h-16 equivalent) */}
        <div className="relative z-10 p-4 sm:p-6 space-y-3 max-w-xl mx-auto w-full">
          {/* 1. ONDE DORMIR */}
          <button
            onClick={() => onNavigateToTab('explore')}
            className="w-full group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] text-white rounded-2xl p-3.5 sm:p-4 border-2 border-white/40 shadow-lg transition-all flex items-center justify-between cursor-pointer touch-manipulation"
          >
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Bed className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-black text-sm sm:text-base tracking-wide uppercase leading-tight">
                  ONDE DORMIR
                </div>
                <div className="text-xs text-blue-100 font-medium mt-0.5">
                  Hotéis, pensões, residenciais
                </div>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </button>

          {/* 2. GUIA TURÍSTICO */}
          <button
            onClick={() => onNavigateToTab('guides')}
            className="w-full group bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 active:scale-[0.98] text-white rounded-2xl p-3.5 sm:p-4 border-2 border-white/40 shadow-lg transition-all flex items-center justify-between cursor-pointer touch-manipulation"
          >
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-black text-sm sm:text-base tracking-wide uppercase leading-tight">
                  GUIA TURÍSTICO
                </div>
                <div className="text-xs text-emerald-100 font-medium mt-0.5">
                  Guias locais e passeios
                </div>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </button>

          {/* 3. RENT-A-CAR */}
          <button
            onClick={() => onNavigateToTab('rentacar')}
            className="w-full group bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 active:scale-[0.98] text-white rounded-2xl p-3.5 sm:p-4 border-2 border-white/40 shadow-lg transition-all flex items-center justify-between cursor-pointer touch-manipulation"
          >
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-black text-sm sm:text-base tracking-wide uppercase leading-tight">
                  RENT-A-CAR
                </div>
                <div className="text-xs text-orange-100 font-medium mt-0.5">
                  Aluguer de viaturas
                </div>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </button>

          {/* 4. HeartLink (Clean design matching Screenshot 1) */}
          <button
            onClick={() => onNavigateToTab('heartlink')}
            className="w-full group bg-gradient-to-r from-rose-600 to-pink-700 hover:from-rose-500 hover:to-pink-600 active:scale-[0.98] text-white rounded-2xl p-3.5 sm:p-4 border-2 border-white/40 shadow-lg transition-all flex items-center justify-between cursor-pointer touch-manipulation"
          >
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Heart className="w-6 h-6 fill-white text-white" />
              </div>
              <div>
                <div className="font-black text-sm sm:text-base tracking-wide leading-tight">
                  HeartLink
                </div>
                <div className="text-xs text-pink-100 font-medium mt-0.5">
                  Amizade, namoro e relacionamentos
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </button>
        </div>
      </div>

      {/* Fast Search & Direct Location */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-neutral-200/90 shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-neutral-900">
              Pesquisar Hospedagens
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              Pensões, guest houses e hotéis em Moçambique
            </p>
          </div>

          <button
            onClick={onNavigateToMap}
            className="h-10 px-3.5 text-xs sm:text-sm text-emerald-800 font-bold flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 active:scale-95 rounded-xl border border-emerald-200 transition-colors cursor-pointer shrink-0"
          >
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Mapa</span>
          </button>
        </div>

        {/* Direct Search Bar - Generous h-12 (48px) input */}
        <form onSubmit={handleQuickSearchSubmit} className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Pesquisar por bairro, cidade ou pensão..."
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
            className="w-full h-12 sm:h-13 pl-11 pr-26 bg-neutral-50 text-neutral-900 placeholder-neutral-400 rounded-2xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-400 border border-neutral-200 shadow-2xs"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 sm:h-10 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer active:scale-95"
          >
            Procurar
          </button>
        </form>

        {/* Quick GPS & Zone row - Large 48px buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onRequestGps}
            disabled={userLocation.isLoading}
            className="flex-1 h-12 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-60"
          >
            <Navigation className={`w-4 h-4 ${userLocation.isLoading ? 'animate-spin' : ''}`} />
            <span>Perto de Mim Agora</span>
          </button>

          <button
            onClick={onOpenLocationModal}
            className="h-12 px-4 bg-neutral-100 hover:bg-neutral-200 active:scale-98 text-neutral-800 border border-neutral-200 rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer max-w-[180px] sm:max-w-[220px]"
            title="Mudar zona ou cidade"
          >
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">{userLocation.name}</span>
          </button>
        </div>
      </div>

      {/* Quick Category Chips with comfortable touch padding */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => onNavigateToExplore('pensao')}
          className="h-11 px-4 rounded-2xl bg-white border border-neutral-200/90 hover:border-amber-300 text-neutral-800 text-xs sm:text-sm font-bold flex items-center gap-2.5 shrink-0 transition-all cursor-pointer active:scale-95 shadow-2xs"
        >
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Bed className="w-4 h-4" />
          </div>
          <span>Pensões & Guest Houses</span>
        </button>

        <button
          onClick={() => onNavigateToExplore('hotel')}
          className="h-11 px-4 rounded-2xl bg-white border border-neutral-200/90 hover:border-blue-300 text-neutral-800 text-xs sm:text-sm font-bold flex items-center gap-2.5 shrink-0 transition-all cursor-pointer active:scale-95 shadow-2xs"
        >
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Hotel className="w-4 h-4" />
          </div>
          <span>Hotéis</span>
        </button>

        <button
          onClick={() => onNavigateToExplore('lodge')}
          className="h-11 px-4 rounded-2xl bg-white border border-neutral-200/90 hover:border-teal-300 text-neutral-800 text-xs sm:text-sm font-bold flex items-center gap-2.5 shrink-0 transition-all cursor-pointer active:scale-95 shadow-2xs"
        >
          <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
            <Palmtree className="w-4 h-4" />
          </div>
          <span>Lodges & Praia</span>
        </button>
      </div>

      {/* Nearest Accommodations Grid */}
      <div className="pt-1 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-xl font-extrabold text-neutral-900">
                Mais Próximas de Si
              </h2>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                Contacto Directo
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
              Calculadas a partir de: <strong className="text-neutral-800 font-bold">{userLocation.name}</strong>
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'all' as const, label: 'Todas' },
              { id: 'pensao' as const, label: 'Pensões & Guest Houses' },
              { id: 'hotel' as const, label: 'Hotéis' },
              { id: 'lodge' as const, label: 'Lodges' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setHomeCategoryFilter(cat.id as any)}
                className={`h-9 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 flex items-center ${
                  homeCategoryFilter === cat.id
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-white text-neutral-700 border border-neutral-200/80 hover:bg-neutral-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredAccommodations.map((place) => (
            <AccommodationCard
              key={place.id}
              accommodation={place}
              onSelect={onSelectAccommodation}
              isSaved={isSaved(place.id)}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={() => onNavigateToExplore()}
            className="w-full sm:w-auto h-12 px-6 bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-200 rounded-2xl text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-2 transition-all shadow-xs active:scale-98 cursor-pointer"
          >
            <span>Ver Todas as {accommodations.length} Hospedagens</span>
            <ArrowRight className="w-4 h-4 text-neutral-400" />
          </button>
        </div>
      </div>

      {/* Popular Mozambican Neighborhoods */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200/90 space-y-3 shadow-2xs">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-500">
          Zonas & Bairros Populares
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            'Polana Cimento',
            'Baixa Maputo',
            'Sommerschield',
            'Zimpeto',
            'Costa do Sol',
            'Matola Fomento',
            'Ponta Gea Beira',
            'Vilankulo Praia',
            'Bilene',
            'Nampula Central',
          ].map((zone) => (
            <button
              key={zone}
              onClick={() => onNavigateToExplore(undefined, zone)}
              className="h-9 sm:h-10 px-3.5 rounded-xl bg-neutral-100 hover:bg-emerald-50 hover:text-emerald-800 text-neutral-800 text-xs sm:text-sm font-semibold border border-neutral-200/60 transition-colors cursor-pointer flex items-center gap-1 active:scale-95"
            >
              <span>📍 {zone}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Privacy Guarantee strip */}
      <div className="p-4 sm:p-5 rounded-3xl bg-emerald-50/80 border border-emerald-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs sm:text-base font-bold text-emerald-950">
              Garantia de Privacidade
            </div>
            <div className="text-xs sm:text-sm text-emerald-800 mt-0.5">
              Sem histórico de pesquisa guardado e contactos directos por chamada e WhatsApp.
            </div>
          </div>
        </div>
        <button
          onClick={onOpenPrivacyModal}
          className="h-10 text-xs sm:text-sm font-bold text-emerald-800 bg-white px-4 py-2 rounded-xl border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer shrink-0 shadow-2xs"
        >
          Saber Mais
        </button>
      </div>

      {/* Add Establishment CTA */}
      <div className="text-center py-4 border-t border-neutral-200/80 space-y-1">
        <p className="text-xs sm:text-sm text-neutral-600">
          Tem uma pensão, guest house ou hotel em Moçambique?
        </p>
        <button
          onClick={onOpenRegisterModal}
          className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
        >
          + Registar alojamento no directório
        </button>
      </div>
    </div>
  );
};
