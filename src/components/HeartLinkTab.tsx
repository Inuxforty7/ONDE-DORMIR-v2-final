import React, { useState, useMemo } from 'react';
import { 
  Heart, 
  MapPin, 
  CheckCircle2, 
  MessageCircle, 
  Search, 
  Filter, 
  X, 
  Plus, 
  Phone, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Star, 
  Calendar, 
  Check, 
  Info, 
  ChevronRight, 
  ArrowRight, 
  Flame, 
  Users, 
  Smartphone, 
  ArrowLeft,
  Camera,
  Lock,
  UserCheck
} from 'lucide-react';
import { HeartLinkProfile, HeartLinkIntention, Accommodation, UserLocationState } from '../types';
import { INITIAL_HEARTLINK_PROFILES } from '../data/heartLinkProfiles';
import { BiometricVerificationModal, VerificationDossier } from './BiometricVerificationModal';
import { MOZ_PROVINCES_LIST } from './ExploreTab';

interface HeartLinkTabProps {
  onBackToHome?: () => void;
  userLocation?: UserLocationState;
  onOpenLocationModal?: () => void;
  onSelectProvince?: (prov: string) => void;
  onSelectAllMozambique?: () => void;
  accommodations?: Accommodation[];
  onSelectAccommodation?: (item: Accommodation) => void;
  onNavigateToExplore?: () => void;
}

