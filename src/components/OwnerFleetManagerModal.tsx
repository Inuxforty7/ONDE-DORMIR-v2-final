import React, { useState } from 'react';
import { 
  Car, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ShieldCheck, 
  Camera, 
  Upload, 
  FileText, 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Eye, 
  EyeOff, 
  ChevronRight, 
  Sparkles,
  RefreshCw,
  Info,
  Image as ImageIcon,
  Clock
} from 'lucide-react';
import { CarRental, CarOwnerFleetAccount } from '../types';
import { MOZ_PROVINCES_LIST } from './ExploreTab';
import { BillingInvoiceModal, BillingInvoiceData } from './BillingInvoiceModal';
import { getPlatformTenureText } from '../utils/tenure';

interface OwnerFleetManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerFleet: CarOwnerFleetAccount | null;
  onSaveFleet: (fleet: CarOwnerFleetAccount) => void;
  onStartOwnerBiometrics: () => void;
  availableCities: string[];
}

export const OwnerFleetManagerModal: React.FC<OwnerFleetManagerModalProps> = ({
  isOpen,
  onClose,
  ownerFleet,
  onSaveFleet,
  onStartOwnerBiometrics,
  availableCities
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'vehicles' | 'add_vehicle' | 'subscription' | 'profile'>('vehicles');

  // Form for adding a new vehicle
  const [model, setModel] = useState('');
  const [brand, setBrand] = useState('Toyota');
  const [category, setCategory] = useState<'4x4' | 'suv' | 'economico' | 'carrinha' | 'executivo'>('4x4');
  const [plateNumber, setPlateNumber] = useState('');
  const [seats, setSeats] = useState(5);
  const [transmission, setTransmission] = useState<'Automático' | 'Manual'>('Automático');
  const [fuel, setFuel] = useState<'Gasóleo' | 'Gasolina'>('Gasóleo');
  const [city, setCity] = useState('Maputo');
  const [province, setProvince] = useState('Maputo Cidade');
  const [ratePerDay, setRatePerDay] = useState('4500');
  const [depositAmount, setDepositAmount] = useState('10000');
  const [withDriverAvailable, setWithDriverAvailable] = useState(true);
  const [description, setDescription] = useState('');
  // Galeria de até 5 fotografias da viatura
  const [carPhotos, setCarPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
  ]);
  const [livretePhoto, setLivretePhoto] = useState('');
  const [tituloPropriedadePhoto, setTituloPropriedadePhoto] = useState('');

  // Payment simulator state for vehicle subscription
  const [payingCarId, setPayingCarId] = useState<string | null>(null);
  const [paymentPhone, setPaymentPhone] = useState(ownerFleet?.phone || '841234567');
  const [paymentProvider, setPaymentProvider] = useState<'mpesa' | 'emola'>('mpesa');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessCarId, setPaymentSuccessCarId] = useState<string | null>(null);

  // Billing & Invoice modal state
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [selectedInvoiceData, setSelectedInvoiceData] = useState<Partial<BillingInvoiceData> | undefined>(undefined);

  if (!isOpen) return null;

  const MONTHLY_FEE_PER_VEHICLE = 1000; // 1.000 MT por viatura ativa / mês conforme o cliente explicou

  // Handle adding vehicle to fleet with 1 to 5 photos
  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerFleet) return;

    const validPhotos = carPhotos.filter(Boolean);
    const coverPhoto = validPhotos[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80';

    const newCar: CarRental = {
      id: `car-owner-${Date.now()}`,
      model: model || 'Toyota Fortuner 2.8 GD-6',
      brand: brand || 'Toyota',
      category,
      categoryLabel: 
        category === '4x4' ? '4x4 Todo-o-Terreno' : 
        category === 'suv' ? 'SUV Familiar' : 
        category === 'carrinha' ? 'Pickup 4x4' : 'Económico Sedan',
      photo: coverPhoto,
      photos: validPhotos.length > 0 ? validPhotos : [coverPhoto],
      seats: Number(seats),
      transmission,
      fuel,
      city: city || ownerFleet.city,
      province: province || ownerFleet.province,
      withDriverAvailable,
      ratePerDay: ratePerDay ? parseInt(ratePerDay, 10) : 4500,
      depositAmount: depositAmount ? parseInt(depositAmount, 10) : 10000,
      plateNumber: plateNumber || 'AF-456-MC',
      phone: ownerFleet.phone,
      whatsapp: ownerFleet.whatsapp || ownerFleet.phone,
      verified: true,
      featured: true,
      description: description || `Viatura da frota de ${ownerFleet.fullName}. Revisões em dia, ar condicionado e seguro regularizado.`,
      ownerId: ownerFleet.ownerId,
      ownerName: ownerFleet.fullName,
      ownerBiNumber: ownerFleet.biNumber,
      ownerFacialVerified: ownerFleet.isFacialVerified,
      livretePhoto: livretePhoto || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80',
      tituloPropriedadePhoto: tituloPropriedadePhoto || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80',
      // By default new car gets 30 days active promo or requires activation
      isActiveSubscription: true,
      subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      monthlyFee: MONTHLY_FEE_PER_VEHICLE
    };

    const updatedFleet: CarOwnerFleetAccount = {
      ...ownerFleet,
      vehicles: [newCar, ...ownerFleet.vehicles]
    };

    onSaveFleet(updatedFleet);
    // Reset form
    setModel('');
    setPlateNumber('');
    setDescription('');
    setLivretePhoto('');
    setTituloPropriedadePhoto('');
    setActiveSubTab('vehicles');
  };

  // Toggle active/inactive subscription (simulate monthly payment)
  const handleProcessMonthlyPayment = (carId: string) => {
    if (!ownerFleet) return;
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      const updatedVehicles = ownerFleet.vehicles.map((v) => {
        if (v.id === carId) {
          return {
            ...v,
            isActiveSubscription: true,
            subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          };
        }
        return v;
      });

      const updatedFleet = {
        ...ownerFleet,
        vehicles: updatedVehicles
      };
      onSaveFleet(updatedFleet);
      setPaymentSuccessCarId(carId);
      setPayingCarId(null);
      setTimeout(() => setPaymentSuccessCarId(null), 4000);
    }, 1200);
  };

  // Deactivate vehicle subscription
  const handleToggleDeactivate = (carId: string) => {
    if (!ownerFleet) return;
    const updatedVehicles = ownerFleet.vehicles.map((v) => {
      if (v.id === carId) {
        return {
          ...v,
          isActiveSubscription: !v.isActiveSubscription
        };
      }
      return v;
    });

    onSaveFleet({
      ...ownerFleet,
      vehicles: updatedVehicles
    });
  };

  // Remove vehicle
  const handleRemoveVehicle = (carId: string) => {
    if (!ownerFleet) return;
    if (!window.confirm('Tem a certeza que deseja remover esta viatura da sua frota?')) return;
    const updatedVehicles = ownerFleet.vehicles.filter((v) => v.id !== carId);
    onSaveFleet({
      ...ownerFleet,
      vehicles: updatedVehicles
    });
  };

  const activeCount = ownerFleet?.vehicles.filter((v) => v.isActiveSubscription).length || 0;
  const totalCount = ownerFleet?.vehicles.length || 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-neutral-200 relative my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-zinc-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-600/30 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  Painel do Proprietário de Frotas
                </h2>
                <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Dono Verificado
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-0.5">
                {ownerFleet ? (
                  <>Proprietário: <strong className="text-white font-bold">{ownerFleet.fullName}</strong> • BI {ownerFleet.biNumber.slice(0, 4)}****</>
                ) : (
                  'Cadastre e gira múltiplas viaturas no Rent-a-Car'
                )}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If Owner is not yet biometrically verified */}
        {!ownerFleet || !ownerFleet.isFacialVerified ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-black text-neutral-900">
                Verificação Biométrica do Proprietário
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto mt-1 leading-relaxed">
                Para cadastrar viaturas e disponibilizá-las no catálogo, o <strong>proprietário legítimo</strong> deve submeter o seu <strong>BI ou Passaporte</strong> e realizar o <strong>Reconhecimento Facial ao vivo</strong>.
              </p>
            </div>

            <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex items-center gap-2 text-neutral-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>BI ou Passaporte</strong> (Frente e Verso)</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Verificação Facial ao Vivo</strong> (Anti-Burlar)</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Livrete e Título de Propriedade</strong> do Carro</span>
              </div>
              <div className="flex items-center gap-2 text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200 mt-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0" />
                <span><strong>Nota:</strong> A carta de condução <u>não</u> é exigida ao proprietário caso disponha de motoristas ou aluguer executivo.</span>
              </div>
            </div>

            <button
              onClick={onStartOwnerBiometrics}
              className="h-12 px-6 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-black text-sm rounded-2xl shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Iniciar Minha Validação Facial e BI</span>
            </button>
          </div>
        ) : (
          <>
            {/* Top Navigation Tabs */}
            <div className="flex border-b border-neutral-200 bg-neutral-50 px-4 pt-2 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveSubTab('vehicles')}
                className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeSubTab === 'vehicles'
                    ? 'border-orange-600 text-orange-600 font-black'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>Minhas Viaturas ({totalCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSubTab('add_vehicle')}
                className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeSubTab === 'add_vehicle'
                    ? 'border-orange-600 text-orange-600 font-black'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>Adicionar Viatura (+)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSubTab('subscription')}
                className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeSubTab === 'subscription'
                    ? 'border-orange-600 text-orange-600 font-black'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Mensalidades ({activeCount}/{totalCount} Ativas)</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
              {paymentSuccessCarId && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-950 font-bold animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Mensalidade paga com sucesso via M-Pesa / E-Mola! A viatura está agora visível no catálogo por mais 30 dias.</span>
                </div>
              )}

              {/* TAB 1: FLEET LIST */}
              {activeSubTab === 'vehicles' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-neutral-900">
                        Frota Registada de {ownerFleet.fullName}
                      </h3>
                      <p className="text-xs text-neutral-500">
                        Cada viatura requer subscrição mensal ativa (1.000 MT) para estar visível.
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveSubTab('add_vehicle')}
                      className="h-9 px-3 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-xs font-black rounded-xl flex items-center gap-1 cursor-pointer shadow-sm transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar Viatura</span>
                    </button>
                  </div>

                  {ownerFleet.vehicles.length === 0 ? (
                    <div className="p-8 text-center bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-200 space-y-3">
                      <Car className="w-10 h-10 text-neutral-300 mx-auto" />
                      <p className="text-xs font-semibold text-neutral-600">
                        Ainda não adicionou nenhuma viatura à sua frota.
                      </p>
                      <button
                        onClick={() => setActiveSubTab('add_vehicle')}
                        className="h-10 px-4 bg-orange-600 hover:bg-orange-700 text-white text-xs font-black rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Adicionar a Minha Primeira Viatura</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {ownerFleet.vehicles.map((car) => {
                        const isActive = car.isActiveSubscription !== false;
                        return (
                          <div
                            key={car.id}
                            className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                              isActive 
                                ? 'bg-white border-neutral-200/90 shadow-2xs' 
                                : 'bg-neutral-50 border-neutral-300 opacity-85'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={car.photo}
                                alt={car.model}
                                className="w-16 h-14 rounded-xl object-cover border shrink-0 bg-neutral-900"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-black text-sm text-neutral-900 leading-snug">
                                    {car.model}
                                  </h4>
                                  {car.plateNumber && (
                                    <span className="text-[10px] font-mono font-bold bg-neutral-100 border border-neutral-300 px-1.5 py-0.5 rounded text-neutral-700">
                                      {car.plateNumber}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-neutral-500 flex items-center gap-2 mt-0.5">
                                  <span>{car.city}, {car.province}</span>
                                  <span>•</span>
                                  <strong className="text-neutral-900 font-bold">{car.ratePerDay?.toLocaleString()} MT / dia</strong>
                                </div>

                                <div className="flex items-center gap-1.5 mt-1.5">
                                  {isActive ? (
                                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                                      <Eye className="w-3 h-3 text-emerald-600" />
                                      Visível no Rent-a-Car (Activa)
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                                      <EyeOff className="w-3 h-3 text-amber-700" />
                                      Invisível (Mensalidade Pendente)
                                    </span>
                                  )}

                                  {car.livretePhoto && (
                                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded">
                                      Livrete ✓
                                    </span>
                                  )}
                                  {car.tituloPropriedadePhoto && (
                                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded">
                                      Título ✓
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 self-end sm:self-center">
                              {!isActive ? (
                                <button
                                  type="button"
                                  onClick={() => setPayingCarId(car.id)}
                                  className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs rounded-xl flex items-center gap-1 shadow-sm cursor-pointer"
                                >
                                  <CreditCard className="w-3 h-3" />
                                  <span>Ativar (1.000 MT)</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleToggleDeactivate(car.id)}
                                  className="h-8 px-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                                  title="Pausar visibilidade sem remover"
                                >
                                  <EyeOff className="w-3 h-3" />
                                  <span>Pausar</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleRemoveVehicle(car.id)}
                                className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center cursor-pointer transition-colors"
                                title="Remover viatura"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ADD VEHICLE FORM */}
              {activeSubTab === 'add_vehicle' && (
                <form onSubmit={handleAddVehicle} className="space-y-3.5">
                  <div className="bg-orange-50 border border-orange-200 p-3 rounded-2xl flex items-center justify-between text-xs text-orange-950 font-bold">
                    <span>A adicionar ao perfil do proprietário {ownerFleet.fullName}</span>
                    <span className="text-[11px] bg-orange-200/70 px-2 py-0.5 rounded-lg">BI {ownerFleet.biNumber}</span>
                  </div>

                  <div>
                    <label className="text-xs font-black text-neutral-800 block mb-1">
                      Modelo e Versão da Viatura *
                    </label>
                    <input
                      required
                      placeholder="Ex: Toyota Fortuner 2.8 GD-6 4x4"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full h-11 px-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="text-xs font-black text-neutral-800 block mb-1">Marca *</label>
                      <input
                        required
                        placeholder="Ex: Toyota, Nissan, Ford"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-full h-10 px-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black text-neutral-800 block mb-1">Matrícula da Viatura *</label>
                      <input
                        required
                        placeholder="Ex: AF-123-MC"
                        value={plateNumber}
                        onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                        className="w-full h-10 px-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black text-neutral-800 block mb-1">Categoria *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full h-10 px-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-bold"
                      >
                        <option value="4x4">4x4 Todo-o-Terreno</option>
                        <option value="suv">SUV Familiar</option>
                        <option value="carrinha">Pickup / Carrinha</option>
                        <option value="economico">Económico / Sedan</option>
                        <option value="executivo">Executivo</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="text-xs font-black text-neutral-800 block mb-1">Lugares</label>
                      <input
                        type="number"
                        min="2"
                        max="16"
                        value={seats}
                        onChange={(e) => setSeats(Number(e.target.value))}
                        className="w-full h-10 px-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-bold text-center"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black text-neutral-800 block mb-1">Caixa</label>
                      <select
                        value={transmission}
                        onChange={(e) => setTransmission(e.target.value as any)}
                        className="w-full h-10 px-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-bold"
                      >
                        <option value="Automático">Automático</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-black text-neutral-800 block mb-1">Combustível</label>
                      <select
                        value={fuel}
                        onChange={(e) => setFuel(e.target.value as any)}
                        className="w-full h-10 px-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-bold"
                      >
                        <option value="Gasóleo">Gasóleo</option>
                        <option value="Gasolina">Gasolina</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-black text-neutral-800 block mb-1">Diária (MT) *</label>
                      <input
                        type="number"
                        required
                        placeholder="Ex: 4500"
                        value={ratePerDay}
                        onChange={(e) => setRatePerDay(e.target.value)}
                        className="w-full h-10 px-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-black text-neutral-800 block mb-1">Província *</label>
                      <select
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full h-10 px-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-bold"
                      >
                        {MOZ_PROVINCES_LIST.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-black text-neutral-800 block mb-1">Cidade / Distrito *</label>
                      <input
                        required
                        placeholder="Ex: Maputo, Matola, Inhambane"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full h-10 px-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-semibold"
                      />
                    </div>
                  </div>

                  {/* GALERIA DE FOTOGRAFIAS DA VIATURA (ATÉ 5 FOTOS: FRENTE, LATERAIS, TRASEIRA, INTERIOR) */}
                  <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-black text-neutral-900">
                        <Camera className="w-4 h-4 text-orange-600" />
                        <span>Galeria da Viatura (1 a 5 Fotografias Detalhadas)</span>
                      </div>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                        {carPhotos.filter(Boolean).length} de 5 Fotos Carregadas
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-500 leading-relaxed">
                      Carregue fotos reais para demonstrar a viatura em detalhe (frente/capô, laterais, traseira, interior/painel e bagageira). A primeira foto será a capa principal.
                    </p>

                    {/* 5 Slots Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                      {[
                        { label: '1. Frente (Capa) *', desc: 'Vista Frontal' },
                        { label: '2. Lateral', desc: 'Lateral do Carro' },
                        { label: '3. Traseira', desc: 'Vista Traseira' },
                        { label: '4. Interior', desc: 'Painel & Bancos' },
                        { label: '5. Bagageira', desc: 'Mala / Detalhe' },
                      ].map((slot, idx) => {
                        const photoUrl = carPhotos[idx];
                        return (
                          <div 
                            key={idx}
                            className={`p-2 rounded-xl border flex flex-col items-center justify-between text-center relative transition-all ${
                              photoUrl ? 'bg-white border-orange-300 shadow-2xs' : 'bg-neutral-100/70 border-dashed border-neutral-300'
                            }`}
                          >
                            <span className="text-[10px] font-black text-neutral-800 block truncate w-full">
                              {slot.label}
                            </span>

                            {photoUrl ? (
                              <div className="my-1.5 w-full aspect-4/3 rounded-lg overflow-hidden border border-neutral-200 relative group">
                                <img src={photoUrl} alt={slot.label} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = [...carPhotos];
                                    next[idx] = '';
                                    setCarPhotos(next.filter(Boolean));
                                  }}
                                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                  title="Remover foto"
                                >
                                  ×
                                </button>
                              </div>
                            ) : (
                              <div className="my-1.5 w-full aspect-4/3 rounded-lg bg-neutral-200/50 flex flex-col items-center justify-center text-neutral-400">
                                <Camera className="w-5 h-5 mb-0.5" />
                                <span className="text-[9px] font-semibold">{slot.desc}</span>
                              </div>
                            )}

                            {/* Upload / Replace button */}
                            <label className="w-full h-7 rounded-lg bg-neutral-150 hover:bg-neutral-200 active:scale-95 text-neutral-700 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors">
                              <Upload className="w-3 h-3 text-orange-600" />
                              <span>{photoUrl ? 'Trocar' : 'Carregar'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      const res = event.target?.result as string;
                                      const next = [...carPhotos];
                                      next[idx] = res;
                                      setCarPhotos(next.filter(Boolean));
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* DOCUMENTOS OBRIGATÓRIOS DO VEÍCULO: LIVRETE E TÍTULO DE PROPRIEDADE */}
                  <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-black text-neutral-900">
                      <FileText className="w-4 h-4 text-orange-600" />
                      <span>Documentação Obrigatória da Viatura (Livrete + Título de Propriedade)</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 leading-relaxed">
                      Conforme os regulamentos do sistema, para proteger locatários contra viaturas ilegais, o proprietário deve anexar foto do Livrete e do Título de Propriedade emitidos pelo INATRO.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {/* Livrete */}
                      <div className="p-3 bg-white rounded-xl border border-neutral-200 space-y-1.5 text-center">
                        <div className="text-xs font-bold text-neutral-800">1. Livrete do Veículo *</div>
                        {livretePhoto ? (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md block">
                            ✓ Livrete Carregado
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setLivretePhoto('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80')}
                            className="h-8 px-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-lg inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Carregar Livrete</span>
                          </button>
                        )}
                      </div>

                      {/* Título de Propriedade */}
                      <div className="p-3 bg-white rounded-xl border border-neutral-200 space-y-1.5 text-center">
                        <div className="text-xs font-bold text-neutral-800">2. Título de Propriedade *</div>
                        {tituloPropriedadePhoto ? (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md block">
                            ✓ Título Carregado
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setTituloPropriedadePhoto('https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80')}
                            className="h-8 px-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-lg inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Carregar Título</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black text-neutral-800 block mb-1">
                      Observações / Condições (Caução, Seguro, Motorista)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ex: Caução de 10.000 MT reembolsável. Quilometragem livre. Disponível com ou sem motorista."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs"
                    />
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveSubTab('vehicles')}
                      className="h-11 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 h-11 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Registar Esta Viatura na Minha Frota</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: MONTHLY SUBSCRIPTION MANAGEMENT */}
              {activeSubTab === 'subscription' && (
                <div className="space-y-4">
                  {/* Seniority Indicator as Fleet Owner */}
                  <div className="bg-white p-3.5 rounded-2xl border border-neutral-200/90 shadow-2xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-neutral-400 block">Antiguidade do Proprietário</span>
                        <span className="text-xs font-extrabold text-neutral-900">
                          {getPlatformTenureText(ownerFleet?.verifiedAt, ownerFleet?.platformTenure, ownerFleet?.ownerId)}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Frota Ativa
                    </span>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1.5">
                    <div className="font-black text-sm flex items-center gap-1.5 text-amber-900">
                      <CreditCard className="w-4 h-4 text-amber-700" />
                      <span>Regra de Visibilidade por Viatura (1.000 MT / mês por cada carro)</span>
                    </div>
                    <p className="leading-relaxed">
                      A visibilidade no Rent-a-Car é <strong>suscetível ao pagamento individual de cada viatura</strong>. A viatura cuja mensalidade não for paga nesse mês fica automaticamente invisível para os clientes no sistema, mantendo-se apenas visíveis aquelas que tiverem a taxa regularizada.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-center">
                      <span className="text-neutral-500 text-xs block">Viaturas Ativas (Visíveis)</span>
                      <strong className="text-2xl font-black text-emerald-600">{activeCount}</strong>
                    </div>
                    <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-center">
                      <span className="text-neutral-500 text-xs block">Mensalidade Total da Frota</span>
                      <strong className="text-2xl font-black text-neutral-900">
                        {(activeCount * MONTHLY_FEE_PER_VEHICLE).toLocaleString()} MT
                      </strong>
                    </div>
                  </div>

                  {/* Faturação Oficial Button */}
                  <div className="p-3 bg-neutral-900 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
                    <div>
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-amber-400" />
                        <span>Faturação e Comprovativo Fiscal Oficial (Bill)</span>
                      </span>
                      <p className="text-[11px] text-neutral-300 mt-0.5">
                        Emitida em conformidade pelo operador com NUIT 401298450 e IVA 16%.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedInvoiceData({
                          moduleType: 'rentacar',
                          serviceTitle: `Subscrição Mensal de Frota Rent-a-Car (${activeCount} Viaturas)`,
                          clientName: ownerFleet.fullName,
                          clientNuitOrBi: `BI/NUIT: ${ownerFleet.biNumber}`,
                          clientPhone: ownerFleet.phone,
                          clientProvince: ownerFleet.province,
                          clientCity: ownerFleet.city,
                          itemDetails: ownerFleet.vehicles.map((vh) => ({
                            description: `Mensalidade de Visibilidade - ${vh.model} (${vh.plateNumber || 'Frota'})`,
                            quantity: 1,
                            unitPriceMzn: MONTHLY_FEE_PER_VEHICLE,
                            totalMzn: MONTHLY_FEE_PER_VEHICLE
                          })),
                          subtotalMzn: Math.max(1, activeCount) * MONTHLY_FEE_PER_VEHICLE,
                          ivaRate: 0.16,
                          ivaAmountMzn: Math.round(Math.max(1, activeCount) * MONTHLY_FEE_PER_VEHICLE * 0.16),
                          totalMzn: Math.round(Math.max(1, activeCount) * MONTHLY_FEE_PER_VEHICLE * 1.16),
                          paymentMethod: paymentProvider === 'emola' ? 'e-Mola' : 'M-Pesa',
                        });
                        setIsBillingModalOpen(true);
                      }}
                      className="h-9 px-4 bg-amber-400 hover:bg-amber-300 active:scale-95 text-neutral-950 font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Ver Fatura Oficial (Bill)</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase text-neutral-500 tracking-wider">
                      Estado Individual das Viaturas
                    </h4>

                    {ownerFleet.vehicles.map((v) => {
                      const isActive = v.isActiveSubscription !== false;
                      return (
                        <div
                          key={v.id}
                          className="p-3 bg-white rounded-xl border border-neutral-200 flex items-center justify-between text-xs gap-2"
                        >
                          <div>
                            <div className="font-bold text-neutral-900">{v.model}</div>
                            <div className="text-neutral-500 text-[11px] font-mono">{v.plateNumber || 'Sem matrícula'}</div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isActive ? (
                              <span className="font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-md text-[10px]">
                                Pago e Visível (1.000 MT/mês)
                              </span>
                            ) : (
                              <span className="font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-md text-[10px]">
                                Expirado / Invisível
                              </span>
                            )}

                            {!isActive ? (
                              <button
                                type="button"
                                onClick={() => setPayingCarId(v.id)}
                                className="h-7 px-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-[11px] cursor-pointer"
                              >
                                Pagar 1.000 MT
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleToggleDeactivate(v.id)}
                                className="h-7 px-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-lg text-[10px] cursor-pointer"
                              >
                                Pausar
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* PAYMENT MODAL (M-PESA / E-MOLA) FOR ACTIVATING A VEHICLE */}
        {payingCarId && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-neutral-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-base text-neutral-900">
                  Ativar Viatura (1.000 MT)
                </h3>
                <button
                  onClick={() => setPayingCarId(null)}
                  className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">
                Pague a mensalidade individual desta viatura para ela voltar a ficar visível a todos os clientes durante 30 dias.
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentProvider('mpesa')}
                  className={`flex-1 p-2.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                    paymentProvider === 'mpesa' 
                      ? 'bg-red-500 text-white border-red-600 shadow-sm' 
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                  }`}
                >
                  M-Pesa (Vodacom)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentProvider('emola')}
                  className={`flex-1 p-2.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                    paymentProvider === 'emola' 
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm' 
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                  }`}
                >
                  E-Mola (Movitel)
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Número de Celular para Débito
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                    +258
                  </span>
                  <input
                    type="tel"
                    value={paymentPhone.replace('+258', '').trim()}
                    onChange={(e) => setPaymentPhone(e.target.value)}
                    placeholder="84 123 4567"
                    className="w-full h-10 pl-14 pr-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-bold"
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={() => handleProcessMonthlyPayment(payingCarId)}
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>A Processar Pagamento M-Pesa...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar Pagamento de 1.000 MT</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Official Billing & Invoice Modal (Bill) */}
        <BillingInvoiceModal
          isOpen={isBillingModalOpen}
          onClose={() => setIsBillingModalOpen(false)}
          invoiceData={selectedInvoiceData}
        />
      </div>
    </div>
  );
};
