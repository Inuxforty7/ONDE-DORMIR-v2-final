import React, { useState } from 'react';
import { X, Building2, CheckCircle2, ShieldCheck, Plus, ArrowRight, ArrowLeft, FileText } from 'lucide-react';
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
  const [step, setStep] = useState<'form' | 'terms' | 'success'>('form');

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

  // Onboard terms acceptance
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);

  if (!isOpen) return null;

  const toggleAmenity = (id: AmenityId) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleProceedToTerms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !neighborhood || !phone) return;
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
      verificationStatus: 'pending',
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
          className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="px-4 sm:px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-neutral-900">
                  Registar Hospedagem
                </h2>
                <p className="text-xs text-neutral-500 font-medium">
                  {step === 'form' && 'Passo 1 de 2: Dados do Alojamento'}
                  {step === 'terms' && 'Passo 2 de 2: Onboarding & Termos'}
                  {step === 'success' && 'Concluído com Sucesso'}
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

          {/* Body Content */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
            {step === 'success' ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-neutral-900">
                    Hospedagem Registada com Sucesso!
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 max-w-xs mx-auto leading-relaxed">
                    O seu estabelecimento já está visível no directório com contacto directo por WhatsApp e chamada telefónica.
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBillingModalOpen(true)}
                    className="w-full h-11 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <FileText className="w-4 h-4 text-neutral-800" />
                    <span>Ver Fatura Oficial de Ativação (Bill)</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer touch-manipulation"
                  >
                    Ver no Directório
                  </button>
                </div>
              </div>
            ) : step === 'terms' ? (
              /* Step 2: Onboarding & Terms */
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
                    Resumo do Registo
                  </span>
                  <div className="text-xs sm:text-sm space-y-1.5 text-neutral-700">
                    <div><strong>Nome:</strong> {name} ({type})</div>
                    <div><strong>Localização:</strong> {neighborhood}, {city}</div>
                    <div><strong>Contacto:</strong> {phone}</div>
                    {landmark && <div><strong>Referência:</strong> {landmark}</div>}
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
                    <li>Negociação de tarifas é feita directamente entre o hóspede e o anfitrião.</li>
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
                      <span>Li e concordo com os </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsTermsModalOpen(true);
                        }}
                        className="text-emerald-700 font-bold underline hover:text-emerald-800 cursor-pointer"
                      >
                        Termos e Condições de Uso
                      </button>{' '}
                      <span>do directório Onde Dormir Moçambique.</span>
                    </div>
                  </label>
                </div>

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
                    disabled={!agreedToTerms}
                    onClick={handleFinalSubmit}
                    className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-98 disabled:opacity-50 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-600/20 touch-manipulation"
                  >
                    <span>Confirmar e Publicar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Step 1: Form */
              <form onSubmit={handleProceedToTerms} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">
                      Tipo *
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as AccommodationType)}
                      className="w-full h-12 px-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs sm:text-sm font-semibold"
                    >
                      <option value="pensao">Pensão</option>
                      <option value="guest_house">Guest House</option>
                      <option value="residencial">Residencial</option>
                      <option value="hotel">Hotel</option>
                      <option value="lodge">Lodge</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-neutral-700 block mb-1">
                      Nome da Hospedagem *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Pensão Central"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-12 px-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm text-neutral-900 focus:outline-none focus:border-emerald-500 shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">
                      Cidade *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-12 px-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs sm:text-sm font-semibold"
                    >
                      <option value="Maputo">Maputo</option>
                      <option value="Matola">Matola</option>
                      <option value="Beira">Beira</option>
                      <option value="Vilankulo">Vilankulo</option>
                      <option value="Inhambane">Inhambane</option>
                      <option value="Nampula">Nampula</option>
                      <option value="Pemba">Pemba</option>
                      <option value="Chimoio">Chimoio</option>
                      <option value="Tete">Tete</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Polana Cimento"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full h-12 px-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm text-neutral-900 focus:outline-none focus:border-emerald-500 shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">
                      Endereço / Rua
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Av. 24 de Julho, 1234"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full h-12 px-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm text-neutral-900 focus:outline-none focus:border-emerald-500 shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">
                      Ponto de Referência
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Próximo à paragem..."
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full h-12 px-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm text-neutral-900 focus:outline-none focus:border-emerald-500 shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">
                      Telefone da Recepção *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+258 84 123 4567"
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
                      placeholder="+258 84 123 4567"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full h-12 px-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm text-neutral-900 focus:outline-none focus:border-emerald-500 shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Frase de Destaque
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
                    <span>Avançar para Termos & Condições</span>
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
      />

      {/* Fatura Oficial de Ativação do Alojamento (Bill) */}
      <BillingInvoiceModal
        isOpen={isBillingModalOpen}
        onClose={() => setIsBillingModalOpen(false)}
        invoiceData={{
          moduleType: 'lodge',
          serviceTitle: `Pacote de Ativação de Alojamento (${name || 'Novo Estabelecimento'})`,
          serviceDescription: 'Ativação e registo no diretório Onde Dormir Moçambique com geolocalização e contacto direto WhatsApp.',
          clientName: name || 'Proprietário de Alojamento',
          clientPhone: phone || '+258 84 000 0000',
          clientCity: city || 'Maputo',
          clientProvince: city === 'Maputo' ? 'Maputo Cidade' : 'Moçambique',
          itemDetails: [
            {
              description: `Ativação e Publicação no Diretório - ${name || 'Alojamento'} (${type})`,
              quantity: 1,
              unitPriceMzn: 1500,
              totalMzn: 1500
            },
            {
              description: 'Emissão de Selo de Verificação e Dossiê Comercial',
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
