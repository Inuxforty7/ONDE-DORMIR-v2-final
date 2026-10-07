export type AccommodationType = 'pensao' | 'hotel' | 'guest_house' | 'lodge' | 'residencial';

export type AmenityId = 
  | 'ac' 
  | 'wifi' 
  | 'parking' 
  | 'generator' 
  | 'private_bathroom' 
  | 'double_bed'
  | 'breakfast' 
  | 'restaurant' 
  | 'tv' 
  | 'pool' 
  | 'bar' 
  | 'hot_water' 
  | 'security';

export type PropertyServiceId = 
  | 'bar' 
  | 'restaurant' 
  | 'pool' 
  | 'parking' 
  | 'wifi' 
  | 'generator' 
  | 'reception_24h' 
  | 'security' 
  | 'breakfast';

export type RoomFeatureId = 
  | 'ac' 
  | 'double_bed' 
  | 'private_bathroom' 
  | 'tv' 
  | 'hot_water' 
  | 'balcony' 
  | 'fan' 
  | 'desk';

export type VerificationStatus = 'verified_in_person' | 'verified' | 'unverified' | 'pending';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface AccommodationLocation {
  lat: number;
  lng: number;
  address: string;
  neighborhood: string; // ex: Sommerschield, Baixa, Polana, Zimpeto
  city: string; // ex: Maputo, Matola, Beira, Nampula, Vilankulo
  district?: string; // ex: KaMpfumo, KaMavota, Matola, Vilankulo
  postalCode?: string; // Código postal / PIN postal ex: 1100, 1101
  province: string; // ex: Maputo Cidade, Maputo Província, Sofala, Nampula, Inhambane
  landmark?: string; // ex: "A 100m do Hospital Central", "Perto da paragem do Xipamanine"
}

export interface IndicativePrice {
  approxMin?: number;
  approxMax?: number;
  currency: 'MZN' | 'USD';
  labelNote?: string; // ex: "A partir de 1.800 MT/noite"
}

export interface Accommodation {
  id: string;
  name: string;
  type: AccommodationType;
  tagline: string;
  description: string;
  location: AccommodationLocation;
  phone: string;
  whatsapp?: string;
  amenities: AmenityId[];
  propertyServices?: PropertyServiceId[];
  roomFeatures?: RoomFeatureId[];
  photos: string[];
  verificationStatus: VerificationStatus;
  verifiedAt?: string;
  priceEstimate?: IndicativePrice;
  distanceKm?: number;
  rating?: number;
  reviewsCount?: number;
  isPremium?: boolean;
  featured?: boolean;
  isOpen24h?: boolean;
  notes?: string;
  registeredAt?: string;
  platformTenure?: string;
  isContactUnlocked?: boolean;
  // Mandatory Identity & Anti-Fraud Verification
  ownerName?: string;
  ownerPhone?: string;
  docType?: 'bi' | 'passport' | 'dire';
  docNumber?: string;
  biFrontPhoto?: string;
  biBackPhoto?: string;
  facialSelfiePhoto?: string;
  isFacialVerified?: boolean;
  isPendingVerification?: boolean;
}

export interface UserLocationState {
  coords: LocationCoordinates | null;
  name: string;
  city?: string;
  province?: string;
  isAllMozambique?: boolean;
  isCustom: boolean;
  isLoading: boolean;
  error?: string | null;
}

export type ActiveTab = 'home' | 'explore' | 'guides' | 'rentacar' | 'heartlink' | 'loveshop' | 'map' | 'saved' | 'account' | 'more';

export type LoveShopCategoryId = 
  | 'todos' 
  | 'presentes' 
  | 'noivado' 
  | 'casamento' 
  | 'aliancas' 
  | 'relogios' 
  | 'brincos' 
  | 'sapatos' 
  | 'malas';

