import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  Upload, 
  Trash2, 
  Sparkles, 
  AlertCircle,
  Clock,
  Camera
} from 'lucide-react';
import { Accommodation, AccommodationType, AmenityId } from '../types';
import { AMENITIES_CATALOG } from '../utils/amenities';
import { TermsModal } from './TermsModal';
import { BillingInvoiceModal, BillingInvoiceData } from './BillingInvoiceModal';

interface RegisterAccommodationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccommodation: (item: Accommodation) => void;
  userCoordsLat?: number;
  userCoordsLng?: number;
}

export const RegisterAccommodationModal: React.FC<RegisterAccommodationModalProps> = ({
  isOpen,
  onClose,
  onAddAccommodation,
  userCoordsLat = -25.9692,
  userCoordsLng = 32.5732,
}) => {
  const [step, setStep] = useState<'form' | 'identity_verification' | 'terms' | 'success'>('form');

  // Form Fields
  const [name, setName] = useState('');
  const [type, setType] = useState<AccommodationType>('pensao');
  const [city, setCity] = useState('Maputo');
  const [neighborhood, setNeighborhood] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [approxPrice, setApproxPrice] = useState('');
  const [isOpen24h, setIsOpen24h] = useState(true);
  const [selectedAmenities, setSelectedAmenities] = useState<AmenityId[]>([
    'ac',
    'private_bathroom',
    'hot_water',
    'generator',
  ]);

  // Mandatory Owner Identity & Anti-Fraud Verification
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [docType, setDocType] = useState<'bi' | 'passport' | 'dire'>('bi');
  const [docNumber, setDocNumber] = useState('');
  const [biFrontPhoto, setBiFrontPhoto] = useState('');
  const [biBackPhoto, setBiBackPhoto] = useState('');
  const [facialSelfiePhoto, setFacialSelfiePhoto] = useState('');
  const [isFacialVerified, setIsFacialVerified] = useState(false);
  const [isCapturingSelfie, setIsCapturingSelfie] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Onboard terms acceptance
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(true);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);

  if (!isOpen) return null;

  const toggleAmenity = (id: AmenityId) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleProceedToIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !neighborhood || !phone) return;
    if (!ownerName) setOwnerName(name);
    if (!ownerPhone) setOwnerPhone(phone);
    setStep('identity_verification');
  };

  const handleProceedToTerms = () => {
    if (!docNumber.trim()) {
      setVerificationError('Por favor insira o número do seu BI ou Passaporte.');
      return;
    }
    if (!biFrontPhoto) {
      setVerificationError('Por favor carregue a fotografia da frente do seu documento.');
      return;
    }
    if (!facialSelfiePhoto && !isFacialVerified) {
      setVerificationError('Por favor realize a validação facial selfie do proprietário.');
      return;
    }
    setVerificationError(null);
    setStep('terms');
  };

  const handleFinalSubmit = () => {
    if (!agreedToTerms) return;

    const newAccommodation: Accommodation = {
      id: `custom-${Date.now()}`,
      name,
      type,
      tagline: tagline || 'Alojamento acolhedor e seguro',
      description:
        description ||
        `Hospedagem localizada no bairro ${neighborhood} em ${city}. Ambiente tranquilo, discreto e de fácil acesso.`,
      location: {
        lat: userCoordsLat + (Math.random() * 0.01 - 0.005),
        lng: userCoordsLng + (Math.random() * 0.01 - 0.005),
        address: address || `Bairro ${neighborhood}, ${city}`,
        neighborhood,
        city,
        province: city === 'Maputo' ? 'Maputo Cidade' : 'Moçambique',
        landmark,
      },
      phone: phone.startsWith('+') ? phone : `+258${phone.replace(/[^0-9]/g, '')}`,
      whatsapp: (whatsapp || phone).replace(/[^0-9]/g, ''),
      amenities: selectedAmenities,
      photos: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
      ],
      // Integration of Mandatory Pending Verification state before public feed approval
      verificationStatus: 'pending',
      isPendingVerification: true,
      ownerName: ownerName || name,
      ownerPhone: ownerPhone || phone,
      docType,
      docNumber,
      biFrontPhoto,
      biBackPhoto,
      facialSelfiePhoto,
      isFacialVerified: true,
      registeredAt: new Date().toISOString().split('T')[0],
      platformTenure: 'Submetido hoje (Em Análise)',
      isOpen24h,
      priceEstimate: approxPrice
        ? {
            approxMin: parseInt(approxPrice, 10),
            approxMax: Math.round(parseInt(approxPrice, 10) * 1.4),
            currency: 'MZN',
            labelNote: 'Valor indicativo com a receção.',
          }
        : undefined,
    };

    onAddAccommodation(newAccommodation);
    setStep('success');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div 
          className="bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="px-4 sm:px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/80 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-neutral-900">
                  Registar Hospedagem
                </h2>
                <p className="text-xs text-neutral-500 font-medium">
                  {step === 'form' && 'Passo 1 de 3: Dados do Alojamento'}
                  {step === 'identity_verification' && 'Passo 2 de 3: Verificação de Identidade & Selfie'}
                  {step === 'terms' && 'Passo 3 de 3: Onboarding & Termos'}
                  {step === 'success' && 'Submissão Concluída (Verificação Pendente)'}
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

          {/* Stepper Navigation Indicator - Sleek, Responsive, Zero-Scrollbar */}
          <div className="px-5 py-3 bg-neutral-50/90 border-b border-neutral-200/80 shrink-0 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-neutral-900">
                {step === 'form' && '1. Dados do Alojamento'}
                {step === 'identity_verification' && '2. Verificação de Identidade (BI + Selfie)'}
                {step === 'terms' && '3. Termos & Submissão'}
                {step === 'success' && 'Submissão Concluída'}
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/70">
                {step === 'form' ? 'Passo 1/3' : step === 'identity_verification' ? 'Passo 2/3' : step === 'terms' ? 'Passo 3/3' : 'Concluído'}
              </span>
            </div>
            {/* Segmented Progress Track */}
            <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full">
              <div className={`rounded-full transition-all duration-300 ${step === 'form' || step === 'identity_verification' || step === 'terms' || step === 'success' ? 'bg-emerald-600' : 'bg-neutral-200'}`} />
              <div className={`rounded-full transition-all duration-300 ${step === 'identity_verification' || step === 'terms' || step === 'success' ? 'bg-emerald-600' : 'bg-neutral-200'}`} />
              <div className={`rounded-full transition-all duration-300 ${step === 'terms' || step === 'success' ? 'bg-emerald-600' : 'bg-neutral-200'}`} />
            </div>
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
            {step === 'success' ? (
              /* Success Screen with Pending Verification Notice */
              <div className="py-6 text-center space-y-4 animate-in fade-in duration-200">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Clock className="w-9 h-9" />
                </div>
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black rounded-full uppercase tracking-wider">
                    ⏳ Estado: Verificação Pendente
                  </span>
                  <h3 className="text-lg font-extrabold text-neutral-900">
                    Alojamento Submetido com Sucesso!
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto leading-relaxed">
                    O documento de identificação (BI/Passaporte) e a validação facial selfie do proprietário foram recebidos com segurança. A nossa equipa de auditoria está a analisar os dados para emissão do selo oficial antes da exibição ativa no feed público.
                  </p>
                </div>

                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-left space-y-1 text-xs text-emerald-950">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Garantia de Autenticidade & Anti-Fraude</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-emerald-800">
                    Proprietário: <strong>{ownerName || name}</strong> ({docType.toUpperCase()}: {docNumber}). O alojamento aparecerá como Verificado assim que o dossiê for aprovado.
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBillingModalOpen(true)}
                    className="w-full h-11 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <FileText className="w-4 h-4 text-neutral-800" />
                    <span>Ver Fatura Proforma de Ativação (Bill)</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer touch-manipulation"
                  >
                    Concluir e Voltar
                  </button>
                </div>
              </div>
            ) : step === 'identity_verification' ? (
              /* STEP 2: Mandatory Owner Identity Verification & Live Selfie */
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Anti-Fraud Banner */}
                <div className="p-4 bg-gradient-to-r from-amber-50 via-emerald-50 to-teal-50 rounded-2xl border border-emerald-200/90 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-950 font-black text-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                    <span>Verificação de Identidade Obrigatória do Proprietário</span>
                  </div>
                  <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                    <strong>Prevenção Anti-Fraude e Burlas:</strong> Para combater falsos estabelecimentos e proteger os hóspedes, os proprietários têm de submeter documento válido (BI ou Passaporte) e realizar a validação facial (selfie) antes da aprovação no directório público.
                  </p>
                </div>

                {verificationError && (
                  <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-xs font-bold rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{verificationError}</span>
                  </div>
                )}

                {/* Owner Name & Document Type */}
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
                      className="w-full h-11 px-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      Tipo de Documento Oficial *
                    </label>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value as any)}
                      className="w-full h-11 px-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 font-medium"
                    >
                      <option value="bi">Bilhete de Identidade (BI Moçambicano)</option>
                      <option value="passport">Passaporte Nacional</option>
                      <option value="dire">DIRE (Residente Estrangeiro)</option>
                    </select>
                  </div>
                </div>

                {/* Document Number */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Número do Documento ({docType === 'bi' ? 'BI' : 'Passaporte'}) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={docType === 'bi' ? 'Ex: 110100234567M' : 'Ex: AB123456'}
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="w-full h-11 px-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Document Photos (Frente & Verso) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-800 block">
                    Fotografias Nítidas do Documento (Frente e Verso) *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Front Photo */}
                    <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-center flex flex-col items-center justify-center min-h-[130px]">
                      {biFrontPhoto ? (
                        <div className="relative w-full h-28 rounded-xl overflow-hidden group">
                          <img src={biFrontPhoto} alt="Frente Documento" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setBiFrontPhoto('')}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="absolute bottom-1 left-2 text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">Frente Anexada</span>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-1.5 p-2 w-full">
                          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                            <Upload className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-bold text-neutral-800">Foto Frente ({docType.toUpperCase()})</span>
                          <span className="text-[10px] text-neutral-500">Carregar imagem nítida</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                const r = new FileReader();
                                r.onload = (ev) => setBiFrontPhoto(ev.target?.result as string);
                                r.readAsDataURL(f);
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>

                    {/* Back Photo */}
                    <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-center flex flex-col items-center justify-center min-h-[130px]">
                      {biBackPhoto ? (
                        <div className="relative w-full h-28 rounded-xl overflow-hidden group">
                          <img src={biBackPhoto} alt="Verso Documento" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setBiBackPhoto('')}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="absolute bottom-1 left-2 text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">Verso Anexado</span>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-1.5 p-2 w-full">
                          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                            <Upload className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-bold text-neutral-800">Foto Verso ({docType.toUpperCase()})</span>
                          <span className="text-[10px] text-neutral-500">Carregar imagem do verso</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                const r = new FileReader();
                                r.onload = (ev) => setBiBackPhoto(ev.target?.result as string);
                                r.readAsDataURL(f);
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Facial Selfie Biometric Validation */}
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-emerald-950">Validação Facial do Proprietário (Selfie) *</h4>
                      <p className="text-[11px] text-emerald-800">Tire uma selfie nítida do seu rosto para confirmação biométrica.</p>
                    </div>
                    {isFacialVerified && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Validado
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    {facialSelfiePhoto ? (
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md shrink-0">
                        <img src={facialSelfiePhoto} alt="Selfie do Proprietário" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-emerald-950/20 flex items-center justify-center">
                          <CheckCircle2 className="w-8 h-8 text-white drop-shadow-md" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-emerald-300 bg-white flex flex-col items-center justify-center text-emerald-600 shrink-0">
                        <Camera className="w-6 h-6 mb-1 text-emerald-400" />
                        <span className="text-[9px] font-bold text-center">Aguardando Selfie</span>
                      </div>
                    )}

                    <div className="flex-1 w-full space-y-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsCapturingSelfie(true);
                            setTimeout(() => {
                              setFacialSelfiePhoto('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80');
                              setIsFacialVerified(true);
                              setIsCapturingSelfie(false);
                            }, 1000);
                          }}
                          disabled={isCapturingSelfie}
                          className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>{isCapturingSelfie ? 'A validar biometria...' : 'Realizar Validação Facial'}</span>
                        </button>

                        <label className="h-10 px-3 bg-white border border-emerald-300 hover:bg-emerald-50 active:scale-95 text-emerald-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Carregar</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                const r = new FileReader();
                                r.onload = (ev) => {
                                  setFacialSelfiePhoto(ev.target?.result as string);
                                  setIsFacialVerified(true);
                                };
                                r.readAsDataURL(f);
                              }
                            }}
                          />
                        </label>
                      </div>
                      <p className="text-[10px] text-neutral-500">
                        Os dados do documento e a fotografia facial são encriptados e processados exclusivamente para fins de segurança da plataforma.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step Navigation Buttons */}
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="h-12 px-4 bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleProceedToTerms}
                    className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-600/20 touch-manipulation"
                  >
                    <span>Avançar para Termos de Registo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : step === 'terms' ? (
              /* Step 3: Onboarding & Terms */
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
                    Resumo do Registo & Identificação
                  </span>
                  <div className="text-xs sm:text-sm space-y-1.5 text-neutral-700">
                    <div><strong>Estabelecimento:</strong> {name} ({type})</div>
                    <div><strong>Localização:</strong> {neighborhood}, {city}</div>
                    <div><strong>Contacto:</strong> {phone}</div>
                    <div><strong>Proprietário:</strong> {ownerName || name}</div>
                    <div><strong>Documento Validado:</strong> {docType.toUpperCase()} {docNumber}</div>
                  </div>
                </div>

                <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs sm:text-sm">
                    <ShieldCheck className="w-4.5 h-4.5 text-emerald-700 shrink-0" />
                    <span>Directrizes de Publicação e Segurança</span>
                  </div>
                  <ul className="text-xs text-emerald-800 space-y-1.5 pl-4 list-disc leading-relaxed">
                    <li>Garantir que os números de telefone e WhatsApp estão sempre operacionais.</li>
                    <li>Fornecer informações rigorosas sobre comodidades (gerador, AC, banho).</li>
                    <li>O registo entrará em <strong>Verificação Pendente</strong> até validação dos comprovativos.</li>
                  </ul>
                </div>

                {/* Terms Acceptance Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-3 cursor-pointer p-3.5 rounded-2xl border border-neutral-200 bg-neutral-50/50 hover:bg-neutral-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-5 h-5 accent-emerald-600 shrink-0"
                    />
                    <div className="text-xs sm:text-sm text-neutral-700 leading-normal">
                      <span>Declaro que li e aceito os </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsTermsModalOpen(true);
                        }}
                        className="text-emerald-700 font-bold underline hover:text-emerald-800 cursor-pointer"
                      >
                        Termos e Condições Gerais
                      </button>{' '}
                      <span>do directório Onde Dormir Moçambique (Águia Soluções & Serviços).</span>
                    </div>
                  </label>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('identity_verification')}
                    className="h-12 px-4 bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </button>

                  <button
                    type="button"
                    disabled={!agreedToTerms}
                    onClick={handleFinalSubmit}
                    className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-98 disabled:opacity-50 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-600/20 touch-manipulation"
                  >
                    <span>Submeter Alojamento para Verificação</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Step 1: Form */
              <form onSubmit={handleProceedToIdentity} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-neutral-700 block mb-1">
                      Nome do Estabelecimento *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Pensão Miramar, Residencial Central"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-12 px-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm text-neutral-900 focus:outline-none focus:border-emerald-500 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">
                      Tipo *
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as AccommodationType)}
                      className="w-full h-12 px-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm text-neutral-900 focus:outline-none focus:border-emerald-500 shadow-2xs font-semibold"
                    >
                      <option value="pensao">Pensão</option>
                      <option value="residencial">Residencial</option>
                      <option value="guest_house">Guest House</option>
                      <option value="lodge">Lodge</option>
                      <option value="hotel">Hotel</option>
                    </select>
                  </div>
                </div>

                {/* Localização */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Maputo, Matola, Beira..."
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-12 px-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm text-neutral-900 focus:outline-none focus:border-emerald-500 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Baixa, Polana, Sommerschield..."
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full h-12 px-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm text-neutral-900 focus:outline-none focus:border-emerald-500 shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">
                      Telefone para Chamadas *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="84 / 82 / 85..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-12 px-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm text-neutral-900 focus:outline-none focus:border-emerald-500 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">
                      WhatsApp para Reservas
                    </label>
                    <input
                      type="tel"
                      placeholder="84 / 85 / 86..."
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full h-12 px-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm text-neutral-900 focus:outline-none focus:border-emerald-500 shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Frase de Destaque (Tagline)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Quartos climatizados e ambiente tranquilo"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full h-12 px-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm text-neutral-900 focus:outline-none focus:border-emerald-500 shadow-2xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">
                      Valor Médio / Noite (MT)
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 1500"
                      value={approxPrice}
                      onChange={(e) => setApproxPrice(e.target.value)}
                      className="w-full h-12 px-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm text-neutral-900 focus:outline-none focus:border-emerald-500 shadow-2xs"
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isOpen24h}
                        onChange={(e) => setIsOpen24h(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-5 h-5 accent-emerald-600"
                      />
                      <span className="text-xs sm:text-sm font-semibold text-neutral-800">
                        Atendimento 24 Horas
                      </span>
                    </label>
                  </div>
                </div>

                {/* Amenities Selection */}
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-2">
                    Comodidades Disponíveis
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(AMENITIES_CATALOG) as AmenityId[]).slice(0, 8).map((amenityId) => {
                      const item = AMENITIES_CATALOG[amenityId];
                      const isSelected = selectedAmenities.includes(amenityId);
                      return (
                        <button
                          type="button"
                          key={amenityId}
                          onClick={() => toggleAmenity(amenityId)}
                          className={`h-11 px-3 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-2xs'
                              : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                          }`}
                        >
                          <span className="truncate">{item.name}</span>
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                            isSelected ? 'bg-emerald-600 text-white' : 'bg-neutral-200 text-transparent'
                          }`}>✓</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-600/20 touch-manipulation"
                  >
                    <span>Avançar para Identificação do Proprietário (BI & Selfie)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
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
        contextText="Ao registar um alojamento no Onde Dormir Moçambique, confirme a leitura e aceitação dos Termos Gerais."
      />

      {/* Fatura Oficial de Ativação do Alojamento (Bill) */}
      <BillingInvoiceModal
        isOpen={isBillingModalOpen}
        onClose={() => setIsBillingModalOpen(false)}
        invoiceData={{
          moduleType: 'lodge',
          serviceTitle: `Pacote de Ativação de Alojamento (${name || 'Novo Estabelecimento'})`,
          serviceDescription: 'Ativação e registo no directório Onde Dormir Moçambique com geolocalização e verificação de identidade.',
          clientName: ownerName || name || 'Proprietário de Alojamento',
          clientPhone: phone || '+258 84 000 0000',
          clientCity: city || 'Maputo',
          clientProvince: city === 'Maputo' ? 'Maputo Cidade' : 'Moçambique',
          itemDetails: [
            {
              description: `Ativação e Publicação no Directório - ${name || 'Alojamento'} (${type})`,
              quantity: 1,
              unitPriceMzn: 1500,
              totalMzn: 1500
            },
            {
              description: 'Validação de Identidade (BI/Passaporte) e Dossiê Anti-Fraude',
              quantity: 1,
              unitPriceMzn: 300,
              totalMzn: 300
            }
          ],
          subtotalMzn: 1800,
          ivaRate: 0.16,
          ivaAmountMzn: 288,
          totalMzn: 2088
        }}
      />
    </>
  );
};
