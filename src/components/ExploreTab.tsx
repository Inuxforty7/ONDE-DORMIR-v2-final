import React, { useState, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  ShieldCheck, 
  X, 
  ArrowUpDown, 
  Map as MapIcon, 
  Filter, 
  RotateCcw,
  Wind,
  Wifi,
  Car,
  Zap,
  Bath
} from 'lucide-react';
import { Accommodation, AccommodationType, AmenityId, UserLocationState } from '../types';
import { AccommodationCard } from './AccommodationCard';
import { ACCOMMODATION_TYPE_LABELS } from '../utils/amenities';

interface ExploreTabProps {
  accommodations: Accommodation[];
  userLocation: UserLocationState;
  onSelectAccommodation: (item: Accommodation) => void;
  isSaved: (id: string) => boolean;
  onToggleSave: (id: string) => void;
  onSwitchToMap: () => void;
  initialTypeFilter?: AccommodationType | 'all';
  initialSearchQuery?: string;
  onOpenLocationModal: () => void;
}

export const ExploreTab: React.FC<ExploreTabProps> = ({
  accommodations,
  userLocation,
  onSelectAccommodation,
  isSaved,
  onToggleSave,
  onSwitchToMap,
  initialTypeFilter = 'all',
  initialSearchQuery = '',
  onOpenLocationModal,
}) => {
  const [search, setSearch] = useState(initialSearchQuery);
  const [selectedType, setSelectedType] = useState<AccommodationType | 'all'>(initialTypeFilter);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [only24h, setOnly24h] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<AmenityId[]>([]);
  const [sortBy, setSortBy] = useState<'distance' | 'name' | 'verified'>('distance');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Toggle amenity
  const toggleAmenity = (id: AmenityId) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearch('');
    setSelectedType('all');
    setVerifiedOnly(false);
    setOnly24h(false);
    setSelectedAmenities([]);
    setSortBy('distance');
  };

  // Filtered & Sorted list
  const filteredList = useMemo(() => {
    let result = [...accommodations];

    // Search query filter
    if (search.trim()) {
      const term = search.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.location.neighborhood.toLowerCase().includes(term) ||
          item.location.city.toLowerCase().includes(term) ||
          item.location.province.toLowerCase().includes(term) ||
          (item.location.landmark && item.location.landmark.toLowerCase().includes(term)) ||
          item.tagline.toLowerCase().includes(term)
      );
    }

    // Type filter
    if (selectedType === 'pensao' || selectedType === 'guest_house' || selectedType === 'residencial') {
      result = result.filter(
        (item) => item.type === 'pensao' || item.type === 'guest_house' || item.type === 'residencial'
      );
    } else if (selectedType !== 'all') {
      result = result.filter((item) => item.type === selectedType);
    }

    // Verified only filter (in person or certified)
    if (verifiedOnly) {
      result = result.filter((item) => item.verificationStatus === 'verified' || item.verificationStatus === 'verified_in_person');
    }

    // 24h filter
    if (only24h) {
      result = result.filter((item) => item.isOpen24h);
    }

    // Amenities filter
    if (selectedAmenities.length > 0) {
      result = result.filter((item) =>
        selectedAmenities.every((amenity) => item.amenities.includes(amenity))
      );
    }

    // Sort
    result.sort((a, b) => {
      // Premium / Featured get natural boost
      if (a.isPremium && !b.isPremium) return -1;
      if (!a.isPremium && b.isPremium) return 1;

      if (sortBy === 'distance') {
        return (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'verified') {
        const isVerA = a.verificationStatus === 'verified_in_person' ? 2 : a.verificationStatus === 'verified' ? 1 : 0;
        const isVerB = b.verificationStatus === 'verified_in_person' ? 2 : b.verificationStatus === 'verified' ? 1 : 0;
        if (isVerA !== isVerB) return isVerB - isVerA;
        return (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999);
      }
      return 0;
    });

    return result;
  }, [accommodations, search, selectedType, verifiedOnly, only24h, selectedAmenities, sortBy]);

  const activeFiltersCount =
    (selectedType !== 'all' ? 1 : 0) +
    (verifiedOnly ? 1 : 0) +
    (only24h ? 1 : 0) +
    selectedAmenities.length;

  return (
    <div className="pb-32 pt-2 sm:pt-4 max-w-5xl mx-auto px-3.5 sm:px-4 space-y-4">
      {/* Top Search bar & Actions with generous mobile heights */}
      <div className="space-y-3">
        <div className="flex gap-2">
          {/* Search Input - Large 48px touch target */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Pesquisar por nome, bairro, cidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 sm:h-13 pl-11 pr-10 bg-white rounded-2xl text-sm sm:text-base text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 border border-neutral-200/90 shadow-2xs transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="w-9 h-9 absolute right-1.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 flex items-center justify-center cursor-pointer"
                title="Limpar pesquisa"
                aria-label="Limpar pesquisa"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Toggle Filters panel */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`h-12 sm:h-13 px-3.5 sm:px-4 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer active:scale-95 ${
              showAdvancedFilters || activeFiltersCount > 0
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs'
                : 'bg-white border-neutral-200/90 text-neutral-700 hover:bg-neutral-50 shadow-2xs'
            }`}
          >
            <SlidersHorizontal className="w-4.5 h-4.5" />
            <span className="hidden sm:inline">Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Switch to Map button */}
          <button
            onClick={onSwitchToMap}
            className="h-12 sm:h-13 px-4 bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
            title="Ver no mapa"
          >
            <MapIcon className="w-4.5 h-4.5" />
            <span className="hidden sm:inline">Mapa</span>
          </button>
        </div>

        {/* Categories scrollable pill list - Height 40px with readable text */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setSelectedType('all')}
            className={`h-10 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer flex items-center active:scale-95 ${
              selectedType === 'all'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white text-neutral-700 border border-neutral-200/80 hover:bg-neutral-50'
            }`}
          >
            Todas ({accommodations.length})
          </button>

          <button
            onClick={() => setSelectedType('pensao')}
            className={`h-10 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer flex items-center active:scale-95 ${
              selectedType === 'pensao' || selectedType === 'guest_house' || selectedType === 'residencial'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-neutral-700 border border-neutral-200/80 hover:bg-neutral-50'
            }`}
          >
            Pensões & Guest Houses
          </button>

          <button
            onClick={() => setSelectedType('hotel')}
            className={`h-10 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer flex items-center active:scale-95 ${
              selectedType === 'hotel'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-neutral-700 border border-neutral-200/80 hover:bg-neutral-50'
            }`}
          >
            Hotéis
          </button>

          <button
            onClick={() => setSelectedType('lodge')}
            className={`h-10 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer flex items-center active:scale-95 ${
              selectedType === 'lodge'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white text-neutral-700 border border-neutral-200/80 hover:bg-neutral-50'
            }`}
          >
            Lodges & Praia
          </button>

          {/* Quick 24h filter chip */}
          <button
            onClick={() => setOnly24h(!only24h)}
            className={`h-10 px-3.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 active:scale-95 ${
              only24h
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white text-neutral-700 border border-neutral-200/80 hover:bg-neutral-50'
            }`}
          >
            <span>⏰ 24 Horas</span>
          </button>

          {/* Quick Generator filter chip */}
          <button
            onClick={() => toggleAmenity('generator')}
            className={`h-10 px-3.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 active:scale-95 ${
              selectedAmenities.includes('generator')
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-neutral-700 border border-neutral-200/80 hover:bg-neutral-50'
            }`}
          >
            <span>⚡ Gerador</span>
          </button>
        </div>

        {/* Active Filters Quick Strip */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-1 text-xs sm:text-sm">
            <span className="text-xs text-neutral-500 font-semibold mr-1">Filtros ativos:</span>
            {selectedType !== 'all' && (
              <button
                onClick={() => setSelectedType('all')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 text-neutral-800 text-xs font-bold border border-neutral-200 hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                <span>{ACCOMMODATION_TYPE_LABELS[selectedType]?.label}</span>
                <X className="w-3.5 h-3.5 text-neutral-500" />
              </button>
            )}
            {verifiedOnly && (
              <button
                onClick={() => setVerifiedOnly(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <span>Apenas Verificados</span>
                <X className="w-3.5 h-3.5 text-emerald-600" />
              </button>
            )}
            {selectedAmenities.map((amenityId) => (
              <button
                key={amenityId}
                onClick={() => toggleAmenity(amenityId)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 text-neutral-800 text-xs font-bold border border-neutral-200 hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                <span>{amenityId.toUpperCase()}</span>
                <X className="w-3.5 h-3.5 text-neutral-500" />
              </button>
            ))}
            <button
              onClick={resetFilters}
              className="text-xs text-rose-600 hover:underline font-bold ml-auto cursor-pointer"
            >
              Limpar todos
            </button>
          </div>
        )}

        {/* Advanced Filters Expandable Drawer */}
        {showAdvancedFilters && (
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-neutral-200 shadow-sm space-y-3.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Filtros Detalhados
              </span>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Limpar Filtros
                </button>
              )}
            </div>

            {/* Verified Only Toggle */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                <span className="text-xs sm:text-sm font-semibold text-neutral-800">
                  Apenas estabelecimentos verificados
                </span>
              </div>
              <button
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  verifiedOnly ? 'bg-emerald-600' : 'bg-neutral-200'
                }`}
              >
                <div
                  className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform ${
                    verifiedOnly ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Essential Amenities */}
            <div>
              <span className="text-xs font-bold text-neutral-700 block mb-2">
                Comodidades Essenciais
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'ac' as AmenityId, label: 'Ar Condicionado', icon: Wind },
                  { id: 'generator' as AmenityId, label: 'Gerador / Energia 24h', icon: Zap },
                  { id: 'parking' as AmenityId, label: 'Estacionamento Seguro', icon: Car },
                  { id: 'wifi' as AmenityId, label: 'Wi-Fi Grátis', icon: Wifi },
                  { id: 'private_bathroom' as AmenityId, label: 'Casa de Banho Privada', icon: Bath },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedAmenities.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleAmenity(item.id)}
                      className={`h-10 px-3.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer border active:scale-95 ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Results Count & Sort Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="text-xs sm:text-sm text-neutral-600">
            <span className="font-bold text-neutral-900">{filteredList.length}</span>{' '}
            hospedagens encontradas
          </div>

          <div className="flex items-center gap-2 bg-neutral-100 px-3 py-1.5 rounded-xl border border-neutral-200/80">
            <ArrowUpDown className="w-4 h-4 text-neutral-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs sm:text-sm font-bold text-neutral-800 bg-transparent border-none focus:outline-none cursor-pointer"
            >
              <option value="distance">Mais Próximos</option>
              <option value="verified">Verificados</option>
              <option value="name">Nome (A - Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Accommodations List */}
      {filteredList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {filteredList.map((place) => (
            <AccommodationCard
              key={place.id}
              accommodation={place}
              onSelect={onSelectAccommodation}
              isSaved={isSaved(place.id)}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-8 border border-neutral-200/90 text-center space-y-4 my-6">
          <div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-neutral-900">
              Nenhuma hospedagem encontrada
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto mt-1 leading-relaxed">
              Não encontramos resultados para os filtros selecionados ou para o termo "{search}".
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <button
              onClick={resetFilters}
              className="w-full sm:w-auto h-11 px-5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer active:scale-95"
            >
              Limpar todos os filtros
            </button>
            <button
              onClick={onOpenLocationModal}
              className="w-full sm:w-auto h-11 px-5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer active:scale-95"
            >
              Mudar de Cidade ou Bairro
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