export interface LoveShopStore {
  id: string;
  name: string;
  slogan: string;
  logo: string;
  coverImage?: string;
  verified: boolean;
  isIdentityVerified?: boolean;
  verifiedDocType?: 'bi' | 'passport' | 'dire';
  verifiedDocNumber?: string;
  biFrontPhoto?: string;
  biBackPhoto?: string;
  facialSelfiePhoto?: string;
  isFacialVerified?: boolean;
  antiFraudBadge?: string;
  rating: number;
  reviewsCount: number;
  salesCount: number; // ex: 1250 vendas com sucesso
  city: string;
  province: string;
  address?: string;
  phone: string;
  whatsapp: string;
  ownerName: string;
  ownerNuitOrBi?: string;
  monthlyFee: number; // 1000 MT
  isSubscriptionActive: boolean;
  isContactUnlocked?: boolean;
  hasPromoBadge?: boolean;
  isCatPromoHero?: boolean;
  registeredAt?: string;
  platformTenure?: string;
}

export interface ProductMediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  label: string; // e.g., '1. Vista Frontal (Principal)', '2. Ângulo Lateral (Perfil)', '3. Interior (Aberto / Compartimentos)', '4. Vista Traseira & Acabamentos', '5. Vídeo Demonstrativo (30s-60s)'
  shortLabel: string; // 'Frente', 'Lateral', 'Aberto', 'Traseira', 'Vídeo 🎬'
  duration?: string; // e.g., '0:45 min'
  thumbnail?: string;
}

export interface DetailedReviewRating {
  productQuality: number;     // 1 to 5 (Exclusivo da Avaliação do Produto)
  customerService: number;    // 1 to 5 (Critério 1 da Reputação da Loja: Atendimento)
  recommendation: number;     // 1 to 5 (Critério 2 da Reputação da Loja: Recomendação)
  overallSatisfaction: number;// 1 to 5 (Critério 3 da Reputação da Loja: Satisfação Geral)
  deliverySpeed?: number;     // Opcional para legado
}

export interface LoveShopReview {
  id: string;
  orderId: string;
  storeId: string;
  productId: string;
  productName?: string;
  userName: string;
  userCity: string;
  date: string;
  ratings: DetailedReviewRating;
  storeRatingAverage: number; // (customerService + deliverySpeed + recommendation) / 3 (Vendedor)
  productQualityRating: number; // ratings.productQuality (Produto)
  comment?: string;
  verifiedPurchase: boolean;
  isReported?: boolean;
  reportReason?: 'nao_foi_cliente' | 'linguagem_ofensiva' | 'avaliacao_fraudulenta';
  reportDate?: string;
  reportStatus?: 'em_analise' | 'resolvido';
}

export interface LoveShopOrder {
  id: string; // ex: 'LS-20261001-0001'
  storeId: string;
  storeName: string;
  productId: string;
  productName: string;
  productPrice: number;
  productPhoto: string;
  categoryLabel?: string;
  createdAt: string; // ex: '01/10/2026'
  timestamp: number;
  clientName: string; // 'Visitante'
  clientPhone?: string;
  status: 'pendente' | 'concluido' | 'cancelado';
  completedAt?: string;
  cancelledAt?: string;
  hasReviewed?: boolean;
  reviewId?: string;
}

export interface ProductReview {
  id: string;
  userName: string;
  userCity: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  satisfactionTags?: string[];
  detailedRatings?: DetailedReviewRating;
  orderId?: string;
}

export interface LoveShopProduct {
  id: string;
  storeId: string;
  storeName: string;
  storeVerified?: boolean;
  name: string;
  description: string;
  category: LoveShopCategoryId;
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  photo: string; // Imagem principal frontal
  photos?: string[]; // Até 4 posições (Frente, Lateral, Aberto, Traseira)
  photoAngles?: {
    front?: string; // Posição 1: Frente
    side?: string;  // Posição 2: Lateral
    open?: string;  // Posição 3: Aberto / Interior
    back?: string;  // Posição 4: Traseira
  };
  videoUrl?: string; // Posição 5: Vídeo demonstrativo (30s a 1 min)
  videoDuration?: string; // e.g., '0:45 min', '0:30 min', '1:00 min'
  videoThumbnail?: string;
  videoTitle?: string;
  mediaGallery?: ProductMediaItem[];
  inStock: boolean;
  isFeatured?: boolean;
  isHotPromo?: boolean;
  discountPercent?: number;
  city: string;
  province: string;
  phone: string;
  whatsapp: string;
  registeredAt?: string;
  platformTenure?: string;
  isContactUnlocked?: boolean;
}

