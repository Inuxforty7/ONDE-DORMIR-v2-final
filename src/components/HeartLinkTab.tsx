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
  UserCheck,
  Eye,
  EyeOff,
  Clock,
  Zap,
  Home,
  Briefcase,
  ChevronDown,
  ChevronUp,
  HeartHandshake,
  Gem,
  Crown
} from 'lucide-react';
import { HeartLinkProfile, HeartLinkIntention, ContactAvailability, Accommodation, UserLocationState } from '../types';
import { INITIAL_HEARTLINK_PROFILES } from '../data/heartLinkProfiles';
import { BiometricVerificationModal, VerificationDossier } from './BiometricVerificationModal';
import { MOZ_PROVINCES_LIST } from './ExploreTab';
import { HeartLinkTwoHeartsIcon, TwoWeddingRingsIcon, TwoFriendsEmblemIcon } from './HeartLinkLogo';
import { ConfirmedConnectionsCard } from './HeartLinkConfirmedEmblems';
import { HeartLinkVisibilityModal, UserVisibilityData } from './HeartLinkVisibilityModal';
import { HeartLinkBubblingHearts } from './HeartLinkBubblingHearts';
import { HeartLinkP2PCapsule } from './HeartLinkP2PCapsule';
import { HeartLinkMediaManager, HeartLinkMediaState } from './HeartLinkMediaManager';
import { HeartLinkMediaGallery } from './HeartLinkMediaGallery';
import { 
  HeartLinkContactAvailabilitySection, 
  HeartLinkContactMiniBadges, 
  DEFAULT_CONTACT_AVAILABILITY 
} from './HeartLinkContactAvailability';
import { HeartLinkContactConfigurator } from './HeartLinkContactConfigurator';
import { getPlatformTenureText } from '../utils/tenure';
import { contactUnlockService } from '../services/contactUnlockService';
import { heartLinkService, FriendshipRecord, MarriageRecord, P2PTier, P2PGroupMessage } from '../services/heartLinkService';
import { heartLinkAccessService, HeartLinkPlanId, HeartLinkNotification } from '../services/heartLinkAccessService';
import { useVisitAnalytics, formatVisitCount } from '../services/analyticsService';

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
  const { getModuleCount } = useVisitAnalytics();
  const [profiles, setProfiles] = useState<HeartLinkProfile[]>(() => {
    const saved = localStorage.getItem('onde_dormir_heartlink_profiles');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const cleanCustom = parsed.filter((p: HeartLinkProfile) => !p.id.startsWith('hl-'));
        return [...cleanCustom, ...INITIAL_HEARTLINK_PROFILES];
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

  const [activeSubTab, setActiveSubTab] = useState<'pessoas' | 'amizades' | 'namoros' | 'confirmados' | 'confirmadas'>('pessoas');
  const [searchQuery, setSearchQuery] = useState('');

  // Real Persistent Friendships & Marriages
  const [friendships, setFriendships] = useState<FriendshipRecord[]>(() => heartLinkService.getFriendships());
  const [marriages, setMarriages] = useState<MarriageRecord[]>(() => heartLinkService.getMarriages());
  const [isConfirmFriendshipModalOpen, setIsConfirmFriendshipModalOpen] = useState(false);
  const [isConfirmMarriageModalOpen, setIsConfirmMarriageModalOpen] = useState(false);
  const [selectedFriendshipTargetId, setSelectedFriendshipTargetId] = useState<string>('');
  const [selectedMarriageTargetId, setSelectedMarriageTargetId] = useState<string>('');
  const [friendshipFeedback, setFriendshipFeedback] = useState<string | null>(null);
  const [marriageFeedback, setMarriageFeedback] = useState<string | null>(null);

  // Compact P2P Chat State
  const [activeP2PGroupModal, setActiveP2PGroupModal] = useState<P2PTier | null>(null);
  const [p2pModalPlanTarget, setP2PModalPlanTarget] = useState<'vis_24h' | 'vis_7d' | 'vis_30d'>('vis_24h');
  const [p2pTab, setP2PTab] = useState<'chat' | 'contactos'>('chat');
  const [p2pMessages, setP2PMessages] = useState<Record<P2PTier, P2PGroupMessage[]>>(() => ({
    heart: heartLinkService.getP2PMessages('heart'),
    diamond: heartLinkService.getP2PMessages('diamond'),
    king: heartLinkService.getP2PMessages('king'),
  }));
  const [p2pInputText, setP2PInputText] = useState('');
  
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
  const [targetUnlockProfile, setTargetUnlockProfile] = useState<HeartLinkProfile | null>(null);
  const [chatProfile, setChatProfile] = useState<HeartLinkProfile | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isVisibilityModalOpen, setIsVisibilityModalOpen] = useState(false);
  const [regVisibilityMode, setRegVisibilityMode] = useState<'anonymous' | 'public'>('anonymous');
  const [pendingAction, setPendingAction] = useState<{ type: 'chat' | 'whatsapp' | 'register' | 'like'; profile?: HeartLinkProfile } | null>(null);

  // Authoritative HeartLink Contact Access state
  const [accessState, setAccessState] = useState(() => heartLinkAccessService.getAccessStatus());

  // Real HeartLink Contact Notifications
  const [hlNotifications, setHlNotifications] = useState<HeartLinkNotification[]>(() => 
    heartLinkAccessService.getNotifications()
  );

  React.useEffect(() => {
    const unsubAccess = heartLinkAccessService.subscribe(() => {
      setAccessState(heartLinkAccessService.getAccessStatus());
      setHlNotifications(heartLinkAccessService.getNotifications());
    });
    return unsubAccess;
  }, []);

  const unreadContactNotif = useMemo(() => {
    return hlNotifications.find((n) => !n.read) || null;
  }, [hlNotifications]);

  const handleRespondToNotification = (notif: HeartLinkNotification) => {
    heartLinkAccessService.markNotificationAsRead(notif.id);
    const hasPaidPlan = heartLinkAccessService.hasActiveMonthlyPlan() || heartLinkAccessService.canContactUser(notif.contactId);
    const target = profiles.find((p) => p.id === notif.contactId) || ({
      id: notif.contactId,
      name: notif.contactName,
      photo: notif.contactPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      city: 'Maputo',
      province: 'Maputo Cidade',
      gender: 'feminino',
      age: 26,
      bio: 'Perfil no HeartLink',
      intentions: ['namoro_serio'],
      verified: true,
      registeredAt: new Date().toISOString(),
    } as unknown as HeartLinkProfile);

    if (!hasPaidPlan) {
      setTargetUnlockProfile(target);
      setPendingAction({ type: 'chat', profile: target });
      setIsVisibilityModalOpen(true);
    } else {
      setSelectedProfile(null);
      setChatProfile(target);
    }
  };

  // HeartLink Profile Media State (4 photo slots + 1 video slot)
  const [regMedia, setRegMedia] = useState<HeartLinkMediaState>({
    photos: [null, null, null, null],
    video: null,
    videoDuration: undefined,
  });

  // User Contact Access Plan & Privacy State
  const [userVisibility, setUserVisibility] = useState<UserVisibilityData>(() => {
    const saved = localStorage.getItem('onde_dormir_heartlink_visibility');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.expiresAt && new Date(parsed.expiresAt).getTime() < Date.now()) {
          return { ...parsed, isUnlocked: false };
        }
        return parsed;
      } catch (e) {
        // fallback
      }
    }
    return {
      mode: 'public_showcase',
      isUnlocked: false
    };
  });

  // User's own registered profile
  const [myProfile, setMyProfile] = useState<HeartLinkProfile | null>(() => {
    const saved = localStorage.getItem('onde_dormir_my_heartlink_profile');
    return saved ? JSON.parse(saved) : null;
  });

  // HeartLink Contact Availability State for profile owner configuration
  const [regContactAvailability, setRegContactAvailability] = useState<ContactAvailability>(
    () => myProfile?.contactAvailability || DEFAULT_CONTACT_AVAILABILITY
  );

  const handleSaveVisibility = (updated: UserVisibilityData) => {
    setUserVisibility(updated);
    localStorage.setItem('onde_dormir_heartlink_visibility', JSON.stringify(updated));
    if (myProfile) {
      const updatedProfile: HeartLinkProfile = {
        ...myProfile,
        isPubliclyVisible: updated.mode !== 'anonymous',
        isContactUnlocked: updated.isUnlocked,
        visibilityBadge: updated.isUnlocked ? (updated.planName || 'Contacto Ativo') : undefined,
        visibilityExpiresAt: updated.expiresAt
      };
      setMyProfile(updatedProfile);
      localStorage.setItem('onde_dormir_my_heartlink_profile', JSON.stringify(updatedProfile));
    }
  };

  const handleToggleAnonymous = () => {
    const nextMode = userVisibility.mode === 'public_showcase' ? 'anonymous' : 'public_showcase';
    const updated: UserVisibilityData = {
      ...userVisibility,
      mode: nextMode
    };
    handleSaveVisibility(updated);
  };

  const calculateRemainingTime = (expiresAt?: string) => {
    if (!expiresAt) return '';
    const diffMs = new Date(expiresAt).getTime() - Date.now();
    if (diffMs <= 0) return 'Expirado';
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} dias e ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  const [verifiedDossier, setVerifiedDossier] = useState<VerificationDossier | null>(() => {
    const saved = localStorage.getItem('onde_dormir_user_verification_dossier');
    return saved ? JSON.parse(saved) : null;
  });

  const [expandedProfileSections, setExpandedProfileSections] = useState<{
    about: boolean;
    intentions: boolean;
  }>({
    about: false,
    intentions: false,
  });

  const toggleProfileSection = (key: 'about' | 'intentions') => {
    setExpandedProfileSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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

  // Open Chat with Authoritative Contact Unlock & KYC Check
  const handleOpenChat = (profile: HeartLinkProfile, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // 1. Authoritative Contact Check
    const allowed = heartLinkAccessService.canContactUser(profile.id);
    if (!allowed) {
      // Create real notification: "${profile.name} quer conversar consigo no HeartLink."
      heartLinkAccessService.createContactAttemptNotification({
        id: profile.id,
        name: profile.name,
        photo: profile.photo,
      });

      setTargetUnlockProfile(profile);
      setPendingAction({ type: 'chat', profile });
      setIsVisibilityModalOpen(true);
      return;
    }

    if (!verifiedDossier) {
      setPendingAction({ type: 'chat', profile });
      setIsVerificationOpen(true);
    } else {
      setSelectedProfile(null);
      setChatProfile(profile);
    }
  };

  // Open WhatsApp with Authoritative Contact Unlock & KYC Check
  const handleOpenWhatsApp = (profile: HeartLinkProfile, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // 1. Authoritative Contact Check
    const allowed = heartLinkAccessService.canContactUser(profile.id);
    if (!allowed) {
      // Create real notification: "${profile.name} quer conversar consigo no HeartLink."
      heartLinkAccessService.createContactAttemptNotification({
        id: profile.id,
        name: profile.name,
        photo: profile.photo,
      });

      setTargetUnlockProfile(profile);
      setPendingAction({ type: 'whatsapp', profile });
      setIsVisibilityModalOpen(true);
      return;
    }

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
    // Populate media state if user already has a profile or verified selfie
    if (myProfile) {
      const existingPhotos: (string | null)[] = myProfile.photos && myProfile.photos.length > 0
        ? [...myProfile.photos]
        : [myProfile.photo];
      while (existingPhotos.length < 4) {
        existingPhotos.push(null);
      }
      setRegMedia({
        photos: existingPhotos.slice(0, 4),
        video: myProfile.video || null,
        videoDuration: myProfile.videoDuration,
      });
      setRegContactAvailability(myProfile.contactAvailability || DEFAULT_CONTACT_AVAILABILITY);
    } else if (verifiedDossier?.biometricSelfiePhoto) {
      setRegMedia({
        photos: [verifiedDossier.biometricSelfiePhoto, null, null, null],
        video: null,
        videoDuration: undefined,
      });
      setRegContactAvailability(DEFAULT_CONTACT_AVAILABILITY);
    } else {
      setRegMedia({
        photos: [null, null, null, null],
        video: null,
        videoDuration: undefined,
      });
      setRegContactAvailability(DEFAULT_CONTACT_AVAILABILITY);
    }

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
    if (dossier.biometricSelfiePhoto && !regMedia.photos[0]) {
      setRegMedia((prev) => ({
        ...prev,
        photos: [dossier.biometricSelfiePhoto, prev.photos[1], prev.photos[2], prev.photos[3]],
      }));
    }
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

  // Real Persistent Counters
  const activeP2PTier = heartLinkService.getActiveP2PTier(userVisibility);
  const confirmedFriendshipsCount = useMemo(
    () => friendships.filter((f) => f.status === 'confirmed').length,
    [friendships]
  );
  const confirmedMarriagesCount = useMemo(
    () => marriages.filter((m) => m.status === 'confirmed').length,
    [marriages]
  );

  const handleP2PIconClick = (tier: P2PTier, planId: 'vis_24h' | 'vis_7d' | 'vis_30d') => {
    if (activeP2PTier === tier) {
      setActiveP2PGroupModal(tier);
      setP2PTab('chat');
    } else {
      setP2PModalPlanTarget(planId);
      setIsVisibilityModalOpen(true);
    }
  };

  const handleSendP2PMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeP2PGroupModal || !p2pInputText.trim()) return;

    const myName = myProfile?.name || verifiedDossier?.fullName || 'Você';
    const myPhoto = myProfile?.photo || '/src/assets/images/moz_profile_ana_1790448736252.jpg';
    const myId = myProfile?.id || (verifiedDossier ? `bi-${verifiedDossier.biNumber}` : 'my-id');

    const newMsg = heartLinkService.sendP2PMessage(activeP2PGroupModal, {
      senderId: myId,
      senderName: myName,
      senderPhoto: myPhoto,
      text: p2pInputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    setP2PMessages((prev) => ({
      ...prev,
      [activeP2PGroupModal]: [...(prev[activeP2PGroupModal] || []), newMsg],
    }));
    setP2PInputText('');
  };

  const handleInitiateFriendship = (targetProfile: HeartLinkProfile) => {
    const myId = myProfile?.id || (verifiedDossier ? `bi-${verifiedDossier.biNumber}` : 'my-user');
    const myName = myProfile?.name || verifiedDossier?.fullName || 'Você';
    const myPhoto = myProfile?.photo || '/src/assets/images/moz_profile_ana_1790448736252.jpg';

    const result = heartLinkService.confirmFriendship({
      user1Id: myId,
      user1Name: myName,
      user1Photo: myPhoto,
      user2Id: targetProfile.id,
      user2Name: targetProfile.name,
      user2Photo: targetProfile.photo,
      city: targetProfile.city,
      asUser: 1,
    });

    setFriendships(heartLinkService.getFriendships());
    if (result.becameConfirmed) {
      setFriendshipFeedback(`Amizade com ${targetProfile.name} confirmada por ambos!`);
    } else if (!result.isNew) {
      setFriendshipFeedback(`Amizade já confirmada anteriormente.`);
    } else {
      setFriendshipFeedback(`Pedido registado! Aguardando confirmação mútua de ${targetProfile.name}.`);
    }
    setTimeout(() => setFriendshipFeedback(null), 3500);
    setIsConfirmFriendshipModalOpen(false);
    setSelectedFriendshipTargetId('');
  };

  const handlePartnerConfirmFriendship = (record: FriendshipRecord) => {
    heartLinkService.confirmFriendship({
      user1Id: record.user1Id,
      user1Name: record.user1Name,
      user1Photo: record.user1Photo,
      user2Id: record.user2Id,
      user2Name: record.user2Name,
      user2Photo: record.user2Photo,
      city: record.city,
      asUser: 2,
    });
    setFriendships(heartLinkService.getFriendships());
    setFriendshipFeedback(`Amizade confirmada por ambos os utilizadores!`);
    setTimeout(() => setFriendshipFeedback(null), 3500);
  };

  const handleInitiateMarriage = (targetProfile: HeartLinkProfile) => {
    const myId = myProfile?.id || (verifiedDossier ? `bi-${verifiedDossier.biNumber}` : 'my-user');
    const myName = myProfile?.name || verifiedDossier?.fullName || 'Você';
    const myPhoto = myProfile?.photo || '/src/assets/images/moz_profile_ana_1790448736252.jpg';

    const result = heartLinkService.confirmMarriage({
      user1Id: myId,
      user1Name: myName,
      user1Photo: myPhoto,
      user2Id: targetProfile.id,
      user2Name: targetProfile.name,
      user2Photo: targetProfile.photo,
      city: targetProfile.city,
      asUser: 1,
    });

    setMarriages(heartLinkService.getMarriages());
    if (result.becameConfirmed) {
      setMarriageFeedback(`Casamento com ${targetProfile.name} confirmado por ambos!`);
    } else if (!result.isNew) {
      setMarriageFeedback(`Casamento já confirmado anteriormente.`);
    } else {
      setMarriageFeedback(`Pedido registado! Aguardando confirmação mútua de ${targetProfile.name}.`);
    }
    setTimeout(() => setMarriageFeedback(null), 3500);
    setIsConfirmMarriageModalOpen(false);
    setSelectedMarriageTargetId('');
  };

  const handlePartnerConfirmMarriage = (record: MarriageRecord) => {
    heartLinkService.confirmMarriage({
      user1Id: record.user1Id,
      user1Name: record.user1Name,
      user1Photo: record.user1Photo,
      user2Id: record.user2Id,
      user2Name: record.user2Name,
      user2Photo: record.user2Photo,
      city: record.city,
      asUser: 2,
    });
    setMarriages(heartLinkService.getMarriages());
    setMarriageFeedback(`Casamento confirmado por ambos os utilizadores!`);
    setTimeout(() => setMarriageFeedback(null), 3500);
  };

  const getTierMembers = (tier: P2PTier): HeartLinkProfile[] => {
    const sliceMap: Record<P2PTier, [number, number]> = {
      heart: [0, 5],
      diamond: [2, 7],
      king: [4, 9],
    };
    const [start, end] = sliceMap[tier];
    return profiles.slice(start, end);
  };

  // Source profiles for the showcase (profiles are always visible; contact access depends on plan)
  const allShowcaseProfiles = useMemo(() => {
    let list = [...profiles];
    if (myProfile) {
      list = list.filter((p) => p.id !== myProfile.id);

      // Unless the user explicitly set mode to anonymous in privacy settings, their profile is visible in the showcase
      if (userVisibility.mode !== 'anonymous') {
        const enrichedMyProfile: HeartLinkProfile = {
          ...myProfile,
          isPubliclyVisible: true,
          isContactUnlocked: userVisibility.isUnlocked,
          visibilityBadge: userVisibility.isUnlocked ? (userVisibility.planName || 'Contacto Ativo') : undefined,
          visibilityExpiresAt: userVisibility.expiresAt
        };
        list = [enrichedMyProfile, ...list];
      }
    }
    return list;
  }, [profiles, myProfile, userVisibility]);

  // Filter profiles
  const filteredProfiles = useMemo(() => {
    return allShowcaseProfiles.filter((profile) => {
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

      return true;
    });
  }, [allShowcaseProfiles, searchQuery, selectedProvince, selectedCity, selectedGender, selectedIntention]);

  const featuredProfiles = useMemo(() => {
    return allShowcaseProfiles.filter((p) => p.isFeatured || p.isPremium || p.verified || p.isPubliclyVisible);
  }, [allShowcaseProfiles]);

  // Handle register profile
  const handleCreateProfile = (newP: HeartLinkProfile, initialMode: 'anonymous' | 'public') => {
    setMyProfile(newP);
    localStorage.setItem('onde_dormir_my_heartlink_profile', JSON.stringify(newP));

    // Persist into profiles list
    setProfiles((prev) => {
      const filtered = prev.filter((p) => p.id !== newP.id);
      const updated = [newP, ...filtered];
      localStorage.setItem('onde_dormir_heartlink_profiles', JSON.stringify(updated));
      return updated;
    });

    const targetMode = initialMode === 'public' ? 'public_showcase' : 'anonymous';
    const updatedVis: UserVisibilityData = {
      ...userVisibility,
      mode: targetMode,
      isUnlocked: userVisibility.isUnlocked
    };
    handleSaveVisibility(updatedVis);
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
        `Olá! Que bom receber o teu contacto. Conte-me mais sobre si.`,
        `Prazer em falar contigo! O que mais gostas de fazer no teu tempo livre?`
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
    <div className="pb-16 sm:pb-20 pt-1 sm:pt-3 max-w-5xl mx-auto px-2.5 sm:px-4 space-y-2.5 sm:space-y-3.5">
      {/* 1. HeartLink Header */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shrink-0 shadow-inner">
              <HeartLinkTwoHeartsIcon className="w-6 h-6 sm:w-8 sm:h-8" variant="white" showStitches={true} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight leading-none">
                  Heart<span className="text-pink-200">Link</span>
                </h1>
                <span className="text-[9.5px] uppercase font-black tracking-wider bg-black/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-300/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-300" />
                  Verificado
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-pink-100 font-medium mt-0.5">
                Conexões autênticas com privacidade e segurança.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            {/* Real Module Visit Counter */}
            <div 
              className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20 text-white text-[11px] font-bold shrink-0 shadow-xs"
              title="Visitas ao módulo HeartLink"
            >
              <Eye className="w-3.5 h-3.5 text-pink-200 shrink-0" />
              <span>{formatVisitCount(getModuleCount('heartlink'))}</span>
            </div>

            <button
              onClick={handleOpenRegister}
              className="w-full sm:w-auto h-9 sm:h-10 px-3.5 bg-white text-rose-600 hover:bg-rose-50 active:scale-95 font-black text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{myProfile ? 'Editar Meu Perfil' : 'Criar Perfil'}</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation: Conexões Confirmadas Card */}
        <div className="mt-2.5 pt-2.5 border-t border-white/20 w-full">
          <ConfirmedConnectionsCard
            friendshipsCount={confirmedFriendshipsCount}
            datingCount={56}
            marriagesCount={confirmedMarriagesCount}
            activeSubTab={activeSubTab}
            onSelectSubTab={(tab) => {
              if (activeSubTab === tab) {
                setActiveSubTab('pessoas');
              } else {
                setActiveSubTab(tab as any);
              }
            }}
          />
        </div>
      </div>

      {/* Real Contact Attempt Notification Banner: "Maria wants to talk to you on HeartLink" */}
      {unreadContactNotif && (
        <div className="bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 text-white p-3 sm:p-3.5 rounded-2xl sm:rounded-3xl shadow-md border border-rose-400/40 flex items-center justify-between gap-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {unreadContactNotif.contactPhoto ? (
              <img
                src={unreadContactNotif.contactPhoto}
                alt=""
                className="w-10 h-10 rounded-2xl object-cover object-top border-2 border-white/60 shadow-xs shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-xs shrink-0 border border-white/30">
                <Heart className="w-5 h-5 fill-white text-white" />
              </div>
            )}
            <div className="min-w-0">
              <span className="text-[9.5px] font-black uppercase tracking-wider bg-black/25 text-pink-200 px-2 py-0.5 rounded-md inline-block">
                Notificação de Contacto
              </span>
              <p className="text-xs sm:text-sm font-black text-white truncate mt-0.5">
                {unreadContactNotif.message || `${unreadContactNotif.contactName} quer conversar consigo no HeartLink.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleRespondToNotification(unreadContactNotif)}
              className="h-9 px-3.5 bg-white text-rose-600 hover:bg-rose-50 active:scale-95 rounded-xl text-xs font-black shadow-xs cursor-pointer transition-all flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Desbloquear Contacto</span>
            </button>
            <button
              type="button"
              onClick={() => heartLinkAccessService.markNotificationAsRead(unreadContactNotif.id)}
              className="w-8 h-8 rounded-xl bg-black/20 hover:bg-black/30 text-white flex items-center justify-center cursor-pointer transition-colors"
              title="Dispensar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. CHAT P2P Glossy Capsule Section */}
      <div className="bg-white/80 backdrop-blur-xs rounded-2xl sm:rounded-3xl border border-pink-100 p-2.5 sm:p-4 shadow-sm">
        <HeartLinkP2PCapsule
          activeTier={activeP2PTier}
          onSelectTier={handleP2PIconClick}
        />
      </div>

      {/* 3. CONFIRMADOS TAB */}
      {activeSubTab === 'confirmados' && (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-2xs overflow-hidden p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap pb-3 border-b border-neutral-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight flex items-center gap-1.5">
                  <span>💍</span>
                  <span>Confirmados</span>
                </h2>
                <span className="text-xs font-black bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full border border-rose-200">
                  {confirmedMarriagesCount}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Conexões autênticas confirmadas com sucesso através do HeartLink.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveSubTab('pessoas')}
                className="h-9 px-3 bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>← Ver Perfis</span>
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmMarriageModalOpen(true)}
                className="h-9 px-3.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <TwoWeddingRingsIcon className="w-3.5 h-3.5" />
                <span>Confirmar</span>
              </button>
            </div>
          </div>

          {marriageFeedback && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{marriageFeedback}</span>
            </div>
          )}

          {marriages.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500 font-medium">
              Ainda não existem registos confirmados.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {marriages.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-2xl border border-neutral-200/90 bg-neutral-50/70 hover:bg-white hover:border-neutral-300 transition-colors shadow-2xs space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <img src={m.user1Photo} alt={m.user1Name} className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0" />
                      <div className="min-w-0">
                        <span className="font-extrabold text-xs text-neutral-900 block truncate">{m.user1Name}</span>
                        <span className="text-[10px] text-neutral-400 block">{m.city || 'Maputo'}</span>
                      </div>
                    </div>

                    <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <TwoWeddingRingsIcon className="w-3.5 h-3.5" />
                    </div>

                    <div className="flex items-center gap-2 min-w-0 flex-1 justify-end text-right">
                      <div className="min-w-0">
                        <span className="font-extrabold text-xs text-neutral-900 block truncate">{m.user2Name}</span>
                        <span className="text-[10px] text-neutral-400 block">{m.city || 'Maputo'}</span>
                      </div>
                      <img src={m.user2Photo} alt={m.user2Name} className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-200/60 text-[11px]">
                    {m.status === 'confirmed' ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Confirmado ({m.confirmedAt || 'Registado'})</span>
                      </span>
                    ) : (
                      <span className="text-amber-700 font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Aguardando confirmação de {m.user2Name.split(' ')[0]}</span>
                      </span>
                    )}

                    {m.status === 'pending' && !m.user2Confirmed && (
                      <button
                        type="button"
                        onClick={() => handlePartnerConfirmMarriage(m)}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10.5px] font-bold cursor-pointer"
                      >
                        Confirmar como {m.user2Name.split(' ')[0]}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. CONFIRMADAS TAB */}
      {activeSubTab === 'confirmadas' && (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-2xs overflow-hidden p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap pb-3 border-b border-neutral-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight flex items-center gap-1.5">
                  <TwoFriendsEmblemIcon className="w-5 h-5 text-blue-600" />
                  <span>Confirmadas</span>
                </h2>
                <span className="text-xs font-black bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {confirmedFriendshipsCount}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Conexões confirmadas mutuamente por ambos os utilizadores.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveSubTab('pessoas')}
                className="h-9 px-3 bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>← Ver Perfis</span>
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmFriendshipModalOpen(true)}
                className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <TwoFriendsEmblemIcon className="w-3.5 h-3.5" />
                <span>Confirmar</span>
              </button>
            </div>
          </div>

          {friendshipFeedback && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{friendshipFeedback}</span>
            </div>
          )}

          {friendships.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500 font-medium">
              Ainda não existem registos confirmados.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {friendships.map((f) => (
                <div
                  key={f.id}
                  className="p-3.5 rounded-2xl border border-neutral-200/90 bg-neutral-50/70 hover:bg-white hover:border-neutral-300 transition-colors shadow-2xs space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <img src={f.user1Photo} alt={f.user1Name} className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0" />
                      <div className="min-w-0">
                        <span className="font-extrabold text-xs text-neutral-900 block truncate">{f.user1Name}</span>
                        <span className="text-[10px] text-neutral-400 block">{f.city || 'Maputo'}</span>
                      </div>
                    </div>

                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <TwoFriendsEmblemIcon className="w-3.5 h-3.5" />
                    </div>

                    <div className="flex items-center gap-2 min-w-0 flex-1 justify-end text-right">
                      <div className="min-w-0">
                        <span className="font-extrabold text-xs text-neutral-900 block truncate">{f.user2Name}</span>
                        <span className="text-[10px] text-neutral-400 block">{f.city || 'Maputo'}</span>
                      </div>
                      <img src={f.user2Photo} alt={f.user2Name} className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-200/60 text-[11px]">
                    {f.status === 'confirmed' ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Confirmado ({f.confirmedAt || 'Registado'})</span>
                      </span>
                    ) : (
                      <span className="text-amber-700 font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Aguardando confirmação de {f.user2Name.split(' ')[0]}</span>
                      </span>
                    )}

                    {f.status === 'pending' && !f.user2Confirmed && (
                      <button
                        type="button"
                        onClick={() => handlePartnerConfirmFriendship(f)}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10.5px] font-bold cursor-pointer"
                      >
                        Confirmar como {f.user2Name.split(' ')[0]}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. PESSOAS TAB (SEARCH + FILTERS + GRID) */}
      {activeSubTab === 'pessoas' && (
        <>
          {/* Filter and Search Bar - Sticky on scroll for instant access */}
          <div className="sticky top-[48px] sm:top-[56px] z-20 bg-white/95 backdrop-blur-md p-2.5 sm:p-3.5 rounded-2xl sm:rounded-3xl border border-neutral-200 shadow-sm space-y-2">
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Pesquisar por nome, cidade ou biografia..."
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

              <div className="grid grid-cols-2 sm:flex gap-2">
                {/* Gender Filter */}
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value as any)}
                  className="h-10 sm:h-11 px-3 bg-neutral-50 rounded-xl text-xs font-semibold text-neutral-800 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-rose-400 cursor-pointer"
                >
                  <option value="all">Género (Todos)</option>
                  <option value="feminino">Feminino</option>
                  <option value="masculino">Masculino</option>
                </select>

                {/* Province Filter */}
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="h-10 sm:h-11 px-3 bg-neutral-50 rounded-xl text-xs font-semibold text-neutral-800 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-rose-400 cursor-pointer"
                >
                  <option value="all">Províncias (Todas)</option>
                  {mozProvinces.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Objectives Chips */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-0.5 items-center">
              <span className="text-[11px] font-bold text-neutral-500 shrink-0">Objectivo:</span>
              <button
                onClick={() => setSelectedIntention('all')}
                className={`h-7 px-2.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedIntention === 'all'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Todos
              </button>
              {intentionsList.map((intent) => {
                const isSelected = selectedIntention === intent.id;
                return (
                  <button
                    key={intent.id}
                    onClick={() => setSelectedIntention(isSelected ? 'all' : intent.id)}
                    className={`h-7 px-2.5 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer border flex items-center gap-1 ${
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
          </div>

          {/* Main Grid of Profiles */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-neutral-600 px-1">
              <span>
                <strong className="text-neutral-900 font-bold">{filteredProfiles.length}</strong> perfis disponíveis
              </span>
            </div>

            {filteredProfiles.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-neutral-200 text-center space-y-3 my-4 shadow-2xs">
                <div className="w-14 h-14 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto shadow-2xs">
                  <HeartLinkTwoHeartsIcon className="w-8 h-8" variant="embroidered" showStitches={true} />
                </div>
                <h3 className="font-extrabold text-neutral-800 text-base">
                  Nenhum perfil encontrado com os filtros atuais
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Experimente selecionar outra província ou remover os filtros para ver mais pretendentes.
                </p>
                <button
                  onClick={() => {
                    setActiveSubTab('pessoas');
                    setSelectedProvince('all');
                    setSelectedCity('all');
                    setSelectedGender('all');
                    setSelectedIntention('all');
                    setSearchQuery('');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer border border-rose-200 active:scale-95"
                >
                  <span>Explorar Todos os Perfis</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 items-stretch">
                {filteredProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    onClick={() => setSelectedProfile(profile)}
                    className="group bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-full active:scale-[0.99] touch-manipulation"
                  >
                    <div className="relative aspect-[4/5] w-full bg-neutral-100 overflow-hidden shrink-0">
                      <img
                        src={profile.photo}
                        alt={profile.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none">
                        {profile.verified && !profile.id.startsWith('hl-') && (
                          <span className="text-[9px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Verificado
                          </span>
                        )}
                        {profile.visibilityBadge && !profile.id.startsWith('hl-') && (
                          <span className="text-[9px] font-black bg-gradient-to-r from-amber-500 to-rose-500 text-white px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-amber-200" /> {profile.visibilityBadge}
                          </span>
                        )}
                      </div>

                      {/* Heart Button */}
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

                      {/* Bottom Name & Location Overlay */}
                      <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                        <div className="font-extrabold text-sm truncate">
                          {profile.name}, {profile.age}
                        </div>
                        <div className="text-[11px] text-neutral-200 flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-rose-300 shrink-0" />
                          <span className="truncate">{profile.city} · {getPlatformTenureText(profile.registeredAt, profile.platformTenure, profile.id)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 space-y-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap gap-1">
                          {profile.intentions.map((intentId) => {
                            const found = intentionsList.find((i) => i.id === intentId);
                            return (
                              <span key={intentId} className="text-[9.5px] font-bold bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200/70">
                                {found?.icon} {found?.label || intentId}
                              </span>
                            );
                          })}
                        </div>
                        <p className="text-[11px] text-neutral-600 line-clamp-2 leading-tight">
                          {profile.bio}
                        </p>
                        <HeartLinkContactMiniBadges availability={profile.contactAvailability} className="pt-0.5" />
                      </div>

                      <button
                        onClick={(e) => handleOpenChat(profile, e)}
                        className="w-full h-9 mt-auto bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs touch-manipulation"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Conversar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* 5. Profile Detail Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200 relative my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Media Gallery (4 photos + 1 video) */}
            <div className="relative w-full">
              <HeartLinkMediaGallery profile={selectedProfile} />
              <button
                onClick={() => setSelectedProfile(null)}
                className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-colors z-20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 max-h-[50vh] overflow-y-auto">
              {/* Metadata Row: Profession and Platform Tenure */}
              <div className="flex items-center gap-2 flex-wrap text-xs text-neutral-700">
                {selectedProfile.profession && (
                  <div className="flex items-center gap-1.5 font-bold bg-neutral-100 px-2.5 py-1 rounded-lg">
                    <Briefcase className="w-3.5 h-3.5 text-neutral-600" />
                    <span>{selectedProfile.profession}</span>
                  </div>
                )}

                <div className="flex items-center gap-1.5 font-semibold text-neutral-600 bg-rose-50 border border-rose-200/80 px-2.5 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-rose-600" />
                  <span>{getPlatformTenureText(selectedProfile.registeredAt, selectedProfile.platformTenure, selectedProfile.id)}</span>
                </div>
              </div>

              {/* 1. Sobre Mim (Accordion - Collapsed by default) */}
              <div className="border border-neutral-200/80 rounded-2xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggleProfileSection('about')}
                  className="w-full p-3 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <span className="text-xs font-black uppercase tracking-wider text-neutral-800">
                    Sobre Mim
                  </span>
                  {expandedProfileSections.about ? (
                    <ChevronUp className="w-4 h-4 text-neutral-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />
                  )}
                </button>
                {expandedProfileSections.about && (
                  <div className="px-3 pb-3 pt-1 text-xs sm:text-sm text-neutral-700 leading-relaxed border-t border-neutral-100">
                    {selectedProfile.bio}
                  </div>
                )}
              </div>

              {/* 2. Objectivo do Perfil (Accordion - Collapsed by default) */}
              <div className="border border-neutral-200/80 rounded-2xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggleProfileSection('intentions')}
                  className="w-full p-3 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <span className="text-xs font-black uppercase tracking-wider text-neutral-800">
                    Objectivo do Perfil
                  </span>
                  {expandedProfileSections.intentions ? (
                    <ChevronUp className="w-4 h-4 text-neutral-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />
                  )}
                </button>
                {expandedProfileSections.intentions && (
                  <div className="px-3 pb-3 pt-2 border-t border-neutral-100 flex flex-wrap gap-1.5">
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
                )}
              </div>

              {/* 3. Disponibilidade de Contacto */}
              <HeartLinkContactAvailabilitySection 
                availability={selectedProfile.contactAvailability} 
                isContactUnlocked={selectedProfile.id === myProfile?.id ? true : heartLinkAccessService.canContactUser(selectedProfile.id)}
                isOwnProfile={selectedProfile.id === myProfile?.id}
                onActivateContactAccess={() => {
                  setTargetUnlockProfile(selectedProfile);
                  setPendingAction({ type: 'chat', profile: selectedProfile });
                  setIsVisibilityModalOpen(true);
                  setSelectedProfile(null);
                }}
                showTitle={true}
              />
            </div>

            {/* Action Buttons */}
            <div className="p-3.5 border-t border-neutral-100 flex items-center gap-2 bg-neutral-50">
              <button
                onClick={(e) => handleOpenChat(selectedProfile, e)}
                className="flex-1 h-11 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Conversar no Chat</span>
              </button>
              {selectedProfile.whatsapp && (
                <button
                  type="button"
                  onClick={(e) => handleOpenWhatsApp(selectedProfile, e)}
                  className="h-11 px-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                  title="Contactar via WhatsApp"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. Register Profile Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200 relative my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-rose-600 text-white p-3.5 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <HeartLinkTwoHeartsIcon className="w-5 h-5" variant="white" />
                </div>
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

                const fallbackPhoto = verifiedDossier?.biometricSelfiePhoto || (gender === 'feminino' 
                  ? defaultFemalePhotos[Math.floor(Math.random() * defaultFemalePhotos.length)]
                  : defaultMalePhotos[Math.floor(Math.random() * defaultMalePhotos.length)]);

                const validUploadedPhotos = regMedia.photos.filter((p): p is string => Boolean(p));
                const primaryPhoto = validUploadedPhotos.length > 0 ? validUploadedPhotos[0] : fallbackPhoto;
                const finalPhotosList = validUploadedPhotos.length > 0 ? validUploadedPhotos : [primaryPhoto];

                const newProfile: HeartLinkProfile = {
                  id: myProfile?.id || `hl-custom-${Date.now()}`,
                  name,
                  age,
                  gender,
                  city,
                  province,
                  bio,
                  profession,
                  whatsapp,
                  phone: whatsapp,
                  contactAvailability: regContactAvailability,
                  photo: primaryPhoto,
                  photos: finalPhotosList,
                  video: regMedia.video || undefined,
                  videoDuration: regMedia.videoDuration || (regMedia.video ? '0:30 min' : undefined),
                  intentions: regIntentions.length > 0 ? regIntentions : ['amizade'],
                  verified: true,
                  isPremium: regVisibilityMode === 'public',
                  isPubliclyVisible: regVisibilityMode === 'public',
                };

                handleCreateProfile(newProfile, regVisibilityMode);
              }}
              className="p-4 space-y-3.5 max-h-[75vh] overflow-y-auto"
            >
              {/* Media Upload (4 Photos Slots + 1 Video Slot) */}
              <div className="bg-neutral-50/70 p-3 rounded-2xl border border-neutral-200/90">
                <HeartLinkMediaManager
                  media={regMedia}
                  onChange={setRegMedia}
                  isEditable={true}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Nome ou Apelido *</label>
                <input 
                  name="name" 
                  required 
                  defaultValue={myProfile?.name || verifiedDossier?.fullName || ''}
                  placeholder="Ex: Tatiana" 
                  className="w-full h-10 px-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs sm:text-sm outline-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Idade *</label>
                  <input name="age" type="number" min="18" max="75" defaultValue={myProfile?.age || 24} required className="w-full h-10 px-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs sm:text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Género *</label>
                  <select name="gender" defaultValue={myProfile?.gender || 'feminino'} className="w-full h-10 px-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs outline-none">
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
                    defaultValue={myProfile?.province || verifiedDossier?.province || 'Maputo Cidade'}
                    className="w-full h-10 px-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs outline-none"
                  >
                    {mozProvinces.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Cidade *</label>
                  <select 
                    name="city" 
                    defaultValue={myProfile?.city || verifiedDossier?.city || 'Maputo'}
                    className="w-full h-10 px-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs outline-none"
                  >
                    {mozCities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Profissão / Ocupação</label>
                <input 
                  name="profession" 
                  defaultValue={myProfile?.profession || ''}
                  placeholder="Ex: Gestor Comercial, Estudante..." 
                  className="w-full h-10 px-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs sm:text-sm outline-none" 
                />
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
                  defaultValue={myProfile?.whatsapp || verifiedDossier?.whatsapp || ''}
                  placeholder="Ex: 841234567" 
                  className="w-full h-10 px-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs sm:text-sm outline-none" 
                />
              </div>

              {/* Contact Availability Configurator */}
              <HeartLinkContactConfigurator
                value={regContactAvailability}
                onChange={setRegContactAvailability}
              />

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Sobre Mim *</label>
                <textarea 
                  name="bio" 
                  required 
                  rows={2} 
                  defaultValue={myProfile?.bio || ''}
                  placeholder="Descreva um pouco sobre si..." 
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs outline-none resize-none" 
                />
              </div>

              {/* Modo de Apresentação */}
              <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-rose-950 uppercase tracking-wide">
                    Privacidade do Perfil
                  </span>
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                    Registo Gratuito
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div
                    onClick={() => setRegVisibilityMode('public')}
                    className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                      regVisibilityMode === 'public' ? 'bg-white border-rose-600 ring-1 ring-rose-600' : 'bg-neutral-50/80 border-neutral-200'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="visibilityChoice" 
                      checked={regVisibilityMode === 'public'} 
                      onChange={() => setRegVisibilityMode('public')}
                      className="mt-0.5 text-rose-600" 
                    />
                    <div>
                      <div className="text-xs font-black text-neutral-900 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-rose-600" />
                        <span>Perfil Visível</span>
                      </div>
                      <p className="text-[11px] text-neutral-600 leading-snug mt-0.5">
                        O seu perfil fica visível para os outros utilizadores no HeartLink.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setRegVisibilityMode('anonymous')}
                    className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                      regVisibilityMode === 'anonymous' ? 'bg-white border-rose-600 ring-1 ring-rose-600' : 'bg-neutral-50/80 border-neutral-200'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="visibilityChoice" 
                      checked={regVisibilityMode === 'anonymous'} 
                      onChange={() => setRegVisibilityMode('anonymous')}
                      className="mt-0.5 text-rose-600" 
                    />
                    <div>
                      <div className="text-xs font-black text-neutral-900 flex items-center gap-1.5">
                        <EyeOff className="w-3.5 h-3.5 text-neutral-600" />
                        <span>Perfil Privado (Oculto)</span>
                      </div>
                      <p className="text-[11px] text-neutral-600 leading-snug mt-0.5">
                        O seu perfil fica oculto do feed principal. Pode explorar de forma privada.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Guardar Perfil</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 7. Chat Window Modal */}
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

      {/* 8. Confirm Friendship Modal */}
      {isConfirmFriendshipModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200 relative my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-rose-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <HeartHandshake className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-extrabold text-base">Confirmar Amizade</h3>
              </div>
              <button
                onClick={() => {
                  setIsConfirmFriendshipModalOpen(false);
                  setSelectedFriendshipTargetId('');
                }}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-xs text-neutral-600 leading-relaxed">
                Selecione o utilizador com quem estabeleceu amizade através do HeartLink para registar a confirmação.
              </p>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {profiles.map((p) => {
                  const isSelected = selectedFriendshipTargetId === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedFriendshipTargetId(p.id)}
                      className={`p-2.5 rounded-2xl border flex items-center justify-between gap-2.5 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-rose-600 bg-rose-50/70 ring-2 ring-rose-500/20'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={p.photo}
                          alt={p.name}
                          className="w-9 h-9 rounded-full object-cover border border-neutral-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-xs text-neutral-900 block truncate">{p.name}</span>
                          <span className="text-[10px] text-neutral-500 block truncate">{p.city}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsConfirmFriendshipModalOpen(false);
                    setSelectedFriendshipTargetId('');
                  }}
                  className="flex-1 h-10 rounded-xl border border-neutral-200 text-neutral-700 font-bold text-xs hover:bg-neutral-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={!selectedFriendshipTargetId}
                  onClick={() => {
                    const target = profiles.find((p) => p.id === selectedFriendshipTargetId);
                    if (target) handleInitiateFriendship(target);
                  }}
                  className="flex-1 h-10 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. Confirm Marriage Modal */}
      {isConfirmMarriageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200 relative my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-rose-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <TwoWeddingRingsIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-extrabold text-base">Confirmar Casamento</h3>
              </div>
              <button
                onClick={() => {
                  setIsConfirmMarriageModalOpen(false);
                  setSelectedMarriageTargetId('');
                }}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-xs text-neutral-600 leading-relaxed">
                Selecione o cônjuge com quem se conheceu através do HeartLink para registar a celebração do matrimónio.
              </p>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {profiles.map((p) => {
                  const isSelected = selectedMarriageTargetId === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedMarriageTargetId(p.id)}
                      className={`p-2.5 rounded-2xl border flex items-center justify-between gap-2.5 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-rose-600 bg-rose-50/70 ring-2 ring-rose-500/20'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={p.photo}
                          alt={p.name}
                          className="w-9 h-9 rounded-full object-cover border border-neutral-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-xs text-neutral-900 block truncate">{p.name}</span>
                          <span className="text-[10px] text-neutral-500 block truncate">{p.city}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsConfirmMarriageModalOpen(false);
                    setSelectedMarriageTargetId('');
                  }}
                  className="flex-1 h-10 rounded-xl border border-neutral-200 text-neutral-700 font-bold text-xs hover:bg-neutral-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={!selectedMarriageTargetId}
                  onClick={() => {
                    const target = profiles.find((p) => p.id === selectedMarriageTargetId);
                    if (target) handleInitiateMarriage(target);
                  }}
                  className="flex-1 h-10 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. Active P2P Group Modal (Chat & Direct Contacts) */}
      {activeP2PGroupModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full h-[88vh] max-h-[600px] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-neutral-900 text-white p-3 sm:p-4 flex items-center justify-between shrink-0 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg">
                  {activeP2PGroupModal === 'heart' && '♥'}
                  {activeP2PGroupModal === 'diamond' && '◆'}
                  {activeP2PGroupModal === 'king' && '♛'}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                    <span>
                      Chat P2P {activeP2PGroupModal === 'heart' ? '♥' : activeP2PGroupModal === 'diamond' ? '◆' : '♛'}
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Plano Ativo
                    </span>
                  </h3>
                  <div className="text-[10.5px] text-neutral-400">
                    {heartLinkService.getTierMembers(activeP2PGroupModal, profiles, myProfile).length} Membros Conectados
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveP2PGroupModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-tabs: Chat vs Direct Contacts */}
            <div className="flex border-b border-neutral-200 bg-neutral-100/70 p-1.5 gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setP2PTab('chat')}
                className={`flex-1 h-8.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  p2pTab === 'chat'
                    ? 'bg-white text-neutral-900 shadow-2xs font-extrabold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat em Grupo</span>
              </button>
              <button
                type="button"
                onClick={() => setP2PTab('contactos')}
                className={`flex-1 h-8.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  p2pTab === 'contactos'
                    ? 'bg-white text-neutral-900 shadow-2xs font-extrabold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Contactos Directos</span>
              </button>
            </div>

            {/* Body */}
            {p2pTab === 'chat' ? (
              <>
                <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-neutral-50/50">
                  {(p2pMessages[activeP2PGroupModal] || []).map((msg) => {
                    const isMe = msg.senderId === (myProfile?.id || (verifiedDossier ? `bi-${verifiedDossier.biNumber}` : 'my-user'));
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <img
                          src={msg.senderPhoto}
                          alt={msg.senderName}
                          className="w-7 h-7 rounded-full object-cover border border-neutral-200 shrink-0"
                        />
                        <div
                          className={`max-w-[80%] rounded-2xl px-3 py-1.5 text-xs shadow-2xs ${
                            isMe
                              ? 'bg-rose-600 text-white rounded-tr-xs'
                              : 'bg-white text-neutral-800 border border-neutral-200 rounded-tl-xs'
                          }`}
                        >
                          {!isMe && (
                            <span className="font-bold text-[10px] text-rose-600 block mb-0.5">
                              {msg.senderName}
                            </span>
                          )}
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                          <span
                            className={`text-[9px] block text-right mt-0.5 ${
                              isMe ? 'text-rose-200' : 'text-neutral-400'
                            }`}
                          >
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <form
                  onSubmit={handleSendP2PMessage}
                  className="p-2.5 bg-white border-t border-neutral-200 flex items-center gap-1.5 shrink-0"
                >
                  <input
                    type="text"
                    placeholder="Escreva no grupo..."
                    value={p2pInputText}
                    onChange={(e) => setP2PInputText(e.target.value)}
                    className="flex-1 h-10 px-3 bg-neutral-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-rose-400"
                  />
                  <button
                    type="submit"
                    disabled={!p2pInputText.trim()}
                    className="w-10 h-10 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white flex items-center justify-center cursor-pointer transition-colors shrink-0 shadow-xs"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5 bg-neutral-50/50">
                {heartLinkService
                  .getTierMembers(activeP2PGroupModal, profiles, myProfile)
                  .filter((m) => m.id !== (myProfile?.id || (verifiedDossier ? `bi-${verifiedDossier.biNumber}` : 'my-user')))
                  .map((member) => (
                    <div
                      key={member.id}
                      className="p-3 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-extrabold text-xs text-neutral-900 block truncate">
                            {member.name}
                          </span>
                          <span className="text-[10px] text-neutral-500 block truncate">
                            {member.city} • {member.whatsapp || member.phone || '+258 84 000 0000'}
                          </span>
                          <HeartLinkContactMiniBadges availability={member.contactAvailability} className="mt-1" />
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const num = member.whatsapp || member.phone;
                            if (num) {
                              const text = encodeURIComponent(
                                `Olá ${member.name}! Sou membro do grupo ${
                                  activeP2PGroupModal === 'heart' ? '♥' : activeP2PGroupModal === 'diamond' ? '◆' : '♛'
                                } no HeartLink e gostaria de conversar.`
                              );
                              window.open(`https://wa.me/${num.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
                            }
                          }}
                          className="h-8.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-xl flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95 transition-all"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contact Unlock & Access Modal */}
      <HeartLinkVisibilityModal
        isOpen={isVisibilityModalOpen}
        onClose={() => {
          setIsVisibilityModalOpen(false);
          setTargetUnlockProfile(null);
        }}
        targetProfile={targetUnlockProfile}
        onSuccessUnlock={(_scope, _contactId) => {
          if (pendingAction?.type === 'chat' && pendingAction.profile) {
            setSelectedProfile(null);
            setChatProfile(pendingAction.profile);
            setPendingAction(null);
          } else if (pendingAction?.type === 'whatsapp' && pendingAction.profile) {
            const prof = pendingAction.profile;
            const text = encodeURIComponent(
              `Olá ${prof.name}! Sou ${verifiedDossier?.fullName ? verifiedDossier.fullName.split(' ')[0] : 'utilizador'} no HeartLink. Vi o teu perfil e gostaria de conversar!`
            );
            window.open(`https://wa.me/${prof.whatsapp}?text=${text}`, '_blank');
            setPendingAction(null);
          }
          setTargetUnlockProfile(null);
        }}
        currentVisibility={userVisibility}
        onSaveVisibility={handleSaveVisibility}
        userPhone={myProfile?.whatsapp || verifiedDossier?.phone}
        initialPlanId={p2pModalPlanTarget as any}
      />

      {/* Biometric KYC Modal for HeartLink */}
      <BiometricVerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        purpose="heartlink"
        targetItemName={pendingAction?.profile?.name}
        onVerificationComplete={handleVerificationComplete}
      />

      {/* Floating Bubbling Hearts in Corner */}
      <HeartLinkBubblingHearts />
    </div>
  );
};
