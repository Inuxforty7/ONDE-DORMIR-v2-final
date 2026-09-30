export type AccommodationType = 'pensao' | 'hotel' | 'guest_house' | 'lodge' | 'residencial';

export type AmenityId = 
  | 'ac' 
  | 'wifi' 
  | 'parking' 
  | 'generator' 
  | 'private_bathroom' 
  | 'breakfast' 
  | 'restaurant' 
  | 'tv' 
  | 'pool' 
  | 'bar' 
  | 'hot_water' 
  | 'security';

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

export type ActiveTab = 'home' | 'explore' | 'guides' | 'rentacar' | 'heartlink' | 'loveshop' | 'map' | 'saved' | 'account';

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
  photo: string;
  photos?: string[];
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

export interface HeartLinkProfile {
  id: string;
  name: string;
  age: number;
  gender: 'feminino' | 'masculino';
  photo: string;
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
