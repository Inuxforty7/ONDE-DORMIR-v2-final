import React, { useEffect, useRef, useState } from 'react';
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
  Filter,
  Layers,
  Phone,
  ArrowLeft
} from 'lucide-react';
import { Accommodation, AccommodationType, LocationCoordinates, UserLocationState } from '../types';
import { formatDistance, getDirectionsUrl, getWhatsAppInquiryUrl, isLocationMatched } from '../utils/geo';
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

  // Filtered list by type & active province
  const filteredList = accommodations.filter((item) => {
    // Location match
    if (userLocation && !isLocationMatched(item.location.province, item.location.city, userLocation)) {
      return false;
    }

    if (filterType === 'all') return true;
    if (filterType === 'pensao' || filterType === 'guest_house' || filterType === 'residencial') {
      return item.type === 'pensao' || item.type === 'guest_house' || item.type === 'residencial';
    }
    return item.type === filterType;
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default to Maputo coords or userCoords
      const initialLat = userCoords?.lat || -25.9692;
      const initialLng = userCoords?.lng || 32.5732;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 13,
        zoomControl: false,
      });

      // OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      // Add Zoom control at top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;

      // Ensure tiles load fully without grey areas
      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 250);

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

  // Update User Location marker and auto-center on device
  useEffect(() => {
    if (!mapInstanceRef.current || !userCoords) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userCoords.lat, userCoords.lng]);
    } else {
      const userHtml = `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping"></div>
          <div class="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md"></div>
        </div>
      `;

      const userIcon = L.divIcon({
        className: 'user-location-pin',
        html: userHtml,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], {
        icon: userIcon,
        zIndexOffset: 1000,
      })
        .bindPopup('<b>📍 O Seu Dispositivo (GPS Real)</b>')
        .addTo(mapInstanceRef.current);
    }

    // Pan map to device location with animation
    mapInstanceRef.current.flyTo([userCoords.lat, userCoords.lng], 14, {
      animate: true,
      duration: 1,
    });
  }, [userCoords]);

  // Update Accommodation Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    filteredList.forEach((place) => {
      const isSelected = selectedPlace?.id === place.id;
      const typeColor = 
        place.type === 'pensao' || place.type === 'guest_house' || place.type === 'residencial'
          ? '#d97706' // warm amber
          : place.type === 'hotel'
          ? '#2563eb' // blue
          : '#0d9488'; // teal

      const iconHtml = `
        <div style="cursor: pointer;" class="flex flex-col items-center group transition-transform hover:scale-105 active:scale-95">
          <div style="background-color: ${isSelected ? '#0f172a' : typeColor};" 
               class="px-2.5 py-1 rounded-xl text-white font-bold text-[11px] shadow-lg border border-white flex items-center gap-1 whitespace-nowrap max-w-[140px] truncate">
            <span class="truncate">${place.name}</span>
          </div>
          <div style="border-top-color: ${isSelected ? '#0f172a' : typeColor};" 
               class="w-0 h-0 border-x-5 border-x-transparent border-t-5 -mt-px"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: iconHtml,
        iconSize: [140, 32],
        iconAnchor: [70, 32],
      });

      const marker = L.marker([place.location.lat, place.location.lng], {
        icon: customIcon,
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
  }, [filteredList, selectedPlace]);

  // Center on user or bounds
  const handleCenterOnMe = () => {
    if (!mapInstanceRef.current) return;
    if (userCoords) {
      mapInstanceRef.current.setView([userCoords.lat, userCoords.lng], 14, {
        animate: true,
      });
    } else {
      onRequestGps();
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-60px)] bg-neutral-100 overflow-hidden">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* 
        =======================================================
        TOP FLOATING NAVIGATION HEADER:
        Big, Prominent Back Arrow Button + Region Indicator
        =======================================================
      */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none gap-2">
        {/* Touch-Friendly Return Button */}
        <button
          type="button"
          onClick={onSwitchToList}
          className="pointer-events-auto h-11 px-4 bg-white/95 hover:bg-white active:scale-95 text-neutral-900 rounded-2xl shadow-xl border border-neutral-300 font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all touch-manipulation backdrop-blur-md"
          title="Voltar para a lista de alojamentos"
        >
          <ArrowLeft className="w-5 h-5 text-emerald-700 stroke-[2.5]" />
          <span>Voltar para Lista</span>
        </button>

        {/* Current Active Location Pill */}
        <div className="pointer-events-auto px-3.5 py-2.5 bg-neutral-900/90 backdrop-blur-md text-white rounded-2xl text-xs font-bold shadow-xl border border-white/20 flex items-center gap-1.5 shrink-0">
          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate max-w-[120px] sm:max-w-xs">
            {userLocation?.name || 'Moçambique'}
          </span>
        </div>
      </div>

      {/* Floating Top Filter / Controls Bar right below the back bar */}
      <div className="absolute top-16 left-3 right-3 sm:right-auto sm:max-w-md z-20 flex flex-col gap-2">
        {/* Quick Type pills */}
        <div className="flex gap-1.5 p-1.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-md border border-neutral-200/80 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilterType('all')}
            className={`h-8 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center ${
              filterType === 'all'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            Todos ({accommodations.length})
          </button>
          <button
            onClick={() => setFilterType('pensao')}
            className={`h-8 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center ${
              filterType === 'pensao' || filterType === 'guest_house' || filterType === 'residencial'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            Pensões & Guest Houses
          </button>
          <button
            onClick={() => setFilterType('hotel')}
            className={`h-8 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center ${
              filterType === 'hotel'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            Hotéis
          </button>
          <button
            onClick={() => setFilterType('lodge')}
            className={`h-8 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center ${
              filterType === 'lodge'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            Lodges & Praia
          </button>
        </div>
      </div>

      {/* Floating Action Controls - positioned so it never overlaps the bottom preview card */}
      <div className="absolute right-3 top-28 sm:top-24 z-10 flex flex-col gap-2 items-end">
        {/* Recenter / GPS */}
        <button
          onClick={handleCenterOnMe}
          className="w-11 h-11 bg-white/95 backdrop-blur-md text-neutral-800 hover:text-emerald-600 rounded-2xl shadow-md border border-neutral-200/90 transition-all active:scale-95 flex items-center justify-center cursor-pointer touch-manipulation"
          title="Centralizar na minha localização"
          aria-label="Centralizar na minha localização"
        >
          <Navigation className={`w-5 h-5 ${isGpsLoading ? 'animate-spin text-emerald-600' : ''}`} />
        </button>

        {/* Switch to List */}
        <button
          onClick={onSwitchToList}
          className="h-10 px-3 bg-neutral-900/90 backdrop-blur-md hover:bg-neutral-900 text-white rounded-xl shadow-md text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer touch-manipulation"
          title="Ver lista de estabelecimentos"
        >
          <Layers className="w-4 h-4" />
          <span className="hidden sm:inline">Ver Lista</span>
        </button>
      </div>

      {/* Selected Place Bottom Sheet Preview */}
      {selectedPlace && (
        <div className="absolute bottom-20 sm:bottom-22 left-2.5 right-2.5 sm:left-6 sm:max-w-md z-20 animate-in slide-in-from-bottom-6 duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200/90 p-3 sm:p-4 overflow-hidden">
            <div className="flex items-start justify-between gap-2.5">
              <div 
                onClick={() => onSelectAccommodation(selectedPlace)}
                className="flex gap-2.5 sm:gap-3 cursor-pointer flex-1 min-w-0"
              >
                <img
                  src={selectedPlace.photos[0]}
                  alt={selectedPlace.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-neutral-500">
                      {ACCOMMODATION_TYPE_LABELS[selectedPlace.type]?.label}
                    </span>
                    {selectedPlace.verificationStatus === 'verified_in_person' ? (
                      <span className="text-[10px] font-black text-amber-600 flex items-center gap-0.5">🥇 Presencial</span>
                    ) : selectedPlace.verificationStatus === 'verified' ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : null}
                  </div>
                  <h4 className="font-bold text-sm text-neutral-900 truncate">
                    {selectedPlace.name}
                  </h4>
                  <p className="text-xs text-neutral-600 truncate mt-0.5">
                    {selectedPlace.location.neighborhood}, {selectedPlace.location.city}
                    {selectedPlace.location.landmark ? ` • ${selectedPlace.location.landmark}` : ''}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {selectedPlace.distanceKm !== undefined && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                        <Navigation className="w-2.5 h-2.5 text-emerald-600" />
                        <span>{formatDistance(selectedPlace.distanceKm)}</span>
                      </span>
                    )}
                    {selectedPlace.isOpen24h && (
                      <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        24 Horas
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedPlace(null)}
                className="w-7 h-7 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Fechar prévia"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions in Bottom Sheet */}
            <div className="mt-3.5 pt-3 border-t border-neutral-100 flex items-center gap-2">
              <a
                href={getWhatsAppInquiryUrl(selectedPlace.whatsapp, selectedPlace.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-10 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="Contactar recepção no WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Contactar</span>
              </a>

              <a
                href={`tel:${selectedPlace.phone}`}
                className="h-10 w-10 bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-700 rounded-xl flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Ligar para a recepção"
                aria-label="Ligar para a recepção"
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
                className="h-10 px-3 bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                title="Ver rota e como chegar"
              >
                <Navigation2 className="w-4 h-4 text-neutral-600" />
                <span className="hidden xs:inline">Rota</span>
              </a>

              <button
                onClick={() => onSelectAccommodation(selectedPlace)}
                className="h-10 w-10 bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Ver detalhes completos do local"
                aria-label="Ver detalhes completos do local"
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
