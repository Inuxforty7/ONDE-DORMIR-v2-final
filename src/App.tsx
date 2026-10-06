import React, { useState, useMemo, useCallback } from 'react';
import { Accommodation, AccommodationType, ActiveTab, UserLocationState } from './types';
import { INITIAL_ACCOMMODATIONS } from './data/accommodations';
import { calculateDistanceKm, MozLocationPreset, findNearestPresetLocation, MOZ_PRESET_LOCATIONS } from './utils/geo';
import { getSavedAccommodationIds, toggleSaveAccommodation, clearSavedAccommodations } from './utils/privacy';

import { Header } from './components/Header';
import { HomeTab } from './components/HomeTab';
import { ExploreTab } from './components/ExploreTab';
import { TourGuidesTab } from './components/TourGuidesTab';
import { RentACarTab } from './components/RentACarTab';
import { HeartLinkTab } from './components/HeartLinkTab';
import { LoveShopTab } from './components/LoveShopTab';
import { MapView } from './components/MapView';
import { SavedTab } from './components/SavedTab';
import { AccountTab } from './components/AccountTab';
import { AccommodationDetailModal } from './components/AccommodationDetailModal';
import { LocationModal } from './components/LocationModal';
import { PrivacyModal } from './components/PrivacyModal';
import { TermsModal } from './components/TermsModal';
import { RegisterAccommodationModal } from './components/RegisterAccommodationModal';
import { ContactLockedNoticeModal } from './components/ContactLockedNoticeModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { BottomNavBar } from './components/BottomNavBar';
import { contactUnlockService } from './services/contactUnlockService';
import { LockedContactTarget } from './types/contactUnlock';

