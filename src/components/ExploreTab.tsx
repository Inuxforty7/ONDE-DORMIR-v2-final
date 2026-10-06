import React, { useState, useMemo, useEffect } from 'react';
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
  Navigation,
  Navigation2,
  Sparkles,
  RotateCcw,
  Check,
  Home,
  Clock,
  DollarSign,
  Compass,
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
  Wine
} from 'lucide-react';
import { Accommodation, AccommodationType, AmenityId, UserLocationState } from '../types';
import { AccommodationCard } from './AccommodationCard';
import { ACCOMMODATION_TYPE_LABELS, AMENITIES_CATALOG } from '../utils/amenities';
import { calculateDistanceKm, formatDistance } from '../utils/geo';

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
  // 1. Province Filter
  const [selectedProvince, setSelectedProvince] = useState<string>(() => {
    if (userLocation.isAllMozambique) return 'all';
    return userLocation.province || 'Inhambane';
  });

  // Keep in sync with userLocation if user changes it externally
  useEffect(() => {
    if (userLocation.isAllMozambique) {
      setSelectedProvince('all');
    } else if (userLocation.province) {
      setSelectedProvince(userLocation.province);
    }
  }, [userLocation.province, userLocation.isAllMozambique]);

  // 2. Search & Text Filter (Província, Cidade, Distrito, Bairro, Pin/Postal, Nome)
  const [search, setSearch] = useState(initialSearchQuery);

  // 3. Type Filter (Strict Focus: Pensões, Guest Houses, Residenciais)
  const [selectedType, setSelectedType] = useState<AccommodationType | 'all'>(initialTypeFilter);

  // 4. District & Neighborhood Filters
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  // 5. Verification & Service Filters
  const [verificationLevel, setVerificationLevel] = useState<'all' | 'verified_in_person' | 'verified'>('all');
  const [only24h, setOnly24h] = useState(false);

  // 6. Amenities Filter
  const [selectedAmenities, setSelectedAmenities] = useState<AmenityId[]>([]);

  // 7. Price Filter
  const [priceFilter, setPriceFilter] = useState<'all' | 'under_1500' | '1500_2500' | '2500_4000' | 'above_4000'>('all');

  // 8. Sorting
  const [sortBy, setSortBy] = useState<'distance' | 'price_asc' | 'price_desc' | 'rating' | 'name'>('distance');

  // 9. "Perto de mim" Geolocation State
  const [isNearMeActive, setIsNearMeActive] = useState<boolean>(false);
  const [nearMeCoords, setNearMeCoords] = useState<{ lat: number; lng: number } | null>(
    userLocation.coords ? { lat: userLocation.coords.lat, lng: userLocation.coords.lng } : null
  );
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const [isLocatingUser, setIsLocatingUser] = useState<boolean>(false);

  // 10. Advanced Filter Modal
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Compute dynamic lists of neighborhoods and districts for active province
  const { neighborhoodsList, districtsList } = useMemo(() => {
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

    const nList = Array.from(new Set(items.map((a) => a.location.neighborhood))).filter((b): b is string => Boolean(b));
    const dList = Array.from(new Set(items.map((a) => a.location.district))).filter((d): d is string => Boolean(d));

    return { neighborhoodsList: nList, districtsList: dList };
  }, [accommodations, selectedProvince]);

  // Reset neighborhood/district if not present in new province
  useEffect(() => {
    if (selectedNeighborhood !== 'all' && !neighborhoodsList.includes(selectedNeighborhood)) {
      setSelectedNeighborhood('all');
    }
    if (selectedDistrict !== 'all' && !districtsList.includes(selectedDistrict)) {
      setSelectedDistrict('all');
    }
  }, [neighborhoodsList, districtsList, selectedNeighborhood, selectedDistrict]);

  // Handle "Perto de mim" Activation
  const handleToggleNearMe = () => {
    if (isNearMeActive) {
      setIsNearMeActive(false);
      setLocationNotice(null);
      return;
    }

    if (!navigator.geolocation) {
      setLocationNotice('Geolocalização não suportada no seu dispositivo. Pesquise manualmente por Província ou Bairro.');
      return;
    }

    setIsLocatingUser(true);
    setLocationNotice(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocatingUser(false);
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setNearMeCoords(coords);
        setIsNearMeActive(true);
        setSortBy('distance');
        setLocationNotice('Alojamentos ordenados pela distância real até à sua localização.');
      },
      (error) => {
        setIsLocatingUser(false);
        console.warn('Geolocation warning:', error.message);
        // Fallback: If user already has preset coordinates, use them
        if (userLocation.coords) {
          setNearMeCoords({ lat: userLocation.coords.lat, lng: userLocation.coords.lng });
          setIsNearMeActive(true);
          setSortBy('distance');
          setLocationNotice(`Localização aproximada em ${userLocation.city || userLocation.province || 'Moçambique'}.`);
        } else {
          setLocationNotice('Acesso à localização GPS não concedido. Pode pesquisar manualmente por Província, Cidade ou Bairro.');
        }
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

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
    setSelectedDistrict('all');
    setVerificationLevel('all');
    setOnly24h(false);
    setSelectedAmenities([]);
    setPriceFilter('all');
    setSortBy('distance');
    setIsNearMeActive(false);
    setLocationNotice(null);
  };

  const handleProvinceClick = (prov: string) => {
    setSelectedProvince(prov);
    setSelectedNeighborhood('all');
    setSelectedDistrict('all');
    if (prov === 'all') {
      if (onSelectAllMozambique) onSelectAllMozambique();
    } else {
      if (onSelectProvince) onSelectProvince(prov);
    }
  };

  // Active user reference coordinates
  const activeUserCoords = isNearMeActive && nearMeCoords ? nearMeCoords : userLocation.coords;

  // Filtered & Sorted list (LOCALIZAR → FILTRAR → COMPARAR → VERIFICAR)
  const filteredList = useMemo(() => {
    let result = accommodations.map((item) => {
      // Dynamic distance calculation
      let distanceKm = item.distanceKm;
      if (activeUserCoords && item.location.lat && item.location.lng) {
        distanceKm = calculateDistanceKm(
          activeUserCoords.lat,
          activeUserCoords.lng,
          item.location.lat,
          item.location.lng
        );
      }
      return {
        ...item,
        distanceKm
      };
    });

    // 1. Province filter
    if (selectedProvince !== 'all') {
      const selP = selectedProvince.toLowerCase();
      result = result.filter((item) => {
        const p = (item.location.province || '').toLowerCase();
        if (selP === 'maputo cidade' || selP === 'maputo província') {
          return p === selP || p === 'maputo';
        }
        return p.includes(selP) || selP.includes(p);
      });
    }

    // 2. District filter
    if (selectedDistrict !== 'all') {
      result = result.filter(
        (item) => (item.location.district || '').toLowerCase() === selectedDistrict.toLowerCase()
      );
    }

    // 3. Neighborhood filter
    if (selectedNeighborhood !== 'all') {
      result = result.filter(
        (item) => item.location.neighborhood.toLowerCase() === selectedNeighborhood.toLowerCase()
      );
    }

    // 4. Search query (Província, Cidade, Distrito, Bairro, Pin/Postal, Nome, Referência)
    if (search.trim()) {
      const term = search.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.location.neighborhood.toLowerCase().includes(term) ||
          item.location.city.toLowerCase().includes(term) ||
          item.location.province.toLowerCase().includes(term) ||
          (item.location.district && item.location.district.toLowerCase().includes(term)) ||
          (item.location.postalCode && item.location.postalCode.toLowerCase().includes(term)) ||
          (item.location.landmark && item.location.landmark.toLowerCase().includes(term)) ||
          (item.location.address && item.location.address.toLowerCase().includes(term)) ||
          item.tagline.toLowerCase().includes(term)
      );
    }

    // 5. Type filter (Only Pensões, Guest Houses, Residenciais)
    if (selectedType !== 'all') {
      result = result.filter((item) => item.type === selectedType);
    }

    // 6. Verification level
    if (verificationLevel === 'verified_in_person') {
      result = result.filter((item) => item.verificationStatus === 'verified_in_person');
    } else if (verificationLevel === 'verified') {
      result = result.filter((item) => item.verificationStatus === 'verified' || item.verificationStatus === 'verified_in_person');
    }

    // 7. 24h Reception
    if (only24h) {
      result = result.filter((item) => item.isOpen24h);
    }

    // 8. Amenities filter
    if (selectedAmenities.length > 0) {
      result = result.filter((item) =>
        selectedAmenities.every((amenity) => item.amenities.includes(amenity))
      );
    }

    // 9. Price Range filter
    if (priceFilter !== 'all') {
      result = result.filter((item) => {
        const minPrice = item.priceEstimate?.approxMin ?? 2000;
        switch (priceFilter) {
          case 'under_1500':
            return minPrice <= 1500;
          case '1500_2500':
            return minPrice >= 1500 && minPrice <= 2500;
          case '2500_4000':
            return minPrice > 2500 && minPrice <= 4000;
          case 'above_4000':
            return minPrice > 4000;
          default:
            return true;
        }
      });
    }

    // 10. Sorting
    result.sort((a, b) => {
      // Premium prioritization
      if (a.isPremium && !b.isPremium) return -1;
      if (!a.isPremium && b.isPremium) return 1;

      if (sortBy === 'distance') {
        return (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999);
      }
      if (sortBy === 'price_asc') {
        const pA = a.priceEstimate?.approxMin ?? 99999;
        const pB = b.priceEstimate?.approxMin ?? 99999;
        return pA - pB;
      }
      if (sortBy === 'price_desc') {
        const pA = a.priceEstimate?.approxMin ?? 0;
        const pB = b.priceEstimate?.approxMin ?? 0;
        return pB - pA;
      }
      if (sortBy === 'rating') {
        return (b.rating ?? 0) - (a.rating ?? 0);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return result;
  }, [
    accommodations,
    activeUserCoords,
    selectedProvince,
    selectedDistrict,
    selectedNeighborhood,
    search,
    selectedType,
    verificationLevel,
    only24h,
    selectedAmenities,
    priceFilter,
    sortBy
  ]);

  const activeFiltersCount =
    (selectedProvince !== 'all' ? 1 : 0) +
    (selectedDistrict !== 'all' ? 1 : 0) +
    (selectedNeighborhood !== 'all' ? 1 : 0) +
    (selectedType !== 'all' ? 1 : 0) +
    (verificationLevel !== 'all' ? 1 : 0) +
    (only24h ? 1 : 0) +
    (priceFilter !== 'all' ? 1 : 0) +
    (isNearMeActive ? 1 : 0) +
    selectedAmenities.length;

  return (
    <div className="pb-16 sm:pb-20 pt-2 sm:pt-4 max-w-5xl mx-auto px-3 sm:px-4 space-y-3.5">
      {/* Top Brand Banner with Flow Principle: LOCALIZAR → FILTRAR → COMPARAR → VERIFICAR → CONTACTAR */}
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
            Pensões, Guest Houses e Residenciais verificadas · Alojamento seguro perto de si.
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-sky-300/90 font-bold uppercase tracking-wider flex-wrap">
            <span>Localizar</span>
            <span className="text-sky-500">→</span>
            <span>Filtrar</span>
            <span className="text-sky-500">→</span>
            <span>Comparar</span>
            <span className="text-sky-500">→</span>
            <span>Verificar</span>
            <span className="text-sky-500">→</span>
            <span className="text-amber-300">Contactar</span>
          </div>
        </div>
      </div>

      {/* Main Search and Location Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-3xl border border-neutral-200/90 shadow-2xs space-y-2.5">
        {/* Search Input Row + "Perto de mim" + Filtros Trigger */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Pesquisar pensão, guest house, bairro, cidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-9 pr-8 bg-neutral-50 rounded-xl text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-neutral-200"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="w-7 h-7 absolute right-1.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 flex items-center justify-center cursor-pointer"
                title="Limpar pesquisa"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dedicated "Perto de mim" Button */}
          <button
            onClick={handleToggleNearMe}
            disabled={isLocatingUser}
            className={`h-11 px-3.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 active:scale-95 touch-manipulation ${
              isNearMeActive
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
            title="Localizar pensões e guest houses perto da minha localização atual"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocatingUser ? 'animate-spin' : isNearMeActive ? 'text-white' : 'text-emerald-700'}`} />
            <span className="hidden sm:inline">{isNearMeActive ? 'Perto de Mim Ativo' : 'Perto de Mim'}</span>
            <span className="sm:hidden">{isNearMeActive ? 'Perto' : 'Perto'}</span>
          </button>

          {/* Filter Modal Trigger */}
          <button
            onClick={() => setShowAdvancedFilters(true)}
            className={`h-11 px-3.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 active:scale-95 touch-manipulation ${
              activeFiltersCount > 0
                ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                : 'bg-neutral-50 border-neutral-200 text-neutral-800 hover:bg-neutral-100'
            }`}
            title="Abrir filtros de hospedagem"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="w-4.5 h-4.5 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Quick Dropdowns Row: Província & Tipo de Alojamento */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          {/* Province Selector */}
          <div className="relative">
            <select
              value={selectedProvince}
              onChange={(e) => handleProvinceClick(e.target.value)}
              className="w-full h-9.5 pl-2.5 pr-7 rounded-xl text-xs font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200/80 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer truncate"
            >
              <option value="all">📍 Moçambique (Todas)</option>
              {MOZ_PROVINCES_LIST.map((p) => (
                <option key={p} value={p}>📍 {p}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Type Selector (Strictly: Pensões, Guest Houses, Residenciais) */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as AccommodationType | 'all')}
              className="w-full h-9.5 pl-2.5 pr-7 rounded-xl text-xs font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200/80 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer truncate"
            >
              <option value="all">🏠 Todos os Alojamentos</option>
              <option value="pensao">🏠 Pensões</option>
              <option value="guest_house">🏡 Guest Houses</option>
              <option value="residencial">🏘️ Residenciais</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Quick Horizontal Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar text-xs">
          {/* Quick Verificados */}
          <button
            onClick={() => setVerificationLevel(verificationLevel === 'all' ? 'verified_in_person' : 'all')}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer transition-colors ${
              verificationLevel !== 'all'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Verificados Presencialmente</span>
          </button>

          {/* Quick 24h */}
          <button
            onClick={() => setOnly24h(!only24h)}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer transition-colors ${
              only24h
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>24 Horas</span>
          </button>

          {/* Quick AC */}
          <button
            onClick={() => toggleAmenity('ac')}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer transition-colors ${
              selectedAmenities.includes('ac')
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <span>❄️ AC</span>
          </button>

          {/* Quick Wi-Fi */}
          <button
            onClick={() => toggleAmenity('wifi')}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer transition-colors ${
              selectedAmenities.includes('wifi')
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <span>📶 Wi-Fi</span>
          </button>

          {/* Quick Gerador */}
          <button
            onClick={() => toggleAmenity('generator')}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer transition-colors ${
              selectedAmenities.includes('generator')
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <span>⚡ Gerador</span>
          </button>

          {/* Quick Banho Privativo */}
          <button
            onClick={() => toggleAmenity('private_bathroom')}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer transition-colors ${
              selectedAmenities.includes('private_bathroom')
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <span>🚿 Banho Privativo</span>
          </button>
        </div>

        {/* Location Notice / Feedback Banner */}
        {locationNotice && (
          <div className="bg-sky-50 text-sky-950 px-3 py-1.5 rounded-xl border border-sky-200 text-[11px] font-medium flex items-center justify-between">
            <div className="flex items-center gap-1.5 truncate">
              <Navigation2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span className="truncate">{locationNotice}</span>
            </div>
            <button
              onClick={() => setLocationNotice(null)}
              className="text-sky-700 hover:text-sky-950 ml-2 font-bold cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Active Filter Scope Notification Tag */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center justify-between bg-emerald-50 text-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-semibold">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">
                {selectedProvince !== 'all' ? selectedProvince : 'Moçambique'}
                {selectedDistrict !== 'all' ? ` · ${selectedDistrict}` : ''}
                {selectedNeighborhood !== 'all' ? ` · ${selectedNeighborhood}` : ''}
                {selectedType !== 'all' ? ` · ${selectedType === 'pensao' ? 'Pensões' : selectedType === 'guest_house' ? 'Guest Houses' : 'Residenciais'}` : ''}
                {isNearMeActive ? ' · Perto de mim' : ''}
                {verificationLevel !== 'all' ? ' · Verificados' : ''} ({filteredList.length})
              </span>
            </div>
            <button 
              onClick={resetFilters}
              className="text-[11px] text-emerald-800 font-bold underline hover:text-emerald-950 shrink-0 ml-2 cursor-pointer"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>

      {/* Advanced Filters Modal (Filtros Completos de Hospedagem) */}
      {showAdvancedFilters && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-200 relative my-auto animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-emerald-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" />
                <h3 className="font-extrabold text-base">Filtros de Hospedagem</h3>
              </div>
              <button
                onClick={() => setShowAdvancedFilters(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer transition-colors"
                title="Fechar filtros"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* 1. Localização & Proximidade */}
              <div>
                <label className="text-xs font-black text-neutral-800 uppercase tracking-wide block mb-1">
                  1. Localização & Proximidade
                </label>
                
                {/* Botão Perto de Mim */}
                <button
                  type="button"
                  onClick={handleToggleNearMe}
                  className={`w-full mb-2 h-11 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    isNearMeActive
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-800 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Navigation className={`w-4 h-4 ${isLocatingUser ? 'animate-spin' : ''}`} />
                    <span>Perto de Mim (GPS Automático)</span>
                  </div>
                  {isNearMeActive && <Check className="w-4 h-4" />}
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Província */}
                  <div className="relative">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-0.5">
                      Província
                    </label>
                    <select
                      value={selectedProvince}
                      onChange={(e) => handleProvinceClick(e.target.value)}
                      className="w-full h-10 px-3 pr-8 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-800 focus:ring-2 focus:ring-emerald-500 outline-none appearance-none cursor-pointer"
                    >
                      <option value="all">📍 Moçambique (Todas)</option>
                      {MOZ_PROVINCES_LIST.map((p) => (
                        <option key={p} value={p}>📍 {p}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-7 pointer-events-none" />
                  </div>

                  {/* Bairro ou Distrito */}
                  <div className="relative">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-0.5">
                      Bairro ou Zona
                    </label>
                    <select
                      value={selectedNeighborhood}
                      onChange={(e) => setSelectedNeighborhood(e.target.value)}
                      className="w-full h-10 px-3 pr-8 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-800 focus:ring-2 focus:ring-emerald-500 outline-none appearance-none cursor-pointer"
                    >
                      <option value="all">🏙️ Todos os Bairros</option>
                      {neighborhoodsList.map((b) => (
                        <option key={b} value={b}>🏙️ {b}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-7 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* 2. Tipo de Alojamento */}
              <div>
                <label className="text-xs font-black text-neutral-800 uppercase tracking-wide block mb-1">
                  2. Tipo de Alojamento
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedType(selectedType === 'pensao' ? 'all' : 'pensao')}
                    className={`h-11 px-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                      selectedType === 'pensao'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-800 hover:bg-neutral-100'
                    }`}
                  >
                    <span>🏠 Pensões</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedType(selectedType === 'guest_house' ? 'all' : 'guest_house')}
                    className={`h-11 px-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                      selectedType === 'guest_house'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-800 hover:bg-neutral-100'
                    }`}
                  >
                    <span>🏡 Guest Houses</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedType(selectedType === 'residencial' ? 'all' : 'residencial')}
                    className={`h-11 px-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                      selectedType === 'residencial'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-800 hover:bg-neutral-100'
                    }`}
                  >
                    <span>🏘️ Residenciais</span>
                  </button>
                </div>
              </div>

              {/* 3. Faixa de Preço por Noite */}
              <div>
                <label className="text-xs font-black text-neutral-800 uppercase tracking-wide block mb-1">
                  3. Preço por Noite
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'all', label: 'Qualquer Preço' },
                    { id: 'under_1500', label: 'Até 1.500 MT' },
                    { id: '1500_2500', label: '1.500 MT – 2.500 MT' },
                    { id: '2500_4000', label: '2.500 MT – 4.000 MT' },
                    { id: 'above_4000', label: 'Acima de 4.000 MT' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPriceFilter(p.id as any)}
                      className={`h-9 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        priceFilter === p.id
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <span>{p.label}</span>
                      {priceFilter === p.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Nível de Verificação & Confiança */}
              <div>
                <label className="text-xs font-black text-neutral-800 uppercase tracking-wide block mb-1.5">
                  4. Nível de Verificação
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVerificationLevel(verificationLevel === 'verified_in_person' ? 'all' : 'verified_in_person')}
                    className={`h-11 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                      verificationLevel === 'verified_in_person'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-800 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span className="truncate">Verificado Presencialmente</span>
                    </div>
                    {verificationLevel === 'verified_in_person' && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setOnly24h(!only24h)}
                    className={`h-11 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                      only24h
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-800 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span className="truncate">Recepção 24 Horas</span>
                    </div>
                    {only24h && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                </div>
              </div>

              {/* 5. Comodidades Úteis para Hospedagem */}
              <div>
                <label className="text-xs font-black text-neutral-800 uppercase tracking-wide block mb-1.5">
                  5. Comodidades
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'ac', name: 'Ar Condicionado' },
                    { id: 'wifi', name: 'Wi-Fi' },
                    { id: 'generator', name: 'Gerador / Energia 24h' },
                    { id: 'parking', name: 'Estacionamento Seguro' },
                    { id: 'private_bathroom', name: 'Casa de Banho Privada' },
                    { id: 'breakfast', name: 'Pequeno-Almoço' },
                    { id: 'restaurant', name: 'Restaurante' },
                    { id: 'bar', name: 'Bar' },
                    { id: 'tv', name: 'Televisão / DStv' },
                    { id: 'pool', name: 'Piscina' },
                    { id: 'security', name: 'Segurança 24h' },
                    { id: 'hot_water', name: 'Água Quente' },
                  ].map((amenity) => {
                    const isChecked = selectedAmenities.includes(amenity.id as AmenityId);
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => toggleAmenity(amenity.id as AmenityId)}
                        className={`h-8 px-2.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 text-emerald-600" />}
                        <span>{amenity.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. Ordenação */}
              <div>
                <label className="text-xs font-black text-neutral-800 uppercase tracking-wide block mb-1">
                  6. Ordenar Resultados Por
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'distance', label: 'Mais Próximos' },
                    { id: 'price_asc', label: 'Menor Preço' },
                    { id: 'rating', label: 'Melhor Avaliados' },
                    { id: 'name', label: 'Nome (A-Z)' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSortBy(s.id as any)}
                      className={`h-9 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        sortBy === s.id
                          ? 'bg-neutral-900 text-white border-neutral-900 font-bold'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <span>{s.label}</span>
                      {sortBy === s.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 border-t border-neutral-100 flex items-center gap-2 bg-neutral-50">
              <button
                type="button"
                onClick={resetFilters}
                className="h-11 px-4 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-bold cursor-pointer transition-colors"
              >
                Limpar Tudo
              </button>
              <button
                type="button"
                onClick={() => setShowAdvancedFilters(false)}
                className="flex-1 h-11 bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
              >
                <span>Ver {filteredList.length} Hospedagens</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accommodations Grid Header */}
      <div className="flex items-center justify-between px-1">
        <div className="text-xs text-neutral-600">
          <strong className="text-neutral-900 font-bold">{filteredList.length}</strong> pensões & guest houses encontradas
        </div>

        <button
          onClick={onSwitchToMap}
          className="h-8 px-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100 transition-colors cursor-pointer"
          title="Ver no Mapa de Moçambique"
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>Ver no Mapa</span>
        </button>
      </div>

      {/* Accommodations Grid (COMPARAR & CONTACTAR) */}
      {filteredList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 items-stretch">
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
            Nenhuma hospedagem encontrada com estes filtros
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Tente alterar os termos da pesquisa, limpar comodidades selecionadas ou escolher outra província.
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
