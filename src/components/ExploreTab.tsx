import React, { useState, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  ShieldCheck, 
  X, 
  ArrowUpDown, 
  Map as MapIcon, 
  ChevronRight,
  ChevronDown,
  Building,
  Palmtree,
  Waves,
  Building2,
  Navigation,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Check
} from 'lucide-react';
import { Accommodation, AccommodationType, AmenityId, UserLocationState } from '../types';
import { AccommodationCard } from './AccommodationCard';
import { ACCOMMODATION_TYPE_LABELS, AMENITIES_CATALOG } from '../utils/amenities';

interface ExploreTabProps {
  accommodations: Accommodation[];
  userLocation: UserLocationState;
  onSelectAccommodation: (item: Accommodation) => void;
  isSaved: (id: string) => boolean;
  onToggleSave: (id: string) => void;
  onSwitchToMap: () => void;
  onBackToHome?: () => void;
  initialTypeFilter?: AccommodationType | 'all';
  initialSearchQuery?: string;
  onOpenLocationModal: () => void;
  onSelectProvince?: (prov: string) => void;
  onSelectAllMozambique?: () => void;
}

export const MOZ_PROVINCES_LIST = [
  'Maputo Cidade',
  'Maputo Província',
  'Inhambane',
  'Gaza',
  'Sofala',
  'Nampula',
  'Cabo Delgado',
  'Manica',
  'Tete',
  'Zambézia',
  'Niassa'
];

