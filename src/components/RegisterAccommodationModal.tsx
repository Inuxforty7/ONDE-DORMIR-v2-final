import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  X, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  Trash2, 
  Sparkles, 
  AlertCircle,
  Clock,
  MapPin,
  Image as ImageIcon,
  DollarSign,
  MessageCircle,
  Phone,
  BedDouble,
  Bath,
  Wind,
  Wifi,
  Car,
  Zap,
  Wine,
  Utensils,
  Waves,
  Camera,
  Navigation2,
  Navigation,
  AlertTriangle
} from 'lucide-react';
import { 
  Accommodation, 
  AccommodationType, 
  AmenityId, 
  PropertyServiceId, 
  RoomFeatureId 
} from '../types';
import { 
  PROPERTY_SERVICES_CATALOG, 
  ROOM_FEATURES_CATALOG 
} from '../utils/amenities';
import { TermsModal } from './TermsModal';
import { BillingInvoiceModal, BillingInvoiceData } from './BillingInvoiceModal';

interface RegisterAccommodationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccommodation: (item: Accommodation) => void;
  userCoordsLat?: number;
  userCoordsLng?: number;
}

type RegistrationStep = 
  | 'basic_info' 
  | 'location_map' 
  | 'photos' 
  | 'rooms_prices' 
  | 'amenities' 
  | 'contact_submit' 
  | 'success';

const PROVINCES_LIST = [
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

interface MapPinPickerProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}