export const HeartLinkTab: React.FC<HeartLinkTabProps> = ({ 
  onBackToHome,
  userLocation,
  onOpenLocationModal,
  onSelectProvince,
  onSelectAllMozambique,
  accommodations = [],
  onSelectAccommodation,
  onNavigateToExplore
}) => {
  const [profiles, setProfiles] = useState<HeartLinkProfile[]>(() => {
    const saved = localStorage.getItem('onde_dormir_heartlink_profiles');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...parsed, ...INITIAL_HEARTLINK_PROFILES];
      } catch (e) {
        return INITIAL_HEARTLINK_PROFILES;
      }
    }
    return INITIAL_HEARTLINK_PROFILES;
  });

  const [likedProfileIds, setLikedProfileIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('onde_dormir_heartlink_likes');
    return saved ? JSON.parse(saved) : ['hl-1', 'hl-5'];
  });

  const [activeSubTab, setActiveSubTab] = useState<'descobrir' | 'pessoas' | 'mensagens' | 'curtidas'>('descobrir');
  const [searchQuery, setSearchQuery] = useState('');
  
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

  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<'all' | 'feminino' | 'masculino'>('all');
  const [selectedIntention, setSelectedIntention] = useState<HeartLinkIntention | 'all'>('all');
  
  // Modals & KYC State
  const [selectedProfile, setSelectedProfile] = useState<HeartLinkProfile | null>(null);
  const [chatProfile, setChatProfile] = useState<HeartLinkProfile | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ type: 'chat' | 'whatsapp' | 'register' | 'like'; profile?: HeartLinkProfile } | null>(null);

  const [verifiedDossier, setVerifiedDossier] = useState<VerificationDossier | null>(() => {
    const saved = localStorage.getItem('onde_dormir_user_verification_dossier');
    return saved ? JSON.parse(saved) : null;
  });

  const handleProvinceClick = (prov: string) => {
    setSelectedProvince(prov);
    if (prov === 'all') {
      if (onSelectAllMozambique) onSelectAllMozambique();
    } else {
      if (onSelectProvince) onSelectProvince(prov);
    }
  };

  // Register form state
  const [regIntentions, setRegIntentions] = useState<HeartLinkIntention[]>(['amizade']);

  // Chat state
  const [chatMessages, setChatMessages] = useState<{ [profileId: string]: { sender: 'user' | 'profile'; text: string; time: string }[] }>({
    'hl-1': [
      { sender: 'profile', text: 'Olá! Prazer em conhecer. Procuro boas conversas e amizades sinceras. Como estás?', time: '10:14' }
    ],
    'hl-5': [
      { sender: 'profile', text: 'Olá! Busco um relacionamento sério e comprometido. De onde falas?', time: '09:30' }
    ]
  });
  const [inputMessage, setInputMessage] = useState('');

  // Moz Provinces & Cities
  const mozProvinces = [
    'Maputo Cidade',
    'Maputo Província',
    'Gaza',
    'Inhambane',
    'Sofala',
    'Manica',
    'Tete',
    'Zambézia',
    'Nampula',
    'Cabo Delgado',
    'Niassa'
  ];

  const mozCities = [
    'Maputo',
    'Matola',
    'Beira',
    'Nampula',
    'Vilankulo',
    'Inhambane',
    'Chimoio',
    'Tete',
    'Pemba'
  ];

  // Strictly 2 Objectives (Conformity with Mozambican law)
  const intentionsList: { id: HeartLinkIntention; label: string; icon: string; desc: string }[] = [
    { id: 'amizade', label: 'Amizade', icon: '🤝', desc: 'Companheirismo e conversas' },
    { id: 'matrimonio', label: 'Matrimónio', icon: '💍', desc: 'Relacionamento sério' },
  ];

  // Toggle Like with KYC check
  const toggleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!verifiedDossier) {
      setPendingAction({ type: 'like' });
      setIsVerificationOpen(true);
      return;
    }
    setLikedProfileIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      localStorage.setItem('onde_dormir_heartlink_likes', JSON.stringify(next));
      return next;
    });
  };

  // Open Chat with KYC Check
  const handleOpenChat = (profile: HeartLinkProfile, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!verifiedDossier) {
      setPendingAction({ type: 'chat', profile });
      setIsVerificationOpen(true);
    } else {
      setSelectedProfile(null);
      setChatProfile(profile);
    }
  };

  // Open WhatsApp with KYC Check
  const handleOpenWhatsApp = (profile: HeartLinkProfile, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!verifiedDossier) {
      setPendingAction({ type: 'whatsapp', profile });
      setIsVerificationOpen(true);
    } else {
      const text = encodeURIComponent(
        `Olá ${profile.name}! Sou ${verifiedDossier.fullName.split(' ')[0]} (Perfil Verificado no HeartLink com BI). Vi o teu perfil e gostaria de conversar!`
      );
      window.open(`https://wa.me/${profile.whatsapp}?text=${text}`, '_blank');
    }
  };

  // Open Register with KYC Check
  const handleOpenRegister = () => {
    if (!verifiedDossier) {
      setPendingAction({ type: 'register' });
      setIsVerificationOpen(true);
    } else {
      setIsRegisterOpen(true);
    }
  };

  // Verification completed callback
  const handleVerificationComplete = (dossier: VerificationDossier) => {
    setVerifiedDossier(dossier);
    if (pendingAction) {
      const action = pendingAction;
      setPendingAction(null);
      if (action.type === 'chat' && action.profile) {
        setSelectedProfile(null);
        setChatProfile(action.profile);
      } else if (action.type === 'whatsapp' && action.profile) {
        const text = encodeURIComponent(
          `Olá ${action.profile.name}! Sou ${dossier.fullName.split(' ')[0]} (Perfil Verificado no HeartLink com BI). Vi o teu perfil e gostaria de conversar!`
        );
        window.open(`https://wa.me/${action.profile.whatsapp}?text=${text}`, '_blank');
      } else if (action.type === 'register') {
        setIsRegisterOpen(true);
      }
    }
  };

  // Filter profiles
  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      // Province filter - strict isolation
      if (selectedProvince !== 'all') {
        const profProv = (profile.province || '').toLowerCase();
        const selProv = selectedProvince.toLowerCase();
        if (selProv === 'maputo cidade' || selProv === 'maputo província') {
          if (profProv !== selProv && profProv !== 'maputo') return false;
        } else if (!profProv.includes(selProv) && !selProv.includes(profProv)) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = profile.name.toLowerCase().includes(q);
        const matchCity = profile.city.toLowerCase().includes(q);
        const matchBio = profile.bio.toLowerCase().includes(q);
        const matchProfession = profile.profession?.toLowerCase().includes(q) || false;
        if (!matchName && !matchCity && !matchBio && !matchProfession) return false;
      }

      if (selectedCity !== 'all' && profile.city !== selectedCity) {
        return false;
      }

      if (selectedGender !== 'all' && profile.gender !== selectedGender) {
        return false;
      }

      if (selectedIntention !== 'all' && !profile.intentions.includes(selectedIntention)) {
        return false;
      }

      if (activeSubTab === 'curtidas' && !likedProfileIds.includes(profile.id)) {
        return false;
      }

      return true;
    });
  }, [profiles, searchQuery, selectedProvince, selectedCity, selectedGender, selectedIntention, activeSubTab, likedProfileIds]);

  const featuredProfiles = useMemo(() => {
    return profiles.filter((p) => p.isFeatured || p.isPremium || p.verified);
  }, [profiles]);

  // Handle register profile
  const handleCreateProfile = (newP: HeartLinkProfile) => {
    setProfiles((prev) => [newP, ...prev]);
    const custom = JSON.parse(localStorage.getItem('onde_dormir_heartlink_profiles') || '[]');
    localStorage.setItem('onde_dormir_heartlink_profiles', JSON.stringify([newP, ...custom]));
    setIsRegisterOpen(false);
  };

  // Handle Send Chat Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !chatProfile) return;

    const newMsg = {
      sender: 'user' as const,
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => ({
      ...prev,
      [chatProfile.id]: [...(prev[chatProfile.id] || []), newMsg]
    }));

    setInputMessage('');

    setTimeout(() => {
      const replies = [
        `Olá! Muito obrigado pela mensagem. Como tem corrido o teu dia em ${chatProfile.city}?`,
        `Podes mandar mensagem no meu WhatsApp (${chatProfile.whatsapp || '84 123 4567'}) para conversarmos melhor! ✨`,
        `Olá! Que bom receber o teu contacto. Conte-me mais sobre si.`
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setChatMessages((prev) => ({
        ...prev,
        [chatProfile.id]: [
          ...(prev[chatProfile.id] || []),
          {
            sender: 'profile',
            text: randomReply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]
      }));
    }, 1000);
  };

  return (
    <div className="pb-32 pt-2 sm:pt-4 max-w-5xl mx-auto px-3.5 sm:px-4 space-y-3.5">
      {/* HeartLink Header */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white p-4 sm:p-5 rounded-3xl shadow-lg relative overflow-hidden">
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
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  Heart<span className="text-pink-200">Link</span>
                </h1>
                <span className="text-[10px] uppercase font-black tracking-wider bg-black/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-300/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-300" />
                  Verificado
                </span>
              </div>
              <p className="text-xs text-pink-100 font-medium">
                Amizade e relacionamentos sérios com segurança mútua
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {verifiedDossier ? (
              <span className="h-10 px-3 bg-emerald-950/80 border border-emerald-400 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Perfil Verificado ({verifiedDossier.fullName.split(' ')[0]})</span>
              </span>
            ) : (
              <button
                onClick={() => {
                  setPendingAction(null);
                  setIsVerificationOpen(true);
                }}
                className="flex-1 sm:flex-none h-10 px-3 bg-amber-400 hover:bg-amber-300 active:scale-95 text-zinc-950 font-black text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Validar Identidade (BI + Foto)</span>
              </button>
            )}

            <button
              onClick={handleOpenRegister}
              className="h-10 px-3.5 bg-white text-rose-600 hover:bg-rose-50 active:scale-95 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Cadastrar</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/20 overflow-x-auto no-scrollbar">
          {[
            { id: 'descobrir', label: 'Descobrir', icon: Sparkles },
            { id: 'pessoas', label: 'Pessoas', icon: Users },
            { id: 'mensagens', label: 'Mensagens', icon: MessageCircle, count: Object.keys(chatMessages).length },
            { id: 'curtidas', label: 'Curtidas', icon: Heart, count: likedProfileIds.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`h-8 px-3 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'fill-rose-700' : ''}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 rounded-full font-bold ${isActive ? 'bg-rose-100 text-rose-700' : 'bg-white/30 text-white'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Security Status Line */}
      <div className="p-2.5 sm:p-3 rounded-2xl bg-rose-50 border border-rose-200/90 flex items-center gap-2 text-xs text-rose-950">
        <ShieldCheck className="w-4 h-4 text-rose-700 shrink-0" />
        <span className="leading-tight">
          <strong>Segurança mútua:</strong> Identidades validadas com BI e reconhecimento facial para proteção e confiança mútua.
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-neutral-200 shadow-2xs space-y-2.5">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Pesquisar por nome, cidade ou bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 sm:h-11 pl-9 pr-8 bg-neutral-50 rounded-xl text-xs sm:text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-rose-400 border border-neutral-200"
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

          {/* Gender Filter */}
          <div className="relative w-full sm:w-32 shrink-0">
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value as any)}
              className="w-full h-10 sm:h-11 px-3 bg-neutral-50 rounded-xl text-xs sm:text-sm font-semibold text-neutral-800 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-rose-400 appearance-none cursor-pointer"
            >
              <option value="all">Género (Todos)</option>
              <option value="feminino">Feminino</option>
              <option value="masculino">Masculino</option>
            </select>
          </div>

          {/* Province Filter */}
          <div className="relative w-full sm:w-40 shrink-0">
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full h-10 sm:h-11 px-3 bg-neutral-50 rounded-xl text-xs sm:text-sm font-semibold text-neutral-800 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-rose-400 appearance-none cursor-pointer"
            >
              <option value="all">Províncias</option>
              {mozProvinces.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
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
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
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
          <div className="flex items-center justify-between bg-rose-50 text-rose-950 px-3 py-1.5 rounded-xl border border-rose-200 text-xs font-semibold">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span className="truncate">Apenas perfis em: <strong>{selectedProvince}</strong> ({filteredProfiles.length})</span>
            </div>
            <button 
              onClick={() => handleProvinceClick('all')}
              className="text-[11px] text-rose-800 font-bold underline hover:text-rose-950 shrink-0 ml-2 cursor-pointer"
            >
              Ver Todas as Províncias
            </button>
          </div>
        )}

        {/* Objectives (Amizade / Matrimónio) */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
          <button
            onClick={() => setSelectedIntention('all')}
            className={`h-8 px-3 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedIntention === 'all'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Todos os Objectivos
          </button>
          {intentionsList.map((intent) => {
            const isSelected = selectedIntention === intent.id;
            return (
              <button
                key={intent.id}
                onClick={() => setSelectedIntention(isSelected ? 'all' : intent.id)}
                className={`h-8 px-2.5 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer border flex items-center gap-1 ${
                  isSelected
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:bg-rose-50'
                }`}
              >
                <span>{intent.icon}</span>
                <span>{intent.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid of Profiles */}
      <div className="space-y-2.5">
        <div className="text-xs text-neutral-600 px-1">
          <strong className="text-neutral-900 font-bold">{filteredProfiles.length}</strong> perfis autenticados
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              onClick={() => setSelectedProfile(profile)}
              className="group bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-4/5 w-full bg-neutral-900 overflow-hidden">
                <img
                  src={profile.photo}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

                <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none">
                  {profile.verified && (
                    <span className="text-[9px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verificado
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => toggleLike(profile.id, e)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      likedProfileIds.includes(profile.id) ? 'fill-rose-500 text-rose-500' : 'text-white'
                    }`}
                  />
                </button>

                <div className="absolute bottom-2 left-2 right-2 text-white">
                  <div className="font-extrabold text-sm truncate">
                    {profile.name}, {profile.age}
                  </div>
                  <div className="text-[11px] text-neutral-200 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-300 shrink-0" />
                    <span className="truncate">{profile.city}</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap gap-1">
                    {profile.intentions.map((intentId) => {
                      const found = intentionsList.find((i) => i.id === intentId);
                      return (
                        <span key={intentId} className="text-[9px] font-bold bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200/60">
                          {found?.icon} {found?.label || intentId}
                        </span>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-neutral-600 line-clamp-2 leading-tight">
                    {profile.bio}
                  </p>
                </div>

                <button
                  onClick={(e) => handleOpenChat(profile, e)}
                  className="w-full h-8 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Conversar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Detail Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200 relative my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="relative aspect-4/3 w-full bg-neutral-900">
              <img
                src={selectedProfile.photo}
                alt={selectedProfile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

              <button
                onClick={() => setSelectedProfile(null)}
                className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer hover:bg-black/80"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black">
                    {selectedProfile.name}, {selectedProfile.age}
                  </h2>
                  {selectedProfile.verified && (
                    <span className="flex items-center gap-1 text-[11px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3" /> Verificado
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-neutral-200">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{selectedProfile.city} • {selectedProfile.province}</span>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3 max-h-[50vh] overflow-y-auto">
              {selectedProfile.profession && (
                <div className="text-xs font-bold text-neutral-800 bg-neutral-100 px-2.5 py-1 rounded-lg w-fit">
                  💼 {selectedProfile.profession}
                </div>
              )}

              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">
                  Sobre Mim
                </h4>
                <p className="text-xs text-neutral-700 leading-relaxed">
                  {selectedProfile.bio}
                </p>
              </div>

              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Objectivo do Perfil
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProfile.intentions.map((intentId) => {
                    const found = intentionsList.find((i) => i.id === intentId);
                    return (
                      <span key={intentId} className="text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <span>{found?.icon}</span>
                        <span>{found?.label || intentId}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-3.5 border-t border-neutral-100 flex items-center gap-2 bg-neutral-50">
              <button
                onClick={(e) => handleOpenChat(selectedProfile, e)}
                className="flex-1 h-11 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Conversar no Chat</span>
              </button>

              {selectedProfile.whatsapp && (
                <button
                  onClick={(e) => handleOpenWhatsApp(selectedProfile, e)}
                  className="h-11 px-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Register Profile Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200 relative my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-rose-600 text-white p-3.5 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 fill-white" />
                <h3 className="font-extrabold text-base">Cadastrar Meu Perfil</h3>
              </div>
              <button
                onClick={() => setIsRegisterOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const name = (form.elements.namedItem('name') as HTMLInputElement).value;
                const age = parseInt((form.elements.namedItem('age') as HTMLInputElement).value, 10);
                const gender = (form.elements.namedItem('gender') as HTMLSelectElement).value as any;
                const city = (form.elements.namedItem('city') as HTMLSelectElement).value;
                const province = (form.elements.namedItem('province') as HTMLSelectElement).value;
                const bio = (form.elements.namedItem('bio') as HTMLTextAreaElement).value;
                const profession = (form.elements.namedItem('profession') as HTMLInputElement).value;
                const whatsapp = (form.elements.namedItem('whatsapp') as HTMLInputElement).value;

                const defaultFemalePhotos = [
                  '/src/assets/images/moz_profile_ana_1790448736252.jpg',
                  '/src/assets/images/moz_profile_lucia_1790448757834.jpg',
                  '/src/assets/images/moz_profile_elisa_1790448779859.jpg',
                ];
                const defaultMalePhotos = [
                  '/src/assets/images/moz_profile_carlos_1790448747366.jpg',
                  '/src/assets/images/moz_profile_joao_1790448768692.jpg',
                ];

                const chosenPhoto = verifiedDossier?.biometricSelfiePhoto || (gender === 'feminino' 
                  ? defaultFemalePhotos[Math.floor(Math.random() * defaultFemalePhotos.length)]
                  : defaultMalePhotos[Math.floor(Math.random() * defaultMalePhotos.length)]);

                const newProfile: HeartLinkProfile = {
                  id: `hl-custom-${Date.now()}`,
                  name,
                  age,
                  gender,
                  city,
                  province,
                  bio,
                  profession,
                  whatsapp,
                  phone: whatsapp,
                  photo: chosenPhoto,
                  intentions: regIntentions.length > 0 ? regIntentions : ['amizade'],
                  verified: true,
                  isPremium: true,
                };

                handleCreateProfile(newProfile);
              }}
              className="p-4 space-y-3 max-h-[75vh] overflow-y-auto"
            >
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Nome ou Apelido *</label>
                <input 
                  name="name" 
                  required 
                  defaultValue={verifiedDossier?.fullName || ''}
                  placeholder="Ex: Tatiana" 
                  className="w-full h-10 px-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs sm:text-sm outline-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Idade *</label>
                  <input name="age" type="number" min="18" max="75" defaultValue="24" required className="w-full h-10 px-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs sm:text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Género *</label>
                  <select name="gender" className="w-full h-10 px-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs outline-none">
                    <option value="feminino">Feminino</option>
                    <option value="masculino">Masculino</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Província *</label>
                  <select 
                    name="province" 
                    defaultValue={verifiedDossier?.province || 'Maputo Cidade'}
                    className="w-full h-10 px-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs outline-none"
                  >
                    {mozProvinces.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Cidade *</label>
                  <select 
                    name="city" 
                    defaultValue={verifiedDossier?.city || 'Maputo'}
                    className="w-full h-10 px-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs outline-none"
                  >
                    {mozCities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Strict 2 Objectives Selector */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Objectivo Principal *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {intentionsList.map((intent) => {
                    const isChecked = regIntentions.includes(intent.id);
                    return (
                      <button
                        key={intent.id}
                        type="button"
                        onClick={() => {
                          setRegIntentions((prev) => 
                            prev.includes(intent.id)
                              ? prev.filter((i) => i !== intent.id)
                              : [...prev, intent.id]
                          );
                        }}
                        className={`p-2 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-rose-50 border-rose-600 text-rose-900 ring-1 ring-rose-600'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-xs flex items-center gap-1">
                            <span>{intent.icon}</span>
                            <span>{intent.label}</span>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isChecked ? 'bg-rose-600 border-rose-600 text-white' : 'border-neutral-300'
                        }`}>
                          {isChecked && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">WhatsApp Directo *</label>
                <input 
                  name="whatsapp" 
                  required 
                  defaultValue={verifiedDossier?.whatsapp || ''}
                  placeholder="Ex: 841234567" 
                  className="w-full h-10 px-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs sm:text-sm outline-none" 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Sobre Mim *</label>
                <textarea name="bio" required rows={2} placeholder="Descreva um pouco sobre si..." className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs outline-none resize-none" />
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
              >
                Publicar Meu Perfil Verificado
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Chat Window Modal */}
      {chatProfile && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full h-[85vh] max-h-[560px] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Chat Header */}
            <div className="bg-rose-600 text-white p-3 flex items-center justify-between shadow-xs shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/40 shrink-0">
                  <img src={chatProfile.photo} alt={chatProfile.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="font-extrabold text-sm truncate flex items-center gap-1">
                    <span>{chatProfile.name}</span>
                    {chatProfile.verified && <CheckCircle2 className="w-3 h-3 text-emerald-300 shrink-0" />}
                  </div>
                  <div className="text-[10px] text-pink-100 truncate">
                    {chatProfile.city} • Conversa Segura
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {chatProfile.whatsapp && (
                  <button
                    onClick={() => handleOpenWhatsApp(chatProfile)}
                    className="w-7 h-7 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center cursor-pointer shadow-xs"
                    title="WhatsApp"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setChatProfile(null)}
                  className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-neutral-50/50">
              <div className="text-center my-1">
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  Identidades Verificadas com BI
                </span>
              </div>

              {(chatMessages[chatProfile.id] || [
                { sender: 'profile', text: `Olá! Prazer em conhecer. Como estás?`, time: 'Agora' }
              ]).map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-1.5 text-xs shadow-2xs ${
                      msg.sender === 'user'
                        ? 'bg-rose-600 text-white rounded-tr-xs'
                        : 'bg-white text-neutral-800 border border-neutral-200 rounded-tl-xs'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <span
                      className={`text-[9px] block text-right mt-0.5 ${
                        msg.sender === 'user' ? 'text-rose-200' : 'text-neutral-400'
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-2.5 bg-white border-t border-neutral-200 flex items-center gap-1.5">
              <input
                type="text"
                placeholder="Escreva uma mensagem..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 h-10 px-3 bg-neutral-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-rose-400"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="w-10 h-10 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white flex items-center justify-center cursor-pointer transition-colors shrink-0 shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Biometric KYC Modal for HeartLink */}
      <BiometricVerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        purpose="heartlink"
        targetItemName={pendingAction?.profile?.name}
        onVerificationComplete={handleVerificationComplete}
      />
    </div>
  );
};