export interface TourGuide {
  id: string;
  name: string;
  operatorName?: string;
  age?: number;
  photo: string;
  city: string;
  province: string;
  specialties: string[];
  languages: string[];
  experienceYears: number;
  phone: string;
  whatsapp: string;
  verified: boolean;
  rating: number;
  reviewsCount: number;
  bio: string;
  ratePerDay?: number;
  featured?: boolean;
  registeredAt?: string;
  platformTenure?: string;
  isContactUnlocked?: boolean;
  source?: string;
  lastVerifiedDate?: string;
  officialWebsite?: string;
  entityType?: 'guide';
}

export type TourismPlaceCategory =
  | 'praias_ilhas'
  | 'parques_natureza'
  | 'patrimonio_historico'
  | 'cultura_museus'
  | 'atracoes_naturais';

export interface TourismPlace {
  id: string;
  name: string;
  category: TourismPlaceCategory;
  categoryLabel: string;
  photo: string;
  photos?: string[];
  city: string;
  district?: string;
  province: string;
  location?: string;
  shortDescription: string;
  fullDescription: string;
  highlights: string[];
  activities?: string[];
  services?: string[];
  bestSeason?: string;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  featured?: boolean;
  associatedGuideIds?: string[];
  coordinates?: { lat: number; lng: number };
  contactPhone?: string;
  contactEmail?: string;
  officialWebsite?: string;
  source: string;
  lastVerifiedDate: string;
  entityType?: 'place';
}

export type TourismExperienceCategory =
  | 'marinha_mergulho'
  | 'safari_fauna'
  | 'cultural_historica'
  | 'aventura_trilha'
  | 'gastronomia_local';

export interface TourismExperience {
  id: string;
  title: string;
  category: TourismExperienceCategory;
  categoryLabel: string;
  photo: string;
  photos?: string[];
  placeName: string;
  city: string;
  district?: string;
  province: string;
  location?: string;
  duration: string;
  difficulty?: 'Fácil' | 'Moderado' | 'Aventureiro';
  shortDescription: string;
  fullDescription: string;
  includedItems: string[];
  activities?: string[];
  services?: string[];
  indicativePrice?: number;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  featured?: boolean;
  guideId?: string;
  guideName?: string;
  guideWhatsapp?: string;
  operatorName?: string;
  contactPhone?: string;
  contactEmail?: string;
  officialWebsite?: string;
  source: string;
  lastVerifiedDate: string;
  entityType?: 'experience';
}

export interface CarRental {
  id: string;
  model: string;
  brand: string;
  category: '4x4' | 'suv' | 'economico' | 'carrinha' | 'executivo';
  categoryLabel: string;
  photo: string;
  photos?: string[]; // Galeria de até 5 fotografias (frente, laterais, traseira, interior e bagageira)
  seats: number;
  transmission: 'Automático' | 'Manual';
  fuel: 'Gasóleo' | 'Gasolina';
  city: string;
  province: string;
  withDriverAvailable: boolean;
  ratePerDay?: number;
  depositAmount?: number; // Caução em MT
  plateNumber?: string; // Matrícula (ex: AB-123-MC)
  phone: string;
  whatsapp: string;
  verified: boolean;
  featured?: boolean;
  description: string;
  // Owner profile & fleet verification
  ownerId?: string;
  ownerName?: string;
  ownerBiNumber?: string;
  ownerBiPhoto?: string;
  ownerFacialVerified?: boolean;
  livretePhoto?: string; // Documento Livrete do veículo
  tituloPropriedadePhoto?: string; // Documento Título de Propriedade
  // Monetization & visibility per vehicle
  isActiveSubscription?: boolean; // Se a taxa mensal desta viatura está paga
  subscriptionExpiresAt?: string; // Data em que expira a mensalidade desta viatura
  monthlyFee?: number; // Taxa mensal (ex: 1000 MT)
  registeredAt?: string;
  platformTenure?: string;
  isContactUnlocked?: boolean;
}