const MapPinPicker: React.FC<MapPinPickerProps> = ({ lat, lng, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom: 14,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);

      const pinHtml = `
        <div style="cursor: grab;" class="flex flex-col items-center">
          <div class="px-2.5 py-1 rounded-xl bg-emerald-600 text-white font-extrabold text-[11px] shadow-lg border border-white flex items-center gap-1">
            <span>📍 Pin do Alojamento</span>
          </div>
          <div class="w-0 h-0 border-x-5 border-x-transparent border-t-6 border-t-emerald-600 -mt-px"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'owner-picker-pin',
        html: pinHtml,
        iconSize: [140, 32],
        iconAnchor: [70, 32],
      });

      const marker = L.marker([lat, lng], {
        icon: customIcon,
        draggable: true,
      }).addTo(map);

      marker.on('dragend', (e) => {
        const newPos = e.target.getLatLng();
        onChange(newPos.lat, newPos.lng);
      });

      map.on('click', (e) => {
        marker.setLatLng(e.latlng);
        onChange(e.latlng.lat, e.latlng.lng);
      });

      mapRef.current = map;
      markerRef.current = marker;

      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 250);

      return () => {
        clearTimeout(timer);
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }
  }, []);

  useEffect(() => {
    if (markerRef.current && mapRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      mapRef.current.panTo([lat, lng], { animate: true });
    }
  }, [lat, lng]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[11px] text-neutral-600 font-medium">
        <span>Toque no mapa ou arraste o pin para posicionar:</span>
        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          {lat.toFixed(4)}, {lng.toFixed(4)}
        </span>
      </div>
      <div 
        ref={containerRef} 
        className="w-full h-48 rounded-2xl overflow-hidden border border-neutral-300 shadow-inner z-0" 
      />
    </div>
  );
};

export const RegisterAccommodationModal: React.FC<RegisterAccommodationModalProps> = ({
  isOpen,
  onClose,
  onAddAccommodation,
  userCoordsLat = -25.9692,
  userCoordsLng = 32.5732,
}) => {
  const [step, setStep] = useState<RegistrationStep>('basic_info');

  // Step 1: Basic Info (Pensão & Guest House)
  const [name, setName] = useState('');
  const [type, setType] = useState<AccommodationType>('pensao');
  const [province, setProvince] = useState('Maputo Cidade');
  const [city, setCity] = useState('Maputo');
  const [neighborhood, setNeighborhood] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');

  // Step 2: Location Map & Coordinates
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [district, setDistrict] = useState('');
  const [lat, setLat] = useState<number>(userCoordsLat);
  const [lng, setLng] = useState<number>(userCoordsLng);
  const [isLocatingOwner, setIsLocatingOwner] = useState(false);
  const [gpsAccuracyNotice, setGpsAccuracyNotice] = useState<string | null>(null);

  // Step 3: Photos
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80'
  ]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  // Step 4: Rooms & Prices
  const [approxPrice, setApproxPrice] = useState('1800');
  const [maxPrice, setMaxPrice] = useState('2800');
  const [hasDoubleBed, setHasDoubleBed] = useState(true);
  const [hasPrivateBathroom, setHasPrivateBathroom] = useState(true);
  const [isOpen24h, setIsOpen24h] = useState(true);

  // Step 5: Real Amenities & Services
  const [selectedPropertyServices, setSelectedPropertyServices] = useState<PropertyServiceId[]>([
    'generator',
    'security',
    'parking'
  ]);
  const [selectedRoomFeatures, setSelectedRoomFeatures] = useState<RoomFeatureId[]>([
    'ac',
    'double_bed',
    'private_bathroom',
    'hot_water'
  ]);

  // Step 6: Owner Contacts & Anti-Fraud Identification
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [docType, setDocType] = useState<'bi' | 'passport' | 'dire'>('bi');
  const [docNumber, setDocNumber] = useState('');
  const [biFrontPhoto, setBiFrontPhoto] = useState('');
  const [facialSelfiePhoto, setFacialSelfiePhoto] = useState('');
  const [isFacialVerified, setIsFacialVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  if (!isOpen) return null;

  const togglePropertyService = (serviceId: PropertyServiceId) => {
    setSelectedPropertyServices((prev) =>
      prev.includes(serviceId) ? prev.filter((s) => s !== serviceId) : [...prev, serviceId]
    );
  };

  const toggleRoomFeature = (featureId: RoomFeatureId) => {
    setSelectedRoomFeatures((prev) =>
      prev.includes(featureId) ? prev.filter((r) => r !== featureId) : [...prev, featureId]
    );
  };

  const handleAddPhoto = () => {
    if (newPhotoUrl.trim()) {
      setPhotos((prev) => [...prev, newPhotoUrl.trim()]);
      setNewPhotoUrl('');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Get Owner Current GPS Location
  const handleUseCurrentGps = () => {
    if (!navigator.geolocation) {
      setGpsAccuracyNotice('Geolocalização não suportada. Ajuste as coordenadas no mapa.');
      return;
    }

    setIsLocatingOwner(true);
    setGpsAccuracyNotice(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocatingOwner(false);
        const { latitude, longitude, accuracy } = pos.coords;
        setLat(latitude);
        setLng(longitude);
        if (accuracy > 500) {
          setGpsAccuracyNotice(`⚠️ Precisão GPS aproximada (~${Math.round(accuracy)}m). Pode ajustar o pin arrastando no mapa.`);
        } else {
          setGpsAccuracyNotice(`✓ Localização GPS capturada com alta precisão (~${Math.round(accuracy)}m).`);
        }
      },
      (err) => {
        setIsLocatingOwner(false);
        console.warn('GPS error in owner registration:', err.message);
        setGpsAccuracyNotice('Não foi possível obter GPS. Por favor posicione o pin manualmente no mapa.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Step Handlers
  const handleNextFromBasicInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !neighborhood.trim()) {
      setErrorMessage('Por favor preencha o nome do alojamento e o bairro.');
      return;
    }
    setErrorMessage(null);
    setStep('location_map');
  };

  const handleNextFromLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      setErrorMessage('Por favor informe o endereço ou rua do alojamento.');
      return;
    }
    setErrorMessage(null);
    setStep('photos');
  };

  const handleNextFromPhotos = () => {
    if (photos.length === 0) {
      setErrorMessage('Adicione pelo menos 1 fotografia do estabelecimento.');
      return;
    }
    setErrorMessage(null);
    setStep('rooms_prices');
  };

  const handleNextFromRooms = () => {
    if (!approxPrice || parseInt(approxPrice, 10) <= 0) {
      setErrorMessage('Informe o valor indicativo por noite.');
      return;
    }
    setErrorMessage(null);
    setStep('amenities');
  };

  const handleNextFromAmenities = () => {
    setErrorMessage(null);
    setStep('contact_submit');
  };

  const handleFinalSubmit = () => {
    if (!phone.trim()) {
      setErrorMessage('Por favor insira um número de telefone para chamadas.');
      return;
    }
    if (!whatsapp.trim()) {
      setErrorMessage('Por favor insira o número de WhatsApp para reservas diretas.');
      return;
    }
    if (!ownerName.trim()) {
      setErrorMessage('Por favor insira o nome do proprietário ou gerente.');
      return;
    }

    // Consolidated amenities list
    const consolidatedAmenities: AmenityId[] = [];
    if (selectedRoomFeatures.includes('ac')) consolidatedAmenities.push('ac');
    if (selectedRoomFeatures.includes('private_bathroom') || hasPrivateBathroom) consolidatedAmenities.push('private_bathroom');
    if (selectedRoomFeatures.includes('hot_water')) consolidatedAmenities.push('hot_water');
    if (selectedRoomFeatures.includes('tv')) consolidatedAmenities.push('tv');
    if (selectedPropertyServices.includes('generator') || isOpen24h) consolidatedAmenities.push('generator');
    if (selectedPropertyServices.includes('wifi')) consolidatedAmenities.push('wifi');
    if (selectedPropertyServices.includes('parking')) consolidatedAmenities.push('parking');
    if (selectedPropertyServices.includes('pool')) consolidatedAmenities.push('pool');
    if (selectedPropertyServices.includes('bar')) consolidatedAmenities.push('bar');
    if (selectedPropertyServices.includes('restaurant')) consolidatedAmenities.push('restaurant');
    if (selectedPropertyServices.includes('breakfast')) consolidatedAmenities.push('breakfast');
    if (selectedPropertyServices.includes('security')) consolidatedAmenities.push('security');

    const roomFeaturesFinal = [...selectedRoomFeatures];
    if (hasDoubleBed && !roomFeaturesFinal.includes('double_bed')) roomFeaturesFinal.push('double_bed');
    if (hasPrivateBathroom && !roomFeaturesFinal.includes('private_bathroom')) roomFeaturesFinal.push('private_bathroom');

    const cleanPhone = phone.startsWith('+') ? phone : `+258${phone.replace(/[^0-9]/g, '')}`;
    const cleanWhatsapp = (whatsapp || phone).replace(/[^0-9]/g, '');

    const newAccommodation: Accommodation = {
      id: `custom-owner-${Date.now()}`,
      name: name.trim(),
      type,
      tagline: tagline.trim() || `${type === 'pensao' ? 'Pensão' : type === 'guest_house' ? 'Guest House' : 'Residencial'} acolhedora e segura em ${neighborhood}`,
      description: description.trim() || `Alojamento localizado no bairro ${neighborhood} em ${city} (${province}). Quartos confortáveis com ambiente tranquilo, discreto e seguro.`,
      location: {
        lat: lat || userCoordsLat,
        lng: lng || userCoordsLng,
        address: address.trim(),
        neighborhood: neighborhood.trim(),
        city: city.trim(),
        district: district.trim() || undefined,
        province,
        landmark: landmark.trim() || undefined,
      },
      phone: cleanPhone,
      whatsapp: cleanWhatsapp,
      amenities: Array.from(new Set(consolidatedAmenities)),
      propertyServices: selectedPropertyServices,
      roomFeatures: roomFeaturesFinal,
      photos: photos.length > 0 ? photos : [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80'
      ],
      // Important requirement: A map location is NOT automatically verified by Onde Dormir.
      // New owner listings start as: ⚪ Not Verified
      verificationStatus: 'unverified',
      isPendingVerification: true,
      ownerName: ownerName.trim(),
      ownerPhone: cleanPhone,
      docType,
      docNumber: docNumber.trim() || undefined,
      biFrontPhoto: biFrontPhoto || undefined,
      facialSelfiePhoto: facialSelfiePhoto || undefined,
      isFacialVerified: Boolean(facialSelfiePhoto || isFacialVerified),
      registeredAt: new Date().toISOString().split('T')[0],
      platformTenure: 'Submetido hoje (Não Verificado)',
      isOpen24h,
      priceEstimate: {
        approxMin: parseInt(approxPrice, 10) || 1800,
        approxMax: parseInt(maxPrice, 10) || Math.round((parseInt(approxPrice, 10) || 1800) * 1.5),
        currency: 'MZN',
        labelNote: `A partir de ${(parseInt(approxPrice, 10) || 1800).toLocaleString('pt-MZ')} MT/noite.`,
      },
    };

    onAddAccommodation(newAccommodation);
    setStep('success');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
        <div 
          className="bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="px-4 sm:px-5 py-3.5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-neutral-900 leading-tight">
                  Registo de Proprietário
                </h2>
                <p className="text-[11px] text-neutral-500 font-medium">
                  {step === 'basic_info' && '1/6: Dados da Pensão / Guest House'}
                  {step === 'location_map' && '2/6: Localização Exata no Mapa'}
                  {step === 'photos' && '3/6: Fotografias do Estabelecimento'}
                  {step === 'rooms_prices' && '4/6: Quartos e Preços'}
                  {step === 'amenities' && '5/6: Serviços e Comodidades'}
                  {step === 'contact_submit' && '6/6: Contactos & Submissão'}
                  {step === 'success' && 'Registo Concluído com Sucesso'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 transition-colors flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Indicator */}
          {step !== 'success' && (
            <div className="px-4 sm:px-5 py-2 bg-neutral-50/90 border-b border-neutral-200/80 shrink-0 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-neutral-800">
                  {step === 'basic_info' && '1. Registo Inicial'}
                  {step === 'location_map' && '2. Mapa & Pin GPS'}
                  {step === 'photos' && '3. Fotos'}
                  {step === 'rooms_prices' && '4. Quartos/Preços'}
                  {step === 'amenities' && '5. Comodidades'}
                  {step === 'contact_submit' && '6. WhatsApp & Submissão'}
                </span>
                <span className="font-extrabold text-emerald-700 bg-emerald-100/70 px-2 py-0.2 rounded-md">
                  {step === 'basic_info' ? '1/6' : step === 'location_map' ? '2/6' : step === 'photos' ? '3/6' : step === 'rooms_prices' ? '4/6' : step === 'amenities' ? '5/6' : '6/6'}
                </span>
              </div>
              <div className="grid grid-cols-6 gap-1 h-1.5 w-full">
                <div className={`rounded-full transition-all duration-300 ${['basic_info', 'location_map', 'photos', 'rooms_prices', 'amenities', 'contact_submit'].includes(step) ? 'bg-emerald-600' : 'bg-neutral-200'}`} />
                <div className={`rounded-full transition-all duration-300 ${['location_map', 'photos', 'rooms_prices', 'amenities', 'contact_submit'].includes(step) ? 'bg-emerald-600' : 'bg-neutral-200'}`} />
                <div className={`rounded-full transition-all duration-300 ${['photos', 'rooms_prices', 'amenities', 'contact_submit'].includes(step) ? 'bg-emerald-600' : 'bg-neutral-200'}`} />
                <div className={`rounded-full transition-all duration-300 ${['rooms_prices', 'amenities', 'contact_submit'].includes(step) ? 'bg-emerald-600' : 'bg-neutral-200'}`} />
                <div className={`rounded-full transition-all duration-300 ${['amenities', 'contact_submit'].includes(step) ? 'bg-emerald-600' : 'bg-neutral-200'}`} />
                <div className={`rounded-full transition-all duration-300 ${['contact_submit'].includes(step) ? 'bg-emerald-600' : 'bg-neutral-200'}`} />
              </div>
            </div>
          )}

          {/* Body Content */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: Basic Info */}
            {step === 'basic_info' && (
              <form onSubmit={handleNextFromBasicInfo} className="space-y-3.5 animate-in fade-in duration-150">
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 text-xs text-emerald-950">
                  <span className="font-bold block">🏠 Registo Exclusivo de Pensões & Guest Houses</span>
                  <span className="text-[11px] text-emerald-800 mt-0.5 block">
                    Adicione o seu estabelecimento para ser descoberto por clientes que procuram pernoita rápida, privada e confortável.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      Nome do Estabelecimento *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Pensão Baía de Maxixe, Guest House Polana"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 px-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      Tipo de Alojamento *
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as AccommodationType)}
                      className="w-full h-11 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="pensao">🏠 Pensão</option>
                      <option value="guest_house">🏡 Guest House</option>
                      <option value="residencial">🏘️ Residencial</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      Província *
                    </label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full h-11 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {PROVINCES_LIST.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Maputo, Maxixe, Beira..."
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-11 px-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Baixa, Polana, Centro..."
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full h-11 px-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Frase de Destaque (Tagline)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Quartos climatizados com WC privativo e ambiente calmo"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full h-11 px-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-600/20 touch-manipulation"
                  >
                    <span>Avançar para Localização no Mapa</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Exact Location on Map with Interactive Pin Picker & GPS */}
            {step === 'location_map' && (
              <form onSubmit={handleNextFromLocation} className="space-y-3.5 animate-in fade-in duration-150">
                <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs text-sky-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-sky-900">
                    <MapPin className="w-4 h-4 text-sky-600" />
                    <span>2. Localização Exata no Mapa & Pin GPS</span>
                  </div>
                  <p className="text-[11px] text-sky-800">
                    Obtenha a sua posição por GPS ou posicione o pin arrastando no mapa interativo.
                  </p>
                </div>

                {/* GPS Capture Button */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={handleUseCurrentGps}
                    disabled={isLocatingOwner}
                    className="flex-1 h-11 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer touch-manipulation"
                  >
                    <Navigation className={`w-4 h-4 ${isLocatingOwner ? 'animate-spin' : ''}`} />
                    <span>{isLocatingOwner ? 'A obter GPS real...' : 'Usar Minha Localização GPS Atual'}</span>
                  </button>
                </div>

                {gpsAccuracyNotice && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{gpsAccuracyNotice}</span>
                  </div>
                )}

                {/* Interactive Leaflet Pin Picker */}
                <MapPinPicker 
                  lat={lat} 
                  lng={lng} 
                  onChange={(newLat, newLng) => {
                    setLat(newLat);
                    setLng(newLng);
                  }} 
                />

                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Endereço / Rua do Estabelecimento *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Rua Consiglieri Pedroso, nº 142 ou Av. da Independência"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full h-11 px-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      Ponto de Referência
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: A 100m do Mercado Municipal ou Próximo à bomba Galp"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full h-11 px-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      Distrito Municipal (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: KaMpfumo, KaMavota..."
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full h-11 px-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('basic_info')}
                    className="h-12 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-2xl text-xs font-bold transition-all"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                  >
                    <span>Avançar para Fotos</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Photos */}
            {step === 'photos' && (
              <div className="space-y-3.5 animate-in fade-in duration-150">
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <ImageIcon className="w-4 h-4 text-amber-600" />
                    <span>3. Fotografias do Estabelecimento</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    Adicione fotos reais e nítidas da fachada, entrada e quartos para transmitir confiança aos clientes.
                  </p>
                </div>

                {/* Photos Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {photos.map((url, idx) => (
                    <div key={idx} className="relative aspect-4/3 rounded-xl overflow-hidden border border-neutral-200 group bg-neutral-100">
                      <img src={url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                        title="Remover foto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                          Foto Principal
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Photo Input */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Colar URL de fotografia (https://...)"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    className="flex-1 h-11 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="h-11 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shrink-0 transition-colors"
                  >
                    Adicionar
                  </button>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('location_map')}
                    className="h-12 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-2xl text-xs font-bold transition-all"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={handleNextFromPhotos}
                    className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                  >
                    <span>Avançar para Quartos & Preços</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Rooms & Prices */}
            {step === 'rooms_prices' && (
              <div className="space-y-3.5 animate-in fade-in duration-150">
                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>4. Quartos e Preço por Noite</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Defina a tarifa indicativa em Meticais (MT) e as condições principais dos quartos disponíveis.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      Preço Mínimo / Noite (MT) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="Ex: 1800"
                      value={approxPrice}
                      onChange={(e) => setApproxPrice(e.target.value)}
                      className="w-full h-11 px-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-bold text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      Preço Máximo / Noite (MT)
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 2800"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full h-11 px-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Room Key Conditions Checklist */}
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-bold text-neutral-800 block">
                    Condições dos Quartos
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setHasDoubleBed(!hasDoubleBed)}
                      className={`h-11 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                        hasDoubleBed
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-2xs'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <BedDouble className="w-4 h-4 text-emerald-600" />
                        <span>Quartos para Casal (Cama Dupla)</span>
                      </div>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${hasDoubleBed ? 'bg-emerald-600 text-white' : 'bg-neutral-200'}`}>✓</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setHasPrivateBathroom(!hasPrivateBathroom)}
                      className={`h-11 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                        hasPrivateBathroom
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-2xs'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Bath className="w-4 h-4 text-emerald-600" />
                        <span>Casa de Banho Privativa (WC)</span>
                      </div>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${hasPrivateBathroom ? 'bg-emerald-600 text-white' : 'bg-neutral-200'}`}>✓</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsOpen24h(!isOpen24h)}
                      className={`h-11 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                        isOpen24h
                          ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-2xs'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>Recepção Aberta 24 Horas</span>
                      </div>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isOpen24h ? 'bg-amber-600 text-white' : 'bg-neutral-200'}`}>✓</span>
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('photos')}
                    className="h-12 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-2xl text-xs font-bold transition-all"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={handleNextFromRooms}
                    className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                  >
                    <span>Avançar para Comodidades & Serviços</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: Real Amenities & Property Services */}
            {step === 'amenities' && (
              <div className="space-y-3.5 animate-in fade-in duration-150">
                <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-800 space-y-1">
                  <span className="font-bold block text-neutral-900">5. Serviços Reais do Estabelecimento & Quarto</span>
                  <span className="text-[11px] text-neutral-600 block">
                    Marque apenas os serviços que o seu estabelecimento efetivamente dispõe (sem falsas comodidades).
                  </span>
                </div>

                {/* 1. Serviços do Estabelecimento */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 block">
                    🏢 Serviços do Estabelecimento (Propriedade)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'generator' as PropertyServiceId, name: '⚡ Gerador / Energia 24h' },
                      { id: 'parking' as PropertyServiceId, name: '🅿️ Estacionamento Seguro' },
                      { id: 'wifi' as PropertyServiceId, name: '📶 Wi-Fi Grátis' },
                      { id: 'bar' as PropertyServiceId, name: '🍸 Bar / Bebidas' },
                      { id: 'restaurant' as PropertyServiceId, name: '🍽️ Restaurante / Refeições' },
                      { id: 'pool' as PropertyServiceId, name: '🏊 Piscina' },
                      { id: 'breakfast' as PropertyServiceId, name: '☕ Pequeno-Almoço' },
                      { id: 'security' as PropertyServiceId, name: '🛡️ Segurança / Portaria 24h' },
                    ].map((serv) => {
                      const isSelected = selectedPropertyServices.includes(serv.id);
                      return (
                        <button
                          key={serv.id}
                          type="button"
                          onClick={() => togglePropertyService(serv.id)}
                          className={`h-10 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                              : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                          }`}
                        >
                          <span className="truncate">{serv.name}</span>
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isSelected ? 'bg-emerald-600 text-white' : 'bg-neutral-200'}`}>✓</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Comodidades do Quarto */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold text-neutral-800 block">
                    🛏️ Comodidades do Quarto
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'ac' as RoomFeatureId, name: '❄️ Ar Condicionado' },
                      { id: 'private_bathroom' as RoomFeatureId, name: '🚿 WC Privativo' },
                      { id: 'hot_water' as RoomFeatureId, name: '🔥 Água Quente' },
                      { id: 'tv' as RoomFeatureId, name: '📺 Televisão / DStv' },
                      { id: 'balcony' as RoomFeatureId, name: '🌅 Varanda Privada' },
                      { id: 'fan' as RoomFeatureId, name: '🌀 Ventilador' },
                    ].map((room) => {
                      const isSelected = selectedRoomFeatures.includes(room.id);
                      return (
                        <button
                          key={room.id}
                          type="button"
                          onClick={() => toggleRoomFeature(room.id)}
                          className={`h-10 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold'
                              : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                          }`}
                        >
                          <span className="truncate">{room.name}</span>
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isSelected ? 'bg-indigo-600 text-white' : 'bg-neutral-200'}`}>✓</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('rooms_prices')}
                    className="h-12 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-2xl text-xs font-bold transition-all"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={handleNextFromAmenities}
                    className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                  >
                    <span>Avançar para Contactos & Submissão</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: WhatsApp / Phone & Anti-Fraud Security */}
            {step === 'contact_submit' && (
              <div className="space-y-3.5 animate-in fade-in duration-150">
                {/* Important Notice regarding map location and unverified initial state */}
                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-300 text-xs text-amber-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-black text-amber-900">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span>Aviso Importante de Verificação</span>
                  </div>
                  <p className="text-[11.5px] leading-relaxed text-amber-900">
                    <strong>A localização no mapa não constitui verificação automática por Onde Dormir.</strong> O seu registo iniciará como <strong>⚪ Não Verificado</strong> até à visita presencial de auditoria da nossa equipa.
                  </p>
                </div>

                {/* Contacts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      WhatsApp para Reservas *
                    </label>
                    <div className="relative">
                      <MessageCircle className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600" />
                      <input
                        type="tel"
                        required
                        placeholder="84 / 85 / 86 / 87..."
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full h-11 pl-9 pr-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      Telefone para Chamadas *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                      <input
                        type="tel"
                        required
                        placeholder="84 / 82 / 85..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-11 pl-9 pr-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Owner Identity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      Nome do Proprietário / Gerente *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nome completo do titular"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full h-11 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      Documento Oficial (BI / Passaporte)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 110100234567M"
                      value={docNumber}
                      onChange={(e) => setDocNumber(e.target.value)}
                      className="w-full h-11 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('amenities')}
                    className="h-12 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-2xl text-xs font-bold transition-all"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                  >
                    <span>Submeter Pensão / Guest House</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* SUCCESS SCREEN */}
            {step === 'success' && (
              <div className="py-5 text-center space-y-4 animate-in fade-in duration-200">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-800 border border-neutral-300 text-xs font-black rounded-full uppercase tracking-wider">
                    ⚪ Estado Inicial: Não Verificado
                  </span>
                  <h3 className="text-lg font-extrabold text-neutral-900">
                    Alojamento Registado com Sucesso!
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto leading-relaxed">
                    A sua Pensão / Guest House está disponível no mapa e pesquisa. Os clientes já podem ver a localização exata, preço e contactá-lo diretamente via WhatsApp.
                  </p>
                </div>

                <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-left space-y-1 text-xs text-neutral-700">
                  <span className="font-bold text-neutral-900 block">Auditoria Presencial:</span>
                  <p className="text-[11px] leading-relaxed text-neutral-600">
                    Para obter o selo oficial <strong>🟢 Verificado Presencialmente</strong>, a nossa equipa agendará uma visita de conformidade física ao seu estabelecimento.
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer touch-manipulation shadow-md"
                >
                  Concluir e Ver no Onde Dormir
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAccept={() => {
          setAgreedToTerms(true);
          setIsTermsModalOpen(false);
        }}
      />
    </>
  );
};
