export type AccommodationType = 
  | 'pensao' 
  | 'guest_house' 
  | 'hotel' 
  | 'lodge' 
  | 'residencial';

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
  | 'security'
  | 'bar'
  | 'hot_water';

export interface AmenityInfo {
  id: AmenityId;
  name: string;
  icon: string;
}

export type VerificationStatus = 'verified_in_person' | 'verified' | 'unverified' | 'pending';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface AccommodationLocation extends LocationCoordinates {
  address: string;
  neighborhood: string; // Bairro / Zona (ex: Polana, Sommerschield, Zimpeto, Bairro Central)
  city: string; // ex: Maputo, Matola, Beira, Nampula
  province: string; // ex: Maputo Cidade, Sofala, Inhambane, Nampula
  landmark?: string; // Ponto de referência útil em Moçambique
}

export interface IndicativePrice {
  approxMin?: number;
  approxMax?: number;
  currency: 'MZN';
  labelNote?: string;
}

export interface Accommodation {
  id: string;
  name: string;
  type: AccommodationType;
  tagline: string;
  description: string;
  location: AccommodationLocation;
  phone: string; // Formatado para chamada: ex: +258841234567
  whatsapp: string; // Para link do wa.me: ex: 258841234567
  amenities: AmenityId[];
  photos: string[];
  verificationStatus: VerificationStatus;
  verifiedAt?: string;
  priceEstimate?: IndicativePrice;
  distanceKm?: number;
  rating?: number; // ex: 4.5, 4.8
  reviewsCount?: number; // ex: 28
  isPremium?: boolean; // 👑 PREMIUM (Plano de destaque comercial)
  featured?: boolean; // ⭐ DESTAQUE
  isOpen24h?: boolean;
  notes?: string;
}

export interface UserLocationState {
  coords: LocationCoordinates | null;
  name: string;
  isCustom: boolean;
  isLoading: boolean;
  error?: string | null;
}

export type ActiveTab = 'home' | 'explore' | 'guides' | 'rentacar' | 'heartlink' | 'map' | 'saved' | 'account';

export interface TourGuide {
  id: string;
  name: string;
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
}

export interface CarRental {
  id: string;
  model: string;
  brand: string;
  category: '4x4' | 'suv' | 'economico' | 'carrinha' | 'executivo';
  categoryLabel: string;
  photo: string;
  seats: number;
  transmission: 'Automático' | 'Manual';
  fuel: 'Gasóleo' | 'Gasolina';
  city: string;
  province: string;
  withDriverAvailable: boolean;
  ratePerDay?: number;
  phone: string;
  whatsapp: string;
  verified: boolean;
  featured?: boolean;
  description: string;
}

export type HeartLinkIntention = 'encontro_intimo' | 'convivio_guesthouse' | 'relacionamento_discreto' | 'acompanhamento_vip' | 'namoro';

export interface HeartLinkProfile {
  id: string;
  name: string;
  age: number;
  gender: 'feminino' | 'masculino';
  photo: string;
  city: string;
  province: string;
  intentions: HeartLinkIntention[];
  verified?: boolean; // 🟢 Perfil Verificado (Selo após verificação de BI / Selfie / Celular)
  isPremium?: boolean; // 👑 HeartLink Premium (1.000 MT/mês)
  isFeatured?: boolean; // ⭐ Destaque no topo
  isVipExclusive?: boolean;
  bio: string;
  profession?: string;
  phone?: string;
  whatsapp?: string;
  encounterRate?: number; // Valor indicativo em MT
  rateNote?: string;
  availabilitySchedule?: string;
  preferredAccommodations?: string[];
  likesReceived?: number; // Quantidade de curtidas recebidas
  isOnline?: boolean;
}

export interface HeartLinkUserAccount {
  isPremium: boolean; // 1.000 MT/mês
  premiumExpiresAt?: string;
  isVerified: boolean; // 300 MT taxa única (BI + Selfie)
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
