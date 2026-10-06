import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Phone, 
  MessageCircle, 
  Search, 
  SlidersHorizontal, 
  X, 
  Languages, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Clock, 
  Navigation2, 
  Check, 
  ExternalLink, 
  Eye, 
  Sparkles, 
  Waves, 
  Palmtree, 
  Calendar,
  DollarSign
} from 'lucide-react';
import { TourGuide, TourismPlace, TourismExperience, UserLocationState } from '../types';
import { INITIAL_TOUR_GUIDES } from '../data/tourGuides';
import { INITIAL_TOURISM_PLACES, INITIAL_TOURISM_EXPERIENCES } from '../data/tourismData';
import { BiometricVerificationModal, VerificationDossier } from './BiometricVerificationModal';
import { MOZ_PROVINCES_LIST } from './ExploreTab';
import { TermsModal } from './TermsModal';
import { getPlatformTenureText } from '../utils/tenure';
import { contactUnlockService } from '../services/contactUnlockService';
import { BillingInvoiceModal, BillingInvoiceData } from './BillingInvoiceModal';
import { getDirectionsUrl } from '../utils/geo';

const getPlaceCategoryShort = (place: TourismPlace) => {
  if (place.category === 'praias_ilhas') {
    const lower = place.name.toLowerCase();
    if (lower.includes('ilha')) return 'Ilha';
    if (lower.includes('baía') || lower.includes('baia')) return 'Baía';
    return 'Praia';
  }
  if (place.category === 'parques_natureza') return 'Parque';
  if (place.category === 'patrimonio_historico') return 'Património Histórico';
  if (place.category === 'cultura_museus') return 'Cultura & Museu';
  if (place.category === 'atracoes_naturais') return 'Atração Natural';
  return place.categoryLabel || 'Atração';
};

