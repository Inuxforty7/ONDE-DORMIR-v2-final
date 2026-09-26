import React, { useState, useMemo, useCallback } from 'react';
import { Accommodation, AccommodationType, ActiveTab, UserLocationState } from './types';
import { INITIAL_ACCOMMODATIONS } from './data/accommodations';
import { calculateDistanceKm, MozLocationPreset } from './utils/geo';
import { getSavedAccommodationIds, toggleSaveAccommodation, clearSavedAccommodations } from './utils/privacy';

import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeTab } from './components/HomeTab';
import { ExploreTab } from './components/ExploreTab';
import { TourGuidesTab } from './components/TourGuidesTab';
import { RentACarTab } from './components/RentACarTab';
import { HeartLinkTab } from './components/HeartLinkTab';
import { MapView } from './components/MapView';
import { SavedTab } from './components/SavedTab';
import { AccountTab } from './components/AccountTab';
import { AccommodationDetailModal } from './components/AccommodationDetailModal';
import { LocationModal } from './components/LocationModal';
import { PrivacyModal } from './components/PrivacyModal';
import { RegisterAccommodationModal } from './components/RegisterAccommodationModal';

export default function App() {
  // State for accommodations list
  const [accommodations, setAccommodations] = useState<Accommodation[]>(INITIAL_ACCOMMODATIONS);

  // Active Bottom Tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warn' } | null>(null);

  const showToast = useCallback((text: string, type: 'success' | 'info' | 'warn' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((current) => (current?.text === text ? null : current));
    }, 3200);
  }, []);

  // Explore tab filter states (can be preset from Home)
  const [exploreTypeFilter, setExploreTypeFilter] = useState<AccommodationType | 'all'>('all');
  const [exploreSearchQuery, setExploreSearchQuery] = useState('');

  // Selected accommodation for detail view
  const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null);

  // Saved accommodation IDs in localStorage
  const [savedIds, setSavedIds] = useState<string[]>(() => getSavedAccommodationIds());

  // Modals state
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // User location state (defaults to Maputo Central)
  const [userLocation, setUserLocation] = useState<UserLocationState>({
    coords: { lat: -25.9692, lng: 32.5732 },
    name: 'Maputo (Centro)',
    isCustom: false,
    isLoading: false,
    error: null,
  });

  // Calculate distance for all accommodations based on user location
  const accommodationsWithDistance = useMemo(() => {
    return accommodations.map((item) => {
      if (!userLocation.coords) {
        return { ...item, distanceKm: undefined };
      }
      const dist = calculateDistanceKm(
        userLocation.coords.lat,
        userLocation.coords.lng,
        item.location.lat,
        item.location.lng
      );
      return { ...item, distanceKm: dist };
    });
  }, [accommodations, userLocation.coords]);

  // Updated selected accommodation with distance
  const currentDetailAccommodation = useMemo(() => {
    if (!selectedAccommodation) return null;
    return accommodationsWithDistance.find((a) => a.id === selectedAccommodation.id) || selectedAccommodation;
  }, [selectedAccommodation, accommodationsWithDistance]);

  // Request real GPS location
  const handleRequestGps = useCallback(() => {
    if (!('geolocation' in navigator)) {
      showToast('Geolocalização não suportada no seu navegador. Escolha a cidade manualmente.', 'warn');
      return;
    }

    setUserLocation((prev) => ({ ...prev, isLoading: true, error: null }));
    showToast('A obter sinal GPS do seu dispositivo...', 'info');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation({
          coords,
          name: 'Minha Localização (GPS)',
          isCustom: false,
          isLoading: false,
          error: null,
        });
        showToast('Localização GPS atualizada!', 'success');
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setUserLocation((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Não foi possível obter o GPS. Pode selecionar a cidade manualmente.',
        }));
        showToast('Não foi possível obter o GPS. Pode selecionar a cidade manualmente na lista.', 'warn');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [showToast]);

  // Handle Preset selection
  const handleSelectPreset = (preset: MozLocationPreset, neighborhood?: string) => {
    const locName = neighborhood ? `${preset.city} (${neighborhood})` : preset.name;
    setUserLocation({
      coords: preset.coords,
      name: locName,
      isCustom: true,
      isLoading: false,
      error: null,
    });
    showToast(`Localização definida para ${locName}`, 'success');
  };

  // Toggle Save handler
  const handleToggleSave = (id: string) => {
    const isNowSaved = toggleSaveAccommodation(id);
    setSavedIds(getSavedAccommodationIds());
    if (isNowSaved) {
      showToast('Hospedagem guardada no seu telemóvel!', 'success');
    } else {
      showToast('Hospedagem removida dos guardados.', 'info');
    }
  };

  // Clear all saved
  const handleClearSaved = () => {
    clearSavedAccommodations();
    setSavedIds([]);
    showToast('Lista de guardados limpa.', 'info');
  };

  // Navigate to explore from home
  const handleNavigateToExplore = (typeFilter?: AccommodationType, query?: string) => {
    if (typeFilter) {
      setExploreTypeFilter(typeFilter);
    } else {
      setExploreTypeFilter('all');
    }
    if (query) {
      setExploreSearchQuery(query);
    } else {
      setExploreSearchQuery('');
    }
    setActiveTab('explore');
  };

  // Add new accommodation from owner registration form
  const handleAddAccommodation = (newItem: Accommodation) => {
    setAccommodations((prev) => [newItem, ...prev]);
    showToast(`"${newItem.name}" adicionada com sucesso!`, 'success');
  };

  // Saved accommodations list
  const savedAccommodationsList = useMemo(() => {
    return accommodationsWithDistance.filter((item) => savedIds.includes(item.id));
  }, [accommodationsWithDistance, savedIds]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-neutral-50 flex flex-col font-sans selection:bg-emerald-500 selection:text-white relative">
      {/* Header */}
      <Header
        userLocation={userLocation}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onRequestGps={handleRequestGps}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        activeTab={activeTab}
      />

      {/* Main Tab Content */}
      <main className="flex-1 w-full overflow-x-hidden">
        {activeTab === 'home' && (
          <HomeTab
            userLocation={userLocation}
            accommodations={accommodationsWithDistance}
            onSelectAccommodation={setSelectedAccommodation}
            isSaved={(id) => savedIds.includes(id)}
            onToggleSave={handleToggleSave}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            onRequestGps={handleRequestGps}
            onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
            onNavigateToExplore={handleNavigateToExplore}
            onNavigateToTab={setActiveTab}
            onNavigateToMap={() => setActiveTab('map')}
            onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreTab
            accommodations={accommodationsWithDistance}
            userLocation={userLocation}
            onSelectAccommodation={setSelectedAccommodation}
            isSaved={(id) => savedIds.includes(id)}
            onToggleSave={handleToggleSave}
            onSwitchToMap={() => setActiveTab('map')}
            initialTypeFilter={exploreTypeFilter}
            initialSearchQuery={exploreSearchQuery}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
          />
        )}

        {activeTab === 'guides' && (
          <TourGuidesTab
            onBackToHome={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'rentacar' && (
          <RentACarTab
            onBackToHome={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'heartlink' && (
          <HeartLinkTab
            onBackToHome={() => setActiveTab('home')}
            accommodations={accommodationsWithDistance}
            onSelectAccommodation={setSelectedAccommodation}
            onNavigateToExplore={() => setActiveTab('explore')}
          />
        )}

        {activeTab === 'map' && (
          <MapView
            accommodations={accommodationsWithDistance}
            userCoords={userLocation.coords}
            onSelectAccommodation={setSelectedAccommodation}
            onRequestGps={handleRequestGps}
            isGpsLoading={userLocation.isLoading}
            isSaved={(id) => savedIds.includes(id)}
            onToggleSave={handleToggleSave}
            onSwitchToList={() => setActiveTab('explore')}
          />
        )}

        {activeTab === 'saved' && (
          <SavedTab
            savedAccommodations={savedAccommodationsList}
            onSelectAccommodation={setSelectedAccommodation}
            onToggleSave={handleToggleSave}
            onClearAllSaved={handleClearSaved}
            onNavigateToExplore={() => setActiveTab('explore')}
          />
        )}

        {activeTab === 'account' && (
          <AccountTab
            userLocation={userLocation}
            onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
            onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            savedCount={savedIds.length}
            totalAccommodationsCount={accommodations.length}
            onClearStorage={handleClearSaved}
          />
        )}
      </main>

      {/* Accommodation Full Detail Profile Modal */}
      <AccommodationDetailModal
        accommodation={currentDetailAccommodation}
        isOpen={!!selectedAccommodation}
        onClose={() => setSelectedAccommodation(null)}
        isSaved={selectedAccommodation ? savedIds.includes(selectedAccommodation.id) : false}
        onToggleSave={handleToggleSave}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
      />

      {/* Location Selector Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectPreset={handleSelectPreset}
        onRequestGps={handleRequestGps}
        currentLocationName={userLocation.name}
        isGpsLoading={userLocation.isLoading}
      />

      {/* Privacy Manifesto Modal */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Register Accommodation Modal */}
      <RegisterAccommodationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onAddAccommodation={handleAddAccommodation}
        userCoordsLat={userLocation.coords?.lat}
        userCoordsLng={userLocation.coords?.lng}
      />

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        savedCount={savedIds.length}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl shadow-lg border text-xs font-bold animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-md flex items-center gap-2 max-w-sm text-center">
          <div
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm ${
              toastMessage.type === 'success'
                ? 'bg-emerald-900/90 text-white border border-emerald-400/40'
                : toastMessage.type === 'warn'
                ? 'bg-amber-900/90 text-white border border-amber-400/40'
                : 'bg-neutral-900/90 text-white border border-neutral-700'
            }`}
          >
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}
    </div>
  );
}
