import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Phone, 
  MessageCircle, 
  Search, 
  Filter, 
  X, 
  Languages, 
  Award, 
  Calendar, 
  Plus, 
  Share2, 
  ChevronDown, 
  ArrowLeft, 
  ShieldCheck, 
  Camera, 
  FileCheck
} from 'lucide-react';
import { TourGuide, UserLocationState } from '../types';
import { INITIAL_TOUR_GUIDES } from '../data/tourGuides';
import { BiometricVerificationModal, VerificationDossier } from './BiometricVerificationModal';
import { MOZ_PROVINCES_LIST } from './ExploreTab';
import { PackagesTimeIndicator } from './PackagesTimeIndicator';

interface TourGuidesTabProps {
  onBackToHome?: () => void;
  userLocation?: UserLocationState;
  onOpenLocationModal?: () => void;
  onSelectProvince?: (prov: string) => void;
  onSelectAllMozambique?: () => void;
}

export const TourGuidesTab: React.FC<TourGuidesTabProps> = ({ 
  onBackToHome,
  userLocation,
  onOpenLocationModal,
  onSelectProvince,
  onSelectAllMozambique,
}) => {
  const [guides, setGuides] = useState<TourGuide[]>(() => {
    const saved = localStorage.getItem('onde_dormir_custom_guides');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...parsed, ...INITIAL_TOUR_GUIDES];
      } catch (e) {
        return INITIAL_TOUR_GUIDES;
      }
    }
    return INITIAL_TOUR_GUIDES;
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
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedGuide, setSelectedGuide] = useState<TourGuide | null>(null);
  
  // Verification & Registration Modals
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [verifiedDossier, setVerifiedDossier] = useState<VerificationDossier | null>(() => {
    const saved = localStorage.getItem('onde_dormir_user_verification_dossier');
    return saved ? JSON.parse(saved) : null;
  });

  // Available specialties
  const specialtiesList = [
    'City Tour Histórico',
    'Safari Vida Selvagem',
    'Dhow Safari',
    'Património Mundial UNESCO',
    'Snorkeling com Tubarão-Baleia',
    'Arquipélago de Bazaruto',
    'Mafalala Cultural',
    'Trilhos no Monte Gorongosa'
  ];

  const citiesList = useMemo(() => {
    let list = guides;
    if (selectedProvince !== 'all') {
      const selProv = selectedProvince.toLowerCase();
      list = list.filter((g: TourGuide) => {
        const guideProv = (g.province || '').toLowerCase();
        if (selProv === 'maputo cidade' || selProv === 'maputo província') {
          return guideProv === selProv || guideProv === 'maputo';
        }
        return guideProv.includes(selProv) || selProv.includes(guideProv);
      });
    }
    return Array.from(new Set(list.map((g: TourGuide) => g.city))).filter((c): c is string => Boolean(c));
  }, [guides, selectedProvince]);

  // Reset selectedCity if not in citiesList
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

  // Filtered guides
  const filteredGuides = useMemo(() => {
    return guides.filter((g) => {
      // Province filter - strict isolation
      if (selectedProvince !== 'all') {
        const guideProv = (g.province || '').toLowerCase();
        const selProv = selectedProvince.toLowerCase();
        if (selProv === 'maputo cidade' || selProv === 'maputo província') {
          if (guideProv !== selProv && guideProv !== 'maputo') return false;
        } else if (!guideProv.includes(selProv) && !selProv.includes(guideProv)) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = g.name.toLowerCase().includes(q);
        const matchCity = g.city.toLowerCase().includes(q);
        const matchBio = g.bio.toLowerCase().includes(q);
        const matchSpec = g.specialties.some((s) => s.toLowerCase().includes(q));
        if (!matchName && !matchCity && !matchBio && !matchSpec) return false;
      }

      if (selectedCity !== 'all' && g.city !== selectedCity) {
        return false;
      }

      if (selectedSpecialty !== 'all' && !g.specialties.includes(selectedSpecialty)) {
        return false;
      }

      return true;
    });
  }, [guides, selectedProvince, searchQuery, selectedCity, selectedSpecialty]);

  const handleVerificationComplete = (dossier: VerificationDossier) => {
    setVerifiedDossier(dossier);
    
    // Register the guide with the verified biometric data
    const newG: TourGuide = {
      id: `guide-verified-${Date.now()}`,
      name: dossier.fullName,
      age: 28,
      photo: dossier.biometricSelfiePhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      city: dossier.city,
      province: dossier.province,
      specialties: ['Passeios Personalizados & Ecoturismo', 'City Tour Histórico'],
      languages: ['Português', 'Inglês', 'Línguas Locais'],
      experienceYears: 4,
      phone: dossier.phone,
      whatsapp: dossier.whatsapp.replace(/\D/g, ''),
      verified: true,
      rating: 5.0,
      reviewsCount: 1,
      bio: `Guia turístico credenciado e verificado com BI (${dossier.biNumber.slice(0, 4)}****). Atendimento seguro e profissional para turistas em ${dossier.city}.`,
      ratePerDay: 2500,
      featured: true
    };

    setGuides((prev) => [newG, ...prev]);
    const custom = JSON.parse(localStorage.getItem('onde_dormir_custom_guides') || '[]');
    localStorage.setItem('onde_dormir_custom_guides', JSON.stringify([newG, ...custom]));
  };

  return (
    <div className="pb-32 pt-2 sm:pt-4 max-w-5xl mx-auto px-3.5 sm:px-4 space-y-3.5">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-4 sm:p-5 rounded-3xl shadow-lg relative overflow-hidden">
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
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  Guias Turísticos
                </h1>
                <span className="text-[10px] uppercase font-black tracking-wider bg-amber-400 text-zinc-950 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <ShieldCheck className="w-3 h-3" />
                  Verificados
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium">
                Explore com quem conhece o caminho.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsVerificationOpen(true)}
            className="w-full sm:w-auto h-10 px-4 bg-white text-emerald-900 hover:bg-emerald-50 active:scale-95 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Registar como Guia</span>
          </button>
        </div>
      </div>

      {/* Indicador de Tempo no Pacote Guias Turísticos */}
      <PackagesTimeIndicator
        moduleName="Guias Turísticos"
        packageTitle="Pacote Guia Turístico & Excursões de Moçambique"
        variant="banner"
      />

      {/* Security Status Line */}
      <div className="p-2.5 sm:p-3 rounded-2xl bg-emerald-50 border border-emerald-200/90 flex items-center gap-2 text-xs text-emerald-950">
        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
        <span className="leading-tight">
          <strong>Proteção aos turistas:</strong> Guias validados com BI e reconhecimento facial para excursões seguras.
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
              placeholder="Pesquisar guia por nome, safari, cidade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 sm:h-11 pl-9 pr-8 bg-neutral-50 rounded-xl text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-neutral-200"
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
            <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full h-10 sm:h-11 pl-8 pr-7 bg-neutral-50 rounded-xl text-xs sm:text-sm font-semibold text-neutral-800 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
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
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
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
          <div className="flex items-center justify-between bg-emerald-50 text-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-semibold">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">Apenas guias em: <strong>{selectedProvince}</strong> ({filteredGuides.length})</span>
            </div>
            <button 
              onClick={() => handleProvinceClick('all')}
              className="text-[11px] text-emerald-800 font-bold underline hover:text-emerald-950 shrink-0 ml-2 cursor-pointer"
            >
              Ver Todas as Províncias
            </button>
          </div>
        )}

        {/* Specialty Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
          <button
            onClick={() => setSelectedSpecialty('all')}
            className={`h-8 px-3 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedSpecialty === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Todas
          </button>
          {specialtiesList.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(selectedSpecialty === spec ? 'all' : spec)}
              className={`h-8 px-2.5 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer border ${
                selectedSpecialty === spec
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:bg-emerald-50'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Guides List Header */}
      <div className="text-xs text-neutral-600 px-1">
        <strong className="text-neutral-900 font-bold">{filteredGuides.length}</strong> guias credenciados
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        {filteredGuides.map((guide) => (
          <div
            key={guide.id}
            onClick={() => setSelectedGuide(guide)}
            className="bg-white rounded-3xl border border-neutral-200/90 p-3.5 sm:p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start gap-3">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-neutral-200 shrink-0 bg-neutral-900 shadow-2xs">
                <img
                  src={guide.photo}
                  alt={guide.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                {guide.age && (
                  <span className="absolute bottom-1 right-1 bg-black/80 backdrop-blur-xs text-white text-[11px] font-black px-1.5 py-0.5 rounded-md leading-none shadow-sm border border-white/20">
                    {guide.age}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="font-extrabold text-base text-neutral-900 truncate">
                    {guide.name}{guide.age ? `, ${guide.age}` : ''}
                  </h3>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verificado
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-neutral-600 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{guide.city}, {guide.province}</span>
                </div>

                <div className="flex items-center gap-2 mt-1.5 text-xs">
                  <div className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{guide.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-neutral-400">•</span>
                  <span className="text-neutral-600 font-medium">
                    {guide.experienceYears} anos exp.
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {guide.specialties.slice(0, 2).map((spec, i) => (
                <span
                  key={i}
                  className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-0.5 rounded-md"
                >
                  {spec}
                </span>
              ))}
            </div>

            <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
              {guide.bio}
            </p>

            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
              <div>
                <span className="font-black text-sm text-neutral-900">
                  {guide.ratePerDay?.toLocaleString('pt-MZ')} MT<span className="text-[11px] text-neutral-400 font-normal">/dia</span>
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <a
                  href={`https://wa.me/${guide.whatsapp}?text=${encodeURIComponent(
                    `Olá ${guide.name}! Encontrei o seu perfil no Onde Dormir Moçambique e gostaria de agendar uma excursão em ${guide.city}.`
                  )}`}
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`tel:${guide.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="h-9 px-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Ligar</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Guide Detail Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200 relative animate-in fade-in zoom-in-95 duration-150 my-auto">
            <div className="relative aspect-4/3 w-full bg-neutral-900">
              <img
                src={selectedGuide.photo}
                alt={selectedGuide.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <button
                onClick={() => setSelectedGuide(null)}
                className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center cursor-pointer hover:bg-black/70"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white space-y-0.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black">
                    {selectedGuide.name}{selectedGuide.age ? `, ${selectedGuide.age} anos` : ''}
                  </h2>
                  <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-lg">
                    <ShieldCheck className="w-3 h-3" /> Verificado
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-neutral-200">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{selectedGuide.city}, {selectedGuide.province}</span>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3 max-h-[50vh] overflow-y-auto">
              {/* Quick stats pills including Age */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                {selectedGuide.age && (
                  <div className="font-bold text-neutral-800 bg-neutral-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <span>Idade:</span>
                    <strong className="text-neutral-900">{selectedGuide.age} anos</strong>
                  </div>
                )}
                <div className="font-bold text-neutral-800 bg-neutral-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <span>Experiência:</span>
                  <strong className="text-neutral-900">{selectedGuide.experienceYears} anos</strong>
                </div>
                <div className="font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{selectedGuide.rating.toFixed(1)} ({selectedGuide.reviewsCount} avaliações)</span>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>Identidade Confirmada:</strong> Guia verificado com BI e reconhecimento facial.
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Sobre o Guia
                </h4>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                  {selectedGuide.bio}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Especialidades
                </h4>
                <div className="flex flex-wrap gap-1">
                  {selectedGuide.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="text-xs font-bold bg-emerald-100/70 text-emerald-900 px-2.5 py-0.5 rounded-lg"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3.5 border-t border-neutral-100 bg-neutral-50 flex items-center gap-2">
              <a
                href={`tel:${selectedGuide.phone}`}
                className="h-11 px-3.5 bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Ligar</span>
              </a>

              <a
                href={`https://wa.me/${selectedGuide.whatsapp}?text=${encodeURIComponent(
                  `Olá ${selectedGuide.name}! Encontrei o seu perfil no Onde Dormir Moçambique e gostaria de agendar uma excursão em ${selectedGuide.city}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contactar no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Biometric KYC Modal */}
      <BiometricVerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        purpose="tourguide"
        onVerificationComplete={handleVerificationComplete}
      />
    </div>
  );
};
