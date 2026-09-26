import React, { useState, useMemo } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Search, 
  MapPin, 
  CheckCircle2, 
  Crown, 
  Sparkles, 
  Plus, 
  X, 
  Send, 
  Phone, 
  ShieldCheck, 
  Flame, 
  Users, 
  ArrowRight, 
  ChevronDown, 
  Check,
  Lock,
  Unlock,
  KeyRound,
  ShieldAlert,
  Smartphone,
  Bed
} from 'lucide-react';
import { HeartLinkProfile, HeartLinkIntention, Accommodation, VipPlanId, VipSubscription } from '../types';
import { INITIAL_HEARTLINK_PROFILES } from '../data/heartLinkProfiles';
import { TermsModal } from './TermsModal';

interface HeartLinkTabProps {
  onBackToHome?: () => void;
  accommodations?: Accommodation[];
  onSelectAccommodation?: (item: Accommodation) => void;
  onNavigateToExplore?: () => void;
}

export const HeartLinkTab: React.FC<HeartLinkTabProps> = ({ 
  accommodations = [],
  onSelectAccommodation,
  onNavigateToExplore
}) => {
  // Profiles stored in state + localStorage
  const [profiles, setProfiles] = useState<HeartLinkProfile[]>(() => {
    const saved = localStorage.getItem('onde_dormir_heartlink_custom_profiles');
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

  // Paid Anti-Fake Activation State
  const [vipSubscription, setVipSubscription] = useState<VipSubscription>(() => {
    const saved = localStorage.getItem('onde_dormir_heartlink_vip');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return { isUnlocked: false };
      }
    }
    return { isUnlocked: false };
  });

  const [likedProfileIds, setLikedProfileIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('onde_dormir_heartlink_likes');
    return saved ? JSON.parse(saved) : ['hl-1', 'hl-5'];
  });

  const [activeSubTab, setActiveSubTab] = useState<'descobrir' | 'pessoas' | 'mensagens' | 'curtidas'>('descobrir');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<'all' | 'feminino' | 'masculino'>('all');
  const [selectedIntention, setSelectedIntention] = useState<HeartLinkIntention | 'all'>('all');
  
  // Modals
  const [selectedProfile, setSelectedProfile] = useState<HeartLinkProfile | null>(null);
  const [chatProfile, setChatProfile] = useState<HeartLinkProfile | null>(null);
  const [isVipPaymentOpen, setIsVipPaymentOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<VipPlanId>('pass_mes');

  // M-Pesa / e-Mola Payment form state
  const [paymentPhone, setPaymentPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'emola'>('mpesa');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessStep, setPaymentSuccessStep] = useState(false);
  const [promoCode, setPromoCode] = useState('');

  // Chat state
  const [chatMessages, setChatMessages] = useState<{ [profileId: string]: { sender: 'user' | 'profile'; text: string; time: string }[] }>({
    'hl-1': [
      { sender: 'profile', text: 'Olá! Atendo com total discrição em guest houses parceiras na Polana. Em que zona estás?', time: '10:14' }
    ],
    'hl-5': [
      { sender: 'profile', text: 'Olá! Podemos combinar um encontro reservado. Qual o melhor horário para si?', time: '09:30' }
    ]
  });
  const [inputMessage, setInputMessage] = useState('');

  // Toggle Like
  const toggleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!vipSubscription.isUnlocked) {
      setIsVipPaymentOpen(true);
      return;
    }
    setLikedProfileIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      localStorage.setItem('onde_dormir_heartlink_likes', JSON.stringify(next));
      return next;
    });
  };

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

  // Intentions
  const intentionsList: { id: HeartLinkIntention; label: string; icon: string }[] = [
    { id: 'encontro_intimo', label: 'Encontro Íntimo', icon: '🔥' },
    { id: 'convivio_guesthouse', label: 'Convívio em Guest House', icon: '🏨' },
    { id: 'acompanhamento_vip', label: 'Acompanhamento VIP', icon: '👑' },
    { id: 'relacionamento_discreto', label: 'Relação Discreta', icon: '🔒' },
    { id: 'namoro', label: 'Namoro & Amizade', icon: '💖' },
  ];

  // Filter profiles
  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = profile.name.toLowerCase().includes(q);
        const matchCity = profile.city.toLowerCase().includes(q);
        const matchBio = profile.bio.toLowerCase().includes(q);
        const matchProfession = profile.profession?.toLowerCase().includes(q) || false;
        if (!matchName && !matchCity && !matchBio && !matchProfession) return false;
      }

      if (selectedProvince !== 'all' && profile.province !== selectedProvince) {
        return false;
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

  // Process VIP / Anti-Fake Payment
  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccessStep(true);

      const sub: VipSubscription = {
        isUnlocked: true,
        planId: selectedPlanForPayment,
        planName: selectedPlanForPayment === 'pass_24h' 
          ? 'Passe 24 Horas (150 MT)' 
          : selectedPlanForPayment === 'pass_semana' 
          ? 'Passe 7 Dias (350 MT)' 
          : 'Passe Mensal VIP (1.000 MT)',
        unlockedAt: new Date().toISOString(),
        phone: paymentPhone,
        paymentMethod: paymentMethod
      };

      setVipSubscription(sub);
      localStorage.setItem('onde_dormir_heartlink_vip', JSON.stringify(sub));

      setTimeout(() => {
        setIsVipPaymentOpen(false);
        setPaymentSuccessStep(false);
      }, 1400);
    }, 1400);
  };

  // Promo Code Instant Bypass (for testing)
  const handlePromoUnlock = () => {
    if (['VIPMZ', 'DISCRETO', 'TESTE', 'ONDE', '1000'].includes(promoCode.trim().toUpperCase())) {
      const sub: VipSubscription = {
        isUnlocked: true,
        planId: 'pass_mes',
        planName: 'Acesso VIP Validado',
        unlockedAt: new Date().toISOString(),
        paymentMethod: 'mpesa'
      };
      setVipSubscription(sub);
      localStorage.setItem('onde_dormir_heartlink_vip', JSON.stringify(sub));
      setIsVipPaymentOpen(false);
    }
  };

  // Handle register profile
  const handleCreateProfile = (newP: HeartLinkProfile) => {
    setProfiles((prev) => [newP, ...prev]);
    const custom = JSON.parse(localStorage.getItem('onde_dormir_heartlink_custom_profiles') || '[]');
    localStorage.setItem('onde_dormir_heartlink_custom_profiles', JSON.stringify([newP, ...custom]));
    setIsRegisterOpen(false);
  };

  // Handle send message
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
        `Olá! Muito obrigado pelo contacto. Em que Guest House ou zona de ${chatProfile.city} preferes o nosso encontro?`,
        `Podes mandar mensagem no meu WhatsApp (${chatProfile.whatsapp || '84 123 4567'}) para acertarmos o quarto reservado! ✨`,
        `Olá! Estou disponível com total discrição e sigilo. Como combinamos?`
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
    <div className="pb-32 pt-2 sm:pt-4 max-w-5xl mx-auto px-3.5 sm:px-4 space-y-4 sm:space-y-5">
      {/* HeartLink Header with Security Guarantee */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white p-4 sm:p-5 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner shrink-0">
              <Heart className="w-7 h-7 fill-white text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  Heart<span className="text-pink-200">Link</span>
                </h1>
                <span className="text-[11px] uppercase font-black tracking-wider bg-black/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-300/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                  100% Perfis Reais
                </span>
              </div>
              <p className="text-xs sm:text-sm text-pink-100 font-medium mt-0.5">
                Encontros discretos e convívio reservado com perfis autenticados
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {vipSubscription.isUnlocked ? (
              <span className="h-11 px-4 bg-emerald-950/80 border border-emerald-400 text-emerald-300 text-xs sm:text-sm font-black rounded-xl flex items-center gap-2">
                <Unlock className="w-4 h-4 text-emerald-400" />
                <span>Passe Ativo & Verificado</span>
              </span>
            ) : (
              <button
                onClick={() => setIsVipPaymentOpen(true)}
                className="flex-1 sm:flex-none h-11 px-4 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 active:scale-95 text-zinc-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
              >
                <KeyRound className="w-4 h-4" />
                <span>Desbloquear Acesso Pago</span>
              </button>
            )}

            <button
              onClick={() => {
                if (!vipSubscription.isUnlocked) {
                  setIsVipPaymentOpen(true);
                } else {
                  setIsRegisterOpen(true);
                }
              }}
              className="h-11 px-4 bg-white text-rose-600 hover:bg-rose-50 active:scale-95 font-black text-xs sm:text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 touch-manipulation"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Perfil</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-white/20 overflow-x-auto no-scrollbar">
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
                className={`h-10 px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-white text-rose-700 shadow-sm'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'fill-rose-700' : ''}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-rose-100 text-rose-700' : 'bg-white/30 text-white'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Anti-Fake Notice Banner */}
      {!vipSubscription.isUnlocked && (
        <div className="rounded-3xl p-4 sm:p-5 bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/15 border-2 border-amber-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-zinc-950 flex items-center justify-center shrink-0 shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-neutral-950 leading-tight">
                Proteção Anti-Fraude & Contas Falsas
              </h3>
              <p className="text-xs sm:text-sm text-neutral-700 mt-0.5 leading-relaxed">
                Para eliminar contas falsas, burladores e perfis não verificados, o acesso e chat no HeartLink são ativados via M-Pesa / e-Mola.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsVipPaymentOpen(true)}
            className="h-10 px-4 bg-amber-400 hover:bg-amber-300 active:scale-95 text-zinc-950 font-black text-xs sm:text-sm rounded-xl shadow-xs cursor-pointer shrink-0"
          >
            Ativar Passe Seguro
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-neutral-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Pesquisar por nome, cidade ou biografia..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-10 bg-neutral-50 rounded-2xl text-sm sm:text-base text-neutral-800 focus:outline-none focus:ring-2 focus:ring-rose-400 border border-neutral-200"
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

          {/* Gender Filter */}
          <div className="relative w-full sm:w-36 shrink-0">
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value as any)}
              className="w-full h-12 px-3.5 bg-neutral-50 rounded-2xl text-xs sm:text-sm font-semibold text-neutral-800 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-rose-400 appearance-none cursor-pointer"
            >
              <option value="all">Género (Todos)</option>
              <option value="feminino">Feminino</option>
              <option value="masculino">Masculino</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          </div>

          {/* Province */}
          <div className="relative w-full sm:w-44 shrink-0">
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full h-12 px-3.5 bg-neutral-50 rounded-2xl text-xs sm:text-sm font-semibold text-neutral-800 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-rose-400 appearance-none cursor-pointer"
            >
              <option value="all">Província (Todas)</option>
              {mozProvinces.map((prov) => (
                <option key={prov} value={prov}>{prov}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          </div>

          {/* City */}
          <div className="relative w-full sm:w-40 shrink-0">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full h-12 px-3.5 bg-neutral-50 rounded-2xl text-xs sm:text-sm font-semibold text-neutral-800 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-rose-400 appearance-none cursor-pointer"
            >
              <option value="all">Cidade (Todas)</option>
              {mozCities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          </div>
        </div>

        {/* Intention Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pt-1">
          <button
            onClick={() => setSelectedIntention('all')}
            className={`h-10 px-4 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all cursor-pointer active:scale-95 ${
              selectedIntention === 'all'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Todos os Objetivos
          </button>
          {intentionsList.map((intent) => {
            const isSelected = selectedIntention === intent.id;
            return (
              <button
                key={intent.id}
                onClick={() => setSelectedIntention(isSelected ? 'all' : intent.id)}
                className={`h-10 px-3.5 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all cursor-pointer border active:scale-95 ${
                  isSelected
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:bg-rose-50'
                }`}
              >
                <span>{intent.icon} {intent.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Profiles Section */}
      {activeSubTab === 'descobrir' && featuredProfiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-base font-black text-neutral-950">
              <Flame className="w-5 h-5 text-rose-500 fill-rose-500" />
              <span>Destaques Autenticados</span>
            </div>
            <button
              onClick={() => setActiveSubTab('pessoas')}
              className="text-xs sm:text-sm font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {featuredProfiles.slice(0, 4).map((profile) => (
              <div
                key={profile.id}
                onClick={() => setSelectedProfile(profile)}
                className={`group relative bg-white rounded-3xl border overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col ${
                  profile.isPremium ? 'border-amber-300 ring-2 ring-amber-400/20' : 'border-neutral-200'
                }`}
              >
                <div className="relative aspect-4/5 w-full bg-neutral-900 overflow-hidden">
                  <img
                    src={profile.photo}
                    alt={profile.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 pointer-events-none">
                    {profile.verified && (
                      <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-lg shadow-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verificado
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => toggleLike(profile.id, e)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        likedProfileIds.includes(profile.id) ? 'fill-rose-500 text-rose-500' : 'text-white'
                      }`}
                    />
                  </button>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <div className="font-extrabold text-sm sm:text-base truncate">
                      {profile.name}, {profile.age}
                    </div>
                    <div className="text-xs text-neutral-200 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-300 shrink-0" />
                      <span className="truncate">{profile.city}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between space-y-2.5">
                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                    {profile.bio}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (vipSubscription.isUnlocked) {
                        setChatProfile(profile);
                      } else {
                        setIsVipPaymentOpen(true);
                      }
                    }}
                    className="w-full h-9 sm:h-10 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    {vipSubscription.isUnlocked ? (
                      <>
                        <MessageCircle className="w-4 h-4" />
                        <span>Conversar</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-amber-300" />
                        <span>Desbloquear Chat</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid of Profiles */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs sm:text-sm text-neutral-600">
            <strong className="text-neutral-900 font-bold">{filteredProfiles.length}</strong> perfis autenticados em Moçambique
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
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
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 pointer-events-none">
                  {profile.verified && (
                    <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-lg shadow-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verificado
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => toggleLike(profile.id, e)}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      likedProfileIds.includes(profile.id) ? 'fill-rose-500 text-rose-500' : 'text-white'
                    }`}
                  />
                </button>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <div className="font-extrabold text-sm sm:text-base truncate">
                    {profile.name}, {profile.age}
                  </div>
                  <div className="text-xs text-neutral-200 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-300 shrink-0" />
                    <span className="truncate">{profile.city}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed">
                  {profile.bio}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (vipSubscription.isUnlocked) {
                      setChatProfile(profile);
                    } else {
                      setIsVipPaymentOpen(true);
                    }
                  }}
                  className="w-full h-10 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  {vipSubscription.isUnlocked ? (
                    <>
                      <MessageCircle className="w-4 h-4" />
                      <span>Conversar</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-amber-300" />
                      <span>Desbloquear Chat</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Detail Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-200 relative my-auto animate-in fade-in zoom-in-95 duration-150">
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
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer hover:bg-black/80"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black">
                    {selectedProfile.name}, {selectedProfile.age}
                  </h2>
                  {selectedProfile.verified && (
                    <span className="flex items-center gap-1 text-xs font-black bg-emerald-500 text-white px-2.5 py-0.5 rounded-lg shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verificado
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-200">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>{selectedProfile.city} • {selectedProfile.province}</span>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4 max-h-[50vh] overflow-y-auto">
              {selectedProfile.profession && (
                <div className="text-xs sm:text-sm font-bold text-neutral-800 bg-neutral-100 px-3 py-1.5 rounded-xl w-fit">
                  💼 {selectedProfile.profession}
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Sobre Mim
                </h4>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                  {selectedProfile.bio}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Objectivos & Preferências
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProfile.intentions.map((intentId) => {
                    const found = intentionsList.find((i) => i.id === intentId);
                    return (
                      <span key={intentId} className="text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-xl">
                        {found?.icon} {found?.label || intentId}
                      </span>
                    );
                  })}
                </div>
              </div>

              {selectedProfile.encounterRate && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-neutral-600 font-medium">Contribuição / Acordo Indicativo:</span>
                  <span className="font-black text-neutral-900 text-sm sm:text-base">
                    A partir de {selectedProfile.encounterRate.toLocaleString('pt-MZ')} MT
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-neutral-100 flex items-center gap-2.5 bg-neutral-50">
              <button
                onClick={() => {
                  const p = selectedProfile;
                  if (!vipSubscription.isUnlocked) {
                    setIsVipPaymentOpen(true);
                  } else {
                    setSelectedProfile(null);
                    setChatProfile(p);
                  }
                }}
                className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md cursor-pointer touch-manipulation"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Conversar no Chat</span>
              </button>

              {selectedProfile.whatsapp && (
                <a
                  href={vipSubscription.isUnlocked ? `https://wa.me/${selectedProfile.whatsapp}?text=Ol%C3%A1%20${encodeURIComponent(selectedProfile.name)}%2C%20vi%20o%20teu%20perfil%20no%20HeartLink%20do%20Onde%20Dormir!` : '#'}
                  onClick={(e) => {
                    if (!vipSubscription.isUnlocked) {
                      e.preventDefault();
                      setIsVipPaymentOpen(true);
                    }
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Paid Activation Modal (M-Pesa / e-Mola) */}
      {isVipPaymentOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200 relative my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-amber-300" />
                <div>
                  <h3 className="font-black text-base sm:text-lg leading-tight">Ativação Segura HeartLink</h3>
                  <span className="text-xs opacity-90">Eliminação de contas falsas e burlas</span>
                </div>
              </div>
              <button
                onClick={() => setIsVipPaymentOpen(false)}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {paymentSuccessStep ? (
              <div className="p-6 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-base sm:text-lg font-black text-neutral-900">Acesso Autenticado com Sucesso!</h4>
                <p className="text-xs sm:text-sm text-neutral-600">
                  Os perfis reais e chat direto foram desbloqueados.
                </p>
              </div>
            ) : (
              <form onSubmit={handleProcessPayment} className="p-4 sm:p-5 space-y-4">
                {/* Plan options */}
                <div>
                  <label className="text-xs sm:text-sm font-bold text-neutral-700 block mb-2">
                    Escolha o Seu Passe de Autenticação:
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'pass_24h' as VipPlanId, title: 'Passe 24 Horas', price: '150 MT', desc: 'Acesso rápido para encontros de hoje' },
                      { id: 'pass_semana' as VipPlanId, title: 'Passe 7 Dias (Mais Popular)', price: '350 MT', desc: '1 semana de chat e contactos reais' },
                      { id: 'pass_mes' as VipPlanId, title: 'Passe Mensal VIP', price: '1.000 MT', desc: '30 dias + destaque no topo' }
                    ].map((plan) => (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlanForPayment(plan.id)}
                        className={`p-3 rounded-2xl border text-xs sm:text-sm flex items-center justify-between cursor-pointer transition-all ${
                          selectedPlanForPayment === plan.id
                            ? 'bg-rose-50 border-rose-500 text-rose-950 font-bold ring-2 ring-rose-400/20'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-neutral-900">{plan.title}</div>
                          <div className="text-[11px] text-neutral-500">{plan.desc}</div>
                        </div>
                        <span className="text-rose-600 font-black text-sm sm:text-base shrink-0">{plan.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="text-xs sm:text-sm font-bold text-neutral-700 block mb-1.5">
                    Método de Pagamento:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('mpesa')}
                      className={`h-11 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        paymentMethod === 'mpesa' ? 'bg-red-600 text-white border-red-600 shadow-xs' : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                      }`}
                    >
                      M-Pesa
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('emola')}
                      className={`h-11 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        paymentMethod === 'emola' ? 'bg-orange-600 text-white border-orange-600 shadow-xs' : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                      }`}
                    >
                      e-Mola
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-bold text-neutral-700 block mb-1">
                    Número de Celular Moçambique *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: 84 123 4567"
                    value={paymentPhone}
                    onChange={(e) => setPaymentPhone(e.target.value)}
                    className="w-full h-11 px-3.5 bg-neutral-50 rounded-xl text-sm border border-neutral-200 focus:ring-2 focus:ring-rose-400 outline-none"
                  />
                </div>

                {/* Promo Code bypass */}
                <div className="pt-1 flex gap-2">
                  <input
                    type="text"
                    placeholder="Código promocional ou teste"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 h-10 px-3 bg-neutral-100 rounded-xl text-xs border border-neutral-200 outline-none uppercase"
                  />
                  <button
                    type="button"
                    onClick={handlePromoUnlock}
                    className="h-10 px-3 bg-neutral-800 text-white rounded-xl text-xs font-bold hover:bg-neutral-900 cursor-pointer"
                  >
                    Validar
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full h-12 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-black text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <span>A processar no telemóvel...</span>
                  ) : (
                    <span>Confirmar Pagamento e Desbloquear</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Register Profile Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-200 relative my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-rose-600 text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Heart className="w-6 h-6 fill-white" />
                <div>
                  <h3 className="font-black text-base sm:text-lg leading-tight">Cadastrar Meu Perfil Real</h3>
                  <span className="text-xs opacity-90">Verificação obrigatória anti-contas falsas</span>
                </div>
              </div>
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

                const chosenPhoto = gender === 'feminino' 
                  ? defaultFemalePhotos[Math.floor(Math.random() * defaultFemalePhotos.length)]
                  : defaultMalePhotos[Math.floor(Math.random() * defaultMalePhotos.length)];

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
                  intentions: ['encontro_intimo', 'convivio_guesthouse'],
                  verified: true,
                  isPremium: true,
                };

                handleCreateProfile(newProfile);
              }}
              className="p-5 space-y-3.5 max-h-[75vh] overflow-y-auto"
            >
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Nome ou Apelido *</label>
                <input name="name" required placeholder="Ex: Tatiana" className="w-full h-11 px-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Idade *</label>
                  <input name="age" type="number" min="18" max="75" defaultValue="23" required className="w-full h-11 px-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Género *</label>
                  <select name="gender" className="w-full h-11 px-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm outline-none">
                    <option value="feminino">Feminino</option>
                    <option value="masculino">Masculino</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Província *</label>
                  <select name="province" className="w-full h-11 px-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm outline-none">
                    {mozProvinces.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Cidade *</label>
                  <select name="city" className="w-full h-11 px-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm outline-none">
                    {mozCities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Profissão / Ocupação</label>
                <input name="profession" placeholder="Ex: Estudante / Relações Públicas" className="w-full h-11 px-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm outline-none" />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">WhatsApp para Contacto Directo *</label>
                <input name="whatsapp" required placeholder="Ex: 258841234567" className="w-full h-11 px-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm outline-none" />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Biografia e Preferências *</label>
                <textarea name="bio" required rows={3} placeholder="Fale sobre si e as suas preferências com discrição..." className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm outline-none resize-none" />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-12 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-black text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-5 h-5" />
                  <span>Publicar Perfil Verificado</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Direct Chat Modal */}
      {chatProfile && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full h-[85vh] max-h-[650px] flex flex-col overflow-hidden shadow-2xl border border-neutral-200">
            {/* Chat Top Bar */}
            <div className="bg-rose-600 text-white p-3.5 px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={chatProfile.photo}
                  alt={chatProfile.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-white"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm sm:text-base leading-tight">
                      {chatProfile.name}
                    </h3>
                    {chatProfile.verified && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    )}
                  </div>
                  <span className="text-[11px] text-pink-100 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Online • {chatProfile.city}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {chatProfile.whatsapp && (
                  <a
                    href={`https://wa.me/${chatProfile.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center cursor-pointer hover:bg-emerald-600 active:scale-90"
                    title="Chamar no WhatsApp"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => setChatProfile(null)}
                  className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center cursor-pointer hover:bg-white/30"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-neutral-50">
              {(chatMessages[chatProfile.id] || []).map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs sm:text-sm ${
                      msg.sender === 'user'
                        ? 'bg-rose-600 text-white rounded-br-xs'
                        : 'bg-white text-neutral-800 border border-neutral-200 rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-neutral-400 mt-0.5 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2">
              <input
                type="text"
                placeholder="Escreva uma mensagem respeitosa..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 h-11 px-4 bg-neutral-100 rounded-2xl text-xs sm:text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-rose-400"
              />
              <button
                type="submit"
                className="w-11 h-11 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white flex items-center justify-center cursor-pointer shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Terms modal */}
      {isTermsOpen && <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />}
    </div>
  );
};
