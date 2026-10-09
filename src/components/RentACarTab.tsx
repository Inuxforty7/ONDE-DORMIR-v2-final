import React, { useState, useMemo } from 'react';
import { 
  Car, 
  MapPin, 
  CheckCircle2, 
  Phone, 
  MessageCircle, 
  Search, 
  Filter, 
  X, 
  Fuel, 
  Settings2, 
  Users, 
  ShieldCheck, 
  Plus, 
  ChevronDown, 
  ChevronUp,
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  Camera,
  FileCheck,
  Lock,
  Layers,
  CreditCard,
  Eye,
  EyeOff,
  Image as ImageIcon,
  ChevronLeft,
  FileText,
  Clock,
  Home,
  Star
} from 'lucide-react';
import { CarRental, UserLocationState, CarOwnerFleetAccount } from '../types';
import { INITIAL_CAR_RENTALS } from '../data/carRentals';
import { TermsModal } from './TermsModal';
import { BiometricVerificationModal, VerificationDossier } from './BiometricVerificationModal';
import { OwnerFleetManagerModal } from './OwnerFleetManagerModal';
import { MOZ_PROVINCES_LIST } from './ExploreTab';
import { getPlatformTenureText } from '../utils/tenure';
import { BillingInvoiceModal, BillingInvoiceData } from './BillingInvoiceModal';
import { contactUnlockService } from '../services/contactUnlockService';
import { useVisitAnalytics, formatVisitCount } from '../services/analyticsService';
import { CarRentalReviewModal } from './CarRentalReviewModal';
import { carRentalReviewService } from '../services/carRentalReviewService';

interface RentACarTabProps {
  onBackToHome?: () => void;
  userLocation?: UserLocationState;
  onOpenLocationModal?: () => void;
  onSelectProvince?: (prov: string) => void;
  onSelectAllMozambique?: () => void;
}

