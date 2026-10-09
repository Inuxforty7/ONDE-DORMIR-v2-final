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
import { useVisitAnalytics, formatVisitCount } from '../services/analyticsService';
import { TourGuideReviewModal } from './TourGuideReviewModal';
import { tourGuideReviewService } from '../services/tourGuideReviewService';
// Slot pronto para a nova imagem hero do Turismo
// import heroCoastalBg from '../assets/images/mozambique_coastal_hero_bg_1790583006189.jpg';
// import { TourGuideHeroGraphic } from './TourGuideHeroGraphic';

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
  const filtered = place.highlights.filter(
    (h) => h && h.trim() && !h.toLowerCase().includes('praias · parques')
  );
  if (filtered.length === 0) return '';
  return filtered.slice(0, 3).join(' · ').replace(/^[\s·.-]+/, '');
};

export const getLanguageFlag = (lang: string): string => {
  const l = lang.toLowerCase();
  if (l.includes('inglês') || l.includes('ingles')) return '🇬🇧';
  if (l.includes('mandarim') || l.includes('chinês') || l.includes('chines')) return '🇨🇳';
  if (l.includes('francês') || l.includes('frances')) return '🇫🇷';
  if (l.includes('espanhol')) return '🇪🇸';
  if (l.includes('alemão') || l.includes('alemao')) return '🇩🇪';
  if (l.includes('português') || l.includes('portugues')) return '🇵🇹';
  if (l.includes('changana') || l.includes('emakhuwa') || l.includes('sena') || l.includes('ndau') || l.includes('gitonga') || l.includes('ronga') || l.includes('xitswa') || l.includes('locais')) return '🇲🇿';
  return '🌐';
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
  const { getModuleCount } = useVisitAnalytics();
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
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState<string>('all');
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
    reviews: boolean;
  }>({
    about: false,
    specialties: false,
    verification: false,
    reviews: true,
  });

  const toggleSection = (key: 'about' | 'specialties' | 'verification' | 'reviews') => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Tourism Review Modal State and Real-Time Subscription
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewingGuide, setReviewingGuide] = useState<TourGuide | null>(null);
  const [, setReviewVersion] = useState(0);

  React.useEffect(() => {
    const unsubscribe = tourGuideReviewService.subscribe(() => {
      setReviewVersion((v) => v + 1);
    });
    return unsubscribe;
  }, []);

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
    setSelectedLanguageFilter('all');
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
        const matchLang = g.languages.some((l) => l.toLowerCase().includes(q));
        if (!matchName && !matchCity && !matchBio && !matchSpec && !matchLang) return false;
      }

      // Specialty
      if (selectedGuideSpecialty !== 'all' && !g.specialties.some(s => s.toLowerCase().includes(selectedGuideSpecialty.toLowerCase()))) {
        return false;
      }

      // Spoken Language Filter
      if (selectedLanguageFilter !== 'all') {
        const qLang = selectedLanguageFilter.toLowerCase();
        const hasLang = g.languages.some((l) => l.toLowerCase().includes(qLang));
        if (!hasLang) return false;
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
      {/* Top Banner: TURISMO MOÇAMBIQUE - 16:9 Mobile & Panorâmico */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-emerald-500/25 bg-neutral-950 aspect-[16/9] sm:aspect-auto sm:min-h-[220px] md:min-h-[240px]">
        {/* Vídeo Background em Loop */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          src="https://res.cloudinary.com/dwlfwnbt0/video/upload/v1791542388/Criar_Anima%C3%A7%C3%A3o_Motion_Loop_Imagem_20261009123429_zifw4j.mp4"
        />

        {/* Gradiente sutil reforçado apenas no lado esquerdo dos textos; lado direito sem textos continua 100% límpido e visível */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/85 via-black/45 via-55% to-transparent pointer-events-none" />

        {/* Conteúdo no Lado Esquerdo - Alinhado, Agrupado e com Hierarquia Visual */}
        <div className="relative z-20 p-3 sm:p-5 md:p-6 flex flex-col justify-center items-start text-left h-full max-w-[72%] sm:max-w-md md:max-w-lg gap-1 sm:gap-2">
          {/* Badge de Visitas Alinhado (Substitui Turismo Oficial) */}
          <div
            className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-[11px] font-bold shadow-xs"
            title="Visitas ao módulo Turismo"
          >
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-300 shrink-0" />
            <span>{formatVisitCount(getModuleCount('turismo'))}</span>
          </div>

          {/* Título Principal com Tamanho Reduzido */}
          <h1 className="text-[14px] sm:text-lg md:text-xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
            <span>TURISMO </span>
            <span className="text-[#FACC15]">MOÇAMBIQUE</span>
          </h1>

          {/* Subtítulo Agrupado e Quebrado */}
          <p className="text-white/90 text-[10px] sm:text-xs md:text-sm font-medium leading-tight sm:leading-snug drop-shadow-xs">
            Explore lugares, experiências <br />
            e encontre quem o pode guiar.
          </p>

          {/* Botão de Ação Alinhado */}
          <div className="pt-0.5 sm:pt-1">
            <button
              type="button"
              onClick={handleStartGuideRegistration}
              className="h-7.5 sm:h-9.5 px-3.5 sm:px-5 bg-white hover:bg-neutral-50 active:scale-95 text-emerald-950 font-black text-[11px] sm:text-xs rounded-xl sm:rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>+ Registar como Guia</span>
            </button>
          </div>
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


      </div>

      {/* SECTION 1: LUGARES */}
      {activeSection === 'lugares' && (
        <div className="space-y-3.5">
          <div className="px-1 text-xs text-neutral-600">
            <strong className="text-neutral-900 font-bold">{filteredPlaces.length}</strong> lugares turísticos encontrados
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
          <div className="px-1 text-xs text-neutral-600">
            <strong className="text-neutral-900 font-bold">{filteredExperiences.length}</strong> experiências e passeios guiados
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
          <div className="px-1 text-xs text-neutral-600">
            <strong className="text-neutral-900 font-bold">{filteredGuides.length}</strong> guias turísticos credenciados
          </div>

          {filteredGuides.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 items-stretch">
              {filteredGuides.map((guide) => (
                <div
                  key={guide.id}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 p-3.5 sm:p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between h-full space-y-3 group active:scale-[0.99] touch-manipulation relative overflow-hidden"
                >
                  <div onClick={() => setSelectedGuide(guide)} className="cursor-pointer space-y-2.5">
                    {/* Header: Photo + Name + Verified Badge + Location */}
                    <div className="flex items-start gap-3">
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border border-neutral-200/90 shrink-0 bg-neutral-100 shadow-2xs">
                        <img
                          src={guide.photo}
                          alt={guide.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1.5">
                          <h3 className="font-extrabold text-sm sm:text-base text-neutral-900 truncate group-hover:text-emerald-700 transition-colors flex items-center gap-1">
                            <span className="truncate">{guide.name}</span>
                            {guide.verified && (
                              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-600 text-white shrink-0 shadow-2xs" title="Guia Verificado">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1 text-[11.5px] text-neutral-500 font-medium truncate">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{guide.city}, {guide.province}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-neutral-700 font-semibold pt-0.5">
                          {(() => {
                            const stats = tourGuideReviewService.getGuideRatingStats(guide.id, {
                              rating: guide.rating,
                              reviewsCount: guide.reviewsCount,
                            });
                            return (
                              <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-md border border-amber-200/60">
                                <Star className="w-3 h-3 fill-amber-500 text-amber-500 shrink-0" />
                                <span className="font-extrabold text-[11px]">{stats.rating.toFixed(1)}</span>
                                <span className="text-[10px] text-amber-600 font-normal">({stats.reviewsCount})</span>
                              </div>
                            );
                          })()}
                          <span className="text-neutral-500 text-[11px] font-medium">• {guide.experienceYears}a exp</span>
                        </div>
                      </div>
                    </div>

                    {/* Specialties */}
                    {guide.specialties && guide.specialties.length > 0 && (
                      <p className="text-[11.5px] text-neutral-600 font-medium line-clamp-1 bg-neutral-50 px-2.5 py-1 rounded-xl border border-neutral-100">
                        <span className="text-neutral-900 font-extrabold">Especialidade:</span> {guide.specialties.slice(0, 2).join(' · ')}
                      </p>
                    )}

                    {/* Spoken Languages Bar - Max 3 pills + count overflow */}
                    {guide.languages && guide.languages.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                        <span className="text-[10.5px] font-bold text-neutral-500 shrink-0 flex items-center gap-1">
                          <Languages className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Línguas:</span>
                        </span>
                        {guide.languages.slice(0, 3).map((lang, idx) => (
                          <span
                            key={idx}
                            className="text-[10.5px] font-bold bg-emerald-50/80 text-emerald-950 border border-emerald-200/80 px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs"
                          >
                            <span>{getLanguageFlag(lang)}</span>
                            <span>{lang}</span>
                          </span>
                        ))}
                        {guide.languages.length > 3 && (
                          <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-1.5 py-0.5 rounded-lg">
                            +{guide.languages.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer Row: Price + Action CTAs */}
                  <div className="pt-2.5 mt-auto border-t border-neutral-100 flex items-center justify-between gap-2">
                    <div className="text-xs text-neutral-700 font-semibold">
                      {guide.ratePerDay ? (
                        <div>
                          <span className="text-[10px] text-neutral-400 block font-normal leading-none">Diária</span>
                          <strong className="text-neutral-900 font-black text-sm">{guide.ratePerDay.toLocaleString('pt-MZ')} MT</strong>
                        </div>
                      ) : (
                        <span className="text-neutral-500 font-medium text-[11px]">Sob consulta</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
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
                        className="h-9 px-2.5 sm:px-3 bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all touch-manipulation cursor-pointer border border-neutral-200/70"
                        title="Ligar"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Ligar</span>
                      </a>

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
                        className="h-9 px-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs touch-manipulation cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
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
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden animate-in fade-in duration-150">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-200 relative animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 flex flex-col max-h-[88vh] sm:max-h-[85vh] my-0 sm:my-auto">
            {/* Header Image */}
            <div className="relative h-36 sm:h-44 w-full bg-neutral-900 shrink-0 overflow-hidden">
              <img
                src={selectedPlace.photo}
                alt={selectedPlace.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

              <button
                onClick={() => setSelectedPlace(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer hover:bg-black/80 transition-transform active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-2.5 left-3.5 right-3.5 text-white space-y-0.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white inline-block shadow-2xs">
                  {selectedPlace.categoryLabel}
                </span>
                <h2 className="text-base sm:text-lg font-black text-white leading-tight line-clamp-1 drop-shadow-md">
                  {selectedPlace.name}
                </h2>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 font-medium">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{selectedPlace.city}, {selectedPlace.province}</span>
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
                  Destaques & Atividades
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

              {/* Source & Information Card */}
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/90 text-xs space-y-1">
                {selectedPlace.source && (
                  <div className="flex items-center justify-between text-neutral-700">
                    <span className="font-bold flex items-center gap-1 text-emerald-800">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Fonte / Credenciais:
                    </span>
                    <span className="font-medium text-neutral-900 text-right truncate max-w-[200px]">
                      {selectedPlace.source}
                    </span>
                  </div>
                )}
                {selectedPlace.officialWebsite && (
                  <div className="pt-1 border-t border-neutral-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500">Website / Portal:</span>
                    <a
                      href={selectedPlace.officialWebsite}
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
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden animate-in fade-in duration-150">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-200 relative animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 flex flex-col max-h-[88vh] sm:max-h-[85vh] my-0 sm:my-auto">
            <div className="relative h-36 sm:h-44 w-full bg-neutral-900 shrink-0 overflow-hidden">
              <img
                src={selectedExperience.photo}
                alt={selectedExperience.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

              <button
                onClick={() => setSelectedExperience(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer hover:bg-black/80 transition-transform active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-2.5 left-3.5 right-3.5 text-white space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
                    {selectedExperience.categoryLabel}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white border border-white/20">
                    ⏱️ {selectedExperience.duration}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-white leading-tight line-clamp-1 drop-shadow-md">
                  {selectedExperience.title}
                </h2>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 font-medium">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{selectedExperience.placeName}, {selectedExperience.province}</span>
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
                {selectedExperience.source && (
                  <div className="flex items-center justify-between text-neutral-600 text-[11px]">
                    <span className="flex items-center gap-1 text-emerald-800 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Organização / Credenciais:
                    </span>
                    <span className="font-medium text-neutral-800 truncate max-w-[200px]">{selectedExperience.source}</span>
                  </div>
                )}
                {selectedExperience.officialWebsite && (
                  <div className="pt-1 border-t border-neutral-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500">Website:</span>
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

      {/* MODAL 3: DETALHES DO GUIA (Modern Mobile-First UX) */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden animate-in fade-in duration-150">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200 relative animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 flex flex-col max-h-[88vh] sm:max-h-[85vh] my-0 sm:my-auto">
            
            {/* 1. Header Hero Image Banner - Compact & Modern */}
            <div className="relative h-36 sm:h-44 w-full bg-neutral-900 shrink-0 overflow-hidden">
              <img
                src={selectedGuide.photo}
                alt={selectedGuide.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedGuide(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer hover:bg-black/80 transition-transform active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title & Location Overlay */}
              <div className="absolute bottom-2.5 left-3.5 right-3.5 text-white space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-base sm:text-lg font-black text-white leading-tight line-clamp-2 drop-shadow-md pr-1">
                    {selectedGuide.name}{selectedGuide.age ? `, ${selectedGuide.age} anos` : ''}
                  </h2>
                  {selectedGuide.verified && (
                    <span className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white shadow-2xs" title="Guia Verificado">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-neutral-200 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{selectedGuide.city}, {selectedGuide.province}</span>
                </div>
              </div>
            </div>

            {/* 2. Scrollable Body Content */}
            <div className="p-3.5 sm:p-4 space-y-2.5 overflow-y-auto flex-1">
              
              {/* Quick Key Metrics Grid (Rating, Exp, Price) */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(() => {
                  const gStats = tourGuideReviewService.getGuideRatingStats(selectedGuide.id, {
                    rating: selectedGuide.rating,
                    reviewsCount: selectedGuide.reviewsCount,
                  });
                  return (
                    <div className="p-2 rounded-xl bg-amber-50/90 border border-amber-200/90 text-amber-950 font-bold flex flex-col items-center justify-center text-center shadow-2xs">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                        <span className="text-sm font-black">{gStats.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-[9.5px] text-amber-700 font-semibold truncate max-w-full">
                        {gStats.reviewsCount} avaliações
                      </span>
                    </div>
                  );
                })()}

                <div className="p-2 rounded-xl bg-neutral-100/90 border border-neutral-200 text-neutral-800 font-bold flex flex-col items-center justify-center text-center shadow-2xs">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                    <span className="text-sm font-black">{selectedGuide.experienceYears}a</span>
                  </div>
                  <span className="text-[9.5px] text-neutral-500 font-semibold truncate max-w-full">
                    Experiência
                  </span>
                </div>

                {selectedGuide.ratePerDay ? (
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold flex flex-col items-center justify-center text-center shadow-2xs">
                    <span className="text-[9.5px] text-emerald-800 font-semibold">Preço/dia</span>
                    <strong className="text-xs text-emerald-900 font-black truncate max-w-full">
                      {selectedGuide.ratePerDay.toLocaleString('pt-MZ')} MT
                    </strong>
                  </div>
                ) : (
                  <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-600 font-medium text-[10px] flex items-center justify-center text-center">
                    Sob consulta
                  </div>
                )}
              </div>

              {/* Website / External Link */}
              {selectedGuide.officialWebsite && (
                <div className="px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200/90 text-xs flex items-center justify-between">
                  <span className="font-bold text-neutral-700 text-[11px]">Website / Página:</span>
                  <a
                    href={selectedGuide.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 text-[11px] font-black hover:underline flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200"
                  >
                    <span>Aceder</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Spoken Languages & Communication Competence */}
              {selectedGuide.languages && selectedGuide.languages.length > 0 && (
                <div className="p-2.5 bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-emerald-50/90 rounded-2xl border border-emerald-200/90 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-black text-emerald-950">
                    <Languages className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Línguas Faladas & Comunicação:</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedGuide.languages.map((lang, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-bold bg-white text-emerald-950 border border-emerald-300/80 px-2.5 py-0.5 rounded-lg shadow-2xs flex items-center gap-1"
                      >
                        <span className="text-xs">{getLanguageFlag(lang)}</span>
                        <span>{lang}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Collapsible About Section */}
              <div className="border border-neutral-200/80 rounded-2xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggleSection('about')}
                  className="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <span className="text-[11px] font-black uppercase tracking-wider text-neutral-800">
                    Sobre o Guia / Apresentação
                  </span>
                  {expandedSections.about ? (
                    <ChevronUp className="w-4 h-4 text-neutral-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />
                  )}
                </button>
                {expandedSections.about && (
                  <div className="px-3 pb-3 text-xs text-neutral-700 leading-relaxed border-t border-neutral-100 pt-2 bg-neutral-50/50">
                    {selectedGuide.bio}
                  </div>
                )}
              </div>

              {/* Collapsible Specialties Section */}
              <div className="border border-neutral-200/80 rounded-2xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggleSection('specialties')}
                  className="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <span className="text-[11px] font-black uppercase tracking-wider text-neutral-800">
                    Especialidades & Atuação
                  </span>
                  {expandedSections.specialties ? (
                    <ChevronUp className="w-4 h-4 text-neutral-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />
                  )}
                </button>
                {expandedSections.specialties && (
                  <div className="px-3 pb-3 pt-2 border-t border-neutral-100 flex flex-wrap gap-1.5 bg-neutral-50/50">
                    {selectedGuide.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-bold bg-emerald-100/80 text-emerald-950 px-2 py-0.5 rounded-lg border border-emerald-200/60"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Collapsible Reviews & Ratings Section */}
              {(() => {
                const guideStats = tourGuideReviewService.getGuideRatingStats(selectedGuide.id, {
                  rating: selectedGuide.rating,
                  reviewsCount: selectedGuide.reviewsCount,
                });
                const guideReviews = tourGuideReviewService.getReviewsByGuideId(selectedGuide.id);

                return (
                  <div className="border border-neutral-200/80 rounded-2xl overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => toggleSection('reviews')}
                      className="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-[11px] font-black uppercase tracking-wider text-neutral-800">
                          ⭐⭐⭐⭐⭐ Avaliação Geral
                        </span>
                        <span className="text-[10.5px] font-bold text-neutral-500">
                          ({guideReviews.length})
                        </span>
                      </div>
                      {expandedSections.reviews ? (
                        <ChevronUp className="w-4 h-4 text-neutral-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />
                      )}
                    </button>

                    {expandedSections.reviews && (
                      <div className="px-3 pb-3 pt-2 border-t border-neutral-100 space-y-3 bg-neutral-50/40">
                        {/* 6 Criteria Breakdown Grid */}
                        <div className="p-3 bg-white rounded-xl border border-neutral-200 space-y-2">
                          <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100">
                            <span className="text-xs font-bold text-neutral-900">
                              Média Geral do Guia
                            </span>
                            <div className="flex items-center gap-1 font-black text-amber-600 text-xs bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{guideStats.rating.toFixed(1)}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-neutral-600 pt-0.5">
                            <div className="flex justify-between">
                              <span>Comunicação</span>
                              <span className="font-bold text-neutral-800">{guideStats.breakdown.comunicacao.toFixed(1)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Pontualidade</span>
                              <span className="font-bold text-neutral-800">{guideStats.breakdown.pontualidade.toFixed(1)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Atendimento</span>
                              <span className="font-bold text-neutral-800">{guideStats.breakdown.atendimento.toFixed(1)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Organização</span>
                              <span className="font-bold text-neutral-800">{guideStats.breakdown.organizacao.toFixed(1)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Segurança</span>
                              <span className="font-bold text-neutral-800">{guideStats.breakdown.seguranca.toFixed(1)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Profissionalismo</span>
                              <span className="font-bold text-neutral-800">{guideStats.breakdown.profissionalismo.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action button to open review modal */}
                        <button
                          type="button"
                          onClick={() => {
                            setReviewingGuide(selectedGuide);
                            setIsReviewModalOpen(true);
                          }}
                          className="w-full h-10 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>Avaliar este Guia Turístico</span>
                        </button>

                        {/* Unified Reviews List */}
                        <div className="space-y-2 pt-1">
                          <h4 className="text-[11px] font-black uppercase tracking-wider text-neutral-500">
                            Comentários & Avaliações ({guideReviews.length})
                          </h4>

                          {guideReviews.length === 0 ? (
                            <div className="py-4 text-center text-xs text-neutral-500 bg-white rounded-xl border border-dashed border-neutral-200">
                              Ainda não há avaliações para este guia. Seja o primeiro a avaliar!
                            </div>
                          ) : (
                            guideReviews.map((rev) => (
                              <div
                                key={rev.id}
                                className="p-2.5 bg-white rounded-xl border border-neutral-200/80 space-y-1"
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

                                <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  <span>{rev.overallRating.toFixed(1)}</span>
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
            </div>

            {/* 3. Fixed Bottom Action Bar */}
            <div className="p-3 border-t border-neutral-100 bg-neutral-50 flex items-center gap-2 shrink-0">
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
                className="h-10 px-3.5 bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs touch-manipulation"
              >
                <Phone className="w-3.5 h-3.5 text-neutral-700" />
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
                className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer touch-manipulation"
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

      {/* Tourism Tour Guide Review Modal */}
      <TourGuideReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setReviewingGuide(null);
        }}
        guide={reviewingGuide}
        onReviewSubmitted={() => {
          setReviewVersion((v) => v + 1);
        }}
      />
    </div>
  );
};
