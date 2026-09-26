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
  Sparkles
} from 'lucide-react';
import { CarRental } from '../types';
import { INITIAL_CAR_RENTALS } from '../data/carRentals';
import { TermsModal } from './TermsModal';

interface RentACarTabProps {
  onBackToHome?: () => void;
}

export const RentACarTab: React.FC<RentACarTabProps> = ({ onBackToHome }) => {
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

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [withDriverOnly, setWithDriverOnly] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<CarRental | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const categories = [
    { id: '4x4', label: '4x4 Todo-o-Terreno' },
    { id: 'suv', label: 'SUV Familiar' },
    { id: 'carrinha', label: 'Pickups & Carrinhas' },
    { id: 'economico', label: 'Económicos / Sedans' },
  ];

  const citiesList = [
    'Maputo',
    'Matola',
    'Beira',
    'Vilankulo',
    'Inhambane',
    'Nampula',
    'Pemba'
  ];

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((car) => {
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
  }, [vehicles, searchQuery, selectedCategory, selectedCity, withDriverOnly]);

  const handleRegisterCar = (newCar: CarRental) => {
    setVehicles((prev) => [newCar, ...prev]);
    const custom = JSON.parse(localStorage.getItem('onde_dormir_custom_cars') || '[]');
    localStorage.setItem('onde_dormir_custom_cars', JSON.stringify([newCar, ...custom]));
    setIsRegisterOpen(false);
  };

  return (
    <div className="pb-32 pt-2 sm:pt-4 max-w-5xl mx-auto px-3.5 sm:px-4 space-y-4 sm:space-y-5">
      {/* Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-4 sm:p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner shrink-0">
              <Car className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Rent-a-Car
                </h1>
                <span className="text-xs uppercase font-extrabold tracking-widest bg-orange-950/40 text-orange-100 px-2.5 py-0.5 rounded-full">
                  Moçambique
                </span>
              </div>
              <p className="text-xs sm:text-sm text-orange-100 font-medium mt-0.5">
                Aluguer de viaturas 4x4, SUVs e sedans com ou sem motorista
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsRegisterOpen(true)}
            className="h-11 px-4 bg-white text-orange-700 hover:bg-orange-50 active:scale-95 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Registar Viatura</span>
          </button>
        </div>
      </div>

      {/* Filters Bar with 48px mobile touch inputs */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-neutral-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Pesquisar viatura por modelo, marca, 4x4, cidade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-10 bg-neutral-50 rounded-2xl text-sm sm:text-base text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-neutral-200 shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="w-8 h-8 absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* City */}
          <div className="relative w-full sm:w-48 shrink-0">
            <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-600 pointer-events-none" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full h-12 pl-9 pr-8 bg-neutral-50 rounded-2xl text-xs sm:text-sm font-semibold text-neutral-800 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer"
            >
              <option value="all">Todas as Cidades</option>
              {citiesList.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          </div>
        </div>

        {/* Category Filter Pills - 40px height */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pt-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`h-10 px-4 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all cursor-pointer active:scale-95 ${
              selectedCategory === 'all'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-200'
            }`}
          >
            Todas as Viaturas
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)}
              className={`h-10 px-3.5 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all cursor-pointer border active:scale-95 ${
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
            className={`h-10 px-3.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all cursor-pointer border active:scale-95 flex items-center gap-1.5 ${
              withDriverOnly
                ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <span>👨‍✈️ Com Motorista</span>
          </button>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs sm:text-sm text-neutral-600">
            <strong className="text-neutral-900 font-bold">{filteredVehicles.length}</strong> viaturas disponíveis para alugar
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {filteredVehicles.map((car) => (
            <div
              key={car.id}
              onClick={() => setSelectedVehicle(car)}
              className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              {/* Image & Badges */}
              <div className="relative aspect-16/10 w-full bg-neutral-100 overflow-hidden">
                <img
                  src={car.photo}
                  alt={car.model}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

                <div className="absolute top-3 left-3 flex gap-1.5 pointer-events-none">
                  <span className="text-xs font-bold bg-orange-600 text-white px-2.5 py-1 rounded-lg shadow-xs">
                    {car.categoryLabel}
                  </span>
                  {car.verified && (
                    <span className="text-xs font-bold bg-emerald-600 text-white px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verificado
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-xs text-white px-3 py-1 rounded-xl text-xs sm:text-sm font-extrabold shadow-sm">
                  {car.ratePerDay ? `${car.ratePerDay.toLocaleString()} MT / dia` : 'Consulte Valor'}
                </div>
              </div>

              {/* Body Content */}
              <div className="p-4 sm:p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-extrabold text-base sm:text-lg text-neutral-900 leading-snug group-hover:text-orange-600 transition-colors">
                      {car.model}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-neutral-600 mt-1">
                    <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>{car.city}, {car.province}</span>
                  </div>

                  {/* Specs Pill row */}
                  <div className="grid grid-cols-3 gap-2 mt-3 text-xs font-semibold text-neutral-700">
                    <div className="bg-neutral-50 p-2 rounded-xl border border-neutral-200 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-neutral-500 shrink-0" />
                      <span>{car.seats} Lugares</span>
                    </div>
                    <div className="bg-neutral-50 p-2 rounded-xl border border-neutral-200 flex items-center gap-1.5">
                      <Settings2 className="w-4 h-4 text-neutral-500 shrink-0" />
                      <span className="truncate">{car.transmission}</span>
                    </div>
                    <div className="bg-neutral-50 p-2 rounded-xl border border-neutral-200 flex items-center gap-1.5">
                      <Fuel className="w-4 h-4 text-neutral-500 shrink-0" />
                      <span className="truncate">{car.fuel}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-600 line-clamp-2 mt-2.5 leading-relaxed">
                    {car.description}
                  </p>
                </div>

                {/* Footer Buttons with 44px mobile touch targets */}
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    {car.withDriverAvailable ? '✓ Motorista Disponível' : '✓ Self-Drive'}
                  </span>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${car.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="h-11 px-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors"
                      title="Ligar"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Ligar</span>
                    </a>

                    <a
                      href={`https://wa.me/${car.whatsapp}?text=${encodeURIComponent(
                        `Olá! Encontrei a vossa viatura ${car.model} no Onde Dormir Moçambique e gostaria de saber a disponibilidade para aluguer em ${car.city}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="h-11 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-2xs transition-colors"
                      title="WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vehicle Detail Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200 relative animate-in fade-in zoom-in-95 duration-150 my-auto">
            <div className="bg-orange-600 text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Car className="w-5 h-5 text-orange-200" />
                <h3 className="font-extrabold text-base sm:text-lg">Detalhes da Viatura</h3>
              </div>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
                <img
                  src={selectedVehicle.photo}
                  alt={selectedVehicle.model}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="text-xs font-bold bg-orange-600 text-white px-2.5 py-1 rounded-lg">
                    {selectedVehicle.categoryLabel}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-xs text-white px-3 py-1 rounded-xl text-xs sm:text-sm font-extrabold">
                  {selectedVehicle.ratePerDay ? `${selectedVehicle.ratePerDay.toLocaleString()} MT / dia` : 'Consulte'}
                </div>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-black text-neutral-900">{selectedVehicle.model}</h2>
                <p className="text-xs sm:text-sm text-neutral-600 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <span>{selectedVehicle.city}, {selectedVehicle.province}</span>
                </p>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 text-center space-y-1">
                  <span className="text-neutral-500 text-xs block">Lugares</span>
                  <span className="text-neutral-900 font-extrabold text-sm">{selectedVehicle.seats}</span>
                </div>
                <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 text-center space-y-1">
                  <span className="text-neutral-500 text-xs block">Transmissão</span>
                  <span className="text-neutral-900 font-extrabold text-xs sm:text-sm truncate block">{selectedVehicle.transmission}</span>
                </div>
                <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 text-center space-y-1">
                  <span className="text-neutral-500 text-xs block">Combustível</span>
                  <span className="text-neutral-900 font-extrabold text-xs sm:text-sm truncate block">{selectedVehicle.fuel}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  Sobre esta viatura
                </span>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                  {selectedVehicle.description}
                </p>
              </div>

              {/* Conditions */}
              <div className="bg-orange-50 p-3.5 rounded-2xl border border-orange-200/80 space-y-1.5 text-xs text-orange-950">
                <div className="font-bold flex items-center gap-1.5 text-xs sm:text-sm">
                  <ShieldCheck className="w-4 h-4 text-orange-600" />
                  <span>Condições do Aluguer</span>
                </div>
                <ul className="space-y-1 text-xs list-disc list-inside text-orange-900">
                  <li>Caução reembolsável combinada com a locadora</li>
                  <li>Opção com motorista credenciado disponível</li>
                  <li>Reserva e pagamento direto sem taxas adicionais</li>
                </ul>
              </div>

              {/* Actions with large 48px buttons */}
              <div className="pt-2 flex gap-2.5">
                <a
                  href={`tel:${selectedVehicle.phone}`}
                  className="flex-1 h-12 rounded-xl bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Ligar Direto</span>
                </a>

                <a
                  href={`https://wa.me/${selectedVehicle.whatsapp}?text=${encodeURIComponent(
                    `Olá! Gostaria de alugar a viatura ${selectedVehicle.model} em ${selectedVehicle.city}. Pode confirmar disponibilidade e condições?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-2 h-12 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Pedir no WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

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

// Modal for registering new Car Rental
const RegisterCarModal: React.FC<{
  onClose: () => void;
  onRegister: (car: CarRental) => void;
  cities: string[];
}> = ({ onClose, onRegister, cities }) => {
  const [step, setStep] = useState<'form' | 'terms' | 'success'>('form');
  const [model, setModel] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<'4x4' | 'suv' | 'carrinha' | 'economico'>('4x4');
  const [city, setCity] = useState(cities[0] || 'Maputo');
  const [seats, setSeats] = useState(5);
  const [transmission, setTransmission] = useState<'Automático' | 'Manual'>('Automático');
  const [fuel, setFuel] = useState<'Gasóleo' | 'Gasolina'>('Gasóleo');
  const [ratePerDay, setRatePerDay] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [description, setDescription] = useState('');
  const [withDriverAvailable, setWithDriverAvailable] = useState(true);

  // Terms agreement
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const handleProceedToTerms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!model || !brand || !phone) return;
    setStep('terms');
  };

  const handleFinalSubmit = () => {
    if (!agreedToTerms) return;

    const newCar: CarRental = {
      id: `car-custom-${Date.now()}`,
      model,
      brand,
      category,
      categoryLabel: category === '4x4' ? '4x4 Todo-o-Terreno' : category === 'suv' ? 'SUV Familiar' : category === 'carrinha' ? 'Pickup / Carrinha' : 'Económico',
      seats,
      transmission,
      fuel,
      ratePerDay: ratePerDay ? parseInt(ratePerDay, 10) : undefined,
      city,
      province: city === 'Maputo' ? 'Maputo Cidade' : 'Moçambique',
      phone,
      whatsapp: whatsapp || phone,
      photo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80',
      description: description || `Viatura ${model} em excelente estado de conservação disponível para aluguer em ${city}.`,
      verified: true,
      withDriverAvailable
    };

    onRegister(newCar);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-200 relative animate-in fade-in zoom-in-95 duration-150 my-auto">
          <div className="bg-orange-600 text-white p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Car className="w-5 h-5 text-orange-200" />
              <div>
                <h3 className="font-extrabold text-base sm:text-lg">Registar Viatura para Aluguer</h3>
                <p className="text-xs text-orange-100">
                  {step === 'form' ? 'Passo 1 de 2: Dados da Viatura' : 'Passo 2 de 2: Termos e Condições'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {step === 'form' ? (
            <form onSubmit={handleProceedToTerms} className="p-4 sm:p-5 space-y-3.5 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Marca *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Toyota, Ford"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full h-12 px-3.5 bg-neutral-50 rounded-xl text-sm border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Modelo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Hilux 4x4, Prado"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full h-12 px-3.5 bg-neutral-50 rounded-xl text-sm border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Categoria *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full h-12 px-3 bg-neutral-50 rounded-xl text-xs sm:text-sm font-semibold border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="4x4">4x4 Todo-o-Terreno</option>
                    <option value="suv">SUV Familiar</option>
                    <option value="carrinha">Pickup / Carrinha</option>
                    <option value="economico">Económico / Sedan</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Cidade *</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-12 px-3 bg-neutral-50 rounded-xl text-xs sm:text-sm font-semibold border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {cities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Lugares</label>
                  <input
                    type="number"
                    min="2"
                    max="16"
                    value={seats}
                    onChange={(e) => setSeats(parseInt(e.target.value, 10))}
                    className="w-full h-12 px-3 bg-neutral-50 rounded-xl text-sm border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Caixa</label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value as any)}
                    className="w-full h-12 px-2 bg-neutral-50 rounded-xl text-xs font-semibold border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Automático">Auto</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Combustível</label>
                  <select
                    value={fuel}
                    onChange={(e) => setFuel(e.target.value as any)}
                    className="w-full h-12 px-2 bg-neutral-50 rounded-xl text-xs font-semibold border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Gasóleo">Gasóleo / Diesel</option>
                    <option value="Gasolina">Gasolina</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Valor Diária (MT)</label>
                  <input
                    type="number"
                    placeholder="Ex: 5000"
                    value={ratePerDay}
                    onChange={(e) => setRatePerDay(e.target.value)}
                    className="w-full h-12 px-3.5 bg-neutral-50 rounded-xl text-sm border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Telefone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+258 84/87..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-12 px-3.5 bg-neutral-50 rounded-xl text-sm border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Descrição e Condições</label>
                <textarea
                  rows={2}
                  placeholder="Informações sobre seguro, km livre, caução..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-neutral-50 rounded-xl text-sm border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-orange-50/80 border border-orange-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={withDriverAvailable}
                  onChange={(e) => setWithDriverAvailable(e.target.checked)}
                  className="w-5 h-5 rounded text-orange-600 focus:ring-orange-500 accent-orange-600"
                />
                <span className="text-xs sm:text-sm font-semibold text-neutral-800">
                  Disponibiliza motorista qualificado se solicitado pelo cliente
                </span>
              </label>

              <button
                type="submit"
                className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Avançar para Termos & Condições</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200 space-y-2">
                <h4 className="text-xs sm:text-sm font-bold text-orange-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-orange-600" />
                  <span>Directrizes de Locação de Viaturas</span>
                </h4>
                <p className="text-xs text-orange-900 leading-relaxed">
                  Para garantir segurança e confiabilidade no <strong>Onde Dormir Moçambique</strong>, o registo da sua viatura requer o cumprimento das normas:
                </p>
                <ul className="text-xs text-orange-950 space-y-1 list-disc list-inside">
                  <li>Viatura em boas condições mecânicas e com documentação válida.</li>
                  <li>Contacto direto para combinações e contrato de locação claro.</li>
                  <li>Compromisso com o valor diário acordado no WhatsApp/Telefone.</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded text-orange-600 focus:ring-orange-500 accent-orange-600 shrink-0"
                  />
                  <div className="text-xs text-neutral-700 leading-normal">
                    Declaro que li e concordo com os{' '}
                    <button
                      type="button"
                      onClick={() => setIsTermsModalOpen(true)}
                      className="text-orange-700 font-bold underline hover:text-orange-800"
                    >
                      Termos e Condições de Uso
                    </button>{' '}
                    do Onde Dormir Moçambique e confirmo a veracidade das informações da viatura.
                  </div>
                </label>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="h-12 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  disabled={!agreedToTerms}
                  onClick={handleFinalSubmit}
                  className="flex-1 h-12 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Publicar Viatura no Directório</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
    </>
  );
};