export interface CarOwnerFleetAccount {
  ownerId: string;
  fullName: string;
  biNumber: string;
  biFrontPhoto?: string;
  biBackPhoto?: string;
  facialSelfiePhoto?: string;
  isFacialVerified: boolean;
  phone: string;
  whatsapp: string;
  city: string;
  province: string;
  verifiedAt: string;
  registeredAt?: string;
  platformTenure?: string;
  vehicles: CarRental[];
}

// Strictly restricted to two legitimate social objectives in compliance with Mozambican law:
// Amizade & Companheirismo | Matrimónio & Relacionamento Sério
export type HeartLinkIntention = 'amizade' | 'matrimonio';

export type ContactAvailabilityState = 'available' | 'limited_hours' | 'unavailable';

export interface ChannelAvailabilityConfig {
  state: ContactAvailabilityState; // 'available' | 'limited_hours' | 'unavailable'
  hours?: string; // Configured time range when limited (e.g. "08:00 - 18:00", "Seg-Sex, 09:00 - 17:00")
}

export interface ContactAvailability {
  whatsapp: ChannelAvailabilityConfig;
  phone: ChannelAvailabilityConfig;
  videoCall: ChannelAvailabilityConfig;
  generalHours?: string;
}

export interface HeartLinkProfile {
  id: string;
  name: string;
  age: number;
  gender: 'feminino' | 'masculino';
  photo: string;
  photos?: string[]; // 4 Photo slots (Slot 1: Foto Principal, Slot 2, Slot 3, Slot 4)
  video?: string; // 1 Video slot (Vídeo de Apresentação)
  videoDuration?: string;
  city: string;
  province: string;
  intentions: HeartLinkIntention[];
  verified?: boolean; // 🟢 Perfil Verificado (Selo após verificação de BI / Celular)
  isPremium?: boolean;
  isFeatured?: boolean;
  isVipExclusive?: boolean;
  isPubliclyVisible?: boolean; // Se o perfil está desbloqueado e visível na vitrine pública
  visibilityBadge?: string;    // Ex: "Passe 7 Dias", "Passe 24h", "Destaque VIP"
  visibilityExpiresAt?: string;
  bio: string;
  profession?: string;
  phone?: string;
  whatsapp?: string;
  availabilitySchedule?: string;
  contactAvailability?: ContactAvailability;
  preferredAccommodations?: string[];
  likesReceived?: number;
  isOnline?: boolean;
  registeredAt?: string;
  platformTenure?: string;
  isContactUnlocked?: boolean;
}

export interface HeartLinkUserAccount {
  isPremium: boolean;
  premiumExpiresAt?: string;
  isVerified: boolean;
  verifiedAt?: string;
  likedProfiles: string[];
  myProfile?: HeartLinkProfile;
}

export type VipPlanId = 'pass_24h' | 'pass_semana' | 'pass_mes' | 'premium_mensal' | 'verificacao_unica';

export interface VipSubscription {
  isUnlocked: boolean;
  isPremium?: boolean;
  isVerified?: boolean;
  planId?: string;
  planName?: string;
  unlockedAt?: string;
  phone?: string;
  paymentMethod?: 'mpesa' | 'emola';
}

export interface FilterState {
  searchQuery: string;
  type: AccommodationType | 'all';
  verifiedOnly: boolean;
  amenities: AmenityId[];
  sortBy: 'distance' | 'name' | 'verified' | 'rating' | 'price';
  city?: string;
  neighborhood?: string;
}
