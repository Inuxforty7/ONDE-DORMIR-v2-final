import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { 
  Navigation, 
  MapPin, 
  MessageCircle, 
  Navigation2, 
  X, 
  Heart, 
  ShieldCheck, 
  ChevronRight, 
  Phone, 
  ArrowLeft,
  Search,
  Compass,
  AlertTriangle,
  Building,
  BedDouble,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { 
  Accommodation, 
  AccommodationType, 
  LocationCoordinates, 
  UserLocationState 
} from '../types';
import { 
  formatDistance, 
  getDirectionsUrl, 
  getWhatsAppInquiryUrl, 
  isLocationMatched,
  MOZ_PRESET_LOCATIONS,
  calculateDistanceKm
} from '../utils/geo';
import { ACCOMMODATION_TYPE_LABELS } from '../utils/amenities';

interface MapViewProps {
  accommodations: Accommodation[];
  userCoords: LocationCoordinates | null;
  userLocation?: UserLocationState;
  onSelectAccommodation: (item: Accommodation) => void;
  onRequestGps: () => void;
  isGpsLoading: boolean;
  isSaved: (id: string) => boolean;
  onToggleSave: (id: string) => void;
  onSwitchToList: () => void;
}

export const MapView: React.FC<MapViewProps> = ({
  accommodations,
  userCoords,
  userLocation,
  onSelectAccommodation,
  onRequestGps,
  isGpsLoading,
  isSaved,
  onToggleSave,
  onSwitchToList,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [selectedPlace, setSelectedPlace] = useState<Accommodation | null>(null);
  const [filterType, setFilterType] = useState<AccommodationType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState<number>(accommodations.length);
  const [isLowAccuracy, setIsLowAccuracy] = useState(false);
  const [gpsNotice, setGpsNotice] = useState<string | null>(null);

  // Filtered list by type & text search
  const filteredList = useMemo(() => {
    let list = accommodations;

    // Filter by type
    if (filterType !== 'all') {
      list = list.filter((item) => item.type === filterType);
    }

    // Filter by search query (province, city, district, neighborhood, name)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((item) =>
        item.name.toLowerCase().includes(q) ||
        item.location.city.toLowerCase().includes(q) ||
        item.location.province.toLowerCase().includes(q) ||
        item.location.neighborhood.toLowerCase().includes(q) ||
        (item.location.district && item.location.district.toLowerCase().includes(q)) ||
        (item.location.address && item.location.address.toLowerCase().includes(q))
      );
    }

    // Recalculate distance if userCoords are available
    if (userCoords) {
      list = list.map((item) => {
        const dist = calculateDistanceKm(
          userCoords.lat,
          userCoords.lng,
          item.location.lat,
          item.location.lng
        );
        return {
          ...item,
          distanceKm: dist
        };
      });
    }

    return list;
  }, [accommodations, filterType, searchQuery, userCoords]);

  // Count items inside currently visible map bounds
  const updateVisibleCount = () => {
    if (!mapInstanceRef.current) return;
    const bounds = mapInstanceRef.current.getBounds();
    const count = filteredList.filter((place) =>
      bounds.contains([place.location.lat, place.location.lng])
    ).length;
    setVisibleCount(count);
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default to user coordinates or center of Maputo/Mozambique
      const initialLat = userCoords?.lat || (userLocation?.coords?.lat ?? -25.9692);
      const initialLng = userCoords?.lng || (userLocation?.coords?.lng ?? 32.5732);

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 13,
        zoomControl: false,
      });

      // OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add Zoom control at top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;

      // Update visible count on pan/zoom
      map.on('moveend', () => {
        updateVisibleCount();
      });

      const timer = setTimeout(() => {
        map.invalidateSize();
        updateVisibleCount();
      }, 300);

      const handleResize = () => {
        map.invalidateSize();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }
  }, []);

  // Update User Location Beacon Pin on map
  useEffect(() => {
    if (!mapInstanceRef.current || !userCoords) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userCoords.lat, userCoords.lng]);
    } else {
      const userHtml = `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-9 h-9 rounded-full bg-blue-500/30 animate-ping"></div>
          <div class="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center">
            <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
          </div>
          <div class="absolute -bottom-5 bg-neutral-900 text-white text-[9px] font-black px-1.5 py-0.2 rounded shadow whitespace-nowrap">
            📍 Você
          </div>
        </div>
      `;

      const userIcon = L.divIcon({
        className: 'user-location-beacon-pin',
        html: userHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], {
        icon: userIcon,
        zIndexOffset: 2000,
      })
        .bindPopup('<b>📍 A Sua Posição GPS Atual</b>')
        .addTo(mapInstanceRef.current);
    }

    mapInstanceRef.current.flyTo([userCoords.lat, userCoords.lng], 14, {
      animate: true,
      duration: 1,
    });
  }, [userCoords]);

  // Update Accommodation Pins with Distinct States (Regular, Selected, Unverified)
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    filteredList.forEach((place) => {
      const isSelected = selectedPlace?.id === place.id;
      const isVerified = place.verificationStatus === 'verified' || place.verificationStatus === 'verified_in_person';
      const minPrice = place.priceEstimate?.approxMin;

      // Color themes:
      // Selected: Dark Navy with Gold/Emerald ring
      // Verified: Emerald #059669
      // Unverified: Slate/Grey #475569
      const pinColor = isSelected 
        ? '#0f172a' 
        : isVerified 
        ? '#059669' 
        : '#475569';

      const priceText = minPrice ? `${minPrice.toLocaleString('pt-MZ')} MT` : 'Preço não publ.';

      const iconHtml = `
        <div style="cursor: pointer;" class="flex flex-col items-center group transition-transform ${isSelected ? 'scale-115 -translate-y-1' : 'hover:scale-105'} active:scale-95">
          <div style="background-color: ${pinColor}; ${isSelected ? 'box-shadow: 0 0 0 3px #10b981, 0 10px 15px -3px rgba(0,0,0,0.3);' : 'box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2);'}" 
               class="px-2.5 py-1 rounded-xl text-white font-extrabold text-[11px] border border-white flex items-center gap-1.5 whitespace-nowrap shadow-md">
            ${isVerified ? '<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>' : '<span class="w-1.5 h-1.5 rounded-full bg-neutral-300"></span>'}
            <span class="truncate max-w-[120px]">${place.name}</span>
            <span class="text-[10px] text-amber-300 font-black pl-1 border-l border-white/20">${priceText}</span>
          </div>
          <div style="border-top-color: ${pinColor};" 
               class="w-0 h-0 border-x-5 border-x-transparent border-t-6 -mt-px"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-property-pin',
        html: iconHtml,
        iconSize: [160, 36],
        iconAnchor: [80, 36],
      });

      const marker = L.marker([place.location.lat, place.location.lng], {
        icon: customIcon,
        zIndexOffset: isSelected ? 1500 : 500,
      });

      marker.on('click', () => {
        setSelectedPlace(place);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo([place.location.lat, place.location.lng], {
            animate: true,
            duration: 0.5,
          });
        }
      });

      markersLayerRef.current?.addLayer(marker);
    });

    updateVisibleCount();
  }, [filteredList, selectedPlace]);

  // Quick Center on user GPS with error handling
  const handleCenterOnMe = () => {
    if (!navigator.geolocation) {
      setGpsNotice('Geolocalização não suportada no seu navegador. Escolha uma cidade no mapa.');
      return;
    }

    onRequestGps();

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const accuracy = pos.coords.accuracy;
        setIsLowAccuracy(accuracy > 1000);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([pos.coords.latitude, pos.coords.longitude], 14, {
            animate: true,
            duration: 1,
          });
        }
        setGpsNotice(null);
      },
      (err) => {
        console.warn('GPS permission denied:', err.message);
        setGpsNotice('Permissão GPS não concedida. Pode navegar manualmente pelo mapa de Moçambique.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Jump to specific preset city
  const handleJumpToPreset = (presetId: string) => {
    const preset = MOZ_PRESET_LOCATIONS.find((p) => p.id === presetId);
    if (preset && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([preset.coords.lat, preset.coords.lng], 13, {
        animate: true,
        duration: 1,
      });
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-60px)] bg-neutral-100 overflow-hidden">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* TOP FLOATING CONTROLS & NAVIGATION */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-col gap-2 pointer-events-none">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Back to List Button */}
          <button
            type="button"
            onClick={onSwitchToList}
            className="pointer-events-auto h-11 px-4 bg-white/95 hover:bg-white active:scale-95 text-neutral-900 rounded-2xl shadow-xl border border-neutral-300 font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all touch-manipulation backdrop-blur-md"
            title="Voltar para a lista de alojamentos"
          >
            <ArrowLeft className="w-5 h-5 text-emerald-700 stroke-[2.5]" />
            <span>Lista</span>
          </button>

          {/* Quick City Jump Dropdown */}
          <div className="pointer-events-auto relative">
            <select
              onChange={(e) => handleJumpToPreset(e.target.value)}
              defaultValue=""
              className="h-11 pl-3 pr-8 bg-neutral-900/90 hover:bg-neutral-900 text-white rounded-2xl text-xs font-bold shadow-xl border border-white/20 appearance-none cursor-pointer backdrop-blur-md outline-none"
            >
              <option value="" disabled>📍 Saltar para Cidade...</option>
              {MOZ_PRESET_LOCATIONS.map((preset) => (
                <option key={preset.id} value={preset.id} className="bg-neutral-900 text-white">
                  📍 {preset.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-300 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Search Bar & Visible Count in Area */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Pesquisar cidade, bairro, pensão no mapa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-8 bg-white/95 backdrop-blur-md rounded-xl text-xs text-neutral-800 placeholder-neutral-400 border border-neutral-200 shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="w-7 h-7 absolute right-1.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Floating Visible Area Counter */}
          <div className="px-3 h-10 bg-emerald-700/90 backdrop-blur-md text-white rounded-xl text-xs font-extrabold shadow-md border border-emerald-500/40 flex items-center gap-1.5 shrink-0">
            <Building className="w-3.5 h-3.5 text-emerald-300" />
            <span>{visibleCount} na área</span>
          </div>
        </div>

        {/* GPS Notice / Low Accuracy Banner */}
        {(gpsNotice || isLowAccuracy) && (
          <div className="bg-amber-50/95 backdrop-blur-md text-amber-950 p-2.5 rounded-xl border border-amber-300 text-xs font-semibold flex items-center justify-between pointer-events-auto shadow-md">
            <div className="flex items-center gap-1.5 truncate">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="truncate">
                {gpsNotice || 'Precisão GPS aproximada. Resultados ordenados por proximidade.'}
              </span>
            </div>
            <button
              onClick={() => {
                setGpsNotice(null);
                setIsLowAccuracy(false);
              }}
              className="text-amber-800 font-bold ml-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Floating Action Controls (Right side) */}
      <div className="absolute right-3 top-36 z-20 flex flex-col gap-2 items-end">
        {/* Recenter on GPS */}
        <button
          onClick={handleCenterOnMe}
          disabled={isGpsLoading}
          className="w-11 h-11 bg-white/95 backdrop-blur-md text-neutral-800 hover:text-emerald-600 rounded-2xl shadow-xl border border-neutral-200/90 transition-all active:scale-95 flex items-center justify-center cursor-pointer touch-manipulation"
          title="Centralizar na minha localização GPS real"
          aria-label="Centralizar na minha localização"
        >
          <Navigation className={`w-5 h-5 ${isGpsLoading ? 'animate-spin text-emerald-600' : 'text-emerald-700'}`} />
        </button>

        {/* Filter Types Pill */}
        <button
          onClick={() => setFilterType(filterType === 'pensao' ? 'all' : 'pensao')}
          className={`h-9 px-3 rounded-xl shadow-lg border text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
            filterType === 'pensao'
              ? 'bg-emerald-700 text-white border-emerald-700'
              : 'bg-white/95 text-neutral-700 border-neutral-200 hover:bg-neutral-50'
          }`}
        >
          <span>🏠 Pensões</span>
        </button>

        <button
          onClick={() => setFilterType(filterType === 'guest_house' ? 'all' : 'guest_house')}
          className={`h-9 px-3 rounded-xl shadow-lg border text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
            filterType === 'guest_house'
              ? 'bg-emerald-700 text-white border-emerald-700'
              : 'bg-white/95 text-neutral-700 border-neutral-200 hover:bg-neutral-50'
          }`}
        >
          <span>🏡 Guest Houses</span>
        </button>
      </div>

      {/* Selected Place Bottom Sheet Preview (Mobile-First Card) */}
      {selectedPlace && (
        <div className="absolute bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-30 animate-in slide-in-from-bottom-6 duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-neutral-200/90 p-3.5 sm:p-4 overflow-hidden space-y-3">
            <div className="flex items-start justify-between gap-2.5">
              <div 
                onClick={() => onSelectAccommodation(selectedPlace)}
                className="flex gap-3 cursor-pointer flex-1 min-w-0"
              >
                <img
                  src={selectedPlace.photos[0]}
                  alt={selectedPlace.name}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 border border-neutral-100"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5">
                    {selectedPlace.verificationStatus === 'verified_in_person' ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-md border border-emerald-200 flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> Presencial
                      </span>
                    ) : selectedPlace.verificationStatus === 'verified' ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-md border border-emerald-200 flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verificado
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-neutral-500 bg-neutral-100 px-1.5 py-0.2 rounded-md border border-neutral-200">
                        ⚪ Não Verificado
                      </span>
                    )}

                    {selectedPlace.isPremium && (
                      <span className="text-[10px] font-black bg-amber-400 text-zinc-950 px-1.5 py-0.2 rounded-md">
                        PREMIUM
                      </span>
                    )}
                  </div>

                  <h4 className="font-extrabold text-sm text-neutral-900 truncate group-hover:text-emerald-700">
                    {selectedPlace.name}
                  </h4>

                  <div className="flex items-center gap-1 text-xs text-neutral-600 truncate font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">
                      {selectedPlace.location.neighborhood || selectedPlace.location.city}
                    </span>
                    {selectedPlace.distanceKm !== undefined && (
                      <>
                        <span className="text-neutral-300">·</span>
                        <strong className="text-emerald-700 font-bold shrink-0">
                          {formatDistance(selectedPlace.distanceKm).replace('de si', '')}
                        </strong>
                      </>
                    )}
                  </div>

                  <div className="text-xs font-bold text-neutral-800">
                    {selectedPlace.priceEstimate?.approxMin ? (
                      <span>
                        A partir de <strong className="text-emerald-700 font-black">{selectedPlace.priceEstimate.approxMin.toLocaleString('pt-MZ')} MT</strong>
                        <span className="text-[10px] text-neutral-400 font-normal">/noite</span>
                      </span>
                    ) : (
                      <span className="text-neutral-500 font-bold">Preço não publicado</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedPlace(null)}
                className="w-8 h-8 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Fechar prévia"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Actions: WhatsApp + Call + Directions + Details */}
            <div className="pt-2 border-t border-neutral-100 flex items-center gap-2">
              <a
                href={getWhatsAppInquiryUrl(selectedPlace.whatsapp, selectedPlace.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-11 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer touch-manipulation"
                title="Reservar diretamente via WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`tel:${selectedPlace.phone}`}
                className="h-11 w-11 bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-700 rounded-xl flex items-center justify-center transition-colors cursor-pointer shrink-0 touch-manipulation"
                title="Ligar para a recepção"
              >
                <Phone className="w-4 h-4 text-neutral-700" />
              </a>

              <a
                href={getDirectionsUrl(
                  selectedPlace.location.lat,
                  selectedPlace.location.lng,
                  selectedPlace.name
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-3 bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 touch-manipulation"
                title="Ver rota GPS no mapa"
              >
                <Navigation2 className="w-4 h-4 text-emerald-700" />
                <span className="hidden xs:inline">Rota</span>
              </a>

              <button
                onClick={() => onSelectAccommodation(selectedPlace)}
                className="h-11 w-11 bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center justify-center transition-colors cursor-pointer shrink-0 touch-manipulation shadow-xs"
                title="Ver informações completas"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