export default function App() {
  // State for accommodations list
  const [accommodations, setAccommodations] = useState<Accommodation[]>(INITIAL_ACCOMMODATIONS);

  // Active Bottom Tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [previousTab, setPreviousTab] = useState<ActiveTab>('home');

  const handleNavigateToTab = useCallback((tab: ActiveTab) => {
    setActiveTab((prev) => {
      if (prev !== tab && prev !== 'map') {
        setPreviousTab(prev);
      }
      return tab;
    });
  }, []);

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
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [lockedTargetNotice, setLockedTargetNotice] = useState<LockedContactTarget | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(() => contactUnlockService.getUnreadCount());

  // Listen for global contact-locked event and notification count changes
  React.useEffect(() => {
    const handleLockedEvent = (e: Event) => {
      const customEvent = e as CustomEvent<LockedContactTarget>;
      if (customEvent.detail) {
        setLockedTargetNotice(customEvent.detail);
        showToast('⚠️ Contacto não desbloqueado pelo proprietário', 'warn');
      }
    };

    const handleServiceChange = () => {
      setUnreadCount(contactUnlockService.getUnreadCount());
    };

    window.addEventListener('onde-dormir-contact-locked', handleLockedEvent);
    const unsub = contactUnlockService.subscribe(handleServiceChange);

    return () => {
      window.removeEventListener('onde-dormir-contact-locked', handleLockedEvent);
      unsub();
    };
  }, [showToast]);

  // User location state (persisted in localStorage, defaults to Inhambane for instant localized experience)
  const [userLocation, setUserLocation] = useState<UserLocationState>(() => {
    const saved = localStorage.getItem('onde_dormir_user_location');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      coords: { lat: -23.8650, lng: 35.3833 },
      name: 'Inhambane (Cidade)',
      city: 'Inhambane',
      province: 'Inhambane',
      isAllMozambique: false,
      isCustom: true,
      isLoading: false,
      error: null,
    };
  });

  // Calculate distance for all accommodations based on user location
  // Always resolves a valid reference location so "a X metros de si" is NEVER missing!
  const accommodationsWithDistance = useMemo(() => {
    let refCoords = userLocation.coords;
    if (!refCoords) {
      if (userLocation.province) {
        const found = MOZ_PRESET_LOCATIONS.find(
          (p) => p.province.toLowerCase() === userLocation.province?.toLowerCase() ||
                 p.name.toLowerCase().includes(userLocation.province?.toLowerCase() || '')
        );
        if (found) refCoords = found.coords;
      }
    }
    // Reliable default fallback to Inhambane center
    if (!refCoords) {
      refCoords = { lat: -23.8650, lng: 35.3833 };
    }

    return accommodations.map((item) => {
      const dist = calculateDistanceKm(
        refCoords!.lat,
        refCoords!.lng,
        item.location.lat,
        item.location.lng
      );
      return { ...item, distanceKm: dist };
    });
  }, [accommodations, userLocation]);

  // Updated selected accommodation with distance
  const currentDetailAccommodation = useMemo(() => {
    if (!selectedAccommodation) return null;
    return accommodationsWithDistance.find((a) => a.id === selectedAccommodation.id) || selectedAccommodation;
  }, [selectedAccommodation, accommodationsWithDistance]);

  // Request real GPS location and detect the nearest Mozambican province/city
  const handleRequestGps = useCallback(() => {
    setUserLocation((prev) => ({ ...prev, isLoading: true, error: null }));
    showToast('A obter sinal GPS do seu dispositivo...', 'info');

    const applyRealCoords = async (lat: number, lng: number, sourceLabel: string = 'GPS') => {
      const coords = { lat, lng };
      
      // Determine nearest Mozambican reference province for filtering
      const nearest = findNearestPresetLocation(coords.lat, coords.lng);
      
      let detectedCity = nearest.city;
      let detectedProvince = nearest.province;
      let detectedName = `${nearest.city} (${sourceLabel})`;

      try {
        // Attempt fast reverse geocoding for real street / locality name
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
          { headers: { 'Accept-Language': 'pt, en' }, signal: AbortSignal.timeout(3000) }
        );
        if (res.ok) {
          const data = await res.json();
          const addr = data.address || {};
          const locality = addr.suburb || addr.neighbourhood || addr.city || addr.town || addr.municipality || addr.village;
          const prov = addr.state || addr.province || addr.region;
          if (locality) {
            detectedCity = locality;
            detectedName = prov ? `${locality}, ${prov}` : locality;
          }
          if (prov) {
            detectedProvince = prov;
          }
        }
      } catch {
        // Use nearest preset on reverse geocode timeout
      }

      const newLoc: UserLocationState = {
        coords,
        name: detectedName,
        city: detectedCity,
        province: detectedProvince,
        isAllMozambique: false,
        isCustom: false,
        isLoading: false,
        error: null,
      };

      setUserLocation(newLoc);
      localStorage.setItem('onde_dormir_user_location', JSON.stringify(newLoc));
      showToast(`📍 GPS Real Ativado: ${detectedName}`, 'success');
    };

    const handleFallback = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3500) });
        if (res.ok) {
          const data = await res.json();
          if (data.latitude && data.longitude) {
            await applyRealCoords(data.latitude, data.longitude, 'Rede/IP');
            return;
          }
        }
      } catch {
        // Ignore
      }

      const fallbackPreset = MOZ_PRESET_LOCATIONS[0];
      const newLoc: UserLocationState = {
        coords: fallbackPreset.coords,
        name: fallbackPreset.name,
        city: fallbackPreset.city,
        province: fallbackPreset.province,
        isAllMozambique: false,
        isCustom: true,
        isLoading: false,
        error: null,
      };
      setUserLocation(newLoc);
      localStorage.setItem('onde_dormir_user_location', JSON.stringify(newLoc));
      showToast(`📍 Localização definida: ${fallbackPreset.province} (${fallbackPreset.city})`, 'info');
    };

    if (!('geolocation' in navigator)) {
      handleFallback();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        applyRealCoords(position.coords.latitude, position.coords.longitude, 'GPS');
      },
      (error) => {
        console.warn('High-accuracy GPS failed, trying network position:', error);
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            applyRealCoords(pos.coords.latitude, pos.coords.longitude, 'GPS');
          },
          () => {
            handleFallback();
          },
          { enableHighAccuracy: false, timeout: 4000, maximumAge: 300000 }
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 30000,
      }
    );
  }, [showToast]);

  // Handle Preset selection
  const handleSelectPreset = (preset: MozLocationPreset, neighborhood?: string) => {
    const locName = neighborhood ? `${preset.city} (${neighborhood})` : preset.name;
    const newLoc: UserLocationState = {
      coords: preset.coords,
      name: locName,
      city: preset.city,
      province: preset.province,
      isAllMozambique: false,
      isCustom: true,
      isLoading: false,
      error: null,
    };
    setUserLocation(newLoc);
    localStorage.setItem('onde_dormir_user_location', JSON.stringify(newLoc));
    showToast(`📍 Província de ${preset.province} ativa`, 'success');
  };

  // Handle Select All Mozambique
  const handleSelectAllMozambique = () => {
    const newLoc: UserLocationState = {
      coords: null,
      name: 'Todo Moçambique',
      city: undefined,
      province: undefined,
      isAllMozambique: true,
      isCustom: true,
      isLoading: false,
      error: null,
    };
    setUserLocation(newLoc);
    localStorage.setItem('onde_dormir_user_location', JSON.stringify(newLoc));
    showToast('A mostrar opções de todo o Moçambique', 'info');
  };

  // Handle direct province selection
  const handleSelectProvince = (provName: string) => {
    if (provName === 'all' || provName.toLowerCase() === 'todo moçambique') {
      handleSelectAllMozambique();
      return;
    }
    const found = MOZ_PRESET_LOCATIONS.find((p) => p.province.toLowerCase() === provName.toLowerCase()) ||
                  MOZ_PRESET_LOCATIONS.find((p) => p.name.toLowerCase().includes(provName.toLowerCase()));
    if (found) {
      handleSelectPreset(found);
    } else {
      const newLoc: UserLocationState = {
        coords: null,
        name: provName,
        city: provName,
        province: provName,
        isAllMozambique: false,
        isCustom: true,
        isLoading: false,
        error: null,
      };
      setUserLocation(newLoc);
      localStorage.setItem('onde_dormir_user_location', JSON.stringify(newLoc));
      showToast(`📍 Província de ${provName} ativa`, 'success');
    }
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
      {/* Header - shown on all tabs except home, which has the full-bleed mobile hero matching the print */}
      {activeTab !== 'home' && (
        <Header
          userLocation={userLocation}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
          onRequestGps={handleRequestGps}
          onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
          activeTab={activeTab}
          onNavigateHome={() => setActiveTab('home')}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          unreadCount={unreadCount}
        />
      )}

      {/* Main Tab Content */}
      <main className={`flex-1 w-full overflow-x-hidden ${activeTab !== 'home' ? 'pt-[52px] sm:pt-[56px]' : ''} ${activeTab !== 'map' ? 'pb-20 sm:pb-24' : ''}`}>
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
            onOpenTermsModal={() => setIsTermsModalOpen(true)}
            onNavigateToExplore={handleNavigateToExplore}
            onNavigateToTab={handleNavigateToTab}
            onNavigateToMap={() => handleNavigateToTab('map')}
            onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            unreadCount={unreadCount}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreTab
            accommodations={accommodationsWithDistance}
            userLocation={userLocation}
            onSelectAccommodation={setSelectedAccommodation}
            isSaved={(id) => savedIds.includes(id)}
            onToggleSave={handleToggleSave}
            onSwitchToMap={() => handleNavigateToTab('map')}
            onBackToHome={() => handleNavigateToTab('home')}
            initialTypeFilter={exploreTypeFilter}
            initialSearchQuery={exploreSearchQuery}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            onSelectProvince={handleSelectProvince}
            onSelectAllMozambique={handleSelectAllMozambique}
            onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
          />
        )}

        {activeTab === 'guides' && (
          <TourGuidesTab
            onBackToHome={() => handleNavigateToTab('home')}
            userLocation={userLocation}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            onSelectProvince={handleSelectProvince}
            onSelectAllMozambique={handleSelectAllMozambique}
          />
        )}

        {activeTab === 'rentacar' && (
          <RentACarTab
            onBackToHome={() => handleNavigateToTab('home')}
            userLocation={userLocation}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            onSelectProvince={handleSelectProvince}
            onSelectAllMozambique={handleSelectAllMozambique}
          />
        )}

        {activeTab === 'heartlink' && (
          <HeartLinkTab
            onBackToHome={() => handleNavigateToTab('home')}
            userLocation={userLocation}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            onSelectProvince={handleSelectProvince}
            onSelectAllMozambique={handleSelectAllMozambique}
            accommodations={accommodationsWithDistance}
            onSelectAccommodation={setSelectedAccommodation}
            onNavigateToExplore={() => handleNavigateToTab('explore')}
          />
        )}

        {activeTab === 'loveshop' && (
          <LoveShopTab
            onBackToHome={() => handleNavigateToTab('home')}
            userLocation={userLocation}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            onSelectProvince={handleSelectProvince}
            onSelectAllMozambique={handleSelectAllMozambique}
          />
        )}

        {activeTab === 'map' && (
          <MapView
            accommodations={accommodationsWithDistance}
            userCoords={userLocation.coords}
            userLocation={userLocation}
            onSelectAccommodation={setSelectedAccommodation}
            onRequestGps={handleRequestGps}
            isGpsLoading={userLocation.isLoading}
            isSaved={(id) => savedIds.includes(id)}
            onToggleSave={handleToggleSave}
            onSwitchToList={() => handleNavigateToTab(previousTab === 'map' ? 'explore' : previousTab)}
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
            onBackToHome={() => handleNavigateToTab('home')}
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

      {/* Bottom Navigation Dock - Persistently rendered across all main tabs */}
      {activeTab !== 'map' && (
        <BottomNavBar
          activeTab={activeTab}
          onNavigateTab={handleNavigateToTab}
          savedCount={savedIds.length}
        />
      )}

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
        onSelectAllMozambique={handleSelectAllMozambique}
        onRequestGps={handleRequestGps}
        currentLocationName={userLocation.name}
        userLocation={userLocation}
        isGpsLoading={userLocation.isLoading}
      />

      {/* Privacy Manifesto Modal */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Official Terms and Conditions Modal (Viewable from footer anytime) */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />

      {/* Register Accommodation Modal */}
      <RegisterAccommodationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onAddAccommodation={handleAddAccommodation}
        userCoordsLat={userLocation.coords?.lat}
        userCoordsLng={userLocation.coords?.lng}
      />

      {/* Contact Locked Notice Modal (Triggered on clicking locked contact) */}
      <ContactLockedNoticeModal
        target={lockedTargetNotice}
        isOpen={!!lockedTargetNotice}
        onClose={() => setLockedTargetNotice(null)}
      />

      {/* System Opportunity Notification Center Modal */}
      <NotificationCenterModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
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