export const ExploreTab: React.FC<ExploreTabProps> = ({
  accommodations,
  userLocation,
  onSelectAccommodation,
  isSaved,
  onToggleSave,
  onSwitchToMap,
  onBackToHome,
  initialTypeFilter = 'all',
  initialSearchQuery = '',
  onOpenLocationModal,
  onSelectProvince,
  onSelectAllMozambique,
}) => {
  // Search & Filter States
  const [selectedProvince, setSelectedProvince] = useState<string>(() => {
    if (userLocation.isAllMozambique) return 'all';
    return userLocation.province || 'Inhambane';
  });

  // Keep in sync with userLocation if user changes it externally
  React.useEffect(() => {
    if (userLocation.isAllMozambique) {
      setSelectedProvince('all');
    } else if (userLocation.province) {
      setSelectedProvince(userLocation.province);
    }
  }, [userLocation.province, userLocation.isAllMozambique]);

  const [search, setSearch] = useState(initialSearchQuery);
  const [selectedType, setSelectedType] = useState<AccommodationType | 'all'>(initialTypeFilter);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [only24h, setOnly24h] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<AmenityId[]>([]);
  const [sortBy, setSortBy] = useState<'distance' | 'name' | 'verified'>('distance');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Compute neighborhoods list based on active province
  const neighborhoodsList = useMemo(() => {
    let items = accommodations;
    if (selectedProvince !== 'all') {
      const selP = selectedProvince.toLowerCase();
      items = items.filter((a) => {
        const p = (a.location.province || '').toLowerCase();
        if (selP === 'maputo cidade' || selP === 'maputo província') {
          return p === selP || p === 'maputo';
        }
        return p.includes(selP) || selP.includes(p);
      });
    }
    return Array.from(new Set(items.map((a) => a.location.neighborhood))).filter((b): b is string => Boolean(b));
  }, [accommodations, selectedProvince]);

  // Reset neighborhood if it's no longer in the list
  React.useEffect(() => {
    if (selectedNeighborhood !== 'all' && !neighborhoodsList.includes(selectedNeighborhood)) {
      setSelectedNeighborhood('all');
    }
  }, [neighborhoodsList, selectedNeighborhood]);

  // Toggle amenity
  const toggleAmenity = (id: AmenityId) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedProvince('all');
    if (onSelectAllMozambique) onSelectAllMozambique();
    setSearch('');
    setSelectedType('all');
    setSelectedNeighborhood('all');
    setVerifiedOnly(false);
    setOnly24h(false);
    setSelectedAmenities([]);
    setSortBy('distance');
  };

  const handleProvinceClick = (prov: string) => {
    setSelectedProvince(prov);
    if (prov === 'all') {
      if (onSelectAllMozambique) onSelectAllMozambique();
    } else {
      if (onSelectProvince) onSelectProvince(prov);
    }
  };

  // Filtered & Sorted list
  const filteredList = useMemo(() => {
    let result = [...accommodations];

    // Province filter
    if (selectedProvince !== 'all') {
      result = result.filter((item) =>
        item.location.province.toLowerCase().includes(selectedProvince.toLowerCase())
      );
    }

    // Neighborhood filter
    if (selectedNeighborhood !== 'all') {
      result = result.filter(
        (item) => item.location.neighborhood.toLowerCase() === selectedNeighborhood.toLowerCase()
      );
    }

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

    // Verified only filter
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
  }, [accommodations, selectedProvince, search, selectedType, verifiedOnly, only24h, selectedAmenities, sortBy]);

  const activeFiltersCount =
    (selectedProvince !== 'all' ? 1 : 0) +
    (selectedType !== 'all' ? 1 : 0) +
    (verifiedOnly ? 1 : 0) +
    (only24h ? 1 : 0) +
    selectedAmenities.length;

  return (
    <div className="pb-32 pt-2 sm:pt-4 max-w-5xl mx-auto px-3.5 sm:px-4 space-y-3.5">
      {/* Top Brand Banner with Slogan */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-950 text-white p-3.5 sm:p-4 rounded-3xl border border-sky-400/20 shadow-md flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black tracking-tight leading-none">
              <span>ONDE </span>
              <span className="text-amber-400">DORMIR</span>{' '}
              <span className="text-sky-300 font-black text-xs sm:text-sm tracking-wider uppercase">MOÇAMBIQUE</span>
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs text-sky-100 font-medium mt-1 leading-snug">
            Encontre onde dormir, quem o possa guiar e como pode se deslocar.
          </p>
        </div>
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="h-8 px-3 bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs font-bold rounded-xl border border-white/20 transition-all shrink-0 cursor-pointer"
          >
            Menu Início
          </button>
        )}
      </div>

      {/* Compact Search and Province Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-neutral-200/90 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="w-10 h-10 rounded-xl bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
              title="Voltar ao início"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Pesquisar pensão, hotel, bairro..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 sm:h-11 pl-9 pr-8 bg-neutral-50 rounded-xl text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-neutral-200"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="w-7 h-7 absolute right-1.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter button trigger */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`h-10 sm:h-11 px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeFiltersCount > 0 || showAdvancedFilters
                ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="w-4.5 h-4.5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Quick Horizontal Province Chips */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
          <button
            onClick={() => handleProvinceClick('all')}
            className={`h-8 px-3 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedProvince === 'all'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Todas as Províncias
          </button>
          {MOZ_PROVINCES_LIST.map((p) => {
            const isSelected = selectedProvince.toLowerCase() === p.toLowerCase();
            return (
              <button
                key={p}
                onClick={() => handleProvinceClick(isSelected ? 'all' : p)}
                className={`h-8 px-2.5 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Active Province Scope Indicator */}
        {selectedProvince !== 'all' && (
          <div className="flex items-center justify-between bg-emerald-50 text-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-semibold">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">A filtrar apenas: <strong>{selectedProvince}</strong> ({filteredList.length})</span>
            </div>
            <button 
              onClick={() => handleProvinceClick('all')}
              className="text-[11px] text-emerald-800 font-bold underline hover:text-emerald-950 shrink-0 ml-2 cursor-pointer"
            >
              Ver Todas as Províncias
            </button>
          </div>
        )}

        {/* Dynamic Bairros & Zonas Chips */}
        {neighborhoodsList.length > 0 && (
          <div className="pt-2 border-t border-neutral-100">
            <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>📍 Bairros & Zonas ({selectedProvince !== 'all' ? selectedProvince : 'Geral'}):</span>
              {selectedNeighborhood !== 'all' && (
                <button
                  onClick={() => setSelectedNeighborhood('all')}
                  className="text-[10px] text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  Limpar Bairro
                </button>
              )}
            </div>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setSelectedNeighborhood('all')}
                className={`h-7 px-2.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedNeighborhood === 'all'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Todos os Bairros ({neighborhoodsList.length})
              </button>
              {neighborhoodsList.map((b) => {
                const isSel = selectedNeighborhood.toLowerCase() === b.toLowerCase();
                return (
                  <button
                    key={b}
                    onClick={() => setSelectedNeighborhood(isSel ? 'all' : b)}
                    className={`h-7 px-2.5 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer border ${
                      isSel
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Type Filter Chips */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-0.5 border-t border-neutral-100 pt-2">
          {[
            { id: 'all', label: 'Todos os Tipos' },
            { id: 'pensao', label: 'Pensões & Guest Houses' },
            { id: 'hotel', label: 'Hotéis' },
            { id: 'resort', label: 'Resorts & Lodges' },
            { id: 'apart_hotel', label: 'Apartamentos' },
          ].map((type) => {
            const isSelected = selectedType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id as any)}
                className={`h-7 px-2.5 rounded-md text-xs font-medium shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {type.label}
              </button>
            );
          })}

          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`h-7 px-2.5 rounded-md text-xs font-semibold shrink-0 transition-all cursor-pointer flex items-center gap-1 border ${
              verifiedOnly
                ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                : 'bg-white text-neutral-600 border-neutral-200'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Verificados</span>
          </button>

          <button
            onClick={() => setOnly24h(!only24h)}
            className={`h-7 px-2.5 rounded-md text-xs font-semibold shrink-0 transition-all cursor-pointer border ${
              only24h
                ? 'bg-amber-500 text-zinc-950 border-amber-500 font-bold'
                : 'bg-white text-neutral-600 border-neutral-200'
            }`}
          >
            <span>24 Horas</span>
          </button>
        </div>

        {/* Advanced Filters Expandable Drawer */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-neutral-200/80 space-y-3 animate-in fade-in duration-150">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
                Comodidades Essenciais
              </span>
              <div className="flex flex-wrap gap-1.5">
                {Object.values(AMENITIES_CATALOG).slice(0, 8).map((amenity) => {
                  const isChecked = selectedAmenities.includes(amenity.id);
                  return (
                    <button
                      key={amenity.id}
                      onClick={() => toggleAmenity(amenity.id)}
                      className={`h-8 px-2.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 text-emerald-600" />}
                      <span>{amenity.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-neutral-500 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Limpar Filtros</span>
              </button>
              <button
                onClick={() => setShowAdvancedFilters(false)}
                className="h-8 px-4 bg-neutral-900 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Aplicar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Accommodations Grid Header */}
      <div className="flex items-center justify-between px-1">
        <div className="text-xs text-neutral-600">
          <strong className="text-neutral-900 font-bold">{filteredList.length}</strong> acomodações encontradas
        </div>

        <button
          onClick={onSwitchToMap}
          className="h-8 px-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100 transition-colors cursor-pointer"
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>Ver no Mapa</span>
        </button>
      </div>

      {/* Accommodations Grid */}
      {filteredList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredList.map((item) => (
            <AccommodationCard
              key={item.id}
              accommodation={item}
              onSelect={onSelectAccommodation}
              isSaved={isSaved(item.id)}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 text-center space-y-3 border border-neutral-200/90 shadow-2xs">
          <Building className="w-12 h-12 text-neutral-300 mx-auto" />
          <h3 className="font-extrabold text-base text-neutral-800">
            Nenhuma acomodação encontrada
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Tente alterar os termos de pesquisa ou selecionar outra província.
          </p>
          <button
            onClick={resetFilters}
            className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Limpar Filtros de Pesquisa
          </button>
        </div>
      )}
    </div>
  );
};
