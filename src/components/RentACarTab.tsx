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
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  Camera,
  FileCheck,
  Lock
} from 'lucide-react';
import { CarRental, UserLocationState } from '../types';
import { INITIAL_CAR_RENTALS } from '../data/carRentals';
import { TermsModal } from './TermsModal';
import { BiometricVerificationModal, VerificationDossier } from './BiometricVerificationModal';
import { MOZ_PROVINCES_LIST } from './ExploreTab';

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
  
  // KYC / Verification State
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [pendingVehicleAction, setPendingVehicleAction] = useState<CarRental | null>(null);
  const [verifiedDossier, setVerifiedDossier] = useState<VerificationDossier | null>(() => {
    const saved = localStorage.getItem('onde_dormir_user_verification_dossier');
    return saved ? JSON.parse(saved) : null;
  });

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const categories = [
    { id: '4x4', label: '4x4 Todo-o-Terreno' },
    { id: 'suv', label: 'SUV Familiar' },
    { id: 'carrinha', label: 'Pickups & Carrinhas' },
    { id: 'economico', label: 'Económicos / Sedans' },
  ];

  const citiesList = useMemo(() => {
    let cars = vehicles;
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
  }, [vehicles, selectedProvince]);

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

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((car) => {
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
  }, [vehicles, selectedProvince, searchQuery, selectedCategory, selectedCity, withDriverOnly]);

  const handleRegisterCar = (newCar: CarRental) => {
    setVehicles((prev) => [newCar, ...prev]);
    const custom = JSON.parse(localStorage.getItem('onde_dormir_custom_cars') || '[]');
    localStorage.setItem('onde_dormir_custom_cars', JSON.stringify([newCar, ...custom]));
    setIsRegisterOpen(false);
  };

  const handleVerificationComplete = (dossier: VerificationDossier) => {
    setVerifiedDossier(dossier);
    if (pendingVehicleAction) {
      const v = pendingVehicleAction;
      setPendingVehicleAction(null);
      const text = encodeURIComponent(
        `Olá! Sou o locatário ${dossier.fullName} (BI: ${dossier.biNumber.slice(0, 4)}**** - Identidade e Carta de Condução Verificadas no Onde Dormir Moçambique). Gostaria de alugar a viatura ${v.model} em ${v.city}.`
      );
      window.open(`https://wa.me/${v.whatsapp}?text=${text}`, '_blank');
    }
  };

  const handleBookVehicle = (car: CarRental, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!verifiedDossier) {
      setPendingVehicleAction(car);
      setIsVerificationOpen(true);
    } else {
      const text = encodeURIComponent(
        `Olá! Sou o locatário ${verifiedDossier.fullName} (BI: ${verifiedDossier.biNumber.slice(0, 4)}**** - Identidade e Carta de Condução Verificadas no Onde Dormir Moçambique). Gostaria de alugar a viatura ${car.model} em ${car.city}.`
      );
      window.open(`https://wa.me/${car.whatsapp}?text=${text}`, '_blank');
    }
  };

  return (
    <div className="pb-32 pt-2 sm:pt-4 max-w-5xl mx-auto px-3.5 sm:px-4 space-y-3.5">
      {/* Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-4 sm:p-5 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all border border-white/30"
                title="Voltar ao início"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shrink-0">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  Rent-a-Car
                </h1>
                <span className="text-[10px] uppercase font-black tracking-wider bg-black/20 text-amber-200 px-2 py-0.5 rounded-full border border-amber-200/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verificado
                </span>
              </div>
              <p className="text-xs text-orange-100 font-medium">
                Aluguer de viaturas com verificação de locatários
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {verifiedDossier ? (
              <span className="h-10 px-3 bg-emerald-950/80 border border-emerald-400 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Locatário Verificado ({verifiedDossier.fullName.split(' ')[0]})</span>
              </span>
            ) : (
              <button
                onClick={() => setIsVerificationOpen(true)}
                className="flex-1 sm:flex-none h-10 px-3 bg-amber-400 hover:bg-amber-300 active:scale-95 text-zinc-950 font-black text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Validar Meu BI + Foto</span>
              </button>
            )}

            <button
              onClick={() => setIsRegisterOpen(true)}
              className="h-10 px-3.5 bg-white text-orange-700 hover:bg-orange-50 active:scale-95 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registar Viatura</span>
            </button>
          </div>
        </div>
      </div>

      {/* Security Status Line */}
      <div className="p-2.5 sm:p-3 rounded-2xl bg-amber-50 border border-amber-200/90 flex items-center gap-2 text-xs text-amber-950">
        <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
        <span className="leading-tight">
          <strong>Proteção contra roubos e burla:</strong> Locatários e proprietários validados com BI e reconhecimento facial.
        </span>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-neutral-200/90 shadow-2xs space-y-2.5">
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
                    ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
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
          <div className="flex items-center justify-between bg-orange-50 text-orange-950 px-3 py-1.5 rounded-xl border border-orange-200 text-xs font-semibold">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span className="truncate">Apenas viaturas em: <strong>{selectedProvince}</strong> ({filteredVehicles.length})</span>
            </div>
            <button 
              onClick={() => handleProvinceClick('all')}
              className="text-[11px] text-orange-800 font-bold underline hover:text-orange-950 shrink-0 ml-2 cursor-pointer"
            >
              Ver Todas as Províncias
            </button>
          </div>
        )}

        {/* Categories Bar */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`h-8 px-3 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)}
              className={`h-8 px-2.5 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer border ${
                selectedCategory === cat.id
                  ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:bg-orange-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
          <button
            onClick={() => setWithDriverOnly(!withDriverOnly)}
            className={`h-8 px-2.5 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer border flex items-center gap-1 ${
              withDriverOnly
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-white text-neutral-700 border-neutral-200 hover:bg-amber-50'
            }`}
          >
            <span>👨‍✈️ Com Motorista</span>
          </button>
        </div>
      </div>

      {/* Vehicles Grid Header */}
      <div className="text-xs text-neutral-600 px-1">
        <strong className="text-neutral-900 font-bold">{filteredVehicles.length}</strong> viaturas disponíveis
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        {filteredVehicles.map((car) => (
          <div
            key={car.id}
            onClick={() => setSelectedVehicle(car)}
            className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            {/* Photo */}
            <div className="relative aspect-16/10 bg-neutral-900 overflow-hidden">
              <img
                src={car.photo}
                alt={car.model}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

              <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                <span className="text-[11px] font-extrabold bg-orange-600 text-white px-2.5 py-0.5 rounded-lg shadow-xs">
                  {car.categoryLabel}
                </span>
                {car.verified && (
                  <span className="text-[11px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-lg shadow-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verificado
                  </span>
                )}
              </div>

              <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-lg text-xs font-extrabold">
                {car.ratePerDay ? `${car.ratePerDay.toLocaleString()} MT / dia` : 'Consulte Valor'}
              </div>
            </div>

            {/* Body Content */}
            <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-base text-neutral-900 leading-snug group-hover:text-orange-600 transition-colors line-clamp-1">
                  {car.model}
                </h3>

                <div className="flex items-center gap-1 text-xs text-neutral-600 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span>{car.city}, {car.province}</span>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-1.5 mt-2 text-[11px] font-semibold text-neutral-700">
                  <div className="bg-neutral-50 p-1.5 rounded-lg border border-neutral-200 flex items-center justify-center gap-1">
                    <Users className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>{car.seats} L</span>
                  </div>
                  <div className="bg-neutral-50 p-1.5 rounded-lg border border-neutral-200 flex items-center justify-center gap-1">
                    <Settings2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate">{car.transmission}</span>
                  </div>
                  <div className="bg-neutral-50 p-1.5 rounded-lg border border-neutral-200 flex items-center justify-center gap-1">
                    <Fuel className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate">{car.fuel}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {car.withDriverAvailable ? '✓ Motorista' : '✓ Self-Drive'}
                </span>

                <button
                  onClick={(e) => handleBookVehicle(car, e)}
                  className="h-9 px-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Alugar</span>
                </button>
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
              <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
                <img
                  src={selectedVehicle.photo}
                  alt={selectedVehicle.model}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                  <span className="text-xs font-bold bg-orange-600 text-white px-2 py-0.5 rounded-lg">
                    {selectedVehicle.categoryLabel}
                  </span>
                </div>
                <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-lg text-xs font-extrabold">
                  {selectedVehicle.ratePerDay ? `${selectedVehicle.ratePerDay.toLocaleString()} MT / dia` : 'Consulte'}
                </div>
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-black text-neutral-900">{selectedVehicle.model}</h2>
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

              {/* Description */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Sobre esta viatura
                </span>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                  {selectedVehicle.description}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-2 flex gap-2">
                <a
                  href={`tel:${selectedVehicle.phone}`}
                  className="flex-1 h-11 rounded-xl bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
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
        targetItemName={pendingVehicleAction?.model}
        onVerificationComplete={handleVerificationComplete}
      />

      {/* Register Vehicle Modal */}
      {isRegisterOpen && (
        <RegisterCarModal
          onClose={() => setIsRegisterOpen(false)}
          onRegister={handleRegisterCar}
          cities={citiesList}
        />
      )}
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

          <button type="submit" className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all">
            Publicar Viatura
          </button>
        </form>
      </div>
    </div>
  );
};