const getPlaceHighlightsShort = (place: TourismPlace) => {
  if (!place.highlights || place.highlights.length === 0) return '';
  return place.highlights.slice(0, 3).join(' · ');
};

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
  // Navigation Sections: Lugares | Experiências | Guias
  const [activeSection, setActiveSection] = useState<'lugares' | 'experiencias' | 'guias'>('lugares');

  // Guides State with Local Storage support
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

  const places = INITIAL_TOURISM_PLACES;
  const experiences = INITIAL_TOURISM_EXPERIENCES;

  // Search & Filter States
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
  const [selectedPlaceCategory, setSelectedPlaceCategory] = useState<string>('all');
  const [selectedExpCategory, setSelectedExpCategory] = useState<string>('all');
  const [selectedGuideSpecialty, setSelectedGuideSpecialty] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [highRatingOnly, setHighRatingOnly] = useState(false);

  // Detail Modal States
  const [selectedPlace, setSelectedPlace] = useState<TourismPlace | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<TourismExperience | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<TourGuide | null>(null);
  
  // Registration Modals (Preserved)
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState<BillingInvoiceData | null>(null);
  const [verifiedDossier, setVerifiedDossier] = useState<VerificationDossier | null>(() => {
    const saved = localStorage.getItem('onde_dormir_user_verification_dossier');
    return saved ? JSON.parse(saved) : null;
  });

  const [expandedSections, setExpandedSections] = useState<{
    about: boolean;
    specialties: boolean;
    verification: boolean;
  }>({
    about: false,
    specialties: false,
    verification: false,
  });

  const toggleSection = (key: 'about' | 'specialties' | 'verification') => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleStartGuideRegistration = () => {
    setIsVerificationOpen(true);
  };

  const handleProvinceClick = (prov: string) => {
    setSelectedProvince(prov);
    if (prov === 'all') {
      if (onSelectAllMozambique) onSelectAllMozambique();
    } else {
      if (onSelectProvince) onSelectProvince(prov);
    }
  };

  const resetFilters = () => {
    setSelectedProvince('all');
    if (onSelectAllMozambique) onSelectAllMozambique();
    setSearchQuery('');
    setSelectedPlaceCategory('all');
    setSelectedExpCategory('all');
    setSelectedGuideSpecialty('all');
    setVerifiedOnly(false);
    setHighRatingOnly(false);
  };

  // 1. Filtered Places
  const filteredPlaces = useMemo(() => {
    return places.filter((p) => {
      // Province filter
      if (selectedProvince !== 'all') {
        const placeProv = (p.province || '').toLowerCase();
        const selProv = selectedProvince.toLowerCase();
        if (selProv === 'maputo cidade' || selProv === 'maputo província') {
          if (placeProv !== selProv && placeProv !== 'maputo') return false;
        } else if (!placeProv.includes(selProv) && !selProv.includes(placeProv)) {
          return false;
        }
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(q);
        const matchCity = p.city.toLowerCase().includes(q);
        const matchDesc = p.shortDescription.toLowerCase().includes(q) || p.fullDescription.toLowerCase().includes(q);
        const matchHighlights = p.highlights.some((h) => h.toLowerCase().includes(q));
        const matchCat = p.categoryLabel.toLowerCase().includes(q);
        if (!matchName && !matchCity && !matchDesc && !matchHighlights && !matchCat) return false;
      }

      // Category
      if (selectedPlaceCategory !== 'all' && p.category !== selectedPlaceCategory) {
        return false;
      }

      // Verified
      if (verifiedOnly && !p.verified) {
        return false;
      }

      // High Rating
      if (highRatingOnly && p.rating < 4.8) {
        return false;
      }

      return true;
    });
  }, [places, selectedProvince, searchQuery, selectedPlaceCategory, verifiedOnly, highRatingOnly]);

  // 2. Filtered Experiences
  const filteredExperiences = useMemo(() => {
    return experiences.filter((exp) => {
      // Province filter
      if (selectedProvince !== 'all') {
        const expProv = (exp.province || '').toLowerCase();
        const selProv = selectedProvince.toLowerCase();
        if (selProv === 'maputo cidade' || selProv === 'maputo província') {
          if (expProv !== selProv && expProv !== 'maputo') return false;
        } else if (!expProv.includes(selProv) && !selProv.includes(expProv)) {
          return false;
        }
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = exp.title.toLowerCase().includes(q);
        const matchPlace = exp.placeName.toLowerCase().includes(q);
        const matchCity = exp.city.toLowerCase().includes(q);
        const matchDesc = exp.shortDescription.toLowerCase().includes(q);
        const matchGuide = exp.guideName ? exp.guideName.toLowerCase().includes(q) : false;
        if (!matchTitle && !matchPlace && !matchCity && !matchDesc && !matchGuide) return false;
      }

      // Category
      if (selectedExpCategory !== 'all' && exp.category !== selectedExpCategory) {
        return false;
      }

      // Verified
      if (verifiedOnly && !exp.verified) {
        return false;
      }

      // High Rating
      if (highRatingOnly && exp.rating < 4.8) {
        return false;
      }

      return true;
    });
  }, [experiences, selectedProvince, searchQuery, selectedExpCategory, verifiedOnly, highRatingOnly]);

  // 3. Filtered Guides
  const filteredGuides = useMemo(() => {
    return guides.filter((g) => {
      // Province filter
      if (selectedProvince !== 'all') {
        const guideProv = (g.province || '').toLowerCase();
        const selProv = selectedProvince.toLowerCase();
        if (selProv === 'maputo cidade' || selProv === 'maputo província') {
          if (guideProv !== selProv && guideProv !== 'maputo') return false;
        } else if (!guideProv.includes(selProv) && !selProv.includes(guideProv)) {
          return false;
        }
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = g.name.toLowerCase().includes(q);
        const matchCity = g.city.toLowerCase().includes(q);
        const matchBio = g.bio.toLowerCase().includes(q);
        const matchSpec = g.specialties.some((s) => s.toLowerCase().includes(q));
        if (!matchName && !matchCity && !matchBio && !matchSpec) return false;
      }

      // Specialty
      if (selectedGuideSpecialty !== 'all' && !g.specialties.some(s => s.toLowerCase().includes(selectedGuideSpecialty.toLowerCase()))) {
        return false;
      }

      // Verified
      if (verifiedOnly && !g.verified) {
        return false;
      }

      // High Rating
      if (highRatingOnly && g.rating < 4.8) {
        return false;
      }

      return true;
    });
  }, [guides, selectedProvince, searchQuery, selectedGuideSpecialty, verifiedOnly, highRatingOnly]);

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

    // Prepare Official Billing Invoice
    const invoiceNum = `INV-GT-${Math.floor(100000 + Math.random() * 900000)}`;
    const invData: BillingInvoiceData = {
      invoiceNumber: invoiceNum,
      issueDate: new Date().toLocaleDateString('pt-MZ'),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-MZ'),
      status: 'PAID',
      moduleType: 'general',
      serviceTitle: 'Credenciamento & Ativação de Guia Turístico',
      serviceDescription: `Subscrição Mensal e Credenciamento Profissional (${dossier.fullName})`,
      clientName: `${dossier.fullName} (Guia Turístico)`,
      clientNuitOrBi: dossier.biNumber,
      clientPhone: dossier.phone,
      clientProvince: dossier.province,
      clientCity: dossier.city,
      itemDetails: [
        {
          description: `Ativação no Diretório de Guias Turísticos (${dossier.city})`,
          quantity: 1,
          unitPriceMzn: 1000,
          totalMzn: 1000,
        },
      ],
      subtotalMzn: 1000,
      ivaRate: 0,
      ivaAmountMzn: 0,
      totalMzn: 1000,
      paymentMethod: 'M-Pesa',
      transactionReference: `TX-GT-${Math.floor(10000000 + Math.random() * 90000000)}`,
    };

    setGeneratedInvoice(invData);
    setGuides((prev) => [newG, ...prev]);
    const custom = JSON.parse(localStorage.getItem('onde_dormir_custom_guides') || '[]');
    localStorage.setItem('onde_dormir_custom_guides', JSON.stringify([newG, ...custom]));
    setIsInvoiceOpen(true);
  };

  return (
    <div className="pb-16 sm:pb-20 pt-1 sm:pt-3 max-w-5xl mx-auto px-2.5 sm:px-4 space-y-2.5 sm:space-y-3.5">
      {/* Top Banner: TURISMO MOÇAMBIQUE */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-950 text-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-lg relative overflow-hidden border border-emerald-500/20">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shrink-0">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-2xl font-black tracking-tight leading-none">
                  <span>TURISMO </span>
                  <span className="text-amber-400">MOÇAMBIQUE</span>
                </h1>
                <span className="text-[9.5px] sm:text-[10px] uppercase font-black tracking-wider bg-emerald-500/80 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <ShieldCheck className="w-3 h-3" /> Oficial
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-100 font-medium mt-0.5">
                Explore lugares, experiências e encontre quem o pode guiar.
              </p>
            </div>
          </div>

          <button
            onClick={handleStartGuideRegistration}
            className="w-full sm:w-auto h-9 sm:h-10 px-3.5 bg-white text-emerald-900 hover:bg-emerald-50 active:scale-95 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>+ Registar como Guia</span>
          </button>
        </div>
      </div>

      {/* Sticky Main Search Bar & Quick Segment Tabs */}
      <div className="sticky top-[48px] sm:top-[56px] z-20 bg-white/95 backdrop-blur-md p-2.5 sm:p-3.5 rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-sm space-y-2">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Pesquisar lugar, praia, ilha, experiência ou guia..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-9 pr-8 bg-neutral-50 rounded-xl text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-neutral-200"
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

        {/* 3 Main Segment Tabs: Lugares | Experiências | Guias */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveSection('lugares')}
            className={`h-10 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation ${
              activeSection === 'lugares'
                ? 'bg-white text-emerald-900 shadow-sm border border-neutral-200/80 scale-[1.01]'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>🏖️ Lugares</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeSection === 'lugares' ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'
            }`}>
              {filteredPlaces.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('experiencias')}
            className={`h-10 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation ${
              activeSection === 'experiencias'
                ? 'bg-white text-emerald-900 shadow-sm border border-neutral-200/80 scale-[1.01]'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>🏄 Experiências</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeSection === 'experiencias' ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'
            }`}>
              {filteredExperiences.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('guias')}
            className={`h-10 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation ${
              activeSection === 'guias'
                ? 'bg-white text-emerald-900 shadow-sm border border-neutral-200/80 scale-[1.01]'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>🧭 Guias</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeSection === 'guias' ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'
            }`}>
              {filteredGuides.length}
            </span>
          </button>
        </div>

        {/* Dynamic Filters Row: Província + Categoria Específica */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          {/* Province Selector */}
          <div className="relative">
            <select
              value={selectedProvince}
              onChange={(e) => handleProvinceClick(e.target.value)}
              className="w-full h-9.5 pl-2.5 pr-7 rounded-xl text-xs font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200/80 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer truncate"
            >
              <option value="all">📍 Moçambique (Todas)</option>
              {MOZ_PROVINCES_LIST.map((p) => (
                <option key={p} value={p}>📍 {p}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Contextual Category Selector according to Active Section */}
          <div className="relative">
            {activeSection === 'lugares' ? (
              <select
                value={selectedPlaceCategory}
                onChange={(e) => setSelectedPlaceCategory(e.target.value)}
                className="w-full h-9.5 pl-2.5 pr-7 rounded-xl text-xs font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200/80 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer truncate"
              >
                <option value="all">🌴 Todas as Atrações</option>
                <option value="praias_ilhas">🏖️ Praias & Ilhas</option>
                <option value="parques_natureza">🦁 Parques & Safáris</option>
                <option value="patrimonio_historico">🏰 Património Histórico</option>
                <option value="cultura_museus">🎨 Cultura & Museus</option>
                <option value="atracoes_naturais">🌊 Atrações Naturais</option>
              </select>
            ) : activeSection === 'experiencias' ? (
              <select
                value={selectedExpCategory}
                onChange={(e) => setSelectedExpCategory(e.target.value)}
                className="w-full h-9.5 pl-2.5 pr-7 rounded-xl text-xs font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200/80 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer truncate"
              >
                <option value="all">⚡ Todos os Tipos</option>
                <option value="marinha_mergulho">🤿 Vida Marinha & Dhow</option>
                <option value="safari_fauna">🚙 Safári 4x4 Fauna</option>
                <option value="cultural_historica">🏛️ Rota Histórica & Cultural</option>
              </select>
            ) : (
              <select
                value={selectedGuideSpecialty}
                onChange={(e) => setSelectedGuideSpecialty(e.target.value)}
                className="w-full h-9.5 pl-2.5 pr-7 rounded-xl text-xs font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200/80 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer truncate"
              >
                <option value="all">🧭 Todas as Especialidades</option>
                <option value="Dhow">⛵ Dhow Safari & Ilhas</option>
                <option value="Tubarão">🦈 Tubarão-Baleia & Mergulho</option>
                <option value="Gorongosa">🦁 Gorongosa & Fauna</option>
                <option value="Golfinhos">🐬 Golfinhos</option>
                <option value="UNESCO">🏰 Património UNESCO</option>
                <option value="Mafalala">🏙️ City Tour Histórico</option>
              </select>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Quick Horizontal Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer transition-colors ${
              verifiedOnly
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Apenas Verificados</span>
          </button>

          <button
            onClick={() => setHighRatingOnly(!highRatingOnly)}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer transition-colors ${
              highRatingOnly
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <Star className="w-3 h-3 fill-amber-300" />
            <span>Avaliação 4.8+</span>
          </button>

          {(selectedProvince !== 'all' || searchQuery || verifiedOnly || highRatingOnly) && (
            <button
              onClick={resetFilters}
              className="text-[11px] text-neutral-500 font-bold underline hover:text-neutral-800 ml-auto shrink-0 cursor-pointer"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* SECTION 1: LUGARES */}
      {activeSection === 'lugares' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between px-1 text-xs text-neutral-600">
            <div>
              <strong className="text-neutral-900 font-bold">{filteredPlaces.length}</strong> lugares turísticos encontrados
            </div>
            <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Praias · Parques · Património
            </span>
          </div>

          {filteredPlaces.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 items-stretch">
              {filteredPlaces.map((place) => (
                <div
                  key={place.id}
                  className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group active:scale-[0.99] touch-manipulation"
                >
                  {/* 1. Foto principal */}
                  <div
                    onClick={() => setSelectedPlace(place)}
                    className="relative aspect-16/10 bg-neutral-100 overflow-hidden cursor-pointer shrink-0"
                  >
                    <img
                      src={place.photo}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  {/* Conteúdo do Card */}
                  <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div onClick={() => setSelectedPlace(place)} className="cursor-pointer space-y-1">
                      {/* 2. Nome do lugar */}
                      <h3 className="font-extrabold text-neutral-900 text-base leading-snug group-hover:text-emerald-700 transition-colors line-clamp-1">
                        {place.name}
                      </h3>

                      {/* 3. Categoria · 4. Localização */}
                      <p className="text-xs text-neutral-600 font-medium truncate">
                        {getPlaceCategoryShort(place)} · {place.city || place.province}
                      </p>

                      {/* 5. Avaliação, quando existir */}
                      {place.rating > 0 && (
                        <div className="flex items-center gap-1 text-xs font-bold text-neutral-800 pt-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                          <span>{place.rating.toFixed(1)}</span>
                          {place.reviewsCount > 0 && (
                            <span className="text-neutral-400 font-normal text-[11px]">({place.reviewsCount})</span>
                          )}
                        </div>
                      )}

                      {/* 6. Breve característica principal */}
                      {getPlaceHighlightsShort(place) && (
                        <p className="text-xs text-neutral-500 font-medium line-clamp-1 pt-0.5">
                          {getPlaceHighlightsShort(place)}
                        </p>
                      )}
                    </div>

                    {/* 7. Ver localização / Explorar */}
                    <div className="pt-2 mt-auto border-t border-neutral-100">
                      <button
                        type="button"
                        onClick={() => setSelectedPlace(place)}
                        className="w-full h-10 px-4 bg-neutral-900 hover:bg-neutral-800 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer touch-manipulation"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Explorar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center space-y-3 border border-neutral-200/90 shadow-2xs">
              <Palmtree className="w-12 h-12 text-neutral-300 mx-auto" />
              <h3 className="font-extrabold text-base text-neutral-800">
                Nenhum lugar turístico encontrado
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Tente alterar a província selecionada ou limpar os termos de pesquisa.
              </p>
              <button
                onClick={resetFilters}
                className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: EXPERIÊNCIAS */}
      {activeSection === 'experiencias' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between px-1 text-xs text-neutral-600">
            <div>
              <strong className="text-neutral-900 font-bold">{filteredExperiences.length}</strong> experiências e passeios guiados
            </div>
            <span className="text-[11px] text-cyan-800 font-semibold bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">
              Mergulho · Safári · Roteiros
            </span>
          </div>

          {filteredExperiences.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 items-stretch">
              {filteredExperiences.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group active:scale-[0.99] touch-manipulation"
                >
                  {/* 1. Foto principal */}
                  <div
                    onClick={() => setSelectedExperience(exp)}
                    className="relative aspect-16/10 bg-neutral-100 overflow-hidden cursor-pointer shrink-0"
                  >
                    <img
                      src={exp.photo}
                      alt={exp.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  {/* Conteúdo do Card */}
                  <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div onClick={() => setSelectedExperience(exp)} className="cursor-pointer space-y-1">
                      {/* 2. Nome da experiência */}
                      <h3 className="font-extrabold text-neutral-900 text-base leading-snug group-hover:text-emerald-700 transition-colors line-clamp-1">
                        {exp.title}
                      </h3>

                      {/* 3. Localização */}
                      <div className="flex items-center gap-1 text-xs text-neutral-600 truncate font-medium">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{exp.placeName || exp.city}, {exp.province}</span>
                      </div>

                      {/* 5. Avaliação */}
                      {exp.rating > 0 && (
                        <div className="flex items-center gap-1 text-xs font-bold text-neutral-800 pt-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                          <span>{exp.rating.toFixed(1)}</span>
                          {exp.reviewsCount > 0 && (
                            <span className="text-neutral-400 font-normal text-[11px]">({exp.reviewsCount})</span>
                          )}
                        </div>
                      )}

                      {/* 4. Tipo de atividade */}
                      <p className="text-xs text-neutral-500 font-medium truncate pt-0.5">
                        {exp.categoryLabel || 'Experiência marinha'}
                      </p>

                      {/* 6. Preço, quando aplicável */}
                      <div className="pt-1 text-xs text-neutral-700 font-semibold">
                        {exp.indicativePrice ? (
                          <span>
                            A partir de <strong className="text-emerald-700 font-black text-sm">{exp.indicativePrice.toLocaleString('pt-MZ')} MT</strong>
                          </span>
                        ) : (
                          <span className="text-neutral-500 font-medium">Sob consulta</span>
                        )}
                      </div>
                    </div>

                    {/* 7. Ver detalhes / Contactar */}
                    <div className="pt-2 mt-auto border-t border-neutral-100">
                      <button
                        type="button"
                        onClick={() => setSelectedExperience(exp)}
                        className="w-full h-10 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer touch-manipulation"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver experiência</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center space-y-3 border border-neutral-200/90 shadow-2xs">
              <Waves className="w-12 h-12 text-neutral-300 mx-auto" />
              <h3 className="font-extrabold text-base text-neutral-800">
                Nenhuma experiência turística encontrada
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Tente alterar a província ou a categoria selecionada.
              </p>
              <button
                onClick={resetFilters}
                className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: GUIAS */}
      {activeSection === 'guias' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between px-1 text-xs text-neutral-600">
            <div>
              <strong className="text-neutral-900 font-bold">{filteredGuides.length}</strong> guias turísticos credenciados
            </div>
            <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Profissionais Locais com BI
            </span>
          </div>

          {filteredGuides.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 items-stretch">
              {filteredGuides.map((guide) => (
                <div
                  key={guide.id}
                  className="bg-white rounded-3xl border border-neutral-200/90 p-3.5 sm:p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between h-full space-y-3 group active:scale-[0.99] touch-manipulation"
                >
                  <div onClick={() => setSelectedGuide(guide)} className="cursor-pointer space-y-2.5">
                    {/* Top Header: 1. Foto + 2. Nome + 3. Selo de Verificação + 4. Localização */}
                    <div className="flex items-start gap-3">
                      {/* 1. Foto */}
                      <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border border-neutral-200 shrink-0 bg-neutral-100 shadow-2xs">
                        <img
                          src={guide.photo}
                          alt={guide.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* 2. Nome */}
                        <h3 className="font-extrabold text-base text-neutral-900 truncate group-hover:text-emerald-700 transition-colors">
                          {guide.name}
                        </h3>

                        {/* 3. Selo de verificação */}
                        <div className="mt-0.5">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/70">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
                            <span>Verificado</span>
                          </span>
                        </div>

                        {/* 4. Localização */}
                        <div className="flex items-center gap-1 text-xs text-neutral-600 font-medium mt-1 truncate">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{guide.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* 6. Avaliação + 7. Experiência */}
                    <div className="flex items-center gap-1.5 text-xs text-neutral-700 font-semibold pt-0.5">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                        <span className="font-bold">{guide.rating.toFixed(1)}</span>
                      </div>
                      <span aria-hidden="true" className="text-neutral-300">·</span>
                      <span className="text-neutral-600 font-medium">{guide.experienceYears} anos de experiência</span>
                    </div>

                    {/* 5. Especialidade principal */}
                    {guide.specialties && guide.specialties.length > 0 && (
                      <p className="text-xs text-neutral-600 font-medium line-clamp-1">
                        <span className="text-neutral-800 font-semibold">Especialista em:</span> {guide.specialties.slice(0, 2).join(' e ')}
                      </p>
                    )}

                    {/* 8. Preço, quando aplicável */}
                    <div className="text-xs text-neutral-700 font-semibold pt-0.5">
                      {guide.ratePerDay ? (
                        <span>
                          <strong className="text-neutral-900 font-extrabold text-sm">{guide.ratePerDay.toLocaleString('pt-MZ')} MT</strong>
                          <span className="text-neutral-500 font-normal">/dia</span>
                        </span>
                      ) : (
                        <span className="text-neutral-500 font-medium">Preço sob consulta</span>
                      )}
                    </div>
                  </div>

                  {/* 9. WhatsApp + 10. Ligar */}
                  <div className="pt-2.5 mt-auto border-t border-neutral-100 flex items-center gap-2">
                    <a
                      href={`https://wa.me/${guide.whatsapp}?text=${encodeURIComponent(
                        `Olá ${guide.name}! Encontrei o seu perfil no Turismo Moçambique e gostaria de agendar uma excursão em ${guide.city}.`
                      )}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        const allowed = contactUnlockService.triggerContactAttempt(
                          {
                            id: guide.id,
                            name: guide.name,
                            photo: guide.photo,
                            phone: guide.phone,
                            whatsapp: guide.whatsapp,
                            module: 'guide',
                            moduleLabel: 'Guia Turístico',
                            unlockFee: 1000,
                          },
                          guide.isContactUnlocked
                        );
                        if (!allowed) {
                          e.preventDefault();
                        }
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 h-10 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs touch-manipulation cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={`tel:${guide.phone}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        const allowed = contactUnlockService.triggerContactAttempt(
                          {
                            id: guide.id,
                            name: guide.name,
                            photo: guide.photo,
                            phone: guide.phone,
                            whatsapp: guide.whatsapp,
                            module: 'guide',
                            moduleLabel: 'Guia Turístico',
                            unlockFee: 1000,
                          },
                          guide.isContactUnlocked
                        );
                        if (!allowed) {
                          e.preventDefault();
                        }
                      }}
                      className="flex-1 h-10 px-3 bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all touch-manipulation cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Ligar</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center space-y-3 border border-neutral-200/90 shadow-2xs">
              <Compass className="w-12 h-12 text-neutral-300 mx-auto" />
              <h3 className="font-extrabold text-base text-neutral-800">
                Nenhum guia credenciado encontrado
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Tente selecionar outra província ou pesquisar por outra especialidade.
              </p>
              <button
                onClick={resetFilters}
                className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: DETALHES DO LUGAR TURÍSTICO */}
      {selectedPlace && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-200 relative my-auto animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            {/* Header Image */}
            <div className="relative aspect-16/10 w-full bg-neutral-900 shrink-0">
              <img
                src={selectedPlace.photo}
                alt={selectedPlace.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              <button
                onClick={() => setSelectedPlace(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer hover:bg-black/80"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-600 text-white inline-block mb-1">
                  {selectedPlace.categoryLabel}
                </span>
                <h2 className="text-lg sm:text-xl font-black">
                  {selectedPlace.name}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-emerald-300">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{selectedPlace.city}, {selectedPlace.province}</span>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
              <div>
                <h4 className="text-xs font-black uppercase text-neutral-400 tracking-wider mb-1">
                  Sobre esta Atração
                </h4>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                  {selectedPlace.fullDescription}
                </p>
              </div>

              {/* Highlights */}
              <div>
                <h4 className="text-xs font-black uppercase text-neutral-400 tracking-wider mb-1.5">
                  Destaques & Roteiros
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPlace.highlights.map((hl, i) => (
                    <span
                      key={i}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200"
                    >
                      ✨ {hl}
                    </span>
                  ))}
                </div>
              </div>

              {/* Real Activities */}
              {selectedPlace.activities && selectedPlace.activities.length > 0 && (
                <div>
                  <h4 className="text-xs font-black uppercase text-neutral-400 tracking-wider mb-1.5">
                    Atividades no Local
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {selectedPlace.activities.map((act, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-xl bg-neutral-50 border border-neutral-200/80 text-xs font-medium text-neutral-800 flex items-center gap-2"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Real Services & Infrastructure */}
              {selectedPlace.services && selectedPlace.services.length > 0 && (
                <div>
                  <h4 className="text-xs font-black uppercase text-neutral-400 tracking-wider mb-1.5">
                    Serviços & Infraestrutura
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {selectedPlace.services.map((srv, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-xl bg-neutral-50 border border-neutral-200/80 text-xs font-medium text-neutral-800 flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{srv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Best Season */}
              {selectedPlace.bestSeason && (
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 text-xs text-amber-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>Melhor época para visitar:</strong> {selectedPlace.bestSeason}</span>
                </div>
              )}

              {/* Official Source & Verification Badge */}
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/90 text-xs space-y-1">
                <div className="flex items-center justify-between text-neutral-700">
                  <span className="font-bold flex items-center gap-1 text-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Fonte Oficial:
                  </span>
                  <span className="font-medium text-neutral-900 text-right truncate max-w-[200px]">
                    {selectedPlace.source}
                  </span>
                </div>
                <div className="flex items-center justify-between text-neutral-500 text-[11px]">
                  <span>Última verificação pública:</span>
                  <span className="font-semibold text-neutral-700">{selectedPlace.lastVerifiedDate}</span>
                </div>
                {selectedPlace.officialWebsite && (
                  <div className="pt-1 border-t border-neutral-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500">Portal oficial:</span>
                    <a
                      href={selectedPlace.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Aceder ao Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Associated Guides Section */}
              <div className="pt-2 border-t border-neutral-100">
                <h4 className="text-xs font-black uppercase text-neutral-800 tracking-wider mb-2 flex items-center justify-between">
                  <span>Guias Recomendados para este Lugar</span>
                  <span className="text-[10px] text-emerald-700 font-bold">Credenciados</span>
                </h4>

                <div className="space-y-2">
                  {guides
                    .filter((g) => g.province.toLowerCase().includes(selectedPlace.province.toLowerCase()) || (selectedPlace.associatedGuideIds && selectedPlace.associatedGuideIds.includes(g.id)))
                    .slice(0, 2)
                    .map((g) => (
                      <div
                        key={g.id}
                        className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={g.photo}
                            alt={g.name}
                            className="w-10 h-10 rounded-xl object-cover shrink-0 border border-neutral-200"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-neutral-900 truncate">{g.name}</div>
                            <div className="text-[11px] text-neutral-500 truncate">{g.city} · ★ {g.rating.toFixed(1)}</div>
                          </div>
                        </div>

                        <a
                          href={`https://wa.me/${g.whatsapp}?text=${encodeURIComponent(
                            `Olá ${g.name}! Gostaria de agendar uma visita guiada para *${selectedPlace.name}* (${selectedPlace.city}).`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            contactUnlockService.triggerContactAttempt(
                              {
                                id: g.id,
                                name: g.name,
                                photo: g.photo,
                                phone: g.phone,
                                whatsapp: g.whatsapp,
                                module: 'guide',
                                moduleLabel: 'Turismo - Lugar',
                                unlockFee: 1000,
                              },
                              g.isContactUnlocked
                            );
                          }}
                          className="h-9 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3.5 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between gap-2 shrink-0">
              {selectedPlace.coordinates && (
                <a
                  href={getDirectionsUrl(selectedPlace.coordinates.lat, selectedPlace.coordinates.lng, selectedPlace.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 px-3.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Navigation2 className="w-3.5 h-3.5 text-neutral-700" />
                  <span>Ver no Mapa</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => {
                  const placeCity = selectedPlace.city;
                  setSelectedPlace(null);
                  setActiveSection('guias');
                  setSearchQuery(placeCity);
                }}
                className="flex-1 h-10 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <Compass className="w-4 h-4" />
                <span>Ver Todos os Guias Deste Destino</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: DETALHES DA EXPERIÊNCIA */}
      {selectedExperience && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-200 relative my-auto animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="relative aspect-16/10 w-full bg-neutral-900 shrink-0">
              <img
                src={selectedExperience.photo}
                alt={selectedExperience.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              <button
                onClick={() => setSelectedExperience(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer hover:bg-black/80"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-600 text-white">
                    {selectedExperience.categoryLabel}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-black/60 text-white">
                    ⏱️ {selectedExperience.duration}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black">
                  {selectedExperience.title}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-emerald-300">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{selectedExperience.placeName}, {selectedExperience.province}</span>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
              <div>
                <h4 className="text-xs font-black uppercase text-neutral-400 tracking-wider mb-1">
                  Descrição do Passeio
                </h4>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                  {selectedExperience.fullDescription}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase text-neutral-400 tracking-wider mb-1.5">
                  O que está Incluído
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedExperience.includedItems.map((item, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-xl bg-neutral-50 border border-neutral-200/80 text-xs font-medium text-neutral-800 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real Activities & Services */}
              {selectedExperience.activities && selectedExperience.activities.length > 0 && (
                <div>
                  <h4 className="text-xs font-black uppercase text-neutral-400 tracking-wider mb-1.5">
                    Atividades da Experiência
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {selectedExperience.activities.map((act, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-xl bg-neutral-50 border border-neutral-200/80 text-xs font-medium text-neutral-800 flex items-center gap-2"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Operator & Guide Info */}
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/90 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-700">Operador / Guia:</span>
                  <strong className="text-neutral-900 font-extrabold">{selectedExperience.operatorName || selectedExperience.guideName}</strong>
                </div>
                <div className="flex items-center justify-between text-neutral-600 text-[11px]">
                  <span className="flex items-center gap-1 text-emerald-800 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Fonte Oficial:
                  </span>
                  <span className="font-medium text-neutral-800 truncate max-w-[200px]">{selectedExperience.source}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-500 text-[11px]">
                  <span>Última verificação:</span>
                  <span className="font-semibold text-neutral-700">{selectedExperience.lastVerifiedDate}</span>
                </div>
                {selectedExperience.officialWebsite && (
                  <div className="pt-1 border-t border-neutral-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500">Website Oficial:</span>
                    <a
                      href={selectedExperience.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Visitar Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {selectedExperience.indicativePrice && (
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
                  <span>Preço Indicativo por Pessoa:</span>
                  <strong className="text-emerald-800 text-base font-black">
                    {selectedExperience.indicativePrice.toLocaleString('pt-MZ')} MT
                  </strong>
                </div>
              )}
            </div>

            <div className="p-3.5 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between gap-2 shrink-0">
              <a
                href={selectedExperience.guideWhatsapp ? `https://wa.me/${selectedExperience.guideWhatsapp}?text=${encodeURIComponent(
                  `Olá ${selectedExperience.guideName || 'Guia'}! Gostaria de agendar a experiência *${selectedExperience.title}* no Turismo Moçambique.`
                )}` : '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if (selectedExperience.guideId) {
                    contactUnlockService.triggerContactAttempt(
                      {
                        id: selectedExperience.guideId,
                        name: selectedExperience.guideName || selectedExperience.title,
                        photo: selectedExperience.photo,
                        phone: '',
                        whatsapp: selectedExperience.guideWhatsapp,
                        module: 'guide',
                        moduleLabel: 'Turismo - Experiência',
                        unlockFee: 1000,
                      },
                      false
                    );
                  }
                }}
                className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Contactar Guia no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: DETALHES DO GUIA (Preservado) */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200 relative animate-in fade-in zoom-in-95 duration-150 my-auto">
            <div className="relative aspect-4/3 w-full bg-neutral-100">
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

              {/* Official Source & Credential Badge */}
              {selectedGuide.source && (
                <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/90 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-700 flex items-center gap-1 text-emerald-800">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Registo & Credenciação:
                    </span>
                    <span className="font-medium text-neutral-900 truncate max-w-[180px]">
                      {selectedGuide.source}
                    </span>
                  </div>
                  {selectedGuide.lastVerifiedDate && (
                    <div className="flex items-center justify-between text-neutral-500 text-[11px]">
                      <span>Última verificação:</span>
                      <span className="font-semibold text-neutral-700">{selectedGuide.lastVerifiedDate}</span>
                    </div>
                  )}
                  {selectedGuide.officialWebsite && (
                    <div className="pt-1 border-t border-neutral-200/60 flex items-center justify-between text-[11px]">
                      <span className="text-neutral-500">Website Oficial:</span>
                      <a
                        href={selectedGuide.officialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                      >
                        <span>Aceder</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Accordions */}
              <div className="border border-emerald-200/80 rounded-2xl overflow-hidden bg-emerald-50/50">
                <button
                  type="button"
                  onClick={() => toggleSection('verification')}
                  className="w-full p-2.5 flex items-center justify-between text-left hover:bg-emerald-100/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Identidade Confirmada (BI + Facial)</span>
                  </div>
                  {expandedSections.verification ? (
                    <ChevronUp className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-emerald-700 shrink-0" />
                  )}
                </button>
                {expandedSections.verification && (
                  <div className="px-2.5 pb-2.5 pt-0 text-[11px] text-emerald-900 leading-relaxed border-t border-emerald-100">
                    Guia credenciado com verificação biométrica facial e Bilhete de Identidade ativo verificado pelos moderadores.
                  </div>
                )}
              </div>

              <div className="border border-neutral-200/80 rounded-2xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggleSection('about')}
                  className="w-full p-3 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <span className="text-xs font-black uppercase tracking-wider text-neutral-800">
                    Sobre o Guia
                  </span>
                  {expandedSections.about ? (
                    <ChevronUp className="w-4 h-4 text-neutral-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />
                  )}
                </button>
                {expandedSections.about && (
                  <div className="px-3 pb-3 pt-0 text-xs sm:text-sm text-neutral-700 leading-relaxed border-t border-neutral-100 pt-2">
                    {selectedGuide.bio}
                  </div>
                )}
              </div>

              <div className="border border-neutral-200/80 rounded-2xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggleSection('specialties')}
                  className="w-full p-3 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <span className="text-xs font-black uppercase tracking-wider text-neutral-800">
                    Especialidades & Roteiros
                  </span>
                  {expandedSections.specialties ? (
                    <ChevronUp className="w-4 h-4 text-neutral-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />
                  )}
                </button>
                {expandedSections.specialties && (
                  <div className="px-3 pb-3 pt-2 border-t border-neutral-100 flex flex-wrap gap-1.5">
                    {selectedGuide.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="text-xs font-bold bg-emerald-100/70 text-emerald-900 px-2.5 py-1 rounded-lg"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-3.5 border-t border-neutral-100 bg-neutral-50 flex items-center gap-2">
              <a
                href={`tel:${selectedGuide.phone}`}
                onClick={(e) => {
                  const allowed = contactUnlockService.triggerContactAttempt(
                    {
                      id: selectedGuide.id,
                      name: selectedGuide.name,
                      photo: selectedGuide.photo,
                      phone: selectedGuide.phone,
                      whatsapp: selectedGuide.whatsapp,
                      module: 'guide',
                      moduleLabel: 'Guia Turístico',
                      unlockFee: 1000,
                    },
                    selectedGuide.isContactUnlocked
                  );
                  if (!allowed) {
                    e.preventDefault();
                  }
                }}
                className="h-11 px-3.5 bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Ligar</span>
              </a>

              <a
                href={`https://wa.me/${selectedGuide.whatsapp}?text=${encodeURIComponent(
                  `Olá ${selectedGuide.name}! Encontrei o seu perfil no Turismo Moçambique e gostaria de agendar uma excursão em ${selectedGuide.city}.`
                )}`}
                onClick={(e) => {
                  const allowed = contactUnlockService.triggerContactAttempt(
                    {
                      id: selectedGuide.id,
                      name: selectedGuide.name,
                      photo: selectedGuide.photo,
                      phone: selectedGuide.phone,
                      whatsapp: selectedGuide.whatsapp,
                      module: 'guide',
                      moduleLabel: 'Guia Turístico',
                      unlockFee: 1000,
                    },
                    selectedGuide.isContactUnlocked
                  );
                  if (!allowed) {
                    e.preventDefault();
                  }
                }}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Contactar no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* KYC & Billing Modals (Preserved) */}
      <BiometricVerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        purpose="tourguide"
        onVerificationComplete={handleVerificationComplete}
      />

      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAccept={() => {
          setIsTermsModalOpen(false);
          setIsVerificationOpen(true);
        }}
        contextText="Ao registar-se como Guia Turístico no Turismo Moçambique, confirme a leitura e aceitação dos Termos Gerais."
      />

      {generatedInvoice && (
        <BillingInvoiceModal
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
          invoiceData={generatedInvoice}
        />
      )}
    </div>
  );
};
