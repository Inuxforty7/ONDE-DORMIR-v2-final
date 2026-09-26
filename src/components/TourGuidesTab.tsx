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
  ChevronDown
} from 'lucide-react';
import { TourGuide } from '../types';
import { INITIAL_TOUR_GUIDES } from '../data/tourGuides';

interface TourGuidesTabProps {
  onBackToHome?: () => void;
}

export const TourGuidesTab: React.FC<TourGuidesTabProps> = ({ onBackToHome }) => {
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

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedGuide, setSelectedGuide] = useState<TourGuide | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

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

  const citiesList = [
    'Maputo',
    'Inhambane',
    'Vilankulo',
    'Gorongosa',
    'Ilha de Moçambique',
    'Beira',
    'Pemba'
  ];

  // Filtered guides
  const filteredGuides = useMemo(() => {
    return guides.filter((g) => {
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
  }, [guides, searchQuery, selectedCity, selectedSpecialty]);

  const handleRegisterGuide = (newGuide: TourGuide) => {
    setGuides((prev) => [newGuide, ...prev]);
    const custom = JSON.parse(localStorage.getItem('onde_dormir_custom_guides') || '[]');
    localStorage.setItem('onde_dormir_custom_guides', JSON.stringify([newGuide, ...custom]));
    setIsRegisterOpen(false);
  };

  return (
    <div className="pb-32 pt-2 sm:pt-4 max-w-5xl mx-auto px-3.5 sm:px-4 space-y-4 sm:space-y-5">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-4 sm:p-5 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner shrink-0">
              <Compass className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Guias Turísticos
                </h1>
                <span className="text-xs uppercase font-extrabold tracking-widest bg-emerald-500/40 text-emerald-100 px-2.5 py-0.5 rounded-full">
                  Verificados
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-0.5">
                Guias locais credenciados, passeios e excursões em Moçambique
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsRegisterOpen(true)}
            className="h-11 px-4 bg-white text-emerald-800 hover:bg-emerald-50 active:scale-95 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Registar como Guia</span>
          </button>
        </div>
      </div>

      {/* Filters Bar with 48px inputs */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-neutral-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Pesquisar guia por nome, safari, cidade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-10 bg-neutral-50 rounded-2xl text-sm sm:text-base text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-neutral-200"
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
            <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full h-12 pl-9 pr-8 bg-neutral-50 rounded-2xl text-xs sm:text-sm font-semibold text-neutral-800 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
            >
              <option value="all">Todas as Cidades</option>
              {citiesList.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          </div>
        </div>

        {/* Specialty Filter Pills - 40px height */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pt-1">
          <button
            onClick={() => setSelectedSpecialty('all')}
            className={`h-10 px-4 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all cursor-pointer active:scale-95 ${
              selectedSpecialty === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Todas as Especialidades
          </button>
          {specialtiesList.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(selectedSpecialty === spec ? 'all' : spec)}
              className={`h-10 px-3.5 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all cursor-pointer border active:scale-95 ${
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

      {/* Guides List with 44px mobile touch buttons */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs sm:text-sm text-neutral-600">
            <strong className="text-neutral-900 font-bold">{filteredGuides.length}</strong> guias credenciados
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {filteredGuides.map((guide) => (
            <div
              key={guide.id}
              onClick={() => setSelectedGuide(guide)}
              className="bg-white rounded-3xl border border-neutral-200/90 p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3.5"
            >
              <div className="flex items-start gap-3.5">
                <img
                  src={guide.photo}
                  alt={guide.name}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border border-neutral-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5">
                    <h3 className="font-extrabold text-base sm:text-lg text-neutral-900 truncate">
                      {guide.name}
                    </h3>
                    {guide.verified && (
                      <span className="text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-lg flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verificado
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-neutral-600 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{guide.city}, {guide.province}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{guide.rating.toFixed(1)}</span>
                      <span className="text-neutral-400 font-normal">({guide.reviewsCount})</span>
                    </div>
                    <span className="text-neutral-400">•</span>
                    <span className="text-neutral-600 font-medium">
                      {guide.experienceYears} anos de exp.
                    </span>
                  </div>
                </div>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-1.5">
                {guide.specialties.map((spec) => (
                  <span
                    key={spec}
                    className="text-xs font-medium bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Bio snippet */}
              <p className="text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed">
                {guide.bio}
              </p>

              {/* Footer with 44px Contact buttons */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2.5">
                <div>
                  <span className="text-xs uppercase font-bold text-neutral-500 block">
                    Diária
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-neutral-900">
                    {guide.ratePerDay ? `${guide.ratePerDay.toLocaleString()} MT` : 'A combinar'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${guide.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="h-11 px-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Ligar</span>
                  </a>

                  <a
                    href={`https://wa.me/${guide.whatsapp}?text=${encodeURIComponent(
                      `Olá ${guide.name}! Encontrei o seu contacto no Onde Dormir Moçambique e gostaria de saber mais sobre os seus serviços de guia turístico em ${guide.city}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-2xs transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guide Detail Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200 relative animate-in fade-in zoom-in-95 duration-150 my-auto">
            <div className="bg-emerald-800 text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Compass className="w-5 h-5 text-emerald-300" />
                <h3 className="font-extrabold text-base sm:text-lg">Perfil do Guia Turístico</h3>
              </div>
              <button
                onClick={() => setSelectedGuide(null)}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center gap-4">
                <img
                  src={selectedGuide.photo}
                  alt={selectedGuide.name}
                  className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl object-cover border border-neutral-200"
                />
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900">{selectedGuide.name}</h2>
                  <p className="text-xs sm:text-sm text-neutral-600 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>{selectedGuide.city}, {selectedGuide.province}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs sm:text-sm font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-500" />
                      {selectedGuide.rating} ({selectedGuide.reviewsCount} avaliações)
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
                  Sobre o Guia
                </span>
                <p className="text-xs sm:text-sm text-neutral-700 bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200 leading-relaxed">
                  {selectedGuide.bio}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
                  Especialidades & Roteiros
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedGuide.specialties.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs sm:text-sm font-semibold"
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  Idiomas Falados
                </span>
                <p className="text-xs sm:text-sm text-neutral-700 font-medium">
                  {selectedGuide.languages.join(' • ')}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <a
                  href={`tel:${selectedGuide.phone}`}
                  className="flex-1 h-12 bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>{selectedGuide.phone}</span>
                </a>

                <a
                  href={`https://wa.me/${selectedGuide.whatsapp}?text=${encodeURIComponent(
                    `Olá ${selectedGuide.name}! Encontrei o seu perfil no Onde Dormir Moçambique e gostaria de agendar uma excursão em ${selectedGuide.city}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Directo</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Register Guide Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200 relative animate-in fade-in zoom-in-95 duration-150 my-auto">
            <div className="bg-emerald-800 text-white p-4 sm:p-5 flex items-center justify-between">
              <h3 className="font-extrabold text-base sm:text-lg">Registar como Guia Turístico</h3>
              <button
                onClick={() => setIsRegisterOpen(false)}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const fd = new FormData(form);
                const newG: TourGuide = {
                  id: `guide-custom-${Date.now()}`,
                  name: fd.get('name') as string,
                  photo: (fd.get('photo') as string) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                  city: fd.get('city') as string,
                  province: fd.get('province') as string,
                  specialties: ['Passeios Personalizados', 'City Tour'],
                  languages: ['Português', 'Inglês'],
                  experienceYears: parseInt(fd.get('experience') as string) || 3,
                  phone: fd.get('phone') as string,
                  whatsapp: ((fd.get('whatsapp') as string) || (fd.get('phone') as string)).replace(/\D/g, ''),
                  verified: true,
                  rating: 5.0,
                  reviewsCount: 1,
                  bio: fd.get('bio') as string,
                  ratePerDay: parseInt(fd.get('rate') as string) || 2500,
                  featured: true
                };
                handleRegisterGuide(newG);
              }}
              className="p-4 sm:p-5 space-y-3.5 max-h-[80vh] overflow-y-auto"
            >
              <div>
                <label className="text-xs sm:text-sm font-bold text-neutral-700 block mb-1">Nome Completo *</label>
                <input required name="name" type="text" placeholder="Ex: Lucas Sitoe" className="w-full h-11 px-3.5 bg-neutral-50 rounded-xl text-sm border border-neutral-200" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-neutral-700 block mb-1">Cidade *</label>
                  <input required name="city" type="text" placeholder="Ex: Maputo" className="w-full h-11 px-3.5 bg-neutral-50 rounded-xl text-sm border border-neutral-200" />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-bold text-neutral-700 block mb-1">Província *</label>
                  <input required name="province" type="text" placeholder="Ex: Maputo Cidade" className="w-full h-11 px-3.5 bg-neutral-50 rounded-xl text-sm border border-neutral-200" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-neutral-700 block mb-1">Anos de Experiência</label>
                  <input name="experience" type="number" defaultValue="5" className="w-full h-11 px-3.5 bg-neutral-50 rounded-xl text-sm border border-neutral-200" />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-bold text-neutral-700 block mb-1">Valor Diária (MT)</label>
                  <input name="rate" type="number" defaultValue="2500" className="w-full h-11 px-3.5 bg-neutral-50 rounded-xl text-sm border border-neutral-200" />
                </div>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-neutral-700 block mb-1">WhatsApp / Contacto *</label>
                <input required name="phone" type="tel" placeholder="+258 84 123 4567" className="w-full h-11 px-3.5 bg-neutral-50 rounded-xl text-sm border border-neutral-200" />
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-neutral-700 block mb-1">Biografia & Especialidades</label>
                <textarea required name="bio" rows={3} placeholder="Descreva os passeios que realiza..." className="w-full p-3.5 bg-neutral-50 rounded-xl text-sm border border-neutral-200" />
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs sm:text-sm text-neutral-700">
                  <input required type="checkbox" className="mt-0.5 rounded text-emerald-600 w-4 h-4" />
                  <span>Concordo com os Termos e Condições de prestação de serviços de guia turístico.</span>
                </label>
              </div>

              <button type="submit" className="w-full h-12 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md cursor-pointer">
                Submeter Registo de Guia
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