export const RentACarTab: React.FC<RentACarTabProps> = ({ 
  onBackToHome,
  userLocation,
  onOpenLocationModal,
  onSelectProvince,
  onSelectAllMozambique,
}) => {
  const { getModuleCount } = useVisitAnalytics();
  // Owner fleet account
  const [ownerFleet, setOwnerFleet] = useState<CarOwnerFleetAccount | null>(() => {
    const saved = localStorage.getItem('onde_dormir_owner_fleet');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Purge obsolete demo owner mock
        if (parsed?.ownerId === 'owner-demo-1' || parsed?.fullName?.includes('Armando C. Guebuza')) {
          localStorage.removeItem('onde_dormir_owner_fleet');
          return null;
        }
        return parsed;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [vehicles, setVehicles] = useState<CarRental[]>(() => {
    const saved = localStorage.getItem('onde_dormir_custom_cars');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...parsed, ...INITIAL_CAR_RENTALS];
      } catch (e) {
        return INITIAL_CAR_RENTALS;
      }
    }
    return INITIAL_CAR_RENTALS;
  });

  // Combine static cars and owner fleet cars that are actively subscribed
  const allActiveVehicles = useMemo(() => {
    const fleetCars = ownerFleet?.vehicles || [];
    // Only include fleet cars that have active subscription (paid for the month)
    const activeFleetCars = fleetCars.filter((v) => v.isActiveSubscription !== false);
    
    // Avoid duplicates
    const fleetIds = new Set(activeFleetCars.map((v) => v.id));
    const otherCars = vehicles.filter((v) => !fleetIds.has(v.id));

    return [...activeFleetCars, ...otherCars];
  }, [vehicles, ownerFleet]);

  const [selectedProvince, setSelectedProvince] = useState<string>(() => {
    if (!userLocation || userLocation.isAllMozambique) return 'all';
    return userLocation.province || 'Inhambane';
  });

  // Sync with userLocation changes
  React.useEffect(() => {
    if (!userLocation) return;
    if (userLocation.isAllMozambique) {
      setSelectedProvince('all');
    } else if (userLocation.province) {
      setSelectedProvince(userLocation.province);
    }
  }, [userLocation?.province, userLocation?.isAllMozambique]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [withDriverOnly, setWithDriverOnly] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<CarRental | null>(null);
  const [expandedSections, setExpandedSections] = useState<{
    verification: boolean;
    description: boolean;
    reviews: boolean;
  }>({
    verification: false,
    description: false,
    reviews: true,
  });

  const toggleSection = (key: 'verification' | 'description' | 'reviews') => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Review modal state and real-time subscription
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewingVehicle, setReviewingVehicle] = useState<CarRental | null>(null);
  const [, setReviewVersion] = useState(0);

  React.useEffect(() => {
    const unsubscribe = carRentalReviewService.subscribe(() => {
      setReviewVersion((v) => v + 1);
    });
    return unsubscribe;
  }, []);
  
  // KYC / Verification State for Client vs Owner
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [verificationRole, setVerificationRole] = useState<'client' | 'car_owner'>('client');
  const [pendingVehicleAction, setPendingVehicleAction] = useState<CarRental | null>(null);
  const [verifiedDossier, setVerifiedDossier] = useState<VerificationDossier | null>(() => {
    const saved = localStorage.getItem('onde_dormir_user_verification_dossier');
    return saved ? JSON.parse(saved) : null;
  });

  // Photo gallery and billing modal states
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [billingInvoiceData, setBillingInvoiceData] = useState<Partial<BillingInvoiceData> | undefined>(undefined);

  // Owner Fleet Manager Modal
  const [isFleetManagerOpen, setIsFleetManagerOpen] = useState(false);

  const categories = [
    { id: '4x4', label: '4x4 Todo-o-Terreno' },
    { id: 'suv', label: 'SUV Familiar' },
    { id: 'carrinha', label: 'Pickups & Carrinhas' },
    { id: 'economico', label: 'Económicos / Sedans' },
  ];

  const citiesList = useMemo(() => {
    let cars = allActiveVehicles;
    if (selectedProvince !== 'all') {
      const selProv = selectedProvince.toLowerCase();
      cars = cars.filter((v) => {
        const carProv = (v.province || '').toLowerCase();
        if (selProv === 'maputo cidade' || selProv === 'maputo província') {
          return carProv === selProv || carProv === 'maputo';
        }
        return carProv.includes(selProv) || selProv.includes(carProv);
      });
    }
    return Array.from(new Set(cars.map((c) => c.city))).filter(Boolean);
  }, [allActiveVehicles, selectedProvince]);

  // Reset selectedCity if it's not in the new citiesList
  React.useEffect(() => {
    if (selectedCity !== 'all' && !citiesList.includes(selectedCity)) {
      setSelectedCity('all');
    }
  }, [citiesList, selectedCity]);

  const handleProvinceClick = (prov: string) => {
    setSelectedProvince(prov);
    if (prov === 'all') {
      if (onSelectAllMozambique) onSelectAllMozambique();
    } else {
      if (onSelectProvince) onSelectProvince(prov);
    }
  };

  // Filter ONLY vehicles that are subscribed / visible
  const filteredVehicles = useMemo(() => {
    return allActiveVehicles.filter((car) => {
      // If car has isActiveSubscription explicitly set to false, it is hidden from the public!
      if (car.isActiveSubscription === false) {
        return false;
      }

      // Province filter - strict isolation
      if (selectedProvince !== 'all') {
        const carProv = (car.province || '').toLowerCase();
        const selProv = selectedProvince.toLowerCase();
        if (selProv === 'maputo cidade' || selProv === 'maputo província') {
          if (carProv !== selProv && carProv !== 'maputo') return false;
        } else if (!carProv.includes(selProv) && !selProv.includes(carProv)) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchModel = car.model.toLowerCase().includes(q);
        const matchBrand = car.brand.toLowerCase().includes(q);
        const matchCity = car.city.toLowerCase().includes(q);
        const matchDesc = car.description.toLowerCase().includes(q);
        if (!matchModel && !matchBrand && !matchCity && !matchDesc) return false;
      }

      if (selectedCategory !== 'all' && car.category !== selectedCategory) {
        return false;
      }

      if (selectedCity !== 'all' && car.city !== selectedCity) {
        return false;
      }

      if (withDriverOnly && !car.withDriverAvailable) {
        return false;
      }

      return true;
    });
  }, [allActiveVehicles, selectedProvince, searchQuery, selectedCategory, selectedCity, withDriverOnly]);

  const handleSaveFleet = (newFleet: CarOwnerFleetAccount) => {
    setOwnerFleet(newFleet);
    localStorage.setItem('onde_dormir_owner_fleet', JSON.stringify(newFleet));
  };

  const handleVerificationComplete = (dossier: VerificationDossier) => {
    if (dossier.userRole === 'car_owner' || verificationRole === 'car_owner') {
      // Save or update owner fleet
      const updatedFleet: CarOwnerFleetAccount = {
        ownerId: ownerFleet?.ownerId || `owner-${Date.now()}`,
        fullName: dossier.fullName,
        biNumber: dossier.biNumber,
        biFrontPhoto: dossier.biFrontPhoto,
        biBackPhoto: dossier.biBackPhoto,
        facialSelfiePhoto: dossier.biometricSelfiePhoto,
        isFacialVerified: true,
        phone: dossier.phone,
        whatsapp: dossier.whatsapp || dossier.phone,
        city: dossier.city,
        province: dossier.province,
        verifiedAt: dossier.verifiedAt,
        vehicles: ownerFleet?.vehicles || []
      };
      setOwnerFleet(updatedFleet);
      localStorage.setItem('onde_dormir_owner_fleet', JSON.stringify(updatedFleet));
      setIsFleetManagerOpen(true);
    } else {
      setVerifiedDossier(dossier);
      if (pendingVehicleAction) {
        const v = pendingVehicleAction;
        setPendingVehicleAction(null);
        const text = encodeURIComponent(
          `Olá! Sou o locatário ${dossier.fullName} (BI: ${dossier.biNumber.slice(0, 4)}**** - Identidade e Carta de Condução Verificadas no Onde Dormir Moçambique). Gostaria de alugar a viatura ${v.model} em ${v.city}.`
        );
        window.open(`https://wa.me/${v.whatsapp}?text=${text}`, '_blank');
      }
    }
  };

  const handleBookVehicle = (car: CarRental, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const allowed = contactUnlockService.triggerContactAttempt(
      {
        id: car.id,
        name: car.model,
        photo: car.photo,
        phone: car.phone,
        whatsapp: car.whatsapp,
        module: 'car',
        moduleLabel: 'Rent-a-Car',
        unlockFee: 1000,
      },
      car.isContactUnlocked
    );
    if (!allowed) {
      return;
    }

    if (!verifiedDossier) {
      setPendingVehicleAction(car);
      setVerificationRole('client');
      setIsVerificationOpen(true);
    } else {
      const text = encodeURIComponent(
        `Olá! Sou o locatário ${verifiedDossier.fullName} (BI: ${verifiedDossier.biNumber.slice(0, 4)}**** - Identidade Verificada no Onde Dormir Moçambique). Gostaria de alugar a viatura ${car.model} em ${car.city}.`
      );
      window.open(`https://wa.me/${car.whatsapp}?text=${text}`, '_blank');
    }
  };

  const handleOpenOwnerFleet = () => {
    if (!ownerFleet || !ownerFleet.isFacialVerified) {
      setVerificationRole('car_owner');
      setIsVerificationOpen(true);
    } else {
      setIsFleetManagerOpen(true);
    }
  };

  return (
    <div className="pb-16 sm:pb-20 pt-1 sm:pt-3 max-w-5xl mx-auto px-2.5 sm:px-4 space-y-2.5 sm:space-y-3.5">
      {/* Banner: RENT-A-CAR MOÇAMBIQUE - 16:9 Mobile & Panorâmico */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-amber-500/25 bg-neutral-950 text-white aspect-[16/9] sm:aspect-auto sm:min-h-[200px] md:min-h-[220px]">
        {/* Vídeo Background em Loop */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          src="https://res.cloudinary.com/dwlfwnbt0/video/upload/v1791544196/Create_Motion_Loop_Animation_20261009130823_m3huz5.mp4"
        />

        {/* Gradiente sutil reforçado apenas no lado esquerdo dos textos; lado direito sem textos continua 100% límpido e visível */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/85 via-black/45 via-55% to-transparent pointer-events-none" />

        {/* Conteúdo no Lado Esquerdo - Alinhado, Agrupado e com Hierarquia Visual Harmonizada */}
        <div className="relative z-20 p-3 sm:p-5 md:p-6 flex flex-col justify-center items-start text-left h-full max-w-[75%] sm:max-w-md md:max-w-lg gap-1 sm:gap-1.5">
          {/* Badge de Visitas Alinhado */}
          <div 
            className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-[11px] font-bold shadow-xs"
            title="Visitas ao módulo Rent-a-Car"
          >
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 shrink-0" />
            <span>{formatVisitCount(getModuleCount('rentacar'))}</span>
          </div>

          {/* Título Principal com Tamanho Reduzido e Harmonizado */}
          <h1 className="text-[14px] sm:text-lg md:text-xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
            <span>RENT-A-CAR </span>
            <span className="text-[#FACC15]">MOÇAMBIQUE</span>
          </h1>

          {/* Subtítulo Agrupado e Quebrado */}
          <p className="text-white text-[10px] sm:text-xs md:text-sm font-medium leading-tight sm:leading-snug drop-shadow-xs">
            A viatura certa para cada destino. <br />
            Frotas e proprietários verificados.
          </p>

          {/* Botão de Ação Alinhado e Compacto */}
          <div className="pt-0.5 sm:pt-1">
            <button
              type="button"
              onClick={handleOpenOwnerFleet}
              className="h-6.5 sm:h-8 px-2.5 sm:px-4 bg-white text-orange-950 hover:bg-orange-50 active:scale-95 font-black text-[10px] sm:text-xs rounded-lg sm:rounded-xl shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer touch-manipulation shrink-0"
            >
              <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-600" />
              <span>+ Anunciar Viatura</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Filters Bar */}
      <div className="sticky top-[48px] sm:top-[56px] z-20 bg-white/95 backdrop-blur-md p-2.5 sm:p-3.5 rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-sm space-y-2">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Pesquisar viatura por modelo, marca, 4x4, cidade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 sm:h-11 pl-9 pr-8 bg-neutral-50 rounded-xl text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-neutral-200"
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

          {/* City */}
          <div className="relative w-full sm:w-44 shrink-0">
            <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-orange-600 pointer-events-none" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full h-10 sm:h-11 pl-8 pr-7 bg-neutral-50 rounded-xl text-xs sm:text-sm font-semibold text-neutral-800 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer"
            >
              <option value="all">Todas as Cidades</option>
              {citiesList.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          </div>
        </div>

        {/* Clean Responsive 2-Selector Row (Zero-Cutoff & Direct) */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          {/* Quick Province Dropdown Selector */}
          <div className="relative">
            <select
              value={selectedProvince}
              onChange={(e) => handleProvinceClick(e.target.value)}
              className="w-full h-9 pl-2.5 pr-7 rounded-xl text-xs font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200/80 focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer truncate"
            >
              <option value="all">📍 Moçambique (Todas)</option>
              {MOZ_PROVINCES_LIST.map((p) => (
                <option key={p} value={p}>📍 {p}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Quick Category Selector */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-9 pl-2.5 pr-7 rounded-xl text-xs font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200/80 focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer truncate"
            >
              <option value="all">🚗 Todas as Categorias</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Vehicles Grid Header */}
      <div className="text-xs text-neutral-600 px-1">
        <strong className="text-neutral-900 font-bold">{filteredVehicles.length}</strong> viaturas disponíveis
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 items-stretch">
        {filteredVehicles.map((car) => (
          <div
            key={car.id}
            onClick={() => {
              setSelectedVehicle(car);
              setSelectedPhotoIndex(0);
            }}
            className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-full group active:scale-[0.99] touch-manipulation"
          >
            {/* Photo */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-neutral-100 overflow-hidden shrink-0">
              <img
                src={car.photo}
                alt={car.model}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

              <div className="absolute top-2.5 left-2.5 flex gap-1.5 flex-wrap">
                <span className="text-[11px] font-extrabold bg-orange-600 text-white px-2.5 py-0.5 rounded-lg shadow-xs">
                  {car.categoryLabel}
                </span>
                {car.verified && (
                  <span className="text-[11px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-lg shadow-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verificado
                  </span>
                )}
                {car.photos && car.photos.length > 1 && (
                  <span className="text-[10px] font-extrabold bg-black/75 backdrop-blur-xs text-white px-2 py-0.5 rounded-lg shadow-xs flex items-center gap-1">
                    <ImageIcon className="w-3 h-3 text-amber-400" />
                    <span>{car.photos.length} fotos</span>
                  </span>
                )}
                {(() => {
                  const vStats = carRentalReviewService.getVehicleRatingStats(car.id);
                  return (
                    <span className="text-[10px] font-black bg-black/75 backdrop-blur-xs text-white px-2 py-0.5 rounded-lg shadow-xs flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{vStats.rating.toFixed(1)}</span>
                      {vStats.reviewsCount > 0 && (
                        <span className="text-neutral-300 font-normal">({vStats.reviewsCount})</span>
                      )}
                    </span>
                  );
                })()}
              </div>

              <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-lg text-xs font-extrabold shadow-sm">
                {car.ratePerDay ? `${car.ratePerDay.toLocaleString()} MT / dia` : 'Consulte Valor'}
              </div>
            </div>

            {/* Body Content */}
            <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-neutral-900 leading-snug group-hover:text-orange-600 transition-colors line-clamp-1">
                  {car.model}
                </h3>

                {/* Clean Unboxed Metadata Hierarchy */}
                <div className="flex items-center gap-1.5 text-xs text-neutral-600 mt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span>{car.city}, {car.province}</span>
                  </span>
                  {car.plateNumber && (
                    <>
                      <span aria-hidden="true" className="text-neutral-300">·</span>
                      <span className="font-mono font-bold text-neutral-700 bg-neutral-100 px-1 py-0.2 rounded text-[10.5px]">
                        {car.plateNumber}
                      </span>
                    </>
                  )}
                  <span aria-hidden="true" className="text-neutral-300">·</span>
                  <span className="text-neutral-500 text-[11px]">{getPlatformTenureText(car.registeredAt, car.platformTenure, car.id)}</span>
                </div>

                {/* Owner info & Provider Rating */}
                {car.ownerName && (
                  <div className="mt-1.5 flex items-center justify-between gap-1 text-xs text-neutral-600">
                    <div className="flex items-center gap-1 min-w-0 truncate">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">Proprietário: <span className="text-neutral-800 font-semibold">{car.ownerName}</span></span>
                    </div>
                    {(() => {
                      const pStats = carRentalReviewService.getProviderRatingStats(car.ownerName);
                      if (pStats.reviewsCount > 0) {
                        return (
                          <div className="flex items-center gap-1 shrink-0 bg-amber-50 text-amber-800 border border-amber-200/80 px-1.5 py-0.5 rounded-md text-[10px] font-bold">
                            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                            <span>{pStats.rating.toFixed(1)} operador</span>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}

                {/* Specs */}
                <div className="grid grid-cols-3 gap-1.5 mt-2.5 text-[11px] font-semibold text-neutral-700">
                  <div className="bg-neutral-50 p-1.5 rounded-xl border border-neutral-200/80 flex items-center justify-center gap-1">
                    <Users className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>{car.seats} Lugares</span>
                  </div>
                  <div className="bg-neutral-50 p-1.5 rounded-xl border border-neutral-200/80 flex items-center justify-center gap-1">
                    <Settings2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate">{car.transmission}</span>
                  </div>
                  <div className="bg-neutral-50 p-1.5 rounded-xl border border-neutral-200/80 flex items-center justify-center gap-1">
                    <Fuel className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate">{car.fuel}</span>
                  </div>
                </div>
              </div>

              {/* Footer - Fixed to bottom with mt-auto */}
              <div className="pt-2.5 mt-auto border-t border-neutral-100 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-neutral-700">
                  {car.withDriverAvailable ? 'Disponível com Motorista' : 'Self-Drive'}
                </span>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={`tel:${car.phone.replace(/\s+/g, '')}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      const allowed = contactUnlockService.triggerContactAttempt(
                        {
                          id: car.id,
                          name: car.model,
                          photo: car.photo,
                          phone: car.phone,
                          whatsapp: car.whatsapp,
                          module: 'car',
                          moduleLabel: 'Rent-a-Car',
                          unlockFee: 1000,
                        },
                        car.isContactUnlocked
                      );
                      if (!allowed) {
                        e.preventDefault();
                      }
                    }}
                    className="h-9 px-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 active:scale-95 text-neutral-800 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer touch-manipulation"
                    title="Ligar para o proprietário"
                  >
                    <Phone className="w-3.5 h-3.5 text-neutral-700" />
                    <span>Ligar</span>
                  </a>

                  <button
                    onClick={(e) => handleBookVehicle(car, e)}
                    className="h-9 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer touch-manipulation"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Vehicle Detail Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200 relative animate-in fade-in zoom-in-95 duration-150 my-auto">
            <div className="bg-orange-600 text-white p-3.5 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-orange-200" />
                <h3 className="font-extrabold text-base">Detalhes da Viatura</h3>
              </div>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3.5 max-h-[80vh] overflow-y-auto">
              {/* Multi-Photo Carousel Gallery (1 a 5 fotografias) */}
              {(() => {
                const vehiclePhotos = (selectedVehicle.photos && selectedVehicle.photos.length > 0)
                  ? selectedVehicle.photos
                  : [selectedVehicle.photo];
                const activePhoto = vehiclePhotos[selectedPhotoIndex] || selectedVehicle.photo;
                const photoAngleLabels = ['Frente', 'Lateral', 'Traseira', 'Interior', 'Bagageira'];

                return (
                  <div className="space-y-2">
                    <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 group">
                      <img
                        src={activePhoto}
                        alt={`${selectedVehicle.model} - Foto ${selectedPhotoIndex + 1}`}
                        className="w-full h-full object-cover transition-opacity duration-200"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                        <span className="text-xs font-bold bg-orange-600 text-white px-2 py-0.5 rounded-lg shadow-xs">
                          {selectedVehicle.categoryLabel}
                        </span>
                        {vehiclePhotos.length > 1 && (
                          <span className="text-[10px] font-extrabold bg-black/75 backdrop-blur-xs text-white px-2 py-0.5 rounded-lg shadow-xs">
                            {selectedPhotoIndex + 1}/{vehiclePhotos.length} • {photoAngleLabels[selectedPhotoIndex] || 'Detalhe'}
                          </span>
                        )}
                      </div>

                      {/* Price Badge */}
                      <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-lg text-xs font-extrabold z-10">
                        {selectedVehicle.ratePerDay ? `${selectedVehicle.ratePerDay.toLocaleString()} MT / dia` : 'Consulte'}
                      </div>

                      {/* Prev / Next Controls if > 1 photo */}
                      {vehiclePhotos.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPhotoIndex((prev) => (prev > 0 ? prev - 1 : vehiclePhotos.length - 1));
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center cursor-pointer transition-all z-10 shadow-md"
                            title="Foto anterior"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPhotoIndex((prev) => (prev < vehiclePhotos.length - 1 ? prev + 1 : 0));
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center cursor-pointer transition-all z-10 shadow-md"
                            title="Próxima foto"
                          >
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Thumbnail navigation strip (1 to 5 photos) */}
                    {vehiclePhotos.length > 1 && (
                      <div className="grid grid-cols-5 gap-1.5 pt-0.5">
                        {vehiclePhotos.map((pUrl, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => setSelectedPhotoIndex(pIdx)}
                            className={`relative aspect-4/3 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                              selectedPhotoIndex === pIdx
                                ? 'border-orange-600 scale-102 shadow-xs'
                                : 'border-neutral-200 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={pUrl} alt={`Ângulo ${pIdx + 1}`} className="w-full h-full object-cover" />
                            <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[8px] font-black uppercase text-center py-0.5 tracking-tight truncate px-0.5">
                              {photoAngleLabels[pIdx] || `Foto ${pIdx + 1}`}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              <div>
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-base sm:text-lg font-black text-neutral-900">{selectedVehicle.model}</h2>
                  {(() => {
                    const vStats = carRentalReviewService.getVehicleRatingStats(selectedVehicle.id);
                    return (
                      <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-lg shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span className="text-xs font-black text-amber-900">{vStats.rating.toFixed(1)}</span>
                        <span className="text-[10px] text-neutral-500">({vStats.reviewsCount})</span>
                      </div>
                    );
                  })()}
                </div>
                <p className="text-xs text-neutral-600 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-600" />
                  <span>{selectedVehicle.city}, {selectedVehicle.province}</span>
                </p>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                <div className="bg-neutral-50 p-2 rounded-xl border border-neutral-200 text-center">
                  <span className="text-neutral-400 text-[10px] block">Lugares</span>
                  <span className="text-neutral-900 font-extrabold">{selectedVehicle.seats}</span>
                </div>
                <div className="bg-neutral-50 p-2 rounded-xl border border-neutral-200 text-center">
                  <span className="text-neutral-400 text-[10px] block">Transmissão</span>
                  <span className="text-neutral-900 font-extrabold truncate block">{selectedVehicle.transmission}</span>
                </div>
                <div className="bg-neutral-50 p-2 rounded-xl border border-neutral-200 text-center">
                  <span className="text-neutral-400 text-[10px] block">Combustível</span>
                  <span className="text-neutral-900 font-extrabold truncate block">{selectedVehicle.fuel}</span>
                </div>
              </div>

              {/* Owner & Legal Documents Verification Badge (Accordion) */}
              <div className="border border-emerald-200/80 rounded-2xl overflow-hidden bg-emerald-50/50">
                <button
                  type="button"
                  onClick={() => toggleSection('verification')}
                  className="w-full p-2.5 flex items-center justify-between text-left hover:bg-emerald-100/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 font-bold text-neutral-800 text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Proprietário: {selectedVehicle.ownerName || 'Proprietário Verificado'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase text-emerald-700 bg-white/80 px-2 py-0.5 rounded border border-emerald-200">
                      Facial + BI Ativo
                    </span>
                    {expandedSections.verification ? (
                      <ChevronUp className="w-4 h-4 text-neutral-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />
                    )}
                  </div>
                </button>

                {expandedSections.verification && (
                  <div className="p-3 pt-1 border-t border-emerald-100 space-y-2 text-xs">
                    {(() => {
                      if (!selectedVehicle.ownerName) return null;
                      const pStats = carRentalReviewService.getProviderRatingStats(selectedVehicle.ownerName);
                      return (
                        <div className="p-2.5 bg-white/90 rounded-xl border border-emerald-100 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-neutral-800 text-xs block">Reputação do Operador</span>
                            <span className="text-[10.5px] text-neutral-500">Atendimento ao Cliente & Pontualidade</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{pStats.rating.toFixed(1)}</span>
                            <span className="text-[10px] text-neutral-500 font-normal">({pStats.reviewsCount})</span>
                          </div>
                        </div>
                      );
                    })()}

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="flex items-center gap-1.5 text-neutral-600">
                        <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Livrete Verificado (INATRO)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-600">
                        <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Título de Propriedade Válido</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-600 pt-1 border-t border-emerald-100">
                      <Clock className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                      <span>Registado na plataforma: <strong className="text-neutral-800 font-bold">{getPlatformTenureText(selectedVehicle.registeredAt, selectedVehicle.platformTenure, selectedVehicle.id)}</strong></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Description (Accordion) */}
              <div className="border border-neutral-200/80 rounded-2xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggleSection('description')}
                  className="w-full p-3 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <span className="text-xs font-black uppercase tracking-wider text-neutral-800">
                    Sobre esta viatura
                  </span>
                  {expandedSections.description ? (
                    <ChevronUp className="w-4 h-4 text-neutral-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />
                  )}
                </button>
                {expandedSections.description && (
                  <div className="px-3 pb-3 pt-1 text-xs sm:text-sm text-neutral-700 leading-relaxed border-t border-neutral-100">
                    {selectedVehicle.description}
                  </div>
                )}
              </div>

              {/* Reviews & Ratings Section (Accordion) */}
              {(() => {
                const vehicleStats = carRentalReviewService.getVehicleRatingStats(selectedVehicle.id);
                const providerStats = selectedVehicle.ownerName 
                  ? carRentalReviewService.getProviderRatingStats(selectedVehicle.ownerName)
                  : null;
                const vehicleReviews = carRentalReviewService.getReviewsByVehicleId(selectedVehicle.id);

                return (
                  <div className="border border-neutral-200/80 rounded-2xl overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => toggleSection('reviews')}
                      className="w-full p-3 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-black uppercase tracking-wider text-neutral-800">
                          Avaliações e Reputação
                        </span>
                        <span className="text-[11px] font-bold text-neutral-500">
                          ({vehicleReviews.length})
                        </span>
                      </div>
                      {expandedSections.reviews ? (
                        <ChevronUp className="w-4 h-4 text-neutral-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />
                      )}
                    </button>

                    {expandedSections.reviews && (
                      <div className="px-3 pb-3 pt-1 border-t border-neutral-100 space-y-3">
                        {/* Rating Separation Cards: Vehicle Quality vs Provider Service */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {/* 1. Qualidade da Viatura */}
                          <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5">
                            <div className="flex items-center justify-between pb-1 border-b border-neutral-200/60">
                              <div className="flex items-center gap-1.5 font-bold text-neutral-900 text-xs">
                                <Car className="w-3.5 h-3.5 text-orange-600" />
                                <span>Qualidade da Viatura</span>
                              </div>
                              <div className="flex items-center gap-0.5 font-black text-amber-600 text-xs">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span>{vehicleStats.rating.toFixed(1)}</span>
                              </div>
                            </div>
                            <div className="space-y-1 text-[11px] text-neutral-600">
                              <div className="flex justify-between">
                                <span>Estado da Viatura</span>
                                <span className="font-bold text-neutral-800">{vehicleStats.breakdown.vehicleCondition.toFixed(1)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Limpeza</span>
                                <span className="font-bold text-neutral-800">{vehicleStats.breakdown.cleanliness.toFixed(1)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Conforto</span>
                                <span className="font-bold text-neutral-800">{vehicleStats.breakdown.comfort.toFixed(1)}</span>
                              </div>
                            </div>
                          </div>

                          {/* 2. Serviço do Operador */}
                          {providerStats && (
                            <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5">
                              <div className="flex items-center justify-between pb-1 border-b border-neutral-200/60">
                                <div className="flex items-center gap-1.5 font-bold text-neutral-900 text-xs">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Serviço do Operador</span>
                                </div>
                                <div className="flex items-center gap-0.5 font-black text-amber-600 text-xs">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  <span>{providerStats.rating.toFixed(1)}</span>
                                </div>
                              </div>
                              <div className="space-y-1 text-[11px] text-neutral-600">
                                <div className="flex justify-between">
                                  <span>Atendimento ao Cliente</span>
                                  <span className="font-bold text-neutral-800">{providerStats.breakdown.customerService.toFixed(1)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Pontualidade</span>
                                  <span className="font-bold text-neutral-800">{providerStats.breakdown.punctuality.toFixed(1)}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Button: Avaliar Viatura e Serviço */}
                        <button
                          type="button"
                          onClick={() => {
                            setReviewingVehicle(selectedVehicle);
                            setIsReviewModalOpen(true);
                          }}
                          className="w-full h-10 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 text-orange-600" />
                          <span>Avaliar Viatura e Serviço</span>
                        </button>

                        {/* Recent Reviews List from Single Dataset */}
                        <div className="space-y-2 pt-1">
                          <h4 className="text-[11px] font-black uppercase tracking-wider text-neutral-500">
                            Avaliações de Clientes ({vehicleReviews.length})
                          </h4>

                          {vehicleReviews.length === 0 ? (
                            <div className="py-4 text-center text-xs text-neutral-500 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
                              Ainda não há avaliações para esta viatura. Seja o primeiro a partilhar a sua experiência!
                            </div>
                          ) : (
                            vehicleReviews.map((rev) => (
                              <div
                                key={rev.id}
                                className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/70 space-y-1"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-neutral-900 text-xs">{rev.userName}</span>
                                    {rev.userCity && (
                                      <span className="text-[10px] text-neutral-500">· {rev.userCity}</span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-neutral-400">{rev.date}</span>
                                </div>

                                <div className="flex items-center gap-3 text-[11px]">
                                  <div className="flex items-center gap-1 text-amber-600 font-bold">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    <span>Viatura: {rev.vehicleRatingAverage.toFixed(1)}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-emerald-700 font-bold">
                                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                    <span>Serviço: {rev.providerRatingAverage.toFixed(1)}</span>
                                  </div>
                                </div>

                                {rev.comment && (
                                  <p className="text-xs text-neutral-700 leading-relaxed pt-0.5">
                                    "{rev.comment}"
                                  </p>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Actions */}
              <div className="pt-2 flex gap-2">
                <a
                  href={`tel:${selectedVehicle.phone}`}
                  onClick={(e) => {
                    const allowed = contactUnlockService.triggerContactAttempt(
                      {
                        id: selectedVehicle.id,
                        name: selectedVehicle.model,
                        photo: selectedVehicle.photo,
                        phone: selectedVehicle.phone,
                        whatsapp: selectedVehicle.whatsapp,
                        module: 'car',
                        moduleLabel: 'Rent-a-Car',
                        unlockFee: 1000,
                      },
                      selectedVehicle.isContactUnlocked
                    );
                    if (!allowed) {
                      e.preventDefault();
                    }
                  }}
                  className="flex-1 h-11 rounded-xl bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Ligar Direto</span>
                </a>

                <button
                  onClick={() => handleBookVehicle(selectedVehicle)}
                  className="flex-2 h-11 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Pedir no WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Biometric Verification Modal */}
      <BiometricVerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        purpose="rentacar"
        userRole={verificationRole}
        targetItemName={pendingVehicleAction?.model}
        onVerificationComplete={handleVerificationComplete}
      />

      {/* Owner Fleet & Multi-Vehicle Manager Modal */}
      <OwnerFleetManagerModal
        isOpen={isFleetManagerOpen}
        onClose={() => setIsFleetManagerOpen(false)}
        ownerFleet={ownerFleet}
        onSaveFleet={handleSaveFleet}
        onStartOwnerBiometrics={() => {
          setIsFleetManagerOpen(false);
          setVerificationRole('car_owner');
          setIsVerificationOpen(true);
        }}
        availableCities={citiesList}
      />

      {/* Official Billing & Invoice Modal (Bill) */}
      <BillingInvoiceModal
        isOpen={isBillingModalOpen}
        onClose={() => setIsBillingModalOpen(false)}
        invoiceData={billingInvoiceData}
      />

      {/* Car Rental Review Modal */}
      <CarRentalReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setReviewingVehicle(null);
        }}
        vehicle={reviewingVehicle}
        onReviewSubmitted={() => {
          setReviewVersion((v) => v + 1);
        }}
      />
    </div>
  );
};

// Register Car Form Sub-Component
interface RegisterCarModalProps {
  onClose: () => void;
  onRegister: (car: CarRental) => void;
  cities: string[];
}

const RegisterCarModal: React.FC<RegisterCarModalProps> = ({ onClose, onRegister, cities }) => {
  const [model, setModel] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<'4x4' | 'suv' | 'economico' | 'carrinha' | 'executivo'>('4x4');
  const [seats, setSeats] = useState(5);
  const [transmission, setTransmission] = useState<'Automático' | 'Manual'>('Automático');
  const [fuel, setFuel] = useState<'Gasóleo' | 'Gasolina'>('Gasóleo');
  const [city, setCity] = useState('Maputo');
  const [province, setProvince] = useState('Maputo Cidade');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [ratePerDay, setRatePerDay] = useState('');
  const [description, setDescription] = useState('');
  const [withDriverAvailable, setWithDriverAvailable] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(true);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCar: CarRental = {
      id: `car-custom-${Date.now()}`,
      model,
      brand,
      category,
      categoryLabel: category === '4x4' ? '4x4 Todo-o-Terreno' : category === 'suv' ? 'SUV Familiar' : category === 'carrinha' ? 'Pickup & Carrinha' : 'Económico',
      photo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
      seats,
      transmission,
      fuel,
      city,
      province,
      withDriverAvailable,
      ratePerDay: ratePerDay ? parseInt(ratePerDay, 10) : undefined,
      phone,
      whatsapp: whatsapp || phone,
      verified: true,
      featured: true,
      description
    };
    onRegister(newCar);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-200 relative animate-in fade-in zoom-in-95 duration-150 my-auto">
        <div className="bg-orange-600 text-white p-3.5 sm:p-4 flex items-center justify-between">
          <h3 className="font-extrabold text-base">Registar Viatura para Aluguer</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">Modelo da Viatura *</label>
            <input required placeholder="Ex: Toyota Fortuner 4x4 2.8 GD-6" value={model} onChange={(e) => setModel(e.target.value)} className="w-full h-10 px-3 bg-neutral-50 rounded-xl text-xs sm:text-sm border border-neutral-200" />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Marca *</label>
              <input required placeholder="Ex: Toyota" value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full h-10 px-3 bg-neutral-50 rounded-xl text-xs sm:text-sm border border-neutral-200" />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Categoria *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="w-full h-10 px-2.5 bg-neutral-50 rounded-xl text-xs border border-neutral-200">
                <option value="4x4">4x4 Todo-o-Terreno</option>
                <option value="suv">SUV Familiar</option>
                <option value="carrinha">Pickup / Carrinha</option>
                <option value="economico">Económico / Sedan</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Cidade *</label>
              <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full h-10 px-2.5 bg-neutral-50 rounded-xl text-xs border border-neutral-200">
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Diária (MT)</label>
              <input type="number" placeholder="Ex: 4500" value={ratePerDay} onChange={(e) => setRatePerDay(e.target.value)} className="w-full h-10 px-3 bg-neutral-50 rounded-xl text-xs sm:text-sm border border-neutral-200" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Contacto Telefónico *</label>
              <input required placeholder="84 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full h-10 px-3 bg-neutral-50 rounded-xl text-xs sm:text-sm border border-neutral-200" />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">WhatsApp *</label>
              <input placeholder="84 123 4567" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full h-10 px-3 bg-neutral-50 rounded-xl text-xs sm:text-sm border border-neutral-200" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">Descrição e Condições</label>
            <textarea rows={2} placeholder="Condições de caução, seguro, km..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2.5 bg-neutral-50 rounded-xl text-xs border border-neutral-200" />
          </div>

          {/* Terms Acceptance Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer p-3 rounded-2xl border border-neutral-200 bg-neutral-50/60 hover:bg-neutral-50 transition-colors">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 rounded text-orange-600 focus:ring-orange-500 w-4.5 h-4.5 accent-orange-600 shrink-0 cursor-pointer"
              />
              <div className="text-xs text-neutral-700 leading-snug">
                <span>Declaro que li e aceito os </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsTermsModalOpen(true);
                  }}
                  className="text-orange-700 font-bold underline hover:text-orange-900 cursor-pointer"
                >
                  Termos e Condições Gerais
                </button>{' '}
                <span>do Onde Dormir Moçambique (ÁGUIA Soluções & Serviços - Conexões Rápidas).</span>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={!agreedToTerms}
            className="w-full h-11 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
          >
            Publicar Viatura
          </button>
        </form>
      </div>

      {/* Official Terms and Conditions Modal */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAccept={() => {
          setAgreedToTerms(true);
          setIsTermsModalOpen(false);
        }}
        contextText="Ao registar uma viatura no Rent-a-Car, confirme a leitura e aceitação dos Termos Gerais."
      />
    </div>
  );
};
